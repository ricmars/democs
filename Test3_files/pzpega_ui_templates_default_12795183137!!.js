pega.ui.template.RDL = {

	addRow: function(dataSource, rowPage){
		if(pega.u.d.ServerProxy.isDestinationLocal()) 
		{
			var rowPageRef = pega.ui.ClientCache.find(rowPage);
			// If page not found, return
			if(!rowPageRef)
				return;
			var pageJSON = rowPageRef.getJSON();
			pega.ui.template.DataRepeater.add(dataSource, pageJSON);			
		}
		else 
		{
			pega.desktop.DataRepeater.add(dataSource, rowPage);
		}
	},

	removeRow: function(event){
		if(pega.u.d.ServerProxy.isDestinationLocal())
		{
			pega.ui.template.DataRepeater.remove(event);
		}
		else 
		{
			pega.desktop.DataRepeater.remove(event);			
		}
	}
};
//static-content-hash-trigger-GCC
pega.ui.controlMetadataMapper = (function(){
  
  var mapping = {};
  return {
    mapTemplatePage : function(name,page){
      mapping[name] = page;
    },
    getTemplatePage : function(name){
      return mapping[name];
    }
    
  }
  
  
})();

pega.DateTimeUtil = pega.DateTimeUtil || {};
pega.DateTimeUtil.convertDateTimeToGMT = function(dateValue,elem){
  var dt;
  var timezone = pega.u.d.TimeZone;
  var isDateRange = elem.hasAttribute("data-dateRange");
  if(isDateRange){
      dt = new Date(pega.u.d.wrapperProcessDate(dateValue, 0));
  } else{
      var divConfigAttrib = pega.control.eventParser.parseJSON(elem.getAttribute('data-calendar'));
      dt = new Date(pega.u.d.wrapperProcessDate(dateValue,divConfigAttrib.d[1]));
      var calendarInput = elem.querySelector("input[data-calendar]");
      if (calendarInput){
        var customTz = calendarInput.getAttribute("data-custom-timezone");
        if(customTz && moment.tz.zone(customTz)){
          timezone = customTz;
        }
      }
  }
  var mom = moment();
  mom.tz(timezone);
  mom.set('year',dt.getFullYear());
  mom.set('month',dt.getMonth());              
  mom.set('date',dt.getDate());
  mom.set('hour',dt.getHours());
  mom.set('minute',dt.getMinutes());
  mom.set('second',dt.getSeconds());
  mom.set('millisecond',dt.getMilliseconds());
  if(isDateRange){
    return mom.format("YYYYMMDD");
  } else{
    if(divConfigAttrib.d[1] == 1){   
      return mom.tz("Etc/GMT+0").format("YYYYMMDDTHHmmss.SSS z");
    } else if(divConfigAttrib.d[1] == 0){
      return mom.format("YYYYMMDD");
    } else if(divConfigAttrib.d[1] == 2){
      var hrs = mom.hour().toString().length == 2 ? mom.hour() : "0"+mom.hour();
      var mins = mom.minute().toString().length == 2 ? mom.minute() : "0"+mom.minute();
      var secs = "00";
      return ""+hrs+mins+secs;
    }
  }  
};

pega.ui.ControlTemplate = (function() {
    var XSSCharMapping = {
      "=": "&#61;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;",
      "%": "&#37;",
      ";": "&#59;",
      "(": "&#40;",
      ")": "&#41;",
      "+": "&#43;",
      "&": "&amp;"
  };

  return {
    crossScriptingFilter : function(strValue, escapeQuote) {
      var _newStrValue = "";
      //BUG-499082-Replace try...catch with if...else
      if(strValue && typeof strValue == "string") {
        for (var idx=0; idx < strValue.length; idx++) {
          var _charAtIdx = strValue[idx];
          if(typeof(XSSCharMapping[_charAtIdx]) != "undefined") {
            if((_charAtIdx == "\"" || _charAtIdx == "'") && escapeQuote) {
              _newStrValue += "&#92;" + XSSCharMapping[_charAtIdx];
            } else if((_charAtIdx == "+" && ((idx == 0) || (strValue[idx - 1] == 'e' || strValue[idx - 1] == 'E')))) {
              /* character '+' is ok if it is simply the sign (1st character), e.g. +1.5 */
              /* or value is double with exponent, e.g. 1.25e+5 */
              _newStrValue += _charAtIdx;
            } else {
              _newStrValue += XSSCharMapping[_charAtIdx];
            }
          } else {
            _newStrValue += _charAtIdx;
          }
        }
      } else {
        _newStrValue = strValue;
      }
      return _newStrValue;
    },
    filterRichText : function(strValue) {
      return strValue;
    },
    checkForScript : function(strValue, checkBoldTag) {
      if(!strValue) { return strValue; }
      if (strValue.toLowerCase().indexOf("<script>") != -1
          || strValue.toLowerCase().indexOf("<<include") != -1
          || strValue.toLowerCase().indexOf("<%") != -1
          || strValue.toLowerCase().indexOf("</") != -1
          || (checkBoldTag && strValue.toLowerCase().indexOf("<b>") != -1)) {
        strValue = this.crossScriptingFilter(strValue);
      } else {
        strValue = this.filterRichText(strValue);
      }
      return strValue;
    },
    resolveAndFetchPropertyValueFromJson: function(propertyReference,jsonResult){
      var propSplit = propertyReference.split(".");
      var propValue=jsonResult[propertyReference];
      if(propSplit && propSplit.length >= 1) {
        propValue = jsonResult;
        for(var propSplitIdx = 0; propSplitIdx < propSplit.length; propSplitIdx++) {
          var currentProp = propSplit[propSplitIdx];
                if(propValue && typeof propValue[currentProp] != 'undefined' && propValue[currentProp] != null) {
            propValue = propValue[currentProp];
          } else {
                    var propDetails = this.returnListOrGroupProp(currentProp, true);
                    if(propValue && propDetails != currentProp){
                        var index = propDetails.index;
                        var keyNew = propDetails.key;
                        if(index == 0){
                          if(propValue[keyNew] && propValue[keyNew].length == 0){
                            propValue = propValue[keyNew];
                          }else{
                            propValue = null;
                          }
                        }else if(!isNaN(index)){
                          index -= 1;
                          propValue = propValue[keyNew] ? propValue[keyNew][index] : propValue[keyNew];
                        }else{
                          propValue = propValue[keyNew] ? propValue[keyNew][index] : propValue[keyNew];
                        }
                    } else {
                        propValue = null;
                        break;
                    }
                }
        }
      }
      return propValue;
    },
    returnListOrGroupProp: function(propName, oneIndexed){
       var pattern = /\(([^)]+)\)/;
          var result =  propName.match(pattern);
          if(result){
            result = result[0];
            var index = result.substring(result.indexOf("(")+1,result.length-1);
            if(index){
              var keyNew = propName.substring(0, propName.indexOf("("));
              if(!isNaN(index)){
                if(!oneIndexed){
                  index -= 1;
                }
                return {"key":keyNew,"index":index,"type":"list"};
              }else{
                return {"key":keyNew,"index":index,"type":"group"};
              }
            }
        }
        return propName;
    }
  }
})();
//static-content-hash-trigger-GCC
pega.ui.template.RenderingEngine.register("pxNonTemplate", function(componentInfo) {
    var docFrag = pega.ui.template.RenderingEngine.getCurrentDocument();
    var nonTemplateObj = componentInfo;
    var nonT;
    var domHtml = "";
	var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS; 

    //var nonTemplateId = nonTemplateObj.pyNonTemplateID;
	var nonTemplateId = nonTemplateObj[TEMPLATE_CONSTANTS.PYNONTEMPLATEID];
    if (nonTemplateId) {
        nonT = $(docFrag).find("#" + nonTemplateId);

        if (nonT.length > 0) {
            pega.ui.TemplateEngine.renderChildren(componentInfo, nonT[0]);

            // Pick all sibling scripts of pxNonTemplate and adopt them
            var nonTParent = nonT[0].parentNode;
            var scripts = nonTParent.querySelectorAll("[id='" + nonTemplateId + "'] + script");
            for (var i = 0; i < scripts.length; i++) {
                nonT[0].appendChild(scripts[i]);
            }

            domHtml = nonT.html();
            domHtml = pega.ui.TemplateEngine.resolveDataTokens(domHtml);

            if (docFrag === document) {
                nonT.remove();
            }
        }
    }
    return domHtml;
});


pega.ui.template.RenderingEngine.register("pxVisible", function(componentInfo) {
    return pega.ui.TemplateEngine.renderChildren(componentInfo);
});
//static-content-hash-trigger-GCC
/*Section Handlebar-starts */
/*
{{#if isAdvParamSection}} <input type='hidden' id='PEGAGADGET'> {{/if}}
{{#if pyExpressionIdMeta}}<div {{pyExpressionIdMeta}} {{#if pyHide}}style="display:none;"{{/if}}>{{/if}}
<div {{#if inspectorData}}data-ui-meta='{{inspectorData}}'{{/if}}
{{#if pyFullPath}}data-fullpath='{{pyFullPath}}'{{/if}} 
{{getTemplateMarker}} {{{secActionString}}}
node_name='{{sectionName}}' 
node_type='MAIN_RULE' 
name='BASE_REF' 
id='RULE_KEY' 
class='sectionDivStyle {{hasActionClass}} {{RWClasses}}'
style='{{pyInlineStyleSec}}'
base_ref='{{sectionBaseRef}}' 
{{#if repeatingLevelContext}}data-repeat-level='{{repeatingLevelContext}}'{{/if}} 
data-node-id='{{sectionName}}' 
version='{{version}}' 
objclass='{{objclass}}' 
pyclassname='{{pyclassname}}' 
{{#if secPostValueURL}}data-postvalue-url='{{secPostValueURL}}'{{/if}}
{{#if secParamsString}}data-params='{{secParamsString}}'{{/if}}
{{#if readonly}}readonly='{{readonly}}'{{/if}}
expandRL='{{expandRL}}' 
INDEX='{{index}}' 
{{#if dataOfflineClasskey}}data-offline-classkey='{{dataOfflineClasskey}}'{{/if}} 
{{#if outerGadget}}outerGadget='{{outerGadget}}'{{/if}} {{#if dataParamHash}}data-param-hash='{{dataParamHash}}'{{/if}} 
{{#if isAdvParamSection}} isAdvParamSection = '{{isAdvParamSection}}' containedSectionID='{{outerGadget}}'{{/if}}
uniqueID='{{uniqueID}}' 
{{#if declareParams}}data-declare-params='{{declareParams}}' 
  {{#if dataDeclarePage}}data-declarepage='{{dataDeclarePage}}'{{/if}}
{{/if}}>
  {{#each pyTemplates}}
    {{{renderChildren this}}}
  {{/each}}
</div>
{{#if pyExpressionIdMeta}}</div>{{/if}}
*/
/* Section Handlebar ends*/

/* Inspector Handlebar starts*/
/*
<span class='inspector-span' {{getTemplateMarker}}  {{#if pzInspectordata}}{{{pzInspectordata}}}{{/if}}>
  {{#each pyTemplates}}
    {{{renderChildren this}}}
  {{/each}}
</span>
*/
/* Inspector Handlebar ends */

/* Container Handlebar starts*/
/*
{{#if isLazyLoadContent}}  
  <div id="lazyContent">  
{{else}}  
  <div id="{{lazyLoadDivIdSaveValue}}" style="display:block">  
{{/if}}  
  {{#each pyTemplates}}  
    {{{renderChildren this}}}  
  {{/each}}  
</div>
*/
/* Container Handlebar ends */

/* Placeholder Handlebar starts*/
/*
{{#each pyTemplates}}
    {{{renderChildren this}}}
{{/each}}
*/
/* Placeholder Handlebar ends*/

/* Section Handlebar Starts */
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
templates['sectiontemplate'] = template({"1":function(container,depth0,helpers,partials,data) {
    return " <input type='hidden' id='PEGAGADGET'> ";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyExpressionIdMeta") || (depth0 != null ? lookupProperty(depth0,"pyExpressionIdMeta") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyExpressionIdMeta","hash":{},"data":data,"loc":{"start":{"line":2,"column":31},"end":{"line":2,"column":53}}}) : helper)))
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyHide") : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":54},"end":{"line":2,"column":96}}})) != null ? stack1 : "")
    + ">";
},"4":function(container,depth0,helpers,partials,data) {
    return "style=\"display:none;\"";
},"6":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "data-ui-meta='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"inspectorData") || (depth0 != null ? lookupProperty(depth0,"inspectorData") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"inspectorData","hash":{},"data":data,"loc":{"start":{"line":3,"column":40},"end":{"line":3,"column":57}}}) : helper)))
    + "'";
},"8":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "data-fullpath='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyFullPath") || (depth0 != null ? lookupProperty(depth0,"pyFullPath") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyFullPath","hash":{},"data":data,"loc":{"start":{"line":4,"column":33},"end":{"line":4,"column":47}}}) : helper)))
    + "'";
},"10":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "data-repeat-level='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"repeatingLevelContext") || (depth0 != null ? lookupProperty(depth0,"repeatingLevelContext") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"repeatingLevelContext","hash":{},"data":data,"loc":{"start":{"line":13,"column":48},"end":{"line":13,"column":73}}}) : helper)))
    + "'";
},"12":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "data-postvalue-url='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"secPostValueURL") || (depth0 != null ? lookupProperty(depth0,"secPostValueURL") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"secPostValueURL","hash":{},"data":data,"loc":{"start":{"line":18,"column":43},"end":{"line":18,"column":62}}}) : helper)))
    + "'";
},"14":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "data-params='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"secParamsString") || (depth0 != null ? lookupProperty(depth0,"secParamsString") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"secParamsString","hash":{},"data":data,"loc":{"start":{"line":19,"column":36},"end":{"line":19,"column":55}}}) : helper)))
    + "'";
},"16":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "readonly='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"readonly") || (depth0 != null ? lookupProperty(depth0,"readonly") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"readonly","hash":{},"data":data,"loc":{"start":{"line":20,"column":26},"end":{"line":20,"column":38}}}) : helper)))
    + "'";
},"18":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "data-offline-classkey='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"dataOfflineClasskey") || (depth0 != null ? lookupProperty(depth0,"dataOfflineClasskey") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"dataOfflineClasskey","hash":{},"data":data,"loc":{"start":{"line":23,"column":50},"end":{"line":23,"column":73}}}) : helper)))
    + "'";
},"20":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "outerGadget='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"outerGadget") || (depth0 != null ? lookupProperty(depth0,"outerGadget") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"outerGadget","hash":{},"data":data,"loc":{"start":{"line":24,"column":32},"end":{"line":24,"column":47}}}) : helper)))
    + "'";
},"22":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "data-param-hash='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"dataParamHash") || (depth0 != null ? lookupProperty(depth0,"dataParamHash") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"dataParamHash","hash":{},"data":data,"loc":{"start":{"line":24,"column":94},"end":{"line":24,"column":111}}}) : helper)))
    + "'";
},"24":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " isAdvParamSection = '"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"isAdvParamSection") || (depth0 != null ? lookupProperty(depth0,"isAdvParamSection") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"isAdvParamSection","hash":{},"data":data,"loc":{"start":{"line":25,"column":47},"end":{"line":25,"column":68}}}) : helper)))
    + "' containedSectionID='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"outerGadget") || (depth0 != null ? lookupProperty(depth0,"outerGadget") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"outerGadget","hash":{},"data":data,"loc":{"start":{"line":25,"column":90},"end":{"line":25,"column":105}}}) : helper)))
    + "'";
},"26":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "data-declare-params='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"declareParams") || (depth0 != null ? lookupProperty(depth0,"declareParams") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"declareParams","hash":{},"data":data,"loc":{"start":{"line":27,"column":42},"end":{"line":27,"column":59}}}) : helper)))
    + "' \n  "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"dataDeclarePage") : depth0),{"name":"if","hash":{},"fn":container.program(27, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":28,"column":2},"end":{"line":28,"column":70}}})) != null ? stack1 : "")
    + "\n";
},"27":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "data-declarepage='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"dataDeclarePage") || (depth0 != null ? lookupProperty(depth0,"dataDeclarePage") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"dataDeclarePage","hash":{},"data":data,"loc":{"start":{"line":28,"column":43},"end":{"line":28,"column":62}}}) : helper)))
    + "'";
},"29":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    "
    + ((stack1 = (lookupProperty(helpers,"renderChildren")||(depth0 && lookupProperty(depth0,"renderChildren"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"renderChildren","hash":{},"data":data,"loc":{"start":{"line":31,"column":4},"end":{"line":31,"column":29}}})) != null ? stack1 : "")
    + "\n";
},"31":function(container,depth0,helpers,partials,data) {
    return "</div>";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isAdvParamSection") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":71}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyExpressionIdMeta") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":0},"end":{"line":2,"column":104}}})) != null ? stack1 : "")
    + "\n<div "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"inspectorData") : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":5},"end":{"line":3,"column":65}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyFullPath") : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":0},"end":{"line":4,"column":55}}})) != null ? stack1 : "")
    + " \n"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"getTemplateMarker") || (depth0 != null ? lookupProperty(depth0,"getTemplateMarker") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"getTemplateMarker","hash":{},"data":data,"loc":{"start":{"line":5,"column":0},"end":{"line":5,"column":21}}}) : helper)))
    + " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"secActionString") || (depth0 != null ? lookupProperty(depth0,"secActionString") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"secActionString","hash":{},"data":data,"loc":{"start":{"line":5,"column":22},"end":{"line":5,"column":43}}}) : helper))) != null ? stack1 : "")
    + "\nnode_name='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"sectionName") || (depth0 != null ? lookupProperty(depth0,"sectionName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"sectionName","hash":{},"data":data,"loc":{"start":{"line":6,"column":11},"end":{"line":6,"column":26}}}) : helper)))
    + "' \nnode_type='MAIN_RULE' \nname='BASE_REF' \nid='RULE_KEY' \nclass='sectionDivStyle "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"hasActionClass") || (depth0 != null ? lookupProperty(depth0,"hasActionClass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"hasActionClass","hash":{},"data":data,"loc":{"start":{"line":10,"column":23},"end":{"line":10,"column":41}}}) : helper)))
    + " "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"RWClasses") || (depth0 != null ? lookupProperty(depth0,"RWClasses") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"RWClasses","hash":{},"data":data,"loc":{"start":{"line":10,"column":42},"end":{"line":10,"column":55}}}) : helper)))
    + "'\nstyle='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyInlineStyleSec") || (depth0 != null ? lookupProperty(depth0,"pyInlineStyleSec") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyInlineStyleSec","hash":{},"data":data,"loc":{"start":{"line":11,"column":7},"end":{"line":11,"column":27}}}) : helper)))
    + "'\nbase_ref='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"sectionBaseRef") || (depth0 != null ? lookupProperty(depth0,"sectionBaseRef") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"sectionBaseRef","hash":{},"data":data,"loc":{"start":{"line":12,"column":10},"end":{"line":12,"column":28}}}) : helper)))
    + "' \n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"repeatingLevelContext") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":13,"column":0},"end":{"line":13,"column":81}}})) != null ? stack1 : "")
    + " \ndata-node-id='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"sectionName") || (depth0 != null ? lookupProperty(depth0,"sectionName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"sectionName","hash":{},"data":data,"loc":{"start":{"line":14,"column":14},"end":{"line":14,"column":29}}}) : helper)))
    + "' \nversion='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"version") || (depth0 != null ? lookupProperty(depth0,"version") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"version","hash":{},"data":data,"loc":{"start":{"line":15,"column":9},"end":{"line":15,"column":20}}}) : helper)))
    + "' \nobjclass='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"objclass") || (depth0 != null ? lookupProperty(depth0,"objclass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"objclass","hash":{},"data":data,"loc":{"start":{"line":16,"column":10},"end":{"line":16,"column":22}}}) : helper)))
    + "' \npyclassname='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyclassname") || (depth0 != null ? lookupProperty(depth0,"pyclassname") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyclassname","hash":{},"data":data,"loc":{"start":{"line":17,"column":13},"end":{"line":17,"column":28}}}) : helper)))
    + "' \n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"secPostValueURL") : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":18,"column":0},"end":{"line":18,"column":70}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"secParamsString") : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":19,"column":0},"end":{"line":19,"column":63}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"readonly") : depth0),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":20,"column":0},"end":{"line":20,"column":46}}})) != null ? stack1 : "")
    + "\nexpandRL='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"expandRL") || (depth0 != null ? lookupProperty(depth0,"expandRL") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"expandRL","hash":{},"data":data,"loc":{"start":{"line":21,"column":10},"end":{"line":21,"column":22}}}) : helper)))
    + "' \nINDEX='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"index") || (depth0 != null ? lookupProperty(depth0,"index") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"index","hash":{},"data":data,"loc":{"start":{"line":22,"column":7},"end":{"line":22,"column":16}}}) : helper)))
    + "' \n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"dataOfflineClasskey") : depth0),{"name":"if","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":23,"column":0},"end":{"line":23,"column":81}}})) != null ? stack1 : "")
    + " \n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"outerGadget") : depth0),{"name":"if","hash":{},"fn":container.program(20, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":24,"column":0},"end":{"line":24,"column":55}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"dataParamHash") : depth0),{"name":"if","hash":{},"fn":container.program(22, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":24,"column":56},"end":{"line":24,"column":119}}})) != null ? stack1 : "")
    + " \n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isAdvParamSection") : depth0),{"name":"if","hash":{},"fn":container.program(24, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":25,"column":0},"end":{"line":25,"column":113}}})) != null ? stack1 : "")
    + "\nuniqueID='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"uniqueID") || (depth0 != null ? lookupProperty(depth0,"uniqueID") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"uniqueID","hash":{},"data":data,"loc":{"start":{"line":26,"column":10},"end":{"line":26,"column":22}}}) : helper)))
    + "' \n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"declareParams") : depth0),{"name":"if","hash":{},"fn":container.program(26, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":27,"column":0},"end":{"line":29,"column":7}}})) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyTemplates") : depth0),{"name":"each","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":30,"column":2},"end":{"line":32,"column":11}}})) != null ? stack1 : "")
    + "</div>\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyExpressionIdMeta") : depth0),{"name":"if","hash":{},"fn":container.program(31, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":34,"column":0},"end":{"line":34,"column":39}}})) != null ? stack1 : "");
},"useData":true});
})();
/* Section Handlebar ends */

/******/

/*INspector span handlebar*/
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
templates['inspectorTemplate'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = ((helper = (helper = lookupProperty(helpers,"pzInspectordata") || (depth0 != null ? lookupProperty(depth0,"pzInspectordata") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pzInspectordata","hash":{},"data":data,"loc":{"start":{"line":1,"column":75},"end":{"line":1,"column":96}}}) : helper))) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    "
    + ((stack1 = (lookupProperty(helpers,"renderChildren")||(depth0 && lookupProperty(depth0,"renderChildren"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"renderChildren","hash":{},"data":data,"loc":{"start":{"line":3,"column":4},"end":{"line":3,"column":29}}})) != null ? stack1 : "")
    + "\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class='inspector-span' "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"getTemplateMarker") || (depth0 != null ? lookupProperty(depth0,"getTemplateMarker") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"getTemplateMarker","hash":{},"data":data,"loc":{"start":{"line":1,"column":29},"end":{"line":1,"column":50}}}) : helper)))
    + "  "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pzInspectordata") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":52},"end":{"line":1,"column":103}}})) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyTemplates") : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":2},"end":{"line":4,"column":11}}})) != null ? stack1 : "")
    + "</span>";
},"useData":true});
})();
/*Inspector span handlebar ends*/

/* Container template starts*/
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
templates['containerTemplate'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "  <div id=\"lazyContent\">  \n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  <div id=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"lazyLoadDivIdSaveValue") || (depth0 != null ? lookupProperty(depth0,"lazyLoadDivIdSaveValue") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"lazyLoadDivIdSaveValue","hash":{},"data":data,"loc":{"start":{"line":4,"column":11},"end":{"line":4,"column":37}}}) : helper)))
    + "\" style=\"display:block\">  \n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    "
    + ((stack1 = (lookupProperty(helpers,"renderChildren")||(depth0 && lookupProperty(depth0,"renderChildren"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"renderChildren","hash":{},"data":data,"loc":{"start":{"line":7,"column":4},"end":{"line":7,"column":29}}})) != null ? stack1 : "")
    + "  \n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isLazyLoadContent") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":5,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyTemplates") : depth0),{"name":"each","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":2},"end":{"line":8,"column":11}}})) != null ? stack1 : "")
    + "</div>";
},"useData":true});
})();
/* Container templates ends */

/* Placeholder template starts*/
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
templates['placeholderTemplate'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    "
    + ((stack1 = (lookupProperty(helpers,"renderChildren")||(depth0 && lookupProperty(depth0,"renderChildren"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"renderChildren","hash":{},"data":data,"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":29}}})) != null ? stack1 : "")
    + "\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyTemplates") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":3,"column":9}}})) != null ? stack1 : "");
},"useData":true});
})();
/* Placeholder templates ends */

pega.ui.template.RenderingEngine.register("pxSection", function (componentInfo) {
    var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
    componentInfo["readonly"] = componentInfo["pxReadOnly"];
    if(pega.u.d.ServerProxy.isDestinationLocal() && !componentInfo["pxReadOnly"]){
      componentInfo["readonly"] = componentInfo["RO"];
    }
    componentInfo["sectionName"] = componentInfo[TEMPLATE_CONSTANTS.SECTIONNAME];
  
    componentInfo["inspectorData"] = componentInfo[TEMPLATE_CONSTANTS.PYINSPECTORDATA];
    componentInfo["pyclassname"] = componentInfo[TEMPLATE_CONSTANTS.PYCUSTOMCLASS];
    componentInfo["sectionBaseRef"] = componentInfo[TEMPLATE_CONSTANTS.BASEREF];
    componentInfo["expandRL"] = componentInfo[TEMPLATE_CONSTANTS.EXPANDRL];
    componentInfo["index"] = componentInfo[TEMPLATE_CONSTANTS.INDEX];
    componentInfo["uniqueID"] = componentInfo[TEMPLATE_CONSTANTS.UNIQUEID];
    componentInfo["dataOfflineClasskey"] = componentInfo[TEMPLATE_CONSTANTS.DATAOFFLINECLASSKEY];
    componentInfo["outerGadget"] = componentInfo[TEMPLATE_CONSTANTS.OUTERGADGET];
    componentInfo["dataParamHash"] = componentInfo[TEMPLATE_CONSTANTS.DATAPARAMHASH];
    componentInfo["RWClasses"] = componentInfo[TEMPLATE_CONSTANTS.RWCLASSES];
    //componentInfo["hasActionClass"] = componentInfo[hasActionClass];
    componentInfo["pyInlineStyleSec"] = componentInfo[TEMPLATE_CONSTANTS.INLINESTYLE];
    componentInfo["version"] = componentInfo[TEMPLATE_CONSTANTS.VERSION];
    componentInfo["objclass"] = componentInfo[TEMPLATE_CONSTANTS.OBJCLASS];
    componentInfo["declareParams"] = componentInfo[TEMPLATE_CONSTANTS.DECPARAMS];
    componentInfo["dataDeclarePage"] = componentInfo[TEMPLATE_CONSTANTS.DECPAGE];
    componentInfo["pyExpressionId"] = componentInfo[TEMPLATE_CONSTANTS.EXPRID];
    componentInfo["secPostValueURL"] = componentInfo[TEMPLATE_CONSTANTS.SECPOSTVALUEURL];
  
    if(componentInfo["sectionParams"]!=null || componentInfo["sectionParams"]!=undefined){
       componentInfo["sectionParams"] = componentInfo["sectionParams"].replace(/\\\"/g,"");
    }
    componentInfo["secParamsString"] = pega.ui.TemplateEngine.ContextObject.replaceActionStringTokens(componentInfo["sectionParams"]);
    pega.ui.logger.LogHelper.debug("Rendering pxSection, template location : " + componentInfo.refId);
    var secObj = { "action": "push", "uniqueID": componentInfo["uniqueID"] };
    pega.u.template.utility.addSectionInfo(secObj);

    if(componentInfo.AdvParamSection == "true") {
      componentInfo["isAdvParamSection"] = "true";
      componentInfo["containedSectionID"] = componentInfo["outerGadget"];
    }
  
    // Push context
    var currentContext = pega.ui.TemplateEngine.getCurrentContext();
  
    //action support on section include  
    componentInfo.secActionString = currentContext.getActionString(componentInfo["secActionStringID"]);
    // The below line replacing the ^~ with #~, added this line for backward compatibility, it should be removed with proper investigation.
    if(typeof(componentInfo.secActionString) === "string") {
        componentInfo.secActionString = componentInfo.secActionString.replace(/(#|\^)~([a-z.0-9_()$]+)~(#|\^)/gi, function(){
               return "#~"+arguments[2]+"~#";         
          });
    }
    // Get repeat info
    var repeatingParentInfo = currentContext.getRepeatingParentInfo();
    if (repeatingParentInfo.component == "RepeatingDynamicLayout" && repeatingParentInfo.index) {
        componentInfo.index = repeatingParentInfo.index;
    }
    else if(repeatingParentInfo.component == "pxTimeline") {
      componentInfo["pxReadOnly"] = repeatingParentInfo.pxReadOnly;
    }
  
    var primaryPage = componentInfo["pzPrimaryPage"];
  //  BUG-322779: Use page defined by property
    if(primaryPage && primaryPage.indexOf(".") == 0) {
    var newPage = currentContext.getPropertyValue(primaryPage);
        if(newPage && typeof newPage == "string") {
          primaryPage = newPage;
          componentInfo["sectionBaseRef"] = primaryPage;
        }
    }
  
    var pxReadOnly = componentInfo["pxReadOnly"];
    if(pega.u.d.ServerProxy.isDestinationLocal() && !componentInfo["pxReadOnly"]){
      pxReadOnly = componentInfo["RO"];
    }
    // pushStackFrame logic - store section context for localization
    /* BUG-330666: (HFix-37864) Use the currentContext reference if the primarypage is empty. */
    var offlinePrimaryPage = primaryPage || currentContext.getReference();
    if (offlinePrimaryPage.startsWith(".")) {
        // Augment parent context
        offlinePrimaryPage = currentContext.getReference() + primaryPage;
    }
    if (offlinePrimaryPage)
        pega.pushStackFrame("PrimaryPage", pega.clientTools.find(offlinePrimaryPage, { doNotTrack: true }));

    if (primaryPage || pxReadOnly)
        currentContext.push(primaryPage, pxReadOnly);


    var repeatingLevelContext = pega.ui.TemplateEngine.getRepeatingDepthForExpression();
    componentInfo.repeatingLevelContext = repeatingLevelContext;

    // Populate expression data
  var sectionObj = {};
  sectionObj.uniqueID = componentInfo.uniqueID;
  sectionObj.sectionName = componentInfo["sectionName"];
  pega.ui.ExpressionEvaluator.pushSectionInfo(sectionObj);
    if (componentInfo["pyExpressionId"]) {
        componentInfo.pyExpressionIdMeta = pega.ui.ExpressionEvaluator.getExpressionMetaToStamp(componentInfo["pyExpressionId"]);
        var expressionResult = pega.ui.ExpressionEvaluator.evaluateClientExpressions(componentInfo["pyExpressionId"]);
        var show_when = expressionResult && expressionResult[pega.ui.ExpressionEvaluator.SHOW_WHEN];
        componentInfo.pyHide = typeof show_when == 'undefined' ? false : !show_when;
    }
    // TODO: Duplicate code
    componentInfo["readonly"] = componentInfo["pxReadOnly"];
    if(pega.u.d.ServerProxy.isDestinationLocal() && !componentInfo["pxReadOnly"]){
      componentInfo["readonly"] = componentInfo["RO"];
    }
    var resolvedClass = componentInfo["RWClasses"];
    if (componentInfo["readonly"] == "true") {
        componentInfo["RWClasses"] = componentInfo["roclass"];
    } else {
        componentInfo["RWClasses"] = componentInfo["rwclass"];
    }
    if (!componentInfo["RWClasses"]) {
        componentInfo["RWClasses"] = resolvedClass;
    }
    // The actual section execution
    var sectionMarkup = pega.ui.TemplateEngine.execute('sectiontemplate', componentInfo);

  pega.ui.ExpressionEvaluator.popSectionInfo();

    // Pop context
    // pop current primary context - localization
    if (offlinePrimaryPage)
        pega.popStackFrame("PrimaryPage");
    if (primaryPage || pxReadOnly)
        currentContext.pop();
    secObj = { "action": "pop" };
    pega.u.template.utility.addSectionInfo(secObj);
    return sectionMarkup;
});

pega.ui.template.RenderingEngine.register("pxInspector", function (componentInfo) {
    //var inspectorObj = pega.ui.TemplateEngine.mergeDefaults(componentInfo,true);
    //inspectorObj.refId = componentInfo.templatePage._ref;
    pega.ui.logger.LogHelper.debug("Rendering pxInspector, template location : " + componentInfo.refId);
    return pega.ui.TemplateEngine.execute('inspectorTemplate', componentInfo);

});

pega.ui.template.RenderingEngine.register("pxContainer", function (componentInfo) {
    //var containerObj = pega.ui.TemplateEngine.mergeDefaults(componentInfo,true);  
    //containerObj.refId = componentInfo.templatePage._ref;  
    pega.ui.logger.LogHelper.debug("Rendering pxContainer, template location : " + componentInfo.refId);
    return pega.ui.TemplateEngine.execute('containerTemplate', componentInfo);

});

pega.ui.template.RenderingEngine.register("Placeholder", function (componentInfo) {
    //var placeholderObj = pega.ui.TemplateEngine.mergeDefaults(componentInfo,true);
    //placeholderObj.refId = componentInfo.templatePage._ref;
    pega.ui.logger.LogHelper.debug("Rendering Placeholder, template location : " + componentInfo.refId);
    return pega.ui.TemplateEngine.execute('placeholderTemplate', componentInfo);

});
//static-content-hash-trigger-GCC

;(function(p){
	if (!p.control) {
		p.c = p.namespace("pega.control");
	} else {
		p.c = p.control;
	}
	if (!p.c.templates) {
	   p.c.t = p.namespace("pega.control.templates");		
	} else {
	   p.c.t = p.c.templates;				
	}	
	var events = ['data-click','data-dblclick','data-rightclick','data-focus','data-blur','data-keypress','data-keyup','data-keydown','data-msdwn','data-paste','data-cut','data-change','validationtype','onchange','onclick'];
	var prevgroupby;
	function getBehaviorString(node){
		var ret = '';
		for(var i=0;i<events.length;i++){
			var str = node.getAttribute(events[i]);			
			if(str) {
				/* added extra parsing and stringfying json to avoid extra spaces inside json string
				which causing issues while creating markup from template*/
				if (events[i].indexOf("data-") > -1) {
					try {
						var jsonObj = JSON.parse(str);
						if (jsonObj) {
							str = JSON.stringify(jsonObj);
						}
					} catch(e) {}
				}
				ret += ' '+events[i]+"="+str;
			}
		}
		return ret;	
	}							
	p.c.t.processControlTemplates = function(dom){
		if(typeof(Handlebars)!="undefined" && Handlebars){
			if (Handlebars.helpers && !Handlebars.helpers.ctrl_getValue) {
				Handlebars.registerHelper('ctrl_getValue', function(rowdata, index) {
						return rowdata[index];
				});
			}
			if (Handlebars.helpers && !Handlebars.helpers.ctrl_ifequals) {
				Handlebars.registerHelper('ctrl_ifequals', function(val1,val2,options) {										
						if (val1 == val2)
						return options.fn(this);
					else
						return options.inverse(this);
				});	
			}
			if (Handlebars.helpers && !Handlebars.helpers.ctrl_groupby) {
				Handlebars.registerHelper('ctrl_groupby', function(index,options) {
						if(prevgroupby != this[index]){
						prevgroupby = this[index];
						return options.fn(this);
					}
				});
			}
			var controlObjs = $("div.data-control-template", dom);
			if (controlObjs) {
				for (var idx = 0; idx < controlObjs.length; idx++) {
					var controlObj = controlObjs[idx];
					var template = null;
					var templateName = controlObj.getAttribute("data-template-name");
					if (templateName) {
						template = Handlebars.partials[templateName];
					}
					if (template) {
						var dataJSON = controlObj.getAttribute("data-context");
						try {
							if (dataJSON && typeof(dataJSON) === "string" && dataJSON != "") {
								var context = JSON.parse(dataJSON);
								context.behaviors = getBehaviorString(controlObj);
								if(pega && pega.offline && pega.offline.NetworkStatus && pega.u && pega.u.d && pega.u.d.ServerProxy && pega.u.d.ServerProxy.isDestinationLocal()){
									pega.offline.NetworkStatus.isOnline(function(isOnline) {
										var isOptionsLoaded = false;
										if (!isOnline) {
											context.data = [];
											if (context.pySourceName) {
												isOptionsLoaded = true;
												window.pega.offline.DataBinding.findPageList(context.pySourceName,function(pageList){
													pageList.getAllItems(function(items){
															var captionProp = context.pyCaptionProp.split(".")[1];
															var valueProp = context.pyValueProp.split(".")[1];
															var tooltipProp = context.pyTooltipProp?context.pyTooltipProp.split(".")[1]:"";														
															for (var i = 0; i < items.length; i++) {
																var obj = items[i];
																if(tooltipProp==""){
																	context.data.push({
																		"cp":obj[captionProp],
																		"vp":obj[valueProp]
																	});
																}
																else{
																	context.data.push({
																		"cp":obj[captionProp],
																		"vp":obj[valueProp],
																		"tp":obj[tooltipProp]
																	});
																}
															}
															prevgroupby = undefined;
															var html = template(context);
															controlObj.parentNode.innerHTML = html;													
														},
														function(err){
															console.log("No pagelist items");
														});
													},
													function(e,msg){
														console.log("no pagelist");
													});
											}
										}

										if (!isOptionsLoaded) {
											/* collect data from inner html */
											try {											
												dataJSON = controlObj.innerHTML;
												dataJSON = dataJSON.replace(/^\s+|\s+$/gm, '');
												context.data = JSON.parse(dataJSON);
												prevgroupby = undefined;
												var html = template(context);
												controlObj.parentNode.innerHTML = html;									
											} catch(e) { /* alert("options data parsing error"); */ }
										}
									});
								} else {
									/* collect data from inner html */
									try {									
										dataJSON = controlObj.innerHTML;
										dataJSON = dataJSON.replace(/^\s+|\s+$/gm, '');
										context.data = JSON.parse(dataJSON);
										prevgroupby = undefined;
										var html = template(context);
										controlObj.parentNode.innerHTML = html;									
									} catch(e) { /* alert("options data parsing error"); */ }
								}

							}
						} catch(e) { controlObj.parentNode.innerHTML = '<div>'+e.message+'</div>'; }					
					}
				}
			}
		}
			
	}
    if (document.readyState === "complete" || document.readyState === "loaded" || document.readyState === "interactive") {
      // document has at least been parsed
      p.c.t.processControlTemplates(document);
    } else {
      $(document).ready(function(){
        p.c.t.processControlTemplates(document);
      });
    }
	


})(pega);
//static-content-hash-trigger-GCC
/*
{{#if isDeferloadedSectionExpanded}}
  <div  class='lazyload-layout' {{#if containerOuter.isADP}} data-isadp="{{containerOuter.isADP}}" {{/if}}  {{#if containerOuter.isAssociateRequestor}} data-isassociaterequestor="{{containerOuter.isAssociateRequestor}}" {{/if}} {{#if containerOuter.pyDPParams}} data-pydpparams="{{containerOuter.pyDPParams}}" {{/if}} {{#if containerOuter.pyUsingPage}} data-pyusingpage="{{containerOuter.pyUsingPage}}" {{/if}} {{#if containerOuter.pyDPScope}} data-pydpscope="{{containerOuter.pyDPScope}}" {{/if}} {{#if containerOuter.pySectionId}} data-pysectionid="{{containerOuter.pySectionId}}" {{/if}} {{#if containerOuter.adpParameterPage}} data-adpparameterpage="{{containerOuter.adpParameterPage}}" {{/if}} data-deferinvoke="{{containerOuter.layoutMethodName}}" {{#if pxParamPage}}data-parampage="{{pxParamPage}}"{{/if}}>
{{/if}}
  {{#if bSectionInclude}}
  {{~#unless pyDLChild~}}
   <span class="inspector-span" {{getTemplateMarker}} {{#if bInspectorSpanMetaData}} {{inspectorSpanDataUIMeta}} {{/if}} {{#unless bIncludeContainer}} {{pyExpressionIdMeta}} {{#if pyHide}}style="display:none;"{{/if}}{{/unless}}>
  {{~/unless~}}
  {{/if}}
    {{#if bIncludeContainer}}
    {{~#unless pyLGChild~}}
        <{{#if_not_eq containerOuter.headerType "OUTLINE"}}div{{else}}fieldset{{/if_not_eq}} {{getTemplateMarker}} class="{{containerOuter.className}}" {{{dynamicAttributesGen containerOuter.dynamicAttributes}}} {{#if containerOuter.dataTourId}} data-tour-id={{containerOuter.dataTourId}} {{/if}} {{pyExpressionIdMeta}} {{#if pyHide}}style="display:none;"{{/if}} {{#ifCond pyAutomationID '!=' "" }} data-test-id="{{pyAutomationID}}" {{/ifCond}} data-layout-id="{{pyUniqueID}}">
      {{~/unless~}}
        {{!-- Header will come here --}}
        {{{headerMarkup}}}{{#if_not_eq isOnlyHeader "true"}}{{#if_not_eq containerOuter.headerType "OUTLINE"}}<div {{#if_eq containerOuter.headerType "COLLAPSIBLE"}} id="{{containerInner.innerDivId}}" {{/if_eq}} {{containerInner.pyExpressionIdMeta}} {{#if containerInner.pyHide}}style="display:none;"{{/if}} section_index="{{containerInner.sectionIndex}}" class="{{containerInner.className}} {{containerInner.containerStyle}} {{#if bCollapsedDeferLoad}}{{#ifCond containerOuter.headerType '!=' "COLLAPSIBLE"}}{{#ifCond isActiveLayout '==' false }}{{else}} lazyload-layout{{/ifCond}}{{/ifCond}}{{/if}}" {{#if bCollapsedDeferLoad}} data-deferinvoke="{{containerOuter.layoutMethodName}}" {{/if}} {{containerOuter.expandInnerDivRelPath}} {{#if_eq containerInner.expanded "false"}} style="display:none;" {{/if_eq}}
        {{#if pyLGChild}} tabindex="0" role="tabpanel" id="{{ariaControl}}" aria-labelledby="{{ariaLabelledby}}"{{/if}}>{{!-- Layout will come here --}}{{> pxLayoutBody}}
          {{#if containerInner.expandIndicator}}
            <input id="EXPAND-INDICATOR" data-template type="hidden" name="{{containerInner.expandIndicator.name}}" value="{{containerInner.expandIndicator.value}}">
          {{/if}}
        </div>{{else}}{{> pxLayoutBody}}
        {{/if_not_eq}}{{/if_not_eq}}
      {{~#unless pyLGChild~}}
      </{{#if_not_eq containerOuter.headerType "OUTLINE"}}div{{else}}fieldset{{/if_not_eq}}>
      {{~/unless~}}
    {{else}}{{> pxLayoutBody}}{{/if}}
  {{#if bSectionInclude}}
  {{~#unless pyLGChild~}}
  </span>
  {{~/unless~}}
  {{/if}}
  {{#if isDeferloadedSectionExpanded}}
    </div>
  {{/if}}
*/

/* Compiled JS */
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
templates['pxLayoutContainer'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  <div  class='lazyload-layout' "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"containerOuter") : depth0)) != null ? lookupProperty(stack1,"isADP") : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":32},"end":{"line":2,"column":106}}})) != null ? stack1 : "")
    + "  "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"containerOuter") : depth0)) != null ? lookupProperty(stack1,"isAssociateRequestor") : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":108},"end":{"line":2,"column":227}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"containerOuter") : depth0)) != null ? lookupProperty(stack1,"pyDPParams") : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":228},"end":{"line":2,"column":317}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"containerOuter") : depth0)) != null ? lookupProperty(stack1,"pyUsingPage") : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":318},"end":{"line":2,"column":410}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"containerOuter") : depth0)) != null ? lookupProperty(stack1,"pyDPScope") : stack1),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":411},"end":{"line":2,"column":497}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"containerOuter") : depth0)) != null ? lookupProperty(stack1,"pySectionId") : stack1),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":498},"end":{"line":2,"column":590}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"containerOuter") : depth0)) != null ? lookupProperty(stack1,"adpParameterPage") : stack1),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":591},"end":{"line":2,"column":698}}})) != null ? stack1 : "")
    + " data-deferinvoke=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"containerOuter") : depth0)) != null ? lookupProperty(stack1,"layoutMethodName") : stack1), depth0))
    + "\" "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pxParamPage") : depth0),{"name":"if","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":754},"end":{"line":2,"column":812}}})) != null ? stack1 : "")
    + ">\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " data-isadp=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"containerOuter") : depth0)) != null ? lookupProperty(stack1,"isADP") : stack1), depth0))
    + "\" ";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " data-isassociaterequestor=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"containerOuter") : depth0)) != null ? lookupProperty(stack1,"isAssociateRequestor") : stack1), depth0))
    + "\" ";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " data-pydpparams=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"containerOuter") : depth0)) != null ? lookupProperty(stack1,"pyDPParams") : stack1), depth0))
    + "\" ";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " data-pyusingpage=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"containerOuter") : depth0)) != null ? lookupProperty(stack1,"pyUsingPage") : stack1), depth0))
    + "\" ";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " data-pydpscope=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"containerOuter") : depth0)) != null ? lookupProperty(stack1,"pyDPScope") : stack1), depth0))
    + "\" ";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " data-pysectionid=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"containerOuter") : depth0)) != null ? lookupProperty(stack1,"pySectionId") : stack1), depth0))
    + "\" ";
},"14":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " data-adpparameterpage=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"containerOuter") : depth0)) != null ? lookupProperty(stack1,"adpParameterPage") : stack1), depth0))
    + "\" ";
},"16":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "data-parampage=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pxParamPage") || (depth0 != null ? lookupProperty(depth0,"pxParamPage") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pxParamPage","hash":{},"data":data,"loc":{"start":{"line":2,"column":789},"end":{"line":2,"column":804}}}) : helper)))
    + "\"";
},"18":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"unless").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyDLChild") : depth0),{"name":"unless","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":2},"end":{"line":7,"column":15}}})) != null ? stack1 : "");
},"19":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class=\"inspector-span\" "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"getTemplateMarker") || (depth0 != null ? lookupProperty(depth0,"getTemplateMarker") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"getTemplateMarker","hash":{},"data":data,"loc":{"start":{"line":6,"column":32},"end":{"line":6,"column":53}}}) : helper)))
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"bInspectorSpanMetaData") : depth0),{"name":"if","hash":{},"fn":container.program(20, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":54},"end":{"line":6,"column":120}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = lookupProperty(helpers,"unless").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"bIncludeContainer") : depth0),{"name":"unless","hash":{},"fn":container.program(22, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":121},"end":{"line":6,"column":227}}})) != null ? stack1 : "")
    + ">";
},"20":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"inspectorSpanDataUIMeta") || (depth0 != null ? lookupProperty(depth0,"inspectorSpanDataUIMeta") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"inspectorSpanDataUIMeta","hash":{},"data":data,"loc":{"start":{"line":6,"column":85},"end":{"line":6,"column":112}}}) : helper)))
    + " ";
},"22":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyExpressionIdMeta") || (depth0 != null ? lookupProperty(depth0,"pyExpressionIdMeta") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyExpressionIdMeta","hash":{},"data":data,"loc":{"start":{"line":6,"column":151},"end":{"line":6,"column":173}}}) : helper)))
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyHide") : depth0),{"name":"if","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":174},"end":{"line":6,"column":216}}})) != null ? stack1 : "");
},"23":function(container,depth0,helpers,partials,data) {
    return "style=\"display:none;\"";
},"25":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"unless").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyLGChild") : depth0),{"name":"unless","hash":{},"fn":container.program(26, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":10,"column":4},"end":{"line":12,"column":19}}})) != null ? stack1 : "")
    + "        "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"headerMarkup") || (depth0 != null ? lookupProperty(depth0,"headerMarkup") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"headerMarkup","hash":{},"data":data,"loc":{"start":{"line":14,"column":8},"end":{"line":14,"column":26}}}) : helper))) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"if_not_eq")||(depth0 && lookupProperty(depth0,"if_not_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isOnlyHeader") : depth0),"true",{"name":"if_not_eq","hash":{},"fn":container.program(35, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":14,"column":26},"end":{"line":20,"column":36}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"unless").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyLGChild") : depth0),{"name":"unless","hash":{},"fn":container.program(55, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":21,"column":6},"end":{"line":23,"column":19}}})) != null ? stack1 : "");
},"26":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<"
    + ((stack1 = (lookupProperty(helpers,"if_not_eq")||(depth0 && lookupProperty(depth0,"if_not_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"containerOuter") : depth0)) != null ? lookupProperty(stack1,"headerType") : stack1),"OUTLINE",{"name":"if_not_eq","hash":{},"fn":container.program(27, data, 0),"inverse":container.program(29, data, 0),"data":data,"loc":{"start":{"line":11,"column":9},"end":{"line":11,"column":92}}})) != null ? stack1 : "")
    + " "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"getTemplateMarker") || (depth0 != null ? lookupProperty(depth0,"getTemplateMarker") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"getTemplateMarker","hash":{},"data":data,"loc":{"start":{"line":11,"column":93},"end":{"line":11,"column":114}}}) : helper)))
    + " class=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"containerOuter") : depth0)) != null ? lookupProperty(stack1,"className") : stack1), depth0))
    + "\" "
    + ((stack1 = (lookupProperty(helpers,"dynamicAttributesGen")||(depth0 && lookupProperty(depth0,"dynamicAttributesGen"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"containerOuter") : depth0)) != null ? lookupProperty(stack1,"dynamicAttributes") : stack1),{"name":"dynamicAttributesGen","hash":{},"data":data,"loc":{"start":{"line":11,"column":152},"end":{"line":11,"column":211}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"containerOuter") : depth0)) != null ? lookupProperty(stack1,"dataTourId") : stack1),{"name":"if","hash":{},"fn":container.program(31, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":11,"column":212},"end":{"line":11,"column":296}}})) != null ? stack1 : "")
    + " "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyExpressionIdMeta") || (depth0 != null ? lookupProperty(depth0,"pyExpressionIdMeta") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyExpressionIdMeta","hash":{},"data":data,"loc":{"start":{"line":11,"column":297},"end":{"line":11,"column":319}}}) : helper)))
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyHide") : depth0),{"name":"if","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":11,"column":320},"end":{"line":11,"column":362}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyAutomationID") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(33, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":11,"column":363},"end":{"line":11,"column":444}}})) != null ? stack1 : "")
    + " data-layout-id=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyUniqueID") || (depth0 != null ? lookupProperty(depth0,"pyUniqueID") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyUniqueID","hash":{},"data":data,"loc":{"start":{"line":11,"column":461},"end":{"line":11,"column":475}}}) : helper)))
    + "\">";
},"27":function(container,depth0,helpers,partials,data) {
    return "div";
},"29":function(container,depth0,helpers,partials,data) {
    return "fieldset";
},"31":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " data-tour-id="
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"containerOuter") : depth0)) != null ? lookupProperty(stack1,"dataTourId") : stack1), depth0))
    + " ";
},"33":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " data-test-id=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyAutomationID") || (depth0 != null ? lookupProperty(depth0,"pyAutomationID") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyAutomationID","hash":{},"data":data,"loc":{"start":{"line":11,"column":413},"end":{"line":11,"column":431}}}) : helper)))
    + "\" ";
},"35":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"if_not_eq")||(depth0 && lookupProperty(depth0,"if_not_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"containerOuter") : depth0)) != null ? lookupProperty(stack1,"headerType") : stack1),"OUTLINE",{"name":"if_not_eq","hash":{},"fn":container.program(36, data, 0),"inverse":container.program(53, data, 0),"data":data,"loc":{"start":{"line":14,"column":60},"end":{"line":20,"column":22}}})) != null ? stack1 : "");
},"36":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div "
    + ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"containerOuter") : depth0)) != null ? lookupProperty(stack1,"headerType") : stack1),"COLLAPSIBLE",{"name":"if_eq","hash":{},"fn":container.program(37, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":14,"column":115},"end":{"line":14,"column":211}}})) != null ? stack1 : "")
    + " "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"containerInner") : depth0)) != null ? lookupProperty(stack1,"pyExpressionIdMeta") : stack1), depth0))
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"containerInner") : depth0)) != null ? lookupProperty(stack1,"pyHide") : stack1),{"name":"if","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":14,"column":250},"end":{"line":14,"column":307}}})) != null ? stack1 : "")
    + " section_index=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"containerInner") : depth0)) != null ? lookupProperty(stack1,"sectionIndex") : stack1), depth0))
    + "\" class=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"containerInner") : depth0)) != null ? lookupProperty(stack1,"className") : stack1), depth0))
    + " "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"containerInner") : depth0)) != null ? lookupProperty(stack1,"containerStyle") : stack1), depth0))
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"bCollapsedDeferLoad") : depth0),{"name":"if","hash":{},"fn":container.program(39, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":14,"column":426},"end":{"line":14,"column":600}}})) != null ? stack1 : "")
    + "\" "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"bCollapsedDeferLoad") : depth0),{"name":"if","hash":{},"fn":container.program(45, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":14,"column":602},"end":{"line":14,"column":692}}})) != null ? stack1 : "")
    + " "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"containerOuter") : depth0)) != null ? lookupProperty(stack1,"expandInnerDivRelPath") : stack1), depth0))
    + " "
    + ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"containerInner") : depth0)) != null ? lookupProperty(stack1,"expanded") : stack1),"false",{"name":"if_eq","hash":{},"fn":container.program(47, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":14,"column":734},"end":{"line":14,"column":809}}})) != null ? stack1 : "")
    + "\n        "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyLGChild") : depth0),{"name":"if","hash":{},"fn":container.program(49, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":8},"end":{"line":15,"column":119}}})) != null ? stack1 : "")
    + ">"
    + ((stack1 = container.invokePartial(lookupProperty(partials,"pxLayoutBody"),depth0,{"name":"pxLayoutBody","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"containerInner") : depth0)) != null ? lookupProperty(stack1,"expandIndicator") : stack1),{"name":"if","hash":{},"fn":container.program(51, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":16,"column":10},"end":{"line":18,"column":17}}})) != null ? stack1 : "")
    + "        </div>";
},"37":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " id=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"containerInner") : depth0)) != null ? lookupProperty(stack1,"innerDivId") : stack1), depth0))
    + "\" ";
},"39":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"containerOuter") : depth0)) != null ? lookupProperty(stack1,"headerType") : stack1),"!=","COLLAPSIBLE",{"name":"ifCond","hash":{},"fn":container.program(40, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":14,"column":453},"end":{"line":14,"column":593}}})) != null ? stack1 : "");
},"40":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isActiveLayout") : depth0),"==",false,{"name":"ifCond","hash":{},"fn":container.program(41, data, 0),"inverse":container.program(43, data, 0),"data":data,"loc":{"start":{"line":14,"column":509},"end":{"line":14,"column":582}}})) != null ? stack1 : "");
},"41":function(container,depth0,helpers,partials,data) {
    return "";
},"43":function(container,depth0,helpers,partials,data) {
    return " lazyload-layout";
},"45":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " data-deferinvoke=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"containerOuter") : depth0)) != null ? lookupProperty(stack1,"layoutMethodName") : stack1), depth0))
    + "\" ";
},"47":function(container,depth0,helpers,partials,data) {
    return " style=\"display:none;\" ";
},"49":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " tabindex=\"0\" role=\"tabpanel\" id=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"ariaControl") || (depth0 != null ? lookupProperty(depth0,"ariaControl") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"ariaControl","hash":{},"data":data,"loc":{"start":{"line":15,"column":59},"end":{"line":15,"column":74}}}) : helper)))
    + "\" aria-labelledby=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"ariaLabelledby") || (depth0 != null ? lookupProperty(depth0,"ariaLabelledby") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"ariaLabelledby","hash":{},"data":data,"loc":{"start":{"line":15,"column":93},"end":{"line":15,"column":111}}}) : helper)))
    + "\"";
},"51":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "            <input id=\"EXPAND-INDICATOR\" data-template type=\"hidden\" name=\""
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"containerInner") : depth0)) != null ? lookupProperty(stack1,"expandIndicator") : stack1)) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "\" value=\""
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"containerInner") : depth0)) != null ? lookupProperty(stack1,"expandIndicator") : stack1)) != null ? lookupProperty(stack1,"value") : stack1), depth0))
    + "\">\n";
},"53":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = container.invokePartial(lookupProperty(partials,"pxLayoutBody"),depth0,{"name":"pxLayoutBody","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\n        ";
},"55":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "</"
    + ((stack1 = (lookupProperty(helpers,"if_not_eq")||(depth0 && lookupProperty(depth0,"if_not_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"containerOuter") : depth0)) != null ? lookupProperty(stack1,"headerType") : stack1),"OUTLINE",{"name":"if_not_eq","hash":{},"fn":container.program(27, data, 0),"inverse":container.program(29, data, 0),"data":data,"loc":{"start":{"line":22,"column":8},"end":{"line":22,"column":91}}})) != null ? stack1 : "")
    + ">";
},"57":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = container.invokePartial(lookupProperty(partials,"pxLayoutBody"),depth0,{"name":"pxLayoutBody","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"59":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"unless").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyLGChild") : depth0),{"name":"unless","hash":{},"fn":container.program(60, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":26,"column":2},"end":{"line":28,"column":15}}})) != null ? stack1 : "");
},"60":function(container,depth0,helpers,partials,data) {
    return "</span>";
},"62":function(container,depth0,helpers,partials,data) {
    return "    </div>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isDeferloadedSectionExpanded") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":3,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"bSectionInclude") : depth0),{"name":"if","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":2},"end":{"line":8,"column":9}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"bIncludeContainer") : depth0),{"name":"if","hash":{},"fn":container.program(25, data, 0),"inverse":container.program(57, data, 0),"data":data,"loc":{"start":{"line":9,"column":4},"end":{"line":24,"column":37}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"bSectionInclude") : depth0),{"name":"if","hash":{},"fn":container.program(59, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":25,"column":2},"end":{"line":29,"column":9}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isDeferloadedSectionExpanded") : depth0),{"name":"if","hash":{},"fn":container.program(62, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":30,"column":2},"end":{"line":32,"column":9}}})) != null ? stack1 : "");
},"usePartial":true,"useData":true});
})();
/*End of Compiled JS */

//Helpers for processing Layout metadata
pega.ui.template.pxLayoutContainer = {
    // componentInfo is a JS object
    processContainerComponentInfo: function(componentInfo) {
        var headerMetaNode, layoutMetaNode, headerMarkup, layoutMarkup, dataRelPath, innerDivId, rw, rwProperty, rwDataTransform, rwPreActivity, ctDivExists, bSectionInclude = false,uniqueID="", automationID = "",
            bIncludeContainer = true,
            isActiveLayout, pyTitle, pyHeadingLevel = "h2",
            containerPrefix = "none",
            bIsSectionDeferLoad = false,
            pyLGChild = false,
            pyDLChild = false,
            /*lazyLoadDivId, lazyLoadSecId,*/
            bIsSectionDeferLoadResp, expandInnerDivRelPath = '',
            isRDL = false,
            bInspectorSpanMetaData = true,
            bSimpleLayoutAttr = false,
            bDonotRenderChildren = false;
        //Dynamic attributes
        var headerType, className, containerStyle, sectionIndex, param_name, headerTitle, headerTitleType, expanded = "",
            layoutMethodName = "", dataTourId="",selfClearClass = "layout-body clearfix";

        //componentInfo = pega.ui.TemplateEngine.mergeDefaults(componentInfo);//Returns the Client Cache page with defaults merged
        // Merge with defaultStatus
      
         var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS; 
      
         //debugger;
       //componentinfo constants
      
        componentInfo.pyLGChild=componentInfo[TEMPLATE_CONSTANTS["PYLGCHILD"]];
        componentInfo.pyDLChild=componentInfo[TEMPLATE_CONSTANTS["PYDLCHILD"]];
        componentInfo.pyInspectorLayoutData=componentInfo[TEMPLATE_CONSTANTS["PYINSPECTORLAYOUTDATA"]];
       componentInfo.pyIsSectionInclude =componentInfo[TEMPLATE_CONSTANTS["PYISSECTIONINCLUDE"]]; 
      
      
        componentInfo.pyIsRDL=componentInfo[TEMPLATE_CONSTANTS["PYISRDL"]]||"";
       componentInfo.pySectionIndex=componentInfo[TEMPLATE_CONSTANTS["PYSECTIONINDEX"]]||"";
       componentInfo.pyContainerStyle=componentInfo[pega.ui.TEMPLATE_CONSTANTS["PYCONTAINERSTYLE"]];
      
        componentInfo.pyTourId=componentInfo[TEMPLATE_CONSTANTS["pyTourId"]]||"";
        componentInfo.pyParamName= componentInfo[TEMPLATE_CONSTANTS["PYPARAMNAME"]]||"";
        componentInfo.pyPrefix =componentInfo[TEMPLATE_CONSTANTS["PYPREFIX"]]||"";
        componentInfo.pyIsSectionDeferLoaded=componentInfo[TEMPLATE_CONSTANTS["PYISSECTIONDEFERLOADED"]]||"";
         
       componentInfo.pyFloatClass=componentInfo[TEMPLATE_CONSTANTS["PYFLOATCLASS"]]||"";
       componentInfo.pyContainerCustomClass=componentInfo[TEMPLATE_CONSTANTS["PYCONTAINERCUSTOMCLASS"]]||"";   
      componentInfo.pyExpressionId =  componentInfo[TEMPLATE_CONSTANTS["PYEXPRESSIONID"]]||"";  
     componentInfo.pyExpressionId_BV=componentInfo[TEMPLATE_CONSTANTS["PYEXPRESSIONID_BV"]]||"";
      componentInfo.pyMethodName = componentInfo[TEMPLATE_CONSTANTS["PYMETHODNAME"]]||"";   
      
      if (componentInfo["pyVisibility"] === "false") {
            return '';
        }

        // Server visibility - do not render layout body when condition is false
        var pyVisibility_BV = componentInfo["pyVisibility_BV"];
        var pyClientWhen_BV = componentInfo["pyClientWhen_BV"];

        // Get the children components from the metadata tree
        var childComponents = pega.ui.TemplateEngine.getTemplates(componentInfo);
        var dynamicAttributes = {};
        var expandIndicator = null;

        /*
          ChildComponents[0] aka ChildComponents.get(1) -> Header
          ChildComponents[1] aka ChildComponents.get(2) -> Body (Section / Layout)
        */
        /* true in case of dynamic layout direct child of layout group */
        //pyLGChild = JSON.parse(componentInfo["pyLGChild"]?(""+componentInfo["pyLGChild"]) : "false");
        //pyLGChild = !!componentInfo["pyLGChild"];
        pyLGChild = componentInfo["pyLGChild"];
        // Get truth values
        pyLGChild = pyLGChild == "false" ? false : !!pyLGChild;

        pyDLChild = componentInfo["pyDLChild"];
        pyDLChild = pyDLChild == "false" ? false : true;
        if (pyLGChild)
            pyDLChild = true;

        if (childComponents) {
            if(pyLGChild){
              componentInfo.ariaLabelledby = componentInfo.ariaLabelledby ? componentInfo.ariaLabelledby : "headerlabel" + Math.floor((Math.random() * 10000) + 1);
              componentInfo.ariaControl = componentInfo.ariaControl ? componentInfo.ariaControl : "section" + Math.floor((Math.random() * 10000) + 1);
            }
            className = "layout layout-none";

            isRDL = !!componentInfo["pyIsRDL"];
            if (componentInfo["pyIsRDL"] && (componentInfo["pyIsRDL"] == 'true' || componentInfo["pyIsRDL"] == true)) {
                bSimpleLayoutAttr = true;
            }
            var containerHeader = childComponents[0];
            var containerBody = childComponents[1];

            if (!containerHeader)
                return;
      /* BUG-295223 adding the selfclear only when the checkbox for self-clear is selected BUG-304610 nomenclature changes pyselfclear */
            if(containerHeader && containerHeader[TEMPLATE_CONSTANTS["PYSELFCLEAR"]] && containerHeader[TEMPLATE_CONSTANTS["PYSELFCLEAR"]] === "true"){
              selfClearClass = "layout-body clearfix";
     		}
            if(containerHeader && containerHeader[TEMPLATE_CONSTANTS["PYSELFCLEAR"]] && containerHeader[TEMPLATE_CONSTANTS["PYSELFCLEAR"]] === "false"){
              selfClearClass = "layout-body";
            }
            /* BUG-295223 End */
            var isHeaderPresent = containerHeader["pyName"] == "pxLayoutHeader";
            var isBodyPresent = !!containerBody;
			
            containerHeader.pyHeaderType=containerHeader[TEMPLATE_CONSTANTS["PYHEADERTYPE"]];
            var isFieldSet = containerHeader[TEMPLATE_CONSTANTS["PYHEADERTYPE"]] == "OUTLINE";

            if (componentInfo["pyMethodName"]) {
                layoutMethodName = componentInfo["pyMethodName"];
            }

            innerDivId = componentInfo["pyInnerDivId"];
            if (componentInfo["pySectionIndex"]) {
                sectionIndex = componentInfo["pySectionIndex"];
            }
            if (componentInfo.pyContainerStyle){
                containerStyle = componentInfo['pyContainerStyle'];
            }
          
          /*US-194069 */
          if(componentInfo["pyPrefix"] && componentInfo["pyPrefix"].indexOf(".") > -1) {
            componentInfo["pyPrefix"] = pega.ui.TemplateEngine.getCurrentContext().getPropertyValue(componentInfo["pyPrefix"]);
            componentInfo["pyPrefix"] = "-" + componentInfo["pyPrefix"].replace(/ /g, '_').toLowerCase();
          }
            if (isHeaderPresent) {
                if(componentInfo[TEMPLATE_CONSTANTS["PYTOURID"]]){
                  dataTourId = componentInfo[TEMPLATE_CONSTANTS["PYTOURID"]].trim().replace("data-tour-id=","").replace(/[']+/g, '');
                }
                /* layout group header related variables - start */
                pyHeadingLevel = containerHeader[TEMPLATE_CONSTANTS["PYHEADINGLEVEL"]] ?containerHeader[TEMPLATE_CONSTANTS["PYHEADINGLEVEL"]] : "h2";
                isActiveLayout = JSON.parse(containerHeader["isActiveLayout"] ? ("" + containerHeader["isActiveLayout"]) : "false");
                pyTitle = containerHeader["pyTitle"] ? containerHeader["pyTitle"] : "";
                /* layout group header related variables - end */
                var headerMetaNode = containerHeader;
                //headerMetaNode = pega.ui.TemplateEngine.mergeDefaults(headerMetaNode);//Returns the Client Cache page with defaults merged

                /* BUG-296718: When the layoutbody is not visible, set bBodyVisible to false */
                if ((pyVisibility_BV === false && pyClientWhen_BV !== "true") && headerMetaNode[TEMPLATE_CONSTANTS["PYHEADERTYPE"]] == "COLLAPSIBLE") {
                  headerMetaNode["bBodyVisible"] = false;
                }

                //try
                {
                    if(componentInfo.isOnlyHeader !== 'false')
                    headerMarkup = pega.ui.template.RenderingEngine.getRenderer("pxLayoutHeader")(headerMetaNode, componentInfo);
                }
                /*
                catch(e){
                  console && console.error("Error rendering layout: " + e);
                }
                */

                headerType = headerMetaNode[TEMPLATE_CONSTANTS["PYHEADERTYPE"]];
                layoutMetaNode = containerBody;

                if (headerType != "OUTLINE") {
                    dynamicAttributes["id"] = "EXPAND-OUTERFRAME";
                    //if(componentInfo["pyParamName"))
                    {
                        var reference = pega.ui.TemplateEngine.ContextObject.getReference();
                        var regExp = /\(([^)]+)\)/g;
                        var matches = reference.match(regExp);
                        var index = "";
                        for (var i = 0; matches && i < matches.length; i++) {
                            var str = matches[i];
                            index += "_" + str.substring(1, str.length - 1);
                        }
                         if(headerType!="COLLAPSIBLE"){
                        componentInfo["pyParamName"] = componentInfo["pyParamName"] + index;
                         }

                        dynamicAttributes["param_name"] = componentInfo["pyParamName"];
                        param_name = componentInfo["pyParamName"];
                    }
                }
             
                if (isFieldSet) {
                    className = "layout layout-fieldset";
                    if (componentInfo["pyPrefix"]) {
                        containerPrefix = componentInfo["pyPrefix"];
                        className = "layout layout-fieldset layout-fieldset" + componentInfo["pyPrefix"];
                    }
                } else {
                    className = "layout layout-outline";
                    if (componentInfo["pyPrefix"]) {
                        containerPrefix = componentInfo["pyPrefix"];
                        className = "layout layout-outline layout-outline" + componentInfo["pyPrefix"];
                    }
                }
               var hiddenParamValue=headerMetaNode[TEMPLATE_CONSTANTS["PYINPUTHIDDENPARAMNAME"]]||"";
                var ccp_expanded = headerMetaNode[TEMPLATE_CONSTANTS["PYEXPANDED"]];
                if (headerType) {
                    if (ccp_expanded == true || headerType != "COLLAPSIBLE") {
                        expanded = "true";
                    } else {
                        expanded = "false";
                        if (layoutMethodName || (componentInfo["pyIsSectionDeferLoaded"] == 'true')) {
                            expandInnerDivRelPath = " data-template ";
                        }
                    }
                   if(headerType == "COLLAPSIBLE"){
                    expandIndicator = {
                            name: param_name,
                            value: hiddenParamValue
                        };
                   }  
                }
            } else {
                layoutMetaNode = childComponents[0]; // Only body is present
                if (componentInfo["pyPrefix"]) {
                    containerPrefix = componentInfo["pyPrefix"];
                    if(containerPrefix === 'standard'){
                      className = "layout layout-noheader layout-noheader";
                    } else {
                      className = "layout layout-noheader layout-noheader" + componentInfo["pyPrefix"];
                    }
                    
                }
            }
          
         	uniqueID = containerHeader[TEMPLATE_CONSTANTS["PYUNIQUEID"]];
          if(containerHeader[TEMPLATE_CONSTANTS["PYAUTOMATIONID"]] && componentInfo[TEMPLATE_CONSTANTS["PYLAYOUTMODE"]] != "SimpleDiv" && containerHeader["pyName"]!=="RepeatingDynamicLayout" && !(componentInfo["pyInspectorLayoutData"].indexOf("DYNAMICREPEATING") > 0) ){
            automationID = containerHeader[TEMPLATE_CONSTANTS["PYAUTOMATIONID"]].trim().replace("data-test-id=","").replace(/[']+/g, '');
          }
            //fix for BUG-284591
            if (componentInfo["pyIsSectionInclude"]) {
                bSectionInclude = componentInfo["pyIsSectionInclude"] === 'true';
            }
            if (bSectionInclude) {
                //lazyLoadDivId = componentInfo["pyLazyLoadContainerId"];
                //lazyLoadSecId = componentInfo["pyLazyLoadSectionId"];
                bIsSectionDeferLoad = layoutMethodName && layoutMethodName != '';
                //bIsSectionDeferLoadResp = lazyLoadSecId && lazyLoadSecId != '' && expanded != 'false';
                /* BUG-297570: In case of defer load bIncludeContainer should be false because for section layout container metadata comes in defer load re					sponse. */
                bIncludeContainer = isHeaderPresent || (containerPrefix != "none" && !bIsSectionDeferLoad);

                if (pyDLChild) {
                    bIsSectionDeferLoad = false;
                }
                /*BUG-382548-If expand when evaluates to true on load for a collapsible header and expand on load is not configured.The data-deferInvoke div needs to be generated after layout body div as only body is received as part of async request*/
                if(ccp_expanded == true && headerType == "COLLAPSIBLE"){
                  bIsSectionDeferLoad=false;
                }
                /* BUG-294155: In case of non-autogenerated section includes the inspector metadata has to be stamped on the inspector span */
                var isSectionIncludeNonTemplate = false;
                if(layoutMetaNode){
                  if(layoutMetaNode["pyName"] && layoutMetaNode["pyName"] == "pxNonTemplate") {
                    isSectionIncludeNonTemplate = true;
                  }
                  if(!bIsSectionDeferLoad) {
                    layoutMetaNode.rwclass = componentInfo.rwclass;
                    layoutMetaNode.roclass = componentInfo.roclass;
                  }
                }
                bInspectorSpanMetaData = !bIncludeContainer || (isSectionIncludeNonTemplate && !isHeaderPresent) || (!isSectionIncludeNonTemplate && !isHeaderPresent);
            }

          if(componentInfo[TEMPLATE_CONSTANTS["PYLAYOUTMODE"]]=="SimpleDiv"){
            bIncludeContainer=false;
          }
            var floatClassObj = componentInfo["pyFloatClass"];
            if (floatClassObj) {
                className += " " + floatClassObj;
            }
            if(componentInfo.pyContainerCustomClass){
              var containerCustomClass= pega.ui.TemplateEngine.getCurrentContext().getPropertyValue(componentInfo.pyContainerCustomClass);
              className +=containerCustomClass?" "+containerCustomClass:"";
            }
            /*
            if(bSectionInclude) {
              bIncludeContainer = isHeaderPresent || containerPrefix != "none";
            }
            */

            if (componentInfo["pyInspectorLayoutData"]) {
                // BUG-273133: Do not generate data-ui-meta, if the container originates from a DLG
                var pyTemplates = componentInfo.pyTemplates;
                if ((pyTemplates && pyTemplates[0] && (pyTemplates[0].pyName == "LayoutGroup" || pyTemplates[0].pyName == "DynamicLayoutGroup")) && className == "layout layout-none") {

                } else{
                    dynamicAttributes["data-ui-meta"] = componentInfo["pyInspectorLayoutData"];
                  if(dynamicAttributes["data-ui-meta"]){
                  var hexaSpace="&#032;";
                  dynamicAttributes["data-ui-meta"] =dynamicAttributes["data-ui-meta"].replace(/ /g,hexaSpace);
                  }
                 
                }
                var isGrid = false;
                if ((pyTemplates && pyTemplates[0] && pyTemplates[0].pyName == "pxGrid") || (componentInfo["pyInspectorLayoutData"].indexOf('REPEATGRID') > -1)) {
                    isGrid = true;
                }
                if (((pyDLChild && bSectionInclude) || !isHeaderPresent) && !isGrid) {
                    dynamicAttributes["data-ui-meta"] = "";
                }
            }


            // Server evaluates to false and not client when
            var renderLayout = true;
            if (pyVisibility_BV === false && pyClientWhen_BV !== "true") {
                renderLayout = false;
            }

            //try
            {
                if (layoutMetaNode && renderLayout) {
                    var layoutName = layoutMetaNode["pyName"];
                    if (layoutName == "DynamicLayout") {
                        bSimpleLayoutAttr = true;
                    }
                    var showDetailsComponent;
                    if (layoutName == "RepeatingDynamicLayout") {
                        // In case of RDL check for showDetails, if yes pass sibling template obj
                        // TODO: Remove null check afterEngine addScript changes are merged
                        var RDLShowDetails = pega.ui.template.pzRDLTemplate && pega.ui.template.pzRDLTemplate.isRDLShowDetails && pega.ui.template.pzRDLTemplate.isRDLShowDetails(layoutMetaNode);
                        if (RDLShowDetails) {
                            /*
                                0 - Header                  0 - Body
                                1 - Body                    1 - ShowDetails
                                2 - ShowDetails
                            */
                            if (isHeaderPresent)
                                showDetailsComponent = childComponents[2];
                            else
                                showDetailsComponent = childComponents[1];
                        }
                    }
                    var rendererMethod = pega.ui.template.RenderingEngine.getRenderer(layoutName);
                    if (rendererMethod) {
                        /* Rmeove inspector data when DL have header */
                        if (isHeaderPresent && layoutName == "DynamicLayout" && layoutMetaNode && layoutMetaNode.pyInspectorMetaData) {
                            var inspectorData = layoutMetaNode.pyInspectorMetaData ;
                            var res = inspectorData.split("data-tour-id=");
                            inspectorData = " ",
                                res.length > 1 && (inspectorData += " data-tour-id=" + res[1] + " ");
                            layoutMetaNode.pyInspectorMetaData  = inspectorData;
                        }else if(isHeaderPresent && layoutName == "LayoutGroup" && layoutMetaNode[TEMPLATE_CONSTANTS["PYINSPECTORDATA"]]){
                          /*BUG-338484- if header is present data-ui-meta should be generated only at layout container level*/
                          	layoutMetaNode[TEMPLATE_CONSTANTS["PYINSPECTORDATA"]]="";
						 }
                        var showWhen = true;
                        if (componentInfo["pyExpressionId"]) {
                            pega.ui.ExpressionEvaluator.getExpressionMetaToStamp(componentInfo["pyExpressionId"]);
                            var expressionResult = pega.ui.ExpressionEvaluator.evaluateClientExpressions(componentInfo["pyExpressionId"]);
                            if(expressionResult) {
                                showWhen = expressionResult[pega.ui.ExpressionEvaluator.SHOW_WHEN];
                                bDonotRenderChildren = expressionResult.ignoreChildren ? true : false;
                            }
                        }

                        if( componentInfo.isOnlyHeader !== "true"  && (showWhen || (!showWhen && !bDonotRenderChildren) )) {
                        // Pass the parent context also aka layout container
                        layoutMarkup = rendererMethod(layoutMetaNode, componentInfo, showDetailsComponent);
                        } else {
                          layoutMarkup = "";
                        }
                    }
                }
            }
            /*
            catch(e) {
                window.console && console.error("Error rendering layout: " + layoutName + ":: Stacktrace:" + e);
            }
            */
        }

        //dataRelPath =  "." + componentInfo.getName();
        //Properties required for CT div
        rw = componentInfo["pyRefreshWhen"] || null;
        rwProperty = componentInfo["pyRefreshWhenProperty"] || null;
        rwDataTransform = componentInfo["pyRefreshWhenDTransform"] || null;
        rwPreActivity = componentInfo["pyRefreshWhenActivity"] || null;
        //ctDivExists = (rwProperty || rw || rwDataTransform || rwPreActivity) && !lazyLoadDivId;
        ctDivExists = (rwProperty || rw || rwDataTransform || rwPreActivity) && layoutMethodName == '';
        var bExpandedLazyLoad = !pyLGChild && expanded != 'false' && layoutMethodName && !bIsSectionDeferLoad;
        var bCollapsedDeferLoad = (expanded == 'false' || pyLGChild) && layoutMethodName;
        var inspectorSpanDataUIMeta = componentInfo["pyInspectorLayoutData"] ? componentInfo["pyInspectorLayoutData"].replace(/["]+/g, '') : "";
        var isADP = componentInfo["isADP"] ? true : false;
        var pyAssociateRequestor = (componentInfo["pyAssociateRequestor"] === "true") ? true : false;
        var pyDPScope = componentInfo["pyDPScope"] ? componentInfo["pyDPScope"] : "";
        var pyDPParams = componentInfo["pyDPParams"] ? componentInfo["pyDPParams"] : "";
        /* BUG-307956: The pyDPParams may contain property references, which are change tracked */
        pyDPParams = pega.ui.TemplateEngine.getCurrentContext().replaceActionStringTokens(pyDPParams);
        var pyUsingPage = componentInfo["pyUsingPage"] ? componentInfo["pyUsingPage"] : "";
        var pySectionId = componentInfo["pySectionId"] ? componentInfo["pySectionId"] : "";
      	var adpParameterPage = "";
      	var pxParamPage = "";
      	if(isADP) {
          adpParameterPage = componentInfo["parampg"];
        } else {
          pxParamPage = componentInfo["parampg"];
        }
        var isDeferloadedSectionExpanded = (typeof expanded == 'undefined') ? bIsSectionDeferLoad : ( (expanded == 'true' || expanded == '')  && bIsSectionDeferLoad);
        /* metadata creation */
        var metadata = {
            containerOuter: {
                headerType: headerType,
                /* none|bar|collapsible|fieldset */
                className: className,
                /* layout layout-outline layout-outline-default_gray_background */
                dynamicAttributes: dynamicAttributes,
                headerTitle: headerTitle,
                headerTitleType: headerTitleType,
                dataRelPath: dataRelPath,
                layoutMethodName: layoutMethodName,
                //lazyLoadDivId: lazyLoadDivId,
                isADP: isADP,
                isAssociateRequestor: pyAssociateRequestor,
                pyDPScope: pyDPScope,
                pyDPParams: pyDPParams,
                pySectionId: pySectionId,
                pyUsingPage: pyUsingPage,
                adpParameterPage: adpParameterPage,
                expandInnerDivRelPath: expandInnerDivRelPath,
                dataTourId: dataTourId
            },
            containerInner: {
                sectionIndex: sectionIndex,
                className: selfClearClass,
                expandIndicator: expandIndicator,
                expanded: expanded,
                innerDivId: innerDivId,
                containerStyle: containerStyle
            },
          	pxParamPage: pxParamPage,
            headerMarkup: headerMarkup,
            layoutMarkup: layoutMarkup,
            ctDivExists: ctDivExists,
            rw: rw,
            rwProperty: rwProperty,
            rwDataTransform: rwDataTransform,
            rwPreActivity: rwPreActivity,
            bSectionInclude: bSectionInclude,
            bIncludeContainer: bIncludeContainer,
            bIsSectionDeferLoad: bIsSectionDeferLoad,
            bIsSectionDeferLoadResp: bIsSectionDeferLoadResp,
            isDeferloadedSectionExpanded: isDeferloadedSectionExpanded,
            bExpandedLazyLoad: bExpandedLazyLoad,
            bCollapsedDeferLoad: bCollapsedDeferLoad,
            bInspectorSpanMetaData: bInspectorSpanMetaData,
            isRDL: isRDL,
            bSimpleLayoutAttr: bSimpleLayoutAttr,
            isActiveLayout: isActiveLayout,
            pyHeadingLevel: pyHeadingLevel,
            pyLGChild: pyLGChild,
            pyDLChild: pyDLChild,
            inspectorSpanDataUIMeta: inspectorSpanDataUIMeta,
          	pyUniqueID: uniqueID,
            pyAutomationID: automationID
        };
        /* BUG-268299: Additional checks for pyShowWhenProps and pyWhenCondition */
        if (componentInfo["pyClientWhen"] == "true" && componentInfo["pyShowWhenProps"] && componentInfo["pyWhenCondition"]) {
            metadata.pyClientWhen = true;
            metadata.pyHide = (componentInfo["pyServerVisibility"] + "") !== 'true';
            metadata.pyShowWhenProps = componentInfo["pyShowWhenProps"];
            metadata.pyWhenCondition = componentInfo["pyWhenCondition"];
            if (componentInfo["pyThreadName"]) {
                metadata.pyThreadName = componentInfo["pyThreadName"];
            }
        }


        /* Body Visibility When - Client */
        if (componentInfo["pyClientWhen_BV"] == "true") {
            metadata.pyClientWhen_BV = true;
            /*
            if(componentInfo["pyServerVisibility_BV"])
              metadata.pyHide_BV = (""+componentInfo["pyServerVisibility_BV"]) !== 'true';
            */
            metadata.pyHide_BV = !componentInfo["pyServerVisibility_BV"];

            if (componentInfo["pyShowWhenProps_BV"])
                metadata.pyShowWhenProps_BV = componentInfo["pyShowWhenProps_BV"];
            if (componentInfo["pyWhenCondition_BV"])
                metadata.pyWhenCondition_BV = componentInfo["pyWhenCondition_BV"];
            if (componentInfo["pyThreadName_BV"]) {
                metadata.pyThreadName_BV = componentInfo["pyThreadName_BV"];
            }
        }
        // Augment ctDivExists with Body Visibility When attributes
        metadata.ctDivExists = metadata.ctDivExists || metadata.pyShowWhenProps_BV;

        // Populate expression data
        if (componentInfo["pyExpressionId"]) {
            metadata.pyExpressionIdMeta = pega.ui.ExpressionEvaluator.getExpressionMetaToStamp (componentInfo["pyExpressionId"]);
            if(bDonotRenderChildren){
              metadata.pyExpressionIdMeta = "";
            }
            var expressionResult = pega.ui.ExpressionEvaluator.evaluateClientExpressions(componentInfo["pyExpressionId"]);
            var show_when = expressionResult && expressionResult[pega.ui.ExpressionEvaluator.SHOW_WHEN];
            metadata.pyHide = typeof show_when == 'undefined' ? false : !show_when;

        }

        // Populate expression data for body visibility
        if (componentInfo["pyExpressionId_BV"]) {
            metadata.containerInner.pyExpressionIdMeta = pega.ui.ExpressionEvaluator.getExpressionMetaToStamp (componentInfo["pyExpressionId_BV"]);

            var expressionResult = pega.ui.ExpressionEvaluator.evaluateClientExpressions(componentInfo["pyExpressionId_BV"]);
            var show_when = expressionResult && expressionResult[pega.ui.ExpressionEvaluator.SHOW_WHEN];
            metadata.containerInner.pyHide = typeof show_when == 'undefined' ? false : !show_when;

        }
        if(pyLGChild){
          metadata.ariaLabelledby = componentInfo.ariaLabelledby ;
          metadata.ariaControl = componentInfo.ariaControl;
         
        } 
      if(componentInfo.isOnlyHeader) metadata.isOnlyHeader = componentInfo.isOnlyHeader;
        return metadata;
    }
}

/* Renderer method */
pega.ui.template.RenderingEngine.register("pxLayoutContainer", function(componentInfo) {
    var metadata = pega.ui.template.pxLayoutContainer.processContainerComponentInfo(componentInfo);
    return pega.ui.TemplateEngine.execute("pxLayoutContainer", metadata).trim(); /* trimming spaces between  ending and opening tags */
});


Handlebars.registerHelper('dynamicAttributesGen', function(dynamicAttributes) {
    if (typeof dynamicAttributes == "string") {
        dynamicAttributes = dynamicAttributes.replace(/["]+/g, '');
        return dynamicAttributes;
    }
    var attributeStr = "";
    var attrName;
    for (attrName in dynamicAttributes) {
        if (attrName == "data-ui-meta") {
            if(dynamicAttributes[attrName])
              attributeStr += " " + dynamicAttributes[attrName].replace(/["]+/g, '');
        } else {
            attributeStr += " " + attrName + " = " + dynamicAttributes[attrName];
        }
    }
    return attributeStr;
});
//static-content-hash-trigger-GCC
// Header template
/*
{{~#if bHeaderTypeBar~}}
<div {{getTemplateMarker}} class="{{className}}" {{#if pyAutomationID}} data-test-id="{{pyAutomationID}}_header" {{/if}} data-layout-id="{{pyUniqueID}}"
{{~#if pyIsDirectChildLayoutGroup~}} 
  {{{pyActionString}}} {{#if pyIsDataDefer}} data-defer='true' {{/if}}  role="tab" title="{{tooltip}}" bsimplelayout="true" {{disExpressionIdMeta}} {{{pyFieldValueMeta}}} aria-label="{{headerTitle}}"  
    {{~#if isActiveLayout~}}
       aria-selected="true"  tabindex="0" 
    {{~else~}}
       aria-selected="false" tabindex="-1" 
    {{~/if~}}
    {{#if_eq lgChild "true" }} id="{{ariaLabelledby}}" aria-controls="{{ariaControl}}" {{/if_eq}}
    {{#if_eq isOnlyHeader "true" }} data-semantic-tab = "true" {{/if_eq}}
{{~else~}}
  tabIndex="{{tabIndex}}" aria-level="{{headingLevelNumber}}" role="{{CONSTANTS.HEADING_ROLE}}" id="{{CONSTANTS.RULE_KEY}}" node_type="{{CONSTANTS.NODE_TYPE_HEADER}}" aria-labelledby="{{ariaLabelledby}}"
{{~/if~}}
  >
{{> pxHeaderContent}}</div>{{~/if~}}{{~#if bHeaderTypeCollapsible~}}
<div class="collapsible {{#ifCond bExpanded '&&' bBodyVisible}} Expanded {{else}} Collapsed {{/ifCond}}" id="EXPAND-PLUSMINUS" name="" aria-live="polite" {{#if pyAutomationID}} data-test-id="{{pyAutomationID}}_header" {{/if}} data-layout-id="{{pyUniqueID}}">
    <div  {{getTemplateMarker}} class="{{className}}" id="{{CONSTANTS.RULE_KEY}}" node_type="{{CONSTANTS.NODE_TYPE_HEADER}}" onkeydown="{{onkeydown}}" onclick="{{onclick}}">
        {{> pxHeaderContent}}
    </div>
</div>
{{~/if~}}{{~#if bHeaderTypeFieldSet~}}
        <legend class="fieldset-legend">
           <span class="header-title">{{headerTitle}}</span>
        </legend>
{{~/if~}}
*/

/* Compiled template */
/* istanbul ignore next */
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
Handlebars.partials['pxLayoutHeader'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"getTemplateMarker") || (depth0 != null ? lookupProperty(depth0,"getTemplateMarker") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"getTemplateMarker","hash":{},"data":data,"loc":{"start":{"line":2,"column":5},"end":{"line":2,"column":26}}}) : helper)))
    + " class=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"className") || (depth0 != null ? lookupProperty(depth0,"className") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"className","hash":{},"data":data,"loc":{"start":{"line":2,"column":34},"end":{"line":2,"column":47}}}) : helper)))
    + "\" "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyAutomationID") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":49},"end":{"line":2,"column":120}}})) != null ? stack1 : "")
    + " data-layout-id=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyUniqueID") || (depth0 != null ? lookupProperty(depth0,"pyUniqueID") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyUniqueID","hash":{},"data":data,"loc":{"start":{"line":2,"column":137},"end":{"line":2,"column":151}}}) : helper)))
    + "\""
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyIsDirectChildLayoutGroup") : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(15, data, 0),"data":data,"loc":{"start":{"line":3,"column":0},"end":{"line":14,"column":9}}})) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = container.invokePartial(lookupProperty(partials,"pxHeaderContent"),depth0,{"name":"pxHeaderContent","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "</div>";
},"2":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " data-test-id=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyAutomationID") || (depth0 != null ? lookupProperty(depth0,"pyAutomationID") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyAutomationID","hash":{},"data":data,"loc":{"start":{"line":2,"column":86},"end":{"line":2,"column":104}}}) : helper)))
    + "_header\" ";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyActionString") || (depth0 != null ? lookupProperty(depth0,"pyActionString") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyActionString","hash":{},"data":data,"loc":{"start":{"line":4,"column":2},"end":{"line":4,"column":22}}}) : helper))) != null ? stack1 : "")
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyIsDataDefer") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":23},"end":{"line":4,"column":70}}})) != null ? stack1 : "")
    + "  role=\"tab\" title=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"tooltip") || (depth0 != null ? lookupProperty(depth0,"tooltip") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"tooltip","hash":{},"data":data,"loc":{"start":{"line":4,"column":90},"end":{"line":4,"column":101}}}) : helper)))
    + "\" bsimplelayout=\"true\" "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"disExpressionIdMeta") || (depth0 != null ? lookupProperty(depth0,"disExpressionIdMeta") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"disExpressionIdMeta","hash":{},"data":data,"loc":{"start":{"line":4,"column":124},"end":{"line":4,"column":147}}}) : helper)))
    + " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyFieldValueMeta") || (depth0 != null ? lookupProperty(depth0,"pyFieldValueMeta") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyFieldValueMeta","hash":{},"data":data,"loc":{"start":{"line":4,"column":148},"end":{"line":4,"column":170}}}) : helper))) != null ? stack1 : "")
    + " aria-label=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"headerTitle") || (depth0 != null ? lookupProperty(depth0,"headerTitle") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"headerTitle","hash":{},"data":data,"loc":{"start":{"line":4,"column":183},"end":{"line":4,"column":198}}}) : helper)))
    + "\""
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isActiveLayout") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.program(9, data, 0),"data":data,"loc":{"start":{"line":5,"column":4},"end":{"line":9,"column":13}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"lgChild") : depth0),"true",{"name":"if_eq","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":10,"column":4},"end":{"line":10,"column":97}}})) != null ? stack1 : "")
    + "\n    "
    + ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isOnlyHeader") : depth0),"true",{"name":"if_eq","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":11,"column":4},"end":{"line":11,"column":73}}})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    return " data-defer='true' ";
},"7":function(container,depth0,helpers,partials,data) {
    return "aria-selected=\"true\"  tabindex=\"0\"";
},"9":function(container,depth0,helpers,partials,data) {
    return "aria-selected=\"false\" tabindex=\"-1\"";
},"11":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " id=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"ariaLabelledby") || (depth0 != null ? lookupProperty(depth0,"ariaLabelledby") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"ariaLabelledby","hash":{},"data":data,"loc":{"start":{"line":10,"column":35},"end":{"line":10,"column":53}}}) : helper)))
    + "\" aria-controls=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"ariaControl") || (depth0 != null ? lookupProperty(depth0,"ariaControl") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"ariaControl","hash":{},"data":data,"loc":{"start":{"line":10,"column":70},"end":{"line":10,"column":85}}}) : helper)))
    + "\" ";
},"13":function(container,depth0,helpers,partials,data) {
    return " data-semantic-tab = \"true\" ";
},"15":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "tabIndex=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"tabIndex") || (depth0 != null ? lookupProperty(depth0,"tabIndex") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"tabIndex","hash":{},"data":data,"loc":{"start":{"line":13,"column":12},"end":{"line":13,"column":24}}}) : helper)))
    + "\" aria-level=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"headingLevelNumber") || (depth0 != null ? lookupProperty(depth0,"headingLevelNumber") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"headingLevelNumber","hash":{},"data":data,"loc":{"start":{"line":13,"column":38},"end":{"line":13,"column":60}}}) : helper)))
    + "\" role=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"CONSTANTS") : depth0)) != null ? lookupProperty(stack1,"HEADING_ROLE") : stack1), depth0))
    + "\" id=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"CONSTANTS") : depth0)) != null ? lookupProperty(stack1,"RULE_KEY") : stack1), depth0))
    + "\" node_type=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"CONSTANTS") : depth0)) != null ? lookupProperty(stack1,"NODE_TYPE_HEADER") : stack1), depth0))
    + "\" aria-labelledby=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"ariaLabelledby") || (depth0 != null ? lookupProperty(depth0,"ariaLabelledby") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"ariaLabelledby","hash":{},"data":data,"loc":{"start":{"line":13,"column":184},"end":{"line":13,"column":202}}}) : helper)))
    + "\"";
},"17":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"collapsible "
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"bExpanded") : depth0),"&&",(depth0 != null ? lookupProperty(depth0,"bBodyVisible") : depth0),{"name":"ifCond","hash":{},"fn":container.program(18, data, 0),"inverse":container.program(20, data, 0),"data":data,"loc":{"start":{"line":17,"column":24},"end":{"line":17,"column":103}}})) != null ? stack1 : "")
    + "\" id=\"EXPAND-PLUSMINUS\" name=\"\" aria-live=\"polite\" "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyAutomationID") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":17,"column":154},"end":{"line":17,"column":225}}})) != null ? stack1 : "")
    + " data-layout-id=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyUniqueID") || (depth0 != null ? lookupProperty(depth0,"pyUniqueID") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyUniqueID","hash":{},"data":data,"loc":{"start":{"line":17,"column":242},"end":{"line":17,"column":256}}}) : helper)))
    + "\">\n    <div  "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"getTemplateMarker") || (depth0 != null ? lookupProperty(depth0,"getTemplateMarker") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"getTemplateMarker","hash":{},"data":data,"loc":{"start":{"line":18,"column":10},"end":{"line":18,"column":31}}}) : helper)))
    + " class=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"className") || (depth0 != null ? lookupProperty(depth0,"className") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"className","hash":{},"data":data,"loc":{"start":{"line":18,"column":39},"end":{"line":18,"column":52}}}) : helper)))
    + "\" id=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"CONSTANTS") : depth0)) != null ? lookupProperty(stack1,"RULE_KEY") : stack1), depth0))
    + "\" node_type=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"CONSTANTS") : depth0)) != null ? lookupProperty(stack1,"NODE_TYPE_HEADER") : stack1), depth0))
    + "\" onkeydown=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"onkeydown") || (depth0 != null ? lookupProperty(depth0,"onkeydown") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"onkeydown","hash":{},"data":data,"loc":{"start":{"line":18,"column":136},"end":{"line":18,"column":149}}}) : helper)))
    + "\" onclick=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"onclick") || (depth0 != null ? lookupProperty(depth0,"onclick") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"onclick","hash":{},"data":data,"loc":{"start":{"line":18,"column":160},"end":{"line":18,"column":171}}}) : helper)))
    + "\">\n"
    + ((stack1 = container.invokePartial(lookupProperty(partials,"pxHeaderContent"),depth0,{"name":"pxHeaderContent","data":data,"indent":"        ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "    </div>\n</div>";
},"18":function(container,depth0,helpers,partials,data) {
    return " Expanded ";
},"20":function(container,depth0,helpers,partials,data) {
    return " Collapsed ";
},"22":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<legend class=\"fieldset-legend\">\n           <span class=\"header-title\">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"headerTitle") || (depth0 != null ? lookupProperty(depth0,"headerTitle") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"headerTitle","hash":{},"data":data,"loc":{"start":{"line":24,"column":38},"end":{"line":24,"column":53}}}) : helper)))
    + "</span>\n        </legend>";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"bHeaderTypeBar") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":16,"column":36}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"bHeaderTypeCollapsible") : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":16,"column":36},"end":{"line":22,"column":9}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"bHeaderTypeFieldSet") : depth0),{"name":"if","hash":{},"fn":container.program(22, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":22,"column":9},"end":{"line":26,"column":9}}})) != null ? stack1 : "");
},"usePartial":true,"useData":true});
})();
/*End of Compiled JS */

// Helpers for processing metadata
pega.ui.template.pxLayoutHeader = {
    TEMPLATE_CONSTANTS: {
        EXPAND_INDICATOR: "EXPAND-INDICATOR",
        RULE_KEY: "RULE_KEY",
        NODE_TYPE_HEADER: "HEADER",
        HEADING_ROLE: "heading",
        OPENCLOSEICON_CLASSNAME: "icon icon-openclose",
        HEADERCONTENT_CLASSNAME: "header-content",
        HEADERTITLE_CLASSNAME: "header-title",
    },

    processHeaderComponentInfo: function(headerMetadataNode, containerMetadataNode) {
        var headerMetadata = {};
        /* header support in lg starts */

        var pyIsDirectChildLayoutGroup, pyIsDataDefer, pyHeaderTypeLayoutGroup, isActiveLayout, isLayoutBodyVisible;
        var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
        headerMetadataNode.pyHeaderType = headerMetadataNode[TEMPLATE_CONSTANTS["PYHEADERTYPE"]];
        headerMetadataNode.pyHeadingLevel = headerMetadataNode[TEMPLATE_CONSTANTS["PYHEADINGLEVEL"]];
        headerMetadataNode.pyTitleType = headerMetadataNode[TEMPLATE_CONSTANTS["PYTITLETYPE"]];
        headerMetadataNode.pyIsLocalized = headerMetadataNode[TEMPLATE_CONSTANTS["PYISLOCALIZED"]];
        headerMetadataNode.pyLayoutHeaderAccessKey = headerMetadataNode[TEMPLATE_CONSTANTS["PYLAYOUTHEADERACCESSKEY"]];
        headerMetadataNode.pyProcessChildren = headerMetadataNode[TEMPLATE_CONSTANTS["PYPROCESSCHILDREN"]];
        headerMetadataNode.pyExpanded = headerMetadataNode[TEMPLATE_CONSTANTS["PYEXPANDED"]];
        if (headerMetadataNode[TEMPLATE_CONSTANTS["PYISDATADEFER"]])
            headerMetadataNode.pyIsDataDefer = headerMetadataNode[TEMPLATE_CONSTANTS["PYISDATADEFER"]];
        if (headerMetadataNode[TEMPLATE_CONSTANTS["PYLGACTIONSTRING"]])
            headerMetadataNode.pyLGActionString = headerMetadataNode[TEMPLATE_CONSTANTS["PYLGACTIONSTRING"]];
        if (headerMetadataNode[TEMPLATE_CONSTANTS["PYFIELDVALUEMETA"]])
            headerMetadataNode.pyFieldValueMeta = headerMetadataNode[TEMPLATE_CONSTANTS["PYFIELDVALUEMETA"]].replace(/'/g,"");
        if (headerMetadataNode[TEMPLATE_CONSTANTS["PYLGBEHAVIORPROPERTIESCOUNT"]])
            headerMetadataNode.pyLGBehaviorPropertiesCount = headerMetadataNode[TEMPLATE_CONSTANTS["PYLGBEHAVIORPROPERTIESCOUNT"]];
        if (headerMetadataNode[TEMPLATE_CONSTANTS["PYFIELDVALUEINSPECTORDATA"]])
            headerMetadataNode.pyFieldValueInspectorData = headerMetadataNode[TEMPLATE_CONSTANTS["PYFIELDVALUEINSPECTORDATA"]];
        if (headerMetadataNode[TEMPLATE_CONSTANTS["PYIMAGETITLE"]])
            headerMetadataNode.pyImageTitle = headerMetadataNode[TEMPLATE_CONSTANTS["PYIMAGETITLE"]];
        if (headerMetadataNode[TEMPLATE_CONSTANTS["PYTITLE"]])
            headerMetadataNode.pyTitle = headerMetadataNode[TEMPLATE_CONSTANTS["PYTITLE"]];
        if (headerMetadataNode[TEMPLATE_CONSTANTS["PYTITLETYPE"]])
            headerMetadata.pyTitleType = headerMetadataNode.pyTitleType = headerMetadataNode[TEMPLATE_CONSTANTS["PYTITLETYPE"]];
        if (headerMetadataNode[TEMPLATE_CONSTANTS["PYTOOLTIP"]])
            headerMetadataNode.tooltip = headerMetadataNode[TEMPLATE_CONSTANTS["PYTOOLTIP"]];
		   if (headerMetadataNode[TEMPLATE_CONSTANTS["PYHEADERCUSTOMCLASS"]])
			      headerMetadataNode.pyHeaderCustomClass = headerMetadataNode[TEMPLATE_CONSTANTS["PYHEADERCUSTOMCLASS"]];
        isActiveLayout = headerMetadataNode[TEMPLATE_CONSTANTS["ISACTIVELAYOUT"]];

        headerMetadata.isActiveLayout = "false" == isActiveLayout ? !1 : !!isActiveLayout;
        pyIsDataDefer = headerMetadataNode.pyIsDataDefer ? headerMetadataNode.pyIsDataDefer : "false";
        headerMetadata.pyIsDataDefer = JSON.parse("" + pyIsDataDefer), headerMetadata.pyActionString = "";
        /*BUG-294056 added change for default body visibility */
        headerMetadata.isLayoutBodyVisible = true;
        if (containerMetadataNode) {
            /* disable when */
            headerMetadata.disExpressionIdMeta = "";
            if(containerMetadataNode.disExpressionIdMeta){
              headerMetadata.disExpressionIdMeta = containerMetadataNode.disExpressionIdMeta;
            }
            if(containerMetadataNode.isOnlyHeader){
              headerMetadata.isOnlyHeader = containerMetadataNode.isOnlyHeader;
            }
            /* disable when */
            /* BUG-293539 based on body visibility the collapsible and expand icon should appear*/
            if (containerMetadataNode.pyVisibility_BV != undefined)
                headerMetadata.isLayoutBodyVisible = containerMetadataNode.pyVisibility_BV ? true : false;
            else
                headerMetadata.isLayoutBodyVisible = true;
            pyIsDirectChildLayoutGroup = containerMetadataNode.pyLGChild;
            if (containerMetadataNode.pyTemplates[1])
                containerMetadataNode.pyTemplates[1].pyActionString = pega.ui.TemplateEngine.getCurrentContext().getActionString(containerMetadataNode.pyTemplates[1].pyActionStringID);
            if (containerMetadataNode.pyIsDirectChildDynamicLayoutGroup && containerMetadataNode.pyIsDirectChildDynamicLayoutGroup == "true") {
                headerMetadata.pyActionString = pega.ui.TemplateEngine.getCurrentContext().replaceActionStringTokens(headerMetadataNode.pyLGActionString)
            } else {
                /* BUG-323204 */
                if (pyIsDirectChildLayoutGroup) {
                    if (headerMetadataNode.pyLGActionString) {
                        headerMetadata.pyActionString = pega.ui.TemplateEngine.getCurrentContext().replaceActionStringTokens(headerMetadataNode.pyLGActionString);
                    } else if (containerMetadataNode.pyTemplates[1] && containerMetadataNode.pyTemplates[1].pyActionString) {
                        headerMetadata.pyActionString = containerMetadataNode.pyTemplates[1].pyActionString;
                    }
                } else {
                    containerMetadataNode.pyTemplates[1] && containerMetadataNode.pyTemplates[1].pyActionString && (headerMetadata.pyActionString = containerMetadataNode.pyTemplates[1].pyActionString);
                }
            }
            headerMetadata.isLGDisabled = (containerMetadataNode.isLGDisabled ? true : false);
        }

        headerMetadata.pyUniqueID = headerMetadataNode[TEMPLATE_CONSTANTS["PYUNIQUEID"]];
        if (headerMetadataNode[TEMPLATE_CONSTANTS["PYAUTOMATIONID"]]) {
            headerMetadata.pyAutomationID = headerMetadataNode[TEMPLATE_CONSTANTS["PYAUTOMATIONID"]].trim().replace("data-test-id=", "").replace(/[']+/g, '');
        }
        headerMetadata.pyIsDirectChildLayoutGroup = "false" == pyIsDirectChildLayoutGroup ? !1 : !!pyIsDirectChildLayoutGroup;

        headerMetadata.pyLGBehaviorPropertiesCount = headerMetadataNode.pyLGBehaviorPropertiesCount ? headerMetadataNode.pyLGBehaviorPropertiesCount : "";
        /* header support in lg ends */
        // Make constants available
        headerMetadata.CONSTANTS = this.TEMPLATE_CONSTANTS;

        headerMetadata.pyFieldValueMeta = headerMetadataNode.pyFieldValueMeta ? headerMetadataNode.pyFieldValueMeta : "";
        headerMetadata.pyFieldValueInspectorData = headerMetadataNode["pyFieldValueInspectorData"];



        // Default values of onkeydown and onclick
        headerMetadata.onkeydown = "pega.ui.template.pxLayoutHeader.onkeydownHandler_Header(this, event, null, true)";
        headerMetadata.onclick = "setUserStart(this.id); pega.ui.template.pxLayoutHeader.onclickHandler_Header(this, event)";

        // h1 -> 1
        if (headerMetadataNode["pyHeadingLevel"]) {
            headerMetadata.headingLevel = headerMetadataNode["pyHeadingLevel"];
            headerMetadata.headingLevelNumber = headerMetadataNode["pyHeadingLevel"].match(/\d+/)[0];
        }
        if (headerMetadataNode["pyHeaderType"]) {
            if (headerMetadataNode["pyHeaderType"] == "BAR") {
                headerMetadata.bHeaderTypeBar = true;
            } else if (headerMetadataNode["pyHeaderType"] == "COLLAPSIBLE") {
                headerMetadata.bHeaderTypeCollapsible = true;
                headerMetadata.openCloseIcon = true;
                headerMetadata.bExpanded = !!headerMetadataNode["pyExpanded"];
                /* BUG-296718: Additionally check bBodyVisible while decided between 'Expanded' and 'Collapsed' */
                headerMetadata.bBodyVisible = typeof headerMetadataNode["bBodyVisible"] != 'undefined' ? headerMetadataNode["bBodyVisible"] : true;
                var bDeferLoaded = (containerMetadataNode["pyIsSectionDeferLoaded"] && containerMetadataNode["pyIsSectionDeferLoaded"] != '') || (containerMetadataNode["pyMethodName"] && containerMetadataNode["pyMethodName"] != '');
                if (bDeferLoaded && !headerMetadata.bExpanded) { /*BUG-388324: Invoke loadContainer API only if the layout is not expanded on load*/
                    headerMetadata.onkeydown = "pega.ui.template.pxLayoutHeader.onkeydownHandler_Header(this, event, 'section', true)";
                    headerMetadata.onclick = "pega.ui.template.pxLayoutHeader.onclickHandler_Header(this, event, 'section')";
                }
                if (headerMetadataNode.pyIsLocalized === 'true') {
                    headerMetadata.Disclose = pega.ui.TemplateEngine.getCurrentContext().getLocalizedValue("Click to expand", "pyActionPrompt").trim();
                    headerMetadata.Hide = pega.ui.TemplateEngine.getCurrentContext().getLocalizedValue("Click to collapse", "pyActionPrompt").trim();
                } else {
                    headerMetadata.Disclose = "Click to expand";
                    headerMetadata.Hide = "Click to collapse";
                }

            } else if (headerMetadataNode["pyHeaderType"] == "OUTLINE") {
                headerMetadata.bHeaderTypeFieldSet = true;
            }
        }
        if (!headerMetadataNode["pyTitleType"] || headerMetadataNode["pyTitleType"] == "") {
            headerMetadataNode["pyTitleType"] = "text";
        }
        if (headerMetadataNode["pyTitleType"]) {
            var titleVal = headerMetadataNode["pyTitle"];
            if (headerMetadataNode["pyTitleType"] === "Property") {
                if (headerMetadataNode["pyIsLocalized"] && headerMetadataNode["pyIsLocalized"] == "true") {
                    titleVal = pega.ui.TemplateEngine.getCurrentContext().getLocalizedValue(headerMetadataNode["pyTitle"], "pyCaption");
                } else {
                    titleVal = pega.ui.TemplateEngine.getCurrentContext().getPropertyValue(headerMetadataNode["pyTitle"]);
                }
            } else if (headerMetadataNode["pyTitleType"] === "Field Value") {
                if( typeof headerMetadataNode["pyTitle"] === "string" && headerMetadataNode["pyTitle"].indexOf("^~") != -1 ){
                  var propCtx = pega.ui.TemplateEngine.getCurrentContext().getFieldValParam(headerMetadataNode["pyTitle"]);
                  headerMetadataNode["pyTitle"] = pega.ui.template.DLTemplate.resolveMulFVParam(propCtx);
                }
                if (headerMetadataNode["pyIsLocalized"] && headerMetadataNode["pyIsLocalized"] == "true") {
                    titleVal = pega.ui.TemplateEngine.getCurrentContext().getLocalizedValue(headerMetadataNode["pyTitle"], "pyCaption");
                    if(typeof titleVal === "string"){
                      titleVal = pega.ui.template.DLTemplate.resolveMulFVParam(titleVal);
                    }
                } else {
                    titleVal = headerMetadataNode["pyTitle"];
                }
            } else {
                if (headerMetadataNode["pyIsLocalized"] && headerMetadataNode["pyIsLocalized"] == "true") {
                    titleVal = headerMetadataNode["pyTitle"] ? pega.ui.TemplateEngine.getCurrentContext().getLocalizedValue(headerMetadataNode["pyTitle"], "pyCaption") : "";
                } else {
                    titleVal = headerMetadataNode["pyTitle"];
                }
            }
            headerMetadata.headerTitle = titleVal;
        }

      headerMetadataNode["hIconSrcType"] = headerMetadataNode["hIconSrcType"] ? headerMetadataNode["hIconSrcType"] : "standard";
      
      if (headerMetadataNode["hIconSrcType"]) {
        if(headerMetadataNode["hIconSrcType"] === 'standard'){
          if (headerMetadataNode["pyImage"]) {
            headerMetadata.imgSrc = headerMetadataNode["pyImage"];
            headerMetadata.imgTitle = headerMetadataNode["pyImageTitle"];
            headerMetadata.bIconPresent = true;
          }
        } else if(headerMetadataNode["hIconSrcType"] === 'property'){
          
          if (headerMetadataNode["hIconSrc"]) {
            headerMetadata.imgSrc = pega.ui.TemplateEngine.getCurrentContext().getPropertyValue(headerMetadataNode["hIconSrc"]);
            headerMetadata.imgTitle = pega.ui.TemplateEngine.getCurrentContext().getLocalizedValue(headerMetadataNode["imgTitle"], "pyActionPrompt");
            headerMetadata.bIconPresent = true;
          }
        } else if (headerMetadataNode["hIconSrcType"] === 'text') {
            headerMetadata.bIconPresent = false;
            headerMetadata.includedText = pega.ui.TemplateEngine.getCurrentContext().getLocalizedValue(headerMetadataNode["includedText"], "pyCaption");
        } else if (headerMetadataNode["hIconSrcType"] === 'textproperty') {
            headerMetadata.bIconPresent = false;
            headerMetadata.includedText = pega.ui.TemplateEngine.getCurrentContext().getLocalizedValue(headerMetadataNode["includedTextProperty"], "pyCaption");
        }
      }
      
        
        if (headerMetadataNode.tooltip) {
            /* BUG-352837 : used getLocalizedValue api for tooltip */
            if (headerMetadataNode["pyIsLocalized"] && headerMetadataNode["pyIsLocalized"] == "true") {
                headerMetadata.tooltip = pega.ui.TemplateEngine.getCurrentContext().getLocalizedValue(headerMetadataNode.tooltip, "pyActionPrompt");
            } else {
                headerMetadata.tooltip = headerMetadataNode.tooltip;
            }
        }

        headerMetadata.ariaLabelledby = "headerlabel" + Math.floor((Math.random() * 10000) + 1);
        headerMetadata.tabIndex = headerMetadata.bHeaderTypeCollapsible == true ? "0" : "-1";
      
        if(containerMetadataNode){
          if(containerMetadataNode.ariaLabelledby) headerMetadata.ariaLabelledby = containerMetadataNode.ariaLabelledby;
          headerMetadata.lgChild = containerMetadataNode.lgChild;
          if(containerMetadataNode.ariaControl) headerMetadata.ariaControl = containerMetadataNode.ariaControl;
        } 

        if (headerMetadata.pyIsDirectChildLayoutGroup) {
            headerMetadata.className = "header";
        } else {
            headerMetadata.className = "header header-bar clearfix";
        }

       var headerCustomClass= pega.ui.TemplateEngine.getCurrentContext().getPropertyValue(headerMetadataNode.pyHeaderCustomClass);
       headerMetadata.className +=headerCustomClass?" "+headerCustomClass:"";
        this.processHeaderCells(headerMetadataNode, headerMetadata);
      
         if (containerMetadataNode && containerMetadataNode["pyExpressionId_BV"]) {
                headerMetadata.pyExpressionIdMeta = pega.ui.ExpressionEvaluator.getExpressionMetaToStamp (containerMetadataNode["pyExpressionId_BV"]);
                var expressionResult = pega.ui.ExpressionEvaluator.evaluateClientExpressions(containerMetadataNode["pyExpressionId_BV"]);
                var show_when = expressionResult && expressionResult[pega.ui.ExpressionEvaluator.SHOW_WHEN];
                   headerMetadata.bBodyVisible = typeof show_when == 'undefined' ? false : show_when;
                   //headerMetadata.bBodyVisible=true;
                 if (headerMetadataNode["pyHeaderType"] == "COLLAPSIBLE") {
                     headerMetadata.bExpanded=true;
                 }
         
       }
        if(containerMetadataNode && containerMetadataNode.pyNumberedAccordion == "true"){
          /* number localization */
          var locNumArry;
          if(pega && pega.DateTimeUtil && pega.DateTimeUtil.Locale && pega.DateTimeUtil.Locale.LOCAL_DATE_ARRAY)
            locNumArry = pega.DateTimeUtil.Locale.LOCAL_DATE_ARRAY.replace(/"/g, "").replace(/\[/g, "").replace(/\]/g, "").split(",");
          var numberIndexTextInLng = locNumArry[containerMetadataNode.pyLGCellIndex];
          /*var numberIndexTextInLng = pega.u.d.fieldValuesList.get(containerMetadataNode.pyLGNumbercellIndex);// Locale.LOCAL_DATE_ARRAY[containerMetadataNode.pyLGNumbercellIndex] ;*/
          headerMetadata.pyLGCellIndex = containerMetadataNode.pyLGCellIndex;
          headerMetadata.pyLGCellIndexText = numberIndexTextInLng ? numberIndexTextInLng : containerMetadataNode.pyLGCellIndex;
          headerMetadata.pyNumberedAccordion = containerMetadataNode.pyNumberedAccordion;
          //headerMetadata.pyCustomCSS = containerMetadataNode.pyCustomCSS;
        }
        //headerMetadata.pyNumberedAccordion = true;
        return headerMetadata;
    },

    processHeaderCells: function(headerMetadataNode, headerMetadata) {

        var headerCells = pega.ui.TemplateEngine.getTemplates(headerMetadataNode);
        if (headerCells) {
            // Header cells are present
            headerMetadata.headerCells = [];
            var threadName = "";
            if (headerMetadataNode["pyThreadName"]) {
                threadName = headerMetadataNode["pyThreadName"];
            }

            // TODO: Loop thru cells
            // var iterator = headerCells.iterator();
            var cellCount = 0;

            //while (iterator.hasNext()) {
            for (var index in headerCells) {
                var headerCell = headerCells[index];

                // In case of server-side visible when
                if (headerCell && headerCell["pyName"] == "pxVisible" && headerCell.pyTemplates) {
                    headerCell = headerCell.pyTemplates[0];
                }
                // Check for cell visibility
                var isCellVisible = headerCell["pyVisibility"] != false;

                /* Currently, the value of headerCell will be null when there is a non-template component */
                if (headerCell["pyName"] == "pxHeaderCell" && isCellVisible) {
                    if (headerCell && headerCell["pyTemplates"]) {
                        var headerCellMeta = {
                            noWrapClass: headerCell["pyNoWrapClass"] ? headerCell["pyNoWrapClass"] : '',
                            dataRelPath: "data-template",
                            outerStyle: headerCell["pyStyle"],
                            inspectorData: headerCell["pyInspectorData"] ? headerCell["pyInspectorData"].replace(/"/g, "") : "",
                            pyWrap: (headerCell["pyWrap"] === "true") ? false : (headerCell["pyWrap"] === "false" ? true : ""),
                            pyRenderedStyle: headerCell["pyRenderedStyle"],
                            cellMarkup: pega.ui.template.RenderingEngine.getRenderer(
                                headerCell["pyTemplates"][0]["pyName"]
                            )(headerCell["pyTemplates"][0])
                        };
                        if (headerCell["pyTourId"]) {
                            headerCellMeta.pyTourId = headerCell["pyTourId"];
                        }
                        if (headerCell["pyExpressionId"]) {
                            headerCellMeta.pyExpressionIdMeta = pega.ui.ExpressionEvaluator.getExpressionMetaToStamp(headerCell["pyExpressionId"]);
                            headerCellMeta.pyHide = true;
                            var expressionResult = pega.ui.ExpressionEvaluator.evaluateClientExpressions(headerCell["pyExpressionId"]);
                            if (expressionResult && expressionResult[pega.ui.ExpressionEvaluator.SHOW_WHEN] == true) {
                                headerCellMeta.pyHide = false;
                            }
                        }
                        headerMetadata.headerCells.push(headerCellMeta);
                    } else {
                        headerMetadata.headerCells.push({
                            noWrapClass: headerCell["pyNoWrapClass"] || '',
                            /* TODO: Move to handlebars template */
                            dataRelPath: "data-template",
                            outerStyle: headerCell["pyStyle"],
                            cellMarkup: "<!-- Non-template component will not render inside header cell -->"
                        });
                    }
                }
            }
        }
    },
    onclickHandler_Header: function(expandElement, event, container, bFromKeyboard) {
        var expandIcon = pega.ctx.dom.querySelector(".header-left .icon", event.currentTarget);
        if (expandIcon) {
            var display = window.getComputedStyle(expandIcon, null).getPropertyValue("display");
            if (display == "none")
                return;
        }
        expandHeader(expandElement, event, container, bFromKeyboard);

        // BUG-307284: If collapsible container contains rdl, re-attach scroll events
        var collapsibleNode = expandElement.parentNode;
        if (collapsibleNode.classList) {
            var expanded = collapsibleNode.classList.contains("Expanded");
            if (expanded) {
                var rdlBodyScrollNodes = pega.ctx.dom.querySelectorAll("[data-repeat-source].progressive-bodyScroll", collapsibleNode.parentNode);
                if (rdlBodyScrollNodes.length > 0) {
                    pega.ui.RDL.attachScrollEvents("bodyScroll");
                }
            }
        }
        // No fallback for older browsers
    },
    onkeydownHandler_Header: function(expandElement, event, container, bFromKeyboard) {

        this.onclickHandler_Header(expandElement, event, container, bFromKeyboard);
    }
};
/* Renderer */
pega.ui.template.RenderingEngine.register("pxLayoutHeader", function(headerMetadataNode, containerMetadataNode) {
    var headerMetadata = pega.ui.template.pxLayoutHeader.processHeaderComponentInfo(headerMetadataNode, containerMetadataNode);
    return Handlebars.partials['pxLayoutHeader'](headerMetadata);
});
//static-content-hash-trigger-GCC
/* Header Content partial */
/*
{{~#unless pyIsDirectChildLayoutGroup~}}
<div  class="header-left" {{#if bHeaderTypeCollapsible}} title = "{{#ifCond pyTitleType '==' "Property"}}{{headerTitle}}{{else}}{{{headerTitle}}}{{/ifCond}}" {{/if}}>
  {{#if (ifCond (ifCond openCloseIcon 'eq' true) 'and' (ifCond isLayoutBodyVisible 'eq' true)) }}
    <i  {{pyExpressionIdMeta}} style=" {{#if (ifCond bBodyVisible 'eq' false)}}display:none;{{/if}}" class="{{CONSTANTS.OPENCLOSEICON_CLASSNAME}}"></i>
  {{/if}}
</div>
<div class="{{CONSTANTS.HEADERCONTENT_CLASSNAME}}" {{{pyFieldValueMeta}}}>{{~/unless~}}{{#ifCond pyNumberedAccordion '==' "true"}}<div class="number-accordion-navigation"><div class="number-accordion-circle" num-index = {{pyLGCellIndex}} data-keydown="[[&quot;runScript&quot;, [&quot;LayoutGroupModule.expandAccordionPane(event)&quot;],,&quot;enter&quot;]]" >{{pyLGCellIndexText}}</div></div>{{/ifCond}}{{~#if bIconPresent~}}
    <span class="header-element {{#if pyIsDirectChildLayoutGroup}}layout-group-item-title{{/if}}">{{#if pyIsDirectChildLayoutGroup}}<i class="{{CONSTANTS.OPENCLOSEICON_CLASSNAME}}"></i>{{/if}}
        <img src="{{imgSrc}}" alt="{{imgTitle}}" title="{{imgTitle}}">
    </span>
    {{~/if~}}<{{headingLevel}} {{#if pyIsDirectChildLayoutGroup}}
      class="layout-group-item-title" {{{pyLGBehaviorPropertiesCount}}}
  {{else}}
      class="{{CONSTANTS.HEADERTITLE_CLASSNAME}}"
  {{/if}} {{#if_not_eq lgChild "true" }} id="{{ariaLabelledby}}" {{/if_not_eq}}> {{~#if bHeaderTypeCollapsible~}} <div role="button" class="dl-accordion-btn" tabIndex="{{tabIndex}}" aria-expanded="{{#if bExpanded}}true{{else}}false{{/if}}" > {{~/if~}}{{~#if (ifCond (ifCond pyIsDirectChildLayoutGroup 'eq' true) 'and' (ifCond bIconPresent 'neq' true)) ~}}
        <i class="{{CONSTANTS.OPENCLOSEICON_CLASSNAME}}"></i>{{~/if~}}{{#ifCond pyTitleType '==' "Property"}}{{headerTitle}}{{else}}{{{headerTitle}}}{{/ifCond}}{{#if_eq bIconPresent false}}<span class="text-secondary">{{includedText}}</span>{{/if_eq}} {{~#if bHeaderTypeCollapsible~}} </div> {{~/if~}}</{{headingLevel}}>
        {{~#each headerCells~}}
    <span {{getTemplateMarker}} class="header-element header-title-table {{noWrapClass}} {{pyRenderedStyle}}" style="{{outerStyle}} {{#if pyHide}}display:none;{{/if}}" {{{pyTourId}}} {{pyExpressionIdMeta}} {{inspectorData}}>
        {{#if pyWrap}}
        <nobr>
        {{/if}}
        {{{cellMarkup}}}
         {{#if pyWrap}}
        </nobr>
        {{/if}}
    </span>{{~/each~}}{{!-- {{#unless pyIsDirectChildLayoutGroup}}<span class="header-element header-title-table"></span>{{/unless}} --}}{{{pyFieldValueInspectorData}}}{{#unless pyIsDirectChildLayoutGroup}}</div><div class="header-right">{{!-- TODO --}}</div>{{/unless}}
*/

/* Compiled JS */
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
Handlebars.partials['pxHeaderContent'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div  class=\"header-left\" "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"bHeaderTypeCollapsible") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":26},"end":{"line":2,"column":165}}})) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"openCloseIcon") : depth0),"eq",true,{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":3,"column":16},"end":{"line":3,"column":48}}}),"and",(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isLayoutBodyVisible") : depth0),"eq",true,{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":3,"column":55},"end":{"line":3,"column":93}}}),{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":94}}}),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":2},"end":{"line":5,"column":9}}})) != null ? stack1 : "")
    + "</div>\n<div class=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"CONSTANTS") : depth0)) != null ? lookupProperty(stack1,"HEADERCONTENT_CLASSNAME") : stack1), depth0))
    + "\" "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyFieldValueMeta") || (depth0 != null ? lookupProperty(depth0,"pyFieldValueMeta") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyFieldValueMeta","hash":{},"data":data,"loc":{"start":{"line":7,"column":51},"end":{"line":7,"column":73}}}) : helper))) != null ? stack1 : "")
    + ">";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " title = \""
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyTitleType") : depth0),"==","Property",{"name":"ifCond","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data,"loc":{"start":{"line":2,"column":66},"end":{"line":2,"column":156}}})) != null ? stack1 : "")
    + "\" ";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"headerTitle") || (depth0 != null ? lookupProperty(depth0,"headerTitle") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"headerTitle","hash":{},"data":data,"loc":{"start":{"line":2,"column":105},"end":{"line":2,"column":120}}}) : helper)));
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = ((helper = (helper = lookupProperty(helpers,"headerTitle") || (depth0 != null ? lookupProperty(depth0,"headerTitle") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"headerTitle","hash":{},"data":data,"loc":{"start":{"line":2,"column":128},"end":{"line":2,"column":145}}}) : helper))) != null ? stack1 : "");
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <i  "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyExpressionIdMeta") || (depth0 != null ? lookupProperty(depth0,"pyExpressionIdMeta") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyExpressionIdMeta","hash":{},"data":data,"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":30}}}) : helper)))
    + " style=\" "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"bBodyVisible") : depth0),"eq",false,{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":4,"column":45},"end":{"line":4,"column":77}}}),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":39},"end":{"line":4,"column":99}}})) != null ? stack1 : "")
    + "\" class=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"CONSTANTS") : depth0)) != null ? lookupProperty(stack1,"OPENCLOSEICON_CLASSNAME") : stack1), depth0))
    + "\"></i>\n";
},"8":function(container,depth0,helpers,partials,data) {
    return "display:none;";
},"10":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"number-accordion-navigation\"><div class=\"number-accordion-circle\" num-index = "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyLGCellIndex") || (depth0 != null ? lookupProperty(depth0,"pyLGCellIndex") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyLGCellIndex","hash":{},"data":data,"loc":{"start":{"line":7,"column":220},"end":{"line":7,"column":237}}}) : helper)))
    + " data-keydown=\"[[&quot;runScript&quot;, [&quot;LayoutGroupModule.expandAccordionPane(event)&quot;],,&quot;enter&quot;]]\" >"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyLGCellIndexText") || (depth0 != null ? lookupProperty(depth0,"pyLGCellIndexText") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyLGCellIndexText","hash":{},"data":data,"loc":{"start":{"line":7,"column":359},"end":{"line":7,"column":380}}}) : helper)))
    + "</div></div>";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class=\"header-element "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyIsDirectChildLayoutGroup") : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":32},"end":{"line":8,"column":96}}})) != null ? stack1 : "")
    + "\">"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyIsDirectChildLayoutGroup") : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":98},"end":{"line":8,"column":192}}})) != null ? stack1 : "")
    + "\n        <img src=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"imgSrc") || (depth0 != null ? lookupProperty(depth0,"imgSrc") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"imgSrc","hash":{},"data":data,"loc":{"start":{"line":9,"column":18},"end":{"line":9,"column":28}}}) : helper)))
    + "\" alt=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"imgTitle") || (depth0 != null ? lookupProperty(depth0,"imgTitle") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"imgTitle","hash":{},"data":data,"loc":{"start":{"line":9,"column":35},"end":{"line":9,"column":47}}}) : helper)))
    + "\" title=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"imgTitle") || (depth0 != null ? lookupProperty(depth0,"imgTitle") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"imgTitle","hash":{},"data":data,"loc":{"start":{"line":9,"column":56},"end":{"line":9,"column":68}}}) : helper)))
    + "\">\n    </span>";
},"13":function(container,depth0,helpers,partials,data) {
    return "layout-group-item-title";
},"15":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<i class=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"CONSTANTS") : depth0)) != null ? lookupProperty(stack1,"OPENCLOSEICON_CLASSNAME") : stack1), depth0))
    + "\"></i>";
},"17":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n      class=\"layout-group-item-title\" "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyLGBehaviorPropertiesCount") || (depth0 != null ? lookupProperty(depth0,"pyLGBehaviorPropertiesCount") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyLGBehaviorPropertiesCount","hash":{},"data":data,"loc":{"start":{"line":12,"column":38},"end":{"line":12,"column":71}}}) : helper))) != null ? stack1 : "")
    + "\n";
},"19":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      class=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"CONSTANTS") : depth0)) != null ? lookupProperty(stack1,"HEADERTITLE_CLASSNAME") : stack1), depth0))
    + "\"\n  ";
},"21":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " id=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"ariaLabelledby") || (depth0 != null ? lookupProperty(depth0,"ariaLabelledby") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"ariaLabelledby","hash":{},"data":data,"loc":{"start":{"line":15,"column":45},"end":{"line":15,"column":63}}}) : helper)))
    + "\" ";
},"23":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div role=\"button\" class=\"dl-accordion-btn\" tabIndex=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"tabIndex") || (depth0 != null ? lookupProperty(depth0,"tabIndex") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"tabIndex","hash":{},"data":data,"loc":{"start":{"line":15,"column":168},"end":{"line":15,"column":180}}}) : helper)))
    + "\" aria-expanded=\""
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"bExpanded") : depth0),{"name":"if","hash":{},"fn":container.program(24, data, 0),"inverse":container.program(26, data, 0),"data":data,"loc":{"start":{"line":15,"column":197},"end":{"line":15,"column":238}}})) != null ? stack1 : "")
    + "\">";
},"24":function(container,depth0,helpers,partials,data) {
    return "true";
},"26":function(container,depth0,helpers,partials,data) {
    return "false";
},"28":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span class=\"text-secondary\">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"includedText") || (depth0 != null ? lookupProperty(depth0,"includedText") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"includedText","hash":{},"data":data,"loc":{"start":{"line":16,"column":218},"end":{"line":16,"column":234}}}) : helper)))
    + "</span>";
},"30":function(container,depth0,helpers,partials,data) {
    return "</div>";
},"32":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"getTemplateMarker") || (depth0 != null ? lookupProperty(depth0,"getTemplateMarker") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"getTemplateMarker","hash":{},"data":data,"loc":{"start":{"line":18,"column":10},"end":{"line":18,"column":31}}}) : helper)))
    + " class=\"header-element header-title-table "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"noWrapClass") || (depth0 != null ? lookupProperty(depth0,"noWrapClass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"noWrapClass","hash":{},"data":data,"loc":{"start":{"line":18,"column":73},"end":{"line":18,"column":88}}}) : helper)))
    + " "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyRenderedStyle") || (depth0 != null ? lookupProperty(depth0,"pyRenderedStyle") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyRenderedStyle","hash":{},"data":data,"loc":{"start":{"line":18,"column":89},"end":{"line":18,"column":108}}}) : helper)))
    + "\" style=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"outerStyle") || (depth0 != null ? lookupProperty(depth0,"outerStyle") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"outerStyle","hash":{},"data":data,"loc":{"start":{"line":18,"column":117},"end":{"line":18,"column":131}}}) : helper)))
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyHide") : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":18,"column":132},"end":{"line":18,"column":166}}})) != null ? stack1 : "")
    + "\" "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyTourId") || (depth0 != null ? lookupProperty(depth0,"pyTourId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyTourId","hash":{},"data":data,"loc":{"start":{"line":18,"column":168},"end":{"line":18,"column":182}}}) : helper))) != null ? stack1 : "")
    + " "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyExpressionIdMeta") || (depth0 != null ? lookupProperty(depth0,"pyExpressionIdMeta") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyExpressionIdMeta","hash":{},"data":data,"loc":{"start":{"line":18,"column":183},"end":{"line":18,"column":205}}}) : helper)))
    + " "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"inspectorData") || (depth0 != null ? lookupProperty(depth0,"inspectorData") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"inspectorData","hash":{},"data":data,"loc":{"start":{"line":18,"column":206},"end":{"line":18,"column":223}}}) : helper)))
    + ">\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyWrap") : depth0),{"name":"if","hash":{},"fn":container.program(33, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":19,"column":8},"end":{"line":21,"column":15}}})) != null ? stack1 : "")
    + "        "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"cellMarkup") || (depth0 != null ? lookupProperty(depth0,"cellMarkup") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"cellMarkup","hash":{},"data":data,"loc":{"start":{"line":22,"column":8},"end":{"line":22,"column":24}}}) : helper))) != null ? stack1 : "")
    + "\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyWrap") : depth0),{"name":"if","hash":{},"fn":container.program(35, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":23,"column":9},"end":{"line":25,"column":15}}})) != null ? stack1 : "")
    + "    </span>";
},"33":function(container,depth0,helpers,partials,data) {
    return "        <nobr>\n";
},"35":function(container,depth0,helpers,partials,data) {
    return "        </nobr>\n";
},"37":function(container,depth0,helpers,partials,data) {
    return "</div><div class=\"header-right\"></div>";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"unless").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyIsDirectChildLayoutGroup") : depth0),{"name":"unless","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":7,"column":87}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyNumberedAccordion") : depth0),"==","true",{"name":"ifCond","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":87},"end":{"line":7,"column":403}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"bIconPresent") : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":403},"end":{"line":11,"column":13}}})) != null ? stack1 : "")
    + "<"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"headingLevel") || (depth0 != null ? lookupProperty(depth0,"headingLevel") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"headingLevel","hash":{},"data":data,"loc":{"start":{"line":11,"column":14},"end":{"line":11,"column":30}}}) : helper)))
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyIsDirectChildLayoutGroup") : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.program(19, data, 0),"data":data,"loc":{"start":{"line":11,"column":31},"end":{"line":15,"column":9}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = (lookupProperty(helpers,"if_not_eq")||(depth0 && lookupProperty(depth0,"if_not_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"lgChild") : depth0),"true",{"name":"if_not_eq","hash":{},"fn":container.program(21, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":10},"end":{"line":15,"column":79}}})) != null ? stack1 : "")
    + ">"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"bHeaderTypeCollapsible") : depth0),{"name":"if","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":81},"end":{"line":15,"column":250}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyIsDirectChildLayoutGroup") : depth0),"eq",true,{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":15,"column":265},"end":{"line":15,"column":310}}}),"and",(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"bIconPresent") : depth0),"neq",true,{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":15,"column":317},"end":{"line":15,"column":349}}}),{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":15,"column":257},"end":{"line":15,"column":350}}}),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":250},"end":{"line":16,"column":70}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyTitleType") : depth0),"==","Property",{"name":"ifCond","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data,"loc":{"start":{"line":16,"column":70},"end":{"line":16,"column":160}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"bIconPresent") : depth0),false,{"name":"if_eq","hash":{},"fn":container.program(28, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":16,"column":160},"end":{"line":16,"column":251}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"bHeaderTypeCollapsible") : depth0),{"name":"if","hash":{},"fn":container.program(30, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":16,"column":252},"end":{"line":16,"column":301}}})) != null ? stack1 : "")
    + "</"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"headingLevel") || (depth0 != null ? lookupProperty(depth0,"headingLevel") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"headingLevel","hash":{},"data":data,"loc":{"start":{"line":16,"column":303},"end":{"line":16,"column":319}}}) : helper)))
    + ">"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"headerCells") : depth0),{"name":"each","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":17,"column":8},"end":{"line":26,"column":22}}})) != null ? stack1 : "")
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyFieldValueInspectorData") || (depth0 != null ? lookupProperty(depth0,"pyFieldValueInspectorData") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyFieldValueInspectorData","hash":{},"data":data,"loc":{"start":{"line":26,"column":137},"end":{"line":26,"column":168}}}) : helper))) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"unless").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyIsDirectChildLayoutGroup") : depth0),{"name":"unless","hash":{},"fn":container.program(37, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":26,"column":168},"end":{"line":26,"column":270}}})) != null ? stack1 : "");
},"useData":true});
})();
//static-content-hash-trigger-GCC
/* Layout Body partial */
/*
{{~#if bExpandedLazyLoad~}}<div data-template class='lazyload-layout' data-deferinvoke='{{containerOuter.layoutMethodName}}' >{{{layoutMarkup}}}</div>
{{~else~}}{{{layoutMarkup}}}{{~/if~}}
*/


/* Compiled JS */
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
Handlebars.partials['pxLayoutBody'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div data-template class='lazyload-layout' data-deferinvoke='"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"containerOuter") : depth0)) != null ? lookupProperty(stack1,"layoutMethodName") : stack1), depth0))
    + "' >"
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"layoutMarkup") || (depth0 != null ? lookupProperty(depth0,"layoutMarkup") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"layoutMarkup","hash":{},"data":data,"loc":{"start":{"line":1,"column":126},"end":{"line":1,"column":144}}}) : helper))) != null ? stack1 : "")
    + "</div>";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = ((helper = (helper = lookupProperty(helpers,"layoutMarkup") || (depth0 != null ? lookupProperty(depth0,"layoutMarkup") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"layoutMarkup","hash":{},"data":data,"loc":{"start":{"line":2,"column":10},"end":{"line":2,"column":28}}}) : helper))) != null ? stack1 : "");
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"bExpandedLazyLoad") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":2,"column":37}}})) != null ? stack1 : "");
},"useData":true});
})();
//static-content-hash-trigger-GCC
/*
<div bsimplelayout='true' {{getTemplateMarker}} class='{{pyCustomClass}}'
{{#if hasAction}} tabindex='0'{{~/if~}}
{{~#ifCond pySubscriptionId '!=' ""~}} data-subscription-id='{{pySubscriptionId}}' data-ack-enabled='{{pyIsChannelAckEnabled}}'{{~/ifCond~}}
 {{#ifCond pyAutomationId '!=' "" }} data-test-id="{{pyAutomationId}}" {{/ifCond}}
{{~#ifCond pyInlineStyle '!=' ""~}}style='{{pyInlineStyle}}'{{~/ifCond~}} 
{{{pyInspectorMetaData}}} {{~#if addAction~}} {{{pyActionString}}} {{~/if~}} {{~#ifCond pyAriaRole '!=' ""~}} role='{{pyAriaRole}}' {{~/ifCond~}} {{pyDataSkipTarget}} {{{pyAriaLabel}}} {{pyExpressionIdMeta}} {{#if (ifCond (ifCond isRefreshExpr 'eq' true) 'or' (ifCond pyRefreshWhenActive 'eq' true)) }}data-refresh='true' {{/if}} data-methodName='{{methodName}}' {{pyRelativePath}} {{{pyHideColumns}}}  >{{{getDLCellWrapper cellsTemplatePage}}}</div>
*/

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
templates['pzpega_ui_DLTemplate'] = template({"1":function(container,depth0,helpers,partials,data) {
    return " tabindex='0'";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "data-subscription-id='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pySubscriptionId") || (depth0 != null ? lookupProperty(depth0,"pySubscriptionId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pySubscriptionId","hash":{},"data":data,"loc":{"start":{"line":3,"column":61},"end":{"line":3,"column":81}}}) : helper)))
    + "' data-ack-enabled='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyIsChannelAckEnabled") || (depth0 != null ? lookupProperty(depth0,"pyIsChannelAckEnabled") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyIsChannelAckEnabled","hash":{},"data":data,"loc":{"start":{"line":3,"column":101},"end":{"line":3,"column":126}}}) : helper)))
    + "'";
},"5":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " data-test-id=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyAutomationId") || (depth0 != null ? lookupProperty(depth0,"pyAutomationId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyAutomationId","hash":{},"data":data,"loc":{"start":{"line":4,"column":51},"end":{"line":4,"column":69}}}) : helper)))
    + "\" ";
},"7":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "style='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyInlineStyle") || (depth0 != null ? lookupProperty(depth0,"pyInlineStyle") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyInlineStyle","hash":{},"data":data,"loc":{"start":{"line":5,"column":42},"end":{"line":5,"column":59}}}) : helper)))
    + "'";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyActionString") || (depth0 != null ? lookupProperty(depth0,"pyActionString") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyActionString","hash":{},"data":data,"loc":{"start":{"line":6,"column":46},"end":{"line":6,"column":66}}}) : helper))) != null ? stack1 : "");
},"11":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "role='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyAriaRole") || (depth0 != null ? lookupProperty(depth0,"pyAriaRole") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyAriaRole","hash":{},"data":data,"loc":{"start":{"line":6,"column":116},"end":{"line":6,"column":130}}}) : helper)))
    + "'";
},"13":function(container,depth0,helpers,partials,data) {
    return "data-refresh='true' ";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div bsimplelayout='true' "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"getTemplateMarker") || (depth0 != null ? lookupProperty(depth0,"getTemplateMarker") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"getTemplateMarker","hash":{},"data":data,"loc":{"start":{"line":1,"column":26},"end":{"line":1,"column":47}}}) : helper)))
    + " class='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyCustomClass") || (depth0 != null ? lookupProperty(depth0,"pyCustomClass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyCustomClass","hash":{},"data":data,"loc":{"start":{"line":1,"column":55},"end":{"line":1,"column":72}}}) : helper)))
    + "'\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"hasAction") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":0},"end":{"line":2,"column":39}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pySubscriptionId") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":0},"end":{"line":3,"column":140}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyAutomationId") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":1},"end":{"line":4,"column":82}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyInlineStyle") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":0},"end":{"line":5,"column":73}}})) != null ? stack1 : "")
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyInspectorMetaData") || (depth0 != null ? lookupProperty(depth0,"pyInspectorMetaData") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyInspectorMetaData","hash":{},"data":data,"loc":{"start":{"line":6,"column":0},"end":{"line":6,"column":25}}}) : helper))) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"addAction") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":26},"end":{"line":6,"column":76}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyAriaRole") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":77},"end":{"line":6,"column":145}}})) != null ? stack1 : "")
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyDataSkipTarget") || (depth0 != null ? lookupProperty(depth0,"pyDataSkipTarget") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyDataSkipTarget","hash":{},"data":data,"loc":{"start":{"line":6,"column":146},"end":{"line":6,"column":166}}}) : helper)))
    + " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyAriaLabel") || (depth0 != null ? lookupProperty(depth0,"pyAriaLabel") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyAriaLabel","hash":{},"data":data,"loc":{"start":{"line":6,"column":167},"end":{"line":6,"column":184}}}) : helper))) != null ? stack1 : "")
    + " "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyExpressionIdMeta") || (depth0 != null ? lookupProperty(depth0,"pyExpressionIdMeta") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyExpressionIdMeta","hash":{},"data":data,"loc":{"start":{"line":6,"column":185},"end":{"line":6,"column":207}}}) : helper)))
    + " "
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isRefreshExpr") : depth0),"eq",true,{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":6,"column":222},"end":{"line":6,"column":254}}}),"or",(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyRefreshWhenActive") : depth0),"eq",true,{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":6,"column":260},"end":{"line":6,"column":298}}}),{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":6,"column":214},"end":{"line":6,"column":299}}}),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":208},"end":{"line":6,"column":329}}})) != null ? stack1 : "")
    + " data-methodName='"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"methodName") || (depth0 != null ? lookupProperty(depth0,"methodName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"methodName","hash":{},"data":data,"loc":{"start":{"line":6,"column":347},"end":{"line":6,"column":361}}}) : helper)))
    + "' "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyRelativePath") || (depth0 != null ? lookupProperty(depth0,"pyRelativePath") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyRelativePath","hash":{},"data":data,"loc":{"start":{"line":6,"column":363},"end":{"line":6,"column":381}}}) : helper)))
    + " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyHideColumns") || (depth0 != null ? lookupProperty(depth0,"pyHideColumns") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyHideColumns","hash":{},"data":data,"loc":{"start":{"line":6,"column":382},"end":{"line":6,"column":401}}}) : helper))) != null ? stack1 : "")
    + "  >"
    + ((stack1 = (lookupProperty(helpers,"getDLCellWrapper")||(depth0 && lookupProperty(depth0,"getDLCellWrapper"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"cellsTemplatePage") : depth0),{"name":"getDLCellWrapper","hash":{},"data":data,"loc":{"start":{"line":6,"column":404},"end":{"line":6,"column":444}}})) != null ? stack1 : "")
    + "</div>";
},"useData":true});
})();


pega.ui.template.processCell = function(labelCell, cell, type) {
    var config = cell[type];
    for (var prop in config) {
        if (prop == "forLabel" || prop == "pyLabelValue")
            labelCell[prop] = config[prop];
        else
            cell[prop] = config[prop];
    }
    if (type == "endDateConfig") {
        cell["renderType"] = "endDate";
    } else {
        cell["renderType"] = "startDate";
    }

};

pega.ui.TemplateEngine.registerHelper("getDLCellWrapper", function(templates) {
    var cellsMarkup = "";
    if (templates) {
        for (var i = 0; i < templates.length; i++) {
            var template = templates[i];
            
            var labelCell = template.pyCell;
            if (template.pyTemplates) {
                var cellTemplate = template.pyTemplates[0];
                if (cellTemplate && cellTemplate.pyName == "pxVisible") {
                  cellTemplate = pega.ui.TemplateEngine.getTemplates(cellTemplate);
                  cellTemplate = cellTemplate && cellTemplate[0];
                }
                if(cellTemplate){
                  var cell = cellTemplate.pyCell;
                  var dateRangeEndCell;
                  var controlName = cellTemplate.pyName;
                  var isDateRangeControl = (controlName == "pxDateRange") || (cell && cell.dateType == "daterange");
                  if (isDateRangeControl) { /*US-242930: in case of daterange, creating a new cell for end date*/
                      var pzLiveDesignViewContainer = $("[data-portalharnessinsname$=pzLiveDesignViewContainer]");
                      dateRangeEndCell = JSON.parse(JSON.stringify(cell));
                      pega.ui.template.processCell(labelCell, cell, "startDateConfig");
                      /* If the date range markup for design templete then set the attribute data-control-id */
                      if(pzLiveDesignViewContainer && pzLiveDesignViewContainer.length ){
                           var randomNumber = Math.random();
                           var controlmarkup;
                           controlmarkup = $(Handlebars.helpers.getDLCell(templates, i).string);
                           controlmarkup.attr("data-control-id", controlName + randomNumber);
                           cellsMarkup += new Handlebars.SafeString(controlmarkup.get(0).outerHTML);
                      }else{
                           cellsMarkup += Handlebars.helpers.getDLCell(templates, i);
                      }
                  }
                  else {
                    cellsMarkup += Handlebars.helpers.getDLCell(templates, i);
                  }
                  if (isDateRangeControl) {
                      pega.ui.template.processCell(labelCell, dateRangeEndCell, "endDateConfig");
                      cellTemplate.pyCell = dateRangeEndCell;
                      /* If the date range markup for design templete then set the attribute data-control-id */
                      if(pzLiveDesignViewContainer && pzLiveDesignViewContainer.length ){
                           controlmarkup = $(Handlebars.helpers.getDLCell(templates, i).string);
                           controlmarkup.attr("data-control-id", controlName + randomNumber);
                           cellsMarkup += new Handlebars.SafeString(controlmarkup.get(0).outerHTML);
                      }else{
                           cellsMarkup += Handlebars.helpers.getDLCell(templates, i);
                      }
                  }
                }else{
                  cellsMarkup += Handlebars.helpers.getDLCell(templates, i);
                }
            } else {
                cellsMarkup += Handlebars.helpers.getDLCell(templates, i);
            }
        }
    }
    return cellsMarkup;
});

pega.ui.TemplateEngine.registerHelper("getDLCell", function(cellsTemplatePage, index) {
    var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;

    if (cellsTemplatePage[index]) {
        var childNode = cellsTemplatePage[index];
        if (childNode) {
            var childTemplateName = childNode[TEMPLATE_CONSTANTS["PYNAME"]];
            if (childTemplateName) {
                var renderer = pega.ui.template.RenderingEngine.getRenderer(childTemplateName);
                var out;
                if (typeof renderer == "function") {

                    out = renderer(childNode);
                } else {
                    console.error("Cannot find renderer for: " + childTemplateName);
                }
                // var out =  pega.ui.template.RenderingEngine.getRenderer(childTemplateName).call(null,new pega.ui.TemplateTreeNode(childNode));

                /*if((cellsTemplatePage.length-1) == index){
                  	gPop = "yes";
              	}*/
                return new Handlebars.SafeString(out);
            }
        }
    }
});

/*-------------------- To be used to generate wrapper divs once grid is templatised------------ */
/*Handlebars.registerHelper("isIE11", function(a) {
    return pega.util.Event.isIE && 11 == pega.util.Event.isIE ? !0 : !1
});*/

if (pega.ui.gStackOrder == undefined || typeof(pega.ui.gStackOrder) == "undefined") {
    pega.ui.gStackOrder = [];
}
pega.ui.template.RenderingEngine.register("DynamicLayout", function(treeNode, fromReloadCell, asyncRenderCallback) {
    pega.ui.gStackOrder.push(0);
    var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
    //var rwStyles = cellnode[TEMPLATE_CONSTANTS[“PYCUSTOMREADWRITESTYLES”]] || "";
    var componentInfo = treeNode;
    var markup = "";
    if (componentInfo) {
        var cellsTemplatePage = pega.ui.TemplateEngine.getTemplates(componentInfo);
        var addAction = true;

        componentInfo.pyActionString = pega.ui.TemplateEngine.getCurrentContext().getActionString(componentInfo[TEMPLATE_CONSTANTS["PYACTIONSTRINGID"]]);
        if (typeof(componentInfo.pyActionString) === "string") {
            // The below line replacing the ^~ with #~, added this line for backward compatibility, it should be removed with proper investigation.
            componentInfo.pyActionString = componentInfo.pyActionString.replace(/(#|\^)~([a-z.0-9_()$]+)~(#|\^)/gi, function() {
                return "#~" + arguments[2] + "~#";
            });
        }

        /* addAction set to false when pyIsParentLG is true */
        componentInfo.pyActionString && componentInfo && "true" == componentInfo[TEMPLATE_CONSTANTS["PYISPARENTLG"]] && (addAction = !1);

        var inspectorData = (componentInfo && componentInfo[TEMPLATE_CONSTANTS["PYINSPECTORDATA"]]) ? componentInfo[TEMPLATE_CONSTANTS["PYINSPECTORDATA"]].replace(/"/g, "") : "";
        if ("" == inspectorData) {
            inspectorData = (componentInfo && componentInfo[TEMPLATE_CONSTANTS["PYINSPECTORDATA"]]) ? componentInfo[TEMPLATE_CONSTANTS["PYINSPECTORDATA"]].replace(/"/g, "") : "";
        }
        if ("" != inspectorData) {
            var hexaSpace = "&#032;";
            inspectorData = inspectorData.replace(/ /g, hexaSpace);

            var res = inspectorData.split("data-tour-id=");
            inspectorData = res[0] + " ",
                res.length > 1 && (inspectorData += " data-tour-id=" + res[1].replace(/'/g, "") + " ");

        }

        var subscriptionId = "";
        var isChannelAckEnabled = null;
        if (componentInfo['pyFinalSubscriptionId']) {
            subscriptionId = componentInfo['pyFinalSubscriptionId'];
          isChannelAckEnabled = componentInfo.pxSubscriptionIdentifiers.pySubscriptionAck;
          
        }

        var automationId = "";
        if (componentInfo[TEMPLATE_CONSTANTS["PYLAYOUTMODE"]] == "SimpleDiv" && componentInfo[TEMPLATE_CONSTANTS["PYAUTOMATIONID"]]) {
            automationId = componentInfo[TEMPLATE_CONSTANTS["PYAUTOMATIONID"]].trim().replace("data-test-id=", "").replace(/[']+/g, '');
        }
        var ariaLabel = "";
        if(componentInfo[TEMPLATE_CONSTANTS["PYARIALABEL"]]){
          ariaLabel = "aria-label='" + (componentInfo[TEMPLATE_CONSTANTS["PYARIALABEL"]]) + "'";
        }

        var templateObj = {
            metadata: treeNode,
            /*cellsTemplatePage: cellArr,*/
            cellsTemplatePage: cellsTemplatePage,
            pyRelativePath: "data-template",
            pyInspectorMetaData: inspectorData,
            pyCustomClass: componentInfo[TEMPLATE_CONSTANTS["PYCUSTOMCLASS"]] || "",
            pyCustomClassName: componentInfo[TEMPLATE_CONSTANTS["PYCUSTOMCLASSNAME"]] || "",
            pyInlineStyle: componentInfo[TEMPLATE_CONSTANTS["PYINLINESTYLE"]] || "",
            pySubscriptionId: subscriptionId || "",
            pyIsChannelAckEnabled : isChannelAckEnabled || false,
            pyAriaRole: componentInfo[TEMPLATE_CONSTANTS["PYARIAROLE"]] || "",
            pyAriaLabel: ariaLabel,
            pyActionString: componentInfo.pyActionString || "",
            pyDataSkipTarget: componentInfo[TEMPLATE_CONSTANTS["PYDATASKIPTARGET"]] ? componentInfo[TEMPLATE_CONSTANTS["PYDATASKIPTARGET"]].replace(/'/g, "") : "",
            pyHideColumns: componentInfo[TEMPLATE_CONSTANTS["PYHIDECOLUMNS"]] || "",
            pyRW: componentInfo.pyRW ? componentInfo.pyRW : "",
            addAction: addAction,
            pyExpressionIdMeta: pega.ui.ExpressionEvaluator.getExpressionMetaToStamp(componentInfo[TEMPLATE_CONSTANTS["PYEXPRESSIONID"]]),
            pyRefreshWhenActive: componentInfo[TEMPLATE_CONSTANTS["PYREFRESHWHENACTIVE"]] || "",
            methodName: componentInfo[TEMPLATE_CONSTANTS["PYMETHODNAME"]],
            isRefreshExpr: pega.ui.ExpressionEvaluator.isRefreshExpression(componentInfo[TEMPLATE_CONSTANTS["PYEXPRESSIONID"]]),
            pyFormat: componentInfo[TEMPLATE_CONSTANTS["PYFORMAT"]] || "",
            pyFlex: JSON.parse(componentInfo[TEMPLATE_CONSTANTS["PYFLEX"]] || "true"),
            pyAutomationId: automationId
        };

        /* Expression id for show when is populated only in the case of simple div so no check for layout mode is needed here*/
        if (componentInfo["pyExpressionId"]) {
            var expressionResult = pega.ui.ExpressionEvaluator.evaluateClientExpressions(componentInfo["pyExpressionId"]);
            var show_when = expressionResult && expressionResult[pega.ui.ExpressionEvaluator.SHOW_WHEN];
            if (typeof show_when == 'undefined' ? false : !show_when) {
                templateObj.pyInlineStyle += "display:none";
            }


        }

        var isWebsockedSubscriptionConfigured = templateObj.pyActionString && templateObj.pyActionString.trim().startsWith('data-message') && templateObj.pyActionString.trim().lastIndexOf('data-')===0;
        templateObj.hasAction = templateObj.pyCustomClass && templateObj.pyCustomClass.search("has-action") >= 0 && !isWebsockedSubscriptionConfigured;
        templateObj.pyCustomClassName = pega.ui.TemplateEngine.getCurrentContext().getPropertyValue(templateObj.pyCustomClassName);
        templateObj.pyCustomClassName = templateObj.pyCustomClassName ? " " + templateObj.pyCustomClassName : "";
        /* BUG-322542 For column layouts outermost div layout-content-default need not be generated*/
        if (componentInfo[TEMPLATE_CONSTANTS["ISCOLUMNLAYOUT"]] === "true" && templateObj.pyFlex == "flex") {
            templateObj.pyCustomClass = (templateObj.pyFlex ? " flex" : "") + " content " + templateObj.pyCustomClass + templateObj.pyCustomClassName;
        } else {
            templateObj.pyCustomClass = (templateObj.pyFlex ? " flex" : "") + " content layout-content-" + ((templateObj.pyFormat != "") ? templateObj.pyFormat : "default") + " " + ((templateObj.pyFormat != "") ? " content-" + templateObj.pyFormat : "") + " " + templateObj.pyCustomClass + templateObj.pyCustomClassName;
        }

        markup = pega.ui.TemplateEngine.execute('pzpega_ui_DLTemplate', templateObj);
        pega.ui.gStackOrder.pop();
    }
    return markup;
});
//static-content-hash-trigger-GCC
/* Structure */
/*
{{~#ifCond pyFormat '!=' "pxHidden"~}}
<div {{#ifCond pyInlineStyle '!=' ""}} style="{{pyInlineStyle}}" {{/ifCond}} {{{pyBaseRef}}} 
{{pyTourID}} class="{{~#if pyIsLayoutGroup~}}
  {{~pyLGCustomClass~}}
  {{~else~}}
 {{~pyCustomClass~}}
 {{~/if~}} {{~#ifCond pyLabelValue '!=' ""~}} {{~#ifCond pyIsChildNonTemplate '!=' true ~}}{{#ifCond pyRequired '==' true}} required{{/ifCond}}{{/ifCond}}{{/ifCond}}"
string_type="{{pyType}}" RESERVE_SPACE="{{pyReserveSpace}}"
{{pyExpressionIdMeta}} 
{{#if pyIsLayoutGroup}}
  {{{pyLGInspectorData}}} data-lg-child-id="{{pyLGcellIndex}}" data-refreshOnClick="{{pyRefreshWhenActive}}"
  {{else}}
  {{#ifCond pyInspectorMetaData '!=' ""}} {{pyInspectorMetaData}} {{/ifCond}} 
{{/if}}
{{#if (ifCond (ifCond pyFlex 'eq' true) 'or' (ifCond pyLabelReserveSpace 'eq' false)) }}
{{#ifCond pyAccessKey '!=' ""}} {{{pyAccessKey}}} {{/ifCond}}  
{{/if}}
{{#if (ifCond (ifCond pyFlex 'eq' true) 'and' (ifCond pyType 'eq' "label")) }}
{{#ifCond pyAutomationID '!=' ""}} {{pyAutomationID}} {{/ifCond}} 
{{/if}}
{{pyAriaHidden}}  {{pyDataFieldValueMeta}} {{pyRelativePath}}
>{{~#if (ifCond (ifCond pyIsLayoutGroup 'eq' false) 'and' (ifCond genContentInner 'eq' true)) ~}}
      <div {{#ifCond isParaGraphFlex '!=' true}} class="content-inner {{pyFloatClass}}" {{else}} class="flex-paragraph" {{/ifCond}}>
  {{~/if~}}
    {{~#ifCond pyType '==' "label"~}}
    {{~#ifCond pyFlex '==' false ~}}
        <div class="{{pyLabelClassWithoutFlex}}" {{~#ifCond pyAutomationID '!=' ""~}} {{pyAutomationID}} {{~/ifCond~}}>
    {{~/ifCond~}}
        {{~#if pybParam~}}
          <input type="hidden" name="{{pyParamName}}" value="{{pyParamValue}}">{{pyLocalizedParamValue}}
        {{~else~}}
        {{{renderLabel pyLabelValue}}}
        {{~/if~}}
        {{~#ifCond pyFlex '==' false ~}}
        </div>                
        {{~/ifCond~}}
      {{{pyUiFieldValueMeta}}}
    {{~/ifCond~}}
    {{~#ifCond pyType '==' "field"~}}    
      {{#if (ifCond (ifCond pyLabelReserveSpace 'eq' true) 'and' (ifCond pyFormat 'neq' "pxHidden")) }}
      {{~#if pyIsCellReadOnly~}}
        <span {{pyAutomationID}} class="{{pyLabelClass}}" >
      {{~#if pybParam~}}
            <input type="hidden" name="{{pyParamName}}" value="{{pyParamValue}}">{{pyLocalizedParamValue}}
          {{~else~}}
          {{~#ifCond pyLabelValue '!=' ".pyTemplateInputBox"~}} 
             {{~#ifCond pyLabelValue '!=' ""~}} 
               {{~#ifCond pyReqSpanClass '!=' ""~}}
                <span {{#ifCond pyIsCellReadOnly '!=' true }}{{{pyReqSpanClass}}}{{/ifCond}}>{{{pyLabelValue}}}</span>
                {{#ifCond pyIsCellReadOnly '!=' true}}<strong class="required-field-accessibility{{#ifCond pyRequired '==' false}} display-none{{/ifCond}}">{{requiredAccessibilityText}}</strong>{{/ifCond}}
              {{~else~}}
                {{{pyLabelValue}}}
              {{~/ifCond~}}                            
            {{~/ifCond~}} 
          {{~/ifCond~}}
          {{~/if~}}
          {{~#if pyHelperLabel~}}{{~#if pyHelperTextIcon~}}
        <i data-ctl="Icon" class="icons pi pi-help pi-link helper-icon" title="{{{pyHelperVal}}}" onclick="pd(event);" tabindex="-1" role="link" alt="{{pyHelperVal}}"></i>
      {{~/if~}}{{~/if~}}
        </span>
      {{~else~}}
        {{~#if pybParam~}}
          <label {{pyAutomationID}} class="{{pyLabelClass}}" for="{{pyForStrLabel}}"><input type="hidden" name="{{pyParamName}}" value="{{pyParamValue}}">{{pyLocalizedParamValue}}</label>
      {{~#if pyHelperLabel~}}{{~#if pyHelperTextIcon~}}
        <i data-ctl="Icon" class="icons pi pi-help pi-link helper-icon" title="{{{pyHelperVal}}}" onclick="pd(event);" tabindex="-1" role="link" alt="{{pyHelperVal}}"></i>
      {{~/if~}}{{~/if~}}
        {{~else~}}
          {{~#ifCond pyFormat '==' 'pxRichTextEditor'~}}{{~#ifCond pyIsCellReadOnly '!=' true~}}
            <div class='RTELabelWrapper' style="display: flex; justify-content: space-between; width: 100%;">
          {{~/ifCond~}}{{~/ifCond~}}
          <label {{pyAutomationID}} class="{{pyLabelClass}}{{~#ifCond pyIsChildNonTemplate '!=' true ~}}{{#ifCond IsCustomerRequiredFormat '==' 'false'}} icon-required {{/ifCond}}{{/ifCond}}" for="{{pyForStrLabel}}" {{~#ifCond pyIsChildNonTemplate '!=' true ~}} data-required="{{pyCustomRequireFormat}}" {{/ifCond}}>
          {{~#ifCond pyLabelValue '!=' ".pyTemplateInputBox"~}}
            {{~#ifCond pyLabelValue '!=' ""~}} 
            
             {{~#ifCond pyIsChildNonTemplate '==' true ~}} 
              {{~#ifCond pyReqSpanClass '!=' ""~}}
                <span {{#ifCond pyIsCellReadOnly '!=' true }}{{{pyReqSpanClass}}}{{/ifCond}}>{{{pyLabelValue}}}</span>
                {{#ifCond pyIsCellReadOnly '!=' true}}<strong class="required-field-accessibility{{#ifCond pyRequired '==' false}} display-none{{/ifCond}}">{{requiredAccessibilityText}}</strong>{{/ifCond}} 
              {{~else~}} 
              {{{pyLabelValue}}}
              {{~/ifCond~}}
              {{~else~}} 
              {{{pyLabelValue}}}
              {{~/ifCond~}}
            {{~/ifCond~}} 
          {{~/ifCond~}}
      {{~#if pyHelperLabel~}}{{~#if pyHelperTextIcon~}}
        <i data-ctl="Icon" class="icons pi pi-help pi-link helper-icon" title="{{{pyHelperVal}}}" onclick="pd(event);" tabindex="-1" role="link" alt="{{pyHelperVal}}"></i>
      {{~/if~}}{{~/if~}}
          </label>
          {{~#ifCond pyFormat '==' 'pxRichTextEditor'~}}{{~#ifCond pyIsCellReadOnly '!=' true~}}
           <i data-ctl="Icon" class="icons pi pi-keyboard" onkeydown="pega.ui.RichTextEditor.prototype.showSmartInfoContent(event)" onclick="pega.control.Actions.prototype.showSmartTip(event, '', window.rte_smartinfo_content, '');" tabindex="0" aria-label="Keyboard shortcuts" role="button"></i>
           </div>
          {{~/ifCond~}}{{~/ifCond~}}       
        {{~/if~}}
      {{~/if~}}
    {{/if}}
        
      {{~#if (ifCond (ifCond pyLabelReserveSpace 'eq' true) 'or' (ifCond pyFlex 'eq' false)) ~}}
      <div class="{{pyControlContainerDivClass}}">
    {{~/if~}}
        {{#ifCond pyFormat '==' "pxHidden"}}<span>{{/ifCond}}
      {{~{getDLCellControl metaData}~}}
        {{#ifCond pyFormat '==' "pxHidden"}}</span>{{/ifCond}}
    {{~#if (ifCond (ifCond pyLabelReserveSpace 'eq' true) 'or' (ifCond pyFlex 'eq' false)) ~}}     
            </div>
        {{~/if~}}
        {{{pyUiFieldValueMeta}}}     
    {{~/ifCond~}}
    {{~#ifCond pyType '==' "paragraph"~}}    
          {{~{getDLCellControl metaData}~}}
    {{~/ifCond~}}
    {{~#ifCond pyType '==' "microdc"~}}    
          {{~{getDLCellControl metaData}~}}
    {{~/ifCond~}}
  {{~#if (ifCond (ifCond pyType 'eq' "sub_section") 'or' (ifCond pyType 'eq' "layout")) ~}}   
    {{~#ifCond pyLabelValue '!=' ""~}}
      {{~#if pyLabelReserveSpace~}}
        {{~#if pybParam~}}
          <label class="{{pyLabelClass}}"><input type="hidden" name="{{pyParamName}}" value="{{pyParamValue}}">{{pyLocalizedParamValue}}</label>
        {{~else~}}
        <label class="{{pyLabelClass}}">{{{pyLabelValue}}}</label>
        {{~/if~}}
      {{~/if~}}
    {{~/ifCond~}} 
        {{~{getDLCellControl metaData}~}}        
    {{~/if~}}
  {{~#if (ifCond (ifCond pyIsLayoutGroup 'eq' false) 'and' (ifCond genContentInner 'eq' true)) ~}}
    </div>
  {{~/if~}}</div>
{{~else~}}
<span>{{~{getDLCellControl metaData}~}}</span>
{{~/ifCond~}}
*/
/*Compiled JS*/

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
templates['pzpega_ui_DLCellTemplate'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div "
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyInlineStyle") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":5},"end":{"line":2,"column":76}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyBaseRef") || (depth0 != null ? lookupProperty(depth0,"pyBaseRef") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyBaseRef","hash":{},"data":data,"loc":{"start":{"line":2,"column":77},"end":{"line":2,"column":92}}}) : helper))) != null ? stack1 : "")
    + " \n"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyTourID") || (depth0 != null ? lookupProperty(depth0,"pyTourID") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyTourID","hash":{},"data":data,"loc":{"start":{"line":3,"column":0},"end":{"line":3,"column":12}}}) : helper)))
    + " class=\""
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyIsLayoutGroup") : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(6, data, 0),"data":data,"loc":{"start":{"line":3,"column":20},"end":{"line":7,"column":10}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyLabelValue") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":11},"end":{"line":7,"column":165}}})) != null ? stack1 : "")
    + "\"\nstring_type=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyType") || (depth0 != null ? lookupProperty(depth0,"pyType") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyType","hash":{},"data":data,"loc":{"start":{"line":8,"column":13},"end":{"line":8,"column":23}}}) : helper)))
    + "\" RESERVE_SPACE=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyReserveSpace") || (depth0 != null ? lookupProperty(depth0,"pyReserveSpace") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyReserveSpace","hash":{},"data":data,"loc":{"start":{"line":8,"column":40},"end":{"line":8,"column":58}}}) : helper)))
    + "\"\n"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyExpressionIdMeta") || (depth0 != null ? lookupProperty(depth0,"pyExpressionIdMeta") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyExpressionIdMeta","hash":{},"data":data,"loc":{"start":{"line":9,"column":0},"end":{"line":9,"column":22}}}) : helper)))
    + " \n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyIsLayoutGroup") : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.program(14, data, 0),"data":data,"loc":{"start":{"line":10,"column":0},"end":{"line":14,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyFlex") : depth0),"eq",true,{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":15,"column":14},"end":{"line":15,"column":39}}}),"or",(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyLabelReserveSpace") : depth0),"eq",false,{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":15,"column":45},"end":{"line":15,"column":84}}}),{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":15,"column":6},"end":{"line":15,"column":85}}}),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":0},"end":{"line":17,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyFlex") : depth0),"eq",true,{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":18,"column":14},"end":{"line":18,"column":39}}}),"and",(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyType") : depth0),"eq","label",{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":18,"column":46},"end":{"line":18,"column":74}}}),{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":18,"column":6},"end":{"line":18,"column":75}}}),{"name":"if","hash":{},"fn":container.program(20, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":18,"column":0},"end":{"line":20,"column":7}}})) != null ? stack1 : "")
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyAriaHidden") || (depth0 != null ? lookupProperty(depth0,"pyAriaHidden") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyAriaHidden","hash":{},"data":data,"loc":{"start":{"line":21,"column":0},"end":{"line":21,"column":16}}}) : helper)))
    + "  "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyDataFieldValueMeta") || (depth0 != null ? lookupProperty(depth0,"pyDataFieldValueMeta") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyDataFieldValueMeta","hash":{},"data":data,"loc":{"start":{"line":21,"column":18},"end":{"line":21,"column":42}}}) : helper)))
    + " "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyRelativePath") || (depth0 != null ? lookupProperty(depth0,"pyRelativePath") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyRelativePath","hash":{},"data":data,"loc":{"start":{"line":21,"column":43},"end":{"line":21,"column":61}}}) : helper)))
    + "\n>"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyIsLayoutGroup") : depth0),"eq",false,{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":22,"column":16},"end":{"line":22,"column":51}}}),"and",(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"genContentInner") : depth0),"eq",true,{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":22,"column":58},"end":{"line":22,"column":92}}}),{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":22,"column":8},"end":{"line":22,"column":93}}}),{"name":"if","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":22,"column":1},"end":{"line":24,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyType") : depth0),"==","label",{"name":"ifCond","hash":{},"fn":container.program(28, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":25,"column":4},"end":{"line":38,"column":17}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyType") : depth0),"==","field",{"name":"ifCond","hash":{},"fn":container.program(38, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":39,"column":4},"end":{"line":109,"column":17}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyType") : depth0),"==","paragraph",{"name":"ifCond","hash":{},"fn":container.program(79, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":110,"column":4},"end":{"line":112,"column":17}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyType") : depth0),"==","microdc",{"name":"ifCond","hash":{},"fn":container.program(79, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":113,"column":4},"end":{"line":115,"column":17}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyType") : depth0),"eq","sub_section",{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":116,"column":17},"end":{"line":116,"column":51}}}),"or",(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyType") : depth0),"eq","layout",{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":116,"column":57},"end":{"line":116,"column":86}}}),{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":116,"column":9},"end":{"line":116,"column":87}}}),{"name":"if","hash":{},"fn":container.program(81, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":116,"column":2},"end":{"line":127,"column":13}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyIsLayoutGroup") : depth0),"eq",false,{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":128,"column":17},"end":{"line":128,"column":52}}}),"and",(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"genContentInner") : depth0),"eq",true,{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":128,"column":59},"end":{"line":128,"column":93}}}),{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":128,"column":9},"end":{"line":128,"column":94}}}),{"name":"if","hash":{},"fn":container.program(36, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":128,"column":2},"end":{"line":130,"column":11}}})) != null ? stack1 : "")
    + "</div>";
},"2":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " style=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyInlineStyle") || (depth0 != null ? lookupProperty(depth0,"pyInlineStyle") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyInlineStyle","hash":{},"data":data,"loc":{"start":{"line":2,"column":46},"end":{"line":2,"column":63}}}) : helper)))
    + "\" ";
},"4":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyLGCustomClass") || (depth0 != null ? lookupProperty(depth0,"pyLGCustomClass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyLGCustomClass","hash":{},"data":data,"loc":{"start":{"line":4,"column":2},"end":{"line":4,"column":23}}}) : helper)));
},"6":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyCustomClass") || (depth0 != null ? lookupProperty(depth0,"pyCustomClass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyCustomClass","hash":{},"data":data,"loc":{"start":{"line":6,"column":1},"end":{"line":6,"column":20}}}) : helper)));
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyIsChildNonTemplate") : depth0),"!=",true,{"name":"ifCond","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":46},"end":{"line":7,"column":154}}})) != null ? stack1 : "");
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyRequired") : depth0),"==",true,{"name":"ifCond","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":91},"end":{"line":7,"column":143}}})) != null ? stack1 : "");
},"10":function(container,depth0,helpers,partials,data) {
    return " required";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyLGInspectorData") || (depth0 != null ? lookupProperty(depth0,"pyLGInspectorData") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyLGInspectorData","hash":{},"data":data,"loc":{"start":{"line":11,"column":2},"end":{"line":11,"column":25}}}) : helper))) != null ? stack1 : "")
    + " data-lg-child-id=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyLGcellIndex") || (depth0 != null ? lookupProperty(depth0,"pyLGcellIndex") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyLGcellIndex","hash":{},"data":data,"loc":{"start":{"line":11,"column":44},"end":{"line":11,"column":61}}}) : helper)))
    + "\" data-refreshOnClick=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyRefreshWhenActive") || (depth0 != null ? lookupProperty(depth0,"pyRefreshWhenActive") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyRefreshWhenActive","hash":{},"data":data,"loc":{"start":{"line":11,"column":84},"end":{"line":11,"column":107}}}) : helper)))
    + "\"\n";
},"14":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  "
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyInspectorMetaData") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":13,"column":2},"end":{"line":13,"column":77}}})) != null ? stack1 : "")
    + " \n";
},"15":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyInspectorMetaData") || (depth0 != null ? lookupProperty(depth0,"pyInspectorMetaData") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyInspectorMetaData","hash":{},"data":data,"loc":{"start":{"line":13,"column":42},"end":{"line":13,"column":65}}}) : helper)))
    + " ";
},"17":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyAccessKey") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":16,"column":0},"end":{"line":16,"column":61}}})) != null ? stack1 : "")
    + "  \n";
},"18":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyAccessKey") || (depth0 != null ? lookupProperty(depth0,"pyAccessKey") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyAccessKey","hash":{},"data":data,"loc":{"start":{"line":16,"column":32},"end":{"line":16,"column":49}}}) : helper))) != null ? stack1 : "")
    + " ";
},"20":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyAutomationID") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(21, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":19,"column":0},"end":{"line":19,"column":65}}})) != null ? stack1 : "")
    + " \n";
},"21":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyAutomationID") || (depth0 != null ? lookupProperty(depth0,"pyAutomationID") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyAutomationID","hash":{},"data":data,"loc":{"start":{"line":19,"column":35},"end":{"line":19,"column":53}}}) : helper)))
    + " ";
},"23":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div "
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isParaGraphFlex") : depth0),"!=",true,{"name":"ifCond","hash":{},"fn":container.program(24, data, 0),"inverse":container.program(26, data, 0),"data":data,"loc":{"start":{"line":23,"column":11},"end":{"line":23,"column":131}}})) != null ? stack1 : "")
    + ">";
},"24":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return " class=\"content-inner "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyFloatClass") || (depth0 != null ? lookupProperty(depth0,"pyFloatClass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyFloatClass","hash":{},"data":data,"loc":{"start":{"line":23,"column":70},"end":{"line":23,"column":86}}}) : helper)))
    + "\" ";
},"26":function(container,depth0,helpers,partials,data) {
    return " class=\"flex-paragraph\" ";
},"28":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyFlex") : depth0),"==",false,{"name":"ifCond","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":26,"column":4},"end":{"line":28,"column":17}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pybParam") : depth0),{"name":"if","hash":{},"fn":container.program(32, data, 0),"inverse":container.program(34, data, 0),"data":data,"loc":{"start":{"line":29,"column":8},"end":{"line":33,"column":17}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyFlex") : depth0),"==",false,{"name":"ifCond","hash":{},"fn":container.program(36, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":34,"column":8},"end":{"line":36,"column":21}}})) != null ? stack1 : "")
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyUiFieldValueMeta") || (depth0 != null ? lookupProperty(depth0,"pyUiFieldValueMeta") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyUiFieldValueMeta","hash":{},"data":data,"loc":{"start":{"line":37,"column":6},"end":{"line":37,"column":30}}}) : helper))) != null ? stack1 : "");
},"29":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyLabelClassWithoutFlex") || (depth0 != null ? lookupProperty(depth0,"pyLabelClassWithoutFlex") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyLabelClassWithoutFlex","hash":{},"data":data,"loc":{"start":{"line":27,"column":20},"end":{"line":27,"column":47}}}) : helper)))
    + "\""
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyAutomationID") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(30, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":27,"column":49},"end":{"line":27,"column":118}}})) != null ? stack1 : "")
    + ">";
},"30":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyAutomationID") || (depth0 != null ? lookupProperty(depth0,"pyAutomationID") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyAutomationID","hash":{},"data":data,"loc":{"start":{"line":27,"column":86},"end":{"line":27,"column":104}}}) : helper)));
},"32":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<input type=\"hidden\" name=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyParamName") || (depth0 != null ? lookupProperty(depth0,"pyParamName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyParamName","hash":{},"data":data,"loc":{"start":{"line":30,"column":37},"end":{"line":30,"column":52}}}) : helper)))
    + "\" value=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyParamValue") || (depth0 != null ? lookupProperty(depth0,"pyParamValue") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyParamValue","hash":{},"data":data,"loc":{"start":{"line":30,"column":61},"end":{"line":30,"column":77}}}) : helper)))
    + "\">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyLocalizedParamValue") || (depth0 != null ? lookupProperty(depth0,"pyLocalizedParamValue") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyLocalizedParamValue","hash":{},"data":data,"loc":{"start":{"line":30,"column":79},"end":{"line":30,"column":104}}}) : helper)));
},"34":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"renderLabel")||(depth0 && lookupProperty(depth0,"renderLabel"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyLabelValue") : depth0),{"name":"renderLabel","hash":{},"data":data,"loc":{"start":{"line":32,"column":8},"end":{"line":32,"column":38}}})) != null ? stack1 : "");
},"36":function(container,depth0,helpers,partials,data) {
    return "</div>";
},"38":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyLabelReserveSpace") : depth0),"eq",true,{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":40,"column":20},"end":{"line":40,"column":58}}}),"and",(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyFormat") : depth0),"neq","pxHidden",{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":40,"column":65},"end":{"line":40,"column":99}}}),{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":40,"column":12},"end":{"line":40,"column":100}}}),{"name":"if","hash":{},"fn":container.program(39, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":40,"column":6},"end":{"line":97,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyLabelReserveSpace") : depth0),"eq",true,{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":99,"column":21},"end":{"line":99,"column":59}}}),"or",(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyFlex") : depth0),"eq",false,{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":99,"column":65},"end":{"line":99,"column":91}}}),{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":99,"column":13},"end":{"line":99,"column":92}}}),{"name":"if","hash":{},"fn":container.program(73, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":99,"column":6},"end":{"line":101,"column":13}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyFormat") : depth0),"==","pxHidden",{"name":"ifCond","hash":{},"fn":container.program(75, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":102,"column":8},"end":{"line":102,"column":61}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"getDLCellControl")||(depth0 && lookupProperty(depth0,"getDLCellControl"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"metaData") : depth0),{"name":"getDLCellControl","hash":{},"data":data,"loc":{"start":{"line":103,"column":6},"end":{"line":103,"column":39}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyFormat") : depth0),"==","pxHidden",{"name":"ifCond","hash":{},"fn":container.program(77, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":104,"column":8},"end":{"line":104,"column":62}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyLabelReserveSpace") : depth0),"eq",true,{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":105,"column":19},"end":{"line":105,"column":57}}}),"or",(lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyFlex") : depth0),"eq",false,{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":105,"column":63},"end":{"line":105,"column":89}}}),{"name":"ifCond","hash":{},"data":data,"loc":{"start":{"line":105,"column":11},"end":{"line":105,"column":90}}}),{"name":"if","hash":{},"fn":container.program(36, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":105,"column":4},"end":{"line":107,"column":17}}})) != null ? stack1 : "")
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyUiFieldValueMeta") || (depth0 != null ? lookupProperty(depth0,"pyUiFieldValueMeta") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyUiFieldValueMeta","hash":{},"data":data,"loc":{"start":{"line":108,"column":8},"end":{"line":108,"column":32}}}) : helper))) != null ? stack1 : "");
},"39":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyIsCellReadOnly") : depth0),{"name":"if","hash":{},"fn":container.program(40, data, 0),"inverse":container.program(55, data, 0),"data":data,"loc":{"start":{"line":41,"column":6},"end":{"line":96,"column":15}}})) != null ? stack1 : "");
},"40":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyAutomationID") || (depth0 != null ? lookupProperty(depth0,"pyAutomationID") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyAutomationID","hash":{},"data":data,"loc":{"start":{"line":42,"column":14},"end":{"line":42,"column":32}}}) : helper)))
    + " class=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyLabelClass") || (depth0 != null ? lookupProperty(depth0,"pyLabelClass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyLabelClass","hash":{},"data":data,"loc":{"start":{"line":42,"column":40},"end":{"line":42,"column":56}}}) : helper)))
    + "\" >"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pybParam") : depth0),{"name":"if","hash":{},"fn":container.program(32, data, 0),"inverse":container.program(41, data, 0),"data":data,"loc":{"start":{"line":43,"column":6},"end":{"line":56,"column":19}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyHelperLabel") : depth0),{"name":"if","hash":{},"fn":container.program(52, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":57,"column":10},"end":{"line":59,"column":24}}})) != null ? stack1 : "")
    + "</span>";
},"41":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyLabelValue") : depth0),"!=",".pyTemplateInputBox",{"name":"ifCond","hash":{},"fn":container.program(42, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":46,"column":10},"end":{"line":55,"column":23}}})) != null ? stack1 : "");
},"42":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyLabelValue") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(43, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":47,"column":13},"end":{"line":54,"column":25}}})) != null ? stack1 : "");
},"43":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyReqSpanClass") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(44, data, 0),"inverse":container.program(50, data, 0),"data":data,"loc":{"start":{"line":48,"column":15},"end":{"line":53,"column":27}}})) != null ? stack1 : "");
},"44":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span "
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyIsCellReadOnly") : depth0),"!=",true,{"name":"ifCond","hash":{},"fn":container.program(45, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":49,"column":22},"end":{"line":49,"column":92}}})) != null ? stack1 : "")
    + ">"
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyLabelValue") || (depth0 != null ? lookupProperty(depth0,"pyLabelValue") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyLabelValue","hash":{},"data":data,"loc":{"start":{"line":49,"column":93},"end":{"line":49,"column":111}}}) : helper))) != null ? stack1 : "")
    + "</span>\n                "
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyIsCellReadOnly") : depth0),"!=",true,{"name":"ifCond","hash":{},"fn":container.program(47, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":50,"column":16},"end":{"line":50,"column":205}}})) != null ? stack1 : "");
},"45":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyReqSpanClass") || (depth0 != null ? lookupProperty(depth0,"pyReqSpanClass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyReqSpanClass","hash":{},"data":data,"loc":{"start":{"line":49,"column":61},"end":{"line":49,"column":81}}}) : helper))) != null ? stack1 : "");
},"47":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<strong class=\"required-field-accessibility"
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyRequired") : depth0),"==",false,{"name":"ifCond","hash":{},"fn":container.program(48, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":50,"column":97},"end":{"line":50,"column":154}}})) != null ? stack1 : "")
    + "\">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"requiredAccessibilityText") || (depth0 != null ? lookupProperty(depth0,"requiredAccessibilityText") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"requiredAccessibilityText","hash":{},"data":data,"loc":{"start":{"line":50,"column":156},"end":{"line":50,"column":185}}}) : helper)))
    + "</strong>";
},"48":function(container,depth0,helpers,partials,data) {
    return " display-none";
},"50":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyLabelValue") || (depth0 != null ? lookupProperty(depth0,"pyLabelValue") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyLabelValue","hash":{},"data":data,"loc":{"start":{"line":52,"column":16},"end":{"line":52,"column":34}}}) : helper))) != null ? stack1 : "");
},"52":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyHelperTextIcon") : depth0),{"name":"if","hash":{},"fn":container.program(53, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":57,"column":33},"end":{"line":59,"column":15}}})) != null ? stack1 : "");
},"53":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<i data-ctl=\"Icon\" class=\"icons pi pi-help pi-link helper-icon\" title=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyHelperVal") || (depth0 != null ? lookupProperty(depth0,"pyHelperVal") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyHelperVal","hash":{},"data":data,"loc":{"start":{"line":58,"column":79},"end":{"line":58,"column":96}}}) : helper))) != null ? stack1 : "")
    + "\" onclick=\"pd(event);\" tabindex=\"-1\" role=\"link\" alt=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyHelperVal") || (depth0 != null ? lookupProperty(depth0,"pyHelperVal") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyHelperVal","hash":{},"data":data,"loc":{"start":{"line":58,"column":150},"end":{"line":58,"column":165}}}) : helper)))
    + "\"></i>";
},"55":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pybParam") : depth0),{"name":"if","hash":{},"fn":container.program(56, data, 0),"inverse":container.program(58, data, 0),"data":data,"loc":{"start":{"line":62,"column":8},"end":{"line":95,"column":17}}})) != null ? stack1 : "");
},"56":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<label "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyAutomationID") || (depth0 != null ? lookupProperty(depth0,"pyAutomationID") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyAutomationID","hash":{},"data":data,"loc":{"start":{"line":63,"column":17},"end":{"line":63,"column":35}}}) : helper)))
    + " class=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyLabelClass") || (depth0 != null ? lookupProperty(depth0,"pyLabelClass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyLabelClass","hash":{},"data":data,"loc":{"start":{"line":63,"column":43},"end":{"line":63,"column":59}}}) : helper)))
    + "\" for=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyForStrLabel") || (depth0 != null ? lookupProperty(depth0,"pyForStrLabel") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyForStrLabel","hash":{},"data":data,"loc":{"start":{"line":63,"column":66},"end":{"line":63,"column":83}}}) : helper)))
    + "\"><input type=\"hidden\" name=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyParamName") || (depth0 != null ? lookupProperty(depth0,"pyParamName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyParamName","hash":{},"data":data,"loc":{"start":{"line":63,"column":112},"end":{"line":63,"column":127}}}) : helper)))
    + "\" value=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyParamValue") || (depth0 != null ? lookupProperty(depth0,"pyParamValue") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyParamValue","hash":{},"data":data,"loc":{"start":{"line":63,"column":136},"end":{"line":63,"column":152}}}) : helper)))
    + "\">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyLocalizedParamValue") || (depth0 != null ? lookupProperty(depth0,"pyLocalizedParamValue") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyLocalizedParamValue","hash":{},"data":data,"loc":{"start":{"line":63,"column":154},"end":{"line":63,"column":179}}}) : helper)))
    + "</label>"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyHelperLabel") : depth0),{"name":"if","hash":{},"fn":container.program(52, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":64,"column":6},"end":{"line":66,"column":24}}})) != null ? stack1 : "");
},"58":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyFormat") : depth0),"==","pxRichTextEditor",{"name":"ifCond","hash":{},"fn":container.program(59, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":68,"column":10},"end":{"line":70,"column":36}}})) != null ? stack1 : "")
    + "<label "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyAutomationID") || (depth0 != null ? lookupProperty(depth0,"pyAutomationID") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyAutomationID","hash":{},"data":data,"loc":{"start":{"line":71,"column":17},"end":{"line":71,"column":35}}}) : helper)))
    + " class=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyLabelClass") || (depth0 != null ? lookupProperty(depth0,"pyLabelClass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyLabelClass","hash":{},"data":data,"loc":{"start":{"line":71,"column":43},"end":{"line":71,"column":59}}}) : helper)))
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyIsChildNonTemplate") : depth0),"!=",true,{"name":"ifCond","hash":{},"fn":container.program(62, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":71,"column":59},"end":{"line":71,"column":190}}})) != null ? stack1 : "")
    + "\" for=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyForStrLabel") || (depth0 != null ? lookupProperty(depth0,"pyForStrLabel") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyForStrLabel","hash":{},"data":data,"loc":{"start":{"line":71,"column":197},"end":{"line":71,"column":214}}}) : helper)))
    + "\""
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyIsChildNonTemplate") : depth0),"!=",true,{"name":"ifCond","hash":{},"fn":container.program(65, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":71,"column":216},"end":{"line":71,"column":315}}})) != null ? stack1 : "")
    + ">"
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyLabelValue") : depth0),"!=",".pyTemplateInputBox",{"name":"ifCond","hash":{},"fn":container.program(67, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":72,"column":10},"end":{"line":86,"column":23}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyHelperLabel") : depth0),{"name":"if","hash":{},"fn":container.program(52, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":87,"column":6},"end":{"line":89,"column":24}}})) != null ? stack1 : "")
    + "</label>"
    + ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyFormat") : depth0),"==","pxRichTextEditor",{"name":"ifCond","hash":{},"fn":container.program(70, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":91,"column":10},"end":{"line":94,"column":36}}})) != null ? stack1 : "");
},"59":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyIsCellReadOnly") : depth0),"!=",true,{"name":"ifCond","hash":{},"fn":container.program(60, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":68,"column":56},"end":{"line":70,"column":23}}})) != null ? stack1 : "");
},"60":function(container,depth0,helpers,partials,data) {
    return "<div class='RTELabelWrapper' style=\"display: flex; justify-content: space-between; width: 100%;\">";
},"62":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"IsCustomerRequiredFormat") : depth0),"==","false",{"name":"ifCond","hash":{},"fn":container.program(63, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":71,"column":104},"end":{"line":71,"column":179}}})) != null ? stack1 : "");
},"63":function(container,depth0,helpers,partials,data) {
    return " icon-required ";
},"65":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "data-required=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyCustomRequireFormat") || (depth0 != null ? lookupProperty(depth0,"pyCustomRequireFormat") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyCustomRequireFormat","hash":{},"data":data,"loc":{"start":{"line":71,"column":277},"end":{"line":71,"column":302}}}) : helper)))
    + "\" ";
},"67":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyLabelValue") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(68, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":73,"column":12},"end":{"line":85,"column":25}}})) != null ? stack1 : "");
},"68":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyIsChildNonTemplate") : depth0),"==",true,{"name":"ifCond","hash":{},"fn":container.program(43, data, 0),"inverse":container.program(50, data, 0),"data":data,"loc":{"start":{"line":75,"column":13},"end":{"line":84,"column":27}}})) != null ? stack1 : "");
},"70":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyIsCellReadOnly") : depth0),"!=",true,{"name":"ifCond","hash":{},"fn":container.program(71, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":91,"column":56},"end":{"line":94,"column":23}}})) != null ? stack1 : "");
},"71":function(container,depth0,helpers,partials,data) {
    return "<i data-ctl=\"Icon\" class=\"icons pi pi-keyboard\" onkeydown=\"pega.ui.RichTextEditor.prototype.showSmartInfoContent(event)\" onclick=\"pega.control.Actions.prototype.showSmartTip(event, '', window.rte_smartinfo_content, '');\" tabindex=\"0\" aria-label=\"Keyboard shortcuts\" role=\"button\"></i>\n           </div>";
},"73":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyControlContainerDivClass") || (depth0 != null ? lookupProperty(depth0,"pyControlContainerDivClass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyControlContainerDivClass","hash":{},"data":data,"loc":{"start":{"line":100,"column":18},"end":{"line":100,"column":48}}}) : helper)))
    + "\">";
},"75":function(container,depth0,helpers,partials,data) {
    return "<span>";
},"77":function(container,depth0,helpers,partials,data) {
    return "</span>";
},"79":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"getDLCellControl")||(depth0 && lookupProperty(depth0,"getDLCellControl"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"metaData") : depth0),{"name":"getDLCellControl","hash":{},"data":data,"loc":{"start":{"line":111,"column":10},"end":{"line":111,"column":43}}})) != null ? stack1 : "");
},"81":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyLabelValue") : depth0),"!=","",{"name":"ifCond","hash":{},"fn":container.program(82, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":117,"column":4},"end":{"line":125,"column":17}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"getDLCellControl")||(depth0 && lookupProperty(depth0,"getDLCellControl"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"metaData") : depth0),{"name":"getDLCellControl","hash":{},"data":data,"loc":{"start":{"line":126,"column":8},"end":{"line":126,"column":41}}})) != null ? stack1 : "");
},"82":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyLabelReserveSpace") : depth0),{"name":"if","hash":{},"fn":container.program(83, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":118,"column":6},"end":{"line":124,"column":15}}})) != null ? stack1 : "");
},"83":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pybParam") : depth0),{"name":"if","hash":{},"fn":container.program(84, data, 0),"inverse":container.program(86, data, 0),"data":data,"loc":{"start":{"line":119,"column":8},"end":{"line":123,"column":17}}})) != null ? stack1 : "");
},"84":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<label class=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyLabelClass") || (depth0 != null ? lookupProperty(depth0,"pyLabelClass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyLabelClass","hash":{},"data":data,"loc":{"start":{"line":120,"column":24},"end":{"line":120,"column":40}}}) : helper)))
    + "\"><input type=\"hidden\" name=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyParamName") || (depth0 != null ? lookupProperty(depth0,"pyParamName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyParamName","hash":{},"data":data,"loc":{"start":{"line":120,"column":69},"end":{"line":120,"column":84}}}) : helper)))
    + "\" value=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyParamValue") || (depth0 != null ? lookupProperty(depth0,"pyParamValue") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyParamValue","hash":{},"data":data,"loc":{"start":{"line":120,"column":93},"end":{"line":120,"column":109}}}) : helper)))
    + "\">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyLocalizedParamValue") || (depth0 != null ? lookupProperty(depth0,"pyLocalizedParamValue") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyLocalizedParamValue","hash":{},"data":data,"loc":{"start":{"line":120,"column":111},"end":{"line":120,"column":136}}}) : helper)))
    + "</label>";
},"86":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<label class=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyLabelClass") || (depth0 != null ? lookupProperty(depth0,"pyLabelClass") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyLabelClass","hash":{},"data":data,"loc":{"start":{"line":122,"column":22},"end":{"line":122,"column":38}}}) : helper)))
    + "\">"
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"pyLabelValue") || (depth0 != null ? lookupProperty(depth0,"pyLabelValue") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyLabelValue","hash":{},"data":data,"loc":{"start":{"line":122,"column":40},"end":{"line":122,"column":58}}}) : helper))) != null ? stack1 : "")
    + "</label>";
},"88":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<span>"
    + ((stack1 = (lookupProperty(helpers,"getDLCellControl")||(depth0 && lookupProperty(depth0,"getDLCellControl"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"metaData") : depth0),{"name":"getDLCellControl","hash":{},"data":data,"loc":{"start":{"line":132,"column":6},"end":{"line":132,"column":39}}})) != null ? stack1 : "")
    + "</span>";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifCond")||(depth0 && lookupProperty(depth0,"ifCond"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyFormat") : depth0),"!=","pxHidden",{"name":"ifCond","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(88, data, 0),"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":133,"column":13}}})) != null ? stack1 : "");
},"useData":true});
})();

/*End of Compiled JS*/

pega.ui.template.DLTemplate = {
    resolveMulFVParam : function(fvStr) {
      var cutIndex = fvStr.indexOf("^~");
      var lastIndex = fvStr.indexOf("~^");
      if(cutIndex == -1){
        return fvStr;
      }else{
        var sub1Str = fvStr.substring(0, cutIndex);
        var sub2Str = fvStr.substring(cutIndex+ 2,lastIndex);
        var sub3Str = fvStr.substring(lastIndex + 2);
        return sub1Str + pega.ui.ChangeTrackerMap.getTracker().getPropertyValue(sub2Str) + this.resolveMulFVParam(sub3Str);
      }
    },
    isHelperIcon: function(node) {
      var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
      var showHelperList = ["pxTextInput", "pxTextArea", "pxDropdown", "pxCheckbox", "pxAutoComplete", "pxDateTime", "pxMultiSelect","pxDateRange","pxAnyPicker","pxRadioButtons"];
      var showHelperIcon = false;
      /* Except for dropdown all other controls which support helper icon have helperType value at pyMode level Need to cater to both cases*/

      if (
        node.pyTemplates &&
        node.pyTemplates[0] &&
        node.pyTemplates[0][TEMPLATE_CONSTANTS["PYNAME"]] &&
        node.pyTemplates[0].pyCell &&
        ((node.pyTemplates[0].pyCell.pyModes[0] &&
          node.pyTemplates[0].pyCell.pyModes[0].helpertype == "icon") ||
         node.pyTemplates[0].pyCell.helpertype == "icon") &&
        showHelperList.indexOf(node.pyTemplates[0][TEMPLATE_CONSTANTS["PYNAME"]]) !=
        -1
      ) {
        showHelperIcon = true;
      } else if (node[TEMPLATE_CONSTANTS["PYVISIBILITY"]]) {
        if (
          node.pyTemplates &&
          node.pyTemplates[0] &&
          node.pyTemplates[0].pyTemplates &&
          node.pyTemplates[0].pyTemplates[0] &&
          node.pyTemplates[0].pyTemplates[0][TEMPLATE_CONSTANTS["PYNAME"]] &&
          node.pyTemplates[0].pyTemplates[0].pyCell &&
          ((node.pyTemplates[0].pyTemplates[0].pyCell.pyModes[0] &&
            node.pyTemplates[0].pyTemplates[0].pyCell.pyModes[0].helpertype ==
            "icon") ||
           node.pyTemplates[0].pyTemplates[0].pyCell.helpertype == "icon") &&
          showHelperList.indexOf(
            node.pyTemplates[0].pyTemplates[0][TEMPLATE_CONSTANTS["PYNAME"]]
          ) != -1
        ) {
          showHelperIcon = true;
        }
      }

      return showHelperIcon;
    },
   
     removePendingActionValue: function(treeNode){
       var templates = treeNode.pyTemplates;
       if(templates){
           var childNode = templates[0];
           childNode && this.removeProperty(childNode);
       }
     },
   
     removeProperty: function(childNode){
         var name = childNode.pyName;
         if(this.isInputControl(name)){
           var cell = childNode.pyCell;
           var pyValue;
           if(name == "pxRadioButtons" || name == "pxDropdown"){
             pyValue = cell.pyValueToken || cell.pyValue;
           }
           else
             pyValue = cell.pyValue;

           pyValue && pega.c.actionSequencer.removePendingActionValue(pyValue);
         }
     },
     isLabelError: function(node){
       var isNodeWithError = false;
       var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
       var showHelperList = ["pxTextInput", "pxTextArea", "pxDropdown", "pxCheckbox", "pxAutoComplete", "pxDateTime", "pxMultiSelect","pxDateRange","pxAnyPicker","pxRadioButtons"];
       
       if(node.pyTemplates && node.pyTemplates[0] && node.pyTemplates[0][TEMPLATE_CONSTANTS["PYNAME"]]) {
        var name = node.pyTemplates[0][TEMPLATE_CONSTANTS["PYNAME"]];
        if(showHelperList.indexOf(name) != -1){
          var cellNode = node.pyTemplates[0];
          var errorMsg = cellNode.pyCell["pyModes"][0][TEMPLATE_CONSTANTS["PYERRORMESSAGEHTML"]];
          if (errorMsg && errorMsg != "") {
            isNodeWithError = true;
          }
        }else if(name === "pxVisible"){
          name = node.pyTemplates[0].pyTemplates && node.pyTemplates[0].pyTemplates[0][TEMPLATE_CONSTANTS["PYNAME"]];
          if(showHelperList.indexOf(name) != -1){
            var cellNode = node.pyTemplates[0].pyTemplates[0];
            var errorMsg = cellNode.pyCell["pyModes"][0][TEMPLATE_CONSTANTS["PYERRORMESSAGEHTML"]];
            if (errorMsg && errorMsg != "") {
              isNodeWithError = true;
            }
          }
        }
      }
       return isNodeWithError;
     },
     isInputControl: function(name){
         if(name == "pxTextInput" || name == "pxTextArea" || name == "pxCheckbox" || name == "pxRadioButtons" || name == "pxDropdown" || name == "pxDateTime" || name == "pxAutoComplete" || name == "pxAnyPicker")
           return true;
     }
}

pega.ui.TemplateEngine.registerHelper("renderLabel", function(pyLabelValue ){
  if(pyLabelValue.toLowerCase && pyLabelValue.indexOf && pyLabelValue.toLowerCase().indexOf("<script") != -1){
    return pega.ui.ControlTemplate.crossScriptingFilter(pyLabelValue);
  }else{
    return pyLabelValue;
  }  
});

pega.ui.TemplateEngine.registerHelper("getDLCellControl", function(metaData, pyType) {
    var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
    var templates = pega.ui.TemplateEngine.getTemplates(metaData);
    if (templates && templates[0] && templates[0][TEMPLATE_CONSTANTS["PYNAME"]] == "pxVisible") {
        templates = pega.ui.TemplateEngine.getTemplates(templates[0]);
    }
    if (!templates) return void console.warn("No templates found while processing: " + metaData.pyName);
    var childNode;
    if ("field" == pyType) childNode = templates[1];
    else childNode = templates[0];
    if (childNode) {
        //BUG-561908 Required validation is not triggered
        childNode[TEMPLATE_CONSTANTS["PYREQUIRED"]] = metaData[TEMPLATE_CONSTANTS["PYREQUIRED"]];
        var childTemplateName = childNode[TEMPLATE_CONSTANTS["PYNAME"]];
        if (childTemplateName) {
            //var isChildReadOnly = metaData.pyCell.pyIsCellReadOnly, isChildReadOnlyCond = null;
            var isChildReadOnly = null,
                isChildReadOnlyCond = null;
            var pyReadOnlyWhenId;
            var currentContext = pega.ui.TemplateEngine.getCurrentContext();
            var ROWhenResult = metaData[TEMPLATE_CONSTANTS["PYCELL"]]["pyReadOnly"] || false;
            var parentReadOnly = currentContext.isSectionReadOnly();
            //if ("true" == isChildReadOnly) isChildReadOnlyCond = [ "pyCell" ].pyReadOnlyWhenCond;

            var isMasked = false;
            var isRegAutoControl = false;
            var controlProp;

            var excludeList = ["pxNonTemplate", "pxButton", "pxLink", "pxIcon", "pxVideo", "pxMenu", "pxHidden", "pxMultiSelect", "pxTimeline"];
            if (childNode[TEMPLATE_CONSTANTS["PYCELL"]] && childNode[TEMPLATE_CONSTANTS["PYCELL"]][TEMPLATE_CONSTANTS["PYMODES"]] && (excludeList.indexOf(childTemplateName) == -1)) {
                isRegAutoControl = true;
            }
            if (metaData.pyCell) {
                /* lg index */
                var lgCellIndex;
                var pyNumberedAccordion = metaData[TEMPLATE_CONSTANTS["PYCELL"]][TEMPLATE_CONSTANTS["PYNUMBEREDACCORDION"]];
                var disExpressionIdMeta = metaData[TEMPLATE_CONSTANTS["PYCELL"]]["disExpressionIdMeta"];
                if(metaData[TEMPLATE_CONSTANTS["PYCELL"]]["currentIndex"] && pyNumberedAccordion == "true"){
                  lgCellIndex = metaData[TEMPLATE_CONSTANTS["PYCELL"]]["currentIndex"];
                  if(childNode[TEMPLATE_CONSTANTS["PYNAME"]] == "pxVisible" && childNode.pyTemplates && childNode.pyTemplates[0]){
                    childNode.pyTemplates[0].pyLGCellIndex = lgCellIndex;
                    childNode.pyTemplates[0].pyNumberedAccordion = pyNumberedAccordion;
                  }else{
                    childNode.pyLGCellIndex = lgCellIndex;
                    childNode.pyNumberedAccordion = pyNumberedAccordion;
                  }
                }
                /* disable when */
                if(disExpressionIdMeta){
                  childNode.disExpressionIdMeta = disExpressionIdMeta;
                }
                /* disable when */
                isChildReadOnlyCond = metaData[TEMPLATE_CONSTANTS["PYCELL"]][TEMPLATE_CONSTANTS["PYREADONLYWHENCOND"]];
                isChildReadOnly = ("Editable" != isChildReadOnlyCond) && (parentReadOnly || ROWhenResult || ("readonlyAlways" == isChildReadOnlyCond));

                if (isRegAutoControl) {
                    controlProp = childNode[TEMPLATE_CONSTANTS["PYCELL"]][TEMPLATE_CONSTANTS["PYVALUE"]];
                    if (controlProp) {
                        isMasked = currentContext.isSecuredProperty(controlProp);
                        if (isMasked) {
                            controlProp = currentContext.getPropertyValue(controlProp);
                            return "<span>" + controlProp + "</span>";
                        }
                    }
                }
            }

            /* When there is no label present the helper icon will be generated with the control to handle both flex and non flex cases.*/

            if (pega.ui.template.DLTemplate.isHelperIcon(metaData)) {
                childNode.pyCell.pyHelperLabel = false;
                if (metaData.pyCell && metaData.pyCell.pyLabelReserveSpace == "true" && metaData.pyCell.pyLabelValue) {
                    childNode.pyCell.pyHelperLabel = true;
                }
            }

            if (childNode[TEMPLATE_CONSTANTS["PYCELL"]] && childNode[TEMPLATE_CONSTANTS["PYCELL"]][TEMPLATE_CONSTANTS["PYMODES"]]) {
                childNode[TEMPLATE_CONSTANTS["PYCELL"]][TEMPLATE_CONSTANTS["PXREADONLY"]] = isChildReadOnly;
            }
            childNode.isLGDisabled = metaData.isLGDisabled;
            var out;
            if (isChildReadOnly && isRegAutoControl){
                pega.c.actionSequencer && pega.ui.template.DLTemplate.removeProperty(childNode);  
                out = pega.ui.template.RenderingEngine.getRenderer("pxDisplayText").call(null, childNode);
            }  
            else
                out = pega.ui.template.RenderingEngine.getRenderer(childTemplateName).call(null, childNode);
            return new Handlebars.SafeString(out);
        }
    }
});
pega.ui.template.RenderingEngine.register("DynamicLayoutCell", function(treeNode, fromReloadCell, asyncRenderCallback) {
  var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
    var node = treeNode,
        cellnode = node[TEMPLATE_CONSTANTS["PYCELL"]] || "";
    var type = cellnode[TEMPLATE_CONSTANTS["PYTYPE"]] || "";
    /* BUG-3017641 taking the visibility from the layoutcontainer in case of Nested Layout */
    if (type == "layout" && node && node.pyTemplates && node.pyTemplates[0] && node.pyTemplates[0].pyTemplates && node.pyTemplates[0].pyTemplates[0]) {
        var visibility = node.pyTemplates[0].pyTemplates[0][TEMPLATE_CONSTANTS["PYVISIBILITY"]];
    } else {
        var visibility = node[TEMPLATE_CONSTANTS["PYVISIBILITY"]];
    }
  
    if(visibility == false && pega.c.actionSequencer){
      pega.ui.template.DLTemplate.removePendingActionValue(treeNode);
    }
  
    var reserveSpace = cellnode[TEMPLATE_CONSTANTS["PYRESERVESPACE"]] || "";
    if ((visibility === false && reserveSpace !== "true") || node[TEMPLATE_CONSTANTS["PYNAME"]] == "Dummy" || (node.pyTemplates && node.pyTemplates[0] && node.pyTemplates[0].pyViewPrivilege === false && ((visibility === false && reserveSpace !== "true") || (typeof visibility == 'undefined')))) {
        return "";
    }
    var expResults;
    var inlineStyles = cellnode[TEMPLATE_CONSTANTS["PYINLINESTYLE"]] || "";
    var nodeExpressionId = cellnode[TEMPLATE_CONSTANTS["PYEXPRESSIONID"]] || "";
    var expressionIdMeta;
    if (nodeExpressionId && nodeExpressionId.length > 0) {
        var doNotStampContext;
        if (cellnode[TEMPLATE_CONSTANTS["PYBASEREF"]]) {
            doNotStampContext = true;
        }
        expressionIdMeta = pega.ui.ExpressionEvaluator.getExpressionMetaToStamp(nodeExpressionId, doNotStampContext);
        expResults = pega.ui.ExpressionEvaluator.evaluateClientExpressions(nodeExpressionId);
        if (expResults != null && expResults[pega.ui.ExpressionEvaluator.SHOW_WHEN] == false) {
            if (reserveSpace && reserveSpace == "true") {
                inlineStyles = inlineStyles + " visibility:hidden;";
            } else {
                inlineStyles = inlineStyles + " display:none;";
            }
        }
    }
    var reqExpressionId, required = node[TEMPLATE_CONSTANTS["PYREQUIRED"]],
        pyReqSpanClass = "";
    var pyRequired = required;
    if ("undefined" != typeof required) {
        if (required) {
            pyReqSpanClass += "class='" + (cellnode[TEMPLATE_CONSTANTS.PYREQSPANCLASS] || "");
            pyReqSpanClass += "'";
        } else {
            pyReqSpanClass += "data-class='" + (cellnode[TEMPLATE_CONSTANTS.PYREQSPANCLASS] || "");
            pyReqSpanClass += "'";
        }
    } else {
        reqExpressionId = cellnode[TEMPLATE_CONSTANTS.PYREQUIREDWHENID] || "";
        if (reqExpressionId && reqExpressionId.length > 0) {
            var reqExpressionIdMeta = pega.ui.ExpressionEvaluator.getExpressionMetaToStamp(reqExpressionId);
            expResults = pega.ui.ExpressionEvaluator.evaluateClientExpressions(reqExpressionId);
            if (null != expResults && 0 == expResults[pega.ui.ExpressionEvaluator.REQUIRED_WHEN]) {
                pyReqSpanClass += "data-class='" + (cellnode[TEMPLATE_CONSTANTS.PYREQSPANCLASS] || "");
                pyReqSpanClass += "'";
                pyRequired = false;
            } else {
                pyReqSpanClass += "class='" + (cellnode[TEMPLATE_CONSTANTS.PYREQSPANCLASS] || "");
                pyReqSpanClass += "'";
                pyRequired = true;
            }
        }
    }
    var cellROSelection = cellnode[TEMPLATE_CONSTANTS["PYREADONLYWHENCOND"]];
    var labelReserveSpcae = cellnode[TEMPLATE_CONSTANTS["PYLABELRESERVESPACE"]] || "";
    var cellTemplateObj = {
        metaData: treeNode,
        pyInspectorMetaData: cellnode[TEMPLATE_CONSTANTS["PYINSPECTORDATA"]] ? (cellnode[TEMPLATE_CONSTANTS["PYINSPECTORDATA"]]).replace(/"/g, "") : "",
        pyRelativePath: "data-template",
        pyExpressionIdMeta: nodeExpressionId ? expressionIdMeta : "",
        pyTourID: cellnode[TEMPLATE_CONSTANTS["PYTOURID"]] ? (cellnode[TEMPLATE_CONSTANTS["PYTOURID"]]).replace(/'/g, "") : "",
        pyInlineStyle: inlineStyles,
        pyType: cellnode[TEMPLATE_CONSTANTS["PYTYPE"]] || "",
        pyFormat: cellnode[TEMPLATE_CONSTANTS["PYFORMAT"]] || "",
        pyReserveSpace: reserveSpace ? reserveSpace : "false",
        pyLabelReserveSpace: JSON.parse(labelReserveSpcae ? labelReserveSpcae : "false"),
        pyLabelValue: "",
        pyAutomationID: cellnode[TEMPLATE_CONSTANTS["PYAUTOMATIONID"]] ? ("data-test-id=" + (cellnode[TEMPLATE_CONSTANTS["PYAUTOMATIONID"]]).replace(/'/g, "")) : "",
        pyLabelClass: "",
        pyForStrLabel: cellnode[TEMPLATE_CONSTANTS["PYFORSTRLABEL"]] || "",
        pyAutoHTML: cellnode[TEMPLATE_CONSTANTS["PYAUTOHTML"]] || "",
        pyGenerateUniqueIdForLabel: cellnode[TEMPLATE_CONSTANTS["PYGENERATEUNIQUEIDFORLABEL"]] || "",
        pyReqSpanClass: pyReqSpanClass,
        pyControlContainerDivClass: "",
        pyAccessKey: cellnode[TEMPLATE_CONSTANTS["PYACCESSKEY"]] || "",
        pyIsLayoutGroup: JSON.parse(cellnode[TEMPLATE_CONSTANTS["PYISLAYOUTGROUP"]] ? cellnode[TEMPLATE_CONSTANTS["PYISLAYOUTGROUP"]] : "false"),
        pyFlex: JSON.parse(cellnode[TEMPLATE_CONSTANTS["PYFLEX"]] ? cellnode[TEMPLATE_CONSTANTS["PYFLEX"]] : "false"),
        pyLabelClassWithoutFlex: "",
        pyAriaHidden: "",
        pyDataFieldValueMeta: cellnode[TEMPLATE_CONSTANTS["PYDATAFIELDVALUEMETA"]] ? (cellnode[TEMPLATE_CONSTANTS["PYDATAFIELDVALUEMETA"]]).replace(/'/g, "") : "",
        pyBaseRef: cellnode[TEMPLATE_CONSTANTS["PYBASEREF"]] || "",
        pyUiFieldValueMeta: cellnode[TEMPLATE_CONSTANTS["PYUIFIELDVALUEMETA"]] || "",
        pybParam: JSON.parse(cellnode[TEMPLATE_CONSTANTS["BPARAM"]] ? cellnode[TEMPLATE_CONSTANTS["BPARAM"]] : "false"),
        pyParamName: cellnode[TEMPLATE_CONSTANTS["PYPARAMNAME"]] || "",
        pyFloatClass: cellnode[TEMPLATE_CONSTANTS["PYFLOATCLASS"]] || "",
        pyParamValue: cellnode[TEMPLATE_CONSTANTS["PYPARAMVALUE"]] || "",
        pyLGcellIndex: cellnode[TEMPLATE_CONSTANTS["PYLGCELLINDEX"]] || "",
        pyLGInspectorData: cellnode[TEMPLATE_CONSTANTS["PYLGINSPECTORDATA"]] ? cellnode[TEMPLATE_CONSTANTS["PYLGINSPECTORDATA"]] : (cellnode[TEMPLATE_CONSTANTS["PYTYPE"]] ===
            "sub_section" ? (cellnode[TEMPLATE_CONSTANTS["PYINSPECTORDATA"]] ? (cellnode[TEMPLATE_CONSTANTS["PYINSPECTORDATA"]]).replace(/"/g,
                "") : "") : ""),
        pyRefreshWhenActive: cellnode[TEMPLATE_CONSTANTS["PYREFRESHWHENACTIVE"]] || "",
        pyLGCustomClass: cellnode[TEMPLATE_CONSTANTS["PYLGCUSTOMCLASS"]] || "",
        pyVisibility: cellnode[TEMPLATE_CONSTANTS["PYVISIBILITY"]] || "",
        pyBaseClassRead: cellnode[TEMPLATE_CONSTANTS["PYBASECLASSREAD"]] || "",
        pyBaseClassWrite: cellnode[TEMPLATE_CONSTANTS["PYBASECLASSWRITE"]] || "",
        pyBaseLabelClassRead: cellnode[TEMPLATE_CONSTANTS["PYBASELABELCLASSREAD"]] || "",
        pyBaseLabelClassWrite: cellnode[TEMPLATE_CONSTANTS["PYBASELABELCLASSWRITE"]] || "",
        pyCustomReadOnlyStyle: cellnode[TEMPLATE_CONSTANTS["PYCUSTOMROSTYLE"]] || "",
        pyCustomReadWriteStyle: cellnode[TEMPLATE_CONSTANTS["PYCUSTOMRWSTYLE"]] || "",
        pyPartialClass: cellnode[TEMPLATE_CONSTANTS["PYPARTIALCLASS"]] || "",
        pyRequired: pyRequired || "",
        pyCustomRequireFormat: cellnode[TEMPLATE_CONSTANTS["PYCUSTOMREQUIREFORMAT"]] || "*"

    };
    cellTemplateObj.pyLocalizedParamValue = pega.ui.TemplateEngine.getCurrentContext().getLocalizedValue(cellTemplateObj.pyParamValue, "pyCaption", "");
    cellTemplateObj.IsCustomerRequiredFormat = "true";
    if (cellTemplateObj.pyCustomRequireFormat == "pyRequired") {
        cellTemplateObj.pyCustomRequireFormat = "*";
        cellTemplateObj.IsCustomerRequiredFormat = "false";
    }
    cellTemplateObj.pyCustomReadWriteStyle = cellTemplateObj.pyCustomReadWriteStyle ? pega.ui.TemplateEngine.getCurrentContext().getPropertyValue(cellTemplateObj.pyCustomReadWriteStyle) : "";
    cellTemplateObj.pyCustomReadOnlyStyle = cellTemplateObj.pyCustomReadOnlyStyle ? pega.ui.TemplateEngine.getCurrentContext().getPropertyValue(cellTemplateObj.pyCustomReadOnlyStyle) : "";
    var currentContext = pega.ui.TemplateEngine.getCurrentContext();
    /* begin handle for cases for A.pxResults and B.pxResults for multislect*/
    var genUniqueId = cellTemplateObj.pyAutoHTML == "true" || cellTemplateObj.pyGenerateUniqueIdForLabel == "true";
    var controlName = "";
    if (node.pyTemplates && node.pyTemplates[0]) {
        controlName = node.pyTemplates[0][TEMPLATE_CONSTANTS["PYNAME"]];
    }
    if (controlName == "pxMultiSelect") {
        cellTemplateObj.pyForStrLabel = node.pyTemplates[0][TEMPLATE_CONSTANTS["PYCELL"]][TEMPLATE_CONSTANTS["PYTARGETPROPNAME"]];
    }
    if (controlName == "pxMultiSelect" || controlName == "pxRadioButtons" || controlName == "pxCheckbox") {
        cellTemplateObj.pyForStrLabel = currentContext.getID(cellTemplateObj.pyForStrLabel, controlName, !genUniqueId);
    } else {
        cellTemplateObj.pyForStrLabel = currentContext.getID(cellTemplateObj.pyForStrLabel, "label", !genUniqueId);
    }
    /* end handle for cases for A.pxResults and B.pxResults for multislect*/

    var repeatingParentInfo = currentContext.getRepeatingParentInfo();

    /* BUG-319425 : Issue with text input in repeating dynamic layout */
    /*if(repeatingParentInfo.component == "RepeatingDynamicLayout") {
      cellTemplateObj.pyForStrLabel = cellnode[TEMPLATE_CONSTANTS["PYFORSTRLABEL"]] + repeatingParentInfo.index; 
    }*/
    var ROWhenResult = cellnode.pyReadOnly || false;
    var labelClass = "field-caption ";
    var controlContainerDivClass = "field-item ";
    var isChildReadOnly = ("Editable" != cellROSelection) && (currentContext.isSectionReadOnly() || ROWhenResult ||
        ("readonlyAlways" == cellROSelection));
    cellTemplateObj.pyIsCellReadOnly = isChildReadOnly;
    if (isChildReadOnly) {
        cellTemplateObj.pyControlContainerDivClass = controlContainerDivClass + cellTemplateObj.pyBaseClassRead;
        cellTemplateObj.pyLabelClass = labelClass + cellTemplateObj.pyBaseLabelClassRead;
        cellTemplateObj.pyLabelClassWithoutFlex = controlContainerDivClass + cellTemplateObj.pyBaseLabelClassRead;
        cellTemplateObj.pyPartialClass += " " + cellTemplateObj.pyCustomReadOnlyStyle;
        cellTemplateObj.pyLGCustomClass += " " + cellTemplateObj.pyCustomReadOnlyStyle;
        if (cellTemplateObj.pyFlex && (cellTemplateObj.pyType == "" || cellTemplateObj.pyType == "label"))
            cellTemplateObj.pyPartialClass += " " + cellTemplateObj.pyBaseLabelClassRead;
        if (cellTemplateObj.pyFlex && (cellTemplateObj.pyType == "field" && !cellTemplateObj.pyLabelReserveSpace))
            cellTemplateObj.pyPartialClass += " " + cellTemplateObj.pyBaseClassRead;
    } else {
        cellTemplateObj.pyControlContainerDivClass = controlContainerDivClass + cellTemplateObj.pyBaseClassWrite;
        cellTemplateObj.pyLabelClass = labelClass + cellTemplateObj.pyBaseLabelClassWrite;
        cellTemplateObj.pyLabelClassWithoutFlex = controlContainerDivClass + cellTemplateObj.pyBaseLabelClassWrite;
        cellTemplateObj.pyPartialClass += " " + cellTemplateObj.pyCustomReadWriteStyle;
        cellTemplateObj.pyLGCustomClass += " " + cellTemplateObj.pyCustomReadWriteStyle;
        if (cellTemplateObj.pyFlex && (cellTemplateObj.pyType == "" || cellTemplateObj.pyType == "label"))
            cellTemplateObj.pyPartialClass += " " + cellTemplateObj.pyBaseLabelClassWrite;
        if (cellTemplateObj.pyFlex && (cellTemplateObj.pyType == "field" && !cellTemplateObj.pyLabelReserveSpace))
            cellTemplateObj.pyPartialClass += " " + cellTemplateObj.pyBaseClassWrite;
    }
    cellTemplateObj.pyCustomClass = cellTemplateObj.pyPartialClass;
    if(cellnode[TEMPLATE_CONSTANTS["PYAUTOHTML"]]=="false") cellTemplateObj.pyCustomClass += " custom-control";
                                                                                                                        
    /* container class */
    if (node.pyTemplates && node.pyTemplates[0] && node.pyTemplates[0][TEMPLATE_CONSTANTS["PYNAME"]] == "pxLayoutContainer" && node.pyTemplates[0][TEMPLATE_CONSTANTS["PYCONTAINERCUSTOMCLASS"]] != "") {
        var containerCustomClass = pega.ui.TemplateEngine.getCurrentContext().getPropertyValue(node.pyTemplates[0][TEMPLATE_CONSTANTS["PYCONTAINERCUSTOMCLASS"]]);
        cellTemplateObj.pyLGCustomClass += (containerCustomClass ? " " + containerCustomClass : "");
    }
    /*BUG-311822 */
    cellTemplateObj.genContentInner = !cellTemplateObj.pyFlex || cellTemplateObj.pyType == "paragraph";
    cellTemplateObj.isParaGraphFlex = cellTemplateObj.pyFlex && cellTemplateObj.pyType == "paragraph";
    //Check for server visible when and also check if reservr space
    cellTemplateObj.pyAriaHidden = "";

    if (visibility === false) { // Generate spacer and quit
        if (reserveSpace == "true") {
            cellTemplateObj.pyCustomClass = cellTemplateObj.pyCustomClass ? $.trim(cellTemplateObj.pyCustomClass) : "";
            cellTemplateObj.pyCustomClass += " show-space";
            cellTemplateObj.pyControlContainerDivClass = cellTemplateObj.pyControlContainerDivClass +
                " show-space";
            cellTemplateObj.pyAriaHidden = " aria-hidden='true' ";
        }
    }
    if(cellTemplateObj.pyType == "field" && pega.ui.template.DLTemplate.isLabelError(node)){
      cellTemplateObj.pyLabelClass += " labelError"; 
    }
    /* BUG-369871 : added specific class in case of flex error radiogroup */
    if (cellTemplateObj.pyFlex && !cellTemplateObj.pyLabelReserveSpace && cellTemplateObj.pyType == "field") {
        if (node.pyTemplates && node.pyTemplates[0] && node.pyTemplates[0][TEMPLATE_CONSTANTS["PYNAME"]] == "pxRadioButtons") {
            /* childNode is node.pyTemplates[0] */
            var radioNode = node.pyTemplates[0];
            /* orientation should be horizontal */
            var orientation = radioNode.pyCell["pyModes"][0].pyOrientation;
            var labelRadio = radioNode.pyCell.pyLabelFor;
            var errorMsg = radioNode.pyCell["pyModes"][0][TEMPLATE_CONSTANTS["PYERRORMESSAGEHTML"]];
            if (orientation == "horizontal" && labelRadio == "" && errorMsg != "") {
                cellTemplateObj.pyCustomClass += " error-radio-wrapper";
            }
        }
      if(node.pyTemplates && node.pyTemplates[0] && node.pyTemplates[0][TEMPLATE_CONSTANTS["PYNAME"]]) {
        var name = node.pyTemplates[0][TEMPLATE_CONSTANTS["PYNAME"]]
        if(name == "pxTextInput" || name == "pxTextArea" || name == "pxCheckbox" || name == "pxRadioButtons" || name == "pxDropdown" || name == "pxDateTime" || name == "pxAutoComplete" || name == "pxAnyPicker"){
            var cellNode = node.pyTemplates[0];
            /* orientation should be horizontal */
            var labelValue = cellTemplateObj.pyLabelValue;
            var errorMsg = cellNode.pyCell["pyModes"][0][TEMPLATE_CONSTANTS["PYERRORMESSAGEHTML"]];
            if ( labelValue == "" && errorMsg != "") {
                 cellTemplateObj.pyCustomClass += " flex-column";
            }
        }
      }
    }
    var pyIsLabelJSP = JSON.parse(cellnode[TEMPLATE_CONSTANTS["PYISLABELJSP"]] ? cellnode[TEMPLATE_CONSTANTS["PYISLABELJSP"]] : "false");
    if (pyIsLabelJSP) {
        /* Call pxNonTemplate in case of layout and section */
        if (cellTemplateObj.pyType == "layout" || cellTemplateObj.pyType == "sub_section") {
            if (treeNode.pyTemplates[1] && treeNode.pyTemplates[1].pyName == "pxNonTemplate") {
                cellTemplateObj.pyLabelValue = pega.ui.template.RenderingEngine.getRenderer("pxNonTemplate").call(null, treeNode.pyTemplates[1]);
            }
        } else {
            cellTemplateObj.pyLabelValue = pega.ui.TemplateEngine.getHelper("getDLCellControl")(treeNode, cellTemplateObj.pyType); /*call non template*/
        }
    } else {
        var labelValue = cellnode[TEMPLATE_CONSTANTS["PYLABELVALUE"]] || "";
        if (cellnode[TEMPLATE_CONSTANTS["BLOCAL"]] == "true") {
            if(typeof cellnode.pyLabelValue === "string" && cellnode.pyLabelValue.indexOf("^~") != -1){
                var propCtx = pega.ui.TemplateEngine.getCurrentContext().getFieldValParam(cellnode.pyLabelValue);
                cellnode.pyLabelValue = pega.ui.template.DLTemplate.resolveMulFVParam(propCtx);
            }
            cellTemplateObj.pyLabelValue = pega.ui.TemplateEngine.getCurrentContext().getLocalizedValue(cellnode
                .pyLabelValue, "pyCaption", "");
            if (typeof cellTemplateObj.pyLabelValue === 'object') {
                cellTemplateObj.pyLabelValue = labelValue;
            }

        } else if (cellnode[TEMPLATE_CONSTANTS["PYUSELABELDESC"]] && cellnode[TEMPLATE_CONSTANTS["PYUSELABELDESC"]] == "true") {
            cellTemplateObj.pyLabelValue = cellnode[TEMPLATE_CONSTANTS["PYLABELVALUE"]];
        } else {

            if (labelValue.startsWith("."))
                cellTemplateObj.pyLabelValue = pega.ui.TemplateEngine.getCurrentContext().getPropertyValue(cellnode[TEMPLATE_CONSTANTS["PYLABELVALUE"]]) ? pega.ui.TemplateEngine.getCurrentContext().getPropertyValue(cellnode[TEMPLATE_CONSTANTS["PYLABELVALUE"]]) : cellnode[TEMPLATE_CONSTANTS["PYLABELVALUE"]]; /* BUG-293694 */
            else
                cellTemplateObj.pyLabelValue = labelValue;
        }


        cellTemplateObj.pyLabelValue = cellTemplateObj.pyLabelValue ? cellTemplateObj.pyLabelValue.replace(
            /\\"/g, '"').replace(new RegExp("\\'".replace(/([\[\]\/\\])/g, "\\$1"), "g"), "'").replace(
            '"&nbsp;"', " ") : "";
            if(pega.ui.ControlTemplate && typeof(pega.ui.ControlTemplate.crossScriptingFilter) === "function" && cellnode.pyPreventXSSInLabel) {
              var unescape = function (string) {  
                /* introducing custom unescape due to BUG-613226 */
                var htmlUnescapes = {
                  '&amp;': '&',
                  '&lt;': '<',
                  '&gt;': '>',
                  '&quot;': '"',
                  '&#39;': "'"
                };
                var reEscapedHtml = /&(?:amp|lt|gt|quot|#(0+)?39);/g;
                var reHasEscapedHtml = RegExp(reEscapedHtml.source);
                return string && reHasEscapedHtml.test(string)
                ? string.replace(reEscapedHtml, function (entity) {
                  return htmlUnescapes[entity] || "'";
                })
                : string || '';
              };
              cellTemplateObj.pyLabelValue = pega.ui.ControlTemplate.crossScriptingFilter(unescape(cellTemplateObj.pyLabelValue), false);
            }

    }
    cellTemplateObj.pyIsChildNonTemplate = false;
    if (cellTemplateObj.metaData && cellTemplateObj.metaData.pyTemplates && cellTemplateObj.metaData.pyTemplates[0] && cellTemplateObj.metaData.pyTemplates[0].pyName) {
        "pxNonTemplate" == cellTemplateObj.metaData.pyTemplates[0].pyName && (cellTemplateObj.pyIsChildNonTemplate = true);
        "pxRichTextEditor" == cellTemplateObj.pyFormat && (cellTemplateObj.pyIsChildNonTemplate = false);
    }

    var cnt = pega.ui.gStackOrder.pop();
    if (!cnt)
        cnt = 0;
    cnt++;
    pega.ui.gStackOrder.push(cnt);
    /* BUG-322542 For column item-n need not be generated*/
    if (cellnode[TEMPLATE_CONSTANTS["ISCOLUMNLAYOUT"]] === "true" && cellTemplateObj.pyFlex) {
        cellTemplateObj.pyCustomClass = "content-item content-" + (cellTemplateObj.pyType != "" ? cellTemplateObj.pyType : "label") + " " + cellTemplateObj.pyCustomClass;
    } else {
        cellTemplateObj.pyCustomClass = "content-item content-" + (cellTemplateObj.pyType != "" ? cellTemplateObj.pyType : "label") + " item-" + cnt + " " + cellTemplateObj.pyCustomClass;
    }
    if(cellnode[TEMPLATE_CONSTANTS["FIRSTITEMCLASS"]] && cellnode[TEMPLATE_CONSTANTS["FIRSTITEMCLASS"]] != "" && cnt == 1){
      cellTemplateObj.pyCustomClass += cellnode[TEMPLATE_CONSTANTS["FIRSTITEMCLASS"]];
    }
    if(cellnode[TEMPLATE_CONSTANTS["LASTITEMCLASS"]] && cellnode[TEMPLATE_CONSTANTS["LASTITEMCLASS"]] != "" && repeatingParentInfo && cnt == repeatingParentInfo.size){
      cellTemplateObj.pyCustomClass += cellnode[TEMPLATE_CONSTANTS["LASTITEMCLASS"]];
    }  
    cellTemplateObj.pyCustomClass = cellTemplateObj.pyCustomClass.trim().replace(/\s+/g, ' ');

    /* Helper Text */

    cellTemplateObj.pyHelperTextIcon = false;
    cellTemplateObj.pyHelperLabel = false;
    cellTemplateObj.pyHelperVal = "";
    if (pega.ui.template.DLTemplate.isHelperIcon(node)) {
        cellTemplateObj.pyHelperTextIcon = true;
        var pyName =  node &&  node.pyTemplates &&  node.pyTemplates[0] &&  node.pyTemplates[0][TEMPLATE_CONSTANTS["PYNAME"]] ?  node.pyTemplates[0][TEMPLATE_CONSTANTS["PYNAME"]] : '';
        var helperText = node && node.pyTemplates && node.pyTemplates[0] && node.pyTemplates[0].pyCell && node.pyTemplates[0].pyCell.pyModes && node.pyTemplates[0].pyCell.pyModes[0] &&   node.pyTemplates[0].pyCell.pyModes[0].helperTextRadiogroup ? node.pyTemplates[0].pyCell.pyModes[0].helperTextRadiogroup : '';
        var toolTipVal = "";
        if (node[TEMPLATE_CONSTANTS["PYVISIBILITY"]]) {
          toolTipVal =
            node.pyTemplates &&
            node.pyTemplates[0] &&
            node.pyTemplates[0].pyTemplates &&
            node.pyTemplates[0].pyTemplates[0] &&
            node.pyTemplates[0].pyTemplates[0].pyCell &&
           (node.pyTemplates[0].pyTemplates[0].pyCell.pyModes[0].tooltip || node.pyTemplates[0].pyTemplates[0].pyCell.tooltip);
        } else {
          toolTipVal =
            pyName === "pxRadioButtons"
            ? helperText
            : node.pyTemplates[0].pyCell.pyModes[0].tooltip ||
              node.pyTemplates[0].pyCell.tooltip;
        }
        if (toolTipVal) {
            var _pyTooltip;
            if(pyName === "pxCheckbox" || (pyName === 'pxVisible' && node &&  node.pyTemplates && node.pyTemplates[0] && node.pyTemplates[0].pyTemplates && node.pyTemplates[0].pyTemplates[0] && node.pyTemplates[0].pyTemplates[0][TEMPLATE_CONSTANTS["PYNAME"]] === "pxCheckbox")) _pyTooltip = currentContext.getLocalizedValue(toolTipVal, "pyActionPrompt", "");
            else if(pyName === "pxDateTime" || pyName === "pxDateRange") _pyTooltip = currentContext.getLocalizedValue(toolTipVal, "pyCaption", "");
            else _pyTooltip = currentContext.getLocalizedValue(toolTipVal, "pyTooltip", "");
            if (!_pyTooltip) { /* constant values will not get localized values for currentContext */
                _pyTooltip = pega.clientTools.getLocalizedTextForString("pyTooltip", toolTipVal);
            }
            if(pega.ui.ControlTemplate && typeof(pega.ui.ControlTemplate.crossScriptingFilter) === "function") {
              	_pyTooltip = pega.ui.ControlTemplate.crossScriptingFilter(_pyTooltip);
            }
            if (_pyTooltip) {
                cellTemplateObj.pyHelperVal = _pyTooltip;
            } else {
                cellTemplateObj.pyHelperVal = "";
            }
        }

        if (cellTemplateObj.pyLabelReserveSpace && cellTemplateObj.pyLabelValue) {
            cellTemplateObj.pyHelperLabel = true;
        }

        if (!cellTemplateObj.pyHelperLabel) {
            cellTemplateObj.pyCustomClass += " helper-icon-nolabel";
        }
    }
    cellTemplateObj.requiredAccessibilityText =  pega.u.d.fieldValuesList.get("pzRequired");
    return pega.ui.TemplateEngine.execute("pzpega_ui_DLCellTemplate", cellTemplateObj);

});
//static-content-hash-trigger-GCC
pega.ui.ExpressionEvaluator = (function() {
    var handlers = {},
        REFRESH_WHEN = "refreshWhen",
        SHOW_WHEN = "showWhen",
        DISABLE_WHEN = "disableWhen",
        SECTION_REFRESH_WHEN = "sectionRefreshWhen",
        CELL_REFRESH_WHEN = "cellRefreshWhen",
        ALL_REFRESH_WHENS = "allRefreshWhens",
        NON_REFRESH_WHENS = "nonRefreshWhens",
        REQUIRED_WHEN = "requiredWhen",
        ACTIVE_WHEN = "activeWhen",
        DATA_CONTEXT = "data-context",
        BASE_REF = "base_ref",
        FULL_BASE_REF = "full_base_ref",
        DATA_EXPR_ID = "data-expr-id",
        IS_SPECIAL_CASE_OF_CONTEXT = "isSplContext",
        specialOperands = ["changes", "adddelete"],
        AFTER_VISIBLE_WHENS_HANDLED = "AfterVisibleWhenExpressionsEvaluated",
        sectionInfoStack = [];
    pega.ui.sectionsWithHybridExpressions = pega.ui.sectionsWithHybridExpressions || [];

    /**
     * Adds an expression meta which comes from the server on rendering
     *
     * @param      {<type>}  metaData  The meta data
     */
    function _addExpressionMeta(metaData) {
        if (!_getCtxExpressionEvaluator().expressionData) {
            _getCtxExpressionEvaluator().expressionData = {};
            //Considering expressions data only
            _getCtxExpressionEvaluator().expressionData.expressions = metaData.expressions;
            _initDefaultHandlers();
            return;
        }

        if (metaData.expressions) {
            _getCtxExpressionEvaluator().expressionData.expressions = _getCtxExpressionEvaluator().expressionData.expressions || {};
            for (var expId in metaData.expressions) {
                _getCtxExpressionEvaluator().expressionData.expressions[expId] = metaData.expressions[expId];
            }
        }
    }

    function _getExpressionMeta() {
        return _getCtxExpressionEvaluator().expressionData;
    }

    /**
     * Evaluates expression by given expression id. This api is called on rendering
     *
     * @param      {<type>}  expressionId  The expression identifier
     * @return     {<Object>}  Returns result of expression by type
     */
    function _evaluateClientExpressions(expressionId) {
        var expressionResults = {};
        if (!_getExpressionMeta() || !_getExpressionMeta().expressions || !_getExpressionMeta().expressions[expressionId]) {
            return expressionResults;
        }
        _getCtxExpressionEvaluator().ON_RENDERING = true;
        var expression = _getExpressionMeta().expressions[expressionId];
        var context = pega.ui.TemplateEngine.getCurrentContext().getEntryHandle();
        for (var expType in expression) {
            if (handlers[expType] && typeof handlers[expType] == "function" && !_isRefreshType(expType)) {
                expressionResults[expType] = _evaluateExpression(expression[expType].expr, expression[expType].props, context, expression[expType].isparamdp);
            }
        }
        _getCtxExpressionEvaluator().ON_RENDERING = false;
        //check if hybrid expression
        var currentSectionInfo = _peekSectionInfo();
        if(currentSectionInfo && pega.ui.sectionsWithHybridExpressions){
            if(pega.ui.sectionsWithHybridExpressions.indexOf(currentSectionInfo.sectionName)!=-1){
                expressionResults.ignoreChildren = true;
            }
        }
        return expressionResults;
    }


    function _evaluateClientExpressionsLG(expressionId, index, returnIndex, baseRef) {
        var expressionResults = {};
        if (!_getExpressionMeta() || !_getExpressionMeta().expressions || !_getExpressionMeta().expressions[expressionId]) {
            return expressionResults;
        }
        _getCtxExpressionEvaluator().ON_RENDERING = true;
        var expression = _getExpressionMeta().expressions[expressionId];
        /*if(index){
            var baseref = expression.baseRef;            
            if(baseref){
                var lastIndex = baseref.indexOf("(");
                context = baseref.substring(0, lastIndex+1) + index + baseref.substring(lastIndex+1);
            }
        } else{
            context = pega.ui.TemplateEngine.getCurrentContext().getEntryHandle();
        }*/
        for (var expType in expression) {
            if (handlers[expType] && typeof handlers[expType] == "function" && !_isRefreshType(expType) && expression.activeWhen.expr) {
                for (var i = 0; i < expression.activeWhen.expr.length; i++) {
                    var activeIndex = expression.activeWhen.expr[i].index;
                    if (index) {
                        activeIndex = returnIndex;
                    }
                    var whenExpr = expression.activeWhen.expr[i].expr;
                    var evalResult = false;
                    if (whenExpr && whenExpr.startsWith("EXP=")) {
                        evalResult = pega.ui.TemplateEngine.getCurrentContext().getWhenResult(whenExpr.substring(5));
                    } else {
                        var context = pega.ui.TemplateEngine.getCurrentContext().getEntryHandle();
                        if(baseRef)
                          context = baseRef;
                        evalResult = _evaluateExpression(whenExpr, expression.activeWhen.props, context);
                    }
                    expressionResults[activeIndex] = evalResult;
                }
            }
        }
        _getCtxExpressionEvaluator().ON_RENDERING = false;
        return expressionResults;
    }

    /**
     *  API is called on dom property change.
     *  Gets all expressions by property, evaluates and triggers handlers
     *
     * @param      {(Function|string)}  propertyElem  The property element
     */
    function _handlePropertyChange(propertyElem) {
        if (!_getExpressionMeta() || (_getExpressionMeta() && !_getExpressionMeta().properties)) {
            return;
        }
        if (propertyElem instanceof HTMLElement) {
            var propName = pega.u.property.toReference(propertyElem.name);
        } else {
            var propName = (propertyElem.indexOf("$p") < 0) ? propertyElem : pega.u.property.toReference(propertyElem);
            propertyElem = null;
        }
        if (propName.indexOf(".") != -1) {
            if (propertyElem) {
                if (!_getDomElement(propertyElem.name)) {
                    _getCtxExpressionEvaluator().changedDomPropertyValue = _getChangeTrackerOrClientCacheValue(pega.u.property.toReference(propertyElem.name));
                } else {
                    _getCtxExpressionEvaluator().changedDomPropertyValue = _getElementValueFromDom(propertyElem);
                }
            } else {
                _getCtxExpressionEvaluator().changedDomPropertyValue = _getCorrectPropertyValueFromDOM(propName);
            }
            _getCtxExpressionEvaluator().changedDomPropertyName = propName;
            _getCtxExpressionEvaluator().propertyNameFromDomChange = propName;
            _buildContextDataAndHandleExpressions([propName]);

            _getCtxExpressionEvaluator().changedDomPropertyValue = null;
            _getCtxExpressionEvaluator().changedDomPropertyName = null;
        }

    }

    /**
     * API is called whenever there is a property exists in changedPropertiesList in change tracker
     *
     * @param      {<type>}  ctObj   The change tracker object
     */
    function _handleChangedProperties(ctObj) {
        if (!_getExpressionMeta() || (_getExpressionMeta() && !_getExpressionMeta().properties)) {
            return;
        }
        var changedProperties = _getChangedProperties(ctObj);

        if (!changedProperties || changedProperties.length == 0) {
            return;
        }

        _buildContextDataAndHandleExpressions(changedProperties);
    }

    /**
     * Builds context data and handle expressions.
     *
     * @param      {<type>}  propertyNames  The property names
     */
    function _buildContextDataAndHandleExpressions(propertyNames) {
        if (!propertyNames || propertyNames.length == 0) {
            return;
        }

        var expressionContextsToEvaluate = _buildExpressionIdsWithContext(propertyNames);

        if (!expressionContextsToEvaluate) {
            return;
        }
        _handleClientExpressionsOnPropertyChanges(expressionContextsToEvaluate);

    }

    /**
     * Determines if skip expression evaluation.
     *
     * @param      {<type>}   expType  The exponent type
     * @return     {boolean}  True if skip expression evaluation, False otherwise.
     */
    function _isSkipExpressionEvaluation(expType) {
        var isSkipEvaluation = false;

        if (_getCtxExpressionEvaluator().evaluateSpecificExpressionType) {
            //Trigger specific type of expressions in case evaluateSpecificExpressionType is set
            if (_getCtxExpressionEvaluator().evaluateSpecificExpressionType == NON_REFRESH_WHENS && _isRefreshType(expType)) {
                //Ignoring refresh whens in case non refresh whens are targetted
                isSkipEvaluation = true;
            }
        }

        //Layout refresh whens are not supported in offline
        if (_isOffline() && expType == REFRESH_WHEN) {
            //Ignoring layout refresh whens
            isSkipEvaluation = true;
        }
        return isSkipEvaluation;
    }

    /**
     * Builds an expression identifiers with context.
     *
     * @param      {<type>}  propertyNames  The property names
     * @return     {Array}   The expression identifiers with context.
     */
    function _buildExpressionIdsWithContext(propertyNames) {
        var expressionIdsWithContext = {};

        for (var ind = 0; ind < propertyNames.length; ind++) {
            var curProperty = propertyNames[ind];

            var expressionIds = _getExpressionIdsByProperty(curProperty);

            for (var i = 0; i < expressionIds.length; i++) {
                var exprId = expressionIds[i];
                

                var expressionObj = _getExpressionMeta().expressions[exprId];
                if (!expressionObj) {
                    continue;
                }
                for (var expType in expressionObj) {

                    if (!handlers[expType] || typeof handlers[expType] != "function") {
                        continue;
                    }

                    if (_isSkipExpressionEvaluation(expType)) {
                        continue;
                    }
                    expressionIdsWithContext[exprId] = expressionIdsWithContext[exprId] || [];
                    var exprContext = _getExpressionLookupContext(exprId, expType, curProperty);
                    /*var exprIdWithContext = {};
                    exprIdWithContext["id"] = exprId;
                    if (_isValidValue(exprContext)) {
                        exprIdWithContext["context"] = exprContext;
                    }*/
                    
                    expressionIdsWithContext[exprId].push(exprContext);
                    
                }
            }

        }

        return expressionIdsWithContext;
    }

    /**
     * Gets the element value from dom.
     *
     * @param      {<type>}    propertyElem  The property element
     * @return     {Function}  The element value from dom.
     */
    function _getElementValueFromDom(propertyElem) {
        var propNewValue = null;
        if (propertyElem) {
            propNewValue = domUtils.getDOMElementValue(propertyElem);
            if (_isElementStale(propertyElem, propNewValue)) {
                propNewValue = _getCorrectPropertyValueFromDOM(propertyElem.name);
            }
        }
        return propNewValue;
    }

    /*
     * Check if the element is present in the DOM.
     *
     * @param       {<type>}    propertyElem    The property element
     * @param       {<type>}    propNewValue    The value attribute
     * @return      {boolean}
     */
    function _isElementStale(propertyElem, propNewValue) {
        // BUG-294962: Checking for stale element reference of dropdown in IE 
        // BUG-327329: Element is stale if its parent is null
        return (propNewValue == undefined || propNewValue == null || propertyElem.length == 0 || propertyElem.parentElement == null || propertyElem.parentNode == null);
    }

    /**
     * Gets the correct property value from dom.
     *
     * @param      {<type>}  propertyName  The property name
     * @return     {<type>}  The correct property value from dom.
     */
    function _getCorrectPropertyValueFromDOM(propertyName) {
        var propValue = null;
        var propertyElem = pega.u.d.getCorrectPropertyElemFromDOM(pega.u.property.toHandle(propertyName), pega.ui.ChangeTrackerMap.getTracker());
        if (propertyElem && propertyElem.length > 0) {
            propValue = pega.u.d.getGroupElementValue(propertyElem);
        }
        return propValue;
    }

    /**
     * Gets the expression identifiers by property for properties data.
     * This API takes care of all scenarios like below
     * D_Page.pxResults(1).my_Page().prop1, D_Page.pxResults(2).my_Page(1).prop1, D_Page.pxResults().my_Page().prop1 
     * and simple references
     *
     * @param      {string}  propertyName  The property name
     * @return     {Array}   The expression identifiers by property.
     */
    function _getExpressionIdsByProperty(propertyName) {
        var topLevelPage = propertyName;
        var propertyRef = "";
        var propDotInd = propertyName.indexOf(".");
        if (propDotInd != -1) { //extract toplevelpage from full ref
            topLevelPage = propertyName.substring(0, propDotInd);
            propertyRef = propertyName.substring(propDotInd);
        }
        if (!_getExpressionMeta().properties[topLevelPage]) {
            // No property data found for topLevelPage
            return [];
        }
        var exprIds = [];
        if (propertyRef.indexOf('(') != -1 && propertyRef.indexOf(')') != -1) {
            // Regex to get all combinations
            var lastDotInd = propertyRef.lastIndexOf('.');
            var property = propertyRef.substring(lastDotInd);
            var subLevelRef = propertyRef.substring(0, lastDotInd);

            var subLevelRegExStr = subLevelRef.replace(/(\(.*?\))/g, _replacer);

            subLevelRegExStr = "^" + subLevelRegExStr + property + "$";

            var replaceRegEx = new RegExp(subLevelRegExStr, "g");

            for (var prop in _getExpressionMeta().properties[topLevelPage]) {
                var indicesStr = prop.match(replaceRegEx);
                if (indicesStr) {
                    var exprIdsObj = _getExpressionMeta().properties[topLevelPage][prop];
                    if (exprIdsObj && exprIdsObj["exprIds"]) {
                        Array.prototype.push.apply(exprIds, Object.keys(exprIdsObj["exprIds"]));
                    }

                }
            }

        } else {
            //simple property on topLevel page
            var exprIdsObj = _getExpressionMeta().properties[topLevelPage][propertyRef];
            if (exprIdsObj && exprIdsObj["exprIds"]) {
                return Object.keys(exprIdsObj["exprIds"]);
            }
        }
        return exprIds;
    }

    function _replacer(match) {
        var index = match.replace('(', '').replace(')', '');
        if (index != "") {
            return "\\((" + index + "|)\\)";
        } else {
            return "\\(()\\)";
        }
    }

    /**
     * Gets all sublevel properties for top reference.
     *
     * @param      {<type>}  topLevelPage  The top level page
     * @return     {<type>}  All properties for top reference.
     */
    function _getAllPropertiesForTopReference(topLevelPage) {
        if (!_getExpressionMeta().properties[topLevelPage]) {
            return null;
        }
        return Object.keys(_getExpressionMeta().properties[topLevelPage]);
    }

    /**
     * Return final list of properties to evaluate by filtering
     * Filters : 
     * 1. Do not consider if the property is present in dom and is not a posted property
     * 2. Do not consider if property is already triggered on dom change
     *
     * @param      {(Function|string)}  propertyName               The property name
     * @param      {<type>}             finalPropertiesToEvaluate  The final properties to evaluate
     */
    function _filterPropertiesToEvaluate(propertyName, finalPropertiesToEvaluate) {
        if (finalPropertiesToEvaluate[propertyName]) {
            //If the property is a duplicate entry
            return;
        }
        if (propertyName.indexOf(".") == -1) {
            // If property is toplevel property, get all sublevel properties
            var allSubLevelProps = _getAllPropertiesForTopReference(propertyName);
            if (allSubLevelProps && allSubLevelProps.length > 0) {
                for (var i = 0; i < allSubLevelProps.length; i++) {
                    _filterPropertiesToEvaluate(propertyName + allSubLevelProps[i], finalPropertiesToEvaluate);
                }
            }
        } else if (_getCtxExpressionEvaluator().propertyNameFromDomChange && _getCtxExpressionEvaluator().propertyNameFromDomChange == propertyName) {
            //Ignore evaluation if expressions already triggered on same property from dom change
            //This happens when we have post value cofigured on keypress. change value and press key
            return;
        } else {
            var propertyHandle = pega.u.property.toHandle(propertyName);
            // Ignore evaluation when property is present in DOM and property is not a posted property
            // pega.u.d.ct_postedProp hold property name for which post value happened
            if (pega.u.d.ct_postedProp != propertyHandle) {
                var propertyDomElem = _getDomElement(propertyName);
                // Ignore evaluation when property is present in DOM and not a calculated value and not part of refreshing streams
                // If dom element is part of refreshing streams, evaluate expressions
                if (propertyDomElem && propertyDomElem.id != "CV" && !_isElementPresentInRefreshingStreams(propertyDomElem)) {
                    return;
                }
            }
        }
        finalPropertiesToEvaluate[propertyName] = true;
    }

    /**
     * Gets the changed properties from change tracker and filter them and return final list of properties
     *
     * @param      {<type>}  ctObj   The change tracker object
     * @return     {<type>}  The changed properties.
     */
    function _getChangedProperties(ctObj) {
        var changedProperties = {};
        if (ctObj && ctObj.changedPropertiesList.length > 0) {
            for (var i = 0; i < ctObj.changedPropertiesList.length; i++) {
                var property = ctObj.changedPropertiesList[i];
                _filterPropertiesToEvaluate(property, changedProperties);
            }
        }
        if (ctObj && ctObj.addRemovePagesList.length > 0) {
            for (var i = 0; i < ctObj.addRemovePagesList.length; i++) {
                var property = ctObj.addRemovePagesList[i];
                if (changedProperties[property]) {
                    continue;
                }
                changedProperties[property] = true;
            }
        }
        if (_isOffline()) {
            var cplist = pega.ui.ClientCache.getChangedPagesList();
            if (cplist.length > 0) {
                for (var i = 0; i < cplist.length; i++) {
                    _filterPropertiesToEvaluate(cplist[i], changedProperties);
                }
                pega.ui.ClientCache.clearChangedPagesList();
            }
        }
        return Object.keys(changedProperties);
    }

    /**
     * Determines if property present in dom.
     *
     * @param      {<type>}   property  The property
     * @return     {boolean}  True if property present in dom, False otherwise.
     */
    function _isPropertyPresentInDOM(property) {
        var domElement = _getDomElement(property);
        return !!domElement;
    }

    function _getDomElement(property) {
        var propHandle = pega.u.property.toHandle(property);
        return _getCtxDom().getElementsByName(propHandle)[0];
    }

    function _isOffline() {
        return pega.u.d.ServerProxy && pega.u.d.ServerProxy.isDestinationLocal();
    }

    /**
     * Gets the expression context in where expressions should be triggered
     * If the changed property has full reference, return context as null
     * like D_page.prop1, all the expression dom elements with that expression id should be triggered
     * 
     * If the changed property is relative, extract context from expression properties and returns it
     * like .prop2, expression dom elements within the specific context should be triggered
     *
     * @param      {<type>}  expressionId      The expression identifier
     * @param      {<type>}  expType           The exponent type
     * @param      {string}  fullPropertyName  The full property name
     * @return     {string}  The expression context.
     */
    function _getExpressionLookupContext(expressionId, expType, fullPropertyName) {
        var expressionObj = _getExpressionMeta().expressions[expressionId];

        var exprProperties = expressionObj[expType]["props"];

        if (exprProperties.indexOf(fullPropertyName) != -1) {
            //1 : Check for absolute property. Evaluate all expressionIds in this case
            return null;
        } else {
            //2: Relative property. Evaluate only targeted context expression
            //Split by DOT to get each subtype and match them from ending
            var fullPropertyArr = fullPropertyName.split(".");
            var fullPropertyArrLen = fullPropertyArr.length;
            var relativeContext = null;

            for (var j = 0; j < exprProperties.length; j++) {
                var expressionProperty = exprProperties[j];
                var exprPropertiesArr = expressionProperty.split(".");
                if (expressionProperty.indexOf(".") == 0) {
                    //If property is ".someProp", array returns two elements out of them first is empty
                    exprPropertiesArr.shift();
                }
                var exprPropertiesArrLen = exprPropertiesArr.length;
                
                var matchedSubPropCount = 0;

                //Check if fullPropertyName is exactly ends with expressionProperty
                for (var i = exprPropertiesArrLen - 1; i >= 0; i--) {
                    //Check if both end parts are matching
                    if (exprPropertiesArr[i] === fullPropertyArr[fullPropertyArrLen - (matchedSubPropCount + 1)]) {
                        matchedSubPropCount++;
                    } else {
                        break;
                    }
                }

                if (matchedSubPropCount == exprPropertiesArrLen) {
                    //If fullPropertyName is exactly ends with expressionProperty
                    relativeContext = fullPropertyName.substring(0, fullPropertyName.length - expressionProperty.length);
                    break;
                }
                
            }

            return relativeContext;
        }

    }

    function _isRefreshType(expType) {
        if (REFRESH_WHEN == expType || SECTION_REFRESH_WHEN == expType || CELL_REFRESH_WHEN == expType) {
            return true;
        }
        return false;
    }

    function _isSpecialCaseOfContext(expressionId) {
        return _getExpressionMeta() && _getExpressionMeta().expressions[expressionId] && _getExpressionMeta().expressions[expressionId][IS_SPECIAL_CASE_OF_CONTEXT];
    }

    /**
     * Builds query selector to expressions dom elements by given expressionIds and contexts
     *
     * @param      {<type>}  expressionsToEvaluate  The expressions to evaluate
     * @return     {string}  The query selector for expressions.
     */
    function _buildQuerySelectorForExpressions(expressionsToEvaluate) {
        var querySelector = "";
        var contexts;
        for (var exprId in expressionsToEvaluate) {
            contexts = expressionsToEvaluate[exprId];

            contexts.forEach(function(context) {
                if (_isValidValue(context)) {
                    if (_isSpecialCaseOfContext(exprId)) {
                        querySelector = querySelector + "[" + BASE_REF + " = '" + context + "']";
                    } else {
                        querySelector = querySelector + "[" + DATA_CONTEXT + " = '" + context + "']";
                    }
                }
                querySelector = querySelector + "[" + DATA_EXPR_ID + " = '" + exprId + "'],";
            });
        }
        return querySelector.substring(0, querySelector.length - 1);
    }

    /**
     * Gets the dom elements group by expression type.
     * All refresh whens will be grouped in one and others will be as per their expression type
     *
     * @param      {<type>}  expressionDomElements  The expression dom elements
     * @return     {<type>}  The dom elements group by type.
     */
    function _getDomElementsGroupByType(expressionDomElements) {
        var domElementsGroup = {};
        var domElementsLen = expressionDomElements.length;
        for (var i = 0; i < domElementsLen; i++) {
            var currentDomElem = expressionDomElements[i];
            var exprId = currentDomElem.getAttribute(DATA_EXPR_ID);
            var expressionObj = _getExpressionMeta().expressions[exprId];

            for (var expType in expressionObj) {
                if (!handlers[expType] || typeof handlers[expType] != "function") {
                    continue;
                }
                if (_isRefreshType(expType)) {
                    var refreshType = expType;

                    domElementsGroup[ALL_REFRESH_WHENS] = domElementsGroup[ALL_REFRESH_WHENS] || [];
                    domElementsGroup[ALL_REFRESH_WHENS].push({ "dom": currentDomElem, "type": refreshType });
                } else {
                    domElementsGroup[expType] = domElementsGroup[expType] || [];
                    domElementsGroup[expType].push(expressionDomElements[i]);
                }
            }

        }
        return domElementsGroup;
    }

    function _getFilteredExpressionDomElements(expressionContextObjects) {
        var expressionDomElements = _getCtxDom().querySelectorAll("[data-expr-id]");
        var filteredExpressionDomElements = [];

        for (var i = 0; i < expressionDomElements.length; i++) {
            var exprId = expressionDomElements[i].getAttribute("data-expr-id");
            var context = expressionDomElements[i].getAttribute("data-context") || expressionDomElements[i].getAttribute(BASE_REF);

            var expressionContexts = expressionContextObjects[exprId];
            if(!expressionContexts) {
                continue;
            } 

            if(expressionContexts.indexOf(null) != -1 || (context && expressionContexts.indexOf(context) != -1)) {
                filteredExpressionDomElements.push(expressionDomElements[i]);
            } 
            
            /*if (((expressionContextObjects[exprId] && context) && expressionContextObjects[exprId] === context) || expressionContextObjects[exprId] === null) {
                filteredExpressionDomElements.push(expressionDomElements[i]);
                continue;
            }*/
            
        }
        expressionDomElements = null;
        return filteredExpressionDomElements;
    }

    /**
     * Main API to handle expressions on properties
     *
     * @param      {<type>}  expressionsToEvaluate  The expressions to evaluate
     */
    function _handleClientExpressionsOnPropertyChanges(expressionsToEvaluate) {
        var expressionContextsLength = Object.keys(expressionsToEvaluate).length;
        if (expressionContextsLength == 0) {
            return;
        }
        if (expressionContextsLength > 50) {
            var expressionDomElements = _getFilteredExpressionDomElements(expressionsToEvaluate);
        } else {
            var querySelector = _buildQuerySelectorForExpressions(expressionsToEvaluate);
            var expressionDomElements = _getCtxDom().querySelectorAll(querySelector);
        }

        var domElementsGroup = _getDomElementsGroupByType(expressionDomElements);

        _evaluateAndTriggerAllRefreshWhens(domElementsGroup[ALL_REFRESH_WHENS]);

        for (var expType in domElementsGroup) {
            if (!handlers[expType] || expType == ACTIVE_WHEN) {
                continue;
            }
            //Fire all non refresh whens
            _evaluateAndTriggerNonRefreshWhens(domElementsGroup[expType], expType);
        }

        //Trigger Active Whens
        if (domElementsGroup[ACTIVE_WHEN]) {
            handlers[ACTIVE_WHEN](domElementsGroup[ACTIVE_WHEN]);
        }


    }

    /**
     * Determines if the given dom element is in modal.
     *
     * @param      {<type>}   domElement  The dom element
     * @return     {boolean}  True if in modal, False otherwise.
     */
    function _isInModal(domElement) {
        var isPresentInModal = false;
        var currentElement = domElement;
        while (currentElement != null && currentElement != document.body) {
            if (currentElement == pega.u.d.modalDialog.body) {
                isPresentInModal = true;
                break;
            }
            currentElement = currentElement.parentElement;
        }
        return isPresentInModal;
    }

    function _isEmpty(obj) {
        if (!obj) {
            return true;
        }
        var objLength = Object.keys(obj).length;
        return !objLength;
    }

    /**
     * Determines if dom element present in refreshing streams.
     * Refreshing streams are : Stream that are refreshed through reloadSection action and are going to refresh through expressions 
     * and any other component refreshes
     * 
     * If given element is a child or same of refreshing streams returns true
     *
     * @param      {<type>}   domElement  The dom element
     * @return     {boolean}  True if element present in refreshing streams, False otherwise.
     */
    function _isElementPresentInRefreshingStreams(domElement) {

        var isPresent = false;

        if (!_isEmpty(_getCtxExpressionEvaluator().elementsToBeRefreshed) || !_isEmpty(_getCtxExpressionEvaluator().reloadSectionsCache) || !_isEmpty(_getCtxExpressionEvaluator().reloadComponentsCache)) {
            var currentElement = domElement;
            var ctxElem = _getCtxElement();


            for (; currentElement != null && currentElement != ctxElem; currentElement = currentElement.parentElement) {
                //Consider only expression dom elements to check in elementsToBeRefreshed
                if (!_isEmpty(_getCtxExpressionEvaluator().elementsToBeRefreshed) && currentElement.getAttribute(DATA_EXPR_ID) && _getCtxExpressionEvaluator().elementsToBeRefreshed.indexOf(currentElement) != -1) {
                    //Parent or same element will be refreshing already. Do not refresh its child element
                    isPresent = true;
                    break;
                }
                //Consider only section elements to check in _getCtxExpressionEvaluator().reloadSectionsCache
                if (!_isEmpty(_getCtxExpressionEvaluator().reloadSectionsCache) && currentElement.getAttribute("uniqueid")) {
                    var sectionName = currentElement.getAttribute("node_name");
                    if (!_getCtxExpressionEvaluator().reloadSectionsCache[sectionName]) {
                        continue;
                    }
                    var baseRef = pega.u.d.getBaseRef(currentElement);
                    if (!baseRef) {
                        baseRef = "";
                    }
                    if (_getCtxExpressionEvaluator().reloadSectionsCache[sectionName][baseRef]) {
                        isPresent = true;
                        break;
                    }
                }
                //Consider only expression dom elements to check in reloadComponentsCache
                if (!_isEmpty(_getCtxExpressionEvaluator().reloadComponentsCache) && _getCtxExpressionEvaluator().reloadComponentsCache.indexOf(currentElement) != -1) {
                    //Parent or same element will be refreshing already.
                    isPresent = true;
                    break;
                }
            }
        }

        return isPresent;
    }

    /**
     * Determines whether to consider this refresh when or not.
     * If modal is opened, and refresh dom element is not part of modal, return true (Do not trigger refresh)
     * If dom element is part of refreshing streams, return true (Do not trigger refresh)
     *
     * @param      {Function}            domElement   The dom element
     * @param      {<type>}              refreshType  The refresh type
     * @return     {(Function|boolean)}  True if invalid refresh, False otherwise.
     */
    function _isInvalidRefresh(domElement, refreshType) {
        // BUG-339861: Mobile modal with full screen may not have bModalDialogOpen set to false though it close due to animation
        // BUG-387507 : added additional check to verify if target element is in overlay
        if ((pega.u.d.bModalDialogOpen && !pega.u.d.isModalClosing) && pega.u.d.modalDialog.body && !_isInModal(domElement) && pega.u.d.getPopOverLevel(domElement) == -1) {
            return true;
        }
        var isInValidRefresh = false;
        var currentElement = domElement;
        var exprId = domElement.getAttribute("data-expr-id"), expObj;
        if (!_isEmpty(_getCtxExpressionEvaluator().elementsToBeRefreshed) || !_isEmpty(_getCtxExpressionEvaluator().reloadSectionsCache) || !_isEmpty(_getCtxExpressionEvaluator().reloadComponentsCache)) {
            if (refreshType == SECTION_REFRESH_WHEN) {
                currentElement = _getSectionElement(domElement, false);
            }
            isInValidRefresh = _isElementPresentInRefreshingStreams(currentElement);
            /* BUG-397121 : Flow actions can have refresh included section on property changes specifying post activity/data-transform. 
            In such cases, it is a valid refresh. */
            if(isInValidRefresh &&_isTriggeredFromFlowAction(domElement)) {
                isInValidRefresh = false;
            }
        }
        if (!isInValidRefresh) {
            _getCtxExpressionEvaluator().elementsToBeRefreshed.push(domElement);
        }
        return isInValidRefresh;

    }

    /**
    *   Check if the expression has a refresh with a post activity/DT
    *   configured. Return the name of activity / DT.
    *
    *   @param      {<type>}            expressionId   expressionId
    */
    function _isTriggeredFromFlowAction(domElement) {
        var triggeredFromFA = false,
            expressionId = domElement.getAttribute("data-expr-id"),
            parentFA = domElement.parentElement,
            parentMetadata = parentFA.getAttribute("data-ui-meta"),
            isFlowAction = parentMetadata && JSON.parse(parentMetadata.replace(/'/g, "\"")).type == "FlowAction";


        var expObj = _getExpressionMeta().expressions[expressionId];
        Object.keys(expObj).map(function(prop) {
            if(isFlowAction && prop == "sectionRefreshWhen" && (expObj[prop]["activity"] || expObj[prop]["dt"])) {
                triggeredFromFA = true;
            }
        });
        return triggeredFromFA;
    }

    /**
     * Gets the parent/child section element for given element
     * if getParent is true, then return parent section element
     * if getParent is false, then return child section element
     *
     * @param      {<type>}   domElement  The dom element
     * @param      {boolean}  getParent   The get parent
     * @return     {<type>}   The section element.
     */
    function _getSectionElement(domElement, getParent) {
        if (!domElement) {
            return null;
        }
        var currentElement = domElement;
        if (getParent == true) {
            while (currentElement != null && currentElement != _getCtxElement()) {
                if (currentElement.id == "RULE_KEY" && currentElement.getAttribute("node_type") == "MAIN_RULE") {
                    break;
                }
                currentElement = currentElement.parentElement;
            }
            return currentElement;
        } else {
            return currentElement.querySelector("[id='RULE_KEY'][node_type='MAIN_RULE']");
        }
    }

    function _getPreAcivityOnRefreshWhen(domElement, expType) {
        var exprId = domElement.getAttribute(DATA_EXPR_ID);
        var expressionObj = _getExpressionMeta().expressions[exprId];
        //Add activity details
        if (expressionObj[expType].hasOwnProperty("activity")) {
            var activityString = expressionObj[expType]["activity"] + ",";
            if (expressionObj[expType].hasOwnProperty("actParams")) {
                activityString = activityString + _getParams(expressionObj[expType]["actParams"]);
            }
            return activityString;
        }
    }

    function _getDatatransformOnRefreshWhen(domElement, expType) {
        var exprId = domElement.getAttribute(DATA_EXPR_ID);
        var expressionObj = _getExpressionMeta().expressions[exprId];
        //Add data transform details
        if (expressionObj[expType].hasOwnProperty("dt")) {
            var dtString = expressionObj[expType]["dt"] + ",";
            if (expressionObj[expType].hasOwnProperty("dtParams")) {
                dtString = dtString + _getParams(expressionObj[expType]["dtParams"]);
            }
            return dtString;
        }
    }

    function _getParams(paramArray) {
        var paramString = "";
        if (paramArray.length > 0) {
            for (var index = 0; index < paramArray.length; index++) {
                paramString = paramString + paramArray[index];
                if (index != paramArray.length - 1)
                    paramString = paramString + "&";
            }
        }
        return paramString;
    }

    /**
     * Evaluates and triggers all refresh whens
     *
     * @param      {<type>}  expressionDomElementObjects  The expression dom element objects
     */
    function _evaluateAndTriggerAllRefreshWhens(expressionDomElementObjects) {
        if (!expressionDomElementObjects) {
            return;
        }
        var domElementsLen = expressionDomElementObjects.length;
        var refreshHandlersData = {};
        for (var i = 0; i < domElementsLen; i++) {
            var currentDomElemObj = expressionDomElementObjects[i];
            var currentDomElem = currentDomElemObj["dom"];
            var refreshType = currentDomElemObj["type"];

            var evaluationResult = _evaluteExpressionOnDomElement(currentDomElem, refreshType);

            if (!evaluationResult || _isInvalidRefresh(currentDomElem, refreshType)) {
                continue;
            }

            var partialRefreshElement;
            var sectionElement;
            if (refreshType == SECTION_REFRESH_WHEN) {
                partialRefreshElement = null;
                sectionElement = _getSectionElement(currentDomElem, false);

                // Skipping evalution of section refresh in case section (on which refresh is configured) is not present in DOM
                // This is valid case where section has server visible when and refresh when configured
                // Other case is refresh when on cyclic referred section
                if (!sectionElement) {
                    continue;
                }
            } else {
                partialRefreshElement = currentDomElem;
                /* BUG-333844: Add full_base_ref attribute to the section element in case of partial refresh elements. */
                pega.u.d.calcAndAttachSectionBaseRef(currentDomElem, true);
                sectionElement = _getSectionElement(currentDomElem, true);
            }

            refreshHandlersData[refreshType] = refreshHandlersData[refreshType] || {};
            refreshHandlersData[refreshType]["partialRefreshElements"] = refreshHandlersData[refreshType]["partialRefreshElements"] || [];
            refreshHandlersData[refreshType]["sectionElements"] = refreshHandlersData[refreshType]["sectionElements"] || [];

            refreshHandlersData[refreshType]["partialRefreshElements"].push(partialRefreshElement);
            refreshHandlersData[refreshType]["sectionElements"].push(sectionElement);

            var sectionBaseRef = _getStampedBaseRef(sectionElement) || _getStampedExpressionContext(currentDomElem);

            var activityString = _getPreAcivityOnRefreshWhen(currentDomElem, refreshType);
            if (activityString) {
                activityString = activityString + "<||>" + sectionBaseRef;
                refreshHandlersData[refreshType]["preActivities"] = refreshHandlersData[refreshType]["preActivities"] || [];
                refreshHandlersData[refreshType]["preActivities"].push(activityString);
            }
            var dtString = _getDatatransformOnRefreshWhen(currentDomElem, refreshType);
            if (dtString) {
                dtString = dtString + "<||>" + sectionBaseRef;
                refreshHandlersData[refreshType]["dataTransforms"] = refreshHandlersData[refreshType]["dataTransforms"] || [];
                refreshHandlersData[refreshType]["dataTransforms"].push(dtString);
            }
        }
        /*
        for (var refreshType in refreshHandlersData) {
            if(!_isRefreshType(refreshType) {
                continue;
            }
            handlers[refreshType](refreshHandlersData[refreshType]["sectionElements"], refreshHandlersData[refreshType]["partialRefreshElements"]);
        }
        */
        //Or Fire individual refresh whens
        if (refreshHandlersData[SECTION_REFRESH_WHEN]) {
            handlers[SECTION_REFRESH_WHEN](refreshHandlersData[SECTION_REFRESH_WHEN]["sectionElements"], null, refreshHandlersData[SECTION_REFRESH_WHEN]["preActivities"], refreshHandlersData[SECTION_REFRESH_WHEN]["dataTransforms"]);
        }
        if (refreshHandlersData[CELL_REFRESH_WHEN]) {
            handlers[CELL_REFRESH_WHEN](refreshHandlersData[CELL_REFRESH_WHEN]["sectionElements"], refreshHandlersData[CELL_REFRESH_WHEN]["partialRefreshElements"], refreshHandlersData[CELL_REFRESH_WHEN]["preActivities"], refreshHandlersData[CELL_REFRESH_WHEN]["dataTransforms"]);
        }
        if (refreshHandlersData[REFRESH_WHEN]) {
            handlers[REFRESH_WHEN](refreshHandlersData[REFRESH_WHEN]["sectionElements"], refreshHandlersData[REFRESH_WHEN]["partialRefreshElements"], refreshHandlersData[REFRESH_WHEN]["preActivities"], refreshHandlersData[REFRESH_WHEN]["dataTransforms"]);
        }
    }

    /**
     * Evaluate and return result of expression on given dom element
     *
     * @param      {<type>}  domElement      The dom element
     * @param      {<type>}  expressionType  The expression type
     * @return     {<type>}  { description_of_the_return_value }
     */
    function _evaluteExpressionOnDomElement(domElement, expressionType) {
        var exprId = domElement.getAttribute(DATA_EXPR_ID);
        var context = _getStampedExpressionContext(domElement);
        var expression = _getExpressionMeta().expressions[exprId]
        return _evaluateExpression(expression[expressionType].expr, expression[expressionType].props, context, expression[expressionType].isparamdp);
    }

    function _getStampedExpressionContext(domElement) {
        return domElement.getAttribute(DATA_CONTEXT) || _getStampedBaseRef(domElement);
    }

    /**
     * Gets already stamped base reference on the element.
     *
     * @param      {<type>}  domElement  The dom element
     * @return     {<type>}  The stamped base reference.
     */
    function _getStampedBaseRef(domElement) {
        return domElement.getAttribute(FULL_BASE_REF) || domElement.getAttribute(BASE_REF);
    }

    /**
     * Evaluates and triggers all non refresh whens
     *
     * @param      {<type>}  expressionDomElements  The expression dom elements
     * @param      {<type>}  expressionType         The expression type
     */
    function _evaluateAndTriggerNonRefreshWhens(expressionDomElements, expressionType) {

        if (expressionType == SHOW_WHEN) {
            var visibleWhenHandlerData = {};
            visibleWhenHandlerData[pega.ui.EventsEmitter.eventIds] = {};
            var visibleWhenHandlerEventIds = visibleWhenHandlerData[pega.ui.EventsEmitter.eventIds];
        }
        var domElementsLen = expressionDomElements.length;
        var evaluationResults = [];
        for (var i = 0; i < domElementsLen; i++) {
            var expressionDomElement = expressionDomElements[i];
            var evaluationResult = _evaluteExpressionOnDomElement(expressionDomElement, expressionType);
            evaluationResults.push(evaluationResult);

            if (expressionType == SHOW_WHEN) {
                //Building data to be sent with publish event on visible whens are handled
                var curExprId = expressionDomElement.getAttribute(DATA_EXPR_ID);
                visibleWhenHandlerEventIds[curExprId] = visibleWhenHandlerEventIds[curExprId] || {};

                var curContext = _getStampedExpressionContext(expressionDomElement);
                visibleWhenHandlerEventIds[curExprId][curContext] = visibleWhenHandlerEventIds[curExprId][curContext] || {};

                visibleWhenHandlerEventIds[curExprId][curContext] = evaluationResult;
            }
        }
        handlers[expressionType](expressionDomElements, evaluationResults);

        if (expressionType == SHOW_WHEN) {
            //publish AfterVisibleWhenExpressionsEvaluated event which triggers grid related code after visible whens are handled on property change
            pega.ui.EventsEmitter.publishSync(AFTER_VISIBLE_WHENS_HANDLED, visibleWhenHandlerData);
        }
    }

    /**
     * Gets the corrected property references.
     * if the toplevel reference is type of param DP, then resolve and return topLevel ref
     *
     * @param      {(Function|string)}  curProperty              The current property
     * @param      {string}             context                  The context
     * @param      {boolean}            isDPSourceParameterized  Indicates if dp source parameterized
     * @param      {<type>}             updateContext            The update context
     * @return     {Object}             The corrected property references.
     */
    function _getCorrectedPropertyRefs(curProperty, context, isDPSourceParameterized, updateContext) {
        var topLevelRef, trailingRef;
        var dotInd = curProperty.indexOf('.');
        if (dotInd == -1) {
            topLevelRef = curProperty;
            trailingRef = "";
        } else if (dotInd == 0) {
            // Property start with DOT
            topLevelRef = context;
            trailingRef = curProperty;
        } else if (dotInd > 0) {
            topLevelRef = curProperty.substring(0, dotInd);
            trailingRef = curProperty.substring(dotInd);

            //Checking for Top and Parent reference in property
            if (topLevelRef.toLowerCase() == "top") {
                //Property refers top level page
                topLevelRef = _getTopPage(context);
            } else if (topLevelRef.toLowerCase() == "parent") {
                //Property refers Parent page
                topLevelRef = _getParentPage(context);
            } else if (topLevelRef.toLowerCase() == "primary") {
                topLevelRef = context;
            }
        }

        var topLevelRefDotInd = topLevelRef.indexOf('.');
        if (topLevelRefDotInd != -1) {
            // Get first topLevelRef before DOT
            trailingRef = topLevelRef.substring(topLevelRefDotInd) + trailingRef;
            topLevelRef = topLevelRef.substring(0, topLevelRefDotInd);
        }

        if (isDPSourceParameterized) {
            // If toplevel ref is param dp
            if (updateContext) {
                pega.ui.TemplateEngine.getCurrentContext().push(context);
            }
            var paramDpSource = pega.ui.TemplateEngine.getCurrentContext().getDataSource(topLevelRef);
            //Shift one item and leave single item in data source array
            if (paramDpSource && paramDpSource instanceof Array) {
                //resolve and return toplevel ref
                topLevelRef = paramDpSource[0];
                if (paramDpSource.length > 1) {
                    paramDpSource.shift();
                }
            } else if (paramDpSource) {
                topLevelRef = paramDpSource
            }
            if (updateContext) {
                pega.ui.TemplateEngine.getCurrentContext().pop();
            }
        }
        return { "topLevelRef": topLevelRef, "trailingRef": trailingRef };
    }

    function _isValidValue(value) {
        return (value != null && value != undefined);
    }

    /**
     * Gets the property value to evaluate. It has below logic to gets the value
     * If present in DOM and not part of refreshing stream, return dom value
     * else return value from change tracker or client cache
     * else if the value is empty and property is type of boolean, return defaut value
     *
     * @param      {<type>}             topLevelRef  The top level reference
     * @param      {<type>}             trailingRef  The trailing reference
     * @return     {(Function|string)}  The property value to evaluate.
     */
    function _getPropertyValueToEvaluate(topLevelRef, trailingRef) {
        var propValue;
        var domValue = null;

        if (!_getCtxExpressionEvaluator().IGNORE_DOM_LOOKUP) {
            var domElement = _getDomElement(topLevelRef + trailingRef);

            if (domElement && (!_getCtxExpressionEvaluator().ON_RENDERING || !_isElementPresentInRefreshingStreams(domElement))) {
                domValue = _getCorrectPropertyValueFromDOM(topLevelRef + trailingRef);
            }
        }

        if (_isValidValue(domValue)) {
            propValue = domValue;
        } else {
            propValue = _getChangeTrackerOrClientCacheValue(topLevelRef + trailingRef);
        }

        if (propValue == "" && _isBooleanProperty(topLevelRef, trailingRef)) {
            propValue = _getDefaultValue(topLevelRef, trailingRef);
        }
        return propValue;
    }

    /**
     * Determines whether given expression is type of 'changes' or 'adddelete' expression
     *
     * @param      {string}  evalExpression    The eval expression
     * @param      {string}  propertyName      The property name
     * @param      {<type>}  fullPropertyName  The full property name
     * @return     {Object}  { description_of_the_return_value }
     */
    function _propertyIsInSpecialExpression(evalExpression, propertyName, fullPropertyName) {
        var isPartOfSpecialExpression = false;

        for (var i = specialOperands.length - 1; i >= 0; i--) {
            var specialOperandProp = "this['" + propertyName + "']";
            specialOperandProp = specialOperandProp.replace(/[\[\].\(\)]/g, "\\$&");
            var replaceRegEx = new RegExp(specialOperandProp + "[' ']+" + specialOperands[i], "gi");
            evalExpression = evalExpression.replace(replaceRegEx, function(match) {
                isPartOfSpecialExpression = true;
                //Check if property is present in updatedList (changed or addremove) in changeTracker
                if (_isPropertyExistsInUpdatedList(fullPropertyName, specialOperands[i])) {
                    return true;
                }
                return false;
            });
        }

        return { "isPartOfSpecialExpression": isPartOfSpecialExpression, "evalExpression": evalExpression };
    }

    /**
     * Main function to evaluate given expression using given properties
     *
     * @param      {(Function|string)}  evalExpression           The eval expression
     * @param      {string}             propertiesList           The properties list
     * @param      {<type>}             context                  The context
     * @param      {boolean}            isDPSourceParameterized  Indicates if dp source parameterized
     * @return     {<type>}             { description_of_the_return_value }
     */
    function _evaluateExpression(evalExpression, propertiesList, context, isDPSourceParameterized) {

        if (!propertiesList || propertiesList.length == 0) {
            // evaluate just expression without properties
            return _getEvalResult(evalExpression, {});
        }
        //Object to hold properties and their values
        var propertyValues;

        for (var index = 0; index < propertiesList.length; index++) {

            var curProperty = propertiesList[index];
            var propertyRefs = _getCorrectedPropertyRefs(curProperty, context, isDPSourceParameterized, !_getCtxExpressionEvaluator().ON_RENDERING);

            var topLevelRef = propertyRefs.topLevelRef,
                trailingRef = propertyRefs.trailingRef;
            var fullPath = topLevelRef + trailingRef;

            var propValue;
            if (_getCtxExpressionEvaluator().ON_RENDERING) {
                // Initial rendering case : get value from client cache or default value
                propValue = _getPropertyValueToEvaluate(topLevelRef, trailingRef);
            } else {

                //Special Handling for 'Changes' and 'AddDelete'
                var specialExpression = _propertyIsInSpecialExpression(evalExpression, curProperty, fullPath);
                if (specialExpression["isPartOfSpecialExpression"]) {
                    evalExpression = specialExpression["evalExpression"];
                    if (!propertyValues) {
                        propertyValues = {};
                    }
                    continue;
                }
                // Check for propertyDomValue. This occurs in case of property change call
                if (_isDomPropertyChanged() && fullPath == _getCtxExpressionEvaluator().changedDomPropertyName) {
                    propValue = _getCtxExpressionEvaluator().changedDomPropertyValue;
                } else {
                    propValue = _getPropertyValueToEvaluate(topLevelRef, trailingRef);
                }

            }

            if (_isValidValue(propValue)) {
                // Add to propertyValues
                if (!propertyValues) {
                    propertyValues = {};
                }

                /*BUG-281467  and BUG-282246 fix*/
                if (typeof(propValue) == "boolean") {
                    propValue = propValue.toString();
                } else if (propValue != "" && !isNaN(propValue)) {
                    propValue = parseFloat(propValue);
                }

                //Checking for boolean type property
                var booleanProperty = "!this['" + curProperty + "']";
                if (evalExpression.indexOf(booleanProperty) != -1) {
                    propValue = (String(propValue) == "true");
                }

                //Check for special case BUG-304723
                //Like .isBooleanProp == '' or .isBooleanProp != ''
                if (_isBooleanProperty(topLevelRef, trailingRef)) {
                    var specialBoolEmptyProp = "this['" + curProperty + "']";
                    specialBoolEmptyProp = specialBoolEmptyProp.replace(/[\[\].\(\)]/g, "\\$&");
                    /*BUG-416162 : handling expression with boolean type property */
                    var replaceRegEx = new RegExp(specialBoolEmptyProp + "[' ']*[=!]=[' ']*''", "gi");
                    if (evalExpression.match(replaceRegEx)) {
                        propValue = (String(propValue) == "true");
                        var replaceQuotesForBool = new RegExp("(" + specialBoolEmptyProp + "\\s*==\\s*)+(')+(true|false)+(')+","gi");
                        evalExpression = evalExpression.replace(replaceQuotesForBool,"$1$3");
                    }
                }
                propertyValues[curProperty] = propValue;
            }
        }

        return _getEvalResult(evalExpression, propertyValues);
    }

    function _isBooleanProperty(topLevelRef, trailingRef) {
        return _getExpressionMeta() && _getExpressionMeta().properties && _getExpressionMeta().properties[topLevelRef] && _getExpressionMeta().properties[topLevelRef][trailingRef] && _getExpressionMeta().properties[topLevelRef][trailingRef]["type"] == "boolean";
    }

    function _isDomPropertyChanged() {
        return _getCtxExpressionEvaluator().changedDomPropertyName && _isValidValue(_getCtxExpressionEvaluator().changedDomPropertyValue);
    }

    /**
     * Determines if property exists in updated(changed or adddelete or dom change) list.
     *
     * @param      {(Array|string)}  property  The property
     * @param      {string}          type      The type
     * @return     {boolean}         True if property exists in updated list, False otherwise.
     */
    function _isPropertyExistsInUpdatedList(property, type) {
        if (_isOffline()) {
            return true;
        }
        var updatedPropertiesList;
        if (type == "changes") {
            updatedPropertiesList = pega.ui.ChangeTrackerMap.getTracker().changedPropertiesList;
        } else if (type == "adddelete") {
            updatedPropertiesList = pega.ui.ChangeTrackerMap.getTracker().addRemovePagesList;
        }
        var finalChangedList = [];
        if (updatedPropertiesList && updatedPropertiesList.length > 0) {
            finalChangedList = finalChangedList.concat(updatedPropertiesList);
        }
        //Checking in changed property as well
        if (_isDomPropertyChanged()) {
            finalChangedList.push(_getCtxExpressionEvaluator().changedDomPropertyName);
        }
        for (var i = 0; i < finalChangedList.length; i++) {
            var updatedProp;
            if (finalChangedList[i].lastIndexOf('(') != -1) {
                updatedProp = finalChangedList[i];
                updatedProp = updatedProp.substring(0, updatedProp.lastIndexOf('(') + 1) + updatedProp.substring(updatedProp.lastIndexOf(')'));
            }
            if (property == finalChangedList[i] || (updatedProp && property == updatedProp)) {
                return true;
            }
        }

        return false;
    }

    function _getEvalResult(evalExpression, propertiesValues) {
        var evalResult = false;
        if (propertiesValues) {
            (function(str) {
                try {
                    evalResult = eval(str);
                } catch (e) {
                    console.error("Invalid Expression ", str, this);
                }

            }).call(propertiesValues, evalExpression);
        }
        if (evalResult == "false") {
            evalResult = false;
        }
        return !!evalResult;
    }

    function _getChangeTrackerOrClientCacheValue(path) {
        var propertyValue = _getValueFromChangeTracker(path);
        if (!_isValidValue(propertyValue)) {
            propertyValue = _getValueFromClientCache(path);
        }
        return propertyValue;
    }

    function _getValueFromChangeTracker(path) {
        if (_isOffline()) {
            return null;
        }
        var currentCT = pega.ui.ChangeTrackerMap.getTracker();
        return currentCT ? currentCT.getPropertyValue(path) : null;
    }

    function _getValueFromClientCache(path) {

        var ccObj = pega.ui.ClientCache.find(path, { "doNotTrack": true });
        if (ccObj == null) {
            /*Incase the reference is a datapage and the value is not found in clientcache, iterate over
            the CT trackedpropertieslist and check if a parameterized version is present.
            If it is present continue using the parameterized DP*/
            var dotIndex = path.indexOf('.');
            if ((path.indexOf("D_") == 0 || path.indexOf("Declare_") == 0) && dotIndex != -1) {
                var topLevelPage = path.substring(0, dotIndex);
                var ctList = pega.ui.ChangeTrackerMap.getTracker().trackedPropertiesList;
                for (var k in ctList) {
                    if (k.indexOf(topLevelPage + "_") == 0) {
                        path = path.replace(topLevelPage, k);
                        ccObj = pega.ui.ClientCache.find(path, { "doNotTrack": true });
                        break;
                    }
                }
            }
        }
        var value = ccObj ? ccObj.getValue && ccObj.getValue() : null;
        if (value == null && _isOffline()) {
            value = "";
        }
        return value;

    }


    function _getDefaultValue(topLevelPage, subLevelProp) {
        return _getExpressionMeta().properties[topLevelPage] && _getExpressionMeta().properties[topLevelPage][subLevelProp] && _getExpressionMeta().properties[topLevelPage][subLevelProp]["default"];
    }

    /**
     * Handler for visibile whens
     *
     * @param      {array}  clientTargets  The client targets
     * @param      {array}  evalResults    The eval results
     */
    function _handleVisibleWhens(clientTargets, evalResults) {
        if (clientTargets.length > 0) {
            var index = 0;
            for (var index = 0; index < clientTargets.length; index++) {
                _handleVisibleWhen(clientTargets[index], evalResults[index]);
            }
        } else {
            _handleVisibleWhen(clientTargets, evalResults[0]);
        }
    }

    function _handleVisibleWhen(clientTarget, evalResult) {
        var reserveSpace = clientTarget.getAttribute('RESERVE_SPACE');

        if (reserveSpace && reserveSpace == 'true') {
            if (evalResult) {
                clientTarget.style.visibility = "visible";
                clientTarget.setAttribute("aria-hidden", "false");
            } else {
                clientTarget.style.visibility = "hidden";
                clientTarget.setAttribute("aria-hidden", "true");
            }
        } else {
            if (evalResult) {
                $(clientTarget).css('display', '');
            } else {
                $(clientTarget).css('display', 'none');
            }
            var groupContainerDiv = clientTarget.parentNode;
            if (groupContainerDiv && groupContainerDiv.getAttribute('data-hidecolumns')) {
                _handleColumnLayoutVisibleWhen(clientTarget, evalResult);
            }
            if (groupContainerDiv && groupContainerDiv.className.indexOf("content-layout-group") != -1) {
                _handleLayoutgroupVisibleWhen(clientTarget, evalResult);
            }
        }
    }

    function _handleColumnLayoutVisibleWhen(clientTarget, evalResult) {
        var columnLayoutDiv = clientTarget.parentNode;
        if (evalResult) {
            $(columnLayoutDiv).removeClass("col-layout-hidden-s1").removeClass("col-layout-hidden-s2").removeClass("col-layout-hidden-both");
        } else {
            //we are handling a three col layout
            if (columnLayoutDiv.className.indexOf("three-col-sidebar-main-sidebar") != -1) {
                if (clientTarget.className.indexOf("column-2") != -1 && (columnLayoutDiv.getAttribute('data-hidecolumns') == "left" || columnLayoutDiv.getAttribute('data-hidecolumns') == "both")) {
                    $(columnLayoutDiv).addClass("col-layout-hidden-s1");
                } else if (clientTarget.className.indexOf("column-3") != -1 && (columnLayoutDiv.getAttribute('data-hidecolumns') == "right" || columnLayoutDiv.getAttribute('data-hidecolumns') == "both")) {
                    $(columnLayoutDiv).addClass("col-layout-hidden-s2");
                }
            } else {
                //2 col layout -- just hide both
                $(columnLayoutDiv).addClass("col-layout-hidden-both");
            }
        }
    }
  
  function _getAvailableChildLayoutInLG(currDiv){
    var firstChildLayout = null;
    var layoutGroupNode = currDiv.parentNode;
    var layoutchild = $(layoutGroupNode).children().first()[0];
    while ($(layoutchild).next()) {
      layoutchild = $(layoutchild).next()[0];
      if(!layoutchild){
        break;
      }
      // look for the first visible layout : BUG-269737
      if (layoutchild && layoutchild.style.display != "none" && 
          layoutchild.className.indexOf("layout") == 0 &&  layoutchild.className.indexOf("layout-group-nav") != 0) {
        firstChildLayout = layoutchild.className.indexOf("layout-header") != 0 ? layoutchild : $(layoutchild).children().first()[0];
        break;
      }
    }
    return firstChildLayout;
  }

    function _getVisibleChildLayoutInLG(currDiv) {
        var visibleChildLayout = null;
        if (currDiv.parentNode && currDiv.parentNode.className.indexOf("content-layout-group") != -1 &&
              currDiv.className.indexOf("layout") == 0) {
          if(currDiv.className.indexOf(" active") != -1){
            LayoutGroupModule.setLayoutInactive(currDiv);
          }
              
          var layoutGroupNode = currDiv.parentNode;
          var layoutchild = $(layoutGroupNode).children(".layout").first()[0];
          /* Return current layout if body is visible */
          if ($(layoutchild).children(".layout-body").filter(":visible").length > 0) {
            return $(layoutchild);
          }
          while ($(layoutchild).next()) {
            layoutchild = $(layoutchild).next()[0];
            if(!layoutchild){
              break;
            }
            // look for the first visible layout : BUG-269737
            if (layoutchild && layoutchild.style.display != "none" && layoutchild.className.indexOf(" active") != -1 && 
                                    layoutchild.className.indexOf("layout") == 0 &&  layoutchild.className.indexOf("layout-group-nav") != 0) {
                  visibleChildLayout = layoutchild;
                  break;
                }
              }
            }
        
        return visibleChildLayout;
    }

    function _handleLayoutgroupVisibleWhen(currDiv, evalResult) {
        var layoutGroupDiv = currDiv.parentElement;
        var isSemanticLayout = layoutGroupDiv.getAttribute("data-semantic-tab") === "true" ? true:false;
        if (currDiv.className.indexOf("layout") != 0) {
            return;
        }
        if (evalResult) {
            //if all layout are hidden - we need to activate this layout
            var visibleChildLayout = _getVisibleChildLayoutInLG(currDiv);
            if (!visibleChildLayout) {
                LayoutGroupModule.setLayoutActive(currDiv);
            }else{
                /* BUG-421614 */
                LayoutGroupModule.updateStretchTabWidths();
            }

        } else {
            // if this is the active layout we need to switch to another layout
            if (currDiv.classList.contains("active")) {
                LayoutGroupModule.setLayoutInactive(currDiv);
                if(isSemanticLayout){
                  LayoutGroupModule.setLayoutInactive($(layoutGroupDiv).children(".layout-header").children(".layout.active")[0]);
                }
                var visibleChildLayout = _getVisibleChildLayoutInLG(currDiv);
                if (visibleChildLayout) {
                    LayoutGroupModule.setLayoutActive(visibleChildLayout);
                }else{
                  var firstChildLayout = _getAvailableChildLayoutInLG(currDiv);
                  if(firstChildLayout){
                    LayoutGroupModule.setLayoutActive(firstChildLayout);
                  }
                }
            } else{
                /* BUG-421614 */
                LayoutGroupModule.updateStretchTabWidths();
            }
        }
        _handleNumberedAccordion(currDiv);
    }
    function _handleNumberedAccordion(currDiv){
      /* change number of accordion :- there are 2 cases one when it add's a div and another it removes the div :- whenever one of the above happens need to alter the index of next tabs */
       if (currDiv.parentNode && currDiv.parentNode.className.indexOf("lg-accordion-numbered") != -1 && currDiv.className.indexOf("layout") == 0) {
         /* get the previous tab which is visible start */
         var firstVisiblePrevTab = currDiv.previousElementSibling;
         var prevTabIndex = 0;
         while(firstVisiblePrevTab && firstVisiblePrevTab.hasAttribute("data-lg-child-id")){
           if(firstVisiblePrevTab.style && firstVisiblePrevTab.style.display != "none"){
             prevTabIndex = firstVisiblePrevTab.querySelector(".number-accordion-circle").getAttribute("num-index");
             break;
           }
           firstVisiblePrevTab = firstVisiblePrevTab.previousElementSibling;
         }
         /* End */
         
         /* get the next sibling and alter thier tab index based on previous start */
           var nextVisibleSiblingTab = firstVisiblePrevTab.nextElementSibling;
           var locNumArry,numberIndexTextInLng;
            while(nextVisibleSiblingTab && nextVisibleSiblingTab.hasAttribute("data-lg-child-id")){
              if(nextVisibleSiblingTab.style && nextVisibleSiblingTab.style.display != "none"){
                prevTabIndex++;
                nextVisibleSiblingTab.querySelector(".number-accordion-circle").setAttribute("num-index", prevTabIndex);
                /* localization */
                if(pega && pega.DateTimeUtil && pega.DateTimeUtil.Locale && pega.DateTimeUtil.Locale.LOCAL_DATE_ARRAY)
                  locNumArry = pega.DateTimeUtil.Locale.LOCAL_DATE_ARRAY.replace(/"/g, "").replace(/\[/g, "").replace(/\]/g, "").split(",");
                numberIndexTextInLng = locNumArry[prevTabIndex];
                nextVisibleSiblingTab.querySelector(".number-accordion-circle").innerText = numberIndexTextInLng ? numberIndexTextInLng : prevTabIndex;
              }
              nextVisibleSiblingTab = nextVisibleSiblingTab.nextElementSibling;
            }
         /* End */
       }
    }
  
    function _handleRequiredWhens(clientTargets, evalResults) {
        if (clientTargets.length > 0) {
            for (var index = 0; index < clientTargets.length; index++) {
                var targetElement = clientTargets[index];
                if (targetElement.getAttribute("data-ctl") == "RadioGroup") {
                    var elems = targetElement.querySelectorAll("input[type='radio']");
                    for (var j = 0; j < elems.length; j++) {
                        _toggleRequired(elems[j], evalResults[index]);
                    }
                    continue;
                }
                _toggleRequired(targetElement, evalResults[index]);
            }
        }
    }

    function _toggleRequired(targetElement, bRequired) {
        if (bRequired) {
            var temp = targetElement.getAttribute("validationtype");
            if (temp != null && temp.indexOf("required") == -1) {
                if (!temp || temp.length == 0) {
                    targetElement.setAttribute("validationtype", "required");
                } else {
                    targetElement.setAttribute("validationtype", "required," + temp);
                }
                $(targetElement).parents('div .field-item').siblings('label').children().each(function() {
                    if (this.tagName == 'SPAN' && this.getAttribute("data-class")) {
                        this.setAttribute('class', this.getAttribute("data-class"));
                        this.removeAttribute('data-class');
                    } else if (this.tagName == 'STRONG') {
                        $(this).removeClass('display-none');
                    }
                });
              if($(targetElement).parents('div .field-item').siblings('label').attr('data-required')){
                $(targetElement).parents('div .content-item').addClass('required');
                $(targetElement).attr("aria-required",true);
              }
            }

        } else {
            var temp = targetElement.getAttribute("validationtype");
            if (temp != null && temp.indexOf("required") != -1) {
                if (temp && temp != "") {
                    temp = temp.replace("required,", "");
                    temp = temp.replace(",required", "");
                    temp = temp.replace("required", "");
                    targetElement.setAttribute("validationtype", temp.replace("required,", ""));
                }
                if ($(targetElement).val() == '') {
                    getErrorDB().clearError(targetElement.name);
                    $(targetElement).siblings('div .iconErrorDiv').attr('style', 'display: none;');
                    $(targetElement).parents('div .field-item').siblings('label').removeClass('labelError');
                }
                $(targetElement).parents('div .field-item').siblings('label').children().each(function() {
                    if (this.tagName == 'SPAN' && this.getAttribute("class")) {
                        this.setAttribute('data-class', this.getAttribute("class"));
                        this.removeAttribute('class');
                    } else if (this.tagName == 'STRONG') {
                        $(this).addClass('display-none');
                    }
                });
               if($(targetElement).parents('div .field-item').siblings('label').attr('data-required')){
                $(targetElement).parents('div .content-item').removeClass('required');
                 $(targetElement).removeAttr("aria-required");
              }
            }
        }
    }
    function _handleDisableEnableLG(nodeElem, isDisable){
      if(isDisable){
        /* Disable */
        if(nodeElem.className.indexOf("lg-disabled") == -1){
          nodeElem.className += " lg-disabled";
          if(nodeElem.className.indexOf('active') != -1){
            
            var isNotAnyActive = false;        
            var activeElement;
            var prevActiveLayout = nodeElem;
            while (prevActiveLayout = prevActiveLayout.previousElementSibling){
              if(prevActiveLayout && prevActiveLayout.className.indexOf('layout ') != -1 && prevActiveLayout.className.indexOf('active') != -1 && prevActiveLayout.style.display != "none"){
                isNotAnyActive = true;
              }
              if(!activeElement && prevActiveLayout && prevActiveLayout.className.indexOf('layout ') != -1 && prevActiveLayout.style.display != "none" && prevActiveLayout.className.indexOf('lg-disabled') === -1){
                activeElement = prevActiveLayout;
              }
            }
            
            if(!isNotAnyActive){
              var nextActiveLayout = nodeElem;
              while (nextActiveLayout = nextActiveLayout.nextElementSibling){
                if(nextActiveLayout && nextActiveLayout.className.indexOf('layout ') != -1 && nextActiveLayout.className.indexOf('active') != -1 && nextActiveLayout.style.display != "none"){
                  isNotAnyActive = true;
                }
                if(!activeElement && nextActiveLayout && nextActiveLayout.className.indexOf('layout ') != -1 && nextActiveLayout.style.display != "none" && nextActiveLayout.className.indexOf('lg-disabled') === -1){
                  activeElement = nextActiveLayout;
                }
              }
            }
            if(!isNotAnyActive && activeElement){
              LayoutGroupModule.setLayoutInactive(nodeElem);
              LayoutGroupModule.setLayoutActive(activeElement);
            } else if(isNotAnyActive){
              LayoutGroupModule.setLayoutInactive(nodeElem);
            }
            if(nodeElem.className.indexOf('multiactive') != -1){
              nodeElem.classList.remove("multiactive");
            }
            
           /* while (prevActiveLayout = prevActiveLayout.previousElementSibling){
              if(prevActiveLayout && prevActiveLayout.className.indexOf('layout ') != -1 && prevActiveLayout.style.display != "none" && prevActiveLayout.className.indexOf('lg-disabled') === -1){
                LayoutGroupModule.setLayoutInactive(nodeElem);
                LayoutGroupModule.setLayoutActive(prevActiveLayout);
                return;
              }
            }
            
            var nextActiveLayout = nodeElem;
            while (nextActiveLayout = nextActiveLayout.nextElementSibling){
              if(nextActiveLayout && nextActiveLayout.className.indexOf('layout ') != -1 && nextActiveLayout.style.display != "none" && nextActiveLayout.className.indexOf('lg-disabled') === -1){
                LayoutGroupModule.setLayoutInactive(nodeElem);
                LayoutGroupModule.setLayoutActive(nextActiveLayout);
                return;
              }
            }
            */
          }
        }
      } else{
        /* enable*/
        nodeElem.classList.remove("lg-disabled");
      }
    }
    function _handleDisableWhens(clientTargets, evalResult) {
        if (clientTargets.length > 0) {
            for (var index = 0; index < clientTargets.length; index++) {
                /* Disable when */
                var target = clientTargets[index];
                var isLGDisableWhen = false;
                if(target && target.parentNode.parentNode.className.indexOf("content-layout-group")!= -1){
                   isLGDisableWhen =  true;
                }
                if (evalResult[index]) {
                    if(isLGDisableWhen){
                      _handleDisableEnableLG(target.parentNode,true);
                    }else{
                      pega.u.d.controlDisabler(clientTargets[index].parentNode);
                    }
                } else {
                    if(isLGDisableWhen){
                      _handleDisableEnableLG(target.parentNode,false);
                    }else{
                      pega.u.d.controlEnabler(clientTargets[index].parentNode);
                    }
                }
            }
        }
    }


    function _handleReadOnlyWhens(clientTargets) {
        $(clientTargets).each(function(target) {
            //reloadSection activity call
        });
    }

    function _registerHandler(handlerName, handlerfunction) {
        handlers[handlerName] = handlerfunction;
    }

    function _handleRefreshWhens(sectionElements, partialRefreshElements, preActivities, dataTransforms) {
        if (!sectionElements || sectionElements.length == 0) {
            return;
        }
        var surl = new SafeURL();

        if (_isDomPropertyChanged()) {
            surl.put(pega.u.property.toHandle(_getCtxExpressionEvaluator().changedDomPropertyName), _getCtxExpressionEvaluator().changedDomPropertyValue);
        }

        var secDeclarePageParams = null;
        for (var l = 0; l < sectionElements.length; l++) {
            var declarePageParams = sectionElements[l].getAttribute("data-declare-params");
            if (declarePageParams && declarePageParams != "") {
                if (secDeclarePageParams == null) {
                    secDeclarePageParams = {};
                }
                try {
                    declarePageParams = pega.c.eventParser.replaceTokensWrapper(declarePageParams, "", "", false, false);
                    var paramsList = eval("(" + declarePageParams + ")");
                    if (paramsList) {
                        var uniqueId = sectionElements[l].getAttribute('uniqueid');
                        secDeclarePageParams[uniqueId] = {};
                        var key = "";
                        for (key in paramsList) {
                            secDeclarePageParams[uniqueId][key] = paramsList[key];
                        }
                    }
                } catch (e) {
                    console.log("Error in extracting declarePageParams");
                }
            }
        }
        var clonedEvent = pega.u.d.ClientEventAPI ? (pega.u.d.ClientEventAPI.ev ? pega.u.d.ClientEventAPI.ev : null) : null;
        pega.u.d.reloadSections(surl, sectionElements, '', '', null, clonedEvent, preActivities, dataTransforms, secDeclarePageParams, partialRefreshElements);
    }

    //TODO: Refactor since it uses querySelectorAll
    function _handleSectionRefreshWhens(sectionElements, partialRefreshElements, preActivities, dataTransforms) {
        _handleRefreshWhens(sectionElements, null, preActivities, dataTransforms)
    }

    function _handleCellRefreshWhens(sectionElements, partialRefreshElements, preActivities, dataTransforms) {

        var sections2refresh = [];
        var cells2refresh = [];
        if (Array.isArray(partialRefreshElements)) {
            for (var i = 0; i < partialRefreshElements.length; i++) {
                var curClientTarget = partialRefreshElements[i];

                if (curClientTarget.getAttribute(DATA_EXPR_ID) && (curClientTarget.tagName == 'SELECT' || curClientTarget.tagName == 'INPUT' || curClientTarget.getAttribute('role') == 'radiogroup') && _isOffline()) {
                    cells2refresh.push(curClientTarget.parentElement);
                } else {
                    cells2refresh.push(curClientTarget);
                }
            }
        }

        if (sectionElements.length > 0 && cells2refresh.length > 0) {
            var refreshTargets = {
                "sections": sectionElements,
                "cells2refresh": cells2refresh
            }
            _reloadCells(refreshTargets);
        }
    }

    function _reloadCells(refreshTargets) {
        if (pega.u.d.ServerProxy && pega.u.d.ServerProxy.isDestinationLocal()) {
            pega.u.d.reloadCellsOSCO(refreshTargets);
            return;
        }

        var cells = refreshTargets.cells2refresh;
        var sections = refreshTargets.sections;
        var strUrlSF = SafeURL_createFromURL(pega.u.d.url);
        strUrlSF.put("pyActivity", "pzReloadCells");
        if (bClientValidation) {
            strUrlSF.put("PVClientVal", true);
        }
        if (!cells || !sections) return;
        var data = {
            "cells": [],
            "values": []
        };
        var originalValues = {};
        var propCTDivMap = {}
        for (var i = 0, l = cells.length; i < l; i++) {
            var elem = (cells[i].tagName == "SELECT" || cells[i].tagName == "INPUT") ? cells[i] : pega.u.d.getElementFromCell(cells[i]);
            /* This function need to be implemented for radiobutton as well*/
            var propEntryHandle = elem.name;
            var propValue = pega.u.d.getProperty(propEntryHandle);
            var baseRef = pega.u.d.getBaseRef(elem);
            var sectionName = sections[i].getAttribute("node_name");
            var contextPage = pega.u.d.getRowAndEntryHandle(elem).rowEntryHandle;
            if (contextPage == null) {
                contextPage = "";
            }
            propCTDivMap[propEntryHandle] = cells[i];
            var cellID = cells[i].getAttribute("cellid");
            data.cells.push({
                "pyPropertyTarget": propEntryHandle,
                "StreamName": sectionName,
                "BaseReference": baseRef,
                "ContextPage": pega.u.property.toReference(contextPage),
                "UITemplatingStatus": "Y",
                "CellId": cellID
            });
            data.values.push({
                "entryHandle": propEntryHandle,
                "value": propValue
            });

            if (_isDomPropertyChanged()) {
                data.values.push({
                    "entryHandle": pega.u.property.toHandle(_getCtxExpressionEvaluator().changedDomPropertyName),
                    "value": _getCtxExpressionEvaluator().changedDomPropertyValue
                });
            }
            originalValues[propEntryHandle] = propValue;
        }
        strUrlSF.put("reloadCells", JSON.stringify(data));
        
        var onSuccess = function(responseObj) {
            // Implement handling response here.
            // We should handle change tracker here.
            // Also remove AJAXCT div from the return markup
            var reponseText = responseObj.responseText;
            reponseText = reponseText.substring(0, reponseText.lastIndexOf("{EndReloadCell}"));
            if (!reponseText) {
              return;
            }
            var markupObj = JSON.parse(reponseText);
            for (var key in markupObj) {
                var markup = markupObj[key];
                var ctDiv = propCTDivMap[key];
                if (pega.ctx.dom.isInContext(ctDiv)) {
                    var cellNode = ctDiv.parentNode;

                    var uiRenderedCallback = function(cellNode) {
                        return function(htmlmarkup) {
                            //BUG-548200 retain focus on cascading dropdown refresh
                            if(pega.env.ua.ie){
                              var focussedElemName = document.activeElement.name;
                              pega.u.d.loadDOMObject(cellNode, htmlmarkup);
                              var elem = cellNode.querySelector('select[name="' + focussedElemName + '"]');
                              elem.focus();
                            } else {
                              pega.u.d.loadDOMObject(cellNode, htmlmarkup);
                            }
                            // BUG-216840: Validate cell content on reload
                         /*   if (typeof(bClientValidation) != "undefined" && bClientValidation && (typeof(
                                    validation_validate) == "function")) {
                                validation_validate(cellNode);
                            } */
                        }
                    };

                    pega.ui.TemplateEngine.renderUI(markup, uiRenderedCallback(cellNode));
                } else {
                    return;
                }
                if (originalValues[key] != pega.u.d.getProperty(key)) {
                    if (pega.control && pega.control.actionSequencer) {
                        var targetElem = pega.u.d.getElementFromCell(cellNode);
                        if (pega.env.ua.ie) {
                            pega.util.Event.fireEvent(targetElem, "onfocusin");
                        } else {
                            pega.util.Event.fireEvent(targetElem, "onfocus");
                        }
                        pega.control.actionSequencer.fireTopPriorityEvent(targetElem, "change");
                        pega.util.Event.fireEvent(targetElem, "onblur");
                        if (pega.env.ua.ie) {
                            pega.util.Event.fireEvent(targetElem, "onfocusout");
                        }
                    }
                }
            }
        }
        var onFailure = function(response) {
            //silently fail for now
        };
        var callBack = {
            success: onSuccess,
            failure: onFailure
        };
        pega.u.d.asyncRequest('POST', strUrlSF, callBack);
    }

    function _isReloadSectionRequest(safeUrl) {
        return (safeUrl.get("pyActivity") && safeUrl.get("pyActivity") == 'ReloadSection' && (!safeUrl.get(
            "partialRefresh") || safeUrl.get("partialRefresh") != 'true') && !safeUrl.get("RenderSingle"));
    }
  
    function _updateReloadSectionsCache(safeUrl, remove) {
        if (!safeUrl || typeof safeUrl.get != "function" || !(_isReloadSectionRequest(safeUrl) || remove)) {
            return;
        }

        var sectionName = safeUrl.get("StreamName");
        var baseRef = safeUrl.get("BaseReference");
        if (!baseRef) {
            baseRef = "";
        }
        _getCtxExpressionEvaluator().reloadSectionsCache = _getCtxExpressionEvaluator().reloadSectionsCache || {};
        _updateReloadSectionsCacheHelper(sectionName, remove, safeUrl, baseRef);
    }
  
    function _updateReloadSectionsCacheHelper(sectionName, remove, safeUrl, baseRef) {
      if (sectionName && sectionName != null) {
          if(remove){
            delete _getCtxExpressionEvaluator().reloadSectionsCache[sectionName];
          }else{
            _getCtxExpressionEvaluator().reloadSectionsCache[sectionName] = _getCtxExpressionEvaluator().reloadSectionsCache[sectionName] || {};
            _getCtxExpressionEvaluator().reloadSectionsCache[sectionName][baseRef] = true;
          }
        } else {
            if (safeUrl.get("StreamList") != null) {
                var sectionNamesList = safeUrl.get("StreamList").split(":");
                for (var i = 0; i < sectionNamesList.length; i++) {
                    if (sectionNamesList[i] != "") {
                        var sectionName = sectionNamesList[i].split("|")[0];
                      if(remove){
                        delete _getCtxExpressionEvaluator().reloadSectionsCache[sectionName];
                      }else{
                        _getCtxExpressionEvaluator().reloadSectionsCache[sectionName] = _getCtxExpressionEvaluator().reloadSectionsCache[sectionName] || {};
                        _getCtxExpressionEvaluator().reloadSectionsCache[sectionName][baseRef] = true;
                      }
                    }
                }
            }
        }
    }



    function _subscribeEvents() {
        pega.ui.EventsEmitter.subscribe("AfterChangeTrackerDataMerged", function() {
            if (_isOffline()) {
                pega.u.d.evaluateRefreshWhensOSCO(false, true);
                pega.u.d.ct_sectionsList = new Array();
            }
        });

        pega.ui.EventsEmitter.subscribe("BeforeDCUpdate", function() {
            if (_isOffline()) {
                _getCtxExpressionEvaluator().IGNORE_DOM_LOOKUP = true;
            }
        });

        pega.ui.EventsEmitter.subscribe("AfterDCUpdate", function() {
            if (_isOffline()) {
                _getCtxExpressionEvaluator().IGNORE_DOM_LOOKUP = false;
                if (_getNTExpressionStatus()) {
                    pega.u.d.evaluateAllVisibleWhens();
                }
            }
        });

        pega.ui.EventsEmitter.subscribe("BeforeHarnessStream", function() {
            if (_isOffline()) {
                _getCtxExpressionEvaluator().IGNORE_DOM_LOOKUP = true;
            }
        });

        pega.ui.EventsEmitter.subscribe("AfterHarnessStream", function() {
            if (_isOffline()) {
                _getCtxExpressionEvaluator().IGNORE_DOM_LOOKUP = false;
            }
        });

        pega.ui.EventsEmitter.subscribe(pega.u.d.BEFORE_SECTIONS_REFRESH, function(safeUrl) {
            _updateReloadSectionsCache(safeUrl, false);
        });

        pega.ui.EventsEmitter.subscribe(pega.u.d.AFTER_SECTIONS_REFRESH, function(safeUrl) {
            _updateReloadSectionsCache(safeUrl, true);
        });

        pega.ui.EventsEmitter.subscribe(pega.u.d.BEFORE_COMPONENT_REFRESH, function(componentDomElem) {
            if (componentDomElem) {
                _getCtxExpressionEvaluator().reloadComponentsCache.push(componentDomElem);
            }
        });

        pega.ui.EventsEmitter.subscribe(pega.u.d.AFTER_COMPONENT_REFRESH, function(componentDomElem) {
            if (componentDomElem && _isEmpty(!_getCtxExpressionEvaluator().reloadComponentsCache)) {
                var ind = _getCtxExpressionEvaluator().reloadComponentsCache[componentDomElem];
                if (ind != -1) {
                    _getCtxExpressionEvaluator().reloadComponentsCache.splice(ind, 1);
                }
            }
        });

        pega.ui.EventsEmitter.subscribe(pega.u.d.AFTER_EXPRESSIONS_HANDLED_ON_PROPERTY_CHANGES, function() {
            _clearTempCaches();
        });
    };

    function _handleActiveWhens(clientTargets) {
        if (!clientTargets || clientTargets.length == 0) {
            return;
        }
        var currentMenuContextId;
        for (var ind = 0; ind < clientTargets.length; ind++) {
            var clientTarget = clientTargets[ind];
            var exprId = clientTarget.getAttribute(DATA_EXPR_ID);
            var context = _getStampedExpressionContext(clientTarget);
            var expression = _getExpressionMeta().expressions[exprId][ACTIVE_WHEN];
            var evalResult;
          
            if($(clientTarget).parent().hasClass("menu") || $(clientTarget).parent().hasClass("menu-bar")){
                if(expression && expression.expr){
                    evalResult = _evaluateExpression(expression.expr, expression["props"], context);
                }
                var tempIdToFindContextForLoop = $(clientTarget).parent().attr("data-menu-id");
                if (evalResult && (!currentMenuContextId || (tempIdToFindContextForLoop && tempIdToFindContextForLoop.indexOf(currentMenuContextId) == -1))){
                    var _li = $(clientTarget).parent().children("li");
                    $(_li).removeClass("menu-item-active");
                    $(_li).removeAttr("data-active-menu");
                    $(clientTarget).addClass("menu-item-active");
                    $(clientTarget).attr("data-active-menu","");
                    currentMenuContextId = tempIdToFindContextForLoop;
                    /*pega.control && pega.control.menu && pega.control.menu.clearState();*/
                    pega.control && pega.control.menu && pega.control.menu.maintainState();
                } else {
                    /* BUG-373309 */
                    $(clientTarget).removeClass("menu-item-active");
                    $(clientTarget).removeAttr("data-active-menu");
                }           
            } else{                                               
                for (var i = 0; i < expression.expr.length; i++) {
                   var activeIndex = expression.expr[i].index;
                   var whenExpr = expression.expr[i].expr;           
                   if (whenExpr && !whenExpr.startsWith("EXP=")) {
                      evalResult = _evaluateExpression(whenExpr, expression["props"], context);                
                   }
                   /*var evalResult = _evaluateExpression(whenExpr, expression["props"], context);*/
                   if (evalResult) {                
                      var layoutElem = $(clientTarget).children('.layout').get(activeIndex - 1);
                      if (layoutElem.style.display == "none" || layoutElem.className.indexOf("lg-disabled")!= -1) {
                          continue;
                      }
                      $(clientTarget).children('.layout.active').each(function() {
                          LayoutGroupModule.setLayoutInactive(this);
                      });
                      LayoutGroupModule.setLayoutActive(layoutElem);
                      break;
                   }             
               }
            }
        }
    }
      
    function _initDefaultHandlers() {
        _registerHandler(REFRESH_WHEN, _handleRefreshWhens);
        _registerHandler(SECTION_REFRESH_WHEN, _handleSectionRefreshWhens);
        _registerHandler(CELL_REFRESH_WHEN, _handleCellRefreshWhens);
        _registerHandler(SHOW_WHEN, _handleVisibleWhens);
        _registerHandler(DISABLE_WHEN, _handleDisableWhens);
        _registerHandler(REQUIRED_WHEN, _handleRequiredWhens);
        _registerHandler("readonlyWhen", _handleReadOnlyWhens);
        _registerHandler(ACTIVE_WHEN, _handleActiveWhens);
        _subscribeEvents();
    }

    function _isRefreshExpression(expressionId) {
        return !!(expressionId && _getExpressionMeta() && _getExpressionMeta().expressions[expressionId][REFRESH_WHEN]);
    }


    function _setNTExpressionStatus(pHasNTExpression) {
        _getCtxExpressionEvaluator().hasNTExpression = pHasNTExpression;
    }

    function _getNTExpressionStatus() {
        return _getCtxExpressionEvaluator().hasNTExpression;
    }

    function _addDefaultValue(propRef, value) {
        if (!propRef || !_getExpressionMeta()) {
            return;
        }
        var propName = pega.u.property.toReference(propRef);
        var dotIndex = propName.indexOf(".");
        if (dotIndex != -1) { //extract toplevelpage from full ref
            var topLevelPage = propName.substring(0, dotIndex);
            var trailingRef = propName.substring(dotIndex, propName.length);
            if (!_getExpressionMeta().properties || !_getExpressionMeta().properties[topLevelPage] || !_getExpressionMeta().properties[topLevelPage][trailingRef] || _getExpressionMeta().properties[topLevelPage][trailingRef]["default"]) {
                //Add to temp cache
                _getCtxExpressionEvaluator().controlDefaultValuesMap[propName] = value;
            } else {
                _getExpressionMeta().properties[topLevelPage][trailingRef]["default"] = value;
                if (value.toString() == "false" || value.toString() == "true") {
                    _getExpressionMeta().properties[topLevelPage][trailingRef]["type"] = "boolean";
                }
            }
        }
    }

    function _extractBooleanProperties(expression, properties) {

        // Split the expression by logical operators & and |
        // eq., "this[.p1] == 'false' || this[.p2] == 'false' && pyWorkPage.p3 == 'some'"
        // output: [this[.p1] == 'false', this[.p2] == 'false', pyWorkPage.p3 == 'some']
        var exprs = expression.split(/&|\|/g);
        var i = 0,
            size = exprs.length,
            propListSize = properties.length;
        var returnProperties = [];
        for (i; i < size; i++) {
            // If expression has boolean condition
            if (exprs[i].indexOf("'false'") != -1 || exprs[i].indexOf("'true'") != -1) {

                for (var j = 0; j < propListSize; j++) {
                    // Starts with dot -> always prepend with this[.prop]
                    var property = properties[j];
                    if (property.indexOf('.') == 0) {
                        // Check in epression token
                        property = "this['" + property + "']";
                    }
                    if (exprs[i].indexOf(property) != -1) {
                        returnProperties.push(properties[j]);
                    }
                }
            }
        }
        return returnProperties;
    }


    function _getTopPage(fullRef) {
        if (fullRef.indexOf('.') > 0) {
            fullRef = fullRef.substring(0, fullRef.indexOf('.'));
        }
        return fullRef
    }

    function _getParentPage(fullRef) {
        if (fullRef.lastIndexOf('.') > 0) {
            fullRef = fullRef.substring(0, fullRef.lastIndexOf('.'));
        }
        return fullRef
    }

    function _addToPropertyData(property, expressionId, isBoolean, isDPSourceParameterized) {
        if (!property || !expressionId) {
            return;
        }

        var currentEntryHandle = pega.ui.TemplateEngine.getCurrentContext().getEntryHandle();
        var propertyRefs = _getCorrectedPropertyRefs(property, currentEntryHandle, isDPSourceParameterized, false);

        var topLevelRef = propertyRefs.topLevelRef,
            trailingRef = propertyRefs.trailingRef;

        _getExpressionMeta()["properties"] = _getExpressionMeta()["properties"] || {};
        _getExpressionMeta()["properties"][topLevelRef] = _getExpressionMeta()["properties"][topLevelRef] || {};
        _getExpressionMeta()["properties"][topLevelRef][trailingRef] = _getExpressionMeta()["properties"][topLevelRef][trailingRef] || {};

        //Adding default value from tmp map if its present
        var defaultValueFromMap = _getCtxExpressionEvaluator().controlDefaultValuesMap[topLevelRef + trailingRef];
        if (defaultValueFromMap) {
            _getExpressionMeta()["properties"][topLevelRef][trailingRef]["default"] = defaultValueFromMap;
            if (defaultValueFromMap.toString() == "false" || defaultValueFromMap.toString() == "true") {
                _getExpressionMeta().properties[topLevelRef][trailingRef]["type"] = "boolean";
            }
            delete _getCtxExpressionEvaluator().controlDefaultValuesMap[topLevelRef + trailingRef];
        }

        //Add default value for boolean properties as false
        if (isBoolean && !_getExpressionMeta()["properties"][topLevelRef][trailingRef]["default"]) {
            _getExpressionMeta()["properties"][topLevelRef][trailingRef]["default"] = 'false';
            _getExpressionMeta()["properties"][topLevelRef][trailingRef]["type"] = 'boolean';
        }

        _getExpressionMeta()["properties"][topLevelRef][trailingRef]["exprIds"] = _getExpressionMeta()["properties"][topLevelRef][trailingRef]["exprIds"] || {};
        _getExpressionMeta()["properties"][topLevelRef][trailingRef]["exprIds"][expressionId] = "";

        //Delete cached value if its present
        if (_getExpressionMeta()["properties"][topLevelRef][trailingRef]["value"] != undefined && _getExpressionMeta()["properties"][topLevelRef][trailingRef]["value"] != null) {
            delete _getExpressionMeta()["properties"][topLevelRef][trailingRef]["value"];
        }
    }

    function _evaluateSpecificExpressionType(expressionType) {
        _getCtxExpressionEvaluator().evaluateSpecificExpressionType = expressionType;
    }

    function _getExpressionMetaToStamp(expressionId, doNotStampContext) {
        if (!expressionId || !_getExpressionMeta() || !_getExpressionMeta().expressions || !_getExpressionMeta().expressions[expressionId]) {
            return "";
        }
        var currentEntryHandle = pega.ui.TemplateEngine.getCurrentContext().getEntryHandle();
        _populatePropertyData(expressionId);

        var expressionIdMeta = DATA_EXPR_ID + " = " + expressionId + " ";

        if (doNotStampContext === true) {
            _getExpressionMeta().expressions[expressionId][IS_SPECIAL_CASE_OF_CONTEXT] = true;
        } else {
            expressionIdMeta = expressionIdMeta + "data-context = " + currentEntryHandle + " ";
        }
        return expressionIdMeta;
    }

    function _populatePropertyData(expressionId) {

        //Populates property data
        var exprObj = _getExpressionMeta().expressions[expressionId];
        var properties;
        for (var expType in exprObj) {
            if (!exprObj[expType].expr) {
                continue;
            }
            if (handlers[expType] && typeof handlers[expType] == "function") {
                properties = exprObj[expType]["props"];
                if (!properties || properties.length == 0) {
                    continue;
                }
                var booleanProperties = [];
                if (exprObj[expType].expr instanceof Array) {
                    for (var k = 0; k < exprObj[expType].expr.length; k++) {
                        booleanProperties = booleanProperties.concat(_extractBooleanProperties(exprObj[expType].expr[k].expr, properties));
                    }
                } else if (properties) {
                    booleanProperties = _extractBooleanProperties(exprObj[expType].expr, properties);
                }
                var isDPSourceParameterized = exprObj[expType].isparamdp;
                for (var i = properties.length - 1; i >= 0; i--) {
                    var isBoolean = false;
                    if (booleanProperties.indexOf(properties[i]) != -1) {
                        isBoolean = true;
                    }
                    _addToPropertyData(properties[i], expressionId, isBoolean, isDPSourceParameterized);
                }
            }
        }

    }

    /**
     * API to evaluate given expression string, context and libraryNameSpace
     *
     * @param      {<type>}  expression        The expression
     * @param      {<type>}  context           The context
     * @param      {<type>}  libraryNameSpace  The library name space
     * @return     {<boolean>}  evaluation result
     */
    function _evaluate(expression, context, libraryNameSpace) {
        var expressionObj = _extractPropertiesAndBuildExpression(expression, libraryNameSpace);
        var evalExpression = expressionObj["evalExpression"];
        var propertiesList = expressionObj["propertiesList"];

        if (!evalExpression) {
            return;
        }

        return _evaluateExpression(evalExpression, propertiesList, context);
    }

    /**
     * Function to build final expression which is passed to actual evaluation and extract properties
     *
     * @param      {string}  expression        The expression
     * @param      {<type>}  libraryNameSpace  The library name space
     * @return     {<object>}  Object contains final evalExpression and propertiesList
     */
    function _extractPropertiesAndBuildExpression(expression, libraryNameSpace) {
        if (!expression) {
            return;
        }

        var currentStr = "";
        var expressionLen = expression.length;
        var finalExpression = "";
        var properties = [];


        for (var i = 0; i < expressionLen; i++) {
            var currentChar = expression.charAt(i);

            // Extracting value from expression and appending to finalExpression
            if ((currentChar == '\'' || currentChar == '"') && !(i > 0 && expression.charAt(i - 1) == '\\')) {
                var valueStartChar = currentChar;
                finalExpression += currentChar;
                i++;
                if (i >= expressionLen) {
                    //oLog.infoForced("Invalid Expression Configured: " + expression);
                    finalExpression = "";
                    properties = [];
                    return;
                }
                currentChar = expression.charAt(i);
                while (currentChar != valueStartChar && i < expressionLen - 1) {
                    // Append till we reach single quote or length exceeds
                    finalExpression += currentChar;
                    i++;
                    currentChar = expression.charAt(i);
                }
                if (currentChar == valueStartChar && !(i > 0 && expression.charAt(i - 1) == '\\')) {
                    finalExpression += currentChar;
                    continue;
                } else {
                    //oLog.infoForced("Invalid Expression Configured: " + expression);
                    finalExpression = "";
                    properties = [];
                    return;
                }

            }

            // Check for the enclose(grouping) case like
            // (.myprop1 = 1) && (.myprop2 = 3)
            if (currentChar == '(') {
                var endParenthesisIndex = expression.indexOf(')', i);
                // Get string within parenthesis
                var pageIndexStr = expression.substring(i, endParenthesisIndex + 1);
                // Add to current property if pageIndexStr does not contain '.'
                // and another parenthesis
                if (pageIndexStr.indexOf('.') < 0 && pageIndexStr.indexOf('(', 1) < 0) {
                    currentStr += pageIndexStr;
                    i = endParenthesisIndex + 1;
                    if (i >= expressionLen) {
                        break;
                    }
                    currentChar = expression.charAt(i);
                }
            }
            if (currentChar == '@' && libraryNameSpace) {
                finalExpression += libraryNameSpace + ".";
                while (currentChar != '(' && i < expressionLen - 1) {
                    i++;
                    currentChar = expression.charAt(i);
                    finalExpression += currentChar;

                }
            } else if (currentChar != '(' && currentChar != ')' && currentChar != '=' && currentChar != '<' &&
                currentChar != '>' && currentChar != '!' && currentChar != '|' && currentChar != '&' &&
                currentChar != ' ') {
                // Add to current property if current char is not a operand and
                // not a parenthesis
                currentStr += currentChar;
            } else {
                finalExpression = addToPropertiesAndExpression(currentStr, properties, finalExpression, expression);

                finalExpression += currentChar;
                currentStr = "";
            }

            var preChar = i > 0 ? expression.charAt(i - 1) : '\0';
            var nextChar = i < expression.length - 1 ? expression.charAt(i + 1) : '\0';

            if (currentChar == '=' && preChar != '=' && nextChar != '=' && preChar != '<' && nextChar != '<' && preChar != '>' && nextChar != '>' && preChar != '!' && nextChar != '!') {
                // add extra '=' in case of single '='
                finalExpression += "=";
            }

        }

        // Add remaining string
        finalExpression = addToPropertiesAndExpression(currentStr, properties, finalExpression, expression);
        return { "evalExpression": finalExpression, "propertiesList": properties };
    }

    /**
     * Adds to properties and expression.
     *
     * @param      {string}  currentStr       The current string
     * @param      {Array}   properties       The properties
     * @param      {string}  finalExpression  The final expression
     * @param      {<type>}  expression       The expression
     * @return     {string}  finalExpression
     */
    function addToPropertiesAndExpression(currentStr, properties, finalExpression, expression) {
        if (currentStr.length > 0) {
            // Add current property to final properties set if that is
            // not a value in the expression.
            // Value in the expression has first character as " OR ' OR
            // digit
            if ((isPropertyString(currentStr))) {
                properties.push(currentStr);
                finalExpression += "this";
                finalExpression += "['" + currentStr + "']";
            } else {
                //Special case where expression can have boolean, and, or
                if (currentStr === "true" || currentStr === "false") {
                    finalExpression += "'" + currentStr + "'";
                } else if (currentStr.toLowerCase() === "and") {
                    finalExpression += "&&";
                } else if (currentStr.toLowerCase() === "or") {
                    finalExpression += "||";
                } else {
                    finalExpression += currentStr;
                }
            }

        }

        return finalExpression;
    }

    /**
     * Determines if property string.
     *
     * @param      {string}   currentStr  The current string
     * @return     {boolean}  True if property string, False otherwise.
     */
    function isPropertyString(currentStr) {
        var firstChar = currentStr.charAt(0);
        //Property should starts with DOT or contains DOT
        //Do not consider string as property if first char is digit like 22.3
        if (currentStr.indexOf('.') >= 0 && isNaN(firstChar)) {
            return true;
        }
        return false;
    };

    function _clearTempCaches() {
        _getCtxExpressionEvaluator().clearTempCaches();
    }

    function _getCtxExpressionEvaluator() {
        if (!pega.ctx.expressionevaluator) {
            pega.ctx.expressionevaluator = new ExpressionEvaluator();
        }
        return pega.ctx.expressionevaluator;
    }

    function _getCtxDom() {
        return pega.ctx.dom;
    }

    function _getCtxElement() {
        return pega.ctx.dom.getContextRoot();
    }

    function _pushSectionInfo(sectionInfo) {
        sectionInfoStack.push(sectionInfo);
    }

    function _popSectionInfo() {
        sectionInfoStack.pop();
    }

    function _peekSectionInfo() {
        if (sectionInfoStack.length == 0) {
            return undefined;
        }
        return sectionInfoStack[sectionInfoStack.length - 1];
    }
    
    return {
        "initDefaultHandlers": _initDefaultHandlers,
        "addExpressionMeta": _addExpressionMeta,
        "getExpressionMeta": _getExpressionMeta,
        "evaluateClientExpressions": _evaluateClientExpressions,
        "evaluateClientExpressionsLG": _evaluateClientExpressionsLG,
        "handlePropertyChange": _handlePropertyChange,
        "handleChangedProperties": _handleChangedProperties,
        "registerHandler": _registerHandler,
        "isRefreshExpression": _isRefreshExpression,
        "setNTExpressionStatus": _setNTExpressionStatus,
        "getNTExpressionStatus": _getNTExpressionStatus,
        "addDefaultValue": _addDefaultValue,
        "getExpressionMetaToStamp": _getExpressionMetaToStamp,
        "evaluateSpecificExpressionType": _evaluateSpecificExpressionType,
        "evaluate": _evaluate,
        "pushSectionInfo": _pushSectionInfo,
        "popSectionInfo": _popSectionInfo,
        "SECTION_REFRESH_WHEN": SECTION_REFRESH_WHEN,
        "REFRESH_WHEN": REFRESH_WHEN,
        "SHOW_WHEN": SHOW_WHEN,
        "DISABLE_WHEN": DISABLE_WHEN,
        "REQUIRED_WHEN": REQUIRED_WHEN,
        "CELL_REFRESH_WHEN": CELL_REFRESH_WHEN,
        "ALL_REFRESH_WHENS": ALL_REFRESH_WHENS,
        "NON_REFRESH_WHENS": NON_REFRESH_WHENS,
        "AFTER_VISIBLE_WHENS_HANDLED": AFTER_VISIBLE_WHENS_HANDLED,
        "ACTIVE_WHEN":ACTIVE_WHEN
    }


    function ExpressionEvaluator() {
        this.hasNTExpression = false;
        this.expressionData = null;
        this.controlDefaultValuesMap = {};
        //Holds dom value when evaluation triggers from dom change
        this.changedDomPropertyValue = null;
        //Holds dom property name when evaluation triggers from dom change
        this.changedDomPropertyName = null;
        //Cache to hold expression dom elements that will be refreshed after expressions are evaluated
        this.elementsToBeRefreshed = [];
        //Cache to hold section streams that are refreshed
        this.reloadSectionsCache = null;
        //Cache to hold dom references of components that are refreshed
        this.reloadComponentsCache = [];
        this.evaluateSpecificExpressionType = null;
        this.ON_RENDERING = false;
        this.IGNORE_DOM_LOOKUP = false;
        //Contains property name on which dom change event occurred
        this.propertyNameFromDomChange = null;

        this.clearTempCaches = function() {
            this.elementsToBeRefreshed = [];
            this.reloadSectionsCache = null;
            this.reloadComponentsCache = [];
            this.evaluateSpecificExpressionType = null;
            pega.u.d.ct_postedProp = undefined;
            this.propertyNameFromDomChange = null;
        }
    }
})();
//static-content-hash-trigger-GCC