pega.namespace("pega.cs.NotificationCounter");

pega.cs.NotificationCounter = (function(){

  function calculateBadgePosition(options){
    var targetPosition = options.targetPosition;
    var targeticon = $(document.getElementById(options.controlID));
    var targetBottomPos, targetRightPos, targetTopPos, targetLeftPos;  
    var iconHeight = targeticon.height();
    var iconWidth = targeticon.width(); 
    if((targetPosition.toUpperCase())==='TL'){
      targetBottomPos = (iconHeight/2)+"px";
      targetRightPos = (iconWidth)/2+"px";
    }
    else if((targetPosition.toUpperCase())==='BL'){
      targetTopPos = (iconHeight/2)+"px";
      targetRightPos = (iconWidth)/2+"px";
    }
    else if((targetPosition.toUpperCase())==='BR'){
      targetTopPos = (iconHeight/2)+"px";
      targetLeftPos = (iconWidth)/2+"px";
    }
    else{
      targetBottomPos = (iconHeight/2)+"px";
      targetLeftPos = (iconWidth)/2+"px";
    }
    $(targeticon).find(".counter-value").css({
      "top":targetTopPos ? targetTopPos : "",
      "left":targetLeftPos ? targetLeftPos : "",
      "right":targetRightPos ? targetRightPos : "",
      "bottom":targetBottomPos ? targetBottomPos : ""
    });
  }
  
  return{
    calculateBadgePosition : calculateBadgePosition
  }
})();
//static-content-hash-trigger-YUI