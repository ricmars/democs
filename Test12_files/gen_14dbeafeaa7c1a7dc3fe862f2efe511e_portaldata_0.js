﻿  var DesktopUserSessionInfo_gStrOperatorId = "marsr"; var DesktopUserSessionInfo_gStrUserName = "Marsot%2C+Richard"; var DesktopUserSessionInfo_gStrCurrentWorkPool = "PegaCA-Work"; var gLayoutType = "classic"; var gOverridePreferences = "false"; var gPersonalRuleSetName = "marsr@"; var gWelcomeHTML = "WelcomeScreen";    var gPortalWarnDirty=true;   var gPDNQueryURI="https://pdn.pega.com/products/pega-876"; var gCurrentAccessGroup="CSSSATesting"; var gRecoverPreferences = "false"; var gToolsSpaceExists = false; var gRulesSpaceExists = false; var DesktopUserSessionInfo_isAccessible = false;    var gIsMultiTenantPortal = false;     var gIsCustomTabHeaderEnabled = true;      var gIsPegaDeveloper = true;           var DesktopUserSessionInfo_gRedirectOnTimeout = false;   var gAccessGroupList="CSStaging,PRPC:Administrators,CSSSATesting,SAStaging,KMStaging,PegaCallStaging,"; gAccessGroupList=gAccessGroupList.substring(0,gAccessGroupList.length-1); gAccessGroupList=gAccessGroupList.split(","); var gWorkPoolList="PegaCA-Work,PegaCA-Work-Interaction,PegaCA-Work-QualityReview,PegaCA-Work-Service,"; gWorkPoolList=gWorkPoolList.substring(0,gWorkPoolList.length-1); gWorkPoolList=gWorkPoolList.split(","); var gApplicationRuleSetsList="PegaCS-Cases_Branch_INC-A10057,Pega-EndUserUI_Branch_SSAReporting,Pega-Reporting_Branch_INC-A14040,Pega-Reporting_Branch_SSAReporting,Pega-Gadgets_Branch_RTEA11y,Pega-Gadgets_Branch_SSAReporting,Pega-UIEngine_Branch_INC-A14040,Pega-UIEngine_Branch_GridA11yFixes,Pega-UIEngine_Branch_SSAGrid,Pega-UIEngine_Branch_RTEA11y,Pega-UIEngine_Branch_SSAReporting,Staging,VoiceAIOutcome,PegaCS-UXComponent,CPM,RM_Util_HFIX,CS-DevGov-PatchRelease,PegaApplicationDeveloper,TC_Interaction,PegaCS-WebChatbot,AgileStudio-Integration,PegaCRM-RMOperations,CustomerService-TestSuite,PegaCS-Sample,SAPlus,PegaMKT-Advisor-Sample,CustomerService-HealthCheck,PegaCS-Operations,PegaCS-Unit,PegaCS-Reporting,PegaCS-Cases,PegaCS-Config,PegaCS-Config-Common,PegaCS-Guardrails,PegaCS-Integration,PegaCS-DataTier,PegaCS-Localization,PegaCS-Collections,PegaCS-IVR-IVA,PegaCS-BotAgent,CustomerService-Dialog,SAForCS,PegaCS-SuggestedReplies,PegaCS-ApplicationGuides,PegaCS-IVA,PegaCS-IVR,PegaCS-IVRCDH,PegaCS-WFI,PegaCS-Advisor,PegaCS-AdvisorReporting,CPM-Reports,PegaCS-Specialization,PegaAppCA,PegaApp,VoiceAICS,PegaFW-Social,PegaFW-Chat,PegaFW-CTI,PegaFW-ChannelServices,PegaFW-NPS,SA-Config,SA-Artifacts,SA-LocalCampaigns,PegaCRM-SFA,PegaCRM,PegaFW-LandingPages,PegaFW-Gadgets,PegaFW-CED,PegaCS-Infrastructure,Pega-LP_CPM,Pega-Chat,Pega-CTI,Pega-ChannelServices,PegaCRM-Specialization,PegaCRM-Base,PegaCRM-CompareUI,PegaCRM-WFI,PegaKMTSParagraphs,PegaKM,PegaKMDiagnostics,ProfanityCheck,KMReports,PegaKMToggles,PegaCRMFW-GoogleAPI,PegaFW-Gmail,PegaMKT-Advisor,PegaMKT-Integration,PegaFW-NewsFeed,Data-Visualization,VoiceAI,VoiceAIDataSet,UI-Kit-7,Pega-DecisionManager,PegaCRM-PDFJs,ExchangeCosmosUI,PegaCRMFW-ExchangeImpl,PegaFW-EWSIntegration,PegaFW-Outlook,PowerBI,Common,Common-Cases,Common-DataTier,Common-Config,Common-DesignPatterns,Common-Utils,Pega-ProcessCommander,Pega-DeploymentDefaults,Pega-DecisionSimulation,Pega-DecisionScience,Pega-DecisionArchitect,Pega-LP-Mobile,Pega-LP-ProcessAndRules,Pega-LP-Integration,Pega-LP-Reports,Pega-LP-SystemSettings,Pega-LP-UserInterface,Pega-LP-OrgAndSecurity,Pega-LP-DataModel,Pega-LP-Application,Pega-LP,Pega-SystemOperations,Pega-UpdateManager,Pega-SecurityVA,Pega-Feedback,Pega-HealthCheck,Pega-AutoTest,Pega-AppDefinition,Pega-ImportExport,Pega-LocalizationTools,Pega-RuleRefactoring,Pega-ProcessArchitect,Pega-Portlet,Pega-Content,Pega-BigData,Pega-NLP,Pega-DecisionEngine,Pega-IntegrationArchitect,Pega-SystemArchitect,Pega-Desktop,Pega-EndUserUI,Pega-Survey,Pega-Social,Pega-SharedData,Pega-API,Pega-EventProcessing,Pega-Reporting,Pega-UIDesign,Pega-Gadgets,Pega-UIComponents,Pega-UIEngine,Pega-ProcessEngine,Pega-SearchEngine,Pega-IntegrationEngine,Pega-RulesEngine,Pega-Engine,PegaLegacyRules,Pega-ProCom,Pega-IntSvcs,Pega-WB,Pega-RULES,"; gApplicationRuleSetsList=gApplicationRuleSetsList.substring(0,gApplicationRuleSetsList.length-1); gApplicationRuleSetsList=gApplicationRuleSetsList.split(","); var localeDirection = "ltr"; var gProjectManagementEnabled = false; var gPegaAgileEnabled = false; var gFeaturesEnabled = false;      gFeaturesEnabled = true;         function getWindowName(){ winName = window.name; return winName; } function setWindowName(strName) { if (strName == null || strName == "") strName = pega.ui.HarnessContextMap.getCurrentHarnessContext().getProperty('gStrWinNameDefault'); window.name = strName; }  function setUpWindowName() { var harnessContext = pega.ui.HarnessContextMap.getCurrentHarnessContext(), gStrWindowName = harnessContext.getProperty('gStrWindowName'); var clientWindowName = getWindowName();  if (typeof(gStrWindowName) != "undefined") { window.windowName = gStrWindowName; } if ((windowName != "") && (windowName != clientWindowName)) { if(!window.localStorage){ setWindowName(clientWindowName); var arguments = new Array(); arguments[0]="current"; arguments[1]="@baseclass"; arguments[2]="pzMultipleWindowWarning"; arguments[3]=""; arguments[4]=""; arguments[5]="pyDisplayHarness"; arguments[6]="yes"; arguments[7]=""; arguments[8]="No"; arguments[9]=""; arguments[10]=null; arguments[11]=""; arguments[12]=""; arguments[13]=""; pega.d.showHarnessWrapper.apply(pega.d, arguments); } } else { setWindowName(clientWindowName); } }