

function deferredFieldValues() {
      pega.u.d.Locale = "en_US";  
      pega.u.d.TimeZone = "America/New_York"; 
      pega.u.d.serverTimeZone = "Asia/Kolkata"; 
      pega.u.d.inStandardsMode = true;
        
  pega.u.d.fieldValuesList = new Hashtable();
  pega.u.d.fieldValuesList.put("DeleteTab",'Press Delete to close the current tab');
  pega.u.d.fieldValuesList.put("Continue_work_Warning",'Continuing will replace your work in progress.');
pega.u.d.fieldValuesList.put("Wish_to_Continue",'Do you wish to continue?');
pega.u.d.fieldValuesList.put("ApplyFilter",'Apply');
pega.u.d.fieldValuesList.put("Please_select_a_row",'Please select a row');
pega.u.d.fieldValuesList.put("CancelFilter",'Cancel');
pega.u.d.fieldValuesList.put("enterToExpand",'press enter to expand row');
pega.u.d.fieldValuesList.put("enterToCollapse",'press enter to collapse row');
pega.u.d.fieldValuesList.put("CollapseNodeTitle",'Collapse to hide child rows');
pega.u.d.fieldValuesList.put("ExpandNodeTitle",'Expand to show child rows');
pega.u.d.fieldValuesList.put("LiveUI",'Live UI');
pega.u.d.fieldValuesList.put("Configure this view",'Configure this view');
pega.u.d.fieldValuesList.put("Edit this",'Edit this');
pega.u.d.fieldValuesList.put("Get more info",'Get more info');
pega.u.d.fieldValuesList.put("Execute and discard changes",'Your unsaved changes will be lost. Do you still want to execute?');
pega.u.d.fieldValuesList.put("Grouped",'Grouped');
pega.u.d.fieldValuesList.put("ToggleAncestors",'Click to toggle immediate ancestors');
pega.u.d.fieldValuesList.put("OpenInDevStudio",'Open in Dev Studio');
pega.u.d.fieldValuesList.put("OpenPropPanel",'Open property panel');
pega.u.d.fieldValuesList.put("QuickInfoPanel",'Display info panel for this item');
pega.u.d.fieldValuesList.put("ActionsMenu",'See available actions');
pega.u.d.fieldValuesList.put("CreateInDevStudio",'Create in Dev Studio');
pega.u.d.fieldValuesList.put("No editable items on the page.",'No editable items on the page.');

pega.u.d.fieldValuesList.put("FeatureOnlyAvailableOnMobileApp",'This is only available in a mobile app.');
pega.u.d.fieldValuesList.put("ScanOnlyAvailableOnMobileApp",'Barcode scanning is only available when in a mobile app.');

pega.u.d.fieldValuesList.put("InvalidOptionaLFlowErrorLabel",'Cannot perform operation. Invalid optional flow configured.');

pega.u.d.fieldValuesList.put("CannotPerformWhenOffline",'Cannot perform this operation when offline.');
pega.u.d.fieldValuesList.put("OfflineApplicationGettingSynchronized",'Cannot perform this operation, either the network is unavailable or the application is being synchronized.');
pega.u.d.fieldValuesList.put("Configurationisnotsupportedinoffline",'Configuration for Ajax request to call $*~ActivityName~*$ activity is not supported in offline');
pega.u.d.fieldValuesList.put("CannotOpenUrlOnMobileApp",'Opening attachments with URL link is not supported in a mobile app.');

pega.u.d.fieldValuesList.put("No data to display",'No data to display');
pega.u.d.fieldValuesList.put("No data to display in the selected range",'No data to display in the selected range');


pega.u.d.fieldValuesList.put("FileSizeExceedsMessageOnMobileApp",'File size exceeds attachment size limit of [0] MB.');
pega.u.d.fieldValuesList.put("FailedToAttachFileNameEmptyLabel",'Failed to attach file. File name is empty.');
pega.u.d.fieldValuesList.put("FailedToAttachCategoryNameEmptyLabel",'Failed to attach file. Category name is empty.');
pega.u.d.fieldValuesList.put("FailedToAttachDuplicateFileNameLabel",'Failed to attach file. Duplicate file name.');
pega.u.d.fieldValuesList.put("FailedToAttachFileLabel",'An error occurred while attaching file.');
pega.u.d.fieldValuesList.put("AttachmentsDisabledForCaseTypeLabel",'Attachments are disabled for this case type.');
pega.u.d.fieldValuesList.put("SignaturesDisabledForCaseTypeLabel",'Signatures are disabled for this case type.');


pega.u.d.fieldValuesList.put("DeleteConfirmationMessage",'Delete attachment forever?');
pega.u.d.fieldValuesList.put("DeletionSuccessMessage",'File deleted successfully');
pega.u.d.fieldValuesList.put("DeletionFailMessage",'File deletion failed. Please try again.');

pega.u.d.fieldValuesList.put("FileAttachedSuccessfullyLabel",'File attached successfully.');
pega.u.d.fieldValuesList.put("NoNetworkConnectionFound",'No network connection found.');
pega.u.d.fieldValuesList.put("OpenPopupWindowFailedLabel",'An attempt to open a popup window failed. A popup blocker may be enabled.');
pega.u.d.fieldValuesList.put("GetDirectionsActionMyLocation",'My Location');
pega.u.d.fieldValuesList.put("GetDirectionsActionCurrentLocation",'Current Location');
pega.u.d.fieldValuesList.put("WebApiNotReady",'The framework is loading, please try again after sometime.');
pega.u.d.fieldValuesList.put("RequestHasBeenSent",'Your request has been sent. Someone will be in contact with you soon about your issue.');
pega.u.d.fieldValuesList.put("RequestSentAsSoonAsReconnect",'Your request will be sent as soon as you reconnect. Someone will be in contact with you soon about your issue.');
pega.u.d.fieldValuesList.put("ErrorSendingRequest",'An error occured when sending your request');
pega.u.d.fieldValuesList.put("OldMenuNotSupportedInHC",'You are attempting to invoke a deprecated menu control which is not supported in the Pega Mobility Cient.  Please contact your system administrator to have this fixed.');

pega.u.d.fieldValuesList.put("CannotLoadItem",'Cannot load item');

pega.u.d.fieldValuesList.put("pzShowUsWhere",'Now, show us where..');
pega.u.d.fieldValuesList.put("pzShowUsWhereDrag",'Drag this target on the screen to show where the issue occurs');
pega.u.d.fieldValuesList.put("pzCaptureBtn_GI",'Capture screen');
pega.u.d.fieldValuesList.put("pzRecorderDlgRestart",'Restart');
pega.u.d.fieldValuesList.put("pzRecorderDlgStop",'Stop');
pega.u.d.fieldValuesList.put("pzRecorderDlgClose",'Close');

pega.u.d.fieldValuesList.put("pzCaptureScreenFailed",'Screen capture failed: You have either cancelled the process or there is a technical issue, try again.');
pega.u.d.fieldValuesList.put("pzRecordVideoFailed",'Screen recording failed: You have either cancelled the process or there is a technical issue, try again.');
pega.u.d.fieldValuesList.put("pzAgileWorkbench",'Agile Workbench');

pega.u.d.fieldValuesList.put("pzInsertApprovalActions",'Insert approval email actions');
pega.u.d.fieldValuesList.put("AjaxRequestFailed",'AJAX request failed. Reason: $*~Reason~*$');


pega.u.d.fieldValuesList.put("pzDownload",'Download');
pega.u.d.fieldValuesList.put("pzExpandPreview",'Expand');
pega.u.d.fieldValuesList.put("pzClose",'close');
pega.u.d.fieldValuesList.put("pzBy",'by');
pega.u.d.fieldValuesList.put("pzImage",'Image');
pega.u.d.fieldValuesList.put("pzVideo",'Video');
pega.u.d.fieldValuesList.put("pzAttachmentNotFound",'The attachment is not available.');
pega.u.d.fieldValuesList.put("pzResNotFound",'No results found');
pega.u.d.fieldValuesList.put("pzReachedEndOfList",'Reached end of the list');
pega.u.d.fieldValuesList.put("pzSuggestionsAvailable",'Suggestions are available. Use up and down arrows to select');
pega.u.d.fieldValuesList.put("pzSearch",'Search');
pega.u.d.fieldValuesList.put("pzRequired",'(Required)');
pega.u.d.fieldValuesList.put("pzMSExitLink",'Exit');
pega.u.d.fieldValuesList.put("pzMSResUse",'Use');
pega.u.d.fieldValuesList.put("pzMusic",'Music');
pega.u.d.fieldValuesList.put("pzPDF",'PDF');
pega.u.d.fieldValuesList.put("pzOfcDoc",'Document');
pega.u.d.fieldValuesList.put("pzOfcExcel",'Excel');
pega.u.d.fieldValuesList.put("pzOfcPPT",'Powerpoint');
pega.u.d.fieldValuesList.put("pzAttachDisplayURLBroken",'It seems URL to display this attachment is broken. Check the gadget configuration.');
pega.u.d.fieldValuesList.put("pzMalConfiguredAttachControl",'This gadget isn\'t configured properly. Try loading this gadget as defer loaded. If issue still persists then contact your system administrator.');
pega.u.d.fieldValuesList.put("pzAttachDownloadURLBroken",'It seems URL to download this attachment is broken. Check the gadget configuration.');
pega.u.d.fieldValuesList.put("pzPreviewPDFNotSupportedOnMobile",'PDF preview  is not supported on mobile browsers. Download the attachment to view.');
pega.u.d.fieldValuesList.put("pzNotPrivilegedToPreview",'You don\'t have privilege to view or download this attachment.');



pega.u.d.fieldValuesList.put("FeedbackCantBeDroppedOnDoing",'You can only mark a Feedback item as To do or Done. Spin it off into a Story or a Bug to start working on it.');
pega.u.d.fieldValuesList.put("DontHavePrivilegeToDrop",'This work item is read only.');
pega.u.d.fieldValuesList.put("CantMoveFromDoneWhenIntegratedWithAS",'You can update this work item only in Agile Studio.');



pega.u.d.fieldValuesList.put("pzHasNoChannelAssociated",'has no channel associated.');



pega.u.d.subscriptError= "subscript is not valid or is already in use.";
pega.u.d.expandCollapseText = "Click to expand/collapse";



      pega.u.d.fieldValuesList.put("CLICK_TO_LOAD_TEXT",'Click here to load');
      
      pega.u.d.fieldValuesList.put("REPLACE_WORKITEM_WARNING",'You are about to close an open work item which has changes that have not been saved.');
      pega.u.d.fieldValuesList.put("PRESS_OK_TO_CONTINUE",'Press OK to continue and lose your changes.');
      pega.u.d.fieldValuesList.put("PRESS_CANCEL_TO_RETURN",'Press Cancel to return to the modified form.');


   /* SE-40825|Few option from delegated decision rule not localized -- start */

 pega.u.d.fieldValuesList.put("Load Table in RuleForm",'Load Table in RuleForm');
 pega.u.d.fieldValuesList.put("Remove Table from RuleForm",'Remove Table from RuleForm');
  pega.u.d.fieldValuesList.put("Load Table Alert Msg",'This decision table contains more than      500    cells.  Loading this decision table into the rule form may take some time.  Would you like to proceed?');
   pega.u.d.fieldValuesList.put("Decision Table Optimal Performance",'This decision table contains more than      500    cells.  For optimal performance, please use Import/Export feature');

  /* SE-40825|Few option from delegated decision rule not localized -- end */

  pega.u.d.fieldValuesList.put("Case Manager",'Case Manager');
pega.u.d.fieldValuesList.put("Case Worker",'Case Worker');
pega.u.d.fieldValuesList.put("Case Default",'Case Default');
pega.u.d.fieldValuesList.put("SwitchPortal",'Switch the display to show');
pega.u.d.fieldValuesList.put("PortalText",'portal?');
pega.u.d.fieldValuesList.put("BackTo",'Back to');
pega.u.d.fieldValuesList.put("Home",'Home');
pega.u.d.fieldValuesList.put("Minimize",'Minimize');

      pega.u.d.fieldValuesList.put("DISCARD_YOUR_UNSAVED_CHANGES",'You are about to discard your unsaved changes.');

    

      pega.u.d.fieldValuesList.put("Chart_NoData_Text",'No data to display');
      pega.u.d.fieldValuesList.put("Chart_ProgressBar_Loading_Text",'Loading');
      pega.u.d.fieldValuesList.put("Chart_XML_Loading_Text",'Loading');
      pega.u.d.fieldValuesList.put("Chart_ParsingData_Text",'Parsing data');
      pega.u.d.fieldValuesList.put("Chart_RenderingError_Text",'Rendering chart');
      pega.u.d.fieldValuesList.put("Chart_LoadData_Error_Text",'Error loading chart data');
      pega.u.d.fieldValuesList.put("Chart_InvalidXML_Text",'Invalid XML');


      pega.u.d.fieldValuesList.put("Error",'error');
      pega.u.d.fieldValuesList.put("Show next error",'Click here to see errors');
      pega.u.d.fieldValuesList.put("Empty Assignment Key",emptyAssignmentKeys);
      pega.u.d.fieldValuesList.put("Empty Work Item ID",emptyWorkId);
      pega.u.d.fieldValuesList.put("Empty Work Item ID",emptyWorkHandle);
      pega.u.d.fieldValuesList.put("Has Been Submitted",hasBeenSubmitted);
      pega.u.d.fieldValuesList.put("Sync To Server",syncToServer);

      pega.u.d.fieldValuesList.put("TabHasErrors",'{1} has errors');
      pega.u.d.fieldValuesList.put("TabErrorTooltip",'Correct all fields containing errors.');


      pega.u.d.fieldValuesList.put("FrameRefreshMsg",'FrameRefreshMsg');
      pega.u.d.fieldValuesList.put("Ok",'OK');

      pega.u.d.isOrientationRTL = function(){return "false" == "true";};

   pega.u.d.fieldValuesList.put("STR_COLLAPSE","Click to collapse this pane.");
      pega.u.d.fieldValuesList.put("STR_EXPAND","Click to expand this pane.");

	  
	  pega.u.d.fieldValuesList.put("Set Property Values",'Set Property Values');
      pega.u.d.fieldValuesList.put("Hide Property Values",'Hide Property Values');

	pega.u.d.fieldValuesList.put("Are you sure you want to exit?",'Are you sure you want to close this application?');


pega.u.d.fieldValuesList.put("pyDiscoverGadgetLayer",'layer');
pega.u.d.fieldValuesList.put("pyAssociationMissing",'Association missing');

  
  pega.u.d.throbberLoadingText = 'Loading Content';
      pega.u.d.throbberLoadingCompletedText = 'Loading Completed';
      pega.u.d.throbberAnnouncementDelay = parseInt('1000') || 1000;

      
      pega.u.d.DisableAutoSeparatorForDate = 

      
      deferredAdditional();

      if(pega.u.d.harnessType && pega.u.d.harnessType == 'layout'){
        pega.u.d.fieldValuesList.put("EXPAND_COLLAPSE_MESSAGE",'Click to expand/collapse');
      }

      pega.u.d.fieldValuesList.put("Cancel",'Cancel');
      pega.u.d.fieldValuesList.put("LeaveBlank",'Leave blank');
      pega.u.d.fieldValuesList.put("Use",'Use');
      pega.u.d.fieldValuesList.put("NoResultsFound",'No results found');
      pega.u.d.fieldValuesList.put("ChooseFromCalendar",'Choose from calendar');
      pega.u.d.fieldValuesList.put("LoadingIndicator",'Loading...');
    }
    
     
    var mdc_createNewWork = 'New';
    var mdc_openWorkItem= 'Work item';
    var mdc_openAssignment = 'Assignment';
    var mdc_getNext = 'Next';
    var mdc_Home = 'Home';

    var gStrExpandAllText = 'Expand all';
    var gStrCollapseAllText = 'Collapse All';
    var gStrClickToExpandText = 'Disclose';
    if (gStrClickToExpandText == "") {
      gStrClickToExpandText = 'Click to expand ';
    }
    var gStrClickToCollapseText = 'Hide';
    if (gStrClickToCollapseText == "") {
      gStrClickToCollapseText = 'Click to collapse ';
    }
    var gStrClickToCloseText = 'Click to close';
   var gStrDuplicateTestIDMsg = 'This element does not have unique selector and cannot be captured.<br/>Please go to your section and generate Test ID from General tab of the element properties.';
   var gStrMarkforassertiontooltip = '"Mark for assertion"';
	  var gStrFeatureNotSupportedInBrowser = "This feature is not available in your browser";
    var gStrBack = 'Back';

    var NoModalInModal = 'Only one modal dialog can be opened at a time.';
    var NotInAction= 'Local actions are available only when you are performing the assignment.';
    var LocalNotInScreen='Local actions cannot be performed on a screen flow';
    var FlowActionNotInAssignment='This flow action is not configured in the assignment';

    var localCorrectErrors='Please correct current errors to perform this action.';
    var strSaveText = "Saving...";
    var strSubmittingText="Submitting...";
    var busyIndText = "";  
 	var strLoadingMsg = 'Loading';


