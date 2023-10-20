/*script to show the required icon when the question is configured as required field for both online and offline mode*/
function setMandatoryIconforQP() {

  var elem = document.getElementsByClassName("mandatory_question_text");
  var i;
  for (i = 0; i < elem.length; i++) {
    if (elem && elem[i]) {
      var elemspan = elem[i].getElementsByTagName("span");
      if (elemspan && elemspan[0]) {
        var elemp = elemspan[0].getElementsByTagName("p");
        if (elemp && elemp[0]) {
          elemp[0].className += " iconRequired standard_iconRequired";
        } else if(elemspan[0].firstElementChild && elemspan[0].firstElementChild.tagName !== 'BR') {
            elemspan[0].firstElementChild.className += " iconRequired standard_iconRequired";
        } else {
            elemspan[0].className += " iconRequired standard_iconRequired";
        }
      } else {
        var elemdiv = elem[0].getElementsByTagName("div");
        elemdiv = elemdiv[0].getElementsByTagName("div");
        elemdiv[0].className += " iconRequired standard_iconRequired";
      }
    }
  }
}

/*script to show the required icon when the question is configured as required field for both online and offline mode*/
function setMandatoryIcon(elem) {
  if (elem && elem[0]) {
    var elemspan = elem[0].getElementsByTagName("span");
    if (elemspan && elemspan[0]) {
      var elemp = elemspan[0].getElementsByTagName("p");
      if (elemp && elemp[0]) {
        elemp[0].className += " iconRequired standard_iconRequired";
        } else if(elemspan[0].firstElementChild && elemspan[0].firstElementChild.tagName !== 'BR') {
            elemspan[0].firstElementChild.className += " iconRequired standard_iconRequired";
      } else {
            elemspan[0].className += " iconRequired standard_iconRequired";
      }
    } else {
      var elemdiv = elem[0].getElementsByTagName("div");
      elemdiv = elemdiv[0].getElementsByTagName("div");
      elemdiv[0].className += " iconRequired standard_iconRequired";
    }

  }
}


/*Function called TempSectionRTE section to support property reference in offline*/
var surveyResolvePegaTags = function (stream, uid, contextPage) {
  stream = pega.tools.Security.decodeCrossScriptingFilter(stream);
  if (pega.ctx.survey.questionParams != null) {
    stream = stream.replace(pega.ctx.survey.questionParams['regExp'], function (match, contents) {
      return getPegaReferenceTagValue(contents, contextPage);
    });
  }
  if (pega.ctx.survey.questionPageParams != null) {
    stream = stream.replace(pega.ctx.survey.questionPageParams['regExp'], function (match, contents) {
      return getPegaReferenceTagValue(contents, contextPage);
    });
  }
  document.getElementById(uid).innerHTML = stream;
}


//calling setTimeout to fix BUG-521238
/*Function called from on change of answer to do the property mapping and clear selection logic for radio type questions*/
function refreshSurvey(questionName, propertyName, questionPageName, pageRef, QuestionMode, Score, IsClearSelection, answerRefObj, ChkType, evt, tablePropName) {
  if (!evt) {
    evt = pega.util.Event.getEvent();
  }
  
   if ('radio' == QuestionMode) {
     $(".wrap-radio-labels").find("input[type='radio']").attr('disabled', true);
     setTimeout(function(){
       $(".wrap-radio-labels").find("input[type='radio']").attr('disabled', false);
     }, 500);
   }
  
  setTimeout(function() {
    refreshSurveyinner(questionName, propertyName, questionPageName, pageRef, QuestionMode, Score, IsClearSelection, answerRefObj, ChkType, evt, tablePropName)
  },0);
}


