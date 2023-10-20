/*! jsTree - v3.3.7 - 2018-11-06 - (MIT) */
!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):"undefined"!=typeof module&&module.exports?module.exports=a(require("jquery")):a(jQuery)}(function(a,b){"use strict";if(!a.jstree){var c=0,d=!1,e=!1,f=!1,g=[],h=a("script:last").attr("src"),i=window.document;a.jstree={version:"3.3.7",defaults:{plugins:[]},plugins:{},path:h&&-1!==h.indexOf("/")?h.replace(/\/[^\/]+$/,""):"",idregex:/[\\:&!^|()\[\]<>@*'+~#";.,=\- \/${}%?`]/g,root:"#"},a.jstree.create=function(b,d){var e=new a.jstree.core(++c),f=d;return d=a.extend(!0,{},a.jstree.defaults,d),f&&f.plugins&&(d.plugins=f.plugins),a.each(d.plugins,function(a,b){"core"!==a&&(e=e.plugin(b,d[b]))}),a(b).data("jstree",e),e.init(b,d),e},a.jstree.destroy=function(){a(".jstree:jstree").jstree("destroy"),a(i).off(".jstree")},a.jstree.core=function(a){this._id=a,this._cnt=0,this._wrk=null,this._data={core:{themes:{name:!1,dots:!1,icons:!1,ellipsis:!1},selected:[],last_error:{},working:!1,worker_queue:[],focused:null}}},a.jstree.reference=function(b){var c=null,d=null;if(!b||!b.id||b.tagName&&b.nodeType||(b=b.id),!d||!d.length)try{d=a(b)}catch(e){}if(!d||!d.length)try{d=a("#"+b.replace(a.jstree.idregex,"\\$&"))}catch(e){}return d&&d.length&&(d=d.closest(".jstree")).length&&(d=d.data("jstree"))?c=d:a(".jstree").each(function(){var d=a(this).data("jstree");return d&&d._model.data[b]?(c=d,!1):void 0}),c},a.fn.jstree=function(c){var d="string"==typeof c,e=Array.prototype.slice.call(arguments,1),f=null;return c!==!0||this.length?(this.each(function(){var g=a.jstree.reference(this),h=d&&g?g[c]:null;return f=d&&h?h.apply(g,e):null,g||d||c!==b&&!a.isPlainObject(c)||a.jstree.create(this,c),(g&&!d||c===!0)&&(f=g||!1),null!==f&&f!==b?!1:void 0}),null!==f&&f!==b?f:this):!1},a.expr.pseudos.jstree=a.expr.createPseudo(function(c){return function(c){return a(c).hasClass("jstree")&&a(c).data("jstree")!==b}}),a.jstree.defaults.core={data:!1,strings:!1,check_callback:!1,error:a.noop,animation:200,multiple:!0,themes:{name:!1,url:!1,dir:!1,dots:!0,icons:!0,ellipsis:!1,stripes:!1,variant:!1,responsive:!1},expand_selected_onload:!0,worker:!0,force_text:!1,dblclick_toggle:!0,loaded_state:!1,restore_focus:!0,keyboard:{"ctrl-space":function(b){b.type="click",a(b.currentTarget).trigger(b)},enter:function(b){b.type="click",a(b.currentTarget).trigger(b)},left:function(b){if(b.preventDefault(),this.is_open(b.currentTarget))this.close_node(b.currentTarget);else{var c=this.get_parent(b.currentTarget);c&&c.id!==a.jstree.root&&this.get_node(c,!0).children(".jstree-anchor").focus()}},up:function(a){a.preventDefault();var b=this.get_prev_dom(a.currentTarget);b&&b.length&&b.children(".jstree-anchor").focus()},right:function(b){if(b.preventDefault(),this.is_closed(b.currentTarget))this.open_node(b.currentTarget,function(a){this.get_node(a,!0).children(".jstree-anchor").focus()});else if(this.is_open(b.currentTarget)){var c=this.get_node(b.currentTarget,!0).children(".jstree-children")[0];c&&a(this._firstChild(c)).children(".jstree-anchor").focus()}},down:function(a){a.preventDefault();var b=this.get_next_dom(a.currentTarget);b&&b.length&&b.children(".jstree-anchor").focus()},"*":function(a){this.open_all()},home:function(b){b.preventDefault();var c=this._firstChild(this.get_container_ul()[0]);c&&a(c).children(".jstree-anchor").filter(":visible").focus()},end:function(a){a.preventDefault(),this.element.find(".jstree-anchor").filter(":visible").last().focus()},f2:function(a){a.preventDefault(),this.edit(a.currentTarget)}}},a.jstree.core.prototype={plugin:function(b,c){var d=a.jstree.plugins[b];return d?(this._data[b]={},d.prototype=this,new d(c,this)):this},init:function(b,c){this._model={data:{},changed:[],force_full_redraw:!1,redraw_timeout:!1,default_state:{loaded:!0,opened:!1,selected:!1,disabled:!1}},this._model.data[a.jstree.root]={id:a.jstree.root,parent:null,parents:[],children:[],children_d:[],state:{loaded:!1}},this.element=a(b).addClass("jstree jstree-"+this._id),this.settings=c,this._data.core.ready=!1,this._data.core.loaded=!1,this._data.core.rtl="rtl"===this.element.css("direction"),this.element[this._data.core.rtl?"addClass":"removeClass"]("jstree-rtl"),this.element.attr("role","tree"),this.settings.core.multiple&&this.element.attr("aria-multiselectable",!0),this.element.attr("tabindex")||this.element.attr("tabindex","0"),this.bind(),this.trigger("init"),this._data.core.original_container_html=this.element.find(" > ul > li").clone(!0),this._data.core.original_container_html.find("li").addBack().contents().filter(function(){return 3===this.nodeType&&(!this.nodeValue||/^\s+$/.test(this.nodeValue))}).remove(),this.element.html("<ul class='jstree-container-ul jstree-children' role='group'><li id='j"+this._id+"_loading' class='jstree-initial-node jstree-loading jstree-leaf jstree-last' role='tree-item'><i class='jstree-icon jstree-ocl'></i><a class='jstree-anchor' href='#'><i class='jstree-icon jstree-themeicon-hidden'></i>"+this.get_string("Loading ...")+"</a></li></ul>"),this.element.attr("aria-activedescendant","j"+this._id+"_loading"),this._data.core.li_height=this.get_container_ul().children("li").first().outerHeight()||24,this._data.core.node=this._create_prototype_node(),this.trigger("loading"),this.load_node(a.jstree.root)},destroy:function(a){if(this.trigger("destroy"),this._wrk)try{window.URL.revokeObjectURL(this._wrk),this._wrk=null}catch(b){}a||this.element.empty(),this.teardown()},_create_prototype_node:function(){var a=i.createElement("LI"),b,c;return a.setAttribute("role","treeitem"),b=i.createElement("I"),b.className="jstree-icon jstree-ocl",b.setAttribute("role","presentation"),a.appendChild(b),b=i.createElement("A"),b.className="jstree-anchor",b.setAttribute("href","#"),b.setAttribute("tabindex","-1"),c=i.createElement("I"),c.className="jstree-icon jstree-themeicon",c.setAttribute("role","presentation"),b.appendChild(c),a.appendChild(b),b=c=null,a},_kbevent_to_func:function(a){var b={8:"Backspace",9:"Tab",13:"Return",19:"Pause",27:"Esc",32:"Space",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"Left",38:"Up",39:"Right",40:"Down",44:"Print",45:"Insert",46:"Delete",96:"Numpad0",97:"Numpad1",98:"Numpad2",99:"Numpad3",100:"Numpad4",101:"Numpad5",102:"Numpad6",103:"Numpad7",104:"Numpad8",105:"Numpad9","-13":"NumpadEnter",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"Numlock",145:"Scrolllock",16:"Shift",17:"Ctrl",18:"Alt",48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",59:";",61:"=",65:"a",66:"b",67:"c",68:"d",69:"e",70:"f",71:"g",72:"h",73:"i",74:"j",75:"k",76:"l",77:"m",78:"n",79:"o",80:"p",81:"q",82:"r",83:"s",84:"t",85:"u",86:"v",87:"w",88:"x",89:"y",90:"z",107:"+",109:"-",110:".",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'",111:"/",106:"*",173:"-"},c=[];a.ctrlKey&&c.push("ctrl"),a.altKey&&c.push("alt"),a.shiftKey&&c.push("shift"),c.push(b[a.which]||a.which),c=c.sort().join("-").toLowerCase();var d=this.settings.core.keyboard,e,f;for(e in d)if(d.hasOwnProperty(e)&&(f=e,"-"!==f&&"+"!==f&&(f=f.replace("--","-MINUS").replace("+-","-MINUS").replace("++","-PLUS").replace("-+","-PLUS"),f=f.split(/-|\+/).sort().join("-").replace("MINUS","-").replace("PLUS","+").toLowerCase()),f===c))return d[e];return null},teardown:function(){this.unbind(),this.element.removeClass("jstree").removeData("jstree").find("[class^='jstree']").addBack().attr("class",function(){return this.className.replace(/jstree[^ ]*|$/gi,"")}),this.element=null},bind:function(){var b="",c=null,d=0;this.element.on("dblclick.jstree",function(a){if(a.target.tagName&&"input"===a.target.tagName.toLowerCase())return!0;if(i.selection&&i.selection.empty)i.selection.empty();else if(window.getSelection){var b=window.getSelection();try{b.removeAllRanges(),b.collapse()}catch(c){}}}).on("mousedown.jstree",a.proxy(function(a){a.target===this.element[0]&&(a.preventDefault(),d=+new Date)},this)).on("mousedown.jstree",".jstree-ocl",function(a){a.preventDefault()}).on("click.jstree",".jstree-ocl",a.proxy(function(a){this.toggle_node(a.target)},this)).on("dblclick.jstree",".jstree-anchor",a.proxy(function(a){return a.target.tagName&&"input"===a.target.tagName.toLowerCase()?!0:void(this.settings.core.dblclick_toggle&&this.toggle_node(a.target))},this)).on("click.jstree",".jstree-anchor",a.proxy(function(b){b.preventDefault(),b.currentTarget!==i.activeElement&&a(b.currentTarget).focus(),this.activate_node(b.currentTarget,b)},this)).on("keydown.jstree",".jstree-anchor",a.proxy(function(a){if(a.target.tagName&&"input"===a.target.tagName.toLowerCase())return!0;this._data.core.rtl&&(37===a.which?a.which=39:39===a.which&&(a.which=37));var b=this._kbevent_to_func(a);if(b){var c=b.call(this,a);if(c===!1||c===!0)return c}},this)).on("load_node.jstree",a.proxy(function(b,c){c.status&&(c.node.id!==a.jstree.root||this._data.core.loaded||(this._data.core.loaded=!0,this._firstChild(this.get_container_ul()[0])&&this.element.attr("aria-activedescendant",this._firstChild(this.get_container_ul()[0]).id),this.trigger("loaded")),this._data.core.ready||setTimeout(a.proxy(function(){if(this.element&&!this.get_container_ul().find(".jstree-loading").length){if(this._data.core.ready=!0,this._data.core.selected.length){if(this.settings.core.expand_selected_onload){var b=[],c,d;for(c=0,d=this._data.core.selected.length;d>c;c++)b=b.concat(this._model.data[this._data.core.selected[c]].parents);for(b=a.vakata.array_unique(b),c=0,d=b.length;d>c;c++)this.open_node(b[c],!1,0)}this.trigger("changed",{action:"ready",selected:this._data.core.selected})}this.trigger("ready")}},this),0))},this)).on("keypress.jstree",a.proxy(function(d){if(d.target.tagName&&"input"===d.target.tagName.toLowerCase())return!0;c&&clearTimeout(c),c=setTimeout(function(){b=""},500);var e=String.fromCharCode(d.which).toLowerCase(),f=this.element.find(".jstree-anchor").filter(":visible"),g=f.index(i.activeElement)||0,h=!1;if(b+=e,b.length>1){if(f.slice(g).each(a.proxy(function(c,d){return 0===a(d).text().toLowerCase().indexOf(b)?(a(d).focus(),h=!0,!1):void 0},this)),h)return;if(f.slice(0,g).each(a.proxy(function(c,d){return 0===a(d).text().toLowerCase().indexOf(b)?(a(d).focus(),h=!0,!1):void 0},this)),h)return}if(new RegExp("^"+e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")+"+$").test(b)){if(f.slice(g+1).each(a.proxy(function(b,c){return a(c).text().toLowerCase().charAt(0)===e?(a(c).focus(),h=!0,!1):void 0},this)),h)return;if(f.slice(0,g+1).each(a.proxy(function(b,c){return a(c).text().toLowerCase().charAt(0)===e?(a(c).focus(),h=!0,!1):void 0},this)),h)return}},this)).on("init.jstree",a.proxy(function(){var a=this.settings.core.themes;this._data.core.themes.dots=a.dots,this._data.core.themes.stripes=a.stripes,this._data.core.themes.icons=a.icons,this._data.core.themes.ellipsis=a.ellipsis,this.set_theme(a.name||"default",a.url),this.set_theme_variant(a.variant)},this)).on("loading.jstree",a.proxy(function(){this[this._data.core.themes.dots?"show_dots":"hide_dots"](),this[this._data.core.themes.icons?"show_icons":"hide_icons"](),this[this._data.core.themes.stripes?"show_stripes":"hide_stripes"](),this[this._data.core.themes.ellipsis?"show_ellipsis":"hide_ellipsis"]()},this)).on("blur.jstree",".jstree-anchor",a.proxy(function(b){this._data.core.focused=null,a(b.currentTarget).filter(".jstree-hovered").mouseleave(),this.element.attr("tabindex","0")},this)).on("focus.jstree",".jstree-anchor",a.proxy(function(b){var c=this.get_node(b.currentTarget);c&&c.id&&(this._data.core.focused=c.id),this.element.find(".jstree-hovered").not(b.currentTarget).mouseleave(),a(b.currentTarget).mouseenter(),this.element.attr("tabindex","-1")},this)).on("focus.jstree",a.proxy(function(){if(+new Date-d>500&&!this._data.core.focused&&this.settings.core.restore_focus){d=0;var a=this.get_node(this.element.attr("aria-activedescendant"),!0);a&&a.find("> .jstree-anchor").focus()}},this)).on("mouseenter.jstree",".jstree-anchor",a.proxy(function(a){this.hover_node(a.currentTarget)},this)).on("mouseleave.jstree",".jstree-anchor",a.proxy(function(a){this.dehover_node(a.currentTarget)},this))},unbind:function(){this.element.off(".jstree"),a(i).off(".jstree-"+this._id)},trigger:function(a,b){b||(b={}),b.instance=this,this.element.triggerHandler(a.replace(".jstree","")+".jstree",b)},get_container:function(){return this.element},get_container_ul:function(){return this.element.children(".jstree-children").first()},get_string:function(b){var c=this.settings.core.strings;return a.isFunction(c)?c.call(this,b):c&&c[b]?c[b]:b},_firstChild:function(a){a=a?a.firstChild:null;while(null!==a&&1!==a.nodeType)a=a.nextSibling;return a},_nextSibling:function(a){a=a?a.nextSibling:null;while(null!==a&&1!==a.nodeType)a=a.nextSibling;return a},_previousSibling:function(a){a=a?a.previousSibling:null;while(null!==a&&1!==a.nodeType)a=a.previousSibling;return a},get_node:function(b,c){b&&b.id&&(b=b.id),b instanceof jQuery&&b.length&&b[0].id&&(b=b[0].id);var d;try{if(this._model.data[b])b=this._model.data[b];else if("string"==typeof b&&this._model.data[b.replace(/^#/,"")])b=this._model.data[b.replace(/^#/,"")];else if("string"==typeof b&&(d=a("#"+b.replace(a.jstree.idregex,"\\$&"),this.element)).length&&this._model.data[d.closest(".jstree-node").attr("id")])b=this._model.data[d.closest(".jstree-node").attr("id")];else if((d=this.element.find(b)).length&&this._model.data[d.closest(".jstree-node").attr("id")])b=this._model.data[d.closest(".jstree-node").attr("id")];else{if(!(d=this.element.find(b)).length||!d.hasClass("jstree"))return!1;b=this._model.data[a.jstree.root]}return c&&(b=b.id===a.jstree.root?this.element:a("#"+b.id.replace(a.jstree.idregex,"\\$&"),this.element)),b}catch(e){return!1}},get_path:function(b,c,d){if(b=b.parents?b:this.get_node(b),!b||b.id===a.jstree.root||!b.parents)return!1;var e,f,g=[];for(g.push(d?b.id:b.text),e=0,f=b.parents.length;f>e;e++)g.push(d?b.parents[e]:this.get_text(b.parents[e]));return g=g.reverse().slice(1),c?g.join(c):g},get_next_dom:function(b,c){var d;if(b=this.get_node(b,!0),b[0]===this.element[0]){d=this._firstChild(this.get_container_ul()[0]);while(d&&0===d.offsetHeight)d=this._nextSibling(d);return d?a(d):!1}if(!b||!b.length)return!1;if(c){d=b[0];do d=this._nextSibling(d);while(d&&0===d.offsetHeight);return d?a(d):!1}if(b.hasClass("jstree-open")){d=this._firstChild(b.children(".jstree-children")[0]);while(d&&0===d.offsetHeight)d=this._nextSibling(d);if(null!==d)return a(d)}d=b[0];do d=this._nextSibling(d);while(d&&0===d.offsetHeight);return null!==d?a(d):b.parentsUntil(".jstree",".jstree-node").nextAll(".jstree-node:visible").first()},get_prev_dom:function(b,c){var d;if(b=this.get_node(b,!0),b[0]===this.element[0]){d=this.get_container_ul()[0].lastChild;while(d&&0===d.offsetHeight)d=this._previousSibling(d);return d?a(d):!1}if(!b||!b.length)return!1;if(c){d=b[0];do d=this._previousSibling(d);while(d&&0===d.offsetHeight);return d?a(d):!1}d=b[0];do d=this._previousSibling(d);while(d&&0===d.offsetHeight);if(null!==d){b=a(d);while(b.hasClass("jstree-open"))b=b.children(".jstree-children").first().children(".jstree-node:visible:last");return b}return d=b[0].parentNode.parentNode,d&&d.className&&-1!==d.className.indexOf("jstree-node")?a(d):!1},get_parent:function(b){return b=this.get_node(b),b&&b.id!==a.jstree.root?b.parent:!1},get_children_dom:function(a){return a=this.get_node(a,!0),a[0]===this.element[0]?this.get_container_ul().children(".jstree-node"):a&&a.length?a.children(".jstree-children").children(".jstree-node"):!1},is_parent:function(a){return a=this.get_node(a),a&&(a.state.loaded===!1||a.children.length>0)},is_loaded:function(a){return a=this.get_node(a),a&&a.state.loaded},is_loading:function(a){return a=this.get_node(a),a&&a.state&&a.state.loading},is_open:function(a){return a=this.get_node(a),a&&a.state.opened},is_closed:function(a){return a=this.get_node(a),a&&this.is_parent(a)&&!a.state.opened},is_leaf:function(a){return!this.is_parent(a)},load_node:function(b,c){var d,e,f,g,h;if(a.isArray(b))return this._load_nodes(b.slice(),c),!0;if(b=this.get_node(b),!b)return c&&c.call(this,b,!1),!1;if(b.state.loaded){for(b.state.loaded=!1,f=0,g=b.parents.length;g>f;f++)this._model.data[b.parents[f]].children_d=a.vakata.array_filter(this._model.data[b.parents[f]].children_d,function(c){return-1===a.inArray(c,b.children_d)});for(d=0,e=b.children_d.length;e>d;d++)this._model.data[b.children_d[d]].state.selected&&(h=!0),delete this._model.data[b.children_d[d]];h&&(this._data.core.selected=a.vakata.array_filter(this._data.core.selected,function(c){return-1===a.inArray(c,b.children_d)})),b.children=[],b.children_d=[],h&&this.trigger("changed",{action:"load_node",node:b,selected:this._data.core.selected})}return b.state.failed=!1,b.state.loading=!0,this.get_node(b,!0).addClass("jstree-loading").attr("aria-busy",!0),this._load_node(b,a.proxy(function(a){b=this._model.data[b.id],b.state.loading=!1,b.state.loaded=a,b.state.failed=!b.state.loaded;var d=this.get_node(b,!0),e=0,f=0,g=this._model.data,h=!1;for(e=0,f=b.children.length;f>e;e++)if(g[b.children[e]]&&!g[b.children[e]].state.hidden){h=!0;break}b.state.loaded&&d&&d.length&&(d.removeClass("jstree-closed jstree-open jstree-leaf"),h?"#"!==b.id&&d.addClass(b.state.opened?"jstree-open":"jstree-closed"):d.addClass("jstree-leaf")),d.removeClass("jstree-loading").attr("aria-busy",!1),this.trigger("load_node",{node:b,status:a}),c&&c.call(this,b,a)},this)),!0},_load_nodes:function(a,b,c,d){var e=!0,f=function(){this._load_nodes(a,b,!0)},g=this._model.data,h,i,j=[];for(h=0,i=a.length;i>h;h++)g[a[h]]&&(!g[a[h]].state.loaded&&!g[a[h]].state.failed||!c&&d)&&(this.is_loading(a[h])||this.load_node(a[h],f),e=!1);if(e){for(h=0,i=a.length;i>h;h++)g[a[h]]&&g[a[h]].state.loaded&&j.push(a[h]);b&&!b.done&&(b.call(this,j),b.done=!0)}},load_all:function(b,c){if(b||(b=a.jstree.root),b=this.get_node(b),!b)return!1;var d=[],e=this._model.data,f=e[b.id].children_d,g,h;for(b.state&&!b.state.loaded&&d.push(b.id),g=0,h=f.length;h>g;g++)e[f[g]]&&e[f[g]].state&&!e[f[g]].state.loaded&&d.push(f[g]);d.length?this._load_nodes(d,function(){this.load_all(b,c)}):(c&&c.call(this,b),this.trigger("load_all",{node:b}))},_load_node:function(b,c){var d=this.settings.core.data,e,f=function g(){return 3!==this.nodeType&&8!==this.nodeType};return d?a.isFunction(d)?d.call(this,b,a.proxy(function(d){d===!1?c.call(this,!1):this["string"==typeof d?"_append_html_data":"_append_json_data"](b,"string"==typeof d?a(a.parseHTML(d)).filter(f):d,function(a){c.call(this,a)})},this)):"object"==typeof d?d.url?(d=a.extend(!0,{},d),a.isFunction(d.url)&&(d.url=d.url.call(this,b)),a.isFunction(d.data)&&(d.data=d.data.call(this,b)),a.ajax(d).done(a.proxy(function(d,e,g){var h=g.getResponseHeader("Content-Type");return h&&-1!==h.indexOf("json")||"object"==typeof d?this._append_json_data(b,d,function(a){c.call(this,a)}):h&&-1!==h.indexOf("html")||"string"==typeof d?this._append_html_data(b,a(a.parseHTML(d)).filter(f),function(a){c.call(this,a)}):(this._data.core.last_error={error:"ajax",plugin:"core",id:"core_04",reason:"Could not load node",data:JSON.stringify({id:b.id,xhr:g})},this.settings.core.error.call(this,this._data.core.last_error),c.call(this,!1))},this)).fail(a.proxy(function(a){this._data.core.last_error={error:"ajax",plugin:"core",id:"core_04",reason:"Could not load node",data:JSON.stringify({id:b.id,xhr:a})},c.call(this,!1),this.settings.core.error.call(this,this._data.core.last_error)},this))):(e=a.isArray(d)?a.extend(!0,[],d):a.isPlainObject(d)?a.extend(!0,{},d):d,b.id===a.jstree.root?this._append_json_data(b,e,function(a){c.call(this,a)}):(this._data.core.last_error={error:"nodata",plugin:"core",id:"core_05",reason:"Could not load node",data:JSON.stringify({id:b.id})},this.settings.core.error.call(this,this._data.core.last_error),c.call(this,!1))):"string"==typeof d?b.id===a.jstree.root?this._append_html_data(b,a(a.parseHTML(d)).filter(f),function(a){c.call(this,a)}):(this._data.core.last_error={error:"nodata",plugin:"core",id:"core_06",reason:"Could not load node",data:JSON.stringify({id:b.id})},this.settings.core.error.call(this,this._data.core.last_error),c.call(this,!1)):c.call(this,!1):b.id===a.jstree.root?this._append_html_data(b,this._data.core.original_container_html.clone(!0),function(a){c.call(this,a)}):c.call(this,!1)},_node_changed:function(b){b=this.get_node(b),b&&-1===a.inArray(b.id,this._model.changed)&&this._model.changed.push(b.id)},_append_html_data:function(b,c,d){b=this.get_node(b),b.children=[],b.children_d=[];var e=c.is("ul")?c.children():c,f=b.id,g=[],h=[],i=this._model.data,j=i[f],k=this._data.core.selected.length,l,m,n;for(e.each(a.proxy(function(b,c){l=this._parse_model_from_html(a(c),f,j.parents.concat()),l&&(g.push(l),h.push(l),i[l].children_d.length&&(h=h.concat(i[l].children_d)))},this)),j.children=g,j.children_d=h,m=0,n=j.parents.length;n>m;m++)i[j.parents[m]].children_d=i[j.parents[m]].children_d.concat(h);this.trigger("model",{nodes:h,parent:f}),f!==a.jstree.root?(this._node_changed(f),this.redraw()):(this.get_container_ul().children(".jstree-initial-node").remove(),this.redraw(!0)),this._data.core.selected.length!==k&&this.trigger("changed",{action:"model",selected:this._data.core.selected}),d.call(this,!0)},_append_json_data:function(b,c,d,e){if(null!==this.element){b=this.get_node(b),b.children=[],b.children_d=[],c.d&&(c=c.d,"string"==typeof c&&(c=JSON.parse(c))),a.isArray(c)||(c=[c]);var f=null,g={df:this._model.default_state,dat:c,par:b.id,m:this._model.data,t_id:this._id,t_cnt:this._cnt,sel:this._data.core.selected},h=function(a,b){a.data&&(a=a.data);var c=a.dat,d=a.par,e=[],f=[],g=[],h=a.df,i=a.t_id,j=a.t_cnt,k=a.m,l=k[d],m=a.sel,n,o,p,q,r=function(a,c,d){d=d?d.concat():[],c&&d.unshift(c);var e=a.id.toString(),f,i,j,l,m={id:e,text:a.text||"",icon:a.icon!==b?a.icon:!0,parent:c,parents:d,children:a.children||[],children_d:a.children_d||[],data:a.data,state:{},li_attr:{id:!1},a_attr:{href:"#"},original:!1};for(f in h)h.hasOwnProperty(f)&&(m.state[f]=h[f]);if(a&&a.data&&a.data.jstree&&a.data.jstree.icon&&(m.icon=a.data.jstree.icon),(m.icon===b||null===m.icon||""===m.icon)&&(m.icon=!0),a&&a.data&&(m.data=a.data,a.data.jstree))for(f in a.data.jstree)a.data.jstree.hasOwnProperty(f)&&(m.state[f]=a.data.jstree[f]);if(a&&"object"==typeof a.state)for(f in a.state)a.state.hasOwnProperty(f)&&(m.state[f]=a.state[f]);if(a&&"object"==typeof a.li_attr)for(f in a.li_attr)a.li_attr.hasOwnProperty(f)&&(m.li_attr[f]=a.li_attr[f]);if(m.li_attr.id||(m.li_attr.id=e),a&&"object"==typeof a.a_attr)for(f in a.a_attr)a.a_attr.hasOwnProperty(f)&&(m.a_attr[f]=a.a_attr[f]);for(a&&a.children&&a.children===!0&&(m.state.loaded=!1,m.children=[],m.children_d=[]),k[m.id]=m,f=0,i=m.children.length;i>f;f++)j=r(k[m.children[f]],m.id,d),l=k[j],m.children_d.push(j),l.children_d.length&&(m.children_d=m.children_d.concat(l.children_d));return delete a.data,delete a.children,k[m.id].original=a,m.state.selected&&g.push(m.id),m.id},s=function(a,c,d){d=d?d.concat():[],c&&d.unshift(c);var e=!1,f,l,m,n,o;do e="j"+i+"_"+ ++j;while(k[e]);o={id:!1,text:"string"==typeof a?a:"",icon:"object"==typeof a&&a.icon!==b?a.icon:!0,parent:c,parents:d,children:[],children_d:[],data:null,state:{},li_attr:{id:!1},a_attr:{href:"#"},original:!1};for(f in h)h.hasOwnProperty(f)&&(o.state[f]=h[f]);if(a&&a.id&&(o.id=a.id.toString()),a&&a.text&&(o.text=a.text),a&&a.data&&a.data.jstree&&a.data.jstree.icon&&(o.icon=a.data.jstree.icon),(o.icon===b||null===o.icon||""===o.icon)&&(o.icon=!0),a&&a.data&&(o.data=a.data,a.data.jstree))for(f in a.data.jstree)a.data.jstree.hasOwnProperty(f)&&(o.state[f]=a.data.jstree[f]);if(a&&"object"==typeof a.state)for(f in a.state)a.state.hasOwnProperty(f)&&(o.state[f]=a.state[f]);if(a&&"object"==typeof a.li_attr)for(f in a.li_attr)a.li_attr.hasOwnProperty(f)&&(o.li_attr[f]=a.li_attr[f]);if(o.li_attr.id&&!o.id&&(o.id=o.li_attr.id.toString()),o.id||(o.id=e),o.li_attr.id||(o.li_attr.id=o.id),a&&"object"==typeof a.a_attr)for(f in a.a_attr)a.a_attr.hasOwnProperty(f)&&(o.a_attr[f]=a.a_attr[f]);if(a&&a.children&&a.children.length){for(f=0,l=a.children.length;l>f;f++)m=s(a.children[f],o.id,d),n=k[m],o.children.push(m),n.children_d.length&&(o.children_d=o.children_d.concat(n.children_d));o.children_d=o.children_d.concat(o.children)}return a&&a.children&&a.children===!0&&(o.state.loaded=!1,o.children=[],o.children_d=[]),delete a.data,delete a.children,o.original=a,k[o.id]=o,o.state.selected&&g.push(o.id),o.id};if(c.length&&c[0].id!==b&&c[0].parent!==b){for(o=0,p=c.length;p>o;o++)c[o].children||(c[o].children=[]),c[o].state||(c[o].state={}),k[c[o].id.toString()]=c[o];for(o=0,p=c.length;p>o;o++)k[c[o].parent.toString()]?(k[c[o].parent.toString()].children.push(c[o].id.toString()),l.children_d.push(c[o].id.toString())):(this._data.core.last_error={error:"parse",plugin:"core",id:"core_07",reason:"Node with invalid parent",data:JSON.stringify({id:c[o].id.toString(),parent:c[o].parent.toString()})},this.settings.core.error.call(this,this._data.core.last_error));for(o=0,p=l.children.length;p>o;o++)n=r(k[l.children[o]],d,l.parents.concat()),f.push(n),k[n].children_d.length&&(f=f.concat(k[n].children_d));for(o=0,p=l.parents.length;p>o;o++)k[l.parents[o]].children_d=k[l.parents[o]].children_d.concat(f);q={cnt:j,mod:k,sel:m,par:d,dpc:f,add:g}}else{for(o=0,p=c.length;p>o;o++)n=s(c[o],d,l.parents.concat()),n&&(e.push(n),f.push(n),k[n].children_d.length&&(f=f.concat(k[n].children_d)));for(l.children=e,l.children_d=f,o=0,p=l.parents.length;p>o;o++)k[l.parents[o]].children_d=k[l.parents[o]].children_d.concat(f);q={cnt:j,mod:k,sel:m,par:d,dpc:f,add:g}}return"undefined"!=typeof window&&"undefined"!=typeof window.document?q:void postMessage(q)},i=function(b,c){if(null!==this.element){this._cnt=b.cnt;var e,f=this._model.data;for(e in f)f.hasOwnProperty(e)&&f[e].state&&f[e].state.loading&&b.mod[e]&&(b.mod[e].state.loading=!0);if(this._model.data=b.mod,c){var g,h=b.add,i=b.sel,j=this._data.core.selected.slice();if(f=this._model.data,i.length!==j.length||a.vakata.array_unique(i.concat(j)).length!==i.length){for(e=0,g=i.length;g>e;e++)-1===a.inArray(i[e],h)&&-1===a.inArray(i[e],j)&&(f[i[e]].state.selected=!1);for(e=0,g=j.length;g>e;e++)-1===a.inArray(j[e],i)&&(f[j[e]].state.selected=!0)}}b.add.length&&(this._data.core.selected=this._data.core.selected.concat(b.add)),this.trigger("model",{nodes:b.dpc,parent:b.par}),b.par!==a.jstree.root?(this._node_changed(b.par),this.redraw()):this.redraw(!0),b.add.length&&this.trigger("changed",{action:"model",selected:this._data.core.selected}),d.call(this,!0)}};if(this.settings.core.worker&&window.Blob&&window.URL&&window.Worker)try{null===this._wrk&&(this._wrk=window.URL.createObjectURL(new window.Blob(["self.onmessage = "+h.toString()],{type:"text/javascript"}))),!this._data.core.working||e?(this._data.core.working=!0,f=new window.Worker(this._wrk),f.onmessage=a.proxy(function(a){i.call(this,a.data,!0);try{f.terminate(),f=null}catch(b){}this._data.core.worker_queue.length?this._append_json_data.apply(this,this._data.core.worker_queue.shift()):this._data.core.working=!1},this),g.par?f.postMessage(g):this._data.core.worker_queue.length?this._append_json_data.apply(this,this._data.core.worker_queue.shift()):this._data.core.working=!1):this._data.core.worker_queue.push([b,c,d,!0])}catch(j){i.call(this,h(g),!1),this._data.core.worker_queue.length?this._append_json_data.apply(this,this._data.core.worker_queue.shift()):this._data.core.working=!1}else i.call(this,h(g),!1)}},_parse_model_from_html:function(c,d,e){e=e?[].concat(e):[],d&&e.unshift(d);var f,g,h=this._model.data,i={id:!1,text:!1,icon:!0,parent:d,parents:e,children:[],children_d:[],data:null,state:{},li_attr:{id:!1},a_attr:{href:"#"},original:!1},j,k,l;for(j in this._model.default_state)this._model.default_state.hasOwnProperty(j)&&(i.state[j]=this._model.default_state[j]);if(k=a.vakata.attributes(c,!0),a.each(k,function(b,c){return c=a.trim(c),c.length?(i.li_attr[b]=c,void("id"===b&&(i.id=c.toString()))):!0}),k=c.children("a").first(),k.length&&(k=a.vakata.attributes(k,!0),a.each(k,function(b,c){c=a.trim(c),c.length&&(i.a_attr[b]=c)})),k=c.children("a").first().length?c.children("a").first().clone():c.clone(),k.children("ins, i, ul").remove(),k=k.html(),k=a("<div />").html(k),i.text=this.settings.core.force_text?k.text():k.html(),k=c.data(),i.data=k?a.extend(!0,{},k):null,i.state.opened=c.hasClass("jstree-open"),i.state.selected=c.children("a").hasClass("jstree-clicked"),i.state.disabled=c.children("a").hasClass("jstree-disabled"),i.data&&i.data.jstree)for(j in i.data.jstree)i.data.jstree.hasOwnProperty(j)&&(i.state[j]=i.data.jstree[j]);k=c.children("a").children(".jstree-themeicon"),k.length&&(i.icon=k.hasClass("jstree-themeicon-hidden")?!1:k.attr("rel")),i.state.icon!==b&&(i.icon=i.state.icon),(i.icon===b||null===i.icon||""===i.icon)&&(i.icon=!0),k=c.children("ul").children("li");do l="j"+this._id+"_"+ ++this._cnt;while(h[l]);return i.id=i.li_attr.id?i.li_attr.id.toString():l,k.length?(k.each(a.proxy(function(b,c){f=this._parse_model_from_html(a(c),i.id,e),g=this._model.data[f],i.children.push(f),g.children_d.length&&(i.children_d=i.children_d.concat(g.children_d))},this)),i.children_d=i.children_d.concat(i.children)):c.hasClass("jstree-closed")&&(i.state.loaded=!1),i.li_attr["class"]&&(i.li_attr["class"]=i.li_attr["class"].replace("jstree-closed","").replace("jstree-open","")),i.a_attr["class"]&&(i.a_attr["class"]=i.a_attr["class"].replace("jstree-clicked","").replace("jstree-disabled","")),h[i.id]=i,i.state.selected&&this._data.core.selected.push(i.id),i.id},_parse_model_from_flat_json:function(a,c,d){d=d?d.concat():[],c&&d.unshift(c);var e=a.id.toString(),f=this._model.data,g=this._model.default_state,h,i,j,k,l={id:e,text:a.text||"",icon:a.icon!==b?a.icon:!0,parent:c,parents:d,children:a.children||[],children_d:a.children_d||[],data:a.data,state:{},li_attr:{id:!1},a_attr:{href:"#"},original:!1};for(h in g)g.hasOwnProperty(h)&&(l.state[h]=g[h]);if(a&&a.data&&a.data.jstree&&a.data.jstree.icon&&(l.icon=a.data.jstree.icon),(l.icon===b||null===l.icon||""===l.icon)&&(l.icon=!0),a&&a.data&&(l.data=a.data,a.data.jstree))for(h in a.data.jstree)a.data.jstree.hasOwnProperty(h)&&(l.state[h]=a.data.jstree[h]);if(a&&"object"==typeof a.state)for(h in a.state)a.state.hasOwnProperty(h)&&(l.state[h]=a.state[h]);if(a&&"object"==typeof a.li_attr)for(h in a.li_attr)a.li_attr.hasOwnProperty(h)&&(l.li_attr[h]=a.li_attr[h]);if(l.li_attr.id||(l.li_attr.id=e),a&&"object"==typeof a.a_attr)for(h in a.a_attr)a.a_attr.hasOwnProperty(h)&&(l.a_attr[h]=a.a_attr[h]);for(a&&a.children&&a.children===!0&&(l.state.loaded=!1,l.children=[],l.children_d=[]),f[l.id]=l,h=0,i=l.children.length;i>h;h++)j=this._parse_model_from_flat_json(f[l.children[h]],l.id,d),k=f[j],l.children_d.push(j),k.children_d.length&&(l.children_d=l.children_d.concat(k.children_d));return delete a.data,delete a.children,f[l.id].original=a,l.state.selected&&this._data.core.selected.push(l.id),l.id},_parse_model_from_json:function(a,c,d){d=d?d.concat():[],c&&d.unshift(c);var e=!1,f,g,h,i,j=this._model.data,k=this._model.default_state,l;do e="j"+this._id+"_"+ ++this._cnt;while(j[e]);l={id:!1,text:"string"==typeof a?a:"",icon:"object"==typeof a&&a.icon!==b?a.icon:!0,parent:c,parents:d,children:[],children_d:[],data:null,state:{},li_attr:{id:!1},a_attr:{href:"#"},original:!1};for(f in k)k.hasOwnProperty(f)&&(l.state[f]=k[f]);if(a&&a.id&&(l.id=a.id.toString()),a&&a.text&&(l.text=a.text),a&&a.data&&a.data.jstree&&a.data.jstree.icon&&(l.icon=a.data.jstree.icon),(l.icon===b||null===l.icon||""===l.icon)&&(l.icon=!0),a&&a.data&&(l.data=a.data,a.data.jstree))for(f in a.data.jstree)a.data.jstree.hasOwnProperty(f)&&(l.state[f]=a.data.jstree[f]);if(a&&"object"==typeof a.state)for(f in a.state)a.state.hasOwnProperty(f)&&(l.state[f]=a.state[f]);if(a&&"object"==typeof a.li_attr)for(f in a.li_attr)a.li_attr.hasOwnProperty(f)&&(l.li_attr[f]=a.li_attr[f]);if(l.li_attr.id&&!l.id&&(l.id=l.li_attr.id.toString()),
l.id||(l.id=e),l.li_attr.id||(l.li_attr.id=l.id),a&&"object"==typeof a.a_attr)for(f in a.a_attr)a.a_attr.hasOwnProperty(f)&&(l.a_attr[f]=a.a_attr[f]);if(a&&a.children&&a.children.length){for(f=0,g=a.children.length;g>f;f++)h=this._parse_model_from_json(a.children[f],l.id,d),i=j[h],l.children.push(h),i.children_d.length&&(l.children_d=l.children_d.concat(i.children_d));l.children_d=l.children_d.concat(l.children)}return a&&a.children&&a.children===!0&&(l.state.loaded=!1,l.children=[],l.children_d=[]),delete a.data,delete a.children,l.original=a,j[l.id]=l,l.state.selected&&this._data.core.selected.push(l.id),l.id},_redraw:function(){var b=this._model.force_full_redraw?this._model.data[a.jstree.root].children.concat([]):this._model.changed.concat([]),c=i.createElement("UL"),d,e,f,g=this._data.core.focused;for(e=0,f=b.length;f>e;e++)d=this.redraw_node(b[e],!0,this._model.force_full_redraw),d&&this._model.force_full_redraw&&c.appendChild(d);this._model.force_full_redraw&&(c.className=this.get_container_ul()[0].className,c.setAttribute("role","group"),this.element.empty().append(c)),null!==g&&this.settings.core.restore_focus&&(d=this.get_node(g,!0),d&&d.length&&d.children(".jstree-anchor")[0]!==i.activeElement?d.children(".jstree-anchor").focus():this._data.core.focused=null),this._model.force_full_redraw=!1,this._model.changed=[],this.trigger("redraw",{nodes:b})},redraw:function(a){a&&(this._model.force_full_redraw=!0),this._redraw()},draw_children:function(b){var c=this.get_node(b),d=!1,e=!1,f=!1,g=i;if(!c)return!1;if(c.id===a.jstree.root)return this.redraw(!0);if(b=this.get_node(b,!0),!b||!b.length)return!1;if(b.children(".jstree-children").remove(),b=b[0],c.children.length&&c.state.loaded){for(f=g.createElement("UL"),f.setAttribute("role","group"),f.className="jstree-children",d=0,e=c.children.length;e>d;d++)f.appendChild(this.redraw_node(c.children[d],!0,!0));b.appendChild(f)}},redraw_node:function(b,c,d,e){var f=this.get_node(b),g=!1,h=!1,j=!1,k=!1,l=!1,m=!1,n="",o=i,p=this._model.data,q=!1,r=!1,s=null,t=0,u=0,v=!1,w=!1;if(!f)return!1;if(f.id===a.jstree.root)return this.redraw(!0);if(c=c||0===f.children.length,b=i.querySelector?this.element[0].querySelector("#"+(-1!=="0123456789".indexOf(f.id[0])?"\\3"+f.id[0]+" "+f.id.substr(1).replace(a.jstree.idregex,"\\$&"):f.id.replace(a.jstree.idregex,"\\$&"))):i.getElementById(f.id))b=a(b),d||(g=b.parent().parent()[0],g===this.element[0]&&(g=null),h=b.index()),c||!f.children.length||b.children(".jstree-children").length||(c=!0),c||(j=b.children(".jstree-children")[0]),q=b.children(".jstree-anchor")[0]===i.activeElement,b.remove();else if(c=!0,!d){if(g=f.parent!==a.jstree.root?a("#"+f.parent.replace(a.jstree.idregex,"\\$&"),this.element)[0]:null,!(null===g||g&&p[f.parent].state.opened))return!1;h=a.inArray(f.id,null===g?p[a.jstree.root].children:p[f.parent].children)}b=this._data.core.node.cloneNode(!0),n="jstree-node ";for(k in f.li_attr)if(f.li_attr.hasOwnProperty(k)){if("id"===k)continue;"class"!==k?b.setAttribute(k,f.li_attr[k]):n+=f.li_attr[k]}for(f.a_attr.id||(f.a_attr.id=f.id+"_anchor"),b.setAttribute("aria-selected",!!f.state.selected),b.setAttribute("aria-level",f.parents.length),b.setAttribute("aria-labelledby",f.a_attr.id),f.state.disabled&&b.setAttribute("aria-disabled",!0),k=0,l=f.children.length;l>k;k++)if(!p[f.children[k]].state.hidden){v=!0;break}if(null!==f.parent&&p[f.parent]&&!f.state.hidden&&(k=a.inArray(f.id,p[f.parent].children),w=f.id,-1!==k))for(k++,l=p[f.parent].children.length;l>k;k++)if(p[p[f.parent].children[k]].state.hidden||(w=p[f.parent].children[k]),w!==f.id)break;f.state.hidden&&(n+=" jstree-hidden"),f.state.loading&&(n+=" jstree-loading"),f.state.loaded&&!v?n+=" jstree-leaf":(n+=f.state.opened&&f.state.loaded?" jstree-open":" jstree-closed",b.setAttribute("aria-expanded",f.state.opened&&f.state.loaded)),w===f.id&&(n+=" jstree-last"),b.id=f.id,b.className=n,n=(f.state.selected?" jstree-clicked":"")+(f.state.disabled?" jstree-disabled":"");for(l in f.a_attr)if(f.a_attr.hasOwnProperty(l)){if("href"===l&&"#"===f.a_attr[l])continue;"class"!==l?b.childNodes[1].setAttribute(l,f.a_attr[l]):n+=" "+f.a_attr[l]}if(n.length&&(b.childNodes[1].className="jstree-anchor "+n),(f.icon&&f.icon!==!0||f.icon===!1)&&(f.icon===!1?b.childNodes[1].childNodes[0].className+=" jstree-themeicon-hidden":-1===f.icon.indexOf("/")&&-1===f.icon.indexOf(".")?b.childNodes[1].childNodes[0].className+=" "+f.icon+" jstree-themeicon-custom":(b.childNodes[1].childNodes[0].style.backgroundImage='url("'+f.icon+'")',b.childNodes[1].childNodes[0].style.backgroundPosition="center center",b.childNodes[1].childNodes[0].style.backgroundSize="auto",b.childNodes[1].childNodes[0].className+=" jstree-themeicon-custom")),this.settings.core.force_text?b.childNodes[1].appendChild(o.createTextNode(f.text)):b.childNodes[1].innerHTML+=f.text,c&&f.children.length&&(f.state.opened||e)&&f.state.loaded){for(m=o.createElement("UL"),m.setAttribute("role","group"),m.className="jstree-children",k=0,l=f.children.length;l>k;k++)m.appendChild(this.redraw_node(f.children[k],c,!0));b.appendChild(m)}if(j&&b.appendChild(j),!d){for(g||(g=this.element[0]),k=0,l=g.childNodes.length;l>k;k++)if(g.childNodes[k]&&g.childNodes[k].className&&-1!==g.childNodes[k].className.indexOf("jstree-children")){s=g.childNodes[k];break}s||(s=o.createElement("UL"),s.setAttribute("role","group"),s.className="jstree-children",g.appendChild(s)),g=s,h<g.childNodes.length?g.insertBefore(b,g.childNodes[h]):g.appendChild(b),q&&(t=this.element[0].scrollTop,u=this.element[0].scrollLeft,b.childNodes[1].focus(),this.element[0].scrollTop=t,this.element[0].scrollLeft=u)}return f.state.opened&&!f.state.loaded&&(f.state.opened=!1,setTimeout(a.proxy(function(){this.open_node(f.id,!1,0)},this),0)),b},open_node:function(c,d,e){var f,g,h,i;if(a.isArray(c)){for(c=c.slice(),f=0,g=c.length;g>f;f++)this.open_node(c[f],d,e);return!0}return c=this.get_node(c),c&&c.id!==a.jstree.root?(e=e===b?this.settings.core.animation:e,this.is_closed(c)?this.is_loaded(c)?(h=this.get_node(c,!0),i=this,h.length&&(e&&h.children(".jstree-children").length&&h.children(".jstree-children").stop(!0,!0),c.children.length&&!this._firstChild(h.children(".jstree-children")[0])&&this.draw_children(c),e?(this.trigger("before_open",{node:c}),h.children(".jstree-children").css("display","none").end().removeClass("jstree-closed").addClass("jstree-open").attr("aria-expanded",!0).children(".jstree-children").stop(!0,!0).slideDown(e,function(){this.style.display="",i.element&&i.trigger("after_open",{node:c})})):(this.trigger("before_open",{node:c}),h[0].className=h[0].className.replace("jstree-closed","jstree-open"),h[0].setAttribute("aria-expanded",!0))),c.state.opened=!0,d&&d.call(this,c,!0),h.length||this.trigger("before_open",{node:c}),this.trigger("open_node",{node:c}),e&&h.length||this.trigger("after_open",{node:c}),!0):this.is_loading(c)?setTimeout(a.proxy(function(){this.open_node(c,d,e)},this),500):void this.load_node(c,function(a,b){return b?this.open_node(a,d,e):d?d.call(this,a,!1):!1}):(d&&d.call(this,c,!1),!1)):!1},_open_to:function(b){if(b=this.get_node(b),!b||b.id===a.jstree.root)return!1;var c,d,e=b.parents;for(c=0,d=e.length;d>c;c+=1)c!==a.jstree.root&&this.open_node(e[c],!1,0);return a("#"+b.id.replace(a.jstree.idregex,"\\$&"),this.element)},close_node:function(c,d){var e,f,g,h;if(a.isArray(c)){for(c=c.slice(),e=0,f=c.length;f>e;e++)this.close_node(c[e],d);return!0}return c=this.get_node(c),c&&c.id!==a.jstree.root?this.is_closed(c)?!1:(d=d===b?this.settings.core.animation:d,g=this,h=this.get_node(c,!0),c.state.opened=!1,this.trigger("close_node",{node:c}),void(h.length?d?h.children(".jstree-children").attr("style","display:block !important").end().removeClass("jstree-open").addClass("jstree-closed").attr("aria-expanded",!1).children(".jstree-children").stop(!0,!0).slideUp(d,function(){this.style.display="",h.children(".jstree-children").remove(),g.element&&g.trigger("after_close",{node:c})}):(h[0].className=h[0].className.replace("jstree-open","jstree-closed"),h.attr("aria-expanded",!1).children(".jstree-children").remove(),this.trigger("after_close",{node:c})):this.trigger("after_close",{node:c}))):!1},toggle_node:function(b){var c,d;if(a.isArray(b)){for(b=b.slice(),c=0,d=b.length;d>c;c++)this.toggle_node(b[c]);return!0}return this.is_closed(b)?this.open_node(b):this.is_open(b)?this.close_node(b):void 0},open_all:function(b,c,d){if(b||(b=a.jstree.root),b=this.get_node(b),!b)return!1;var e=b.id===a.jstree.root?this.get_container_ul():this.get_node(b,!0),f,g,h;if(!e.length){for(f=0,g=b.children_d.length;g>f;f++)this.is_closed(this._model.data[b.children_d[f]])&&(this._model.data[b.children_d[f]].state.opened=!0);return this.trigger("open_all",{node:b})}d=d||e,h=this,e=this.is_closed(b)?e.find(".jstree-closed").addBack():e.find(".jstree-closed"),e.each(function(){h.open_node(this,function(a,b){b&&this.is_parent(a)&&this.open_all(a,c,d)},c||0)}),0===d.find(".jstree-closed").length&&this.trigger("open_all",{node:this.get_node(d)})},close_all:function(b,c){if(b||(b=a.jstree.root),b=this.get_node(b),!b)return!1;var d=b.id===a.jstree.root?this.get_container_ul():this.get_node(b,!0),e=this,f,g;for(d.length&&(d=this.is_open(b)?d.find(".jstree-open").addBack():d.find(".jstree-open"),a(d.get().reverse()).each(function(){e.close_node(this,c||0)})),f=0,g=b.children_d.length;g>f;f++)this._model.data[b.children_d[f]].state.opened=!1;this.trigger("close_all",{node:b})},is_disabled:function(a){return a=this.get_node(a),a&&a.state&&a.state.disabled},enable_node:function(b){var c,d;if(a.isArray(b)){for(b=b.slice(),c=0,d=b.length;d>c;c++)this.enable_node(b[c]);return!0}return b=this.get_node(b),b&&b.id!==a.jstree.root?(b.state.disabled=!1,this.get_node(b,!0).children(".jstree-anchor").removeClass("jstree-disabled").attr("aria-disabled",!1),void this.trigger("enable_node",{node:b})):!1},disable_node:function(b){var c,d;if(a.isArray(b)){for(b=b.slice(),c=0,d=b.length;d>c;c++)this.disable_node(b[c]);return!0}return b=this.get_node(b),b&&b.id!==a.jstree.root?(b.state.disabled=!0,this.get_node(b,!0).children(".jstree-anchor").addClass("jstree-disabled").attr("aria-disabled",!0),void this.trigger("disable_node",{node:b})):!1},is_hidden:function(a){return a=this.get_node(a),a.state.hidden===!0},hide_node:function(b,c){var d,e;if(a.isArray(b)){for(b=b.slice(),d=0,e=b.length;e>d;d++)this.hide_node(b[d],!0);return c||this.redraw(),!0}return b=this.get_node(b),b&&b.id!==a.jstree.root?void(b.state.hidden||(b.state.hidden=!0,this._node_changed(b.parent),c||this.redraw(),this.trigger("hide_node",{node:b}))):!1},show_node:function(b,c){var d,e;if(a.isArray(b)){for(b=b.slice(),d=0,e=b.length;e>d;d++)this.show_node(b[d],!0);return c||this.redraw(),!0}return b=this.get_node(b),b&&b.id!==a.jstree.root?void(b.state.hidden&&(b.state.hidden=!1,this._node_changed(b.parent),c||this.redraw(),this.trigger("show_node",{node:b}))):!1},hide_all:function(b){var c,d=this._model.data,e=[];for(c in d)d.hasOwnProperty(c)&&c!==a.jstree.root&&!d[c].state.hidden&&(d[c].state.hidden=!0,e.push(c));return this._model.force_full_redraw=!0,b||this.redraw(),this.trigger("hide_all",{nodes:e}),e},show_all:function(b){var c,d=this._model.data,e=[];for(c in d)d.hasOwnProperty(c)&&c!==a.jstree.root&&d[c].state.hidden&&(d[c].state.hidden=!1,e.push(c));return this._model.force_full_redraw=!0,b||this.redraw(),this.trigger("show_all",{nodes:e}),e},activate_node:function(a,c){if(this.is_disabled(a))return!1;if(c&&"object"==typeof c||(c={}),this._data.core.last_clicked=this._data.core.last_clicked&&this._data.core.last_clicked.id!==b?this.get_node(this._data.core.last_clicked.id):null,this._data.core.last_clicked&&!this._data.core.last_clicked.state.selected&&(this._data.core.last_clicked=null),!this._data.core.last_clicked&&this._data.core.selected.length&&(this._data.core.last_clicked=this.get_node(this._data.core.selected[this._data.core.selected.length-1])),this.settings.core.multiple&&(c.metaKey||c.ctrlKey||c.shiftKey)&&(!c.shiftKey||this._data.core.last_clicked&&this.get_parent(a)&&this.get_parent(a)===this._data.core.last_clicked.parent))if(c.shiftKey){var d=this.get_node(a).id,e=this._data.core.last_clicked.id,f=this.get_node(this._data.core.last_clicked.parent).children,g=!1,h,i;for(h=0,i=f.length;i>h;h+=1)f[h]===d&&(g=!g),f[h]===e&&(g=!g),this.is_disabled(f[h])||!g&&f[h]!==d&&f[h]!==e?this.deselect_node(f[h],!0,c):this.is_hidden(f[h])||this.select_node(f[h],!0,!1,c);this.trigger("changed",{action:"select_node",node:this.get_node(a),selected:this._data.core.selected,event:c})}else this.is_selected(a)?this.deselect_node(a,!1,c):this.select_node(a,!1,!1,c);else!this.settings.core.multiple&&(c.metaKey||c.ctrlKey||c.shiftKey)&&this.is_selected(a)?this.deselect_node(a,!1,c):(this.deselect_all(!0),this.select_node(a,!1,!1,c),this._data.core.last_clicked=this.get_node(a));this.trigger("activate_node",{node:this.get_node(a),event:c})},hover_node:function(a){if(a=this.get_node(a,!0),!a||!a.length||a.children(".jstree-hovered").length)return!1;var b=this.element.find(".jstree-hovered"),c=this.element;b&&b.length&&this.dehover_node(b),a.children(".jstree-anchor").addClass("jstree-hovered"),this.trigger("hover_node",{node:this.get_node(a)}),setTimeout(function(){c.attr("aria-activedescendant",a[0].id)},0)},dehover_node:function(a){return a=this.get_node(a,!0),a&&a.length&&a.children(".jstree-hovered").length?(a.children(".jstree-anchor").removeClass("jstree-hovered"),void this.trigger("dehover_node",{node:this.get_node(a)})):!1},select_node:function(b,c,d,e){var f,g,h,i;if(a.isArray(b)){for(b=b.slice(),g=0,h=b.length;h>g;g++)this.select_node(b[g],c,d,e);return!0}return b=this.get_node(b),b&&b.id!==a.jstree.root?(f=this.get_node(b,!0),void(b.state.selected||(b.state.selected=!0,this._data.core.selected.push(b.id),d||(f=this._open_to(b)),f&&f.length&&f.attr("aria-selected",!0).children(".jstree-anchor").addClass("jstree-clicked"),this.trigger("select_node",{node:b,selected:this._data.core.selected,event:e}),c||this.trigger("changed",{action:"select_node",node:b,selected:this._data.core.selected,event:e})))):!1},deselect_node:function(b,c,d){var e,f,g;if(a.isArray(b)){for(b=b.slice(),e=0,f=b.length;f>e;e++)this.deselect_node(b[e],c,d);return!0}return b=this.get_node(b),b&&b.id!==a.jstree.root?(g=this.get_node(b,!0),void(b.state.selected&&(b.state.selected=!1,this._data.core.selected=a.vakata.array_remove_item(this._data.core.selected,b.id),g.length&&g.attr("aria-selected",!1).children(".jstree-anchor").removeClass("jstree-clicked"),this.trigger("deselect_node",{node:b,selected:this._data.core.selected,event:d}),c||this.trigger("changed",{action:"deselect_node",node:b,selected:this._data.core.selected,event:d})))):!1},select_all:function(b){var c=this._data.core.selected.concat([]),d,e;for(this._data.core.selected=this._model.data[a.jstree.root].children_d.concat(),d=0,e=this._data.core.selected.length;e>d;d++)this._model.data[this._data.core.selected[d]]&&(this._model.data[this._data.core.selected[d]].state.selected=!0);this.redraw(!0),this.trigger("select_all",{selected:this._data.core.selected}),b||this.trigger("changed",{action:"select_all",selected:this._data.core.selected,old_selection:c})},deselect_all:function(a){var b=this._data.core.selected.concat([]),c,d;for(c=0,d=this._data.core.selected.length;d>c;c++)this._model.data[this._data.core.selected[c]]&&(this._model.data[this._data.core.selected[c]].state.selected=!1);this._data.core.selected=[],this.element.find(".jstree-clicked").removeClass("jstree-clicked").parent().attr("aria-selected",!1),this.trigger("deselect_all",{selected:this._data.core.selected,node:b}),a||this.trigger("changed",{action:"deselect_all",selected:this._data.core.selected,old_selection:b})},is_selected:function(b){return b=this.get_node(b),b&&b.id!==a.jstree.root?b.state.selected:!1},get_selected:function(b){return b?a.map(this._data.core.selected,a.proxy(function(a){return this.get_node(a)},this)):this._data.core.selected.slice()},get_top_selected:function(b){var c=this.get_selected(!0),d={},e,f,g,h;for(e=0,f=c.length;f>e;e++)d[c[e].id]=c[e];for(e=0,f=c.length;f>e;e++)for(g=0,h=c[e].children_d.length;h>g;g++)d[c[e].children_d[g]]&&delete d[c[e].children_d[g]];c=[];for(e in d)d.hasOwnProperty(e)&&c.push(e);return b?a.map(c,a.proxy(function(a){return this.get_node(a)},this)):c},get_bottom_selected:function(b){var c=this.get_selected(!0),d=[],e,f;for(e=0,f=c.length;f>e;e++)c[e].children.length||d.push(c[e].id);return b?a.map(d,a.proxy(function(a){return this.get_node(a)},this)):d},get_state:function(){var b={core:{open:[],loaded:[],scroll:{left:this.element.scrollLeft(),top:this.element.scrollTop()},selected:[]}},c;for(c in this._model.data)this._model.data.hasOwnProperty(c)&&c!==a.jstree.root&&(this._model.data[c].state.loaded&&this.settings.core.loaded_state&&b.core.loaded.push(c),this._model.data[c].state.opened&&b.core.open.push(c),this._model.data[c].state.selected&&b.core.selected.push(c));return b},set_state:function(c,d){if(c){if(c.core&&c.core.selected&&c.core.initial_selection===b&&(c.core.initial_selection=this._data.core.selected.concat([]).sort().join(",")),c.core){var e,f,g,h,i;if(c.core.loaded)return this.settings.core.loaded_state&&a.isArray(c.core.loaded)&&c.core.loaded.length?this._load_nodes(c.core.loaded,function(a){delete c.core.loaded,this.set_state(c,d)}):(delete c.core.loaded,this.set_state(c,d)),!1;if(c.core.open)return a.isArray(c.core.open)&&c.core.open.length?this._load_nodes(c.core.open,function(a){this.open_node(a,!1,0),delete c.core.open,this.set_state(c,d)}):(delete c.core.open,this.set_state(c,d)),!1;if(c.core.scroll)return c.core.scroll&&c.core.scroll.left!==b&&this.element.scrollLeft(c.core.scroll.left),c.core.scroll&&c.core.scroll.top!==b&&this.element.scrollTop(c.core.scroll.top),delete c.core.scroll,this.set_state(c,d),!1;if(c.core.selected)return h=this,(c.core.initial_selection===b||c.core.initial_selection===this._data.core.selected.concat([]).sort().join(","))&&(this.deselect_all(),a.each(c.core.selected,function(a,b){h.select_node(b,!1,!0)})),delete c.core.initial_selection,delete c.core.selected,this.set_state(c,d),!1;for(i in c)c.hasOwnProperty(i)&&"core"!==i&&-1===a.inArray(i,this.settings.plugins)&&delete c[i];if(a.isEmptyObject(c.core))return delete c.core,this.set_state(c,d),!1}return a.isEmptyObject(c)?(c=null,d&&d.call(this),this.trigger("set_state"),!1):!0}return!1},refresh:function(b,c){this._data.core.state=c===!0?{}:this.get_state(),c&&a.isFunction(c)&&(this._data.core.state=c.call(this,this._data.core.state)),this._cnt=0,this._model.data={},this._model.data[a.jstree.root]={id:a.jstree.root,parent:null,parents:[],children:[],children_d:[],state:{loaded:!1}},this._data.core.selected=[],this._data.core.last_clicked=null,this._data.core.focused=null;var d=this.get_container_ul()[0].className;b||(this.element.html("<ul class='"+d+"' role='group'><li class='jstree-initial-node jstree-loading jstree-leaf jstree-last' role='treeitem' id='j"+this._id+"_loading'><i class='jstree-icon jstree-ocl'></i><a class='jstree-anchor' href='#'><i class='jstree-icon jstree-themeicon-hidden'></i>"+this.get_string("Loading ...")+"</a></li></ul>"),this.element.attr("aria-activedescendant","j"+this._id+"_loading")),this.load_node(a.jstree.root,function(b,c){c&&(this.get_container_ul()[0].className=d,this._firstChild(this.get_container_ul()[0])&&this.element.attr("aria-activedescendant",this._firstChild(this.get_container_ul()[0]).id),this.set_state(a.extend(!0,{},this._data.core.state),function(){this.trigger("refresh")})),this._data.core.state=null})},refresh_node:function(b){if(b=this.get_node(b),!b||b.id===a.jstree.root)return!1;var c=[],d=[],e=this._data.core.selected.concat([]);d.push(b.id),b.state.opened===!0&&c.push(b.id),this.get_node(b,!0).find(".jstree-open").each(function(){d.push(this.id),c.push(this.id)}),this._load_nodes(d,a.proxy(function(a){this.open_node(c,!1,0),this.select_node(e),this.trigger("refresh_node",{node:b,nodes:a})},this),!1,!0)},set_id:function(b,c){if(b=this.get_node(b),!b||b.id===a.jstree.root)return!1;var d,e,f=this._model.data,g=b.id;for(c=c.toString(),f[b.parent].children[a.inArray(b.id,f[b.parent].children)]=c,d=0,e=b.parents.length;e>d;d++)f[b.parents[d]].children_d[a.inArray(b.id,f[b.parents[d]].children_d)]=c;for(d=0,e=b.children.length;e>d;d++)f[b.children[d]].parent=c;for(d=0,e=b.children_d.length;e>d;d++)f[b.children_d[d]].parents[a.inArray(b.id,f[b.children_d[d]].parents)]=c;return d=a.inArray(b.id,this._data.core.selected),-1!==d&&(this._data.core.selected[d]=c),d=this.get_node(b.id,!0),d&&(d.attr("id",c),this.element.attr("aria-activedescendant")===b.id&&this.element.attr("aria-activedescendant",c)),delete f[b.id],b.id=c,b.li_attr.id=c,f[c]=b,this.trigger("set_id",{node:b,"new":b.id,old:g}),!0},get_text:function(b){return b=this.get_node(b),b&&b.id!==a.jstree.root?b.text:!1},set_text:function(b,c){var d,e;if(a.isArray(b)){for(b=b.slice(),d=0,e=b.length;e>d;d++)this.set_text(b[d],c);return!0}return b=this.get_node(b),b&&b.id!==a.jstree.root?(b.text=c,this.get_node(b,!0).length&&this.redraw_node(b.id),this.trigger("set_text",{obj:b,text:c}),!0):!1},get_json:function(b,c,d){if(b=this.get_node(b||a.jstree.root),!b)return!1;c&&c.flat&&!d&&(d=[]);var e={id:b.id,text:b.text,icon:this.get_icon(b),li_attr:a.extend(!0,{},b.li_attr),a_attr:a.extend(!0,{},b.a_attr),state:{},data:c&&c.no_data?!1:a.extend(!0,a.isArray(b.data)?[]:{},b.data)},f,g;if(c&&c.flat?e.parent=b.parent:e.children=[],c&&c.no_state)delete e.state;else for(f in b.state)b.state.hasOwnProperty(f)&&(e.state[f]=b.state[f]);if(c&&c.no_li_attr&&delete e.li_attr,c&&c.no_a_attr&&delete e.a_attr,c&&c.no_id&&(delete e.id,e.li_attr&&e.li_attr.id&&delete e.li_attr.id,e.a_attr&&e.a_attr.id&&delete e.a_attr.id),c&&c.flat&&b.id!==a.jstree.root&&d.push(e),!c||!c.no_children)for(f=0,g=b.children.length;g>f;f++)c&&c.flat?this.get_json(b.children[f],c,d):e.children.push(this.get_json(b.children[f],c));return c&&c.flat?d:b.id===a.jstree.root?e.children:e},create_node:function(c,d,e,f,g){if(null===c&&(c=a.jstree.root),c=this.get_node(c),!c)return!1;if(e=e===b?"last":e,!e.toString().match(/^(before|after)$/)&&!g&&!this.is_loaded(c))return this.load_node(c,function(){this.create_node(c,d,e,f,!0)});d||(d={text:this.get_string("New node")}),d="string"==typeof d?{text:d}:a.extend(!0,{},d),d.text===b&&(d.text=this.get_string("New node"));var h,i,j,k;switch(c.id===a.jstree.root&&("before"===e&&(e="first"),"after"===e&&(e="last")),e){case"before":h=this.get_node(c.parent),e=a.inArray(c.id,h.children),c=h;break;case"after":h=this.get_node(c.parent),e=a.inArray(c.id,h.children)+1,c=h;break;case"inside":case"first":e=0;break;case"last":e=c.children.length;break;default:e||(e=0)}if(e>c.children.length&&(e=c.children.length),d.id||(d.id=!0),!this.check("create_node",d,c,e))return this.settings.core.error.call(this,this._data.core.last_error),!1;if(d.id===!0&&delete d.id,d=this._parse_model_from_json(d,c.id,c.parents.concat()),!d)return!1;for(h=this.get_node(d),i=[],i.push(d),i=i.concat(h.children_d),this.trigger("model",{nodes:i,parent:c.id}),c.children_d=c.children_d.concat(i),j=0,k=c.parents.length;k>j;j++)this._model.data[c.parents[j]].children_d=this._model.data[c.parents[j]].children_d.concat(i);for(d=h,h=[],j=0,k=c.children.length;k>j;j++)h[j>=e?j+1:j]=c.children[j];return h[e]=d.id,c.children=h,this.redraw_node(c,!0),this.trigger("create_node",{node:this.get_node(d),parent:c.id,position:e}),f&&f.call(this,this.get_node(d)),d.id},rename_node:function(b,c){var d,e,f;if(a.isArray(b)){for(b=b.slice(),d=0,e=b.length;e>d;d++)this.rename_node(b[d],c);return!0}return b=this.get_node(b),b&&b.id!==a.jstree.root?(f=b.text,this.check("rename_node",b,this.get_parent(b),c)?(this.set_text(b,c),this.trigger("rename_node",{node:b,text:c,old:f}),!0):(this.settings.core.error.call(this,this._data.core.last_error),!1)):!1},delete_node:function(b){var c,d,e,f,g,h,i,j,k,l,m,n;if(a.isArray(b)){for(b=b.slice(),c=0,d=b.length;d>c;c++)this.delete_node(b[c]);return!0}if(b=this.get_node(b),!b||b.id===a.jstree.root)return!1;if(e=this.get_node(b.parent),f=a.inArray(b.id,e.children),l=!1,!this.check("delete_node",b,e,f))return this.settings.core.error.call(this,this._data.core.last_error),!1;for(-1!==f&&(e.children=a.vakata.array_remove(e.children,f)),g=b.children_d.concat([]),g.push(b.id),h=0,i=b.parents.length;i>h;h++)this._model.data[b.parents[h]].children_d=a.vakata.array_filter(this._model.data[b.parents[h]].children_d,function(b){return-1===a.inArray(b,g)});for(j=0,k=g.length;k>j;j++)if(this._model.data[g[j]].state.selected){l=!0;break}for(l&&(this._data.core.selected=a.vakata.array_filter(this._data.core.selected,function(b){return-1===a.inArray(b,g)})),this.trigger("delete_node",{node:b,parent:e.id}),l&&this.trigger("changed",{action:"delete_node",node:b,selected:this._data.core.selected,parent:e.id}),j=0,k=g.length;k>j;j++)delete this._model.data[g[j]];return-1!==a.inArray(this._data.core.focused,g)&&(this._data.core.focused=null,m=this.element[0].scrollTop,n=this.element[0].scrollLeft,e.id===a.jstree.root?this._model.data[a.jstree.root].children[0]&&this.get_node(this._model.data[a.jstree.root].children[0],!0).children(".jstree-anchor").focus():this.get_node(e,!0).children(".jstree-anchor").focus(),this.element[0].scrollTop=m,this.element[0].scrollLeft=n),this.redraw_node(e,!0),!0},check:function(b,c,d,e,f){c=c&&c.id?c:this.get_node(c),d=d&&d.id?d:this.get_node(d);var g=b.match(/^move_node|copy_node|create_node$/i)?d:c,h=this.settings.core.check_callback;return"move_node"!==b&&"copy_node"!==b||f&&f.is_multi||c.id!==d.id&&("move_node"!==b||a.inArray(c.id,d.children)!==e)&&-1===a.inArray(d.id,c.children_d)?(g&&g.data&&(g=g.data),g&&g.functions&&(g.functions[b]===!1||g.functions[b]===!0)?(g.functions[b]===!1&&(this._data.core.last_error={error:"check",plugin:"core",id:"core_02",reason:"Node data prevents function: "+b,data:JSON.stringify({chk:b,pos:e,obj:c&&c.id?c.id:!1,par:d&&d.id?d.id:!1})}),g.functions[b]):h===!1||a.isFunction(h)&&h.call(this,b,c,d,e,f)===!1||h&&h[b]===!1?(this._data.core.last_error={error:"check",plugin:"core",id:"core_03",reason:"User config for core.check_callback prevents function: "+b,data:JSON.stringify({chk:b,pos:e,obj:c&&c.id?c.id:!1,par:d&&d.id?d.id:!1})},!1):!0):(this._data.core.last_error={error:"check",plugin:"core",id:"core_01",reason:"Moving parent inside child",data:JSON.stringify({chk:b,pos:e,obj:c&&c.id?c.id:!1,par:d&&d.id?d.id:!1})},!1)},last_error:function(){return this._data.core.last_error},move_node:function(c,d,e,f,g,h,i){var j,k,l,m,n,o,p,q,r,s,t,u,v,w;if(d=this.get_node(d),e=e===b?0:e,!d)return!1;if(!e.toString().match(/^(before|after)$/)&&!g&&!this.is_loaded(d))return this.load_node(d,function(){this.move_node(c,d,e,f,!0,!1,i)});if(a.isArray(c)){if(1!==c.length){for(j=0,k=c.length;k>j;j++)(r=this.move_node(c[j],d,e,f,g,!1,i))&&(d=r,e="after");return this.redraw(),!0}c=c[0]}if(c=c&&c.id?c:this.get_node(c),!c||c.id===a.jstree.root)return!1;if(l=(c.parent||a.jstree.root).toString(),n=e.toString().match(/^(before|after)$/)&&d.id!==a.jstree.root?this.get_node(d.parent):d,o=i?i:this._model.data[c.id]?this:a.jstree.reference(c.id),p=!o||!o._id||this._id!==o._id,m=o&&o._id&&l&&o._model.data[l]&&o._model.data[l].children?a.inArray(c.id,o._model.data[l].children):-1,o&&o._id&&(c=o._model.data[c.id]),p)return(r=this.copy_node(c,d,e,f,g,!1,i))?(o&&o.delete_node(c),r):!1;switch(d.id===a.jstree.root&&("before"===e&&(e="first"),"after"===e&&(e="last")),e){case"before":e=a.inArray(d.id,n.children);break;case"after":e=a.inArray(d.id,n.children)+1;break;case"inside":case"first":e=0;break;case"last":e=n.children.length;break;default:e||(e=0)}if(e>n.children.length&&(e=n.children.length),!this.check("move_node",c,n,e,{core:!0,origin:i,is_multi:o&&o._id&&o._id!==this._id,is_foreign:!o||!o._id}))return this.settings.core.error.call(this,this._data.core.last_error),!1;if(c.parent===n.id){for(q=n.children.concat(),r=a.inArray(c.id,q),-1!==r&&(q=a.vakata.array_remove(q,r),e>r&&e--),r=[],s=0,t=q.length;t>s;s++)r[s>=e?s+1:s]=q[s];r[e]=c.id,n.children=r,this._node_changed(n.id),this.redraw(n.id===a.jstree.root)}else{for(r=c.children_d.concat(),r.push(c.id),s=0,t=c.parents.length;t>s;s++){for(q=[],w=o._model.data[c.parents[s]].children_d,u=0,v=w.length;v>u;u++)-1===a.inArray(w[u],r)&&q.push(w[u]);o._model.data[c.parents[s]].children_d=q}for(o._model.data[l].children=a.vakata.array_remove_item(o._model.data[l].children,c.id),s=0,t=n.parents.length;t>s;s++)this._model.data[n.parents[s]].children_d=this._model.data[n.parents[s]].children_d.concat(r);for(q=[],s=0,t=n.children.length;t>s;s++)q[s>=e?s+1:s]=n.children[s];for(q[e]=c.id,n.children=q,n.children_d.push(c.id),n.children_d=n.children_d.concat(c.children_d),c.parent=n.id,r=n.parents.concat(),r.unshift(n.id),w=c.parents.length,c.parents=r,r=r.concat(),s=0,t=c.children_d.length;t>s;s++)this._model.data[c.children_d[s]].parents=this._model.data[c.children_d[s]].parents.slice(0,-1*w),Array.prototype.push.apply(this._model.data[c.children_d[s]].parents,r);(l===a.jstree.root||n.id===a.jstree.root)&&(this._model.force_full_redraw=!0),this._model.force_full_redraw||(this._node_changed(l),this._node_changed(n.id)),h||this.redraw()}return f&&f.call(this,c,n,e),this.trigger("move_node",{node:c,parent:n.id,position:e,old_parent:l,old_position:m,is_multi:o&&o._id&&o._id!==this._id,is_foreign:!o||!o._id,old_instance:o,new_instance:this}),c.id},copy_node:function(c,d,e,f,g,h,i){var j,k,l,m,n,o,p,q,r,s,t;if(d=this.get_node(d),e=e===b?0:e,!d)return!1;if(!e.toString().match(/^(before|after)$/)&&!g&&!this.is_loaded(d))return this.load_node(d,function(){this.copy_node(c,d,e,f,!0,!1,i)});if(a.isArray(c)){if(1!==c.length){for(j=0,k=c.length;k>j;j++)(m=this.copy_node(c[j],d,e,f,g,!0,i))&&(d=m,e="after");return this.redraw(),!0}c=c[0]}if(c=c&&c.id?c:this.get_node(c),!c||c.id===a.jstree.root)return!1;switch(q=(c.parent||a.jstree.root).toString(),r=e.toString().match(/^(before|after)$/)&&d.id!==a.jstree.root?this.get_node(d.parent):d,s=i?i:this._model.data[c.id]?this:a.jstree.reference(c.id),t=!s||!s._id||this._id!==s._id,s&&s._id&&(c=s._model.data[c.id]),d.id===a.jstree.root&&("before"===e&&(e="first"),"after"===e&&(e="last")),e){case"before":e=a.inArray(d.id,r.children);break;case"after":e=a.inArray(d.id,r.children)+1;break;case"inside":case"first":e=0;break;case"last":e=r.children.length;break;default:e||(e=0)}if(e>r.children.length&&(e=r.children.length),!this.check("copy_node",c,r,e,{core:!0,origin:i,is_multi:s&&s._id&&s._id!==this._id,is_foreign:!s||!s._id}))return this.settings.core.error.call(this,this._data.core.last_error),!1;if(p=s?s.get_json(c,{no_id:!0,no_data:!0,no_state:!0}):c,!p)return!1;if(p.id===!0&&delete p.id,p=this._parse_model_from_json(p,r.id,r.parents.concat()),!p)return!1;for(m=this.get_node(p),c&&c.state&&c.state.loaded===!1&&(m.state.loaded=!1),l=[],l.push(p),l=l.concat(m.children_d),this.trigger("model",{nodes:l,parent:r.id}),n=0,o=r.parents.length;o>n;n++)this._model.data[r.parents[n]].children_d=this._model.data[r.parents[n]].children_d.concat(l);for(l=[],n=0,o=r.children.length;o>n;n++)l[n>=e?n+1:n]=r.children[n];return l[e]=m.id,r.children=l,r.children_d.push(m.id),r.children_d=r.children_d.concat(m.children_d),r.id===a.jstree.root&&(this._model.force_full_redraw=!0),this._model.force_full_redraw||this._node_changed(r.id),h||this.redraw(r.id===a.jstree.root),f&&f.call(this,m,r,e),this.trigger("copy_node",{node:m,original:c,parent:r.id,position:e,old_parent:q,old_position:s&&s._id&&q&&s._model.data[q]&&s._model.data[q].children?a.inArray(c.id,s._model.data[q].children):-1,is_multi:s&&s._id&&s._id!==this._id,is_foreign:!s||!s._id,old_instance:s,new_instance:this}),m.id},cut:function(b){if(b||(b=this._data.core.selected.concat()),a.isArray(b)||(b=[b]),!b.length)return!1;var c=[],g,h,i;for(h=0,i=b.length;i>h;h++)g=this.get_node(b[h]),g&&g.id&&g.id!==a.jstree.root&&c.push(g);
return c.length?(d=c,f=this,e="move_node",void this.trigger("cut",{node:b})):!1},copy:function(b){if(b||(b=this._data.core.selected.concat()),a.isArray(b)||(b=[b]),!b.length)return!1;var c=[],g,h,i;for(h=0,i=b.length;i>h;h++)g=this.get_node(b[h]),g&&g.id&&g.id!==a.jstree.root&&c.push(g);return c.length?(d=c,f=this,e="copy_node",void this.trigger("copy",{node:b})):!1},get_buffer:function(){return{mode:e,node:d,inst:f}},can_paste:function(){return e!==!1&&d!==!1},paste:function(a,b){return a=this.get_node(a),a&&e&&e.match(/^(copy_node|move_node)$/)&&d?(this[e](d,a,b,!1,!1,!1,f)&&this.trigger("paste",{parent:a.id,node:d,mode:e}),d=!1,e=!1,void(f=!1)):!1},clear_buffer:function(){d=!1,e=!1,f=!1,this.trigger("clear_buffer")},edit:function(b,c,d){var e,f,g,h,j,k,l,m,n,o=!1;return(b=this.get_node(b))?this.check("edit",b,this.get_parent(b))?(n=b,c="string"==typeof c?c:b.text,this.set_text(b,""),b=this._open_to(b),n.text=c,e=this._data.core.rtl,f=this.element.width(),this._data.core.focused=n.id,g=b.children(".jstree-anchor").focus(),h=a("<span>"),j=c,k=a("<div />",{css:{position:"absolute",top:"-200px",left:e?"0px":"-1000px",visibility:"hidden"}}).appendTo(i.body),l=a("<input />",{value:j,"class":"jstree-rename-input",css:{padding:"0",border:"1px solid silver","box-sizing":"border-box",display:"inline-block",height:this._data.core.li_height+"px",lineHeight:this._data.core.li_height+"px",width:"150px"},blur:a.proxy(function(c){c.stopImmediatePropagation(),c.preventDefault();var e=h.children(".jstree-rename-input"),f=e.val(),i=this.settings.core.force_text,m;""===f&&(f=j),k.remove(),h.replaceWith(g),h.remove(),j=i?j:a("<div></div>").append(a.parseHTML(j)).html(),b=this.get_node(b),this.set_text(b,j),m=!!this.rename_node(b,i?a("<div></div>").text(f).text():a("<div></div>").append(a.parseHTML(f)).html()),m||this.set_text(b,j),this._data.core.focused=n.id,setTimeout(a.proxy(function(){var a=this.get_node(n.id,!0);a.length&&(this._data.core.focused=n.id,a.children(".jstree-anchor").focus())},this),0),d&&d.call(this,n,m,o),l=null},this),keydown:function(a){var b=a.which;27===b&&(o=!0,this.value=j),(27===b||13===b||37===b||38===b||39===b||40===b||32===b)&&a.stopImmediatePropagation(),(27===b||13===b)&&(a.preventDefault(),this.blur())},click:function(a){a.stopImmediatePropagation()},mousedown:function(a){a.stopImmediatePropagation()},keyup:function(a){l.width(Math.min(k.text("pW"+this.value).width(),f))},keypress:function(a){return 13===a.which?!1:void 0}}),m={fontFamily:g.css("fontFamily")||"",fontSize:g.css("fontSize")||"",fontWeight:g.css("fontWeight")||"",fontStyle:g.css("fontStyle")||"",fontStretch:g.css("fontStretch")||"",fontVariant:g.css("fontVariant")||"",letterSpacing:g.css("letterSpacing")||"",wordSpacing:g.css("wordSpacing")||""},h.attr("class",g.attr("class")).append(g.contents().clone()).append(l),g.replaceWith(h),k.css(m),l.css(m).width(Math.min(k.text("pW"+l[0].value).width(),f))[0].select(),void a(i).one("mousedown.jstree touchstart.jstree dnd_start.vakata",function(b){l&&b.target!==l&&a(l).blur()})):(this.settings.core.error.call(this,this._data.core.last_error),!1):!1},set_theme:function(b,c){if(!b)return!1;if(c===!0){var d=this.settings.core.themes.dir;d||(d=a.jstree.path+"/themes"),c=d+"/"+b+"/style.css"}c&&-1===a.inArray(c,g)&&(a("head").append('<link rel="stylesheet" href="'+c+'" type="text/css" />'),g.push(c)),this._data.core.themes.name&&this.element.removeClass("jstree-"+this._data.core.themes.name),this._data.core.themes.name=b,this.element.addClass("jstree-"+b),this.element[this.settings.core.themes.responsive?"addClass":"removeClass"]("jstree-"+b+"-responsive"),this.trigger("set_theme",{theme:b})},get_theme:function(){return this._data.core.themes.name},set_theme_variant:function(a){this._data.core.themes.variant&&this.element.removeClass("jstree-"+this._data.core.themes.name+"-"+this._data.core.themes.variant),this._data.core.themes.variant=a,a&&this.element.addClass("jstree-"+this._data.core.themes.name+"-"+this._data.core.themes.variant)},get_theme_variant:function(){return this._data.core.themes.variant},show_stripes:function(){this._data.core.themes.stripes=!0,this.get_container_ul().addClass("jstree-striped"),this.trigger("show_stripes")},hide_stripes:function(){this._data.core.themes.stripes=!1,this.get_container_ul().removeClass("jstree-striped"),this.trigger("hide_stripes")},toggle_stripes:function(){this._data.core.themes.stripes?this.hide_stripes():this.show_stripes()},show_dots:function(){this._data.core.themes.dots=!0,this.get_container_ul().removeClass("jstree-no-dots"),this.trigger("show_dots")},hide_dots:function(){this._data.core.themes.dots=!1,this.get_container_ul().addClass("jstree-no-dots"),this.trigger("hide_dots")},toggle_dots:function(){this._data.core.themes.dots?this.hide_dots():this.show_dots()},show_icons:function(){this._data.core.themes.icons=!0,this.get_container_ul().removeClass("jstree-no-icons"),this.trigger("show_icons")},hide_icons:function(){this._data.core.themes.icons=!1,this.get_container_ul().addClass("jstree-no-icons"),this.trigger("hide_icons")},toggle_icons:function(){this._data.core.themes.icons?this.hide_icons():this.show_icons()},show_ellipsis:function(){this._data.core.themes.ellipsis=!0,this.get_container_ul().addClass("jstree-ellipsis"),this.trigger("show_ellipsis")},hide_ellipsis:function(){this._data.core.themes.ellipsis=!1,this.get_container_ul().removeClass("jstree-ellipsis"),this.trigger("hide_ellipsis")},toggle_ellipsis:function(){this._data.core.themes.ellipsis?this.hide_ellipsis():this.show_ellipsis()},set_icon:function(c,d){var e,f,g,h;if(a.isArray(c)){for(c=c.slice(),e=0,f=c.length;f>e;e++)this.set_icon(c[e],d);return!0}return c=this.get_node(c),c&&c.id!==a.jstree.root?(h=c.icon,c.icon=d===!0||null===d||d===b||""===d?!0:d,g=this.get_node(c,!0).children(".jstree-anchor").children(".jstree-themeicon"),d===!1?(g.removeClass("jstree-themeicon-custom "+h).css("background","").removeAttr("rel"),this.hide_icon(c)):d===!0||null===d||d===b||""===d?(g.removeClass("jstree-themeicon-custom "+h).css("background","").removeAttr("rel"),h===!1&&this.show_icon(c)):-1===d.indexOf("/")&&-1===d.indexOf(".")?(g.removeClass(h).css("background",""),g.addClass(d+" jstree-themeicon-custom").attr("rel",d),h===!1&&this.show_icon(c)):(g.removeClass(h).css("background",""),g.addClass("jstree-themeicon-custom").css("background","url('"+d+"') center center no-repeat").attr("rel",d),h===!1&&this.show_icon(c)),!0):!1},get_icon:function(b){return b=this.get_node(b),b&&b.id!==a.jstree.root?b.icon:!1},hide_icon:function(b){var c,d;if(a.isArray(b)){for(b=b.slice(),c=0,d=b.length;d>c;c++)this.hide_icon(b[c]);return!0}return b=this.get_node(b),b&&b!==a.jstree.root?(b.icon=!1,this.get_node(b,!0).children(".jstree-anchor").children(".jstree-themeicon").addClass("jstree-themeicon-hidden"),!0):!1},show_icon:function(b){var c,d,e;if(a.isArray(b)){for(b=b.slice(),c=0,d=b.length;d>c;c++)this.show_icon(b[c]);return!0}return b=this.get_node(b),b&&b!==a.jstree.root?(e=this.get_node(b,!0),b.icon=e.length?e.children(".jstree-anchor").children(".jstree-themeicon").attr("rel"):!0,b.icon||(b.icon=!0),e.children(".jstree-anchor").children(".jstree-themeicon").removeClass("jstree-themeicon-hidden"),!0):!1}},a.vakata={},a.vakata.attributes=function(b,c){b=a(b)[0];var d=c?{}:[];return b&&b.attributes&&a.each(b.attributes,function(b,e){-1===a.inArray(e.name.toLowerCase(),["style","contenteditable","hasfocus","tabindex"])&&null!==e.value&&""!==a.trim(e.value)&&(c?d[e.name]=e.value:d.push(e.name))}),d},a.vakata.array_unique=function(a){var c=[],d,e,f,g={};for(d=0,f=a.length;f>d;d++)g[a[d]]===b&&(c.push(a[d]),g[a[d]]=!0);return c},a.vakata.array_remove=function(a,b){return a.splice(b,1),a},a.vakata.array_remove_item=function(b,c){var d=a.inArray(c,b);return-1!==d?a.vakata.array_remove(b,d):b},a.vakata.array_filter=function(a,b,c,d,e){if(a.filter)return a.filter(b,c);d=[];for(e in a)~~e+""==e+""&&e>=0&&b.call(c,a[e],+e,a)&&d.push(a[e]);return d},a.jstree.plugins.changed=function(a,b){var c=[];this.trigger=function(a,d){var e,f;if(d||(d={}),"changed"===a.replace(".jstree","")){d.changed={selected:[],deselected:[]};var g={};for(e=0,f=c.length;f>e;e++)g[c[e]]=1;for(e=0,f=d.selected.length;f>e;e++)g[d.selected[e]]?g[d.selected[e]]=2:d.changed.selected.push(d.selected[e]);for(e=0,f=c.length;f>e;e++)1===g[c[e]]&&d.changed.deselected.push(c[e]);c=d.selected.slice()}b.trigger.call(this,a,d)},this.refresh=function(a,d){return c=[],b.refresh.apply(this,arguments)}};var j=i.createElement("I");j.className="jstree-icon jstree-checkbox",j.setAttribute("role","presentation"),a.jstree.defaults.checkbox={visible:!0,three_state:!0,whole_node:!0,keep_selected_style:!0,cascade:"",tie_selection:!0,cascade_to_disabled:!0,cascade_to_hidden:!0},a.jstree.plugins.checkbox=function(c,d){this.bind=function(){d.bind.call(this),this._data.checkbox.uto=!1,this._data.checkbox.selected=[],this.settings.checkbox.three_state&&(this.settings.checkbox.cascade="up+down+undetermined"),this.element.on("init.jstree",a.proxy(function(){this._data.checkbox.visible=this.settings.checkbox.visible,this.settings.checkbox.keep_selected_style||this.element.addClass("jstree-checkbox-no-clicked"),this.settings.checkbox.tie_selection&&this.element.addClass("jstree-checkbox-selection")},this)).on("loading.jstree",a.proxy(function(){this[this._data.checkbox.visible?"show_checkboxes":"hide_checkboxes"]()},this)),-1!==this.settings.checkbox.cascade.indexOf("undetermined")&&this.element.on("changed.jstree uncheck_node.jstree check_node.jstree uncheck_all.jstree check_all.jstree move_node.jstree copy_node.jstree redraw.jstree open_node.jstree",a.proxy(function(){this._data.checkbox.uto&&clearTimeout(this._data.checkbox.uto),this._data.checkbox.uto=setTimeout(a.proxy(this._undetermined,this),50)},this)),this.settings.checkbox.tie_selection||this.element.on("model.jstree",a.proxy(function(a,b){var c=this._model.data,d=c[b.parent],e=b.nodes,f,g;for(f=0,g=e.length;g>f;f++)c[e[f]].state.checked=c[e[f]].state.checked||c[e[f]].original&&c[e[f]].original.state&&c[e[f]].original.state.checked,c[e[f]].state.checked&&this._data.checkbox.selected.push(e[f])},this)),(-1!==this.settings.checkbox.cascade.indexOf("up")||-1!==this.settings.checkbox.cascade.indexOf("down"))&&this.element.on("model.jstree",a.proxy(function(b,c){var d=this._model.data,e=d[c.parent],f=c.nodes,g=[],h,i,j,k,l,m,n=this.settings.checkbox.cascade,o=this.settings.checkbox.tie_selection;if(-1!==n.indexOf("down"))if(e.state[o?"selected":"checked"]){for(i=0,j=f.length;j>i;i++)d[f[i]].state[o?"selected":"checked"]=!0;this._data[o?"core":"checkbox"].selected=this._data[o?"core":"checkbox"].selected.concat(f)}else for(i=0,j=f.length;j>i;i++)if(d[f[i]].state[o?"selected":"checked"]){for(k=0,l=d[f[i]].children_d.length;l>k;k++)d[d[f[i]].children_d[k]].state[o?"selected":"checked"]=!0;this._data[o?"core":"checkbox"].selected=this._data[o?"core":"checkbox"].selected.concat(d[f[i]].children_d)}if(-1!==n.indexOf("up")){for(i=0,j=e.children_d.length;j>i;i++)d[e.children_d[i]].children.length||g.push(d[e.children_d[i]].parent);for(g=a.vakata.array_unique(g),k=0,l=g.length;l>k;k++){e=d[g[k]];while(e&&e.id!==a.jstree.root){for(h=0,i=0,j=e.children.length;j>i;i++)h+=d[e.children[i]].state[o?"selected":"checked"];if(h!==j)break;e.state[o?"selected":"checked"]=!0,this._data[o?"core":"checkbox"].selected.push(e.id),m=this.get_node(e,!0),m&&m.length&&m.attr("aria-selected",!0).children(".jstree-anchor").addClass(o?"jstree-clicked":"jstree-checked"),e=this.get_node(e.parent)}}}this._data[o?"core":"checkbox"].selected=a.vakata.array_unique(this._data[o?"core":"checkbox"].selected)},this)).on(this.settings.checkbox.tie_selection?"select_node.jstree":"check_node.jstree",a.proxy(function(b,c){var d=this,e=c.node,f=this._model.data,g=this.get_node(e.parent),h,i,j,k,l=this.settings.checkbox.cascade,m=this.settings.checkbox.tie_selection,n={},o=this._data[m?"core":"checkbox"].selected;for(h=0,i=o.length;i>h;h++)n[o[h]]=!0;if(-1!==l.indexOf("down")){var p=this._cascade_new_checked_state(e.id,!0),q=e.children_d.concat(e.id);for(h=0,i=q.length;i>h;h++)p.indexOf(q[h])>-1?n[q[h]]=!0:delete n[q[h]]}if(-1!==l.indexOf("up"))while(g&&g.id!==a.jstree.root){for(j=0,h=0,i=g.children.length;i>h;h++)j+=f[g.children[h]].state[m?"selected":"checked"];if(j!==i)break;g.state[m?"selected":"checked"]=!0,n[g.id]=!0,k=this.get_node(g,!0),k&&k.length&&k.attr("aria-selected",!0).children(".jstree-anchor").addClass(m?"jstree-clicked":"jstree-checked"),g=this.get_node(g.parent)}o=[];for(h in n)n.hasOwnProperty(h)&&o.push(h);this._data[m?"core":"checkbox"].selected=o},this)).on(this.settings.checkbox.tie_selection?"deselect_all.jstree":"uncheck_all.jstree",a.proxy(function(b,c){var d=this.get_node(a.jstree.root),e=this._model.data,f,g,h;for(f=0,g=d.children_d.length;g>f;f++)h=e[d.children_d[f]],h&&h.original&&h.original.state&&h.original.state.undetermined&&(h.original.state.undetermined=!1)},this)).on(this.settings.checkbox.tie_selection?"deselect_node.jstree":"uncheck_node.jstree",a.proxy(function(a,b){var c=this,d=b.node,e=this.get_node(d,!0),f,g,h,i=this.settings.checkbox.cascade,j=this.settings.checkbox.tie_selection,k=this._data[j?"core":"checkbox"].selected,l={},m=[],n=d.children_d.concat(d.id);if(-1!==i.indexOf("down")){var o=this._cascade_new_checked_state(d.id,!1);k=k.filter(function(a){return-1===n.indexOf(a)||o.indexOf(a)>-1})}if(-1!==i.indexOf("up")&&-1===k.indexOf(d.id)){for(f=0,g=d.parents.length;g>f;f++)h=this._model.data[d.parents[f]],h.state[j?"selected":"checked"]=!1,h&&h.original&&h.original.state&&h.original.state.undetermined&&(h.original.state.undetermined=!1),h=this.get_node(d.parents[f],!0),h&&h.length&&h.attr("aria-selected",!1).children(".jstree-anchor").removeClass(j?"jstree-clicked":"jstree-checked");k=k.filter(function(a){return-1===d.parents.indexOf(a)})}this._data[j?"core":"checkbox"].selected=k},this)),-1!==this.settings.checkbox.cascade.indexOf("up")&&this.element.on("delete_node.jstree",a.proxy(function(b,c){var d=this.get_node(c.parent),e=this._model.data,f,g,h,i,j=this.settings.checkbox.tie_selection;while(d&&d.id!==a.jstree.root&&!d.state[j?"selected":"checked"]){for(h=0,f=0,g=d.children.length;g>f;f++)h+=e[d.children[f]].state[j?"selected":"checked"];if(!(g>0&&h===g))break;d.state[j?"selected":"checked"]=!0,this._data[j?"core":"checkbox"].selected.push(d.id),i=this.get_node(d,!0),i&&i.length&&i.attr("aria-selected",!0).children(".jstree-anchor").addClass(j?"jstree-clicked":"jstree-checked"),d=this.get_node(d.parent)}},this)).on("move_node.jstree",a.proxy(function(b,c){var d=c.is_multi,e=c.old_parent,f=this.get_node(c.parent),g=this._model.data,h,i,j,k,l,m=this.settings.checkbox.tie_selection;if(!d){h=this.get_node(e);while(h&&h.id!==a.jstree.root&&!h.state[m?"selected":"checked"]){for(i=0,j=0,k=h.children.length;k>j;j++)i+=g[h.children[j]].state[m?"selected":"checked"];if(!(k>0&&i===k))break;h.state[m?"selected":"checked"]=!0,this._data[m?"core":"checkbox"].selected.push(h.id),l=this.get_node(h,!0),l&&l.length&&l.attr("aria-selected",!0).children(".jstree-anchor").addClass(m?"jstree-clicked":"jstree-checked"),h=this.get_node(h.parent)}}h=f;while(h&&h.id!==a.jstree.root){for(i=0,j=0,k=h.children.length;k>j;j++)i+=g[h.children[j]].state[m?"selected":"checked"];if(i===k)h.state[m?"selected":"checked"]||(h.state[m?"selected":"checked"]=!0,this._data[m?"core":"checkbox"].selected.push(h.id),l=this.get_node(h,!0),l&&l.length&&l.attr("aria-selected",!0).children(".jstree-anchor").addClass(m?"jstree-clicked":"jstree-checked"));else{if(!h.state[m?"selected":"checked"])break;h.state[m?"selected":"checked"]=!1,this._data[m?"core":"checkbox"].selected=a.vakata.array_remove_item(this._data[m?"core":"checkbox"].selected,h.id),l=this.get_node(h,!0),l&&l.length&&l.attr("aria-selected",!1).children(".jstree-anchor").removeClass(m?"jstree-clicked":"jstree-checked")}h=this.get_node(h.parent)}},this))},this.get_undetermined=function(c){if(-1===this.settings.checkbox.cascade.indexOf("undetermined"))return[];var d,e,f,g,h={},i=this._model.data,j=this.settings.checkbox.tie_selection,k=this._data[j?"core":"checkbox"].selected,l=[],m=this,n=[];for(d=0,e=k.length;e>d;d++)if(i[k[d]]&&i[k[d]].parents)for(f=0,g=i[k[d]].parents.length;g>f;f++){if(h[i[k[d]].parents[f]]!==b)break;i[k[d]].parents[f]!==a.jstree.root&&(h[i[k[d]].parents[f]]=!0,l.push(i[k[d]].parents[f]))}for(this.element.find(".jstree-closed").not(":has(.jstree-children)").each(function(){var c=m.get_node(this),j;if(c)if(c.state.loaded){for(d=0,e=c.children_d.length;e>d;d++)if(j=i[c.children_d[d]],!j.state.loaded&&j.original&&j.original.state&&j.original.state.undetermined&&j.original.state.undetermined===!0)for(h[j.id]===b&&j.id!==a.jstree.root&&(h[j.id]=!0,l.push(j.id)),f=0,g=j.parents.length;g>f;f++)h[j.parents[f]]===b&&j.parents[f]!==a.jstree.root&&(h[j.parents[f]]=!0,l.push(j.parents[f]))}else if(c.original&&c.original.state&&c.original.state.undetermined&&c.original.state.undetermined===!0)for(h[c.id]===b&&c.id!==a.jstree.root&&(h[c.id]=!0,l.push(c.id)),f=0,g=c.parents.length;g>f;f++)h[c.parents[f]]===b&&c.parents[f]!==a.jstree.root&&(h[c.parents[f]]=!0,l.push(c.parents[f]))}),d=0,e=l.length;e>d;d++)i[l[d]].state[j?"selected":"checked"]||n.push(c?i[l[d]]:l[d]);return n},this._undetermined=function(){if(null!==this.element){var a=this.get_undetermined(!1),b,c,d;for(this.element.find(".jstree-undetermined").removeClass("jstree-undetermined"),b=0,c=a.length;c>b;b++)d=this.get_node(a[b],!0),d&&d.length&&d.children(".jstree-anchor").children(".jstree-checkbox").addClass("jstree-undetermined")}},this.redraw_node=function(b,c,e,f){if(b=d.redraw_node.apply(this,arguments)){var g,h,i=null,k=null;for(g=0,h=b.childNodes.length;h>g;g++)if(b.childNodes[g]&&b.childNodes[g].className&&-1!==b.childNodes[g].className.indexOf("jstree-anchor")){i=b.childNodes[g];break}i&&(!this.settings.checkbox.tie_selection&&this._model.data[b.id].state.checked&&(i.className+=" jstree-checked"),k=j.cloneNode(!1),this._model.data[b.id].state.checkbox_disabled&&(k.className+=" jstree-checkbox-disabled"),i.insertBefore(k,i.childNodes[0]))}return e||-1===this.settings.checkbox.cascade.indexOf("undetermined")||(this._data.checkbox.uto&&clearTimeout(this._data.checkbox.uto),this._data.checkbox.uto=setTimeout(a.proxy(this._undetermined,this),50)),b},this.show_checkboxes=function(){this._data.core.themes.checkboxes=!0,this.get_container_ul().removeClass("jstree-no-checkboxes")},this.hide_checkboxes=function(){this._data.core.themes.checkboxes=!1,this.get_container_ul().addClass("jstree-no-checkboxes")},this.toggle_checkboxes=function(){this._data.core.themes.checkboxes?this.hide_checkboxes():this.show_checkboxes()},this.is_undetermined=function(b){b=this.get_node(b);var c=this.settings.checkbox.cascade,d,e,f=this.settings.checkbox.tie_selection,g=this._data[f?"core":"checkbox"].selected,h=this._model.data;if(!b||b.state[f?"selected":"checked"]===!0||-1===c.indexOf("undetermined")||-1===c.indexOf("down")&&-1===c.indexOf("up"))return!1;if(!b.state.loaded&&b.original.state.undetermined===!0)return!0;for(d=0,e=b.children_d.length;e>d;d++)if(-1!==a.inArray(b.children_d[d],g)||!h[b.children_d[d]].state.loaded&&h[b.children_d[d]].original.state.undetermined)return!0;return!1},this.disable_checkbox=function(b){var c,d,e;if(a.isArray(b)){for(b=b.slice(),c=0,d=b.length;d>c;c++)this.disable_checkbox(b[c]);return!0}return b=this.get_node(b),b&&b.id!==a.jstree.root?(e=this.get_node(b,!0),void(b.state.checkbox_disabled||(b.state.checkbox_disabled=!0,e&&e.length&&e.children(".jstree-anchor").children(".jstree-checkbox").addClass("jstree-checkbox-disabled"),this.trigger("disable_checkbox",{node:b})))):!1},this.enable_checkbox=function(b){var c,d,e;if(a.isArray(b)){for(b=b.slice(),c=0,d=b.length;d>c;c++)this.enable_checkbox(b[c]);return!0}return b=this.get_node(b),b&&b.id!==a.jstree.root?(e=this.get_node(b,!0),void(b.state.checkbox_disabled&&(b.state.checkbox_disabled=!1,e&&e.length&&e.children(".jstree-anchor").children(".jstree-checkbox").removeClass("jstree-checkbox-disabled"),this.trigger("enable_checkbox",{node:b})))):!1},this.activate_node=function(b,c){return a(c.target).hasClass("jstree-checkbox-disabled")?!1:(this.settings.checkbox.tie_selection&&(this.settings.checkbox.whole_node||a(c.target).hasClass("jstree-checkbox"))&&(c.ctrlKey=!0),this.settings.checkbox.tie_selection||!this.settings.checkbox.whole_node&&!a(c.target).hasClass("jstree-checkbox")?d.activate_node.call(this,b,c):this.is_disabled(b)?!1:(this.is_checked(b)?this.uncheck_node(b,c):this.check_node(b,c),void this.trigger("activate_node",{node:this.get_node(b)})))},this._cascade_new_checked_state=function(a,b){var c=this,d=this.settings.checkbox.tie_selection,e=this._model.data[a],f=[],g=[],h,i,j;if(!this.settings.checkbox.cascade_to_disabled&&e.state.disabled||!this.settings.checkbox.cascade_to_hidden&&e.state.hidden)j=this.get_checked_descendants(a),e.state[d?"selected":"checked"]&&j.push(e.id),f=f.concat(j);else{if(e.children)for(h=0,i=e.children.length;i>h;h++){var k=e.children[h];j=c._cascade_new_checked_state(k,b),f=f.concat(j),j.indexOf(k)>-1&&g.push(k)}var l=c.get_node(e,!0),m=g.length>0&&g.length<e.children.length;e.original&&e.original.state&&e.original.state.undetermined&&(e.original.state.undetermined=m),m?(e.state[d?"selected":"checked"]=!1,l.attr("aria-selected",!1).children(".jstree-anchor").removeClass(d?"jstree-clicked":"jstree-checked")):b&&g.length===e.children.length?(e.state[d?"selected":"checked"]=b,f.push(e.id),l.attr("aria-selected",!0).children(".jstree-anchor").addClass(d?"jstree-clicked":"jstree-checked")):(e.state[d?"selected":"checked"]=!1,l.attr("aria-selected",!1).children(".jstree-anchor").removeClass(d?"jstree-clicked":"jstree-checked"))}return f},this.get_checked_descendants=function(a){var b=this,c=b.settings.checkbox.tie_selection,d=b._model.data[a];return d.children_d.filter(function(a){return b._model.data[a].state[c?"selected":"checked"]})},this.check_node=function(b,c){if(this.settings.checkbox.tie_selection)return this.select_node(b,!1,!0,c);var d,e,f,g;if(a.isArray(b)){for(b=b.slice(),e=0,f=b.length;f>e;e++)this.check_node(b[e],c);return!0}return b=this.get_node(b),b&&b.id!==a.jstree.root?(d=this.get_node(b,!0),void(b.state.checked||(b.state.checked=!0,this._data.checkbox.selected.push(b.id),d&&d.length&&d.children(".jstree-anchor").addClass("jstree-checked"),this.trigger("check_node",{node:b,selected:this._data.checkbox.selected,event:c})))):!1},this.uncheck_node=function(b,c){if(this.settings.checkbox.tie_selection)return this.deselect_node(b,!1,c);var d,e,f;if(a.isArray(b)){for(b=b.slice(),d=0,e=b.length;e>d;d++)this.uncheck_node(b[d],c);return!0}return b=this.get_node(b),b&&b.id!==a.jstree.root?(f=this.get_node(b,!0),void(b.state.checked&&(b.state.checked=!1,this._data.checkbox.selected=a.vakata.array_remove_item(this._data.checkbox.selected,b.id),f.length&&f.children(".jstree-anchor").removeClass("jstree-checked"),this.trigger("uncheck_node",{node:b,selected:this._data.checkbox.selected,event:c})))):!1},this.check_all=function(){if(this.settings.checkbox.tie_selection)return this.select_all();var b=this._data.checkbox.selected.concat([]),c,d;for(this._data.checkbox.selected=this._model.data[a.jstree.root].children_d.concat(),c=0,d=this._data.checkbox.selected.length;d>c;c++)this._model.data[this._data.checkbox.selected[c]]&&(this._model.data[this._data.checkbox.selected[c]].state.checked=!0);this.redraw(!0),this.trigger("check_all",{selected:this._data.checkbox.selected})},this.uncheck_all=function(){if(this.settings.checkbox.tie_selection)return this.deselect_all();var a=this._data.checkbox.selected.concat([]),b,c;for(b=0,c=this._data.checkbox.selected.length;c>b;b++)this._model.data[this._data.checkbox.selected[b]]&&(this._model.data[this._data.checkbox.selected[b]].state.checked=!1);this._data.checkbox.selected=[],this.element.find(".jstree-checked").removeClass("jstree-checked"),this.trigger("uncheck_all",{selected:this._data.checkbox.selected,node:a})},this.is_checked=function(b){return this.settings.checkbox.tie_selection?this.is_selected(b):(b=this.get_node(b),b&&b.id!==a.jstree.root?b.state.checked:!1)},this.get_checked=function(b){return this.settings.checkbox.tie_selection?this.get_selected(b):b?a.map(this._data.checkbox.selected,a.proxy(function(a){return this.get_node(a)},this)):this._data.checkbox.selected},this.get_top_checked=function(b){if(this.settings.checkbox.tie_selection)return this.get_top_selected(b);var c=this.get_checked(!0),d={},e,f,g,h;for(e=0,f=c.length;f>e;e++)d[c[e].id]=c[e];for(e=0,f=c.length;f>e;e++)for(g=0,h=c[e].children_d.length;h>g;g++)d[c[e].children_d[g]]&&delete d[c[e].children_d[g]];c=[];for(e in d)d.hasOwnProperty(e)&&c.push(e);return b?a.map(c,a.proxy(function(a){return this.get_node(a)},this)):c},this.get_bottom_checked=function(b){if(this.settings.checkbox.tie_selection)return this.get_bottom_selected(b);var c=this.get_checked(!0),d=[],e,f;for(e=0,f=c.length;f>e;e++)c[e].children.length||d.push(c[e].id);return b?a.map(d,a.proxy(function(a){return this.get_node(a)},this)):d},this.load_node=function(b,c){var e,f,g,h,i,j;if(!a.isArray(b)&&!this.settings.checkbox.tie_selection&&(j=this.get_node(b),j&&j.state.loaded))for(e=0,f=j.children_d.length;f>e;e++)this._model.data[j.children_d[e]].state.checked&&(i=!0,this._data.checkbox.selected=a.vakata.array_remove_item(this._data.checkbox.selected,j.children_d[e]));return d.load_node.apply(this,arguments)},this.get_state=function(){var a=d.get_state.apply(this,arguments);return this.settings.checkbox.tie_selection?a:(a.checkbox=this._data.checkbox.selected.slice(),a)},this.set_state=function(b,c){var e=d.set_state.apply(this,arguments);if(e&&b.checkbox){if(!this.settings.checkbox.tie_selection){this.uncheck_all();var f=this;a.each(b.checkbox,function(a,b){f.check_node(b)})}return delete b.checkbox,this.set_state(b,c),!1}return e},this.refresh=function(a,b){return this.settings.checkbox.tie_selection&&(this._data.checkbox.selected=[]),d.refresh.apply(this,arguments)}},a.jstree.defaults.conditionalselect=function(){return!0},a.jstree.plugins.conditionalselect=function(a,b){this.activate_node=function(a,c){return this.settings.conditionalselect.call(this,this.get_node(a),c)?b.activate_node.call(this,a,c):void 0}},a.jstree.defaults.contextmenu={select_node:!0,show_at_node:!0,items:function(b,c){return{create:{separator_before:!1,separator_after:!0,_disabled:!1,label:"Create",action:function(b){var c=a.jstree.reference(b.reference),d=c.get_node(b.reference);c.create_node(d,{},"last",function(a){try{c.edit(a)}catch(b){setTimeout(function(){c.edit(a)},0)}})}},rename:{separator_before:!1,separator_after:!1,_disabled:!1,label:"Rename",action:function(b){var c=a.jstree.reference(b.reference),d=c.get_node(b.reference);c.edit(d)}},remove:{separator_before:!1,icon:!1,separator_after:!1,_disabled:!1,label:"Delete",action:function(b){var c=a.jstree.reference(b.reference),d=c.get_node(b.reference);c.is_selected(d)?c.delete_node(c.get_selected()):c.delete_node(d)}},ccp:{separator_before:!0,icon:!1,separator_after:!1,label:"Edit",action:!1,submenu:{cut:{separator_before:!1,separator_after:!1,label:"Cut",action:function(b){var c=a.jstree.reference(b.reference),d=c.get_node(b.reference);c.is_selected(d)?c.cut(c.get_top_selected()):c.cut(d)}},copy:{separator_before:!1,icon:!1,separator_after:!1,label:"Copy",action:function(b){var c=a.jstree.reference(b.reference),d=c.get_node(b.reference);c.is_selected(d)?c.copy(c.get_top_selected()):c.copy(d)}},paste:{separator_before:!1,icon:!1,_disabled:function(b){return!a.jstree.reference(b.reference).can_paste()},separator_after:!1,label:"Paste",action:function(b){var c=a.jstree.reference(b.reference),d=c.get_node(b.reference);c.paste(d)}}}}}}},a.jstree.plugins.contextmenu=function(c,d){this.bind=function(){d.bind.call(this);var b=0,c=null,e,f;this.element.on("init.jstree loading.jstree ready.jstree",a.proxy(function(){this.get_container_ul().addClass("jstree-contextmenu")},this)).on("contextmenu.jstree",".jstree-anchor",a.proxy(function(a,d){"input"!==a.target.tagName.toLowerCase()&&(a.preventDefault(),b=a.ctrlKey?+new Date:0,(d||c)&&(b=+new Date+1e4),c&&clearTimeout(c),this.is_loading(a.currentTarget)||this.show_contextmenu(a.currentTarget,a.pageX,a.pageY,a))},this)).on("click.jstree",".jstree-anchor",a.proxy(function(c){this._data.contextmenu.visible&&(!b||+new Date-b>250)&&a.vakata.context.hide(),b=0},this)).on("touchstart.jstree",".jstree-anchor",function(b){b.originalEvent&&b.originalEvent.changedTouches&&b.originalEvent.changedTouches[0]&&(e=b.originalEvent.changedTouches[0].clientX,f=b.originalEvent.changedTouches[0].clientY,c=setTimeout(function(){a(b.currentTarget).trigger("contextmenu",!0)},750))}).on("touchmove.vakata.jstree",function(b){c&&b.originalEvent&&b.originalEvent.changedTouches&&b.originalEvent.changedTouches[0]&&(Math.abs(e-b.originalEvent.changedTouches[0].clientX)>10||Math.abs(f-b.originalEvent.changedTouches[0].clientY)>10)&&(clearTimeout(c),a.vakata.context.hide())}).on("touchend.vakata.jstree",function(a){c&&clearTimeout(c)}),a(i).on("context_hide.vakata.jstree",a.proxy(function(b,c){this._data.contextmenu.visible=!1,a(c.reference).removeClass("jstree-context")},this))},this.teardown=function(){this._data.contextmenu.visible&&a.vakata.context.hide(),d.teardown.call(this)},this.show_contextmenu=function(c,d,e,f){if(c=this.get_node(c),!c||c.id===a.jstree.root)return!1;var g=this.settings.contextmenu,h=this.get_node(c,!0),i=h.children(".jstree-anchor"),j=!1,k=!1;(g.show_at_node||d===b||e===b)&&(j=i.offset(),d=j.left,e=j.top+this._data.core.li_height),this.settings.contextmenu.select_node&&!this.is_selected(c)&&this.activate_node(c,f),k=g.items,a.isFunction(k)&&(k=k.call(this,c,a.proxy(function(a){this._show_contextmenu(c,d,e,a)},this))),a.isPlainObject(k)&&this._show_contextmenu(c,d,e,k)},this._show_contextmenu=function(b,c,d,e){var f=this.get_node(b,!0),g=f.children(".jstree-anchor");a(i).one("context_show.vakata.jstree",a.proxy(function(b,c){var d="jstree-contextmenu jstree-"+this.get_theme()+"-contextmenu";a(c.element).addClass(d),g.addClass("jstree-context")},this)),this._data.contextmenu.visible=!0,a.vakata.context.show(g,{x:c,y:d},e),this.trigger("show_contextmenu",{node:b,x:c,y:d})}},function(a){var b=!1,c={element:!1,reference:!1,position_x:0,position_y:0,items:[],html:"",is_visible:!1};a.vakata.context={settings:{hide_onmouseleave:0,icons:!0},_trigger:function(b){a(i).triggerHandler("context_"+b+".vakata",{reference:c.reference,element:c.element,position:{x:c.position_x,y:c.position_y}})},_execute:function(b){return b=c.items[b],b&&(!b._disabled||a.isFunction(b._disabled)&&!b._disabled({item:b,reference:c.reference,element:c.element}))&&b.action?b.action.call(null,{item:b,reference:c.reference,element:c.element,position:{x:c.position_x,y:c.position_y}}):!1},_parse:function(b,d){if(!b)return!1;d||(c.html="",c.items=[]);var e="",f=!1,g;return d&&(e+="<ul>"),a.each(b,function(b,d){return d?(c.items.push(d),!f&&d.separator_before&&(e+="<li class='vakata-context-separator'><a href='#' "+(a.vakata.context.settings.icons?"":'style="margin-left:0px;"')+">&#160;</a></li>"),f=!1,e+="<li class='"+(d._class||"")+(d._disabled===!0||a.isFunction(d._disabled)&&d._disabled({item:d,reference:c.reference,element:c.element})?" vakata-contextmenu-disabled ":"")+"' "+(d.shortcut?" data-shortcut='"+d.shortcut+"' ":"")+">",e+="<a href='#' rel='"+(c.items.length-1)+"' "+(d.title?"title='"+d.title+"'":"")+">",a.vakata.context.settings.icons&&(e+="<i ",d.icon&&(e+=-1!==d.icon.indexOf("/")||-1!==d.icon.indexOf(".")?" style='background:url(\""+d.icon+"\") center center no-repeat' ":" class='"+d.icon+"' "),e+="></i><span class='vakata-contextmenu-sep'>&#160;</span>"),e+=(a.isFunction(d.label)?d.label({item:b,reference:c.reference,element:c.element}):d.label)+(d.shortcut?' <span class="vakata-contextmenu-shortcut vakata-contextmenu-shortcut-'+d.shortcut+'">'+(d.shortcut_label||"")+"</span>":"")+"</a>",
d.submenu&&(g=a.vakata.context._parse(d.submenu,!0),g&&(e+=g)),e+="</li>",void(d.separator_after&&(e+="<li class='vakata-context-separator'><a href='#' "+(a.vakata.context.settings.icons?"":'style="margin-left:0px;"')+">&#160;</a></li>",f=!0))):!0}),e=e.replace(/<li class\='vakata-context-separator'\><\/li\>$/,""),d&&(e+="</ul>"),d||(c.html=e,a.vakata.context._trigger("parse")),e.length>10?e:!1},_show_submenu:function(c){if(c=a(c),c.length&&c.children("ul").length){var d=c.children("ul"),e=c.offset().left,f=e+c.outerWidth(),g=c.offset().top,h=d.width(),i=d.height(),j=a(window).width()+a(window).scrollLeft(),k=a(window).height()+a(window).scrollTop();b?c[f-(h+10+c.outerWidth())<0?"addClass":"removeClass"]("vakata-context-left"):c[f+h>j&&e>j-f?"addClass":"removeClass"]("vakata-context-right"),g+i+10>k&&d.css("bottom","-1px"),c.hasClass("vakata-context-right")?h>e&&d.css("margin-right",e-h):h>j-f&&d.css("margin-left",j-f-h),d.show()}},show:function(d,e,f){var g,h,j,k,l,m,n,o,p=!0;switch(c.element&&c.element.length&&c.element.width(""),p){case!e&&!d:return!1;case!!e&&!!d:c.reference=d,c.position_x=e.x,c.position_y=e.y;break;case!e&&!!d:c.reference=d,g=d.offset(),c.position_x=g.left+d.outerHeight(),c.position_y=g.top;break;case!!e&&!d:c.position_x=e.x,c.position_y=e.y}d&&!f&&a(d).data("vakata_contextmenu")&&(f=a(d).data("vakata_contextmenu")),a.vakata.context._parse(f)&&c.element.html(c.html),c.items.length&&(c.element.appendTo(i.body),h=c.element,j=c.position_x,k=c.position_y,l=h.width(),m=h.height(),n=a(window).width()+a(window).scrollLeft(),o=a(window).height()+a(window).scrollTop(),b&&(j-=h.outerWidth()-a(d).outerWidth(),j<a(window).scrollLeft()+20&&(j=a(window).scrollLeft()+20)),j+l+20>n&&(j=n-(l+20)),k+m+20>o&&(k=o-(m+20)),c.element.css({left:j,top:k}).show().find("a").first().focus().parent().addClass("vakata-context-hover"),c.is_visible=!0,a.vakata.context._trigger("show"))},hide:function(){c.is_visible&&(c.element.hide().find("ul").hide().end().find(":focus").blur().end().detach(),c.is_visible=!1,a.vakata.context._trigger("hide"))}},a(function(){b="rtl"===a(i.body).css("direction");var d=!1;c.element=a("<ul class='vakata-context'></ul>"),c.element.on("mouseenter","li",function(b){b.stopImmediatePropagation(),a.contains(this,b.relatedTarget)||(d&&clearTimeout(d),c.element.find(".vakata-context-hover").removeClass("vakata-context-hover").end(),a(this).siblings().find("ul").hide().end().end().parentsUntil(".vakata-context","li").addBack().addClass("vakata-context-hover"),a.vakata.context._show_submenu(this))}).on("mouseleave","li",function(b){a.contains(this,b.relatedTarget)||a(this).find(".vakata-context-hover").addBack().removeClass("vakata-context-hover")}).on("mouseleave",function(b){a(this).find(".vakata-context-hover").removeClass("vakata-context-hover"),a.vakata.context.settings.hide_onmouseleave&&(d=setTimeout(function(b){return function(){a.vakata.context.hide()}}(this),a.vakata.context.settings.hide_onmouseleave))}).on("click","a",function(b){b.preventDefault(),a(this).blur().parent().hasClass("vakata-context-disabled")||a.vakata.context._execute(a(this).attr("rel"))===!1||a.vakata.context.hide()}).on("keydown","a",function(b){var d=null;switch(b.which){case 13:case 32:b.type="click",b.preventDefault(),a(b.currentTarget).trigger(b);break;case 37:c.is_visible&&(c.element.find(".vakata-context-hover").last().closest("li").first().find("ul").hide().find(".vakata-context-hover").removeClass("vakata-context-hover").end().end().children("a").focus(),b.stopImmediatePropagation(),b.preventDefault());break;case 38:c.is_visible&&(d=c.element.find("ul:visible").addBack().last().children(".vakata-context-hover").removeClass("vakata-context-hover").prevAll("li:not(.vakata-context-separator)").first(),d.length||(d=c.element.find("ul:visible").addBack().last().children("li:not(.vakata-context-separator)").last()),d.addClass("vakata-context-hover").children("a").focus(),b.stopImmediatePropagation(),b.preventDefault());break;case 39:c.is_visible&&(c.element.find(".vakata-context-hover").last().children("ul").show().children("li:not(.vakata-context-separator)").removeClass("vakata-context-hover").first().addClass("vakata-context-hover").children("a").focus(),b.stopImmediatePropagation(),b.preventDefault());break;case 40:c.is_visible&&(d=c.element.find("ul:visible").addBack().last().children(".vakata-context-hover").removeClass("vakata-context-hover").nextAll("li:not(.vakata-context-separator)").first(),d.length||(d=c.element.find("ul:visible").addBack().last().children("li:not(.vakata-context-separator)").first()),d.addClass("vakata-context-hover").children("a").focus(),b.stopImmediatePropagation(),b.preventDefault());break;case 27:a.vakata.context.hide(),b.preventDefault()}}).on("keydown",function(a){a.preventDefault();var b=c.element.find(".vakata-contextmenu-shortcut-"+a.which).parent();b.parent().not(".vakata-context-disabled")&&b.click()}),a(i).on("mousedown.vakata.jstree",function(b){c.is_visible&&c.element[0]!==b.target&&!a.contains(c.element[0],b.target)&&a.vakata.context.hide()}).on("context_show.vakata.jstree",function(a,d){c.element.find("li:has(ul)").children("a").addClass("vakata-context-parent"),b&&c.element.addClass("vakata-context-rtl").css("direction","rtl"),c.element.find("ul").hide().end()})})}(a),a.jstree.defaults.dnd={copy:!0,open_timeout:500,is_draggable:!0,check_while_dragging:!0,always_copy:!1,inside_pos:0,drag_selection:!0,touch:!0,large_drop_target:!1,large_drag_target:!1,use_html5:!1};var k,l;a.jstree.plugins.dnd=function(b,c){this.init=function(a,b){c.init.call(this,a,b),this.settings.dnd.use_html5=this.settings.dnd.use_html5&&"draggable"in i.createElement("span")},this.bind=function(){c.bind.call(this),this.element.on(this.settings.dnd.use_html5?"dragstart.jstree":"mousedown.jstree touchstart.jstree",this.settings.dnd.large_drag_target?".jstree-node":".jstree-anchor",a.proxy(function(b){if(this.settings.dnd.large_drag_target&&a(b.target).closest(".jstree-node")[0]!==b.currentTarget)return!0;if("touchstart"===b.type&&(!this.settings.dnd.touch||"selected"===this.settings.dnd.touch&&!a(b.currentTarget).closest(".jstree-node").children(".jstree-anchor").hasClass("jstree-clicked")))return!0;var c=this.get_node(b.target),d=this.is_selected(c)&&this.settings.dnd.drag_selection?this.get_top_selected().length:1,e=d>1?d+" "+this.get_string("nodes"):this.get_text(b.currentTarget);if(this.settings.core.force_text&&(e=a.vakata.html.escape(e)),c&&c.id&&c.id!==a.jstree.root&&(1===b.which||"touchstart"===b.type||"dragstart"===b.type)&&(this.settings.dnd.is_draggable===!0||a.isFunction(this.settings.dnd.is_draggable)&&this.settings.dnd.is_draggable.call(this,d>1?this.get_top_selected(!0):[c],b))){if(k={jstree:!0,origin:this,obj:this.get_node(c,!0),nodes:d>1?this.get_top_selected():[c.id]},l=b.currentTarget,!this.settings.dnd.use_html5)return this.element.trigger("mousedown.jstree"),a.vakata.dnd.start(b,k,'<div id="jstree-dnd" class="jstree-'+this.get_theme()+" jstree-"+this.get_theme()+"-"+this.get_theme_variant()+" "+(this.settings.core.themes.responsive?" jstree-dnd-responsive":"")+'"><i class="jstree-icon jstree-er"></i>'+e+'<ins class="jstree-copy" style="display:none;">+</ins></div>');a.vakata.dnd._trigger("start",b,{helper:a(),element:l,data:k})}},this)),this.settings.dnd.use_html5&&this.element.on("dragover.jstree",function(b){return b.preventDefault(),a.vakata.dnd._trigger("move",b,{helper:a(),element:l,data:k}),!1}).on("drop.jstree",a.proxy(function(b){return b.preventDefault(),a.vakata.dnd._trigger("stop",b,{helper:a(),element:l,data:k}),!1},this))},this.redraw_node=function(a,b,d,e){if(a=c.redraw_node.apply(this,arguments),a&&this.settings.dnd.use_html5)if(this.settings.dnd.large_drag_target)a.setAttribute("draggable",!0);else{var f,g,h=null;for(f=0,g=a.childNodes.length;g>f;f++)if(a.childNodes[f]&&a.childNodes[f].className&&-1!==a.childNodes[f].className.indexOf("jstree-anchor")){h=a.childNodes[f];break}h&&h.setAttribute("draggable",!0)}return a}},a(function(){var c=!1,d=!1,e=!1,f=!1,g=a('<div id="jstree-marker">&#160;</div>').hide();a(i).on("dragover.vakata.jstree",function(b){l&&a.vakata.dnd._trigger("move",b,{helper:a(),element:l,data:k})}).on("drop.vakata.jstree",function(b){l&&(a.vakata.dnd._trigger("stop",b,{helper:a(),element:l,data:k}),l=null,k=null)}).on("dnd_start.vakata.jstree",function(a,b){c=!1,e=!1,b&&b.data&&b.data.jstree&&g.appendTo(i.body)}).on("dnd_move.vakata.jstree",function(h,i){var j=i.event.target!==e.target;if(f&&(!i.event||"dragover"!==i.event.type||j)&&clearTimeout(f),i&&i.data&&i.data.jstree&&(!i.event.target.id||"jstree-marker"!==i.event.target.id)){e=i.event;var k=a.jstree.reference(i.event.target),l=!1,m=!1,n=!1,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E;if(k&&k._data&&k._data.dnd)if(g.attr("class","jstree-"+k.get_theme()+(k.settings.core.themes.responsive?" jstree-dnd-responsive":"")),D=i.data.origin&&(i.data.origin.settings.dnd.always_copy||i.data.origin.settings.dnd.copy&&(i.event.metaKey||i.event.ctrlKey)),i.helper.children().attr("class","jstree-"+k.get_theme()+" jstree-"+k.get_theme()+"-"+k.get_theme_variant()+" "+(k.settings.core.themes.responsive?" jstree-dnd-responsive":"")).find(".jstree-copy").first()[D?"show":"hide"](),i.event.target!==k.element[0]&&i.event.target!==k.get_container_ul()[0]||0!==k.get_container_ul().children().length){if(l=k.settings.dnd.large_drop_target?a(i.event.target).closest(".jstree-node").children(".jstree-anchor"):a(i.event.target).closest(".jstree-anchor"),l&&l.length&&l.parent().is(".jstree-closed, .jstree-open, .jstree-leaf")&&(m=l.offset(),n=(i.event.pageY!==b?i.event.pageY:i.event.originalEvent.pageY)-m.top,r=l.outerHeight(),u=r/3>n?["b","i","a"]:n>r-r/3?["a","i","b"]:n>r/2?["i","a","b"]:["i","b","a"],a.each(u,function(b,e){switch(e){case"b":p=m.left-6,q=m.top,s=k.get_parent(l),t=l.parent().index();break;case"i":B=k.settings.dnd.inside_pos,C=k.get_node(l.parent()),p=m.left-2,q=m.top+r/2+1,s=C.id,t="first"===B?0:"last"===B?C.children.length:Math.min(B,C.children.length);break;case"a":p=m.left-6,q=m.top+r,s=k.get_parent(l),t=l.parent().index()+1}for(v=!0,w=0,x=i.data.nodes.length;x>w;w++)if(y=i.data.origin&&(i.data.origin.settings.dnd.always_copy||i.data.origin.settings.dnd.copy&&(i.event.metaKey||i.event.ctrlKey))?"copy_node":"move_node",z=t,"move_node"===y&&"a"===e&&i.data.origin&&i.data.origin===k&&s===k.get_parent(i.data.nodes[w])&&(A=k.get_node(s),z>a.inArray(i.data.nodes[w],A.children)&&(z-=1)),v=v&&(k&&k.settings&&k.settings.dnd&&k.settings.dnd.check_while_dragging===!1||k.check(y,i.data.origin&&i.data.origin!==k?i.data.origin.get_node(i.data.nodes[w]):i.data.nodes[w],s,z,{dnd:!0,ref:k.get_node(l.parent()),pos:e,origin:i.data.origin,is_multi:i.data.origin&&i.data.origin!==k,is_foreign:!i.data.origin})),!v){k&&k.last_error&&(d=k.last_error());break}return"i"===e&&l.parent().is(".jstree-closed")&&k.settings.dnd.open_timeout&&(!i.event||"dragover"!==i.event.type||j)&&(f&&clearTimeout(f),f=setTimeout(function(a,b){return function(){a.open_node(b)}}(k,l),k.settings.dnd.open_timeout)),v?(E=k.get_node(s,!0),E.hasClass(".jstree-dnd-parent")||(a(".jstree-dnd-parent").removeClass("jstree-dnd-parent"),E.addClass("jstree-dnd-parent")),c={ins:k,par:s,pos:"i"!==e||"last"!==B||0!==t||k.is_loaded(C)?t:"last"},g.css({left:p+"px",top:q+"px"}).show(),i.helper.find(".jstree-icon").first().removeClass("jstree-er").addClass("jstree-ok"),i.event.originalEvent&&i.event.originalEvent.dataTransfer&&(i.event.originalEvent.dataTransfer.dropEffect=D?"copy":"move"),d={},u=!0,!1):void 0}),u===!0))return}else{for(v=!0,w=0,x=i.data.nodes.length;x>w;w++)if(v=v&&k.check(i.data.origin&&(i.data.origin.settings.dnd.always_copy||i.data.origin.settings.dnd.copy&&(i.event.metaKey||i.event.ctrlKey))?"copy_node":"move_node",i.data.origin&&i.data.origin!==k?i.data.origin.get_node(i.data.nodes[w]):i.data.nodes[w],a.jstree.root,"last",{dnd:!0,ref:k.get_node(a.jstree.root),pos:"i",origin:i.data.origin,is_multi:i.data.origin&&i.data.origin!==k,is_foreign:!i.data.origin}),!v)break;if(v)return c={ins:k,par:a.jstree.root,pos:"last"},g.hide(),i.helper.find(".jstree-icon").first().removeClass("jstree-er").addClass("jstree-ok"),void(i.event.originalEvent&&i.event.originalEvent.dataTransfer&&(i.event.originalEvent.dataTransfer.dropEffect=D?"copy":"move"))}a(".jstree-dnd-parent").removeClass("jstree-dnd-parent"),c=!1,i.helper.find(".jstree-icon").removeClass("jstree-ok").addClass("jstree-er"),i.event.originalEvent&&i.event.originalEvent.dataTransfer,g.hide()}}).on("dnd_scroll.vakata.jstree",function(a,b){b&&b.data&&b.data.jstree&&(g.hide(),c=!1,e=!1,b.helper.find(".jstree-icon").first().removeClass("jstree-ok").addClass("jstree-er"))}).on("dnd_stop.vakata.jstree",function(b,h){if(a(".jstree-dnd-parent").removeClass("jstree-dnd-parent"),f&&clearTimeout(f),h&&h.data&&h.data.jstree){g.hide().detach();var i,j,k=[];if(c){for(i=0,j=h.data.nodes.length;j>i;i++)k[i]=h.data.origin?h.data.origin.get_node(h.data.nodes[i]):h.data.nodes[i];c.ins[h.data.origin&&(h.data.origin.settings.dnd.always_copy||h.data.origin.settings.dnd.copy&&(h.event.metaKey||h.event.ctrlKey))?"copy_node":"move_node"](k,c.par,c.pos,!1,!1,!1,h.data.origin)}else i=a(h.event.target).closest(".jstree"),i.length&&d&&d.error&&"check"===d.error&&(i=i.jstree(!0),i&&i.settings.core.error.call(this,d));e=!1,c=!1}}).on("keyup.jstree keydown.jstree",function(b,h){h=a.vakata.dnd._get(),h&&h.data&&h.data.jstree&&("keyup"===b.type&&27===b.which?(f&&clearTimeout(f),c=!1,d=!1,e=!1,f=!1,g.hide().detach(),a.vakata.dnd._clean()):(h.helper.find(".jstree-copy").first()[h.data.origin&&(h.data.origin.settings.dnd.always_copy||h.data.origin.settings.dnd.copy&&(b.metaKey||b.ctrlKey))?"show":"hide"](),e&&(e.metaKey=b.metaKey,e.ctrlKey=b.ctrlKey,a.vakata.dnd._trigger("move",e))))})}),function(a){a.vakata.html={div:a("<div />"),escape:function(b){return a.vakata.html.div.text(b).html()},strip:function(b){return a.vakata.html.div.empty().append(a.parseHTML(b)).text()}};var c={element:!1,target:!1,is_down:!1,is_drag:!1,helper:!1,helper_w:0,data:!1,init_x:0,init_y:0,scroll_l:0,scroll_t:0,scroll_e:!1,scroll_i:!1,is_touch:!1};a.vakata.dnd={settings:{scroll_speed:10,scroll_proximity:20,helper_left:5,helper_top:10,threshold:5,threshold_touch:10},_trigger:function(c,d,e){e===b&&(e=a.vakata.dnd._get()),e.event=d,a(i).triggerHandler("dnd_"+c+".vakata",e)},_get:function(){return{data:c.data,element:c.element,helper:c.helper}},_clean:function(){c.helper&&c.helper.remove(),c.scroll_i&&(clearInterval(c.scroll_i),c.scroll_i=!1),c={element:!1,target:!1,is_down:!1,is_drag:!1,helper:!1,helper_w:0,data:!1,init_x:0,init_y:0,scroll_l:0,scroll_t:0,scroll_e:!1,scroll_i:!1,is_touch:!1},a(i).off("mousemove.vakata.jstree touchmove.vakata.jstree",a.vakata.dnd.drag),a(i).off("mouseup.vakata.jstree touchend.vakata.jstree",a.vakata.dnd.stop)},_scroll:function(b){if(!c.scroll_e||!c.scroll_l&&!c.scroll_t)return c.scroll_i&&(clearInterval(c.scroll_i),c.scroll_i=!1),!1;if(!c.scroll_i)return c.scroll_i=setInterval(a.vakata.dnd._scroll,100),!1;if(b===!0)return!1;var d=c.scroll_e.scrollTop(),e=c.scroll_e.scrollLeft();c.scroll_e.scrollTop(d+c.scroll_t*a.vakata.dnd.settings.scroll_speed),c.scroll_e.scrollLeft(e+c.scroll_l*a.vakata.dnd.settings.scroll_speed),(d!==c.scroll_e.scrollTop()||e!==c.scroll_e.scrollLeft())&&a.vakata.dnd._trigger("scroll",c.scroll_e)},start:function(b,d,e){"touchstart"===b.type&&b.originalEvent&&b.originalEvent.changedTouches&&b.originalEvent.changedTouches[0]&&(b.pageX=b.originalEvent.changedTouches[0].pageX,b.pageY=b.originalEvent.changedTouches[0].pageY,b.target=i.elementFromPoint(b.originalEvent.changedTouches[0].pageX-window.pageXOffset,b.originalEvent.changedTouches[0].pageY-window.pageYOffset)),c.is_drag&&a.vakata.dnd.stop({});try{b.currentTarget.unselectable="on",b.currentTarget.onselectstart=function(){return!1},b.currentTarget.style&&(b.currentTarget.style.touchAction="none",b.currentTarget.style.msTouchAction="none",b.currentTarget.style.MozUserSelect="none")}catch(f){}return c.init_x=b.pageX,c.init_y=b.pageY,c.data=d,c.is_down=!0,c.element=b.currentTarget,c.target=b.target,c.is_touch="touchstart"===b.type,e!==!1&&(c.helper=a("<div id='vakata-dnd'></div>").html(e).css({display:"block",margin:"0",padding:"0",position:"absolute",top:"-2000px",lineHeight:"16px",zIndex:"10000"})),a(i).on("mousemove.vakata.jstree touchmove.vakata.jstree",a.vakata.dnd.drag),a(i).on("mouseup.vakata.jstree touchend.vakata.jstree",a.vakata.dnd.stop),!1},drag:function(b){if("touchmove"===b.type&&b.originalEvent&&b.originalEvent.changedTouches&&b.originalEvent.changedTouches[0]&&(b.pageX=b.originalEvent.changedTouches[0].pageX,b.pageY=b.originalEvent.changedTouches[0].pageY,b.target=i.elementFromPoint(b.originalEvent.changedTouches[0].pageX-window.pageXOffset,b.originalEvent.changedTouches[0].pageY-window.pageYOffset)),c.is_down){if(!c.is_drag){if(!(Math.abs(b.pageX-c.init_x)>(c.is_touch?a.vakata.dnd.settings.threshold_touch:a.vakata.dnd.settings.threshold)||Math.abs(b.pageY-c.init_y)>(c.is_touch?a.vakata.dnd.settings.threshold_touch:a.vakata.dnd.settings.threshold)))return;c.helper&&(c.helper.appendTo(i.body),c.helper_w=c.helper.outerWidth()),c.is_drag=!0,a(c.target).one("click.vakata",!1),a.vakata.dnd._trigger("start",b)}var d=!1,e=!1,f=!1,g=!1,h=!1,j=!1,k=!1,l=!1,m=!1,n=!1;return c.scroll_t=0,c.scroll_l=0,c.scroll_e=!1,a(a(b.target).parentsUntil("body").addBack().get().reverse()).filter(function(){return/^auto|scroll$/.test(a(this).css("overflow"))&&(this.scrollHeight>this.offsetHeight||this.scrollWidth>this.offsetWidth)}).each(function(){var d=a(this),e=d.offset();return this.scrollHeight>this.offsetHeight&&(e.top+d.height()-b.pageY<a.vakata.dnd.settings.scroll_proximity&&(c.scroll_t=1),b.pageY-e.top<a.vakata.dnd.settings.scroll_proximity&&(c.scroll_t=-1)),this.scrollWidth>this.offsetWidth&&(e.left+d.width()-b.pageX<a.vakata.dnd.settings.scroll_proximity&&(c.scroll_l=1),b.pageX-e.left<a.vakata.dnd.settings.scroll_proximity&&(c.scroll_l=-1)),c.scroll_t||c.scroll_l?(c.scroll_e=a(this),!1):void 0}),c.scroll_e||(d=a(i),e=a(window),f=d.height(),g=e.height(),h=d.width(),j=e.width(),k=d.scrollTop(),l=d.scrollLeft(),f>g&&b.pageY-k<a.vakata.dnd.settings.scroll_proximity&&(c.scroll_t=-1),f>g&&g-(b.pageY-k)<a.vakata.dnd.settings.scroll_proximity&&(c.scroll_t=1),h>j&&b.pageX-l<a.vakata.dnd.settings.scroll_proximity&&(c.scroll_l=-1),h>j&&j-(b.pageX-l)<a.vakata.dnd.settings.scroll_proximity&&(c.scroll_l=1),(c.scroll_t||c.scroll_l)&&(c.scroll_e=d)),c.scroll_e&&a.vakata.dnd._scroll(!0),c.helper&&(m=parseInt(b.pageY+a.vakata.dnd.settings.helper_top,10),n=parseInt(b.pageX+a.vakata.dnd.settings.helper_left,10),f&&m+25>f&&(m=f-50),h&&n+c.helper_w>h&&(n=h-(c.helper_w+2)),c.helper.css({left:n+"px",top:m+"px"})),a.vakata.dnd._trigger("move",b),!1}},stop:function(b){if("touchend"===b.type&&b.originalEvent&&b.originalEvent.changedTouches&&b.originalEvent.changedTouches[0]&&(b.pageX=b.originalEvent.changedTouches[0].pageX,b.pageY=b.originalEvent.changedTouches[0].pageY,b.target=i.elementFromPoint(b.originalEvent.changedTouches[0].pageX-window.pageXOffset,b.originalEvent.changedTouches[0].pageY-window.pageYOffset)),c.is_drag)b.target!==c.target&&a(c.target).off("click.vakata"),a.vakata.dnd._trigger("stop",b);else if("touchend"===b.type&&b.target===c.target){var d=setTimeout(function(){a(b.target).click()},100);a(b.target).one("click",function(){d&&clearTimeout(d)})}return a.vakata.dnd._clean(),!1}}}(a),a.jstree.defaults.massload=null,a.jstree.plugins.massload=function(b,c){this.init=function(a,b){this._data.massload={},c.init.call(this,a,b)},this._load_nodes=function(b,d,e,f){var g=this.settings.massload,h=JSON.stringify(b),i=[],j=this._model.data,k,l,m;if(!e){for(k=0,l=b.length;l>k;k++)(!j[b[k]]||!j[b[k]].state.loaded&&!j[b[k]].state.failed||f)&&(i.push(b[k]),m=this.get_node(b[k],!0),m&&m.length&&m.addClass("jstree-loading").attr("aria-busy",!0));if(this._data.massload={},i.length){if(a.isFunction(g))return g.call(this,i,a.proxy(function(a){var g,h;if(a)for(g in a)a.hasOwnProperty(g)&&(this._data.massload[g]=a[g]);for(g=0,h=b.length;h>g;g++)m=this.get_node(b[g],!0),m&&m.length&&m.removeClass("jstree-loading").attr("aria-busy",!1);c._load_nodes.call(this,b,d,e,f)},this));if("object"==typeof g&&g&&g.url)return g=a.extend(!0,{},g),a.isFunction(g.url)&&(g.url=g.url.call(this,i)),a.isFunction(g.data)&&(g.data=g.data.call(this,i)),a.ajax(g).done(a.proxy(function(a,g,h){var i,j;if(a)for(i in a)a.hasOwnProperty(i)&&(this._data.massload[i]=a[i]);for(i=0,j=b.length;j>i;i++)m=this.get_node(b[i],!0),m&&m.length&&m.removeClass("jstree-loading").attr("aria-busy",!1);c._load_nodes.call(this,b,d,e,f)},this)).fail(a.proxy(function(a){c._load_nodes.call(this,b,d,e,f)},this))}}return c._load_nodes.call(this,b,d,e,f)},this._load_node=function(b,d){var e=this._data.massload[b.id],f=null,g;return e?(f=this["string"==typeof e?"_append_html_data":"_append_json_data"](b,"string"==typeof e?a(a.parseHTML(e)).filter(function(){return 3!==this.nodeType}):e,function(a){d.call(this,a)}),g=this.get_node(b.id,!0),g&&g.length&&g.removeClass("jstree-loading").attr("aria-busy",!1),delete this._data.massload[b.id],f):c._load_node.call(this,b,d)}},a.jstree.defaults.search={ajax:!1,fuzzy:!1,case_sensitive:!1,show_only_matches:!1,show_only_matches_children:!1,close_opened_onclear:!0,search_leaves_only:!1,search_callback:!1},a.jstree.plugins.search=function(c,d){this.bind=function(){d.bind.call(this),this._data.search.str="",this._data.search.dom=a(),this._data.search.res=[],this._data.search.opn=[],this._data.search.som=!1,this._data.search.smc=!1,this._data.search.hdn=[],this.element.on("search.jstree",a.proxy(function(b,c){if(this._data.search.som&&c.res.length){var d=this._model.data,e,f,g=[],h,i;for(e=0,f=c.res.length;f>e;e++)if(d[c.res[e]]&&!d[c.res[e]].state.hidden&&(g.push(c.res[e]),g=g.concat(d[c.res[e]].parents),this._data.search.smc))for(h=0,i=d[c.res[e]].children_d.length;i>h;h++)d[d[c.res[e]].children_d[h]]&&!d[d[c.res[e]].children_d[h]].state.hidden&&g.push(d[c.res[e]].children_d[h]);g=a.vakata.array_remove_item(a.vakata.array_unique(g),a.jstree.root),this._data.search.hdn=this.hide_all(!0),this.show_node(g,!0),this.redraw(!0)}},this)).on("clear_search.jstree",a.proxy(function(a,b){this._data.search.som&&b.res.length&&(this.show_node(this._data.search.hdn,!0),this.redraw(!0))},this))},this.search=function(c,d,e,f,g,h){if(c===!1||""===a.trim(c.toString()))return this.clear_search();f=this.get_node(f),f=f&&f.id?f.id:null,c=c.toString();var i=this.settings.search,j=i.ajax?i.ajax:!1,k=this._model.data,l=null,m=[],n=[],o,p;if(this._data.search.res.length&&!g&&this.clear_search(),e===b&&(e=i.show_only_matches),h===b&&(h=i.show_only_matches_children),!d&&j!==!1)return a.isFunction(j)?j.call(this,c,a.proxy(function(b){b&&b.d&&(b=b.d),this._load_nodes(a.isArray(b)?a.vakata.array_unique(b):[],function(){this.search(c,!0,e,f,g,h)})},this),f):(j=a.extend({},j),j.data||(j.data={}),j.data.str=c,f&&(j.data.inside=f),this._data.search.lastRequest&&this._data.search.lastRequest.abort(),this._data.search.lastRequest=a.ajax(j).fail(a.proxy(function(){this._data.core.last_error={error:"ajax",plugin:"search",id:"search_01",reason:"Could not load search parents",data:JSON.stringify(j)},this.settings.core.error.call(this,this._data.core.last_error)},this)).done(a.proxy(function(b){b&&b.d&&(b=b.d),this._load_nodes(a.isArray(b)?a.vakata.array_unique(b):[],function(){this.search(c,!0,e,f,g,h)})},this)),this._data.search.lastRequest);if(g||(this._data.search.str=c,this._data.search.dom=a(),this._data.search.res=[],this._data.search.opn=[],this._data.search.som=e,this._data.search.smc=h),l=new a.vakata.search(c,!0,{caseSensitive:i.case_sensitive,fuzzy:i.fuzzy}),a.each(k[f?f:a.jstree.root].children_d,function(a,b){var d=k[b];d.text&&!d.state.hidden&&(!i.search_leaves_only||d.state.loaded&&0===d.children.length)&&(i.search_callback&&i.search_callback.call(this,c,d)||!i.search_callback&&l.search(d.text).isMatch)&&(m.push(b),n=n.concat(d.parents))}),m.length){for(n=a.vakata.array_unique(n),o=0,p=n.length;p>o;o++)n[o]!==a.jstree.root&&k[n[o]]&&this.open_node(n[o],null,0)===!0&&this._data.search.opn.push(n[o]);g?(this._data.search.dom=this._data.search.dom.add(a(this.element[0].querySelectorAll("#"+a.map(m,function(b){return-1!=="0123456789".indexOf(b[0])?"\\3"+b[0]+" "+b.substr(1).replace(a.jstree.idregex,"\\$&"):b.replace(a.jstree.idregex,"\\$&")}).join(", #")))),this._data.search.res=a.vakata.array_unique(this._data.search.res.concat(m))):(this._data.search.dom=a(this.element[0].querySelectorAll("#"+a.map(m,function(b){return-1!=="0123456789".indexOf(b[0])?"\\3"+b[0]+" "+b.substr(1).replace(a.jstree.idregex,"\\$&"):b.replace(a.jstree.idregex,"\\$&")}).join(", #"))),this._data.search.res=m),this._data.search.dom.children(".jstree-anchor").addClass("jstree-search")}this.trigger("search",{nodes:this._data.search.dom,str:c,res:this._data.search.res,show_only_matches:e})},this.clear_search=function(){this.settings.search.close_opened_onclear&&this.close_node(this._data.search.opn,0),this.trigger("clear_search",{nodes:this._data.search.dom,str:this._data.search.str,res:this._data.search.res}),this._data.search.res.length&&(this._data.search.dom=a(this.element[0].querySelectorAll("#"+a.map(this._data.search.res,function(b){return-1!=="0123456789".indexOf(b[0])?"\\3"+b[0]+" "+b.substr(1).replace(a.jstree.idregex,"\\$&"):b.replace(a.jstree.idregex,"\\$&")}).join(", #"))),this._data.search.dom.children(".jstree-anchor").removeClass("jstree-search")),this._data.search.str="",this._data.search.res=[],this._data.search.opn=[],this._data.search.dom=a()},this.redraw_node=function(b,c,e,f){if(b=d.redraw_node.apply(this,arguments),b&&-1!==a.inArray(b.id,this._data.search.res)){var g,h,i=null;for(g=0,h=b.childNodes.length;h>g;g++)if(b.childNodes[g]&&b.childNodes[g].className&&-1!==b.childNodes[g].className.indexOf("jstree-anchor")){i=b.childNodes[g];break}i&&(i.className+=" jstree-search")}return b}},function(a){a.vakata.search=function(b,c,d){d=d||{},d=a.extend({},a.vakata.search.defaults,d),d.fuzzy!==!1&&(d.fuzzy=!0),b=d.caseSensitive?b:b.toLowerCase();var e=d.location,f=d.distance,g=d.threshold,h=b.length,i,j,k,l;return h>32&&(d.fuzzy=!1),d.fuzzy&&(i=1<<h-1,j=function(){var a={},c=0;for(c=0;h>c;c++)a[b.charAt(c)]=0;for(c=0;h>c;c++)a[b.charAt(c)]|=1<<h-c-1;return a}(),k=function(a,b){var c=a/h,d=Math.abs(e-b);return f?c+d/f:d?1:c}),l=function(a){if(a=d.caseSensitive?a:a.toLowerCase(),b===a||-1!==a.indexOf(b))return{isMatch:!0,score:0};if(!d.fuzzy)return{isMatch:!1,score:1};var c,f,l=a.length,m=g,n=a.indexOf(b,e),o,p,q=h+l,r,s,t,u,v,w=1,x=[];for(-1!==n&&(m=Math.min(k(0,n),m),n=a.lastIndexOf(b,e+h),-1!==n&&(m=Math.min(k(0,n),m))),n=-1,c=0;h>c;c++){o=0,p=q;while(p>o)k(c,e+p)<=m?o=p:q=p,p=Math.floor((q-o)/2+o);for(q=p,s=Math.max(1,e-p+1),t=Math.min(e+p,l)+h,u=new Array(t+2),u[t+1]=(1<<c)-1,f=t;f>=s;f--)if(v=j[a.charAt(f-1)],0===c?u[f]=(u[f+1]<<1|1)&v:u[f]=(u[f+1]<<1|1)&v|((r[f+1]|r[f])<<1|1)|r[f+1],u[f]&i&&(w=k(c,f-1),m>=w)){if(m=w,n=f-1,x.push(n),!(n>e))break;s=Math.max(1,2*e-n)}if(k(c+1,e)>m)break;r=u}return{isMatch:n>=0,score:w}},c===!0?{search:l}:l(c)},a.vakata.search.defaults={location:0,distance:100,threshold:.6,fuzzy:!1,caseSensitive:!1}}(a),a.jstree.defaults.sort=function(a,b){return this.get_text(a)>this.get_text(b)?1:-1},a.jstree.plugins.sort=function(b,c){this.bind=function(){c.bind.call(this),this.element.on("model.jstree",a.proxy(function(a,b){this.sort(b.parent,!0)},this)).on("rename_node.jstree create_node.jstree",a.proxy(function(a,b){this.sort(b.parent||b.node.parent,!1),this.redraw_node(b.parent||b.node.parent,!0)},this)).on("move_node.jstree copy_node.jstree",a.proxy(function(a,b){this.sort(b.parent,!1),this.redraw_node(b.parent,!0)},this))},this.sort=function(b,c){var d,e;if(b=this.get_node(b),b&&b.children&&b.children.length&&(b.children.sort(a.proxy(this.settings.sort,this)),c))for(d=0,e=b.children_d.length;e>d;d++)this.sort(b.children_d[d],!1)}};var m=!1;a.jstree.defaults.state={key:"jstree",events:"changed.jstree open_node.jstree close_node.jstree check_node.jstree uncheck_node.jstree",ttl:!1,filter:!1,preserve_loaded:!1},a.jstree.plugins.state=function(b,c){this.bind=function(){c.bind.call(this);var b=a.proxy(function(){this.element.on(this.settings.state.events,a.proxy(function(){m&&clearTimeout(m),m=setTimeout(a.proxy(function(){this.save_state()},this),100)},this)),this.trigger("state_ready")},this);this.element.on("ready.jstree",a.proxy(function(a,c){this.element.one("restore_state.jstree",b),this.restore_state()||b()},this))},this.save_state=function(){var b=this.get_state();this.settings.state.preserve_loaded||delete b.core.loaded;var c={state:b,ttl:this.settings.state.ttl,sec:+new Date};a.vakata.storage.set(this.settings.state.key,JSON.stringify(c))},this.restore_state=function(){var b=a.vakata.storage.get(this.settings.state.key);if(b)try{b=JSON.parse(b)}catch(c){return!1}return b&&b.ttl&&b.sec&&+new Date-b.sec>b.ttl?!1:(b&&b.state&&(b=b.state),b&&a.isFunction(this.settings.state.filter)&&(b=this.settings.state.filter.call(this,b)),b?(this.settings.state.preserve_loaded||delete b.core.loaded,this.element.one("set_state.jstree",function(c,d){d.instance.trigger("restore_state",{state:a.extend(!0,{},b)})}),this.set_state(b),!0):!1)},this.clear_state=function(){return a.vakata.storage.del(this.settings.state.key)}},function(a,b){a.vakata.storage={set:function(a,b){return window.localStorage.setItem(a,b)},get:function(a){return window.localStorage.getItem(a)},del:function(a){return window.localStorage.removeItem(a)}}}(a),a.jstree.defaults.types={"default":{}},a.jstree.defaults.types[a.jstree.root]={},a.jstree.plugins.types=function(c,d){this.init=function(c,e){var f,g;if(e&&e.types&&e.types["default"])for(f in e.types)if("default"!==f&&f!==a.jstree.root&&e.types.hasOwnProperty(f))for(g in e.types["default"])e.types["default"].hasOwnProperty(g)&&e.types[f][g]===b&&(e.types[f][g]=e.types["default"][g]);d.init.call(this,c,e),this._model.data[a.jstree.root].type=a.jstree.root},this.refresh=function(b,c){d.refresh.call(this,b,c),this._model.data[a.jstree.root].type=a.jstree.root},this.bind=function(){this.element.on("model.jstree",a.proxy(function(c,d){var e=this._model.data,f=d.nodes,g=this.settings.types,h,i,j="default",k;for(h=0,i=f.length;i>h;h++){if(j="default",e[f[h]].original&&e[f[h]].original.type&&g[e[f[h]].original.type]&&(j=e[f[h]].original.type),e[f[h]].data&&e[f[h]].data.jstree&&e[f[h]].data.jstree.type&&g[e[f[h]].data.jstree.type]&&(j=e[f[h]].data.jstree.type),e[f[h]].type=j,e[f[h]].icon===!0&&g[j].icon!==b&&(e[f[h]].icon=g[j].icon),g[j].li_attr!==b&&"object"==typeof g[j].li_attr)for(k in g[j].li_attr)if(g[j].li_attr.hasOwnProperty(k)){if("id"===k)continue;e[f[h]].li_attr[k]===b?e[f[h]].li_attr[k]=g[j].li_attr[k]:"class"===k&&(e[f[h]].li_attr["class"]=g[j].li_attr["class"]+" "+e[f[h]].li_attr["class"])}if(g[j].a_attr!==b&&"object"==typeof g[j].a_attr)for(k in g[j].a_attr)if(g[j].a_attr.hasOwnProperty(k)){if("id"===k)continue;e[f[h]].a_attr[k]===b?e[f[h]].a_attr[k]=g[j].a_attr[k]:"href"===k&&"#"===e[f[h]].a_attr[k]?e[f[h]].a_attr.href=g[j].a_attr.href:"class"===k&&(e[f[h]].a_attr["class"]=g[j].a_attr["class"]+" "+e[f[h]].a_attr["class"])}}e[a.jstree.root].type=a.jstree.root},this)),d.bind.call(this)},this.get_json=function(b,c,e){var f,g,h=this._model.data,i=c?a.extend(!0,{},c,{no_id:!1}):{},j=d.get_json.call(this,b,i,e);if(j===!1)return!1;if(a.isArray(j))for(f=0,g=j.length;g>f;f++)j[f].type=j[f].id&&h[j[f].id]&&h[j[f].id].type?h[j[f].id].type:"default",c&&c.no_id&&(delete j[f].id,j[f].li_attr&&j[f].li_attr.id&&delete j[f].li_attr.id,j[f].a_attr&&j[f].a_attr.id&&delete j[f].a_attr.id);else j.type=j.id&&h[j.id]&&h[j.id].type?h[j.id].type:"default",c&&c.no_id&&(j=this._delete_ids(j));return j},this._delete_ids=function(b){if(a.isArray(b)){for(var c=0,d=b.length;d>c;c++)b[c]=this._delete_ids(b[c]);return b}return delete b.id,
b.li_attr&&b.li_attr.id&&delete b.li_attr.id,b.a_attr&&b.a_attr.id&&delete b.a_attr.id,b.children&&a.isArray(b.children)&&(b.children=this._delete_ids(b.children)),b},this.check=function(c,e,f,g,h){if(d.check.call(this,c,e,f,g,h)===!1)return!1;e=e&&e.id?e:this.get_node(e),f=f&&f.id?f:this.get_node(f);var i=e&&e.id?h&&h.origin?h.origin:a.jstree.reference(e.id):null,j,k,l,m;switch(i=i&&i._model&&i._model.data?i._model.data:null,c){case"create_node":case"move_node":case"copy_node":if("move_node"!==c||-1===a.inArray(e.id,f.children)){if(j=this.get_rules(f),j.max_children!==b&&-1!==j.max_children&&j.max_children===f.children.length)return this._data.core.last_error={error:"check",plugin:"types",id:"types_01",reason:"max_children prevents function: "+c,data:JSON.stringify({chk:c,pos:g,obj:e&&e.id?e.id:!1,par:f&&f.id?f.id:!1})},!1;if(j.valid_children!==b&&-1!==j.valid_children&&-1===a.inArray(e.type||"default",j.valid_children))return this._data.core.last_error={error:"check",plugin:"types",id:"types_02",reason:"valid_children prevents function: "+c,data:JSON.stringify({chk:c,pos:g,obj:e&&e.id?e.id:!1,par:f&&f.id?f.id:!1})},!1;if(i&&e.children_d&&e.parents){for(k=0,l=0,m=e.children_d.length;m>l;l++)k=Math.max(k,i[e.children_d[l]].parents.length);k=k-e.parents.length+1}(0>=k||k===b)&&(k=1);do{if(j.max_depth!==b&&-1!==j.max_depth&&j.max_depth<k)return this._data.core.last_error={error:"check",plugin:"types",id:"types_03",reason:"max_depth prevents function: "+c,data:JSON.stringify({chk:c,pos:g,obj:e&&e.id?e.id:!1,par:f&&f.id?f.id:!1})},!1;f=this.get_node(f.parent),j=this.get_rules(f),k++}while(f)}}return!0},this.get_rules=function(a){if(a=this.get_node(a),!a)return!1;var c=this.get_type(a,!0);return c.max_depth===b&&(c.max_depth=-1),c.max_children===b&&(c.max_children=-1),c.valid_children===b&&(c.valid_children=-1),c},this.get_type=function(b,c){return b=this.get_node(b),b?c?a.extend({type:b.type},this.settings.types[b.type]):b.type:!1},this.set_type=function(c,d){var e=this._model.data,f,g,h,i,j,k,l,m;if(a.isArray(c)){for(c=c.slice(),g=0,h=c.length;h>g;g++)this.set_type(c[g],d);return!0}if(f=this.settings.types,c=this.get_node(c),!f[d]||!c)return!1;if(l=this.get_node(c,!0),l&&l.length&&(m=l.children(".jstree-anchor")),i=c.type,j=this.get_icon(c),c.type=d,(j===!0||!f[i]||f[i].icon!==b&&j===f[i].icon)&&this.set_icon(c,f[d].icon!==b?f[d].icon:!0),f[i]&&f[i].li_attr!==b&&"object"==typeof f[i].li_attr)for(k in f[i].li_attr)if(f[i].li_attr.hasOwnProperty(k)){if("id"===k)continue;"class"===k?(e[c.id].li_attr["class"]=(e[c.id].li_attr["class"]||"").replace(f[i].li_attr[k],""),l&&l.removeClass(f[i].li_attr[k])):e[c.id].li_attr[k]===f[i].li_attr[k]&&(e[c.id].li_attr[k]=null,l&&l.removeAttr(k))}if(f[i]&&f[i].a_attr!==b&&"object"==typeof f[i].a_attr)for(k in f[i].a_attr)if(f[i].a_attr.hasOwnProperty(k)){if("id"===k)continue;"class"===k?(e[c.id].a_attr["class"]=(e[c.id].a_attr["class"]||"").replace(f[i].a_attr[k],""),m&&m.removeClass(f[i].a_attr[k])):e[c.id].a_attr[k]===f[i].a_attr[k]&&("href"===k?(e[c.id].a_attr[k]="#",m&&m.attr("href","#")):(delete e[c.id].a_attr[k],m&&m.removeAttr(k)))}if(f[d].li_attr!==b&&"object"==typeof f[d].li_attr)for(k in f[d].li_attr)if(f[d].li_attr.hasOwnProperty(k)){if("id"===k)continue;e[c.id].li_attr[k]===b?(e[c.id].li_attr[k]=f[d].li_attr[k],l&&("class"===k?l.addClass(f[d].li_attr[k]):l.attr(k,f[d].li_attr[k]))):"class"===k&&(e[c.id].li_attr["class"]=f[d].li_attr[k]+" "+e[c.id].li_attr["class"],l&&l.addClass(f[d].li_attr[k]))}if(f[d].a_attr!==b&&"object"==typeof f[d].a_attr)for(k in f[d].a_attr)if(f[d].a_attr.hasOwnProperty(k)){if("id"===k)continue;e[c.id].a_attr[k]===b?(e[c.id].a_attr[k]=f[d].a_attr[k],m&&("class"===k?m.addClass(f[d].a_attr[k]):m.attr(k,f[d].a_attr[k]))):"href"===k&&"#"===e[c.id].a_attr[k]?(e[c.id].a_attr.href=f[d].a_attr.href,m&&m.attr("href",f[d].a_attr.href)):"class"===k&&(e[c.id].a_attr["class"]=f[d].a_attr["class"]+" "+e[c.id].a_attr["class"],m&&m.addClass(f[d].a_attr[k]))}return!0}},a.jstree.defaults.unique={case_sensitive:!1,trim_whitespace:!1,duplicate:function(a,b){return a+" ("+b+")"}},a.jstree.plugins.unique=function(c,d){this.check=function(b,c,e,f,g){if(d.check.call(this,b,c,e,f,g)===!1)return!1;if(c=c&&c.id?c:this.get_node(c),e=e&&e.id?e:this.get_node(e),!e||!e.children)return!0;var h="rename_node"===b?f:c.text,i=[],j=this.settings.unique.case_sensitive,k=this.settings.unique.trim_whitespace,l=this._model.data,m,n,o;for(m=0,n=e.children.length;n>m;m++)o=l[e.children[m]].text,j||(o=o.toLowerCase()),k&&(o=o.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")),i.push(o);switch(j||(h=h.toLowerCase()),k&&(h=h.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")),b){case"delete_node":return!0;case"rename_node":return o=c.text||"",j||(o=o.toLowerCase()),k&&(o=o.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")),m=-1===a.inArray(h,i)||c.text&&o===h,m||(this._data.core.last_error={error:"check",plugin:"unique",id:"unique_01",reason:"Child with name "+h+" already exists. Preventing: "+b,data:JSON.stringify({chk:b,pos:f,obj:c&&c.id?c.id:!1,par:e&&e.id?e.id:!1})}),m;case"create_node":return m=-1===a.inArray(h,i),m||(this._data.core.last_error={error:"check",plugin:"unique",id:"unique_04",reason:"Child with name "+h+" already exists. Preventing: "+b,data:JSON.stringify({chk:b,pos:f,obj:c&&c.id?c.id:!1,par:e&&e.id?e.id:!1})}),m;case"copy_node":return m=-1===a.inArray(h,i),m||(this._data.core.last_error={error:"check",plugin:"unique",id:"unique_02",reason:"Child with name "+h+" already exists. Preventing: "+b,data:JSON.stringify({chk:b,pos:f,obj:c&&c.id?c.id:!1,par:e&&e.id?e.id:!1})}),m;case"move_node":return m=c.parent===e.id&&(!g||!g.is_multi)||-1===a.inArray(h,i),m||(this._data.core.last_error={error:"check",plugin:"unique",id:"unique_03",reason:"Child with name "+h+" already exists. Preventing: "+b,data:JSON.stringify({chk:b,pos:f,obj:c&&c.id?c.id:!1,par:e&&e.id?e.id:!1})}),m}return!0},this.create_node=function(c,e,f,g,h){if(!e||e.text===b){if(null===c&&(c=a.jstree.root),c=this.get_node(c),!c)return d.create_node.call(this,c,e,f,g,h);if(f=f===b?"last":f,!f.toString().match(/^(before|after)$/)&&!h&&!this.is_loaded(c))return d.create_node.call(this,c,e,f,g,h);e||(e={});var i,j,k,l,m,n=this._model.data,o=this.settings.unique.case_sensitive,p=this.settings.unique.trim_whitespace,q=this.settings.unique.duplicate,r;for(j=i=this.get_string("New node"),k=[],l=0,m=c.children.length;m>l;l++)r=n[c.children[l]].text,o||(r=r.toLowerCase()),p&&(r=r.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")),k.push(r);l=1,r=j,o||(r=r.toLowerCase()),p&&(r=r.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,""));while(-1!==a.inArray(r,k))j=q.call(this,i,++l).toString(),r=j,o||(r=r.toLowerCase()),p&&(r=r.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,""));e.text=j}return d.create_node.call(this,c,e,f,g,h)}};var n=i.createElement("DIV");if(n.setAttribute("unselectable","on"),n.setAttribute("role","presentation"),n.className="jstree-wholerow",n.innerHTML="&#160;",a.jstree.plugins.wholerow=function(b,c){this.bind=function(){c.bind.call(this),this.element.on("ready.jstree set_state.jstree",a.proxy(function(){this.hide_dots()},this)).on("init.jstree loading.jstree ready.jstree",a.proxy(function(){this.get_container_ul().addClass("jstree-wholerow-ul")},this)).on("deselect_all.jstree",a.proxy(function(a,b){this.element.find(".jstree-wholerow-clicked").removeClass("jstree-wholerow-clicked")},this)).on("changed.jstree",a.proxy(function(a,b){this.element.find(".jstree-wholerow-clicked").removeClass("jstree-wholerow-clicked");var c=!1,d,e;for(d=0,e=b.selected.length;e>d;d++)c=this.get_node(b.selected[d],!0),c&&c.length&&c.children(".jstree-wholerow").addClass("jstree-wholerow-clicked")},this)).on("open_node.jstree",a.proxy(function(a,b){this.get_node(b.node,!0).find(".jstree-clicked").parent().children(".jstree-wholerow").addClass("jstree-wholerow-clicked")},this)).on("hover_node.jstree dehover_node.jstree",a.proxy(function(a,b){"hover_node"===a.type&&this.is_disabled(b.node)||this.get_node(b.node,!0).children(".jstree-wholerow")["hover_node"===a.type?"addClass":"removeClass"]("jstree-wholerow-hovered")},this)).on("contextmenu.jstree",".jstree-wholerow",a.proxy(function(b){if(this._data.contextmenu){b.preventDefault();var c=a.Event("contextmenu",{metaKey:b.metaKey,ctrlKey:b.ctrlKey,altKey:b.altKey,shiftKey:b.shiftKey,pageX:b.pageX,pageY:b.pageY});a(b.currentTarget).closest(".jstree-node").children(".jstree-anchor").first().trigger(c)}},this)).on("click.jstree",".jstree-wholerow",function(b){b.stopImmediatePropagation();var c=a.Event("click",{metaKey:b.metaKey,ctrlKey:b.ctrlKey,altKey:b.altKey,shiftKey:b.shiftKey});a(b.currentTarget).closest(".jstree-node").children(".jstree-anchor").first().trigger(c).focus()}).on("dblclick.jstree",".jstree-wholerow",function(b){b.stopImmediatePropagation();var c=a.Event("dblclick",{metaKey:b.metaKey,ctrlKey:b.ctrlKey,altKey:b.altKey,shiftKey:b.shiftKey});a(b.currentTarget).closest(".jstree-node").children(".jstree-anchor").first().trigger(c).focus()}).on("click.jstree",".jstree-leaf > .jstree-ocl",a.proxy(function(b){b.stopImmediatePropagation();var c=a.Event("click",{metaKey:b.metaKey,ctrlKey:b.ctrlKey,altKey:b.altKey,shiftKey:b.shiftKey});a(b.currentTarget).closest(".jstree-node").children(".jstree-anchor").first().trigger(c).focus()},this)).on("mouseover.jstree",".jstree-wholerow, .jstree-icon",a.proxy(function(a){return a.stopImmediatePropagation(),this.is_disabled(a.currentTarget)||this.hover_node(a.currentTarget),!1},this)).on("mouseleave.jstree",".jstree-node",a.proxy(function(a){this.dehover_node(a.currentTarget)},this))},this.teardown=function(){this.settings.wholerow&&this.element.find(".jstree-wholerow").remove(),c.teardown.call(this)},this.redraw_node=function(b,d,e,f){if(b=c.redraw_node.apply(this,arguments)){var g=n.cloneNode(!0);-1!==a.inArray(b.id,this._data.core.selected)&&(g.className+=" jstree-wholerow-clicked"),this._data.core.focused&&this._data.core.focused===b.id&&(g.className+=" jstree-wholerow-hovered"),b.insertBefore(g,b.childNodes[0])}return b}},window.customElements&&Object&&Object.create){var o=Object.create(HTMLElement.prototype);o.createdCallback=function(){var b={core:{},plugins:[]},c;for(c in a.jstree.plugins)a.jstree.plugins.hasOwnProperty(c)&&this.attributes[c]&&(b.plugins.push(c),this.getAttribute(c)&&JSON.parse(this.getAttribute(c))&&(b[c]=JSON.parse(this.getAttribute(c))));for(c in a.jstree.defaults.core)a.jstree.defaults.core.hasOwnProperty(c)&&this.attributes[c]&&(b.core[c]=JSON.parse(this.getAttribute(c))||this.getAttribute(c));a(this).jstree(b)};try{window.customElements.define("vakata-jstree",function(){},{prototype:o})}catch(p){}}}});
//static-content-hash-trigger-YUI
var $pNamespace = pega.namespace;
$pNamespace("pega.ui");
// The editor is a singleton class which returns its public methods.
pega.ui.inspector = (function() {
    var publicAPI = {};
    /* Debug */
    var isDebugOn = false;
    /////////////////////////////////////////////////////////////////////////////////
    //                              CONSTANTS                                      //
    /////////////////////////////////////////////////////////////////////////////////
    /* Text to be localized */
    var FLOATING_BUTTON_TEXT = pega.u.d.fieldValuesList.get("LiveUI");
    publicAPI.BROWSERS = {
        IE9: "ie9",
        IE10: "ie10",
        IE11: "ie11",
        CHROME: "chrome",
        SAFARI: "safari",
        FIREFOX: "firefox",
        EDGE: "edge",
        UNSUPPORTED: "unsupported"
    }
    var STATES = {
        ACTIVE: "active",
        INACTIVE: "inactive",
        LOADING: "loading",
        BUSY: "busy"
    };
    /////////////////////////////////////////////////////////////////////////////////
    //                              GLOBALS                                        //
    /////////////////////////////////////////////////////////////////////////////////
    /* -- PRIVATE GLOBALS -- */
    var _browser = null;
    var _allOverlays = [];
    /* Highlight related */
    var _focusHighlight; //Highlight object for focused element
    var _hoverHighlight; //Highlight object for hovered element
    var _focusInfoBar;
    var _hoverInfoBar;
    var _previouslySelectedInspectorObject; //Previously selected inspector object to be checked in Highlight
    var _lastHighlightedUIElement; // Used in mouse over to check if same element is getting mouse over event
    /* Event related*/
    var _scrollTimeoutID; //Timeout ID for scrolling
    var _transitionEndTimeoutID; //Timeout ID for transitionend
    var _resizeTimeoutID; //Timeout ID for resize DOM function
    /* Hot keys */
    var _toggleSuppressionHotKey1Down = false;
    var _toggleSuppressionHotKey2Down = false;
    var _bothToggleSuppressionHotKeysDown = false;
    /* Floating button move */
    var _mouseMoveCounter = 0; // Mouse move counter for drag of floating button
    /* Panel setting */
    var _showSidePanel = true; // By default, show the side panel
    /* -- PUBLIC GLOBALS -- */
    var desktopWindow = null; //Top most window/frame
    var desktopWindowInspectorProxy = null; //Refrence to top most level inspector object
    /* Core */
    var $topHarness = null;
    /* Filtering */
    var filter; //json containing the elements to filter on
    var stopFilter; //json containing the elements to end at when filtering
    var contextElement; // Contains the context element to set the starting point for inspector
    /* Highlight related */
    var focusedInspectorObject;
    var hoveredInspectorObject;
    var previousElementClipboardPath;
    var ignoreScrollForHighlight = false; //Ignore scrolling logic for highlighting
    var isHighlightingEnabled; //Flag for if highlighting is enabled
    var isElementFocused = false; // Flag for if an element is selected
    /* Event related */
    var inspectorFrameList = new Array(); //List of all child frames
    var mousePositionX; //Current mouse X position (used for quick info panel)
    var mousePositionY; //Current mouse Y position (used for quick info panel)
    /* BUG-214450: Maintain the state of the LiveUI Button */
    var state;
    /////////////////////////////////////////////////////////////////////////////////
    //                              PRIVATE FUNCTIONS                              //
    /////////////////////////////////////////////////////////////////////////////////
    /* ---- PRIVATE CONTROLLER APIS ---- */
    /**
     * @private Handles turning on of live ui. Called from toggle
     */
    function _activate() {
        state = STATES.LOADING;
        
        // Make sure all UI Panels are hidden 
        pega.ui.panelManager.hideAllPanels();
      
        // When disabling the tree then make sure to clean up the transition override for the toolbar
        var toolbar = document.querySelector("div[data-node-id='pzRuntimeToolsTopBar']");
        if (toolbar) {
            toolbar.classList.add("disable-slide");
        }
      
        // Change the text of UI Tree to blue when turned on outside developer portal
        $('#js-toggle-runtime-editor').addClass("toggleLiveUIButtonOn");
        // Change the text of UI Tree to blue when turned on in developer portal
        $('.ui-tree a').addClass("toggleLiveUIButtonOn");
        $('.ui-tree button').addClass("toggleLiveUIButtonOn");
        //Init all objects
        _initializeObjects();
        // Default contextElement
        contextElement = document.body;
        // Default listen for changes
        pega.ui.inspector.panel.setListenForChanges(false);
        // Enables all events.
        // Called directly if there is no panel or used as callback for when there is
        var enableEvents = function() {
            //Turn on hover and click event listeners
            _toggleNonSupportedIframeSuppression(true);
            var tempList = publicAPI.getFrameList();
            for (var x = 0; x < tempList.length; x++) {
                if ($(tempList[x].document).length > 0) tempList[x].pega.ui.inspector.turnOnEvents();
            }
            //Enable highlighting
            publicAPI.enableHighlighting();
            // Lock all open overlays
            _setOverlayLock(true);
            //Activate dom inspector
            state = STATES.ACTIVE;
        }
        if (publicAPI.isSidePanelEnabled()) {
            pega.ui.inspector.panel.show(enableEvents);
        } else {
            enableEvents();
        }
    }
    /**
     * @private Handles deactivating live ui. Hides tree if there is one and turns off events
     */
    function _deactivate() {
        state = STATES.LOADING;
        //remove highlight divs
        $(".runtime-control-highlight-container").remove();
        // Disables live ui callback
        // If there is no panel it is called directly if there is a panel it is used as a callback
        var disableCallback = function() {
            // Nullify data
            publicAPI.disableHighlighting();
            publicAPI.clearAllHighlights(true);
            previousElementClipboardPath = null;
            pega.ui.inspector.panel.stopListeningForChanges();
            publicAPI.loadingIndicator.nullify();
            //Unload resources from all the frames
            _toggleNonSupportedIframeSuppression(false);
            _toggleMouseCursor(false);
            // Turn off all events
            var tempList = publicAPI.getFrameList();
            for (var x = 0; x < tempList.length; x++) {
                if ($(tempList[x].document).length > 0) {
                    $(tempList[x].document.body).removeClass("runtime-tree-refreshing-cursor");
                    $(tempList[x].document.head).children("#runtime-panel-exp-style").remove();
                    tempList[x].pega.ui.inspector.turnOffEvents();
                }
            }
            // Change the text of UI Tree back to white when turning off outside developer portal
            $('#js-toggle-runtime-editor').removeClass("toggleLiveUIButtonOn");
            // Change the text of UI Tree back to white when turned off in developer portal
            $('.ui-tree a').removeClass("toggleLiveUIButtonOn");
            $('.ui-tree button').removeClass("toggleLiveUIButtonOn");
            // Remove the allow interaction class that may or maynot be applied to the control panel
            $(".runtime-control-body").removeClass("interaction-enabled");
          
            // When disabling the tree then make sure to clean up the transition override for the toolbar
            var toolbar = document.querySelector("div[data-node-id='pzRuntimeToolsTopBar']");
            if (toolbar) {
                toolbar.classList.remove("disable-slide");
            }
          
            // If there is a locked overlay then unlock it
            setTimeout(function() {
                _setOverlayLock(false);
            }, 100);
            //Deactivate dom inspector
            state = STATES.INACTIVE;
        }
        // Call show panel if not in a popup
        if (publicAPI.isSidePanelEnabled()) {
            pega.ui.inspector.panel.hide(disableCallback);
        } else {
            disableCallback();
        }
    }
    /**
     * @private Initialize overlay objects to be added to public API. Called from _activate
     */
    function _initializeObjects() {
        //Only init in top window
        if (window != desktopWindow) return;
        //Create a container div for all highlight related divs
        var containerDiv = document.createElement("DIV");
        containerDiv.className = "runtime-control-highlight-container";
        containerDiv.setAttribute('isInspectorElement', true);
        document.body.appendChild(containerDiv);
        //set up event handlers for hover info bar
        var hoverHandleClick = function(e) {
            pega.ui.inspector.focus(pega.ui.inspector.getHoveredInspectorObject(), false, true);
            pega.ui.inspector.setPreviousElementClipboardPath(pega.ui.inspector.getHoveredInspectorObject());
        };
        var hoverHandleMouseMove = function(e) {
            var currentX = e.clientX + $(window).scrollLeft();
            var currentY = e.clientY + $(window).scrollTop();
            // NOTE: Offset should not be used in this mouse over as it causes browser repaints
            var _focusedIdPanelLocation = {
                left: parseInt(_focusInfoBar.overlayElem.style.left),
                top: parseInt(_focusInfoBar.overlayElem.style.top),
                width: $(_focusInfoBar.overlayElem).width(),
                height: $(_focusInfoBar.overlayElem).height()
            };
            // Check if current mouse location is inside the focused info bar and if it is clear the hovered highlighting
            if ((currentX >= _focusedIdPanelLocation.left && currentX <= (_focusedIdPanelLocation.left +
                    _focusedIdPanelLocation.width)) && (currentY >= _focusedIdPanelLocation.top && currentY <=
                    (_focusedIdPanelLocation.top + _focusedIdPanelLocation.height))) {
                pega.ui.inspector.clearHighlight();
            }
        };
        _focusHighlight = new pega.ui.inspector.Highlight("secondaryTreeHighlight", containerDiv);
        _hoverHighlight = new pega.ui.inspector.Highlight("primaryTreeHighlight", containerDiv);
        //TODO: offset probably shouldn't be hard coded
        _focusInfoBar = new pega.ui.inspector.InfoBar("inspectorTreeSecIdPanel", containerDiv, null, {
            confinementElement: pega.ui.inspector.getTopHarness(),
            offset: 2,
            events: {
                "mousemove": hoverHandleMouseMove
            }
        });
        _hoverInfoBar = new pega.ui.inspector.InfoBar("inspectorTreeIdPanel", containerDiv, null, {
            confinementElement: pega.ui.inspector.getTopHarness(),
            offset: 2,
            events: {
                "click": hoverHandleClick,
                "mousemove": hoverHandleMouseMove
            }
        });
        //Bulk Publish Overlay
        publicAPI.bulkPublish = new pega.ui.inspector.Overlay.DismissOnOutsideClick("runtime-property-panel",
            containerDiv, "pyPublishRuntimeRulesWarning", {
                dataTestId: "bulk-publish",
                frameList: pega.ui.inspector.getFrameList
            });
        _allOverlays.push(publicAPI.bulkPublish);
        //Bulk Discard Overlay
        publicAPI.bulkDiscard = new pega.ui.inspector.Overlay.DismissOnOutsideClick("runtime-property-panel",
            containerDiv, "pyDiscardRuntimeRulesWarning", {
                dataTestId: "bulk-discard",
                frameList: pega.ui.inspector.getFrameList
            });
        _allOverlays.push(publicAPI.bulkDiscard);
        //Single Publish Overlay
        publicAPI.singlePublish = new pega.ui.inspector.Overlay.DismissOnOutsideClick("runtime-property-panel",
            containerDiv, "pyPublishSingleRuntimeRuleWarning", {
                dataTestId: "single-publish",
                frameList: pega.ui.inspector.getFrameList
            });
        _allOverlays.push(publicAPI.singlePublish);
        //Single Discard Overlay
        publicAPI.singleDiscard = new pega.ui.inspector.Overlay.DismissOnOutsideClick("runtime-property-panel",
            containerDiv, "pyDiscardSingleRuntimeRuleWarning", {
                dataTestId: "single-discard",
                frameList: pega.ui.inspector.getFrameList
            });
        _allOverlays.push(publicAPI.singleDiscard);
        //Delete Confirm Overlay
        publicAPI.deleteConfirm = new pega.ui.inspector.Overlay.DismissOnMouseOut("runtime-property-panel RuntimeDeleteOverlay",
            containerDiv, "pzRunTime_ConfirmDelete", {
                dataTestId: "delete-confirmation"
            });
        _allOverlays.push(publicAPI.deleteConfirm);
        //Add Menu Overlay
        publicAPI.addMenu = new pega.ui.inspector.Overlay.DismissOnMouseOut("runtime-property-panel RuntimeAddMenu", containerDiv,
            "pzRunTime_AddMenu", {
                dataTestId: "add-menu"
            });
        _allOverlays.push(publicAPI.addMenu);
        //Quickinfo Panel
        publicAPI.quickInfo = new pega.ui.inspector.QuickInfo(containerDiv);
        _allOverlays.push(publicAPI.quickInfo);
        //Action Menu Ovelerlay
        publicAPI.actionMenu = new pega.ui.inspector.ActionMenu(containerDiv);
        _allOverlays.push(publicAPI.actionMenu);
        //Ancestor List Overlay
        publicAPI.ancestorList = new pega.ui.inspector.AncestorList(containerDiv, {
            showTarget: _focusInfoBar.overlayElem
        });
        _allOverlays.push(publicAPI.ancestorList);
        var modalOptions = {
            hideCallback: function() {
                pega.ui.inspector.enableHighlighting();
                state = STATES.ACTIVE;
            },
            showCallback: function() {
                state = STATES.BUSY;
            }
        };
        //Error Modal Overlay
        publicAPI.errorModal = new pega.ui.inspector.ErrorModal(containerDiv, modalOptions);
        // Do NOT add to _allOverlays as this will lead to an infinite loop because hiding this overlay leads to hideAllOverlays being called again
        //Make New Branch Modal Overlay
        publicAPI.makeBranch = new pega.ui.inspector.Overlay.Modal("runtime-property-panel make-branch",
            containerDiv, "pzRuntime_MakeBranch", modalOptions);
        // Do NOT add to _allOverlays as this will lead to an infinite loop because hiding this overlay leads to hideAllOverlays being called again
        // Loading indicator object
        publicAPI.loadingIndicator = new pega.ui.busyIndicator("", true, document.body, 0);
    }
    /**
     * @private Initialize floating and anchored buttons and drag events for them
     */
    function _initializeToolbar() {
        if (window != desktopWindow) return;
        if ($('.ui-tree').length < 1) {
            //Create Dom Tree button
            var oDomTreeToolbar = document.createElement("DIV");
            oDomTreeToolbar.setAttribute("id", "js-toggle-runtime-editor");
            oDomTreeToolbar.setAttribute("isInspectorElement", "true");
            oDomTreeToolbar.setAttribute("data-test-id", "UIInspectorButton");
            oDomTreeToolbar.innerHTML =
                "<div class='toggle-runtime-mask'></div><div unselectable='on'><span  unselectable='on' class='pzbtn-img live-ui-toggle-icon'></span>" +
                FLOATING_BUTTON_TEXT + " </div>";
            $(oDomTreeToolbar).appendTo(document.body);
            //Add toggle to button on click
            oDomTreeToolbar.addEventListener("click", pega.ui.inspector.toggle, true);
            oDomTreeToolbar.addEventListener("mousedown", function(e) {
                if (!$(oDomTreeToolbar).hasClass('noClick')) {
                    if ($(".ui-tree-mask").length == 0) {
                        $(document.body).append("<div class='ui-tree-mask'></div>");
                    }
                    //Add mouse move
                    window.addEventListener("mousemove", handleDrag, true);
                }
                return publicAPI.handleSupression(e);
            }, true)
            window.addEventListener("mouseup", function(e) {
                if ($(".ui-tree-mask").length > 0) {
                    _mouseMoveCounter = 0;
                    $(".ui-tree-mask").remove();
                    window.removeEventListener("mousemove", handleDrag, true);
                }
            }, true);

            function handleDrag(e) {
                _mouseMoveCounter++;
                if (_mouseMoveCounter > 5) {
                    if (!$(oDomTreeToolbar).hasClass('noClick')) {
                        $(oDomTreeToolbar).addClass('noClick');
                    }
                    var Width = $("#js-toggle-runtime-editor").outerWidth();
                    var Height = $("#js-toggle-runtime-editor").outerHeight();
                    var X = e.clientX - (Width / 2);
                    var Y = e.clientY - (Height / 2);
                    // if toggle button is dragged outside of window, reset variables event listeners
                    if (e.clientX < 0 || e.clientY < 0 || e.clientX > $(window).width() || e.clientY > $(window)
                        .height()) {
                        _mouseMoveCounter = 0;
                        $(".ui-tree-mask").remove();
                        window.removeEventListener("mousemove", handleDrag, true);
                        $('#js-toggle-runtime-editor').removeClass('noClick');
                        // clear highlighting selection for various browsers
                        if (window.getSelection) {
                            if (window.getSelection().empty) { // Chrome
                                window.getSelection().empty();
                            } else if (window.getSelection().removeAllRanges) { // Firefox
                                window.getSelection().removeAllRanges();
                            }
                        } else if (document.selection) { // IE?
                            //alert("clearing for IE");
                            document.selection.empty();
                        }
                        return publicAPI.handleSupression(e);
                    }
                    //Prevent drag off left
                    if (X < 0) {
                        X = 0;
                    }
                    //Prevent drag off top
                    if (Y < 0) {
                        Y = 0;
                    }
                    //Prevent drag off right
                    if (X > ($(window).width() - Width)) {
                        X = ($(window).width() - Width);
                    }
                    //Prevent drag off bottom
                    if (Y > ($(window).height() - Height)) {
                        Y = ($(window).height() - Height);
                    }
                    //This will set the button's position based on a % rather than set pixel cords
                    //Y = (Y / $(window).height() * 100) + "%";
                    //X = (X / $(window).width() * 100) + "%";
                    $("#js-toggle-runtime-editor").css({
                        'position': 'fixed',
                        'top': Y,
                        'left': X
                    });
                }
                return publicAPI.handleSupression(e);
            }
            //Add resize event to the window only for the Button
            window.addEventListener("resize", function() {
                if ($("#js-toggle-runtime-editor").css("top") != "auto") {
                    // Get button offset
                    var button = $("#js-toggle-runtime-editor");
                    var buttonOffset = button.offset();
                    var buttonTop = buttonOffset.top;
                    var buttonLeft = buttonOffset.left;
                    // Get size of window, and scroll position
                    var windowHeight = $(window).height() - button.height();
                    var windowWidth = $(window).width() - button.width();
                    var scrollTop = $(window).scrollTop();
                    var scrollLeft = $(window).scrollLeft();
                    // Adjust button position if needed based on window resize
                    if (buttonTop < 0) button.css({
                        'top': "0px"
                    });
                    else if ((buttonTop - scrollTop) > windowHeight) button.css({
                        'top': (windowHeight + "px")
                    });
                    if (buttonLeft < 0) button.css({
                        'left': "0px"
                    });
                    if ((buttonLeft - scrollLeft) > windowWidth) button.css({
                        'left': (windowWidth + "px")
                    });
                }
            }, true);
        } else if (typeof $(".ui-tree a").attr("data-click") === 'undefined') {
            $('.ui-tree').attr("isInspectorElement", "true");
            pega.util.Event.addListener($('.ui-tree'), "click", pega.ui.inspector.toggle, this, true);
            var autoGenButton = document.querySelector('[data-node-id="pzRuntimeToolsTopBar"]');
                if (autoGenButton) {
                    autoGenButton.setAttribute("isinspectorelement", "true");
                }
        }
    }
    /**
     * @private Toggles the mouse cursor state for all known frames
     *
     * @param $Boolean$ turnOn - Flag to toggle on or off
     */
    function _toggleMouseCursor(turnOn) {
        var tempFrameList = publicAPI.getFrameList();
        for (var x = 0; x < tempFrameList.length; x++) {
            tempFrameList[x].pega.ui.inspector.toggleCursor(turnOn);
        }
    }

    function _canAccessIFrame(iframe) {
        var html = null;
        try {
            // deal with older browsers
            var doc = iframe.contentDocument || iframe.contentWindow.document;
            html = doc.body.innerHTML;
        } catch (err) {
            // do nothing
        }
        return (html !== null);
    }
    /**
     * @private Toggle suppression events for non supported frames recursively
     *
     * @param $Boolean$ turnOn - Flag for if suppression should be turned on or off
     * @param $Window$ currentFrame - Current frame to work on
     */
    function _toggleNonSupportedIframeSuppression(turnOn, currentFrame) {
        var suppressionFrameList = new Array();
        if (currentFrame) suppressionFrameList = currentFrame;
        else suppressionFrameList.push(window);
        if (turnOn) {
            for (var x = 0; x < suppressionFrameList.length; x++) {
                // BUG-289457, skip iframes we don't have control over
                if (!_canAccessIFrame(suppressionFrameList[x])) {
                    continue;
                }
                try {
                    if (typeof suppressionFrameList[x].pega.ui.inspector) {
                        publicAPI.debugLogger("Current Iframe Contains pega.ui.inspector")
                    }
                } catch (e) {
                    publicAPI.debugLogger("Current Iframe DOES NOT Contains pega.ui.inspector")
                    suppressionFrameList[x].addEventListener("click", function() {
                        pega.ui.inspector.focus(pega.ui.inspector.getHoveredInspectorObject());
                    }, true);
                    suppressionFrameList[x].addEventListener("dblclick", publicAPI.handleSupression, true);
                    suppressionFrameList[x].addEventListener("mousedown", publicAPI.handleSupression, true);
                    if ($(suppressionFrameList[x].document).length > 0) {
                        if ($(suppressionFrameList[x].document.head).children("#runtime-panel-iframe-style").length ==
                            0) {
                            $(suppressionFrameList[x].document.head).append(
                                "<style id='runtime-panel-iframe-style' type='text/css'>.runtime-tree-default-cursor *{ cursor: default !important; } </style>"
                            );
                        }
                        if (!$(suppressionFrameList[x].document.body).hasClass("runtime-tree-default-cursor")) {
                            $(suppressionFrameList[x].document.body).addClass("runtime-tree-default-cursor");
                        }
                    }
                }
                if (typeof suppressionFrameList[x].frames !== undefined)
                    if (suppressionFrameList[x].frames.length > 0) _toggleNonSupportedIframeSuppression(turnOn,
                        suppressionFrameList[x].frames);
            }
        } else {
            for (var x = 0; x < suppressionFrameList.length; x++) {
                // BUG-289457, skip iframes we don't have control over
                if (!_canAccessIFrame(suppressionFrameList[x])) {
                    continue;
                }
                suppressionFrameList[x].removeEventListener("click", function() {
                    pega.ui.inspector.focus(pega.ui.inspector.getHoveredInspectorObject());
                }, true);
                suppressionFrameList[x].removeEventListener("dblclick", publicAPI.handleSupression, true);
                suppressionFrameList[x].removeEventListener("mousedown", publicAPI.handleSupression, true);
                $(suppressionFrameList[x].document.body).removeClass("runtime-tree-default-cursor");
                if (typeof suppressionFrameList[x].frames !== undefined)
                    if (suppressionFrameList[x].frames.length > 0) _toggleNonSupportedIframeSuppression(turnOn,
                        suppressionFrameList[x].frames);
            }
        }
    }
    /* ---- PRIVATE OVERLAY APIS ---- */
    /**
     * @private Loops over all frames and locks any open frames
     *
     * @param $Boolean$ lock - if the overlays should be locked or not
     */
    function _setOverlayLock(lock) {
        var foundOverlay = false;
        var tempList = publicAPI.getFrameList();
        if (lock) {
            // Loop over all iframe and lock any open overlays
            for (var x = 0; x < tempList.length; x++) {
                if ($(tempList[x].document).length > 0) {
                    if (tempList[x].pega.u.d.getPopOver().isActive()) {
                        tempList[x].pega.u.d.getPopOver().setState("locked");
                        foundOverlay = true;
                    }
                    publicAPI.debugLogger("Set Overlay State To: " + tempList[x].pega.u.d.getPopOver().getState());
                }
            }
        } else {
            // Loop over all iframes and unlock open overlays
            for (var x = 0; x < tempList.length; x++) {
                if ($(tempList[x].document).length > 0) {
                    if (tempList[x].pega.u.d.getPopOver().getState() == "locked") {
                        tempList[x].pega.u.d.getPopOver().setState("active");
                        foundOverlay = true;
                    }
                }
            }
        }
        return foundOverlay;
    }
    /* ---- PRIVATE HIGHLIGHT APIS ---- */
    /**
     * @private Handles calculating the dimensions of the given element. Covers 3 scenarios that need work arounds
     * 1. Dynamic Layout Group - Store off just the top value so that the original can be used launchDeclarativeNetwork
     * 2. Layouts - Set display to block and overflow to hidden so that width is accurate
     * 3. Spans - Span elements are set to display block so that the width is correct in chrome and safari
     */
    function _calculateElementDimensions(elem, inspectorElementObj) {
        var dimensions = {
            width: 0,
            height: 0
        }
        //If working on a dynamic group layout calculate offset first and store off top
        var isDynamicGroupLayout = ((inspectorElementObj.get("subType") == "DYNAMICLAYOUTGROUP") || (
            inspectorElementObj.get("subType") == "REPEATINGDYNAMICLAYOUTGROUP"));
        if (isDynamicGroupLayout) {
            var DynamicGroupTop = _getOffSetValue(elem).top;
        }
        // If working with a layout display and overflow need to be changed before offset can be calculated
        // BUG-190112: only toggle the style for layouts which are not tab groups,
        // may want to only do this for dynamic type layouts in the future.
        var ToggleStyle = (inspectorElementObj.get("type") && inspectorElementObj.get("type") == "Layout" && (!
            inspectorElementObj.get("subType") || inspectorElementObj.get("subType") != "TABGROUP"));
        if (ToggleStyle) {
            var tempDisplayCSS = $(elem).css("display");
            var tempOverflowCSS = $(elem).css("overflow");
            $(elem).css({
                'display': 'block',
                'overflow': 'hidden'
            });
        }
        dimensions.width = elem.offsetWidth
        dimensions.height = elem.offsetHeight
        //Set top back for dynamic groups
        if (isDynamicGroupLayout) {
            dimensions.top = DynamicGroupTop;
        }
        //Set back style for elements
        if (ToggleStyle) {
            $(elem).css({
                'display': tempDisplayCSS,
                'overflow': tempOverflowCSS
            });
        }
        // Spans have no width or height in chrome and safari so set to block for a sec
        if ((publicAPI.getBrowser() === publicAPI.BROWSERS.CHROME || publicAPI.getBrowser() === publicAPI.BROWSERS
                .SAFARI) && elem.nodeName.toLowerCase() == "span") {
            var tempElementDisplay = elem.style.display;
            if (tempElementDisplay != "inline" && tempElementDisplay != "block") {
                var elemHeight = elem.offsetHeight;
                if (elemHeight <= 2) {
                    elem.style.display = "block";
                    dimensions.width = $(elem).width();
                    dimensions.height = $(elem).height();
                }
                // Set the style back
                if (tempElementDisplay != null) elem.style.display = tempElementDisplay;
            }
        }
        return dimensions;
    }
    /**
     * @private Calculated the elements offset using old jQuery logic because of performance reasones
     *
     * @param $Element$ elem - The element to calculate the offset of
     * @return $Object$ Object containing top, left, width, and height
     **/
    function _getOffSetValue(elem) {
        if (!elem || !elem.ownerDocument) {
            return null;
        }
        if (elem === elem.ownerDocument.body) {
            return jQuery.offset.bodyOffset(elem);
        }
        var computedStyle,
            offsetParent = elem.offsetParent,
            prevOffsetParent = elem,
            doc = elem.ownerDocument,
            docElem = doc.documentElement,
            body = doc.body,
            defaultView = doc.defaultView,
            prevComputedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle,
            top = elem.offsetTop,
            left = elem.offsetLeft;
        while ((elem = elem.parentNode) && elem !== body && elem !== docElem) {
            if (jQuery.support.fixedPosition && prevComputedStyle.position === "fixed") {
                break;
            }
            computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
            top -= elem.scrollTop;
            left -= elem.scrollLeft;
            if (elem === offsetParent) {
                top += elem.offsetTop;
                left += elem.offsetLeft;
                if (jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(
                        elem.nodeName))) {
                    top += parseFloat(computedStyle.borderTopWidth) || 0;
                    left += parseFloat(computedStyle.borderLeftWidth) || 0;
                }
                prevOffsetParent = offsetParent;
                offsetParent = elem.offsetParent;
            }
            if (jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible") {
                top += parseFloat(computedStyle.borderTopWidth) || 0;
                left += parseFloat(computedStyle.borderLeftWidth) || 0;
            }
            prevComputedStyle = computedStyle;
        }
        if (prevComputedStyle && (prevComputedStyle.position === "relative" || prevComputedStyle.position ===
                "static")) {
            top += body.offsetTop;
            left += body.offsetLeft;
        }
        if (jQuery.support.fixedPosition && prevComputedStyle.position === "fixed") {
            top += Math.max(docElem.scrollTop, body.scrollTop);
            left += Math.max(docElem.scrollLeft, body.scrollLeft);
        }
        return {
            top: top,
            left: left
        };
    }
    /**
     * @private Checks if the given element is, or is contained in an inspector element
     *
     * @param $HTML Element$ elem - The HTML Element to check
     * @return $Boolean$ Returns true if current element is an inspector element
     */
    function _isInspectorElement(elem) {
        // Loop up all parents and check if the given element is an inspector element
        while (elem && elem != document && elem != document.body) {
            if (elem.getAttribute && elem.getAttribute("isInspectorElement")) {
                return true;
            }
            elem = elem.parentNode
        }
        return false;
    }
    /**
     * @private Handles scrolling to the focused element. This is only done for Chrome and Safari. Handles calculating the location of the element
     * figures out how far the window would need to scroll to bring the element into view and it animates the scroll.
     */
    function _scrollToFocusedElement() {
        // Get a reference to the focused element for all the calculations below
        var elem = publicAPI.getFocusedInspectorElement();
        // If you are selecting an element for the first time
        if (_previouslySelectedInspectorObject == null || (_previouslySelectedInspectorObject.get("element") &&
                _previouslySelectedInspectorObject.get("element")[0] != elem)) {
            // Get a handle on the scrollable parent element
            var scrollableParent = $(elem).scrollParent();
            if (scrollableParent != null && scrollableParent.length == 1) {
                // Find the offset of the element, scroll top of the parent and height
                var elemTop = elem.getBoundingClientRect().top;
                var scrollableParentTop;
                var scrollableParentBottom;
                // BUG-215678: If scroll parent is any document then just set values manually
                if (Object.prototype.toString.call(scrollableParent[0]) != "[object HTMLDocument]") {
                    scrollableParentTop = scrollableParent[0].getBoundingClientRect().top;
                    scrollableParentBottom = scrollableParent[0].getBoundingClientRect().bottom;
                } else {
                    scrollableParentTop = 0;
                    scrollableParentBottom = $(window).height();
                }
                var scrollableParentScrollTop = scrollableParent.scrollTop();
                var scrollableHeight = scrollableParent.height();
                // if window containing the element is not the top-most window
                if (publicAPI.getFocusedInspectorObject().ownerWindow != window) {
                    //BUG-215678, scrollableParent was the document so offset was returning undefined,
                    // this fix interprets undefined to be zero
                    var scrollableParentOffset = scrollableParent.offset();
                    var scrollableParentOffsetTop = 0;
                    if (scrollableParentOffset) {
                        scrollableParentOffsetTop = scrollableParentOffset.top;
                    }
                    // re-calculate the top of the element and the scrollable parent
                    elemTop = $(elem).offset().top;
                    // BUG-226218, if parent is offset add the parent scrolled amount to elemTop so fixed size modals/tables factor in scrolled amount
                    if (scrollableParentOffsetTop != 0) {
                        elemTop += scrollableParentScrollTop;
                    }
                    scrollableParentTop = scrollableParentOffsetTop + scrollableParentScrollTop;
                    scrollableParentBottom = scrollableParentTop + scrollableHeight;
                }
                if (elemTop < scrollableParentTop || elemTop > scrollableParentBottom) {
                    // clear selected highlighting
                    publicAPI.clearHighlight(true);
                    // calculate the scroll position to place the element on the top of the view space
                    var scrollToValue = (scrollableParentScrollTop + elemTop - scrollableParentTop);
                    var elemHeight = $(elem).height();
                    if (elemHeight < scrollableHeight) {
                        // if the element's height is less than the height of the view space, center the whole element
                        scrollToValue = scrollToValue - ((scrollableHeight - elemHeight) / 2);
                    } else {
                        // otherwise, center the top of the element
                        scrollToValue = scrollToValue - (scrollableHeight / 2);
                    }
                    // BUG-205319, scrolling to the element has failed. We do not have a good way of telling
                    // whether the element is on-screen and in a scrollable document/container. Re-highlight the element
                    // on failure as you can lose the highlight when this happens
                    try {
                        scrollableParent.stop(true).animate({
                            scrollTop: scrollToValue
                        }, 500);
                    } catch (ex) {
                        publicAPI.debugLogger("_scrollToFocusedElement has failed! " + ex);
                        publicAPI.rehighlight(false);
                    }
                }
            }
        }
    }
    /**
     * @private Handles highlighting the given element using the given higlight object. You can also optionally pass in
     * a function to call for the info bar object
     *
     * @param $Inspector Object$ inspectorObject - The inspector object that represents the HTML element
     * @param $pega.ui.inspector.Highlight$ highlightObject - The highlight object to use
     * @param $pega.ui.inspector.InfoBar$ infoBarObject - The infobar object to use
     */
    function _highlight(inspectorObject, highlightObject, infoBarObject) {
        //Find the location of the element to move highlighting //TODO: This shouldn't even be needed, highlighting should be updated to just accept htmlelements
        var loc = pega.ui.inspector.utilities.getElementDimension(inspectorObject.get('element')[0], pega.ui.inspector
            .getDesktopWindow());
        pega.ui.inspector.utilities.adjustLocationForDesktopWindow(inspectorObject, loc);
        if (highlightObject) {
            highlightObject.show(loc.left, loc.top, loc.width, loc.height); //TODO: This should work by passing in the html element instead of getting the location
        }
        if (infoBarObject) {
            infoBarObject.showByPosition(loc.left, loc.top, loc.width, loc.height);
        }
    }
    /* ---- PRIVATE UTILITIES APIS ---- */
    /**
     * @private Using the navigator object the version of IE is parsed out
     *
     * @return $Integer$ rv - Returns the version of IE or -1 if failed
     */
    function _getInternetExplorerVersion() {
        var rv = -1; // Return value assumes failure.
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null) rv = parseFloat(RegExp.$1);
        }
        return rv;
    }
    /**
     * @private The browser is found in the html class and saved to a global variable.
     *
     */
    function _setBrowser() {
        var html = $("html");
        if (html.hasClass("ie9")) {
            _browser = publicAPI.BROWSERS.IE9;
        } else if (html.hasClass("ie10")) {
            _browser = publicAPI.BROWSERS.IE10;
        } else if (html.hasClass("ie11")) {
            _browser = publicAPI.BROWSERS.IE11;
        } else if (html.hasClass("chrome")) {
            _browser = publicAPI.BROWSERS.CHROME;
        } else if (html.hasClass("safari")) {
            _browser = publicAPI.BROWSERS.SAFARI;
        } else if (html.hasClass("ff")) {
            _browser = publicAPI.BROWSERS.FIREFOX;
        } else if (html.hasClass("edge")) {
            _browser = publicAPI.BROWSERS.EDGE;
        } else {
            _browser = publicAPI.BROWSERS.UNSUPPORTED;
        }
    }
    /* ---- PRIVATE EVENT HANDLER APIS ---- */
    /*
     * @private gets the inspector Object from the given namespce (ui tree/ field value tree)
     */
    function _getInspectorObjectForHighlight(namespace, $element) {
        // Call panel to get the Inspector object bases on the element
        var currentElementObj = namespace.getInspectorObjectByElement($element[0])
        // If the tree is visible and you do not find an Inspector Element then look upo next data-ui-meta element
        // this is for elements like sections in a cell where the child "Section" element should be ignored
        if (!currentElementObj) {
            $element = $element.parent().closest("[data-ui-meta]");
            currentElementObj = namespace.getInspectorObjectByElement($element[0])
        }
        return currentElementObj;
    }
    /**
     * @private Main mouse over handler applied to all windows. Main purpose is to handle highlighting of elements
     *
     * @param $Event$ e - The event object
     */
    function _handleMouseClick(e) {
        // hide the overlay (if one is open) if the click was not
        // inside of the overlay
        //pega.ui.inspector.quickinfo.overlayClickHandler(e);
        var tg = publicAPI.ignoreEvent(e);
        //Set click flag when hot keys are down or fire our click logic
        if (tg !== false) {
            if (!publicAPI.isHighlightEnabled() && !pega.ui.inspector.editing.propertypanel.isOpen()) {
                //DASHBOARD - If clicking the dashboard button when highlight is suspended supress
                if ($(tg).closest("[data-click*='pxUserDashboardSetMode'][data-click*='&Personalize=true']").length >
                    0) {
                    return publicAPI.handleSupression(e);
                }
                // END DASHBOARD
                // Start listening for changes if clicking when interaction is enabled
                desktopWindow.pega.ui.inspector.panel.setListenForChanges(true);
                // Also set tree needs refresh flag
                desktopWindow.pega.ui.inspector.panel.setTreeNeedsToRefresh(true);
            } else {
                // BUG-160001: Fix for suppressing right clicks for Firefox
                var rightClick;
                if (e.which) rightClick = (e.which == 3);
                else if (e.button) rightClick = (e.button == 2);
                if (rightClick == false) {
                    // Only actually do focus logic when property panel is not open
                    if (!pega.ui.inspector.editing.propertypanel.isOpen()) {
                        // Determine data-ui-element based on click event
                        var closestMeta = $(tg).closest("[data-ui-meta]");
                        if (closestMeta.length < 1) {
                            // If you didnt find an element close to your click then select the last hovered element
                            var hoveredElement = pega.ui.inspector.getHoveredInspectorElement();
                            if (hoveredElement) {
                                closestMeta = $(hoveredElement);
                            } else {
                                return publicAPI.handleSupression(e);
                            }
                        }

                        var currentElementObj = pega.ui.inspector.utilities.getTempInspectorObject(closestMeta);
                        var context = pega.ui.inspector.getContext();
                        var filter = pega.ui.inspector.getFilter();
                        var stopFilter = pega.ui.inspector.getStopFilter();
                        currentElementObj = pega.ui.inspector.parser.findCurrentElement(currentElementObj, context, filter, stopFilter);
                        
                        // If the inspector element object exists call focus
                        if (currentElementObj) {
                            //TODO FIX var infoBarContent = desktopWindowInspectorProxy.buildAncestorListContent(currentElementObj, _AncestorListFilter, _AncestorListSize);
                            //desktopWindowInspectorProxy.infobar.setContent(infoBarContent);
                            //TODO: Update to pass the click highlight instance? Maybe set up a getter for the instance?
                            desktopWindowInspectorProxy.focus(currentElementObj, false, true)
                            publicAPI.setPreviousElementClipboardPath(currentElementObj);
                        }
                    }
                    return publicAPI.handleSupression(e)
                }
            }
        }
    }
    /**
     * @private Handles general events that should basically result in suppression
     *
     * @param $Event$ e - Event to check if it should be ignored
     */
    function _handleMouseOver(e) {
        if (!e) var e = window.event;
        if (e.target) var tg = e.target;
        else if (e.srcElement) var tg = e.srcElement;
        var tg = publicAPI.ignoreEvent(e);
        // If the element should not be ignored then dont hover it
        if (tg !== false) {
            // Suppress tooltips if needed
            _handleTooltipSuppression(tg);
            // Find the closest data-ui-meta element if you can or fall out
            var closestMeta = $(tg).closest("[data-ui-meta]");
            if (closestMeta.length < 1) {
                return false;
            }
            if (_lastHighlightedUIElement && _lastHighlightedUIElement[0] && closestMeta[0] ==
                _lastHighlightedUIElement[0]) {
                publicAPI.debugLogger("handleMouseOver - Skip re-highlight, elements are the same");
                return publicAPI.handleSupression(e);
            } else {
                _lastHighlightedUIElement = closestMeta;
            }
            
            var currentElementObj = pega.ui.inspector.utilities.getTempInspectorObject(closestMeta);
            var context = pega.ui.inspector.getContext();
            var filter = pega.ui.inspector.getFilter();
            var stopFilter = pega.ui.inspector.getStopFilter();
            currentElementObj = pega.ui.inspector.parser.findCurrentElement(currentElementObj, context, filter, stopFilter);

            // If the inspector element object exists call hover
            if (currentElementObj) {
                desktopWindowInspectorProxy.hover(currentElementObj)
            }
        }
    }
    /**
     * @private Handles general events that should basically result in suppression
     *
     * @param $Event$ e - Event to check if it should be ignored
     */
    function _handleGeneralEvent(e) {
        var tg = publicAPI.ignoreEvent(e);
        if (tg != false && publicAPI.isHighlightEnabled()) return publicAPI.handleSupression(e)
    }
    /**
      Stops all following events of type e from firing Off
    **/
    function _handleSafariMouseDown(e) {
        //BUG-210972 Adding a safari specific handler as this causes the scroll bar to become unclickable only in safari
        if (e.target) var tg = e.target;
        else if (e.srcElement) var tg = e.srcElement;
        //If the element is HTML ignore suppression, this will allow safari to drag by clicking the scroll bars
        if ($(tg)[0].tagName == "HTML") return true;
        else _handleGeneralEvent(e)
    }
    /**
     * @private Suppress tooltips for given elements
     *
     * @param $Element$ tg - The element to suppress the tooltip on
     */
    function _handleTooltipSuppression(tg) {
        //Store off title value to prevent tooltips only if not currently refreshing
        if (pega.ui.inspector.panel.getListenForChanges()) return;
        var tooltipElm = $(tg).closest("*[title]");
        // Make sure the jQuery closest finds an element
        if (tooltipElm.length > 0) {
            // Update to use actual element
            tooltipElm = tooltipElm[0];
            var oldTitle = tooltipElm.title;
            // Only update title if it is not blank
            if (oldTitle && oldTitle != "") {
                tooltipElm.title = "";
                // Create temp mouse leave event
                var tempMouseLeave = function() {
                    tooltipElm.title = oldTitle;
                    tooltipElm.removeEventListener("mouseleave", tempMouseLeave);
                }
                // Add a temp mouse leave event to revert the change
                tooltipElm.addEventListener("mouseleave", tempMouseLeave);
            }
        }
    }
    /**
     * @private Called from resize event to onle fire actual resize when it quiets down
     *
     * @param $Event$ e - Event to check if it should be ignored
     */
    function _handleResize(e) {
        //Clear past resize timeout
        clearTimeout(_resizeTimeoutID);
        //Set new resize timeout
        _resizeTimeoutID = setTimeout(_resizeWindow, 25);
    }
    /**
     * @private Handles window resize after timout finishes in _handleResize
     */
    function _resizeWindow() {
        // if the modal is an error message, do not dismiss it on browser resize
        // delete .runtime-modal-error-content for the same functionality for publish/discard modals
        if (!$('div.runtime-confirmation-modal .runtime-modal-error-content').is(":visible")) {
            pega.ui.inspector.hideAllOverlays();
        }
        //Rehighlight
        setTimeout(function() {
            pega.ui.inspector.rehighlight(false);
        }, 250);
    }

    /**
     * @private Handles scroll event for window
     */
    function _handleScroll(e) {
        var tg = publicAPI.ignoreEvent(e);
        if (tg != false) {
            //Clear past scroll timeout
            clearTimeout(_scrollTimeoutID);
            // This logic will scroll to last known scroll position when rehighlighting element after refresh
            var tempElementIsSelected = publicAPI.isElementFocused();
            var tempPreviousElementClipboardPath = publicAPI.getPreviousElementClipboardPath();
            if (tempElementIsSelected == false && tempPreviousElementClipboardPath != null) {
                publicAPI.setElementFocused(true);
                $(tempPreviousElementClipboardPath.frame).scrollTop(tempPreviousElementClipboardPath.scroll);
            }
            //Set new scroll timeout
            if (publicAPI.getIgnoreScrollForHighlight() == true || !pega.u.d.isModalLoaded()) {
                _scrollTimeoutID = setTimeout(function() {
                    publicAPI.rehighlight(false);
                }, 25);
            }
        }
    }

    /**
     * @private Handles transitionend event for window
     */
    function _handleTransitionEnd(e) {
        var tg = publicAPI.ignoreEvent(e);

        if (tg != false) {
            // BUG-322437: Only permit rehighlighting for certain transitions
            var rehighlightWhiteList = ["top", "right", "bottom", "left", "width", "height", "opacity", "padding-top", "padding-right", "padding-bottom", "padding-left", "font-size"];

            if (rehighlightWhiteList.indexOf(e.propertyName) > -1) {
                //Clear past scroll timeout
                clearTimeout(_transitionEndTimeoutID);

                // This logic will scroll to last known scroll position when rehighlighting element after refresh
                var tempElementIsSelected = publicAPI.isElementFocused();
                var tempPreviousElementClipboardPath = publicAPI.getPreviousElementClipboardPath();

                if (tempElementIsSelected == false && tempPreviousElementClipboardPath != null) {
                    publicAPI.setElementFocused(true);
                    $(tempPreviousElementClipboardPath.frame).scrollTop(tempPreviousElementClipboardPath.scroll);
                }
                //Set new scroll timeout
                if (publicAPI.getIgnoreScrollForHighlight() == true || !pega.u.d.isModalLoaded()) {
                    _transitionEndTimeoutID = setTimeout(function() {
                        publicAPI.rehighlight(false);
                    }, 25);
                }
            }
        }
    }

    /**
     * @private blurs currently focused feild and clears out the pega focusElement Obj
     *
     */
    function _blurAllTextFields() {
        //set pega focus element to the document body
        pega.u.d.focusElement = document.body;
        $("input:focus").blur();
        $("textarea:focus").blur();
    }
    /**
     * @private Sets the mouse position based on the given event
     *
     * @param $Event$ e - The event object
     */
    function _setMousePositionFromEvent(e) {
        if (!e) var e = window.event;
        if (e.pageX || e.pageY) {
            mousePositionX = e.clientX;
            mousePositionY = e.clientY;
        } else if (e.clientX || e.clientY) {
            mousePositionX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            mousePositionY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        desktopWindowInspectorProxy.setMousePosition(mousePositionX, mousePositionY);
    }
    /* ---- PRIVATE OPEN RULE APIS ---- */
    /**
     * @private internal callback for when a rule was opened.
     * 
     * @param $Window$ windowOpenedIn - The window where the rule was opened
     */
    function _openRuleCallback(windowOpenedIn) {
        // If the window you are opening the rule in is designer studio then need to run additional logic
        if (windowOpenedIn.document.querySelector('.ui-tree.designer-studio') != null) {
            // If inspector is active in the window where the rule was opened then flag to listen for changes
            if (windowOpenedIn.pega.ui.inspector.isActive())  {
                windowOpenedIn.pega.ui.inspector.panel.startListeningForChanges();
            }
            // If the current window you are in is the designer studio then turn off the inspector
            if (document.querySelector('.ui-tree.designer-studio') != null) {
                publicAPI.toggle();
            }
        }

        // Always hide all overlays
        pega.ui.inspector.hideAllOverlays();
    }

    /////////////////////////////////////////////////////////////////////////////////
    //                              PUBLIC API                                     //
    /////////////////////////////////////////////////////////////////////////////////
    /* ---- PUBLIC CONTROLLER APIS ---- */
    /**
     * @public Runs on window load in all frames to initialize variables and sub components
     */
    publicAPI.start = function() {
        // return if we are in offline model
        if (pega && pega.offline) {
            return;
        }
        // disable UI Tree for IE versions between 1 and 8
        var version = _getInternetExplorerVersion();
        if ((version <= 8.0 && version >= 1.0)) {
            return;
        }
        // disable UI Tree in previews as well as 'View Java' windows
        if (($('#PreviewScripts').length > 0) || ($('[node_name="pzGeneratedJava"]').length > 0)) {
            return;
        }
        // BUG-409180: Disable Live UI when in "Where Am I?" popup
        if($('#where-am-i').length > 0) {
            return;
        }
        // BUG-417824: Disable Live UI when in configure scheduler
        if(pega.desktop.portalName === "pxExpress" && $('[node_name="pyScheduleCreate"]').length > 0) {
          return;
        }
      
        // BUG-411166: Disable Live UI when in "Search Results" popup
        if($('[node_name="pySearchResults"]').length > 0) {
            return;
        }
      
        // BUG-490132: Disable Live UI when in display report harness
        if(document.querySelector("[node_name='DisplayReport']")){
            return;
        }
      
        // BUG-517167: Disable Live UI when in "View Attachments" & "History Actions" action pop-up windows
        if(document.querySelector("[node_name='pyHistoryAndAttachments']")){
            return;
        }
      
        // BUG-514812: Disable Live UI when in "Print" action pop-up window
        if(document.querySelector("[node_name='PrintView']")){
            return;
        }
      
        // disable UI Tree if we are in the prompt window from a Decision Table
        var location = window.location.href;
        if (location.indexOf("StreamName=DecisionTablePrompt") > -1) {
            return;
        }
        // If there is not a desktopWindow do not initialize the inspector as it cannot work
        if (pega.desktop.support.getDesktopWindow() == null) {
            return false;
        }
        //set the initial state to inactive
        state = STATES.INACTIVE;
        //set the browser from the html dom class
        _setBrowser();
        window.onunload = pega.ui.inspector.removeFrameFromList;
        if (pega && pega.ui && pega.ui.composer) {
            desktopWindow = pega.ui.composer.getCurrentComposerWindow();
        } else {
            desktopWindow = pega.desktop.support.getDesktopWindow();
        }
        $topHarness = $("[data-ui-meta*=\"'type\':\'Harness\'\"]").first();
        if (self != pega.desktop.support.getDesktopWindow()) {
            if (window.opener) { // do nothing, frame in main pega window
                // If there is no top level harness then drop out
                if ($topHarness.length == 0) {
                    return;
                }
                desktopWindow = window;
                publicAPI.enableSidePanel(false);
            } else if (window.parent && window.parent.opener) {
                // When there is an iframe present in a pop up window then we need to reset its desktopWindow to the pop up
                // Currently this happens when you open a section from an end user portal and its opened in a pop up
                // TODO: Might be worth thinking of a more generic fix that loops up frames this will only allow for one level
                desktopWindow = window.parent;
            }
        }
        //BUG-83076 Try/Catch Statement exist for preventing JS error being thrown when adding access role and not relogging.
        //Tool will simply do nothing until parent is initialized (relogging).
        if (desktopWindow != null) {
            try {
                if (desktopWindow.pega.ui.inspector) {
                    desktopWindowInspectorProxy = desktopWindow.pega.ui.inspector;
                    // Check if inspector is active then listen for changes
                    if (desktopWindowInspectorProxy.isActive() == true) {
                        //Load manipulation events
                        if (publicAPI.isHighlightEnabled()) {
                            publicAPI.setPreviousElementClipboardPath(null);
                            publicAPI.clearAllHighlights(true);
                            if (desktopWindowInspectorProxy.panel.getListenForChanges()) {
                                pega.ui.inspector.panel.addDOMMutationEvents();
                            }
                            pega.ui.inspector.panel.setRefreshTimer();
                        }
                    }

                    if (pega.u.d.isUIInspectorButtonEnabled === true) {
                        _initializeToolbar();
                    } 
                    //Add mouse enter event to lock overlays
                    window.addEventListener("mousedown", pega.ui.inspector.lockVisibleOverlay, true);
                    window.pega.u.d.attachOnUnload(function() {
                        window.removeEventListener("mousedown", pega.ui.inspector.lockVisibleOverlay,
                            true);
                    });
                    publicAPI.addToFrameList(self);
                }
            } catch (e) {
                //Does nothing
            }
        }
        // Call panel initialize when loading desktopwindow and not in a popup
        if (self == desktopWindow && publicAPI.isSidePanelEnabled()) {
            pega.ui.inspector.panel.initialize();
        }
    }
    /**
     * @public Toggles Live UI on or off
     */
    publicAPI.toggle = function() {
        // If we are in offline mode do not toggle, return instead
        if (pega && pega.offline) {
            return;
        }
        if ((desktopWindow != window) && desktopWindowInspectorProxy != null) {
            desktopWindowInspectorProxy.toggle();
        } else {
            if ($('#js-toggle-runtime-editor').hasClass('noClick')) {
                $('#js-toggle-runtime-editor').removeClass('noClick');
                return false;
            }
            if (pega.ui.inspector.editing.propertypanel.isOpen()) return;
            // Prevent clicking of the Live UI button while Live UI is toggling
            if (state == STATES.LOADING) {
                return false;
            }
          
            // BUG-444476 Prevent LiveUI toggle if Agile Workbench is open
            if($(".pz-gap-panel-active").length > 0) {
              return false;
            }
          
            if (desktopWindowInspectorProxy.isActive() == true) {
                _deactivate();
                return true;
            } else {
                // DASHBOARD - Check if dashoard editing is on in any of the window child frames
                // First check current window
                if ($(".two-col-main-sidebar_dashboard_personalization_panel_on").length > 0) return false;
              
                // Loop over all frames and check them as well
                var tempFrameList = pega.ui.inspector.utilities.getFrameList(window);
                for (var x = 0; x < tempFrameList.length; x++) {
                  var windowToCheck = tempFrameList[x];
                  // BUG-292614: For frames that do not have a body, continue looping
                  if (!windowToCheck || !windowToCheck.document || !windowToCheck.document.body) {
                    continue;
                  }
                  
                  // Only check dashboarding state if window is visible
                  if (windowToCheck.frameElement != null && $(windowToCheck.frameElement).is(":visible")) {
                    // Check if the current frame has the dashboard editor open
                    var dashboardingEnabled = ($(windowToCheck.document).find(
                        ".two-col-main-sidebar_dashboard_personalization_panel_on").length > 0);
                    // If dashboarding is turned on then fall out
                    if (dashboardingEnabled) {
                      return false;
                    }
                  }
                }

                // END DASHBOARD
                // Activate Live UI
                _activate();
                // BUG-160005: Blur out the current focused element so the user cannot type in text while the UI Tree is highlighting
                _blurAllTextFields();
                return true;
            }
        }
    }
    /**
     * @public Adds all events listeners needed for Live UI including suppression listeners. Also adds resize handler to desktop window
     * and blurs any focused inputs or text areas
     */
    publicAPI.turnOnEvents = function() {
        //Desktop Events
        window.addEventListener("mouseover", _handleMouseOver, true);
        window.addEventListener("mousemove", _setMousePositionFromEvent, true);
        window.addEventListener("click", _handleMouseClick, true);
        window.addEventListener("dblclick", _handleGeneralEvent, true);
        window.addEventListener("contextmenu", _handleGeneralEvent, true); // BUG-160001: add suppression for right clicks
        window.addEventListener("keydown", publicAPI.handleKeyDown, true);
        window.addEventListener("keyup", publicAPI.handleKeyUp, true);
        window.addEventListener("scroll", _handleScroll, true);
        window.addEventListener("transitionend", _handleTransitionEnd, true); // TC-188286

        //BUG-210972 Adding a safari specific handler as this causes the scroll bar to become unclickable only in safari
        if (publicAPI.getBrowser() === publicAPI.BROWSERS.SAFARI) {
            window.addEventListener("mousedown", _handleSafariMouseDown, true);
        } else {
            window.addEventListener("mousedown", _handleGeneralEvent, true);
        }
        //Add resize event only to the desktop window
        if (window == desktopWindow) {
            window.addEventListener("resize", _handleResize, true);
        }
        /*BUG-182490 IE10 seems to have an issue of doing a blur on an non-input/textarea elements and will minimze the window.
        Changed logic to just simply blur all input/textarea tags in all frames when inspector is turned on */
        _blurAllTextFields();
    }
    /**
     * @public Removes all event listeners from the window
     */
    publicAPI.turnOffEvents = function() {
        //Desktop Events
        window.removeEventListener("mouseover", _handleMouseOver, true);
        window.removeEventListener("mousemove", _setMousePositionFromEvent, true);
        window.removeEventListener("click", _handleMouseClick, true);
        window.removeEventListener("dblclick", _handleGeneralEvent, true);
        window.removeEventListener("contextmenu", _handleGeneralEvent, true); // BUG-160001: remove suppression for right clicks
        window.removeEventListener("keydown", publicAPI.handleKeyDown, true);
        window.removeEventListener("keyup", publicAPI.handleKeyUp, true);
        window.removeEventListener("scroll", _handleScroll, true);
        window.removeEventListener("transitionend", _handleScroll, true); // TC-188286
        //BUG-210972 Adding a safari specific handler as this causes the scroll bar to become unclickable only in safari
        if (publicAPI.getBrowser() === publicAPI.BROWSERS.SAFARI) {
            window.removeEventListener("mousedown", _handleSafariMouseDown, true);
        } else {
            window.removeEventListener("mousedown", _handleGeneralEvent, true);
        }
        //Remove resize event
        if (window == desktopWindow) {
            window.removeEventListener("resize", _handleResize, true);
        }
    }
    /**
     * @public State checker to see if Live UI is active
     *
     * @return $Boolean$ True if Live UI is active or false if it is not
     */
    publicAPI.isActive = function() {
        if ((desktopWindow != window) && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.isActive();
        } else {
            return (state != STATES.INACTIVE);
        }
    }
    /**
     * @public Toggles a class onto the topHarness that controls what cursor is displayed. This is so you get a default cursor when Live UI is active
     */
    publicAPI.toggleCursor = function(turnOn) {
        if (turnOn) {
            if (!$topHarness.hasClass('runtime-tree-default-cursor')) $topHarness.addClass(
                'runtime-tree-default-cursor');
        } else {
            if ($topHarness.hasClass('runtime-tree-default-cursor')) $topHarness.removeClass(
                'runtime-tree-default-cursor');
        }
    }
    /**
     * @public Called from the toggle suppression button to toggle suppression on the window and toggle highlighting
     * also used from hotkey listener to toggle supression
     */
    publicAPI.toggleSuppression = function() {
        // If property panel is open toggle button should not do anything
        if (pega.ui.inspector.editing.propertypanel.isOpen()) {
            return false;
        }
        if (publicAPI.isHighlightEnabled()) {
            //Remove DOM events to prevent extra refresh
            pega.ui.inspector.panel.stopListeningForChanges();
            // Add class to button to give clicked style
            $(".runtime-control-body").addClass("interaction-enabled");
            //$(".runtime-control-allowinteraction img").addClass("interaction-enabled");
            //Disable highlighting if you use the hot key
            publicAPI.disableHighlighting();
            publicAPI.clearAllHighlights();
            _toggleNonSupportedIframeSuppression(false);
            _toggleMouseCursor(false);
            //Remove the mouseover highlighting on the UI Tree as well, hide icons, etc
            $(".runtime-control-tree").addClass("ui-tree-readonly");
            /*
             * BUG-226145: When allowing interaction, disable ability to undo. The other case
             * with turning off suppression is handled by a panel refresh in enableHighlighting().
             */
            var $undoEnabled = $(".runtime-control-undo-enabled");
            if ($undoEnabled.length > 0) {
                $undoEnabled.addClass("runtime-control-undo-disabled");
                $(".runtime-control-undo-disabled").removeClass("runtime-control-undo-enabled");
                $(".runtime-control-undo-disabled img").addClass("cursordefault");
                pega.ui.inspector.utilities.removeDataClick(".runtime-control-undo-disabled img");
            }
            // If there is a locked overlay then unlock it
            setTimeout(function() {
                _setOverlayLock(false)
            }, 100);
        } else {
            // Remove class from button to give style of not clicked
            $(".runtime-control-body").removeClass("interaction-enabled");
            //$(".runtime-control-allowinteraction img").removeClass("interaction-enabled");
            //enable highlight
            if (pega.ui.inspector.panel.getListenForChanges() && pega.ui.inspector.panel.isUITreeVisible()) {
                publicAPI.setPreviousElementClipboardPath(null);
                desktopWindowInspectorProxy.clearAllHighlights(true);
            }
            //Remove the readonly css class since highlighting is enabled again
            $(".runtime-control-tree").removeClass("ui-tree-readonly");
            // BUG-160005: Blur out the current focused element so the user cannot type in text while the UI Tree is highlighting
            _blurAllTextFields();
            // If there is an overlay then lock it
            _setOverlayLock(true);
            publicAPI.enableHighlighting();
            //Suppress events in all other frames
            _toggleNonSupportedIframeSuppression(true);
        }
    }
    /**
     * @public Getter that returns what is currently set as the desktopWindow
     *
     * @return $Window$ desktopWindow - The currently set desktopWindow
     */
    publicAPI.getDesktopWindow = function() {
        return desktopWindow;
    }
    /**
     * @public Getter that returns the desktopWindowInspectorProxy which is a pointer to the Inspector namespace in the desktopWindow
     *
     * @return $pega.ui.inspector$ desktopWindowInspectorProxy - The inspector name space in the desktopWindow
     */
    publicAPI.getDesktopWindowInspectorProxy = function() {
        return desktopWindowInspectorProxy;
    }
    /**
     * @public Gets a reference to the top most harness in the window
     *
     * @return $jQuery Element$ $topHarness - The top most harness as a jQuery element
     */
    publicAPI.getTopHarness = function() {
        return $topHarness;
    }
    /**
     * @public Getter that returns the browser in use.
     *
     * @return $string$ _browser - The type of browser in use.
     */
    publicAPI.getBrowser = function() {
        return _browser;
    }
    /* ---- PUBLIC OVERLAY APIS ---- */
    /**
     * @public Called on hover of Live UI buttons that should not dismiss overlays it locks open overlays and then unlocks on mouse out if needed
     *
     * @param $Event$ e - The event object
     */
    publicAPI.lockVisibleOverlay = function(e) {
        publicAPI.debugLogger("Mouse Down - lockVisibleOverlay")
        var tg = null;
        if (!e) var e = window.event;
        if (e && e.target) tg = e.target;
        else if (e && e.srcElement) tg = e.srcElement;
        // Temp mouse up listener for if the user mouses down on a supported button then drags off
        var tempUnlockVisibleOverlay = function(e) {
            publicAPI.debugLogger("Mouse Leave - " + pega.ui.inspector.isActive());
            var tg = null;
            if (!e) var e = window.event;
            if (e && e.target) tg = e.target;
            else if (e && e.srcElement) tg = e.srcElement;
            setTimeout(function() {
                // Clean up overlay state on leave of button
                if ($(tg).closest("[isinspectorelement='true']" || $(tg).closest(".ui-tree").length >
                        0).length > 0) {
                    if (pega.ui.inspector.isHighlightEnabled()) {
                        _setOverlayLock(true);
                    } else if (!pega.ui.inspector.isHighlightEnabled()) {
                        _setOverlayLock(false);
                    }
                } else {
                    if (!pega.ui.inspector.isActive()) {
                        _setOverlayLock(false);
                    }
                }
            }, 25);
            // Remove temp listener from all frames
            var closestMeta = $(tg).closest(".ui-tree");
            if (closestMeta.length > 0) tg = closestMeta[0];
            tg.removeEventListener("mouseleave", tempUnlockVisibleOverlay, true);
        }
        // Set the appropriate lock state and then add temp mouse leave only if overlays are being locked
        var addMouseLeave = false;
        if ($(tg).closest(".ui-tree").length > 0 || $(tg).closest("#js-toggle-runtime-editor").length > 0) {
            addMouseLeave = _setOverlayLock(true);
        } else if ($(tg).closest("[isinspectorelement='true']").length > 0) {
            if (!pega.ui.inspector.isHighlightEnabled()) {
                addMouseLeave = _setOverlayLock(true);
            }
        }
        // If there was an overlay locked then add mouse up listener to all frames
        if (addMouseLeave) {
            var closestMeta = $(tg).closest(".ui-tree");
            if (closestMeta.length > 0) tg = closestMeta[0];
            tg.addEventListener("mouseleave", tempUnlockVisibleOverlay, true);
        }
    }
    /**
     * @public If an overlay is visible then repostion it
     */
    publicAPI.repositionOpenOverlay = function() {
        var OverlayElement = $("#_popOversContainer > div");
        // If there is an overlay in the DOM and it is not a runtime editing overlay then check position
        if (OverlayElement != null && OverlayElement.css("visibility") == "visible") {
            // Check right position of the open overlay and if it is going to overlap the tree then move over
            var OverlayRight = OverlayElement.offset().left + OverlayElement.outerWidth();
            if (OverlayRight > $topHarness.width()) {
                var NewOverlayLeft = $topHarness.width() - OverlayElement.outerWidth() - 10;
                if (NewOverlayLeft < 0) {
                    NewOverlayLeft = 0;
                }
                OverlayElement.css({
                    'left': NewOverlayLeft + 'px'
                });
            }
        }
    }
    /**
     * @public This fuction handle hidding all overlays that have been created
     */
    publicAPI.hideAllOverlays = function() {
        for (var i = 0; i < _allOverlays.length; i++) {
            _allOverlays[i].hide();
        }
    }
    /* ---- PUBLIC HIGHLIGHT APIS ---- */
    /**
     * @public Main hover method that is called from the Inspector Element model object to highlight the element on screen
     *
     * @param $Inspector Object$ inspectorObject - The inspector object that represents the HTML element
     * @param $Boolean$ skipTreeCall - A flag used to skip when to call tree related APIs. This is passed as true from tree events
     */
    publicAPI.hover = function(inspectorObject, skipTreeCall) {
        if ((desktopWindow != window) && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.hover(inspectorObject, skipTreeCall);
        } else {
            // Fall out if highlighting is disabled
            // TODO: Find a way to remove this. Once core is the only "highlighter" this should never need to be checked
            if (!publicAPI.isHighlightEnabled()) {
                return false;
            }
            var currentFocusedObj = publicAPI.getFocusedInspectorObject();
            // If trying to hover the focused element just clear hover highlight and return
            if (currentFocusedObj && currentFocusedObj.get("element")[0] == inspectorObject.get("element")[0]) {
                return pega.ui.inspector.clearHighlight();
            }
            var showHighlight = true;
            var jsTreeReference = pega.ui.inspector.panel.getJsTreeRef();
            //Check if tree is enabled, if so hover the tree node
            if (!skipTreeCall && pega.ui.inspector.panel.isUITreeVisible() && jsTreeReference) {
                //TODO Should consider an interface for jsTree with common functions
                //TODO Should uncomment when use tree namespace TreeObj.highlightNode(inspectorObject.id, highlightType);
                var showHighlight = (jsTreeReference.hover_node(inspectorObject.id) == false);
                // TODO: Once there is a tree interface then all this logic should be embedded in the interface
                if (showHighlight) {
                    var currentHoveredObj = publicAPI.getHoveredInspectorObject();
                    if (currentHoveredObj) {
                        jsTreeReference.dehover_node(currentHoveredObj.id);
                    }
                }
            }
            // Only show highlight if needed
            if (showHighlight) {
                _hoverInfoBar.setContent(pega.ui.inspector.utilities.getHoverInfoBarContent(inspectorObject));
                _highlight(inspectorObject, _hoverHighlight, _hoverInfoBar);
            }
            // Finally set the object
            pega.ui.inspector.setHoveredInspectorObject(inspectorObject);
        }
    }
    /**
     * @public Main focus method that is called from the Inspector Element model object to highlight the element on screen.
     * Also handles scrolling the element in the UI if in Chrome or Safari
     *
     * @param $Inspector Object$ inspectorObject - The inspector object that represents the HTML element
     * @param $Boolean$ skipTreeCall - A flag used to skip when to call tree related APIs. This is passed as true from tree events
     * @param $Boolean$ collapseNodesBeforeFocus - Flag for when to collapse all nodes in tree before selecting
     */
    publicAPI.focus = function(inspectorObject, skipTreeCall, collapseNodesBeforeFocus) {
        if ((desktopWindow != window) && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.focus(inspectorObject, skipTreeCall, collapseNodesBeforeFocus);
        } else {
            // Fall out if highlighting is disabled
            // TODO: Find a way to remove this. Once core is the only "highlighter" this should never need to be checked
            if (!publicAPI.isHighlightEnabled()) {
                return false;
            }
            // Set skin based on skin saved with this window
            pega.ui.inspector.panel.displaySkinInfo(inspectorObject.ownerWindow.pega.u.d.skinRuleName);
            var jsTreeReference = pega.ui.inspector.panel.getJsTreeRef();
            publicAPI.setFocusedInspectorObject(inspectorObject);
            //Check if tree is enabled, if so hover the tree node
            if (!skipTreeCall && pega.ui.inspector.panel.isUITreeVisible() && jsTreeReference) {
                //TODO Should uncomment when use tree namespace TreeObj.highlightNode(inspectorObject.id, highlightType);
                jsTreeReference.deselect_all(); //TODO: Create bindEvent for this?
                if (collapseNodesBeforeFocus) {
                    jsTreeReference.close_all(); //TODO: Create bindEvent for this?
                }
                jsTreeReference.select_node(inspectorObject.id);
                // Scroll to the selected element
                // NOTE: Only calling for chrome or safari since they support the animate
                var browser = publicAPI.getBrowser();
                if (browser === publicAPI.BROWSERS.CHROME || browser === publicAPI.BROWSERS.SAFARI) {
                    _scrollToFocusedElement();
                }
            } else {
                // Clear all highlights before highlighting
                pega.ui.inspector.clearHighlight(false);
                /** Comented out for the time being this results in hidding overlays when clicking icons from the tree
                    this is because on click of the icon you would expect the node to be selected but that results in this hide
                    which happens after the show
                    // pega.ui.inspector.hideAllOverlays();
                **/
                _focusInfoBar.setContent(pega.ui.inspector.utilities.getFocusInfoBarContent(inspectorObject));
                _highlight(inspectorObject, _focusHighlight, _focusInfoBar);
            }
        }
    }
    /**
     * @public Enables highlighting and repositions all open overlays. Handles toggling mouse cursor, refreshing the panel, and rehighlighting
     *
     * @param $Boolean$ bCollapseTree - Flag to be passed to rehighlight that indicates that the tree should be colapsed entirelay befor focus
     */
    publicAPI.enableHighlighting = function(bCollapseTree) {
        if ((desktopWindow != window) && desktopWindowInspectorProxy != null) {
            desktopWindowInspectorProxy.enableHighlighting();
        } else {
            if (pega.ui.inspector.editing.propertypanel.isOpen()) {
                $(".runtime-control-tree").addClass("ui-tree-readonly");
                return;
            }
            var tempList = publicAPI.getFrameList();
            for (var x = 0; x < tempList.length; x++) {
                if ($(tempList[x].document).length > 0) {
                    $(tempList[x].document.head).children("#runtime-panel-exp-style").remove();
                    tempList[x].pega.ui.inspector.repositionOpenOverlay();
                }
            }
            //Apply default cursor
            _toggleMouseCursor(true);
            isHighlightingEnabled = true;
            //Reload publish and history sections in tree
            setTimeout(pega.ui.inspector.panel.refresh, 500);

            if (pega.ui.inspector.panel.getListenForChanges() && pega.ui.inspector.panel.isUITreeVisible()) {
                //Turn on DOM manipulation events only when flag is set
                pega.ui.inspector.panel.startListeningForChanges();
            } else {
                pega.ui.inspector.panel.setListenForChanges(false);
                if (bCollapseTree != false) {
                    bCollapseTree = true;
                }
                //rehighlight UI
                publicAPI.rehighlight(bCollapseTree)
            }
        }
    }
    /**
     * @public Disables highlighting simply by setting the flag to false
     */
    publicAPI.disableHighlighting = function() {
        if ((desktopWindow != window) && desktopWindowInspectorProxy != null) {
            desktopWindowInspectorProxy.disableHighlighting();
        } else {
            isHighlightingEnabled = false;
        }
    }
    /**
     * @public State checker to see if highlighting is currently enabled
     *
     * @return $Boolean$ isHighlightEnabled - Flag for when highlighting is enabled
     */
    publicAPI.isHighlightEnabled = function() {
        if ((desktopWindow != window) && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.isHighlightEnabled();
        } else {
            return isHighlightingEnabled;
        }
    }
    /**
     * @public Clears highlighting, infobar, and clears flag for element being focused
     *
     * @param $Boolean$ focused - flag for when clearing focused vs hovered
     */
    publicAPI.clearHighlight = function(focused) {
        if (focused) {
            _focusHighlight.hide();
            _focusInfoBar.hide();
            publicAPI.setElementFocused(false);
        } else {
            _hoverHighlight.hide();
            _hoverInfoBar.hide();
            // de-hover UI Tree and Field Value tree if available
            if (hoveredInspectorObject) {
                if (pega.ui.inspector.panel.isUITreeVisible() && pega.ui.inspector.panel.getJsTreeRef()) {
                    pega.ui.inspector.panel.getJsTreeRef().dehover_node(hoveredInspectorObject.id);
                }
            }
        }
    }
    /**
     * @public Clears all highlighting, deselects all nodes in tree, and hides all overlays. Plus if param is set clears global variables
     *
     * @param $Boolean$ clearGlobals - If set to true then clears globals for focused/hovered objects
     */
    publicAPI.clearAllHighlights = function(clearGlobals) {
        if (desktopWindow != window && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.clearAllHighlights(clearGlobals);
        } else {
            if (clearGlobals) {
                hoveredInspectorObject = null;
                focusedInspectorObject = null;
            }
            publicAPI.clearHighlight();
            publicAPI.clearHighlight(true);
            if (pega.ui.inspector.panel.isUITreeVisible() && pega.ui.inspector.panel.getJsTreeRef()) {
                pega.ui.inspector.panel.getJsTreeRef().deselect_all();
            }
            // TODO: Should consider not doing this here...
            pega.ui.inspector.hideAllOverlays();
        }
    }
    /**
     * @public This function is responsible for figuring out the basic location of the element on screen. It starts by being
     * called in the window that the element lives in to figure out the base width/height and offset. Then it is recursivly
     * called to account for the iframes that the element could live in
     *
     * @param $Inspector Element$ inspectorObject - Inspector Element object for the element to calculate
     * @param $Object$ loc - The location object (top, left, width, height) this is passed along for calculations
     * @param $Window$ windowObject - Used durring recursive call to pass along the previous window object so the iframe location can be found
     * @return $Object$ loc - The complete location object for the given object
     */
    publicAPI.getElementLocation = function(inspectorObject, loc, windowObj) {
        if (!loc) loc = {};
        // Get the initial width and height of the element
        if (!loc.width || !loc.height) {
            loc = _calculateElementDimensions(inspectorObject.get("element")[0], inspectorObject)
            var offset = _getOffSetValue(inspectorObject.get("element")[0])
            loc.left = offset.left
            loc.top = offset.top
        }
        // Calculate the location of the window on the way up
        if (windowObj) {
            var offset = windowObj.frameElement.getBoundingClientRect()
            inspectorObject.set("ownerWindowLeft", offset.left)
            inspectorObject.set("ownerWindowTop", offset.top)
            loc.left += offset.left
            loc.top += offset.top
        }
        // Factor in scroll location
        // TODO: This accounts for two laywers of frames but no more
        // also if the top frame and the inner frame are scrolled it will not be accounted for
        if (window != desktopWindow && pega.ui.inspector.getIgnoreScrollForHighlight() == false) {
            // Only factor in scroll for non desktopWindow frame since in the desktopWindow it is covered by offset
            loc.top -= $(window).scrollTop()
            loc.left -= $(window).scrollLeft()
        }
        // Try to access the parent window if possable and if not catch nothing
        var parentWindow = window;
        try {
            parentWindow = window.parent;
        } catch (e) {
            // Do Nothing
        }
        // If the parent is not your self then continue going up
        // TODO: May want to not check desktopWindow when we integrate with Live Composer
        if (window != desktopWindow && parentWindow != window) {
            return parentWindow.pega.ui.inspector.getElementLocation(inspectorObject, loc, window)
        } else {
            return loc;
        }
    }
    /**
     * @public Getter for the currently focused Inspector Element object
     *
     * @return $Inspector Element$ focusedInspectorObject - The focused element object global
     */
    publicAPI.getFocusedInspectorObject = function() {
        if (desktopWindow != window && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.getFocusedInspectorObject();
        } else {
            return focusedInspectorObject;
        }
    }
    /**
     * @public Setter for the currently focused Inspector Element object
     *
     * @param $Inspector Element$ elementObject - The focused element object to set the global focusedInspectorObject to
     */
    publicAPI.setFocusedInspectorObject = function(elementObject) {
        if (desktopWindow != window && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.setFocusedInspectorObject(elementObject);
        } else {
            _previouslySelectedInspectorObject = focusedInspectorObject;
            focusedInspectorObject = elementObject;
        }
    }
    /**
     * @public Getter for the currently focused Inspector HTML Element
     *
     * @return $HTML Element$ The element stored on the currently focused Inspector global
     */
    publicAPI.getFocusedInspectorElement = function() {
        if ((desktopWindow != window) && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.getFocusedInspectorElement();
        } else {
            if (focusedInspectorObject) {
                return focusedInspectorObject.get('element')[0];
            } else {
                return false;
            }
        }
    }
    /**
     * @public Getter for the currently Hovered Inspector Element object
     *
     * @return $Inspector Element$ hoveredInspectorObject - The hovered element object global
     */
    //TODO: This shouldn't exist as nothing should know what the inspector has. This should be passed along when needed
    publicAPI.getHoveredInspectorObject = function() {
        if (desktopWindow != window && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.getHoveredInspectorObject();
        } else {
            return hoveredInspectorObject;
        }
    }
    /**
     * @public Setter for the currently hovered Inspector Element object
     *
     * @param $Inspector Element$ elementObject - The hovered element object to set the global hoveredInspectorObject to
     */
    //TODO: This shouldn't exist as nothing should know what the inspector has. Only the core should be able to set this value
    publicAPI.setHoveredInspectorObject = function(elementObject) {
        if (desktopWindow != window && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.setHoveredInspectorObject(elementObject);
        } else {
            hoveredInspectorObject = elementObject;
        }
    }
    /**
     * @public Getter for the currently hovered Inspector HTML Element
     *
     * @return $HTML Element$ The element stored on the currently hovered Inspector global
     */
    publicAPI.getHoveredInspectorElement = function() {
        if ((desktopWindow != window) && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.getHoveredInspectorElement();
        } else {
            if (hoveredInspectorObject) {
                return hoveredInspectorObject.get('element')[0];
            } else {
                return false;
            }
        }
    }
    /**
     * @public Getter for if an element is currently selected
     *
     * @return $Boolean$ isElementFocused - Flag for if an element is selected
     */
    publicAPI.isElementFocused = function() {
        if ((desktopWindow != window) && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.isElementFocused();
        } else {
            return isElementFocused;
        }
    }
    /**
     * @public Setter for if an element is currently selected
     *
     * @param $Boolean$ vale - FValue to set isElementFocused to
     */
    publicAPI.setElementFocused = function(val) {
        if ((desktopWindow != window) && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.setElementFocused(val);
        } else {
            isElementFocused = val;
        }
    }
    /**
     * @public Getter for the currently active window based on the currently focused element
     *
     * @return $Window$ focusedInspectorObject.ownerWindow - The owner window of the currently focused element
     */
    publicAPI.getActiveWindow = function() {
        if ((desktopWindow != window) && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.getActiveWindow();
        } else {
            if (focusedInspectorObject) {
                return focusedInspectorObject.ownerWindow;
            } else {
                return null;
            }
        }
    }
    /**
     * @public Called to rehighlight the previously highlighted elements. Three distinct options:
     * 1. Focused object (focusedInspectorObject) is still set so just reselect it
     * 2. Focused object (focusedInspectorObject) is not set so use previousElementClipboardPath object to find the element on screen based on path and reselect
     * 3. Hovered object (hoveredInspectorObject) is still set so just rehighlight it
     *
     * @param $Boolean$ bCollapse - Flag for if the tree should be minimized
     */
    publicAPI.rehighlight = function(bCollapse) {
        if ((desktopWindow != window) && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.rehighlight(bCollapse);
        } else {
            // For when refreshing the tree if highlight is disabled do not reselect
            if (!publicAPI.isHighlightEnabled()) {
                return false;
            }
            //If the elements were highlighted rehighlight them
            if (focusedInspectorObject && focusedInspectorObject.get("element") != null &&
                focusedInspectorObject.ownerWindow.document.body.contains(focusedInspectorObject.get(
                    "element")[0])) {
                pega.ui.inspector.focus(focusedInspectorObject, false, bCollapse);
            } else if (previousElementClipboardPath && previousElementClipboardPath.path != null) {
                // First check if the element still exists in the dom before rehighlighting it
                if (previousElementClipboardPath.frame && !previousElementClipboardPath.frame.document.body.contains(
                        previousElementClipboardPath.element)) {
                    previousElementClipboardPath = null;
                } else {
                    var $elementToHighlight = null;
                    var sectionChildren = null;
                    var sectionElement = $(previousElementClipboardPath.element).children(
                        "[data-ui-meta *= '" + previousElementClipboardPath.name + "']");
                    if (sectionElement.length == 0) {
                        sectionElement = previousElementClipboardPath.element.querySelectorAll(
                            "[data-ui-meta *= '" + previousElementClipboardPath.name + "']");
                    }
                    var tempElementObj = null;
                    //check if tree visible outside of loop for performance as this is a heavy call
                    var treeTabOpen = pega.ui.inspector.panel.isUITreeVisible();
                    //break loop is for performance as well, break the looping cycle once found, do not need to keep searching
                    var breakLoop = false;
                    //Loop the number of sections found (typically one, but may find mutliple)
                    for (var i = 0; i < sectionElement.length; i++) {
                        sectionChildren = sectionElement[i].querySelectorAll(
                            '[data-ui-meta *= "\'pgRef\':\'' + previousElementClipboardPath.path +
                            '\'"]');
                        //loop through the results of the possible elements that was found in the section
                        for (var j = 0; j < sectionChildren.length; j++) {
                            //if tree is visible find the current element's obj by element
                            if (treeTabOpen) {
                                tempElementObj = pega.ui.inspector.panel.getInspectorObjectByElement(
                                    sectionChildren[j])
                            } else { // else make a temp inspector object out of the current element
                                tempElementObj = pega.ui.inspector.utilities.getTempInspectorObject($(
                                    sectionChildren[j]));
                            }
                            if (tempElementObj) {
                                //make sure the element matches the known section to rehighlight in
                                var nearestSection = pega.ui.inspector.parser.getNearestParent(tempElementObj, [{
                                    'type': 'Section'
                                }]);
                                if (nearestSection && nearestSection.get('ruleName') ==
                                    previousElementClipboardPath.name) {
                                    //if true, correct element found, break loop and continue to rehighlight
                                    $elementToHighlight = $(sectionChildren[j]);
                                    breakLoop = true;
                                    break;
                                }
                            }
                        }
                        if (breakLoop) {
                            break;
                        }
                    }
                    // If the element has been found based off of previous path then select it
                    if ($elementToHighlight != null) {
                        var tempInspectorElementObj = null;
                        // If the tree is visible try and find the Inspector Element by calling panel
                        if (pega.ui.inspector.panel.isUITreeVisible()) {
                            tempInspectorElementObj = pega.ui.inspector.panel.getInspectorObjectByElement(
                                $elementToHighlight[0])
                        }
                        // If the Inspector Element was not found or the tree is not visible them make a temp object
                        if (!tempInspectorElementObj) {
                            tempInspectorElementObj = pega.ui.inspector.utilities.getTempInspectorObject(
                                $elementToHighlight);
                        }
                        // Focus the element
                        publicAPI.focus(tempInspectorElementObj, false, bCollapse);
                    }
                }
            }
            // If the primary highlight element is still set then rehighlight
            if (hoveredInspectorObject && hoveredInspectorObject.get("element") != null) {
                pega.ui.inspector.hover(hoveredInspectorObject, false, bCollapse);
            }
        }
    }
    /**
     * @public Sets the previousElementClipboardPath object for rehighlighting
     *
     * @param $Object$ object - The object to set previousElementClipboardPath to
     */
    publicAPI.setPreviousElementClipboardPath = function(object) {
        if ((desktopWindow != window) && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.setPreviousElementClipboardPath(object);
        } else {
            var tempFirstPath;
            if (object) {
                // get the clipboard path for the selected element
                tempFirstPath = object.get("pgRef");
            }
            if (tempFirstPath) {
                var tempScrollLoc = $(object.ownerWindow).scrollTop();
                // find the first section or harness parent of the selected element
                var tempTypes = [{
                    'type': 'Section'
                }, {
                    'type': 'Harness'
                }];
                var tempParent = pega.ui.inspector.parser.getNearestParent(object, tempTypes);
                // the parent will be null if the top-most harness was selected;
                // use the element itself in this case
                if (tempParent == null) {
                    tempParent = object;
                }
                var tempParentName = tempParent.get("ruleName");
                var tempParentElement;
                //This is for if section/layout combined elements. Some senarios seem to run into the layout itself as the element it finds,
                //if thats the case use that element, else find the element above it
                if ($(tempParent.get("element")[0]).attr('data-ui-meta').indexOf("Layout") > -1) {
                    tempParentElement = tempParent.get("element")[0];
                } else if (tempParent.get("type") && tempParent.get("subType") && tempParent.get("type") ==
                    "Section" && tempParent.get("subType") == "PANEL") {
                    // If you parent is a section in a panel then you need to go back down and find the element that is the section itself to get the imediate parent
                    tempParentElement = tempParent.get("element")[0].querySelector("[data-ui-meta*='" +
                        tempParentName + "']").parentElement;
                } else {
                    tempParentElement = tempParent.get("element")[0].parentElement;
                }
                // Call core to store off the previous clipboard path
                previousElementClipboardPath = {
                    path: tempFirstPath,
                    element: tempParentElement,
                    name: tempParentName,
                    scroll: tempScrollLoc,
                    frame: object.ownerWindow
                };
            } else {
                previousElementClipboardPath = null;
            }
        }
    }
    /**
     * @public Gets the current value of previousElementClipboardPath object
     */
    publicAPI.getPreviousElementClipboardPath = function() {
        if ((desktopWindow != window) && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.getPreviousElementClipboardPath();
        } else {
            return previousElementClipboardPath
        }
    }
    /**
     * @public Adjusts the previousElementClipboardPath object for when you are dragging since the pathRef will change
     *
     * @param $Integer$ increment - The amount to adjust the path
     */
    publicAPI.adjustClipboardPathOfLastElement = function(increment) {
        var cellNumber;
        var cells = ".pyCells(";
        var cellsLastIndex = previousElementClipboardPath.path.lastIndexOf(cells);
        // Extract the number X from the last occurence of ".pyCells(X)" for drop node
        if (cellsLastIndex != -1) {
            var temp = previousElementClipboardPath.path.substring(cellsLastIndex + cells.length);
            var firstParen = temp.indexOf(")");
            cellNumber = parseInt(temp.substring(0, firstParen)) + increment;
            previousElementClipboardPath.path = previousElementClipboardPath.path.substring(0,
                cellsLastIndex + cells.length) + cellNumber.toString() + ")"
        }
        return -1;
    }
    /**
     * @public Sets the ignoreScrollForHighlight global that is used to ignore scrolling logic when a property panel is open
     *
     * @param $Boolean$ value - The value to set
     */
    publicAPI.setIgnoreScrollForHighlight = function(value) {
        if (desktopWindow != window && desktopWindowInspectorProxy != null) {
            desktopWindowInspectorProxy.setIgnoreScrollForHighlight(value);
        } else {
            ignoreScrollForHighlight = value;
        }
    }
    /**
     * @public Gets ignoreScrollForHighlight global variable
     */
    publicAPI.getIgnoreScrollForHighlight = function() {
        if (desktopWindow != window && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.getIgnoreScrollForHighlight();
        } else {
            return ignoreScrollForHighlight;
        }
    }
    /**
     * @public Sets the previousElementClipboardPath object for rehighlighting
     *
     * @param $Object$ obj - The object to set previousElementClipboardPath to
     */
    publicAPI.isClickingSuppressed = function() {
        if (publicAPI.isActive() && (publicAPI.isHighlightEnabled())) {
            return true;
        } else {
            return false;
        }
    }
    /* ---- PUBLIC UTILITIES APIS ---- */
    /**
     * @public Launces the declarative network pop up for configuring declarative properties
     *
     * @param $String$ strClassName - Class name of the property
     * @param $String$ strPropertyName - The name of the property of o configure
     * @param $String$ strContextPageName - The name of the page that the property belongs to
     * @param $String$ strContextPageClass - The class of the context page
     * @param $String$ strSubScript - The subscript of the page being used for page lists
     */
    publicAPI.launchDeclarativeNetwork = function(strClassName, strPropertyName, strContextPageName,
        strContextPageClass, strSubScript) {
        //Get current active window so the Declarative Network is launched from the correct thread
        desktopWindowInspectorProxy.getActiveWindow().showDeclarativeNetwork(strClassName, strPropertyName,
            strContextPageName, strContextPageClass, strSubScript);
    }
    /**
     * @public Sets the flag used for debug logger
     *
     * @param $Boolean$ value - The value to set the flag to
     */
    publicAPI.setDebug = function(value) {
        isDebugOn = value;
    }
    /**
     * @public Logger util to print a message to the console when flag is set
     *
     * @param $String$ message - The message to print to the console
     */
    publicAPI.debugLogger = function(message) {
        if (isDebugOn) {
            console.log(message);
        }
    }
    /**
     * @public Getter for whether the Live UI side panel should show up or not
     *
     * @return $Boolean$ isShowSidePanel - the flag that dictates whether the panel will appear
     */
    publicAPI.isSidePanelEnabled = function() {
        if ((desktopWindow != window) && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.isSidePanelEnabled();
        } else {
            return _showSidePanel;
        }
    }
    /**
     * @public Setter for whether the Live UI side panel should show up or not
     *
     * @param $Boolean$ showSidePanel - the value that determines whether the panel is shown or not
     */
    publicAPI.enableSidePanel = function(showSidePanel) {
        if ((desktopWindow != window) && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.enableSidePanel(showSidePanel);
        } else {
            _showSidePanel = showSidePanel;
        }
    }
    /**
     * @public Getter for a list of elements to filter on (section, layout cell, etc)
     *
     * @return $Array$ filter - List of elements to filter on
     */
    publicAPI.getFilter = function() {
        if ((desktopWindow != window) && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.getFilter();
        } else {
            return filter;
        }
    }
    /**
     * @public Setter for a list of elements to filter on (section, layout cell, etc)
     */
    publicAPI.setFilter = function(newFilter) {
        if ((desktopWindow != window) && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.setFilter(newFilter);
        } else {
            filter = newFilter;
        }
    }
    /**
     * @public Getter for a list of elements to stop filtering on (section, layout cell, etc)
     *
     * @return $Array$ stopFilter - List of elements to stop filtering on
     */
    publicAPI.getStopFilter = function() {
        if ((desktopWindow != window) && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.getStopFilter();
        } else {
            return stopFilter;
        }
    }
    /**
     * @public Setter for a list of elements to stop filtering on (section, layout cell, etc)
     */
    publicAPI.setStopFilter = function(newStopFilter) {
        if ((desktopWindow != window) && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.setStopFilter(newStopFilter);
        } else {
            stopFilter = newStopFilter;
        }
    }
    /**
     * @public Getter for the context which sets the starting element for inspecting
     *
     * @return $Inspector Element$ contextElement - the starting element for inspecting
     */
    publicAPI.getContext = function() {
        if ((desktopWindow != window) && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.getContext();
        } else {
            return contextElement;
        }
    }
    /**
     * @public Setter for a new context to set the starting element for inspecting
     *
     * @param $Inspector Element$ newContextElement - The element to start from
     */
    publicAPI.setContext = function(newContextElement) {
        if ((desktopWindow != window) && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.setContext(newContextElement);
        } else {
            if (newContextElement == null) {
                newContextElement = document.body;
            }
            contextElement = newContextElement;
        }
    }
    /**
     * @public Getter for a list of all frames that contain the inspector considered
     *
     * @return $Array$ inspectorFrameList - List of all supported frames
     */
    publicAPI.getFrameList = function() {
        if ((desktopWindow != window) && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.getFrameList();
        } else {
            return inspectorFrameList;
        }
    }
    /**
     * @public Adds the given frame to the inspector frame list
     *
     * @param $Window$ frameRef - The frame to add to the list
     */
    publicAPI.addToFrameList = function(frameRef) {
        if ((desktopWindow != window) && desktopWindowInspectorProxy != null) {
            desktopWindowInspectorProxy.addToFrameList(frameRef);
        } else {
            inspectorFrameList.push(frameRef);
            if (desktopWindowInspectorProxy.isActive() == true) {
                //Turn on all events
                frameRef.pega.ui.inspector.turnOnEvents();
            }
        }
    }
    /**
     * @public Removes the given frame from the inspector frame list
     *
     * @param $Window$ frameRef - The frame to remove from the list
     */
    publicAPI.removeFrameFromList = function(frame) {
        var tempList = publicAPI.getFrameList();
        var length = tempList.length;
        for (var x = 0; x < length; x++) {
            if (tempList[x] == window) {
                tempList.splice(x, 1);
            }
        }
    }
    /**
     * Returns true if the UI element is not a harness, container, or
     * flow action.
     *
     * @param focusedElemObj The UI element that was clicked on using
     *   Live UI.
     */
    publicAPI.isActionsMenuIconEnabled = function(focusedElemObj) {
        var elemType = focusedElemObj.get("type");
        var elemSubType = focusedElemObj.get("subType");
        // bug-260897 - don't display actions menu icon if nothing is going to be in the actions menu
        var isInModal = pega.ui.inspector.utilities.isElementInModal(focusedElemObj.get("element")[0]);
        var hasFlowAction = focusedElemObj.get("flowAction") && focusedElemObj.get("flowAction") != "" && !
            isInModal;
        var focusedElemParent = pega.ui.inspector.parser.getNearestParent(focusedElemObj);
        var hasAddDeleteActions = focusedElemObj.get("subType") == "DYNAMICLAYOUT" || (focusedElemParent &&
            focusedElemParent.get("subType") == "DYNAMICLAYOUT");
        // end bug-260897
        return (elemType != "Harness" && elemType != "Container" && elemType != "FlowAction" && !(elemType ==
            "Layout" && elemSubType == "FREEFORM") && !(elemType == "Layout" && elemSubType ==
            "TEMPLATE") && !(elemType == "Layout" && elemSubType == "REPEATHORIZONTAL") && !(
            elemType == "Layout" && elemSubType == "REPEATTABBED") && !(elemType == "Section" &&
            elemSubType != null && elemSubType == "PANEL") && !(elemType == "Section" && (
            elemSubType == null || elemSubType == "")) && !(elemType == "Cell" && elemSubType ==
            "HEADERTITLE") && (hasFlowAction || hasAddDeleteActions));
    }
    /**
     * @public Checks if the object is part of a modal/overlay template, because if it is then editing is not allowed
     *
     * @param $Inspector Element$ obj - The inspectorl element object to check
     * @return $Boolean$ true/false - If the object is part of the template or not
     */
    publicAPI.isTemplateSection = function(obj) {
        var elem;
        if (obj.get('type') != "Section" || (obj.get('type') == "Section" && obj.get('subType') == "CELL")) {
            elem = pega.ui.inspector.parser.getNearestParent(obj, [{
                'type': 'Section'
            }])
            if (elem) {
                elem = elem.get('element');
            } else {
                return false;
            }
        } else {
            elem = obj.get('element');
        }
        var ownerDoc = elem[0].ownerDocument.defaultView;
        // Call popover API to see if the current element being editing is the template of an open overlay
        // BUG-268607 - Added a type of check to prevent a race condition when Live UI is turned on when a frame is still loading.
        if (typeof ownerDoc.pega.u.d.getPopOver === 'function' && ownerDoc.pega.u.d.getPopOver().getState() ==
            "locked" && ownerDoc.pega.u.d.getPopOver().getSectionElement() == elem[0]) {
            return true;
        }
        // Call modal dialog API to see if the current element is the template for an open modal
        if (ownerDoc.pega.u.d.bModalDialogOpen && ownerDoc.pega.u.d.modalDialog.body.children[0] == elem[0]) {
            return true;
        }
        return false
    }
    /* ---- PUBLIC EVENT HANDLER APIS ---- */
    /**
     * @public Check for event supression ignoring situations
     *
     * @param $Event$ e - Event to check if it should be ignored
     * @return $Element/False$ tg - Returns false if it should be ignored, or element if its a valid event
     */
    publicAPI.ignoreEvent = function(e) {
        if (!e) var e = window.event;
        if (e.target) var tg = e.target;
        else if (e.srcElement) var tg = e.srcElement;

        //this is cause it to fall out of anything in design view
        if (window.name === "sectionDisplayIFRAME") {
            return false;
        }

        //TODO: We seem to be checking if prop panel is opened below this check, it seems like we have duplicate logic
        var closestMeta = $(tg).closest('#_popOversContainer');
        if (closestMeta.length > 0 && closestMeta.find(".runtime-property-panel").length > 0) {
            return false;
        }
        //ignore if its componenets of the property panel.
        //Checking if prop panel is even open before parsing dom for closet parents (minor performance gain)
        if (pega.ui.inspector.editing.propertypanel.isOpen()) {
            if (closestMeta.length > 0 || //TODO: is this even needed if we already know prop panel is open? seems irrelevant
                $(tg).closest('.autocompleteAG').length > 0 || $(tg).closest('#expression-builder').length > 0) {
                return false;
            }
        }
        if ($(tg).closest("[isInspectorElement]").length > 0 || $(tg).closest("#runtime-property-panel").length > 0 || 
            //TODO: Should this be in the if block below checking prop panel stuff?
            $(tg).closest(".runtime-property-panel").length > 0 || //TODO: Same as above
            $(tg).closest("[aria-label='GenerateNewAutomationID']").length > 0 || //TODO: Same as above
            $(tg).closest("#acresults-list").length > 0 || $(tg).closest("#ISnsSelect").length > 0 || 
            $(tg).closest("[aria-label='pzChangeTemplateType']").length > 0 || 
            $(tg).closest(".ui-inspector").length > 0) {
            return false;
        }
        // If this is a frame element, return and ignore
        if (tg.tagName && (tg.tagName.toLowerCase() == "frame" || tg.tagName.toLowerCase() == "iframe")) {
            // am I the current active window
            if (desktopWindowInspectorProxy.getActiveWindow() != window) {
                return false;
            }
        }
        if ($(tg).closest("#modalWrapper").length > 0) {
            publicAPI.setIgnoreScrollForHighlight(true);
        } else {
            publicAPI.setIgnoreScrollForHighlight(false);
        }
        return tg;
    }
    /**
     * @public Event handler for keyDown events. Used for hot keys, checks if they are both down at the same time
     *
     * @param $Event$ e - The event object for the event
     */
    publicAPI.handleKeyDown = function(e) {
        if ((desktopWindow != window) && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.handleKeyDown(e);
        } else {
            if (desktopWindowInspectorProxy.isActive() && !pega.ui.inspector.editing.propertypanel.isOpen() &&
                state != STATES.BUSY) {
                //console.log("Press: " + e.keyCode);
                switch (e.keyCode) {
                    case 16: //Shift Key
                        _toggleSuppressionHotKey1Down = true;
                        break;
                    case 17: //Control Key
                        _toggleSuppressionHotKey2Down = true;
                        break;
                }
                //If hot key is down then set hot keys down
                if (_toggleSuppressionHotKey1Down && _toggleSuppressionHotKey2Down && !
                    _bothToggleSuppressionHotKeysDown) {
                    //console.log("Hot keys down");
                    //Set flag that hot keys are down
                    _bothToggleSuppressionHotKeysDown = true;
                }
            }
        }
    }
    /**
     * @public Event handler for keyUp events. Used for hot keys and knowing if something what clicked when suppression was disabled
     *
     * @param $Event$ e - The event object for the event
     */
    publicAPI.handleKeyUp = function(e) {
        if ((desktopWindow != window) && desktopWindowInspectorProxy != null) {
            return desktopWindowInspectorProxy.handleKeyUp(e);
        } else {
            if (desktopWindowInspectorProxy.isActive() && !pega.ui.inspector.editing.propertypanel.isOpen()) {
                //console.log("Up: " + e.keyCode);
                switch (e.keyCode) {
                    case 16: //Shift Key
                        _toggleSuppressionHotKey1Down = false;
                        break;
                    case 17: //Control Key
                        _toggleSuppressionHotKey2Down = false;
                        break;
                    default:
                        if (!publicAPI.isHighlightEnabled()) {
                            pega.ui.inspector.panel.setListenForChanges(true);
                        }
                }
                //If both hot keys are down then set hot keys down
                if (!_toggleSuppressionHotKey1Down && !_toggleSuppressionHotKey2Down &&
                    _bothToggleSuppressionHotKeysDown) {
                    //Toggle suppression after changing state of checkbox
                    publicAPI.toggleSuppression();
                    //Set flag that hot keys are down
                    _bothToggleSuppressionHotKeysDown = false;
                }
            }
        }
    }
    /**
     * @public Handles stopping event propagation for the given event. This is how we suppress events at the window level
     *
     * @param $Event$ e - The event object for the event
     */
    publicAPI.handleSupression = function(e) {
        if (e.target) var tg = e.target;
        else if (e.srcElement) var tg = e.srcElement;
        if (e.preventDefault) e.preventDefault();
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
        return false;
    }
    /**
     * @public Setter for mouse position globals
     *
     * @param $Integer$ x - The x value to store off
     * @param $Integer$ y - The y value to store off
     */
    publicAPI.setMousePosition = function(x, y) {
        if (desktopWindow != window && desktopWindowInspectorProxy != null) {
            desktopWindowInspectorProxy.setMousePosition(x, y);
        } else {
            mousePositionX = x;
            mousePositionY = y;
        }
    }
    /**
     * @public Getter for the currently stored mouse x location
     */
    publicAPI.getMouseX = function() {
        return mousePositionX;
    }
    /**
     * @public Getter for the currently stored mouse y location
     */
    publicAPI.getMouseY = function() {
        return mousePositionY;
    }
    /* ---- PUBLIC OPEN RULE APIS ---- */
    /**
     * @public Open rule API for a rule with a pzInsKey
     *
     * @param $String$ insKey - The pzInsKey of the rule to open
     */
    publicAPI.openElementRuleForInsKey = function(insKey) {
        return pega.ui.inspector.utilities.openRuleByInsKey(insKey, _openRuleCallback);
    }
    /**
     * @public Open rule API for a rule with a class, name and obj class
     *
     * @param $String$ className - The className of the rule to open
     * @param $String$ ruleName - The ruleName to open
     * @param $String$ objClass - The objClass of the rule to open
     */
    publicAPI.openElementRule = function(className, ruleName, objClass) {
        return pega.ui.inspector.utilities.openRuleByClassAndName(className, ruleName, objClass, _openRuleCallback);
    }
    /**
     * @public Open the specified skin rule based only by name
     *
     * @param $String$ skinName - The name of the skinName to open
     */
    publicAPI.openSkinRule = function(skinName) {
        return pega.ui.inspector.utilities.openRuleByClassAndName(null, skinName, "Rule-PortalSkin", _openRuleCallback);
    }
    return publicAPI
}());
window.addEventListener("load", function() {
    pega.ui.inspector.start();
});
/////////////////////////////////////////////////////////////////////////////////
//                            DEPRECATED NAMESPACE                             //
/////////////////////////////////////////////////////////////////////////////////
/**
 * The namespace below is the old inspector namespace. Since the namespace has
 * been changed to a new location we redirect any old calls to toggle to the new
 * toggle method in the new namespace. This is purely for backwards compatability
 **/
$pNamespace("pega.ui.designer")
pega.ui.designer.tree = (function() {
    var publicAPI = {}
    /**
     * @public Original toggle function to toggle on the inspector.
     **/
    publicAPI.toggle = pega.ui.inspector.toggle;
    return publicAPI;
}());
//static-content-hash-trigger-GCC
// Utilities functions in support of Live UI/Inspector
// All functions included here should be stateless and should have no or minimal impact on the environment

var $pNamespace = pega.namespace;
$pNamespace("pega.ui.inspector");

// The editor is a singleton class which returns its public methods.
pega.ui.inspector.utilities = (function() {
    var uniqueID = 1;

    var SUB_TYPES = {
        PXICON: "Icon",
        PXLINK: "Link",
        PXRADIOBUTTONS: "Radio Buttons",
        PXAUTOCOMPLETE: "Autocomplete",
        PXCHECKBOX: "Checkbox",
        PXDROPDOWN: "Dropdown",
        PXTEXTAREA: "Text Area",
        PXTEXTINPUT: "Text Input",
        PXBUTTON: "Button",
        PXDISPLAYTEXT: "Formatted Text",
        PXHIDDEN: "Hidden Text",
        PXCURRENCY: "Currency",
        PXDATETIME: "Date Time",
        PXINTEGER: "Integer",
        PXNUMBER: "Number",
        PXPASSWORD: "Password",
        PXPERCENTAGE: "Percentage",
        PXATTACHCONTENT: "Attach Content",
        DATAFIELD: "Data Field",
        MENUBAR: "Menu Bar",
        PXRICHTEXTEDITOR: "Rich Text Editor",
        PXADDRESSMAP: "Address Map",
        PXSIGNATURECAPTURE: "Signature Capture",
        PXMENU: "Menu",
        TOP: "Top",
        LEFT: "Left",
        RIGHT: "Right",
        CENTER: "Center",
        BOTTOM: "Bottom",
        FREEFORM: "Free Form",
        TEMPLATE: "Smart",
        DYNAMICLAYOUT: "Dynamic",
        TABGROUP: "Tab Group",
        REPEATGRID: "Table",
        DYNAMICCOLUMN: "Dynamic Column",
        DYNAMICLAYOUTGROUP: "Layout Group",
        DYNAMICREPEATING: "Dynamic Repeating",
        REPEATVERTICAL: "Repeat Vertical",
        REPEATHORIZONTAL: "Repeat Horizontal",
        REPEATTABBED: "Repeat Tabbed",
        REPEATTREE: "Hierarchical List",
        REPEATTREEGRID: "Hierarchical Table",
        SECTIONINCLUDE: "Section",
        SUB_SECTION: "Section (Cell)",
        CELL: "Cell",
        PANEL: "Panel",
        CONTAINER: "Container",
        LAYOUT: "Layout",
      	REPEATINGDYNAMICLAYOUTGROUP: "Dynamic Layout Group",
        LABEL: "Label",
        PXCHART: "Chart",
        PXEMAIL: "Email",
        PXPHONE: "Phone",
        PXURL: "URL",
        SMARTLABEL: "Smart Label",
        LISTTOLIST: "List to List",
      	PXMULTISELECT: "Multiselect List"
    }

    /////////////////////////////////////////////////////////////////////////////////
    //                                  PRIVATE API                                //
    /////////////////////////////////////////////////////////////////////////////////
    /**
     * @private Handles calculating the dimensions of the given element. Covers 3 scenarios that need work arounds
     * 1. Dynamic Layout Group - Store off just the top value so that the original can be used launchDeclarativeNetwork
     * 2. Layouts - Set display to block and overflow to hidden so that width is accurate
     * 3. Spans - Span elements are set to display block so that the width is correct in chrome and safari
     */
    function _calculateElementWidthAndHeight(htmlElement) {
        var inspectorElementObj = publicAPI.getTempInspectorObject($(htmlElement));
        var dimensions = {
            width: 0,
            height: 0
        }

        //If working on a dynamic group layout calculate offset first and store off top
        var isDynamicGroupLayout = ((inspectorElementObj.get("subType") == "DYNAMICLAYOUTGROUP") || (inspectorElementObj.get("subType") == "REPEATINGDYNAMICLAYOUTGROUP") );

        if (isDynamicGroupLayout) {
            var DynamicGroupTop = _getOffSetValue(htmlElement).top;
        }

        dimensions.width = htmlElement.offsetWidth
        dimensions.height = htmlElement.offsetHeight

        //Set top back for dynamic groups
        if (isDynamicGroupLayout) {
            dimensions.top = DynamicGroupTop;
        }

        // Spans have no width or height in chrome and safari so set to block for a sec
        if (($(document.documentElement).hasClass("chrome") || $(document.documentElement).hasClass("safari")) 
            && htmlElement.nodeName.toLowerCase() == "span") {
            var tempElementDisplay = htmlElement.style.display;
            if (tempElementDisplay != "inline" && tempElementDisplay != "block") {
                var elemHeight = htmlElement.offsetHeight;
                if (elemHeight <= 2) {
                    htmlElement.style.display = "block";
                    dimensions.width = $(htmlElement).width();
                    dimensions.height = $(htmlElement).height();
                }

                // Set the style back
                if (tempElementDisplay != null)
                    htmlElement.style.display = tempElementDisplay;
            }
        }

        return dimensions;
    }

     /**
     * @private Calculated the elements offset using old jQuery logic because of performance reasones
     *
     * @param $Element$ elem - The element to calculate the offset of
     * @return $Object$ Object containing top, left, width, and height
     **/
    function _getOffSetValue(elem) {
        if (!elem || !elem.ownerDocument) {
            return null;
        }

        if (elem === elem.ownerDocument.body) {
            return jQuery.offset.bodyOffset(elem);
        }

        var computedStyle,
            offsetParent = elem.offsetParent,
            prevOffsetParent = elem,
            doc = elem.ownerDocument,
            docElem = doc.documentElement,
            body = doc.body,
            defaultView = doc.defaultView,
            prevComputedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle,
            top = elem.offsetTop,
            left = elem.offsetLeft;

        while ((elem = elem.parentNode) && elem !== body && elem !== docElem) {
            if (jQuery.support.fixedPosition && prevComputedStyle.position === "fixed") {
                break;
            }

            computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
            top -= elem.scrollTop;
            left -= elem.scrollLeft;

            if (elem === offsetParent) {
                top += elem.offsetTop;
                left += elem.offsetLeft;

                if (jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName))) {
                    top += parseFloat(computedStyle.borderTopWidth) || 0;
                    left += parseFloat(computedStyle.borderLeftWidth) || 0;
                }

                prevOffsetParent = offsetParent;
                offsetParent = elem.offsetParent;
            }

            if (jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible") {
                top += parseFloat(computedStyle.borderTopWidth) || 0;
                left += parseFloat(computedStyle.borderLeftWidth) || 0;
            }

            prevComputedStyle = computedStyle;
        }

        if (prevComputedStyle && (prevComputedStyle.position === "relative" || prevComputedStyle.position === "static")) {
            top += body.offsetTop;
            left += body.offsetLeft;
        }

        if (jQuery.support.fixedPosition && prevComputedStyle.position === "fixed") {
            top += Math.max(docElem.scrollTop, body.scrollTop);
            left += Math.max(docElem.scrollLeft, body.scrollLeft);
        }

        return {
            top: top,
            left: left
        };
    }

    /**
     * @private Open a rule given the correct information. Will open in pop up if needed
     *
     * @param $String$ insKey - pzInsKey of the rule to open
     * @param $String$ ruleName - Name of the rule to open
     * @param $String$ className - Class name of the rule to open
     * @param $String$ objClass - ObjClass of the rule to open
     * @param $Function$ callback - A callback function for where the rule is opening
     */
    function _openRule(insKey, ruleName, className, objClass, callback) {
        if (!(insKey != null || ruleName != null)) return;
        var oAttachedDesktop;
        if (pega.ui.composer) {
            //This is used to check for the composer desktopwindow so that it can find an attached desktop window (namely designer studio) if
            //in a portal that is using form factor preview in desktop mode, this will allow it to open in design studio rather than a new pop up
            oAttachedDesktop = pega.ui.composer.getCurrentComposerWindow().pega.desktop.support.getAttachedDesignerDesktop();
        } else {
            // Added this line to display a message when we use the inspector to open a rule
            oAttachedDesktop = pega.desktop.support.getAttachedDesignerDesktop();
        }

        // BUG-370024: If the user is currently in a Workspace, use the Workspace openRule() API to display the rule; otherwise open the rule in a popup.
        if(oAttachedDesktop.pega.desktop.portalCategory === "workspace") {
            //OPEN RULE DEPENDING ON PARAMS
            if (insKey != null) { 
                oAttachedDesktop.pega.desktop.wks.openRule("Developer", insKey);
            } else if (className != null && objClass != null) {
                oAttachedDesktop.pega.desktop.wks.openRule("Developer", objClass, className + "!" + ruleName, "");
            } else {
                oAttachedDesktop.pega.desktop.wks.openRule("Developer", objClass, ruleName, "");
            }
        } else {
            // If not opening in designer studio then show in popup
            if(oAttachedDesktop.pega.u.d.getHarnessClass() != "Data-Portal-DesignerStudio" || oAttachedDesktop.pega.u.d.getHarnessPurpose() != "pzStudio") {
                pega.desktop.showNextInWindow();
            }
          
            //OPEN RULE DEPENDING ON PARAMS
            if (insKey != null) { 
                oAttachedDesktop.pega.desktop.openRule(insKey, true);
            } else if (className != null && objClass != null) {
                oAttachedDesktop.pega.desktop.openRuleByClassAndName(className + "!" + ruleName, objClass);
            } else {
                oAttachedDesktop.pega.desktop.openRuleByClassAndName(ruleName, objClass);
            }
        }
      
        // If given a callback then call it
        if (callback != null) {
            callback(oAttachedDesktop);
        }
    }

    /////////////////////////////////////////////////////////////////////////////////
    //                                  PUBLIC API                                 //
    /////////////////////////////////////////////////////////////////////////////////
    var publicAPI = {};

    /**
     * @public Called to open a rule using the pzInsKey of the rule
     * 
     * @param $String$ insKey - the inskey of the rule to open
     * @param $Function$ callback - a callback function to be called with window opening from
     */
    publicAPI.openRuleByInsKey = function(insKey, callback) {
        return _openRule(insKey, null, null, null, callback);
    }

    /**
     * @public Open rule API for a rule with a class, name and obj class
     *
     * @param $String$ className - The className of the rule to open
     * @param $String$ ruleName - The ruleName to open
     * @param $String$ objClass - The objClass of the rule to open
     * @param $Function$ callback - a callback function to be called with window opening from
     */
    publicAPI.openRuleByClassAndName = function(className, ruleName, objClass, callback) {
        return _openRule(null, ruleName, className, objClass, callback);
    }

    /**
     * @public Generates a simple unique id by incrementing a counter
     *
     * @param $Boolean$ reset - Flag to cause the counter to reset
     * @return $Integer$ uniqueID - The ID that was incremented
     */
    publicAPI.getUniqueID = function(reset) {
        if (reset == true) {
            uniqueID = 1;
        } else {
            return uniqueID++;
        }
    }

    /**
     * @public Retrieves the target element that the event was launched from.  Will
     * return null if the event did not have a target.
     *
     * @param myEvent The event to retrieve the element from.
     * @return The element that the event originated from.
     */
    publicAPI.getTargetFromEvent = function(myEvent) {
        if (!myEvent) {
            myEvent = window.event;
        }

        var tg = null;

        if (myEvent.target) {
            tg = myEvent.target;
        } else if (myEvent.srcElement) {
            tg = myEvent.srcElement;
        }

        return tg;
    }

    /**
     * @public Reverses the order of the children elements contained in the specified element.
     *
     * @param $HTML element$ elem An element whose children will be reversed.
     */
    publicAPI.reverseChildren = function(elem) {
        // Only reverse the children elements if there is more than one child element
        if (elem.children.length > 1) {
            for (var i = elem.children.length - 2; i >= 0; i--) {
                elem.appendChild(elem.children[i]);
            }
        }
    }

    /**
     * @public Removes the children elements contained in the specified element.
     *
     * @param $HTML element$ elem An element whose children will be cleared.
     */
    publicAPI.removeChildren = function(elem) {
        // Only remove the children elements if there is at least one child element
        if (elem.children.length > 0) {
            while (elem.firstChild) {
                elem.removeChild(elem.firstChild);
            }
        }
    }

    /**
     * @public Moves an HTML element to a new location.
     *
     * @param $HTML element$ elem The element to be moved.
     * @param $int$ x The x component of the new location for the element.
     * @param $int$ y The y component of the new location for the element.
     */
    publicAPI.moveElement = function(elem, x, y) {
        var elemStyle = elem.style;

        if (document.all) {
            elemStyle.pixelLeft = x;
            elemStyle.pixelTop = y;
        } else {
            elemStyle.left = x + "px";
            elemStyle.top = y + "px";
        }
    }

    /**
     * @public Creates and returns an element based on parameters
     *
     * @param $String$ tag - The tag name of the element to create
     * @param $Object$ attributes - An object of the attributes you want set on the new element
     * @param $Object$ events - An object of the events you want to add on the new element
     * @return $Element$ The element that was created
     */
    publicAPI.createElement = function(tag, attributes, events) {
        var tempElement = document.createElement(tag);

        // Loops over all key/values stored in attributes and applies them to the new element
        for (var key in attributes) {
            tempElement[key] = attributes[key];
        }

        // Loops over all key/values stored in events and adds listeners for them to the new element
        for (var key in events) {
            tempElement.addEventListener(key, events[key]);
        }

        return tempElement;
    }

    /** Creates display text based on passed in inspector data
     *  @param metaData The model to adjust
     *  @return HTML string of display data
     **/
    publicAPI.displayUIElementText = function(metaData) {
     
        var PROPERTY_TEXT = "Property";
        var EMPTY_TEXT = "Empty";

        var returnString = "";
        if (metaData.type == "Section" && metaData.subType && metaData.subType != "") {
            //For sections in a layout say section include
            if (metaData.subType != "LAYOUT") {
                returnString += "<span class='runtime-tree-prefix'>" + metaData.type + " in " + metaData.subTypeDisplay.toLowerCase();
            } else {
                returnString += "<span class='runtime-tree-prefix'>" + metaData.type + " include ";
            }
            //For section includes check the name
            if (metaData.ruleName && metaData.ruleName != "") {
                returnString += " -</span><span class='RuntimeInspectorValue'> " + metaData.ruleName + "</span>";
            } else {
                returnString += " -</span><span class='RuntimeInspectorValue'> non-auto generated</span>";
            }
        } else if (metaData.type == "Section" || metaData.type == "Harness") {
            returnString += "<span class='runtime-tree-prefix'>" + metaData.type + " -</span><span class='RuntimeInspectorValue'> " + metaData.ruleName + "</span>";
        } else if (metaData.type == "FlowAction") {
            returnString += "<span class='runtime-tree-prefix'>" + "Flow Action -</span><span class='RuntimeInspectorValue'> " + metaData.ruleName + "</span>";
        } else if (metaData.type == "Panel") {
            returnString += "<span class='runtime-tree-prefix'>" + metaData.type + " -</span><span class='RuntimeInspectorValue'> " + metaData.subTypeDisplay + "</span>";
        } else if (metaData.type == "Layout" && (metaData.subTypeDisplay != "" && metaData.subTypeDisplay)) {
            if(metaData.subTypeDisplay == SUB_TYPES.DYNAMICLAYOUTGROUP ||metaData.subTypeDisplay == SUB_TYPES.REPEATINGDYNAMICLAYOUTGROUP  ){
            	  returnString += "<span class='runtime-tree-prefix'>" + metaData.subTypeDisplay + "</span>";
            } else {
               returnString += "<span class='runtime-tree-prefix'>" + metaData.subTypeDisplay + " " + metaData.type + "</span>";
            }
        } else if (metaData.type == "Layout" || metaData.type == "Container") {
            returnString += "<span class='runtime-tree-prefix'>" + metaData.type + "</span>";
        } else if (metaData.type == "Cell" && (metaData.clipboardPath != "" && metaData.clipboardPath) && (metaData.subTypeDisplay != "" && metaData.subTypeDisplay)) {
            returnString += "<span class='runtime-tree-prefix'>" + metaData.subTypeDisplay + " -</span><span class='RuntimeInspectorValue'> " + decodeURIComponent(metaData.clipboardPath) + "</span>";;
        } else if (metaData.type == "Cell" && (metaData.subTypeDisplay != "" && metaData.subTypeDisplay)) {
            returnString += "<span class='RuntimeInspectorValue'>" + metaData.subTypeDisplay + "</span>";
        } else if (metaData.type == "Cell" && (metaData.clipboardPath != "" && metaData.clipboardPath)) {
            returnString += "<span class='runtime-tree-prefix'>" + PROPERTY_TEXT + " -</span><span class='RuntimeInspectorValue'> " + decodeURIComponent(metaData.clipboardPath) + "</span>";
        } else if (metaData.type == "Cell") {
            returnString += "<span class='runtime-tree-prefix'>" + EMPTY_TEXT + "</span>";
        } else {
            returnString += "Not Supported by Inspector";
        }

        return returnString;
    }

    /** @public Updates specific data on the input object
     *    - Subtype: Changes the text to something more readable for display in the inspector
     *    - clipboardPath: Clear out if it includes pyTemplate
     *  @param metaData The model to adjust
     *  @return metaData object
     **/
    publicAPI.translateMetaData = function(metaData) {
        if (metaData.subType != null || metaData.subType) {
            var temp = decodeURIComponent(metaData.subType);
            temp = temp.trim(); // BUG-163896: Change the %20's to spaces and removes whitespace from both ends of the string

            var newSubType = SUB_TYPES[temp];
            // Change the sub type base on look up
            if (newSubType && newSubType != "") {
                metaData.subTypeDisplay = newSubType;
            }
        }

        if (metaData.clipboardPath != "" && metaData.clipboardPath) {
            var pyTemplate = /pyTemplate/
            if (metaData.clipboardPath.match(pyTemplate) == "pyTemplate")
                metaData.clipboardPath = "";
        }
        return metaData;
    }

    /**
     * @public Temporarily removes the data-click attribute from the specified element and stores it in another attribute.
     *
     * @param cssSelector The CSS selector for the element whose data-click attribute needs to be removed.
     */
    publicAPI.removeDataClick = function(cssSelector) {
        var originalVal = $(cssSelector).attr("data-click");
        $(cssSelector).attr("data-click-original", originalVal);
        $(cssSelector).removeAttr("data-click");
    }

    /**
     * @public Restores the data-click attribute that had been previously removed from the specified element.
     *
     * @param cssSelector The CSS selector for the element whose data-click attribute needs to be restored.
     */
    publicAPI.restoreDataClick = function(cssSelector) {
        var originalVal = $(cssSelector).attr("data-click-original");
        $(cssSelector).attr("data-click", originalVal);
        $(cssSelector).removeAttr("data-click-original");
    }

    /**
     * @public Checks an element against a set of filters
     *
     * @param $Object$ elem - base element to compare against
     * @param $Object$ filters - object to check against for matching attributes
     * @return True if elem contains the attribute values in filters, false if not
     */
    publicAPI.elementMatchesFilters = function(elem, filters) {
        // For each filter
        for (var i = 0; i < filters.length; i++) {
            var filter = filters[i];
            var matchesFilter = true;
            // For each attribute of filter
            for (var key in filter) {
                if (filter.hasOwnProperty(key)) {
                    if (filter[key] != elem.get(key)) {
                        matchesFilter = false;
                        break;
                    }
                }
            }

            // If the filter matched, then stop filter comparison and set passFilter true
            if (matchesFilter) {
                return true;
            }
        }
        return false;
    }

    /**
     * @private Creates a temporary Inspector Element object for the given element
     *
     * @param $Element$ $element - Element to make the object for
     $ @return $Object$ returnModel - The inspector object that was created
     */
    publicAPI.getTempInspectorObject = function($element) {
        var tempDesktopWindow = pega.ui.inspector.getDesktopWindow();
        var returnModel = new tempDesktopWindow.pega.ui.inspector.Element($element[0], null, false)

        if (returnModel.get("type") && returnModel.get("type") == "Section") {
            var pairedElement = $element.parent().closest('[data-ui-meta]');
            var uiMeta = eval("(" + pairedElement.attr("data-ui-meta") + ")");
            if (uiMeta) {
                if (uiMeta.subType && uiMeta.type && ((uiMeta.subType == "SECTIONINCLUDE" || uiMeta.subType == "SUB_SECTION") || uiMeta.type == "Panel")) {
                    // Remake the model object based on the parent element
                    returnModel = new tempDesktopWindow.pega.ui.inspector.Element(pairedElement[0], null, false)
                }
                pega.ui.inspector.parser.adjustModelObject(returnModel, pairedElement[0]);
            }
        } else {
            pega.ui.inspector.parser.adjustModelObject(returnModel, $element[0]);
        }

        // Translate the meta data for display purposes
        pega.ui.inspector.utilities.translateMetaData(returnModel.getAllAttributes());
        return returnModel;
    }

    /**
     * @public Adjusts the location object based on a couple of work arounds for the desktop window
     * 1. Prevent element highlight to show outside left of iframe
     * 2. Prevent element highlight from overlapping UI Panel
     *
     * @param $Inspector Element$ inspectorObj - The current inspector element object
     * @param $Object$ loc - The location object of what to hover (width, height, top, left)
     */
    publicAPI.adjustLocationForDesktopWindow = function(inspectorObj, loc) {
        // Get a reference of the topHarness from the core
        var $topHarness = pega.ui.inspector.getTopHarness()

        // get the distance that the user has scrolled horizontally in top frame
        var scrollLeft = $(document).scrollLeft()

        // Get a reference to the ownerWindowLeft
        var ownerWindowLeft = inspectorObj.get("ownerWindowLeft")

        // if window is scrolled to the right make sure we highlight
        // at the leftmost edge of the screen/frame
        // this works in frames since getFrameLoc is used forces elements to be visible
        if (loc.left < (scrollLeft + ownerWindowLeft)) {
            loc.width -= scrollLeft - loc.left + ownerWindowLeft;
            if (loc.width < 0) {
                loc.width = 0;
            }
            loc.left = scrollLeft + ownerWindowLeft;
        }

        //WORKAROUND - If right side is off screen adjust the width
        // If off screen calculate portion of element off screen and subtract that from width
        // this is done by getting furthest right edge of element and subtracting width of harness and scroll position
        // this is only done in the top most frame since that is where the highlighting elements are
        if ((loc.left + loc.width) > ($topHarness.outerWidth() + scrollLeft)) {
            loc.width -= (loc.left + loc.width) - $topHarness.outerWidth() - scrollLeft;
        }
    }

    /**
     * @public Used to tell if an element is found within a modal dialog.
     *
     * @param $HTML Element$ htmlElement - The element to be looked for in an open modal within the same frame.
     */
    publicAPI.isElementInModal = function(htmlElement) {
      	// BUG-260897 - needed for hiding various ways to access property panel
      	return htmlElement.ownerDocument.defaultView.pega.u.d.bModalDialogOpen &&
          	htmlElement.ownerDocument.defaultView.pega.u.d.modalDialog.body.contains(htmlElement);
    }

    /**
     * @public Creates the html content for a hover info bar.
     *
     * @param $Inspector Object$ inspectorObject - The model object of the element to show info bar for
     */
    publicAPI.getHoverInfoBarContent = function(inspectorObject) {
        var newContent = document.createElement("DIV");

        var label = publicAPI.createElement("DIV", {
            className: "idpanel-text"
        });
        label.innerHTML = publicAPI.displayUIElementText(inspectorObject.getAllAttributes());
        newContent.appendChild(label);

        return newContent;
    }
    
    /**
    * @public launch clipboard viewer in context of element in focus
    *
    * @param $Inspector Object$ inspectorObject - The model object of the element to show info bar for    
    */
    publicAPI.launchClipboard = function(inspectorObject) {
      // baseRef is defined for elements that are sourced by clipboard reference
      // return if there is no reference
      if(typeof inspectorObject.get("baseRef") === "undefined") {
        return;
      }
      // Launch clipboard window in context of element
      var options = {
        harness: "pzClipboard",
        harnessClass: "Pega-Clipboard" ,
        displayMode: pega.api.ui.constants.POP_UP_WINDOW, 
        contextPage: "ClipboardPages",
        windowName: "Clipboard Viewer",
        windowWidth: 1200,     
        windowHeight: 768,  
        readOnly: false,
        activity: {name: "pxSetClipboardContext", parameters: [ 
          {name: "reference", value: inspectorObject.get("baseRef"), isProperty: false}, 
          {name: "selectedThread", value: inspectorObject.get("baseRefThread"), isProperty: false}]}
        };
      pega.api.ui.actions.launchHarness(options);
      pega.ui.inspector.toggle();
    }

    /**
     * @public Creates the html content for a focus info bar.
     *
     * @param $Inspector Object$ inspectorObject - The model object of the element to show info bar for
     */
    publicAPI.getFocusInfoBarContent = function(inspectorObject) {
        // Check if the element you are editing is part of a template section this is for
        // things like modal/overlay templates, if it is editing is not allowed
        var isTemplate = pega.ui.inspector.isTemplateSection(inspectorObject);
        var isHeaderTitle = inspectorObject.get("subType") === 'HEADERTITLE';

        var newContent = document.createElement("DIV");

        // ANCESTOR LIST
        // Creates the standard label but applies a click event to show ancestor list
        var label = publicAPI.createElement("DIV", {
            className: "idpanel-text",
            title: pega.u.d.fieldValuesList.get("ToggleAncestors"),
            innerHTML: publicAPI.displayUIElementText(inspectorObject.getAllAttributes())
        }, {
            "click": pega.ui.inspector.ancestorList.show
        });

        // Creates the ancestor list icon anchor
        var ancestorAnchor = publicAPI.createElement("A", {
            className: "runtime-edit-icon Ancestors"
        });

        // Append icon to label span
        label.appendChild(ancestorAnchor);
        newContent.appendChild(label);

        // Create icon container for all right aligned icons
        var iconContainer = publicAPI.createElement("DIV", {
            className: "idpanel-icon-container"
        });

        // If current element is a section set parent to itself otherwise call getNearestParent to find parent Section/Harness for open rule icon
        var oParent;
        if ((inspectorObject && inspectorObject.get("insKey") && inspectorObject.get("insKey") != "") ||
            (inspectorObject.get("type") && inspectorObject.get("type") == "Section") ||
            (inspectorObject.get("subType") && (inspectorObject.get("subType") == "SUB_SECTION" || inspectorObject.get("subType") == "PANEL"))) {
            oParent = inspectorObject;
        } else {
            var tempTypes = [{
                "type": "Section"
            }, {
                "type": "Harness"
            }];
            oParent = pega.ui.inspector.parser.getNearestParent(inspectorObject, tempTypes);
        }

        // OPEN RULE ICON
        if (oParent && oParent.get("insKey") && oParent.get("insKey") != "") {
            var attributes = {
                className: "runtime-edit-icon live-ui-open-rule",
                title: pega.u.d.fieldValuesList.get("OpenInDevStudio")
            };
            var clickEvent = function() {
                pega.ui.inspector.openElementRuleForInsKey(oParent.get("insKey"))
            };
            var openRuleIcon = publicAPI.createElement("A", attributes, {
                "click": clickEvent
            });
            iconContainer.appendChild(openRuleIcon);
        }
      
        // START PE Clipboard impl        
        if(typeof inspectorObject.get("baseRef") !== "undefined") {
          var attributes = {
            className: "runtime-edit-icon pi-clipboard",
            title: "Launch Clipboard",
          };
          var clickEvent = function(e) {
            pega.ui.inspector.utilities.launchClipboard(inspectorObject);
          };
          var clipboardIcon = publicAPI.createElement("A", attributes, {
            "click": clickEvent
          });

          iconContainer.appendChild(clipboardIcon);
         }
        // END PE Clipboard impl

      	// BUG-260897 - only show property panel icon when element is outside of modal
      	var isInModal = publicAPI.isElementInModal(inspectorObject.get("element")[0]);

        // OPEN PROPERTY PANEL ICON
        if (inspectorObject.get("flowAction") && inspectorObject.get("flowAction") != null && inspectorObject.get("flowAction") != "" && !isTemplate && !isHeaderTitle && !isInModal) {
            var attributes = {
                className: "runtime-edit-icon runtime-edit-icon-openPropertyPanel",
                title: pega.u.d.fieldValuesList.get("OpenPropPanel")
            };
            var clickEvent = function(e) {
                pega.ui.inspector.editing.propertypanel.open(e, true)
            };
            var propertyPanelIcon = publicAPI.createElement("A", attributes, {
                "click": clickEvent
            });
            iconContainer.appendChild(propertyPanelIcon);
        }

        // QUICK INFO PANEL ICON
        if (!isHeaderTitle) {
            var attributes = {
                id: "idpanel-info-panel-icon",
                className: "runtime-edit-icon runtime-edit-info",
                title: pega.u.d.fieldValuesList.get("QuickInfoPanel")
            };
            var clickEvent = function(e) {
                pega.ui.inspector.quickInfo.setOption("oneTimeConfinementElement", pega.ui.inspector.getTopHarness());
                pega.ui.inspector.quickInfo.showByEvent(e, pega.ui.inspector.getFocusedInspectorObject());
            };
            var quickInfoIcon = publicAPI.createElement("A", attributes, {
                "click": clickEvent
            });
            iconContainer.appendChild(quickInfoIcon);
        }

        // ACTIONS MENU ICON
        if (pega.ui.inspector.isActionsMenuIconEnabled(inspectorObject) && !isTemplate) {
            var attributes = {
                id: "idpanel-actions-menu-icon",
                className: "runtime-edit-icon runtime-edit-icon-actions-menu",
                title: pega.u.d.fieldValuesList.get("ActionsMenu")
            };
            var clickEvent = function(e) {
                pega.ui.inspector.actionMenu.setOption("oneTimeConfinementElement", pega.ui.inspector.getTopHarness());
                pega.ui.inspector.actionMenu.showByEvent(e, pega.ui.inspector.getFocusedInspectorObject());
            };
            var actionsMenuIcon = publicAPI.createElement("A", attributes, {
                "click": clickEvent
            });
            iconContainer.appendChild(actionsMenuIcon);
        }

        // Append the icons to the actual infobar
        newContent.appendChild(iconContainer);

        return newContent;
    }

    /**
     * @public This function is responsible for figuring out the basic location of the element on screen. It starts by being
     * called in the window that the element lives in to figure out the base width/height and offset. Then it is recursivly
     * called to account for the iframes that the element could live in
     *
     * @param $HTML Element$ htmlElement - The element to calculate
     * @param $Window$ toWindow - An optional window to stop looping
     * @return $Object$ loc - The complete location object for the given object
     */
    publicAPI.getElementDimension = function(htmlElement, toWindow) {
      	var isInModal = $(htmlElement).closest("#modalWrapper").length > 0;
        var currentWindow = htmlElement.ownerDocument.defaultView;
        var loc = _calculateElementWidthAndHeight(htmlElement);
      
        // Get location of element in context of current window
      	// Now account for scrolling of top-window (when you're not in an iframe)
        var elementOffset = htmlElement.getBoundingClientRect();
        loc.left = elementOffset.left + $(currentWindow).scrollLeft(); 
        
        if(isInModal) {
          loc.top = elementOffset.top;
        } else {
          loc.top = elementOffset.top + $(currentWindow).scrollTop();
        }            
        // Loop over each parent window until coming back to current window
        while (currentWindow) {
            if ((currentWindow == window || !currentWindow.parent) || (toWindow != null && currentWindow == toWindow)) {
                break;
            } else {
                //Get location of window in context of parent window
                var windowOffset = currentWindow.frameElement.getBoundingClientRect();
                loc.left += windowOffset.left;
                loc.top += windowOffset.top;
              
              	// Factor in scroll location when you are in iframes as it unintentially throws the distance off further than from the perspective of the top-window
                if (htmlElement.ownerDocument.defaultView == currentWindow && !isInModal) {
                    // Only factor in scroll for non desktopWindow frame since in the desktopWindow it is covered by offset
                    loc.top -= $(currentWindow).scrollTop();
                    loc.left -= $(currentWindow).scrollLeft();
                }
              
                currentWindow = currentWindow.parent;
            }
        }

        return loc;
    }
	
	/**
	 * @public This function is responsible for obtaining all of the iframes (embedded as well as siblings).
	 * @param windowObj - the window to begin gathering the list of frames
	 */
	publicAPI.getFrameList = function(windowObj) {	
		return pega.util.Dom.getFrames(windowObj);
	}
    
    /**
     * @public Adds the information to the given element and then calls reloadSection API to retrieve the markup from the server
     * this is done because reloadSection handles the PegaOnlyOnce logic that prevents duplicate libraries from being loading more than once
     *
     * @param $String$ sectionName - The name of the section to be loaded
     * @param $String$ sectionClass - The class of the section to be loaded
     * @param $HTML Element$ elem - The HTML to load the section into
     * @param $Function$ callback - Callback fucntion to call when reload is finished
     * @param $String$ baseRef - The base reference of the section to be loaded
     * @param $String$ preActivityName - Name of the pre activity
     * @param $String$ preActivityParams - Parameters for preActivity example:"&paramname=paramvalue"
     */
    publicAPI.loadSectionIntoDom = function(sectionName, sectionClass, elem, callback, baseRef, preActivityName, preActivityParams) {
      	return pega.u.d.loadSectionIntoDom(sectionName, sectionClass, elem, callback, baseRef, preActivityName, preActivityParams);
    }

    /**
     * Find the element that should be highlighted, primarily used for layout groups
     * as you want to highlight the section element rather than the cell element
     *
     * @param $domElement$ htmlElement - element of interest to highlight
     */
    publicAPI.elementToHighlight = function(htmlElement) {
        var _inspectorElement = pega.ui.inspector.utilities.getTempInspectorObject($(htmlElement));
        //Get the Region paretn of the element to determine what layout this cell is in
        var regionElement = _inspectorElement.get("element").parent().closest("[data-ui-meta]");
        var regionInspectorObj = pega.ui.inspector.utilities.getTempInspectorObject(regionElement);
        var highlightElem;
        //if elemenet has a "sectionChild" pairing element && this element is in a layout group
        if (_inspectorElement.get("sectionChild") && regionInspectorObj.get("subType") == "DYNAMICLAYOUTGROUP") {
            highlightElem = _inspectorElement.get("sectionChild")[0];
        } else {
            highlightElem = _inspectorElement.get('element')[0];
        }
        return highlightElem;
    }
    
    /**
     * @public Public function that toggles allow interaction
     * @param $Inspecor$ inspectors - array of inspector objects to enable/disable highlight on
     * @param $Panel Component$ panel - the panel DOM object to add remove the interaction enabled class
     * @param $Tree Component$ tree - the tree DOM object to add/remove the mask to
     * @param $Object$ callbackObject - Contains a callback for enable and disable
     */
    publicAPI.toggleInteraction = function(inspectors, panel, tree, callbackObject) { 
        if(panel.getElement().classList.contains("interaction-enabled")){
          // enable inspectors
          for (var i = 0; i < inspectors.length; i++) {
              inspectors[i].enable();
          } 
          // remove mask
          panel.getElement().classList.remove("interaction-enabled");
          tree.enable();
          
          // If there is a disable callback then call it
          if (callbackObject && callbackObject.disableCallback) {
              callbackObject.disableCallback();
          }
        } else {
          // Add mask and give toggle interaction the 'clicked' style
          panel.getElement().classList.add("interaction-enabled");
          tree.disable();
          
          // Disable and clear inspectors
          for (var i = 0; i < inspectors.length; i++){
              inspectors[i].disable();
              inspectors[i].clearHighlight();
          } 
          
          // If there is a enable callback then call it
          if (callbackObject && callbackObject.enableCallback) {
              callbackObject.enableCallback();
          }
        }
    }
    
    return publicAPI;
}());
//static-content-hash-trigger-YUI
/** 
 * This is an extended version of the Inspector that also handles a single instance of highlighting. Both Highlight and InfoBar are managed.
 * @param $Object$ configuration - the configuration of the inspector object for use and behavior
 *                 configuration.getInfoBarContent - Function to be called to set the content of the info bar. The element being highlighted is given
 *                 configuration.eventsToBlockList - Array of strings that are the names of the events to suppress
 *                 configuration.highlight - {
 *                      customClass - Custom class to be applied to the highlight object
 *                      container - Container element for highlight elements to be placed in
 *                 } 
 *                 configuration.infoBar - {
 *                      customClass - Custom class to be applied to the highlight object
 *                      container - Container element for highlight elements to be placed in
 *                      content - Element/Function/String that represents the content of the infobar
 *                      options - Please see pega.ui.inspector.InfoBar class for additional details
 *                 }
 */

pega.ui.inspector.utilities.InspectorHighlight = function (configuration) {
    var _self = this;

    if(!configuration || !configuration.elementFoundCallback) {
        throw new Error("elementFoundCallback is a required parameter");
    }
    
    // HIGHLIGHT Object 
    configuration.highlight = configuration.highlight || {};
    configuration.highlight.customClass = configuration.highlight.customClass || null;
    configuration.highlight.container = configuration.highlight.container || null;
    var _highlight = new pega.ui.inspector.Highlight(configuration.highlight.customClass, configuration.highlight.container);

    // INFOBAR Object
    configuration.infoBar = configuration.infoBar || {};
    configuration.infoBar.customClass = configuration.infoBar.customClass || null;
    configuration.infoBar.container = configuration.infoBar.container || null;
    configuration.infoBar.content = configuration.infoBar.content || null;
    configuration.infoBar.options = configuration.infoBar.options || {};
    var _infoBar = new pega.ui.inspector.InfoBar(configuration.infoBar.customClass, configuration.infoBar.container, configuration.infoBar.content, configuration.infoBar.options);

    // Private variables
    var _rehighlightTimeoutId;
    var _highlightedElement;

    // TODO : Currently only works with data-ui-meta and 
    configuration.selectorList = ["[data-ui-meta]"];

    // Store of the original Inspector elementFoundCallback to handle showing highlight internally
    var _originalCallback = configuration.elementFoundCallback;
    configuration.elementFoundCallback = _elementFoundCallback;

    // Extend the superClass into this to for inheritence
    var _superClass = new pega.ui.components.Inspector(configuration);

    // Persisted parameters
    var _config = {};
    _config.getInfoBarContent = configuration.getInfoBarContent || function(element) { return element.tagName }
    _config.eventsToBlockList = configuration.eventsToBlockList || [];
    _config.ignoreList = configuration.ignoreList || [];
    var _blockedInspectors = [];

    /** 
     * @private finds if the element is contained within the selector provided
     * @param $HTMLElement$ element - element of interest
     * @param $HTMLElement$ selector - selector to use to find if element is contained within this selector
     *
     * @return $HTMLElement$ element that was found from the selector, null if nothing found
     */
    function _closest(element, selector) {
        var elem = $(element).closest(selector);

        if (elem.length < 1) {
            return null;
        }

        return elem[0];
    }

    /**
     * @private Basic event suppression handler to stop events
     * @param {Event} e - The event to block 
     */
    function _suppressEvent(returnObj) {
        // Don't suppress elements in the ignore list
        var ignoreSelectors = _config.ignoreList.join(',');
        if (_closest(returnObj.eventObj.target, ignoreSelectors)) {
            return true;
        }

        if (returnObj.eventObj.preventDefault) returnObj.eventObj.preventDefault();
        returnObj.eventObj.cancelBubble = true;
        if (returnObj.eventObj.stopPropagation) returnObj.eventObj.stopPropagation();
        return false;
    }

    /**
     * @private This function handles rehighlighting the currently highlighted element
     */
    function _rehighlight() {
        _self.highlightElement(_highlightedElement);
    }

    /**
     * @private This function handles rehighlight only after calming down for 25 MS
     * @param {Event} e - The event that triggered this function
     */
    function _handleRehighlight(e) {
        clearTimeout(_rehighlightTimeoutId);
        _scrollTimeoutID = setTimeout(_rehighlight, 25);
    }

    /**
     * @private This function handles unloading all events
     * @param {Event} e - The unload event
     */
    function _handleUnload(e) {
        this.removeEventListener('resize', _handleRehighlight, true);
        this.removeEventListener('scroll', _handleRehighlight, true);
        this.removeEventListener('unload', _handleUnload, true);
    }

    /**
     * @private This function handles highlighting an element
     * @param {Element} element - The element to highlight
     */
    function _highlightElement(element) {
        if (element) {
            var loc = pega.ui.inspector.utilities.getElementDimension(element, window);
            _highlight.show(loc.left, loc.top, loc.width, loc.height);    
    
            _infoBar.setContent(_config.getInfoBarContent(element));
            _infoBar.showByPosition(loc.left, loc.top, loc.width, loc.height);
        }
    }

    /**
     * This is the internal elementFoundCallback that handles highlighting and calling original callback
     * @param {JSON} returnObj - Return object from the Inspector class with event and element
     */
    function _elementFoundCallback(returnObj) {
        if (returnObj.foundElement) {
            _highlight.hide();
            _infoBar.hide();
            _self.highlightElement(returnObj.foundElement);
        }

        _originalCallback(returnObj);
        return _suppressEvent(returnObj);
    }

    /** 
     * @private used to add event listeners in all frames
     */
    function _addEventListeners() {
        var frames = pega.util.Dom.getFrames(window);
        for (var i = 0; i < frames.length; i++) {
            frames[i].addEventListener('unload', _handleUnload, true);
            frames[i].addEventListener('resize', _handleRehighlight, true);
            frames[i].addEventListener('scroll', _handleRehighlight, true);
        }
    }

    /** 
     * @private used to remove event listeners in all frames
     */
    function _removeEventListeners() {
        var frames = pega.util.Dom.getFrames(window);
        for (var i = 0; i < frames.length; i++) {
            frames[i].removeEventListener('unload', _handleUnload, true);
            frames[i].removeEventListener('resize', _handleRehighlight, true);
            frames[i].removeEventListener('scroll', _handleRehighlight, true);
        }
    }

    /**
     * @public Public function that highlights the given element and sets state
     * @param {Element} element - The element to highlight
     */
    _self.highlightElement = function(element) {
        _highlightedElement = element;
        _highlightElement(_highlightedElement);
    }

    /**
     * @public Called to get the currently highlighted element
     */
    _self.getHighlightedElement = function() {
        return _highlightedElement;
    }

    /**
     * @public Called to clear the currently highlighted element
     */
    _self.clearHighlight = function() {
        _highlight.hide();
        _infoBar.hide();
        _highlightedElement = null;
    }

    /**
     * @public Destroy function to clean up all elements
     */
    _self.destroy = function() {
        _self.disable();
        _highlight.cleanup();
        _infoBar.removeFromDom();
    }

    /**
     * @public This function is called to enable the Inspector, also adds the suppression listeners
     */
    _self.enable = function() {
        _self.disable();

        for (var j = 0; j < _config.eventsToBlockList.length; j++) {
            var newInspector = new pega.ui.components.Inspector({ eventMonitored: _config.eventsToBlockList[j], elementFoundCallback: _suppressEvent});
            newInspector.enable();
            _blockedInspectors.push(newInspector);
        }

        _addEventListeners();
        _superClass.enable();
    }

    /**
     * @public This function is called to disable the Inspector, also handles removing suppression listeners
     */
    _self.disable = function() {
        for (var j = 0; j < _blockedInspectors.length; j++) {
            _blockedInspectors[j].disable();
        }
        _blockedInspectors = [];

        _removeEventListeners();
        _superClass.disable();
    }
};
var $pNamespace = pega.namespace;
$pNamespace("pega.ui.inspector");

pega.ui.inspector.Highlight = function(styleClassPrefix, container) {
  // Default parameter and set to public property

  this.styleClassPrefix = styleClassPrefix;

  var _self = this;				// Reference to self to be used in functions later
  var _containerDiv;			// Reference to single div object that contains all highlight divs

  var _highlightElems = [];		// Array of highlight divs used by this object
  
  var _bottomBorderWidth;
  var _rightBorderWidth;
  // Constants for easier reference to each element in the highlight array
  var HIGHLIGHT_TOP = 0;
  var HIGHLIGHT_BOTTOM = 1;
  var HIGHLIGHT_LEFT = 2;
  var HIGHLIGHT_RIGHT = 3;

  /**
   *  Called on creation of object to initialize everything needed to highlight
   **/
  var _init = function(container) {
    if (container) {
      _containerDiv = container;
    } else {
      // Get reference to highlight container div
      var tempSearch = $("div#highlight-container-div");
      if(tempSearch.length == 0) {
        _containerDiv = document.createElement("div");
        _containerDiv.id = "highlight-container-div";
        document.body.appendChild(_containerDiv);
      } else {
        _containerDiv = tempSearch[0];
      }
    }

    // Create highlight divs
    var highlightDiv, counter;
    for(counter = 0; counter < 4; counter++) {
      highlightDiv = document.createElement("div");
      _containerDiv.appendChild(highlightDiv);

      //basic highlight style
      highlightDiv.className = "element-highlight ";
      
      // Set classname
      switch (counter) {
        case HIGHLIGHT_TOP:
          highlightDiv.className += "highlight-top " + _self.styleClassPrefix;
          break;
        case HIGHLIGHT_BOTTOM:
          highlightDiv.className += "highlight-bottom " + _self.styleClassPrefix;
          break;
        case HIGHLIGHT_LEFT:
          highlightDiv.className += "highlight-left " + _self.styleClassPrefix;
          break;
        case HIGHLIGHT_RIGHT:
          highlightDiv.className +="highlight-right " + _self.styleClassPrefix;
          break;
      }
      _highlightElems[counter] = highlightDiv;

      // Default display to none
      _highlightElems[counter].style.display = "none";
    }
    
    // Retrieve the border width fo bottom and right highlights
    _bottomBorderWidth = parseInt($(_highlightElems[HIGHLIGHT_BOTTOM]).css("border-bottom-width").replace("px", ""));
    _rightBorderWidth = parseInt($(_highlightElems[HIGHLIGHT_RIGHT]).css("border-right-width").replace("px", ""));
  }

  /**
   *  Moves a single element to a new location
   **/
  var _moveElement = function(o, x, y) {
	  o = o.style;

    if (document.all) {
      o.pixelLeft = x;
      o.pixelTop = y;
    } else {
      o.left = x + "px";
      o.top = y + "px";
    }
  }

  /**
   *  Removes the highlight objects from the DOM
   **/
  this.cleanup = function() {
    //loop over each highlight and if it exists in the container, remove it
    _highlightElems.forEach(function (highlightDiv){
      if(_containerDiv.contains(highlightDiv)){
        _containerDiv.removeChild(highlightDiv);
      }
    });

    //clear out the highlightElems array
    _highlightElems = [];
  }

  /**
   *  Updates all of the highlight elements for this object to be hidden
   **/
  this.hide = function() {
    for (var i = 0; i < 4; i++) {
      _highlightElems[i].style.display = "none";
    }
  }

  /**
   *  Moves the highlight divs and makes them visible
   *  @param x The x location for the top/left coordinate of the area to highlight
   *  @param y The y location for the top/left coordinate of the area to highlight
   *  @param width The width of the area to highlight
   *  @param height The height of the area to highlight
   **/
  this.show = function(x, y, width, height) {
    _highlightElems[HIGHLIGHT_TOP].style.width = width + "px";
    _highlightElems[HIGHLIGHT_TOP].style.display = "";

    _highlightElems[HIGHLIGHT_BOTTOM].style.width = width + "px";
    _highlightElems[HIGHLIGHT_BOTTOM].style.display = "";

    _highlightElems[HIGHLIGHT_LEFT].style.height = height + "px";
    _highlightElems[HIGHLIGHT_LEFT].style.display = "";

    _highlightElems[HIGHLIGHT_RIGHT].style.height = height + "px";
    _highlightElems[HIGHLIGHT_RIGHT].style.display = "";

    _moveElement(_highlightElems[HIGHLIGHT_TOP], x, y);
    _moveElement(_highlightElems[HIGHLIGHT_BOTTOM], x, y + height - _bottomBorderWidth);
    _moveElement(_highlightElems[HIGHLIGHT_LEFT], x, y);
    _moveElement(_highlightElems[HIGHLIGHT_RIGHT], x + width - _rightBorderWidth, y);
  }

  /**
   *  Helper function to show highlight based on element that is passed in
   *  @param htmlElement Element to highlight - requires data-ui-meta attribute
   **/  
  this.showByElement = function(htmlElement) {
    var inspectorObject = pega.ui.inspector.utilities.getTempInspectorObject($(htmlElement))
    var loc = pega.ui.inspector.utilities.getElementDimension(htmlElement, pega.ui.inspector.getDesktopWindow());
    pega.ui.inspector.utilities.adjustLocationForDesktopWindow(inspectorObject, loc);
    this.show(loc.left, loc.top, loc.width, loc.height);
  }

  // On load call init function
  _init(container);
};
var $pNamespace = pega.namespace;
$pNamespace("pega.ui.inspector");

pega.ui.inspector.Element = function(element, parentObject, treeEnabled, metaAttr) {
    /* -- PUBLIC VARIABLES -- */
    this.id = "i" + pega.ui.inspector.utilities.getUniqueID();

    this.children = []; // Children array that will contain a list of all children meta nodes
    this.ownerWindow = element.ownerDocument.defaultView; // Store a reference right on object for what frame the element lives in

    /* -- PRIVATE VARIABLES -- */
    var _self = this;
    var _fieldValues; // List of all the field values for this element
    var _treeEnabled = treeEnabled; // Store private version of param passed to constructor for if the tree is enabled
    var _metaAttr = metaAttr;
    var _attributes = eval("(" + element.getAttribute("data-ui-meta") + ")"); // Convert the data-ui-meta to json object
    if(_attributes == null && typeof(metaAttr) == "undefined" && element.getAttribute("data-fieldvalue-meta")) {
      metaAttr = "data-fieldvalue-meta";
    }
    if (metaAttr === 'data-fieldvalue-meta') {
        if (!_attributes) {
            _attributes = {};
            _attributes.type = 'Cell';
            _attributes.subType = 'HeaderTitle';
        }
        // Process Field Value information if the element has the attribute
        var fieldValueID = element.getAttribute("data-fieldvalue-meta");
        var fieldValueDataDiv = $(element).find('.inspector-fieldvalue-data');
        var fieldValueData;
        if (fieldValueDataDiv && fieldValueDataDiv.length == 1) {
          	var _fieldValueDataStr = fieldValueDataDiv.html();
          	try {
            	fieldValueData = JSON.parse(_fieldValueDataStr);
            } catch(e) {
              	/* BUG-307407: decrypting double quotes */
              	_fieldValueDataStr = _fieldValueDataStr.replace(/&amp;/ig, "&").replace(/&quot;/ig, "\"");
              	try {
                  	fieldValueData = JSON.parse(_fieldValueDataStr);
                } catch(e) {
                  	fieldValueData = null;
                }
            }
        }
        // If there is field value data for this element then store it off
        if (fieldValueData && fieldValueData[fieldValueID]) {
            this.hasFieldValues = true;
            _fieldValues = fieldValueData[fieldValueID];
        }
    }
    _attributes.element = $(element); // Store off a reference of the element
    _attributes.parent = parentObject; // Store a reference to the parent object
    _attributes.subTypeDisplay = _attributes.subType; // Default the subTypeDisplay to the base subType

    _attributes.ownerWindowLeft = 0; // Default ownerWindowLeft to 0
    _attributes.ownerWindowTop = 0; // Default ownerWindowTop to 0

    // If the element has a subtype make it uppercase for consistancy
    if (_attributes.subType) {
        _attributes.subType = _attributes.subType.toUpperCase();
    }

    // If the dynamic layout is a region then set a new flag
    if (_attributes.type == "Layout") {
        if (_attributes.region && _attributes.region != "") {
            _attributes.isRegion = true;
        } else {
            _attributes.isRegion = false;
        }
        // If table grid is editable then make sure to set boolean
        if (_attributes.subType === "REPEATGRID") {
          if(_attributes.editable && _attributes.editable === "true" ){
            _attributes.editable = true;
          } else {
            _attributes.editable = false;
          }
        }
    }

    // If the section is templated make sure to set boolean
    if (_attributes.type == "Section") {
        if (_attributes.templated && _attributes.templated == "true") {
            _attributes.templated = true;
        } else {
            _attributes.templated = false;
        }
      	
      	//check if section is marked as runtime editable
      	if(_attributes.editable && _attributes.editable == "true" ){
          _attributes.editable = true;
        } else {
          _attributes.editable = false;
        }
    }
  
    // If the element is a cell and not a sub section
    if (_attributes.type == "Cell" && _attributes.subType != "SUB_SECTION") {
        // Check if clipboardPath attribute is available, not all cells use this
        if (_attributes.clipboardPath && _attributes.clipboardPath != "") {
          // BUG-718028 check if pega apis exist to fetch the base ref
          if(this.ownerWindow.pega.api && this.ownerWindow.pega.api.ui && this.ownerWindow.pega.api.ui.util) {
            // save off baseRef, which can be used later for launching clipboard in context
            var baseRef = this.ownerWindow.pega.api.ui.util.getBaseRef(element);
            // Check if element is in a grid
            var rowAndEntryHandleValue = this.ownerWindow.pega.u.d.getRowAndEntryHandle(element);
            if(rowAndEntryHandleValue && rowAndEntryHandleValue.rowEntryHandle && rowAndEntryHandleValue.rowEntryHandle != "") {
                baseRef = this.ownerWindow.pega.u.property.toReference(rowAndEntryHandleValue.rowEntryHandle);  
            }

            // If baseRef has a value, append clipboardPath to it and set it on the inspector element's attributes           
            if(baseRef && baseRef != "") {
                if(_attributes.clipboardPath.startsWith(".")){
                  baseRef += _attributes.clipboardPath;
                }else{
                  baseRef = _attributes.clipboardPath;
                }
                  
            }
            _attributes.baseRef = baseRef;            
          
            // Also save off the context thread, which is also used in launching the clipboard
            _attributes.baseRefThread = this.ownerWindow.pega.u.d.getThreadName();
          
            if(this.ownerWindow.pega.ctx.bIsDCSPA === true){
              var dcspaThreadName = this.ownerWindow.pega.ctxmgr.getDCSPAThreadName();
              if(dcspaThreadName && dcspaThreadName !== ""){
                _attributes.baseRefThread = dcspaThreadName;
              }
            }
          }
        }
    }

    /////////////////////////////////////////////////////////////////////////////////
    //                              PRIVATE FUNCTIONS                              //
    /////////////////////////////////////////////////////////////////////////////////

    /** Generates HTML mark-up for a given node in the tree
     *  @param model - Model object to generate HTML for
     *  @return HTML that was generated for the tree
     **/
    function _buildNodeHTML(model) {
        var displayHTML = "<span class='meta-title'>";
        pega.ui.inspector.utilities.translateMetaData(model.getAllAttributes());
        displayHTML += pega.ui.inspector.utilities.displayUIElementText(model.getAllAttributes());

        // Only add open icons for sections that have pzInsKeys because of non-auto gen sections
        if (model.get("insKey") && model.get("insKey") != "") {
            displayHTML += "<a class='live-ui-open-rule runtime-edit-icon' title='" + pega.u.d.fieldValuesList.get("OpenInDevStudio") + "' onclick='pega.ui.inspector.openElementRuleForInsKey(\"" + model.get("insKey") + "\")'></a>";
        }

        // quick info icon
        displayHTML += "<a class='runtime-edit-icon runtime-edit-info' onclick='pega.ui.inspector.quickInfo.showByEvent(event, pega.ui.inspector.panel.getInspectorObjectByID(\"" + model.id + "\"))'> </a>";

        // actions menu icon
        if (pega.ui.inspector.isActionsMenuIconEnabled(model)) {
            displayHTML += "<a class='runtime-edit-icon runtime-edit-icon-actions-menu' title='See available actions' onclick='pega.ui.inspector.actionMenu.showByEvent(event, pega.ui.inspector.panel.getInspectorObjectByID(\"" + model.id + "\"))'> </a>";
        }

        displayHTML += "</span>";

        return displayHTML;
    }

    /**
     * @private Used to set the correct flow action to use for the property panel for runtime editing. Only used for layouts.
     *
     * @param $Object$ attr - Attributes json object that is part of the backbone object for the current element
     * @param $String$ subType - Subtype of the given element
     * @return $Object$ attr - The entire attributes object is returned once the data is set
     **/
    function _setElementFlowActionAttribute(attr, subType) {
        //Set additional data based on the subType
        attr.flowAction = "";
        switch (subType) {
            case "TABGROUP":
                attr.flowAction = "pzTabGroup_PropPanel";
                break;
            case "TEMPLATE":
                //attr.flowAction = "pzLayout_PropPanel";
                break;
            case "FREEFORM":
                //attr.flowAction = "pzLayout_PropPanel";
                break;
            case "DYNAMICLAYOUT":
                attr.flowAction = "pzPropertyPanel_SimpleLayout";
                break;
            case "DYNAMICCOLUMN":
                attr.flowAction = "pzPropertyPanel_ColumnLayout";
                break;
            case "DYNAMICLAYOUTGROUP":
                attr.flowAction = "pzPropertyPanel_LayoutGroup";
                break;
            case "DYNAMICREPEATING":
                attr.flowAction = "pzPropertyPanel_RepeatingDynamicLayout";
                break;
            case "REPEATINGDYNAMICLAYOUTGROUP":
                attr.flowAction = "pzPropertyPanel_LayoutGroup";
                break;
            case "REPEATVERTICAL":
                //attr.flowAction = "pzRepeat_PropPanel";
                break;
            case "REPEATHORIZONTAL":
                //attr.flowAction = "pzRepeat_PropPanel";
                break;
            case "REPEATTABBED":
                //attr.flowAction = "pzRepeat_PropPanel";
                break;
            case "REPEATGRID":
                attr.flowAction = "pzGrid_PropPanel";
                break;
            case "REPEATTREE":
                attr.flowAction = "pzGrid_PropPanel";
                break;
            case "REPEATTREEGRID":
                attr.flowAction = "pzGrid_PropPanel";
                break;
            case "SECTIONINCLUDE":
                attr.flowAction = "pzLayout_PropPanel";
                break;
        }
        return attr;
    }

    /////////////////////////////////////////////////////////////////////////////////
    //                              PUBLIC FUNCTIONS                               //
    /////////////////////////////////////////////////////////////////////////////////
    /**
     * @public Getter function to retrieve attributes from the private _attributes object. This includes meta info and element itself
     *
     * @param $String$ name - The name of the attribute to retrieve
     */
    this.get = function(name) {
        return _attributes[name];
    }

    /**
     * @public Setter function to set attributes from the private _attributes object. This includes meta info and element itself
     *
     * @param $String$ name - The name of the attribute to set
     * @param $Any$ value - The value to set the attribute to
     */
    this.set = function(name, value) {
        _attributes[name] = value;
    }

    /**
     * @public Getter function to retrieve all attributes from the private _attributes object. This includes meta info and element itself
     *
     * @return $Object$ _attributes - The entire attributes object
     */
    this.getAllAttributes = function() {
        return _attributes;
    }

    /**
     * @public Getter function to retrieve all field values for this inspector object
     *
     * @return $Object$ _fieldValues - The entire list of field values
     */
    this.getFieldValues = function() {
        return _fieldValues;
    }

    /**
     * @public Getter function to parse all children from the current node and find the node that matches the given element
     *
     * @param $HTML Element$ element - The element to search for
     * @return $Inspector Element$ tempReturnElement - The object for the model that was found
     */
    this.findByElement = function(element) {
        var currentElement = this.get("element").get(0);
        var tempReturnElement = null;
        if (currentElement == element) {
            return this;
        } else {
            for (var i = 0; i < this.children.length; i++) {
                tempReturnElement = this.children[i].findByElement(element);

                if (tempReturnElement) return tempReturnElement;
            }
        }
    }

    /////////////////////////////////////////////////////////////////////////////////
    //                        SET ADDITIONAL INFORMATION                           //
    /////////////////////////////////////////////////////////////////////////////////

    //Set additional meta data for layouts and cells
    if (_attributes.type == "Layout") {
        _setElementFlowActionAttribute(_attributes, _attributes.subType);
    } else if (_attributes.type == "Cell") {
        _attributes.flowAction = "pzCell_PropPanel";
    }

    /////////////////////////////////////////////////////////////////////////////////
    //                      SET JSTREE RELATED INFORMATION                         //
    /////////////////////////////////////////////////////////////////////////////////
    // Only generate tree related data when the tree is enabled param is passed into constructor
    if (_treeEnabled) {
        var _treeInfo = {};
        /**
         * @public This function is called from pega.ui.inspector.parser.buildModel after the object is adjusted so that the
         * correct information is translated. Mostly for display purposes. Model must be adjused before this is called
         */
        this.buildTreeModel = function() {
            _treeInfo.text = _buildNodeHTML(this);

            _treeInfo.state = { opened: true };

            // Figure out what the icon class should be for the tree
            var liClasses;
            if (this.get("declarative")) {
                liClasses = "DeclarativeNode";
            } else {
                liClasses = this.get("type") + "Node";
            }

            // If the current element is part of a modal/overlay template then add a class to li to prevent icons
            if (pega.ui.inspector.isTemplateSection(this)) {
                liClasses += " template-section";
            }

            // Figure out the node type. This is used by drag and drop to know what is allowed
            var elementTypes;
            if (this.get("type") == "Layout" && this.get("subType") == "DYNAMICLAYOUT") {
                elementTypes = "layout";
            } else if (this.get("type") == "Cell" || (this.get("type") == "Section" && this.get("subType") == "CELL")) {
                elementTypes = "cell";
            } else {
                elementTypes = "other";
            }
            _treeInfo.types = elementTypes;

            // li_attr are the attributes that are added the the li element in the jsTree markup
            _treeInfo.li_attr = { "class": liClasses };
        }

        /**
         * @public Parses all the children under the current node and return only json needed for Live UI tree to be built
         *
         * @return $JSON$ tempJSON - The JSON built for all nodes
         */
        this.getTreeJson = function() {
            // Only return the JSON that is needed for jsTree
            var tempJSON = _treeInfo;
            tempJSON.children = [];
            tempJSON.id = this.id;

            // Call all your children to get just jstree json
            for (var i = 0; i < this.children.length; i++) {
                tempJSON.children[i] = this.children[i].getTreeJson();
            }
            return tempJSON;
        }
    }
    /////////////////////////////////////////////////////////////////////////////////
    //                               EVENT HANDLERS                                //
    /////////////////////////////////////////////////////////////////////////////////
    this.isTreeEnabled = function() {
        return _treeEnabled;
    }

    return this;
}
//static-content-hash-trigger-YUI
var $pNamespace = pega.namespace;
$pNamespace("pega.ui.inspector");

// The editor is a singleton class which returns its public methods.
pega.ui.inspector.panel = (function() {
    /////////////////////////////////////////////////////////////////////////////////
    //                              CONSTANTS                                      //
    /////////////////////////////////////////////////////////////////////////////////
    /* Live UI animation constants */
    var ANIMATION_DURATION = 333;
    var ANIMATION_EASING = "linear";

    var TREE_TAB_SELECTOR = "div.runtime-control-panel li[aria-label='Tree']";
    var PANEL_TEMPLATE = "<div class='runtime-control-tab'></div><div class='runtime-control-resize ui-resizable-handle ui-resizable-w'></div><div class='runtime-control-body'><div></div></div>";

    //Find the class name to add based on width of top harness
    var BELOW1755 = "runtime-body-below1755 ";
    var BELOW1555 = "runtime-body-below1555 " + BELOW1755;
    var BELOW1455 = "runtime-body-below1455 " + BELOW1555;
    var BELOW1280 = "runtime-body-below1280 " + BELOW1455;
    var BELOW875 = "runtime-body-below875 " + BELOW1280;


    /////////////////////////////////////////////////////////////////////////////////
    //                              GLOBALS                                        //
    /////////////////////////////////////////////////////////////////////////////////
    /* -- PRIVATE GLOBALS -- */
    var _previousHarnessCSS; // Used to store the harness css prior to turning the inspector on to revert harness back to exact same css
    var _isTreeMinimized = false; // by default tree will be expanded, value is updated with saved value on server
    var _liveUIPanelWidth = 330; // default width of the panel, will be updated from server
  	var _windowOuterWidth; // The cached outer width of the window

    var _inspectorObjectsByID; // Array that contains all parsed Inspector Elements sorted by ID
    var _inspectorObjectsRootNodes = []; // Array list of only root Inspector Element nodes

    var _jsTreeRefObj = null; // Reference to the jsTree object

    var _refreshTimeoutID; //Timeout ID for refresh DOM function
    var _refreshDelay = 1000; //Timer for delay of refresh
    var _changeEventsTimeoutID; //Timeout ID for removing change events
    var _refreshTreeObserver = null; // Holds global mutation observer that is used by tree

    /* -- PUBLIC GLOBALS -- */
    var publicAPI = {};

    var isTreeRefreshing = false; // Flag for when the tree is refreshing
    var listenForChanges = false; // Boolean to listen for changes
    var treeNeedsToRefresh = true;

    var currentMediaQuery;

    /**
     * @private Reloads the specified section if it is present in the document.
     *
     * @param $String$ sectionName The name of the section to reload.
     */
    function _reloadSectionIfPresent(sectionName, callback) {
        var sectionNode = pega.u.d.getSectionByName(sectionName, "", document);
        if (sectionNode != null) {
        	pega.u.d.reloadSection(sectionNode, "", "", false, false, -1, false, null, null, null, callback);
        }
    }

    /**
     * @private Called from show to animate the panel inro place after settings are retrieved from the server
     *
     * @param $Function$ callback - Callback function passed into show to be called when animation is finished
     **/
    function _animatePanel(callback) {
        var $topHarness = pega.ui.inspector.getTopHarness();

        //Slide in panel by reducing the width of the rest of the screen
        $topHarness.css({
            'position': 'absolute',
            'left': '0',
            'right': '0',
            'min-width': '0',
            'min-height': '100%'
        });

        var right;
        var TempPanelWidth;
        /* BUG-171310 This is to prevent the panel from exceeding the size of the window itself */
        if (_liveUIPanelWidth > $topHarness.width()) {
            right = $topHarness.width() - (100) + "px";
            TempPanelWidth = $topHarness.width() - (100);
        } else if (_liveUIPanelWidth < 10) {
            right = "10px"
            TempPanelWidth = 10;
        } else {
            right = _liveUIPanelWidth + "px";
            TempPanelWidth = _liveUIPanelWidth;
        }

        if (_isTreeMinimized) {
            right = "0px";
            TempPanelWidth = "0";
        }

        $topHarness.animate({
            right: right
        }, ANIMATION_DURATION, ANIMATION_EASING, function() {});

        if (_isTreeMinimized)
            $('.runtime-control-tab').addClass('runtime-control-tab-min');
        else
            $('.runtime-control-tab').addClass('runtime-control-tab-max');

      	/* US-152932 handling width of main middle when inspector is opened
      	_updateScreenLayoutFlex(TempPanelWidth);*/
      	/* BUG-306759 */
      	if($(".screen-layout").hasClass("flex")){
           var isHeaderResizable,isFooterResizable,isLeftSideBarResizable,isRightSideBarResizable;
           isHeaderResizable = $('.screen-layout-region-header').hasClass('screen-layout-region-resize ui-resizable');
           isFooterResizable = $('.screen-layout-region-footer').hasClass('screen-layout-region-resize ui-resizable');
           isLeftSideBarResizable = $('.screen-layout-region-main-sidebar1').hasClass('screen-layout-region-resize ui-resizable');
           isRightSideBarResizable = $('.screen-layout-region-main-sidebar2').hasClass('screen-layout-region-resize ui-resizable');
           if(isHeaderResizable || isFooterResizable || isLeftSideBarResizable || isRightSideBarResizable)
              	_updateScreenLayoutFlex(_liveUIPanelWidth);
         }
      
        $(".runtime-control-panel").animate({
            width: TempPanelWidth + "px"
        }, ANIMATION_DURATION, ANIMATION_EASING, function() {
            // BUG-369320 Animate seems to set display none in certain scenarios
            // Adding this line to prevent the problem, should be safe as the style
            // should be block anyway when this is called.
            $(".runtime-control-panel")[0].style.display = "block";
          
            $(".runtime-control-panel").addClass("showing");
            if (!$(".runtime-control-panel").hasClass("ui-resizable")) {
                _resizeTree();
            }

            //Populate tree data
            publicAPI.refreshTree();
            
            // Get the skin name and display in tree
            publicAPI.displaySkinInfo(pega.u.d.skinRuleName);

            //Check width of harness and set css for header and footer
            _fakePortalMediaQuery($topHarness.width());

            // Call pased in callback function
            callback();

            // Add active class to the tree
            setTimeout(function() {
                $('.runtime-control-panel').addClass("runtime-control-panel-active")
            }, 250);
        });
    }

    /**
     * @private If an overlay is visible in any frame then repostion it
     */
    function _repositionOpenOverlayInAllFrames() {
        var tempList = pega.ui.inspector.getDesktopWindowInspectorProxy().getFrameList();
        // Loop over all iframe and reposition overlays
        for (var x = 0; x < tempList.length; x++) {
            if ($(tempList[x].document).length > 0) {
                tempList[x].pega.ui.inspector.repositionOpenOverlay();
            }
        }
    }

    /**
     * @private Handles enabling the resize ability for the side panel
     **/
    function _resizeTree() {
        var $topHarness = pega.ui.inspector.getTopHarness();

        var el = $(".runtime-control-panel");
        var count = el.outerWidth();
        el.css({
            'right': '0',
            'left': ''
        });
        //Sets rest of screen to absolute so it can be positioned
        desktopWindowCSSPosition = $topHarness.css('position');
        $topHarness.css({
            'position': 'absolute',
            'left': '0',
            'right': count + 'px',
            'min-width': '0'
        });

        var tempMouseUpHandler = function(e) {
            //Remove mouse up from window
            window.removeEventListener("mouseup", tempMouseUpHandler, true);

            $(document).triggerHandler("mouseup");
            return pega.ui.inspector.getDesktopWindowInspectorProxy().handleSupression(e);
        };

        //Add mouse up event on capture phase
        $(".runtime-control-resize")[0].addEventListener("mouseup", tempMouseUpHandler, true);

        //Define jquery objects outside of the resize event. This is a performance hit as resize
        //occurs on each mouse move and there is no need to reparse the dom to find the same
        //dom element
        _windowOuterWidth = $(window).outerWidth();


        $(".runtime-control-panel").css({
            'right': '0',
            'left': ''
        });

        $(".runtime-control-panel").resizable({
            handles: {
                'w': '.runtime-control-resize'
            },
            resize: function(event, ui) {

                var el = ui.element;
                var count = el.width();

                el.css({
                    'right': '0',
                    'left': ''
                });

                //Dont allow the resize to be bigger than the screen size
                if (count > _windowOuterWidth - 100) {
                    count = _windowOuterWidth - 100;
                    el.css({
                        'width': count + 'px'
                    });
                }
              
              	//TODO: Update these to be constants if this list number of class names grows, possibly a helper function like updateMediaQuery as well
                $(this).removeClass("runtime-panel-below-261");
                $(this).removeClass("runtime-panel-below-351");
              
              	if (count < 351) {
                  	$(this).addClass("runtime-panel-below-351");
                }	
                if (count < 261) {
                  	$(this).addClass("runtime-panel-below-261");
                }
              
                //resize the screen to acount for width of panel
                $topHarness.css({
                    'right': count + 'px'
                });
              
              	/* US-152932 handling width of main middle when inspector is opened BUG-306759
              	_updateScreenLayoutFlex(count);*/

                //Check width of harness and set css for header and footer
                _fakePortalMediaQuery($topHarness.width());
              
                //Resize tree body
                _resizeScrollBar();
            },
            start: function(event, ui) {

                $topHarness.css({
                    'position': 'absolute',
                    'left': '0',
                    'min-width': '0'
                });

                $(document.body).append("<div class='ui-tree-mask'></div>");
                pega.ui.inspector.clearAllHighlights();
            },
            stop: function(event, ui) {
                var runtimeControlPanelElement = $(".runtime-control-panel");

                runtimeControlPanelElement.queue(function() {
                    $(".runtime-control-panel").dequeue();
                });

                _liveUIPanelWidth = runtimeControlPanelElement.outerWidth();
                _isTreeMinimized = false;

                // Call server to store off width and maximized values
                _savePreferences();

                //Remove masking div
                $(".ui-tree-mask").remove();

                //Resize tree body
                _resizeScrollBar();

                //Reposition open overlays in all frames
                _repositionOpenOverlayInAllFrames();

                //Rehighlight ui
                pega.ui.inspector.getDesktopWindowInspectorProxy().rehighlight();
            }
        });

        var clickFunction = function(elem, hideResizeHandle) {

            $topHarness.css({
                'position': 'absolute',
                'left': '0'
            });


            if (_isTreeMinimized) {
                // If the current _liveUIPanelWidth is larger than the screen then
                if (_liveUIPanelWidth > $(window).width() - 100) {
                    _liveUIPanelWidth = $(window).width() - 100;
                }
                $topHarness.css('right', _liveUIPanelWidth + "px");
                $('.runtime-control-tab').removeClass('runtime-control-tab-min');
                $('.runtime-control-tab').addClass('runtime-control-tab-max');
                $(".runtime-control-panel").css('width', _liveUIPanelWidth + "px");

                _isTreeMinimized = false;

              	/* US-152932 handling width of main middle when inspector is opened
              	_updateScreenLayoutFlex(_liveUIPanelWidth);*/
              	/* BUG-306759 */
              if($(".screen-layout").hasClass("flex")){
              	var isHeaderResizable,isFooterResizable,isLeftSideBarResizable,isRightSideBarResizable;
                isHeaderResizable = $('.screen-layout-region-header').hasClass('screen-layout-region-resize ui-resizable');
                isFooterResizable = $('.screen-layout-region-footer').hasClass('screen-layout-region-resize ui-resizable');
                isLeftSideBarResizable = $('.screen-layout-region-main-sidebar1').hasClass('screen-layout-region-resize ui-resizable');
                isRightSideBarResizable = $('.screen-layout-region-main-sidebar2').hasClass('screen-layout-region-resize ui-resizable');
              	if(isHeaderResizable || isFooterResizable || isLeftSideBarResizable || isRightSideBarResizable)
              		_updateScreenLayoutFlex(_liveUIPanelWidth);
               }
                //Resize tree body
                _resizeScrollBar();

                if (pega.ui.inspector.isHighlightEnabled()) {
                    publicAPI.refreshTree(true);
                }

                //Reposition open overlays in all frames
                _repositionOpenOverlayInAllFrames();
            } else {
                _isTreeMinimized = true;
                var newPanelWidth = $(".runtime-control-resize").outerWidth();
                if (hideResizeHandle) newPanelWidth = 0;
                $topHarness.css('right', newPanelWidth + "px");
                $('.runtime-control-tab').addClass('runtime-control-tab-min');
                $('.runtime-control-tab').removeClass('runtime-control-tab-max');
                $(".runtime-control-panel").css('width', newPanelWidth + "px");
            }


            if (pega.ui.inspector.getFocusedInspectorObject() != null && pega.ui.inspector.getFocusedInspectorObject().get("pgRef") != null) {
                pega.ui.inspector.getDesktopWindowInspectorProxy().clearAllHighlights(true);
            } else {
                pega.ui.inspector.getDesktopWindowInspectorProxy().clearAllHighlights(false);
            }
            pega.ui.inspector.getDesktopWindowInspectorProxy().rehighlight();

            // Call server to store off width and maximized values
            _savePreferences();

            //Check width of harness and set css for header and footer
            _fakePortalMediaQuery($topHarness.width());
        }

        //Onclick of the drag handle
        $(".runtime-control-tab").click(function() {
            clickFunction(this, true);
        });
    }

    /**
     * @private Calculates the height of the tree itself so accurate scrollbars can be applied
     **/
    function _resizeScrollBar() {
        //Setting height of tree body
        //BUG-186691, offsetTop is not reliable as offsetParent element may not extend to top of screen
        //            try using element.getBoundingClientRect() instead
        //$('.runtime-control-tree').height($(window).height() - $('.runtime-control-tree')[0].offsetTop);
        $('.runtime-control-tree').height($('.runtime-control-panel')[0].getBoundingClientRect().height - $('.runtime-control-tree').offset().top);
    }

    /**
     * @private Calls the server to save of settings about the panel
     **/
    function _savePreferences() {
        //Calls the server to store off settings information
        var postURL = new SafeURL("Data-RuntimeDesignSettings.pzRuntime_SaveSettings");

        // Values to store
        postURL.put("PanelWidth", _liveUIPanelWidth);
        postURL.put("PanelMinimized", _isTreeMinimized);
        if (pega && !pega.offline) { 
          pega.desktop.support.getDesktopWindow().pega.u.d.asyncRequest("POST", postURL);
        }
    }
  
    /**
     * @private If screen layout is using flex, make necessary updates based on right panel size
     **/
    function _updateScreenLayoutFlex(rightPanelWidth) {
      	// US-152932 handling width of main middle when inspector is opened
        if($(".screen-layout").hasClass("flex")) {

            var rightWidth, widthToBeSubtracted, leftWidth;
            var clientWidth = $(window).width();
            leftWidth = $(".screen-layout-region-main-sidebar1").outerWidth() || 0;
            rightWidth = $(".screen-layout-region-main-sidebar2").outerWidth() || 0;
          
            widthToBeSubtracted = leftWidth + rightWidth + parseInt(rightPanelWidth);

            $('.screen-layout-region-main-middle').css({ 'width': (clientWidth - widthToBeSubtracted) + 'px' });
        }        
    }

    /**
     * @private Bind events for jsTree
     *
     * @param $Element$ elm - jQuery element that represents the tree object
     **/
      function _bindTreeEvents($elm) {
        //Loaded event that fires after tree is loaded
        $elm.on("ready.jstree", function(e, data) {
            $(".runtime-control-tree").append("<div class='ui-tree-readonly-mask'></div>");
            pega.ui.inspector.getDesktopWindowInspectorProxy().rehighlight(true);
        });

        //On hover of tree node
        $elm.on("hover_node.jstree", function(e, data) {
            //TODO: This model should be maintained in the core
            var currentElementObj = pega.ui.inspector.panel.getInspectorObjectByID(data.node.id);
            pega.ui.inspector.hover(currentElementObj, true);
        });

        //on dehover of tree node
        $elm.on("dehover_node.jstree", function(e, data) {
            pega.ui.inspector.clearHighlight();
        });
        //on select of tree node
        $elm.on("select_node.jstree", function(e, data) {
            pega.ui.inspector.clearHighlight();

            var nodeOffset = $(".runtime-control-tree #" + data.node.id).offset();

            var nodeWidth = $(".runtime-control-tree #" + data.node.id + " a.jstree-anchor.jstree-clicked").outerWidth();
            nodeWidth += $(".runtime-control-tree #" + data.node.id + " i.jstree-icon.jstree-ocl").outerWidth();
            nodeWidth += 18; // some extra padding from li

            // BUG-190071: set position of the tree to be relative to get accurate scroll top values
            var oldPosition = $("div.runtime-control-tree.jstree").css("position");
            $("div.runtime-control-tree.jstree").css({
                "position": "relative"
            });

            var treeScrollTop = $('.runtime-control-tree').scrollTop();
            var nodeOffsetTop = $(".runtime-control-tree #" + data.node.id)[0].offsetTop;
            //BUG-195863: subtracting 20 pixels to account for the scrollbar covering the bottom of the tree panel div
            var bScrollVert = (nodeOffsetTop < treeScrollTop || nodeOffsetTop > (treeScrollTop + $('.runtime-control-tree').height() - 20));

            // BUG-190071: reset the position of the tree since the scroll top has been calculated
            $("div.runtime-control-tree.jstree").css({
                "position": oldPosition
            });

            var iPanelOffset = $(window).width() - $('.runtime-control-tree').width();
            var nodeLeft = nodeOffset.left - iPanelOffset;
            var nodeRight = nodeLeft + nodeWidth;
            var bScrollHoriz = (nodeLeft < 0 || nodeRight > $('.runtime-control-tree').width());

          	// BUG-287589 Updated the logic as I think using nodeOffset.top instead of the nodeOffsetTop value
          	// used above is throwing off the logic
            //var scrollTopAmount = $('.runtime-control-tree').scrollTop() + nodeOffset.top - ($('.runtime-control-tree').height() / 3);
          	var scrollTopAmount = nodeOffsetTop - ($('.runtime-control-tree').height() / 3);

            // Try to scroll so that the node is indented one-third the width of the tree.
            // BUG-170224: added maximum comparison with 0 to prevent negative numbers needed for if-statement below.
            var scrollLeftAmount = Math.max(0, $('.runtime-control-tree').scrollLeft() + nodeLeft - $('.runtime-control-tree').width() / 3);

            var newRight = nodeRight + $('.runtime-control-tree').scrollLeft() - scrollLeftAmount;

            // BUG-170224: added if to make the tree scroll enough to show icons when possible.
            // Check if the node overlaps on the right-hand side.
            if (newRight > $('.runtime-control-tree').width()) {
                // If it does, then scrollLeftAmount needs to be bigger.
                scrollLeftAmount = scrollLeftAmount + (newRight - $('.runtime-control-tree').width());

                var newLeft = nodeLeft + $('.runtime-control-tree').scrollLeft() - scrollLeftAmount;

                // Check if the node overlaps on the left-hand side.
                if (newLeft < 0) {
                    // If it does, then scroll only to the lefthand side of the node.
                    scrollLeftAmount = $('.runtime-control-tree').scrollLeft() + nodeLeft;
                }
            }

            //Only scroll to an item that is not in view
            if (bScrollVert && bScrollHoriz) {
                $('.runtime-control-tree').animate({
                    scrollTop: (scrollTopAmount),
                    scrollLeft: (scrollLeftAmount)
                }, 1000);
            } else if (bScrollVert) {
                $('.runtime-control-tree').animate({
                    scrollTop: (scrollTopAmount)
                }, 1000);
            } else if (bScrollHoriz) {
                $('.runtime-control-tree').animate({
                    scrollLeft: (scrollLeftAmount + 30)
                }, 1000);
            }

            // Get a handle on the Inspector element and call focusFromTree
            var currentElementObj = pega.ui.inspector.panel.getInspectorObjectByID(data.node.id);
            //TODO: Clean this up. This seems like a poor set up to have to call itself again but ignore
            //Function calls to call this function again. May need to discuss as a team and rethink
            pega.ui.inspector.focus(currentElementObj, true);
        });

        //Move node event listener
        $elm.bind("move_node.jstree", pega.ui.inspector.editing.moveNodeCallback);
    }

    /**
     * @private Window resize handler
     **/
    function _handleWindowResize(e) {
        var $topHarness = pega.ui.inspector.getTopHarness();
      	_windowOuterWidth = $(window).outerWidth();

        // If the tree is too large on resize then fix it to be the max size allowed
        var treeSize = $(".runtime-control-panel").outerWidth();
        var maxSize = $(window).width() - 100;
        if (treeSize >= maxSize) {
            $(".runtime-control-panel").css({
                'left': '',
                'width': maxSize + 'px'
            });
            $topHarness.css({
                'right': maxSize + 'px'
            });
        } else {
            $(".runtime-control-panel").css({
                'left': ''
            });
            $topHarness.css({
                'right': treeSize + 'px'
            });
        }

        //Resize tree scroll area
        _resizeScrollBar();

        //Check width of harness and set css for header and footer
        _fakePortalMediaQuery($topHarness.width());

        //Reposition open overlays in all frames
        _repositionOpenOverlayInAllFrames();
    }

    /**
     * @private Adds special classes to the portal to fake responsive behavior of the portal itself
     *
     * @param $Integer$ width - Current width of the top most harness
     **/
    function _fakePortalMediaQuery(width) {
        //Find the class name to add based on width of top harness
        if (width < 875) {
            if (currentMediaQuery != BELOW875) {
                _updateMediaQuery(BELOW875);
            }
        } else if (width < 1280) {
            if (currentMediaQuery != BELOW1280) {
                _updateMediaQuery(BELOW1280);
            }
        } else if (width < 1455) {
            if (currentMediaQuery != BELOW1455) {
                _updateMediaQuery(BELOW1455);
            }
        } else if (width < 1555) {
            if (currentMediaQuery != BELOW1555) {
                _updateMediaQuery(BELOW1555);
            }
        } else if (width < 1755) {
            if (currentMediaQuery != BELOW1755) {
                _updateMediaQuery(BELOW1755);
            }
        } else {
            _updateMediaQuery("");
        }
    }

    /**
     * @private Clean up fake media query classes
     **/
    function _updateMediaQuery(newMediaQueryClass) {
        var $topHarness = pega.ui.inspector.getTopHarness();

        //Remove the class if a new class was added
        $topHarness.removeClass(currentMediaQuery);
        $topHarness.addClass(newMediaQueryClass);
        currentMediaQuery = newMediaQueryClass;
    }

    /**
     * @private Actually handles checking DOM change events and decides if a refresh should occur
     *
     * @param $Array$ mutationsList - Array of mutation records returned by listener
     */
    function _handleDOMChangeEvent(mutationsList) {
        if (publicAPI.isTreeRefreshing()) return false;
    
        var triggerRefresh = false;
    
        // Loop through list of mutations returned by the observer
        for (var i = 0; i < mutationsList.length; i++) {
            // For each mutation, check if it should be ignored
            var currentMutation = mutationsList[i];
            // IF pega.ui.inspector.ignoreEvent is not false(it actually returns false if event can be ignored by inspector)
            // AND if internal checkIfShouldIgnoreChange returns false as we determined to ignore
            // THEN Set variable to trigger a tree refresh and break out of loop at this point as no further checks are needed
            if (pega.ui.inspector.ignoreEvent(currentMutation) != false && checkIfShouldIgnoreChange(currentMutation.target) == false) {
                // Valid refresh, set flag and break
                triggerRefresh = true;
                break;
            }
        }

        /*BUG-191914 Address Maps have a number of dom events that trigger when interacting with them.
          As we do not care about anything in the map itself, we will ignore all events triggered if
          within an address control cell since it does not effect the tree. */
        function checkIfShouldIgnoreChange(elem) {
            var closestuiMetaElement = $(elem).closest("[data-ui-meta]");
            if(closestuiMetaElement && closestuiMetaElement.length > 0) {
                var uiMeta = eval("(" + closestuiMetaElement.attr("data-ui-meta") + ")");
                if(uiMeta.subType && uiMeta.subType.toUpperCase() == "PXADDRESSMAP") {
                    return true;
                }           
            }
          
            return false;
        }

        // Trigger the refresh depending on case
        if (triggerRefresh) {
            publicAPI.setRefreshTimer();
        }
    }

    /**
     * @private Adds on click focus event;
     */
    function _addUITreeFocusEvent() {
        $(TREE_TAB_SELECTOR).click(function(e) {
            setTimeout(function(e) {
                pega.ui.inspector.getDesktopWindowInspectorProxy().clearAllHighlights(true);
                if (pega.ui.inspector.isHighlightEnabled()) {
                    pega.ui.inspector.panel.refreshTree(true);
                    // BUG-210756 : Tree is out of sync with what is highlighted on the DOM
                    pega.ui.inspector.getDesktopWindowInspectorProxy().rehighlight();
                }
            }, 100);
        });
    }

    /////////////////////////////////////////////////////////////////////////////////
    //                                  PUBLIC API                                 //
    /////////////////////////////////////////////////////////////////////////////////

    /**
     * Initialize tree panel markup, called from inspector core start method
     **/
    publicAPI.initialize = function() {
        //Create control panel template
        var oControlPanel = document.createElement("DIV");
        oControlPanel.className = "runtime-control-panel runtime-property-panel inspector-hidden";
        oControlPanel.setAttribute('isInspectorElement', true);
        oControlPanel.innerHTML = PANEL_TEMPLATE;

        //Check to see if the panel already exists and if so then just replace it
        if ($(document.body).find("div.runtime-control-panel").length > 0) {
            $(document.body).find("div.runtime-control-panel").replaceWith($(oControlPanel));
        } else {
            $(oControlPanel).appendTo(document.body);
        }
       
        // Create temp load event that will manually add the meta data to the tree section
        var loadPanelCallback = function() {
            $("div[node_name='pzRunTime_ControlPanel']").attr("data-ui-meta", "{'type':'Section','ruleName':'pzRunTime_ControlPanel'}");
            _addUITreeFocusEvent();
        }

        return pega.ui.inspector.utilities.loadSectionIntoDom("pzRunTime_ControlPanel", "@baseclass", $(".runtime-control-body > div")[0], loadPanelCallback);
    }

    /**
     * @public Handles retrieving settings information from the server then animating in the side panel
     *
     * @param $Function$ callback - Callbakc function to be called after animation is complete
     */
    publicAPI.show = function(callback) {
        var $topHarness = pega.ui.inspector.getTopHarness();
      	var $controlPanel = $(".runtime-control-panel");

        _previousHarnessCSS = $topHarness.attr('style');
        if (typeof _previousHarnessCSS === 'undefined')
            _previousHarnessCSS = "";

        $controlPanel.removeClass("inspector-hidden");
        $(".runtime-control-tree").addClass("loading");
        $(".runtime-control-resize").css('display', "");

        //Set all parents heights to 100%
        var currentElement = $(".runtime-control-tree");
        while (currentElement && !currentElement.hasClass("runtime-control-panel")) {
            currentElement.css("height", "100%");
            currentElement = currentElement.parent();
        }


        // Calls the server to retrieve information for settings and history
        var postURL = new SafeURL("Data-RuntimeDesignSettings.pzRuntime_GetPreferences");
        if (pega && !pega.offline) { 
          pega.desktop.support.getDesktopWindow().pega.u.d.asyncRequest("POST", postURL, {
            success: function(o) {
                var Settings = eval("(" + o.responseText + ")");

                //Get the width of panel from the server only if positive
                var intPanelWidth = parseInt(Settings.pyRuntimeDesignPanelWidth);
                if (intPanelWidth >= 0) {
                    _liveUIPanelWidth = intPanelWidth;
                }

                //Get the state of the tree
                if (Settings.pyRuntimeDesignPanelMinimized == "true") {
                    _isTreeMinimized = true;
                } else {
                    _isTreeMinimized = false;
                }

                _animatePanel(callback);
            },
            failure: function(o) {
                //Activate the tree

            }
          });
        }

        window.addEventListener("resize", _handleWindowResize, true);
    }

    /**
     * @public Handles animating the side panel off screen
     *
     * @param $Function$ callback - Callback function to be called after animation is complete
     */
    publicAPI.hide = function(callback) {
        var $topHarness = pega.ui.inspector.getTopHarness();
      	var $controlPanel = $(".runtime-control-panel");

        $topHarness.animate({
            right: "0px"
        }, ANIMATION_DURATION, ANIMATION_EASING, function() {
            $topHarness.attr('style', _previousHarnessCSS);
            $topHarness.css('right', "0px");
            $controlPanel.removeClass("showing");
          	$controlPanel.addClass("inspector-hidden");
            $(".runtime-control-resize").css('display', "none");
        });

        $('.runtime-control-tab').removeClass('runtime-control-tab-min');
        $('.runtime-control-tab').removeClass('runtime-control-tab-max');

        $controlPanel.animate({
            width: "0px"
        }, ANIMATION_DURATION, ANIMATION_EASING, function() {
            //Clear classes used to fake media queries
            _updateMediaQuery();

            $('.runtime-control-panel').removeClass("runtime-control-panel-active");

            callback();

            window.removeEventListener("resize", _handleWindowResize, true);
        });
    }

    /**
     * @public Refreshes the jsTree by parsing the DOM and resetting some globals
     *
     * @param $Boolean$ checkForRefresh - Flag used to determain if we should check to see if the tree needs to be refreshed
     */
    publicAPI.refreshTree = function(checkForRefresh) {
        if ((pega.ui.inspector.getDesktopWindowInspectorProxy().getDesktopWindow() != window) && pega.ui.inspector.getDesktopWindowInspectorProxy().panel != null) {
            pega.ui.inspector.getDesktopWindowInspectorProxy().panel.refreshTree(checkForRefresh);
        } else {
            if (checkForRefresh != true)
                checkForRefresh = false;

            if (this.isUITreeVisible()) {
                if (checkForRefresh) {
                    if (treeNeedsToRefresh == false) {
                        pega.ui.inspector.getDesktopWindowInspectorProxy().debugLogger("NOT Refreshing Tree");
                        return false;
                    }
                }
            } else {
                treeNeedsToRefresh = true;
                pega.ui.inspector.getDesktopWindowInspectorProxy().debugLogger("NOT Refreshing Tree");
                return false;
            }

            pega.ui.inspector.getDesktopWindowInspectorProxy().debugLogger("Refreshing Tree");

            //Drop out if tree is not active
            if (!pega.ui.inspector.getDesktopWindowInspectorProxy().isActive() || pega.ui.inspector.editing.propertypanel.isOpen()) {
                return false;
            }

            //Nullify tree data
            _idPanelLocation = null;
            isTreeRefreshing = true;

            // Clear all highlights and nullify globals
            pega.ui.inspector.getDesktopWindowInspectorProxy().clearAllHighlights(true);

            //Close all nodes before refreshing
            if (_jsTreeRefObj) {
                _jsTreeRefObj.close_all();
            }

            // Clear out the unique id before creating the models
            pega.ui.inspector.utilities.getUniqueID(true);

            // Call parser to parse the dom and retrieve all Inspector elements
			var parseElement = pega.ui.inspector.getContext();
          	var filter = pega.ui.inspector.getFilter();
          	var stopFilter = pega.ui.inspector.getStopFilter();
            var returnObj = pega.ui.inspector.parser.buildModel(parseElement, filter, stopFilter);

            // Based on the return object from buildModel store off _inspectorObjectsRootNodes and _inspectorObjectsByID globals
            _inspectorObjectsByID = returnObj.lookupByID;
            _inspectorObjectsRootNodes = returnObj.rootNodes;

            // Retrieve all JSON for root nodes that were found. This is done for things like overlays and models
            // which are siblings of the top most harness so in the tree they are a root node
            var treeJSON = []
            for (var i = 0; i < _inspectorObjectsRootNodes.length; i++) {
                treeJSON[i] = _inspectorObjectsRootNodes[i].getTreeJson();
            }

            //Apply jsTree
            $(".runtime-control-tree").jstree("destroy"); // Destroy jstree before creating new

            $(".runtime-control-tree").jstree({ // BUG-160003: Disable multiple select
                "core": {
                    "multiple": false,
                    "data": treeJSON,
                    "check_callback": pega.ui.inspector.editing.checkOperationCallback
                },
                "types": {
                    "others": {
                        "valid_children": ["none"]
                    },
                    "layout": {
                        "valid_children": ["cell", "layout"]
                    },
                    "cell": {
                        "valid_children": ["none"]
                    }
                },
                "dnd": {
                    check_while_dragging: true,
                    inside_pos: "last"
                },
                "plugins": ["dnd", "types"]
            });

            _bindTreeEvents($(".runtime-control-tree"));

            //Resize tree content for scroll bars
            setTimeout(_resizeScrollBar, 250);

            $(".runtime-control-tree").removeClass("loading");

            //Set tree reference
            _jsTreeRefObj = $.jstree.reference('.runtime-control-tree');

            isTreeRefreshing = false;
            //Remove loading cursor
            var tempList = pega.ui.inspector.getDesktopWindowInspectorProxy().getFrameList();
            for (var x = 0; x < tempList.length; x++) {
                if ($(tempList[x].document).length > 0) {
                    $(tempList[x].document.body).removeClass("runtime-tree-refreshing-cursor");
                }
            }

            // Remove readonly class from tree
            $(".runtime-control-tree").removeClass("ui-tree-readonly");

            treeNeedsToRefresh = false;
        }
    }

    /**
     * @public Takes in an element and checks if one of the root nodes exists a model with that element
     *
     * @param $HTML Element$ elemeent - The HTML element to try and find the corrasponding Inspector Element object
     * @return $Inspector Element$ returnModel - The Inspector element model that was found or null
     */
    publicAPI.getInspectorObjectByElement = function(element) {
        if (pega.ui.inspector.getDesktopWindowInspectorProxy().getDesktopWindow() != window && pega.ui.inspector.getDesktopWindowInspectorProxy().panel != null) {
            return pega.ui.inspector.getDesktopWindowInspectorProxy().panel.getInspectorObjectByElement(element);
        } else {
            var returnModel = null;

            // Loop over root nodes and call their findByElement function to try and find object
            for (var i = 0; i < _inspectorObjectsRootNodes.length; i++) {
                returnModel = _inspectorObjectsRootNodes[i].findByElement(element);

                // If the model is found then drop out of loop
                if (returnModel) {
                    break;
                }
            }

            return returnModel;
        }
    }

    /**
     * @public Takes in an ID and checks if one of the root nodes contain a model with that id
     *
     * @param $String$ ID - The ID to try and find the corrasponding Inspector Element object for
     * @return $Inspector Element$ returnModel - The Inspector element model that was found or null
     */
    publicAPI.getInspectorObjectByID = function(ID) {
        if (pega.ui.inspector.getDesktopWindowInspectorProxy().getDesktopWindow() != window && pega.ui.inspector.getDesktopWindowInspectorProxy().panel != null) {
            return pega.ui.inspector.getDesktopWindowInspectorProxy().panel.getInspectorObjectByID(ID);
        } else {
            return _inspectorObjectsByID[ID];
        }
    }

    /**
     * @public Used to see if the tree is refreshing or not
     */
    publicAPI.isTreeRefreshing = function() {
        return isTreeRefreshing;
    }

    /**
     * @public Updated the skin name displayed in the tree
     *
     * @param $String$ skinName - Skin name to display
     */
    publicAPI.displaySkinInfo = function(skinName) {
        if (pega.ui.inspector.getDesktopWindowInspectorProxy().getDesktopWindow() != window && pega.ui.inspector.getDesktopWindowInspectorProxy().panel != null) {
            return pega.ui.inspector.getDesktopWindowInspectorProxy().panel.displaySkinInfo(skinName);
        } else {
            if (skinName != null || skinName != "") {
                $('.runtime-control-skinName').html("<a style='cursor:default;' class='runtime-edit-icon-skin CellNode'></a>Skin - <span id='RuntimeInspectorSkinName' class='RuntimeInspectorLabelOpenRule RuntimeInspectorValue' onclick='pega.ui.inspector.openSkinRule(\"" + skinName + "\")'>" + skinName + "</span>");
            }
        }
    }

    /**
     * @public Disables all buttons in the panel. Used for when property panel is open
     */
    publicAPI.disablePanel = function() {
        // Fix for BUG-175907
        if (typeof $(".runtime-publish-all-button button").attr('was-disabled') === 'undefined') {
            if (typeof $(".runtime-publish-all-button button").attr('disabled') === 'undefined') {
                // only disable the publish button if the button is not already disabled
                $(".runtime-publish-all-button button").attr('disabled', 'disabled');
                $(".runtime-publish-all-button button").attr('was-disabled', 'false');
            } else {
                // the button is already disabled, so add a dummy attribute to keep track of that
                $(".runtime-publish-all-button button").attr('was-disabled', 'true');
            }
        }

        if (typeof $(".runtime-discard-all-button button").attr('was-disabled') === 'undefined') {
            if (typeof $(".runtime-discard-all-button button").attr('disabled') === 'undefined') {
                // only disable the discard button if the button is not already disabled
                $(".runtime-discard-all-button button").attr('disabled', 'disabled');
                $(".runtime-discard-all-button button").attr('was-disabled', 'false');
            } else {
                // the button is already disabled, so add a dummy attribute to keep track of that
                $(".runtime-discard-all-button button").attr('was-disabled', 'true');
            }
        }

        $(".runtime-panel-publishIcon").addClass("cursordefault");
        pega.ui.inspector.utilities.removeDataClick(".runtime-panel-publishIcon");

        $(".runtime-panel-discardIcon").addClass("cursordefault");
        pega.ui.inspector.utilities.removeDataClick(".runtime-panel-discardIcon");

        $(".runtime-control-undo-enabled img").addClass("cursordefault");
        pega.ui.inspector.utilities.removeDataClick(".runtime-control-undo-enabled img");

        $(".runtime-control-allowinteraction img").addClass("cursordefault");
    }

    /**
     * @public Enables the panel buttons and icons
     */
    publicAPI.enablePanel = function() {
        $(".runtime-control-tree").removeClass("ui-tree-readonly");

        // Fix for BUG-175907
        if ($(".runtime-publish-all-button button").attr('was-disabled') == 'false') {
            // only re-enable the button if it was not disabled before
            $(".runtime-publish-all-button button").removeAttr('disabled');
        }
        $(".runtime-publish-all-button button").removeAttr('was-disabled');

        if ($(".runtime-discard-all-button button").attr('was-disabled') == 'false') {
            // only re-enable the button if it was not disabled before
            $(".runtime-discard-all-button button").removeAttr('disabled');
        }
        $(".runtime-discard-all-button button").removeAttr('was-disabled');

        $(".runtime-panel-publishIcon").removeClass("cursordefault");
        pega.ui.inspector.utilities.restoreDataClick(".runtime-panel-publishIcon");

        $(".runtime-panel-discardIcon").removeClass("cursordefault");
        pega.ui.inspector.utilities.restoreDataClick(".runtime-panel-discardIcon");

        $(".runtime-control-undo-enabled img").removeClass("cursordefault");
        pega.ui.inspector.utilities.restoreDataClick(".runtime-control-undo-enabled img");

        $(".runtime-control-allowinteraction img").removeClass("cursordefault");
    }

    /**
     * @public Handles calling disable panel from pending tab when it refreshes if the property panel is open
     */
    publicAPI.pendingTabRefresh = function() {
        if ((pega.ui.inspector.getDesktopWindowInspectorProxy().getDesktopWindow() != window) && pega.ui.inspector.getDesktopWindowInspectorProxy().panel != null) {
            pega.ui.inspector.getDesktopWindowInspectorProxy().panel.pendingTabRefresh();
        } else {
            if (!pega.ui.inspector.getDesktopWindowInspectorProxy().isActive()) {
                return false;
            }

            if (pega.ui.inspector.editing.propertypanel.isOpen()) {
                this.disablePanel();
            }
        }
    }

    /**
     * @public Gets the reference to the jsTreeObject
     *
     * @return $Object$ _jsTreeRefObj - Reference to the js tree object
     */
    publicAPI.getJsTreeRef = function() {
        if ((pega.ui.inspector.getDesktopWindowInspectorProxy().getDesktopWindow() != window) && pega.ui.inspector.getDesktopWindowInspectorProxy().panel != null) {
            pega.ui.inspector.getDesktopWindowInspectorProxy().panel.getJsTreeRef();
        } else {
            return _jsTreeRefObj;
        }
    }

    /**
     * @public Refresh all tabs in the UI tree except for settings.
     */
    publicAPI.refresh = function() {
        try {
            //Reload publish tab
            _reloadSectionIfPresent("pzRunTime_ControlPanel_ActivityTab");

            setTimeout(function() {
                //Reload history tab
                _reloadSectionIfPresent("pzRunTime_ControlPanel_HistoryTab");

                var callback = function() {
                  	if(pega.ui.inspector.editing.propertypanel.isOpen()) {
                  		pega.ui.inspector.panel.disablePanel();
                    }
                };

                //Reload publish/discard tab
                _reloadSectionIfPresent("pzRunTime_ControlPanel_PublishDiscard", callback);

                //Reload settings tab
                _reloadSectionIfPresent("pzRuntime_ControlPanel_SettingsTab");

                //Reload section with undo interaction button
                _reloadSectionIfPresent("pzRunTime_ControlPanel_UndoInteraction");
            }, 250);
        } catch (e) {
            //Do nothing
        }
    }

    /**
     * @public Called to set a refresh timer, cancels the previos timer
     * @param $Integer$ wait - Time in ms to wait for the next refresh timer
     */
    publicAPI.setRefreshTimer = function(wait) {
        if ((pega.ui.inspector.getDesktopWindowInspectorProxy().getDesktopWindow() != window) && pega.ui.inspector.getDesktopWindowInspectorProxy().panel != null) {
            pega.ui.inspector.getDesktopWindowInspectorProxy().panel.setRefreshTimer(wait);
        } else {
            if (!wait) wait = _refreshDelay;

            clearTimeout(_refreshTimeoutID);
            _refreshTimeoutID = setTimeout(function() {
                // BUG-340119 If interaction has been re-enabled, no need to refresh until it has been re-disabled
                if($(".runtime-control-body").hasClass("interaction-enabled")) {
                    // Set flag so panel knows to listen/refresh
                    pega.ui.inspector.panel.setListenForChanges(true);
                } else {
                    pega.ui.inspector.panel.refreshTree();
                }
            }, wait);
        }
    }

    /**
     * @public Adds DOM mutation events to the top harness in the current frame
     */
    publicAPI.addDOMMutationEvents = function() {
        var $topHarness = pega.ui.inspector.getTopHarness();

        clearTimeout(_changeEventsTimeoutID);

        //Fall out if there is no top level meta element
        if ($topHarness[0] == null) return;
        _changeEventsTimeoutID = setTimeout(this.removeDOMMutationEvents, 15000);
      
        // Initialize the MutationObserver if needed
        if(_refreshTreeObserver===null) {
            _refreshTreeObserver = new MutationObserver(_handleDOMChangeEvent);
        }
      	
        // MutationObserver will look for DOM tree modifications only starting from the top harness down
        _refreshTreeObserver.observe($topHarness[0], {
            childList: true,
            subtree: true
            //attributes: true
        });
    }

    /**
     * @public Removes the DOM mutation events for the current frame
     */
    publicAPI.removeDOMMutationEvents = function() {
        if(_refreshTreeObserver != null) {
            _refreshTreeObserver.disconnect();
        }
    }

    /**
     * @public Starts listening to changes by adding mutation listeners to all frames
     */
    publicAPI.startListeningForChanges = function() {
        if (!this.isUITreeVisible()) {
            this.setListenForChanges(true);
            this.setTreeNeedsToRefresh(true);
            return false;
        }
        else {
            pega.ui.inspector.panel.setListenForChanges(false);
            pega.ui.inspector.panel.setTreeNeedsToRefresh(false);
        }
        pega.ui.inspector.getDesktopWindowInspectorProxy().debugLogger("Starting Listen for changes");
        //Turn on DOM manipulation events only when flag is set
        var tempList = pega.ui.inspector.getFrameList();
        for (var x = 0; x < tempList.length; x++) {
            if ($(tempList[x].document).length > 0) {
                tempList[x].pega.ui.inspector.panel.addDOMMutationEvents();
                $(tempList[x].document.body).addClass("runtime-tree-refreshing-cursor");
            }
        }
        //Start a refresh by default if anything was clicked
        //BUG-201232: ie9 seems to be taking longer between dom changes than other browsers
        if (pega.ui.inspector.getBrowser() === pega.ui.inspector.BROWSERS.IE9) {
            this.setRefreshTimer(250);
        } else {
        this.setRefreshTimer(100);
        }
    }

    /**
     * @public Stop listening for changes by turning off mutation events in all frames
     */
    publicAPI.stopListeningForChanges = function() {
        pega.ui.inspector.getDesktopWindowInspectorProxy().debugLogger("Stop Listen for changes");
        //Turn on DOM manipulation events only when flag is set
        var tempList = pega.ui.inspector.getFrameList();
        for (var x = 0; x < tempList.length; x++) {
            if ($(tempList[x].document).length > 0) {
                tempList[x].pega.ui.inspector.panel.removeDOMMutationEvents();
                $(tempList[x].document.body).removeClass("runtime-tree-refreshing-cursor");
            }
        }
    }

    /**
     * @public Setter for listenForChages
     * @param $Boolean$ val - Value to set listen for changes to
     */
    publicAPI.setListenForChanges = function(val) {
        if ((pega.ui.inspector.getDesktopWindowInspectorProxy().getDesktopWindow() != window) && pega.ui.inspector.getDesktopWindowInspectorProxy().panel != null) {
            return pega.ui.inspector.getDesktopWindowInspectorProxy().panel.setListenForChanges(val);
        } else {
            listenForChanges = val;
        }
    }

    /**
     * @public Setter for treeNeedsRefresh
     * @param $Boolean$ val - Value to set tree needs to refresh to
     */
    publicAPI.setTreeNeedsToRefresh = function(val) {
        if ((pega.ui.inspector.getDesktopWindowInspectorProxy().getDesktopWindow() != window) && pega.ui.inspector.getDesktopWindowInspectorProxy().panel != null) {
            return pega.ui.inspector.getDesktopWindowInspectorProxy().panel.setTreeNeedsToRefresh(val);
        } else {
            treeNeedsToRefresh = val;
        }
    }

    /**
     * @public Getter for listen for changes
     * @return $Boolean$ listenForChanges
     */
    publicAPI.getListenForChanges = function() {
        if ((pega.ui.inspector.getDesktopWindowInspectorProxy().getDesktopWindow() != window) && pega.ui.inspector.getDesktopWindowInspectorProxy().panel != null) {
            return pega.ui.inspector.getDesktopWindowInspectorProxy().panel.getListenForChanges();
        } else {
            return listenForChanges;
        }
    }

    /**
     * @public Checks if the UI Tree is currently visible
     * @return $Boolean$ if the UI Tree is visible
     */
    publicAPI.isUITreeVisible = function() {
        if ((pega.ui.inspector.getDesktopWindowInspectorProxy().getDesktopWindow() != window) && pega.ui.inspector.getDesktopWindowInspectorProxy().panel != null) {
            return pega.ui.inspector.getDesktopWindowInspectorProxy().panel.isUITreeVisible();
        } else {
            if ($(TREE_TAB_SELECTOR).attr('aria-selected') == "true" && !_isTreeMinimized) {
                return true;
            } else {
                return false;
            }
        }
    }

   /**
     * @public Checks if the UI Tree is currently visible
     * @return $Boolean$ if the UI Tree is visible
     */
    publicAPI.isMaximized = function() {
        if ((pega.ui.inspector.getDesktopWindowInspectorProxy().getDesktopWindow() != window) && pega.ui.inspector.getDesktopWindowInspectorProxy().panel != null) {
            return pega.ui.inspector.getDesktopWindowInspectorProxy().panel.isMaximized();
        } else {
            return !_isTreeMinimized;
        }
    }
    return publicAPI;
}());
//static-content-hash-trigger-GCC
var $pNamespace = pega.namespace;
$pNamespace("pega.ui.inspector");

// The editor is a singleton class which returns its public methods.
pega.ui.inspector.parser = (function() {
    var TreeProxy = pega.ui.inspector;

    // SHOW TREE ELEMENTS //
    var _parseTreeElements = false; // Changing the value to true will result in the auto gen ui of the control panel to appear in the tree
    var _metaAttr = "data-ui-meta";


    /** Responsible for getting a list of child nodes for the given root node
     * @param root Node to find the children of
     * @return array of children nodes
     **/
    function _findMetaChildren(root, skipHiddenElements) {
        if (root != null && root.children != null && root.children.length > 0) {
            var childrenList = new Array; //List to return
            var children = new Array; //List of children
            children = root.children;
            var temp = new Array; //Temp array to keep track of things inside of loop
            for (var i = 0; i < children.length; i++) {
                temp = _findMetaChild(children[i], skipHiddenElements);
                if (temp) {
                    for (var y = 0; y < temp.length; y++) {
                        childrenList.push(temp[y]);
                    }
                }
            }
            return childrenList;
        }
    }

    /** Examines single node. Returns node in array if it has data-ui-meta attribute
     *  if it does not and it has children it calls _findMetaChildren to continue to parse dom
     *  @param node Node to examine
     *  @return an array of children nodes or nothing if not valid to end recursion
     **/
    function _findMetaChild(node, skipHiddenElements) {
        var list = new Array;
        //Only continue if it is nodeType 1
        if (node != null && node.nodeType == 1) {
            //If the element is set to display none ignore
            if (skipHiddenElements == true && node.style.display && node.style.display == "none") {
                return;
            }
            
            // Check if inspecting "Inspector Elements" and ignore
            if (node.attributes["isinspectorelement"]) {
                return false;
            }

            //Return if has data-ui-meta
            if (node.hasAttribute(_metaAttr) == true) {
                list.push(node);
                return list;
            }
            //Handle iframes or continue to check children
            /* SR-129232 - Added check for Frames as well in case of non-auto gen frame sets */
            if (node.nodeName != null && (node.nodeName == "IFRAME" || node.nodeName == "FRAME")) {
                try {
                    // BUG-170183: items in section include in Design View could be inspected,
                    // added the second half of the following if to prevent Design View iframes
                    // from being added to the dom
                    if (node.contentDocument.defaultView.pega.ui.inspector && node.id != "sectionDisplay-IFRAME") {
                        return _findMetaChildren(node.contentDocument.body, skipHiddenElements);
                    }
                } catch (e) {
                    /* SR-129232 - This covers scenarios where an iframe without Live UI Code
                       does in fact have yet another frame that does contain Live UI. This will
                       loop over all child frames and recall itself with the next frame */
                    if (node.contentWindow.frames.length > 0) {
                        for (var x = 0; x < node.contentWindow.frames.length; x++) {
                            return _findMetaChild(node.contentWindow.frames[x].frameElement, skipHiddenElements)
                        }
                    }
                }
            } else {
                return _findMetaChildren(node, skipHiddenElements);
            }
        }
    }

    /**
     * Main function to parse dom to make a tree representation of UI Elements. Starts with any root node and finds UI Element children, then recursevly call itself for
     * each of its children. As the recursive calls are made the currently instantiated model is passed in as parentInspectorObject. On all the other recursive calls the
     * generated model is added to the parentInspectorObject.children to make the tree representation.
     * The filter param will only add elements to the representation that follow the criteria defined in it, while stopFilter will prevent the recursive call for children
     * of an element that matches the criteria defined in it.
     *
     * @param $HTML Element$ htmlInspectorElement - HTML root node to parse
     * @param $Object$ filter - Object containing the criteria to filter elements under the root node on
     * @param $Object$ stopFilter - Object containing the criteria to stop parsing after
     * @param $Inspector Element$ parentInspectorObject - Parent model object of the current object. Null to start used for recursive callse
     * @param $Object$ returnObject - Object containing a list of rootNodes and lookupByID. Null to start used for recursive callse
     * @return $Object$ returnObject - Object containing a list of rootNodes and lookupByID. rootNodes is just top level nodes, lookupByID is array of all models build with id as key
     **/
    function _buildModel(htmlInspectorElement, filter, stopFilter, parentInspectorObject, returnObject, rootNode, skipHiddenElements) {      
      if (skipHiddenElements && parentInspectorObject && parentInspectorObject.get("subType") && parentInspectorObject.get("subType") == "DYNAMICLAYOUTGROUP" && parentInspectorObject.get("element") && !parentInspectorObject.get("element").hasClass("layout-group-stacked") && !$(htmlInspectorElement).hasClass("active") && !$(htmlInspectorElement).hasClass('header-content')) {
            return false;
        }

        // If the return object is null then instantiate it.
        if (returnObject == null) {
            returnObject = {
                lookupByID: [],
                rootNodes: []
            }
        }

        // Need to instantiate the vars here in case we are on document and need to skip tree gen
        var model = parentInspectorObject; // default to parent so it's passed along if current element is not data-ui-meta
        var childrenNodes = new Array;
        var nodeToCheck = htmlInspectorElement;

        // check if element has data-ui-meta info
        if ($(htmlInspectorElement).attr(_metaAttr)) {
            // get the data attribute info off of the element
            model = new pega.ui.inspector.Element(htmlInspectorElement, parentInspectorObject, true, _metaAttr);

            
            // Call logic that will adjust the model object based on some information
            // this does stuff like combine two nodes together
            // IMPORTANT: This also returns the nodeToCheck if you are parsing a wrapper for a section include
            // this keeps the second duplicated sections out of the model
            nodeToCheck = publicAPI.adjustModelObject(model, nodeToCheck);

            // add the element if there is no filter or if it passes the filter
            if (filter == null || pega.ui.inspector.utilities.elementMatchesFilters(model, filter)) {
                // Call model to build tree information after the adjust model was done
                // this needs to happen after adjust model becuase the subType us adhusted and that is needed for the display text
                model.buildTreeModel()

                // Add the new model to the array of the previous models children
                if (parentInspectorObject) {
                    parentInspectorObject.children.push(model)
                }

                // To make looking up Inspector Model object easier create a lookup list for models by ID
                returnObject.lookupByID[model.id] = model

                // When building root nodes add them to the rootNodes of return object for tree JSON creation
                if (parentInspectorObject == null) {
                    returnObject.rootNodes.push(model);
                }

              	if(stopFilter != null && rootNode !== model.get("element")[0] && pega.ui.inspector.utilities.elementMatchesFilters(model, stopFilter)) {
                  	return returnObject;
                }           	
            } else {
              	if(stopFilter != null && rootNode !== model.get("element")[0] && pega.ui.inspector.utilities.elementMatchesFilters(model, stopFilter)) {
                  	return returnObject;
                }
                // set model back to default if element didn't pass the filter
                model = parentInspectorObject;
            }
        }
        //Get data-ui-meta children for the current node
        childrenNodes = _findMetaChildren(nodeToCheck, skipHiddenElements);

        //Loop over children and recursively call buildModel
        if (childrenNodes != null) {
            for (var x = 0; x < childrenNodes.length; x++) {
              _buildModel(childrenNodes[x], filter, stopFilter, model, returnObject, rootNode, skipHiddenElements);
            }
        }

        // Return the return object with the rootNodes and lookupByID lists
        return returnObject;

    }

    /////////////////////////////////////////////////////////////////////////////////
    //                              PUBLIC API                                     //
    /////////////////////////////////////////////////////////////////////////////////
    var publicAPI = {};
    publicAPI.setMetaAttr = function(metaAttr) {
        _metaAttr = metaAttr
    }


    /**
     * @public Public function to parse the dom to make a tree representation of UI Elements. Accepts a root node and filtering criteria
     * The filter param allows you to limit which nodes will be returned, for example if you only want to return Layouts the
     * filter object should be formatted as follows. The stopFilter param works in a similar manner, and would prevent child elements
     * of a layout from being built into the return object.
     *	var filter = [{
     *		"type": "Layout",
     *	}];
     *
     * @param $HTML Element$ root - HTML root node to parse
     * @param $Object$ filter - Array of objects containing the criteria to filter elements under the root node on
     * @param $Object$ stopFilter - Array of objects containing the criteria to stop parsing after
     * @return $Object$ - Object containing the criteria determining when to stop building subsequent child nodes under the root node
     **/
    publicAPI.buildModel = function(root, filter, stopFilter, skipHiddenElements) {
      	if(typeof skipHiddenElements === "undefined") skipHiddenElements = true;
        return _buildModel(root, filter, stopFilter, null, null, root, skipHiddenElements);
    }

    /** Compares the node to the model and does some data massaging. Combines section include type elements with their child section.
     *  Also retrieves the test id from the element and adds it to the model object so that it can be used in the future
     *  @param model The model to adjust
     *  @param nodeToCheck The node to check against
     **/
    publicAPI.adjustModelObject = function(model, nodeToCheck) {
      var subType = model.get("subType");
      var type = model.get("type");

      if ((subType && (subType == "SECTIONINCLUDE" || subType == "SUB_SECTION")) ||
          (type && type == "Panel")) {
        var incSection = _findMetaChildren(nodeToCheck, false);
        // If there is a section then add to the model
        // Change type and subtype to reflect the new node
        model.set("subType", model.get("type").toUpperCase());
        model.set("subTypeDisplay", model.get("type"));
        model.set("type", "Section");
        if (incSection != null && incSection.length == 1) {
          var uiMeta = eval("(" + $(incSection).attr(_metaAttr) + ")");
          if (uiMeta && uiMeta.type == "Section" && uiMeta.insKey && uiMeta.insKey != "") {
            nodeToCheck = incSection[0];
            //Set correct data for the included section
            model.set("insKey", uiMeta.insKey);
            model.set("ruleName", uiMeta.ruleName);                  	
            model.set("sectionType", uiMeta.sectionType);
            model.set("sectionChild", incSection);

            // If the section is editable then update the model
            if (uiMeta.editable && uiMeta.editable == "true") {
              model.set("editable", true);

            } else {
              model.set("editable", false);
            }
            // If the section is templated then update the model
            if (uiMeta.templated && uiMeta.templated == "true") {
              model.set("templated", true);
            } else {
              model.set("templated", false);
            }
          }
        }
      }

      //Get test id from children and add to object attributes
      if (model.get("type") && (model.get("type") == "Cell")) {
        // Get a list of elements with test IDs
        var testIDElement = model.get("element")[0].querySelectorAll("*[data-test-id]");
        if (testIDElement != null) {
          //Loop through all results found
          for (var i = 0; i < testIDElement.length; i++) {
            //find an element with a test id, that is not a dynamic layout cell label
            if (!$(testIDElement[i]).hasClass("field-caption")) {
              model.set("testID", $(testIDElement[i]).attr("data-test-id"));
            }
          }
        }
      }
      return nodeToCheck;
    }

    /**
     * Called to get the nearest parent element to the given inspector element
     * @param  $Inspector Element$ modelObj The inspector element to find the parent of
     * @param  $JSON$ filter - The filter object to filter parent by
     * @return $Inspector Element$ The inspector object corrasponding to the parent
     */
    publicAPI.getNearestParent = function(modelObj, filter) {
        var tempElement = modelObj.get('element');
        var oParent = modelObj;

        // Find the parent section and set parent element
        while (true) {
            if (modelObj.isTreeEnabled()) {
                oParent = oParent.get("parent");
                if (oParent == null) {
                    return null;
                }
            } else {
                tempElement = $(tempElement).parent().closest('*[data-ui-meta]');
                if (tempElement == null || tempElement.length == 0) {
                    // Since the element is null/not found see if the current element is a harness and you are in an iframe
                    // if you are in an iframe then get a reference to the current iframe from the top most window and continue
                    var oWin = modelObj.get("element")[0].ownerDocument.defaultView
                    if (modelObj.get("type") && modelObj.get("type") == "Harness" && oWin.parent && oWin.parent.name != oWin.name) {
                        tempElement = $("iframe[name*='" + oWin.name + "']");
                        if (tempElement && tempElement.length == 1) {
                            continue;
                        }
                    }
                    return null;
                }

                oParent = pega.ui.inspector.utilities.getTempInspectorObject(tempElement);

                // If you are looking for parents and you find the sections parent cell it is considered the same element so continue looping
                if (oParent.get("type") && modelObj.get("type") && oParent.get("type") == "Section" && modelObj.get("type") == "Section" &&
                    oParent.get("ruleName") && modelObj.get("ruleName") && oParent.get("ruleName") == modelObj.get("ruleName")) {
                    continue;
                }
            }

            if (filter == null || pega.ui.inspector.utilities.elementMatchesFilters(oParent, filter)) {
                break;
            }
        }
        return oParent;
    }

    /** This function will find the current inspector element in the DOM based on the following:
     *        Start from passed in element and parse up its parents until it finds an inspector element in the current context
     *        The element will only be returned if it would be found given the passed in filters
     *  @param $Inspector Element$ startElement - The inspector element to start the search from
     *  @param $HTML Element$ root - The HTML element that is the top context to search in
     *  @param $Object$ filter - Array of objects containing the criteria to filter elements under the root node on
     *  @param $Object$ stopFilter - Array of objects containing the criteria to stop parsing after
     *  @return $Inspector Element$ Inspector element for the element found based on the given inputs
     **/
    publicAPI.findCurrentElement = function(startElement, root, filter, stopFilter) {
        if ((pega.ui.inspector.getDesktopWindow() != window) && pega.ui.inspector.getDesktopWindowInspectorProxy() != null) {
            return pega.ui.inspector.getDesktopWindowInspectorProxy().parser.findCurrentElement(startElement, root, filter, stopFilter);
        } else {
            // --- Build the unfiltered ancestor list. ---
            var ancestors = [];
            var currentAncestor = startElement;
            // Element is always valid if context is document.body
            // Otherwise, we'll figure out if it's valid as we're building the ancestor list
            var contextContainsElement = (root === document.body);

            while (currentAncestor != null) { // loop up through the parents
                // stop building ancestor list when we hit the context element
                if(currentAncestor.get('element')[0] === root) {
                    contextContainsElement = true;
                    break;
                }
                ancestors.push(currentAncestor); // add current element to list
                currentAncestor = pega.ui.inspector.parser.getNearestParent(currentAncestor); // move to next parent
            }

            // no valid element if the start element is not contained in the context element
            if(!contextContainsElement) {
                return null;
            }

            // --- Apply the filter and stop filter to find the correct element. ---
            var currentElement = null;

            while (ancestors.length > 0) { // loop through ancestor list from top
                // grab the top most element in our ancestor list
                var poppedAncestor = ancestors.pop();
                // if the current element passes the filter, save it off
                if (filter == null || pega.ui.inspector.utilities.elementMatchesFilters(poppedAncestor, filter)) {
                    currentElement = poppedAncestor;
                }
                // go down the ancestor list until we hit the stop filter (if there is a stop filter)
                if (stopFilter != null && pega.ui.inspector.utilities.elementMatchesFilters(poppedAncestor, stopFilter)) {
                    break;
                }
            }

            // --- Get the proper element from the tree if possible. ---
            if (currentElement != null) {
                var temp = pega.ui.inspector.panel.getInspectorObjectByElement(currentElement.get('element')[0]);
                if (temp) {
                    // set current element to the tree element so tree element is hovered when mousing over DOM
                    currentElement = temp;
                }
            }

            return currentElement;
        }
    }

    return publicAPI;
}());
var $pNamespace = pega.namespace;
$pNamespace("pega.ui.inspector");

// The editor is a singleton class which returns its public methods.
pega.ui.inspector.editing = (function() {
    var TreeProxy = pega.ui.inspector; // Proxy to top tree namespace

    var jsTreeRefObj; // Ref object to the jsTree object

    var _originalDropElement; // Original element being moved
    var _tempDropIndicator; // Temp element that is being displayed for placement
    var _draggingElem = false; // Flag for when an element is being dragged
    var _dragElem;
    var _dropElem; //TODO: revisit originalDropElement and dropElem, see if both are needed
    var _errorMessageModalElem = null; // Element for errors which may appear during editing

    var lastKnownMoveLocation = ""; //Global for moving elements, checks if it was added "inside", "before", or "after"

    var addControlPosition = null; // Global flag for position of added control

  	var _cachedParam = null;    //Cached parms for _callProcessAction_runtime to be used to recall itself if the user makes a branch
  	var _cachedNodeObj = null;

    /** Calls pzProcessAction_RunTimeEditing activity and passes in any additional params
     *  @param $Array$ params - Additional params to pass to the activity
     *  @param $Inspector Element$ nodeObj - Inspector object of the current node
     *  @param $Boolean$ configureRuntimeBranch - Passed to the server to make the runtime branch
     **/
    function _callProcessAction_runtime(params, nodeObj, configureRuntimeBranch) {
        var secElement = pega.ui.inspector.getFocusedInspectorObject();
        var triggerRefreshOnFailure = false;

        if (nodeObj != null) {
            secElement = nodeObj;
        }

        var sFlowAction = secElement.get("flowAction");
        var sPageRef = "";

        //Find the parent section and get the insKey
        var oParent = pega.ui.inspector.parser.getNearestParent(secElement, [{'type': 'Section'}]);

        //Get insKey
        var sInsKey = oParent.get("insKey");

        //Drop out if the insKey is empty or null because you are in a gadget section
        if (sInsKey == null || sInsKey == "") {
            alert("Not yet implemented");
            return false;
        }

        //Show the busy throbber, turn off highlighting, and clear highlighting before calling server
        pega.ui.inspector.getDesktopWindowInspectorProxy().loadingIndicator.show();

        TreeProxy.disableHighlighting();
        TreeProxy.hideAllOverlays();
        TreeProxy.clearAllHighlights();

        //Build up the call to the server
        var actionURL = new SafeURL("pzProcessAction_RunTimeEditing");
        actionURL.put("readOnly", "false");

        actionURL.put("modelessDialog", "true");
        actionURL.put("IgnoreSectionSubmit", true);
        actionURL.put("NewTaskStatus", sFlowAction);
        actionURL.put("bExcludeLegacyJS", "true");
        actionURL.put("ModalSection", "pyModalTemplateRunTimeEdit");
        actionURL.put("modalWindowSize", "400,650");
        actionURL.put("KeepMessages", true);

        // If configure branch boolean is not passed in as a param then default
        // it to false so the activity gets the correct value
      	if (configureRuntimeBranch == true) {
            actionURL.put("configureRuntimeBranch", configureRuntimeBranch);
        }

        //Params used only by edit at runtime
        actionURL.put("bEditAtRunTime", true);
        actionURL.put("sEditRunTimeInsKey", sInsKey);

        //Call our own version of process action that then calls the original
        actionURL.put("pyActivity", "@baseclass.pzProcessAction_RunTimeEditing");

        //Add additions params needed
        for (var x = 0; x < params.length; x++) {
            actionURL.put(params[x].param, params[x].value);

            if (params[x].param == "moveElement" && params[x].value == true) {
                triggerRefreshOnFailure = true;
            } else if (params[x].param == "addElement" && params[x].value == true) {
                if (addControlPosition == "before" || addControlPosition == "after") {
                    var TempParentLayout = pega.ui.inspector.parser.getNearestParent(secElement, [{'type' : 'Layout'}]);
                    sPageRef = TempParentLayout.get("pgRef");
                } else {
                    sPageRef = secElement.get("pgRef");
                }

                // Add relative path to action url
                actionURL.put("newPath", sPageRef);
            } else if (params[x].param == "removeElement" && params[x].value == true) {
                if (secElement.get('type') == "Cell" || secElement.get('subType') == "CELL") {
                    sPageRef = secElement.get("pgRef");
                } else { // BUG-216836: Case for layouts
                    var pyCell = ".pyCells(";
                    var tempPage = secElement.get("pgRef");
                    var firstHalf = tempPage.substring(0, tempPage.lastIndexOf(pyCell) + pyCell.length);
                    tempPage = tempPage.slice(tempPage.lastIndexOf(pyCell) + pyCell.length, tempPage.length);
                    var secondHalf = tempPage.substring(0, tempPage.indexOf(")") + 1);
                    sPageRef = firstHalf + secondHalf;
                }
            }
        }

        //Add base base refrence param, type of action determines this value (delete/add vs move)
        actionURL.put("BaseReference", "pyTemp_PropPanelPage" + sPageRef);

        if (pega && !pega.offline) {
           pega.u.d.asyncRequest("POST", actionURL, {
              success: function(o) {
                  if (o.responseText.indexOf("SUCCESS") == 0) {
                      TreeProxy.clearAllHighlights(true);

                      if (params[0].param == "addElement") {
                          // Check if adding a dynamic layout for the reselect path
                          var isLayout = (params[1].value == "DynamicLayout");
                          _setMovedToLocation(o.responseText, isLayout);
                      } else if (params[0].param == "moveElement") {
                          // Check if the element you are moving is a layout
                          var isLayout = (secElement.get("type") && secElement.get("type") == "Layout");
                          _setMovedToLocation(o.responseText, isLayout);
                      } else if (params[0].param == "removeElement") {
                          TreeProxy.getPreviousElementClipboardPath().path = null;
                      }

                      // Call reloadSectionInDom which will handle enableHighlighting
                      var listOfSections = [oParent.get("ruleName")];
                      TreeProxy.rulemanagement.reloadSectionInDom(listOfSections, true);
                  } else if (triggerRefreshOnFailure) {
                      pega.ui.inspector.panel.refreshTree();
                  }

                  if (o.responseText.indexOf("SUCCESS") == -1) {
                      if (o.responseText == "Unconfigured") {
                          //Setting parameters of function to be re-used in pega.ui.inspector.editing.makeRuntimeBranch()
                          _cachedParam = params;
                          _cachedNodeObj = nodeObj;

                          pega.ui.inspector.makeBranch.show();
                      } else {
                          pega.ui.inspector.errorModal.show(o.responseText);
                      }
                  }

                  pega.ui.inspector.getDesktopWindowInspectorProxy().loadingIndicator.hide();
              },
              failure: function(o) {
                  // Remove readonly class from tree
                  $(".runtime-control-tree").removeClass("ui-tree-readonly");

                  TreeProxy.enableHighlighting();
                  pega.ui.inspector.getDesktopWindowInspectorProxy().loadingIndicator.hide();
              }
          });
        }
    }

    /** Takes in the success message from the server and parses out the new path of the element
     *  @param response Full response from the server
     *  @param isLayout Flag for when the current element is a layout and if so add layout page
     **/
    function _setMovedToLocation(response, isLayout) {
        var appendStr = "";
        var search = "SUCCESS:";
        if (isLayout)
            appendStr += ".pySections(1)";

        // Remove SUCCESS and set new path
        var newPath = response.substring(search.length);
        TreeProxy.getPreviousElementClipboardPath().path = newPath + appendStr;
    }

    /** Binds temporary events for moving of elements in the live ui tree
     **/
    function _bindTempNodeMovingEvents() {

        // Temp mouse move handler for dragging
        function _handleMouseMove(e) {
            //Clear drop location indicator
            publicMethodAPI.clearDropLocation();

            // Get mouse location from tree proxy
            var mouseX = TreeProxy.getMouseX();
            var mouseY = TreeProxy.getMouseY();

            //Make sure that drag indicator does not go out of tree
            if ($("#vakata-dnd").length > 0) {
                var supressEvent = false;
                var UITreeOffset = $(".runtime-control-tree").offset();

                // CHECK: If off tree to left
                if (mouseX < UITreeOffset.left) {
                    $("#vakata-dnd").css("left", UITreeOffset.left + "px");
                    supressEvent = true;
                }

                // CHECK: If off top of tree
                if (mouseY < UITreeOffset.top) {
                    $("#vakata-dnd").css("top", UITreeOffset.top + "px");
                    supressEvent = true;
                }

                // If not on tree stop propagation
                if (supressEvent)
                    TreeProxy.handleSupression(e);
            }
        }

        // Temp mouse up handler for dragging
        function _handleMouseUp(e) {
            //Clear drop location indicator
            publicMethodAPI.clearDropLocation();

            // Only enable highlighting if the node was dropped in an
            // invalid location
            if ($("#jstree-dnd .jstree-icon.jstree-ok").length <= 0) {
                // Re-enable highlighting
                TreeProxy.enableHighlighting(false);

              	// BUG-204844
                // TreeProxy.enableHighlighting(false); unhighlights previously hovered tree
                // Making sure the tree node is hovered and highlighted as well
                var previouslyHovered = pega.ui.inspector.getHoveredInspectorObject();
              	pega.ui.inspector.panel.getJsTreeRef().hover_node(previouslyHovered.id);
            }

            // Reset mask and UI
            $(".ui-tree-mask").remove();
            $(".runtime-origelm-indicator .runtime-moving-mask").remove();
            $(_originalDropElement).removeClass("runtime-origelm-indicator");
            _draggingElem = false;
            _dragElem = null;
            _dropElem = null;

            _originalDropElement = null;

            // Remove temp events
            window.removeEventListener("mouseup", _handleMouseUp, true);
            window.removeEventListener("mousemove", _handleMouseMove, true);
        }

        // Add temp events
        window.addEventListener("mouseup", _handleMouseUp, true);
        window.addEventListener("mousemove", _handleMouseMove, true);
    }

    /** Takes in a clipboard path and returns a formatted sub-string
     *  @param path Clipboard path to be formatted
     **/
    function _formatClipboardPath(path) {
        var search = ".pyCells(";
        var searchLastIndex = path.lastIndexOf(search);
        return path.substring(0, searchLastIndex);
    }

    /** Take in a page reference and returns the index of the element, or -1 if none is found
     *  @param nodePageRef Clipboard page of the node
     **/
    function _getIndexOfElementInParent(nodePageRef) {
        var cells = ".pyCells(";
        var cellsLastIndex = nodePageRef.lastIndexOf(cells);

        // Extract the number X from the last occurence of ".pyCells(X)" for drop node
        if (cellsLastIndex != -1) {
            var temp = nodePageRef.substring(cellsLastIndex + cells.length);
            var firstParen = temp.indexOf(")");

            return temp.substring(0, firstParen);
        }

        return -1;
    }

    /////////////////////////////////////////////////////////////////////////////////
    //                              PUBLIC API                                     //
    /////////////////////////////////////////////////////////////////////////////////
    var publicMethodAPI = {};

    /** Adds the passed in control to the selected layout
     *  @param control The control to be added
     **/
    publicMethodAPI.addElementToLayout = function(control) {
        var finalPosition = -1; // add to the top of the DL by default

        if (addControlPosition == "before" || addControlPosition == "after") {
            var selectedElement = pega.ui.inspector.getFocusedInspectorObject();
            var selectedIndex = parseInt(_getIndexOfElementInParent(selectedElement.get("pgRef")));

            if (addControlPosition == "before") {
                finalPosition = selectedIndex;
            } else if (addControlPosition == "after") {
                finalPosition = selectedIndex + 1;
            }
        }

        var params = new Array();
        params.push({
            param: "addElement",
            value: true
        });
        params.push({
            param: "newControl",
            value: control
        });
        params.push({
            param: "newIndex",
            value: finalPosition
        });
        return _callProcessAction_runtime(params);
    }
    /** Moves an element in a layout
     *  @param oldPath
     *  @param newPath
     *  @param oldSection
     *  @param newSection
     *  @param oldIndex
     *  @param newIndex
     *  @param nodeObj
     **/
    publicMethodAPI.moveElementInLayout = function(oldPath, newPath, oldSection, newSection, oldIndex, newIndex, nodeObj) {
            var params = new Array();
            params.push({
                param: "moveElement",
                value: true
            });
            params.push({
                param: "oldPath",
                value: oldPath
            });
            params.push({
                param: "newPath",
                value: newPath
            });
            params.push({
                param: "oldSection",
                value: oldSection
            });
            params.push({
                param: "newSection",
                value: newSection
            });
            params.push({
                param: "oldIndex",
                value: oldIndex
            });
            params.push({
                param: "newIndex",
                value: newIndex
            });
            return _callProcessAction_runtime(params, nodeObj);
        }
    /** Removes the selected element from the layout
     **/
    publicMethodAPI.removeElementInLayout = function() {
            var params = new Array();
            params.push({
                param: "removeElement",
                value: true
            });
            return _callProcessAction_runtime(params);
        }
    /** Move the given node to its drop location in the DOM
     *  @param position b or a for before or after
     *  @param origCID CID of the element you are moving
     *  @param dropOnCID CID of the element you are dropping onto
     **/
    publicMethodAPI.showDropLocation = function(position, origCID, dropOnCID) {
            //Get a reference to the element dropping onto
            var dropOnElm = pega.ui.inspector.panel.getInspectorObjectByID(dropOnCID).get("element");

            if (_originalDropElement == null) {
                //Get original element
                var origElm = pega.ui.inspector.panel.getInspectorObjectByID(origCID).get("element");
                _originalDropElement = origElm[0];
                if (!$(_originalDropElement).hasClass("runtime-origelm-indicator"))
                    $(_originalDropElement).addClass("runtime-origelm-indicator");
            }

            if (_tempDropIndicator == null) {
                // If dragging a nested layout get the cell element you are in
                if (!$(_originalDropElement).hasClass("content-item")) {
                    _originalDropElement = $(_originalDropElement).closest(".content-item")[0];
                }

                _tempDropIndicator = _originalDropElement.cloneNode(true);
                $(_tempDropIndicator).prepend("<div class='runtime-moving-mask'></div>");
                $(_tempDropIndicator).addClass("runtime-drop-indicator");
                $(_tempDropIndicator).removeClass("runtime-origelm-indicator");
            }

            //Hide original
            _originalDropElement.style.display = "none";
            //Move indicator to correct location
            if (position == "b") {
                $(_tempDropIndicator).insertBefore(dropOnElm);
            } else if (position == "a") {
                $(_tempDropIndicator).insertAfter(dropOnElm);
            } else if (position == "i") {
                if (!dropOnElm.hasClass("content")) {
                    dropOnElm = dropOnElm[0].querySelector("div.layout-body div.content");
                }

                if (dropOnElm != null) {
                    $(dropOnElm).append(_tempDropIndicator);
                }
            }
        }
    /** Clears the drop location indicator for the UI
     **/
    publicMethodAPI.clearDropLocation = function() {
            if (_originalDropElement)
                _originalDropElement.style.display = "";

            if (_tempDropIndicator)
                $(_tempDropIndicator).remove();

            _tempDropIndicator = null;
        }
    /** jsTree check_callback event callback function
     *  @param operation Name of the operation
     *  @param node Node that operation is in context to
     *  @param node_parent - parent of the node
     *  @param node_position - jsTree postion of the node
     *  @param more - all additional information
     *  @return boolean - if the operation is valid
     **/
    publicMethodAPI.checkOperationCallback = function(operation, node, node_parent, node_position, more) {
            if (operation == 'move_node') {
                // When dropping, more.ref is undefined
                if (typeof more.ref === 'undefined') {
                    return true;
                }

                //used to check if an element is being dragged into an element rather than before or after
                lastKnownMoveLocation = more.pos;

                // If tree is read only then always return false
                if ($(".runtime-control-tree").hasClass("ui-tree-readonly")) {
                    return false;
                }

                if (!_draggingElem) {
                    // Set tree reference
                    jsTreeRefObj = $.jstree.reference('.runtime-control-tree');

                    // Mark the original element with the correct class
                    var NodeMoving = pega.ui.inspector.panel.getInspectorObjectByID(node.id);

                    // Get a handle on the parent jsTree node and find its type
                    var parentTreeNode = jsTreeRefObj.get_node(node.parent);
                    var parentType = "other";
                    if (parentTreeNode != null) {
                        parentType = parentTreeNode.original.types;
                    }
                    _dragElem = {
                        parentType: parentType,
                        sectionInsKey: pega.ui.inspector.parser.getNearestParent(NodeMoving, [{'type' : 'Section'}]).get("insKey")
                    };

                    if (NodeMoving != null) {
                        _originalDropElement = NodeMoving.get("element")[0];
                        $(_originalDropElement).addClass("runtime-origelm-indicator");
                    }

                    // Purge manipulation events to prevent multiple from stacking
                    TreeProxy.panel.stopListeningForChanges();

                    // If the ignoreSelectFromTree attribute is set then reset it and fall out because this is a second select
                    if (node.ignoreSelectFromTree) {
                        node.ignoreSelectFromTree = false
                    } else {
                        // Select the element you are dragging
                        pega.ui.inspector.focus(NodeMoving);
                    }

                    // Disable/Clear highlighting
                    TreeProxy.disableHighlighting();
                    TreeProxy.clearAllHighlights();

                    // Add mask over UI so events are not lost in iframes
                    $(document.body).append("<div class='ui-tree-mask'></div>");

                    // Bind all moving related events
                    _bindTempNodeMovingEvents();
                }

                _draggingElem = true;

                // If the parent of the element dragging is other fall out
                if (_dragElem.parentType == "other") {
                    return false;
                } else if (node.original.types == 'cell' || node.original.types == 'layout') { // Only allow 'cell' and 'layout' nodes to be dragged
                    //only allow dropping inside nodes of type 'layout'
                    if (typeof node_parent.original === 'undefined') {
                        return false; // Check if top most element
                    } else if (node_parent.original.types == 'layout') { // if destination's parent is a layout
                        if (more.ref.types == 'cell' && more.pos == "i") {
                            // do not allow dropping inside of a non-layout cell
                            return false;
                        }

                        if (_dropElem == null || _dropElem.dynamicLayoutCid != more.ref.parent) {
                            var dropBackboneObj = pega.ui.inspector.panel.getInspectorObjectByID(more.ref.id);

                            if (TreeProxy.isTemplateSection(dropBackboneObj)) {
                                return false;
                            }

                            if (dropBackboneObj != null) {
                                var dropParentSection = pega.ui.inspector.parser.getNearestParent(dropBackboneObj, [{'type' : 'Section'}]);

                                if (dropParentSection != null) {
                                    var insKey = dropParentSection.get("insKey");
                                    _dropElem = {
                                        dynamicLayoutCid: more.ref.parent,
                                        sectionInsKey: insKey
                                    };
                                } else {
                                    _dropElem = null;
                                    return false;
                                }
                            } else {
                                _dropElem = null;
                                return false;
                            }
                        }

                        // only allow dropping inside the same section
                        if (_dragElem.sectionInsKey == _dropElem.sectionInsKey) {
                            publicMethodAPI.showDropLocation(more.pos, node.id, more.ref.id);
                            return true;
                        }
                    }
                }
                return false;
            }
            return true; //allow all other operations
        }
    /** jsTree move_node event callback function
     *  @param e - event object
     *  @param data - jsTree data object
     **/
    publicMethodAPI.moveNodeCallback = function(e, data) {
            var oldPath = "";
            var newPath = "";
            var oldSection = "";
            var newSection = "";
            var oldIndex = "";
            var newIndex = "";

            // Get a reference to the new parent of the node being moved
            var newParentModel = pega.ui.inspector.panel.getInspectorObjectByID(data.parent);

            // Now get the backbone object for the currently dragged node and where you are dropping
            var oldModelObj = pega.ui.inspector.panel.getInspectorObjectByID(data.node.id);
            var dropModelObj;

            // If you are dropping the element at the end of a layout you are not dropping on an element
            // so you need to find the last element and add one to its index to place it in the correct place
            if (newParentModel.children.length == 0) {
                // element dropped inside empty dynamic layout
                dropModelObj = newParentModel;
                newIndex = "1";

                newPath = dropModelObj.get("pgRef") + ".pySectionBody(1).pyTable.pyRows(1)";
            } else {
                //if element is being dragged "into" an element, set location to -1 move activity will add it to end of list instead
                if (lastKnownMoveLocation == "i") {
                    newIndex = -1;
                    dropModelObj = newParentModel;
                    newPath = dropModelObj.get("pgRef") + ".pySectionBody(1).pyTable.pyRows(1)";
                } else {
                    if (newParentModel.children.length - 1 < data.position) {
                        dropModelObj = newParentModel.children[newParentModel.children.length - 1];

                        // Increment clipboard page index up one
                        newIndex = parseInt(_getIndexOfElementInParent(dropModelObj.get("pgRef"))) + 1;
                    } else {
                        dropModelObj = newParentModel.children[data.position];
                        newIndex = _getIndexOfElementInParent(dropModelObj.get("pgRef"));
                    }

                    // Set the new path
                    newPath = _formatClipboardPath(dropModelObj.get("pgRef"));
                }
            }

            // Set oldPath
            oldPath = _formatClipboardPath(oldModelObj.get("pgRef"));
            oldIndex = _getIndexOfElementInParent(oldModelObj.get("pgRef"));

            // Setup old and new sections
            var oParentOld = pega.ui.inspector.parser.getNearestParent(oldModelObj, [{'type' : 'Section'}]);
            var oParentNew = pega.ui.inspector.parser.getNearestParent(dropModelObj, [{'type' : 'Section'}]);

            //Get references to the old and new section
            oldSection = oParentOld.get("insKey");
            newSection = oParentNew.get("insKey");


            // Only move the element if valid indices were found
            if (oldPath != "" && newPath != "") {
                // Add a read-only class to prevent nodes from being moved
                $(".runtime-control-tree").addClass("ui-tree-readonly");

                // Make call to move node
                publicMethodAPI.moveElementInLayout(oldPath, newPath, oldSection, newSection, oldIndex, newIndex, oldModelObj);
            } else {
                console.log("Failed to find index for drag or drop node.");
            }
        }
    /** Updates the position which a control will be added to. Valid options: before, after
     **/
    publicMethodAPI.setAddControlPosition = function(position) {
        addControlPosition = position;
    }

    /** Ajax call to create a new branch on current application
     *  @param $Event$ e - event object
     **/
    publicMethodAPI.makeRuntimeBranch = function(e) {
        if (pega.ui.inspector.getDesktopWindow() != window) {
          	pega.ui.inspector.getDesktopWindow().pega.ui.inspector.editing.makeRuntimeBranch(e);
        } else {
            pega.ui.inspector.getDesktopWindow().pega.ui.inspector.makeBranch.hide();

            if(e && pega.ui.inspector.editing.propertypanel.isOpen()) {
                var actionURL = new SafeURL("Rule-Application.pzMakeRuntimeBranch");
                if (pega && !pega.offline){
                    // Show the loading indicator when adding a new runtime branch
                    pega.ui.inspector.getDesktopWindowInspectorProxy().loadingIndicator.show();

                    pega.u.d.asyncRequest("POST", actionURL, {
                        success: function(o) {
                          	// Before canceling the already open property panel register a close callback
                          	pega.ui.inspector.editing.propertypanel.registerCloseCallback(function() {
                              	pega.ui.inspector.getActiveWindow().pega.ui.inspector.editing.propertypanel.open(e, pega.ui.inspector.getFocusedInspectorObject());
                            })

                            //If this was called from property panel
                            pega.ui.inspector.getActiveWindow().pega.ui.inspector.editing.propertypanel.cancel(e);
                        },
                        failure: function(o) {
                           alert("Cannot add runtime branch!");
                        }
                    });
                }
            } else if(_cachedParam != null) {
                // Re-call _callProcessAction_runtime and pass along the configure branch param
                _callProcessAction_runtime(_cachedParam, _cachedNodeObj, true);
            }

        }
    }
    return publicMethodAPI;
}());
//static-content-hash-trigger-GCC
var $pNamespace = pega.namespace;
$pNamespace("pega.ui.inspector.editing");

// The editor is a singleton class which returns its public methods.
pega.ui.inspector.editing.propertypanel = (function() {
    var publicAPI = {};

    var _isOpen = false;                            // Flag for when the property panel is open
  	var _closePanelCallback = null;					// Callback used for when the property panel is closed

    /**
     * @protected Handles swapping sumbitModalDlgParam if the current one is not our runtime panel
     **/
    function _handleReorderModalParams() {
        var actionParams = pega.u.d.submitModalDlgParam;
        var queredParams = pega.u.d.submitModalDlgParamStack[0];

        // If the first quered set of submitModalParams is the correct
        if (actionParams.modalSection != "pyModalTemplateRunTimeEdit" && queredParams.modalSection == "pyModalTemplateRunTimeEdit") {
            var origParams = jQuery.extend({}, pega.u.d.submitModalDlgParam);
            jQuery.extend(pega.u.d.submitModalDlgParam, pega.u.d.submitModalDlgParamStack[0]);
            jQuery.extend(pega.u.d.submitModalDlgParamStack[0], origParams);
        }
    }

    /////////////////////////////////////////////////////////////////////////////////
    //                                  PUBLIC API                                 //
    /////////////////////////////////////////////////////////////////////////////////
    /**
     * @public Handles opening the runtime property panel for editing
     *
     * @param $Event$ eventObj - Browser event object from click event
     * @param $Boolean$ secondary - Flag that denotes if the open should be done for secondary element
     **/
    publicAPI.open = function(eventObj, secondary) {
        if (this.isOpen()) {
            return false;
        }

        // BUG-172362: added to disable UI tree buttons when property panel opens
        pega.ui.inspector.panel.disablePanel();

        //Set window and component depending on if it was launched from a selected item or highlighted
        var PropertyPanelWindow;
        var PropertyPanelCmp;
        if (secondary) {
            PropertyPanelCmp = pega.ui.inspector.getFocusedInspectorObject();
        } else {
            PropertyPanelCmp = pega.ui.inspector.getHoveredInspectorObject();
        }
		PropertyPanelWindow = PropertyPanelCmp.ownerWindow;

        var sPageRef = PropertyPanelCmp.get("pgRef");
        var eCurrentElement = PropertyPanelCmp.get("element");
        var sFlowAction = PropertyPanelCmp.get("flowAction");
        var oParent = pega.ui.inspector.getDesktopWindowInspectorProxy().parser.getNearestParent(PropertyPanelCmp, [{'type' : 'Section'}]);

        //Get insKey
        var sInsKey = oParent.get("insKey");

        //Drop out if the insKey is empty or null because you are in a gadget section
        if (sInsKey == null || sInsKey == "") {
            alert("Not yet implemented");
            return false;
        }

        //Disable highlighting
        pega.ui.inspector.getDesktopWindowInspectorProxy().disableHighlighting();
        pega.ui.inspector.getDesktopWindowInspectorProxy().clearAllHighlights();

        var actionURL = new SafeURL();
        actionURL.put("readOnly", "false");
        actionURL.put("BaseReference", "pyTemp_PropPanelPage" + sPageRef);
        actionURL.put("modelessDialog", "true");
        actionURL.put("IgnoreSectionSubmit", true);
        actionURL.put("NewTaskStatus", sFlowAction);
        actionURL.put("bExcludeLegacyJS", "true");
        actionURL.put("ModalSection", "pyModalTemplateRunTimeEdit");
        actionURL.put("modalWindowSize", "400,650");
        actionURL.put("KeepMessages", true);

        //Params used only by edit at runtime
        actionURL.put("bEditAtRunTime", true);
        actionURL.put("sEditRunTimeInsKey", sInsKey);

        //Call our own version of process action that then calls the original
        actionURL.put("pyActivity", "@baseclass.pzProcessAction_RunTimeEditing");

        var newEventObj = {
            "target": pega.util.Event.getTarget(eventObj)
        };
        //var reloadElement = oParent.get("element").parent()[0];

        //Flag for when the property panel has been opened
        _isOpen = true;

        $(".runtime-control-tree").addClass("ui-tree-readonly");

        var tempList = pega.ui.inspector.getDesktopWindowInspectorProxy().getFrameList();
        for (var x = 0; x < tempList.length; x++) {
            if ($(tempList[x].document).length > 0) {
                if ($(tempList[x].document.head).children("#runtime-panel-exp-style").length == 0) {
                    $(tempList[x].document.head).append("<style id='runtime-panel-exp-style' type='text/css'> #expression-builder .iconOpenRule { display: none; } </style>");
                }
            }
        }
        PropertyPanelWindow.pega.ui.inspector.toggleCursor(false);

        //Remove DOM events to prevent extra refresh on open of property panel
        if (pega.ui.inspector.getDesktopWindowInspectorProxy().panel.getListenForChanges()) {
            pega.ui.inspector.getDesktopWindowInspectorProxy().panel.stopListeningForChanges();
        }

        //If there are any open overlays then set the z-index less than that of the modal
        PropertyPanelWindow.pega.ui.inspector.editing.propertypanel.setOpenOverlayIndex(8);

        // Successful submit callback of the runtime modal
        var callback = {};

      	callback.submit = function() {
            /*Set flags for changes*/
            pega.ui.inspector.getDesktopWindowInspectorProxy().panel.setListenForChanges(true);
			pega.ui.inspector.getDesktopWindowInspectorProxy().panel.setTreeNeedsToRefresh(true);

            pega.ui.inspector.getDesktopWindowInspectorProxy().clearAllHighlights(true);
            // Handle reload of section our self so that we can pass in a callback
            if (eCurrentElement[0].parentNode) {
                // BUG-571526: set the harness context to be the harness of the section to be refreshed.
                var harnessID = $(eCurrentElement[0]).closest("[data-harness-id]").attr("data-harness-id");                                
                PropertyPanelWindow.pega.ctxmgr.setCurrentHarnessContext(harnessID);
              
                PropertyPanelWindow.pega.u.d.reloadSection(eCurrentElement[0], "", "", false, false, -1, false, null, null, null, function() { PropertyPanelWindow.pega.ui.inspector.editing.propertypanel.handleClose() });
            } else {
                // If the reloadElement does not have a parent it cannot be reloaded so just call the
                PropertyPanelWindow.pega.ui.inspector.editing.propertypanel.handleClose();
            }

            pega.ui.inspector.getDesktopWindowInspectorProxy().loadingIndicator.hide();
        };

        callback.cancel = function() {
            PropertyPanelWindow.pega.ui.inspector.editing.propertypanel.handleClose();
        };

        //Open property panel
        PropertyPanelWindow.pega.u.d.processActionModal(actionURL, null, newEventObj, "", callback);
    }

    /**
     * @public Called on submit of the runtime property panel
     *
     * @param $Event$ event - Browser event from button click
     */
    publicAPI.submit = function(event) {
        // Reorder params if needed
        _handleReorderModalParams();

        // Call original doLocalAction js to submit panel
        var actionName = pega.u.d.submitModalDlgParam.taskStatus;
        pega.u.d.performFlowAction(actionName, event);
    }

    /**
     * @public Called on cancel of the runtime property panel
     *
     * @param $Event$ event - Browser event from button click
     */
    publicAPI.cancel = function(event) {
        // Reorder params if needed
        _handleReorderModalParams();

        // Get tempAction name if possable
        var tempActionName = "";
        if (pega.u.d.submitModalDlgParam && pega.u.d.submitModalDlgParam.taskStatus != "") {
            tempActionName = pega.u.d.submitModalDlgParam.taskStatus;
        }

        // Call original doLocalAction js to submit panel
        pega.u.d.performFlowAction('', event, "", tempActionName);

        // Manually call close since canceling
        // this.handleClose(); commented out due to BUG-195680 fix where this function is called from cancel callback.
    }

    /**
     * @public Called after runtime property panel closes. This is not to be called directly
     **/
    publicAPI.handleClose = function() {
        window.pega.ui.inspector.toggleCursor(true);

        //If there are any open overlays then set the z-index back
        this.setOpenOverlayIndex(100);

        if ((pega.ui.inspector.getDesktopWindowInspectorProxy().getDesktopWindow() != window) && pega.ui.inspector.getDesktopWindowInspectorProxy().editing.propertypanel != null) {
            pega.ui.inspector.getDesktopWindowInspectorProxy().editing.propertypanel.handleClose();
        } else {
            $(".runtime-control-tree").removeClass("ui-tree-readonly");

            // BUG-226145: only enable panel if it does not have the interaction-enabled class
            if($(".interaction-enabled").length <= 0) {
              // BUG-172362: re-enable UI tree buttons when property panel closes
              pega.ui.inspector.panel.enablePanel();
            }

            // Default flag back to false for property panel
            _isOpen = false;

            pega.ui.inspector.getDesktopWindowInspectorProxy().enableHighlighting();

          	// If there is a callback function that is registered then call it
          	if (_closePanelCallback) {
              	_closePanelCallback();
              	_closePanelCallback = null;
            }
        }

        // BUG-196101 Remove the runtime-property-panel class from any overlay elements
        $('.modal-overlay .runtime-property-panel').removeClass("runtime-property-panel");
    }

    /**
     * @public If there is an open overlay set its zindex
     *
     * @param $Integer$ index - the z-index to set to
     **/
    publicAPI.setOpenOverlayIndex = function(index) {
        var OverlayElement = $("#_popOversContainer > div");
        // If there is an overlay in the DOM and it is visible
        if (OverlayElement != null &&
            OverlayElement.css("visibility") == "visible") {

            // Set the index
            OverlayElement.css({
                'z-index': index
            });
        }
    }

    /**
     * @public Called to regester a generic internal callback for when the property panel is actually closed after async calls
     *
     * @param $Function$ callback - Callback function to register for when the property panel is closed
     **/
    publicAPI.registerCloseCallback = function(callback) {
      	if ((pega.ui.inspector.getDesktopWindowInspectorProxy().getDesktopWindow() != window) && pega.ui.inspector.getDesktopWindowInspectorProxy().editing.propertypanel != null) {
            pega.ui.inspector.getDesktopWindowInspectorProxy().editing.propertypanel.registerCloseCallback(callback);
        } else {
          	_closePanelCallback = callback;
        }
    }

    /** @public Used to determain if the runtime editing property panel is open
     *
     * @return $Boolean$ isOpen - Flag for when the property panel is open or not
     **/
    publicAPI.isOpen = function() {
        if ((pega.ui.inspector.getDesktopWindowInspectorProxy().getDesktopWindow() != window) && pega.ui.inspector.getDesktopWindowInspectorProxy().editing.propertypanel != null) {
            return pega.ui.inspector.getDesktopWindowInspectorProxy().editing.propertypanel.isOpen();
        } else {
            return _isOpen;
        }
    }

    return publicAPI;
}());
//static-content-hash-trigger-GCC
var $pNamespace = pega.namespace;
$pNamespace("pega.ui.inspector");

pega.ui.inspector.QuickInfo = function(myContainerElem) {

    // Constructor
    var _self = this;
  
    //constant
    var IS_DECLARATIVE_TEXT = "is calculated declaratively";

    var _superClass = new pega.ui.inspector.Overlay.DismissOnMouseOut("inspector-overlay quickinfo", myContainerElem, null, {dataTestId : "quick-info"});
    $.extend(this, _superClass);

    /** Builds up HTMl for inside of info panel depending on the element model
     * @param metaData - Object containing all the ui meta data for the given element
     **/
     //TODO: We should clean this up to not build a string, but to rather build up HTML elements and pass that along as the content
    function _getInfoPanelHTML(metaData) {
        var returnString = "";
        //TYPE
        if (metaData.type && metaData.type != "") {
            returnString += "<div><span class='RuntimeInspectorLabel'>Element Type - </span><span class='RuntimeInspectorValue' id='RuntimeInfoPanelType'>" + metaData.type + "</span></div>";
        } else {
            returnString += "<div><span class='RuntimeInspectorLabel'>UI element not supported </span class='RuntimeInspectorValue' id='RuntimeInfoPanelType'></div>";
            return returnString;
        }
        //SUBTYPE
        if (metaData.subTypeDisplay && metaData.subTypeDisplay != "") {
            /* CELL */
            if (metaData.type == "Cell") {
                returnString += "<div><span class='RuntimeInspectorLabel'>Control - </span><span class='RuntimeInspectorValue' id='RuntimeInfoPanelSubType'>" + metaData.subTypeDisplay + "</span></div>";
            } /* SECTION IN A CELL */
            else if (metaData.type == "Section (Cell)") {
                returnString += "<div><span class='RuntimeInspectorLabel'>Section Include - </span><span class='RuntimeInspectorValue' id='RuntimeInfoPanelSubType'>" + decodeURIComponent(metaData.clipboardPath) + "</span></div>";
            } /* LAYOUT */
            else if (metaData.type == "Layout") {
                returnString += "<div><span class='RuntimeInspectorLabel'>Layout Type - </span><span class='RuntimeInspectorValue' id='RuntimeInfoPanelSubType'>" + metaData.subTypeDisplay + "</span></div>";
            }
        }

        //RULENAME
        if (metaData.ruleName && metaData.ruleName != "") {
            /* SECTION */
            if (metaData.type == "Section") {
                returnString += "<div><span class='RuntimeInspectorLabel'>Section - </span>";
            } /* FLOW ACTION */
            else if (metaData.type == "FlowAction") {
                returnString += "<div><span class='RuntimeInspectorLabel'>Flow Action - </span>";
            } /* HARNESS */
            else if (metaData.type == "Harness") {
                returnString += "<div><span class='RuntimeInspectorLabel'>Harness - </span>";
            }

            returnString += "<span id='RuntimeInfoPanelRuleName' class='RuntimeInspectorValue RuntimeInspectorLabelOpenRule' onclick='pega.ui.inspector.openElementRuleForInsKey(\"" + metaData.insKey + "\")'>" + metaData.ruleName + "</span></div>";
        }

        //PROPERTY NAME
        else if (metaData.clipboardPath && metaData.clipboardPath != "" && metaData.type == "Cell") {
            var objClass = "";
            /* PARAGRAPH */
            if (metaData.subTypeDisplay && metaData.subTypeDisplay == "Paragraph") {
                objClass = "Rule-HTML-Paragraph";
                returnString += "<div><span class='RuntimeInspectorLabel propertyName'>Paragraph - </span>";
            } else { /* CELL */
                objClass = "Rule-Obj-Property";
                returnString += "<div class='RuntimeInfoPanelTruncateText'><span class='RuntimeInspectorLabel propertyName'>Property - </span>";
            }

            var tempPropName = _stripClipboardPath(metaData.clipboardPath);
            returnString += "<span id='RuntimeInfoPanelClipboardPath' title='Open " + decodeURIComponent(metaData.clipboardPath) + "' class='RuntimeInspectorValue RuntimeInspectorLabelOpenRule' onclick='pega.ui.inspector.openElementRule(\"" + metaData.className + "\", \"" + tempPropName + "\", \"" + objClass + "\")'>" + decodeURIComponent(metaData.clipboardPath) + "</span></div>";

            if (metaData.declarative == "true") {
                returnString += "<div><span id='RuntimeInfoPanelDeclarative' style='padding-left:1em;' class='RuntimeInspectorLabelOpenRule RuntimeInspectorValue RuntimeInspectorInfoPanelDeclarative' onclick='pega.ui.inspector.launchDeclarativeNetwork(\"" + metaData.className + "\",\"" + tempPropName + "\",\"" + metaData.topPage + "\",\"" + metaData.topPageClass + "\",\"" + "" + "\")'>" + IS_DECLARATIVE_TEXT + "</span></div>";
            }
        }

        //CONTAINING RULE
        var currentElem = metaData.element[0].parentElement;
        var parentElem = $(currentElem).closest("*[data-ui-meta]")[0];
        if (parentElem != "" && parentElem) {
            var parentMetaData = eval("(" + $(parentElem).attr("data-ui-meta") + ")");
            while (!(parentMetaData.type == "Section" || parentMetaData.type == "Harness" || parentMetaData.type == "FlowAction")) {
                parentElem = $(parentElem.parentElement).closest("*[data-ui-meta]")[0];
                parentMetaData = eval("(" + $(parentElem).attr("data-ui-meta") + ")");
            }
            if (parentMetaData.type == "FlowAction")
                var inElement = "Flow Action";
            else
                var inElement = parentMetaData.type;

            returnString += "<div><span class='RuntimeInspectorLabel'> In " + inElement + " - <span><span id='RuntimeInfoPanelContainingRule' class='RuntimeInspectorLabelOpenRule RuntimeInspectorValue' onclick='pega.ui.inspector.openElementRuleForInsKey(\"" + parentMetaData.insKey + "\")'>" + parentMetaData.ruleName + "</span></div>";
        }

        //TEST ID BUG-201821 Adding check if metaData
        if (metaData.testID && metaData.testID != "" && metaData.type == "Cell") {
            returnString += "<div class='RuntimeInfoPanelTruncateText'><span class='RuntimeInspectorLabel'> Test ID - <span><span id='RuntimeInfoPanelTestID' class='RuntimeInspectorValue'>" + metaData.testID + "</span>";
        }

        return returnString;
    }

    /** _stripClipboardPath - Clear off the clipboard path for the property name
     * @param path - Clipboard path to be cleaned
     */
    function _stripClipboardPath(path) {
        var tempPropName = decodeURIComponent(path);
        tempPropName = tempPropName.split(".");
        tempPropName = tempPropName[tempPropName.length - 1].split("(");

        return tempPropName[0];
    }

    this.showByEvent = function(e, inspObject) {
        _self.setContent(_getInfoPanelHTML(inspObject.getAllAttributes()))

        // Show element, this will cause lazy load callback function to be called to create elements
        _superClass.showByEvent(e);

    };

    this.showByPosition = function(x, y, inspObject) {
        console.log("showByEvent(e, inspObject) should be used for showing the quickinfo");
    };
};
var $pNamespace = pega.namespace;
$pNamespace("pega.ui.inspector");

/* Specialized overlay that shows information about an element.
 * @param $String$ className - class name to add to the overlay for further styling
 * @param $HTML Element$ containerElem - element to place overlay in dom (places in document.body if not specified)
 * @param $HTML Element/ Function/ String$ content - pass in html element or string function (function must return html element or string) that will be the content of the overlay
 * @param $Object$ options - See pega.ui.inspector.Overlay Java docs for description
                   options.fadeDuration - the time to animate the fade to, fadeDuration is 0 by default
                   options.showArrow - display an arrow on the overlay to point to where this overlay was launched from, arrow is off by default
                   options.offset - the amount to offset the info bar by (used so it doesn't cover highlighting)
                   options.confinementElement - the element to restrict the overlay's apparence by, set to window by default
                   options.events - events to listen for and handle, ex: {"click": clickHandlerFunction}
                   options.fullWidth - flag for when to set the width of the info bar to the width of the element its for
                   options.autoPositionY - flag for when to not allow the info bar to flip to the bottom of the element when off screen
 */
pega.ui.inspector.InfoBar = function(className, containerElem, content, options) {
  	/////////////////////////////////////////////////////////////////////////////////
    //                              CONSTUCTOR START                               //
    /////////////////////////////////////////////////////////////////////////////////
    var _self = this;
    /* Set default options if the option was not specified. Does not override options passed in */
    if (options == null) options = {};
    if (options.fadeDuration == null) options.fadeDuration = 0;
    if (options.showArrow == null) options.showArrow = false;
    if (options.offset == null) options.offset = 0;
    if (options.confinementElement == null) options.confinementElement = window;
    if (options.fullWidth == null) options.fullWidth = false;
    if (options.autoPositionY == null) options.autoPositionY = true;
  
    // Add base class to the overlay
    className += " info-bar";

    // Extend the superClass into this to for inheritence
    var _superClass = new pega.ui.inspector.Overlay(className, containerElem, content, options);
    $.extend(this, _superClass);

    // Loops over all key/values stored in events and adds listeners for them to the new element
    for (var key in options.events) {
        _self.overlayElem.addEventListener(key, options.events[key]);
    }
	
  	/////////////////////////////////////////////////////////////////////////////////
    //                              PUBLIC FUNCTIONS                               //
    /////////////////////////////////////////////////////////////////////////////////
    _self.showByPosition = function(xLoc, yLoc, width, height) {
        _superClass.show();

        var topHighlight = yLoc; //Store off top left corner of element
		yLoc = yLoc - _self.overlayElem.offsetHeight + options.offset; //Set new top left to top left of element and id panel
      
        //If the ID panel would appear below the window due to highlight location, simply place it at bottom the element
        if (options.autoPositionY && yLoc <= 0) {
            //If the id panel does not fit below place inside of top left corener
            var bottomElmAndPanel = height + topHighlight - options.offset + _self.overlayElem.offsetHeight;
            if (bottomElmAndPanel > $(window).height()) {
                // BUG-347532, from above logic we know element does show on screen and yLoc is currently set to either 0 or negative. 
                // We don't want to set the infobar to a negative location as it will show off screen. Seems safe to hard code it to 0 
                // in this scenario.
                //yLoc = topHighlight;
                yLoc = 0;
            } else {
                //Place ID Panel at bottom left of element
                yLoc = height + topHighlight;
            }
        }

        //set the width if the fullwidth option has been set
        if(options.fullWidth){
         	_self.overlayElem.style.width = width + "px";
        } else if ((xLoc + $(_self.overlayElem).outerWidth()) > ($(options.confinementElement).outerWidth() + $(document).scrollLeft())) {
          	//Check if right side is off screen and adjust xLoc
        	// If off screen calculate new xLoc subtracting width of id panel portion off screen
            xLoc = xLoc - $(_self.overlayElem).outerWidth() + width;
        }

        // Move element to the correct location
        _self.overlayElem.style.left = xLoc + "px";
        _self.overlayElem.style.top = yLoc + "px";
    }
};
var $pNamespace = pega.namespace;
$pNamespace("pega.ui.inspector");

// The editor is a singleton class which returns its public methods.
pega.ui.inspector.rulemanagement = (function() {
    var TREE = pega.ui.inspector;
    var _singleRuleName = null;
    var _singleClassName = null;
    var _sectionReloadTimeout; // Timeout ID for reloadSection callback function so it only fires once

    /*@private*
    * Sets the rule name for use later by single publish or single
    * discard.
    *
    * @param $String$ ruleName The name of the rule to be published or
    *  discarded individually.
    */
    function _setSingleRuleName(ruleName) {
        _singleRuleName = ruleName;
    }

    /*@private*
    * Sets the class name for use later by single publish or single
    * discard.
    *
    * @param $String$ className The name of the class for the rule to
    *  be published or discarded individually.
    */
    function _setSingleClassName(className) {
        _singleClassName = className;
    }

    /*@private*
     * Makes an asynchronous POST request using the specified SafeURL.
     * If successful, it clears highlighting and reloads the section
     * in the DOM.  Otherwise, it shows an alert on failure.
     *
     * @param $SafeURL$ postURL The URL for the asynchronous POST
     *  request.
     */
    function _postUrlAndClearHighlightHelper(postURL) {
        if (pega && !pega.offline) {
            pega.ui.inspector.clearAllHighlights(true);
            pega.desktop.support.getDesktopWindow().pega.u.d.asyncRequest("POST", postURL, {
                success: function (o) {
                    TREE.setPreviousElementClipboardPath(null);
                    var arrayOfSection = o.responseText.split(":");
                    publicAPI.reloadSectionInDom(arrayOfSection, null, function(){pega.ui.inspector.rehighlight(true)});
                },
               failure: function (o) {alert("Ajax request failed!");}
            });
        }
    }

    /*@private*
     * Makes an asynchronous POST request using the specified SafeURL.
     * If successful, it reloads the section in the DOM.  Otherwise,
     * it shows an alert on failure.
     *
     * @param $SafeURL$ postURL The URL for the asynchronous POST
     *  request.
     */
    function _postUrlHelper(postURL) {
        if (pega && !pega.offline) {
            pega.ui.inspector.clearAllHighlights(true);
            pega.desktop.support.getDesktopWindow().pega.u.d.asyncRequest("POST", postURL, {
                success: function (o) {
                    var arrayOfSection = o.responseText.split(":");
                    publicAPI.reloadSectionInDom(arrayOfSection, null, function(){pega.ui.inspector.rehighlight(true)});
                },
               failure: function (o) {alert("Ajax request failed!");}
            });
        }
    }

    ///////////////////////////////////////////////////////////////////
    //                           PUBLIC API                          //
    ///////////////////////////////////////////////////////////////////
    var publicAPI = { };

    /*@public*
     * To be called every time the publish comment text input has been
     * changed.
     *
     * @param $String$ memo The comment typed in the text input by the
     *  user.
     */
    publicAPI.publishMemoUpdated = function(memo) {
        if (memo == "") {
            $(".runtime-publish-button button").attr('disabled','disabled');
        } else {
            $(".runtime-publish-button button").removeAttr('disabled');
        }
    }

    /*@public*
     * Discards all rules on the pending tab of the UI Tree.
     */
    publicAPI.bulkDiscard = function() {
        //Calls the server to discard sections
        var postURL = new SafeURL("@baseclass.pzDiscardRuntimeRules");

        _postUrlAndClearHighlightHelper(postURL);
    }

    /*@public*
     * Discards an individual rule from the pending tab of the UI Tree.
     */
    publicAPI.singleDiscard = function() {
        //Calls the server to discard a single section
        var postURL = new SafeURL("Data-Rule-Locking.pzDiscardRuntimeRules_Single");
        postURL.put("ruleName", _singleRuleName);
        postURL.put("className", _singleClassName);

        _postUrlAndClearHighlightHelper(postURL);
    }

    /*@public*
     * Publishes all the rules from the pending tab of the UI Tree.
     *
     * @param $String$ memo Comment to be added to all the rules being
     *  published.
     */
    publicAPI.bulkPublish = function(memo) {
        //Calls the server to publish sections
        var postURL = new SafeURL("@baseclass.pzPublishRuntimeRules");
        postURL.put("InMemo", memo);

        _postUrlHelper(postURL);
    }

    /*@public*
     * Publishes a single rule from the pending tab of the UI Tree.
     *
     * @param $String$ memo Comment for the single rule being
     *  published.
     */
    publicAPI.singlePublish = function(memo) {
        //Calls the server to publish a single section
        var postURL = new SafeURL("Data-Rule-Locking.pzPublishSingleRuntimeRule");
        postURL.put("InMemo", memo);
        postURL.put("ruleName", _singleRuleName);
        postURL.put("className", _singleClassName);

        _postUrlHelper(postURL);
    }

    /*@public*
     * Save over the last change that was made using runtime editing.
     */
    publicAPI.undoLastEdit = function() {
        //Calls the server to publish sections
        var postURL = new SafeURL("@baseclass.pzRunTime_ControlPanel_Undo");

        _postUrlAndClearHighlightHelper(postURL);
    }

    /*@public*
     * Reload all sections in the DOM that are passed in.
     *
     * @param $array$ listOfSections Array of section names to
     *  reload.
     * @param $boolean$ highlightDisabled True if highlighting is
     *  disabled. Assumes that enable will be called so it sets the
     *  listen for changes flag in the tree.
     * @param $sectionRefreshCallBack$ additional callback function to call after a section has finished refreshing.
     */
    publicAPI.reloadSectionInDom = function(listOfSections, highlightDisabled, sectionRefreshCallback) {
        var somethingRefreshed = false;
        var tempList = TREE.getFrameList();
        var callback;

        // Setup the callback functions based on if highlighting is disabled or not
        if (highlightDisabled) {
            callback = function() {
                clearTimeout(_sectionReloadTimeout);

                _sectionReloadTimeout = setTimeout(function(){
          // Sets the listen for change flag and tree needs to refresh
                    TREE.panel.setListenForChanges(true);
          TREE.panel.setTreeNeedsToRefresh(true);

                    TREE.enableHighlighting();
                    if (sectionRefreshCallback)
                      sectionRefreshCallback();
                }, 100);
            }
        } else {
            callback = function() {
                clearTimeout(_sectionReloadTimeout);

                _sectionReloadTimeout = setTimeout(function(){
                    //Reload publish and history sections in tree
                    pega.ui.inspector.panel.refresh();

                    TREE.panel.startListeningForChanges();
                    if (sectionRefreshCallback)
                      sectionRefreshCallback();
                }, 100);
            }
        }

        //Loop over frames
        for (var x = 0; x < tempList.length; x++){
            try {
                if ($(tempList[x].document).length > 0){
                    //Loop over section names
                    for (var i = 0; i < listOfSections.length; i++) {
                        if (listOfSections[i] != "") {
                            //Try to find the section element in the current frame and reload
                            var sectionNode = pega.u.d.getSectionByName(listOfSections[i], "", tempList[x].document);
                            if (sectionNode != null) {
                                // BUG-571526: set the harness context to be the harness of the section to be refreshed.
                                var harnessID = $(sectionNode).closest("[data-harness-id]").attr("data-harness-id");
                                tempList[x].pega.ctxmgr.setCurrentHarnessContext(harnessID);
                              
                                tempList[x].pega.u.d.reloadSection(sectionNode, "", "", false, false, -1, false, null, null, null, callback);
                                somethingRefreshed = true;
                            }
                        }
                    }
                }
            } catch (e) {
                //catch when trying to enable events on a frame that has been closed/removed
            }
        }

        // If nothing was found to refresh then we need to manually turn highlight back on or refresh control panel
        if (highlightDisabled && !somethingRefreshed) {
            TREE.enableHighlighting();
        } else if (!somethingRefreshed) {
            pega.ui.inspector.panel.refresh();
        }
    }

    /*@public*
     * Sets the rule and class name for use later by single publish or
     * single discard.
     *
     * @param $String$ ruleName The name of the rule to be published or
     *  discarded individually.
     * @param $String$ className The name of the class for the rule to
     *  be published or discarded individually.
     */
    publicAPI.setSingleRuleAndClass = function(ruleName, className) {
        _setSingleRuleName(ruleName);
        _setSingleClassName(className);
    }

    return publicAPI;
}());
//static-content-hash-trigger-GCC
var $pNamespace = pega.namespace;
$pNamespace("pega.ui.inspector");

pega.ui.inspector.ActionMenu = function(myContainerElem) {

    /////////////////////////////////////////////////////////////////////////////////
    //                              CONSTRUCTOR                                    //
    /////////////////////////////////////////////////////////////////////////////////
	var _self = this;

	// Saved off launch event of action menu
	var _event;

	var _superClass = new pega.ui.inspector.Overlay.DismissOnMouseOut("action-menu", myContainerElem, "pzRunTime_ActionsMenu", {dataTestId : "action-menu"});
	$.extend(this, _superClass);

	// Set the correct classes by default on the content object
	_self.overlayContentElem.className = "content runtime-property-panel runtime-actions-menu";
	_self.overlayContentElem.id = "inspectorActionMenu";

    /////////////////////////////////////////////////////////////////////////////////
    //                              PRIVATE FUNCTIONS                              //
    /////////////////////////////////////////////////////////////////////////////////
	/**
	 * @private Adds classes to the actions menu element that determine the
	 * availability of different menu actions.
     *
     * @param $Object$ focusedData - The JSON object with the element data
	 */
	function _actionsMenuAddClasses(focusedData) {
		var prefix = "actions-menu-"; // prefix all class names with this

      	// BUG-260897 - only show "properies" link when element is not in modal
      	var isInModal = pega.ui.inspector.utilities.isElementInModal(focusedData.element[0]);

		// determine if the element has a flow action and mark it as so; this
		// is used to determine if the edit option (property panel) is available
		if (focusedData.flowAction && focusedData.flowAction != "" && !isInModal) {
			$(_self.overlayContentElem).addClass(prefix + "has-flowaction");
		}

		// build a class name based on the type of the focused element
		var className = prefix;

		if (focusedData.type == "Layout") {
			// add subtype (e.g., dynamic layout, smart layout) if layout
			className = className + focusedData.subType;
		} else {
			// add type (e.g., cell, section) if not a layout
			className = className + focusedData.type;
		}

		$(_self.overlayContentElem).addClass(className.toLowerCase());

		var parent = $(focusedData.element).parent().closest('*[data-ui-meta]');

		// check to see if the element has a parent
		if (parent.length > 0) {
			// build a class name based on the type of the focused element's parent
			var parentObj = eval("(" + $(parent).attr("data-ui-meta") + ")");
			var parentClassName = prefix + "inside-";

			if (parentObj.type == "Layout") {
				// add subtype (e.g., dynamic layout, smart layout) if layout
				parentClassName = parentClassName + parentObj.subType;
			} else {
				// add type (e.g., cell, section) if not a layout
				parentClassName = parentClassName + parentObj.type;
			}

			$(_self.overlayContentElem).addClass(parentClassName.toLowerCase());
		}
	}

	/**
	 * @private Function to check if the current mouse position is over the tree or not
     *
     * @param $Event$ e - Event object to check
	 */
	function _isEventFromTree(e) {
		var target = pega.ui.inspector.utilities.getTargetFromEvent(_event);

		// If the target of the event is within the runtime control panel then return true
        if ($(target).closest(".runtime-control-panel").length > 0) {
			return true;
        } else {
			return false;
		}
	}

	/**
	 * @private Performs the add control action if the add control link is active.
	 *
	 * @param $Event$ e - The click event that launched the overlay.
	 */
	function _showAddControl(e) {
		_self.hide();

		// If you have a cached event then call show by event
		if (_event) {
			// If the add control is being launch from somewhere other than the tree then confine to top harness
			if (!_isEventFromTree(_event)) {
				pega.ui.inspector.addMenu.setOption("oneTimeConfinementElement", pega.ui.inspector.getTopHarness());
			}

			// Actually show the add control menu menu
			pega.ui.inspector.addMenu.showByEvent(_event);

			// fire a click event on the 'Basic' tab in the add menu so we always start on that tab
			$("div.RuntimeAddMenu h3:contains('Basic')").click();
		}
	}

    /////////////////////////////////////////////////////////////////////////////////
    //                              PUBLIC FUNCTIONS                               //
    /////////////////////////////////////////////////////////////////////////////////  
	/**
	 * @private Hook to handle adding a control before. Set the position in editing lib and then displays add menu
	 *
	 * @param $Event$ e - The click event that launched the overlay.
	 */
	this.addControlBefore = function(e) {
		pega.ui.inspector.editing.setAddControlPosition("before");
		_showAddControl(e);
	}

	/**
	* @private Hook to handle adding a control after. Set the position in editing lib and then displays add menu
	*
	* @param $Event$ e - The click event that launched the overlay.
	*/
	this.addControlAfter = function(e) {
		pega.ui.inspector.editing.setAddControlPosition("after");
		_showAddControl(e);
	}

	/**
	* @private Hook to handle adding a control inside of a DL. Set the position in editing lib and then displays add menu
	*
	* @param $Event$ e - The click event that launched the overlay.
	*/
	this.addControlInside = function(e) {
		pega.ui.inspector.editing.setAddControlPosition("inside");
		_showAddControl(e);
	}

	/**
	 * @private Hook to handle deleting a control. Displays the delete confirmation
	 *
	 * @param $Event$ e - The click event that launched the overlay.
	 */
	this.deleteConfirm = function(e) {
		_self.hide();

		// If you have a cached event then call show by event
		if (_event) {
			// If the add control is being launch from somewhere other than the tree then confine to top harness
			if (!_isEventFromTree(_event)) {
				pega.ui.inspector.deleteConfirm.setOption("oneTimeConfinementElement", pega.ui.inspector.getTopHarness());
			}

			pega.ui.inspector.deleteConfirm.showByEvent(_event);
		}
	}

	/**
	 * @private Hook to handle opening the property panel from the action menu
	 *
	 * @param $Event$ e - The click event that launched the overlay.
	 */
	this.openPropPanel = function(e) {
		_self.hide();
		pega.ui.inspector.editing.propertypanel.open(e, true);
	};

	/**
	 * @private Overridden showByEvent function. Caches the event and handles adding the correct classes to the overlay before displaying
	 *
	 * @param $Event$ e - The click event that launched the overlay.
	 * @param $Inspector Element$ inspObject - The inspector element object to show the action menu for
	 */
	this.showByEvent = function(e, inspObject) {
		// Set private copies of launch origin
		_event = e;

		// Set classes based on inspector element
		_self.overlayContentElem.className = "content runtime-property-panel runtime-actions-menu";
		_actionsMenuAddClasses(inspObject.getAllAttributes());

		// Show element, this will cause lazy load callback function to be called to create elements
		_superClass.showByEvent(e);
	};

	/**
	 * @private Not supported API. Overridden to prevent confusion
	 */
	this.showByPosition = function() {
		console.log("showByEvent(e, inspObject) should be used for showing the actionmenu");
	};
};
//TODO: Put Content into dom only when show is called (not just content but the overlay itself, shouldn't exist unless its needed)
//TODO: Finish implementing confinement area in _move function to actually get the for corners of its area
//TODO: Set overlay content to have a scroll bar and size the overlay to fit in the window if the overlay's height/width exceed the window
var $pNamespace = pega.namespace;
$pNamespace("pega.ui.inspector");
/** Overlay creates a floating element that can but used to display content in specified locations
 * @param $String$ className - class name to add to the overlay for further styling
 * @param $HTML Element$ containerElem - element to place overlay in dom (places in document.body if not specified)
 * @param $HTML Element/ Function/ String$ content - pass in html element or string to add content on intialization of object, or pass in a lazy
                                               load function that will only load html on the first call of show of overlay
 * @param $Object$ options - addition objects to add. Objects attributes defined as
                   options.fadeTo - the opacity to fade to on show of overlay, opacity is 1 by default
                   options.fadeDuration - the time to animate the fade to, fadeDuration is 0 by default
                   options.showArrow - display an arrow on the overlay to point to where this overlay was launched from, arrow is off by default
                   options.confinementElement - the element to restrict the overlay's apparence by, set to window by default
                   options.oneTimeConfinementElement - when set this will override confinementElement; it is only used one time, and will default back to 
                                                       confinementElement after use
                   options.dataTestId - data-test-id attribute value to add to the overlay element
                   options.showCallback - function to invoke on end of showing overlay
                   options.hideCallback - function to invoke on end of hiding overlay
                   options.frameList - function to invoke to obtain the list of frames
 */
pega.ui.inspector.Overlay = function(className, containerElem, content, options) {  
    /////////////////////////////////////////////////////////////////////////
    ///////////////////////////Constructor Start/////////////////////////////
    /////////////////////////////////////////////////////////////////////////
    var _self = this;

     /* Set default options if the option was not specified. Does not override options passed in. See Overlay JavaDoc description for what options do */
    options = options || {};
    if (options.fadeTo == null)                     options.fadeTo = 1;
    if (options.fadeDuration == null)               options.fadeDuration = 0;
    if (options.confinementElement == null)         options.confinementElement = window;
    if (options.showArrow == null)                  options.showArrow = false;

    /* Variables */
    var _contentToLoad = content;

    /* Initialize Overlay Element */
    _self.overlayElem = document.createElement("DIV");
    _self.overlayElem.className = "overlay " + className;

    if (containerElem) {
      containerElem.appendChild(_self.overlayElem);
    } else {
      document.body.appendChild(_self.overlayElem);
    }

    /* Initialize Overlay Content Element and append to Overlay*/
    _self.overlayContentElem = document.createElement("DIV");
    _self.overlayContentElem.className = "content";
    _self.overlayElem.appendChild(_self.overlayContentElem);

    /* Initialize Arrow Element and append to Overlay */
    if (options.showArrow) {
        _self.overlayElemArrow = document.createElement("DIV");
        _self.overlayElemArrow.className = "arrow";
        _self.overlayElem.appendChild(_self.overlayElemArrow);
    }

    //Set overlay to display none and hidden by default
    _self.overlayElem.style.display = "none";
    _self.overlayElem.style.visibility = "hidden";
    
    // Add the data test id to the outer overlay if is was specified in the options
    if (options.dataTestId && options.dataTestId != "") {
        _self.overlayElem.setAttribute("data-test-id", options.dataTestId);
    }

    /////////////////////////////////////////////////////////////////////////
    //////////////////////////Private Functions//////////////////////////////
    /////////////////////////////////////////////////////////////////////////

    /** @private Move overlay to x/y location specified or pass in an event that will find target source and set x/y to center of source
     * @param $Integer$ xLoc - left position to move element to (not required if event is passed instead)
     * @param $Integer$ yLoc - top position to move element to (not required if event is passed instead)
     * @param $Integer$ event - event object to pass, function will find target srcElement and set top left to that (not required if left/top are passed)
     */
    function _move(xLoc, yLoc, myEvent) {
        //Set overlay to display block as it must be or overlay may not have correct dimensions need to move the overlay accurately
        _self.overlayElem.style.display = "block";
        //Set to 0 by default unless there is an event in which case it will be reset to correct value
        var myEventObjectHeight = 0;
        var myEventObjectWidth = 0;
        if (myEvent) {
            if (myEvent.target) {
                var tg = myEvent.target;
            } else if (myEvent.srcElement) {
                var tg = myEvent.srcElement;
            }

            // BUG-196108: If the target is not currently in the document and the
            // target has a data-click attribute, then we should retrieve a new
            // up-to-date target element based on the original target's data-click.
            if (!document.body.contains(tg) && $(tg).attr("data-click")) {
                // Retrieve a new target element from the document with the same
                // data-click as the original target element.
                var newTg = $("[data-click='" + $(tg).attr("data-click") + "']")[0];

                // Verify that the new target element is contained in the document.
                if (document.body.contains(newTg)) {
                    tg = newTg;
                }
            }
            var targetOffset = $(tg).offset();

            // Position on the center of the target element
            myEventObjectHeight = $(tg).outerHeight()  / 2;
            myEventObjectWidth = $(tg).outerWidth() / 2;
            xLoc = targetOffset.left + myEventObjectWidth;
            yLoc = targetOffset.top + myEventObjectHeight;
        }

        //width and height of overlay itself
        var width = $(_self.overlayElem).outerWidth();
        var height = $(_self.overlayElem).outerHeight();

        // If oneTimeConfinementElement option is set then use that for this one show then nullify it
        // This allows the user to force overlays to stay within a specific area
        if (options.oneTimeConfinementElement) {
            var rightBorder = $(options.oneTimeConfinementElement).width() + $(window).scrollLeft(); //TODO This should get the right position of the confinementElement
            var leftBorder = 0; //TODO This should get the left position of confinementElement
            var topBorder = 0; //TODO This should get the top postion of the confinementElement
            var bottomBorder = $(window).height() + $(window).scrollTop(); //TODO This should get the bottom position of the confinementElement
            options.oneTimeConfinementElement = null;
        } else {
            var rightBorder = $(options.confinementElement).width() + $(window).scrollLeft(); //TODO This should get the right position of the confinementElement
            var leftBorder = 0; //TODO This should get the left position of confinementElement
            var topBorder = 0; //TODO This should get the top postion of the confinementElement
            var bottomBorder = $(window).height() + $(window).scrollTop(); //TODO This should get the bottom position of the confinementElement
        }

        //Set arrow data, if arrow was not initialized, then these should result in 0
        var arrowHeight = 0;
        var arrowWidth = 0;
        var arrowIndenting = 0;
        if (_self.overlayElemArrow) {
          arrowHeight = $(_self.overlayElemArrow).outerHeight() / 2;
          arrowWidth = $(_self.overlayElemArrow).outerWidth() / 2;
          arrowIndenting = 10;
        } 

        //Remove All classes by default, reapply them when needed
        $(_self.overlayElem).removeClass('down-arrow');
        $(_self.overlayElem).removeClass('up-arrow');
        $(_self.overlayElem).removeClass('left-arrow');
        $(_self.overlayElem).removeClass('right-arrow');
        $(_self.overlayElem).removeClass('left-side');
        $(_self.overlayElem).removeClass('right-side');

        //Set default location
        var overlayX = 0;
        var overlayY = 0;
        //Set to 'clear' by default to clear the previous values if no new values are assigned
        var arrowX = "clear";
        var arrowY = "clear";
        
        var drawBelow = yLoc + arrowHeight + height + myEventObjectHeight;
        var drawAbove = yLoc - arrowHeight - height - myEventObjectHeight;
        var drawRight = xLoc - arrowIndenting - arrowWidth + width;
        var drawLeft = xLoc + arrowIndenting - width;
        var drawCenterRight = xLoc + (arrowWidth * 2) + width;
        var drawCenterLeft = xLoc - (arrowWidth * 2) - width;

        /* VERITCAL MOVEMENT */
        if (drawBelow < bottomBorder) {    
            //Falls into this block if the overlay fits below            
            $(_self.overlayElem).addClass('up-arrow');          //Add arrow pointing up class
            overlayY = yLoc + arrowHeight + myEventObjectHeight;//Set Y Location to Draw Below Selected Pointed
        } else if (drawAbove > topBorder) {  
            //Falls into this block if the overlay fits above
            $(_self.overlayElem).addClass('down-arrow');                 //Add arrow point down class
            overlayY = yLoc - arrowHeight - height - myEventObjectHeight;//Set Y Location to Draw Above selected point
        } else {
            //Falls into this block if it does not fit above or below
            overlayY = topBorder;       //Set OverlayY to top of the confinment area
            arrowY = yLoc - arrowHeight;//Set ArrowY to mouse location
            if (overlayY + height < yLoc + myEventObjectHeight) {    
                //Fall into this block if the bottom of the overlay does not reach yLoc (or bottom of event object)
                var difference = (yLoc + myEventObjectHeight) - (overlayY + height);//Get the gap bettween yLoc and bottom of overlay
                overlayY += difference + arrowIndenting;                            //Shift OverlayY down the missing gap
                arrowY = arrowY - difference - arrowIndenting;                      //Adujst Arrow Location for movement above
            }
            if (drawCenterRight < rightBorder) {          //if Fits right
                $(_self.overlayElem).addClass('left-arrow');//add arrow pointing left class
                overlayX = xLoc + (arrowWidth * 2);         //Set X Location to draw right of Selected point
            } else if (drawCenterLeft > leftBorder){      //else fit left
                $(_self.overlayElem).addClass('right-arrow');//add arrow point right class
                overlayX = drawCenterLeft;                   //Set x Location to draw left of selected point
            } else {                                      //else draw horizontally from right edge
                overlayX = leftBorder;                      //Set x Location to draw at left border
            }
        }

        /* HORIZONTAL MOVEMENT */
        //Only do left/right side logic if there is an up/down arrow, this logic is not needed if the arrows show up on the left/right side
        if ($(_self.overlayElem).hasClass('up-arrow') || $(_self.overlayElem).hasClass('down-arrow')) {
            if (drawRight < rightBorder) {
                //Falls into this block if the overlay fits to the right
                $(_self.overlayElem).addClass('left-side');            //Add arrow on left side class
                overlayX = xLoc - arrowIndenting - arrowWidth;         //Set X Location to draw right of Selected point
            } else if (drawLeft > leftBorder){
                //Falls into this block if the overlay fits to the left
                $(_self.overlayElem).addClass('right-side');           //Add arrow on right side class
                overlayX = xLoc + arrowIndenting + arrowWidth - width; //Set x Location to draw left of selected point
            } else {
                //Falls into this block if the overlay does not fit left or right
                var difference = (drawRight + width) - rightBorder;    //Find the distance that exceeds right edge
                overlayX = drawRight - difference;                     //Set x location to draw from right edge
                arrowX = width - (rightBorder - xLoc) - arrowWidth;    //Set arrow Location to draw from right edge
            }
        }

        //Move overlay and associated elements to new expected locations
        _moveElement(_self.overlayElem, overlayX, overlayY);
        if (_self.overlayElemArrow)
            _moveElement(_self.overlayElemArrow, arrowX, arrowY);

        //hide the overlay at the end, this is done so that the overlay can be moved without actually rendering it in the ui
        _self.overlayElem.style.display = "none";
    };

    /** @private Utility function to move individual elements to specified locations
     * @param $HTML Element$ HTMLObj - html element you wish to move
     * @param $Integer / String$ xLoc - move to new left position, or passing "clear" will clear the current value (optional, will not change left if not passed)
     * @param $Integer / String$ yLoc - move to new top position, or passing "clear" will clear the current value (optional, will not change top if not passed)
     */
    function _moveElement(HTMLObj, xLoc, yLoc) {
        var o = HTMLObj.style;

        if (xLoc != null && xLoc != "clear")
            o.left = xLoc + "px";
        else if (xLoc == "clear")
            o.left = "";
        if (yLoc != null && yLoc != "clear")
            o.top = yLoc + "px";
        else if (yLoc == "clear")
            o.top = "";
    }

    /** @private Load stored content into the overlay content element
     */
    function _loadContent() {
        //Lazy loading, check if new content has been set, and then loads the new content when show is called
        if (_contentToLoad) {
            $(_self.overlayContentElem).html(_contentToLoad);
            _contentToLoad = null;
        }
    }

    /** @private Renders the overlay in the UI by setting it to display block, visibile and fade the overlay in
     */
    function _displayOverlay() {
        //TODO: Do we need to display block/visibility if we do a jquery fadeTo?
        //_self.overlayElem.style.display = "block";
        _self.overlayElem.style.visibility = "visible";
        $(_self.overlayElem).stop(true, false).fadeTo(options.fadeDuration, options.fadeTo, function () {
          	if (options.showCallback) {
                options.showCallback();
          	}
        });
    }

    /////////////////////////////////////////////////////////////////////////
    //////////////////////////Public Functions///////////////////////////////
    /////////////////////////////////////////////////////////////////////////

    /** @public Show the overlay in current location
     */
    _self.show = function() {   
        _loadContent();
        _displayOverlay();
    }
    /** @public Shows overlay and move it to the specified location
     * @param $Integer$ xLoc - move to new left position
     * @param $Integer$ yLoc - move to new top position
     */
    _self.showByPosition = function(xLoc, yLoc) {
        _loadContent();
        _move(xLoc, yLoc);
        _displayOverlay();
    };

    /** @public Shows overlay and move it the to the target source of event object
     * @param $Event$ myEvent - move to target source of event
     */
    _self.showByEvent = function(myEvent) {
        _loadContent();
        _move(null, null, myEvent);
        _displayOverlay();
    };

    /** @public Hide Overlay
     */
    _self.hide = function() {
        //Return if element is already set to display none
        if (_self.overlayElem.style.display == "none")
            return;

        $(_self.overlayElem).stop(true, false).fadeTo(options.fadeDuration, 0, function() {
            _self.overlayElem.style.display = "none";
            _self.overlayElem.style.visibility = "hidden";
          	if (options.hideCallback) {
                options.hideCallback();
            }
        });
    };

    /** @public Set the content of the overlay
     * @param $Function / String/ HTML Element$ eventFunction - Pass in content that will be appened to the overlay (functions must return a string or HTML element to append)
     */
    _self.setContent = function(content) {
        _contentToLoad = content;
    }

    /** @public Set the specified option on the option object
     * @param $String$ name - The name of the option to set. Must match the name of the option a user would pass into the constructor
     * @param $Any$ value - The value to set the option to
     */
    _self.setOption = function(name, value) {
        options[name] = value;
    }

    /** Removes overlay from the DOM
     */
    _self.removeFromDom = function () {
        $(_self.overlayElem).remove();
    }
};

/* Specialized overlay middle man that handles lazy loading sections from the server before calling the superclass to show
 * @param $String$ className - class name to add to the overlay for further styling
 * @param $HTML Element$ containerElem - element to place overlay in dom (places in document.body if not specified)
 * @param $String$ sectionName - The name of the section to load or null if parent will handle content
 * @param $Object$ options - See pega.ui.inspector.Overlay Java docs for description
                   options.baseRef - Unique to LazyLoad class. Used to specify a custom page to use for loading a section into the DOM
 */
pega.ui.inspector.Overlay.LazyLoad = function(className, containerElem, sectionName, options) {
    var _self = this;

    /* Set default options if the option was not specified. Does not override options passed in */
    if (options == null)                        options = {};

    //Create a new instance of Overlay and extend it into self (this creates a concept of inheritence)
    var _sectionName = sectionName;
    var _superClass = new pega.ui.inspector.Overlay(className, containerElem, null, options)
    $.extend(this, _superClass);

    var sectionLoaded = false;

    /**
     * @private Setter to set the sectionLoaded boolean that forces the content to be reloaded from the server on the next show
     *
     * @param $Event$ myEvent - event to use for positioning logic
     * @param $Integer$ xLoc - move to new left position
     * @param $Integer$ yLoc - move to new top position
     */
    function _loadSection(myEvent, xLoc, yLoc) {
        // Make sure the content of the overlay is empty
        _superClass.overlayContentElem.innerHTML = "";

        // Make a temp div and append to the content of the overlay
        var tempContentDiv = document.createElement("DIV");
        _superClass.overlayContentElem.appendChild(tempContentDiv);

        // Setup a callback that will simply call show in the super
        // this is based on what the params are. If event call showByEvent
        if (myEvent) {
            var callback = function() {
                _superClass.showByEvent(myEvent);
            }
        } else {
            var callback = function() {
                _superClass.showByPosition(xLoc, yLoc);        
            }
        }

        // Load the section from the server into the temp element
        pega.ui.inspector.utilities.loadSectionIntoDom(_sectionName, "@baseclass", tempContentDiv, callback, options.baseRef);

        // Set flag saying the content has been loaded
        sectionLoaded = true;
    }

    /**
     * @public Setter to set the sectionLoaded boolean that forces the content to be reloaded from the server on the next show
     */
    _self.setSectionLoaded = function() {
        sectionLoaded = false;
    }

    /**
     * @public Handles calling loadSectionIntoDom to load a section and then on success call the superclass showByPosition that way the HTML is finished before positioning
     *
     * @param $Integer$ xLoc - move to new left position
     * @param $Integer$ yLoc - move to new top position
     */
    _self.showByPosition = function(xLoc, yLoc) {
        if (!sectionLoaded) {
            _loadSection(null, xLoc, yLoc);
        } else {
            // If the section was loaded already they just show it
            _superClass.showByPosition(xLoc, yLoc);
        }
    }

    /**
     * @public Handles calling loadSectionIntoDom to load a section and then on success call the superclass showByEvent that way the HTML is finished before positioning
     *
     * @param $Event$ myEvent - event to use for positioning logic
     */
    this.showByEvent = function(myEvent) {
        if (!sectionLoaded) {
            _loadSection(myEvent);
        } else {
            // If the section was loaded already they just show it
            _superClass.showByEvent(myEvent);
        }
    }
};

/* Specialized overlay that has a overlay dismiss based on mouseout of overlay
 * @param $String$ className - class name to add to the overlay for further styling
 * @param $HTML Element$ containerElem - element to place overlay in dom (places in document.body if not specified)
 * @param $String$ sectionName - The name of the section to load or null if parent will handle content
 * @param $Boolean$ showArrow - add an arrow to your overlay if true (assumes false by default if not specified)
 */
pega.ui.inspector.Overlay.DismissOnMouseOut = function(className, containerElem, sectionName, options) {
    var _self = this;

    /* Set default options if the option was not specified. Does not override options passed in */
    if (options == null)                        options = {};
    if (options.fadeDuration == null)           options.fadeDuration = 250;
    if (options.showArrow == null)              options.showArrow = true;

    className += " dismiss-on-mouse-out";

    // Create a new instance of LazyLoad if sectionName was given otherwise use base Overlay
    if (sectionName != null) {
        var _superClass = new pega.ui.inspector.Overlay.LazyLoad(className, containerElem, sectionName, options);
    } else {
        var _superClass = new pega.ui.inspector.Overlay(className, containerElem, sectionName, options);
    }
    // Extend the superClass into this to for inheritence
    $.extend(this, _superClass);

    if(_self.overlayElemArrow){
        _self.keepRegion = document.createElement("DIV");
        _self.keepRegion.className = "keepregion";
        //_self.keepRegion.id = "inspector-overlay-keepregion";
        _self.overlayElem.appendChild(_self.keepRegion);
        _self.keepRegion.addEventListener('click', _self.hide)
        _self.overlayElemArrow.addEventListener('click', _self.hide)
    }

    _self.overlayElem.addEventListener('mouseleave', _self.hide);
  
    /**
     * @public Destroy function to clean up 
     */
    _self.removeFromDom = function() {
        _self.keepRegion.removeEventListener('click', _self.hide);
        _self.overlayElemArrow.removeEventListener('click', _self.hide);
        _self.overlayElem.removeEventListener('mouseleave', _self.hide);
      
        _superClass.removeFromDom();
    }
};

/* Specialized overlay that has a overlay dismiss based on clicking outside of overlay
 * @param $String$ className - class name to add to the overlay for further styling
 * @param $HTML Element$ containerElem - element to place overlay in dom (places in document.body if not specified)
 * @param $String$ sectionName - The name of the section to load or null if parent will handle content
 * @param $Object$ options - See pega.ui.inspector.Overlay docs for description
                   options.preHide - function to invoke immediately when hide is called
 */
pega.ui.inspector.Overlay.DismissOnOutsideClick = function(className, containerElem, sectionName, options) {
    var _self = this;

    /* Set default options if the option was not specified. Does not override options passed in */
    if (options == null)                    options = {};
    if (options.showArrow == null)          options.showArrow = true;
    if (options.fadeDuration == null)       options.fadeDuration = 250;
    if (options.frameList == null)          options.frameList = function(){ return [document]};

    className += " dismiss-on-outside-click";

    // Create a new instance of LazyLoad if sectionName was given otherwise use base Overlay
    if (sectionName != null) {
        var _superClass = new pega.ui.inspector.Overlay.LazyLoad(className, containerElem, sectionName, options);
    } else {
        var _superClass = new pega.ui.inspector.Overlay(className, containerElem, sectionName, options);
    }
    // Extend the superClass into this to for inheritence
    $.extend(this, _superClass);

	  /**
     * @private handles hiding the click away overlays
     */
    function _dismissOverlay(myEvent) {
        // If the click did not originate from inside the overlay then hide it
        if (!_self.overlayElem.contains(myEvent.target)) {
            _self.hide();
        }
    }

    /**
     * @private adds or removes click event listeners in all iframes
     */
    function _toggleFrameEvents(turnOn) {
        var tempList = options.frameList();
        for (var x = 0; x < tempList.length; x++) {
            // Document click event click handler to hide the click away overlays
            if(turnOn) {
                tempList[x].addEventListener("mouseup", _dismissOverlay);	
            } else {
                tempList[x].removeEventListener("mouseup", _dismissOverlay);	
            }
        }
    }

    /**
     * @public Handles calling loadSectionIntoDom to load a section and then on success call the superclass showByEvent that way the HTML is finished before positioning
     *
     * @param $Event$ myEvent - event to use for positioning logic
     */
    _self.showByEvent = function(myEvent) {
        _superClass.showByEvent(myEvent);

        _toggleFrameEvents(true);
    }

    /**
     * @public Show Overlay
     */
    _self.show = function() {
        _superClass.show();

        _toggleFrameEvents(true);
    }

   /**
    * @public Hide Overlay
    */
    _self.hide = function() {
        if(options.preHide) {
            options.preHide();
        }

        _superClass.hide();

        _toggleFrameEvents(false);
    }
    
    /**
     * @public Destroy function to clean up
     **/
    _self.removeFromDom = function() {
        _self.hide();
        _superClass.removeFromDom();
    }
};

/* Specialized overlay that behaves like a modal where you must take an action to dismiss the modal. Also, modals are always centered on screen with a mask
 * @param $String$ className - class name to add to the overlay for further styling
 * @param $HTML Element$ containerElem - element to place overlay in dom (places in document.body if not specified)
 * @param $String$ sectionName - The name of the section to load or null if parent will handle content
 * @param $Object$ options - See pega.ui.inspector.Overlay Java docs for description
 */
pega.ui.inspector.Overlay.Modal = function(className, containerElem, sectionName, options) {
    var _self = this;

    /* Set default options if the option was not specified. Does not override options passed in */
    if (options == null)                    options = {};
    if (options.showArrow == null)          options.showArrow = false;

    className += " modal";

    // Create the modal mask to be displayed behind the modal overlay
    _self.maskElem = document.createElement("DIV");
    _self.maskElem.className = "modal-mask hidden";
    containerElem.appendChild(_self.maskElem);

    // Create a new instance of LazyLoad if sectionName was given otherwise use base Overlay
    if (sectionName != null) {
        var _superClass = new pega.ui.inspector.Overlay.LazyLoad(className, containerElem, sectionName, options);
    } else {
        var _superClass = new pega.ui.inspector.Overlay(className, containerElem, sectionName, options);
    }
    // Extend the superClass into this to for inheritence
    $.extend(this, _superClass);

    /**
     * @public Removes the hidden class from the mask to make it appear before calling the superclass showByPosition
     */
    _self.showByPosition = function(xLoc, yLoc) {
        // Remove the hidden class from the mask to make it visible then call superClass show
        $(_self.maskElem).removeClass("hidden");
        _superClass.showByPosition(xLoc, yLoc);
    }

    /**
    * @public Adds the hidden class to the mask to make disappear before calling the superclass hide
    */
    _self.hide = function() {
        // Add the hidden class to the mask then call superclass hide
        $(_self.maskElem).addClass("hidden");
        _superClass.hide();
    }
    
        
    _self.show = function() {
      _self.showByPosition(0, 0);
    }
};

/* Specialized overlay that dismisses itself after a set time after being shown
 * @param $String$ className - class name to add to the overlay for further styling
 * @param $HTML Element$ containerElem - element to place overlay in dom (places in document.body if not specified)
 * @param $HTML Element/ Function/ String$ content - pass in html element or string function (function must return html element or string) that will be the content of the overlay
 * @param $Object$ options - See pega.ui.inspector.Overlay Java docs for description
                   options.timeOutDuration - unique to Timeout Overlay, the time it will dismiss itself after calling the show funciton, 250 miliseconds by default
 */
pega.ui.inspector.Overlay.Timeout = function (className, containerElem, content, options) {
    var _self = this;
    /* Set default options if the option was not specified. Does not override options passed in */
    if (options == null)                        options = {};
    if (options.fadeDuration == null)           options.fadeDuration = 150;
    if (options.showArrow == null)              options.showArrow = false;
    if (options.timeOutDuration == null)        options.timeOutDuration = 750;
    className += " time-out";
    // Extend the superClass into this to for inheritence
    var _superClass = new pega.ui.inspector.Overlay(className, containerElem, content, options);
    $.extend(this, _superClass);

    _self.showByEvent = function(e) {
        _superClass.showByEvent(e);
        setTimeout(_superClass.hide, options.timeOutDuration);
    }
};
var $pNamespace = pega.namespace;
$pNamespace("pega.ui.inspector");

/**
 * @public Constructs an ancestor list object to show up to seven ancestor
 * items for the currently focused object.  Only one ancestor list object
 * should be made for the whole application.  To make the ancestor icon
 * appear, call its show method.  This should be called from the info bar.
 *
 * @param $HTML element$ containerElem The element which will contain the
 *  ancestor list.
 */
pega.ui.inspector.AncestorList = function(containerElem, options) {
    ///////////////////////////////////////////////////////////////////////////
    //                               CONSTANTS                               //
    ///////////////////////////////////////////////////////////////////////////
    var ANCESTOR_CLASS = "runtime-ancestor-panel";
    var NO_ANCESTOR_MESSAGE = "No ancestors";
    var NO_ANCESTOR_CLASS = "runtime-tree-prefix";

    var _self = this;
    if(options == null) {
        options = {};
    }
    options.showArrow = false;
    options.fadeTo = 0.95;
    options.fadeDuration = 250;
    options.dataTestId = "ancestor-list";

    ///////////////////////////////////////////////////////////////////////////
    //                              CONSTRUCTOR                              //
    ///////////////////////////////////////////////////////////////////////////

    var _superClass = new pega.ui.inspector.Overlay.DismissOnMouseOut(ANCESTOR_CLASS, containerElem, null, options);
    $.extend(this, _superClass);

    _self.keepRegion = document.createElement("DIV");
    _self.keepRegion.className = "keepregion";
    _self.overlayElem.appendChild(_self.keepRegion);
    _self.keepRegion.addEventListener('click', _self.hide);

    ///////////////////////////////////////////////////////////////////////////
    //                           PRIVATE FUNCTIONS                           //
    ///////////////////////////////////////////////////////////////////////////

    /**
	 * @private A dehover ancestor object which can be instantiated in order to
	 *  be invoked when the ancestor item is dehovered.
	 */
    function _dehoverAncestor() {
        pega.ui.inspector.clearHighlight(false);
    }

    /**
	 * @private A hover ancestor object which can be instantiated in order to
	 *  be invoked when the ancestor item is hovered.
	 *
	 * @param $Object$ obj An inspector object corresponding to an ancestor
     *  item.
	 */
    function _hoverAncestor(obj) {
        var _obj = obj;

        return function() {
          	pega.ui.inspector.hover(_obj);
        }
    }

    /**
	 * @private A click ancestor object which can be instantiated in order to
	 *  be invoked when the ancestor item is clicked.
	 *
	 * @param $Object$ obj An inspector object corresponding to an ancestor
     *  item.
	 */
    function _clickAncestor(obj) {
        var _obj = obj;

        return function() {
          	pega.ui.inspector.focus(_obj);
            _superClass.hide();
        }
    }

    /**
	 * @private An open rule object which can be instantiated in order to be
	 * invoked when the open rule icon is clicked for the specified ancestor.
	 *
	 * @param $Object$ obj An inspector object corresponding to an ancestor
     *  item.
	 */
    function _openRule(obj) {
        var _obj = obj;

        return function() {
            pega.ui.inspector.openElementRuleForInsKey(_obj.get("insKey"));
        }
    }

    /**
     * @private Builds a list of up-to seven ancestors for the currently
	 * focused UI element.
     */
    function _buildDescendingList() {
        var ancestors = 0;

        // clear overlayContentElem
        pega.ui.inspector.utilities.removeChildren(_self.overlayContentElem);

        // Set filters for use when calling getNearestParent
        var tempTypes = [{ 'type' : 'Section'} , {'type' : 'Harness'}];

        var focusedObject = pega.ui.inspector.getFocusedInspectorObject();
        var currentObject = pega.ui.inspector.parser.getNearestParent(focusedObject, tempTypes);

        while (ancestors < 7 && currentObject != null) {
            // Only add an ancestor if it is a section or a harness
			if (currentObject.get("type") == "Section" || currentObject.get("type") == "Harness") {
            var ancestorId = "ancestor-" + (ancestors + 1);
            var ancestorAttributes = { id : ancestorId, className : "ancestor-anchor" };
		        var clickEvent = new _clickAncestor(currentObject);
		        var hoverEvent = new _hoverAncestor(currentObject);
            var events = {
                'click' : clickEvent,
                'mouseenter' : hoverEvent,
                'mouseleave' : _dehoverAncestor
            };

		        var ancestorItem = pega.ui.inspector.utilities.createElement("A", ancestorAttributes, events);

		        var typeIcon = pega.ui.inspector.utilities.createElement("I", { className: currentObject.get("type") + "Node"});
                ancestorItem.appendChild(typeIcon);

		        var displayText = pega.ui.inspector.utilities.createElement("SPAN", { innerHTML: pega.ui.inspector.utilities.displayUIElementText(currentObject.getAllAttributes())});
                ancestorItem.appendChild(displayText);

                // Only add open icons for sections that have pzInsKeys because of non-auto gen sections
                if (currentObject.get("insKey") && currentObject.get("insKey") != "") {
                    var openRuleIconAttributes = { className : "live-ui-open-rule AncestorOpenRule", title : pega.u.d.fieldValuesList.get("OpenInDevStudio")};
                    var openRuleIconClickEvent = new _openRule(currentObject);
                    var events = {
                      'click' : openRuleIconClickEvent
                    };
                    var openRuleIcon = pega.ui.inspector.utilities.createElement("SPAN", openRuleIconAttributes, events);
                    ancestorItem.appendChild(openRuleIcon);
                }

                _self.overlayContentElem.insertBefore(ancestorItem, _self.overlayContentElem.firstChild);

                ancestors++;
            }

            // Get the next parent object
            currentObject = pega.ui.inspector.parser.getNearestParent(currentObject, tempTypes);
		}

        // If there were no ancestors, then add a message that specifies that
        if (ancestors == 0) {
            var noAncestors = pega.ui.inspector.utilities.createElement("SPAN", { innerHTML: NO_ANCESTOR_MESSAGE, className: NO_ANCESTOR_CLASS });
          	_self.overlayContentElem.appendChild(noAncestors);
        }
    }

    /**
     * @private Position and set the size of the keep region.
     *
     * @param $Object$ infobarLocation A object containing position and size
     *  information for the info bar.
     * @param $boolean$ ancestorListFlipped True if the ancestor list will be
     *  flipped to appear under the info bar.
	 * @param $String$ leftOffset contains the difference between the x location of the
	 *  info panel and the x position of the ancestor list. Used to correctly position the
	 *  keep region over the info panel
     */
    function _positionKeepRegion(infobarLocation, ancestorListFlipped, leftOffset) {
        var infobar = $(".inspectorTreeSecIdPanel");
        var infobarIcons = $(".inspectorTreeSecIdPanel .idpanel-icon-container");
        var infobarHeight = infobar.outerHeight();

        _self.keepRegion.style.width = (infobar.width() - infobarIcons.width()) + "px";
        _self.keepRegion.style.height = infobarHeight + "px";
        _self.keepRegion.style.left =  leftOffset + "px";

        if (ancestorListFlipped) {
            _self.keepRegion.style.top = -infobarHeight + "px";
            _self.keepRegion.style.bottom = "auto";
        } else {
            _self.keepRegion.style.top = "auto";
            _self.keepRegion.style.bottom = -infobarHeight + "px";
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    //                           PUBLIC FUNCTIONS                            //
    ///////////////////////////////////////////////////////////////////////////

    /**
     * @public Shows the ancestor list, positioned according to the information
     * bar of the focused UI element.
	 *
     * @param $Object$ infobarLocation An object containing top, left, width,
	 * and height information for the info bar.
     */
    this.show = function() {
        _buildDescendingList();
        _self.overlayElem.style.display = "block";

        // Find location to display based off of the show target.
        var $idPanel = $(options.showTarget);
        var infobarLocation = $idPanel.offset();
        infobarLocation.height = $idPanel.height();

        // Get left and top from infobar
        var x = infobarLocation.left;
        var y = infobarLocation.top;
        var height = $(_self.overlayElem).outerHeight();
        var width = $(_self.overlayElem).outerWidth();
        var ancestorListFlipped = false;

      	// Needed to correctly position the keep region in
      	// scenarios where the infobar is pushed (edge of screen)
      	var leftOffset = "0";

        // If the ancestor list goes off the top of the page, reverse the list and move the list to
        // below the infobar
        if (y - height < 0) {
          	pega.ui.inspector.utilities.reverseChildren(_self.overlayContentElem);
            y = y + infobarLocation.height;

            ancestorListFlipped = true;
        } else {
            y = y - height;
        }

        // TODO: we may want to use pega.ui.inspector.getTopHarness() instead of window,
        // which would have to account for left position plus width
        var rightBorder = $(window).width() + $(window).scrollLeft();

        if (x + width > rightBorder) {
            var difference = x + width - rightBorder;
            x = x - difference;
          	leftOffset = difference;
        }

        _self.overlayElem.style.display = "none";
        pega.ui.inspector.utilities.moveElement(_self.overlayElem, x, y);
        _superClass.show();

        _positionKeepRegion(infobarLocation, ancestorListFlipped, leftOffset);
    };

    /**
	 * @public Overrides the showByEvent method of the Overlay super class.
	 * An error message is printed to the console because the show method
	 * should be used instead.
	 *
	 * @param $Object$ event An event object.
	 */
    this.showByEvent = function(event) {
        console.log("show(infobarLocation) should be used for showing the ancestor list");
    }

    /**
	 * @public Overrides the showByPosition method of the Overlay super class.
	 * An error message is printed to the console because the show method
	 * should be used instead.
	 *
	 * @param $int$ left The left position where the ancestor list should be
	 *  located.
	 * @param $int$ top The top position where the ancestor list should be
	 *  located.
	 */
    this.showByPosition = function(left, top) {
        console.log("show(infobarLocation) should be used for showing the ancestor list");
    };
};
//static-content-hash-trigger-YUI
var $pNamespace = pega.namespace;
$pNamespace("pega.ui.inspector");

/**
 * @public ErrorModal constructor that creates a Live UI error modal for editing at runtime
 *
 * @param $HTML Element$ myContainerElem - Container HTML element to place the error modal into
 */
pega.ui.inspector.ErrorModal = function(myContainerElem, myOptions) {
	var _self = this;
	myOptions.baseRef = "pyTemp_PropPanelPage";
  	myOptions.dataTestId = "editing-error";
  
	//Create a new instance of Modal and extend it into self (this creates a concept of inheritence)
	var _superClass = new pega.ui.inspector.Overlay.Modal("inspector-modal", myContainerElem, "pzRuntime_ActionsMenuErrors", myOptions);
	$.extend(this, _superClass);

	/**
	 * @public Shows the error modal and adds the correct class based on the errorMessage so that the correct text appears
	 *
	 * @param $String$ errorMessage - The error message code returned from the server indicating what the problem was
	 */
	this.show = function(errorMessage) {
      	//myOptions.showCallback();
		// If the error that is being displayed is the locked by another user, you must force section to be loaded again
		if (errorMessage.toLowerCase() == "locked") {
			_superClass.setSectionLoaded(false);
        }

		// Set the class based on the error message and then show the modal
		_superClass.overlayContentElem.className = "content runtime-property-panel runtime-modal-error-content error-message-" + errorMessage.toLowerCase();
		_superClass.showByPosition(0, 0);
	}

	/**
	 * @public Hide method for the modal also enables highlighting before calling superclass
	 */
	this.hide = function() {
      	//myOptions.hideCallback();
		_superClass.hide();
	}

	/**
	 * @public This method should not be used so it is overridden to make it clear it is the wrong method
	 */
	this.showByEvent = function(event) {
		console.log("show(errorMessage) should be used for showing the error modal");
	}

	/**
	* @public This method should not be used so it is overridden to make it clear it is the wrong method
	*/
	this.showByPosition = function(left, top) {
		console.log("show(errorMessage) should be used for showing the error modal");
	};
}
pega.namespace("pega.ui.inspector");

// The editor is a singleton class which returns its public methods.
pega.ui.inspector.expressedit = function() {

  /////////////////////////////////////////////////////////////////////////////////
  //                                  CONSTANTS                                  //
  /////////////////////////////////////////////////////////////////////////////////
  var OUTERMOST_CONFIGURE_DIV_CLASS = "runtime-edit-review-configure";  
  /////////////////////////////////////////////////////////////////////////////////
  //                                  GLOBALS                                    //
  /////////////////////////////////////////////////////////////////////////////////
  /* -- PRIVATE GLOBALS -- */
  var _inspectorObjectsByID;
  var _currentInspectorObject;
  /* -- PUBLIC GLOBALS -- */
  var publicAPI = {};

  /////////////////////////////////////////////////////////////////////////////////
  //                              PRIVATE FUNCTIONS                              //
  /////////////////////////////////////////////////////////////////////////////////  
  /**
   * @private A click object which can be instantiated in order to click
   *
   * @param $HTML Element$ elem - HTML Element for containing section information
   */
  function _clickConfigureLink(elem) {
    var _elem = elem;

    return function(eventObject) {
      pega.ui.composer.getCurrentComposerWindow().pega.ui.edit.config.launchPanel(_elem);
    }
  }
  /////////////////////////////////////////////////////////////////////////////////
  //                                    PUBLIC API                               //
  /////////////////////////////////////////////////////////////////////////////////
  /*
   * Method that gets called from the ui_doc to load the configure links.
   */

  publicAPI.loadConfigureLinks = function() {

    // Only add the links if the composer bar is ON which ensures that we are in Pega express portal.
    if (pega.ui.composer.isComposerOn()) {
      pega.ui.inspector.expressedit.toggleConfigureLinks("ADD");
    }
  }

  /**
   * @public Called to refresh the field value tree
   */
  publicAPI.toggleConfigureLinks = function(operation) {

    if (pega.ui.composer.getCurrentComposerWindow() !== window) {
      return pega.ui.composer.getCurrentComposerWindow().pega.ui.inspector.expressedit.toggleConfigureLinks(operation);
    }
    var returnObj = pega.ui.inspector.parser.buildModel(document.body);
    _inspectorObjectsByID = returnObj.lookupByID;

    for (var key in _inspectorObjectsByID) {
      _currentInspectorObject = _inspectorObjectsByID[key];
      var currentRuleType = _currentInspectorObject.get("type");
      if (currentRuleType === "Section") {

        var currentSectionName = _currentInspectorObject.get("ruleName");

        // Check if the section is either case information gadgets
        if (currentSectionName === "pyEnterCaseDetails" || currentSectionName === "pyCaseInformation") {

          // Get JQuery version of the inspector element
          var elemObj = _currentInspectorObject.get("element");
          var hasCaseActionAreaAsAncestor = (currentSectionName === "pyEnterCaseDetails" && elemObj.closest('[data-node-id="pyCaseActionArea"]').length !== 0);

          if (operation === "ADD" && !hasCaseActionAreaAsAncestor) {
            pega.ui.inspector.expressedit.addConfigureLink(elemObj, _currentInspectorObject, currentSectionName);
          } else if (operation === "REMOVE") {
            pega.ui.inspector.expressedit.removeConfigureLink(elemObj);
          }
        }
      }
    }
  }

  /**
   * @public Called to add the configure link field
   * @param $Object$ - the element to add
   * @param $Object$ inspectorObj - the UI inspector object
   * @param $String$ currentSectionName - the name of the section to add the object for
   */
  publicAPI.addConfigureLink = function(currentElement, inspectorObj, currentSectionName) {
    var inspectorElement = pega.ui.inspector.utilities.getTempInspectorObject(currentElement)
    var nearestParent = pega.ui.inspector.parser.getNearestParent(inspectorElement);
    // if the current element is in a layout group, then set the currentElement to be the first section
    if(nearestParent && nearestParent.get("type") === "Layout" && nearestParent.get("subType") === "DYNAMICLAYOUTGROUP")
    {
        currentElement = $(currentElement[0].querySelector(".layout-body > .sectionDivStyle"));
    }
  
    // Get the HTML and the firstchild from it
    var firstCh = currentElement[0].firstChild;

    // If the first child is the link then dont add a new one
    if (firstCh.className !== OUTERMOST_CONFIGURE_DIV_CLASS) {

      // Build up the events for the div
      //_clickConfigureLink is a function that you can call to new up. newing this up returns a function object.
      //The new object itself will contain a cached version of the inspector object itself
      var events = {
        'click': new _clickConfigureLink(inspectorObj.get('element'))
      };

      var OuterMostDIV = pega.ui.inspector.utilities.createElement("DIV", {
        className: OUTERMOST_CONFIGURE_DIV_CLASS
      }, events);

      // 1. Create the outermost Link DIV
      var configureLinkDIV = pega.ui.inspector.utilities.createElement("DIV", {
        className: "runtime-edit-config-link"
      });
      // 2. Build inner SPAN
      var configureLinkText = pega.u.d.fieldValuesList.get("Configure this view");
      var configureLinkSPANAttributes = {
        className: "express-idpanel-text",
        innerHTML: configureLinkText
      };
      var configureLinkSPAN = pega.ui.inspector.utilities.createElement("SPAN", configureLinkSPANAttributes);
      // 3. Add SPAN to Link div
      configureLinkDIV.appendChild(configureLinkSPAN);
      // 4. create icon DIV
      var configureLinkIcon = pega.ui.inspector.utilities.createElement("DIV", {
        className: "runtime-edit-config-icon"
      });
      // 5. create anchor
      var configureLinkAnchor = pega.ui.inspector.utilities.createElement("a", {
        className: "runtime-edit-pencil"
      });
      // 6. Append anchor as a child to the icon DIV
      configureLinkIcon.appendChild(configureLinkAnchor);
      // 7. Add Icon to the Link DIV
      configureLinkDIV.appendChild(configureLinkIcon);
      // 8. Add Link DIV to outermost DIV
      OuterMostDIV.appendChild(configureLinkDIV);
      // 9. Finally Add the outermost DIV to the current element
      currentElement[0].insertBefore(OuterMostDIV, currentElement[0].firstChild);

      // Add configure highlight class to the current element
      currentElement.addClass("express-configure-highlight");
    }
  }

  /**
   * @public Called to remove the configure link field
   * @param $Object$ currentElement - the element to remove
   */
  publicAPI.removeConfigureLink = function(currentElement) {

    // Get the HTML and the firstchild from it
    var firstCh = currentElement[0].firstChild;

    if (firstCh.className === OUTERMOST_CONFIGURE_DIV_CLASS) {
      currentElement[0].removeChild(currentElement[0].firstChild);
      // remove the highlighting
      currentElement.removeClass("express-configure-highlight");
    }
  }

  return publicAPI;
}()
pega.u.d.attachOnload(function() {
  // this piece of code is from pzpega_ui_doc_lifecycle.js

  //If not on perform harness, load configure links (BUG-308735)
  //BUG-351621 we also need the configure links on perform harness
  if (pega.u.d.primaryPageName === 'pyWorkPage') {
    setTimeout(pega.ui.inspector.expressedit.loadConfigureLinks, 1000);
  }
}, true);
//static-content-hash-trigger-NON
var $pNamespace = pega.namespace;
$pNamespace("pega.ui.inspector");

// The editor is a singleton class which returns its public methods.
pega.ui.inspector.fieldvalue = (function() {
    /////////////////////////////////////////////////////////////////////////////////
    //                              CONSTANTS                                      //
    /////////////////////////////////////////////////////////////////////////////////
    

  
    /////////////////////////////////////////////////////////////////////////////////
    //                              GLOBALS                                        //
    /////////////////////////////////////////////////////////////////////////////////  
  	/* -- PRIVATE GLOBALS -- */
    var _fieldValueInfo;
    var _inspectorObjectsByID;
    var _inspectorObjectsRootNodes;
    var _hoverInspector;
    var _clickInspector;
    var _tree;
    var _panel = null;
    var _originalDockIndex;
  
    /////////////////////////////////////////////////////////////////////////////////
    //                              PRIVATE FUNCTIONS                              //
    /////////////////////////////////////////////////////////////////////////////////
    /**
     * @private Builds up the HTML markup for an individual fieldvalue node in the tree
     *
     * @param $JSON$ fieldValueMeta - All meta information about the field value to build the markup for
     * @return $String$ strHTML - The html markup to be used
     **/
    function _buildFieldValueNodeHTML(fieldValueMeta, inspectorElementID, fieldValueIndex) {
        var strHTML = "<span class='meta-title' title='Translates to: " + fieldValueMeta.pyLocalizedValue + "'>";
        strHTML += "<span class='runtime-tree-prefix'>" + fieldValueMeta.pyFieldName + " - </span>";
        strHTML += "<span class='RuntimeInspectorValue'>" + fieldValueMeta.pyFieldValue + "</span>";

        var clickEvent = "";
        var tooltip = "";
        if (fieldValueMeta.pzInsKey != "") {
            tooltip = pega.u.d.fieldValuesList.get("OpenInDevStudio");
            clickEvent = "pega.ui.inspector.fieldvalue.openFieldValue(\"" + fieldValueMeta.pzInsKey + "\")";
        } else {
            tooltip = pega.u.d.fieldValuesList.get("CreateInDevStudio");
            clickEvent = "pega.ui.inspector.fieldvalue.createNewFieldValue(\"" + fieldValueMeta.pyClassName + "\",\"" + fieldValueMeta.pyFieldName + "\",\"" + fieldValueMeta.pyFieldValue + "\")";
        }

        strHTML += "<a class='runtime-edit-icon live-ui-open-rule' title='" + tooltip + "' onclick='" + clickEvent + "'></a>";

        strHTML += "<a class='runtime-edit-icon runtime-edit-info' onclick='pega.ui.inspector.fieldvalue.showInfo(event, \"" + inspectorElementID +"\", " + fieldValueIndex + ")'> </a>";

        strHTML += "</span>";

        return strHTML;
    }

    /**
     * @private Builds up the HTML markup for an individual control node
     *
     * @param $Inspector Element$ currentInspectorObject - The current inspector object
     * @param $Boolean$ missingFieldValueCount - The amount of field values contained in this control
     * @return $String$ strHTML - The html markup to be used
     **/
    function _buildControlNodeHTML(currentInspectorObject, missingFieldValueCount) {
        var strHTML = "<span class='meta-title'>";
        strHTML += pega.ui.inspector.utilities.displayUIElementText(currentInspectorObject.getAllAttributes());

        // If there are any missing field values display the total
        if (missingFieldValueCount > 0) {
            strHTML += "<span class='runtime-tree-prefix'> (" + missingFieldValueCount + ")</span>";
        }

        strHTML += "</span>";

        return strHTML;
    }

    /**
     * @private Builds up the HTML markup for an individual control node
     *
     * @param $Inspector Element$ currentInspectorObject - The current inspector object
     * @return $String$ strHTML - The html markup to be used
     **/
    function _buildFocusedInfoBarContent(inspectorObject) {
        var newContent = pega.ui.inspector.utilities.getHoverInfoBarContent(inspectorObject);
        // Create icon container for all right aligned icons
        var iconContainer = pega.ui.inspector.utilities.createElement("DIV", {
            className: "idpanel-icon-container"
        });

        // TODO: This does not work because the inspectorObject thinks the tree is enabled 
        // therefor the getNearestParent uses the tree which will never have any sections 

        // If current element is a section set parent to itself otherwise call getNearestParent to find parent Section/Harness for open rule icon
        var oParent;
        if ((inspectorObject && inspectorObject.get("insKey") && inspectorObject.get("insKey") != "") ||
            (inspectorObject.get("type") && inspectorObject.get("type") == "Section") ||
            (inspectorObject.get("subType") && (inspectorObject.get("subType") == "SUB_SECTION" || inspectorObject.get("subType") == "PANEL"))) {
            oParent = inspectorObject;
        } else {
            var tempTypes = [{
                "type": "Section"
            }, {
                "type": "Harness"
            }];
            oParent = pega.ui.inspector.parser.getNearestParent(inspectorObject, tempTypes);
        }

        // OPEN RULE ICON
        if (oParent && oParent.get("insKey") && oParent.get("insKey") != "") {
            var attributes = {
                className: "runtime-edit-icon live-ui-open-rule",
                title: pega.u.d.fieldValuesList.get("OpenInDevStudio")
            };
            var clickEvent = function() {
                pega.ui.inspector.fieldvalue.openFieldValue(oParent.get("insKey"))
            };
            var openRuleIcon = pega.ui.inspector.utilities.createElement("A", attributes, {
                "click": clickEvent
            });
            iconContainer.appendChild(openRuleIcon);
            newContent.appendChild(iconContainer);
        }

        return newContent;
    }
  
    /**
     * @private Takes in an element and checks if one of the root nodes exists a model with that element
     *
     * @param $HTML Element$ elemeent - The HTML element to try and find the corrasponding Inspector Element object
     * @return $Inspector Element$ returnModel - The Inspector element model that was found or null
     */
    function _getInspectorObjectByElement(element) { 
        var returnModel = null;

        // Loop over root nodes and call their findByElement function to try and find object
        for (var i = 0; i < _inspectorObjectsRootNodes.length; i++) {
            returnModel = _inspectorObjectsRootNodes[i].findByElement(element);

            // If the model is found then drop out of loop
            if (returnModel) {
                break;
            }
        }

        return returnModel;
    };


    function _initializeObjects() {
        var containerDiv = document.createElement("DIV");
        containerDiv.classList.add("fieldvalue-inspector-elements");
        document.body.appendChild(containerDiv);

        _fieldValueInfo = new pega.ui.inspector.Overlay.DismissOnMouseOut("inspector-overlay quickinfo", containerDiv, null, {dataTestId : "field-value-info"});

        // Helper for highlights to know when to stop bubbling
        function isValidElement(element) {
            var inspectorObject = _getInspectorObjectByElement(element)
            
            if (inspectorObject && inspectorObject.hasFieldValues) {
                return true;
            }
            return false;
        }

        // Hover over inspector 
        _hoverInspector = new pega.ui.inspector.utilities.InspectorHighlight({
            highlight: {
                customClass: "primaryTreeHighlight",
                container: containerDiv
            },
            infoBar: {
                customClass: "inspectorTreeIdPanel",
                container: containerDiv,
                options: {
                    confinementElement: pega.ui.inspector.getTopHarness(),
                    offset: 2
                }
            },
            getInfoBarContent: function(element) {
                var inspectorObject = _getInspectorObjectByElement(element)
                return pega.ui.inspector.utilities.getHoverInfoBarContent(inspectorObject);
            },
            ignoreList: [".right-panel-dock", ".fieldvalue-inspector-elements", ".localization-toggle"],
            isValidElement: isValidElement,
            elementFoundCallback: function(returnObj) {
                var inspectorObject = _getInspectorObjectByElement(returnObj.foundElement)
                if (inspectorObject) {
                    _tree.hoverNode(inspectorObject.id, true);
                }
                if (_clickInspector.getHighlightedElement() === returnObj.foundElement) {
                    _hoverInspector.clearHighlight();
                }
            }
        });

        // Mouse click inspector
        _clickInspector = new pega.ui.inspector.utilities.InspectorHighlight({
            highlight: {
                customClass: "secondaryTreeHighlight",
                container: containerDiv
            },
            infoBar: {
                customClass: "inspectorTreeSecIdPanel",
                container: containerDiv,
                options: {
                    confinementElement: pega.ui.inspector.getTopHarness(),
                    offset: 2
                }
            },
            eventsToBlockList: ["dblclick", "contextmenu", "keydown", "keyup", "mousedown", "mouseup"],
            getInfoBarContent: function(element) {
                var inspectorObject = _getInspectorObjectByElement(element)
                return _buildFocusedInfoBarContent(inspectorObject);
            },
            ignoreList: [".right-panel-dock", ".fieldvalue-inspector-elements", ".localization-toggle"],
            eventMonitored: "click",
            isValidElement: isValidElement,
            elementFoundCallback: function(returnObj) {
                var inspectorObject = _getInspectorObjectByElement(returnObj.foundElement)
                if (inspectorObject) {
                    _tree.selectNode(inspectorObject.id, true)
                    if (_hoverInspector.getHighlightedElement() === returnObj.foundElement) {
                        _hoverInspector.clearHighlight();
                        _tree.dehoverAll();
                    }
                } 
            }
        })

        // Tree object
        _tree = new pega.ui.components.Tree(document.querySelector('.field-value-tree'), {
            selectCallback: function(id) {
                var inspectorObject = pega.ui.inspector.fieldvalue.getInspectorObjectByID(id);
                var element = inspectorObject.get("element")[0];
                _clickInspector.highlightElement(element)

                if (_hoverInspector.getHighlightedElement() === element) {
                    _hoverInspector.clearHighlight();
                }
            },
            hoverCallback: function(id) {
                var inspectorObject = pega.ui.inspector.fieldvalue.getInspectorObjectByID(id);     
                var element = inspectorObject.get("element")[0];
                if (_clickInspector.getHighlightedElement() === element) {
                    _hoverInspector.clearHighlight();
                } else {
                    _hoverInspector.highlightElement(inspectorObject.get("element")[0])
                }
            }
        });
    }

    /**
     * @private Called on hide to clean up
     */
    function _deactivate() {
        document.querySelector(".fieldvalue-panel").classList.remove("interaction-enabled");
        document.querySelector(".field-value-tree").classList.remove("ui-tree-readonly");      

        var container = document.querySelector(".fieldvalue-inspector-elements");
        document.body.removeChild(container);

        // Deactivate button
        var toggle = document.querySelector(".localization-toggle");
        if (toggle != null) {
            toggle.classList.remove("inspector-active");
        }
      
        // Reset the dock back to the original z index
        _panel.getElement().parentElement.style.zIndex = _originalDockIndex;
      
        _fieldValueInfo.removeFromDom();
        _clickInspector.destroy();
        _hoverInspector.destroy();
        _tree.destroy();   
      
        _fieldValueInfo = null;
        _clickInspector = null;
        _hoverInspector = null;
        _tree = null;
    }

    /**
     * @public initializes field value tree
    */
    function _activate() {
        // Init the info panel/highlights/tree
        _initializeObjects();

        // Activate button
        var toggle = document.querySelector(".localization-toggle");
        if (toggle != null) {
            toggle.classList.add("inspector-active");
        }
      
        // Update the dock element z-index to float above 
        _originalDockIndex = _panel.getElement().parentElement.style.zIndex;
        _panel.getElement().parentElement.style.zIndex = '300';

        // Refresh and turn on the inspectors
        publicAPI.refresh();
        _hoverInspector.enable();
        _clickInspector.enable();
    };

    /////////////////////////////////////////////////////////////////////////////////
    //                              PUBLIC API                                     //
    /////////////////////////////////////////////////////////////////////////////////
    var publicAPI = {};
    /**
     * @public called to toggle on the inspector from the UI
     */
    publicAPI.toggle = function() {
        if (pega.ui.inspector.isActive()) return;
      
        if (_panel == null) {
            // Create the panel the first time toggle is called
            var panelOptions = {
                showCallback : _activate,
                preHide : function() {
                    _hoverInspector.clearHighlight();
                    _hoverInspector.disable();
                    _clickInspector.clearHighlight();
                    _clickInspector.disable();
                },
                hideCallback : _deactivate
            }
    
            // Add panel to the correct doc
            _panel = new pega.ui.components.panels.ClassLoader("fieldvalueInspector", panelOptions);
            _panel.getElement().classList.add('fieldvalue-panel');
            pega.ui.panelManager.registerPanel(_panel, pega.ui.panelConstants.DOCK_LOCATION.RIGHT);

            // Load the content into the panel and show
            _panel.loadByClass("Pega-UI-PanelContent-LocalizationInspector",  _panel.show);
        } else if (_panel.isShowing()) {
            _panel.hide();
        } else {
            _panel.show();
        }
    }

    /**
     * @public Called to see the state of the field value inspector
     */
    publicAPI.isActive = function() {
        return (_panel && _panel.isShowing());
    }
  
      /**
     * @public Called to refresh the field value tree
     */
    publicAPI.refresh = function() {
        if (pega.ui.inspector.getDesktopWindowInspectorProxy().getDesktopWindow() != window && pega.ui.inspector.getDesktopWindowInspectorProxy().fieldvalue != null) {
            return pega.ui.inspector.getDesktopWindowInspectorProxy().fieldvalue.refresh();
        } else {
            pega.ui.inspector.parser.setMetaAttr('data-fieldvalue-meta');
            // Call parser to parse the dom and retrieve all Inspector elements
            var returnObj = pega.ui.inspector.parser.buildModel(document.body);
			pega.ui.inspector.parser.setMetaAttr('data-ui-meta');

            // Based on the return object from buildModel store off _inspectorObjectsRootNodes and _inspectorObjectsByID globals
            _inspectorObjectsByID = returnObj.lookupByID;
            _inspectorObjectsRootNodes = returnObj.rootNodes;
            var treeJSON = [];

            for (var key in _inspectorObjectsByID) {
                var currentInspectorObject = _inspectorObjectsByID[key];

                if (currentInspectorObject.hasFieldValues) {
                    var fieldValueData = currentInspectorObject.getFieldValues();
                    var missingFieldValueCount = 0;

                    // Make an empty control node object so we can add children to it
                    var tempObj = {
                        id: currentInspectorObject.id,
                        children: []
                    };

                    // Loop over all field values for the control
                    for (var i = 0; i < fieldValueData.length; i++) {
                        var fieldValueNodeClassName = "field-value-exists";

                        // If the field value entry has no pzInsKey then it does not exist and should be accounted for
                        if (fieldValueData[i].pzInsKey == "") {
                            missingFieldValueCount += 1;
                            fieldValueNodeClassName = "field-value-doesnt-exist";
                        }

                        // Push a new field value tree node into the children of the control
                        // also adds a lookup id so that on hover/focus the control is hovered/focused
                        tempObj.children.push({
                            lookup: currentInspectorObject.id,
                            text: _buildFieldValueNodeHTML(fieldValueData[i], currentInspectorObject.id, i),
                            li_attr: { "class": fieldValueNodeClassName }
                        });
                    }

                    // If there are field values in this control that do not exist then change the style
                    if (missingFieldValueCount > 0) {
                        tempObj.li_attr = { "class": "missing-field-values" };
                    } else {
                        tempObj.li_attr = { "class": "not-missing-field-values" };
                    }

                    // Build up the control nodes markup
                    tempObj.text = _buildControlNodeHTML(currentInspectorObject, missingFieldValueCount);

                    // Add entire control node with children to master List
                    treeJSON.push(tempObj);
                }
            }

            if(_tree)_tree.populate(treeJSON);
        }
    }

    /**
     * @public Called to open the field value based on the given inskey
     * 
     * @param insKey - the pzInsKey of the rule to open
     */
    publicAPI.openFieldValue = function(insKey) {
        var callback = function(win) {
            // If opening in designer studio and inspector is on turn it off
            if (win.pega.u.d.getHarnessClass() == "Data-Portal-DesignerStudio" && 
                win.pega.u.d.getHarnessPurpose() == "pzStudio" && 
                win.pega.ui.inspector.fieldvalue.isActive()) {
                // If the inspector is on then turn it off
                win.pega.ui.inspector.fieldvalue.toggle();
            }
        }

        pega.ui.inspector.utilities.openRuleByInsKey(insKey, callback);
    }

    /**
     * @public Called from non-existent field values to show the new ruleform
     *
     * @param $String$ pyClassName The class name of the field value to be created (ex. Work-)
     * @param $String$ pyFieldName The name of the field value to be created (ex. pyCaption)
     * @param $String$ pyFieldValue The value of the field value to be created (ex. Create)
     */
    publicAPI.createNewFieldValue = function(pyClassName, pyFieldName, pyFieldValue) {
        // Clear all Highlights
        pega.ui.inspector.hideAllOverlays();

        // Build up XML string for the new ruleform to use for population
        var strXML = "<pagedata>";
        strXML += "<pxObjClass>Rule-Obj-FieldValue</pxObjClass>";
        strXML += "<pyClassName>" + pyClassName + "</pyClassName>";
        strXML += "<pyFieldName>" + pyFieldName + "</pyFieldName>";
        strXML += "<pyFieldValue>" + pyFieldValue + "</pyFieldValue>";
        strXML += "<pyRefToFocusKey>" + pyFieldValue + "</pyRefToFocusKey>";
        strXML += "<pyDPClassName></pyDPClassName>";
        strXML += "</pagedate>";

        // Get a handle on the Designer Studio window
        var oAttachedDesktop = pega.desktop.support.getAttachedDesignerDesktop();

        // If the Attached Desktop window is Designer Studio
        if (oAttachedDesktop.pega.u.d.getHarnessClass() == "Data-Portal-DesignerStudio" && 
            oAttachedDesktop.pega.u.d.getHarnessPurpose() == "pzStudio") {
            // If the current window is also designer studio then turn off Live UI
            if (oAttachedDesktop.pega.ui.inspector.fieldvalue.isActive()) {
                oAttachedDesktop.pega.ui.inspector.fieldvalue.toggle();
            }
        } else {
            // If there is no Designer Studio available then open in popup
            oAttachedDesktop.pega.desktop.showNextInWindow();
        }

        // Call open new rule form api and pass along XML for pre population
        // TODO: May need to also verify if oPega_openRuleManager does exist
        // could be an edge case since it should always. If we ever defer load
        // the tree this will need to be re-thought
        oAttachedDesktop.oPega_openRuleManager.pega_openRuleInNewDialogue(strXML);
        return strXML;
    }

    /**
     * @public Called to show the info panel for field values in the field value tree
     *
     * @param $Event$ e - the event Object
     * @param $String$ inspectorElementID - the id of the inspector element this relates to
     * @param $Integer$ fieldValueIndex - the index of the field value to display info for
     */
    publicAPI.showInfo = function(e, inspectorElementID, fieldValueIndex) { 
        var container = [];
        var fieldValueData = pega.ui.inspector.fieldvalue.getInspectorObjectByID(inspectorElementID).getFieldValues();
        fieldValueData = fieldValueData[fieldValueIndex];

        // Generate element for field name
        var pyFieldNameRow = pega.ui.inspector.utilities.createElement("DIV");
        pyFieldNameRow.appendChild(pega.ui.inspector.utilities.createElement("SPAN", { className : "RuntimeInspectorLabel", innerHTML : "Name - " }));
        pyFieldNameRow.appendChild(pega.ui.inspector.utilities.createElement("SPAN", { className : "RuntimeInspectorValue", innerHTML : fieldValueData.pyFieldName }));
        container.push(pyFieldNameRow);

        // Generate element for field value
        var pyFieldValueRow = pega.ui.inspector.utilities.createElement("DIV");
        pyFieldValueRow.appendChild(pega.ui.inspector.utilities.createElement("SPAN", { className : "RuntimeInspectorLabel", innerHTML : "Value - " }));
        pyFieldValueRow.appendChild(pega.ui.inspector.utilities.createElement("SPAN", { className : "RuntimeInspectorValue", innerHTML : fieldValueData.pyFieldValue }));
        container.push(pyFieldValueRow);

        // Generate element for localized value if the current field value has an pzInsKey
        if (fieldValueData.pzInsKey != "") {
            var pyLocalizedValueRow = pega.ui.inspector.utilities.createElement("DIV");
            pyLocalizedValueRow.appendChild(pega.ui.inspector.utilities.createElement("SPAN", { className : "RuntimeInspectorLabel", innerHTML : "Localized value - " }));
            pyLocalizedValueRow.appendChild(pega.ui.inspector.utilities.createElement("SPAN", { className : "RuntimeInspectorValue", innerHTML : fieldValueData.pyLocalizedValue }));
            container.push(pyLocalizedValueRow);
        }

        // Generate element for class name
        var pyClassNameRow = pega.ui.inspector.utilities.createElement("DIV");
        pyClassNameRow.appendChild(pega.ui.inspector.utilities.createElement("SPAN", { className : "RuntimeInspectorLabel", innerHTML : "Class - " }));
        pyClassNameRow.appendChild(pega.ui.inspector.utilities.createElement("SPAN", { className : "RuntimeInspectorValue", innerHTML : fieldValueData.pyClassName }));
        container.push(pyClassNameRow);

        // Generate row for pyRuleSet if it exists
        if (fieldValueData.pyRuleSet != "") {
            var pyRuleSetRow = pega.ui.inspector.utilities.createElement("DIV");
            pyRuleSetRow.appendChild(pega.ui.inspector.utilities.createElement("SPAN", { className : "RuntimeInspectorLabel", innerHTML : "Ruleset - " }));
            pyRuleSetRow.appendChild(pega.ui.inspector.utilities.createElement("SPAN", { className : "RuntimeInspectorValue", innerHTML : fieldValueData.pyRuleSet }));
            container.push(pyRuleSetRow);
        }

        // Set the content of the overlay to all the rows and show it
        if(_fieldValueInfo){
          _fieldValueInfo.setContent(container);
          _fieldValueInfo.showByEvent(e);
        }
        
        return container;
    }
  
     /**
     * @public Takes in an ID and checks if one of the root nodes contain a model with that id
     *
     * @param $String$ ID - The ID to try and find the corrasponding Inspector Element object for
     * @return $Inspector Element$ returnModel - The Inspector element model that was found or null
     */
    publicAPI.getInspectorObjectByID = function(ID) { 
        return _inspectorObjectsByID[ID];
    };
  
      /**
     * @public Public function used to toggle live UI suppression
     */
    publicAPI.toggleSuppression= function() {
        if (pega.ui.inspector.getDesktopWindowInspectorProxy().getDesktopWindow() !== window &&
            pega.ui.inspector.getDesktopWindowInspectorProxy().fieldvalue !== null) {
            return pega.ui.inspector.getDesktopWindowInspectorProxy().fieldvalue.toggleSuppression();
        } else {
            var inspectors = [_hoverInspector, _clickInspector]; 
            pega.ui.inspector.utilities.toggleInteraction(inspectors, _panel, _tree, {
              disableCallback: pega.ui.inspector.fieldvalue.refresh
            });                  
        }                                         
    }
    
    return publicAPI;
}());
//static-content-hash-trigger-GCC
var $pNamespace = pega.namespace;
$pNamespace("pega.ui.inspector");

// The editor is a singleton class which returns its public methods.
pega.ui.inspector.accessibility = (function () {
    var publicAPI = {};

    publicAPI.FILTERS = {
        PROTANOPIA: "Protanopia",
        PROTANOMALY: "Protanomaly",
        DEUTERANOPIA: "Deuteranopia",
        DEUTERANOMALY: "Deuteranomaly",
        TRITANOPIA: "Tritanopia",
        TRITANOMALY: "Tritanomaly",
        ACHROMATOPSIA: "Achromatopsia",
        ARCHROMANTOMALY: "Achromatomaly"
    }

    /////////////////////////////////////////////////////////////////////////////////
    //                              GLOBALS                                        //
    /////////////////////////////////////////////////////////////////////////////////
    /* -- PRIVATE GLOBALS -- */
    var _objectsToHighlight = [];
    var _highlightInstances = [];
    var _rehighlightTimeoutId;
    var _treeJSON = [];
    var _tempTreeJSON = [];
    var _firstHarnessChecked = false;
    var _inspectorObjectsByID;
    var _inspectorObjectsRootNodes;
    var _issueCount = 0;
    var _buttonMissingAlt = false;
    var _tree = null;
    var _panel = null;
    var _showWarnings = true;
    var _highlightEnabled = false;
    var _originalDockIndex;

    /* INSPECTORS */
    var _hoverInspector;
    var _clickInspector;

    /* -- PUBLIC GLOBALS -- */

    /////////////////////////////////////////////////////////////////////////////////
    //                              PRIVATE FUNCTIONS                              //
    /////////////////////////////////////////////////////////////////////////////////


    /**
     * @private Factory like method to call the associated parsers that violate WCAG accessibility criteria
     * @param $Inspector Element$ currentInspectorObject - The current inspector object
     **/
    function _accessibilityParser(currentInspectorObject) {

        if (currentInspectorObject === undefined || currentInspectorObject.getAllAttributes() === undefined) return;

        _parseForLegacyLayouts(currentInspectorObject);
        _parseForGridSummary(currentInspectorObject);
        _parseForGridColumnHeaders(currentInspectorObject);
        _parseForSectionsMissingHeaders(currentInspectorObject);
        _parseForHeadingTagNotInProperOrder(currentInspectorObject);
        _parseForColumnLayoutNavigationMenuLocation(currentInspectorObject);

        if (currentInspectorObject.get("type") === "Harness" && !_firstHarnessChecked) {
            _parseForQuickAccessAnchorLinksRequired(currentInspectorObject);
            _parseForMultipleMainTags(currentInspectorObject);
            _parseForNavigationLandmarkRole(currentInspectorObject);
            _parseForSearchGadget(currentInspectorObject);
            _parseForScreenLayoutNavigationMenuLocation(currentInspectorObject);
            _firstHarnessChecked = true;
        }

        // no need to parse for accessibility issues for layouts/section includes after this point
        if (currentInspectorObject.get("type") !== "Cell" || (
          currentInspectorObject.get("subType") &&
          currentInspectorObject.get("subType").toLowerCase() === "pxhidden")) return;
      
            
        //need to consider client side visibility for controls and filter out custom/non-autogen controls
        if(currentInspectorObject.get("element")[0].style.visibility === "hidden" || 
           currentInspectorObject.get("element")[0].style.display === "none" ||
           currentInspectorObject.get("element")[0].className.indexOf("show-space") !== -1 ||
           currentInspectorObject.get("element")[0].className.indexOf("custom-control") !== -1 ) return;
      

        _parseForMissingAltDescriptions(currentInspectorObject); // missing alt should be called before missing label
        _parseForMissingLabelText(currentInspectorObject);
        _parseForMissingAssociatedLabel(currentInspectorObject);
        _parseForMissingKeyboardInteractivity(currentInspectorObject);
        _parseForScreenLoadSettingForShowMenuAction(currentInspectorObject);
        _parseForMissingClearErrorText(currentInspectorObject);
        _parseForAllCapsText(currentInspectorObject);
    }

    /**
     * @private method to find missing alt descriptions
     * @param $Inspector Element$ currentInspectorObject - The current inspector object
     **/
    function _parseForMissingAltDescriptions(currentInspectorObject) {
        var missingAlt = true;
        var subType = currentInspectorObject.get("subType");

        // function to recursivly check all children to see if there is an alt text set
        function allDescendants(node) {
            for (var i = 0; i < node.childNodes.length; i++) {
                var child = node.childNodes[i];
                // nodeType of 3 and 8 is text/comment node which we can't get attributes on so skip
                if (child.nodeType !== 3 &&
                    child.nodeType !== 8 && ((
                        child.getAttribute('ALT') !== null &&
                        child.getAttribute('ALT').replace(/\s/g, "") !== "") || (child.getAttribute('TITLE') !== null &&
                        child.getAttribute('TITLE').replace(/\s/g, "") !== ""))) {
                    missingAlt = false;
                    return;
                }
                allDescendants(child);
            }
        }

        // only need to check for alt descriptions on images/icons/buttons
        if (subType &&
            subType !== undefined && ((
                    subType.toLowerCase().indexOf("button") !== -1 &&
                    subType.toLowerCase().indexOf("radio") === -1) ||
                subType.toLowerCase().indexOf("icon") !== -1)) {

            allDescendants(currentInspectorObject.get("element")[0]);
            if (missingAlt === true && subType.toLowerCase().indexOf("button") !== -1) {
                _buttonMissingAlt = true;
            } else if (missingAlt === true) _createAccessibilityIssue(currentInspectorObject, "Provide a helper text");
        }
    }

    /**
     * @private method to find missing label text on buttons
     * @param $Inspector Element$ currentInspectorObject - The current inspector object
     **/
    function _parseForMissingLabelText(currentInspectorObject) {
        var subType = currentInspectorObject.get("subType");
        // exit function if it is a radio button
        if (subType &&
            subType !== undefined &&
            subType.toLowerCase().indexOf("radio") !== -1) {
            return;
        }

        // check both modern and legacy buttons
        if (subType &&
            subType !== undefined &&
            subType.toLowerCase().indexOf("button") !== -1 &&
            currentInspectorObject.get("element")[0].getElementsByTagName('BUTTON').length > 0 &&
            currentInspectorObject.get("element")[0].getElementsByTagName('BUTTON')[0].innerText.replace(/\s/g, "") === "" &&
            _buttonMissingAlt) {
            _createAccessibilityIssue(currentInspectorObject, "Provide a helper text or label");
            _buttonMissingAlt = false;
            return;
        }
        _buttonMissingAlt = false;
    }

    /**
     * @private method to find missing associated labels
     * @param $Inspector Element$ currentInspectorObject - The current inspector object
     **/
    function _parseForMissingAssociatedLabel(currentInspectorObject) {
        var objectToInspect = currentInspectorObject.get("element")[0];
        var label = objectToInspect.getElementsByTagName('LABEL');

        var subType = currentInspectorObject.get("subType");
        if (subType && subType.toLowerCase().indexOf("label") === 0) return;
        
        // grid column headers act as labels for inputs so associated label is not required
        if(objectToInspect.tagName === "TD") return;

        // confirm this is a type of input
        if (objectToInspect.getElementsByTagName('INPUT').length === 0 &&
            objectToInspect.getElementsByTagName('TEXTAREA').length === 0 &&
            objectToInspect.getElementsByTagName('SELECT').length === 0) return;
      
        // check for aria-label, if it's present no accessibility issue
        var ariaLabels = objectToInspect.querySelectorAll("[aria-label]");
        if(ariaLabels && ariaLabels.length>0)return;
        
        // label tag is missing or empy
        if (label.length === 0 || (
                label.length === 1 && (
                    label[0].textContent.replace(/\s/g, "") === "" ||
                    label[0].textContent === null))) {
            _createAccessibilityIssue(currentInspectorObject, "Provide an associated label");
        } else if (objectToInspect.getElementsByClassName('checkbox').length > 0 &&
            label.length === 2 &&
            label[0].textContent.replace(/\s/g, "") === "" &&
            label[1].textContent.replace(/\s/g, "") === "") {
            // need to check that both caption and label are missing for checkbox for it to be an issue
            _createAccessibilityIssue(currentInspectorObject, "Provide an associated label");
        }
    }

    /**
     * @private method to find <H> header tags not in proper order
     * @param $Inspector Element$ currentInspectorObject - The current inspector object
     **/
    function _parseForHeadingTagNotInProperOrder(currentInspectorObject) {
        // function to recursivly check all parents to get header tag
        var hasHeaderInWrongOrder = false;
        var existingHeadingTag = null;

        function loopUpToGetNextHeading(node) {
            // loop up from current parent or section until you reach the first heading tag, compare with heading tag of layout/section
            if (node.parentNode) node = node.parentNode;
            else return;

            if (node.previousSibling &&
                node.previousSibling.className &&
                node.previousSibling.className.indexOf('header') === 0) {
                var headingTag = node.previousSibling.querySelectorAll('H1,H2,H3,H4,H5,H6');
                if (headingTag[0].tagName > existingHeadingTag) {
                    hasHeaderInWrongOrder = true;
                    return;
                }
            }
            loopUpToGetNextHeading(node);
        }

        function loopDownToGetHeaders(node) {
            // loop through children to get heading tag for the current section or layout - if you reach a data-ui-meta you've gone to far
            for (var i = 0; i < node.children.length; i++) {
                var child = node.children[i];
                if (child.tagName === 'H1' ||
                    child.tagName === 'H2' ||
                    child.tagName === 'H3' ||
                    child.tagName === 'H4' ||
                    child.tagName === 'H5' ||
                    child.tagName === 'H6') {
                    existingHeadingTag = child.tagName;
                    return;
                }
                if (existingHeadingTag) break;
                if (!child.hasAttribute("data-ui-meta")) loopDownToGetHeaders(child);
            }
        }

        // only run logic for sections or layouts
        if (currentInspectorObject.get("type") === 'Section' ||
            (currentInspectorObject.get("subType") &&
                currentInspectorObject.get("subType").toLowerCase() === 'sub_section') ||
            currentInspectorObject.get("type").toLowerCase() === 'layout') {

            // only run logic if you can find a heading tag
            if (currentInspectorObject.get("element")[0].querySelectorAll('H1,H2,H3,H4,H5,H6').length > 0) {
                loopDownToGetHeaders(currentInspectorObject.get("element")[0]);
                if (existingHeadingTag) loopUpToGetNextHeading(currentInspectorObject.get("element")[0]);
            }

            if (hasHeaderInWrongOrder) _createAccessibilityIssue(currentInspectorObject, "Heading levels hierarchy is out of order");

        }
    }

    /**
     * @private method to missing keyboard interactivity
     * @param $Inspector Element$ currentInspectorObject - The current inspector object
     **/
    function _parseForMissingKeyboardInteractivity(currentInspectorObject) {
        var missingKeyboardInteractivity = false;
        var subType = currentInspectorObject.get("subType");

        // function to recursivly check all children to see if there is an alt text set
        function allDescendants(node) {
            
            for (var i = 0; i < node.childNodes.length; i++) {
                var child = node.childNodes[i];

                // nodeType of 3 and 8 is text/comment node which we can't get attributes on so skip
                if (child.nodeType !== 3 && child.nodeType !== 8){
                                       
                   // if child has data-ui-meta need to not loop down 
                   if (child.hasAttribute("data-ui-meta")) continue; 
                  
                   if(child.hasAttribute('data-click') && 
                      (!child.hasAttribute('data-keydown') &&
                      !child.hasAttribute('data-keyup'))) {
                     
                        if(subType==="PXAUTOCOMPLETE" && child.tagName==="BUTTON") continue;
                        else if(subType==="PXMULTISELECT" && child.tagName==="I") continue;
                     
                        missingKeyboardInteractivity = true;
                        return;
                   }
                }
                allDescendants(child);
            }
        }

        if (subType &&
            subType !== undefined && ((
                    subType.toLowerCase().indexOf("button") !== -1 &&
                    subType.toLowerCase().indexOf("radio") === -1) ||
                subType.toLowerCase().indexOf("link") !== -1 ||
                subType.toLowerCase().indexOf("menu") !== -1 ||
                subType.toLowerCase().indexOf("checkbox") !== -1 ||
                subType.toLowerCase().indexOf("icon") !== -1)) {
            return;
        }

        allDescendants(currentInspectorObject.get("element")[0]);
        if (missingKeyboardInteractivity === true) {
            _createAccessibilityIssue(currentInspectorObject, "Also provide a comparable keyboard interaction");
        }
    }

    /**
     * @private method to find missing quick access option
     * @param $Inspector Element$ currentInspectorObject - The current inspector object
     **/
    function _parseForQuickAccessAnchorLinksRequired(currentInspectorObject) {
        var quickAccessMenu = document.querySelectorAll("[node_name='pySkipLinksToTarget']");
        if (quickAccessMenu.length !== 1) {
            _createAccessibilityIssue(currentInspectorObject, "Skip to content navigation is missing (include the PegaWAI ruleset)");
        }
    }

    /**
     * @private method to find missing clear error text
     * @param $Inspector Element$ currentInspectorObject - The current inspector object
     **/
    function _parseForMissingClearErrorText(currentInspectorObject) {
        var element = currentInspectorObject.get("element")[0];
        var errors = element.getElementsByClassName('iconError');
        for (var i = 0; i < errors.length; i++) {
            if ((errors[i].innerText.replace(/\s/g, "") === '' 
                || errors[i].innerText.replace(/\s/g, "") === '**')
               && errors[i].title.replace(/\s/g, "") === '') {
                _createAccessibilityIssue(currentInspectorObject, "Provide a descriptive error message");
                break;
            }
        }
    }

    /**
     * @private method to report on legacy layouts
     * @param $Inspector Element$ currentInspectorObject - The current inspector object
     **/
    function _parseForLegacyLayouts(currentInspectorObject) {
        var subType = currentInspectorObject.get("subType");

        // check for smart layouts or free form layouts
        if (subType && (
                subType === "FREEFORM" ||
                subType === "TEMPLATE")) {
            _createAccessibilityIssue(currentInspectorObject, "Table-based layouts are deprecated, use Dynamic Layouts instead");

        }

        // check for legacy tabs
        if (subType &&
            subType === "TABGROUP") {
            _createAccessibilityIssue(currentInspectorObject, "Tab Group layouts are deprecated, use Layout Groups instead");

        }

        // check for legacy repeat horizontal/column repeat
        if (subType &&
            subType === "REPEATHORIZONTAL") {
            _createAccessibilityIssue(currentInspectorObject, "Repeat Horizontal layouts are deprecated, use a Table layout or Repeating Dynamic Layout instead");

        }

    }

    /**
     * @private method to find if sections are missing headers
     * @param $Inspector Element$ currentInspectorObject - The current inspector object
     **/
    function _parseForSectionsMissingHeaders(currentInspectorObject) {
        // function to recursivly check all children to get header tag
        var hasHeader = false;

        function allDescendants(node) {
            for (var i = 0; i < node.children.length; i++) {
                var child = node.children[i];
                if (child.tagName === 'H1' ||
                    child.tagName === 'H2' ||
                    child.tagName === 'H3' ||
                    child.tagName === 'H4' ||
                    child.tagName === 'H5' ||
                    child.tagName === 'H6') {
                    hasHeader = true;
                    return;
                }
                var isLayout = false;
                if (child.getAttribute('data-ui-meta')) {
                    var meta = child.getAttribute('data-ui-meta').replace(/'/g, '"');
                    try {
                        var json = JSON.parse(meta);
                        if (json.type === 'Layout') isLayout = true
                    } catch (e) {}
                }
                if (!child.hasAttribute("data-ui-meta") || isLayout) allDescendants(child);
            }
        }

        if (currentInspectorObject.get("type") === 'Section') {
            var section = currentInspectorObject.getAllAttributes().sectionChild;
            if (section &&
                section[0].querySelectorAll('H1,H2,H3,H4,H5,H6').length > 0) {
                allDescendants(section[0]);
            }

            if (!hasHeader) _createAccessibilityIssue(currentInspectorObject, "May be missing a header");

        }
    }

    /**
     * @private method to report on multiple main roles
     * @param $Inspector Element$ currentInspectorObject - The current inspector object
     **/
    function _parseForMultipleMainTags(currentInspectorObject) {
        var main = document.querySelectorAll("[role='main']");
        if (main.length > 1) {
            _createAccessibilityIssue(currentInspectorObject, "Main role should only appear once in the DOM");
        }
    }

    /**
     * @private method to report if the search role is missing on possible search gadgets
     * @param $Inspector Element$ currentInspectorObject - The current inspector object
     **/
    function _parseForSearchGadget(currentInspectorObject) {
        var searchGadget = document.querySelectorAll("[role='search']");
        if (searchGadget.length === 0) {
            _createAccessibilityIssue(currentInspectorObject, "Search role should be used if portal has a custom search gadget");
        }
    }

    /**
     * @private method to check that the grid summary field is populated
     * @param $Inspector Element$ currentInspectorObject - The current inspector object
     **/
    function _parseForGridSummary(currentInspectorObject) {
        var subType = currentInspectorObject.get("subType");
        var objectToInspect = currentInspectorObject.get("element")[0];

        // check for table based layouts with an empty summary attribute
        if (subType && (
                subType === "REPEATGRID" ||
                subType === "REPEATTREEGRID" ||
                subType === "REPEATTREE") &&
            objectToInspect.querySelector("table#gridLayoutTable[summary]") &&
            objectToInspect.querySelector("table#gridLayoutTable[summary]").summary.replace(/\s/g, "") === "") {
            _createAccessibilityIssue(currentInspectorObject, "May be missing a descriptive summary");
        }

    }

    /**
     * @private method to check that grid columns have headers
     * @param $Inspector Element$ currentInspectorObject - The current inspector object
     **/
    function _parseForGridColumnHeaders(currentInspectorObject) {
        var subType = currentInspectorObject.get("subType");
        var objectToInspect = currentInspectorObject.get("element")[0];

        if (subType === "REPEATGRID" || subType === "REPEATTREEGRID") {
            var columnHeaders = objectToInspect.querySelectorAll("[role='columnheader']");
            var headerMissing = false;
            for (var i = 0; i < columnHeaders.length; i++) {
                if (columnHeaders[i].textContent.replace(/\s/g, "") === "" &&
                   columnHeaders[i].className.indexOf("hiddenCell") == -1) headerMissing = true;
                if (headerMissing) break;
            }
            if (headerMissing) _createAccessibilityIssue(currentInspectorObject, "Provide a header for each column");
        } else if (subType === "REPEATTREE") {
            var headerCells = objectToInspect.getElementsByClassName("headerCell");
            for (var ii = 0; ii < headerCells.length; ii++) {
                if (headerCells[ii].className.indexOf('rowHandleHead') === -1) {
                    var headerDiv = headerCells[ii].getElementsByClassName('oflowDiv')[0];
                    headerDiv = headerDiv.childNodes[0];
                    if (headerDiv.nodeType === 3 && headerDiv.data.replace(/\s/g, "") === "") {
                        _createAccessibilityIssue(currentInspectorObject, "Provide a header for each column");
                        break;
                    }
                }
            }
        }
    }

    /**
     * @private method to check that the primary navigation menu should be set to have a role type of "Navigation"
     * and value as navigation for the dynamic layout surrounding the menu
     * @param $Inspector Element$ currentInspectorObject - The current inspector object
     **/
    function _parseForNavigationLandmarkRole(currentInspectorObject) {
        var primaryNavigation = document.querySelectorAll("[role='navigation']");
        if (primaryNavigation.length === 0) {
            _createAccessibilityIssue(currentInspectorObject, "Primary portal navigation may be missing a “navigation” role");
        }
    }

    /**
     * @private method to check that the primary navigation menu is in the approproiate place in a screen layout
     * @param $Inspector Element$ currentInspectorObject - The current inspector object
     **/
    function _parseForScreenLayoutNavigationMenuLocation(currentInspectorObject) {
        var element = currentInspectorObject.get("element")[0];
        var rightPanel = element.querySelectorAll('#sidebar-region-two');
        // the right panel in the screen layout is the only one that'll have issues
        if (rightPanel.length > 0) {
            // check for primary navigation in the right panel
            if (rightPanel[0].querySelectorAll("[role='navigation']").length > 0) {
                _createAccessibilityIssue(currentInspectorObject, "Navigation menus should not be in the right sidebar of a screen layout");
            }
        }
    }

    /**
     * @private method to check that the primary navigation menu is in the approproiate place in a column layout
     * @param $Inspector Element$ currentInspectorObject - The current inspector object
     **/
    function _parseForColumnLayoutNavigationMenuLocation(currentInspectorObject) {

        var subType = currentInspectorObject.get("subType");
        if (!subType) return;
        // only check column layouts
        else if (subType.toUpperCase() !== 'DYNAMICCOLUMN') return;
        var element = currentInspectorObject.get("element")[0]
        for (var i = 0; i < element.children.length; i++) {
            var column = null;
            // column-2 and column-3 are the sidebars of the column layout
            if (element.children[i].className.indexOf('column-2') !== -1 || element.children[i].className.indexOf('column-3') !== -1) column = element.children[i];
            if (column && column.querySelectorAll("[role='navigation']").length > 0) {
                _createAccessibilityIssue(currentInspectorObject, "Navigation menus should not be in the sidebar of a column layout");
                break;
            }
        }
    }

    /**
     * @private method to check that the load behavior is "Screen Load"  for the show menu actions.
     * Use "on first use" or "refresh on display" is selected only when their is a tooltip on the
     * link/button/image launching the menu
     * @param $Inspector Element$ currentInspectorObject - The current inspector object
     **/
    function _parseForScreenLoadSettingForShowMenuAction(currentInspectorObject) {
        var objectToInspect = currentInspectorObject.get("element")[0];
        var flagScreenLoadAction = false;
        var attributes = objectToInspect.querySelectorAll("[data-click]");
        for (var i = 0; i < attributes.length; i++) {
            var dataClick = attributes[i].getAttribute('data-click').replace(/'/g, '"');
            try {
                var json = JSON.parse(dataClick);
                if (json[0][0] === 'showMenu' && json[0][1][0].loadBehavior !== 'screenload') flagScreenLoadAction = true;
            } catch (e) {}
        }
        if (flagScreenLoadAction) _createAccessibilityIssue(currentInspectorObject, "'At screen load' setting is recommended when using Menu action");
    }

  
        /**
     * @private method to check for all CAPS text. CAPS text gets read off letter by letter so should 
     * be flagged as a warning
     * @param $Inspector Element$ currentInspectorObject - The current inspector object
     **/
    function _parseForAllCapsText(currentInspectorObject) {
        var objectToInspect = currentInspectorObject.get("element")[0];
        var str = objectToInspect.textContent;
      
        // replace punctuation, whitespace, numbers
        var punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;
        var spaceRE = /\s+/g;
        var numberRE =  /[0-9]/g
        str = str.replace(punctRE, '').replace(spaceRE, '').replace(numberRE, '');
        // check for valid string
        if(str === undefined || !str || str === '') return;
        // check for uppercase
        if(str === str.toUpperCase())_createAccessibilityIssue(currentInspectorObject, "Screen readers interpret all capital letters as initials. Use platform helper class 'text-uppercase' instead.");
    }

  
  
    /**
     * @private Builds up the HTML markup for an individual accessibility node in the tree
     * @param $Inspector Element$ currentInspectorObject - The current inspector object
     * @param $String$ issueDescription - description of accessibility issue
     * @return $String$ strHTML - The html markup to be used
     **/
    function _buildAccessibilityValueNodeHTML(currentInspectorObject, issueDescription) {
        var strHTML = "<span class='meta-title issue-heading' title='" + issueDescription + "'>";
        strHTML += "<span class='RuntimeInspectorValue issue-description'>" + issueDescription + "</span>";
        strHTML += "</span>";
        return strHTML;
    }

    /**
     * @private Builds up the HTML markup for an individual control node
     *
     * @param $Inspector Element$ currentInspectorObject - The current inspector object
     * @return $String$ strHTML - The html markup to be used
     **/
    function _buildFocusedInfoBarContent(inspectorObject) {
        var newContent = pega.ui.inspector.utilities.getHoverInfoBarContent(inspectorObject);
        // Create icon container for all right aligned icons
        var iconContainer = pega.ui.inspector.utilities.createElement("DIV", {
            className: "idpanel-icon-container"
        });

        // If current element is a section set parent to itself otherwise call getNearestParent to find parent Section/Harness for open rule icon
        var oParent;
        if ((inspectorObject && inspectorObject.get("insKey") && inspectorObject.get("insKey") != "") ||
            (inspectorObject.get("type") && inspectorObject.get("type") == "Section") ||
            (inspectorObject.get("subType") && (inspectorObject.get("subType") == "SUB_SECTION" || inspectorObject.get("subType") == "PANEL"))) {
            oParent = inspectorObject;
        } else {
            var tempTypes = [{
                "type": "Section"
            }, {
                "type": "Harness"
            }];
            oParent = pega.ui.inspector.parser.getNearestParent(inspectorObject, tempTypes);
        }

        // OPEN RULE ICON
        if (oParent && oParent.get("insKey") && oParent.get("insKey") != "") {
            var attributes = {
                className: "runtime-edit-icon live-ui-open-rule",
                title: pega.u.d.fieldValuesList.get("OpenInDevStudio")
            };
            var clickEvent = function () {
                pega.ui.inspector.accessibility.openSection(oParent.get("insKey"))
            };
            var openRuleIcon = pega.ui.inspector.utilities.createElement("A", attributes, {
                "click": clickEvent
            });
            iconContainer.appendChild(openRuleIcon);
            newContent.appendChild(iconContainer);
        }

        return newContent;
    }

    /**
     * @private creates the accessibility issue node that gets added to the accessibility tree
     * @param $Inspector Element$ currentInspectorObject - The current inspector object
     * @param $String$ issueDescription - description of accessibility issue
     **/
    function _createAccessibilityIssue(currentInspectorObject, issueDescription) {
        _issueCount += 1;
        var child = {
            id: currentInspectorObject.id,
            text: _buildAccessibilityValueNodeHTML(currentInspectorObject, issueDescription),
            li_attr: {
                "class": "accessibility-issue "
            }
        }

        _tempTreeJSON.push(child);
    }

    /**
     * @private Handles repositioning all of the issues that have been highligted
     */
    function _rehighlightAllIssues() {
        for (var i = 0; i < _highlightInstances.length; i++) {
            _highlightInstances[i].highlight.showByElement(_highlightInstances[i].element);
        }
    }

    function _createTreeStructure() {
        // create initial objects
        var _contentObj = {
            children: []
        };
        _contentObj.li_attr = {
            "class": "accessibility-issues"
        };
        _contentObj.text = 'Content';

        var _structuralObj = {
            children: []
        };
        _structuralObj.li_attr = {
            "class": "accessibility-issues"
        };
        _structuralObj.text = 'Structural';

        var _interactivityObj = {
            children: []
        };
        _interactivityObj.li_attr = {
            "class": "accessibility-issues"
        };
        _interactivityObj.text = 'Interactivity';

        var _compatibilityObj = {
            children: []
        };
        _compatibilityObj.li_attr = {
            "class": "accessibility-issues"
        };
        _compatibilityObj.text = 'Compatibility';

        // loop through temp tree and categorize
        var _legacyLayouts = {
            children: []
        };
        var _gridSummary = {
            children: []
        };
        var _gridColumnHeaders = {
            children: []
        };
        var _sectionsMissingHeaders = {
            children: []
        };
        var _headingTagNotInProperOrder = {
            children: []
        };
        var _columnLayoutNavigationMenuLocation = {
            children: []
        };
        var _quickAccessAnchorLinksRequired = {
            children: []
        };
        var _multipleMainTags = {
            children: []
        };
        var _navigationLandmarkRole = {
            children: []
        };
        var _searchGadget = {
            children: []
        };
        var _screenLayoutNavigationMenuLocation = {
            children: []
        };
        var _missingAltDescriptions = {
            children: []
        };
        var _missingLabelText = {
            children: []
        };
        var _missingAssociatedLabel = {
            children: []
        };
        var _missingKeyboardInteractivity = {
            children: []
        };
        var _screenLoadSettingForShowMenuAction = {
            children: []
        };
        var _missingClearErrorText = {
            children: []
        };
        var _allCapsText = {
            children: []
        };


        _legacyLayouts.li_attr = {
            "class": "error"
        };
        _gridSummary.li_attr = {
            "class": "warning"
        };
        _gridColumnHeaders.li_attr = {
            "class": "error"
        };
        _sectionsMissingHeaders.li_attr = {
            "class": "warning"
        };
        _headingTagNotInProperOrder.li_attr = {
            "class": "error"
        };
        _columnLayoutNavigationMenuLocation.li_attr = {
            "class": "warning"
        };
        _quickAccessAnchorLinksRequired.li_attr = {
            "class": "error"
        };
        _multipleMainTags.li_attr = {
            "class": "error"
        };
        _navigationLandmarkRole.li_attr = {
            "class": "warning"
        };
        _searchGadget.li_attr = {
            "class": "warning"
        };
        _screenLayoutNavigationMenuLocation.li_attr = {
            "class": "warning"
        };
        _missingAltDescriptions.li_attr = {
            "class": "error"
        };
        _missingLabelText.li_attr = {
            "class": "error"
        };
        _missingAssociatedLabel.li_attr = {
            "class": "error"
        };
        _missingKeyboardInteractivity.li_attr = {
            "class": "error"
        };
        _screenLoadSettingForShowMenuAction.li_attr = {
            "class": "warning"
        };
        _missingClearErrorText.li_attr = {
            "class": "error"
        };
        _allCapsText.li_attr = {
            "class": "warning"
        };

        for (var i = 0; i < _tempTreeJSON.length; i++) {
            switch (true) {
                case (_tempTreeJSON[i].text.indexOf("layouts are deprecated") !== -1):
                    _createSubTreeStructure(_tempTreeJSON[i].text, _legacyLayouts, _tempTreeJSON[i]);
                    break;
                case (_tempTreeJSON[i].text.indexOf("May be missing a descriptive summary") !== -1):
                    _createSubTreeStructure(_tempTreeJSON[i].text, _gridSummary, _tempTreeJSON[i]);
                    break;
                case (_tempTreeJSON[i].text.indexOf("Provide a header for each column") !== -1):
                    _createSubTreeStructure(_tempTreeJSON[i].text, _gridColumnHeaders, _tempTreeJSON[i]);
                    break;
                case (_tempTreeJSON[i].text.indexOf("May be missing a header") !== -1):
                    _createSubTreeStructure(_tempTreeJSON[i].text, _sectionsMissingHeaders, _tempTreeJSON[i]);
                    break;
                case (_tempTreeJSON[i].text.indexOf("Heading levels hierarchy is out of order") !== -1):
                    _createSubTreeStructure(_tempTreeJSON[i].text, _headingTagNotInProperOrder, _tempTreeJSON[i]);
                    break;
                case (_tempTreeJSON[i].text.indexOf("Navigation menus should not be in the sidebar of a column layout") !== -1):
                    _createSubTreeStructure(_tempTreeJSON[i].text, _columnLayoutNavigationMenuLocation, _tempTreeJSON[i]);
                    break;
                case (_tempTreeJSON[i].text.indexOf("Skip to content navigation is missing (include the PegaWAI ruleset)") !== -1):
                    _createSubTreeStructure(_tempTreeJSON[i].text, _quickAccessAnchorLinksRequired, _tempTreeJSON[i]);
                    break;
                case (_tempTreeJSON[i].text.indexOf("Main role should only appear once in the DOM") !== -1):
                    _createSubTreeStructure(_tempTreeJSON[i].text, _multipleMainTags, _tempTreeJSON[i]);
                    break;
                case (_tempTreeJSON[i].text.indexOf("Primary portal navigation may be missing a “navigation” role") !== -1):
                    _createSubTreeStructure(_tempTreeJSON[i].text, _navigationLandmarkRole, _tempTreeJSON[i]);
                    break;
                case (_tempTreeJSON[i].text.indexOf("Search role should be used if portal has a custom search gadget") !== -1):
                    _createSubTreeStructure(_tempTreeJSON[i].text, _searchGadget, _tempTreeJSON[i]);
                    break;
                case (_tempTreeJSON[i].text.indexOf("Navigation menus should not be in the right sidebar of a screen layout") !== -1):
                    _createSubTreeStructure(_tempTreeJSON[i].text, _screenLayoutNavigationMenuLocation, _tempTreeJSON[i]);
                    break;
                case (_tempTreeJSON[i].text.indexOf("Provide a helper text") !== -1):
                    _createSubTreeStructure(_tempTreeJSON[i].text, _missingAltDescriptions, _tempTreeJSON[i]);
                    break;
                case (_tempTreeJSON[i].text.indexOf("Provide a helper text or label") !== -1):
                    _createSubTreeStructure(_tempTreeJSON[i].text, _missingLabelText, _tempTreeJSON[i]);
                    break;
                case (_tempTreeJSON[i].text.indexOf("Provide an associated label") !== -1):
                    _createSubTreeStructure(_tempTreeJSON[i].text, _missingAssociatedLabel, _tempTreeJSON[i]);
                    break;
                case (_tempTreeJSON[i].text.indexOf("Also provide a comparable keyboard interaction") !== -1):
                    _createSubTreeStructure(_tempTreeJSON[i].text, _missingKeyboardInteractivity, _tempTreeJSON[i]);
                    break;
                case (_tempTreeJSON[i].text.indexOf("'At screen load' setting is recommended when using Menu action") !== -1):
                    _createSubTreeStructure(_tempTreeJSON[i].text, _screenLoadSettingForShowMenuAction, _tempTreeJSON[i]);
                    break;
                case (_tempTreeJSON[i].text.indexOf("Provide a descriptive error message") !== -1):
                    _createSubTreeStructure(_tempTreeJSON[i].text, _missingClearErrorText, _tempTreeJSON[i]);
                    break;
                case (_tempTreeJSON[i].text.indexOf("Screen readers interpret all capital letters as initials") !== -1):
                    _createSubTreeStructure(_tempTreeJSON[i].text, _allCapsText, _tempTreeJSON[i]);
                    break;
                default:
                    break;
            }
        }


        // create HTML for category node
        var tempContentArray = [];
        _contentObj.children = tempContentArray.concat(_gridSummary, _gridColumnHeaders, _sectionsMissingHeaders, _missingAltDescriptions, _missingLabelText, _missingAssociatedLabel, _screenLoadSettingForShowMenuAction, _missingClearErrorText, _allCapsText);

        var tempStructuralArray = [];
        _structuralObj.children = tempStructuralArray.concat(_navigationLandmarkRole, _screenLayoutNavigationMenuLocation, _columnLayoutNavigationMenuLocation, _headingTagNotInProperOrder, _multipleMainTags);

        var tempInteractivityArray = [];
        _interactivityObj.children = tempInteractivityArray.concat(_searchGadget, _missingKeyboardInteractivity, _quickAccessAnchorLinksRequired);

        _compatibilityObj.children[0] = _legacyLayouts;

        _cleanupCategoryObjects(_contentObj);
        _cleanupCategoryObjects(_structuralObj);
        _cleanupCategoryObjects(_interactivityObj);
        _cleanupCategoryObjects(_compatibilityObj);


    }

    function _createSubTreeStructure(descriptor, object, objectToAdd) {
        var currentInspectorObject = _getInspectorObjectByID(objectToAdd.id);
        var oParent;
        if ((currentInspectorObject && currentInspectorObject.get("insKey") && currentInspectorObject.get("insKey") != "") ||
            (currentInspectorObject.get("type") && currentInspectorObject.get("type") == "Section") ||
            (currentInspectorObject.get("subType") && (currentInspectorObject.get("subType") == "SUB_SECTION" || currentInspectorObject.get("subType") == "PANEL"))) {
            oParent = currentInspectorObject;
        } else {
            var tempTypes = [{
                "type": "Section"
            }, {
                "type": "Harness"
            }];
            oParent = pega.ui.inspector.parser.getNearestParent(currentInspectorObject, tempTypes);
        }

        var strHTML = "<span class='meta-title'>"
        strHTML += pega.ui.inspector.utilities.displayUIElementText(currentInspectorObject.getAllAttributes());
        strHTML += "</span><a class='runtime-edit-icon live-ui-open-rule' title='" + pega.u.d.fieldValuesList.get("OpenInDevStudio") + "' onclick='pega.ui.inspector.accessibility.openSection(\"" + oParent.get("insKey") + "\")'></a>"
        object.text = descriptor;
        var child = {
            id: currentInspectorObject.id,
            text: strHTML,
            li_attr: {
                "class": "issue-description"
            }
        }

        if ((object.li_attr["class"] === 'warning' && _showWarnings) || object.li_attr["class"] === 'error') _objectsToHighlight.push(currentInspectorObject.get("element")[0]);
        object.children.push(child);
    }

    function _cleanupCategoryObjects(category) {
        var tempWarningCategory = [];
        var tempErrorCategory = [];
        var issueCount = 0;
        for (var i = 0; i < category.children.length; i++) {
            if (category.children[i].children.length > 0) {
                issueCount+=category.children[i].children.length;
                category.children[i].text=category.children[i].text.replace("</span></span>"," (" + category.children[i].children.length + ")</span></span>")
                if (category.children[i].li_attr["class"] === 'warning' && _showWarnings) tempWarningCategory.push(category.children[i]);
                else if (category.children[i].li_attr["class"] === 'error') tempErrorCategory.push(category.children[i]);
                else issueCount -= category.children[i].children.length;
            }
        }
        var tempContentArray = [];
        category.text+=' ('+issueCount+')'
      
        category.children = tempContentArray.concat(tempErrorCategory, tempWarningCategory);
        // push category to tree if it has children
        if (category.children.length > 0) _treeJSON.push(category);
    }

    function _handleRehighlight() {
        clearTimeout(_rehighlightTimeoutId);
        _rehighlightTimeoutId = setTimeout(_rehighlightAllIssues, 250)
    }

    /**
     * @private Takes in an ID and checks if one of the root nodes contain a model with that id
     * @param $String$ ID - The ID to try and find the corrasponding Inspector Element object for
     * @return $Inspector Element$ returnModel - The Inspector element model that was found or null
     */
    function _getInspectorObjectByID(ID) {
        return _inspectorObjectsByID[ID];
    };

    /**
     * @private Takes in an element and checks if one of the root nodes exists a model with that element
     *
     * @param $HTML Element$ elemeent - The HTML element to try and find the corrasponding Inspector Element object
     * @return $Inspector Element$ returnModel - The Inspector element model that was found or null
     */
    function _getInspectorObjectByElement(element) {
        var returnModel = null;

        // Loop over root nodes and call their findByElement function to try and find object
        for (var i = 0; i < _inspectorObjectsRootNodes.length; i++) {
            returnModel = _inspectorObjectsRootNodes[i].findByElement(element);

            // If the model is found then drop out of loop
            if (returnModel) {
                break;
            }
        }

        return returnModel;
    };

    /**
     * @private Called to create all needed instances of supporting objects
     */
    function _initializeObjects() {
        var containerDiv = document.createElement("DIV");
        containerDiv.classList.add("accessibility-inspector-elements");
        document.body.appendChild(containerDiv);

        publicAPI.filtersList = new pega.ui.inspector.Overlay.DismissOnOutsideClick("runtime-property-panel disibility-filter-list",
            containerDiv, "pzAccessibilityDisabilityFilter", {
                dataTestId: "disibility-filter-list",
                frameList: pega.ui.inspector.getFrameList,
                showArrow: false
            });

        publicAPI.moreMenu = new pega.ui.inspector.Overlay.DismissOnOutsideClick("runtime-property-panel accessibility-settings-menu",
            containerDiv, "pyAccessibilitySettingsMenu", {
                dataTestId: "accessibility-settings-menu",
                frameList: pega.ui.inspector.getFrameList,
                showArrow: false
            });

        // Helper for highlights to know when to stop bubbling
        function isValidElement(element) {
            var inspectorObject = _getInspectorObjectByElement(element)

            if (inspectorObject && (_objectsToHighlight.indexOf(inspectorObject.get("element")[0]) != -1)) {
                return true;
            }
            return false;
        }

        // Hover over inspector 
        _hoverInspector = new pega.ui.inspector.utilities.InspectorHighlight({
            highlight: {
                customClass: "primaryTreeHighlight",
                container: containerDiv
            },
            infoBar: {
                customClass: "inspectorTreeIdPanel",
                container: containerDiv,
                options: {
                    confinementElement: pega.ui.inspector.getTopHarness(),
                    offset: 2
                }
            },
            getInfoBarContent: function (element) {
                var inspectorObject = _getInspectorObjectByElement(element)
                return pega.ui.inspector.utilities.getHoverInfoBarContent(inspectorObject);
            },
            ignoreList: [".right-panel-dock", ".accessibility-inspector-elements", ".accessibility-toggle", ".accessibility-settings-menu"],
            isValidElement: isValidElement,
            elementFoundCallback: function (returnObj) {
                var inspectorObject = _getInspectorObjectByElement(returnObj.foundElement)
                if (inspectorObject) {
                    _tree.hoverNode(inspectorObject.id, true);
                }
                if (_clickInspector.getHighlightedElement() === returnObj.foundElement) {
                    _hoverInspector.clearHighlight();
                }
            }
        });

        // Mouse click inspector
        _clickInspector = new pega.ui.inspector.utilities.InspectorHighlight({
            highlight: {
                customClass: "secondaryTreeHighlight",
                container: containerDiv
            },
            infoBar: {
                customClass: "inspectorTreeSecIdPanel",
                container: containerDiv,
                options: {
                    confinementElement: pega.ui.inspector.getTopHarness(),
                    offset: 2
                }
            },
            eventsToBlockList: ["dblclick", "contextmenu", "keydown", "keyup", "mousedown", "mouseup"],
            getInfoBarContent: function (element) {
                var inspectorObject = _getInspectorObjectByElement(element)
                return _buildFocusedInfoBarContent(inspectorObject);
            },
            ignoreList: [".right-panel-dock", ".accessibility-inspector-elements", ".accessibility-toggle"],
            eventMonitored: "click",
            isValidElement: isValidElement,
            elementFoundCallback: function (returnObj) {
                var inspectorObject = _getInspectorObjectByElement(returnObj.foundElement)
                if (inspectorObject) {
                    _tree.selectNode(inspectorObject.id, true)
                    if (_hoverInspector.getHighlightedElement() === returnObj.foundElement) {
                        _hoverInspector.clearHighlight();
                        _tree.dehoverAll();
                    }
                }
            }
        })

        _tree = new pega.ui.components.Tree(document.querySelector('.accessibility-tree'), {
            selectCallback: function (id) {
                var inspectorObject = _getInspectorObjectByID(id);
                if (inspectorObject) {
                    var element = inspectorObject.get("element")[0];
                    _clickInspector.highlightElement(element)

                    if (_hoverInspector.getHighlightedElement() === element) {
                        _hoverInspector.clearHighlight();
                    }
                }
            },
            hoverCallback: function (id) {
                var inspectorObject = _getInspectorObjectByID(id);
                if (inspectorObject) {
                    var element = inspectorObject.get("element")[0];
                    if (_clickInspector.getHighlightedElement() === element) {
                        _hoverInspector.clearHighlight();
                    } else {
                        _hoverInspector.highlightElement(inspectorObject.get("element")[0])
                    }
                }
            }
        });

    }
    /**
     * @private initializes accessibility tree
     */
    function _activate() {
        // Init the info panel/highlights/tree
        _initializeObjects()

        // Update the dock element z-index to float above 
        _originalDockIndex = _panel.getElement().parentElement.style.zIndex;
        _panel.getElement().parentElement.style.zIndex = '300';
      
        // Activate button
        var toggle = document.querySelector(".accessibility-toggle");
        if (toggle != null) {
            toggle.classList.add("inspector-active");
        }
        // Refresh and enable highlighting
        publicAPI.refresh();
        _hoverInspector.enable();
        _clickInspector.enable();
    };

    /**
     * @private clean up the state and destroy all objects
     */
    function _deactivate() {
        document.querySelector(".accessibility-panel").classList.remove("interaction-enabled");
        document.querySelector(".accessibility-tree").classList.remove("ui-tree-readonly");

        var container = document.querySelector(".accessibility-inspector-elements");
        document.body.removeChild(container);

        // Deactivate button
        var toggle = document.querySelector(".accessibility-toggle");
        if (toggle != null) {
            toggle.classList.remove("inspector-active");
        }

        // Cleanup all of the elements that are in the highlight
        for (var i = 0; i < _highlightInstances.length; i++) {
            _highlightInstances[i].highlight = null;
            _highlightInstances[i].element = null;
        }
        _highlightInstances = [];

        // Clean up all of the objects to highlight
        for (var ii = 0; ii < _objectsToHighlight.length; ii++) {
            _objectsToHighlight[ii] = null;
        }
        _objectsToHighlight = [];
        _treeJSON = [];
        _tempTreeJSON = [];
      
        // Reset the dock back to the original z index
        _panel.getElement().parentElement.style.zIndex = _originalDockIndex;

        // Default filter back to none
        pega.ui.inspector.accessibility.setFilter("");

        _clickInspector.destroy();
        _hoverInspector.destroy();

        _tree.destroy();
    }
    /////////////////////////////////////////////////////////////////////////////////
    //                              PUBLIC API                                     //
    /////////////////////////////////////////////////////////////////////////////////
    /**
     * @public called to toggle on the inspector from the UI
     */
    publicAPI.toggle = function () {
        if (pega.ui.inspector.isActive()) return;

        if (_panel == null) {
            // Create the panel the first time toggle is called
            var panelOptions = {
                showCallback: _activate,
                preHide: function () {
                    _hoverInspector.clearHighlight();
                    _hoverInspector.disable();
                    _clickInspector.clearHighlight();
                    _clickInspector.disable();
                },
                hideCallback: _deactivate
            }

            // Add panel to the correct doc
            _panel = new pega.ui.components.panels.ClassLoader("accessibilityInspector", panelOptions);
            _panel.getElement().classList.add('accessibility-panel');
            pega.ui.panelManager.registerPanel(_panel, pega.ui.panelConstants.DOCK_LOCATION.RIGHT);

            // Load the content into the panel and show
            var params = {
                streamName: "pzRunTime_ControlPanel_AccessibilityTab",
                pageContext: "pyDisplayHarness",
                panelLabel: "Accessiblitiy Inspector"
            };
            _panel.loadByClass("Pega-UI-PanelContent-AccessibilityInspector", _panel.show, params);
        } else if (_panel.isShowing()) {
            if(document.querySelector(".tree-component-readonly")) publicAPI.toggleSuppression();
            _panel.hide();
        } else {
            _panel.show();
        }
    }

    /**
     * @public Called to see the state of the accessibility inspector
     */
    publicAPI.isActive = function () {
        return (_panel && _panel.isShowing());
    }

    /**
     * @public Called to refresh the accessibility tree
     */
    publicAPI.refresh = function () {
        if (pega.ui.inspector.getDesktopWindowInspectorProxy().getDesktopWindow() !== window &&
            pega.ui.inspector.getDesktopWindowInspectorProxy().accessibility !== null) {
            return pega.ui.inspector.getDesktopWindowInspectorProxy().accessibility.refresh();
        } else {
            // Call parser to parse the dom and retrieve all Inspector elements
            var returnObj = pega.ui.inspector.parser.buildModel(document.body);
            _inspectorObjectsByID = returnObj.lookupByID;
            _inspectorObjectsRootNodes = returnObj.rootNodes;
            _issueCount = 0;
            _tempTreeJSON = [];
            _treeJSON = [];
            _objectsToHighlight = [];


            for (var key in _inspectorObjectsByID) {
                var currentInspectorObject = _inspectorObjectsByID[key];
                _accessibilityParser(currentInspectorObject);
            }

            _createTreeStructure();

            _firstHarnessChecked = false;

            var accessibilityTree = document.querySelector('.accessibility-tree');
            var emptyAccessibilityTreeMessage = document.querySelector('.accessibility-tree-empty');
            if (_issueCount === 0) {
                if (accessibilityTree) accessibilityTree.style.display = "none";
                if (emptyAccessibilityTreeMessage) emptyAccessibilityTreeMessage.style.display = "block";
            } else {
                if (accessibilityTree) accessibilityTree.style.display = "block";
                if (emptyAccessibilityTreeMessage) emptyAccessibilityTreeMessage.style.display = "none";
                // Destroy the tree then rebuild it from scratch

                if (_tree) _tree.populate(_treeJSON);
            }
        }
    };

    /**
     * @public Called to enable or disable the highlight of on page accessibility issues
     * @param enable - flag to turn on or off highlight
     */
    publicAPI.highlightOnPageAccessibilityIssues = function (enable) {
        // turn on highlight
        if (enable) {
            _highlightEnabled = true;
            window.addEventListener('resize', _handleRehighlight, true)
            window.addEventListener('scroll', _handleRehighlight, true)
 
            for (var ii = 0; ii < _objectsToHighlight.length; ii++) {
                // Determine the element to highlight
                var element = _objectsToHighlight[ii];
                while (element.getAttribute("data-ui-meta") === null) {
                    element = $(element).closest("[data-ui-meta]");
                }

                // New up an instance of highlight
                var _focusHighlight = new pega.ui.inspector.Highlight("accessibilityIssueHighlight", document.querySelector(".accessibility-inspector-elements"));
                _highlightInstances.push({
                    highlight: _focusHighlight,
                    element: element
                });

                // Show highlight
                _focusHighlight.showByElement(element);
            }
        } else { // turn off highlight
            _highlightEnabled = false;

            window.removeEventListener('resize', _handleRehighlight, true)
            window.removeEventListener('scroll', _handleRehighlight, true)

            for (var i = 0; i < _highlightInstances.length; i++) {
                _highlightInstances[i].highlight.hide();

                // Clean up the array when hidding
                _highlightInstances[i].highlight = null;
                _highlightInstances[i].element = null;
            }
            _highlightInstances = [];
            return;
        }
    };

    /**
     * @public Toggle function called to only show errors on page
     * 
     * @param showError - toggle to show just errors
     */
    publicAPI.showOnlyErrors = function (showError) {
        if (showError) {
            _showWarnings = false;
            // need to update the highlight to consider the new tree items
            if(_highlightEnabled) _objectsToHighlight = [];
            publicAPI.refresh();
            if(_highlightEnabled){
              // turn of highlight and turn back on to reset
              publicAPI.highlightOnPageAccessibilityIssues()
              publicAPI.highlightOnPageAccessibilityIssues(true)
            }
        } else {
            _showWarnings = true;
            // need to update the highlight to consider the new tree items
            if(_highlightEnabled) _objectsToHighlight = [];
            publicAPI.refresh();
            if(_highlightEnabled){
              // turn of highlight and turn back on to reset
              publicAPI.highlightOnPageAccessibilityIssues()
              publicAPI.highlightOnPageAccessibilityIssues(true)
            }
        }
    }

    /**
     * @public Called to open the section based on the given inskey
     * 
     * @param insKey - the pzInsKey of the rule to open
     */
    publicAPI.openSection = function (insKey) {
        var callback = function (win) {
            // If opening in designer studio and inspector is on turn it off
            if (pega.d.s.isWindowTheDesignerDesktop(win) && win.pega.ui.inspector.accessibility.isActive()) {
                win.pega.ui.inspector.accessibility.toggle();
            }
        }

        pega.ui.inspector.utilities.openRuleByInsKey(insKey, callback);
    }

    /**
     * @public Getter that returns the treeJSON reference object, needed for Jasmine tests
     * @return $treeJSON$ The treeJSON object used to build up the JS tree nodes
     */
    publicAPI.getTreeJSON = function () {
        if (pega.ui.inspector.getDesktopWindowInspectorProxy().getDesktopWindow() !== window &&
            pega.ui.inspector.getDesktopWindowInspectorProxy().accessibility !== null) {
            return pega.ui.inspector.getDesktopWindowInspectorProxy().accessibility.getTreeJSON();
        } else {
            return _treeJSON;
        }
    }

    /**
     * @public Public function used to set color blindness filters. These filters are defined in enum at top of file
     * @param name - One of the enum values for filters
     */
    publicAPI.setFilter = function (name) {
        if (pega.ui.inspector.getDesktopWindowInspectorProxy().getDesktopWindow() !== window &&
            pega.ui.inspector.getDesktopWindowInspectorProxy().accessibility !== null) {
            return pega.ui.inspector.getDesktopWindowInspectorProxy().accessibility.setFilter(name);
        } else {
            var filterLink = document.querySelector(".accessibility-disability-filter .field-item a");
            if (Object.values(pega.ui.inspector.accessibility.FILTERS).indexOf(name) !== -1) {
                document.body.style.filter = "url(webwb/pzAccessibilityFilters.svg#" + name.toLowerCase() + ")";
                filterLink.innerHTML = name;
            } else {
                document.body.style.filter = "";
                filterLink.innerHTML = "None";
            }
            filterLink.innerHTML += "<i data-click='.' class='pi pi-caret-solid-down'></i>";
        }
    }

    /**
     * @public Public function used to toggle live UI suppression
     */
    publicAPI.toggleSuppression = function () {
        if (pega.ui.inspector.getDesktopWindowInspectorProxy().getDesktopWindow() !== window &&
            pega.ui.inspector.getDesktopWindowInspectorProxy().accessibility !== null) {
            return pega.ui.inspector.getDesktopWindowInspectorProxy().accessibility.toggleSuppression();
        } else {
            var inspectors = [_hoverInspector, _clickInspector];
            pega.ui.inspector.utilities.toggleInteraction(inspectors, _panel, _tree, {
                disableCallback: pega.ui.inspector.accessibility.refresh
            });
        }
    }



    return publicAPI;

}());
//static-content-hash-trigger-GCC
/*
@public- Creates a pop up with the declarative network.
@param $String$strClassName – Class name.
@param $String$strPropertyName – Property name.
@param $String$strContextPageName – Context page name.
@param $String$strContextPageClass – Context page class.
@param $String$strSubScript – Subscript.
@return $void$ - .
*/
pega.desktop.support.showDeclarativeNetwork = function(strClassName, strPropertyName, strContextPageName,
    strContextPageClass, strSubScript) {
    var strUrl = null;
    if (strContextPageName != null) {   			
        strUrl = new SafeURL("Rule-Obj-Property.ShowDeclarativeNetworkWithValues");
        strUrl.put("className", strClassName);
        strUrl.put("propertyName", strPropertyName);
        strUrl.put("category", "backwardChaining");
        strUrl.put("pageContextName", strContextPageName);
        if ((strSubScript != null) && (strSubScript != 'undefined')) { 
          strUrl.put("Subscript", strSubScript);
        }
    } else {
        strUrl = new SafeURL("Rule-Obj-Property.ShowDeclarativeNetwork");
        strUrl.put("className", strClassName);
        strUrl.put("propertyName", strPropertyName);
        strUrl.put("category", "backwardChaining");
        strUrl.put("pageContextName", strContextPageName);
    }

    pega.desktop.support.openUrlInWindow(strUrl.toURL(), "DeclarativeNetwork", RuleFormSize + PopupWindowFeatures);
};

/*
@public- Creates a pop up with the declarative network.
@param $String$strClassName – Class name.
@param $String$strPropertyName – Property name.
@param $String$strContextPageName – Context page name.
@param $String$strContextPageClass – Context page class.
@param $String$strSubScript – Subscript.
@return $void$ - .
*/
function showDeclarativeNetwork(strClassName, strPropertyName, strContextPageName, strContextPageClass,strSubScript) {
    return pega.desktop.support.showDeclarativeNetwork(strClassName, strPropertyName, strContextPageName, strContextPageClass,strSubScript);
}
//static-content-hash-trigger-YUI
pega = pega || {};
pega.ui = pega.ui || {};
pega.ui.dataSourceInspector = (function () {
    var isHighlightimgEnabled = false;
    var highlightedElem = null;
    var eleDataSource = null;
    function ruleOpener(ruleName, objClass, className) {
        if (!(ruleName != null))
            return;
        var oAttachedDesktop;
        if (pega.ui.composer) {
            //This is used to check for the composer desktopwindow so that it can find an attached desktop window (namely designer studio) if
            //in a portal that is using form factor preview in desktop mode, this will allow it to open in design studio rather than a new pop up
            oAttachedDesktop = pega.ui.composer.getCurrentComposerWindow().pega.desktop.support.getAttachedDesignerDesktop();
        }
        else {
            // Added this line to display a message when we use the inspector to open a rule
            oAttachedDesktop = pega.desktop.support.getAttachedDesignerDesktop();
        }
        // BUG-370024: If the user is currently in a Workspace, use the Workspace openRule() API to display the rule; otherwise open the rule in a popup.
        if (oAttachedDesktop.pega.desktop.portalCategory === "workspace") {
            if (className == "null") {
                oAttachedDesktop.pega.desktop.wks.openRule("Developer", objClass, ruleName);
            }
            else {
                oAttachedDesktop.pega.desktop.wks.openRule("Developer", objClass, className + "!" + ruleName);
            }
        }
    }
    function highlightDataSource() {
        var inspector = pega.ui.ScreenInspectorDS.getInspector("datasourceInspector");
        // blcaklisted elements
        //inspector.setBlackListedElement(blackListedElements);
        //TODO change attribute name
        inspector.addSelector("[base_ref^='D_']", function (element) {
            var data_source_meta = element.getAttribute("base_ref");
            eleDataSource = data_source_meta;
            return data_source_meta;
        });
        inspector.addSelector("[base_ref^='Declare_']", function (element) {
            var data_source_meta = element.getAttribute("base_ref");
            eleDataSource = data_source_meta;
            return data_source_meta;
        });
        inspector.addSelector("[hashed-dp-page^='D_']", function (element) {
            var data_source_meta = element.getAttribute("hashed-dp-page");
            eleDataSource = data_source_meta;
            return data_source_meta;
        });
        inspector.addSelector("[hashed-dp-page^='Declare_']", function (element) {
            var data_source_meta = element.getAttribute("hashed-dp-page");
            eleDataSource = data_source_meta;
            return data_source_meta;
        });
        inspector.addSelector("[data-repeat-source^='D_']", function (element) {
            var data_source_meta = element.getAttribute("hashed-dp-page");
            eleDataSource = data_source_meta;
            return data_source_meta;
        });
        inspector.addSelector("[data-repeat-source^='Declare_']", function (element) {
            var data_source_meta = element.getAttribute("hashed-dp-page");
            eleDataSource = data_source_meta;
            return data_source_meta;
        });
        inspector.enable();
    }
    function stopHighlighting() {
        var inspector = pega.ui.ScreenInspectorDS.getInspector("datasourceInspector");
        if (inspector) {
            inspector.clearHighlight();
            inspector.disable();
        }
    }
    function toggleIconColor() {
        ele = document.querySelector("div[data-node-id='pzStudioFooter'] .pcs.pcs-financial-advisor");
        if (ele == null) {
            ele = document.querySelector("div[data-node-id='pzRuntimeToolsTopBar'] .pi.pi-glasses");
        }
        if (ele != null) {
            ele.parentElement.style.color = ele.parentElement.style.color == "orange" ? "" : "orange";
        }
    }
    function toggleHighligting() {
        if (pega.ui.automation && pega.ui.automation.recorder.isPanelActive()) {
            return;
        }
        if (pega.ui.inspector.isActive() || pega.ui.inspector.accessibility.isActive())
            return;
        if (!isHighlightimgEnabled) {
            highlightDataSource();
            toggleIconColor();
            isHighlightimgEnabled = true;
            return;
        }
        toggleIconColor();
        isHighlightimgEnabled = false;
        stopHighlighting();
    }
    function stopLiveData() {
        if (isHighlightimgEnabled == true) {
            toggleIconColor();
            isHighlightimgEnabled = false;
            stopHighlighting();
        }
    }
    function getDataSourceInfo() {
        eleDataSource = eleDataSource.indexOf('.') > -1 ? eleDataSource.slice(0, eleDataSource.indexOf('.')) : eleDataSource;
        //debugger;
        //var url = highlightedElem.ownerDocument.defaultView.pega.u.d.url;
        var url = highlightedElem.ownerDocument.defaultView.pega.ctxmgr.getContextByTarget(highlightedElem).url;
        var strNewUrl = SafeURL_createFromEncryptedURL(url);
        var postData = new SafeURL();
        var preActivity = "pzGetDPSourceDetails";
        strNewUrl.put("pyActivity", "reloadSection");
        strNewUrl.put("StreamName", "pzShowDPDetails");
        strNewUrl.put("StreamClass", "Rule-HTML-Section");
        strNewUrl.put("BaseReference", 'D_pzPopulateDPSourceDetails');
        strNewUrl.put("UITemplatingStatus", "N");
        strNewUrl.put("PreActivity", preActivity);
        strNewUrl.put("AJAXTrackID", pega.ui.ChangeTrackerMap.getTracker().id);
        postData.put("DPHashCode", eleDataSource);
        var callback = {
            success: function (oResponse) {
                strResponse = oResponse.responseText;
                var trackersMap = pega.ui.ChangeTrackerMap.getTrackers();
                for (var threadName in trackersMap) {
                    var currentTracker = trackersMap[threadName];
                    currentTracker.parseForChangeTrackerDiv(strResponse, false);
                }
                var explicitAssertionButton = document.getElementById("addexplicitassertion");
                _dspopover = pega.u.d.getPopOver(explicitAssertionButton);
                if (typeof _dspopover == "object") {
                    var myDom = $("<div>" + strResponse + "</div>")[0];
                    _dspopover.open({
                        content: {
                            type: 'domElement',
                            element: myDom
                        },
                        bindings: {
                            associatedElement: explicitAssertionButton
                        },
                        buttons: {
                            ok: false,
                            cancel: false
                        },
                        position: {
                            fieldAttach: 'leftBottom',
                            popOverAttach: 'leftTop'
                        },
                        visual: {
                            contentClass: 'live-data-popover'
                        },
                        callbacks: {
                            onClose: this.popoverCloseCallback
                        }
                    });
                }
            },
            failure: function (oResponse) {
                alert("Modal Dialog: Ajax Call For Modal Dialog Failure!");
            },
            scope: this
        };
        pega.u.d.asyncRequest('POST', strNewUrl, callback, postData);
        //pega.util.Connect.handleReadyState(request, callback);
    }
    function setHighlightedElem(ele) {
        highlightedElem = ele;
    }
    function getEleDataSource(argument) {
        var retVal = eleDataSource.indexOf('.') > -1 ? eleDataSource.slice(0, eleDataSource.indexOf('.')) : eleDataSource;
        retVal = retVal.indexOf('_pa') > -1 ? retVal.slice(0, retVal.indexOf('_pa')) : retVal;
        return retVal;
    }
    return {
        toggleHighligting: toggleHighligting,
        getDataSourceInfo: getDataSourceInfo,
        setHighlightedElem: setHighlightedElem,
        ruleOpener: ruleOpener,
        stopLiveData: stopLiveData,
        getEleDataSource: getEleDataSource
    };
})();
pega.ui.ScreenInspectorDS = pega.ui.ScreenInspectorDS || (function () {
    var _inspector = null;
    var _name = null;
    /**
     * Returns an instance of the ScreenInspectorDS
     * @function    {_getInspector}
     * @param       {String} name - Name of the screen inspector
     * @return      {ScreenInspectorDS}
     */
    var _getInspector = function (name) {
        var ScreenInspectorDS = _getTopHarnessInspector();
        return ScreenInspectorDS.getInspectorObject(name);
    };
    /**
     * Stores the ScreenInspectorDS instance and its name
     * @function    {_setInspector}
     * @param       {ScreenInspectorDS} inspector - Instance of the ScreenInspectorDS
     */
    var _setInspector = function (inspector) {
        _inspector = inspector;
        _name = inspector.name;
    };
    /**
     * Returns the ScreenInspectorDS of the harness window
     * @function    {_getTopHarnessInspector}
     * @return      {ScreenInspectorDS} - ScreenInspectorDS of the harness window.
     */
    var _getTopHarnessInspector = function () {
        var harnessWindow = window;
        while (harnessWindow !== desktopwrappersupport_getDesktopWindow()) {
            //while (harnessWindow.pega.u.d.topHarness !== 'yes') {
            harnessWindow = harnessWindow.parent;
        }
        return harnessWindow.pega.ui.ScreenInspectorDS;
    };
    /**
     * @function {_getInspectorObject}
     * @param       {String} name       -  Name of the screen inspector
     * @return      {ScreenInspectorDS}   -  Instance of the ScreenInspectorDS
     */
    var _getInspectorObject = function (name) {
        if (!name) {
            return _inspector;
        }
        if (_inspector && _inspector.name == name) {
            return _inspector;
        }
        _inspector = new ScreenInspectorDS(name);
        _name = name;
        return _inspector;
    };
    //Functions exposed on the pega.ui.ScreenInspectorDS
    return {
        getInspector: _getInspector,
        setInspector: _setInspector,
        getInspectorObject: _getInspectorObject
    };
})();
var ScreenInspectorDS = (function () {
    /*
     * Create a ScreenInspectorDS
     * @constructor
     * @param {String} inspectorName - The name of the screen inspector.
     */
    function ScreenInspectorDS(inspectorName) {
        //name is exposed on the inspector object.
        this.name = inspectorName;
        //Initialise the private varibales so that they are not exposed on the object and are not undefined.
        this.listOfSelectorToHighlight = [];
        this.blackListElements = ["i.mark-for-assertion"];
        this.highlightHandler = null;
        this.inspectorHandler = null;
        this.infoBarHandler = null;
        this.lastHighlightedElement = null;
        this.preHighlightCallback = null;
        this.preHighlightCallbackContext = null;
        this.postHighlightCallback = null;
        this.postHighlightCallbackContext = null;
        this.inspectorConfig = null;
        this.getmoreinfo = pega.u.d.fieldValuesList.get("Get more info");
        //Set the screen inspector object and name.
        pega.ui.ScreenInspectorDS.setInspector(this);
        //Providing a custom callback for the data-ui-meta attribute selector.
        /*this.addSelector("[data-ui-meta]", function(element) {
            let data_ui_meta = element.getAttribute("data-ui-meta");
            if (data_ui_meta) {
                data_ui_meta = JSON.parse(data_ui_meta.replace(/'/g, "\""));
            } else {
                data_ui_meta = {
                    "type": "Cell",
                    "subType": "Custom"
                };
            }
            return data_ui_meta;
        });*/
    }
    /*
     * Creates a div for the infoBar with the control information.
     * @private
     * @function {_getInfobarContent}
     * @param    {String} infoMessage - Message/control name displayed on the infoBar
     * @return   {String} infoBarDiv - content div for the infoBar
     */
    ScreenInspectorDS.prototype._getInfobarContent = function (infoMessage) {
        var infoBarDiv = "<div>\n                                            <div class='idpanel-text'>\n                                              <span class='runtime-tree-prefix'>" + infoMessage + "</span>\n                                            </div>\n                                            <div class='id-livedata-icon-container'>\n                                              <img src='webwb/pxAddAssertion.png' title='" + this.getmoreinfo + "' id = \"addexplicitassertion\" onclick='pega.ui.dataSourceInspector.getDataSourceInfo()'></i>\n                                            </div>\n                                          </div>";
        return infoBarDiv;
    };
    /*
     * Gives the dimensions and position of the element. Also considers the iframes if there are any.
     * @private
     * @function {_getElementDimensions}
     * @param    {HTMLElement} htmlElement - Element for which position and dimensions are needed.
     * @param    {Window}      toWindow    - Current window
     */
    ScreenInspectorDS.prototype._getElementDimensions = function (htmlElement, toWindow) {
        var isInModal = $(htmlElement).closest("#modalWrapper").length > 0;
        var currentWindow = htmlElement.ownerDocument.defaultView;
        var loc = {};
        // Get location of element in context of current window
        // Now account for scrolling of top-window (when you're not in an iframe)
        var elementOffset = htmlElement.getBoundingClientRect();
        loc.left = elementOffset.left + $(currentWindow).scrollLeft();
        loc.top = elementOffset.top + $(currentWindow).scrollTop();
        loc.width = elementOffset.width;
        loc.height = elementOffset.height;
        // Loop over each parent window until coming back to current window
        while (currentWindow) {
            if ((currentWindow == window || !currentWindow.parent) || (toWindow != null && currentWindow == toWindow)) {
                break;
            }
            else {
                //Get location of window in context of parent window
                var windowOffset = currentWindow.frameElement.getBoundingClientRect();
                loc.left += windowOffset.left;
                loc.top += windowOffset.top;
                // Factor in scroll location when you are in iframes as it unintentially throws the distance off further than from the perspective of the top-window
                if (htmlElement.ownerDocument.defaultView == currentWindow && !isInModal) {
                    // Only factor in scroll for non desktopWindow frame since in the desktopWindow it is covered by offset
                    loc.top -= $(currentWindow).scrollTop();
                    loc.left -= $(currentWindow).scrollLeft();
                }
                currentWindow = currentWindow.parent;
            }
        }
        return loc;
    };
    /*
     * Retunrs true if inspector is enabled else false
     * @private
     * @function {_isEnabled}
     * @return   {bool}
     */
    ScreenInspectorDS.prototype._isEnabled = function () {
        if (this.inspectorHandler && this.inspectorHandler.isEnabled()) {
            return true;
        }
        return false;
    };
    /*
     * Returns a list of selector for which a function is registered to get the data-ui-meta
     * @private
     * @function  {_getSelectorList}
     * @return    {Array} selectorList
     */
    ScreenInspectorDS.prototype._getSelectorList = function () {
        var selectorList = [];
        for (var selector in this.listOfSelectorToHighlight) {
            selectorList.push(selector);
        }
        return selectorList;
    };
    /*
     * Retunrs the meta data object of the closest ancestor filtered by the given selector
     * @private
     * @function    {_closestSelectorMetadata}
     * @param       {HTMLElement} element
     * @return      {Object} selectorMetaData
     */
    ScreenInspectorDS.prototype._closestSelectorMetadata = function (element) {
        var selectorMetaData = null;
        if (!element || top.window.holdHighlight) {
            return null;
        }
        for (var slector in this.listOfSelectorToHighlight) {
            var closest = element.closest(slector);
            if (closest == element) {
                selectorMetaData = this.listOfSelectorToHighlight[slector](element);
                break;
            }
        }
        return selectorMetaData;
    };
    /*
     * callBack from the inspector to highlight the target.
     * @private
     * @function {_highlightCallback}
     * @param    {Object} elementData
     */
    ScreenInspectorDS.prototype._highlightCallback = function (elementData) {
        if (elementData.foundElement) {
            var ele = elementData.foundElement;
            var inspector = pega.ui.ScreenInspectorDS.getInspector("datasourceInspector");
            inspector.highlight(ele);
        }
        else {
            var infobar = elementData.eventObj.target.closest(".info-bar");
            var popup = elementData.eventObj.target.closest(".live-data-popover");
            if (!infobar && !popup) {
                var inspector = pega.ui.ScreenInspectorDS.getInspector("datasourceInspector");
                inspector.highlightHandler.hide();
                inspector.infoBarHandler.hide();
                popObj = pega.u.d.getPopOver();
                activeEle = popObj.getActivePopOverElement();
                if (activeEle && activeEle.closest(".live-data-popover")) {
                    popObj.close();
                }
            }
        }
    };
    /*
     * Create the instances of the inspector, highligher and infoBar common components and enables the
     * inspector to start inspecting the DOM elements on the UI.
     * @public
     * @function {enable}
     */
    ScreenInspectorDS.prototype.enable = function () {
        if (this._isEnabled()) {
            return;
        }
        //Configuration setting for the inspector.
        this.inspectorConfig = {
            elementFoundCallback: this._highlightCallback,
            selectorList: this._getSelectorList(),
            ignoreList: this.blackListElements
        };
        //Creating instances
        this.highlightHandler = new pega.ui.inspector.Highlight("livedata-Element-Highlighter");
        this.inspectorHandler = new pega.ui.components.Inspector(this.inspectorConfig);
        this.infoBarHandler = new pega.ui.inspector.InfoBar("livedata-Element-Infobar", null, null, {});
        //Enabling the inspector
        this.inspectorHandler.enable();
    };
    /*
     * If the inspector is enabled, cleans up highlighter, removes infoBar from DOM and disbales the inspector.
     * @public
     * @function {disable}
     */
    ScreenInspectorDS.prototype.disable = function () {
        if (!this._isEnabled()) {
            return;
        }
        this.highlightHandler.cleanup();
        this.infoBarHandler.removeFromDom();
        this.inspectorHandler.disable();
    };
    /*
     * highlights the element with assertion error.
     * @public
     * @function {highlightError}
     * @param    {HTMLElement} target - target element for the highlighter
     */
    ScreenInspectorDS.prototype.highlightError = function (target) {
        var data_ui_meta = this._closestSelectorMetadata(target);
        var rect = this._getElementDimensions(target, pega.ui.inspector.getDesktopWindow());
        this.highlightHandler = new pega.ui.inspector.Highlight("livedata-Element-Highlighter");
        this.highlightHandler.show(rect.left, rect.top, rect.width, rect.height);
    };
    /**
     * Clear the highlight.
     * @public
     * @function {clearHighlight}
     */
    ScreenInspectorDS.prototype.clearHighlight = function () {
        if (this.highlightHandler) {
            this.highlightHandler.cleanup();
        }
    };
    /*
     * highlights the hovered element by setting the positions of the four edges.
     * Excutes the preHighlight callback, sets the highlight rect and inforbar, then executes the postHighlight callback.
     * @public
     * @function {highlight}
     * @param    {HTMLElement} target - target element for the highlighter
     */
    ScreenInspectorDS.prototype.highlight = function (target) {
        var data_source_meta = this._closestSelectorMetadata(target);
        var data_ui_meta = JSON.parse($(target).closest("[data-ui-meta]").attr('data-ui-meta').replace(/'/g, "\""));
        if (!data_source_meta) {
            return false;
        }
        if (target.closest(".live-data-popover"))
            return false;
        if (this.lastHighlightedElement != target) {
            popObj = pega.u.d.getPopOver();
            activeEle = popObj.getActivePopOverElement();
            if (activeEle && activeEle.closest(".live-data-popover")) {
                popObj.close();
            }
        }
        this.lastHighlightedElement = target;
        pega.ui.dataSourceInspector.setHighlightedElem(target);
        /*try{
         //Set the last highlighted element to current element.
         if (this.lastHighlightedElement == null || this.lastHighlightedElement != target) {
             this.lastHighlightedElement = target;
         }
         //If the target element and the last highlighted element are same do not repeat highlighting, instead return.
         else {
             return false;
         }
        }catch(e){
            this.lastHighlightedElement = target;
         }*/
        //Give a call to pre highlight callback.
        if (this.preHighlightCallback && this.preHighlightCallbackContext) {
            this.preHighlightCallback.apply(this.preHighlightCallbackContext, [target, data_source_meta]);
        }
        //Get the dimensions if the element and show the highlight rectangle
        var highlighterEle = $(".livedata-Element-Highlighter");
        if (highlighterEle.hasClass("highlighter-warning")) {
            highlighterEle.removeClass("highlighter-warning");
        }
        var rect = this._getElementDimensions(target, pega.ui.inspector.getDesktopWindow());
        this.highlightHandler.show(rect.left, rect.top, rect.width, rect.height);
        //Set the inforbar
        var infobarContent = this._getInfobarContent((data_ui_meta.subType || data_ui_meta.type) + " source : " + pega.ui.dataSourceInspector.getEleDataSource());
        this.infoBarHandler.overlayElem.classList.remove("infobar-warning");
        this.infoBarHandler.setContent(infobarContent);
        this.infoBarHandler.showByPosition(rect.left, rect.top, rect.width, rect.height);
        //Give a call to the post highlight callback.
        if (this.postHighlightCallback && this.postHighlightCallbackContext) {
            this.postHighlightCallback.apply(this.postHighlightCallbackContext, [target, data_source_meta]);
        }
    };
    /*
     * Registers the pre highlight callback and its context.
     * @public
     * @function {registerPreHighlightCallback}
     * @param    {function} callback
     * @param    {Object}   contextObject
     */
    ScreenInspectorDS.prototype.registerPreHighlightCallback = function (callback, contextObject) {
        this.preHighlightCallback = callback;
        this.preHighlightCallbackContext = contextObject;
    };
    /*
     * Registers the post highlight callback and its context.
     * @public
     * @function {registerPostHighlightCallback}
     * @param    {function} callback
     * @param    {Object}   contextObject
     */
    ScreenInspectorDS.prototype.registerPostHighlightCallback = function (callback, contextObject) {
        this.postHighlightCallback = callback;
        this.postHighlightCallbackContext = contextObject;
    };
    /*
     * Registers a custom function for each selector to get the data-ui-meta
     * @public
     * @function {addSelector}
     * @param    {String}   selector
     * @param    {function} selectorFunction
     */
    ScreenInspectorDS.prototype.addSelector = function (selector, selectorFunction) {
        if (typeof selectorFunction == 'function')
            this.listOfSelectorToHighlight[selector] = selectorFunction;
    };
    /*
     * Setter for the black list elements. These elements will not be highlighted by the highlighter.
     * @public
     * @function  {setBlackListedElement}
     * @param     {Array}   elements - Array of elements to be black listed.
     */
    ScreenInspectorDS.prototype.setBlackListedElement = function (elements) {
        this.blackListElements = elements;
    };
    return ScreenInspectorDS;
}());
//static-content-hash-trigger-GCC
