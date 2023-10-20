/*
{{#if isMDC}}
<fieldset data-method='post' name ='main' class="mdc-fieldset" data-action="{{pyFromActionURL}}" {{getTemplateMarker}}>
{{else}}
<form autocomplete='off' method='post' name ='main' action="{{pyFromActionURL}}" {{getTemplateMarker}}>
{{/if}}
  <input type="hidden" id="pzHarnessID" value="{{pzHarnessID}}" />
  <input type="hidden" name="Purpose" value="{{pyStreamName}}" />
  <input type="hidden" id='ReadOnly' name="ReadOnly" value="{{ReadOnly}}" />
        <input type="hidden" id="pyCustomErrorSection" value="{{pyCustomErrorSection}}" / >
        <input type="hidden" id='HarnessPurpose' name="HarnessPurpose" value="{{pyStreamName}}" />
        <input type="hidden" name="FolderKey" value="{{FolderKey}}" />
        <input type="hidden" name="InputEnabled" value="{{InputEnabled}}" />
        <input type="hidden" name="pzCTkn" value="{{pzCTkn}}" />
        <input type="hidden" id="pzBFP" name="pzBFP" value="{{pzBFP}}" />
        {{#if pyFormPost}}
            <input type="hidden" id='pyFormPost' name="{{pyFormPost}}" value="" />
         {{/if}}
         {{#if_eq target  "popup"}}
            <input type="hidden" id='target' name='target' value="{{target}}" />
         {{/if_eq}}
        {{#if pyGeolocationTrackingIsEnabled}}
            <input type="hidden" id='pxRequestorPyLatitude' name="{{pxRequestorPyLatitude}}" value="{{pxRequestorPyLatitudeValue}}" />
            <input type="hidden" id='pxRequestorPyLongitude' name="{{pxRequestorPyLongitude}}" value="{{pxRequestorPyLongitudeValue}}" />
       {{/if}}
        {{#if pySpecialtyComponentData}}
            <input type="hidden" id='pySpecialtyComponentData' name="{{pySpecialtyComponentData}}" value="" />
        {{/if}}
        <div class="modal-overlay" id="modalOverlay">
            <div class="modal-align-table">
                <div class="modal-align-cell">
                    <div class="modal-wrapper" id="modalWrapper" role="dialog" aria-modal="true" aria-labelledby="modalDialog_Title">
                        <div class="modal-content" id="modalContent"></div>
                    </div>
                </div>
            </div>
        </div>
        
  {{#each pyTemplates}}
    {{{renderChildren this}}}
  {{/each}}
  <div style="display:none;"><input type="text" tabindex="-1"/></div>

{{#if isMDC}}
</fieldset>
{{else}}
</form>
{{/if}}
*/

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; 
templates['Form'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<fieldset data-method='post' name ='main' class=\"mdc-fieldset\" data-action=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyFromActionURL") || (depth0 != null ? lookupProperty(depth0,"pyFromActionURL") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyFromActionURL","hash":{},"data":data,"loc":{"start":{"line":2,"column":76},"end":{"line":2,"column":95}}}) : helper)))
    + "\" "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"getTemplateMarker") || (depth0 != null ? lookupProperty(depth0,"getTemplateMarker") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"getTemplateMarker","hash":{},"data":data,"loc":{"start":{"line":2,"column":97},"end":{"line":2,"column":118}}}) : helper)))
    + ">\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<form autocomplete='off' method='post' name ='main' action=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyFromActionURL") || (depth0 != null ? lookupProperty(depth0,"pyFromActionURL") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyFromActionURL","hash":{},"data":data,"loc":{"start":{"line":4,"column":60},"end":{"line":4,"column":79}}}) : helper)))
    + "\" "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"getTemplateMarker") || (depth0 != null ? lookupProperty(depth0,"getTemplateMarker") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"getTemplateMarker","hash":{},"data":data,"loc":{"start":{"line":4,"column":81},"end":{"line":4,"column":102}}}) : helper)))
    + ">\n";
},"5":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "            <input type=\"hidden\" id='pyFormPost' name=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyFormPost") || (depth0 != null ? lookupProperty(depth0,"pyFormPost") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyFormPost","hash":{},"data":data,"loc":{"start":{"line":16,"column":55},"end":{"line":16,"column":69}}}) : helper)))
    + "\" value=\"\" />\n";
},"7":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "            <input type=\"hidden\" id='target' name='target' value=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"target") || (depth0 != null ? lookupProperty(depth0,"target") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"target","hash":{},"data":data,"loc":{"start":{"line":19,"column":66},"end":{"line":19,"column":76}}}) : helper)))
    + "\" />\n";
},"9":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "            <input type=\"hidden\" id='pxRequestorPyLatitude' name=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pxRequestorPyLatitude") || (depth0 != null ? lookupProperty(depth0,"pxRequestorPyLatitude") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pxRequestorPyLatitude","hash":{},"data":data,"loc":{"start":{"line":22,"column":66},"end":{"line":22,"column":91}}}) : helper)))
    + "\" value=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pxRequestorPyLatitudeValue") || (depth0 != null ? lookupProperty(depth0,"pxRequestorPyLatitudeValue") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pxRequestorPyLatitudeValue","hash":{},"data":data,"loc":{"start":{"line":22,"column":100},"end":{"line":22,"column":130}}}) : helper)))
    + "\" />\n            <input type=\"hidden\" id='pxRequestorPyLongitude' name=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pxRequestorPyLongitude") || (depth0 != null ? lookupProperty(depth0,"pxRequestorPyLongitude") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pxRequestorPyLongitude","hash":{},"data":data,"loc":{"start":{"line":23,"column":67},"end":{"line":23,"column":93}}}) : helper)))
    + "\" value=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pxRequestorPyLongitudeValue") || (depth0 != null ? lookupProperty(depth0,"pxRequestorPyLongitudeValue") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pxRequestorPyLongitudeValue","hash":{},"data":data,"loc":{"start":{"line":23,"column":102},"end":{"line":23,"column":133}}}) : helper)))
    + "\" />\n";
},"11":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "            <input type=\"hidden\" id='pySpecialtyComponentData' name=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pySpecialtyComponentData") || (depth0 != null ? lookupProperty(depth0,"pySpecialtyComponentData") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pySpecialtyComponentData","hash":{},"data":data,"loc":{"start":{"line":26,"column":69},"end":{"line":26,"column":97}}}) : helper)))
    + "\" value=\"\" />\n";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    "
    + ((stack1 = (lookupProperty(helpers,"renderChildren")||(depth0 && lookupProperty(depth0,"renderChildren"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"renderChildren","hash":{},"data":data,"loc":{"start":{"line":39,"column":4},"end":{"line":39,"column":29}}})) != null ? stack1 : "")
    + "\n";
},"15":function(container,depth0,helpers,partials,data) {
    return "</fieldset>\n";
},"17":function(container,depth0,helpers,partials,data) {
    return "</form>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isMDC") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":5,"column":7}}})) != null ? stack1 : "")
    + "  <input type=\"hidden\" id=\"pzHarnessID\" value=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pzHarnessID") || (depth0 != null ? lookupProperty(depth0,"pzHarnessID") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pzHarnessID","hash":{},"data":data,"loc":{"start":{"line":6,"column":47},"end":{"line":6,"column":62}}}) : helper)))
    + "\" />\n  <input type=\"hidden\" name=\"Purpose\" value=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyStreamName") || (depth0 != null ? lookupProperty(depth0,"pyStreamName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyStreamName","hash":{},"data":data,"loc":{"start":{"line":7,"column":45},"end":{"line":7,"column":61}}}) : helper)))
    + "\" />\n  <input type=\"hidden\" id='ReadOnly' name=\"ReadOnly\" value=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"ReadOnly") || (depth0 != null ? lookupProperty(depth0,"ReadOnly") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"ReadOnly","hash":{},"data":data,"loc":{"start":{"line":8,"column":60},"end":{"line":8,"column":72}}}) : helper)))
    + "\" />\n        <input type=\"hidden\" id=\"pyCustomErrorSection\" value=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyCustomErrorSection") || (depth0 != null ? lookupProperty(depth0,"pyCustomErrorSection") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyCustomErrorSection","hash":{},"data":data,"loc":{"start":{"line":9,"column":62},"end":{"line":9,"column":86}}}) : helper)))
    + "\" / >\n        <input type=\"hidden\" id='HarnessPurpose' name=\"HarnessPurpose\" value=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pyStreamName") || (depth0 != null ? lookupProperty(depth0,"pyStreamName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pyStreamName","hash":{},"data":data,"loc":{"start":{"line":10,"column":78},"end":{"line":10,"column":94}}}) : helper)))
    + "\" />\n        <input type=\"hidden\" name=\"FolderKey\" value=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"FolderKey") || (depth0 != null ? lookupProperty(depth0,"FolderKey") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"FolderKey","hash":{},"data":data,"loc":{"start":{"line":11,"column":53},"end":{"line":11,"column":66}}}) : helper)))
    + "\" />\n        <input type=\"hidden\" name=\"InputEnabled\" value=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"InputEnabled") || (depth0 != null ? lookupProperty(depth0,"InputEnabled") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"InputEnabled","hash":{},"data":data,"loc":{"start":{"line":12,"column":56},"end":{"line":12,"column":72}}}) : helper)))
    + "\" />\n        <input type=\"hidden\" name=\"pzCTkn\" value=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pzCTkn") || (depth0 != null ? lookupProperty(depth0,"pzCTkn") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pzCTkn","hash":{},"data":data,"loc":{"start":{"line":13,"column":50},"end":{"line":13,"column":60}}}) : helper)))
    + "\" />\n        <input type=\"hidden\" id=\"pzBFP\" name=\"pzBFP\" value=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pzBFP") || (depth0 != null ? lookupProperty(depth0,"pzBFP") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pzBFP","hash":{},"data":data,"loc":{"start":{"line":14,"column":60},"end":{"line":14,"column":69}}}) : helper)))
    + "\" />\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyFormPost") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":8},"end":{"line":17,"column":16}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"if_eq")||(depth0 && lookupProperty(depth0,"if_eq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"target") : depth0),"popup",{"name":"if_eq","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":18,"column":9},"end":{"line":20,"column":19}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyGeolocationTrackingIsEnabled") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":21,"column":8},"end":{"line":24,"column":14}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pySpecialtyComponentData") : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":25,"column":8},"end":{"line":27,"column":15}}})) != null ? stack1 : "")
    + "        <div class=\"modal-overlay\" id=\"modalOverlay\">\n            <div class=\"modal-align-table\">\n                <div class=\"modal-align-cell\">\n                    <div class=\"modal-wrapper\" id=\"modalWrapper\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"modalDialog_Title\">\n                        <div class=\"modal-content\" id=\"modalContent\"></div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        \n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"pyTemplates") : depth0),{"name":"each","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":38,"column":2},"end":{"line":40,"column":11}}})) != null ? stack1 : "")
    + "  <div style=\"display:none;\"><input type=\"text\" tabindex=\"-1\"/></div>\n\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"isMDC") : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.program(17, data, 0),"data":data,"loc":{"start":{"line":43,"column":0},"end":{"line":47,"column":7}}})) != null ? stack1 : "");
},"useData":true});
})();

