//<script>
pega.namespace("pega.tools");

if (typeof pega.tools.useWgx == "undefined")
{
	pega.tools.useWgx = false;
	if ("ActiveXObject" in window)
	{
		try
		{
			new ActiveXObject("Microsoft.XMLDOM");
		}
		catch (e)
		{
			pega.tools.useWgx = true;
			$.ajax
			({
				url: "webwb/pzWickedGoodXpath.js",
				dataType: "script",
				success: function(data, textStatus, jqXHR) { wgxpath.install(); },
				async: false
			});
		}
	}
}

pega.tools.normalizeXpath = function(xPath){
      if (!pega.tools.XMLDocumentUseZeroBasedIndex || "ActiveXObject" in window){
            return xPath;
      }
      var test = /(\[)(\d+)(\])/g;
      return xPath.replace(test, function(match, p1, p2, p3){
            return p1 + (parseInt(p2, 10) + 1) + p3;  
      });
};

pega.tools.XMLDocumentUseZeroBasedIndex = false;
pega.tools.XMLDocument = 
{
	get: function(sSignature)
	{
		var isMoz = false;
		if ("ActiveXObject" in window && !pega.tools.useWgx)
		{
			isMoz = false;

			// default, sSignature will be null, but if you are given the signature
			// then use it and don't search for a more current one
			if ((sSignature == null) || (sSignature == "")) {
				var arrSignatures;
				if (pega.tools.XMLDocumentUseZeroBasedIndex) {
					arrSignatures = ["Microsoft.XmlDom", "MSXML2.DOMDocument.3.0"];
				} else {
					arrSignatures = ["MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.3.0"];
				}
				for (var i=0; i < arrSignatures.length; i++)
				{
					try
					{
						var dom = new ActiveXObject(arrSignatures[i]);
						if (!pega.tools.XMLDocumentUseZeroBasedIndex && arrSignatures[i] == "MSXML2.DOMDocument.3.0") {
							// the 3.0 dom document defautls to XSLPattern, need to change it to XPath if not zero based index.
							dom.setProperty("SelectionLanguage", "XPath");
						}
						return dom;
					}
					catch (err)
					{
				
					}
				}
				throw new Error("MSXML is not installed on your system.");
			}
			else {
				try
				{
					var dom = new ActiveXObject(sSignature);
					return dom;
				}
				catch (err)
				{
				
				}
			}
			throw new Error("MSXML is not installed on your system.");
		}
		else if (document.implementation && document.implementation.createDocument)
		{
			isMoz = true;
			var dom = document.implementation.createDocument("", "pagedata", null);
			dom.parseError = 
			{
				valueOf: function () { return this.errorCode; },
				toString: function () { return this.errorCode.toString(); }
			};
			
			dom._initError();
			dom.addEventListener("load", function()
				{
					this._checkForErrors();
					this._changeReadyState(4);
				}, false);
			return dom;
		}
		else
		{
			throw new Error ("Your browser doesn't support an XML DOM object.");
		}
	},
	
	defineGetter: function(obj, prop, get)
	{
		if (Object.defineProperty)
		{
	    		return Object.defineProperty(obj, prop, this.accessorDescriptor("get", get));
	 	}
	 	if (Object.prototype.__defineGetter__)
	  	{
	    		return obj.__defineGetter__(prop, get);
		}	
		throw new Error("browser does not support getters");
	},

	accessorDescriptor: function(field, fun)
	{
		var desc = { enumerable: true, configurable: true };
		desc[field] = fun;
		return desc;
	},
	
	removeTextNodes: function(elem){
	/*This API intends to clear the unnecessary text nodes (nodeType==3) in the xml*/
	if(!elem || (elem.tagName && elem.ownerDocument.documentElement.tagName.toLowerCase()=="html")){ /*API is intended only for XML DOM, hence added second condition to skip execution when HTML DOM*/
		return;
	}
	var children = elem.childNodes;
		if(!children){
			return;
		}
        var child;
        var len = children.length;
        var i = 0;
        var whitespace = /^\s*$/;
        for(; i < len; i++){
            child = children[i];
            if(child.nodeType == 3){
                if(whitespace.test(child.nodeValue)){
                    elem.removeChild(child);
                    i--;
                    len--;
                }
            }else if(child.nodeType == 1){
                this.removeTextNodes(child);
            }
        }
	},

	isWhitespace : function(elem){
		var whitespace = /^\s*$/;
		if(elem.nodeType == 3 && whitespace.test(elem.nodeValue)){
			return true;
		} return false;
	}
}

var oMozDocument = null;
if (typeof XMLDocument != "undefined") 
{
    oMozDocument = XMLDocument;
} 
else if (typeof Document != "undefined") 
{
    oMozDocument = Document;
}

