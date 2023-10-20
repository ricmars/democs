pega.namespace("pega.ui.jittemplate");
$.extend(pega.ui.jittemplate, (function () {

  // private vars
  var bOkToCall = true;
  var oQueue;
                               
  // private functions
                               
                               
  return {
    
    /*
     * Get a list of ui component definitions, by scanning through the templates.
     * Some of the template names need to be mapped to a ui component definition.
     */
    getComponentList: function(templates, arCompList, bCell) {
     
     if (arCompList == null) {
       arCompList = new Array();
     }
     
     for (index in templates) {
       var template = templates[index];
       var oComp = new Object();
       oComp.name = template.pyName;
       oComp.type = "Layout";
       if (bCell) {
         oComp.type = "Control";
       }
       
       switch (oComp.name) {
         case "pxSection":
         case "pxApplication":
         case "pxCaseType":
         case "pxFlowAction":
         case "pxHarness":
         case "pxNavigation":
         case "pxParagraph":
         case "pxPortal":
           oComp.type = "Rule";
           break;
         case "Harness":
           oComp.name = "pxHarness";
           oComp.type = "Rule";
           break;
         case "pxLayoutHeader":
         case "pxLayoutContainer":
           oComp.name = "pxLayoutGroup";
           break;
         case "DynamicLayout":
           oComp.name = "pxDynamicLayout";
           oComp.type = "Layout";
           break;
         case "DynamicLayoutCell":
           oComp.name = "pxDynamicLayoutCell";
           oComp.type = "Layout";
           break;
         case "pxVisible":
           oComp.name = "pxHidden";
           oComp.type = "Control";
           break;
         case "pxButton" :
         case "pxIcon":
         case "pxHidden":
           oComp.type = "Control";
           break;
         case "pxMenu":
           oComp.name = "pxMenu";
           oComp.type = "Control";
           break;
         case "Form":
           oComp.name = "pxFreeForm";
           oComp.type = "Layout";
           break;
         case "pxHarnessContent":
           oComp.name = "pxHarness";
           oComp.type = "Rule";
           break;
         case "pxNonTemplate":
           oComp.name ="pxContainer";
           oComp.type = "Layout";
           break;
         case "pyDirtyCheckConfirm":
         case "pxWorkArea":
         case "pxWorkAreaHeader":
         case "pxWorkAreaContent":
           oComp.name = "pxHarness";
           oComp.type = "Rule";
           break;
         case "Dummy":
            oComp.name = "";
            oComp.type = "";
            break;
           
       }
       
       if (oComp.name != "") {
         // this is a filter, to check if the object is already in the array (ES5)
         if (arCompList.findIndex(function(comp) { return comp.name === oComp.name && comp.type === oComp.type; }) < 0) {
           arCompList.push(oComp);
         }
       }
       
       // call child templates recursively
       if (template.pyTemplates) {
         arCompList = this.getComponentList(template.pyTemplates, arCompList, template.pyCell ? true : false);
       }
       
     }
     
     return arCompList;
     
    },
    
    
    /*
     * Override templateEngine function mergeSectionStore to call jit loader when using dynamically loaded js
     * When TemplateEngine is not availabe, it needs to be dynamically loaded.  So store parameters in a 
     * queue that will be used later, after TemplateEngine is loaded.
     */
    mergeSectionStore: function(sectionMap) {
      if (pega.ui.TemplateEngine) {
        pega.ui.TemplateEngine.mergeSectionStore(sectionMap);
      }
      else {
        bOkToCall = false;
        oQueue = new Object();
        
        var arParams = new Array();
        arParams.push(sectionMap);
        
        oQueue["mergeSectionStore"] = arParams;
      }
      
    },
    
    
    /*
     * Override templateEngine function mergeBigData to call jit loader when using dynamically loaded js
     * When TemplateEngine is not availabe, it needs to be dynamically loaded.  So store parameters in a 
     * queue that will be used later, after TemplateEngine is loaded.
     */
    mergeBigData: function(bigDataObject, thread) {
      if (pega.ui.TemplateEngine && bOkToCall) {
        pega.ui.TemplateEngine.mergeBigData(bigDataObject, thread);
      
      }
      else {   
        var arParams = new Array();
        arParams.push(bigDataObject);
        arParams.push(thread);
        
        oQueue["mergeBigData"] = arParams; 
      }
    
    },
    
    /*
     * Override templateEngine function addMetadataTree to call jit loader when using dynamically loaded js
     * When TemplateEngine is not availabe, it needs to be dynamically loaded.  So store parameters in a 
     * queue that will be used later, after TemplateEngine is loaded.
     */
    addMetadataTree: function(obj) {
      if (pega.ui.TemplateEngine && bOkToCall) {
        pega.ui.TemplateEngine.addMetadataTree(obj);
      }
      else {        
        var arParams = new Array();
        arParams.push(obj);
        
        oQueue["addMetadataTree"] = arParams;
      }
      
    },
    

    /*
     * Override templateEngine function renderUI to call jit loader when using dynamically loaded js
     * When TemplateEngine is not availabe, it needs to be dynamically loaded.  So store parameters in a 
     * queue that will be used later, after TemplateEngine is loaded.
     */    
    renderUI: function() {
      if (pega.ui.TemplateEngine && bOkToCall) {
        pega.ui.TemplateEngine.renderUI();
       
      }
      else {
        oQueue["renderUI"] = new Array();
        
        // trigger jit loader
        this.doJITLoading();
      }
      
    },
    
    
    /*
     * This funciton will JIT load the component pxTemplateBase that will contain TemplateEngine as a dependency
     * When finished, call handleTemplateEngineLoads.
     */
    doJITLoading: function() {
      if (pega.ui.JitJLoader) {
        pega.ui.JitJLoader.loadComponent("Layout", "pxTemplateBase", null, "render", 
          function(error, category, componentName, feature) {
            // handle success or fail
                  if (error != null) {
                    console.error(error);
                  }
                  else {
                    this.handleTemplateEngineLoads();
                  }
          }.bind(this));        
      }
      
    },
    
    
    /*
     * This function will inline call all the TemplateEngine functions that should have been called if TemplateEngine was present
     * Each function call will dequeue its parameters and pass them to the function.
     */
    handleTemplateEngineLoads: function() {
      pega.ui.TemplateEngine.mergeSectionStore(oQueue["mergeSectionStore"][0]);
      pega.ui.TemplateEngine.mergeBigData(oQueue["mergeBigData"][0], oQueue["mergeBigData"][1]);
      pega.ui.TemplateEngine.addMetadataTree(oQueue["addMetadataTree"][0]);
      pega.ui.TemplateEngine.renderUI();
      
    },
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    // PUBLIC API
    doRenderTemplate: function() {

      debugger;
      // all these functions are declared via java generation
      try {
        console.log("jittemplate.mergeSectionStore");
        this.mergeSectionStore().call(this);
      }
      catch(ex) {}
      try {
        console.log("jittemplate.mergeBigData");
        this.mergeBigData().call(this);
      }
      catch(ex) {}
      try {
        console.log("jittemplate.addMetadataTree");
        this.addMetadataTree().call(this);
      }
      catch(ex) { debugger; }
      try {
        console.log("jittemplate.renderUI");
        this.renderUI().call(this);
      }
      catch (ex) { debugger; }     
    },

    renderTemplate: function() {
      console.log("jittemplate.renderTemplate");
      debugger;
      // if we have the jit j loader, it should be called to load templateBase (template engine, etc) first
      if (pega.ui.JitJLoader) {
        pega.ui.JitJLoader.loadComponent("Layout", "pxTemplateBase", null, "render", 
          function(error, category, componentName, feature) {
            // handle success or fail
                  if (error != null) {
                    console.error(error);
                  }
                  else {
                    this.doRenderTemplate().call(this);
                  }
          })
      }
      else {
        this.doRenderTemplate().call(this);
      }       
    }
    
    
  }
  
})());
//static-content-hash-trigger-NON