var emptyAssignmentKeys = 'Empty Assignment Key';
var emptyWorkId = 'Empty Work Item ID';
var emptyWorkHandle = 'Empty Work Item Handle';
var hasBeenSubmitted = 'has been submitted.';
var syncToServer = 'The information will be synched to the server when you&#39;re online.';





    
  var date_patterns= ["EEEE, MMMM d, yyyy","yyyyMMdd","MMMM d, yyyy","yyyy-MM-dd","MMMM d, yyyy","MMM d, yyyy","M/d/yy","M/d/yy","M/d/yyyy"];var datetime_patterns= ["EEEE, MMMM d, yyyy","yyyyMMdd","MMMM d, yyyy","yyyy-MM-dd","MMMM d, yyyy","MMM d, yyyy","M/d/yy","M/d/yy","M/d/yyyy","MMM d, yyyy h:mm:ss a","yyyyMMddTHHmmss.SSS z","yyyyMMddTHHmmss.SSS","yyyy-MM-ddTHH:mm:ss","yyyy-MM-ddTHH:mm:ss.SSSZ","EEEE, MMMM d, yyyy h:mm:ss a z","MMM d, yyyy h:mm:ss a","M/d/yy h:mm a","M/d/yy h:mm a","M/d/yyyy h:mm a","MMMM d, yyyy h:mm:ss a z"];var time_patterns= ["h:mm:ss a","h:mm:ss a","HH:mm:ss","HH:mm:ss.SSSZ","HHmmss","h:mm:ss a z","h:mm:ss a z","h:mm:ss a","h:mm a"];var numeric_separator = ",";var decimal_separator = ".";var grouping_separator = ",";var time_patterns_default = ["HH:mm", "h:mm", "HHmm"];time_patterns = time_patterns.concat(time_patterns_default);var amPmStrings =["AM","PM"];var months =["January","February","March","April","May","June","July","August","September","October","November","December"];var weekdays =["","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];var shortWeekdays =["","Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  var date_separator = "/";
    var date_datePos = 2;
    var date_monthPos = 1;
    var date_yearPos = 3;
    

  var date_dateMsgStr = "is not a valid date value";


  

  var time_timeMsgStr = "is not a valid time value";
  var time_use24HourFormat = false;
  var time_MinIntervalMsgStr = "Minutes should be in <<minInterval>> minute interval.";
  var day_disabledWeekendMsgStr = "falls on a weekend.";


  var date_DateTimeMsgStr = "is not a valid date/time value";
  
  var numeric_decimalMsgStr = 'is not valid. Enter a decimal value such as 10.2, 40.005';
  
  var numeric_integerMsgStr = 'is not valid. Enter a number such as 10, 40';
  
 var numeric_doubleMsgStr = 'is not valid. Enter a decimal value such as 10.2, 40.005';

  
var ruleEditValidate_isPosDecimalMsgStr = "Invalid input - reenter a decimal number greater than 0";
var ruleEditValidate_isNonNegativeMsgStr = "Enter a non-negative number";
var ruleEditValidate_isUrgencyValueMsgStr = "Invalid input - enter a number between 0 and 100";
var ruleEditValidate_isValidEmailAddressMsgStr = "Enter a valid email address";
var ruleEditValidate_isValidPhoneNumberMsgStr = "Enter a valid phone number";
var ruleEditValidate_isFutureDateMsgStr = "Enter a valid future date";
var ruleEditValidate_isNotFutureDateMsgStr = "Enter a valid past date";
var ruleEditValidate_isAlphabeticMsgStr = "Enter a valid alphabetic value";
var ruleEditValidate_isAlphaNumericMsgStr = "Enter a valid alphabetic or numeric value";
var ruleEditValidate_invalidFormatMsgStr =  "The value entered is not matching with the format";
var ruleEditValidate_isAlphaNumericSpaceMsgStr = "Enter a valid Alphanumeric or space Value" ;
var form_submitCantProceed = "Please correct flagged fields before submitting the form!";

  

var boolean_truefalseMsgStr = "is not a valid true/false value";

var rte_smartinfo_content = `<strong>Text editor keyboard shortcuts</strong>
<ul>
	<li>Access to&nbsp;Toolbar (Alt + F10)</li>
	<li>Enter input area (Enter)</li>
	<li>Exit input area (Escape, then Tab). For JAWS (Esc 2x)</li>
</ul>`;


  
    
  	
var required_requiredMsgStr = "Value cannot be blank";
	
  

  
    
  	
var required_invalidMsgStr = "Please select a valid value";
	
  




var length_minCharsMsg1 = "The field";
var length_minCharsMsg2 = "should be at least";
var length_minCharsMsg3= "characters long";


var tableAccessibilityInstruction = 'Use shift + tab to access table navigation instructions.';



var filterPanelRangeMsg1 =": This results in an invalid numeric range";
var filterPanelRangeMsg2 =": This results in an invalid Date range";
var filterPanelRangeMsg3 =": Enter value greater than 0";
var emptyValueMsg =": This field cannot be blank";



var errorLabelString = "error";

var rdlNoMoreRecordsToLoad = 'No more records to load';

var allRecordsLoaded = 'all the records are loaded';

var rdlNewRecordsMessage = 'new records are fetched';

var rdlRowNavigationInfo = 'Inside row, press right or left arrow key to navigate  press escape to exit';

var rdlRowViewDetails = 'press enter to move inside row';

var invalidDateValue = 'Date isn\'t valid.';

var length_minCharsMsgFull = 'The field should be at least {1} characters long.';

var date_beforeDateMsgStrFull = 'The field should be earlier than the field {1}.';

var date_afterDateMsgStrFull = 'The field should be later than the field {1}.';

var length_lengthMsgStrFull = 'The field should be {1} characters long.';

var numeric_minMsgStrFull = 'The field should be greater than {1}.';

var numeric_maxMsgStrFull = 'The field should be less than {1}.';

var numeric_lessThanMsgStrFull = 'The field should be less than the field {1}.';

var numeric_lessThanEqualMsgStrFull = 'The field should be less than or equal to the field {1}.';

var numeric_greaterThanEqualMsgStrFull = 'The field should be greater than or equal to the field {1}.';

var numeric_greaterThanMsgStrFull = 'The field should be greater than the field {1}.';

var select_reqSelMsgStrFull = 'The field must have exactly {1} options selected.';

var select_minSelMsgStrFull = 'The field must have a minimum of {1} options selected.';

var select_maxSelMsgStrFull = 'The field must have not have more than {1} options selected.';


var time_timeMsgStrFull = 'The field is not a valid time field';

var time_afterTimeMsgStrFull = 'The field should be later than the field {1}.';

var time_beforeTimeMsgStrFull = 'The field should be earlier than the field {1}.';

var file_FileMsgStrFull = 'Please choose a file of type:';

var phone_phoneMsgStrFull = 'The field is not a valid phone number.';


	pega.DateTimeUtil = {};
pega.DateTimeUtil.Locale = {};
var additional_date_patterns = {};
var additional_datetime_patterns = {};
var additional_time_patterns = {};

pega.DateTimeUtil.Locale.LOCAL_DATE_ARRAY = '["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59"]';
pega.DateTimeUtil.Locale.START_WEEKDAY = "0";
pega.DateTimeUtil.Locale.SHORT_DATE_FORMAT = "M/d/yyyy";
pega.DateTimeUtil.Locale.SHORT_DATE_TIME_FORMAT = "M/d/yyyy h:mm a";
pega.DateTimeUtil.Locale.MONTHS_LONG = "[&quot;January&quot;,&quot;February&quot;,&quot;March&quot;,&quot;April&quot;,&quot;May&quot;,&quot;June&quot;,&quot;July&quot;,&quot;August&quot;,&quot;September&quot;,&quot;October&quot;,&quot;November&quot;,&quot;December&quot;]";
pega.DateTimeUtil.Locale.MONTHS_SHORT = "[&quot;Jan&quot;,&quot;Feb&quot;,&quot;Mar&quot;,&quot;Apr&quot;,&quot;May&quot;,&quot;Jun&quot;,&quot;Jul&quot;,&quot;Aug&quot;,&quot;Sep&quot;,&quot;Oct&quot;,&quot;Nov&quot;,&quot;Dec&quot;]";
pega.DateTimeUtil.Locale.WEEKDAYS_SHORT = "[&quot;Sun&quot;,&quot;Mon&quot;,&quot;Tue&quot;,&quot;Wed&quot;,&quot;Thu&quot;,&quot;Fri&quot;,&quot;Sat&quot;]";
pega.DateTimeUtil.Locale.AMPM_TEXT = "[&quot;AM&quot;,&quot;PM&quot;]";
pega.DateTimeUtil.Locale.TODAY_TEXT = "Today";
pega.DateTimeUtil.Locale.CLOSE_TEXT = "Close";
pega.DateTimeUtil.Locale.CLEAR_TEXT = "Clear";
pega.DateTimeUtil.Locale.APPLY_TEXT = "Apply";



 
pega.DateTimeUtil.SpacerImg = 'webwb/pzspacercal_12860256145.gif!!.gif';
pega.DateTimeUtil.defaultLocale = "en_US";

