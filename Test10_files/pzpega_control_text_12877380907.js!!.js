if(typeof(pega) != "undefined") {/* HFIX-9650:BUG-161363: Kept if check to avoid exception when loaded in a new <iframe> when FilePath control is used. */
(function(p){
	if(!p.control){
		p.c = p.namespace("pega.control");
	} else {
		p.c = pega.control;
	}
	
	/* IText Constructor */
	p.c.IText = function() {
		if (p.c.IText.superclass && p.c.IText.superclass.constructor) {
			p.c.IText.superclass.constructor.call(this, "Text");
		}
	};

	/* Inherit form IUIElement */
	try {
		p.lang.extend(p.c.IText, p.c.IUIElement);
	} catch(ex){}

	/*Instantiate TextControl*/
	p.c.Text = new p.c.IText();
	

	/*Show Smart Info function*/
	if(p.c.Text && p.c.Text.Actions) {
		p.c.Text.Actions.showSmartInfo = function(strSectioName, strHeader, event){
			var targetElement = pega.util.Event.getTarget(event);
			if(!p.c.IText.prototype.smartInfoObj){
				p.c.IText.prototype.smartInfoObj = new SmartInfo();
			}
			var strURL = SafeURL_createFromURL(pega.u.d.url);
			strURL.put("pyActivity","ReloadSection");
			var baseRef = p.u.d.getBaseRef(null,event) + p.u.d.getRepeatPage(null,event);
			strURL.put("StreamName", strSectioName);
			strURL.put("StreamClass", "Rule-HTML-Section");
			strURL.put("BaseReference", baseRef);
			if(pega.ui.onlyOnce) {
				var oOSafeUrl = SafeURL_createFromURL(pega.ui.onlyOnce.getAsPostString());
				strURL.copy(oOSafeUrl);
			}
		
			strHeader = "<span class='smartInfostrHeaderStyle '>" + strHeader + "</span>";
			pega.util.Event.addListener(targetElement,"mouseout",function(event){
				var msOuttargetEle = pega.util.Event.getTarget(event);
				p.c.Text.smartInfoObj.hideInfo();
				pega.util.Event.removeListener(msOuttargetEle,"mouseout");
				});
			p.c.Text.smartInfoObj.showInfoAdvanced(targetElement, strHeader, strURL.toQueryString(), true , true, false ,"","",false,event);
		};
	}

})(pega);

}