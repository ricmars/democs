(function(p){

	if (!p.control) {
		p.c = p.namespace("pega.control");
	} else {
		p.c = pega.control;
	}

	/* ITextArea Constructor */
	p.c.ITextArea = function() {
		p.c.ITextArea.superclass.constructor.call(this, "TextArea");
		
	};

	/* Inherit form IUIElement */
	p.lang.extend(p.c.ITextArea, p.c.IUIElement);

	/* ITextArea Specific Attributes & Methods */
	p.c.ITextArea.prototype.getComputedStyle = function(textArea, styleprop){
		if(window.getComputedStyle) {
			return document.defaultView.getComputedStyle(textArea, null).getPropertyValue(styleprop);
		} else if(textArea.currentStyle) {
			return textArea.currentStyle[styleprop.encamel()];
		}
		return null;
	};

	p.c.ITextArea.prototype.getAttrib = function(textArea, attrib) {
		if(!textArea.state) {
			var textAreaCtl = textArea.getAttribute("data-ctl");
			if(!textAreaCtl) return "";
			textArea.state = pega.c.eventParser.parseJSON(textAreaCtl)[1];
		}
		var returnAttribValue = textArea.state[attrib];
		return (returnAttribValue && returnAttribValue != "") ? returnAttribValue : "";
	};

	p.c.ITextArea.prototype.collapsedRowCount = 1;
	p.c.ITextArea.prototype.resizeActive = false;
	p.c.ITextArea.prototype.autosize = function(event) {
		var textArea = pega.util.Event.getTarget(event);
		var heightConfig = this.getHeightArr(textArea)[0];
		if(heightConfig && heightConfig == "content") {
			if(textArea.nodeName.toUpperCase() == "TEXTAREA") {
				this.autosizeEle(textArea);
			}
		}
	};

	p.c.ITextArea.prototype.removeAutosize = function(event) {
		var textArea = pega.util.Event.getTarget(event);
		var heightConfig = this.getHeightArr(textArea)[0];
		if(heightConfig && heightConfig == "content") {
			clearInterval(textArea.interval);
			textArea.interval = null;
			this.activeEle = null;
		}
	};

	p.c.ITextArea.prototype.setupTA = function(textArea) {
		if(!textArea.set) {
			var heightAttr = this.getHeightArr(textArea);
        	var minHeight =  heightAttr[1];
	    	var minHeightUnits = heightAttr[2];
	    	textArea.minHeight = minHeight;
			textArea.minHeightUnits = minHeightUnits;
			if(minHeight && minHeightUnits && minHeightUnits == "rows"){
				var compLineHeight = this.getComputedStyle(textArea, "line-height")
				var lineHeightTemp = parseInt(compLineHeight);
				if(!isNaN(lineHeightTemp)) {
					textArea.lineHeight = lineHeightTemp;
				} else {
					var lineHeightTestSpan = document.createElement("span");
					lineHeightTestSpan.style.position = "absolute";
					lineHeightTestSpan.style.visibility = "hidden";
					lineHeightTestSpan.style.overflow = "hidden";
					lineHeightTestSpan.style.lineHeight = compLineHeight;
					lineHeightTestSpan.style.fontSize = this.getComputedStyle(textArea, "font-size");
					lineHeightTestSpan.style.fontFamily = this.getComputedStyle(textArea, "font-family");
					lineHeightTestSpan.style.fontWeight = this.getComputedStyle(textArea, "font-weight");
					lineHeightTestSpan.appendChild(document.createTextNode("TEST"));
					textArea.parentNode.appendChild(lineHeightTestSpan);
					textArea.lineHeight = lineHeightTestSpan.scrollHeight;
					textArea.parentNode.removeChild(lineHeightTestSpan);
				}
			}
			textArea.set = true;
		}
	};

	p.c.ITextArea.prototype.updateInterval = 100;

	p.c.ITextArea.prototype.autosizeEle = function(textArea) {
		this.setupTA(textArea);
		if(textArea.interval) {
			clearInterval(textArea.interval);
		}
		this.activeEle = textArea;
		var _this = this;
		textArea.interval = window.setInterval(function() { _this._heightUpdate(); }, this.updateInterval);
	};

	p.c.ITextArea.prototype._heightUpdate = function(textArea) {
		// 08/23/2011 GUJAS1 BUG046719 Invoke heightUpdate only if activeElement reference exists.
		if (this.activeEle) {
			this.heightUpdate(this.activeEle, true, true);
		}
	};

	p.c.ITextArea.prototype.checkForHeightUpdate = function(container) {
		if(!container){
			container = document;
		}

		var arTextAreas = pega.util.Dom.getElementsById("CTRL_TA", container);
		if(arTextAreas != null) {
			var arrayLength = arTextAreas.length;
			for (var i=0; i < arrayLength; i++) {
				var textAreaInst = pega.util.Dom.getLastChild(arTextAreas[i]);
				/* BUG-147451: check data-heightUpdated-onLoad attribute on text area to found that height updated or not */
				if(textAreaInst && textAreaInst.nodeName && textAreaInst.nodeName.toUpperCase() == "TEXTAREA") {
					var heightConfig = this.getHeightArr(textAreaInst)[0];
					if(heightConfig && heightConfig == "content" && textAreaInst.getAttribute("data-heightUpdated-onLoad") != "true") {
						return true;
					}
				}
			}
		}
		
		return false;
	}
	
	p.c.ITextArea.prototype.heightUpdateLoad = function(textArea) {
		var heightConfig = this.getHeightArr(textArea)[0];
		if(heightConfig && heightConfig == "content") {
			var processHeightUpdate = true;
			/* BUG-147451: check data-heightUpdated-onLoad attribute on text area to found that height updated or not */
			if(textArea && textArea.nodeName && textArea.nodeName.toUpperCase() == "TEXTAREA") {
				if(textArea.getAttribute("data-heightUpdated-onLoad") == "true") {
					processHeightUpdate = false;
				}
			}
			if (processHeightUpdate) {
				this.heightUpdate(textArea, true, false);
				/* BUG-147451: set an attribute on text area to found that height updated or not */
				if(textArea && textArea.nodeName && textArea.nodeName.toUpperCase() == "TEXTAREA") {
					textArea.setAttribute("data-heightUpdated-onLoad", "true");
				}
			}
			return true;
		} else {
			return false;
		}
	};

	p.c.ITextArea.prototype.heightUpdate = function(textArea, internal, callResizeHarness) {
    this.setupTA(textArea);
    if (internal && pega.util.Dom.hasClass(textArea, "TACOL")) {
        return;
    }
    if (textArea.valOrig != textArea.value || !internal) {
        textArea.valOrig = textArea.value;
        var parentNode = textArea.parentNode;
        var parentHeight = parentNode && parentNode.offsetHeight;
        var closestScrollNode = pega.u.d.getScrollParent(textArea);
        var sTop;
      var harnessContentDiv = null;
      var scrollWrapperDiv = null;
      var scrollHeightWrapperDiv = null;
      if((navigator.userAgent.toLowerCase().indexOf("safari") != -1 && navigator.userAgent.toLowerCase().indexOf("chrome") == -1)){
           harnessContentDiv = pega.ctx.dom.getElementById("HARNESS_CONTENT");
           scrollWrapperDiv = harnessContentDiv && harnessContentDiv.getElementsByClassName("workarea-view-scroll-wrapper");
           scrollHeightWrapperDiv = scrollWrapperDiv[0] && scrollWrapperDiv[0].scrollTop;
      }
        if(closestScrollNode)
            sTop = closestScrollNode.scrollTop;
       
        if (!(pega.util.Event.isIE === 8 )) { /* BUG-86141: setting height 0px causing issue in IE8 browser */
            textArea.style.height = "auto"; /* BUG-438566: setting height to auto instead of 0px */
        }
        if (pega.u.d.isMobile()){
            textArea.style.height = "0px" /* BUG-429639: setting height to 0px in mobile */
        }
        /* 07/15/2011 GUJAS1 BUG-44617 - To reduce the extra height growth of text area, commented the
        	below line which adds up the lineheight to the net height. The net height is initialized
        	with only the scrollheight of the textarea.
        	Code starts.
        */
        //var tHeight += ((textArea.valOrig == "") ? 0 : textArea.lineHeight);	
        var tHeight = textArea.scrollHeight;
        /* 07/15/2011 GUJAS1 BUG-44617 Code ends. */
        var minHeight = textArea.minHeight;
        var minHeightUnits = textArea.minHeightUnits;
        if (minHeightUnits && minHeight) {
            minHeight = parseInt(minHeight);
            if (minHeightUnits == "rows") {
                minHeight = textArea.lineHeight * minHeight;
            }
            tHeight = tHeight < minHeight ? minHeight : tHeight;
        }
        var parentDivElem = parentNode;
        while(parentDivElem.tagName!=="DIV"){
        	parentDivElem = parentDivElem.parentNode;
        }
        parentDivElem.style.height = (tHeight) + "px";
        textArea.style.height = (tHeight) + "px";
        
        parentDivElem.style.height = '';
        if(closestScrollNode)
            closestScrollNode.scrollTop = sTop;
      if((navigator.userAgent.toLowerCase().indexOf("safari") != -1 && navigator.userAgent.toLowerCase().indexOf("chrome") == -1) && scrollWrapperDiv[0] && scrollHeightWrapperDiv !=scrollWrapperDiv[0].scrollTop){
         scrollWrapperDiv[0].scrollTop = scrollHeightWrapperDiv;
      }
        setTimeout(function() {
            var parentNode = textArea.parentNode;
            if (parentNode) {
                var parentNodeStyle = parentNode.style;
                parentNodeStyle.height = "auto";
                //BEGIN:BUG-166694 :Text Area Highlight border is not spanning entire area
                //parentNodeStyle.height = (parentNode.offsetHeight + parseInt(parentNode.diff))+ "px";
                parentNodeStyle.height = (parentNode.offsetHeight) + "px";
                //END: BUG-166694 Fix
            }
        }, 200);
      callResizeHarness = false;
        //BEGIN: BUG-46780 Fix Do not call resize harness if in modal dialog.
        if (callResizeHarness && !(pega && pega.u && pega.u.d && pega.u.d.bModalDialogOpen) && !(pega.cl && pega.cl.isTouchAble())) {
            if ((document.body.scrollTop + document.body.offsetHeight + 20) >= document.body.scrollHeight) { /*BUG-221709: Flickering Screen */
                document.body.scrollTop = document.body.scrollHeight; /*BUG-221709: Flickering Screen */
            }
            pega.u.d.resizeHarness();
        }
        //END: BUG-46780 Fix Do not call resize harness if in modal dialog.
        //BEGIN: BUG-61559 Fix call resize modal dialog.
        if (callResizeHarness && pega && pega.u && pega.u.d && pega.u.d.bModalDialogOpen && !pega.util.Event.isIE) {
            pega.u.d.resizeModalDialog();
        }
        //END: BUG-61559 Fix

    }
  };

	p.c.ITextArea.prototype.getHeightArr = function(textArea) {
		var hConf = this.getAttrib(textArea, "height");
		return hConf.split("|");
	};

	p.c.ITextArea.prototype.styleCollapsed = function(textArea) {
		textArea.readOnly = true;
		textArea.style.overflow = "hidden";
		textArea.tabIndex = "-1";
		var pud = pega.util.Dom;
		pud.removeClass(textArea, "TAEXP");
		pud.addClass(textArea, "TACOL");
		var anchor = pud.getPreviousSibling(textArea);
		anchor.title = textArea.getAttribute("data-col");
		pud.setStyle(anchor, "vertical-align", "middle");
		pud.removeClass(anchor, "iconInputExpanded");
		pud.addClass(anchor, "iconInputCollapsed");

		/*BUG-96728 - To fire the reflow */ 
		if (pega.util.Event.isIE === 8){ 
			if(pega.util.Dom.hasClass(document.documentElement,"ie8")){ 
				if(textArea.offsetParent.parentNode.tagName=="TR"){ 
					textArea.offsetParent.parentNode.style.visibility=""; 
					textArea.offsetParent.parentNode.style.visibility="visible"; 
				}
			}
		}
		
		/* adding a new class to text area parent span to allow user to give styling on expand/collapse */
		if(textArea.parentNode && textArea.parentNode.id == "CTRL_TA") {
			pud.removeClass(textArea.parentNode, "textAreaInputExpanded");
			pud.addClass(textArea.parentNode, "textAreaInputCollapsed");
		}
	};

	p.c.ITextArea.prototype.styleExpanded = function(textArea) {
		textArea.readOnly = false;
		textArea.tabIndex="0";
		var hasScrollBars = this.getAttrib(textArea, "scroll");
		if(hasScrollBars && hasScrollBars == "yes") {
			textArea.style.overflow = "auto";
		}
		var pud = pega.util.Dom;
		pud.removeClass(textArea, "TACOL");
		pud.addClass(textArea, "TAEXP");
		var anchor = pud.getPreviousSibling(textArea);
		anchor.title = textArea.getAttribute("data-exp");
		pud.setStyle(anchor, "vertical-align", "top");
		pud.removeClass(anchor, "iconInputCollapsed");
		pud.addClass(anchor, "iconInputExpanded");

		/*BUG-96728 - To fire the reflow */ 
		if (pega.util.Event.isIE === 8){ 
			if(pega.util.Dom.hasClass(document.documentElement,"ie8")){ 
				if(textArea.offsetParent.parentNode.tagName=="TR"){ 
					textArea.offsetParent.parentNode.style.visibility=""; 
					textArea.offsetParent.parentNode.style.visibility="visible"; 
				}
			}
		}

		/* adding a new class to text area parent span to allow user to give styling on expand/collapse */
		if(textArea.parentNode && textArea.parentNode.id == "CTRL_TA") {
			pud.removeClass(textArea.parentNode, "textAreaInputCollapsed");
			pud.addClass(textArea.parentNode, "textAreaInputExpanded");
		}
	};

	p.c.ITextArea.prototype.updateTextAndCounter = function(eventEle) {
		if(eventEle.nodeName.toUpperCase() == "TEXTAREA") {
			var charMaxValue = eventEle.getAttribute("maxLength");
			/* BUG-89515:In IE quirks mode new line is interpreted as \r\n */
			var tempValue = eventEle.value.replace(/\r/g,"");
			if(charMaxValue){
				charMaxValue = parseInt(charMaxValue);
        var isMicrosoftEdge = navigator.userAgent.match(/Edge/ig); /*BUG-561809 maxLength is not honored by Edge*/
        if(tempValue.length > charMaxValue && (!("maxLength" in document.createElement("TEXTAREA")) || isMicrosoftEdge )) {
          /* If eventEle.value > tempValue.length substring should consider the difeerence in length  */
					/* BUG-205290: Fixed issue with remaining characters in IE */
					if (eventEle.value.length > tempValue.length) {
						eventEle.value = eventEle.value.substring(0,charMaxValue + (eventEle.value.length - tempValue.length));
					} else {
						eventEle.value = eventEle.value.substring(0,charMaxValue);
					}
					this.valueReset = true;				
				}
			}
			if(eventEle.getAttribute("updateCounter") == "true") {
        var counterSpan = pega.ctx.dom.getElementById(eventEle.id+"_counter");
        if(counterSpan){
					counterSpan.innerHTML = ((charMaxValue - tempValue.length) < 0 ? 0 :(charMaxValue - tempValue.length));
				}
			}
		}
	};

	p.c.ITextArea.prototype.toggle = function(textArea, newState, callResizeHarness) {
		var textAreaCollapsible = false;
		var prevSibling = pega.util.Dom.getPreviousSibling(textArea);
		textAreaCollapsible = (prevSibling && prevSibling.nodeName.toUpperCase() == "A");
		if(textAreaCollapsible) {
			var textAreaCollapsedState = (pega.util.Dom.hasClass(prevSibling, "iconInputExpanded") ? "e" : "c");
			var heightConfig = this.getHeightArr(textArea)[0];
			var origHeight = this.getHeightArr(textArea)[1];
			var origHeightUnits = this.getHeightArr(textArea)[2];
			if(newState && newState == textAreaCollapsedState) {
				return false;
			}
			textArea.scrollTop = 0;
			if(textAreaCollapsedState == "e") {
				textArea.rows = this.collapsedRowCount;
				textArea.style.height = "auto";
				textArea.parentNode.style.height = "auto";
				this.styleCollapsed(textArea);
				textArea.state["cs"] = "c";
				//BEGIN BUG-46780 Fix: Do not call resizeHarness if text area in modal dialog
				if(callResizeHarness && !(pega && pega.u && pega.u.d && pega.u.d.bModalDialogOpen)) {
					pega.u.d.resizeHarness();
				}
				//END BUG-46780 Fix: Do not call resizeHarness if text area in modal dialog
			} else {
				if(heightConfig && heightConfig == "content") {
					textArea.removeAttribute("rows");
					var textAreawidth = "";
					/* when we have customised width(cols) setting, width should make empty to get proper scrollHeight in IE8 Standards mode */
					if (textArea.getAttribute("cols") && pega.util.Event.isIE === 8) {
						textAreawidth = textArea.style.width;
						textArea.style.width = "";
					}
					this.heightUpdate(textArea);
					/* BUG-86135 START: calling heightUpdate again to fix collasable text area height issue in IE8 Standards mode */
					if (pega.util.Event.isIE === 8) {
						this.heightUpdate(textArea);
						/* resetting width */
						if (textArea.getAttribute("cols")) {
							textArea.style.width = textAreawidth;
							var parentNode = textArea.parentNode;
							if (parentNode){
								var parentNodeStyle = parentNode.style;
								parentNodeStyle.height = "auto";
								parentNodeStyle.height = parentNode.offsetHeight + "px";
							}
						}
					}
					/* BUG-86135 END */
				} else if(heightConfig && heightConfig == "custom") {
					if(origHeightUnits && origHeightUnits == "rows") {
						textArea.style.height = "auto";
						textArea.rows = origHeight;
					} else {
						textArea.removeAttribute("rows");
						textArea.style.height = origHeight + origHeightUnits;
					}
				} else {
					textArea.removeAttribute("rows");
					textArea.style.height = "auto";
				}
				this.styleExpanded(textArea);
				textArea.state["cs"] = "e";
				if(callResizeHarness && !(pega && pega.u && pega.u.d && pega.u.d.bModalDialogOpen)) {
					
					pega.u.d.resizeHarness();
				}
			}
			return true;
		} else {
			return false;
		}
	};

	p.c.ITextArea.prototype.click = function(event) {
		var eventEle = pega.util.Event.getTarget(event);
		if(eventEle.nodeName.toUpperCase() == "A") {
			this.toggle(pega.util.Dom.getNextSibling(eventEle), null, true);
		}
	};
	if(pega && pega.capabilityList && pega.capabilityList.isTouchAble()){
		p.c.ITextArea.prototype.tap = function(event) {
			var eventEle = pega.util.Event.getTarget(event);
			if(eventEle.nodeName.toUpperCase() == "A") {
				this.toggle(pega.util.Dom.getNextSibling(eventEle), null, true);
			}
		};

	}

	p.c.ITextArea.prototype.focus = function(event) {
		this.valueReset = false;
		var eventEle = pega.util.Event.getTarget(event);
		if(eventEle.nodeName.toUpperCase() == "TEXTAREA") {
			p.c.PlaceHolder.focusHandler(eventEle);
			pega.control.TextArea.autosize(event);
			this.value = eventEle.value;
		}
	};

	p.c.ITextArea.prototype.blur = function(event) {
		var eventEle = pega.util.Event.getTarget(event);
		if(eventEle.nodeName.toUpperCase() == "TEXTAREA") {
			p.c.PlaceHolder.blurHandler(eventEle);
			pega.control.TextArea.removeAutosize(event);
			if(this.value != eventEle.value && this.valueReset){
				pega.util.Event.fireEvent(eventEle,'change');
			}
		}
	};
	p.c.ITextArea.prototype.keyup = function(event) {
		var eventEle = pega.util.Event.getTarget(event);
		this.updateTextAndCounter(eventEle);
	};

	p.c.ITextArea.prototype.cut = p.c.ITextArea.prototype.paste = function(event) {
		var eventEle = pega.util.Event.getTarget(event);
		var that = this;
		setTimeout(function() { that.updateTextAndCounter(eventEle); }, 1);
	};

	p.c.ITextArea.prototype.doAutosize = true;
	/*BUG-61559 Added an argument container.If no arg is sent by default it selects document*/
	p.c.ITextArea.prototype.AutosizeAll = function(container) {
		if(this.resizeActive)
			return;

		if(pega.control.TextArea.doAutosize || pega.control.TextArea.checkForHeightUpdate(container)) {
			if(!container){
				container = document;
			}
			var taFound = false;
			var arTextAreas = pega.util.Dom.getElementsById("CTRL_TA", container);
			if(arTextAreas != null) {
				var arrayLength = arTextAreas.length;
				for (var i=0; i < arrayLength; i++) {
					var textAreaInst = pega.util.Dom.getLastChild(arTextAreas[i]);
					if(textAreaInst.offsetHeight > 0) {
						var taFoundTemp = pega.control.TextArea.heightUpdateLoad(textAreaInst);
						taFound = taFound ? taFound : taFoundTemp;
					}
				}
			}
			if(taFound) {
				pega.control.TextArea.doAutosize = false;
				//BUG-46780 Fix do not call reize harness in case text area is in modal dialog.
				if(!(pega && pega.u && pega.u.d && pega.u.d.bModalDialogOpen)){
					this.resizeActive = true;
					pega.u.d.resizeHarness();
					var that = this;
					setTimeout(function() { that.resizeActive = false;} , 1);
				}
			}
		} else {
			pega.control.TextArea.doAutosize = true;
		}
	};

	
	/* Instantiate ITextArea */
	p.c.TextArea = new p.c.ITextArea();
	
	p.c.TextArea.Actions.changeStyle = function(e, styleText) {
		e = pega.util.Event.getEvent(e);
		var eventType = e.type;
		var element = pega.util.Event.getTarget(e);
		
		if(eventType == "focus" || eventType == "focusin") {
			pega.util.Event.addListener(element, "focusout", function(e) {
				e = pega.util.Event.getEvent(e);
				var targetEle = pega.util.Event.getTarget(e);
				p.c.TextArea.Actions.changeStyle(e);
				pega.util.Event.removeListener(targetEle, "focusout");
			});
		} else if(eventType == "mouseover") {
			pega.util.Event.addListener(element, "mouseout", function(e) {
				e = pega.util.Event.getEvent(e);
				var targetEle = pega.util.Event.getTarget(e);
				p.c.TextArea.Actions.changeStyle(e);
				pega.util.Event.removeListener(targetEle, "mouseout");
			});
		}
		
		var stylegroups = {"textarea" : [], "span" : []};
		var styleElemArr = [];
		if(styleText) styleElemArr = styleText.split(";");
		for(var i = 0; i < styleElemArr.length; i++) {
			var arrProp = styleElemArr[i].split(":");
			if(arrProp && arrProp.length == 2) {
				var propName = pega.lang.trim(arrProp[0]).toLowerCase();
				var propValue = pega.lang.trim(arrProp[1]);
				if(propName.indexOf("font") == 0 || propName.indexOf("text") == 0 || propName == "color"  || propName == "background-color" || propName == "vertical-align") {
					stylegroups.textarea.push(propName + ":" + propValue);
				}
				if(propName.indexOf("border") == 0 || propName == "background-color") {
					stylegroups.span.push(propName + ":" + propValue);
				}
			}
		}
		
		// Data structure that categorises event groups - focus/iefocus/mouse, along with their intended operation - add/remove.
		// Augment this structure appropriately instead of adding conditions
		var events = {"focusevent" : {"add" : "focus", "remove" : "blur"}, "iefocusevent" : {"add" : "focusin", "remove" : "focusout"}, "mouseevent" : {"add" : "mouseover", "remove" : "mouseout"}};
			
		element.styleArr = element.styleArr || []; // An array instead of  an object since we want to preserve order
		// Push default style into the array
		if (element.styleArr.length == 0) {
			element.styleArr.push({"eventGroup" : "default" , "style" : {"textarea" : [element.style.cssText], "span" : [element.parentNode.style.cssText]}});
		}
		
		var addEventType = false;
		var removeEventType = false;
		var eventGroup;
		for(eventGroup in events) {
			if(events[eventGroup].add == eventType) {
				addEventType = true; break;
			} else if(events[eventGroup].remove == eventType) {
				removeEventType = true; break;
			}
		}
		
		if(addEventType) {
			element.styleArr.push({"eventGroup" :  eventGroup, "style" : stylegroups});
		} else if(removeEventType) {
			var actionIndexArr = [];
			var len = element.styleArr.length;
			for(var i=0; i < len; i++) {
				if(element.styleArr[i].eventGroup == eventGroup) {
					actionIndexArr.push(i); 
				}
			}
			
			for(var i= 0; i < actionIndexArr.length; i++) {
				element.styleArr.splice(actionIndexArr[i], 1);
			}
		} else {
			// Neither an add nor a remove operation. Check the events data structure
			return false;
		}
		// Creating a new style string
		var spanstyleStr = "";
		var textareastylestr = "";
		for(var i=0; i< element.styleArr.length; i++) {
			var styleObj = element.styleArr[i].style;
			spanstyleStr += ";" + styleObj.span.join(";");
			textareastylestr += ";" + styleObj.textarea.join(";");
		}
		element.parentNode.style.cssText = spanstyleStr + ";height:" + element.parentNode.style.height;
		element.style.cssText = textareastylestr + ";height:" + element.style.height;
		
		return true;
		
	}
	if(pega.u && pega.u.d){
		pega.u.d.registerResize(p.c.TextArea.AutosizeAll);
	}
})(pega);


/* Utility Method "encamel" used by p.c.ITextArea.getComputedStyle */
(function(){
	var dash = /-(.)/g;
	var toHump = function(a, b) { return b.toUpperCase(); };
	String.prototype.encamel = function() { return this.replace(dash, toHump); };
})();
//static-content-hash-trigger-YUI