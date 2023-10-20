function OperatorPresenceCallback(event){

var state = event.detail.response.StandardAttributes.State;
var container = document;
 if(!event){
	event = window.event;
 } 
  var sectionNodes = pega.u.d.getSectionsByName("pzOperatorPresence", container);
  var actualNode="";
  if (sectionNodes) {
		var sectionsLen = sectionNodes.length;
      	var i=0;
      	if(sectionsLen != 1){
			for (i = 0; i < sectionsLen; i++) {
      	 		var sectionNode = sectionNodes[i];
         		if(sectionNode && pega.util.Dom.isAncestor(sectionNode,pega.util.Event.getTarget(event))){	
                   var operatorImageNode=sectionNode.parentNode;
                   actualNode=operatorImageNode.getAttribute("id");
              	   break;
            	}
       		 }
        }else{
          	if(sectionsLen == 1){
            	var sectionNode = sectionNodes[0];
              	var operatorImageNode=sectionNode.parentNode;
                actualNode=operatorImageNode.getAttribute("id");
         	}
        }
   }
   var operatorId = event.detail.response.StandardAttributes.OperatorID;
  

   var imageNodeWithImage=document.getElementById(actualNode+"WithImage");
   var imageNodeWithoutImage=document.getElementById(actualNode+"WithoutImage");
  
  var operatorStatusClass = "defaultoperatorstatus";
  
 /* Fetch classes from pyOperatorPresenceColors css file */
  if(state === "ACTIVE"){ 
    operatorStatusClass = "activeoperatorstatus";
  } else if(state === "AWAY"){
    operatorStatusClass = "awayoperatorstatus";
  } else if(state === "DISCONNECTED"){
    operatorStatusClass = "disconnectedoperatorstatus";
  } else if(state === "OFFLINE"){
    operatorStatusClass = "offlineoperatorstatus";
  }  

  
    if(imageNodeWithImage){
      operatorStatusClass = "operatorWithImage " + operatorStatusClass; 
  		imageNodeWithImage.setAttribute('class', operatorStatusClass);
    }
   	if(imageNodeWithoutImage){
      operatorStatusClass = "operatorWithoutImage " + operatorStatusClass;
      imageNodeWithoutImage.getElementById("operatorWithoutImage").setAttribute('class', operatorStatusClass);
    } 

  

}
//static-content-hash-trigger-GCC