var formRenderer = function(componentInfo){
  var TEMPLATE_CONSTANTS = pega.ui.TEMPLATE_CONSTANTS;
  componentInfo.pyStreamName = componentInfo[TEMPLATE_CONSTANTS["PYSTREAMNAME"]];
  componentInfo.pyFromActionURL = componentInfo[TEMPLATE_CONSTANTS["PYFROMACTIONURL"]];
  componentInfo.ReadOnly = componentInfo[TEMPLATE_CONSTANTS["PXREADONLY"]];
  componentInfo.pyCustomErrorSection = componentInfo[TEMPLATE_CONSTANTS["PYCUSTOMERRORSECTION"]];
  componentInfo.FolderKey = componentInfo[TEMPLATE_CONSTANTS["FOLDERKEY"]];
  componentInfo.InputEnabled = componentInfo[TEMPLATE_CONSTANTS["INPUTENABLED"]];
  componentInfo.pyFormPost = componentInfo[TEMPLATE_CONSTANTS["PYFORMPOST"]];
  componentInfo.pyGeolocationTrackingIsEnabled = componentInfo[TEMPLATE_CONSTANTS["PYISGEOLOCTRACKINGENABLED"]];
  componentInfo.pxRequestorPyLatitude = componentInfo[TEMPLATE_CONSTANTS["PYLATITUDE"]];
  componentInfo.pxRequestorPyLatitudeValue = componentInfo[TEMPLATE_CONSTANTS["PYLATITUDEVALUE"]];
  componentInfo.pxRequestorPyLongitude = componentInfo[TEMPLATE_CONSTANTS["PYLONGITUDE"]];
  componentInfo.pxRequestorPyLongitudeValue = componentInfo[TEMPLATE_CONSTANTS["PYLONGITUDEVALUE"]];
  componentInfo.pySpecialtyComponentData = componentInfo[TEMPLATE_CONSTANTS["PYCOMPONENTDATA"]];
  //componentInfo.isMDC = componentInfo[TEMPLATE_CONSTANTS["ISMDC"]];
  return pega.ui.TemplateEngine.execute("Form", componentInfo);
};
pega.ui.template.RenderingEngine.register("Form", formRenderer);
//static-content-hash-trigger-GCC