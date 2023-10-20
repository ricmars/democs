/*
* pzpega_mobile.js
* Defines pega.mobile namespace and all the basic flags and API's that are useful to check for different mobile client that are supported in pega
*/

(function(p) {
	p.mobile = p.mobile || {};
	p.m = p.mobile;

	// utility properties
	p.m.isNativeSDK = (navigator.userAgent.toLowerCase().indexOf('pegamobilesdk') !== -1);
	p.m.isHybridClient = (navigator.userAgent.toLowerCase().indexOf('ampwebcontrol') !== -1);
	p.m.isPegaElectronContainer = (navigator.userAgent.toLowerCase().indexOf('pegaelectroncontainer') !== -1);
	p.m.isPegaMobileClient = (navigator.userAgent.toLowerCase().indexOf('pegamobile') !== -1);
	p.m.isOfflineBrowser = pega.offline && pega.offline.browser ? true : false;
	p.m.isHybrid = (p.m.isNativeSDK || p.m.isHybridClient || p.m.isPegaElectronContainer || p.m.isOfflineBrowser || p.m.isPegaMobileClient);

	if (p.m.isPegaMobileClient && typeof pmcRuntimeFeatures === "undefined") {
		console.warn("pmcRuntimeFeatures is undefined in Pega Mobile Client. This shouldn't be the case.");
	} else if (p.m.isPegaMobileClient && pmcRuntimeFeatures !== "undefined") {
		p.m.isParentWebView = typeof pmcPortalConfiguration !== "undefined";
		p.m.isChildWebView = typeof pmcPortalConfiguration === "undefined";

		p.m.isSingleWebViewPegaMobileClient = !pmcRuntimeFeatures.pxUsesMultiWebView;
		p.m.isSingleWebViewOfflinePegaMobileClient = pmcRuntimeFeatures.pxUsesOffline === "true" && !pmcRuntimeFeatures.pxUsesMultiWebView;

		p.m.isMultiWebViewPegaMobileClient = pmcRuntimeFeatures.pxUsesMultiWebView === "true";
		p.m.isMultiWebViewOfflinePegaMobileClient = pmcRuntimeFeatures.pxUsesOffline === "true" && pmcRuntimeFeatures.pxUsesMultiWebView === "true";
	}
})(pega);
  //static-content-hash-trigger-GCC