if (oMozDocument && !window.opera)
{
    try
	{
		oMozDocument.prototype.readyState = 0;
		//BUG-188518 - Safari on Mac logs an error while trying to modify (or even access) a prototype property of a native object; probably as a way to promote best practice of not modifying native objects
		//Detecting Safari on Mac to not execute the next statement
		if (!(pega.env.ua.webkit && /Macintosh/.test(navigator.userAgent))) {
			oMozDocument.prototype.onreadystatechange = null;
		}
    }
	catch(e) { }
    
    oMozDocument.prototype._changeReadyState = function (iReadyState) 
    {
		try {
			this.readyState = iReadyState;
		} catch(e) {
		}
        if (typeof this.onreadystatechange == "function") {
            this.onreadystatechange();
        }
    };

    oMozDocument.prototype._initError = function () 
    {
		this.parseError.errorCode = 0;
        this.parseError.filepos = -1;
        this.parseError.line = -1;
        this.parseError.linepos = -1;
        this.parseError.reason = null;
        this.parseError.srcText = null;
        this.parseError.url = null;
    };
    
    oMozDocument.prototype._checkForErrors = function () 
    {
		var docEl = this.documentElement,
		/*Fix for webkit/firefox where it returns text node as firstChild - Bug-118923 : kumad1*/
			docElChild = docEl.firstElementChild || docEl.firstChild; 
		/* 
		* Need to check if the childs got failed in case the string is of html document
		*/
        if (docEl.tagName == "parsererror" || (docElChild && docElChild.tagName == "parsererror") || (docElChild && docElChild.firstChild && docElChild.firstChild.tagName  == "parsererror")) /*Bug-118923 : kumad1*/
        {

            var reError = />([\s\S]*?)Location:([\s\S]*?)Line Number (\d+), Column (\d+):<sourcetext>([\s\S]*?)(?:\-*\^)/;

            reError.test(this.getXmlOrSerialize());
            
            this.parseError.errorCode = -999999;
            this.parseError.reason = RegExp.$1;
            this.parseError.url = RegExp.$2;
            this.parseError.line = parseInt(RegExp.$3);
            this.parseError.linepos = parseInt(RegExp.$4);
            this.parseError.srcText = RegExp.$5;
        }
    };
            
    oMozDocument.prototype.loadXML = function (sXml) 
    {
        this._initError();
    
        this._changeReadyState(1);
    
        var oParser = new DOMParser();
        var oXmlDom = oParser.parseFromString(sXml, "text/xml");
 
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }


        for (var i=0; i < oXmlDom.childNodes.length; i++) {
			if (oXmlDom.childNodes && oXmlDom.childNodes.length > 0 )
			{
				var oNewNode = this.importNode(oXmlDom.childNodes[i], true);
				this.appendChild(oNewNode);
			}
        }

        this._checkForErrors();
        
		this._changeReadyState(4);
		if (this.parseError.errorCode == 0)
			return true;
		else
			return false;
	

    };
    
    oMozDocument.prototype._load = oMozDocument.prototype.load;

    oMozDocument.prototype.load = function (sURL) 
    {
        this._initError();
        this._changeReadyState(1);
        this._load(sURL);
		if (this.parseError.errorCode == 0)
			return true;
		else
			return false;        
    };
    
    // Note: __defineGetter__ and __defineSetter__ are nonstandard deprecated functions...
	if (Node.prototype.__defineGetter__ && Node.prototype.__defineSetter__) {
		Node.prototype.__defineGetter__("xml", function () 
		{
			var oSerializer = new XMLSerializer();
			return oSerializer.serializeToString(this, "text/xml");
		});

		Node.prototype.__defineGetter__("text", function () 
		{
			var sText = "";
			for (var i = 0; i < this.childNodes.length; i++) {
				if (this.childNodes[i].hasChildNodes()) {
					sText += this.childNodes[i].text;
				} else {
					sText += this.childNodes[i].nodeValue;
				}
			}
			return sText;

		});

		Node.prototype.__defineSetter__("text", function(text){
			this.textContent = text;
		});
	} else {
		pega.tools.XMLDocument.defineGetter(Node,"xml", function () 
		{
			var oSerializer = new XMLSerializer();
			return oSerializer.serializeToString(this, "text/xml");
		});
		
		pega.tools.XMLDocument.defineGetter(Node,"text", function () 
		{
			var sText = "";
			for (var i = 0; i < this.childNodes.length; i++) {
				if (this.childNodes[i].hasChildNodes()) {
					sText += this.childNodes[i].text;
				} else {
					sText += this.childNodes[i].nodeValue;
				}
			}
			return sText;
		});
	}

    Element.prototype.selectNodes = function(sXPath)
    {
		if (typeof XPathEvaluator != 'undefined') // non-IE browsers and IE Quirks Mode
		{
			sXPath = pega.tools.normalizeXpath(sXPath);
	   		var oEvaluator = new XPathEvaluator();
			var oResult = oEvaluator.evaluate(sXPath, this, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
			var aNodes = new Array();
			
			if (oResult !=null)
			{
				var oElement = oResult.iterateNext();
				while(oElement)
				{
					aNodes.push(oElement);
					oElement = oResult.iterateNext();
				}
			}
			aNodes.item = function(index){
				return this[index];
			};
			if (aNodes.length == 0) 
				return null;
			else 
				return aNodes;
		}
		else if (document.evaluate)
		{
			var oResult = document.evaluate(sXPath, this, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
			var aNodes = new Array();
			
			if (oResult !=null)
			{
				var oElement = oResult.iterateNext();
				while(oElement)
				{
					aNodes.push(oElement);
					oElement = oResult.iterateNext();
				}
			}
			aNodes.item = function(index){
				return this[index];
			};
			return aNodes.length == 0 ? null : aNodes;
		}
		else
		{
			var dom = new ActiveXObject("Microsoft.XMLDOM");
			dom.loadXML(this.getXmlOrSerialize());
			dom.setProperty("SelectionNamespaces",    "xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
			dom.setProperty("SelectionLanguage", "XPath");
			if (dom.documentElement == null)
				return null;
		 	return dom.documentElement.selectNodes(sXPath);
		}
    };

	Element.prototype.selectSingleNode = function(sXPath)
	{
		if (typeof XPathEvaluator != 'undefined' ) // non-IE browsers and IE Quirks Mode
		{
			sXPath = pega.tools.normalizeXpath(sXPath);
            
            /*Edge does not support xpath of /^(\.\.\/)*(\.\.)/ format. Returning the actual node by traversing to the parent based on the number of '/'s in the xpath */
          	if(navigator.userAgent.indexOf("Edge")!=-1 && /^(\.\.\/)*(\.\.)/.test(sXPath)){
            	var xPathArray = sXPath.split("/");
              	var result = this;
              	for(var i =0; i<xPathArray.length; i++){
                  if(result.parentNode){
                    result = result.parentNode;
                    if(xPathArray[i] && xPathArray[i] != ".."){
                    	result = result.getElementsByTagName(xPathArray[i])[0];
                    }
                  } else {
                    return null;
                  }
                }
              	return result;
          	}
			var oEvaluator = new XPathEvaluator();
			var oResult = oEvaluator.evaluate(sXPath, this, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
			
			if (oResult !=null)
			{
				return oResult.singleNodeValue;
			}
			else
				return null;
		}
		else if (document.evaluate)
		{
			var oResult = document.evaluate(sXPath, this, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
			return oResult ? oResult.singleNodeValue : null;
		}
		else
		{
			var dom = new ActiveXObject("Microsoft.XMLDOM");
			dom.loadXML(this.getXmlOrSerialize());
			dom.setProperty("SelectionNamespaces",    "xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
			dom.setProperty("SelectionLanguage", "XPath");
			if (dom.documentElement == null)
				return null;
		 	return dom.documentElement.selectSingleNode(sXPath);
		}
    };

	Element.prototype.getXmlOrSerialize = function()
	{
		return this.xml ? this.xml : (new XMLSerializer()).serializeToString(this);
	};

    oMozDocument.prototype.getUniqueId = function() {
		return Element.prototype.getUniqueId(); 	
    };

    oMozDocument.prototype.selectNodes = function(sXPath)
    {
		if (typeof XPathEvaluator != 'undefined') // non-IE browsers and IE Quirks Mode
		{

			sXPath = pega.tools.normalizeXpath(sXPath);
	   		var oEvaluator = new XPathEvaluator();
			var oResult = oEvaluator.evaluate(sXPath, this, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
			var aNodes = new Array();
			if (oResult !=null)
			{
				var oElement = oResult.iterateNext();
				while(oElement)
				{
					aNodes.push(oElement);
					oElement = oResult.iterateNext();
				}
			}
			aNodes.item = function(index){
				return this[index];
			};
			if (aNodes.length == 0) 
				return null;
			else 
				return aNodes;
		}
		else if (document.evaluate)
		{
			var oResult = document.evaluate(sXPath, this, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
			var aNodes = new Array();
			if (oResult !=null)
			{
				var oElement = oResult.iterateNext();
				while(oElement)
				{
					aNodes.push(oElement);
					oElement = oResult.iterateNext();
				}
			}
			aNodes.item = function(index){
				return this[index];
			};
			return aNodes.length == 0 ? null : aNodes;
		}
		else
		{
			var dom = new ActiveXObject("Microsoft.XMLDOM");
			dom.loadXML(this.getXmlOrSerialize());
			dom.setProperty("SelectionNamespaces",    "xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
			dom.setProperty("SelectionLanguage", "XPath");
			if (dom.documentElement == null)
				return null;
		 	return dom.documentElement.selectNodes(sXPath);
		}
    };

	oMozDocument.prototype.selectSingleNode = function(sXPath)
	{
		if (typeof XPathEvaluator != 'undefined') { // non-IE browsers and IE Quirks Mode
			sXPath = pega.tools.normalizeXpath(sXPath);
			var oEvaluator = new XPathEvaluator();
			var oResult = oEvaluator.evaluate(sXPath, this, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
			
			if (oResult !=null)
			{
				return oResult.singleNodeValue;
			}
			else
				return null;
		}
		else if (document.evaluate)
		{
			var oResult = document.evaluate(sXPath, this, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
			return oResult ? oResult.singleNodeValue : null;
		}
		else
		{
			var dom = new ActiveXObject("Microsoft.XMLDOM");
			dom.loadXML(this.getXmlOrSerialize());
			dom.setProperty("SelectionNamespaces",    "xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
			dom.setProperty("SelectionLanguage", "XPath");
			if (dom.documentElement == null)
				return null;
		 	return dom.documentElement.selectSingleNode(sXPath);
		}
	};

	oMozDocument.prototype.getXmlOrSerialize = function()
	{
		return this.xml ? this.xml : (new XMLSerializer()).serializeToString(this);
	};
}
//static-content-hash-trigger-GCC
/*

------------------------------------------------------------------
| File     Edit    View    Application    Run    Tools      Help |
------------------------------------------------------------------
	| My Profile      |
	| My Rules        |
	| Advanced Search |
	|-----------------|
	| Preferences     |
	-------------------
*/
//<script>
if(typeof(pega) != "undefined") {/* HFIX-9650:BUG-161363: Kept if check to avoid exception when loaded in a new <iframe> when FilePath control is used. */
//var b = true;

pega.namespace("pega.ui.menubar");


pega.ui.menubar.Cache = {};

pega.ui.menubar.counter = 0;

pega.ui.menubar.trNode = document.createElement("tr");
pega.ui.menubar.tableNode = document.createElement("table");
pega.ui.menubar.tbodyNode = document.createElement("tbody");
pega.ui.menubar.tdNode = document.createElement("td");
pega.ui.menubar.spanNode = document.createElement("span");
pega.ui.menubar.divNode =  document.createElement("div");
pega.ui.menubar.aNode =  document.createElement("a");
pega.ui.menubar.eventNode = document.createElement("div");


pega.ui.menubar.RegisterMenu = function(referenceID, objRef) {

	pega.ui.menubar.Cache[referenceID] = objRef;
}

pega.ui.menubar.GetMenu = function(referenceID) {
	return pega.ui.menubar.Cache[referenceID];
}

pega.ui.menubar.displayModalAction = function(localAction, baseRef, event, modalStyle) {
	var actionURL = new SafeURL();
	actionURL.put("BaseReference",baseRef);
	actionURL.put("bReload", "false");
	pega.u.d.processAction(localAction, '','','','',true,event,'',actionURL,'','',modalStyle);
}

/**
@description Menubar manager handles creation of menu items and events related to menus



*/


pega.ui.menubar.Manager = function() {


	this.dataSource = new pega.ui.menubar.DataInterface();
	this.dataSource.menu = this;
	this.domParent;
	this.objMenubar;

	this.dateObj = new Date();
	this.uuid = "MN-" + pega.ui.menubar.counter++;


	//configuration properties
	this.alignment = "horizontal";
	this.anchor = null;
	this.submenualignment = "Left";
	this.stylePrefix = "";

	this.active = false;
	this._deferLoad = true;

	this.menuCache = {};
	this.contextMenuCache = {};
	this._visible = {};
	this._visibleCount = 0;
	this.zIndex = 100; 
         /* BUG-73191: Changed Z-Index from 50 to 100, as when menu appears for a element in an Overlay/popover it hides behind the Overlay.The Z-Index of overlay is always 100 */
	this.renderMode = "simple";
	this.currentHighlight;
	this.topLevelItems = new Array();
	this.crawl = "down";


	/* Fix for BUG-60821 */
	this.desktopClickHandler = new pega.desktop.MouseEventHandler();

	if(pega.desktop.support.getDesktopApplication() != null || this.callRegister){
		pega.desktop.registerEventListener("DesktopMouseClick", this._desktopMouseClickHandler, this.desktopClickHandler, this);
		pega.desktop.registerEventListener("pega.com$pega-desktop$resize", this._onDesktopResize,null, this);
	}
	else{
		try {
			pega.d.MouseEvent.registerClickListener(this._desktopMouseClickHandler, this);
		}
		catch(err){
			
		}
	}

	/* End of fix for BUG-60821 */

	/* BUG-172066 - Add a tap event listener when working on a mobile device */
  	// Tap event is deprecated as part of this US-130296
	if(pega.cl && pega.cl.isTouchAble()) {
		pega.util.Event.addListener(document.body,"click", this._desktopMouseClickHandler, null, this);
	}

	this.mouseClickRegistered = true;

	this._maxTopItemWidth = -1;

	this.callback;
	this.closeCallback;
	this.closeCallbackScope;
	this.radioCollections = {};
	// Task - 16138
	//this._highlightPath = new Array();

	this._highlightPath = "";
	this._highlightObjs = new Array();

	this.maxTextLength = 25;
	this.iconAlignment = "Right";

}

pega.ui.menubar.Manager.prototype = {

		/*
------------------------------			public methods			---------------------------------------

		*/


	connectDataXML: function (objXML,keys) {
		this.dataSource.connectDataXML(objXML,keys);
	},

	isElementInViewport : function (element) {
        if (element instanceof jQuery) {
            element = element[0];
        }
        var rect = element.getBoundingClientRect();

        return (
            rect.top < $(window).height() &&
            rect.left < $(window).width() &&
            rect.bottom > 0 &&
            rect.right > 0
        );
    },

	/* Autobots Sprint 12 - 
	 * 'oLoc' is an object that contains 5 members - x, y, relativeElement, align & maxChars. If 'relativeElement' is not undefined
	 * then the menu will be positioned relative to 'relativeElement'. Otherwise, the menu will be positioned to
	 * x & y, which gives the location of the mouse-pointer when the event occured.
	 */
	doContextMenu: function(XMLNode,oLoc) {
		//BUG-194729 - Checking if triggering element is still in viewport
		if(oLoc.relativeElement) {
			// Check if this element is in the viewport, if not return
			if (! this.isElementInViewport(oLoc.relativeElement)) return;	
		}

		var x = ((pega.util.Event.getPageX(oLoc) > oLoc.x )? pega.util.Event.getPageX(oLoc): oLoc.x);
		var y = ((pega.util.Event.getPageY(oLoc) > oLoc.y )? pega.util.Event.getPageY(oLoc): oLoc.y);
		this.setMaxTextLength(oLoc.maxChars);
		this.desktopClickHandler.pageX = x;
		this.desktopClickHandler.pageY = y;
		if(oLoc.pyFormat)
			this.renderMode=oLoc.pyFormat;
		if(oLoc.formatNav)
			this.renderMode=oLoc.formatNav;

		//Design is to have XMLNode be an actual node, or XPath string that uses the preloaded datasource obj.
		//oLoc should be an object or an XY location.

		//clear all the previous menus, fixed to remove the iframe leaking.
		this._hideAll();

		this.dataSource.connectContextMenuSource(XMLNode);

		this._clearContextMenuCache();

		this.active = true;
		var mn = this._constructSubMenu(XMLNode,"/contextMenu",true);

		var scrollTop = document.body.scrollTop;

		if((scrollTop == 0) && typeof( window.pageYOffset ) == 'number' ) {
			//For IE9 Standards mode
			scrollTop = window.pageYOffset;
		} else if((scrollTop == 0) && document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
		    //IE8 standards compliant mode
		    scrollTop = document.documentElement.scrollTop;
		}
		

		if ((y + mn.element.scrollHeight) > document.body.clientHeight + scrollTop) {
			
			y = (document.body.clientHeight + scrollTop) - mn.element.scrollHeight;
		}		
		

		var clientRgn = pega.util.Dom.getClientRegion(),  
			relativeElement = oLoc.relativeElement, parentElement = oLoc.parentElement,
			xy = [], menuWidth = mn.element.offsetWidth;
		if(pega.util.Event.isIE){
			clientRgn.bottom = clientRgn.bottom - clientRgn.top;
		}
		if(parentElement){
			this.domParent = parentElement;
		}
		if(relativeElement){
			this.domParent = relativeElement;	
			     if(pega.util.Event.isIE){
 			   	var temp = relativeElement.getBoundingClientRect();
				 xy = [temp.left,temp.top];				
		               }			
			      else	
			      {		
			   	  xy = pega.util.Dom.getXY(relativeElement);	
			      }
			var eleWidth = relativeElement.offsetWidth;
			if(oLoc.align=="right"){
				/*if the relativeElement is not fully visible on screen*/				
				//if(xy[0]<clientRgn.right && (xy[0]+eleWidth)>clientRgn.right),commented 1 line for BUG-126513 putting OR condition for 
				//proper evaluating, whether scrollbar is present or not.
				if((xy[0]<clientRgn.right && (xy[0]+eleWidth)>clientRgn.right) || (x > document.body.clientWidth))
					//eleWidth = xy[0]+eleWidth-clientRgn.right;				
					eleWidth = clientRgn.right - xy[0];				
				x = (xy[0]+eleWidth) - (menuWidth);
				if(x<0)
					x = xy[0];
			}else	
	
				x = xy[0];			
			y = xy[1]+relativeElement.offsetHeight;

	/*BUG-53489 The menu would be rendered at bottom if sufficient place is avilable elseif top,if it has sufficient place else at the maxavail(top,bottom) with scrollbar  */

			if(clientRgn.bottom - y < mn.element.offsetHeight && xy[1] >= mn.element.offsetHeight){
				if(pega.util.Event.isIE)
					y = pega.util.Dom.getXY(relativeElement)[1]  -mn.element.offsetHeight -4;
				else
					y = xy[1]-mn.element.offsetHeight;

			}
			else if(clientRgn.bottom - y < mn.element.offsetHeight && xy[1] < mn.element.offsetHeight){
				if(xy[1]>(clientRgn.bottom - y)){
				  y = clientRgn.top+4;					  	
				  mn.element.style.height = (xy[1]-4)+"px";
				}
				else{
				   mn.element.style.height = (clientRgn.bottom - y)+"px"; 
				  if(pega.util.Event.isIE)
				    y = pega.util.Dom.getXY(relativeElement)[1] + relativeElement.offsetHeight + 4;	
				}
				mn.element.style.overflowY = 'auto';
				
			}
			else if(pega.util.Event.isIE)
			         y = pega.util.Dom.getXY(relativeElement)[1] + relativeElement.offsetHeight ;
				
			/* if space is not available below, move the menu up */
			//y = ((y+mn.element.offsetHeight)>clientRgn.bottom)?(xy[1]-mn.element.offsetHeight):y;				
		}		
		x = ((x+menuWidth)>clientRgn.right)?(((x-menuWidth)<0)?0:x-menuWidth):x;		
		mn.cfg.setProperty("visible",true);
		/* BUG-103296: Declare Expressions menus getting extra space; removed '+10' from mn.element.style.width*/		
		if(mn.element.scrollHeight>mn.element.offsetHeight)
		{
			mn.element.style.width = mn.element.offsetWidth;
			if(oLoc.align=="right") {
				x = x-10;
			}
		}
		mn.cfg.setProperty("x",x);
		mn.cfg.setProperty("y",y);

		this._visible["/contextMenu"] = mn;

		mn.element.oncontextmenu = function(evt){if (evt==null) evt = event; evt.returnValue = false; if(evt.preventDefault){evt.preventDefault();}};


		mn.cfg.setProperty("zIndex",this.zIndex);

		this.zIndex++;
		this._visibleCount++;
		//pega.desktop.sendEvent("pega.com$pega-ui$componentfocus",this.uuid,ASYNC);
	          var that = this;
		//Prevent firing at once as the rendering of the menu can itself trigger a resize - BUG-139340	  
		var fireNow = false;
		this._tmpResizeCallback = function(){ if(fireNow == true) {that._handleDesktopResize(); } else { fireNow = true;}};
		pega.u.d.registerResize(this._tmpResizeCallback);

		/* Fix for Bug-76821: Adding listener on build of menu */
		if(!pega.util.Event.isIE && !pega.env.ua.webkit){
			pega.util.Event.addListener(document.body,"DOMMouseScroll",this._scrollHandler,null,this);
		} else {
			pega.util.Event.addListener(document.body,"mousewheel",this._scrollHandler,null,this);		
		}

		//pega.util.Event.addListener(document.body,"mousedown",this._scrollHandler,null,this);
		//pega.util.Event.addListener(document.body,"onscroll",this._scrollHandler,null,this);

                var that  =this;
                setTimeout(function(){
                     pega.util.Event.addListener(document.body,"mousedown",that._scrollHandler,null,that);
		     pega.util.Event.addListener(document.body,"onscroll",that._scrollHandler,null,that);}, 500);
		/* BUG-133012: Binding to touchmove for touchable devices. */
		if(pega.cl && pega.cl.isTouchAble()) {
			pega.util.Event.addListener(document.body,"touchstart",this._scrollHandler,null,this);
		}

		/* for accessibility - store the first element that we will use to set the focus on if key down is used */
		var elem = mn.oDom;
		var firstelem = elem.getElementsByTagName("td");
		if(firstelem && firstelem.length>2) {
			pega.util.Event.addListener(document.body,"keydown",this._doContextMenuKeyDown ,firstelem[1],this);
			/* Wrapping around a try catch block because of an error in IE8 - Disabled menu items still need to be still handled as they are broken for keyboard accessibility */
			try {
				if(firstelem[1].focus) firstelem[1].focus();
			} catch(e){}
		} else {
			pega.util.Event.addListener(document.body,"keydown",this._deactivate ,null,this);
		}
		/* End of Fix for Bug-76821 */	
		this.contextMenu = true;

	},

	getDataXML: function () {
		return this.dataSource.dataSource;

	},

	refresh: function() {
		this.dataSource.refresh();
		//this.render();
	},

	registerCloseCallback: function(oCallback, oScope) {

		this.closeCallback = oCallback;
		this.closeCallbackScope = oScope;
	},
	isInMenu: function(oElement) {
		if(!oElement){
			oElement = pega.util.Event.getTarget(window.event);
		}
		while(oElement){
			if(oElement.className && typeof oElement.className == "string" && (oElement.className.toLowerCase().indexOf("menuitem") != -1 || oElement.className.toLowerCase().indexOf("menubar") != -1)){
				return true;
			}
			oElement = oElement.parentNode;
		}
		return false;
		
	},
	

	registerCallback: function(oCallback,oScope) {
		this.callback = oCallback;
		this.callbackscope = oScope;
	},

	render: function(el,mode) {
		pega.util.Event.addListener(window,"unload",this._nullify,null,this);
		this._reset();
		if (mode) this.renderMode = mode.toLowerCase();
		if(this.renderMode=="standard_tabbed") this.renderMode="standard tabbed";
		if(this.renderMode=="standard tabbed" && this.alignment == "tabbed") this.renderMode="tabbed";

		//set the Menubar's containing element

		if (el) this.domParent = el;

		while (this.domParent.hasChildNodes()) {
			this.domParent.removeChild(this.domParent.childNodes[0]);
		}

		this._buildMenu();
	},

	setDeferLoad: function(bLoad) {
		this._deferLoad = bLoad;
	},

	setDataKeys: function(dataKeyObj) {

	},

	setStylePrefix: function(prefix) {
		this.stylePrefix = prefix;
	},

	getStylePrefix: function() {
		return this.stylePrefix;
	},

	setAlignment: function(a) {
		this.alignment = a.toLowerCase();
	},

	setAlternateWindow: function(win) {
		this.desktopClickHandler.alternateWindow = win;
	},

	setSrcElement: function(el) {
		this.desktopClickHandler.srcElement = el;
	},

	setAnchor: function(a) {
		this.anchor = a;
	},

	getAlignment: function() {
		return this.alignment;
	},

	getAnchor: function() {
		return this.anchor;
	},


	setSubMenuAlignment: function(sa) {
		this.submenualignment = sa;
	},

	setIconAlignment : function(ia) {
		if(ia != "") {
			this.iconAlignment = ia;
		}
	},
		/*
-----------------------------			private methods			----------------------------------------

		*/
	_attachResizeHandler: function() {
		pega.util.Event.addListener(window,"resize",this._handleDesktopResize,null,this);
	},

	_attachBodyClickHandler: function() {
		pega.util.Event.addListener(document.body,"click",this._bodyClick,null,this);
	},

	_attachClickHandler:function(node,menu_node) {

		if(node.getAttribute("onClick") || node.getAttribute("onclick")) {




			if (node.getAttribute("onClick")) var strHandler = new String(node.getAttribute("onClick"));
			else var strHandler = new String(node.getAttribute("onclick"));

			if (strHandler.indexOf(';') == strHandler.length-1) {
				strHandler = strHandler.substring (0, strHandler.length-1);
			}
			if(strHandler.indexOf("pyactivitypzZZZ=")!=-1)
				strHandler = this._reverseXMLencoding(strHandler);

			menu_node.setAttribute("menuHandler",strHandler);
			menu_node.setAttribute("isContextAPI", node.getAttribute("ContextAPI"));
		}
	},

	_reverseXMLencoding : function(strHandler){
		var indexstart = strHandler.indexOf("pyactivitypzZZZ=");
		var strtodecrypt = strHandler.substring(indexstart + 16);
		var indexend = strtodecrypt.indexOf("*");
		strtodecrypt = strtodecrypt.substr(0, indexend);
		var cleartexturl = URLObfuscation.decrypt(strtodecrypt);
		cleartexturl = cleartexturl.replace("&amp;","&");
		var encryptedstr = URLObfuscation.encrypt(cleartexturl);
		strHandler = strHandler.replace(strtodecrypt,encryptedstr.substr(16,encryptedstr.length-17));
		return strHandler;
	},

	_reset:function() {
		this._deactivate();
		this.menuCache = {};
		this.contextMenuCache = {};
		this._visible = {};
		this._visibleCount = 0;
		this.zIndex = 50;
		/* BUG-73191: Changed Z-Index from 50 to 100, as when menu appears for a element in an Overlay/popover it hides behind the Overlay.The Z-Index of overlay is always 100 */

	},


	/**
		@description: build menu from the root XML node.  Attach to domParent
	*/
	_buildMenu: function() {
		var rootNode = this.dataSource.getRoot();
		if (this.alignment == "vertical") {
			var tb = pega.ui.menubar.tableNode.cloneNode(true);
			var el = pega.ui.menubar.tbodyNode.cloneNode(true);

			tb.setAttribute("cellPadding","0");
			tb.setAttribute("cellSpacing","0");
			el.setAttribute("role","menu");//aria task

			pega.util.Dom.setStyle(el,"padding","0px");

			tb.appendChild(el);
			this.domParent.appendChild(tb);

		}
		else {
			var el = pega.ui.menubar.divNode.cloneNode(true);

			el.setAttribute("role", "menubar");//aria task
			this.domParent.appendChild(el);
		}


		this.objMenubar = el;
		if (this.renderMode == "simple" || this.renderMode == "standard") {
			pega.util.Dom.addClass(el,this.stylePrefix + "menuBar");
		}
		else if (this.renderMode == "tabbed" || this.renderMode == "standard tabbed") {
			pega.util.Dom.addClass(el,this.stylePrefix + "menuTabbed");
		}
		else{
			pega.util.Dom.addClass(el,"menuBar mb_" + this.renderMode.toLowerCase().replace(' ', '_'));
		}
		
		var subMenus = this.dataSource.getTopLevel();

		var path = "root";

		if (!subMenus) return;
		for (var i = 0; i < subMenus.length; i++) {

			var node = subMenus[i];
			if (node.getAttribute("Caption") == null) var title = node.getAttribute("Value");
			else var title = node.getAttribute("Caption");

			var unique = this.dateObj.getTime();
			var val = node.getAttribute("Value");


			var newpath = path + '-' + unique + "/" + node.getAttribute("Value");

			//var newpath = "mn(" + unique + ")" + path + "/Menu[@Value=\""+val+"\"]";



			//construct menuitem

			var p = {
				xmlNode:node,
				title:title,
				path:newpath,
				direction:this.alignment,
				bTopLevel: true
			};
			var oItem = this._constructMenuItem(p);

			var menu_node = oItem.oDom;


			el.appendChild(menu_node);

			var atts = node.attributes;

			if(node.getAttribute("disabled"))//aria task
				oItem.getDom().setAttribute("aria-disabled", "true");

			for (var z=0; z < atts.length; z++) {

			var a = atts[z];


			if (a.name == "LeftClass" || a.name == "MiddleClass" || a.name == "RightClass") {
				var classLoc = a.name;
				if (classLoc == "LeftClass") {
					pega.util.Dom.addClass(oItem.getLeftCell(),a.value);
				} else if (classLoc == "MiddleClass") {
					pega.util.Dom.addClass(oItem.getMiddleCell(),a.value);
				} else if (classLoc == "RightClass") {
					pega.util.Dom.addClass(oItem.getRightCell(),a.value);
				}
			} else if (a.name.toLowerCase() == "nolabel" && a.value.toLowerCase() == "true") {
				var labelCell = oItem.getMiddleCell();
				labelCell.innerHTML = "";
			} else if (a.name.toLowerCase() == "tooltip") {
				oItem.getMiddleCell().title = a.value;
			} else if (a.name.toLowerCase() == "data-click" && !node.getAttribute("disabled")) {
				oItem.getMiddleCell().setAttribute('data-click', a.value);

                if(oItem.getSummaryDiv())
				  oItem.getSummaryDiv().setAttribute('data-click', a.value);
				if(oItem.getTextDiv())
			      oItem.getTextDiv().setAttribute('data-click', a.value);
				oItem.getLeftCell().setAttribute('data-click', a.value);
				oItem.getRightCell().setAttribute('data-click', a.value);
			} else if (a.name.toLowerCase() == "data-ctl" && !node.getAttribute("disabled")){
				oItem.getMiddleCell().setAttribute('data-ctl', a.value);
				if(oItem.getSummaryDiv())
				  oItem.getSummaryDiv().setAttribute('data-ctl', a.value);
				if(oItem.getTextDiv())
			      oItem.getTextDiv().setAttribute('data-ctl', a.value);
				oItem.getLeftCell().setAttribute('data-ctl', a.value);
				oItem.getRightCell().setAttribute('data-ctl', a.value);
			}

			else if (a.name.toLowerCase() == "imageclass") {
				var oImgTemp = pega.ui.menubar.divNode.cloneNode(true);
oImgTemp.setAttribute("role", "navigation");//aria task
				oImgTemp.innerHTML = " ";
				pega.util.Dom.addClass(oImgTemp, a.value);
				var click = node.getAttribute("data-click");
				var ctl = node.getAttribute("data-ctl");
				if (click && !node.getAttribute("disabled")){
					oImgTemp.setAttribute('data-click', click);
				}
				if (ctl && !node.getAttribute("disabled")){
					oImgTemp.setAttribute('data-ctl', ctl);
				}

				var imgCell = oItem.getRightCell();
				if (this.iconAlignment.toLowerCase() == "left") {
					imgCell = oItem.getLeftCell();
				}

				imgCell.innerHTML = "";
				imgCell.appendChild(oImgTemp);
			}
			}
			this.topLevelItems.push(menu_node);

			pega.util.Event.addListener(menu_node,"click",this._doMouseClick,oItem,this);


			this._attachClickHandler(node,menu_node);
			//pega.util.Event.addListener(menu_node,"click", this._handleItemClick,oItem,this);

			if (!this._deferLoad) var sm = this._constructSubMenu(node,newpath);
		}

	},


	_constructMenuItem: function(params) {

		var xmlNode = params.xmlNode;
		var title = params.title;
		var path = params.path;
		var direction = params.direction
		var strSummary = params.summary;
		var bTopLevel = params.bTopLevel;

		if (!bTopLevel) bTopLevel = false;
		if (!direction) direction = "vertical";

		if (direction == "vertical" && this.renderMode != "tabbed" && this.alignment != "tabbed" && bTopLevel) {
			var sm = pega.ui.menubar.trNode.cloneNode(true);
		}
		else if (direction == "horizontal" && this.renderMode != "tabbed" && this.alignment != "tabbed" && this.renderMode!="panel" &&bTopLevel){
			var sm = pega.ui.menubar.spanNode.cloneNode(true);
		}

		else if (this.renderMode == "tabbed" || this.alignment == "tabbed"){
			var sm = pega.ui.menubar.spanNode.cloneNode(true);

		}
		else {
			var sm = pega.ui.menubar.trNode.cloneNode(true);
		}
 	
		sm.setAttribute("id", path); 
		var isNodeDisabled = xmlNode.getAttribute("disabled");
		if(isNodeDisabled != null && isNodeDisabled.toLowerCase() == "true") {
			sm.setAttribute("disabled", true);
			sm.setAttribute("aria-disabled", true);//aria task
		}
		sm.setAttribute("orientation", direction); //this doesn't work in firefox

		if (this.renderMode == "tabbed" || this.alignment == "tabbed") pega.util.Dom.addClass(sm, "menuItemTabbed");
		else pega.util.Dom.addClass(sm, "menuItem");

		if (direction == "vertical" && this.renderMode != "tabbed" && this.alignment != "tabbed" && bTopLevel) {
			var smleft = pega.ui.menubar.tdNode.cloneNode(true);
			var smmid = pega.ui.menubar.tdNode.cloneNode(true);
			var smright = pega.ui.menubar.tdNode.cloneNode(true);


			//smmid.setAttribute("align","center");


		}
		else if (this.renderMode != "tabbed" && this.alignment != "tabbed" && !bTopLevel) {
			var smleft = pega.ui.menubar.tdNode.cloneNode(true);
			var smmid = pega.ui.menubar.tdNode.cloneNode(true);
			var smright = pega.ui.menubar.tdNode.cloneNode(true);

		}
		else {
			var smleft = pega.ui.menubar.spanNode.cloneNode(true);
			var smmid = pega.ui.menubar.aNode.cloneNode(true);
			var smright = pega.ui.menubar.spanNode.cloneNode(true);

			smmid.setAttribute("aria-haspopup", "true");//aria task, but this line already exists in code
			if(this.renderMode == "tabbed" && !bTopLevel)
			{
				smleft.style.display = "inline-block";
			}
		}

		smleft.innerHTML = " ";
		smleft.setAttribute("id","ItemLeft");
		smright.innerHTML = " ";
		smright.setAttribute("id","ItemRight");

		smmid.setAttribute("id","ItemMiddle");
		smmid.setAttribute("tabIndex","0");
		smmid.setAttribute("role", "menuitem");//aria task, but this line already exists in code

		pega.util.Dom.addClass(smleft, "leftEdge");
		pega.util.Dom.addClass(smmid, "middleBack");


		var tooltiptext = "" + title;
		var bAddTooltip = false;

		if (strSummary) tooltiptext += '\n' + strSummary;

		if (title.length > this.maxTextLength) {

			bAddTooltip = true;
			title = title.substring(0,this.maxTextLength) + "...";
		}

		// Task - Adding ellipsis to summary if length exceeds 25
		if (strSummary && strSummary.length > this.maxTextLength) {
			bAddTooltip = true;

			strSummary = strSummary.substring(0,this.maxTextLength) + "...";
		}

		if (bAddTooltip) smmid.setAttribute("title",tooltiptext);

		if (direction == "horizontal" && bTopLevel) {
			var hs = pega.ui.menubar.spanNode.cloneNode(true);
			pega.util.Dom.addClass(hs, "middleHeight");
			smmid.appendChild(hs);
			//hs.innerHTML = title;
		}


		// Fix for menu item summary START

		if (!bTopLevel && strSummary) {

			smmid.appendChild(this.createTextDiv(title));
			smmid.appendChild(this.createSummaryDiv(strSummary));
			// Fix for menu item summary END
		} else {
			smmid.appendChild(document.createTextNode(title));
		}

		pega.util.Dom.addClass(smright,  "rightEdge");




		sm.appendChild(smleft);
		sm.appendChild(smmid);
		sm.appendChild(smright);



		//title,path,direction,bTopLevel,strSummary
		if(this.alignment == "tabbed") var oItem = new pega.ui.menubar.MenuItem(sm,path,params.xmlNode,"tabbed");
		else var oItem = new pega.ui.menubar.MenuItem(sm,path,params.xmlNode,this.renderMode);
		

		if (this.renderMode != "tabbed" && this.alignment != "tabbed" && this.renderMode != "panel") {
			pega.util.Event.addListener(sm,"mouseover",this._doMouseOver,oItem,this);
		}
		else if (this.renderMode == "panel") {
			if(!bTopLevel) {
				pega.util.Event.addListener(sm,"mouseover",this._doMouseOver,oItem,this);
			}
			else {
				var data = {};
				data.path = path;
				data.panel = this.panel;
				data.obj = sm;


				pega.util.Event.addListener(sm,"mouseover",this._panelMouseOver,data,this);
				pega.util.Event.addListener(sm,"mouseout",this._panelMouseOut,data,this);
			}

		}
		/*BUG-211098 : listening to keyup if inside modal dialog in chrome as modal dialog listen to keyup in chrome */
		if(window.chrome != null && typeof(window.chrome) != "undefined" && pega.u.d.bModalDialogOpen) {
			pega.util.Event.addListener(smmid,"keyup",this._doKeyDown,oItem,this);
        }else{
         	pega.util.Event.addListener(smmid,"keydown",this._doKeyDown,oItem,this);
        }
		pega.util.Event.addListener(smmid,"focus",this._doFocus,oItem,this);

                pega.util.Event.addListener(smleft,"focus",this._processDummyFocus,oItem,this);
		pega.util.Event.addListener(smright,"focus",this._processDummyFocus,oItem,this);
		return oItem;

	},

        _processDummyFocus : function(e,oItem) {
            // when jaws is enabled, sometimes it focus on invalid table cell, this method will focus the required element in IE
	   oItem.getMiddleCell().focus();

         },



	createTextDiv: function(strTitle) {
		var oTextDiv = pega.ui.menubar.divNode.cloneNode(true);
		oTextDiv.innerHTML = strTitle;
		pega.util.Dom.addClass(oTextDiv, "menuItemText");
		oTextDiv.setAttribute("id", "ItemMiddleText");
		return oTextDiv;
	},

	createSummaryDiv: function(strSummary) {
		var oSummaryDiv = pega.ui.menubar.divNode.cloneNode(true);
		oSummaryDiv.innerHTML = strSummary;
		pega.util.Dom.addClass(oSummaryDiv, "summaryText");
		oSummaryDiv.setAttribute("id", "ItemMiddleSummary");
		return oSummaryDiv;

	},

	createIconDiv: function(iconClass) {
		var oIconDiv = pega.ui.menubar.divNode.cloneNode(true);
		pega.util.Dom.addClass(oIconDiv, iconClass);
		return oIconDiv;
	},

	getMaxTextLength: function() {
		return this.maxTextLength;
	},

	setMaxTextLength: function(maxVal) {
		this.maxTextLength = maxVal;
	},

	_clearContextMenuCache: function() {
		for (var c in this.contextMenuCache) {
			var obj = this.contextMenuCache[c];
			obj.destroy();
		}

		this.contextMenuCache = {};
		if(this.dataSource!=null) this.dataSource.contextMenuSource = null;
		this._hideAll();	
	},

	_processEvent: function(e) {
		//capture event from submenu and redirect it to a proxy so that the event comes from within the section source of the menu
		var src = pega.util.Event.getTarget(e);
		var datactl = src.getAttribute("data-ctl");
		var dataclick = src.getAttribute("data-click");
		if (this.domParent){
			pega.util.Event.stopEvent(e);
			pega.ui.menubar.eventNode.setAttribute("data-ctl", datactl);
			pega.ui.menubar.eventNode.setAttribute("data-click", dataclick);
			if( this.domParent.getAttribute("data-ctl")== 'Icon' &&  this.domParent.tagName.toUpperCase() == 'IMG')	{
			    this.domParent.parentNode.appendChild(pega.ui.menubar.eventNode);
			}
			else
			     this.domParent.appendChild(pega.ui.menubar.eventNode);
			/*BUG-156871: In case of mobile device, simulate a tap event instead of click.*/
          	// Tap event is deprecated as part of this US-130296
				pega.util.Event.fireEvent(pega.ui.menubar.eventNode, "click");
		}
	},

	_constructSubMenu: function(dataNode,path,bIsContextMenu) { 
		//construct corresponding submenu
		var unique = this.dateObj.getTime();
		var mnConf ={
			visible:false,
			x:-1000,
			y:-1000,
			iframe:false
		};
		
		if(this.alignment == "tabbed") var mn = new pega.ui.menubar.LightWeightPanel("mn-" + unique + "-" + path,"tabbed",mnConf);
		else var mn = new pega.ui.menubar.LightWeightPanel("mn-" + unique + "-" + path,this.renderMode,mnConf);

		//mn.setBody(el);
		if (!bIsContextMenu) {
			this.menuCache[path] = mn;
		}
		else {
			this.contextMenuCache[path] = mn;
		}



		mn.render(document.body);

		mn.body.setAttribute("role", "navigation");//aria task


		if (this.renderMode == "simple" || this.renderMode == "standard" || this.renderMode == "panel") {
			pega.util.Dom.addClass(mn.body,this.stylePrefix + "menuBarSub");
		}

		else if (this.renderMode == "tabbed" || this.renderMode == "standard tabbed") {
			pega.util.Dom.addClass(mn.body,this.stylePrefix + "menuTabbedSub");
		}
		else {
			pega.util.Dom.addClass(mn.body,"menuBarSub mb_" + this.renderMode.toLowerCase().replace(' ', '_') + "Sub");
		}
		this._loopItems(dataNode, mn,path);
		pega.util.Event.addListener(mn.body,"click", this._processEvent, this, true);
		return mn;
	},

	_scrollHandler:function(e) {
		if (!this.isInMenu(pega.util.Event.getTarget(e))){
			this._deactivate();
		}
	},

	_desktopMouseClickHandler:function(data) {
		this._bodyClick(data);
	},

	/* 07/04/2011 GUJAS1 BUG-36051 - Do not process clicks on menu item if it is disabled.
		Added helper function to determine element disabled state in cross browser fashion.
	*/
	_isElementDisabled: function(el) {
        if (typeof el.disabled === 'boolean') {
            return el.disabled;
        }

        return typeof el.attributes["disabled"] !== 'undefined';
    },
	_handleItemClick: function(event,oItem,bTopLevel) {
		
		/* BUG-133012: Return and not execute the handler for touch devices if the item has child nodes. */
		if (oItem.node.childNodes.length > 0) {
			if(pega.cl && pega.cl.isTouchAble()) {
				pega.util.Event.stopEvent(event);
				return false;
			}
		}

		var obj = oItem.oDom;
		/* 07/04/2011 GUJAS1 BUG-36051 - Do not process clicks on menu item if it is disabled.*/
		if (this._isElementDisabled(obj)) return false;
		var radios = obj.getAttribute("collectionid");

		if (radios) {
			var collection = this.radioCollections[radios];
			var radioID = obj.getAttribute("radioID");
			for(var i = 0; i < collection.length; i++) {
				var r = collection[i];
				var aLeftCell = oItem.getLeftCell();

				if (r.getAttribute('radioID') == radioID) {
					//aLeftCell.innerText = "x";

				}
				else {
					//aLeftCell.innerText = "";
				}
			}

		}

		var checked = obj.getAttribute("checked");
		if (checked) {
			if (checked == "true") {
				oItem.setCheckMark(false);
				obj.setAttribute("checked","false");
				oItem.getMiddleCell().removeAttribute("aria-checked");//aria task

			}
			else {
				oItem.setCheckMark(true);
				obj.setAttribute("checked","true");
				oItem.getMiddleCell().setAttribute("aria-checked","true");//aria task
			}

		}

		var bClickHandled = false;

		if (obj.getAttribute("menuHandler")) {
			this._deactivate();
			var strAction = new String(obj.getAttribute("menuHandler")).toString();

			if (strAction.lastIndexOf(';') != strAction.length - 1) strAction = strAction + ";";
			if( obj.getAttribute("isContextAPI") != null && obj.getAttribute("isContextAPI") == "true" && this.callbackscope) {
				strAction = "this.callbackscope" + '.' + strAction;
			}

			bClickHandled=true;
			eval(strAction);
		}
		if (this.callback) {

			this._deactivate();
			bClickHandled = true;
			var oCallbackParam = {};
			oCallbackParam.value = oItem.value;
			oCallbackParam.path = oItem.path;
			oCallbackParam.node = oItem.node;

			//this.callback.call(this.callbackscope,oCallbackParam);

			var callObj = this;

			callObj.callback.call(callObj.callbackscope,oCallbackParam);


		}



		//if (!bClickHandled && !bTopLevel) pega.util.Event.stopEvent(event);

	},
	_loopItems: function(dataNode,subMenu,path) {


		var maxWidth = 0;

		var menuNodes = dataNode.childNodes;
		for (var i = 0; i < menuNodes.length; i++) {
			var item = menuNodes[i];

			if (item.nodeType != 1) {
				continue;
			}
			if (item.nodeName == "Menu" || item.nodeName == "Item" || item.nodeName == "Check") {


				var menuItem = this._getNewItem(item,path);
				this._attachClickHandler(item,menuItem.oDom);
				pega.util.Event.addListener(menuItem.oDom,"click", this._handleItemClick,menuItem,this);

				subMenu.addMenuItem (menuItem);

				var bBuildMenu = false;
				/* BUG-41590 Start */
				if (item.hasChildNodes()) {
					bBuildMenu = true;
				}
				/*if (pega.env.ua.ie && item.hasChildNodes()) {
					bBuildMenu = true;
				}
				else if (item.hasChildNodes() && item.childNodes.length > 1) {
					bBuildMenu = true;
				}*/
				/* BUG-41590 End */
				var atts = item.attributes;
				for (var z =0; z < atts.length; z ++) {
					var a = atts[z];
					var aName = a.name.toLowerCase();

					if (aName == "checked") {
						if (a.value.toLowerCase() =="true") {
							menuItem.oDom.setAttribute("checked","true");
							menuItem.setCheckMark(true);
							menuItem.getMiddleCell().setAttribute("aria-checked","true");//aria task
						}
						else {
							menuItem.oDom.setAttribute("checked","false");
							menuItem.getMiddleCell().removeAttribute("aria-checked");//aria task
						}
                                               if(pega.env.ua.gecko)//aria task
                                                    menuItem.getMiddleCell().setAttribute("role","menuitemcheckbox");//aria task
                                               else
                                                    menuItem.getMiddleCell().setAttribute("role","checkbox menuitemcheckbox");//aria task

					} else if (aName == "disabled") {
						if (a.value.toLowerCase() =="true")  {
							menuItem.oDom.setAttribute("disabled",true);
							menuItem.oDom.setAttribute("aria-disabled",true);//aria task
						}

					} else if (aName == "leftclass" || aName == "middleclass" || aName == "rightclass") {
						var classCell;
						var classLoc = a.name;
						if (classLoc == "LeftClass") {
							classCell = menuItem.getLeftCell();
						} else if (classLoc == "MiddleClass") {
							classCell = menuItem.getMiddleCell();
						} else if (classLoc == "RightClass") {
							classCell = menuItem.getRightCell();
						}

						pega.util.Dom.addClass(classCell,a.value);
					} else if (aName == "leftstyle" || aName == "middlestyle" || aName == "rightstyle") {
						try {
							var styleLoc = a.name;
							var styleCell;
							
							if (aName == "leftstyle") styleCell = menuItem.getLeftCell();
							else if (aName == "middlestyle") styleCell = menuItem.getMiddleCell();
							else if (aName == "rightstyle") styleCell = menuItem.getRightCell();

							var styles = a.value;
							styleCell.style.cssText = styles;
						}
						catch(e) {

						}
					}
					else if (a.name.toLowerCase() == "imageclass") {
						var oImgTemp = pega.ui.menubar.divNode.cloneNode(true);
						pega.util.Dom.addClass(oImgTemp, a.value);
						menuItem.getLeftCell().innerHTML = "";
						menuItem.getLeftCell().appendChild(oImgTemp);
						if(!item.getAttribute("disabled")){
							oImgTemp.setAttribute('data-click', item.getAttribute("data-click") );
							oImgTemp.setAttribute('data-ctl', item.getAttribute("data-ctl"));
						}
					} else if (a.name.toLowerCase() == "tooltip") {
						menuItem.getMiddleCell().title = a.value;
					} else if (a.name.toLowerCase() == "data-click" && !item.getAttribute("disabled")){
						menuItem.getMiddleCell().setAttribute('data-click', a.value);
                        if(menuItem.getSummaryDiv())
                          menuItem.getSummaryDiv().setAttribute('data-click', a.value);
                        if(menuItem.getTextDiv())
                          menuItem.getTextDiv().setAttribute('data-click', a.value);
						menuItem.getLeftCell().setAttribute('data-click', a.value);
						menuItem.getRightCell().setAttribute('data-click',a.value);
					} else if (a.name.toLowerCase() == "data-ctl" && !item.getAttribute("disabled")){
						menuItem.getMiddleCell().setAttribute('data-ctl', a.value);
                        if(menuItem.getSummaryDiv())
                           menuItem.getSummaryDiv().setAttribute('data-ctl', a.value);
						if(menuItem.getTextDiv())
                           menuItem.getTextDiv().setAttribute('data-ctl', a.value);
						menuItem.getLeftCell().setAttribute('data-ctl', a.value);
						menuItem.getRightCell().setAttribute('data-ctl', a.value);
					}
				}
				if (bBuildMenu) {
					var rc = menuItem.getRightCell();
					if (rc && (this.renderMode != "tabbed" && this.alignment != "tabbed")) {
						var oDivElem = pega.ui.menubar.divNode.cloneNode(true);
						pega.util.Dom.addClass(oDivElem, "menuRightArrow");
						rc.innerHTML = "" ;
						rc.appendChild(oDivElem);
						//pega.util.Dom.addClass(rc,"menurightarrow");
					}
					if (!this._deferLoad) this._constructSubMenu(item,menuItem.path);
				}


			}
			else if (item.nodeName == "Separator") {
				var color = item.getAttribute("ColorClass");
				subMenu.addSeparator(color);
			} else if (item.nodeName == "Radio") {
				var radioNodes = item.childNodes;
				var collectionID = pega.util.Dom.generateId();
				var collection = new Array();

				for (var j = 0; j < radioNodes.length; j++) {
					var obj = radioNodes[j];
					if (obj.nodeName == "Item") {

						var val = obj.getAttribute("Value");
						//var newpath = path + "/Radio/Item[@Value=\"" + val + "\"]";
						var newpath = path + "/" + obj.getAttribute("Value");
						var menuItem = this._getNewItem(obj,path);

						subMenu.addMenuItem (menuItem);
						var aLeftCell = menuItem.getLeftCell();
						if (aLeftCell && obj.getAttribute("Checked").toLowerCase() == "true") {
							var oCheckedDiv = pega.ui.menubar.divNode.cloneNode(true);
							pega.util.Dom.addClass(oCheckedDiv, "menuRadioBox");
							aLeftCell.innerHTML = "";
							aLeftCell.appendChild(oCheckedDiv);
							menuItem.getMiddleCell().setAttribute("aria-checked","true");//aria task
						}


						var dataClick = obj.getAttribute("data-click");
                                                      if(pega.env.ua.gecko)//aria task
                                                             menuItem.getMiddleCell().setAttribute('role', "menuitemradio");
                                                      else//aria task
                                                             menuItem.getMiddleCell().setAttribute('role', "radio menuitemradio");

						menuItem.getMiddleCell().setAttribute('data-click', dataClick);
						menuItem.getLeftCell().setAttribute('data-click', dataClick);
						menuItem.getRightCell().setAttribute('data-click', dataClick);
						var dataCtl = obj.getAttribute("data-ctl");
 
						menuItem.getMiddleCell().setAttribute('data-ctl', dataCtl);
						menuItem.getLeftCell().setAttribute('data-ctl', dataCtl);
						menuItem.getRightCell().setAttribute('data-ctl', dataCtl);

						menuItem.oDom.setAttribute("collectionid",collectionID);
						menuItem.oDom.setAttribute("radioID",j);

						menuItem.getMiddleCell().setAttribute('title', (obj.getAttribute('ToolTip') == null) ? obj.getAttribute("Caption") : obj.getAttribute("ToolTip")); /*BUG-159683: Tooltip was not coming for Radio*/

						this._attachClickHandler(obj,menuItem.oDom);
						/* BUG-133012: Binding to tap for touchable devices. */
						/*if(pega.cl && pega.cl.isTouchAble()) {
							pega.util.Event.addListener(menuItem.oDom,"tap", this._handleItemClick,menuItem,this);
						} else {*/
							pega.util.Event.addListener(menuItem.oDom,"click", this._handleItemClick,menuItem,this);
						//}
						collection.push(menuItem.oDom);
					}
				}

				this.radioCollections[collectionID] = collection;

			}
			else if (item.nodeName == "Panel") {

				if (item.childNodes[0] && item.childNodes[0].nodeName != "#text") {
					var content = item.childNodes[0].nodeValue;
				}
				else var content = item.childNodes[1].nodeValue;

				subMenu.setBody(content);
				break;
			}
		}

		// Save the original scrollwidth
		if(subMenu.origScrollWidth == -1) {
			subMenu.origScrollWidth = subMenu.element.scrollWidth;
		}
	},



	_getNewItem: function(dataNode,path) {
		var value = dataNode.getAttribute("Value");
		//var newpath = path + "/Item[@Value=\""+value+"\"]";
		var newpath = path + "/" + value;


		var caption = dataNode.getAttribute("Caption");
		// Fix
		var summary = dataNode.getAttribute("Summary");



		if (caption == null) caption = value;

		var p = {
			xmlNode:dataNode,
			title:caption,
			path:newpath,
			direction:null,
			bTopLevel: false,
			summary:summary
		};
		var oItem = this._constructMenuItem(p);


		return oItem;

	},

	_onDesktopResize: function(data,scope) {
		scope._handleDesktopResize.call(scope);

	},

	_handleDesktopResize: function() {

			this._deactivate();
	},


	_bodyClick: function(e) {
		if (this.desktopClickHandler.alternativeWindow) {
		}

		if (!this.desktopClickHandler.check(e)) {
			this._deactivate();
		}
		this.desktopClickHandler.clear(e);

	},

	_deactivate: function() {
		//temporarily undoing the cancel... this is causing a bug where context menu focus is killing the event listener.
		//pega.desktop.cancelEventListener("DesktopMouseClick",this._desktopMouseClickHandler);
		this.contextMenu = false;
		this.active = false;


		if (this.renderMode == "panel") {
			this._hideSelectorPanel();
		}


		if (this.closeCallback) {
			try {
				this.closeCallback.call(this.closeCallbackScope);

			}
			catch(e) {

			}
		}
		
		this._hideAll();
		if(this._highlightObjs!=null){
			for (var i =0; i <  this._highlightObjs.length; i++) {
				var o = this._highlightObjs[i];
				pega.util.Dom.removeClass(o,"selected");
				o.removeAttribute("aria-selected");//aria task
			}
		}
		this._clearContextMenuCache();
		if (this._tmpResizeCallback && pega.u.d) {
			pega.u.d.unregisterResize(this._tmpResizeCallback);
			this._tmpResizeCallback = null;
		}
	},

	_nullify: function () {

		this._deactivate();

		if(this._highlightObjs != null) 
		{
			for (var i =0; i <  this._highlightObjs.length; i++) {
 				this._highlightObjs[i]=null;
			}
			this._highlightObjs = null;
		}

		this.callback=null;
		this.callbackscope=null;
		this.closeCallback=null;
		this.closeCallbackScope=null;
		this.radioCollections = {};
		this.desktopClickHandler = null;

		if( this.topLevelItems != null) {
			for (var i =0; i <  this.topLevelItems.length; i++) {
				this.topLevelItems [i]=null;
			} 
			this.topLevelItems = null;
		}

		this.domParent = null;
		this.objMenubar = null;
		this.menuCache = {};

		for (var c in this.contextMenuCache) {
			var obj = this.contextMenuCache[c];
			obj.destroy();
		}

		this.contextMenuCache = {};

		if(this.dataSource != null) {
			this.dataSource.dataSource=null;
			this.dataSource.keys={};
			this.dataSource.menu={};
			this.dataSource =  null;
		}

 		this._visible = {};
		
		pega.desktop.cancelEventListener("DesktopMouseClick",this._desktopMouseClickHandler);

			/* BUG-172066 - Remove tap event listener when on a mobile device */
			if(pega.cl && pega.cl.isTouchAble()) {
				pega.util.Event.removeListener(document.body,"click", this._desktopMouseClickHandler, null, this);
			}

         },

	_revealMenus: function(oItem) {
		if(!pega.util.Event.isIE && !pega.env.ua.webkit){
			pega.util.Event.addListener(document.body,"DOMMouseScroll",this._scrollHandler,null,this);
		} else {
			pega.util.Event.addListener(document.body,"mousewheel",this._scrollHandler,null,this);		
		}

		/*commented as this code hides the menu when trying to scroll*/
		/*Removed comment for BUG-60821 */
		var that = this; // SetTimeout to fix menu hiding on mobiles.
		setTimeout(function(){
			pega.util.Event.addListener(document.body,"mousedown",that._scrollHandler,null,that);
			pega.util.Event.addListener(document.body,"onscroll",that._scrollHandler,null,that);
		}, 500);
		/* BUG-133012: Binding to touchmove for touchable devices. */
		if(pega.cl && pega.cl.isTouchAble()) {
			pega.util.Event.addListener(document.body,"touch",this._scrollHandler,null,this);
		}
		var bIsContextMenu = false;
		if (this.contextMenu) { 
			bIsContextMenu = true;
		}


		var obj = oItem.oDom;

		var path = oItem.path;
		this._pathCheckHide(path);

		if (oItem.node.childNodes.length > 0) {

			if (bIsContextMenu) {
				var sm = this.contextMenuCache[path];
			}
			else var sm = this.menuCache[path];
			if (!sm) {	
				var sm = this._constructSubMenu(oItem.node,path,bIsContextMenu);
			}
			if (sm) {
				this._showSubMenu(obj,sm);
				this._focusItem(this._firstItem(sm.oDom));
			}
		}
	},


	_doMouseClick: function(e,oItem) {
	
		// BUG-150435 if UI Tree inspector is on and clicking suppressed do not fire click event for menus
		if(pega.desktop.support.getDesktopWindow()) {
			if(pega.desktop.support.getDesktopWindow().pega.ui && pega.desktop.support.getDesktopWindow().pega.ui.inspector && pega.desktop.support.getDesktopWindow().pega.ui.inspector.isClickingSuppressed()){
				// BUG-168802 fire off a highlight event so that menubar element is selected
				pega.desktop.support.getDesktopWindow().pega.ui.inspector.handleMouseClick(e);
				return;
			}
		}		
			
		var obj = oItem.oDom;
		this.desktopClickHandler.set(e);

		if(obj && obj.getAttribute("disabled") == "true")
			return false;
		
		//pega.desktop.sendEvent("pega.com$pega-ui$componentfocus",this.uuid,ASYNC);

		var path = oItem.path;
		this._pathCheckHide(path);

		if(!this.active || this.renderMode == "tabbed" || this.alignment == "tabbed") {
			this._revealMenus(oItem);
			this.active = true;
		}
		else {
			this._deactivate();
		}


		if (this.renderMode == "tabbed" || this.alignment == "tabbed") {
			this.currentHighlight = obj.id;
			pega.util.Dom.addClass(obj,"selected");
			obj.setAttribute("aria-selected", "true");//aria task
			for (var i =0; i < this.topLevelItems.length; i++) {
				var o = this.topLevelItems[i];
				if (o.id != this.currentHighlight) {
					pega.util.Dom.removeClass(o,"selected");//aria task
					o.removeAttribute("aria-selected");//aria task
				}

			}
		}

		this._handleItemClick(e,oItem,true);

	//if (e) pega.util.Event.stopPropagation(e);


	},

	_handleHighlight: function(oItem) {
		if (oItem.oDom) var obj = oItem.oDom;
		else obj = oItem.obj;

		var path = obj.id;

		/*Check if the prev path and the new path are same*/
		if(!this.checkPath(path,this._highlightPath)){
			/*Remove highlight from previous elements*/
			this.disableHighLights();
			/*the new path has items to highlight*/
			this.showHighLight({"path" : path});		
		}		
	},
	/*Check if the path1 and path2 are same*/
	checkPath : function(path1,path2){
		if(path1!=path2){
			return false;
		}else{
			return true;
		}
	},
	/*Add selected class to the objects to be highlighted. Move them to _highlightObjs Array*/
	
	showHighLight : function(params){
	
		var path = params.path;
		var pathArr = path.split('/');
		var nLen =  pathArr.length;

		if(nLen>0){
			var objArr = [];
			while(nLen>0){
				var nodePath = pathArr.join('/');
				var domNode = document.getElementById(nodePath);
				if(domNode){
					objArr.push(domNode);
					if(!pega.util.Dom.hasClass(domNode,"selected")){
						pega.util.Dom.addClass(domNode,"selected");
						domNode.setAttribute("aria-selected", "true");//aria task
					}
				}
				var popedNode = pathArr.pop();
				/* nLen--; */
				/* Optimization: Don't run the loop character by character, reduce loop length to number of items */
				nLen=nodePath.length;
			}
			/*Push content into the obj arr in reverse order as we want a stack approach*/
			for(var j = objArr.length-1;j>=0;j--){
				this._highlightObjs.push(objArr[j]);
			}
			/*update highlightPath to the new path*/
			this._highlightPath = path;	
		}

	},
	/*Remove selected class from the objects highlighted currently in _highlightObjs Array. Pop them out of the array and empty it.*/
	disableHighLights : function(){
			var hlObjArrLen = this._highlightObjs.length;
			/*old path had items highlighted*/
			if(hlObjArrLen > 0){
				var o = true;
				/*pop highlighted nodes and remove the selected class*/
				while(hlObjArrLen>0){
					o = this._highlightObjs.pop();
					if(o){
						if(pega.util.Dom.hasClass(o,"selected")){
							/*Remove the selected class to de highlight it*/
							pega.util.Dom.removeClass(o,"selected");
							o.removeAttribute("aria-selected");//aria task
						}
					}
					hlObjArrLen--;
				}
			}
	},

	_doFocus: function(e,oItem) {
		var path = oItem.path.substring(0,oItem.path.lastIndexOf("/"));
		if(oItem.node.nodeName == "Item" || oItem.path.indexOf("/contextMenu") == 0) {
			this._handleHighlight(oItem);
		}
	},

	focusTheNearestFocusableElementInTheHierarchy: function(referenceElement)//aria task
	{
		var elementToFocus = referenceElement;
/*
for now we have menus constructed with only "a" tags in this subcase - tomorrow if we have other 
natively focusable tags [tags without tabIndex which can receive focus on tabbing, etc.], so if 
such tags [say, x tag or y tag] come up in any menu's dom hierarchy, expand this if condition to 
include tagname == "a" OR "x" OR "y"
just add these new tags, "x" & "y" to the below object nativelyFocusableElements //FIX FOR BUG-159764, 71ML6 Incorrect tab order on closing "Other Actions" menu
*/

		var nativelyFocusableElements = {
			"a" : true,
			"button" : true
		};

		//if element is (natively focusable) or has (tabIndex set && set not to -1)
		if((elementToFocus.tagName.toLowerCase() in nativelyFocusableElements) || (elementToFocus.hasAttribute("tabIndex") && (elementToFocus.tabIndex != "-1")))
			elementToFocus.focus();
		else//traverse the hierarchy finding the nearest ancestor which is focusable
		{
			while((elementToFocus.tagName.toLowerCase() != "body") && (!(elementToFocus.hasAttribute("tabIndex"))))
				elementToFocus = elementToFocus.parentNode;
			//loop ends and we have found either an ancestor with tabIndex or reached body
			elementToFocus.focus();
		}
	},

	_doContextMenuKeyDown: function(e,elem) {
		pega.util.Event.removeListener(document.body,"keydown",this._doContextMenuKeyDown);
		if( e.keyCode == 40 && elem) {
			try {
				if(elem.focus) 
					elem.focus();
			} catch(e){
			}
		    pega.util.Event.stopEvent(e);
		} else if( e.keyCode == 27 || e.keyCode == 37 ){
			if(this.domParent.tagName == "SPAN") {
				this.domParent.setAttribute("tabindex", -1);
			}
			this.focusTheNearestFocusableElementInTheHierarchy(this.domParent);//this.domParent.focus();
			this._deactivate();
		}
	},

	// get the first active item in the menu
	_firstItem : function(parentItem){
		if(parentItem.tagName != 'TBODY') {
			parentItem = parentItem.getElementsByTagName('TBODY')[0] || parentItem;
		}
		var thisItem = null;
		for(thisItem = parentItem.firstChild;
			(thisItem && ((thisItem.firstChild && thisItem.firstChild.className == "Separator") || thisItem.getAttribute('disabled') == "true" ));
			thisItem = thisItem.nextSibling);
		return thisItem;
	},
	
	_focusItem: function(elem){
		if(elem) {
			var firstelem = elem.getElementsByTagName("a");
			if(firstelem && firstelem.length > 0) {
				firstelem[firstelem.length - 1].focus();
			} else {
				firstelem = elem.getElementsByTagName("td");
				if(firstelem && firstelem.length>2) 
					firstelem[1].focus();
				else 
					elem.focus();
			} 
		} 
	},
	
	_doKeyDown: function(e,oItem) {
		var _keys = {
			LEFT:37,
			UP:38, 
			RIGHT:39,
			DOWN:40, 
			SPACE:32,
			ENTER:13,
			ESCAPE: 27
		}, elem;
		
		var firstItem = this._firstItem;
	    
		// get the next active item in the menu
		var nextItem = function(thisItem){
			var _thisItem = thisItem;
			for(thisItem = thisItem.nextSibling;
				(thisItem && (thisItem.firstChild.className == "Separator" || thisItem.getAttribute('disabled') == "true" ));
				thisItem = thisItem.nextSibling);
			thisItem = thisItem || firstItem(_thisItem.parentNode)
			return thisItem;
		}

		// get the previous active item in the menu
		var prevItem = function(thisItem){
			var _thisItem = thisItem;
			for(thisItem = thisItem.previousSibling;
				(thisItem && (thisItem.firstChild.className == "Separator" || thisItem.getAttribute('disabled') == "true" ));
				thisItem = thisItem.previousSibling);
			thisItem = thisItem || lastItem(_thisItem.parentNode)
			return thisItem;
		}
		
		// get the last active item in the menu
		var lastItem = function(parentItem){
			var thisItem = null;
			for(thisItem = parentItem.lastChild;
				(thisItem && (thisItem.firstChild.className == "Separator" || thisItem.getAttribute('disabled') == "true" ));
				thisItem = thisItem.previousSibling);
			return thisItem;
		}

		if(e.keyCode==_keys.ENTER || e.keyCode==_keys.SPACE) {  /* Need to execute the action for this item and then close the menu */
			var src = pega.util.Event.getTarget(e);
			var dataclick = src.getAttribute("data-click");

/*
Overridden earlier fix for BUG-148502 [please look into history of this file, if you would like to see that fix], which caused more bugs : BUG-159955 & BUG-159735
The below if-else if-else if-else cases are supposed to cover all the use cases of accessibility
Please tread with caution if you are modifying this part of the code, in future
A SINGLE SET OF FIXES TO FIX BUG-148502, BUG-159955 & BUG-159735
*/

			if( oItem.node.nodeName != "Menu" && oItem.path.indexOf("/contextMenu") == -1)  {
                // BUG-166507
                this._handleItemClick(e, oItem);
				this._processEvent(e);
				this._deactivate();
			} else if(oItem.node.nodeName=="Menu" && oItem.node.childNodes.length > 0) { //xml item oItem has childNodes => this one has submenus
				this._revealMenus(oItem);
				this.active = true;
			} else if(oItem.node.nodeName=="Menu" && oItem.node.childNodes.length == 0) { //xml item oItem has no childNodes => treat "enter key" event as equivalent to "click" event
				this._handleItemClick(e, oItem);
				this._processEvent(e);
				this._deactivate();
			} else {
				this._handleItemClick(e, oItem);
				this._processEvent(e);
				this._deactivate();
			}
			return;
		} else if(oItem.node.nodeName=="Menu" && oItem.path.indexOf("/contextMenu") == -1) {  /* Navigate Left Right for top menubar */
			if(e.keyCode==_keys.LEFT)  {
				elem = prevItem(oItem.oDom);
			} else if(e.keyCode==_keys.RIGHT) { 
				elem = nextItem(oItem.oDom);
			} else if(e.keyCode==_keys.DOWN) { 
				this._revealMenus(oItem);
				this.active = true;
			} else if (e.keyCode ==_keys.ESCAPE) {
				this._deactivate(); 
				if(this.domParent) 
					this.focusTheNearestFocusableElementInTheHierarchy(this.domParent);//this.domParent.focus(); 
			}
		} else if(oItem.node.nodeName=="Menu" && oItem.path.indexOf("/contextMenu") == 0) {  /* Navigate top / down for context menu - level 1 */
			if(e.keyCode==_keys.UP)  { 
				elem = prevItem(oItem.oDom);
			} else if (e.keyCode==_keys.DOWN )  { 
				elem = nextItem(oItem.oDom);
			} else if (e.keyCode ==_keys.ESCAPE || e.keyCode ==_keys.LEFT ) {
				this._deactivate(); 
				if(this.domParent) 
					this.focusTheNearestFocusableElementInTheHierarchy(this.domParent);//this.domParent.focus(); 
			} else if(e.keyCode ==_keys.RIGHT) {  /* Need to open a new sub menu and set the focus on the first element */
				this._doMouseOver(e, oItem);
			}
   	    } else if (oItem.node.nodeName=="Item") {     /* Up and Down on a menu item*/
			if(e.keyCode==_keys.DOWN) { 
				elem = nextItem(oItem.oDom);
			} else if ( e.keyCode==_keys.UP) { 
				elem = prevItem(oItem.oDom);
			} else if (e.keyCode==_keys.LEFT || e.keyCode ==_keys.ESCAPE) { /* Moving up - need to select the parentNode */
    		    var path = oItem.path.substring(0,oItem.path.lastIndexOf("/"));
				var sm = this._visible[path];
				if (sm) 
					this._hide(sm);
				var pathArr = path.split('/');
				var nLen =  pathArr.length;
				if(nLen==2) {
					for (var i =0; i <  this.topLevelItems.length; i++) {
						if( this.topLevelItems [i].id == path ){
							elem = this.topLevelItems [i];
							if(elem.childNodes.length>2) 
								elem.childNodes[1].focus();
							this._deactivate();
							pega.util.Event.stopEvent(e);
							return;
						}
					} 
            	} else if( nLen > 2 ) {
					var toppath =path.substring(0, path.lastIndexOf("/"));
					var subMenu = this.contextMenuCache[toppath];
					if(!subMenu) 
						subMenu = this.menuCache[toppath];
					if(subMenu) {
						for (var i =0; i <  subMenu.objContainer.childNodes.length; i++) {
							if(subMenu.objContainer.childNodes[i].id == path ){
								elem = subMenu.objContainer.childNodes[i];
								if( elem.childNodes.length > 2 ) 
									elem.childNodes[1].focus();
								pega.util.Event.stopEvent(e);
								return;
							}
						} 
					} 
				}
				if(this.domParent) 
					this.focusTheNearestFocusableElementInTheHierarchy(this.domParent);//this.domParent.focus(); 
			} else if(e.keyCode ==_keys.RIGHT) {  /* Need to open a new sub menu and set the focus on the first element */
				this._doMouseOver(e, oItem);
			}
		}
		
		this._focusItem(elem);
		elem && pega.util.Event.stopEvent(e);
	},

	_doMouseOver: function(e,oItem) {
		if (!this.active) return;
		/* 07/04/2011 GUJAS1 BUG-36051 - Do not process clicks on menu item if it is disabled.*/
		var obj = oItem.oDom;
		if (this._isElementDisabled(obj)) return false;
		/* 07/04/2011 GUJAS1 BUG-36051 Fix Ends */
		this._handleHighlight(oItem);
		// Accessibility: focus on the highlighted node so that keyboard shortcuts are in sync
		this._focusItem(obj);
		this._revealMenus(oItem);
		this.active = true;
		return;
	},

	_doMouseOut: function(e,oItem) {
		var obj = oItem.oDom;
		//pega.util.Dom.removeClass(obj,"selected");
	},


	_hideAll: function() {
		if(!pega.util.Event.isIE && !pega.env.ua.webkit){
			pega.util.Event.removeListener(document.body,"DOMMouseScroll",this._deactivate);
		} else {
			pega.util.Event.removeListener(document.body,"mousewheel",this._deactivate);		
		}

		pega.util.Event.removeListener(document.body,"mousedown",this._scrollHandler);
		pega.util.Event.removeListener(document.body,"keydown",this._deactivate);


		for (var o in this._visible) {
			var sm = this._visible[o];
			if (sm) {
				this._hide(sm);
				this._visible[o] = null;
			}
		}
		this._highlightPath = "";	
	
		pega.util.Event.removeListener(document.body,"onscroll",this._scrollHandler);
		/* BUG-133012: Binding to touchmove for touchable devices. */
		if(pega.cl && pega.cl.isTouchAble()) {
			pega.util.Event.removeListener(document.body,"touchstart",this._scrollHandler);
		}
		pega.util.Event.removeListener(window,"resize",this._handleDesktopResize);
		pega.util.Event.removeListener(document.body,"click",this._bodyClick);

		if(this.objMenubar!=null){
			pega.util.Event.removeListener(this.objMenubar,"mouseout",this._launchElemMouseOut);
			pega.util.Event.removeListener(this.objMenubar,"mouseover",this._launchElemMouseOver);
		}
		pega.desktop.cancelEventListener("pega.com$pega-desktop$resize", this._onDesktopResize);	

	},

	_hide: function(subMenu) {
		subMenu.cfg.setProperty("visible",false);
		subMenu.cfg.setProperty("x",-50);
		subMenu.cfg.setProperty("y", -50);

		if (this._visibleCount > 1) {
			this.zIndex--;
		}

		this._visibleCount--;

	},

	_isSubPath:function (pathArrayA, pathArrayB) {
		if (pathArrayA.length > pathArrayB.length) {
			var i = pathArrayB.length;


		}
		else var i = pathArrayA.length;



		if (i < 0) return false;

		for (var j = 0; j < i; j++) {
			var a = pathArrayA[j];
			var b = pathArrayB[j];



			if (a != b) return false;
		}

		return true;
	},

	_pathCheckHide: function(path) {
		var pathSplit = path.split('/');

		for (var o in this._visible) {
			var sm = this._visible[o];
			if (sm) {
				if (!this._isSubPath(pathSplit,o.split('/'))) {
					this._hide(sm);
				}
			}
		}
	},


	/*
	* @param obj The MenuItem of the parent menu that was clicked
	*/
	_showSubMenu: function(obj, subMenu) {
		var path = obj.id;
		var x,y;

		subMenu.cfg.setProperty("visible", true); // Some attributes are available only when menu is visible

		if(obj.parentNode.parentNode.parentNode!=null)
		{
			var mainMenu = obj.parentNode.parentNode.parentNode;
		}
		var anchorObject = this.anchor;
		if (this.renderMode != "tabbed" && this.alignment != "tabbed") {
			if(anchorObject==null){
				anchorObject = obj;
			}		
			var r = pega.util.Region.getRegion(anchorObject);
			
			if(obj.getAttribute("orientation") == "horizontal") {
				//menu is horizontal so show it beneath.
				//rHeight is the distance from the bottom of the menuBar to the bottom of the page
				var rHeight = document.body.clientHeight - r.bottom;
				var tHeight = r.top;
				var menuHeight = subMenu.element.scrollHeight;//menuHeight is how tall the page is
				if (this.submenualignment == "Left") {
					x = r.left;
				}
				else {
					x = r.left  - (subMenu.origScrollWidth - obj.scrollWidth) + 1;
				}
				if (tHeight > rHeight) {
					//x=r.left;
					y=r.top-menuHeight;
					this.crawl = "up";
				}
				else {
					var mItem = pega.util.Dom.getElementsBy(function(el){if (el.id=="ItemMiddle") return true; else return null;},"SPAN",obj)[0];
					if(anchorObject==null){
						anchorObject = mItem;
					}
					var m = pega.util.Region.getRegion(anchorObject);
					//x = r.left;
					y = m.bottom;
					this.crawl = "down";
				}
			}
			else {
				//menu is displayed vertical, show to left or right depending on space
				var rWidth = document.body.scrollWidth - r.right;
				
				var menuWidth = subMenu.origScrollWidth;
				
				if (menuWidth > rWidth) {
					if (menuWidth < r.left) x = r.left- menuWidth;
					else x = r.left + 10;
				}
				else x = r.right;
				if (this.crawl == "down") {
					/* BUG-41591 - subtract 1 from 'r.top'. This is needed because there's an error of +1 
					 * in the 'top' value returned by getRegion() */
					y = (r.top-1);
				}
				else {
					y = r.bottom - subMenu.element.clientHeight;
				}
			}
		}
		// menu alignment bug fixed for tabbed case - using getRegion(obj) instead of getRegion(this.objMenubar)
		else if (this.renderMode == "tabbed" && this.alignment == "tabbed") {
			var r = pega.util.Region.getRegion(obj);
			x = r.left;
			y = r.bottom;
			subMenu.cfg.setProperty("width",this.objMenubar.scrollWidth);
		}
		else {
			var r = pega.util.Region.getRegion(this.objMenubar);
			x = r.left;
			y = r.bottom;
			subMenu.cfg.setProperty("width",this.objMenubar.scrollWidth);
		}
		var scrollTop = document.body.scrollTop;

		if((scrollTop == 0) && typeof( window.pageYOffset ) == 'number' ) {
			//For IE9 Standards mode
			scrollTop = window.pageYOffset;
		} else if((scrollTop == 0) && document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
			//IE8 standards compliant mode
			scrollTop = document.documentElement.scrollTop;
		}

		/* Override the y coordinate if the height of the menu is pushing it off the end of the screen */
		var heightFromBorder = $(subMenu.element).outerHeight() - $(subMenu.element).innerHeight(); // Combined top+bottom border thickness
		if (subMenu.element.scrollHeight + heightFromBorder > document.body.clientHeight) {
			y = 0;
			
			if (pega.util.Event.isIE) {
				var clientRgn = pega.util.Dom.getClientRegion();
				y = clientRgn.top;
			}

			//subMenu.element.style.overflow = "auto";
			subMenu.element.style.height = document.body.clientHeight + "px";
			pega.util.Dom.setStyle(subMenu.element, "overflow", "auto");
			if (pega.env.ua.ie)
				subMenu.cfg.setProperty("height", document.body.clientHeight);
		}
		else if ((y + subMenu.element.scrollHeight) > document.body.clientHeight + scrollTop) { 
			// To prevent submenu from displaying below the viewport area
			y = (document.body.clientHeight + scrollTop) - subMenu.element.scrollHeight - heightFromBorder;
		}
		/* prevent menu appearing off the screen */
		if (x < 0) x = 0;
		
		//overcome crawling inbalance
		/* BUG-41803 - commenting the following lines, as a CSS change (in pzBaseCore.css) solves the issue
		 * and the following hard-coding is not needed
		 */
		/*if (pega.util.Event.isIE) {
			y=y-3;
			x=x-2;
		}*/

		if(mainMenu.scrollHeight>mainMenu.offsetHeight)
		{
			x = x+19;
		}

		subMenu.cfg.setProperty("x",x);
		subMenu.cfg.setProperty("y",y);
		this._visible[path] = subMenu;
		if (subMenu.element.scrollHeight > subMenu.element.offsetHeight && (subMenu.element.getAttribute("scroll") == "false" || subMenu.element.getAttribute("scroll") == null))
		{
			subMenu.element.style.width = (subMenu.element.offsetWidth + 10) + 'px';
			subMenu.element.setAttribute("scroll","true");
		}
               	var that = this;
		if (!this._tmpResizeCallback){
			this._tmpResizeCallback = function(){that._handleDesktopResize();};
			pega.u.d.registerResize(this._tmpResizeCallback);
		}


		/*
		if( subMenu.element.previousSibling !== null && subMenu.element.previousSibling.tagName === "IFRAME" ) {  
			subMenu.element.previousSibling.style.top = subMenu.element.style.top ;
			subMenu.element.previousSibling.style.left = subMenu.element.style.left;
			subMenu.element.previousSibling.style.width = subMenu.element.offsetWidth + "px";
			subMenu.element.previousSibling.style.height = subMenu.element.offsetHeight + "px";
		}
		*/
		subMenu.element.oncontextmenu = function(evt){ if (evt==null) evt = event; evt.returnValue = false; };
		subMenu.cfg.setProperty("zIndex",this.zIndex);
		this.zIndex++;
		this._visibleCount++;
	}
}


/**
@description: data interface providing generic APIs for obtaining
menu information.
*/
pega.ui.menubar.DataInterface = function(dataObj) {
	if (dataObj) {
		this.dataSource = dataObj;


	}
	else this.dataSource = null;

	this.contextMenuSource;
	this.menu;
	this.sourceType;
	this.sourceObj = null;
	this.keys = null;
}

pega.ui.menubar.DataInterface.prototype = {

	connectContextMenuSource: function(objXML) {
		this.contextMenuSource = objXML;
	},


	connectDataXML: function(objXML,keys) {
		if (typeof(objXML) == "object") {
				if (objXML.value) {

					var xmlDoc = pega.tools.XMLDocument.get();
					if (!xmlDoc.loadXML(objXML.value)) {
						//window.alert('failed!');
					}


				}
				else {
					var xmlDoc = objXML;
				}

			}
		else if (typeof(objXML) == "string") {
			var xmlDoc = pega.tools.XMLDocument.get();
			xmlDoc.loadXML(objXML);
		}

		else {
				var xmlDoc = objXML;
			}

		this.set("xml",xmlDoc,keys);
	
	},


	refresh: function() {
		/* call activity pzRefereshMenuData in order to retrieve XML */

		if (this.sourceType == "xml") {

			var callback = {
				success:function(oResponse) {

					this.connectDataXML(oResponse.responseText);
					this.menu.render();

				}
				,
				failure: function (oResponse) {

				} ,
				scope:this
			};

			var oSafeURL = new SafeURL("@baseclass.pzRefreshMenuData");
			oSafeURL.put("ClassName", this.keys.className);
			oSafeURL.put("Name", this.keys.name);
			oSafeURL.put("Type",this.keys.type);
			if(this.keys.renderMode) {
				oSafeURL.put("renderMode", this.keys.renderMode);
			}
			pega.util.Connect.asyncRequest('GET', oSafeURL.toURL(), callback, null);
		}
	},

	set: function(type,dataObj,keys) {






		if (type) this.sourceType = type.toLowerCase();
		if (dataObj) this.dataSource = dataObj;
		if (keys) this.keys = keys;
	},

	get: function(path) {
		//NOT USED!
		if (this.sourceType == "xml") {
			if (path.indexOf ("mn(") != -1) {
				var idx = path.indexOf(")");

				path = path.substring(idx + 1, path.length);
			}
			if (pega.env.ua.ie) {
				return this.dataSource.selectSingleNode(path);
			}

			else {
				return this.dataSource.childNodes[0].selectSingleNode(path);
			}


		}
	},

	getForContextMenu: function(path) {
		//NOT USED!
			if (path.indexOf ("/contextMenu/") != -1) {
				path = path.substring(13, path.length);
			}
			return this.contextMenuSource.selectSingleNode(path);

	},

	getPanelRoot: function() {
		return this.dataSource.selectSingleNode("//pagedata/Panel");
	},

	getPanelHeader: function() {
		return this.dataSource.selectSingleNode("//pagedata/Panel/Header");
	},

	getPanelHeaderButton: function() {
		var oHeaderNode = this.getPanelHeader();
		if (oHeaderNode) {
			return oHeaderNode.selectSingleNode("Button");
		}

		return null;


	},

	getPanelMenus: function() {
		var root = this.getPanelRoot();
		var subMenus = root.selectNodes("Menu");
		return subMenus;
	},

	getRoot: function() {
		switch (this.sourceType.toLowerCase()) {
			case "xml":
				if (pega.env.ua.ie) {
					var menuroot = this.dataSource.selectSingleNode("//pagedata");

				}

				else {
					var menuroot = this.dataSource.childNodes[0];

				}

				return menuroot;
				break;
		}
	},

	getTopLevel: function() {
		var root = this.getRoot();
		switch (this.sourceType.toLowerCase()) {
			case "xml":
				if (root) {
					var subMenus = root.selectNodes("Menu");
					return subMenus;


				}
				else return null;
			break;
		}
	}
}



pega.ui.menubar.MenuItem = function(oDom,path,xmlNode,renderMode) {
	this.oDom = oDom;
	this.value = xmlNode.getAttribute("Value");
	this.path = path;
	this.node = xmlNode;

if(this.node.childNodes && this.node.childNodes.length > 0)//aria task
{
this.getMiddleCell().setAttribute("aria-haspopup", "true");
//fireeyes points out that aria-expanded should not be used, so commenting this out - otherwise, this would be the default state [not yet expanded] of all submenus when constructed
//this.getMiddleCell().setAttribute("aria-expanded", "false");
}//aria task

}

pega.ui.menubar.MenuItem.prototype = {
	getDom: function() {//aria task
		return this.oDom;





	},//aria task

	getLeftCell: function() {
		return pega.util.Dom.getElementsBy(function(el){if (el.id=="ItemLeft") return true; else return null;},null,this.oDom)[0];





	},

	getMiddleCell: function() {
		return pega.util.Dom.getElementsBy(function(el){if (el.id=="ItemMiddle") return true; else return null;},null,this.oDom)[0];





	},

   	getSummaryDiv: function() {
		return pega.util.Dom.getElementsBy(function(el){if (el.id=="ItemMiddleSummary") return true; else return null;},null,this.oDom)[0];





	},

	getTextDiv: function() {
		return pega.util.Dom.getElementsBy(function(el){if (el.id=="ItemMiddleText") return true; else return null;},null,this.oDom)[0];





	},

	getRightCell: function() {
		return pega.util.Dom.getElementsBy(function(el){if (el.id=="ItemRight") return true; else return null;},null,this.oDom)[0];





	},

	setCheckMark: function(bOn) {
		var lCell = this.getLeftCell();

		if (bOn) {
			var oCheckMarkDiv = pega.ui.menubar.divNode.cloneNode(true);
			pega.util.Dom.addClass(oCheckMarkDiv, "menucheckmark");
			lCell.innerHTML = "";
			lCell.appendChild(oCheckMarkDiv);
		} else {
			//pega.util.Dom.removeClass(lCell, "menucheckmark");
			pega.util.Dom.removeClass(lCell.firstChild, "menucheckmark");
		}
	}

}



/***
 Panel Menu


*/


pega.ui.menubar.Panel = function(callRegister) {
	this.callRegister = callRegister;
	pega.ui.menubar.Panel.superclass.constructor.call(this);
	this.panel;
	this.panelClass;
	this.timer;
	this.initialEPath;
}

pega.extend(pega.ui.menubar.Panel, pega.ui.menubar.Manager, {


	/**
		@description: build menu from the root XML node.  Attach to domParent
	*/
	_buildMenu: function() {
		this.alignment = "vertical";
		var panelNode = this.dataSource.getPanelRoot();

		this.panelClass = panelNode.getAttribute("class");
		var launchElement = pega.ui.menubar.divNode.cloneNode(true);
launchElement.setAttribute("role", "navigation");//aria task
		pega.util.Dom.addClass(launchElement,this.panelClass);

		this.objMenubar = launchElement;
		this.domParent.appendChild(launchElement);
		pega.util.Event.addListener(this.objMenubar,"click",this._showSelectorPanel,this, true);
		pega.util.Event.addListener(this.objMenubar,"mouseout",this._launchElemMouseOut,this.objMenubar,this);
		pega.util.Event.addListener(this.objMenubar,"mouseover",this._launchElemMouseOver,this.objMenubar,this);

		var subMenus = this.dataSource.getPanelMenus();

		//var path = "root";

		var path = "//pagedata";

		if (!subMenus) return;


		var height = panelNode.getAttribute("height");
		var width = panelNode.getAttribute("width");
		var selectorSize = panelNode.getAttribute("selectorSize");

		/* Identify individual item height */
		var nUnitHeight = 0;
		if (height) {
			if (height.indexOf("px") > -1) {
				nUnitHeight = Math.ceil(parseInt(height.substring(0, height.length-2))/subMenus.length);
			} else {
				nUnitHeight = Math.ceil(parseInt(height)/subMenus.length);
			}
			
		}
		/* Save number of items in main panel */ 
		var nNumParentNodes = subMenus.length;
	
		/* Maintain maximum height difference variable */
		var nHeightDiff = 0;

		var unique = this.dateObj.getTime();

		var oButton = null;

		var oHeaderButton = this.dataSource.getPanelHeaderButton();

		if (oHeaderButton) {
			oHeaderButton.attributes;
			oButton = {};

			for ( var t = 0; t < oHeaderButton.attributes.length; t++) {
				var oAtt = oHeaderButton.attributes[t];
				if (oAtt.name.toLowerCase() == "onclick") {
					oButton.onClick = oAtt.value;
				}
				else if (oAtt.name.toLowerCase() == "caption") {
					oButton.caption = oAtt.value;
				}
				else if (oAtt.name.toLowerCase() == "image") {
					oButton.image = oAtt.value;
				}
				else if (oAtt.name.toLowerCase() == "styleprefix") {
					oButton.stylePrefix = oAtt.value;
				}
			}
		}

		/* CREATE SELECTOR PANEL */
		
		

		if(this.alignment == "tabbed") 
			this.panel = new pega.ui.menubar.SelectorPanel("selector-" + unique,"tabbed",{visible:false,x:-1000,y:-1000,iframe:true,width:width, height:height,selectorSize:selectorSize, stylePrefix:this.stylePrefix,headerButton:oButton});
		else 
			this.panel = new pega.ui.menubar.SelectorPanel("selector-" + unique,this.renderMode,{visible:false,x:-1000,y:-1000,iframe:true,width:width, height:height,selectorSize:selectorSize, stylePrefix:this.stylePrefix,headerButton:oButton});

		this.panel.cfg.setProperty("zIndex",this.zIndex);
		this.zIndex++;
		this.panel.render(document.body);

		var el = this.panel.getSelectorSide();

		/* NEW: MENU AUTO EXPANDS TO FIRST COLUMN, FIRST CHILD start */
		var expandPath = "";
		/* NEW: MENU AUTO EXPANDS TO FIRST COLUMN, FIRST CHILD end */

		var childrenHeight =0;		

		for (var i = 0; i < subMenus.length; i++) {

			var node = subMenus[i];
			if (node.getAttribute("Caption") == null) var title = node.getAttribute("Value");
			else var title = node.getAttribute("Caption");
			var unique = this.dateObj.getTime();

			var val = node.getAttribute("Value");
			// Fix
			var summary = node.getAttribute("Summary");

			var unique = this.dateObj.getTime();

			var newpath = path + '-' + unique + "/" + val;
			//var newpath = "mn(" + unique + ")" + path + "/Menu[@Value=\""+val+"\"]";

			//construct menuitem
			
			var p = {
				xmlNode:node,
				title:title,
				path:newpath,
				direction: this.alignment,
				summary:summary,
				bTopLevel:true

			};

			var oItem = this._constructMenuItem(p);
			var menu_node = oItem.oDom;
			el.appendChild(menu_node);

			this._attachClickHandler(node,menu_node);
			/* BUG-133012: Binding to tap for touchable devices. */
			/*if(pega.cl && pega.cl.isTouchAble()) {
				pega.util.Event.addListener(menu_node,"tap", this._handleItemClick,oItem,this);
			} else {*/
				pega.util.Event.addListener(menu_node,"click", this._handleItemClick,oItem,this);
			//}

			if(node.getAttribute("disabled"))//aria task
				oItem.getDom().setAttribute("aria-disabled", "true");

			var atts = node.attributes;

			for (var z=0; z < atts.length; z++) {

			var a = atts[z];

			if (a.name == "LeftClass" || a.name == "MiddleClass" || a.name == "RightClass") {
				var classLoc = a.name;
				var classCell;
				if (classLoc == "LeftClass") {
					classCell = oItem.getLeftCell();
				} else if (classLoc == "MiddleClass") {
					classCell = oItem.getMiddleCell();
				} else if (classLoc == "RightClass") {
					classCell = oItem.getRightCell();
				}


				pega.util.Dom.addClass(classCell,a.value);

			} else if (a.name.toLowerCase() == "nolabel" && a.value.toLowerCase() == "true") {

				var labelCell = oItem.getMiddleCell();
				labelCell.innerHTML = "";
			} else if (a.name.toLowerCase() == "data-click" && !node.getAttribute("disabled")) {
				oItem.getMiddleCell().setAttribute('data-click', a.value);
				oItem.getLeftCell().setAttribute('data-click', a.value);
				oItem.getRightCell().setAttribute('data-click', a.value);
			} else if (a.name.toLowerCase() == "data-ctl" && !node.getAttribute("disabled")){
				oItem.getMiddleCell().setAttribute('data-ctl', a.value);
				oItem.getLeftCell().setAttribute('data-ctl', a.value);
				oItem.getRightCell().setAttribute('data-ctl', a.value);
			} else if (a.name.toLowerCase() == "imageclass") {
				var oImgTemp = pega.ui.menubar.divNode.cloneNode(true);
				/*oImgTemp.setAttribute("class", a.value);*/
				pega.util.Dom.addClass(oImgTemp, a.value);

				var click = node.getAttribute("data-click");
				var ctl = node.getAttribute("data-ctl");
				if (click && !node.getAttribute("disabled")){
					oImgTemp.setAttribute('data-click', click);
				}
				if (ctl && !node.getAttribute("disabled")){
					oImgTemp.setAttribute('data-ctl', ctl);
				}

				var imgCell = oItem.getRightCell();
				if (this.iconAlignment.toLowerCase() == "left") {
					imgCell = oItem.getLeftCell();
				}

				oItem.getLeftCell().innerHTML = "";
				oItem.getLeftCell().appendChild(oImgTemp);	
			} else if (a.name.toLowerCase() == "tooltip") {

				oItem.getMiddleCell().title = a.value;
			}

			}
			this.topLevelItems.push(menu_node);

			var mn = this.panel.createContent(newpath);
			
			pega.util.Dom.addClass(mn.tby,this.stylePrefix + "menuBar");
			if (node.hasChildNodes()) {

				var oItemRight = menu_node.firstChild.nextSibling.nextSibling;

				var nNumChildNodes = node.childNodes.length;
				var nCurrentChildHeight= nNumChildNodes * nUnitHeight; 
	
				if(oItemRight && oItemRight.currentStyle && oItemRight.currentStyle.height) 
				{
					var cellHeight =  oItemRight.currentStyle.height.replace("px","");
					nCurrentChildHeight = nNumChildNodes * parseInt(cellHeight );
				}
				if(nCurrentChildHeight > childrenHeight ) {
					childrenHeight = nCurrentChildHeight;
				}

				
				var oDivElem = pega.ui.menubar.divNode.cloneNode(true);
				pega.util.Dom.addClass(oDivElem, "menuRightArrow");
				oItemRight.innerHTML = "" ;
				oItemRight.appendChild(oDivElem);
				this._loopItems(node, mn, newpath);

				/* NEW: MENU AUTO EXPANDS TO FIRST COLUMN, FIRST CHILD start */
				if (i == 0) {
					expandPath = newpath;
				}
				/* NEW: MENU AUTO EXPANDS TO FIRST COLUMN, FIRST CHILD end */
			}
		}

		/* NEW: MENU AUTO EXPANDS TO FIRST COLUMN, FIRST CHILD start */
		this.panel.showContent(expandPath);
		this.initialEPath = expandPath;

		/* NEW: MENU AUTO EXPANDS TO FIRST COLUMN, FIRST CHILD end */
		if (this.panel.element.scrollHeight > 0)  {
			
			// Remove the header from the scrollheight and add 3px of padding at the bottom
			var mainPanelHeight = this.panel.element.scrollHeight - this.panel.header.scrollHeight + 3;
			
			// We take the parent or the child with the largest height so that we don't have any scrollbar
			if( mainPanelHeight > childrenHeight ) {
				pega.util.Dom.setStyle(this.panel.contentSide, "height", mainPanelHeight + "px");
			} else {
				pega.util.Dom.setStyle(this.panel.contentSide, "height", childrenHeight  + "px");
			}
		}


		

	},


	_handleDesktopComponentFocus: function(componentID) {

		if (this.uuid != componentID) {
			//this._hideAll();
			//this.active = false;
			//this._hideSelectorPanel();
			if (this.active) this._deactivate();
		}
	},

	_launchElemMouseOut: function(e,obj) {
		pega.util.Dom.removeClass(obj,this.panelClass + "_on");
		pega.util.Dom.addClass(obj,this.panelClass);
	},

	_launchElemMouseOver: function(e,obj) {
		pega.util.Dom.addClass(obj,this.panelClass + "_on");
		pega.util.Dom.removeClass(obj,this.panelClass);

	},

	_panelMouseOver: function(e,data) {
	
		var me = this;

		//pega.util.Dom.addClass(data.obj,"selected");
		this._handleHighlight(data);

		this.timer = window.setTimeout(function() { 
			var panel = data.panel;
			panel.showContent(data.path);
			me._pathCheckHide(data.path);
		 },250);



	},

	_panelMouseOut: function(e,data) {
		window.clearTimeout(this.timer);
		this.timer = null;
		//pega.util.Dom.removeClass(data.obj,"selected");

	},

	_hideSelectorPanel: function() {
		this.panel.cfg.setProperty("x",-1000);
		this.panel.cfg.setProperty("y",-1000);
		this.panel.cfg.setProperty("visible",false);
		this._hideAll();
		this.active = false;

	},

	_showSelectorPanel: function(e) {
		this.desktopClickHandler.set(e)


		if (this.active) {
			this._hideSelectorPanel();
		}
		else {
			this.active = true;

			var r = pega.util.Region.getRegion(this.objMenubar);
			var x = r.left;
			var y = r.bottom;

			this.panel.cfg.setProperty("x",x);
			this.panel.cfg.setProperty("y",y);
			this.panel.cfg.setProperty("visible",true);
			this.panel.showContent(this.initialEPath);
			this.showHighLight({"path":this.initialEPath});
			//pega.util.Event.stopPropagation(e);
			//pega.desktop.sendEvent("pega.com$pega-ui$componentfocus",this.uuid,ASYNC);
			//pega.desktop.registerEventListener("DesktopMouseClick", this._desktopMouseClickHandler, this);
		}
	}



});



pega.ui.menubar.SelectorPanel = function(el,renderMode,userConfig) {

	var oButton = userConfig.headerButton;

	var oPanel = pega.ui.menubar.divNode.cloneNode(true);
	oPanel.id = el;
	var oHd = pega.ui.menubar.divNode.cloneNode(true);
	oHd.className = "hd";
	oHd.id = "headerElem";
	if (oButton) {

		if (oButton.stylePrefix) {
			var buttonClass = oButton.stylePrefix;
		}
		else {
			var buttonClass = "buttonTd";
		}

		var btt = this.getButtonHTML(oButton.caption,buttonClass);
		oHd.style.textAlign = "right";
		oHd.appendChild(btt);
		this.headerButtonClickAction = oButton.onClick;

	}

	var oBd = pega.ui.menubar.divNode.cloneNode(true);
	oBd.className = "bd";
	oBd.id = "bodyElem";
	var oFt = pega.ui.menubar.divNode.cloneNode(true);
	oFt.className = "ft";
	oFt.id = "footerElem";

	oPanel.appendChild(oHd);
	oPanel.appendChild(oBd);
	oPanel.appendChild(oFt);

	if (arguments.length > 0) {
		pega.ui.menubar.SelectorPanel.superclass.constructor.call(this,oPanel,userConfig);
	}

	var tb = pega.ui.menubar.tableNode.cloneNode(true);
	tb.setAttribute("height","100%");
	tb.setAttribute("width","100%");
	var tbody = pega.ui.menubar.tbodyNode.cloneNode(true);

	tb.setAttribute("cellPadding","0");
	tb.setAttribute("cellSpacing","0");

	tb.appendChild(tbody);
tbody.setAttribute("role","menu");//aria task

	this.objContainer = tbody;
	this.setBody(tb);

	this.contentArray = {};
	this.currentContent;

	var row = pega.ui.menubar.trNode.cloneNode(true);
	var lCell = pega.ui.menubar.tdNode.cloneNode(true);
	lCell.setAttribute("height","100%");
	lCell.setAttribute("width",userConfig.selectorSize);

	pega.util.Dom.addClass(lCell,"selector");


	var rCell = pega.ui.menubar.tdNode.cloneNode(true);
	rCell.setAttribute("width","100%");
	var oDiv = pega.ui.menubar.divNode.cloneNode(true);
	//oDiv.setAttribute("height","100%");
	oDiv.style.height = this.cfg.getProperty("height");
	oDiv.style.overflow="auto";
	rCell.appendChild(oDiv);

	pega.util.Dom.addClass(rCell,"content");

	this.contentSide = oDiv;

	tb = pega.ui.menubar.tableNode.cloneNode(true);
	tb.setAttribute("height","70%");
	tb.setAttribute("width","100%");
	tb.setAttribute("cellPadding","0");
	tb.setAttribute("cellSpacing","0");
	tbody = pega.ui.menubar.tbodyNode.cloneNode(true);
tbody.setAttribute("role","menu");//aria task
	tb.appendChild(tbody);
	lCell.appendChild(tb);

	this.selectorSide = tbody;

	row.appendChild(lCell);
	row.appendChild(rCell);



	this.objContainer.appendChild(row);
	lCell.style.verticalAlign = "top";
	rCell.style.verticalAlign = "top";
	//this.innerElement.style.border = "1px solid red";




	this.stylePrefix = userConfig.stylePrefix;
	pega.util.Dom.addClass(this.element,this.stylePrefix + "menubarPanel");
}


pega.extend(pega.ui.menubar.SelectorPanel, pega.widget.Overlay);

pega.ui.menubar.SelectorPanel.prototype.getSelectorSide = function() {
	return this.selectorSide;
}

pega.ui.menubar.SelectorPanel.prototype.performButtonAction = function(e) {
	eval(this.headerButtonClickAction);
}

pega.ui.menubar.SelectorPanel.prototype.getButtonHTML = function(strCaption,strStylePrefix) {
	var oTable = pega.ui.menubar.tableNode.cloneNode(true);
	pega.util.Dom.addClass(oTable,"buttonMainTable");
	oTable.setAttribute("cellSpacing","0");
	oTable.setAttribute("cellPadding","0");

	var oBody = pega.ui.menubar.tbodyNode.cloneNode(true);
oBody.setAttribute("role","menu");//aria task
	oTable.appendChild(oBody);
	var oRow = pega.ui.menubar.trNode.cloneNode(true);
	oBody.appendChild(oRow);

	var oLeftCell = pega.ui.menubar.tdNode.cloneNode(true);
	pega.util.Dom.addClass(oLeftCell, strStylePrefix + "Left");
	oLeftCell.innerHTML = " ";

	var oMiddleCell = pega.ui.menubar.tdNode.cloneNode(true);
	oMiddleCell.setAttribute("nowrap","true");
	pega.util.Dom.addClass(oMiddleCell,strStylePrefix + "Middle");

	var oButton = document.createElement("button");
	pega.util.Dom.addClass(oButton,strStylePrefix + "button");
	pega.util.Event.addListener(oButton,"click",this.performButtonAction,this,true);
	//oButton.setAttribute("onclick",strClick);

	oButton.innerText = strCaption;

	var oRightCell = pega.ui.menubar.tdNode.cloneNode(true);
	pega.util.Dom.addClass(oRightCell, strStylePrefix + "Right");
	oRightCell.innerHTML = "";

	oMiddleCell.appendChild(oButton);
	oRow.appendChild(oLeftCell);
	oRow.appendChild(oMiddleCell);
	oRow.appendChild(oRightCell);

	return oTable;
}

pega.ui.menubar.SelectorPanel.prototype.getContentSide = function() {
	return this.contentSide;
}

pega.ui.menubar.SelectorPanel.prototype.createContent = function(key) {
	var newContent = new pega.ui.menubar.SelectorContent();
	this.getContentSide().appendChild(newContent.oDom);

	this.contentArray[key] = newContent;
	this.currentContent = newContent;
	return newContent;
}

pega.ui.menubar.SelectorPanel.prototype.showContent = function(key) {
	var content = this.contentArray[key];
	if (content) {
		if (this.currentContent) {
			this.currentContent.oDom.style.display = "none";
			this.currentContent.oDom.style.visibility = "hidden";
			this.currentContent.oDom.setAttribute("aria-hidden","true");//aria task
		}
		content.oDom.style.display = "block";
		content.oDom.style.visibility = "";
		content.oDom.removeAttribute("aria-hidden");//aria task
		this.currentContent = content;
	}

}

/******** SELECTOR CONTENT ****************/


pega.ui.menubar.SelectorContent = function() {
	var tb = pega.ui.menubar.tableNode.cloneNode(true);
	tb.setAttribute("width","100%");
	tb.setAttribute("cellPadding","0");
	tb.setAttribute("cellSpacing","0");
	var tbody = pega.ui.menubar.tbodyNode.cloneNode(true);
	tb.appendChild(tbody);
tbody.setAttribute("role","menu");//aria task
	tb.style.display = "none";
	tb.style.visibility = "hidden";
	tb.setAttribute("aria-hidden","true");//aria task
	this.tby = tbody;
	this.oDom = tb;

}

pega.ui.menubar.SelectorContent.prototype = {
	addMenuItem:function(menuItem) {
		this.tby.appendChild(menuItem.oDom);
	},

	addSeparator: function() {
	}

}

/** Light Weight Panel **/

pega.ui.menubar.PanelConfig = function(userConfig,panel) {
	this.panel = panel;
	this.config = userConfig;
}

pega.ui.menubar.PanelConfig.prototype = {
	getProperty: function(p) {
		return this.config[p];
	},

	setProperty : function(p,v) {
		this.config[p] = v;
		this.panel.applyConfig(p,v);
	}
}

pega.ui.menubar.LightWeightPanel = function(id,renderMode,userConfig) {
	this.id = id;
	this.parent = null // set on render.
	this.path;
	this.parent;
	this.bIsTopLevel;
	this.cfg = new pega.ui.menubar.PanelConfig(userConfig,this);
	this.oDom = document.createElement("DIV");
	this.oDom.setAttribute("menu",id);

	if (userConfig.iframe) {
		this.shim = this.createShim();
		this.shim.setAttribute("id","shim-" + id);
	}
	else {
		this.shim = null;
	}

	this.body = this.oDom;
	this.element = this.oDom;
	pega.util.Dom.setStyle(this.oDom,"position","absolute");
	pega.util.Dom.setStyle(this.oDom,"left","150px");
	pega.util.Dom.setStyle(this.oDom,"top","0px");		//BUG-159047 in iPad, the elements getting flicked when menu is displayed for first time, because if there is no top position absolute is not respected
	this.renderMode = renderMode.toLowerCase();
	this.origScrollWidth = -1;


	if (this.renderMode != "tabbed" && this.alignment != "tabbed") {
		var tb = pega.ui.menubar.tableNode.cloneNode(true);
		var tbody = pega.ui.menubar.tbodyNode.cloneNode(true);

		tb.setAttribute("cellPadding","0");
		tb.setAttribute("cellSpacing","0");

tbody.setAttribute("role","menu");//aria task, table => vertical => menu

		tb.appendChild(tbody);

		this.objContainer = tbody;
		this.setBody(tb);


	}
	else {
		var bd = pega.ui.menubar.divNode.cloneNode(true);
bd.setAttribute("role", "navigation");//aria task

		this.setBody(bd);

		this.objContainer = this.body;
	}


}


pega.ui.menubar.LightWeightPanel.prototype = {
	addMenuItem: function(menuItem) {
		//BUG-29978
		if(this.renderMode != "tabbed" && this.alignment != "tabbed"){
			this.objContainer.style.width = "100%";
		}
		this.objContainer.appendChild(menuItem.oDom);

	},

	addSeparator: function(colorClass) {

	if (this.renderMode != "panel" && this.renderMode != "tabbed" && this.alignment != "tabbed") {
		var trow = pega.ui.menubar.trNode.cloneNode(true);
		trow.style.height = "1px";
		trow.style.padding = "0px";
		pega.util.Dom.addClass(trow, "menuItem");
		for (var i = 0; i < 3; i++) {
			var tcell = pega.ui.menubar.tdNode.cloneNode(true);

			trow.appendChild(tcell);

			if (colorClass) {

				pega.util.Dom.addClass(tcell,colorClass);
			}
			else {
				pega.util.Dom.addClass(tcell,"Separator");
			}

			tcell.innerHTML=" ";
			tcell.setAttribute("role","separator");//aria task
		}



		var oItem = {oDom:trow};
		this.addMenuItem(oItem);



	}
	else return;
	},

	applyConfig: function(p,v) {
	switch (p.toLowerCase()) {
		case "x":
			pega.util.Dom.setStyle(this.oDom,"left",v + "px");
			if (this.shim) {
				pega.util.Dom.setStyle(this.shim,"left", v+"px");
			}
			break;
		case "y": 
			pega.util.Dom.setStyle(this.oDom,"top",v+"px");
			if (this.shim) {
				pega.util.Dom.setStyle(this.shim,"top", v + " px");
			}
			
			break;
		case "visible": 
			if (!v) {
				pega.util.Dom.setStyle(this.oDom,"display","none");
				pega.util.Dom.setStyle(this.oDom,"visibility","hidden");
				this.oDom.setAttribute("aria-hidden","true");//aria task

				if (this.shim) {
					pega.util.Dom.setStyle(this.shim,"display","none");
					pega.util.Dom.setStyle(this.shim,"visibility","hidden");
					this.shim.setAttribute("aria-hidden","true");//aria task;
				}
			}
			else {
				pega.util.Dom.setStyle(this.oDom,"display","block");
				pega.util.Dom.setStyle(this.oDom,"visibility","");
				this.oDom.removeAttribute("aria-hidden");//aria task
				if (this.shim) {
					pega.util.Dom.setStyle(this.shim,"width", this.element.clientWidth+2);
					pega.util.Dom.setStyle(this.shim,"height", this.element.clientHeight+2);
					pega.util.Dom.setStyle(this.shim,"display","block");
					pega.util.Dom.setStyle(this.shim,"visibility","");
					this.shim.removeAttribute("aria-hidden");//aria task;
				}
			
			}
			break;
		case "z-index":
		case "zindex": 
			pega.util.Dom.setStyle(this.oDom,"z-index",v); 
			if (this.shim) {
				pega.util.Dom.setStyle(this.shim,"z-index", v-1);
			}
			break;
		case "iframe":
			if (!v) {
				try {
					if (this.shim) {
						this.shim.parentNode.removeChild(this.shim);
						this.shim = null;
					}
				}
				catch(e) {
				
				}
			}

	}
	},


	createShim: function() {
		var ifr = document.createElement("IFRAME");
		ifr.setAttribute("frameborder","0");
		pega.util.Dom.setStyle(ifr,"display","none");
		pega.util.Dom.setStyle(ifr,"visibility","hidden");
		pega.util.Dom.setStyle(ifr,"z-index","10");
		pega.util.Dom.setStyle(ifr,"position","absolute");
		return ifr;
	},

	destroy: function() {

		this.oDom	.parentNode.removeChild(this.oDom,true);
		if (this.shim) {
			this.shim.parentNode.removeChild(this.shim);
		}
		this.nativeWindow = null;
		
	},

	getElement: function() {
		return this.oDom;
	},

	getPath: function() {
		return this.path;
	},

	getParent: function () {
		return this.parent;
	},

	render: function(el) {
		el.appendChild(this.oDom);
		if (this.shim) {
			el.appendChild(this.shim);
		}
		this.parent = el;
	},

	setBody: function(el) {
		this.oDom.appendChild(el);
	},

	setElement : function(el) {
		this.oDom = el;
	},

	setPath:function(sPath) {
		this.path = sPath;
	},

	setParent :function(oParent) {
		this.parent = oParent;
	}
}


pega.u.contextMenu = function(){

	var contextMenuObjs = {};

	var closeContextMenus = function(id) {
		for(var prop in contextMenuObjs) {
			if(id != prop) {
				contextMenuObjs[prop]._hideAll();
			}
		}
	}

	var resetInCall = function() {
		closeContextMenus();
	}

	return {

	closeMenusOnRightClick : function(e){
		if((e.which && e.which == 3) || (e.button && e.button==2)){
			pega.u.contextMenu.closeAllMenus(e);
		}
	},

	closeAllMenus : function (e){
		if(e.type=='click' || ((e.which && e.which == 3) || (e.button && e.button==2))){
			closeContextMenus(""); 	
			if(window.Grids && pega.ctx.Grid){
				var allGrids = window.Grids.getAllGrids();
				for(var i in allGrids) {
					var ctxtMenus = allGrids[i].contextMenuObjs;
					if(ctxtMenus){
						for(var prop in ctxtMenus) {
							if(allGrids[i]==this) {								
								ctxtMenus[prop]._hideAll();
								
							}
							else {
								ctxtMenus[prop]._hideAll();
							}
						}
					}
				}
			}
		}
	},

	/* 'posObj' is an object that contains 3 members - x, y, relativeElement. If 'relativeElement' is not undefined
	 * then the menu will be positioned relative to 'relativeElement'. Otherwise, the menu will be positioned to
	 * x & y, which gives the location of the mouse-pointer when the event occured.
	 */
	renderContextMenu: function(posObj,ruleNav,objClass, event) {
		var id = "py"+ruleNav + objClass.replace(/-/g,'').replace(/@/, '');				
		var oContextXML = pega.tools.XMLDocument.get();
		var strUrlSF = SafeURL_createFromURL(pega.u.d.url);
		strUrlSF.put("pyActivity", "pxMenuBarTranslator");
		strUrlSF.put("Name", ruleNav);
		strUrlSF.put("Class",objClass);
		strUrlSF.put("Page",id);
		strUrlSF.put("Refresh",true);
		strUrlSF.put("RemovePage",true);
        /*Hfix-25632:Setting the pzKeepPageMessages to true to persist the error message when a menu is opened */
        strUrlSF.put("pzKeepPageMessages", "true");
		//Bug-64767: check if the event is from a repeat layout to set the right page context
		if(event!=null){
			var contextPage = pega.u.d.getBaseRef(pega.util.Event.getTarget(event));
			if(pega.u.d.isInRepeat(pega.util.Event.getTarget(event))){ //Check whether event came from a repeat grid
				var row = pega.u.d.getRepeatRow(pega.util.Event.getTarget(event), true);
				if(row && row.hPref) {
					contextPage = pega.u.property.toReference(row.hPref);
					strUrlSF.put("pzPrimaryPageName", contextPage );
				} else {
					strUrlSF.put("ContextPage", contextPage);
				}
			} else if($(event.target).parents('div#PEGAADDRESSMAP').length > 0) {
				/*Check whether the event originated from within Address Maps*/
				contextPage = posObj.usingPage;
				strUrlSF.put("ContextPage", contextPage);
			} else {
				strUrlSF.put("ContextPage", contextPage);
			}

			// BUG-154451 : Use the contextpage as primary page.
			if (contextPage && contextPage != "") {
				strUrlSF.put("pzPrimaryPageName", contextPage); 
			}

		}
		//Bug-64767: end

		var callback = {
			success: function(o) {
				oContextXML.loadXML(o.responseText);
				var contextMenuObj = contextMenuObjs[id];
				var xmlRootNode = {};
				if(!contextMenuObj) {
					contextMenuObj = new pega.ui.menubar.Manager();
					contextMenuObj.setAlignment("horizontal");
					contextMenuObj.registerCallback(null,pega.u.contextMenu);
					contextMenuObj.setMaxTextLength(posObj.maxChars);//BUG-42030
					contextMenuObjs[id] = contextMenuObj;
				}
				// using 'pagedata' to support multilpe parent nodes also.
				xmlRootNode=pega.util.Dom.selectSingleNode(oContextXML,'/pagedata');

				var child = xmlRootNode.childNodes;	
				var length = child.length;
				if(!pega.env.ua.ie) {
					length = 0;
					for(var i=0;i<child.length;i++){
						if(child[i].nodeType != 3)
							length++;
					}
				}
				// If there is exactly one root node (Menu), and that node has children, skip the root node.
				// Using 'Menu' for backward compatibilty so that dummy parent node with children is also supported.
				if (length == 1)
				{
					var xmlFirstMenuNode = pega.util.Dom.selectSingleNode(oContextXML,'/pagedata/Menu');
					if(xmlFirstMenuNode) {
						var childLength = xmlFirstMenuNode.childNodes.length;
						if(childLength > 0) {
							// Display root node's children instead of the root
							xmlRootNode = xmlFirstMenuNode;
						}
					}
				}

				var clonedNode = xmlRootNode.cloneNode(true);
				closeContextMenus(id);

				if(pega.env.ua.webkit) {
					contextMenuObj.doContextMenu(xmlRootNode, posObj);
				} else {
					contextMenuObj.doContextMenu(clonedNode, posObj);
				}
				contextMenuObj.active = true;
			},

			failure: function(o){		
				console.log("MENU: AJAX call failure.");
				var menuName = objClass.toUpperCase() + "!"+ruleNav.toUpperCase();
				if (pega.offline && pega.offline.NetworkStatus) {
					pega.mobile.hybrid.callWhenLaunchboxLoaded(function() {
						//This hardcoded string should be replaced with a proper PRPC type
						launchbox.PRPC.ClientStore.getItems("navigation", menuName,
						function(data){
							callback.success({responseText:data[0].content});
							/*pega.offline.NetworkStatus.setAjaxStatus(pega.offline.NetworkStatus.STATE_OFFLINE);*/
						},
						function(code, message){
							console.log("Call to local storage item failed. Storage key: "  + menuName + " Error " + code + ": " + message);
						});
						resetInCall();
                    });
				} else {
					resetInCall();
				}
			}
		}
		if (pega.offline && pega.offline.NetworkStatus) {                        
			if (!(window.pega.offline.NetworkStatus.isDataNetworkAvailable())) {                                
				var menuName = objClass.toUpperCase() + "!"+ruleNav.toUpperCase();
				if (pega.offline) {
					pega.mobile.hybrid.callWhenLaunchboxLoaded(function() {
						//This hardcoded string should be replaced with a proper PRPC type
						launchbox.PRPC.ClientStore.getItems("navigation", menuName,
						function(data){
							callback.success({responseText:data[0].content});
						},
						function(code, message){
							console.log("Call to local storage item failed. Storage key: "  + menuName + " Error " + code + ": " + message);
						});
                    });
				} 
			} else {                                
				pega.u.d.asyncRequest('POST', strUrlSF, callback);
			}		
		} else {                    
			pega.u.d.asyncRequest('POST', strUrlSF, callback);
		}
	}
	}//end of return
}();

if( !pega.util.Event.isIE && pega.c && pega.c.eventController){
	pega.c.eventController.registerEventNotification("CloseContextMenus",pega.u.contextMenu.closeAllMenus);	
}

if(pega.c && pega.c.eventController) {
	pega.c.eventController.registerEventNotification("CloseContextMenusRightClick", pega.u.contextMenu.closeMenusOnRightClick);
}

}
//static-content-hash-trigger-YUI
//<script>
/**
pzpega_ui_launchflow.js included in pega_ui_harness contains is a 
placeholder for all the functions related to 'Launch Flow In Modal Dialog' 
behavior of actionable items like buttons, icons and links. 
If in future flow needs to run inside a section, new functions should be 
added here.
IMPROTANT - This module needs pega.ui.doc for its functionality. If pega.ui.doc
is absent, the module is NOT initialized.
*/
if(pega.u.d){
pega.u.d.attachOnload(
function(){
(function(p){
    var pud = p.u.d;
    var pue = p.util.Event;
    //For effective minification, local references must be stored in objects/vars
    if (!pud){
        // Cannot continue without pega.ui.doc.
        return;
    }
    
    // BUG-85983 GUJAS1 11/08/2012 Devtip porting of hotfix. Added checking of Modal client component before trying to use it.
    if (!pud.modalDialog){
        return;
    }

    //For effective minification, constants must be used for repeated values.
    var MODAL_DIALOG_ID = pud.modalDialog.innerElement ? pud.modalDialog.innerElement.id : "modalWrapper";
    var MODAL_DIALOG_BODY_ID = pud.modalDialog.body ? pud.modalDialog.body.id : "modalDialog_bd";
    var MODAL_DIALOG_HEAD_ID = pud.modalDialog.head ? pud.modalDialog.head.id : "modalDialog_hd";
  
   // var pudThreadName = pud.getThreadName();
   // var MODAL_THREAD_NAME = pudThreadName+"/$FlowModalProcess";
   // MODAL_THREAD_NAME = MODAL_THREAD_NAME.replace("//","/");
    
    var ACTIVITY_PARAM_NAME = "pyActivity";
    var WORK_PAGE_NAME = "pyWorkPage";
    var ENGINE_ERRORS_ID = "ENGINE_ERRORS";
    var ERROR_TABLE_ID = "ERRORTABLE";
    var TAG_DIV = "div";
    var TEXT_TRUE = "true";
    var EVENT_CLICK = "click";
    var ERR_DELIM = "USING_PAGE_ERR:";
    var plf = {};
    var modalCancelCallbackExtern = null;
    var submitModalAssignmentCallbackExtern = null;
    
    if(!pud.lf){
        plf = pud.lf = p.namespace("pega.u.d.launchFlow");
    }
    var MODAL_THREAD_NAME;

    // BUG-612097 Need to get the thread dynamically, since the context can change than on load
    var getModalThreadName = function() {
      var pudThreadName = pud.getThreadName();
      var threadName = pudThreadName+"/$FlowModalProcess";
      threadName = threadName.replace("//","/");
      MODAL_THREAD_NAME = threadName;
      return threadName;
    }

    var showFlowInModal_PreSuccess = function(oResponse){
      var strResponse = oResponse.responseText;

      //Handle Engine errors
      if(strResponse && strResponse.match(ENGINE_ERRORS_ID))
      {
        var errorNode = document.createElement(TAG_DIV);
        errorNode.innerHTML = strResponse.substr(strResponse.indexOf("||"));
        pega.u.d.handleFormErrors(errorNode);
        alert(localCorrectErrors);
        pega.u.d.gBusyInd.hide();
        return false;
      }
      
      //Set the Harness ID on Modal overlay DIV
      if (pega.u.d.modalDialog && pega.u.d.modalDialog.element) {
        pega.ctxmgr.registerContextSwitching(pega.u.d.modalDialog.element);
      }
      
      // Store the original thread and switch to the modal thread.    
      //If there is a using page error, do not switch threads as it is not created yet.   
      if(strResponse.match(ERR_DELIM)){
        strResponse = strResponse.replace(ERR_DELIM, "");
      }
      else{
        if(!pud.baseThreadName){
          pud.baseThreadName = pud.getThreadName();
        }
        //pud.switchThread(MODAL_THREAD_NAME);
        /* BUG-324145: Need to point ClientCache to ClientDataProvider object of right thread */
        pega.ui.ClientCache.init(MODAL_THREAD_NAME);
        var dummyDiv = document.createElement("div");
        dummyDiv.innerHTML = strResponse;
        pega.u.d.initChangeTracker(dummyDiv);
        // BUG-484260. ChangeTrackersMap not yet updated. Hence breaks
        pud.switchThread(MODAL_THREAD_NAME);
        dummyDiv.innerHTML = null;
        dummyDiv = undefined;
      }
      pud.bModalDialogOpen = true;
    };
    /**
    @private Success callback for initial process where new thread is created, new flow is started and
    html to be shown in modal dialog is returned in response.   
    @param $Object$oResponse contains the response
    @return $void$
    */
    var showFlowInModal_Success = function(oResponse){
        delete pega.u.d.isFlowinModalProgress;
      	var harCtxMgr = pega.ui.HarnessContextMgr;
        var strResponse = oResponse.responseText;
        var modalDialogBody = document.getElementById(MODAL_DIALOG_BODY_ID);
        var top =0;
        if(!pud.bModalRendered){
            pud.renderModal();
        }
        var modalStyle="";
        if( pud.modalStyle ) modalStyle = pud.modalStyle;
        var returnData = pud.prePositionModalDialog();
        top = returnData[1];
        var bFixedCenter = true;
        bFixedCenter = returnData[0];
        var currentScope = this;
        
        
        var pudurl = SafeURL_createFromURL(harCtxMgr.get('url'));
        pudurl.put("pzPrimaryPageName","pyWorkPage");
        harCtxMgr.set('url', pudurl.toURL());
        
        //Callback function to show modal dialog after DOM object is created to house the html element of modal dialog.
        var callback = function() {
            pud.gCallbackArgs ={modalDialogBody:modalDialogBody,returnNode:modalDialogBody,
                                strResponse:strResponse,domObj:modalDialogBody,
                                bIsFlowActionModal:true,top:top,bFixedCenter:bFixedCenter,modalStyle:modalStyle};
            pud.modalDialogExtras();
            pud.bIsFlowInModal = true;
            pud.modalDialog.show();
            pud.modalDialogCallBack.call();
            pud.gBusyInd.hide();
        
            var modaldialoghd  = pega.util.Dom.get(MODAL_DIALOG_HEAD_ID);
            // override width of modal dialog header
            if(modaldialoghd){
                modaldialoghd.style.cssText += '; width:auto !important';
            }

            var closeButton = document.getElementById("container_close");   
                
            if(closeButton){    
                pue.removeListener(closeButton, EVENT_CLICK);   
                pue.addListener(closeButton, EVENT_CLICK, plf.handleModalCancel);
            }
            
        };
        pud.bModalDialogOpen = true;
        pud.loadDOMObject(modalDialogBody,strResponse,callback);
    };
    
    /**
     @private Failure Callback api for showFlowInModal function
     @param $Object$oResponse contains the response
     @return $void$
    */

    var showFlowInModal_Failure = function(oResponse){
        delete pega.u.d.isFlowinModalProgress;
        pud.gBusyInd.hide();
    };
    
    /**
     @public Process clicks on action buttons for behavior 'Launch Flow In Modal Dialog'. 
     A url is formed and submitted to the server to show the flow in a modal dialog.
     @Handler
     @param $String$flowName Name of the flow to be opened  
     @param $Array$oArgs Array of flow related configuration. Following order is expected - 
                            [0] : Class in which flow is contained
                            [1] : Parameters that given flow expects. A URL notation must be used.
                                  e.g. '&param1="Parameter 1"&param2="Parameter 2"' 
                            [2] : Using page, if any.  
     @return $void$
    */

    plf.showFlowInModal = function(flowName, oArgs, event, modalStyle){
      	var harnessContext = pega.ui.HarnessContextMgr.getCurrentHarnessContext();

        /*
        'Launch Flow In Modal Dialog' behavior handles cases where user must digress from current 
        flow and work on a different flow(sometimes, on a different work object). In such a case, 
        current flow must be paused and locked from further execution and new thread must be spawned
        to provide new context(and to avoid data inconsistency) to new flow. AJAX call is made to 
        call pzPerfromFlow which in turn calls pzRunFlow.
        Two activities invloved in this whole process are -
        pzPerformFlow : Called explicitly to spawn a new thread. 'Location' parameter of this activity
                        is a URL that calls pzRunFlow activity.
        pzRunFlow : Present in 'Location' param, this activity starts a new flow and returns the
                        Action Area content(harness html reduced to action area on server).
        */
        
        //Code to check and prevent opening of modal dialog from withing a modal dialog
        if(pega.u.d.bModalDialogOpen && event && pega.util.Dom.isAncestor(document.getElementById(MODAL_DIALOG_ID),pega.util.Event.getTarget(event))){
            alert(NoModalInModal);
            return;
        }
        pega.u.d.usesModalTemplate = true;  
        document.getElementById(MODAL_DIALOG_ID).style.display = "block";
        pud.insertButtonReload = pue.getTarget(event);
        //Build the 'Location' parameter to be consumed by RedirectAndRun (pzPerformFlow)
        var flowName = flowName,
            flowClass = oArgs[0];
            flowParams = oArgs[1];
            usingPage = oArgs[2];
            pega.u.d.flowModalTemplateName = oArgs[3] || "pyModalFlowTemplate" ; /* US-58245: Place the custom modal template in flowModalTemplateName in peag.u.d space */
            baseRef = "",
            repeatPage = "";
        //Current Context changes..
        if(usingPage == ""){ //If usingPage is blank then look for context
            repeatPage = pud.getRepeatPage(null,event); 
            if(repeatPage &&  repeatPage != "" && repeatPage.charAt(0) != ".") { // Check if within repeat context and context starts with '.' meaning  embedded property context
                baseRef = repeatPage;
            }
            else { // Check if top level page is used as baseref.
                baseRef = pud.getBaseRef(null,event) + repeatPage;
            }
        }else if(usingPage.charAt(0) == ".")
        {
          	/*BUG-205844 : Generating baseref for embedded page case.*/
            baseRef = pud.getBaseRef(null,event) + usingPage; //Handle  case where usingPage from DV is using embedded property reference along with currentcontext baseref. Potential usecase
        }
	    if(baseRef != ""){
            usingPage = baseRef;
        }
        //Build the safeurl to start a new flow and return html content to be shown in modal dialog.
        var actionURL = SafeURL_createFromURL(harnessContext.getProperty('url'));
         var safeURL = SafeURL_createFromURL(harnessContext.getProperty('url'));
        //Null check needed at every step to avoid run-time exceptions
        //actionURL.put(ACTIVITY_PARAM_NAME,"Work-.pzRunFlow");
        if (flowName && flowName != '') {
            safeURL.put("modalFlowType",flowName );
            if (flowClass && flowClass != '') {
                safeURL.put("modalInsClass",flowClass );
            }
            if (flowParams && flowParams != '') {
                // At this point, each parameter is encoded, 
                //the complete string can be split on '&'
                var oParams = flowParams.split("&");
                var paramList = "";
                for (var i=0;i<oParams.length; i++) {
                    if (oParams[i] != '') {
                        var oParamNMPair = oParams[i].split("=");
                        // Unescaping first will convert the %2B to + which will be replaced by space. 
                        //Avoid this by replacing the + with space and then unescaping
                        if(paramList){
                           paramList += "&";
                        }
                        paramList += oParamNMPair[0];
                        safeURL.put(oParamNMPair[0], unescape(oParamNMPair[1].replace(/\+/g, " ")));
                    }
                }
                if(paramList){
                    safeURL.put("modalFlowParams",paramList );
                } 
            }
        }
        actionURL.put("skipChangeTrack", "true");
        actionURL.put("outputStream",TEXT_TRUE);
        safeURL.put("FlowInModal",TEXT_TRUE);
        safeURL.put("templateStreamName",pega.u.d.flowModalTemplateName); /* US-58245: Accessing the modal template name from flowModalTemplateName  */
        if(modalStyle) {  pud.modalStyle = modalStyle; } else {  pud.modalStyle="";}

        if(usingPage != ""){
            //actionURL.put("pzPrimaryPageName","pyWorkPage");
            //actionURL.put("pzFromFrame","pyWorkPage");    

            safeURL.put("modalUsingPage",usingPage);
        }

        var harnessElement = document.getElementById("PEGA_HARNESS");
        if(harnessElement){
            actionURL.put("harnessName",harnessElement.getAttribute("node_name"));
        }
        actionURL.put("pzHarnessID",document.getElementById("pzHarnessID").value);

		    if (pega.isUITemplatized) {
			    actionURL.put("UITemplatingStatus","Y");
	    	}

        // New Thread to be created
        // BUG-612097 For the first life cycle method, get the current thread name and create flow thread name
        var threadName = getModalThreadName();
        
        //Pages to copy
        var pages = WORK_PAGE_NAME; 
        if(usingPage != ""){
            pages = usingPage;
        }
        
        //Build the safeurl to create a new thread.
        safeURL.put(ACTIVITY_PARAM_NAME,"pzPerformFlow"); 
        safeURL.put("ThreadName",threadName);
       //BUG-362409 encoded the query string in action url to fix generation of garbage values while creating datapage
        safeURL.put("Location", actionURL.toUnencodedQueryString());
        safeURL.put("PagesToCopy",pages);
        safeURL.put("UsingPage", usingPage);
		if (pega.isUITemplatized) {
      		safeURL.put("UITemplatingStatus","Y");
      		safeURL.put("UITemplatingScriptLoad","true");
    	} 
        
        originalPrimaryPage = safeURL.get("pzPrimaryPageName");
		originalFromFrame = safeURL.get("pzFromFrame");
        
        /*if(pud.gBusyInd) {
            busyIndIntervalOriginal = pud.gBusyInd.busyIndInterval;
            pud.gBusyInd.busyIndInterval = 0;
        }else {
            busyIndIntervalOriginal = pud.busyIndInterval;
            pud.busyIndInterval = 0;
        }*/
                
      if(document.forms[0] != null){
        pega.ctxmgr.set("formEncodingType",document.forms[0].encoding);
        document.forms[0].encoding = "application/x-www-form-urlencoded";
      }      
      
        //Prepare an AJAX call to call server side activities
        var callback = { success: showFlowInModal_Success, failure: showFlowInModal_Failure, preRenderer:showFlowInModal_PreSuccess, scope : this };
        var postData = "";
        pud.setBusyIndicator(null, true);
      //BUG-437497
        pega.u.d.isFlowinModalProgress = true;
        var request = pud.asyncRequest('POST',safeURL,callback,postData);
    };
        

    /**
    @private Success callback for further flow processing(on subsequent submits)
    @param $Object$oResponse contains the response
    @return $void$
    */
    var submitModalAssignment_Success = function(oResponse){
      	var harnessContext = pega.ui.HarnessContextMgr.getCurrentHarnessContext();
        var strResponse = oResponse.responseText;
        //Handle Engine errors
        if(strResponse && strResponse.match(ENGINE_ERRORS_ID))
        {
            var errorNode = document.createElement(TAG_DIV);
            errorNode.innerHTML = strResponse.substr(strResponse.indexOf("||"));
            pud.handleFormErrors(errorNode);
            alert(localCorrectErrors);
            pega.u.d.gBusyInd.hide();
            return;
        }
        var documentFragment = document.createDocumentFragment();
        var newElement = document.createElement(TAG_DIV);
                newElement.style.display="none";
             documentFragment.appendChild(newElement);

        newElement.innerHTML = strResponse;
        
        var errorMarkers = pega.util.Dom.getElementsById("PegaRULESErrorFlag",newElement);
        var errorMarkersLength = 0;
        if (errorMarkers )
            errorMarkersLength  = errorMarkers.length ;

        
        // If form errors are present, invoke handleErrorAfterPartialSuccess to display them.
        var errorTableNode = pega.util.Dom.getElementsById(ERROR_TABLE_ID, newElement);
            if( pega.u.d.bIsFlowInModal != true && ((errorTableNode && errorMarkersLength == 0 ) || (errorTableNode && pega.u.d.alwaysShowFormLevelErrors == "true"))){

            errorTableNode = errorTableNode[0];
            errorTableNode.parentNode.removeChild(errorTableNode);
            strResponse = newElement.innerHTML;
            // Reuse the handleErrorAfterPartialSuccess method to ensure the mother harness error table is created
            // correctly.

            pud.handleErrorAfterPartialSuccess({argument:[errorTableNode],responseText:errorTableNode.outerHTML});
            // And hide this error table since handleErrorAfterPartialSuccess makes it visible. The error table's 
            // display is later governed by the ShowErrors API which is invoked through Modal Dialog infrastructure.
            // This is why the below code hides the error table.
            document.getElementById(ERROR_TABLE_ID).style.display = "none";
        }
        var closeModal = pega.util.Dom.getElementsById("closeModal",newElement);
        
        newElement.innerHTML = null;
        documentFragment.removeChild(newElement);
        documentFragment = null;
        if(typeof pega.u.d.nullifyComplexElementsInModal == "function"){
          pega.u.d.nullifyComplexElementsInModal();
        } 
        if(closeModal){
            delete pega.u.d.flowModalTemplateName; /*US-58245: Removing flowModalTemplateName property from pega.u.d space on modal submit */ 
            var threadName = MODAL_THREAD_NAME;
            pud.switchThread(pega.u.d.baseThreadName);
            pud.processModalCallbak("CLOSE");
            var safeURL = SafeURL_createFromURL(harnessContext.getProperty('url'));
        
            safeURL.put(ACTIVITY_PARAM_NAME,"removeThead");
            safeURL.put("threadName",threadName);
			safeURL.put("pzFromFrame",originalFromFrame );
            
            
            var pudurl = SafeURL_createFromURL(harnessContext.getProperty('url'));
            pudurl.put("pzPrimaryPageName",originalPrimaryPage);
	        pudurl.put("pzFromFrame",originalFromFrame );

            harnessContext.setProperty('url', pudurl.toURL());
            
            
            var request = pud.asyncRequest('GET',safeURL);
            pega.u.d.hideModalWindow();
            pega.u.d.bIsFlowInModal = false; 

            //reset the transaction of form
            //var pzTransactionId = documentFragment.getElementById("pzTransactionId").value

            //var input = document.createElement("input");
            //input.setAttribute("type", "hidden");
            //input.setAttribute("name", "pzTransactionId");
            //input.setAttribute("value",pzTransactionId);
            //document.forms[0].appendChild(input);
            
            //refresh the action section after modal dialog is closed
            
            /*var sectionNode = pega.u.d.getSectionByName("pzActionAreaContent", "", document);*/
            pega.u.d.reloadSection(pud.insertButtonReload, '', '', false, false, "-1", false);  
            return;
            
        }       
        var modalDialogBody = document.getElementById(MODAL_DIALOG_BODY_ID);
        var top =0;
        if(!pud.bModalRendered){
            pud.renderModal();
        }
        //BUG-134306  added below if block to update transaction id         
        if(harnessContext.getProperty('url')){
            var newURL = SafeURL_createFromURL(harnessContext.getProperty('url'));
            var trackedTxnId = pega.ui.ChangeTrackerMap.getTracker().getPropertyValue("pxThread.pxClientExchange");     
            var curTxnId = newURL.get('pzTransactionId');
                           if(trackedTxnId  != curTxnId)
                newURL.put('pzTransactionId',trackedTxnId);
                harnessContext.setProperty('url', newURL.toURL());         
        }                       
        var returnData = pud.prePositionModalDialog();
        top = returnData[1];
        var bFixedCenter = true;
        bFixedCenter = returnData[0];
        var currentScope = this;
        var modalStyle="";
        if( pud.modalStyle ) modalStyle = pud.modalStyle;

        var callback = function() {
            pud.gCallbackArgs ={modalDialogBody:modalDialogBody,returnNode:modalDialogBody,
                                strResponse:strResponse,domObj:modalDialogBody,
                                bIsFlowActionModal:true,top:top,bFixedCenter:bFixedCenter,modalStyle:modalStyle};
            


            pud.modalDialogCallBack.call();
            var modaldialoghd  = pega.util.Dom.get(MODAL_DIALOG_HEAD_ID);
            // override width of modal dialog header
            if(modaldialoghd){
                modaldialoghd.style.cssText += '; width:auto !important';
            }
            var closeButton = document.getElementById("container_close");                       
            if(closeButton){    
                pue.removeListener(closeButton, EVENT_CLICK);   
                pue.addListener(closeButton, EVENT_CLICK, plf.handleModalCancel);
            }
            if(pega.u.d.useOldModalDialog) {
            //BUG-57758 22-12-2011 KODUC this piece of code is used to set the height of modal dialog to proper height when clicked back after resizing
            var body = document.getElementById("modaldialog_bd");
            var feet = document.getElementById("modaldialog_ft");
            var bodyHeight = body.offsetHeight;
            var feetHeight = feet.offsetHeight;
            var modalHeight = bodyHeight+feetHeight+"px";
            document.getElementById("modaldialog").style.height = modalHeight ;
            //End of BUG-57758 22-12-2011 KODUC 
            }

        };
        pud.loadDOMObject(modalDialogBody,strResponse,callback);
        if(modalDialogBody && docFocus){ setTimeout(function(){docFocus.focusToFirstInvalidField(modalDialogBody);},0)} 
        };
    
    /**
    @private Failure callback for submitModalAssignment function
    @param $Object$oResponse contains the response
    @return $void$
    */
    var submitModalAssignment_Failure = function(oResponse){
        
    };
    
    /**
     @public Normal flow processing but in modal dialog. 
     Activity pzSubmitAssignment, will process subsequent submit functions and will be called from here.
     @Handler
     @return $void$
    */
    plf.submitModalAssignment = function(event){
        
        /*BUG-589511 Stop the flow in modal submit until all the ajax requests are complete
          This is needed to consume the new transaction ID if a commit operation is performed from within modal*/
        if(pega.u.d.isAjaxInProgress()){
          setTimeout(function(){
            plf.submitModalAssignment(event);
          }, 0);
          return;
        }
      
      	var harnessContext = pega.ui.HarnessContextMgr.getCurrentHarnessContext();
        /*BUG-71649(RAIDV) - For special controls like RTE, validation must be done using processOnBeforeSubmit. Normal validation will result in faulty RTE validation.*/
        if(pud.processOnBeforeSubmit(null, document.getElementById("modalWrapper")) == false) return false;
        if(typeof(bClientValidation)!="undefined"){
            var modalBody = document.getElementById(MODAL_DIALOG_BODY_ID);
            if(bClientValidation &&(typeof(validation_validate) == "function")&& !validation_validate(modalBody)){
                if(typeof(customClientErrorHandler)!= "undefined"){
                    var exit = customClientErrorHandler();
                    if(exit){
                        pue.stopEvent(event);
                        return false;
                    }
                }else{
                    alert(form_submitCantProceed);
                    pue.stopEvent(event);
                    return false;
                }
            }
        }
        pud.switchThread(MODAL_THREAD_NAME);
        var safeURL = SafeURL_createFromURL(harnessContext.getProperty('url'));
        safeURL.put(ACTIVITY_PARAM_NAME,"Work-.pzSubmitAssignment");
      	safeURL.put("FlowInModal",TEXT_TRUE); /* BUG-232081: Send FlowInModal param to identify whether the modal dialog is used to launch flow */
        safeURL.put("threadName",MODAL_THREAD_NAME);
        safeURL.put("baseThreadName",pud.baseThreadName);
        safeURL.remove("pzTransactionId");      

        safeURL.put("outputStream",TEXT_TRUE);
        safeURL.put("streamName",pega.u.d.flowModalTemplateName); /* US-58245: Accessing the modal template name from flowModalTemplateName */
        safeURL.put("pzPrimaryPageName","pyWorkPage");
      	if (pega.isUITemplatized) {
          safeURL.put("UITemplatingStatus", 'Y');
        }
        var callback = submitModalAssignmentCallbackExtern || { success: submitModalAssignment_Success, failure: submitModalAssignment_Failure, scope : this };
        //submit modal dialog content
        var reloadElement = document.getElementById(MODAL_DIALOG_BODY_ID);
        var postData = pud.getQueryString(reloadElement);
        if(pega.ctxmgr.get("formEncodingType") != null){
          document.forms[0].encoding = pega.ctxmgr.get("formEncodingType");
          pega.ctx.modalHasFileEncoding = false;
        }
        pega.u.d.disableAllOtherButtons(null, pega.u.d.modalDialog.innerElement);
        pud.setBusyIndicator();
        var request = pud.asyncRequest('POST',safeURL,callback,postData);
    };
    
    plf.setSubmitModalAssignmentCallbackExtern = function(callbackObj) {
        submitModalAssignmentCallbackExtern = callbackObj;
    }
    
    plf.resetSubmitModalAssignmentCallbackExtern = function() {
        submitModalAssignmentCallbackExtern = null;
    }
  
    plf.handleModalActionEvent = function(preActivity, preActivityParams, strDisplayHarnessParms){
      	var harnessContext = pega.ui.HarnessContextMgr.getCurrentHarnessContext();
        var safeURL = SafeURL_createFromURL(harnessContext.getProperty('url'));
        
        safeURL.put(ACTIVITY_PARAM_NAME,"ReloadHarness");
      	safeURL.put("FlowInModal",TEXT_TRUE); /* BUG-232081: Send FlowInModal param to identify whether the modal dialog is used to launch flow */
        safeURL.put("PreActivity","GoToPreviousTask");
        safeURL.put("pzPrimaryPageName","pyWorkPage");

        safeURL.put("HarnessMode","ACTION");
        safeURL.put("previousEntryPoint",TEXT_TRUE);

        safeURL.put("outputStream",TEXT_TRUE); 
        safeURL.put("streamName",pega.u.d.flowModalTemplateName); /* US-58245: Accessing the modal template name from flowModalTemplateName  */

        safeURL.remove("pzTransactionId");

      	if (pega.isUITemplatized) {
          safeURL.put("UITemplatingStatus", 'Y');
        }

        var callback = { success: submitModalAssignment_Success, failure: submitModalAssignment_Failure, scope : this };
        
        //submit modal dialog content
        var reloadElement = document.getElementById(MODAL_DIALOG_BODY_ID);
        var postData = pud.getQueryString(reloadElement);
        pega.u.d.disableAllOtherButtons(null, pega.u.d.modalDialog.innerElement);
        var request = pud.asyncRequest('POST',safeURL,callback,postData);
    };
    
    var handleModalCancel_Success = function(oResponse){
                
    };

    var handleModalCancel_Failure = function(oResponse){
        
    };

    plf.handleModalCancel = function(){
      if (!pega.u.d.bModalDialogOpen) {
         /*BUG-587164: if modal is already closed, return*/
          return;
        }
        delete pega.u.d.flowModalTemplateName; /*US-58245: Removing flowModalTemplateName property from pega.u.d space on cancel of modal */ 
      	var harnessContext = pega.ui.HarnessContextMgr.getCurrentHarnessContext();
        var threadName = MODAL_THREAD_NAME;
      	pega.u.d.closeChildOverLay(pega.util.Event.getEvent());  //BUG-240236 : Overlay is not getting closed on closing the modal
        pud.hideModalWindow();
        pud.bIsFlowInModal = false;
        if(!pud.baseThreadName){
            pud.baseThreadName = pud.getThreadName();
        }
        pud.switchThread(pud.baseThreadName);

        var safeURL = SafeURL_createFromURL(harnessContext.getProperty('url'));
        
        safeURL.put(ACTIVITY_PARAM_NAME,"removeThead");
        safeURL.put("threadName",threadName);       

        var pudurl = SafeURL_createFromURL(harnessContext.getProperty('url'));
        pudurl.put("pzPrimaryPageName",originalPrimaryPage);
        pudurl.put("pzFromFrame",originalFromFrame );
        harnessContext.setProperty('url', pudurl.toURL());

        // BUG-87920: JALDS 31/01/2013 - Fix to resolve the issue with save after cancel on delete branch.
        pud.processModalCallbak("CLOSE");
        if (document.forms[0] != null){
          if(pega.ctxmgr.get("formEncodingType") != null){
            document.forms[0].encoding = pega.ctxmgr.get("formEncodingType");
            pega.ctx.modalHasFileEncoding = false;
          }
        }
        
        var callback = modalCancelCallbackExtern || { success: handleModalCancel_Success, failure: handleModalCancel_Failure, scope : this };
        var request = pud.asyncRequest('GET',safeURL,callback);

    };
    
    plf.setModalCancelCallbackExtern = function(callbackObj) {
        modalCancelCallbackExtern = callbackObj;
    }
    
    plf.resetModalCancelCallbackExtern = function() {
        modalCancelCallbackExtern = null;
    }
})(pega);
},true);

}
//static-content-hash-trigger-GCC