function refreshSurveyinner(questionName, propertyName, questionPageName, pageRef, QuestionMode, Score, IsClearSelection, answerRefObj, ChkType, evt, tablePropName) {

  if (!evt) {
    evt = pega.util.Event.getEvent();
  }
  var srcValue = "";
    var srcProp = "";
    var propEntryHandle = "";
    if (IsClearSelection) {
      srcProp = pageRef + ".pyAnswer";
      propEntryHandle = pega.ui.property.toHandle(srcProp);
    } else {
      var src = pega.util.Event.getTarget(evt);
      if (src.control) {
        src = src.control;
      }
      srcValue = pega.u.d.getDOMElementValue(src);
      propEntryHandle = src.name;     
      
      /* To avoid posting value when field has error */
    if (typeof window.getErrorDB == 'function' && propEntryHandle && window.getErrorDB().isHavingError(propEntryHandle)) {
      return;
    }
    }
    

  /*code to do property mapping in offline mode and clear selection logic*/
  if (pega.u.d.ServerProxy && pega.u.d.ServerProxy.isDestinationLocal()) {
    var clientcache = pega.ui.ClientCache;
    var propertyName = "";
    if (clientcache.find(pageRef) != null && clientcache.find(pageRef).get("PropertyName") != null) {
      propertyName = clientcache.find(pageRef).get("PropertyName").getValue();
    }
    
    
    srcProp = pega.ui.property.toReference(propEntryHandle);
    var srcProp_cc = clientcache.find(srcProp);
    if (srcProp_cc) {
      srcProp_cc.setValue(srcValue);
    }
    if (propertyName != "") {
      if (clientcache.find(pageRef) != null)
        clientcache.find(pageRef).put("pyAnswer", srcValue);
      if (clientcache.find(pageRef) != null && clientcache.find(pageRef).getTopLevelPage() != null && clientcache.find(pageRef).getTopLevelPage().get(propertyName) != null) {
        clientcache.find(pageRef).getTopLevelPage().get(propertyName).setValue(srcValue);
      } else if (clientcache.find(pageRef) != null && clientcache.find(pageRef).getTopLevelPage() != null && clientcache.find(pageRef).getTopLevelPage().get(propertyName) == null) {
        if (propertyName.lastIndexOf(".") > 0) {
          var size = propertyName.length;
          var pageName = propertyName.substring(0, propertyName.lastIndexOf("."));
          var propName = propertyName.substring(propertyName.lastIndexOf(".") + 1, size);
          var topLevelPageRef = clientcache.find(pageRef).getTopLevelPage().getReference();
          if (clientcache.find(topLevelPageRef + pageName) != null)
            clientcache.find(topLevelPageRef + pageName).put(propName, srcValue);
        } else {
          clientcache.find(pageRef).getTopLevelPage().put(propertyName.substring(1, propertyName.length), srcValue);
        }
      }
    }




    if (IsClearSelection) {
      var eleNameObj = document.getElementsByName(propEntryHandle);
      if (eleNameObj != null && eleNameObj.length > 0) {
        for (var i = 0; i < eleNameObj.length; i++) {
          if (eleNameObj[i].type == 'radio') {
            eleNameObj[i].checked = false;
          } else if (eleNameObj[i].type == 'hidden') {
            eleNameObj[i].value = "";
          }
        }
      }
    }


  } else {    /*code to do property mapping in online mode and clear selection logic*/


    var params = new SafeURL();
    var tableParams = new SafeURL();

    if (pega.ctx.survey.questionParams != null && pega.ctx.survey.questionParams['QuestionName']) {

      params.put('QuestionName', pega.ctx.survey.questionParams['QuestionName']);
    }

    if (pega.ctx.survey.questionPageParams != null && pega.ctx.survey.questionPageParams['QuestionPageName']) {

      params.put('QuestionPageName', pega.ctx.survey.questionPageParams['QuestionPageName']);
      if (pega.ctx.survey.questionPageParams['QuestionName']) {
        params.put('QuestionName', pega.ctx.survey.questionPageParams['QuestionName']);
      }
    }

    if ((QuestionMode === 'Freeform' || QuestionMode === 'Check Boxes' || QuestionMode === 'Radio Buttons' || QuestionMode === 'MultiSlider')) {
      if (questionPageName == null || pageRef.indexOf("pyQuestionGroup") !== -1) {
        questionPageName = pageRef.substring("pyQuestionGroup(".length + pageRef.indexOf("pyQuestionGroup"), pageRef.length);
        questionPageName = questionPageName.substring(0, questionPageName.indexOf(")"));
      }
    }

    if (pageRef) {
      params.put('QuestionPgRef', pageRef);
    }
    if (questionName) {
      params.put('QuestionName', questionName);
    }
    if (propertyName) {
      params.put('PropertyName', propertyName);
    }
    if (QuestionMode) {
      params.put('QuestionMode', QuestionMode);
    }
    if (Score) {
      params.put('Score', Score);
    }
    if (questionPageName) {
      params.put('QuestionPageName', questionPageName);
    }
    if (tablePropName) {
      tableParams.put('tablePropName', tablePropName);
    }
    var isRefreshQuestion = isRefreshQ(questionName, questionPageName);


    //call simple radio specific function
    if (IsClearSelection) {
      params.put('IsClearSelection', IsClearSelection);
      var ansReferance = pageRef + ".pyAnswer";
      answerRefObj = evt;
      answerRefObj.name = pega.ui.property.toHandle(ansReferance);
      var sectionName="";
      var topLevelPageName="";
      if(pega.ctx.survey.questionPageParams==null)
        {
          sectionName=pega.ctx.survey.questionParams['sectionName'];
          topLevelPageName=pega.ctx.survey.questionParams['topLevelPageName'];
        }
      else if(pega.ctx.survey.questionParams==null)
        {
          sectionName=pega.ctx.survey.questionPageParams['sectionName'];
          topLevelPageName=pega.ctx.survey.questionPageParams['topLevelPageName'];
        }
      clearSelection(answerRefObj,pageRef,isRefreshQuestion,sectionName,topLevelPageName,params.toQueryString(),'pyRefreshSurvey',evt);
    } else if ('radio' == QuestionMode) {

      if (evt.srcElement) {
        answerRefObj = evt.srcElement;
      }
      else {
        //answerRefObj =answerRefObj.target;
        answerRefObj = pega.util.Event.getTarget(evt);
      }
      if (answerRefObj) {
        var eleNameObj = pega.ctx.dom.getElementsByName(answerRefObj.name);
        if (eleNameObj != null && eleNameObj.length > 0) {
          for (var i = 0; i < eleNameObj.length; i++) {
            if (eleNameObj[i].type == 'hidden') {
              eleNameObj[i].value = answerRefObj.value;
            }
          }
        }
      }
    }

    //call checkbox specific function
    if ('Check Boxes' == QuestionMode) {

      SelectUnselectCheckbox(answerRefObj, pageRef, isRefreshQuestion, pega.ctx.survey.questionPageParams['sectionName'], pega.ctx.survey.questionPageParams['topLevelPageName'], params.toQueryString(), 'pyRefreshSurvey', evt);
    } else if ('UltiTable' == QuestionMode) {

      var postData = new SafeURL();
      var strUrlSF = SafeURL_createFromURL(pega.ctx.url);

      strUrlSF.put("pyActivity", "pzSetPropertyMappingForUT");
      if (isRefreshQuestion) {
        strUrlSF.put("isRefreshQuestion", isRefreshQuestion);
      }
      strUrlSF.put("pzPrimaryPageName", pageRef);
      if (tablePropName) {
        strUrlSF.put("tablePropName", tablePropName);
      }
      pega.u.d.processOnBeforeSubmit(false, pega.u.d.getSectionDiv(pega.util.Event.getTarget(evt)));
      postData = pega.u.d.getQueryString(pega.u.d.getSectionDiv(pega.util.Event.getTarget(evt)), false, true);

      var tabletypecallback = {
        success: function (response) {
          if (response.responseText == "true") {

            refreshSection(pega.ctx.survey.questionPageParams['sectionName'], pega.ctx.survey.questionPageParams['topLevelPageName'], '', tableParams.toQueryString(), 'pyRefreshSurvey', evt);
          }
        }
      };
pega.u.d.convertToRunActivityAction(strUrlSF);
      pega.u.d.asyncRequest('POST', strUrlSF, tabletypecallback, postData);
    } else {

     if(!IsClearSelection){
             var postData = new SafeURL();
 	           var strUrlSF = SafeURL_createFromURL(pega.u.d.url);
  
  	        strUrlSF.put("pyActivity", "pzSetAnswerToProperty");
            if(isRefreshQuestion){    
 	          	strUrlSF.put("isRefreshQuestion",isRefreshQuestion);
            }
  	  	    strUrlSF.put("pzPrimaryPageName",pageRef);
 	  	      pega.u.d.processOnBeforeSubmit(false,pega.u.d.getSectionDiv(pega.util.Event.getTarget(evt)));
            postData = pega.u.d.getQueryString(pega.u.d.getSectionDiv(pega.util.Event.getTarget(evt)), false, true);
  
  		      var callback = {
              success: function(response) {
                if (response.responseText=="true" && questionPageName) {     
                  
                  refreshSection(pega.ctx.survey.questionPageParams['sectionName'], pega.ctx.survey.questionPageParams['topLevelPageName'], '', params.toQueryString(), 'pyRefreshSurvey', evt);
                 				
                }
            }
  		};
  pega.u.d.convertToRunActivityAction(strUrlSF);
  		pega.u.d.asyncRequest('POST', strUrlSF, callback, postData);
        }
    }
  }
}

function refreshComplexCBQuestion(questionName, propertyName, questionPageName, pageRef, QuestionMode, Score, IsClearSelection, answerRefObj, ChkType, evt) {
  var params = new SafeURL();
  if (questionPageName == null || pageRef.indexOf("pyQuestionGroup") != -1) {
    questionPageName = pageRef.substring("pyQuestionGroup(".length + pageRef.indexOf("pyQuestionGroup"), pageRef.length);
    questionPageName = questionPageName.substring(0, questionPageName.indexOf(")"));
  }

  if (questionPageName) {
    params.put('QuestionPageName', questionPageName);
  }

  /* populate section params */
  populateRefreshParams(params, pega.ctx.survey.questionPageParams['sectionName'], evt);


  var isRefreshQuestion = isRefreshQ(questionName, questionPageName);

  if (isRefreshQuestion) {

    refreshSection(pega.ctx.survey.questionPageParams['sectionName'], pega.ctx.survey.questionPageParams['topLevelPageName'], '', params.toQueryString(), 'pyRefreshSurvey', evt);
  }
}
//static-content-hash-trigger-YUI