(function (p) {

    if (!p.control) {
        p.c = p.namespace("pega.control");
    } else {
        p.c = pega.control;
    }

    /* ICheckBox Constructor */
    p.c.ICheckBox = function () {
        p.c.ICheckBox.superclass.constructor.call(this, "ICheckBox");
    };

    /* Inherit form IUIElement */
    p.lang.extend(p.c.ICheckBox, p.c.IUIElement);

    /* CheckBox Specific implicit Behavior to handle click event when fired from the Span. 
    This method is not called for the standalone Checkbox or when Checkbox inside the Span is clicked directly. In these scenarios the browser takes its natural course of action */
    p.c.ICheckBox.prototype.click = function (event) {
        var element = p.util.Event.getTarget(event);

        /*Incase of IE calling pega.util.Event.fireEvent() results in only the onclick event being fired. 
        The default behavior of checking the checkbox is not triggered.
        To ensure the Checkbox toggle happens in IE also, the code inside isIE is written.
        Other browsers work fine. The checkbox is checked and the onclick is fired*/
/*
	// Commented these lines to avoid firing click, because label click automatically fires click on checkbox : START
        if (element.tagName.toLowerCase() != 'input') {
            var chkBoxElement = element.getElementsByTagName('input')[1];
            if (p.util.Event.isIE) {
                if (chkBoxElement.checked == true) {
                    chkBoxElement.checked = false;
                } else {
                    chkBoxElement.checked = true;
                }
            }

            pega.util.Event.fireEvent(chkBoxElement, 'click');
            chkBoxElement.focus(); //clicking also means focussing. this statement explicitly does the focus as firing click using JS doesnot result in a focus.
        }
	// Commented these lines to avoid firing click, because label click automatically fires click on checkbox : END
*/

        if (element.tagName.toLowerCase() == 'input' && typeof (Grids) != 'undefined') {
		var actvGrid = Grids.getActiveGrid(event);
		if(actvGrid) {
			actvGrid.checkAllIfInHeader(element, event);
		}
        }
    };

    p.c.Checkbox = new p.c.ICheckBox();

    /*Checkbox specific behavior handler needed when there is a caption and the markup has a span.
    Incase of standalone Checkbox, the generic Actions object is sufficient to handle the behavior.
    e: event object
    */
    p.c.Checkbox.Actions.changeStyle = function (e, styleText) {
        e = pega.util.Event.getEvent(e);
        var targetEle = pega.util.Event.getTarget(e);
        var targetEle4Focus = targetEle;
        if (!targetEle.getAttribute('data-ctl')) {
            targetEle = targetEle.parentNode;
        }
        if (e.type == "focus" || e.type == "focusin") {
            pega.util.Event.addListener(targetEle4Focus, "focusout", function (e) { /*the focusout is attached on the checkbox as the span is not capable of taking focus*/
                e = pega.util.Event.getEvent(e);
                pega.util.Dom.changeStyle(targetEle, e.type); /*but the changeStyle must happen on the Span*/
                pega.util.Event.removeListener(targetEle4Focus, "focusout");
            });
        } else if (e.type == "mouseover") {
            pega.util.Event.addListener(targetEle, "mouseout", function (e) {/*the mouseout is always attached attached on the span*/
                e = pega.util.Event.getEvent(e);
                pega.util.Dom.changeStyle(targetEle, e.type);
                pega.util.Event.removeListener(targetEle, "mouseout");
            });
        }
        pega.util.Dom.changeStyle(targetEle, e.type, styleText);
    };

})(pega);

