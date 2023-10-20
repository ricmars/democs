/** @license React v16.9.0
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';(function(t,q){"object"===typeof exports&&"undefined"!==typeof module?module.exports=q():"function"===typeof define&&define.amd?define(q):t.React=q()})(this,function(){function t(a){for(var b=a.message,c="https://reactjs.org/docs/error-decoder.html?invariant="+b,d=1;d<arguments.length;d++)c+="&args[]="+encodeURIComponent(arguments[d]);a.message="Minified React error #"+b+"; visit "+c+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ";
return a}function q(a,b,c){this.props=a;this.context=b;this.refs=fa;this.updater=c||ha}function ia(){}function O(a,b,c){this.props=a;this.context=b;this.refs=fa;this.updater=c||ha}function ja(a,b,c){var d=void 0,g={},k=null,e=null;if(null!=b)for(d in void 0!==b.ref&&(e=b.ref),void 0!==b.key&&(k=""+b.key),b)ka.call(b,d)&&!la.hasOwnProperty(d)&&(g[d]=b[d]);var l=arguments.length-2;if(1===l)g.children=c;else if(1<l){for(var h=Array(l),f=0;f<l;f++)h[f]=arguments[f+2];g.children=h}if(a&&a.defaultProps)for(d in l=
a.defaultProps,l)void 0===g[d]&&(g[d]=l[d]);return{$$typeof:y,type:a,key:k,ref:e,props:g,_owner:P.current}}function Ba(a,b){return{$$typeof:y,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}function Q(a){return"object"===typeof a&&null!==a&&a.$$typeof===y}function Ca(a){var b={"=":"=0",":":"=2"};return"$"+(""+a).replace(/[=:]/g,function(a){return b[a]})}function ma(a,b,c,d){if(H.length){var g=H.pop();g.result=a;g.keyPrefix=b;g.func=c;g.context=d;g.count=0;return g}return{result:a,keyPrefix:b,
func:c,context:d,count:0}}function na(a){a.result=null;a.keyPrefix=null;a.func=null;a.context=null;a.count=0;10>H.length&&H.push(a)}function R(a,b,c,d){var g=typeof a;if("undefined"===g||"boolean"===g)a=null;var k=!1;if(null===a)k=!0;else switch(g){case "string":case "number":k=!0;break;case "object":switch(a.$$typeof){case y:case Da:k=!0}}if(k)return c(d,a,""===b?"."+S(a,0):b),1;k=0;b=""===b?".":b+":";if(Array.isArray(a))for(var e=0;e<a.length;e++){g=a[e];var l=b+S(g,e);k+=R(g,l,c,d)}else if(null===
a||"object"!==typeof a?l=null:(l=oa&&a[oa]||a["@@iterator"],l="function"===typeof l?l:null),"function"===typeof l)for(a=l.call(a),e=0;!(g=a.next()).done;)g=g.value,l=b+S(g,e++),k+=R(g,l,c,d);else if("object"===g)throw c=""+a,t(Error(31),"[object Object]"===c?"object with keys {"+Object.keys(a).join(", ")+"}":c,"");return k}function T(a,b,c){return null==a?0:R(a,"",b,c)}function S(a,b){return"object"===typeof a&&null!==a&&null!=a.key?Ca(a.key):b.toString(36)}function Ea(a,b,c){a.func.call(a.context,
b,a.count++)}function Fa(a,b,c){var d=a.result,g=a.keyPrefix;a=a.func.call(a.context,b,a.count++);Array.isArray(a)?U(a,d,c,function(a){return a}):null!=a&&(Q(a)&&(a=Ba(a,g+(!a.key||b&&b.key===a.key?"":(""+a.key).replace(pa,"$&/")+"/")+c)),d.push(a))}function U(a,b,c,d,g){var e="";null!=c&&(e=(""+c).replace(pa,"$&/")+"/");b=ma(b,e,d,g);T(a,Fa,b);na(b)}function r(){var a=qa.current;if(null===a)throw t(Error(321));return a}function ra(a,b){var c=a.next;if(c===a)e=null;else{a===e&&(e=c);var d=a.previous;
d.next=c;c.previous=d}a.next=a.previous=null;c=a.callback;d=m;var g=z;m=a.priorityLevel;z=a;try{var k=a.expirationTime<=b;switch(m){case 1:var f=c(k);break;case 2:f=c(k);break;case 3:f=c(k);break;case 4:f=c(k);break;case 5:f=c(k)}}catch(l){throw l;}finally{m=d,z=g}if("function"===typeof f)if(b=a.expirationTime,a.callback=f,null===e)e=a.next=a.previous=a;else{f=null;k=e;do{if(b<=k.expirationTime){f=k;break}k=k.next}while(k!==e);null===f?f=e:f===e&&(e=a);b=f.previous;b.next=f.previous=a;a.next=f;a.previous=
b}}function A(a){if(null!==f&&f.startTime<=a){do{var b=f,c=b.next;if(b===c)f=null;else{f=c;var d=b.previous;d.next=c;c.previous=d}b.next=b.previous=null;sa(b,b.expirationTime)}while(null!==f&&f.startTime<=a)}}function V(a){B=!1;A(a);u||(null!==e?(u=!0,w(W)):null!==f&&C(V,f.startTime-a))}function W(a,b){u=!1;B&&(B=!1,I());A(b);J=!0;try{if(!a)for(;null!==e&&e.expirationTime<=b;)ra(e,b),b=n(),A(b);else if(null!==e){do ra(e,b),b=n(),A(b);while(null!==e&&!K())}if(null!==e)return!0;null!==f&&C(V,f.startTime-
b);return!1}finally{J=!1}}function ta(a){switch(a){case 1:return-1;case 2:return 250;case 5:return 1073741823;case 4:return 1E4;default:return 5E3}}function sa(a,b){if(null===e)e=a.next=a.previous=a;else{var c=null,d=e;do{if(b<d.expirationTime){c=d;break}d=d.next}while(d!==e);null===c?c=e:c===e&&(e=a);b=c.previous;b.next=c.previous=a;a.next=c;a.previous=b}}var h="function"===typeof Symbol&&Symbol.for,y=h?Symbol.for("react.element"):60103,Da=h?Symbol.for("react.portal"):60106,v=h?Symbol.for("react.fragment"):
60107,X=h?Symbol.for("react.strict_mode"):60108,Ga=h?Symbol.for("react.profiler"):60114,Ha=h?Symbol.for("react.provider"):60109,Ia=h?Symbol.for("react.context"):60110,Ja=h?Symbol.for("react.forward_ref"):60112,Ka=h?Symbol.for("react.suspense"):60113,La=h?Symbol.for("react.suspense_list"):60120,Ma=h?Symbol.for("react.memo"):60115,Na=h?Symbol.for("react.lazy"):60116;h&&Symbol.for("react.fundamental");h&&Symbol.for("react.responder");var oa="function"===typeof Symbol&&Symbol.iterator,ua=Object.getOwnPropertySymbols,
Oa=Object.prototype.hasOwnProperty,Pa=Object.prototype.propertyIsEnumerable,L=function(){try{if(!Object.assign)return!1;var a=new String("abc");a[5]="de";if("5"===Object.getOwnPropertyNames(a)[0])return!1;var b={};for(a=0;10>a;a++)b["_"+String.fromCharCode(a)]=a;if("0123456789"!==Object.getOwnPropertyNames(b).map(function(a){return b[a]}).join(""))return!1;var c={};"abcdefghijklmnopqrst".split("").forEach(function(a){c[a]=a});return"abcdefghijklmnopqrst"!==Object.keys(Object.assign({},c)).join("")?
!1:!0}catch(d){return!1}}()?Object.assign:function(a,b){if(null===a||void 0===a)throw new TypeError("Object.assign cannot be called with null or undefined");var c=Object(a);for(var d,g=1;g<arguments.length;g++){var e=Object(arguments[g]);for(var f in e)Oa.call(e,f)&&(c[f]=e[f]);if(ua){d=ua(e);for(var l=0;l<d.length;l++)Pa.call(e,d[l])&&(c[d[l]]=e[d[l]])}}return c},ha={isMounted:function(a){return!1},enqueueForceUpdate:function(a,b,c){},enqueueReplaceState:function(a,b,c,d){},enqueueSetState:function(a,
b,c,d){}},fa={};q.prototype.isReactComponent={};q.prototype.setState=function(a,b){if("object"!==typeof a&&"function"!==typeof a&&null!=a)throw t(Error(85));this.updater.enqueueSetState(this,a,b,"setState")};q.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate")};ia.prototype=q.prototype;h=O.prototype=new ia;h.constructor=O;L(h,q.prototype);h.isPureReactComponent=!0;var qa={current:null},P={current:null},ka=Object.prototype.hasOwnProperty,la={key:!0,ref:!0,__self:!0,
__source:!0},pa=/\/+/g,H=[],w=void 0,C=void 0,I=void 0,K=void 0,n=h=void 0,Y=void 0;if("undefined"===typeof window||"function"!==typeof MessageChannel){var D=null,va=null,wa=function(){if(null!==D)try{var a=n();D(!0,a);D=null}catch(b){throw setTimeout(wa,0),b;}};n=function(){return Date.now()};w=function(a){null!==D?setTimeout(w,0,a):(D=a,setTimeout(wa,0))};C=function(a,b){va=setTimeout(a,b)};I=function(){clearTimeout(va)};K=function(){return!1};h=Y=function(){}}else{var Z=window.performance,Qa=window.Date,
aa=window.setTimeout,xa=window.clearTimeout,ba=window.requestAnimationFrame;h=window.cancelAnimationFrame;"undefined"!==typeof console&&("function"!==typeof ba&&console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"),"function"!==typeof h&&console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"));n="object"===
typeof Z&&"function"===typeof Z.now?function(){return Z.now()}:function(){return Qa.now()};var M=!1,E=null,ca=-1,da=-1,p=33.33,F=-1,x=-1,N=0,ea=!1;K=function(){return n()>=N};h=function(){};Y=function(a){0>a||125<a?console.error("forceFrameRate takes a positive int between 0 and 125, forcing framerates higher than 125 fps is not unsupported"):0<a?(p=Math.floor(1E3/a),ea=!0):(p=33.33,ea=!1)};var za=function(){if(null!==E){var a=n(),b=0<N-a;try{E(b,a)||(E=null)}catch(c){throw ya.postMessage(null),c;
}}},G=new MessageChannel,ya=G.port2;G.port1.onmessage=za;var Aa=function(a){if(null===E)x=F=-1,M=!1;else{M=!0;ba(function(a){xa(ca);Aa(a)});var b=function(){N=n()+p/2;za();ca=aa(b,3*p)};ca=aa(b,3*p);if(-1!==F&&.1<a-F){var c=a-F;!ea&&-1!==x&&c<p&&x<p&&(p=c<x?x:c,8.33>p&&(p=8.33));x=c}F=a;N=a+p;ya.postMessage(null)}};w=function(a){E=a;M||(M=!0,ba(function(a){Aa(a)}))};C=function(a,b){da=aa(function(){a(n())},b)};I=function(){xa(da);da=-1}}var e=null,f=null,z=null,m=3,J=!1,u=!1,B=!1,Ra=0;G={ReactCurrentDispatcher:qa,
ReactCurrentOwner:P,IsSomeRendererActing:{current:!1},assign:L};L(G,{Scheduler:{unstable_ImmediatePriority:1,unstable_UserBlockingPriority:2,unstable_NormalPriority:3,unstable_IdlePriority:5,unstable_LowPriority:4,unstable_runWithPriority:function(a,b){switch(a){case 1:case 2:case 3:case 4:case 5:break;default:a=3}var c=m;m=a;try{return b()}finally{m=c}},unstable_next:function(a){switch(m){case 1:case 2:case 3:var b=3;break;default:b=m}var c=m;m=b;try{return a()}finally{m=c}},unstable_scheduleCallback:function(a,
b,c){var d=n();if("object"===typeof c&&null!==c){var g=c.delay;g="number"===typeof g&&0<g?d+g:d;c="number"===typeof c.timeout?c.timeout:ta(a)}else c=ta(a),g=d;c=g+c;a={callback:b,priorityLevel:a,startTime:g,expirationTime:c,next:null,previous:null};if(g>d){c=g;if(null===f)f=a.next=a.previous=a;else{b=null;var k=f;do{if(c<k.startTime){b=k;break}k=k.next}while(k!==f);null===b?b=f:b===f&&(f=a);c=b.previous;c.next=b.previous=a;a.next=b;a.previous=c}null===e&&f===a&&(B?I():B=!0,C(V,g-d))}else sa(a,c),
u||J||(u=!0,w(W));return a},unstable_cancelCallback:function(a){var b=a.next;if(null!==b){if(a===b)a===e?e=null:a===f&&(f=null);else{a===e?e=b:a===f&&(f=b);var c=a.previous;c.next=b;b.previous=c}a.next=a.previous=null}},unstable_wrapCallback:function(a){var b=m;return function(){var c=m;m=b;try{return a.apply(this,arguments)}finally{m=c}}},unstable_getCurrentPriorityLevel:function(){return m},unstable_shouldYield:function(){var a=n();A(a);return null!==z&&null!==e&&e.startTime<=a&&e.expirationTime<
z.expirationTime||K()},unstable_requestPaint:h,unstable_continueExecution:function(){u||J||(u=!0,w(W))},unstable_pauseExecution:function(){},unstable_getFirstCallbackNode:function(){return e},get unstable_now(){return n},get unstable_forceFrameRate(){return Y}},SchedulerTracing:{get __interactionsRef(){return null},get __subscriberRef(){return null},unstable_clear:function(a){return a()},unstable_getCurrent:function(){return null},unstable_getThreadID:function(){return++Ra},unstable_trace:function(a,
b,c){return c()},unstable_wrap:function(a){return a},unstable_subscribe:function(a){},unstable_unsubscribe:function(a){}}});v={Children:{map:function(a,b,c){if(null==a)return a;var d=[];U(a,d,null,b,c);return d},forEach:function(a,b,c){if(null==a)return a;b=ma(null,null,b,c);T(a,Ea,b);na(b)},count:function(a){return T(a,function(){return null},null)},toArray:function(a){var b=[];U(a,b,null,function(a){return a});return b},only:function(a){if(!Q(a))throw t(Error(143));return a}},createRef:function(){return{current:null}},
Component:q,PureComponent:O,createContext:function(a,b){void 0===b&&(b=null);a={$$typeof:Ia,_calculateChangedBits:b,_currentValue:a,_currentValue2:a,_threadCount:0,Provider:null,Consumer:null};a.Provider={$$typeof:Ha,_context:a};return a.Consumer=a},forwardRef:function(a){return{$$typeof:Ja,render:a}},lazy:function(a){return{$$typeof:Na,_ctor:a,_status:-1,_result:null}},memo:function(a,b){return{$$typeof:Ma,type:a,compare:void 0===b?null:b}},useCallback:function(a,b){return r().useCallback(a,b)},
useContext:function(a,b){return r().useContext(a,b)},useEffect:function(a,b){return r().useEffect(a,b)},useImperativeHandle:function(a,b,c){return r().useImperativeHandle(a,b,c)},useDebugValue:function(a,b){},useLayoutEffect:function(a,b){return r().useLayoutEffect(a,b)},useMemo:function(a,b){return r().useMemo(a,b)},useReducer:function(a,b,c){return r().useReducer(a,b,c)},useRef:function(a){return r().useRef(a)},useState:function(a){return r().useState(a)},Fragment:v,Profiler:Ga,StrictMode:X,Suspense:Ka,
unstable_SuspenseList:La,createElement:ja,cloneElement:function(a,b,c){if(null===a||void 0===a)throw t(Error(267),a);var d=void 0,e=L({},a.props),f=a.key,h=a.ref,l=a._owner;if(null!=b){void 0!==b.ref&&(h=b.ref,l=P.current);void 0!==b.key&&(f=""+b.key);var m=void 0;a.type&&a.type.defaultProps&&(m=a.type.defaultProps);for(d in b)ka.call(b,d)&&!la.hasOwnProperty(d)&&(e[d]=void 0===b[d]&&void 0!==m?m[d]:b[d])}d=arguments.length-2;if(1===d)e.children=c;else if(1<d){m=Array(d);for(var n=0;n<d;n++)m[n]=
arguments[n+2];e.children=m}return{$$typeof:y,type:a.type,key:f,ref:h,props:e,_owner:l}},createFactory:function(a){var b=ja.bind(null,a);b.type=a;return b},isValidElement:Q,version:"16.9.0",unstable_withSuspenseConfig:function(a,b){a()},__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:G};v=(X={default:v},v)||X;return v.default||v});
//static-content-hash-trigger-NON
/** @license React v16.9.0
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/*
 Modernizr 3.0.0pre (Custom Build) | MIT
*/
'use strict';(function(ka,m){"object"===typeof exports&&"undefined"!==typeof module?module.exports=m(require("react")):"function"===typeof define&&define.amd?define(["react"],m):ka.ReactDOM=m(ka.React)})(this,function(ka){function m(a){for(var b=a.message,c="https://reactjs.org/docs/error-decoder.html?invariant="+b,d=1;d<arguments.length;d++)c+="&args[]="+encodeURIComponent(arguments[d]);a.message="Minified React error #"+b+"; visit "+c+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ";
return a}function Ze(){if(jc)for(var a in Xa){var b=Xa[a],c=jc.indexOf(a);if(!(-1<c))throw m(Error(96),a);if(!kc[c]){if(!b.extractEvents)throw m(Error(97),a);kc[c]=b;c=b.eventTypes;for(var d in c){var e=void 0;var f=c[d],g=b,h=d;if(kd.hasOwnProperty(h))throw m(Error(99),h);kd[h]=f;var k=f.phasedRegistrationNames;if(k){for(e in k)k.hasOwnProperty(e)&&$e(k[e],g,h);e=!0}else f.registrationName?($e(f.registrationName,g,h),e=!0):e=!1;if(!e)throw m(Error(98),d,a);}}}}function $e(a,b,c){if(Ya[a])throw m(Error(100),
a);Ya[a]=b;ld[a]=b.eventTypes[c].dependencies}function Uh(a,b,c,d,e,f,g,h,k){ub=!1;lc=null;Vh.apply(Wh,arguments)}function Xh(a,b,c,d,e,f,g,h,k){Uh.apply(this,arguments);if(ub){if(ub){var l=lc;ub=!1;lc=null}else throw m(Error(198));mc||(mc=!0,md=l)}}function af(a,b,c){var d=a.type||"unknown-event";a.currentTarget=bf(c);Xh(d,b,void 0,a);a.currentTarget=null}function Za(a,b){if(null==b)throw m(Error(30));if(null==a)return b;if(Array.isArray(a)){if(Array.isArray(b))return a.push.apply(a,b),a;a.push(b);
return a}return Array.isArray(b)?[a].concat(b):[a,b]}function nd(a,b,c){Array.isArray(a)?a.forEach(b,c):a&&b.call(c,a)}function nc(a){null!==a&&(vb=Za(vb,a));a=vb;vb=null;if(a){nd(a,Yh);if(vb)throw m(Error(95));if(mc)throw a=md,mc=!1,md=null,a;}}function cf(a,b){var c=a.stateNode;if(!c)return null;var d=od(c);if(!d)return null;c=d[b];a:switch(b){case "onClick":case "onClickCapture":case "onDoubleClick":case "onDoubleClickCapture":case "onMouseDown":case "onMouseDownCapture":case "onMouseMove":case "onMouseMoveCapture":case "onMouseUp":case "onMouseUpCapture":(d=
!d.disabled)||(a=a.type,d=!("button"===a||"input"===a||"select"===a||"textarea"===a));a=!d;break a;default:a=!1}if(a)return null;if(c&&"function"!==typeof c)throw m(Error(231),b,typeof c);return c}function oc(a){if(a[la])return a[la];for(;!a[la];)if(a.parentNode)a=a.parentNode;else return null;a=a[la];return 5===a.tag||6===a.tag?a:null}function df(a){a=a[la];return!a||5!==a.tag&&6!==a.tag?null:a}function Ja(a){if(5===a.tag||6===a.tag)return a.stateNode;throw m(Error(33));}function pd(a){return a[pc]||
null}function ma(a){do a=a.return;while(a&&5!==a.tag);return a?a:null}function ef(a,b,c){if(b=cf(a,c.dispatchConfig.phasedRegistrationNames[b]))c._dispatchListeners=Za(c._dispatchListeners,b),c._dispatchInstances=Za(c._dispatchInstances,a)}function Zh(a){if(a&&a.dispatchConfig.phasedRegistrationNames){for(var b=a._targetInst,c=[];b;)c.push(b),b=ma(b);for(b=c.length;0<b--;)ef(c[b],"captured",a);for(b=0;b<c.length;b++)ef(c[b],"bubbled",a)}}function qd(a,b,c){a&&c&&c.dispatchConfig.registrationName&&
(b=cf(a,c.dispatchConfig.registrationName))&&(c._dispatchListeners=Za(c._dispatchListeners,b),c._dispatchInstances=Za(c._dispatchInstances,a))}function $h(a){a&&a.dispatchConfig.registrationName&&qd(a._targetInst,null,a)}function $a(a){nd(a,Zh)}function qc(a,b){var c={};c[a.toLowerCase()]=b.toLowerCase();c["Webkit"+a]="webkit"+b;c["Moz"+a]="moz"+b;return c}function rc(a){if(rd[a])return rd[a];if(!ab[a])return a;var b=ab[a],c;for(c in b)if(b.hasOwnProperty(c)&&c in ff)return rd[a]=b[c];return a}function gf(){if(sc)return sc;
var a,b=sd,c=b.length,d,e="value"in va?va.value:va.textContent,f=e.length;for(a=0;a<c&&b[a]===e[a];a++);var g=c-a;for(d=1;d<=g&&b[c-d]===e[f-d];d++);return sc=e.slice(a,1<d?1-d:void 0)}function tc(){return!0}function uc(){return!1}function Q(a,b,c,d){this.dispatchConfig=a;this._targetInst=b;this.nativeEvent=c;a=this.constructor.Interface;for(var e in a)a.hasOwnProperty(e)&&((b=a[e])?this[e]=b(c):"target"===e?this.target=d:this[e]=c[e]);this.isDefaultPrevented=(null!=c.defaultPrevented?c.defaultPrevented:
!1===c.returnValue)?tc:uc;this.isPropagationStopped=uc;return this}function ai(a,b,c,d){if(this.eventPool.length){var e=this.eventPool.pop();this.call(e,a,b,c,d);return e}return new this(a,b,c,d)}function bi(a){if(!(a instanceof this))throw m(Error(279));a.destructor();10>this.eventPool.length&&this.eventPool.push(a)}function hf(a){a.eventPool=[];a.getPooled=ai;a.release=bi}function jf(a,b){switch(a){case "keyup":return-1!==ci.indexOf(b.keyCode);case "keydown":return 229!==b.keyCode;case "keypress":case "mousedown":case "blur":return!0;
default:return!1}}function kf(a){a=a.detail;return"object"===typeof a&&"data"in a?a.data:null}function di(a,b){switch(a){case "compositionend":return kf(b);case "keypress":if(32!==b.which)return null;lf=!0;return mf;case "textInput":return a=b.data,a===mf&&lf?null:a;default:return null}}function ei(a,b){if(bb)return"compositionend"===a||!td&&jf(a,b)?(a=gf(),sc=sd=va=null,bb=!1,a):null;switch(a){case "paste":return null;case "keypress":if(!(b.ctrlKey||b.altKey||b.metaKey)||b.ctrlKey&&b.altKey){if(b.char&&
1<b.char.length)return b.char;if(b.which)return String.fromCharCode(b.which)}return null;case "compositionend":return nf&&"ko"!==b.locale?null:b.data;default:return null}}function of(a){if(a=pf(a)){if("function"!==typeof ud)throw m(Error(280));var b=od(a.stateNode);ud(a.stateNode,a.type,b)}}function qf(a){cb?db?db.push(a):db=[a]:cb=a}function rf(){if(cb){var a=cb,b=db;db=cb=null;of(a);if(b)for(a=0;a<b.length;a++)of(b[a])}}function vd(){if(null!==cb||null!==db)wd(),rf()}function sf(a){var b=a&&a.nodeName&&
a.nodeName.toLowerCase();return"input"===b?!!fi[a.type]:"textarea"===b?!0:!1}function xd(a){a=a.target||a.srcElement||window;a.correspondingUseElement&&(a=a.correspondingUseElement);return 3===a.nodeType?a.parentNode:a}function tf(a){if(!wa)return!1;a="on"+a;var b=a in document;b||(b=document.createElement("div"),b.setAttribute(a,"return;"),b="function"===typeof b[a]);return b}function uf(a){var b=a.type;return(a=a.nodeName)&&"input"===a.toLowerCase()&&("checkbox"===b||"radio"===b)}function gi(a){var b=
uf(a)?"checked":"value",c=Object.getOwnPropertyDescriptor(a.constructor.prototype,b),d=""+a[b];if(!a.hasOwnProperty(b)&&"undefined"!==typeof c&&"function"===typeof c.get&&"function"===typeof c.set){var e=c.get,f=c.set;Object.defineProperty(a,b,{configurable:!0,get:function(){return e.call(this)},set:function(a){d=""+a;f.call(this,a)}});Object.defineProperty(a,b,{enumerable:c.enumerable});return{getValue:function(){return d},setValue:function(a){d=""+a},stopTracking:function(){a._valueTracker=null;
delete a[b]}}}}function vc(a){a._valueTracker||(a._valueTracker=gi(a))}function vf(a){if(!a)return!1;var b=a._valueTracker;if(!b)return!0;var c=b.getValue();var d="";a&&(d=uf(a)?a.checked?"true":"false":a.value);a=d;return a!==c?(b.setValue(a),!0):!1}function wb(a){if(null===a||"object"!==typeof a)return null;a=wf&&a[wf]||a["@@iterator"];return"function"===typeof a?a:null}function xa(a){if(null==a)return null;if("function"===typeof a)return a.displayName||a.name||null;if("string"===typeof a)return a;
switch(a){case ya:return"Fragment";case eb:return"Portal";case wc:return"Profiler";case xf:return"StrictMode";case xc:return"Suspense";case yd:return"SuspenseList"}if("object"===typeof a)switch(a.$$typeof){case yf:return"Context.Consumer";case zf:return"Context.Provider";case zd:var b=a.render;b=b.displayName||b.name||"";return a.displayName||(""!==b?"ForwardRef("+b+")":"ForwardRef");case Ad:return xa(a.type);case Af:if(a=1===a._status?a._result:null)return xa(a)}return null}function Bd(a){var b=
"";do{a:switch(a.tag){case 3:case 4:case 6:case 7:case 10:case 9:var c="";break a;default:var d=a._debugOwner,e=a._debugSource,f=xa(a.type);c=null;d&&(c=xa(d.type));d=f;f="";e?f=" (at "+e.fileName.replace(hi,"")+":"+e.lineNumber+")":c&&(f=" (created by "+c+")");c="\n    in "+(d||"Unknown")+f}b+=c;a=a.return}while(a);return b}function ii(a){if(Bf.call(Cf,a))return!0;if(Bf.call(Df,a))return!1;if(ji.test(a))return Cf[a]=!0;Df[a]=!0;return!1}function ki(a,b,c,d){if(null!==c&&0===c.type)return!1;switch(typeof b){case "function":case "symbol":return!0;
case "boolean":if(d)return!1;if(null!==c)return!c.acceptsBooleans;a=a.toLowerCase().slice(0,5);return"data-"!==a&&"aria-"!==a;default:return!1}}function li(a,b,c,d){if(null===b||"undefined"===typeof b||ki(a,b,c,d))return!0;if(d)return!1;if(null!==c)switch(c.type){case 3:return!b;case 4:return!1===b;case 5:return isNaN(b);case 6:return isNaN(b)||1>b}return!1}function B(a,b,c,d,e,f){this.acceptsBooleans=2===b||3===b||4===b;this.attributeName=d;this.attributeNamespace=e;this.mustUseProperty=c;this.propertyName=
a;this.type=b;this.sanitizeURL=f}function Cd(a,b,c,d){var e=H.hasOwnProperty(b)?H[b]:null;var f=null!==e?0===e.type:d?!1:!(2<b.length)||"o"!==b[0]&&"O"!==b[0]||"n"!==b[1]&&"N"!==b[1]?!1:!0;f||(li(b,c,e,d)&&(c=null),d||null===e?ii(b)&&(null===c?a.removeAttribute(b):a.setAttribute(b,""+c)):e.mustUseProperty?a[e.propertyName]=null===c?3===e.type?!1:"":c:(b=e.attributeName,d=e.attributeNamespace,null===c?a.removeAttribute(b):(e=e.type,c=3===e||4===e&&!0===c?"":""+c,d?a.setAttributeNS(d,b,c):a.setAttribute(b,
c))))}function za(a){switch(typeof a){case "boolean":case "number":case "object":case "string":case "undefined":return a;default:return""}}function Dd(a,b){var c=b.checked;return K({},b,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=c?c:a._wrapperState.initialChecked})}function Ef(a,b){var c=null==b.defaultValue?"":b.defaultValue,d=null!=b.checked?b.checked:b.defaultChecked;c=za(null!=b.value?b.value:c);a._wrapperState={initialChecked:d,initialValue:c,controlled:"checkbox"===
b.type||"radio"===b.type?null!=b.checked:null!=b.value}}function Ff(a,b){b=b.checked;null!=b&&Cd(a,"checked",b,!1)}function Ed(a,b){Ff(a,b);var c=za(b.value),d=b.type;if(null!=c)if("number"===d){if(0===c&&""===a.value||a.value!=c)a.value=""+c}else a.value!==""+c&&(a.value=""+c);else if("submit"===d||"reset"===d){a.removeAttribute("value");return}b.hasOwnProperty("value")?Fd(a,b.type,c):b.hasOwnProperty("defaultValue")&&Fd(a,b.type,za(b.defaultValue));null==b.checked&&null!=b.defaultChecked&&(a.defaultChecked=
!!b.defaultChecked)}function Gf(a,b,c){if(b.hasOwnProperty("value")||b.hasOwnProperty("defaultValue")){var d=b.type;if(!("submit"!==d&&"reset"!==d||void 0!==b.value&&null!==b.value))return;b=""+a._wrapperState.initialValue;c||b===a.value||(a.value=b);a.defaultValue=b}c=a.name;""!==c&&(a.name="");a.defaultChecked=!a.defaultChecked;a.defaultChecked=!!a._wrapperState.initialChecked;""!==c&&(a.name=c)}function Fd(a,b,c){if("number"!==b||a.ownerDocument.activeElement!==a)null==c?a.defaultValue=""+a._wrapperState.initialValue:
a.defaultValue!==""+c&&(a.defaultValue=""+c)}function Hf(a,b,c){a=Q.getPooled(If.change,a,b,c);a.type="change";qf(c);$a(a);return a}function mi(a){nc(a)}function yc(a){var b=Ja(a);if(vf(b))return a}function ni(a,b){if("change"===a)return b}function Jf(){xb&&(xb.detachEvent("onpropertychange",Kf),yb=xb=null)}function Kf(a){if("value"===a.propertyName&&yc(yb))if(a=Hf(yb,a,xd(a)),Z)nc(a);else{Z=!0;try{Gd(mi,a)}finally{Z=!1,vd()}}}function oi(a,b,c){"focus"===a?(Jf(),xb=b,yb=c,xb.attachEvent("onpropertychange",
Kf)):"blur"===a&&Jf()}function pi(a,b){if("selectionchange"===a||"keyup"===a||"keydown"===a)return yc(yb)}function qi(a,b){if("click"===a)return yc(b)}function ri(a,b){if("input"===a||"change"===a)return yc(b)}function si(a){var b=this.nativeEvent;return b.getModifierState?b.getModifierState(a):(a=ti[a])?!!b[a]:!1}function Hd(a){return si}function Ka(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}function zb(a,b){if(Ka(a,b))return!0;if("object"!==typeof a||null===a||"object"!==typeof b||null===
b)return!1;var c=Object.keys(a),d=Object.keys(b);if(c.length!==d.length)return!1;for(d=0;d<c.length;d++)if(!ui.call(b,c[d])||!Ka(a[c[d]],b[c[d]]))return!1;return!0}function Lf(a,b){return{responder:a,props:b}}function Ab(a){var b=a;if(a.alternate)for(;b.return;)b=b.return;else{if(0!==(b.effectTag&2))return 1;for(;b.return;)if(b=b.return,0!==(b.effectTag&2))return 1}return 3===b.tag?2:3}function Mf(a){if(2!==Ab(a))throw m(Error(188));}function vi(a){var b=a.alternate;if(!b){b=Ab(a);if(3===b)throw m(Error(188));
return 1===b?null:a}for(var c=a,d=b;;){var e=c.return;if(null===e)break;var f=e.alternate;if(null===f){d=e.return;if(null!==d){c=d;continue}break}if(e.child===f.child){for(f=e.child;f;){if(f===c)return Mf(e),a;if(f===d)return Mf(e),b;f=f.sibling}throw m(Error(188));}if(c.return!==d.return)c=e,d=f;else{for(var g=!1,h=e.child;h;){if(h===c){g=!0;c=e;d=f;break}if(h===d){g=!0;d=e;c=f;break}h=h.sibling}if(!g){for(h=f.child;h;){if(h===c){g=!0;c=f;d=e;break}if(h===d){g=!0;d=f;c=e;break}h=h.sibling}if(!g)throw m(Error(189));
}}if(c.alternate!==d)throw m(Error(190));}if(3!==c.tag)throw m(Error(188));return c.stateNode.current===c?a:b}function Nf(a){a=vi(a);if(!a)return null;for(var b=a;;){if(5===b.tag||6===b.tag)return b;if(b.child)b.child.return=b,b=b.child;else{if(b===a)break;for(;!b.sibling;){if(!b.return||b.return===a)return null;b=b.return}b.sibling.return=b.return;b=b.sibling}}return null}function zc(a){var b=a.keyCode;"charCode"in a?(a=a.charCode,0===a&&13===b&&(a=13)):a=b;10===a&&(a=13);return 32<=a||13===a?a:
0}function Of(a){var b=a.targetInst,c=b;do{if(!c){a.ancestors.push(c);break}var d;for(d=c;d.return;)d=d.return;d=3!==d.tag?null:d.stateNode.containerInfo;if(!d)break;a.ancestors.push(c);c=oc(d)}while(c);for(c=0;c<a.ancestors.length;c++){b=a.ancestors[c];var e=xd(a.nativeEvent);d=a.topLevelType;for(var f=a.nativeEvent,g=null,h=0;h<kc.length;h++){var k=kc[h];k&&(k=k.extractEvents(d,b,f,e))&&(g=Za(g,k))}nc(g)}}function v(a,b){Bb(b,a,!1)}function Bb(a,b,c){switch(wi(b)){case 0:var d=xi.bind(null,b,1);
break;case 1:d=yi.bind(null,b,1);break;default:d=Ac.bind(null,b,1)}c?a.addEventListener(b,d,!0):a.addEventListener(b,d,!1)}function xi(a,b,c){Z||wd();var d=Ac,e=Z;Z=!0;try{Pf(d,a,b,c)}finally{(Z=e)||vd()}}function yi(a,b,c){Ac(a,b,c)}function Ac(a,b,c){if(Bc){b=xd(c);b=oc(b);null===b||"number"!==typeof b.tag||2===Ab(b)||(b=null);if(Cc.length){var d=Cc.pop();d.topLevelType=a;d.nativeEvent=c;d.targetInst=b;a=d}else a={topLevelType:a,nativeEvent:c,targetInst:b,ancestors:[]};try{if(c=a,Z)Of(c,void 0);
else{Z=!0;try{Qf(Of,c,void 0)}finally{Z=!1,vd()}}}finally{a.topLevelType=null,a.nativeEvent=null,a.targetInst=null,a.ancestors.length=0,10>Cc.length&&Cc.push(a)}}}function Rf(a){var b=Sf.get(a);void 0===b&&(b=new Set,Sf.set(a,b));return b}function Id(a){a=a||("undefined"!==typeof document?document:void 0);if("undefined"===typeof a)return null;try{return a.activeElement||a.body}catch(b){return a.body}}function Tf(a){for(;a&&a.firstChild;)a=a.firstChild;return a}function Uf(a,b){var c=Tf(a);a=0;for(var d;c;){if(3===
c.nodeType){d=a+c.textContent.length;if(a<=b&&d>=b)return{node:c,offset:b-a};a=d}a:{for(;c;){if(c.nextSibling){c=c.nextSibling;break a}c=c.parentNode}c=void 0}c=Tf(c)}}function Vf(a,b){return a&&b?a===b?!0:a&&3===a.nodeType?!1:b&&3===b.nodeType?Vf(a,b.parentNode):"contains"in a?a.contains(b):a.compareDocumentPosition?!!(a.compareDocumentPosition(b)&16):!1:!1}function Wf(){for(var a=window,b=Id();b instanceof a.HTMLIFrameElement;){try{var c="string"===typeof b.contentWindow.location.href}catch(d){c=
!1}if(c)a=b.contentWindow;else break;b=Id(a.document)}return b}function Jd(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return b&&("input"===b&&("text"===a.type||"search"===a.type||"tel"===a.type||"url"===a.type||"password"===a.type)||"textarea"===b||"true"===a.contentEditable)}function Xf(a,b){var c=b.window===b?b.document:9===b.nodeType?b:b.ownerDocument;if(Kd||null==fb||fb!==Id(c))return null;c=fb;"selectionStart"in c&&Jd(c)?c={start:c.selectionStart,end:c.selectionEnd}:(c=(c.ownerDocument&&
c.ownerDocument.defaultView||window).getSelection(),c={anchorNode:c.anchorNode,anchorOffset:c.anchorOffset,focusNode:c.focusNode,focusOffset:c.focusOffset});return Cb&&zb(Cb,c)?null:(Cb=c,a=Q.getPooled(Yf.select,Ld,a,b),a.type="select",a.target=fb,$a(a),a)}function zi(a){var b="";ka.Children.forEach(a,function(a){null!=a&&(b+=a)});return b}function Md(a,b){a=K({children:void 0},b);if(b=zi(b.children))a.children=b;return a}function gb(a,b,c,d){a=a.options;if(b){b={};for(var e=0;e<c.length;e++)b["$"+
c[e]]=!0;for(c=0;c<a.length;c++)e=b.hasOwnProperty("$"+a[c].value),a[c].selected!==e&&(a[c].selected=e),e&&d&&(a[c].defaultSelected=!0)}else{c=""+za(c);b=null;for(e=0;e<a.length;e++){if(a[e].value===c){a[e].selected=!0;d&&(a[e].defaultSelected=!0);return}null!==b||a[e].disabled||(b=a[e])}null!==b&&(b.selected=!0)}}function Nd(a,b){if(null!=b.dangerouslySetInnerHTML)throw m(Error(91));return K({},b,{value:void 0,defaultValue:void 0,children:""+a._wrapperState.initialValue})}function Zf(a,b){var c=
b.value;if(null==c){c=b.defaultValue;b=b.children;if(null!=b){if(null!=c)throw m(Error(92));if(Array.isArray(b)){if(!(1>=b.length))throw m(Error(93));b=b[0]}c=b}null==c&&(c="")}a._wrapperState={initialValue:za(c)}}function $f(a,b){var c=za(b.value),d=za(b.defaultValue);null!=c&&(c=""+c,c!==a.value&&(a.value=c),null==b.defaultValue&&a.defaultValue!==c&&(a.defaultValue=c));null!=d&&(a.defaultValue=""+d)}function ag(a){switch(a){case "svg":return"http://www.w3.org/2000/svg";case "math":return"http://www.w3.org/1998/Math/MathML";
default:return"http://www.w3.org/1999/xhtml"}}function Od(a,b){return null==a||"http://www.w3.org/1999/xhtml"===a?ag(b):"http://www.w3.org/2000/svg"===a&&"foreignObject"===b?"http://www.w3.org/1999/xhtml":a}function bg(a,b,c){return null==b||"boolean"===typeof b||""===b?"":c||"number"!==typeof b||0===b||Db.hasOwnProperty(a)&&Db[a]?(""+b).trim():b+"px"}function cg(a,b){a=a.style;for(var c in b)if(b.hasOwnProperty(c)){var d=0===c.indexOf("--"),e=bg(c,b[c],d);"float"===c&&(c="cssFloat");d?a.setProperty(c,
e):a[c]=e}}function Pd(a,b){if(b){if(Ai[a]&&(null!=b.children||null!=b.dangerouslySetInnerHTML))throw m(Error(137),a,"");if(null!=b.dangerouslySetInnerHTML){if(null!=b.children)throw m(Error(60));if(!("object"===typeof b.dangerouslySetInnerHTML&&"__html"in b.dangerouslySetInnerHTML))throw m(Error(61));}if(null!=b.style&&"object"!==typeof b.style)throw m(Error(62),"");}}function Qd(a,b){if(-1===a.indexOf("-"))return"string"===typeof b.is;switch(a){case "annotation-xml":case "color-profile":case "font-face":case "font-face-src":case "font-face-uri":case "font-face-format":case "font-face-name":case "missing-glyph":return!1;
default:return!0}}function na(a,b){a=9===a.nodeType||11===a.nodeType?a:a.ownerDocument;var c=Rf(a);b=ld[b];for(var d=0;d<b.length;d++){var e=b[d];if(!c.has(e)){switch(e){case "scroll":Bb(a,"scroll",!0);break;case "focus":case "blur":Bb(a,"focus",!0);Bb(a,"blur",!0);c.add("blur");c.add("focus");break;case "cancel":case "close":tf(e)&&Bb(a,e,!0);break;case "invalid":case "submit":case "reset":break;default:-1===Eb.indexOf(e)&&v(e,a)}c.add(e)}}}function Dc(){}function dg(a,b){switch(a){case "button":case "input":case "select":case "textarea":return!!b.autoFocus}return!1}
function Rd(a,b){return"textarea"===a||"option"===a||"noscript"===a||"string"===typeof b.children||"number"===typeof b.children||"object"===typeof b.dangerouslySetInnerHTML&&null!==b.dangerouslySetInnerHTML&&null!=b.dangerouslySetInnerHTML.__html}function Fb(a){for(;null!=a;a=a.nextSibling){var b=a.nodeType;if(1===b||3===b)break}return a}function w(a,b){0>hb||(a.current=Sd[hb],Sd[hb]=null,hb--)}function D(a,b,c){hb++;Sd[hb]=a.current;a.current=b}function ib(a,b){var c=a.type.contextTypes;if(!c)return Aa;
var d=a.stateNode;if(d&&d.__reactInternalMemoizedUnmaskedChildContext===b)return d.__reactInternalMemoizedMaskedChildContext;var e={},f;for(f in c)e[f]=b[f];d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=b,a.__reactInternalMemoizedMaskedChildContext=e);return e}function G(a){a=a.childContextTypes;return null!==a&&void 0!==a}function Ec(a){w(M,a);w(I,a)}function Td(a){w(M,a);w(I,a)}function eg(a,b,c){if(I.current!==Aa)throw m(Error(168));D(I,b,a);D(M,c,a)}function fg(a,b,c){var d=
a.stateNode;a=b.childContextTypes;if("function"!==typeof d.getChildContext)return c;d=d.getChildContext();for(var e in d)if(!(e in a))throw m(Error(108),xa(b)||"Unknown",e);return K({},c,d)}function Fc(a){var b=a.stateNode;b=b&&b.__reactInternalMemoizedMergedChildContext||Aa;La=I.current;D(I,b,a);D(M,M.current,a);return!0}function gg(a,b,c){var d=a.stateNode;if(!d)throw m(Error(169));c?(b=fg(a,b,La),d.__reactInternalMemoizedMergedChildContext=b,w(M,a),w(I,a),D(I,b,a)):w(M,a);D(M,c,a)}function Ud(){switch(Bi()){case Gc:return 99;
case hg:return 98;case ig:return 97;case jg:return 96;case kg:return 95;default:throw m(Error(332));}}function lg(a){switch(a){case 99:return Gc;case 98:return hg;case 97:return ig;case 96:return jg;case 95:return kg;default:throw m(Error(332));}}function Ma(a,b){a=lg(a);return Ci(a,b)}function Vd(a,b,c){a=lg(a);return Wd(a,b,c)}function Hc(a){null===oa?(oa=[a],Xd=Wd(Gc,mg)):oa.push(a);return ng}function V(){null!==Xd&&og(Xd);mg()}function mg(){if(!Yd&&null!==oa){Yd=!0;var a=0;try{var b=oa;Ma(99,
function(){for(;a<b.length;a++){var c=b[a];do c=c(!0);while(null!==c)}});oa=null}catch(c){throw null!==oa&&(oa=oa.slice(a+1)),Wd(Gc,V),c;}finally{Yd=!1}}}function Zd(a,b){if(1073741823===b)return 99;if(1===b)return 95;a=10*(1073741821-b)-10*(1073741821-a);return 0>=a?99:250>=a?98:5250>=a?97:95}function X(a,b){if(a&&a.defaultProps){b=K({},b);a=a.defaultProps;for(var c in a)void 0===b[c]&&(b[c]=a[c])}return b}function Di(a){var b=a._result;switch(a._status){case 1:return b;case 2:throw b;case 0:throw b;
default:a._status=0;b=a._ctor;b=b();b.then(function(b){0===a._status&&(b=b.default,a._status=1,a._result=b)},function(b){0===a._status&&(a._status=2,a._result=b)});switch(a._status){case 1:return a._result;case 2:throw a._result;}a._result=b;throw b;}}function $d(){Ic=jb=Jc=null}function pg(a,b){var c=a.type._context;D(ae,c._currentValue,a);c._currentValue=b}function be(a){var b=ae.current;w(ae,a);a.type._context._currentValue=b}function qg(a,b){for(;null!==a;){var c=a.alternate;if(a.childExpirationTime<
b)a.childExpirationTime=b,null!==c&&c.childExpirationTime<b&&(c.childExpirationTime=b);else if(null!==c&&c.childExpirationTime<b)c.childExpirationTime=b;else break;a=a.return}}function kb(a,b){Jc=a;Ic=jb=null;a=a.dependencies;null!==a&&null!==a.firstContext&&(a.expirationTime>=b&&(pa=!0),a.firstContext=null)}function aa(a,b){if(Ic!==a&&!1!==b&&0!==b){if("number"!==typeof b||1073741823===b)Ic=a,b=1073741823;b={context:a,observedBits:b,next:null};if(null===jb){if(null===Jc)throw m(Error(308));jb=b;
Jc.dependencies={expirationTime:0,firstContext:b,responders:null}}else jb=jb.next=b}return a._currentValue}function Kc(a){return{baseState:a,firstUpdate:null,lastUpdate:null,firstCapturedUpdate:null,lastCapturedUpdate:null,firstEffect:null,lastEffect:null,firstCapturedEffect:null,lastCapturedEffect:null}}function ce(a){return{baseState:a.baseState,firstUpdate:a.firstUpdate,lastUpdate:a.lastUpdate,firstCapturedUpdate:null,lastCapturedUpdate:null,firstEffect:null,lastEffect:null,firstCapturedEffect:null,
lastCapturedEffect:null}}function Ba(a,b){return{expirationTime:a,suspenseConfig:b,tag:rg,payload:null,callback:null,next:null,nextEffect:null}}function Lc(a,b){null===a.lastUpdate?a.firstUpdate=a.lastUpdate=b:(a.lastUpdate.next=b,a.lastUpdate=b)}function Ca(a,b){var c=a.alternate;if(null===c){var d=a.updateQueue;var e=null;null===d&&(d=a.updateQueue=Kc(a.memoizedState))}else d=a.updateQueue,e=c.updateQueue,null===d?null===e?(d=a.updateQueue=Kc(a.memoizedState),e=c.updateQueue=Kc(c.memoizedState)):
d=a.updateQueue=ce(e):null===e&&(e=c.updateQueue=ce(d));null===e||d===e?Lc(d,b):null===d.lastUpdate||null===e.lastUpdate?(Lc(d,b),Lc(e,b)):(Lc(d,b),e.lastUpdate=b)}function sg(a,b){var c=a.updateQueue;c=null===c?a.updateQueue=Kc(a.memoizedState):tg(a,c);null===c.lastCapturedUpdate?c.firstCapturedUpdate=c.lastCapturedUpdate=b:(c.lastCapturedUpdate.next=b,c.lastCapturedUpdate=b)}function tg(a,b){var c=a.alternate;null!==c&&b===c.updateQueue&&(b=a.updateQueue=ce(b));return b}function ug(a,b,c,d,e,f){switch(c.tag){case 1:return a=
c.payload,"function"===typeof a?a.call(f,d,e):a;case 3:a.effectTag=a.effectTag&-2049|64;case rg:a=c.payload;e="function"===typeof a?a.call(f,d,e):a;if(null===e||void 0===e)break;return K({},d,e);case Mc:Da=!0}return d}function Gb(a,b,c,d,e){Da=!1;b=tg(a,b);for(var f=b.baseState,g=null,h=0,k=b.firstUpdate,l=f;null!==k;){var m=k.expirationTime;m<e?(null===g&&(g=k,f=l),h<m&&(h=m)):(wg(m,k.suspenseConfig),l=ug(a,b,k,l,c,d),null!==k.callback&&(a.effectTag|=32,k.nextEffect=null,null===b.lastEffect?b.firstEffect=
b.lastEffect=k:(b.lastEffect.nextEffect=k,b.lastEffect=k)));k=k.next}m=null;for(k=b.firstCapturedUpdate;null!==k;){var n=k.expirationTime;n<e?(null===m&&(m=k,null===g&&(f=l)),h<n&&(h=n)):(l=ug(a,b,k,l,c,d),null!==k.callback&&(a.effectTag|=32,k.nextEffect=null,null===b.lastCapturedEffect?b.firstCapturedEffect=b.lastCapturedEffect=k:(b.lastCapturedEffect.nextEffect=k,b.lastCapturedEffect=k)));k=k.next}null===g&&(b.lastUpdate=null);null===m?b.lastCapturedUpdate=null:a.effectTag|=32;null===g&&null===
m&&(f=l);b.baseState=f;b.firstUpdate=g;b.firstCapturedUpdate=m;a.expirationTime=h;a.memoizedState=l}function xg(a,b,c,d){null!==b.firstCapturedUpdate&&(null!==b.lastUpdate&&(b.lastUpdate.next=b.firstCapturedUpdate,b.lastUpdate=b.lastCapturedUpdate),b.firstCapturedUpdate=b.lastCapturedUpdate=null);yg(b.firstEffect,c);b.firstEffect=b.lastEffect=null;yg(b.firstCapturedEffect,c);b.firstCapturedEffect=b.lastCapturedEffect=null}function yg(a,b){for(;null!==a;){var c=a.callback;if(null!==c){a.callback=null;
var d=b;if("function"!==typeof c)throw m(Error(191),c);c.call(d)}a=a.nextEffect}}function Nc(a,b,c,d){b=a.memoizedState;c=c(d,b);c=null===c||void 0===c?b:K({},b,c);a.memoizedState=c;d=a.updateQueue;null!==d&&0===a.expirationTime&&(d.baseState=c)}function zg(a,b,c,d,e,f,g){a=a.stateNode;return"function"===typeof a.shouldComponentUpdate?a.shouldComponentUpdate(d,f,g):b.prototype&&b.prototype.isPureReactComponent?!zb(c,d)||!zb(e,f):!0}function Ag(a,b,c,d){var e=!1;d=Aa;var f=b.contextType;"object"===
typeof f&&null!==f?f=aa(f):(d=G(b)?La:I.current,e=b.contextTypes,f=(e=null!==e&&void 0!==e)?ib(a,d):Aa);b=new b(c,f);a.memoizedState=null!==b.state&&void 0!==b.state?b.state:null;b.updater=Oc;a.stateNode=b;b._reactInternalFiber=a;e&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=d,a.__reactInternalMemoizedMaskedChildContext=f);return b}function Bg(a,b,c,d){a=b.state;"function"===typeof b.componentWillReceiveProps&&b.componentWillReceiveProps(c,d);"function"===typeof b.UNSAFE_componentWillReceiveProps&&
b.UNSAFE_componentWillReceiveProps(c,d);b.state!==a&&Oc.enqueueReplaceState(b,b.state,null)}function de(a,b,c,d){var e=a.stateNode;e.props=c;e.state=a.memoizedState;e.refs=Cg;var f=b.contextType;"object"===typeof f&&null!==f?e.context=aa(f):(f=G(b)?La:I.current,e.context=ib(a,f));f=a.updateQueue;null!==f&&(Gb(a,f,c,e,d),e.state=a.memoizedState);f=b.getDerivedStateFromProps;"function"===typeof f&&(Nc(a,b,f,c),e.state=a.memoizedState);"function"===typeof b.getDerivedStateFromProps||"function"===typeof e.getSnapshotBeforeUpdate||
"function"!==typeof e.UNSAFE_componentWillMount&&"function"!==typeof e.componentWillMount||(b=e.state,"function"===typeof e.componentWillMount&&e.componentWillMount(),"function"===typeof e.UNSAFE_componentWillMount&&e.UNSAFE_componentWillMount(),b!==e.state&&Oc.enqueueReplaceState(e,e.state,null),f=a.updateQueue,null!==f&&(Gb(a,f,c,e,d),e.state=a.memoizedState));"function"===typeof e.componentDidMount&&(a.effectTag|=4)}function Hb(a,b,c){a=c.ref;if(null!==a&&"function"!==typeof a&&"object"!==typeof a){if(c._owner){c=
c._owner;var d=void 0;if(c){if(1!==c.tag)throw m(Error(309));d=c.stateNode}if(!d)throw m(Error(147),a);var e=""+a;if(null!==b&&null!==b.ref&&"function"===typeof b.ref&&b.ref._stringRef===e)return b.ref;b=function(a){var b=d.refs;b===Cg&&(b=d.refs={});null===a?delete b[e]:b[e]=a};b._stringRef=e;return b}if("string"!==typeof a)throw m(Error(284));if(!c._owner)throw m(Error(290),a);}return a}function Pc(a,b){if("textarea"!==a.type)throw m(Error(31),"[object Object]"===Object.prototype.toString.call(b)?
"object with keys {"+Object.keys(b).join(", ")+"}":b,"");}function Dg(a){function b(b,c){if(a){var d=b.lastEffect;null!==d?(d.nextEffect=c,b.lastEffect=c):b.firstEffect=b.lastEffect=c;c.nextEffect=null;c.effectTag=8}}function c(c,d){if(!a)return null;for(;null!==d;)b(c,d),d=d.sibling;return null}function d(a,b){for(a=new Map;null!==b;)null!==b.key?a.set(b.key,b):a.set(b.index,b),b=b.sibling;return a}function e(a,b,c){a=Na(a,b,c);a.index=0;a.sibling=null;return a}function f(b,c,d){b.index=d;if(!a)return c;
d=b.alternate;if(null!==d)return d=d.index,d<c?(b.effectTag=2,c):d;b.effectTag=2;return c}function g(b){a&&null===b.alternate&&(b.effectTag=2);return b}function h(a,b,c,d){if(null===b||6!==b.tag)return b=ee(c,a.mode,d),b.return=a,b;b=e(b,c,d);b.return=a;return b}function k(a,b,c,d){if(null!==b&&b.elementType===c.type)return d=e(b,c.props,d),d.ref=Hb(a,b,c),d.return=a,d;d=Rc(c.type,c.key,c.props,null,a.mode,d);d.ref=Hb(a,b,c);d.return=a;return d}function l(a,b,c,d){if(null===b||4!==b.tag||b.stateNode.containerInfo!==
c.containerInfo||b.stateNode.implementation!==c.implementation)return b=fe(c,a.mode,d),b.return=a,b;b=e(b,c.children||[],d);b.return=a;return b}function n(a,b,c,d,f){if(null===b||7!==b.tag)return b=Ea(c,a.mode,d,f),b.return=a,b;b=e(b,c,d);b.return=a;return b}function q(a,b,c){if("string"===typeof b||"number"===typeof b)return b=ee(""+b,a.mode,c),b.return=a,b;if("object"===typeof b&&null!==b){switch(b.$$typeof){case Sc:return c=Rc(b.type,b.key,b.props,null,a.mode,c),c.ref=Hb(a,null,b),c.return=a,c;
case eb:return b=fe(b,a.mode,c),b.return=a,b}if(Tc(b)||wb(b))return b=Ea(b,a.mode,c,null),b.return=a,b;Pc(a,b)}return null}function x(a,b,c,d){var e=null!==b?b.key:null;if("string"===typeof c||"number"===typeof c)return null!==e?null:h(a,b,""+c,d);if("object"===typeof c&&null!==c){switch(c.$$typeof){case Sc:return c.key===e?c.type===ya?n(a,b,c.props.children,d,e):k(a,b,c,d):null;case eb:return c.key===e?l(a,b,c,d):null}if(Tc(c)||wb(c))return null!==e?null:n(a,b,c,d,null);Pc(a,c)}return null}function u(a,
b,c,d,e){if("string"===typeof d||"number"===typeof d)return a=a.get(c)||null,h(b,a,""+d,e);if("object"===typeof d&&null!==d){switch(d.$$typeof){case Sc:return a=a.get(null===d.key?c:d.key)||null,d.type===ya?n(b,a,d.props.children,e,d.key):k(b,a,d,e);case eb:return a=a.get(null===d.key?c:d.key)||null,l(b,a,d,e)}if(Tc(d)||wb(d))return a=a.get(c)||null,n(b,a,d,e,null);Pc(b,d)}return null}function v(e,g,h,k){for(var l=null,m=null,n=g,r=g=0,y=null;null!==n&&r<h.length;r++){n.index>r?(y=n,n=null):y=n.sibling;
var p=x(e,n,h[r],k);if(null===p){null===n&&(n=y);break}a&&n&&null===p.alternate&&b(e,n);g=f(p,g,r);null===m?l=p:m.sibling=p;m=p;n=y}if(r===h.length)return c(e,n),l;if(null===n){for(;r<h.length;r++)n=q(e,h[r],k),null!==n&&(g=f(n,g,r),null===m?l=n:m.sibling=n,m=n);return l}for(n=d(e,n);r<h.length;r++)y=u(n,e,r,h[r],k),null!==y&&(a&&null!==y.alternate&&n.delete(null===y.key?r:y.key),g=f(y,g,r),null===m?l=y:m.sibling=y,m=y);a&&n.forEach(function(a){return b(e,a)});return l}function z(e,g,h,k){var l=wb(h);
if("function"!==typeof l)throw m(Error(150));h=l.call(h);if(null==h)throw m(Error(151));for(var n=l=null,r=g,y=g=0,Qc=null,p=h.next();null!==r&&!p.done;y++,p=h.next()){r.index>y?(Qc=r,r=null):Qc=r.sibling;var t=x(e,r,p.value,k);if(null===t){null===r&&(r=Qc);break}a&&r&&null===t.alternate&&b(e,r);g=f(t,g,y);null===n?l=t:n.sibling=t;n=t;r=Qc}if(p.done)return c(e,r),l;if(null===r){for(;!p.done;y++,p=h.next())p=q(e,p.value,k),null!==p&&(g=f(p,g,y),null===n?l=p:n.sibling=p,n=p);return l}for(r=d(e,r);!p.done;y++,
p=h.next())p=u(r,e,y,p.value,k),null!==p&&(a&&null!==p.alternate&&r.delete(null===p.key?y:p.key),g=f(p,g,y),null===n?l=p:n.sibling=p,n=p);a&&r.forEach(function(a){return b(e,a)});return l}return function(a,d,f,h){var k="object"===typeof f&&null!==f&&f.type===ya&&null===f.key;k&&(f=f.props.children);var l="object"===typeof f&&null!==f;if(l)switch(f.$$typeof){case Sc:a:{l=f.key;for(k=d;null!==k;){if(k.key===l){if(7===k.tag?f.type===ya:k.elementType===f.type){c(a,k.sibling);d=e(k,f.type===ya?f.props.children:
f.props,h);d.ref=Hb(a,k,f);d.return=a;a=d;break a}c(a,k);break}else b(a,k);k=k.sibling}f.type===ya?(d=Ea(f.props.children,a.mode,h,f.key),d.return=a,a=d):(h=Rc(f.type,f.key,f.props,null,a.mode,h),h.ref=Hb(a,d,f),h.return=a,a=h)}return g(a);case eb:a:{for(k=f.key;null!==d;){if(d.key===k){if(4===d.tag&&d.stateNode.containerInfo===f.containerInfo&&d.stateNode.implementation===f.implementation){c(a,d.sibling);d=e(d,f.children||[],h);d.return=a;a=d;break a}c(a,d);break}else b(a,d);d=d.sibling}d=fe(f,a.mode,
h);d.return=a;a=d}return g(a)}if("string"===typeof f||"number"===typeof f)return f=""+f,null!==d&&6===d.tag?(c(a,d.sibling),d=e(d,f,h),d.return=a,a=d):(c(a,d),d=ee(f,a.mode,h),d.return=a,a=d),g(a);if(Tc(f))return v(a,d,f,h);if(wb(f))return z(a,d,f,h);l&&Pc(a,f);if("undefined"===typeof f&&!k)switch(a.tag){case 1:case 0:throw a=a.type,m(Error(152),a.displayName||a.name||"Component");}return c(a,d)}}function Oa(a){if(a===Ib)throw m(Error(174));return a}function ge(a,b){D(Jb,b,a);D(Kb,a,a);D(ba,Ib,a);
var c=b.nodeType;switch(c){case 9:case 11:b=(b=b.documentElement)?b.namespaceURI:Od(null,"");break;default:c=8===c?b.parentNode:b,b=c.namespaceURI||null,c=c.tagName,b=Od(b,c)}w(ba,a);D(ba,b,a)}function lb(a){w(ba,a);w(Kb,a);w(Jb,a)}function Fg(a){Oa(Jb.current);var b=Oa(ba.current);var c=Od(b,a.type);b!==c&&(D(Kb,a,a),D(ba,c,a))}function he(a){Kb.current===a&&(w(ba,a),w(Kb,a))}function Uc(a){for(var b=a;null!==b;){if(13===b.tag){if(null!==b.memoizedState)return b}else if(19===b.tag&&void 0!==b.memoizedProps.revealOrder){if(0!==
(b.effectTag&64))return b}else if(null!==b.child){b.child.return=b;b=b.child;continue}if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return null;b=b.return}b.sibling.return=b.return;b=b.sibling}return null}function S(){throw m(Error(321));}function ie(a,b){if(null===b)return!1;for(var c=0;c<b.length&&c<a.length;c++)if(!Ka(a[c],b[c]))return!1;return!0}function je(a,b,c,d,e,f){Lb=f;Fa=b;ca=null!==a?a.memoizedState:null;Vc.current=null===ca?Ei:Gg;b=c(d,e);if(Mb){do Mb=!1,Nb+=
1,ca=null!==a?a.memoizedState:null,mb=nb,da=R=F=null,Vc.current=Gg,b=c(d,e);while(Mb);qa=null;Nb=0}Vc.current=Wc;a=Fa;a.memoizedState=nb;a.expirationTime=Ob;a.updateQueue=da;a.effectTag|=Pb;a=null!==F&&null!==F.next;Lb=0;mb=R=nb=ca=F=Fa=null;Ob=0;da=null;Pb=0;if(a)throw m(Error(300));return b}function Hg(){Vc.current=Wc;Lb=0;mb=R=nb=ca=F=Fa=null;Ob=0;da=null;Pb=0;Mb=!1;qa=null;Nb=0}function ob(){var a={memoizedState:null,baseState:null,queue:null,baseUpdate:null,next:null};null===R?nb=R=a:R=R.next=
a;return R}function Qb(){if(null!==mb)R=mb,mb=R.next,F=ca,ca=null!==F?F.next:null;else{if(null===ca)throw m(Error(310));F=ca;var a={memoizedState:F.memoizedState,baseState:F.baseState,queue:F.queue,baseUpdate:F.baseUpdate,next:null};R=null===R?nb=a:R.next=a;ca=F.next}return R}function Ig(a,b){return"function"===typeof b?b(a):b}function Jg(a,b,c){b=Qb();c=b.queue;if(null===c)throw m(Error(311));c.lastRenderedReducer=a;if(0<Nb){var d=c.dispatch;if(null!==qa){var e=qa.get(c);if(void 0!==e){qa.delete(c);
var f=b.memoizedState;do f=a(f,e.action),e=e.next;while(null!==e);Ka(f,b.memoizedState)||(pa=!0);b.memoizedState=f;b.baseUpdate===c.last&&(b.baseState=f);c.lastRenderedState=f;return[f,d]}}return[b.memoizedState,d]}d=c.last;var g=b.baseUpdate;f=b.baseState;null!==g?(null!==d&&(d.next=null),d=g.next):d=null!==d?d.next:null;if(null!==d){var h=e=null,k=d,l=!1;do{var n=k.expirationTime;n<Lb?(l||(l=!0,h=g,e=f),n>Ob&&(Ob=n)):(wg(n,k.suspenseConfig),f=k.eagerReducer===a?k.eagerState:a(f,k.action));g=k;k=
k.next}while(null!==k&&k!==d);l||(h=g,e=f);Ka(f,b.memoizedState)||(pa=!0);b.memoizedState=f;b.baseUpdate=h;b.baseState=e;c.lastRenderedState=f}return[b.memoizedState,c.dispatch]}function ke(a,b,c,d){a={tag:a,create:b,destroy:c,deps:d,next:null};null===da?(da={lastEffect:null},da.lastEffect=a.next=a):(b=da.lastEffect,null===b?da.lastEffect=a.next=a:(c=b.next,b.next=a,a.next=c,da.lastEffect=a));return a}function le(a,b,c,d){var e=ob();Pb|=a;e.memoizedState=ke(b,c,void 0,void 0===d?null:d)}function me(a,
b,c,d){var e=Qb();d=void 0===d?null:d;var f=void 0;if(null!==F){var g=F.memoizedState;f=g.destroy;if(null!==d&&ie(d,g.deps)){ke(pb,c,f,d);return}}Pb|=a;e.memoizedState=ke(b,c,f,d)}function Kg(a,b){if("function"===typeof b)return a=a(),b(a),function(){b(null)};if(null!==b&&void 0!==b)return a=a(),b.current=a,function(){b.current=null}}function Lg(a,b){}function Mg(a,b,c){if(!(25>Nb))throw m(Error(301));var d=a.alternate;if(a===Fa||null!==d&&d===Fa)if(Mb=!0,a={expirationTime:Lb,suspenseConfig:null,
action:c,eagerReducer:null,eagerState:null,next:null},null===qa&&(qa=new Map),c=qa.get(b),void 0===c)qa.set(b,a);else{for(b=c;null!==b.next;)b=b.next;b.next=a}else{var e=ea(),f=Rb.suspense;e=qb(e,a,f);f={expirationTime:e,suspenseConfig:f,action:c,eagerReducer:null,eagerState:null,next:null};var g=b.last;if(null===g)f.next=f;else{var h=g.next;null!==h&&(f.next=h);g.next=f}b.last=f;if(0===a.expirationTime&&(null===d||0===d.expirationTime)&&(d=b.lastRenderedReducer,null!==d))try{var k=b.lastRenderedState,
l=d(k,c);f.eagerReducer=d;f.eagerState=l;if(Ka(l,k))return}catch(vg){}finally{}Sb(a,e)}}function Ng(a,b){var c=fa(5,null,null,0);c.elementType="DELETED";c.type="DELETED";c.stateNode=b;c.return=a;c.effectTag=8;null!==a.lastEffect?(a.lastEffect.nextEffect=c,a.lastEffect=c):a.firstEffect=a.lastEffect=c}function Og(a,b){switch(a.tag){case 5:var c=a.type;b=1!==b.nodeType||c.toLowerCase()!==b.nodeName.toLowerCase()?null:b;return null!==b?(a.stateNode=b,!0):!1;case 6:return b=""===a.pendingProps||3!==b.nodeType?
null:b,null!==b?(a.stateNode=b,!0):!1;case 13:return!1;default:return!1}}function Pg(a){if(Pa){var b=rb;if(b){var c=b;if(!Og(a,b)){b=Fb(c.nextSibling);if(!b||!Og(a,b)){a.effectTag|=2;Pa=!1;ra=a;return}Ng(ra,c)}ra=a;rb=Fb(b.firstChild)}else a.effectTag|=2,Pa=!1,ra=a}}function Qg(a){for(a=a.return;null!==a&&5!==a.tag&&3!==a.tag&&18!==a.tag;)a=a.return;ra=a}function Xc(a){if(a!==ra)return!1;if(!Pa)return Qg(a),Pa=!0,!1;var b=a.type;if(5!==a.tag||"head"!==b&&"body"!==b&&!Rd(b,a.memoizedProps))for(b=rb;b;)Ng(a,
b),b=Fb(b.nextSibling);Qg(a);rb=ra?Fb(a.stateNode.nextSibling):null;return!0}function ne(){rb=ra=null;Pa=!1}function T(a,b,c,d){b.child=null===a?oe(b,null,c,d):sb(b,a.child,c,d)}function Rg(a,b,c,d,e){c=c.render;var f=b.ref;kb(b,e);d=je(a,b,c,d,f,e);if(null!==a&&!pa)return b.updateQueue=a.updateQueue,b.effectTag&=-517,a.expirationTime<=e&&(a.expirationTime=0),sa(a,b,e);b.effectTag|=1;T(a,b,d,e);return b.child}function Sg(a,b,c,d,e,f){if(null===a){var g=c.type;if("function"===typeof g&&!pe(g)&&void 0===
g.defaultProps&&null===c.compare&&void 0===c.defaultProps)return b.tag=15,b.type=g,Tg(a,b,g,d,e,f);a=Rc(c.type,null,d,null,b.mode,f);a.ref=b.ref;a.return=b;return b.child=a}g=a.child;if(e<f&&(e=g.memoizedProps,c=c.compare,c=null!==c?c:zb,c(e,d)&&a.ref===b.ref))return sa(a,b,f);b.effectTag|=1;a=Na(g,d,f);a.ref=b.ref;a.return=b;return b.child=a}function Tg(a,b,c,d,e,f){return null!==a&&zb(a.memoizedProps,d)&&a.ref===b.ref&&(pa=!1,e<f)?sa(a,b,f):qe(a,b,c,d,f)}function Ug(a,b){var c=b.ref;if(null===a&&
null!==c||null!==a&&a.ref!==c)b.effectTag|=128}function qe(a,b,c,d,e){var f=G(c)?La:I.current;f=ib(b,f);kb(b,e);c=je(a,b,c,d,f,e);if(null!==a&&!pa)return b.updateQueue=a.updateQueue,b.effectTag&=-517,a.expirationTime<=e&&(a.expirationTime=0),sa(a,b,e);b.effectTag|=1;T(a,b,c,e);return b.child}function Vg(a,b,c,d,e){if(G(c)){var f=!0;Fc(b)}else f=!1;kb(b,e);if(null===b.stateNode)null!==a&&(a.alternate=null,b.alternate=null,b.effectTag|=2),Ag(b,c,d,e),de(b,c,d,e),d=!0;else if(null===a){var g=b.stateNode,
h=b.memoizedProps;g.props=h;var k=g.context,l=c.contextType;"object"===typeof l&&null!==l?l=aa(l):(l=G(c)?La:I.current,l=ib(b,l));var m=c.getDerivedStateFromProps,n="function"===typeof m||"function"===typeof g.getSnapshotBeforeUpdate;n||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||(h!==d||k!==l)&&Bg(b,g,d,l);Da=!1;var q=b.memoizedState;k=g.state=q;var u=b.updateQueue;null!==u&&(Gb(b,u,d,g,e),k=b.memoizedState);h!==d||q!==k||M.current||Da?
("function"===typeof m&&(Nc(b,c,m,d),k=b.memoizedState),(h=Da||zg(b,c,h,d,q,k,l))?(n||"function"!==typeof g.UNSAFE_componentWillMount&&"function"!==typeof g.componentWillMount||("function"===typeof g.componentWillMount&&g.componentWillMount(),"function"===typeof g.UNSAFE_componentWillMount&&g.UNSAFE_componentWillMount()),"function"===typeof g.componentDidMount&&(b.effectTag|=4)):("function"===typeof g.componentDidMount&&(b.effectTag|=4),b.memoizedProps=d,b.memoizedState=k),g.props=d,g.state=k,g.context=
l,d=h):("function"===typeof g.componentDidMount&&(b.effectTag|=4),d=!1)}else g=b.stateNode,h=b.memoizedProps,g.props=b.type===b.elementType?h:X(b.type,h),k=g.context,l=c.contextType,"object"===typeof l&&null!==l?l=aa(l):(l=G(c)?La:I.current,l=ib(b,l)),m=c.getDerivedStateFromProps,(n="function"===typeof m||"function"===typeof g.getSnapshotBeforeUpdate)||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||(h!==d||k!==l)&&Bg(b,g,d,l),Da=!1,k=b.memoizedState,
q=g.state=k,u=b.updateQueue,null!==u&&(Gb(b,u,d,g,e),q=b.memoizedState),h!==d||k!==q||M.current||Da?("function"===typeof m&&(Nc(b,c,m,d),q=b.memoizedState),(m=Da||zg(b,c,h,d,k,q,l))?(n||"function"!==typeof g.UNSAFE_componentWillUpdate&&"function"!==typeof g.componentWillUpdate||("function"===typeof g.componentWillUpdate&&g.componentWillUpdate(d,q,l),"function"===typeof g.UNSAFE_componentWillUpdate&&g.UNSAFE_componentWillUpdate(d,q,l)),"function"===typeof g.componentDidUpdate&&(b.effectTag|=4),"function"===
typeof g.getSnapshotBeforeUpdate&&(b.effectTag|=256)):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&k===a.memoizedState||(b.effectTag|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&k===a.memoizedState||(b.effectTag|=256),b.memoizedProps=d,b.memoizedState=q),g.props=d,g.state=q,g.context=l,d=m):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&k===a.memoizedState||(b.effectTag|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&
k===a.memoizedState||(b.effectTag|=256),d=!1);return re(a,b,c,d,f,e)}function re(a,b,c,d,e,f){Ug(a,b);var g=0!==(b.effectTag&64);if(!d&&!g)return e&&gg(b,c,!1),sa(a,b,f);d=b.stateNode;Fi.current=b;var h=g&&"function"!==typeof c.getDerivedStateFromError?null:d.render();b.effectTag|=1;null!==a&&g?(b.child=sb(b,a.child,null,f),b.child=sb(b,null,h,f)):T(a,b,h,f);b.memoizedState=d.state;e&&gg(b,c,!0);return b.child}function Wg(a){var b=a.stateNode;b.pendingContext?eg(a,b.pendingContext,b.pendingContext!==
b.context):b.context&&eg(a,b.context,!1);ge(a,b.containerInfo)}function Xg(a,b,c){var d=b.mode,e=b.pendingProps,f=z.current,g=null,h=!1,k;(k=0!==(b.effectTag&64))||(k=0!==(f&Tb)&&(null===a||null!==a.memoizedState));k?(g=Gi,h=!0,b.effectTag&=-65):null!==a&&null===a.memoizedState||void 0===e.fallback||!0===e.unstable_avoidThisFallback||(f|=se);f&=Ga;D(z,f,b);if(null===a)if(h){e=e.fallback;a=Ea(null,d,0,null);a.return=b;if(0===(b.mode&2))for(h=null!==b.memoizedState?b.child.child:b.child,a.child=h;null!==
h;)h.return=a,h=h.sibling;c=Ea(e,d,c,null);c.return=b;a.sibling=c;d=a}else d=c=oe(b,null,e.children,c);else{if(null!==a.memoizedState)if(f=a.child,d=f.sibling,h){e=e.fallback;c=Na(f,f.pendingProps,0);c.return=b;if(0===(b.mode&2)&&(h=null!==b.memoizedState?b.child.child:b.child,h!==f.child))for(c.child=h;null!==h;)h.return=c,h=h.sibling;e=Na(d,e,d.expirationTime);e.return=b;c.sibling=e;d=c;c.childExpirationTime=0;c=e}else d=c=sb(b,f.child,e.children,c);else if(f=a.child,h){h=e.fallback;e=Ea(null,d,
0,null);e.return=b;e.child=f;null!==f&&(f.return=e);if(0===(b.mode&2))for(f=null!==b.memoizedState?b.child.child:b.child,e.child=f;null!==f;)f.return=e,f=f.sibling;c=Ea(h,d,c,null);c.return=b;e.sibling=c;c.effectTag|=2;d=e;e.childExpirationTime=0}else c=d=sb(b,f,e.children,c);b.stateNode=a.stateNode}b.memoizedState=g;b.child=d;return c}function te(a,b,c,d,e){var f=a.memoizedState;null===f?a.memoizedState={isBackwards:b,rendering:null,last:d,tail:c,tailExpiration:0,tailMode:e}:(f.isBackwards=b,f.rendering=
null,f.last=d,f.tail=c,f.tailExpiration=0,f.tailMode=e)}function Yg(a,b,c){var d=b.pendingProps,e=d.revealOrder,f=d.tail;T(a,b,d.children,c);d=z.current;if(0!==(d&Tb))d=d&Ga|Tb,b.effectTag|=64;else{if(null!==a&&0!==(a.effectTag&64))a:for(a=b.child;null!==a;){if(13===a.tag){if(null!==a.memoizedState){a.expirationTime<c&&(a.expirationTime=c);var g=a.alternate;null!==g&&g.expirationTime<c&&(g.expirationTime=c);qg(a.return,c)}}else if(null!==a.child){a.child.return=a;a=a.child;continue}if(a===b)break a;
for(;null===a.sibling;){if(null===a.return||a.return===b)break a;a=a.return}a.sibling.return=a.return;a=a.sibling}d&=Ga}D(z,d,b);if(0===(b.mode&2))b.memoizedState=null;else switch(e){case "forwards":c=b.child;for(e=null;null!==c;)d=c.alternate,null!==d&&null===Uc(d)&&(e=c),c=c.sibling;c=e;null===c?(e=b.child,b.child=null):(e=c.sibling,c.sibling=null);te(b,!1,e,c,f);break;case "backwards":c=null;e=b.child;for(b.child=null;null!==e;){d=e.alternate;if(null!==d&&null===Uc(d)){b.child=e;break}d=e.sibling;
e.sibling=c;c=e;e=d}te(b,!0,c,null,f);break;case "together":te(b,!1,null,null,void 0);break;default:b.memoizedState=null}return b.child}function sa(a,b,c){null!==a&&(b.dependencies=a.dependencies);if(b.childExpirationTime<c)return null;if(null!==a&&b.child!==a.child)throw m(Error(153));if(null!==b.child){a=b.child;c=Na(a,a.pendingProps,a.expirationTime);b.child=c;for(c.return=b;null!==a.sibling;)a=a.sibling,c=c.sibling=Na(a,a.pendingProps,a.expirationTime),c.return=b;c.sibling=null}return b.child}
function Ub(a){a.effectTag|=4}function Yc(a,b){switch(a.tailMode){case "hidden":b=a.tail;for(var c=null;null!==b;)null!==b.alternate&&(c=b),b=b.sibling;null===c?a.tail=null:c.sibling=null;break;case "collapsed":c=a.tail;for(var d=null;null!==c;)null!==c.alternate&&(d=c),c=c.sibling;null===d?b||null===a.tail?a.tail=null:a.tail.sibling=null:d.sibling=null}}function Hi(a,b){switch(a.tag){case 1:return G(a.type)&&Ec(a),b=a.effectTag,b&2048?(a.effectTag=b&-2049|64,a):null;case 3:lb(a);Td(a);b=a.effectTag;
if(0!==(b&64))throw m(Error(285));a.effectTag=b&-2049|64;return a;case 5:return he(a),null;case 13:return w(z,a),b=a.effectTag,b&2048?(a.effectTag=b&-2049|64,a):null;case 18:return null;case 19:return w(z,a),null;case 4:return lb(a),null;case 10:return be(a),null;default:return null}}function ue(a,b){return{value:a,source:b,stack:Bd(b)}}function ve(a,b){var c=b.source,d=b.stack;null===d&&null!==c&&(d=Bd(c));null!==c&&xa(c.type);b=b.value;null!==a&&1===a.tag&&xa(a.type);try{console.error(b)}catch(e){setTimeout(function(){throw e;
})}}function Ii(a,b){try{b.props=a.memoizedProps,b.state=a.memoizedState,b.componentWillUnmount()}catch(c){Qa(a,c)}}function Zg(a){var b=a.ref;if(null!==b)if("function"===typeof b)try{b(null)}catch(c){Qa(a,c)}else b.current=null}function Vb(a,b,c){c=c.updateQueue;c=null!==c?c.lastEffect:null;if(null!==c){var d=c=c.next;do{if((d.tag&a)!==pb){var e=d.destroy;d.destroy=void 0;void 0!==e&&e()}(d.tag&b)!==pb&&(e=d.create,d.destroy=e());d=d.next}while(d!==c)}}function $g(a,b){"function"===typeof we&&we(a);
switch(a.tag){case 0:case 11:case 14:case 15:var c=a.updateQueue;if(null!==c&&(c=c.lastEffect,null!==c)){var d=c.next;Ma(97<b?97:b,function(){var b=d;do{var c=b.destroy;if(void 0!==c){var g=a;try{c()}catch(h){Qa(g,h)}}b=b.next}while(b!==d)})}break;case 1:Zg(a);b=a.stateNode;"function"===typeof b.componentWillUnmount&&Ii(a,b);break;case 5:Zg(a);break;case 4:ah(a,b)}}function bh(a,b){for(var c=a;;)if($g(c,b),null!==c.child&&4!==c.tag)c.child.return=c,c=c.child;else{if(c===a)break;for(;null===c.sibling;){if(null===
c.return||c.return===a)return;c=c.return}c.sibling.return=c.return;c=c.sibling}}function ch(a){return 5===a.tag||3===a.tag||4===a.tag}function dh(a){a:{for(var b=a.return;null!==b;){if(ch(b)){var c=b;break a}b=b.return}throw m(Error(160));}b=c.stateNode;switch(c.tag){case 5:var d=!1;break;case 3:b=b.containerInfo;d=!0;break;case 4:b=b.containerInfo;d=!0;break;default:throw m(Error(161));}c.effectTag&16&&(Wb(b,""),c.effectTag&=-17);a:b:for(c=a;;){for(;null===c.sibling;){if(null===c.return||ch(c.return)){c=
null;break a}c=c.return}c.sibling.return=c.return;for(c=c.sibling;5!==c.tag&&6!==c.tag&&18!==c.tag;){if(c.effectTag&2)continue b;if(null===c.child||4===c.tag)continue b;else c.child.return=c,c=c.child}if(!(c.effectTag&2)){c=c.stateNode;break a}}for(var e=a;;){var f=5===e.tag||6===e.tag;if(f||20===e.tag){var g=f?e.stateNode:e.stateNode.instance;if(c)if(d){f=b;var h=g;g=c;8===f.nodeType?f.parentNode.insertBefore(h,g):f.insertBefore(h,g)}else b.insertBefore(g,c);else d?(h=b,8===h.nodeType?(f=h.parentNode,
f.insertBefore(g,h)):(f=h,f.appendChild(g)),h=h._reactRootContainer,null!==h&&void 0!==h||null!==f.onclick||(f.onclick=Dc)):b.appendChild(g)}else if(4!==e.tag&&null!==e.child){e.child.return=e;e=e.child;continue}if(e===a)break;for(;null===e.sibling;){if(null===e.return||e.return===a)return;e=e.return}e.sibling.return=e.return;e=e.sibling}}function ah(a,b){for(var c=a,d=!1,e=void 0,f=void 0;;){if(!d){d=c.return;a:for(;;){if(null===d)throw m(Error(160));e=d.stateNode;switch(d.tag){case 5:f=!1;break a;
case 3:e=e.containerInfo;f=!0;break a;case 4:e=e.containerInfo;f=!0;break a}d=d.return}d=!0}if(5===c.tag||6===c.tag)if(bh(c,b),f){var g=e,h=c.stateNode;8===g.nodeType?g.parentNode.removeChild(h):g.removeChild(h)}else e.removeChild(c.stateNode);else if(20===c.tag)h=c.stateNode.instance,bh(c,b),f?(g=e,8===g.nodeType?g.parentNode.removeChild(h):g.removeChild(h)):e.removeChild(h);else if(4===c.tag){if(null!==c.child){e=c.stateNode.containerInfo;f=!0;c.child.return=c;c=c.child;continue}}else if($g(c,b),
null!==c.child){c.child.return=c;c=c.child;continue}if(c===a)break;for(;null===c.sibling;){if(null===c.return||c.return===a)return;c=c.return;4===c.tag&&(d=!1)}c.sibling.return=c.return;c=c.sibling}}function eh(a,b){switch(b.tag){case 0:case 11:case 14:case 15:Vb(Xb,Ji,b);break;case 1:break;case 5:var c=b.stateNode;if(null!=c){var d=b.memoizedProps,e=null!==a?a.memoizedProps:d;a=b.type;var f=b.updateQueue;b.updateQueue=null;if(null!==f){c[pc]=d;"input"===a&&"radio"===d.type&&null!=d.name&&Ff(c,d);
Qd(a,e);b=Qd(a,d);for(e=0;e<f.length;e+=2){var g=f[e],h=f[e+1];"style"===g?cg(c,h):"dangerouslySetInnerHTML"===g?fh(c,h):"children"===g?Wb(c,h):Cd(c,g,h,b)}switch(a){case "input":Ed(c,d);break;case "textarea":$f(c,d);break;case "select":b=c._wrapperState.wasMultiple,c._wrapperState.wasMultiple=!!d.multiple,a=d.value,null!=a?gb(c,!!d.multiple,a,!1):b!==!!d.multiple&&(null!=d.defaultValue?gb(c,!!d.multiple,d.defaultValue,!0):gb(c,!!d.multiple,d.multiple?[]:"",!1))}}}break;case 6:if(null===b.stateNode)throw m(Error(162));
b.stateNode.nodeValue=b.memoizedProps;break;case 3:break;case 12:break;case 13:c=b;null===b.memoizedState?d=!1:(d=!0,c=b.child,xe=Y());if(null!==c)a:for(a=c;;){if(5===a.tag)f=a.stateNode,d?(f=f.style,"function"===typeof f.setProperty?f.setProperty("display","none","important"):f.display="none"):(f=a.stateNode,e=a.memoizedProps.style,e=void 0!==e&&null!==e&&e.hasOwnProperty("display")?e.display:null,f.style.display=bg("display",e));else if(6===a.tag)a.stateNode.nodeValue=d?"":a.memoizedProps;else if(13===
a.tag&&null!==a.memoizedState){f=a.child.sibling;f.return=a;a=f;continue}else if(null!==a.child){a.child.return=a;a=a.child;continue}if(a===c)break a;for(;null===a.sibling;){if(null===a.return||a.return===c)break a;a=a.return}a.sibling.return=a.return;a=a.sibling}gh(b);break;case 19:gh(b);break;case 17:break;case 20:break;default:throw m(Error(163));}}function gh(a){var b=a.updateQueue;if(null!==b){a.updateQueue=null;var c=a.stateNode;null===c&&(c=a.stateNode=new Ki);b.forEach(function(b){var d=Li.bind(null,
a,b);c.has(b)||(c.add(b),b.then(d,d))})}}function hh(a,b,c){c=Ba(c,null);c.tag=3;c.payload={element:null};var d=b.value;c.callback=function(){Zc||(Zc=!0,ye=d);ve(a,b)};return c}function ih(a,b,c){c=Ba(c,null);c.tag=3;var d=a.type.getDerivedStateFromError;if("function"===typeof d){var e=b.value;c.payload=function(){ve(a,b);return d(e)}}var f=a.stateNode;null!==f&&"function"===typeof f.componentDidCatch&&(c.callback=function(){"function"!==typeof d&&(null===Ha?Ha=new Set([this]):Ha.add(this),ve(a,b));
var c=b.stack;this.componentDidCatch(b.value,{componentStack:null!==c?c:""})});return c}function ea(){return(q&(ha|ia))!==J?1073741821-(Y()/10|0):0!==$c?$c:$c=1073741821-(Y()/10|0)}function qb(a,b,c){b=b.mode;if(0===(b&2))return 1073741823;var d=Ud();if(0===(b&4))return 99===d?1073741823:1073741822;if((q&ha)!==J)return W;if(null!==c)a=1073741821-25*(((1073741821-a+(c.timeoutMs|0||5E3)/10)/25|0)+1);else switch(d){case 99:a=1073741823;break;case 98:a=1073741821-10*(((1073741821-a+15)/10|0)+1);break;
case 97:case 96:a=1073741821-25*(((1073741821-a+500)/25|0)+1);break;case 95:a=1;break;default:throw m(Error(326));}null!==Ra&&a===W&&--a;return a}function ad(a,b){a.expirationTime<b&&(a.expirationTime=b);var c=a.alternate;null!==c&&c.expirationTime<b&&(c.expirationTime=b);var d=a.return,e=null;if(null===d&&3===a.tag)e=a.stateNode;else for(;null!==d;){c=d.alternate;d.childExpirationTime<b&&(d.childExpirationTime=b);null!==c&&c.childExpirationTime<b&&(c.childExpirationTime=b);if(null===d.return&&3===
d.tag){e=d.stateNode;break}d=d.return}null!==e&&(b>e.firstPendingTime&&(e.firstPendingTime=b),a=e.lastPendingTime,0===a||b<a)&&(e.lastPendingTime=b);return e}function Sa(a,b,c){if(a.callbackExpirationTime<c){var d=a.callbackNode;null!==d&&d!==ng&&og(d);a.callbackExpirationTime=c;1073741823===c?a.callbackNode=Hc(ze.bind(null,a,O.bind(null,a,c))):(d=null,1!==c&&(d={timeout:10*(1073741821-c)-Y()}),a.callbackNode=Vd(b,ze.bind(null,a,O.bind(null,a,c)),d))}}function ze(a,b,c){var d=a.callbackNode,e=null;
try{return e=b(c),null!==e?ze.bind(null,a,e):null}finally{null===e&&d===a.callbackNode&&(a.callbackNode=null,a.callbackExpirationTime=0)}}function Ae(){(q&(1|ha|ia))===J&&(Mi(),Yb())}function Ni(a,b){var c=a.firstBatch;return null!==c&&c._defer&&c._expirationTime>=b?(Vd(97,function(){c._onComplete();return null}),!0):!1}function Mi(){if(null!==Ta){var a=Ta;Ta=null;a.forEach(function(a,c){Hc(O.bind(null,c,a))});V()}}function jh(a,b){var c=q;q|=1;try{return a(b)}finally{q=c,q===J&&V()}}function Be(a,
b,c,d){var e=q;q|=4;try{return Ma(98,a.bind(null,b,c,d))}finally{q=e,q===J&&V()}}function kh(a,b){var c=q;q&=-2;q|=Ce;try{return a(b)}finally{q=c,q===J&&V()}}function Ua(a,b){a.finishedWork=null;a.finishedExpirationTime=0;var c=a.timeoutHandle;-1!==c&&(a.timeoutHandle=-1,Oi(c));if(null!==u)for(c=u.return;null!==c;){var d=c;switch(d.tag){case 1:var e=d.type.childContextTypes;null!==e&&void 0!==e&&Ec(d);break;case 3:lb(d);Td(d);break;case 5:he(d);break;case 4:lb(d);break;case 13:w(z,d);break;case 19:w(z,
d);break;case 10:be(d)}c=c.return}Ra=a;u=Na(a.current,null,b);W=b;P=Va;Zb=ta=1073741823;bd=null;$b=!1}function O(a,b,c){if((q&(ha|ia))!==J)throw m(Error(327));if(a.firstPendingTime<b)return null;if(c&&a.finishedExpirationTime===b)return Ia.bind(null,a);Yb();if(a!==Ra||b!==W)Ua(a,b);else if(P===cd)if($b)Ua(a,b);else{var d=a.lastPendingTime;if(d<b)return O.bind(null,a,d)}if(null!==u){d=q;q|=ha;var e=dd.current;null===e&&(e=Wc);dd.current=Wc;if(c){if(1073741823!==b){var f=ea();if(f<b)return q=d,$d(),
dd.current=e,O.bind(null,a,f)}}else $c=0;do try{if(c)for(;null!==u;)u=lh(u);else for(;null!==u&&!Pi();)u=lh(u);break}catch(Eg){$d();Hg();f=u;if(null===f||null===f.return)throw Ua(a,b),q=d,Eg;a:{var g=a,h=f.return,k=f,l=Eg,n=W;k.effectTag|=1024;k.firstEffect=k.lastEffect=null;if(null!==l&&"object"===typeof l&&"function"===typeof l.then){var v=l,x=0!==(z.current&se);l=h;do{var w;if(w=13===l.tag)null!==l.memoizedState?w=!1:(w=l.memoizedProps,w=void 0===w.fallback?!1:!0!==w.unstable_avoidThisFallback?
!0:x?!1:!0);if(w){h=l.updateQueue;null===h?(h=new Set,h.add(v),l.updateQueue=h):h.add(v);if(0===(l.mode&2)){l.effectTag|=64;k.effectTag&=-1957;1===k.tag&&(null===k.alternate?k.tag=17:(n=Ba(1073741823,null),n.tag=Mc,Ca(k,n)));k.expirationTime=1073741823;break a}k=g;g=n;x=k.pingCache;null===x?(x=k.pingCache=new Qi,h=new Set,x.set(v,h)):(h=x.get(v),void 0===h&&(h=new Set,x.set(v,h)));h.has(g)||(h.add(g),k=Ri.bind(null,k,v,g),v.then(k,k));l.effectTag|=2048;l.expirationTime=n;break a}l=l.return}while(null!==
l);l=Error((xa(k.type)||"A React component")+" suspended while rendering, but no fallback UI was specified.\n\nAdd a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display."+Bd(k))}P!==De&&(P=mh);l=ue(l,k);k=h;do{switch(k.tag){case 3:k.effectTag|=2048;k.expirationTime=n;n=hh(k,l,n);sg(k,n);break a;case 1:if(v=l,g=k.type,h=k.stateNode,0===(k.effectTag&64)&&("function"===typeof g.getDerivedStateFromError||null!==h&&"function"===typeof h.componentDidCatch&&
(null===Ha||!Ha.has(h)))){k.effectTag|=2048;k.expirationTime=n;n=ih(k,v,n);sg(k,n);break a}}k=k.return}while(null!==k)}u=nh(f)}while(1);q=d;$d();dd.current=e;if(null!==u)return O.bind(null,a,b)}a.finishedWork=a.current.alternate;a.finishedExpirationTime=b;if(Ni(a,b))return null;Ra=null;switch(P){case Va:throw m(Error(328));case mh:return d=a.lastPendingTime,d<b?O.bind(null,a,d):c?Ia.bind(null,a):(Ua(a,b),Hc(O.bind(null,a,b)),null);case ed:if(1073741823===ta&&!c&&(c=xe+oh-Y(),10<c)){if($b)return Ua(a,
b),O.bind(null,a,b);d=a.lastPendingTime;if(d<b)return O.bind(null,a,d);a.timeoutHandle=Ee(Ia.bind(null,a),c);return null}return Ia.bind(null,a);case cd:if(!c){if($b)return Ua(a,b),O.bind(null,a,b);c=a.lastPendingTime;if(c<b)return O.bind(null,a,c);1073741823!==Zb?c=10*(1073741821-Zb)-Y():1073741823===ta?c=0:(c=10*(1073741821-ta)-5E3,d=Y(),b=10*(1073741821-b)-d,c=d-c,0>c&&(c=0),c=(120>c?120:480>c?480:1080>c?1080:1920>c?1920:3E3>c?3E3:4320>c?4320:1960*Si(c/1960))-c,b<c&&(c=b));if(10<c)return a.timeoutHandle=
Ee(Ia.bind(null,a),c),null}return Ia.bind(null,a);case De:return!c&&1073741823!==ta&&null!==bd&&(d=ta,e=bd,b=e.busyMinDurationMs|0,0>=b?b=0:(c=e.busyDelayMs|0,d=Y()-(10*(1073741821-d)-(e.timeoutMs|0||5E3)),b=d<=c?0:c+b-d),10<b)?(a.timeoutHandle=Ee(Ia.bind(null,a),b),null):Ia.bind(null,a);default:throw m(Error(329));}}function wg(a,b){a<ta&&1<a&&(ta=a);null!==b&&a<Zb&&1<a&&(Zb=a,bd=b)}function lh(a){var b=ph(a.alternate,a,W);a.memoizedProps=a.pendingProps;null===b&&(b=nh(a));qh.current=null;return b}
function nh(a){u=a;do{var b=u.alternate;a=u.return;if(0===(u.effectTag&1024)){a:{var c=b;b=u;var d=W;var e=b.pendingProps;switch(b.tag){case 2:break;case 16:break;case 15:case 0:break;case 1:G(b.type)&&Ec(b);break;case 3:lb(b);Td(b);e=b.stateNode;e.pendingContext&&(e.context=e.pendingContext,e.pendingContext=null);if(null===c||null===c.child)Xc(b),b.effectTag&=-3;Fe(b);break;case 5:he(b);var f=Oa(Jb.current);d=b.type;if(null!==c&&null!=b.stateNode)rh(c,b,d,e,f),c.ref!==b.ref&&(b.effectTag|=128);else if(e){var g=
Oa(ba.current);if(Xc(b)){d=void 0;e=b.stateNode;c=b.type;g=b.memoizedProps;e[la]=b;e[pc]=g;switch(c){case "iframe":case "object":case "embed":v("load",e);break;case "video":case "audio":for(var h=0;h<Eb.length;h++)v(Eb[h],e);break;case "source":v("error",e);break;case "img":case "image":case "link":v("error",e);v("load",e);break;case "form":v("reset",e);v("submit",e);break;case "details":v("toggle",e);break;case "input":Ef(e,g);v("invalid",e);na(f,"onChange");break;case "select":e._wrapperState={wasMultiple:!!g.multiple};
v("invalid",e);na(f,"onChange");break;case "textarea":Zf(e,g),v("invalid",e),na(f,"onChange")}Pd(c,g);h=null;for(d in g)if(g.hasOwnProperty(d)){var k=g[d];"children"===d?"string"===typeof k?e.textContent!==k&&(h=["children",k]):"number"===typeof k&&e.textContent!==""+k&&(h=["children",""+k]):Ya.hasOwnProperty(d)&&null!=k&&na(f,d)}switch(c){case "input":vc(e);Gf(e,g,!0);break;case "textarea":vc(e);d=e.textContent;d===e._wrapperState.initialValue&&(e.value=d);break;case "select":case "option":break;
default:"function"===typeof g.onClick&&(e.onclick=Dc)}e=h;b.updateQueue=e;(e=null!==e?!0:!1)&&Ub(b)}else{c=9===f.nodeType?f:f.ownerDocument;"http://www.w3.org/1999/xhtml"===g&&(g=ag(d));"http://www.w3.org/1999/xhtml"===g?"script"===d?(c=c.createElement("div"),c.innerHTML="<script>\x3c/script>",c=c.removeChild(c.firstChild)):"string"===typeof e.is?c=c.createElement(d,{is:e.is}):(c=c.createElement(d),"select"===d&&(g=c,e.multiple?g.multiple=!0:e.size&&(g.size=e.size))):c=c.createElementNS(g,d);c[la]=
b;c[pc]=e;sh(c,b,!1,!1);var l=Qd(d,e);switch(d){case "iframe":case "object":case "embed":v("load",c);g=e;break;case "video":case "audio":for(g=0;g<Eb.length;g++)v(Eb[g],c);g=e;break;case "source":v("error",c);g=e;break;case "img":case "image":case "link":v("error",c);v("load",c);g=e;break;case "form":v("reset",c);v("submit",c);g=e;break;case "details":v("toggle",c);g=e;break;case "input":Ef(c,e);g=Dd(c,e);v("invalid",c);na(f,"onChange");break;case "option":g=Md(c,e);break;case "select":c._wrapperState=
{wasMultiple:!!e.multiple};g=K({},e,{value:void 0});v("invalid",c);na(f,"onChange");break;case "textarea":Zf(c,e);g=Nd(c,e);v("invalid",c);na(f,"onChange");break;default:g=e}Pd(d,g);h=void 0;k=d;var n=c,q=g;for(h in q)if(q.hasOwnProperty(h)){var x=q[h];"style"===h?cg(n,x):"dangerouslySetInnerHTML"===h?(x=x?x.__html:void 0,null!=x&&fh(n,x)):"children"===h?"string"===typeof x?("textarea"!==k||""!==x)&&Wb(n,x):"number"===typeof x&&Wb(n,""+x):"suppressContentEditableWarning"!==h&&"suppressHydrationWarning"!==
h&&"autoFocus"!==h&&(Ya.hasOwnProperty(h)?null!=x&&na(f,h):null!=x&&Cd(n,h,x,l))}switch(d){case "input":vc(c);Gf(c,e,!1);break;case "textarea":vc(c);f=c.textContent;f===c._wrapperState.initialValue&&(c.value=f);break;case "option":null!=e.value&&c.setAttribute("value",""+za(e.value));break;case "select":f=c;g=e;f.multiple=!!g.multiple;h=g.value;null!=h?gb(f,!!g.multiple,h,!1):null!=g.defaultValue&&gb(f,!!g.multiple,g.defaultValue,!0);break;default:"function"===typeof g.onClick&&(c.onclick=Dc)}(e=
dg(d,e))&&Ub(b);b.stateNode=c}null!==b.ref&&(b.effectTag|=128)}else if(null===b.stateNode)throw m(Error(166));break;case 6:if(c&&null!=b.stateNode)th(c,b,c.memoizedProps,e);else{if("string"!==typeof e&&null===b.stateNode)throw m(Error(166));d=Oa(Jb.current);Oa(ba.current);Xc(b)?(e=b.stateNode,d=b.memoizedProps,e[la]=b,e.nodeValue!==d&&Ub(b)):(e=(9===d.nodeType?d:d.ownerDocument).createTextNode(e),e[la]=b,b.stateNode=e)}break;case 11:break;case 13:w(z,b);e=b.memoizedState;if(0!==(b.effectTag&64)){b.expirationTime=
d;break a}e=null!==e;d=!1;null===c?Xc(b):(f=c.memoizedState,d=null!==f,e||null===f||(f=c.child.sibling,null!==f&&(g=b.firstEffect,null!==g?(b.firstEffect=f,f.nextEffect=g):(b.firstEffect=b.lastEffect=f,f.nextEffect=null),f.effectTag=8)));if(e&&!d&&0!==(b.mode&2))if(null===c&&!0!==b.memoizedProps.unstable_avoidThisFallback||0!==(z.current&se))P===Va&&(P=ed);else if(P===Va||P===ed)P=cd;if(e||d)b.effectTag|=4;break;case 7:break;case 8:break;case 12:break;case 4:lb(b);Fe(b);break;case 10:be(b);break;
case 9:break;case 14:break;case 17:G(b.type)&&Ec(b);break;case 18:break;case 19:w(z,b);e=b.memoizedState;if(null===e)break;f=0!==(b.effectTag&64);g=e.rendering;if(null===g)if(f)Yc(e,!1);else{if(P!==Va||null!==c&&0!==(c.effectTag&64))for(c=b.child;null!==c;){g=Uc(c);if(null!==g){b.effectTag|=64;Yc(e,!1);e=g.updateQueue;null!==e&&(b.updateQueue=e,b.effectTag|=4);b.firstEffect=b.lastEffect=null;e=d;for(d=b.child;null!==d;)f=d,c=e,f.effectTag&=2,f.nextEffect=null,f.firstEffect=null,f.lastEffect=null,
g=f.alternate,null===g?(f.childExpirationTime=0,f.expirationTime=c,f.child=null,f.memoizedProps=null,f.memoizedState=null,f.updateQueue=null,f.dependencies=null):(f.childExpirationTime=g.childExpirationTime,f.expirationTime=g.expirationTime,f.child=g.child,f.memoizedProps=g.memoizedProps,f.memoizedState=g.memoizedState,f.updateQueue=g.updateQueue,c=g.dependencies,f.dependencies=null===c?null:{expirationTime:c.expirationTime,firstContext:c.firstContext,responders:c.responders}),d=d.sibling;D(z,z.current&
Ga|Tb,b);b=b.child;break a}c=c.sibling}}else{if(!f)if(c=Uc(g),null!==c){if(b.effectTag|=64,f=!0,Yc(e,!0),null===e.tail&&"hidden"===e.tailMode){d=c.updateQueue;null!==d&&(b.updateQueue=d,b.effectTag|=4);b=b.lastEffect=e.lastEffect;null!==b&&(b.nextEffect=null);break}}else Y()>e.tailExpiration&&1<d&&(b.effectTag|=64,f=!0,Yc(e,!1),b.expirationTime=b.childExpirationTime=d-1);e.isBackwards?(g.sibling=b.child,b.child=g):(d=e.last,null!==d?d.sibling=g:b.child=g,e.last=g)}if(null!==e.tail){0===e.tailExpiration&&
(e.tailExpiration=Y()+500);d=e.tail;e.rendering=d;e.tail=d.sibling;e.lastEffect=b.lastEffect;d.sibling=null;e=z.current;e=f?e&Ga|Tb:e&Ga;D(z,e,b);b=d;break a}break;case 20:break;default:throw m(Error(156));}b=null}e=u;if(1===W||1!==e.childExpirationTime){d=0;for(f=e.child;null!==f;)c=f.expirationTime,g=f.childExpirationTime,c>d&&(d=c),g>d&&(d=g),f=f.sibling;e.childExpirationTime=d}if(null!==b)return b;null!==a&&0===(a.effectTag&1024)&&(null===a.firstEffect&&(a.firstEffect=u.firstEffect),null!==u.lastEffect&&
(null!==a.lastEffect&&(a.lastEffect.nextEffect=u.firstEffect),a.lastEffect=u.lastEffect),1<u.effectTag&&(null!==a.lastEffect?a.lastEffect.nextEffect=u:a.firstEffect=u,a.lastEffect=u))}else{b=Hi(u,W);if(null!==b)return b.effectTag&=1023,b;null!==a&&(a.firstEffect=a.lastEffect=null,a.effectTag|=1024)}b=u.sibling;if(null!==b)return b;u=a}while(null!==u);P===Va&&(P=De);return null}function Ia(a){var b=Ud();Ma(99,Ti.bind(null,a,b));null!==ac&&Vd(97,function(){Yb();return null});return null}function Ti(a,
b){Yb();if((q&(ha|ia))!==J)throw m(Error(327));var c=a.finishedWork,d=a.finishedExpirationTime;if(null===c)return null;a.finishedWork=null;a.finishedExpirationTime=0;if(c===a.current)throw m(Error(177));a.callbackNode=null;a.callbackExpirationTime=0;var e=c.expirationTime,f=c.childExpirationTime;e=f>e?f:e;a.firstPendingTime=e;e<a.lastPendingTime&&(a.lastPendingTime=e);a===Ra&&(u=Ra=null,W=0);1<c.effectTag?null!==c.lastEffect?(c.lastEffect.nextEffect=c,e=c.firstEffect):e=c:e=c.firstEffect;if(null!==
e){f=q;q|=ia;qh.current=null;Ge=Bc;var g=Wf();if(Jd(g)){if("selectionStart"in g)var h={start:g.selectionStart,end:g.selectionEnd};else a:{h=(h=g.ownerDocument)&&h.defaultView||window;var k=h.getSelection&&h.getSelection();if(k&&0!==k.rangeCount){h=k.anchorNode;var l=k.anchorOffset,v=k.focusNode;k=k.focusOffset;try{h.nodeType,v.nodeType}catch(tb){h=null;break a}var w=0,x=-1,z=-1,D=0,H=0,r=g,y=null;b:for(;;){for(var F;;){r!==h||0!==l&&3!==r.nodeType||(x=w+l);r!==v||0!==k&&3!==r.nodeType||(z=w+k);3===
r.nodeType&&(w+=r.nodeValue.length);if(null===(F=r.firstChild))break;y=r;r=F}for(;;){if(r===g)break b;y===h&&++D===l&&(x=w);y===v&&++H===k&&(z=w);if(null!==(F=r.nextSibling))break;r=y;y=r.parentNode}r=F}h=-1===x||-1===z?null:{start:x,end:z}}else h=null}h=h||{start:0,end:0}}else h=null;He={focusedElem:g,selectionRange:h};Bc=!1;n=e;do try{for(;null!==n;){if(0!==(n.effectTag&256)){var L=n.alternate;g=n;switch(g.tag){case 0:case 11:case 15:Vb(Ui,pb,g);break;case 1:if(g.effectTag&256&&null!==L){var E=
L.memoizedProps,B=L.memoizedState,K=g.stateNode,P=K.getSnapshotBeforeUpdate(g.elementType===g.type?E:X(g.type,E),B);K.__reactInternalSnapshotBeforeUpdate=P}break;case 3:case 5:case 6:case 4:case 17:break;default:throw m(Error(163));}}n=n.nextEffect}}catch(tb){if(null===n)throw m(Error(330));Qa(n,tb);n=n.nextEffect}while(null!==n);n=e;do try{for(L=b;null!==n;){var A=n.effectTag;A&16&&Wb(n.stateNode,"");if(A&128){var p=n.alternate;if(null!==p){var t=p.ref;null!==t&&("function"===typeof t?t(null):t.current=
null)}}switch(A&14){case 2:dh(n);n.effectTag&=-3;break;case 6:dh(n);n.effectTag&=-3;eh(n.alternate,n);break;case 4:eh(n.alternate,n);break;case 8:E=n;ah(E,L);E.return=null;E.child=null;E.memoizedState=null;E.updateQueue=null;E.dependencies=null;var N=E.alternate;null!==N&&(N.return=null,N.child=null,N.memoizedState=null,N.updateQueue=null,N.dependencies=null)}n=n.nextEffect}}catch(tb){if(null===n)throw m(Error(330));Qa(n,tb);n=n.nextEffect}while(null!==n);t=He;p=Wf();A=t.focusedElem;L=t.selectionRange;
if(p!==A&&A&&A.ownerDocument&&Vf(A.ownerDocument.documentElement,A)){null!==L&&Jd(A)&&(p=L.start,t=L.end,void 0===t&&(t=p),"selectionStart"in A?(A.selectionStart=p,A.selectionEnd=Math.min(t,A.value.length)):(t=(p=A.ownerDocument||document)&&p.defaultView||window,t.getSelection&&(t=t.getSelection(),E=A.textContent.length,N=Math.min(L.start,E),L=void 0===L.end?N:Math.min(L.end,E),!t.extend&&N>L&&(E=L,L=N,N=E),E=Uf(A,N),B=Uf(A,L),E&&B&&(1!==t.rangeCount||t.anchorNode!==E.node||t.anchorOffset!==E.offset||
t.focusNode!==B.node||t.focusOffset!==B.offset)&&(p=p.createRange(),p.setStart(E.node,E.offset),t.removeAllRanges(),N>L?(t.addRange(p),t.extend(B.node,B.offset)):(p.setEnd(B.node,B.offset),t.addRange(p))))));p=[];for(t=A;t=t.parentNode;)1===t.nodeType&&p.push({element:t,left:t.scrollLeft,top:t.scrollTop});"function"===typeof A.focus&&A.focus();for(A=0;A<p.length;A++)t=p[A],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}He=null;Bc=!!Ge;Ge=null;a.current=c;n=e;do try{for(A=d;null!==n;){var C=
n.effectTag;if(C&36){var G=n.alternate;p=n;t=A;switch(p.tag){case 0:case 11:case 15:Vb(Vi,bc,p);break;case 1:var I=p.stateNode;if(p.effectTag&4)if(null===G)I.componentDidMount();else{var R=p.elementType===p.type?G.memoizedProps:X(p.type,G.memoizedProps);I.componentDidUpdate(R,G.memoizedState,I.__reactInternalSnapshotBeforeUpdate)}var O=p.updateQueue;null!==O&&xg(p,O,I,t);break;case 3:var Q=p.updateQueue;if(null!==Q){N=null;if(null!==p.child)switch(p.child.tag){case 5:N=p.child.stateNode;break;case 1:N=
p.child.stateNode}xg(p,Q,N,t)}break;case 5:var T=p.stateNode;null===G&&p.effectTag&4&&(t=T,dg(p.type,p.memoizedProps)&&t.focus());break;case 6:break;case 4:break;case 12:break;case 13:case 19:case 17:case 20:break;default:throw m(Error(163));}}if(C&128){var M=n.ref;if(null!==M){var U=n.stateNode;switch(n.tag){case 5:var S=U;break;default:S=U}"function"===typeof M?M(S):M.current=S}}C&512&&(Ie=!0);n=n.nextEffect}}catch(tb){if(null===n)throw m(Error(330));Qa(n,tb);n=n.nextEffect}while(null!==n);n=null;
Wi();q=f}else a.current=c;if(Ie)Ie=!1,ac=a,Je=d,Ke=b;else for(n=e;null!==n;)b=n.nextEffect,n.nextEffect=null,n=b;b=a.firstPendingTime;0!==b?(C=ea(),C=Zd(C,b),Sa(a,C,b)):Ha=null;"function"===typeof Le&&Le(c.stateNode,d);1073741823===b?a===Me?cc++:(cc=0,Me=a):cc=0;if(Zc)throw Zc=!1,a=ye,ye=null,a;if((q&Ce)!==J)return null;V();return null}function Yb(){if(null===ac)return!1;var a=ac,b=Je,c=Ke;ac=null;Je=0;Ke=90;return Ma(97<c?97:c,Xi.bind(null,a,b))}function Xi(a,b){if((q&(ha|ia))!==J)throw m(Error(331));
b=q;q|=ia;for(a=a.current.firstEffect;null!==a;){try{var c=a;if(0!==(c.effectTag&512))switch(c.tag){case 0:case 11:case 15:Vb(Ne,pb,c),Vb(pb,Oe,c)}}catch(d){if(null===a)throw m(Error(330));Qa(a,d)}c=a.nextEffect;a.nextEffect=null;a=c}q=b;V();return!0}function uh(a,b,c){b=ue(c,b);b=hh(a,b,1073741823);Ca(a,b);a=ad(a,1073741823);null!==a&&Sa(a,99,1073741823)}function Qa(a,b){if(3===a.tag)uh(a,a,b);else for(var c=a.return;null!==c;){if(3===c.tag){uh(c,a,b);break}else if(1===c.tag){var d=c.stateNode;if("function"===
typeof c.type.getDerivedStateFromError||"function"===typeof d.componentDidCatch&&(null===Ha||!Ha.has(d))){a=ue(b,a);a=ih(c,a,1073741823);Ca(c,a);c=ad(c,1073741823);null!==c&&Sa(c,99,1073741823);break}}c=c.return}}function Ri(a,b,c){var d=a.pingCache;null!==d&&d.delete(b);Ra===a&&W===c?P===cd||P===ed&&1073741823===ta&&Y()-xe<oh?Ua(a,W):$b=!0:a.lastPendingTime<c||(b=a.pingTime,0!==b&&b<c||(a.pingTime=c,a.finishedExpirationTime===c&&(a.finishedExpirationTime=0,a.finishedWork=null),b=ea(),b=Zd(b,c),Sa(a,
b,c)))}function Li(a,b){var c=a.stateNode;null!==c&&c.delete(b);c=ea();b=qb(c,a,null);c=Zd(c,b);a=ad(a,b);null!==a&&Sa(a,c,b)}function Yi(a){if("undefined"===typeof __REACT_DEVTOOLS_GLOBAL_HOOK__)return!1;var b=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(b.isDisabled||!b.supportsFiber)return!0;try{var c=b.inject(a);Le=function(a,e){try{b.onCommitFiberRoot(c,a,void 0,64===(a.current.effectTag&64))}catch(f){}};we=function(a){try{b.onCommitFiberUnmount(c,a)}catch(e){}}}catch(d){}return!0}function Zi(a,b,c,d){this.tag=
a;this.key=c;this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null;this.index=0;this.ref=null;this.pendingProps=b;this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null;this.mode=d;this.effectTag=0;this.lastEffect=this.firstEffect=this.nextEffect=null;this.childExpirationTime=this.expirationTime=0;this.alternate=null}function pe(a){a=a.prototype;return!(!a||!a.isReactComponent)}function $i(a){if("function"===typeof a)return pe(a)?1:0;if(void 0!==
a&&null!==a){a=a.$$typeof;if(a===zd)return 11;if(a===Ad)return 14}return 2}function Na(a,b,c){c=a.alternate;null===c?(c=fa(a.tag,b,a.key,a.mode),c.elementType=a.elementType,c.type=a.type,c.stateNode=a.stateNode,c.alternate=a,a.alternate=c):(c.pendingProps=b,c.effectTag=0,c.nextEffect=null,c.firstEffect=null,c.lastEffect=null);c.childExpirationTime=a.childExpirationTime;c.expirationTime=a.expirationTime;c.child=a.child;c.memoizedProps=a.memoizedProps;c.memoizedState=a.memoizedState;c.updateQueue=a.updateQueue;
b=a.dependencies;c.dependencies=null===b?null:{expirationTime:b.expirationTime,firstContext:b.firstContext,responders:b.responders};c.sibling=a.sibling;c.index=a.index;c.ref=a.ref;return c}function Rc(a,b,c,d,e,f){var g=2;d=a;if("function"===typeof a)pe(a)&&(g=1);else if("string"===typeof a)g=5;else a:switch(a){case ya:return Ea(c.children,e,f,b);case aj:g=8;e|=7;break;case xf:g=8;e|=1;break;case wc:return a=fa(12,c,b,e|8),a.elementType=wc,a.type=wc,a.expirationTime=f,a;case xc:return a=fa(13,c,b,
e),a.type=xc,a.elementType=xc,a.expirationTime=f,a;case yd:return a=fa(19,c,b,e),a.elementType=yd,a.expirationTime=f,a;default:if("object"===typeof a&&null!==a)switch(a.$$typeof){case zf:g=10;break a;case yf:g=9;break a;case zd:g=11;break a;case Ad:g=14;break a;case Af:g=16;d=null;break a}throw m(Error(130),null==a?a:typeof a,"");}b=fa(g,c,b,e);b.elementType=a;b.type=d;b.expirationTime=f;return b}function Ea(a,b,c,d){a=fa(7,a,d,b);a.expirationTime=c;return a}function ee(a,b,c){a=fa(6,a,null,b);a.expirationTime=
c;return a}function fe(a,b,c){b=fa(4,null!==a.children?a.children:[],a.key,b);b.expirationTime=c;b.stateNode={containerInfo:a.containerInfo,pendingChildren:null,implementation:a.implementation};return b}function bj(a,b,c){this.tag=b;this.current=null;this.containerInfo=a;this.pingCache=this.pendingChildren=null;this.finishedExpirationTime=0;this.finishedWork=null;this.timeoutHandle=-1;this.pendingContext=this.context=null;this.hydrate=c;this.callbackNode=this.firstBatch=null;this.pingTime=this.lastPendingTime=
this.firstPendingTime=this.callbackExpirationTime=0}function vh(a,b,c){a=new bj(a,b,c);b=fa(3,null,null,2===b?7:1===b?3:0);a.current=b;return b.stateNode=a}function wh(a,b,c,d,e,f){var g=b.current;a:if(c){c=c._reactInternalFiber;b:{if(2!==Ab(c)||1!==c.tag)throw m(Error(170));var h=c;do{switch(h.tag){case 3:h=h.stateNode.context;break b;case 1:if(G(h.type)){h=h.stateNode.__reactInternalMemoizedMergedChildContext;break b}}h=h.return}while(null!==h);throw m(Error(171));}if(1===c.tag){var k=c.type;if(G(k)){c=
fg(c,k,h);break a}}c=h}else c=Aa;null===b.context?b.context=c:b.pendingContext=c;b=f;e=Ba(d,e);e.payload={element:a};b=void 0===b?null:b;null!==b&&(e.callback=b);Ca(g,e);Sb(g,d);return d}function fd(a,b,c,d){var e=b.current,f=ea(),g=Rb.suspense;e=qb(f,e,g);return wh(a,b,c,e,g,d)}function Pe(a){a=a.current;if(!a.child)return null;switch(a.child.tag){case 5:return a.child.stateNode;default:return a.child.stateNode}}function cj(a,b,c){var d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;
return{$$typeof:eb,key:null==d?null:""+d,children:a,containerInfo:b,implementation:c}}function dc(a){var b=1073741821-25*(((1073741821-ea()+500)/25|0)+1);b<=xh&&--b;this._expirationTime=xh=b;this._root=a;this._callbacks=this._next=null;this._hasChildren=this._didComplete=!1;this._children=null;this._defer=!0}function ec(){this._callbacks=null;this._didCommit=!1;this._onCommit=this._onCommit.bind(this)}function gd(a,b,c){this._internalRoot=vh(a,b,c)}function hd(a,b){this._internalRoot=vh(a,2,b)}function Wa(a){return!(!a||
1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType&&(8!==a.nodeType||" react-mount-point-unstable "!==a.nodeValue))}function dj(a,b){b||(b=a?9===a.nodeType?a.documentElement:a.firstChild:null,b=!(!b||1!==b.nodeType||!b.hasAttribute("data-reactroot")));if(!b)for(var c;c=a.lastChild;)a.removeChild(c);return new gd(a,0,b)}function id(a,b,c,d,e){var f=c._reactRootContainer,g=void 0;if(f){g=f._internalRoot;if("function"===typeof e){var h=e;e=function(){var a=Pe(g);h.call(a)}}fd(b,g,a,e)}else{f=c._reactRootContainer=
dj(c,d);g=f._internalRoot;if("function"===typeof e){var k=e;e=function(){var a=Pe(g);k.call(a)}}kh(function(){fd(b,g,a,e)})}return Pe(g)}function yh(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;if(!Wa(b))throw m(Error(200));return cj(a,b,null,c)}if(!ka)throw m(Error(227));var jc=null,Xa={},kc=[],kd={},Ya={},ld={},Vh=function(a,b,c,d,e,f,g,h,k){var l=Array.prototype.slice.call(arguments,3);try{b.apply(c,l)}catch(vg){this.onError(vg)}},ub=!1,lc=null,mc=!1,md=null,Wh={onError:function(a){ub=
!0;lc=a}},od=null,pf=null,bf=null,vb=null,Yh=function(a){if(a){var b=a._dispatchListeners,c=a._dispatchInstances;if(Array.isArray(b))for(var d=0;d<b.length&&!a.isPropagationStopped();d++)af(a,b[d],c[d]);else b&&af(a,b,c);a._dispatchListeners=null;a._dispatchInstances=null;a.isPersistent()||a.constructor.release(a)}},Qe={injectEventPluginOrder:function(a){if(jc)throw m(Error(101));jc=Array.prototype.slice.call(a);Ze()},injectEventPluginsByName:function(a){var b=!1,c;for(c in a)if(a.hasOwnProperty(c)){var d=
a[c];if(!Xa.hasOwnProperty(c)||Xa[c]!==d){if(Xa[c])throw m(Error(102),c);Xa[c]=d;b=!0}}b&&Ze()}},zh=Math.random().toString(36).slice(2),la="__reactInternalInstance$"+zh,pc="__reactEventHandlers$"+zh,wa=!("undefined"===typeof window||"undefined"===typeof window.document||"undefined"===typeof window.document.createElement),ab={animationend:qc("Animation","AnimationEnd"),animationiteration:qc("Animation","AnimationIteration"),animationstart:qc("Animation","AnimationStart"),transitionend:qc("Transition",
"TransitionEnd")},rd={},ff={};wa&&(ff=document.createElement("div").style,"AnimationEvent"in window||(delete ab.animationend.animation,delete ab.animationiteration.animation,delete ab.animationstart.animation),"TransitionEvent"in window||delete ab.transitionend.transition);var Ah=rc("animationend"),Bh=rc("animationiteration"),Ch=rc("animationstart"),Dh=rc("transitionend"),Eb="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),
va=null,sd=null,sc=null,K=ka.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.assign;K(Q.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():"unknown"!==typeof a.returnValue&&(a.returnValue=!1),this.isDefaultPrevented=tc)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():"unknown"!==typeof a.cancelBubble&&(a.cancelBubble=!0),this.isPropagationStopped=tc)},persist:function(){this.isPersistent=
tc},isPersistent:uc,destructor:function(){var a=this.constructor.Interface,b;for(b in a)this[b]=null;this.nativeEvent=this._targetInst=this.dispatchConfig=null;this.isPropagationStopped=this.isDefaultPrevented=uc;this._dispatchInstances=this._dispatchListeners=null}});Q.Interface={type:null,target:null,currentTarget:function(){return null},eventPhase:null,bubbles:null,cancelable:null,timeStamp:function(a){return a.timeStamp||Date.now()},defaultPrevented:null,isTrusted:null};Q.extend=function(a){function b(){return c.apply(this,
arguments)}var c=this,d=function(){};d.prototype=c.prototype;d=new d;K(d,b.prototype);b.prototype=d;b.prototype.constructor=b;b.Interface=K({},c.Interface,a);b.extend=c.extend;hf(b);return b};hf(Q);var ej=Q.extend({data:null}),fj=Q.extend({data:null}),ci=[9,13,27,32],td=wa&&"CompositionEvent"in window,fc=null;wa&&"documentMode"in document&&(fc=document.documentMode);var gj=wa&&"TextEvent"in window&&!fc,nf=wa&&(!td||fc&&8<fc&&11>=fc),mf=String.fromCharCode(32),ua={beforeInput:{phasedRegistrationNames:{bubbled:"onBeforeInput",
captured:"onBeforeInputCapture"},dependencies:["compositionend","keypress","textInput","paste"]},compositionEnd:{phasedRegistrationNames:{bubbled:"onCompositionEnd",captured:"onCompositionEndCapture"},dependencies:"blur compositionend keydown keypress keyup mousedown".split(" ")},compositionStart:{phasedRegistrationNames:{bubbled:"onCompositionStart",captured:"onCompositionStartCapture"},dependencies:"blur compositionstart keydown keypress keyup mousedown".split(" ")},compositionUpdate:{phasedRegistrationNames:{bubbled:"onCompositionUpdate",
captured:"onCompositionUpdateCapture"},dependencies:"blur compositionupdate keydown keypress keyup mousedown".split(" ")}},lf=!1,bb=!1,hj={eventTypes:ua,extractEvents:function(a,b,c,d){var e=void 0;var f=void 0;if(td)b:{switch(a){case "compositionstart":e=ua.compositionStart;break b;case "compositionend":e=ua.compositionEnd;break b;case "compositionupdate":e=ua.compositionUpdate;break b}e=void 0}else bb?jf(a,c)&&(e=ua.compositionEnd):"keydown"===a&&229===c.keyCode&&(e=ua.compositionStart);e?(nf&&
"ko"!==c.locale&&(bb||e!==ua.compositionStart?e===ua.compositionEnd&&bb&&(f=gf()):(va=d,sd="value"in va?va.value:va.textContent,bb=!0)),e=ej.getPooled(e,b,c,d),f?e.data=f:(f=kf(c),null!==f&&(e.data=f)),$a(e),f=e):f=null;(a=gj?di(a,c):ei(a,c))?(b=fj.getPooled(ua.beforeInput,b,c,d),b.data=a,$a(b)):b=null;return null===f?b:null===b?f:[f,b]}},ud=null,cb=null,db=null,Gd=function(a,b){return a(b)},Pf=function(a,b,c,d){return a(b,c,d)},wd=function(){},Qf=Gd,Z=!1,fi={color:!0,date:!0,datetime:!0,"datetime-local":!0,
email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0},ja=ka.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;ja.hasOwnProperty("ReactCurrentDispatcher")||(ja.ReactCurrentDispatcher={current:null});ja.hasOwnProperty("ReactCurrentBatchConfig")||(ja.ReactCurrentBatchConfig={suspense:null});var hi=/^(.*)[\\\/]/,C="function"===typeof Symbol&&Symbol.for,Sc=C?Symbol.for("react.element"):60103,eb=C?Symbol.for("react.portal"):60106,ya=C?Symbol.for("react.fragment"):
60107,xf=C?Symbol.for("react.strict_mode"):60108,wc=C?Symbol.for("react.profiler"):60114,zf=C?Symbol.for("react.provider"):60109,yf=C?Symbol.for("react.context"):60110,aj=C?Symbol.for("react.concurrent_mode"):60111,zd=C?Symbol.for("react.forward_ref"):60112,xc=C?Symbol.for("react.suspense"):60113,yd=C?Symbol.for("react.suspense_list"):60120,Ad=C?Symbol.for("react.memo"):60115,Af=C?Symbol.for("react.lazy"):60116;C&&Symbol.for("react.fundamental");C&&Symbol.for("react.responder");var wf="function"===
typeof Symbol&&Symbol.iterator,ji=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Bf=Object.prototype.hasOwnProperty,Df={},Cf={},H={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a){H[a]=
new B(a,0,!1,a,null,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(a){var b=a[0];H[b]=new B(b,1,!1,a[1],null,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(a){H[a]=new B(a,2,!1,a.toLowerCase(),null,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(a){H[a]=new B(a,2,!1,a,null,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a){H[a]=
new B(a,3,!1,a.toLowerCase(),null,!1)});["checked","multiple","muted","selected"].forEach(function(a){H[a]=new B(a,3,!0,a,null,!1)});["capture","download"].forEach(function(a){H[a]=new B(a,4,!1,a,null,!1)});["cols","rows","size","span"].forEach(function(a){H[a]=new B(a,6,!1,a,null,!1)});["rowSpan","start"].forEach(function(a){H[a]=new B(a,5,!1,a.toLowerCase(),null,!1)});var Re=/[\-:]([a-z])/g,Se=function(a){return a[1].toUpperCase()};"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a){var b=
a.replace(Re,Se);H[b]=new B(b,1,!1,a,null,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a){var b=a.replace(Re,Se);H[b]=new B(b,1,!1,a,"http://www.w3.org/1999/xlink",!1)});["xml:base","xml:lang","xml:space"].forEach(function(a){var b=a.replace(Re,Se);H[b]=new B(b,1,!1,a,"http://www.w3.org/XML/1998/namespace",!1)});["tabIndex","crossOrigin"].forEach(function(a){H[a]=new B(a,1,!1,a.toLowerCase(),null,!1)});H.xlinkHref=new B("xlinkHref",1,
!1,"xlink:href","http://www.w3.org/1999/xlink",!0);["src","href","action","formAction"].forEach(function(a){H[a]=new B(a,1,!1,a.toLowerCase(),null,!0)});var If={change:{phasedRegistrationNames:{bubbled:"onChange",captured:"onChangeCapture"},dependencies:"blur change click focus input keydown keyup selectionchange".split(" ")}},xb=null,yb=null,Te=!1;wa&&(Te=tf("input")&&(!document.documentMode||9<document.documentMode));var ij={eventTypes:If,_isInputEventSupported:Te,extractEvents:function(a,b,c,d){var e=
b?Ja(b):window,f=void 0,g=void 0,h=e.nodeName&&e.nodeName.toLowerCase();"select"===h||"input"===h&&"file"===e.type?f=ni:sf(e)?Te?f=ri:(f=pi,g=oi):(h=e.nodeName)&&"input"===h.toLowerCase()&&("checkbox"===e.type||"radio"===e.type)&&(f=qi);if(f&&(f=f(a,b)))return Hf(f,c,d);g&&g(a,e,b);"blur"===a&&(a=e._wrapperState)&&a.controlled&&"number"===e.type&&Fd(e,"number",e.value)}},gc=Q.extend({view:null,detail:null}),ti={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"},Eh=0,Fh=0,Gh=!1,Hh=!1,
hc=gc.extend({screenX:null,screenY:null,clientX:null,clientY:null,pageX:null,pageY:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,getModifierState:Hd,button:null,buttons:null,relatedTarget:function(a){return a.relatedTarget||(a.fromElement===a.srcElement?a.toElement:a.fromElement)},movementX:function(a){if("movementX"in a)return a.movementX;var b=Eh;Eh=a.screenX;return Gh?"mousemove"===a.type?a.screenX-b:0:(Gh=!0,0)},movementY:function(a){if("movementY"in a)return a.movementY;var b=Fh;Fh=
a.screenY;return Hh?"mousemove"===a.type?a.screenY-b:0:(Hh=!0,0)}}),Ih=hc.extend({pointerId:null,width:null,height:null,pressure:null,tangentialPressure:null,tiltX:null,tiltY:null,twist:null,pointerType:null,isPrimary:null}),ic={mouseEnter:{registrationName:"onMouseEnter",dependencies:["mouseout","mouseover"]},mouseLeave:{registrationName:"onMouseLeave",dependencies:["mouseout","mouseover"]},pointerEnter:{registrationName:"onPointerEnter",dependencies:["pointerout","pointerover"]},pointerLeave:{registrationName:"onPointerLeave",
dependencies:["pointerout","pointerover"]}},jj={eventTypes:ic,extractEvents:function(a,b,c,d){var e="mouseover"===a||"pointerover"===a,f="mouseout"===a||"pointerout"===a;if(e&&(c.relatedTarget||c.fromElement)||!f&&!e)return null;e=d.window===d?d:(e=d.ownerDocument)?e.defaultView||e.parentWindow:window;f?(f=b,b=(b=c.relatedTarget||c.toElement)?oc(b):null):f=null;if(f===b)return null;var g=void 0,h=void 0,k=void 0,l=void 0;if("mouseout"===a||"mouseover"===a)g=hc,h=ic.mouseLeave,k=ic.mouseEnter,l="mouse";
else if("pointerout"===a||"pointerover"===a)g=Ih,h=ic.pointerLeave,k=ic.pointerEnter,l="pointer";var m=null==f?e:Ja(f);e=null==b?e:Ja(b);a=g.getPooled(h,f,c,d);a.type=l+"leave";a.target=m;a.relatedTarget=e;c=g.getPooled(k,b,c,d);c.type=l+"enter";c.target=e;c.relatedTarget=m;d=b;if(f&&d)a:{b=f;e=d;l=0;for(g=b;g;g=ma(g))l++;g=0;for(k=e;k;k=ma(k))g++;for(;0<l-g;)b=ma(b),l--;for(;0<g-l;)e=ma(e),g--;for(;l--;){if(b===e||b===e.alternate)break a;b=ma(b);e=ma(e)}b=null}else b=null;e=b;for(b=[];f&&f!==e;){l=
f.alternate;if(null!==l&&l===e)break;b.push(f);f=ma(f)}for(f=[];d&&d!==e;){l=d.alternate;if(null!==l&&l===e)break;f.push(d);d=ma(d)}for(d=0;d<b.length;d++)qd(b[d],"bubbled",a);for(d=f.length;0<d--;)qd(f[d],"captured",c);return[a,c]}},ui=Object.prototype.hasOwnProperty,U=ka.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.Scheduler,kj=U.unstable_cancelCallback,Ue=U.unstable_now,lj=U.unstable_scheduleCallback,mj=U.unstable_shouldYield,Jh=U.unstable_requestPaint,nj=U.unstable_runWithPriority,oj=U.unstable_getCurrentPriorityLevel,
pj=U.unstable_ImmediatePriority,qj=U.unstable_UserBlockingPriority,rj=U.unstable_NormalPriority,sj=U.unstable_LowPriority,tj=U.unstable_IdlePriority;new Map;new Map;new Set;new Map;var uj=Q.extend({animationName:null,elapsedTime:null,pseudoElement:null}),vj=Q.extend({clipboardData:function(a){return"clipboardData"in a?a.clipboardData:window.clipboardData}}),wj=gc.extend({relatedTarget:null}),xj={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",
Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},yj={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},
zj=gc.extend({key:function(a){if(a.key){var b=xj[a.key]||a.key;if("Unidentified"!==b)return b}return"keypress"===a.type?(a=zc(a),13===a?"Enter":String.fromCharCode(a)):"keydown"===a.type||"keyup"===a.type?yj[a.keyCode]||"Unidentified":""},location:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,repeat:null,locale:null,getModifierState:Hd,charCode:function(a){return"keypress"===a.type?zc(a):0},keyCode:function(a){return"keydown"===a.type||"keyup"===a.type?a.keyCode:0},which:function(a){return"keypress"===
a.type?zc(a):"keydown"===a.type||"keyup"===a.type?a.keyCode:0}}),Aj=hc.extend({dataTransfer:null}),Bj=gc.extend({touches:null,targetTouches:null,changedTouches:null,altKey:null,metaKey:null,ctrlKey:null,shiftKey:null,getModifierState:Hd}),Cj=Q.extend({propertyName:null,elapsedTime:null,pseudoElement:null}),Dj=hc.extend({deltaX:function(a){return"deltaX"in a?a.deltaX:"wheelDeltaX"in a?-a.wheelDeltaX:0},deltaY:function(a){return"deltaY"in a?a.deltaY:"wheelDeltaY"in a?-a.wheelDeltaY:"wheelDelta"in a?
-a.wheelDelta:0},deltaZ:null,deltaMode:null}),Kh=[["blur","blur",0],["cancel","cancel",0],["click","click",0],["close","close",0],["contextmenu","contextMenu",0],["copy","copy",0],["cut","cut",0],["auxclick","auxClick",0],["dblclick","doubleClick",0],["dragend","dragEnd",0],["dragstart","dragStart",0],["drop","drop",0],["focus","focus",0],["input","input",0],["invalid","invalid",0],["keydown","keyDown",0],["keypress","keyPress",0],["keyup","keyUp",0],["mousedown","mouseDown",0],["mouseup","mouseUp",
0],["paste","paste",0],["pause","pause",0],["play","play",0],["pointercancel","pointerCancel",0],["pointerdown","pointerDown",0],["pointerup","pointerUp",0],["ratechange","rateChange",0],["reset","reset",0],["seeked","seeked",0],["submit","submit",0],["touchcancel","touchCancel",0],["touchend","touchEnd",0],["touchstart","touchStart",0],["volumechange","volumeChange",0],["drag","drag",1],["dragenter","dragEnter",1],["dragexit","dragExit",1],["dragleave","dragLeave",1],["dragover","dragOver",1],["mousemove",
"mouseMove",1],["mouseout","mouseOut",1],["mouseover","mouseOver",1],["pointermove","pointerMove",1],["pointerout","pointerOut",1],["pointerover","pointerOver",1],["scroll","scroll",1],["toggle","toggle",1],["touchmove","touchMove",1],["wheel","wheel",1],["abort","abort",2],[Ah,"animationEnd",2],[Bh,"animationIteration",2],[Ch,"animationStart",2],["canplay","canPlay",2],["canplaythrough","canPlayThrough",2],["durationchange","durationChange",2],["emptied","emptied",2],["encrypted","encrypted",2],
["ended","ended",2],["error","error",2],["gotpointercapture","gotPointerCapture",2],["load","load",2],["loadeddata","loadedData",2],["loadedmetadata","loadedMetadata",2],["loadstart","loadStart",2],["lostpointercapture","lostPointerCapture",2],["playing","playing",2],["progress","progress",2],["seeking","seeking",2],["stalled","stalled",2],["suspend","suspend",2],["timeupdate","timeUpdate",2],[Dh,"transitionEnd",2],["waiting","waiting",2]],Lh={},Ve={},We=0;for(;We<Kh.length;We++){var Xe=Kh[We],Mh=
Xe[0],Ye=Xe[1],Ej=Xe[2],Nh="on"+(Ye[0].toUpperCase()+Ye.slice(1)),Oh={phasedRegistrationNames:{bubbled:Nh,captured:Nh+"Capture"},dependencies:[Mh],eventPriority:Ej};Lh[Ye]=Oh;Ve[Mh]=Oh}var Ph={eventTypes:Lh,getEventPriority:function(a){a=Ve[a];return void 0!==a?a.eventPriority:2},extractEvents:function(a,b,c,d){var e=Ve[a];if(!e)return null;switch(a){case "keypress":if(0===zc(c))return null;case "keydown":case "keyup":a=zj;break;case "blur":case "focus":a=wj;break;case "click":if(2===c.button)return null;
case "auxclick":case "dblclick":case "mousedown":case "mousemove":case "mouseup":case "mouseout":case "mouseover":case "contextmenu":a=hc;break;case "drag":case "dragend":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "dragstart":case "drop":a=Aj;break;case "touchcancel":case "touchend":case "touchmove":case "touchstart":a=Bj;break;case Ah:case Bh:case Ch:a=uj;break;case Dh:a=Cj;break;case "scroll":a=gc;break;case "wheel":a=Dj;break;case "copy":case "cut":case "paste":a=vj;
break;case "gotpointercapture":case "lostpointercapture":case "pointercancel":case "pointerdown":case "pointermove":case "pointerout":case "pointerover":case "pointerup":a=Ih;break;default:a=Q}b=a.getPooled(e,b,c,d);$a(b);return b}},wi=Ph.getEventPriority,Cc=[],Bc=!0,Sf=new ("function"===typeof WeakMap?WeakMap:Map),Fj=wa&&"documentMode"in document&&11>=document.documentMode,Yf={select:{phasedRegistrationNames:{bubbled:"onSelect",captured:"onSelectCapture"},dependencies:"blur contextmenu dragend focus keydown keyup mousedown mouseup selectionchange".split(" ")}},
fb=null,Ld=null,Cb=null,Kd=!1,Gj={eventTypes:Yf,extractEvents:function(a,b,c,d){var e=d.window===d?d.document:9===d.nodeType?d:d.ownerDocument,f;if(!(f=!e)){a:{e=Rf(e);f=ld.onSelect;for(var g=0;g<f.length;g++)if(!e.has(f[g])){e=!1;break a}e=!0}f=!e}if(f)return null;e=b?Ja(b):window;switch(a){case "focus":if(sf(e)||"true"===e.contentEditable)fb=e,Ld=b,Cb=null;break;case "blur":Cb=Ld=fb=null;break;case "mousedown":Kd=!0;break;case "contextmenu":case "mouseup":case "dragend":return Kd=!1,Xf(c,d);case "selectionchange":if(Fj)break;
case "keydown":case "keyup":return Xf(c,d)}return null}};Qe.injectEventPluginOrder("ResponderEventPlugin SimpleEventPlugin EnterLeaveEventPlugin ChangeEventPlugin SelectEventPlugin BeforeInputEventPlugin".split(" "));(function(a,b,c){od=a;pf=b;bf=c})(pd,df,Ja);Qe.injectEventPluginsByName({SimpleEventPlugin:Ph,EnterLeaveEventPlugin:jj,ChangeEventPlugin:ij,SelectEventPlugin:Gj,BeforeInputEventPlugin:hj});var jd=void 0,fh=function(a){return"undefined"!==typeof MSApp&&MSApp.execUnsafeLocalFunction?function(b,
c,d,e){MSApp.execUnsafeLocalFunction(function(){return a(b,c,d,e)})}:a}(function(a,b){if("http://www.w3.org/2000/svg"!==a.namespaceURI||"innerHTML"in a)a.innerHTML=b;else{jd=jd||document.createElement("div");jd.innerHTML="<svg>"+b+"</svg>";for(b=jd.firstChild;a.firstChild;)a.removeChild(a.firstChild);for(;b.firstChild;)a.appendChild(b.firstChild)}}),Wb=function(a,b){if(b){var c=a.firstChild;if(c&&c===a.lastChild&&3===c.nodeType){c.nodeValue=b;return}}a.textContent=b},Db={animationIterationCount:!0,
borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,
strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Hj=["Webkit","ms","Moz","O"];Object.keys(Db).forEach(function(a){Hj.forEach(function(b){b=b+a.charAt(0).toUpperCase()+a.substring(1);Db[b]=Db[a]})});var Ai=K({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0}),Ge=null,He=null,Ee="function"===typeof setTimeout?setTimeout:void 0,Oi="function"===typeof clearTimeout?clearTimeout:
void 0;new Set;var Sd=[],hb=-1,Aa={},I={current:Aa},M={current:!1},La=Aa,Ci=nj,Wd=lj,og=kj,Bi=oj,Gc=pj,hg=qj,ig=rj,jg=sj,kg=tj,ng={},Pi=mj,Wi=void 0!==Jh?Jh:function(){},oa=null,Xd=null,Yd=!1,Qh=Ue(),Y=1E4>Qh?Ue:function(){return Ue()-Qh},ae={current:null},Jc=null,jb=null,Ic=null,rg=0,Mc=2,Da=!1,Rb=ja.ReactCurrentBatchConfig,Cg=(new ka.Component).refs,Oc={isMounted:function(a){return(a=a._reactInternalFiber)?2===Ab(a):!1},enqueueSetState:function(a,b,c){a=a._reactInternalFiber;var d=ea(),e=Rb.suspense;
d=qb(d,a,e);e=Ba(d,e);e.payload=b;void 0!==c&&null!==c&&(e.callback=c);Ca(a,e);Sb(a,d)},enqueueReplaceState:function(a,b,c){a=a._reactInternalFiber;var d=ea(),e=Rb.suspense;d=qb(d,a,e);e=Ba(d,e);e.tag=1;e.payload=b;void 0!==c&&null!==c&&(e.callback=c);Ca(a,e);Sb(a,d)},enqueueForceUpdate:function(a,b){a=a._reactInternalFiber;var c=ea(),d=Rb.suspense;c=qb(c,a,d);d=Ba(c,d);d.tag=Mc;void 0!==b&&null!==b&&(d.callback=b);Ca(a,d);Sb(a,c)}},Tc=Array.isArray,sb=Dg(!0),oe=Dg(!1),Ib={},ba={current:Ib},Kb={current:Ib},
Jb={current:Ib},Ga=1,se=1,Tb=2,z={current:0},pb=0,Ui=2,Xb=4,Ji=8,Vi=16,bc=32,Oe=64,Ne=128,Vc=ja.ReactCurrentDispatcher,Lb=0,Fa=null,F=null,ca=null,nb=null,R=null,mb=null,Ob=0,da=null,Pb=0,Mb=!1,qa=null,Nb=0,Wc={readContext:aa,useCallback:S,useContext:S,useEffect:S,useImperativeHandle:S,useLayoutEffect:S,useMemo:S,useReducer:S,useRef:S,useState:S,useDebugValue:S,useResponder:S},Ei={readContext:aa,useCallback:function(a,b){ob().memoizedState=[a,void 0===b?null:b];return a},useContext:aa,useEffect:function(a,
b){return le(516,Ne|Oe,a,b)},useImperativeHandle:function(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return le(4,Xb|bc,Kg.bind(null,b,a),c)},useLayoutEffect:function(a,b){return le(4,Xb|bc,a,b)},useMemo:function(a,b){var c=ob();b=void 0===b?null:b;a=a();c.memoizedState=[a,b];return a},useReducer:function(a,b,c){var d=ob();b=void 0!==c?c(b):b;d.memoizedState=d.baseState=b;a=d.queue={last:null,dispatch:null,lastRenderedReducer:a,lastRenderedState:b};a=a.dispatch=Mg.bind(null,Fa,a);return[d.memoizedState,
a]},useRef:function(a){var b=ob();a={current:a};return b.memoizedState=a},useState:function(a){var b=ob();"function"===typeof a&&(a=a());b.memoizedState=b.baseState=a;a=b.queue={last:null,dispatch:null,lastRenderedReducer:Ig,lastRenderedState:a};a=a.dispatch=Mg.bind(null,Fa,a);return[b.memoizedState,a]},useDebugValue:Lg,useResponder:Lf},Gg={readContext:aa,useCallback:function(a,b){var c=Qb();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&ie(b,d[1]))return d[0];c.memoizedState=[a,
b];return a},useContext:aa,useEffect:function(a,b){return me(516,Ne|Oe,a,b)},useImperativeHandle:function(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return me(4,Xb|bc,Kg.bind(null,b,a),c)},useLayoutEffect:function(a,b){return me(4,Xb|bc,a,b)},useMemo:function(a,b){var c=Qb();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&ie(b,d[1]))return d[0];a=a();c.memoizedState=[a,b];return a},useReducer:Jg,useRef:function(a){return Qb().memoizedState},useState:function(a){return Jg(Ig,
a)},useDebugValue:Lg,useResponder:Lf},ra=null,rb=null,Pa=!1,Fi=ja.ReactCurrentOwner,pa=!1,Gi={},sh=void 0,Fe=void 0,rh=void 0,th=void 0;sh=function(a,b,c,d){for(c=b.child;null!==c;){if(5===c.tag||6===c.tag)a.appendChild(c.stateNode);else if(20===c.tag)a.appendChild(c.stateNode.instance);else if(4!==c.tag&&null!==c.child){c.child.return=c;c=c.child;continue}if(c===b)break;for(;null===c.sibling;){if(null===c.return||c.return===b)return;c=c.return}c.sibling.return=c.return;c=c.sibling}};Fe=function(a){};
rh=function(a,b,c,d,e){var f=a.memoizedProps;if(f!==d){var g=b.stateNode;Oa(ba.current);a=null;switch(c){case "input":f=Dd(g,f);d=Dd(g,d);a=[];break;case "option":f=Md(g,f);d=Md(g,d);a=[];break;case "select":f=K({},f,{value:void 0});d=K({},d,{value:void 0});a=[];break;case "textarea":f=Nd(g,f);d=Nd(g,d);a=[];break;default:"function"!==typeof f.onClick&&"function"===typeof d.onClick&&(g.onclick=Dc)}Pd(c,d);g=c=void 0;var h=null;for(c in f)if(!d.hasOwnProperty(c)&&f.hasOwnProperty(c)&&null!=f[c])if("style"===
c){var k=f[c];for(g in k)k.hasOwnProperty(g)&&(h||(h={}),h[g]="")}else"dangerouslySetInnerHTML"!==c&&"children"!==c&&"suppressContentEditableWarning"!==c&&"suppressHydrationWarning"!==c&&"autoFocus"!==c&&(Ya.hasOwnProperty(c)?a||(a=[]):(a=a||[]).push(c,null));for(c in d){var l=d[c];k=null!=f?f[c]:void 0;if(d.hasOwnProperty(c)&&l!==k&&(null!=l||null!=k))if("style"===c)if(k){for(g in k)!k.hasOwnProperty(g)||l&&l.hasOwnProperty(g)||(h||(h={}),h[g]="");for(g in l)l.hasOwnProperty(g)&&k[g]!==l[g]&&(h||
(h={}),h[g]=l[g])}else h||(a||(a=[]),a.push(c,h)),h=l;else"dangerouslySetInnerHTML"===c?(l=l?l.__html:void 0,k=k?k.__html:void 0,null!=l&&k!==l&&(a=a||[]).push(c,""+l)):"children"===c?k===l||"string"!==typeof l&&"number"!==typeof l||(a=a||[]).push(c,""+l):"suppressContentEditableWarning"!==c&&"suppressHydrationWarning"!==c&&(Ya.hasOwnProperty(c)?(null!=l&&na(e,c),a||k===l||(a=[])):(a=a||[]).push(c,l))}h&&(a=a||[]).push("style",h);e=a;(b.updateQueue=e)&&Ub(b)}};th=function(a,b,c,d){c!==d&&Ub(b)};var Ki=
"function"===typeof WeakSet?WeakSet:Set,Qi="function"===typeof WeakMap?WeakMap:Map,Si=Math.ceil,dd=ja.ReactCurrentDispatcher,qh=ja.ReactCurrentOwner,J=0,Ce=8,ha=16,ia=32,Va=0,mh=1,ed=2,cd=3,De=4,q=J,Ra=null,u=null,W=0,P=Va,ta=1073741823,Zb=1073741823,bd=null,$b=!1,xe=0,oh=500,n=null,Zc=!1,ye=null,Ha=null,Ie=!1,ac=null,Ke=90,Je=0,Ta=null,cc=0,Me=null,$c=0,xh=0,Sb=function(a,b){if(50<cc)throw cc=0,Me=null,m(Error(185));a=ad(a,b);if(null!==a){a.pingTime=0;var c=Ud();if(1073741823===b)if((q&Ce)!==J&&
(q&(ha|ia))===J)for(var d=O(a,1073741823,!0);null!==d;)d=d(!0);else Sa(a,99,1073741823),q===J&&V();else Sa(a,c,b);(q&4)===J||98!==c&&99!==c||(null===Ta?Ta=new Map([[a,b]]):(c=Ta.get(a),(void 0===c||c>b)&&Ta.set(a,b)))}},ph=void 0;ph=function(a,b,c){var d=b.expirationTime;if(null!==a){var e=b.pendingProps;if(a.memoizedProps!==e||M.current)pa=!0;else if(d<c){pa=!1;switch(b.tag){case 3:Wg(b);ne();break;case 5:Fg(b);if(b.mode&4&&1!==c&&e.hidden)return b.expirationTime=b.childExpirationTime=1,null;break;
case 1:G(b.type)&&Fc(b);break;case 4:ge(b,b.stateNode.containerInfo);break;case 10:pg(b,b.memoizedProps.value);break;case 13:if(null!==b.memoizedState){d=b.child.childExpirationTime;if(0!==d&&d>=c)return Xg(a,b,c);D(z,z.current&Ga,b);b=sa(a,b,c);return null!==b?b.sibling:null}D(z,z.current&Ga,b);break;case 19:d=b.childExpirationTime>=c;if(0!==(a.effectTag&64)){if(d)return Yg(a,b,c);b.effectTag|=64}e=b.memoizedState;null!==e&&(e.rendering=null,e.tail=null);D(z,z.current,b);if(!d)return null}return sa(a,
b,c)}}else pa=!1;b.expirationTime=0;switch(b.tag){case 2:d=b.type;null!==a&&(a.alternate=null,b.alternate=null,b.effectTag|=2);a=b.pendingProps;e=ib(b,I.current);kb(b,c);e=je(null,b,d,a,e,c);b.effectTag|=1;if("object"===typeof e&&null!==e&&"function"===typeof e.render&&void 0===e.$$typeof){b.tag=1;Hg();if(G(d)){var f=!0;Fc(b)}else f=!1;b.memoizedState=null!==e.state&&void 0!==e.state?e.state:null;var g=d.getDerivedStateFromProps;"function"===typeof g&&Nc(b,d,g,a);e.updater=Oc;b.stateNode=e;e._reactInternalFiber=
b;de(b,d,a,c);b=re(null,b,d,!0,f,c)}else b.tag=0,T(null,b,e,c),b=b.child;return b;case 16:e=b.elementType;null!==a&&(a.alternate=null,b.alternate=null,b.effectTag|=2);a=b.pendingProps;e=Di(e);b.type=e;f=b.tag=$i(e);a=X(e,a);switch(f){case 0:b=qe(null,b,e,a,c);break;case 1:b=Vg(null,b,e,a,c);break;case 11:b=Rg(null,b,e,a,c);break;case 14:b=Sg(null,b,e,X(e.type,a),d,c);break;default:throw m(Error(306),e,"");}return b;case 0:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:X(d,e),qe(a,b,d,e,c);
case 1:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:X(d,e),Vg(a,b,d,e,c);case 3:Wg(b);d=b.updateQueue;if(null===d)throw m(Error(282));e=b.memoizedState;e=null!==e?e.element:null;Gb(b,d,b.pendingProps,null,c);d=b.memoizedState.element;if(d===e)ne(),b=sa(a,b,c);else{e=b.stateNode;if(e=(null===a||null===a.child)&&e.hydrate)rb=Fb(b.stateNode.containerInfo.firstChild),ra=b,e=Pa=!0;e?(b.effectTag|=2,b.child=oe(b,null,d,c)):(T(a,b,d,c),ne());b=b.child}return b;case 5:return Fg(b),null===a&&Pg(b),
d=b.type,e=b.pendingProps,f=null!==a?a.memoizedProps:null,g=e.children,Rd(d,e)?g=null:null!==f&&Rd(d,f)&&(b.effectTag|=16),Ug(a,b),b.mode&4&&1!==c&&e.hidden?(b.expirationTime=b.childExpirationTime=1,b=null):(T(a,b,g,c),b=b.child),b;case 6:return null===a&&Pg(b),null;case 13:return Xg(a,b,c);case 4:return ge(b,b.stateNode.containerInfo),d=b.pendingProps,null===a?b.child=sb(b,null,d,c):T(a,b,d,c),b.child;case 11:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:X(d,e),Rg(a,b,d,e,c);case 7:return T(a,
b,b.pendingProps,c),b.child;case 8:return T(a,b,b.pendingProps.children,c),b.child;case 12:return T(a,b,b.pendingProps.children,c),b.child;case 10:a:{d=b.type._context;e=b.pendingProps;g=b.memoizedProps;f=e.value;pg(b,f);if(null!==g){var h=g.value;f=Ka(h,f)?0:("function"===typeof d._calculateChangedBits?d._calculateChangedBits(h,f):1073741823)|0;if(0===f){if(g.children===e.children&&!M.current){b=sa(a,b,c);break a}}else for(h=b.child,null!==h&&(h.return=b);null!==h;){var k=h.dependencies;if(null!==
k){g=h.child;for(var l=k.firstContext;null!==l;){if(l.context===d&&0!==(l.observedBits&f)){1===h.tag&&(l=Ba(c,null),l.tag=Mc,Ca(h,l));h.expirationTime<c&&(h.expirationTime=c);l=h.alternate;null!==l&&l.expirationTime<c&&(l.expirationTime=c);qg(h.return,c);k.expirationTime<c&&(k.expirationTime=c);break}l=l.next}}else g=10===h.tag?h.type===b.type?null:h.child:h.child;if(null!==g)g.return=h;else for(g=h;null!==g;){if(g===b){g=null;break}h=g.sibling;if(null!==h){h.return=g.return;g=h;break}g=g.return}h=
g}}T(a,b,e.children,c);b=b.child}return b;case 9:return e=b.type,f=b.pendingProps,d=f.children,kb(b,c),e=aa(e,f.unstable_observedBits),d=d(e),b.effectTag|=1,T(a,b,d,c),b.child;case 14:return e=b.type,f=X(e,b.pendingProps),f=X(e.type,f),Sg(a,b,e,f,d,c);case 15:return Tg(a,b,b.type,b.pendingProps,d,c);case 17:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:X(d,e),null!==a&&(a.alternate=null,b.alternate=null,b.effectTag|=2),b.tag=1,G(d)?(a=!0,Fc(b)):a=!1,kb(b,c),Ag(b,d,e,c),de(b,d,e,c),re(null,
b,d,!0,a,c);case 19:return Yg(a,b,c)}throw m(Error(156));};var Le=null,we=null,fa=function(a,b,c,d){return new Zi(a,b,c,d)};ud=function(a,b,c){switch(b){case "input":Ed(a,c);b=c.name;if("radio"===c.type&&null!=b){for(c=a;c.parentNode;)c=c.parentNode;c=c.querySelectorAll("input[name="+JSON.stringify(""+b)+'][type="radio"]');for(b=0;b<c.length;b++){var d=c[b];if(d!==a&&d.form===a.form){var e=pd(d);if(!e)throw m(Error(90));vf(d);Ed(d,e)}}}break;case "textarea":$f(a,c);break;case "select":b=c.value,null!=
b&&gb(a,!!c.multiple,b,!1)}};dc.prototype.render=function(a){if(!this._defer)throw m(Error(250));this._hasChildren=!0;this._children=a;var b=this._root._internalRoot,c=this._expirationTime,d=new ec;wh(a,b,null,c,null,d._onCommit);return d};dc.prototype.then=function(a){if(this._didComplete)a();else{var b=this._callbacks;null===b&&(b=this._callbacks=[]);b.push(a)}};dc.prototype.commit=function(){var a=this._root._internalRoot,b=a.firstBatch;if(!this._defer||null===b)throw m(Error(251));if(this._hasChildren){var c=
this._expirationTime;if(b!==this){this._hasChildren&&(c=this._expirationTime=b._expirationTime,this.render(this._children));for(var d=null,e=b;e!==this;)d=e,e=e._next;if(null===d)throw m(Error(251));d._next=e._next;this._next=b;a.firstBatch=this}this._defer=!1;b=c;if((q&(ha|ia))!==J)throw m(Error(253));Hc(O.bind(null,a,b));V();b=this._next;this._next=null;b=a.firstBatch=b;null!==b&&b._hasChildren&&b.render(b._children)}else this._next=null,this._defer=!1};dc.prototype._onComplete=function(){if(!this._didComplete){this._didComplete=
!0;var a=this._callbacks;if(null!==a)for(var b=0;b<a.length;b++)(0,a[b])()}};ec.prototype.then=function(a){if(this._didCommit)a();else{var b=this._callbacks;null===b&&(b=this._callbacks=[]);b.push(a)}};ec.prototype._onCommit=function(){if(!this._didCommit){this._didCommit=!0;var a=this._callbacks;if(null!==a)for(var b=0;b<a.length;b++){var c=a[b];if("function"!==typeof c)throw m(Error(191),c);c()}}};hd.prototype.render=gd.prototype.render=function(a,b){var c=this._internalRoot,d=new ec;b=void 0===
b?null:b;null!==b&&d.then(b);fd(a,c,null,d._onCommit);return d};hd.prototype.unmount=gd.prototype.unmount=function(a){var b=this._internalRoot,c=new ec;a=void 0===a?null:a;null!==a&&c.then(a);fd(null,b,null,c._onCommit);return c};hd.prototype.createBatch=function(){var a=new dc(this),b=a._expirationTime,c=this._internalRoot,d=c.firstBatch;if(null===d)c.firstBatch=a,a._next=null;else{for(c=null;null!==d&&d._expirationTime>=b;)c=d,d=d._next;a._next=d;null!==c&&(c._next=a)}return a};(function(a,b,c,
d){Gd=a;Pf=b;wd=c;Qf=d})(jh,Be,Ae,function(a,b){var c=q;q|=2;try{return a(b)}finally{q=c,q===J&&V()}});var Rh={createPortal:yh,findDOMNode:function(a){if(null==a)a=null;else if(1!==a.nodeType){var b=a._reactInternalFiber;if(void 0===b){if("function"===typeof a.render)throw m(Error(188));throw m(Error(268),Object.keys(a));}a=Nf(b);a=null===a?null:a.stateNode}return a},hydrate:function(a,b,c){if(!Wa(b))throw m(Error(200));return id(null,a,b,!0,c)},render:function(a,b,c){if(!Wa(b))throw m(Error(200));
return id(null,a,b,!1,c)},unstable_renderSubtreeIntoContainer:function(a,b,c,d){if(!Wa(c))throw m(Error(200));if(null==a||void 0===a._reactInternalFiber)throw m(Error(38));return id(a,b,c,!1,d)},unmountComponentAtNode:function(a){if(!Wa(a))throw m(Error(40));return a._reactRootContainer?(kh(function(){id(null,null,a,!1,function(){a._reactRootContainer=null})}),!0):!1},unstable_createPortal:function(){return yh.apply(void 0,arguments)},unstable_batchedUpdates:jh,unstable_interactiveUpdates:function(a,
b,c,d){Ae();return Be(a,b,c,d)},unstable_discreteUpdates:Be,unstable_flushDiscreteUpdates:Ae,flushSync:function(a,b){if((q&(ha|ia))!==J)throw m(Error(187));var c=q;q|=1;try{return Ma(99,a.bind(null,b))}finally{q=c,V()}},unstable_createRoot:function(a,b){if(!Wa(a))throw m(Error(299),"unstable_createRoot");return new hd(a,null!=b&&!0===b.hydrate)},unstable_createSyncRoot:function(a,b){if(!Wa(a))throw m(Error(299),"unstable_createRoot");return new gd(a,1,null!=b&&!0===b.hydrate)},unstable_flushControlled:function(a){var b=
q;q|=1;try{Ma(99,a)}finally{q=b,q===J&&V()}},__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{Events:[df,Ja,pd,Qe.injectEventPluginsByName,kd,$a,function(a){nd(a,$h)},qf,rf,Ac,nc,Yb,{current:!1}]}};(function(a){var b=a.findFiberByHostInstance;return Yi(K({},a,{overrideHookState:null,overrideProps:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ja.ReactCurrentDispatcher,findHostInstanceByFiber:function(a){a=Nf(a);return null===a?null:a.stateNode},findFiberByHostInstance:function(a){return b?
b(a):null},findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null}))})({findFiberByHostInstance:oc,bundleType:0,version:"16.9.0",rendererPackageName:"react-dom"});var Sh={default:Rh},Th=Sh&&Rh||Sh;return Th.default||Th});
//static-content-hash-trigger-NON
!function(f){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=f();else if("function"==typeof define&&define.amd)define([],f);else{var g;g="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,g.PropTypes=f()}}(function(){return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module){"use strict";var emptyFunction=require(4),invariant=require(5),ReactPropTypesSecret=require(3);module.exports=function(){function e(e,r,t,n,p,o){o!==ReactPropTypesSecret&&invariant(!1,"Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types")}function r(){return e}e.isRequired=e;var t={array:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:r,element:e,instanceOf:r,node:e,objectOf:r,oneOf:r,oneOfType:r,shape:r,exact:r};return t.checkPropTypes=emptyFunction,t.PropTypes=t,t}},{3:3,4:4,5:5}],2:[function(require,module){module.exports=require(1)()},{1:1}],3:[function(require,module){"use strict";var ReactPropTypesSecret="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";module.exports=ReactPropTypesSecret},{}],4:[function(require,module){"use strict";function makeEmptyFunction(arg){return function(){return arg}}var emptyFunction=function(){};emptyFunction.thatReturns=makeEmptyFunction,emptyFunction.thatReturnsFalse=makeEmptyFunction(!1),emptyFunction.thatReturnsTrue=makeEmptyFunction(!0),emptyFunction.thatReturnsNull=makeEmptyFunction(null),emptyFunction.thatReturnsThis=function(){return this},emptyFunction.thatReturnsArgument=function(arg){return arg},module.exports=emptyFunction},{}],5:[function(require,module){"use strict";function invariant(condition,format,a,b,c,d,e,f){if(validateFormat(format),!condition){var error;if(void 0===format)error=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var args=[a,b,c,d,e,f],argIndex=0;error=new Error(format.replace(/%s/g,function(){return args[argIndex++]})),error.name="Invariant Violation"}throw error.framesToPop=1,error}}var validateFormat=function(){};module.exports=invariant},{}]},{},[2])(2)});
//static-content-hash-trigger-GCC
/** @license React v16.12.0
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';(function(b,c){"object"===typeof exports&&"undefined"!==typeof module?c(exports):"function"===typeof define&&define.amd?define(["exports"],c):c(b.ReactIs={})})(this,function(b){function c(a){if("object"===typeof a&&null!==a){var b=a.$$typeof;switch(b){case r:switch(a=a.type,a){case t:case e:case f:case g:case h:case k:return a;default:switch(a=a&&a.$$typeof,a){case l:case m:case n:case p:case q:return a;default:return b}}case u:return b}}}function v(a){return c(a)===e}var d="function"===
typeof Symbol&&Symbol.for,r=d?Symbol.for("react.element"):60103,u=d?Symbol.for("react.portal"):60106,f=d?Symbol.for("react.fragment"):60107,h=d?Symbol.for("react.strict_mode"):60108,g=d?Symbol.for("react.profiler"):60114,q=d?Symbol.for("react.provider"):60109,l=d?Symbol.for("react.context"):60110,t=d?Symbol.for("react.async_mode"):60111,e=d?Symbol.for("react.concurrent_mode"):60111,m=d?Symbol.for("react.forward_ref"):60112,k=d?Symbol.for("react.suspense"):60113,w=d?Symbol.for("react.suspense_list"):
60120,p=d?Symbol.for("react.memo"):60115,n=d?Symbol.for("react.lazy"):60116,x=d?Symbol.for("react.fundamental"):60117,y=d?Symbol.for("react.responder"):60118,z=d?Symbol.for("react.scope"):60119;b.typeOf=c;b.AsyncMode=t;b.ConcurrentMode=e;b.ContextConsumer=l;b.ContextProvider=q;b.Element=r;b.ForwardRef=m;b.Fragment=f;b.Lazy=n;b.Memo=p;b.Portal=u;b.Profiler=g;b.StrictMode=h;b.Suspense=k;b.isValidElementType=function(a){return"string"===typeof a||"function"===typeof a||a===f||a===e||a===g||a===h||a===
k||a===w||"object"===typeof a&&null!==a&&(a.$$typeof===n||a.$$typeof===p||a.$$typeof===q||a.$$typeof===l||a.$$typeof===m||a.$$typeof===x||a.$$typeof===y||a.$$typeof===z)};b.isAsyncMode=function(a){return v(a)||c(a)===t};b.isConcurrentMode=v;b.isContextConsumer=function(a){return c(a)===l};b.isContextProvider=function(a){return c(a)===q};b.isElement=function(a){return"object"===typeof a&&null!==a&&a.$$typeof===r};b.isForwardRef=function(a){return c(a)===m};b.isFragment=function(a){return c(a)===f};
b.isLazy=function(a){return c(a)===n};b.isMemo=function(a){return c(a)===p};b.isPortal=function(a){return c(a)===u};b.isProfiler=function(a){return c(a)===g};b.isStrictMode=function(a){return c(a)===h};b.isSuspense=function(a){return c(a)===k};Object.defineProperty(b,"__esModule",{value:!0})});
//static-content-hash-trigger-GCC
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("react-is"),require("react")):"function"==typeof define&&define.amd?define(["react-is","react"],t):(e=e||self).styled=t(e.ReactIs,e.React)}(this,(function(e,t){"use strict";var r="default"in e?e.default:e,n="default"in t?t.default:t;function i(e){return e&&"string"==typeof e.styledComponentId}var a=function(e,t){for(var r=[e[0]],n=0,i=t.length;n<i;n+=1)r.push(t[n],e[n+1]);return r},o=function(e){return"object"==typeof e&&e.constructor===Object},s=Object.freeze([]),c=Object.freeze({});function l(e){return"function"==typeof e}function u(){return(u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}var f="undefined"!=typeof process&&(process.env.REACT_APP_SC_ATTR||process.env.SC_ATTR)||"data-styled",d="undefined"!=typeof window&&"HTMLElement"in window,h="boolean"==typeof SC_DISABLE_SPEEDY&&SC_DISABLE_SPEEDY||"undefined"!=typeof process&&(process.env.REACT_APP_SC_DISABLE_SPEEDY||process.env.SC_DISABLE_SPEEDY)||!1,p={},g=function(){return"undefined"!=typeof __webpack_nonce__?__webpack_nonce__:null};function m(e){for(var t=arguments.length,r=new Array(t>1?t-1:0),n=1;n<t;n++)r[n-1]=arguments[n];throw new Error("An error occurred. See https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/utils/errors.md#"+e+" for more information."+(r.length>0?" Additional arguments: "+r.join(", "):""))}var v=function(e){var t=document.head,r=e||t,n=document.createElement("style"),i=function(e){for(var t=e.childNodes,r=t.length;r>=0;r--){var n=t[r];if(n&&1===n.nodeType&&n.hasAttribute(f))return n}}(r),a=void 0!==i?i.nextSibling:null;n.setAttribute(f,"active"),n.setAttribute("data-styled-version","5.0.1");var o=g();return o&&n.setAttribute("nonce",o),r.insertBefore(n,a),n},y=function(){function e(e){var t=this.element=v(e);t.appendChild(document.createTextNode("")),this.sheet=function(e){if(e.sheet)return e.sheet;for(var t=document.styleSheets,r=0,n=t.length;r<n;r++){var i=t[r];if(i.ownerNode===e)return i}m(17)}(t),this.length=0}var t=e.prototype;return t.insertRule=function(e,t){try{return this.sheet.insertRule(t,e),this.length++,!0}catch(e){return!1}},t.deleteRule=function(e){this.sheet.deleteRule(e),this.length--},t.getRule=function(e){var t=this.sheet.cssRules[e];return void 0!==t&&"string"==typeof t.cssText?t.cssText:""},e}(),b=function(){function e(e){var t=this.element=v(e);this.nodes=t.childNodes,this.length=0}var t=e.prototype;return t.insertRule=function(e,t){if(e<=this.length&&e>=0){var r=document.createTextNode(t),n=this.nodes[e];return this.element.insertBefore(r,n||null),this.length++,!0}return!1},t.deleteRule=function(e){this.element.removeChild(this.nodes[e]),this.length--},t.getRule=function(e){return e<this.length?this.nodes[e].textContent:""},e}(),k=function(){function e(e){this.rules=[],this.length=0}var t=e.prototype;return t.insertRule=function(e,t){return e<=this.length&&(this.rules.splice(e,0,t),this.length++,!0)},t.deleteRule=function(e){this.rules.splice(e,1),this.length--},t.getRule=function(e){return e<this.length?this.rules[e]:""},e}(),w=function(){function e(e){this.groupSizes=new Uint32Array(512),this.length=512,this.tag=e}var t=e.prototype;return t.indexOfGroup=function(e){for(var t=0,r=0;r<e;r++)t+=this.groupSizes[r];return t},t.insertRules=function(e,t){if(e>=this.groupSizes.length){for(var r=this.groupSizes,n=r.length,i=n;e>=i;)(i<<=1)<0&&m(16,""+e);this.groupSizes=new Uint32Array(i),this.groupSizes.set(r),this.length=i;for(var a=n;a<i;a++)this.groupSizes[a]=0}for(var o=this.indexOfGroup(e+1),s=0,c=t.length;s<c;s++)this.tag.insertRule(o,t[s])&&(this.groupSizes[e]++,o++)},t.clearGroup=function(e){if(e<this.length){var t=this.groupSizes[e],r=this.indexOfGroup(e),n=r+t;this.groupSizes[e]=0;for(var i=r;i<n;i++)this.tag.deleteRule(r)}},t.getGroup=function(e){var t="";if(e>=this.length||0===this.groupSizes[e])return t;for(var r=this.groupSizes[e],n=this.indexOfGroup(e),i=n+r,a=n;a<i;a++)t+=this.tag.getRule(a)+"\n";return t},e}(),S=new Map,C=new Map,A=1,x=function(e){if(S.has(e))return S.get(e);var t=A++;return S.set(e,t),C.set(t,e),t},O=function(e){return C.get(e)},I=function(e,t){t>=A&&(A=t+1),S.set(e,t),C.set(t,e)},R="style["+f+'][data-styled-version="5.0.1"]',T=/(?:\s*)?(.*?){((?:{[^}]*}|(?!{).*?)*)}/g,P=new RegExp("^"+f+'\\.g(\\d+)\\[id="([\\w\\d-]+)"\\]'),j=function(e,t,r){for(var n,i=r.split(","),a=0,o=i.length;a<o;a++)(n=i[a])&&e.registerName(t,n)},E=function(e,t){for(var r,n=t.innerHTML,i=[];r=T.exec(n);){var a=r[1].match(P);if(a){var o=0|parseInt(a[1],10),s=a[2];0!==o&&(I(s,o),j(e,s,r[2].split('"')[1]),e.getTag().insertRules(o,i)),i.length=0}else i.push(r[0].trim())}},N=d,_={isServer:!d,useCSSOMInjection:!h},z=function(){function e(e,t,r){void 0===e&&(e=_),void 0===t&&(t={}),this.options=u({},_,{},e),this.gs=t,this.names=new Map(r),!this.options.isServer&&d&&N&&(N=!1,function(e){for(var t=document.querySelectorAll(R),r=0,n=t.length;r<n;r++){var i=t[r];i&&"active"!==i.getAttribute(f)&&(E(e,i),i.parentNode&&i.parentNode.removeChild(i))}}(this))}e.registerId=function(e){return x(e)};var t=e.prototype;return t.reconstructWithOptions=function(t){return new e(u({},this.options,{},t),this.gs,this.names)},t.allocateGSInstance=function(e){return this.gs[e]=(this.gs[e]||0)+1},t.getTag=function(){return this.tag||(this.tag=(t=this.options,r=t.isServer,n=t.useCSSOMInjection,i=t.target,e=r?new k(i):n?new y(i):new b(i),new w(e)));var e,t,r,n,i},t.hasNameForId=function(e,t){return this.names.has(e)&&this.names.get(e).has(t)},t.registerName=function(e,t){if(x(e),this.names.has(e))this.names.get(e).add(t);else{var r=new Set;r.add(t),this.names.set(e,r)}},t.insertRules=function(e,t,r){this.registerName(e,t),this.getTag().insertRules(x(e),r)},t.clearNames=function(e){this.names.has(e)&&this.names.get(e).clear()},t.clearRules=function(e){this.getTag().clearGroup(x(e)),this.clearNames(e)},t.clearTag=function(){this.tag=void 0},t.toString=function(){return function(e){for(var t=e.getTag(),r=t.length,n="",i=0;i<r;i++){var a=O(i);if(void 0!==a){var o=e.names.get(a),s=t.getGroup(i);if(void 0!==o&&0!==s.length){var c=f+".g"+i+'[id="'+a+'"]',l="";void 0!==o&&o.forEach((function(e){e.length>0&&(l+=e+",")})),n+=""+s+c+'{content:"'+l+'"}\n'}}}return n}(this)},e}();function M(e){function t(e,t,n){var i=t.trim().split(p);t=i;var a=i.length,o=e.length;switch(o){case 0:case 1:var s=0;for(e=0===o?"":e[0]+" ";s<a;++s)t[s]=r(e,t[s],n).trim();break;default:var c=s=0;for(t=[];s<a;++s)for(var l=0;l<o;++l)t[c++]=r(e[l]+" ",i[s],n).trim()}return t}function r(e,t,r){var n=t.charCodeAt(0);switch(33>n&&(n=(t=t.trim()).charCodeAt(0)),n){case 38:return t.replace(g,"$1"+e.trim());case 58:return e.trim()+t.replace(g,"$1"+e.trim());default:if(0<1*r&&0<t.indexOf("\f"))return t.replace(g,(58===e.charCodeAt(0)?"":"$1")+e.trim())}return e+t}function n(e,t,r,a){var o=e+";",s=2*t+3*r+4*a;if(944===s){e=o.indexOf(":",9)+1;var c=o.substring(e,o.length-1).trim();return c=o.substring(0,e).trim()+c+";",1===T||2===T&&i(c,1)?"-webkit-"+c+c:c}if(0===T||2===T&&!i(o,1))return o;switch(s){case 1015:return 97===o.charCodeAt(10)?"-webkit-"+o+o:o;case 951:return 116===o.charCodeAt(3)?"-webkit-"+o+o:o;case 963:return 110===o.charCodeAt(5)?"-webkit-"+o+o:o;case 1009:if(100!==o.charCodeAt(4))break;case 969:case 942:return"-webkit-"+o+o;case 978:return"-webkit-"+o+"-moz-"+o+o;case 1019:case 983:return"-webkit-"+o+"-moz-"+o+"-ms-"+o+o;case 883:if(45===o.charCodeAt(8))return"-webkit-"+o+o;if(0<o.indexOf("image-set(",11))return o.replace(x,"$1-webkit-$2")+o;break;case 932:if(45===o.charCodeAt(4))switch(o.charCodeAt(5)){case 103:return"-webkit-box-"+o.replace("-grow","")+"-webkit-"+o+"-ms-"+o.replace("grow","positive")+o;case 115:return"-webkit-"+o+"-ms-"+o.replace("shrink","negative")+o;case 98:return"-webkit-"+o+"-ms-"+o.replace("basis","preferred-size")+o}return"-webkit-"+o+"-ms-"+o+o;case 964:return"-webkit-"+o+"-ms-flex-"+o+o;case 1023:if(99!==o.charCodeAt(8))break;return"-webkit-box-pack"+(c=o.substring(o.indexOf(":",15)).replace("flex-","").replace("space-between","justify"))+"-webkit-"+o+"-ms-flex-pack"+c+o;case 1005:return d.test(o)?o.replace(f,":-webkit-")+o.replace(f,":-moz-")+o:o;case 1e3:switch(t=(c=o.substring(13).trim()).indexOf("-")+1,c.charCodeAt(0)+c.charCodeAt(t)){case 226:c=o.replace(b,"tb");break;case 232:c=o.replace(b,"tb-rl");break;case 220:c=o.replace(b,"lr");break;default:return o}return"-webkit-"+o+"-ms-"+c+o;case 1017:if(-1===o.indexOf("sticky",9))break;case 975:switch(t=(o=e).length-10,s=(c=(33===o.charCodeAt(t)?o.substring(0,t):o).substring(e.indexOf(":",7)+1).trim()).charCodeAt(0)+(0|c.charCodeAt(7))){case 203:if(111>c.charCodeAt(8))break;case 115:o=o.replace(c,"-webkit-"+c)+";"+o;break;case 207:case 102:o=o.replace(c,"-webkit-"+(102<s?"inline-":"")+"box")+";"+o.replace(c,"-webkit-"+c)+";"+o.replace(c,"-ms-"+c+"box")+";"+o}return o+";";case 938:if(45===o.charCodeAt(5))switch(o.charCodeAt(6)){case 105:return c=o.replace("-items",""),"-webkit-"+o+"-webkit-box-"+c+"-ms-flex-"+c+o;case 115:return"-webkit-"+o+"-ms-flex-item-"+o.replace(S,"")+o;default:return"-webkit-"+o+"-ms-flex-line-pack"+o.replace("align-content","").replace(S,"")+o}break;case 973:case 989:if(45!==o.charCodeAt(3)||122===o.charCodeAt(4))break;case 931:case 953:if(!0===A.test(e))return 115===(c=e.substring(e.indexOf(":")+1)).charCodeAt(0)?n(e.replace("stretch","fill-available"),t,r,a).replace(":fill-available",":stretch"):o.replace(c,"-webkit-"+c)+o.replace(c,"-moz-"+c.replace("fill-",""))+o;break;case 962:if(o="-webkit-"+o+(102===o.charCodeAt(5)?"-ms-"+o:"")+o,211===r+a&&105===o.charCodeAt(13)&&0<o.indexOf("transform",10))return o.substring(0,o.indexOf(";",27)+1).replace(h,"$1-webkit-$2")+o}return o}function i(e,t){var r=e.indexOf(1===t?":":"{"),n=e.substring(0,3!==t?r:10);return r=e.substring(r+1,e.length-1),N(2!==t?n:n.replace(C,"$1"),r,t)}function a(e,t){var r=n(t,t.charCodeAt(0),t.charCodeAt(1),t.charCodeAt(2));return r!==t+";"?r.replace(w," or ($1)").substring(4):"("+t+")"}function o(e,t,r,n,i,a,o,s,l,u){for(var f,d=0,h=t;d<E;++d)switch(f=j[d].call(c,e,h,r,n,i,a,o,s,l,u)){case void 0:case!1:case!0:case null:break;default:h=f}if(h!==t)return h}function s(e){return void 0!==(e=e.prefix)&&(N=null,e?"function"!=typeof e?T=1:(T=2,N=e):T=0),s}function c(e,r){var s=e;if(33>s.charCodeAt(0)&&(s=s.trim()),s=[s],0<E){var c=o(-1,r,s,s,I,O,0,0,0,0);void 0!==c&&"string"==typeof c&&(r=c)}var f=function e(r,s,c,f,d){for(var h,p,g,b,w,S=0,C=0,A=0,x=0,j=0,N=0,z=g=h=0,M=0,$=0,D=0,L=0,G=c.length,F=G-1,H="",B="",W="",q="";M<G;){if(p=c.charCodeAt(M),M===F&&0!==C+x+A+S&&(0!==C&&(p=47===C?10:47),x=A=S=0,G++,F++),0===C+x+A+S){if(M===F&&(0<$&&(H=H.replace(u,"")),0<H.trim().length)){switch(p){case 32:case 9:case 59:case 13:case 10:break;default:H+=c.charAt(M)}p=59}switch(p){case 123:for(h=(H=H.trim()).charCodeAt(0),g=1,L=++M;M<G;){switch(p=c.charCodeAt(M)){case 123:g++;break;case 125:g--;break;case 47:switch(p=c.charCodeAt(M+1)){case 42:case 47:e:{for(z=M+1;z<F;++z)switch(c.charCodeAt(z)){case 47:if(42===p&&42===c.charCodeAt(z-1)&&M+2!==z){M=z+1;break e}break;case 10:if(47===p){M=z+1;break e}}M=z}}break;case 91:p++;case 40:p++;case 34:case 39:for(;M++<F&&c.charCodeAt(M)!==p;);}if(0===g)break;M++}switch(g=c.substring(L,M),0===h&&(h=(H=H.replace(l,"").trim()).charCodeAt(0)),h){case 64:switch(0<$&&(H=H.replace(u,"")),p=H.charCodeAt(1)){case 100:case 109:case 115:case 45:$=s;break;default:$=P}if(L=(g=e(s,$,g,p,d+1)).length,0<E&&(w=o(3,g,$=t(P,H,D),s,I,O,L,p,d,f),H=$.join(""),void 0!==w&&0===(L=(g=w.trim()).length)&&(p=0,g="")),0<L)switch(p){case 115:H=H.replace(k,a);case 100:case 109:case 45:g=H+"{"+g+"}";break;case 107:g=(H=H.replace(m,"$1 $2"))+"{"+g+"}",g=1===T||2===T&&i("@"+g,3)?"@-webkit-"+g+"@"+g:"@"+g;break;default:g=H+g,112===f&&(B+=g,g="")}else g="";break;default:g=e(s,t(s,H,D),g,f,d+1)}W+=g,g=D=$=z=h=0,H="",p=c.charCodeAt(++M);break;case 125:case 59:if(1<(L=(H=(0<$?H.replace(u,""):H).trim()).length))switch(0===z&&(h=H.charCodeAt(0),45===h||96<h&&123>h)&&(L=(H=H.replace(" ",":")).length),0<E&&void 0!==(w=o(1,H,s,r,I,O,B.length,f,d,f))&&0===(L=(H=w.trim()).length)&&(H="\0\0"),h=H.charCodeAt(0),p=H.charCodeAt(1),h){case 0:break;case 64:if(105===p||99===p){q+=H+c.charAt(M);break}default:58!==H.charCodeAt(L-1)&&(B+=n(H,h,p,H.charCodeAt(2)))}D=$=z=h=0,H="",p=c.charCodeAt(++M)}}switch(p){case 13:case 10:47===C?C=0:0===1+h&&107!==f&&0<H.length&&($=1,H+="\0"),0<E*_&&o(0,H,s,r,I,O,B.length,f,d,f),O=1,I++;break;case 59:case 125:if(0===C+x+A+S){O++;break}default:switch(O++,b=c.charAt(M),p){case 9:case 32:if(0===x+S+C)switch(j){case 44:case 58:case 9:case 32:b="";break;default:32!==p&&(b=" ")}break;case 0:b="\\0";break;case 12:b="\\f";break;case 11:b="\\v";break;case 38:0===x+C+S&&($=D=1,b="\f"+b);break;case 108:if(0===x+C+S+R&&0<z)switch(M-z){case 2:112===j&&58===c.charCodeAt(M-3)&&(R=j);case 8:111===N&&(R=N)}break;case 58:0===x+C+S&&(z=M);break;case 44:0===C+A+x+S&&($=1,b+="\r");break;case 34:case 39:0===C&&(x=x===p?0:0===x?p:x);break;case 91:0===x+C+A&&S++;break;case 93:0===x+C+A&&S--;break;case 41:0===x+C+S&&A--;break;case 40:if(0===x+C+S){if(0===h)switch(2*j+3*N){case 533:break;default:h=1}A++}break;case 64:0===C+A+x+S+z+g&&(g=1);break;case 42:case 47:if(!(0<x+S+A))switch(C){case 0:switch(2*p+3*c.charCodeAt(M+1)){case 235:C=47;break;case 220:L=M,C=42}break;case 42:47===p&&42===j&&L+2!==M&&(33===c.charCodeAt(L+2)&&(B+=c.substring(L,M+1)),b="",C=0)}}0===C&&(H+=b)}N=j,j=p,M++}if(0<(L=B.length)){if($=s,0<E&&(void 0!==(w=o(2,B,$,r,I,O,L,f,d,f))&&0===(B=w).length))return q+B+W;if(B=$.join(",")+"{"+B+"}",0!=T*R){switch(2!==T||i(B,2)||(R=0),R){case 111:B=B.replace(y,":-moz-$1")+B;break;case 112:B=B.replace(v,"::-webkit-input-$1")+B.replace(v,"::-moz-$1")+B.replace(v,":-ms-input-$1")+B}R=0}}return q+B+W}(P,s,r,0,0);return 0<E&&(void 0!==(c=o(-2,f,s,s,I,O,f.length,0,0,0))&&(f=c)),"",R=0,O=I=1,f}var l=/^\0+/g,u=/[\0\r\f]/g,f=/: */g,d=/zoo|gra/,h=/([,: ])(transform)/g,p=/,\r+?/g,g=/([\t\r\n ])*\f?&/g,m=/@(k\w+)\s*(\S*)\s*/,v=/::(place)/g,y=/:(read-only)/g,b=/[svh]\w+-[tblr]{2}/,k=/\(\s*(.*)\s*\)/g,w=/([\s\S]*?);/g,S=/-self|flex-/g,C=/[^]*?(:[rp][el]a[\w-]+)[^]*/,A=/stretch|:\s*\w+\-(?:conte|avail)/,x=/([^-])(image-set\()/,O=1,I=1,R=0,T=1,P=[],j=[],E=0,N=null,_=0;return c.use=function e(t){switch(t){case void 0:case null:E=j.length=0;break;default:if("function"==typeof t)j[E++]=t;else if("object"==typeof t)for(var r=0,n=t.length;r<n;++r)e(t[r]);else _=0|!!t}return e},c.set=s,void 0!==e&&s(e),c}var $=function(e,t){for(var r=t.length;r;)e=33*e^t.charCodeAt(--r);return e},D=function(e){return $(5381,e)};var L=/^\s*\/\/.*$/gm;function G(e){var t,r,n,i=void 0===e?c:e,a=i.options,o=void 0===a?c:a,l=i.plugins,u=void 0===l?s:l,f=new M(o),d=[],h=function(e){function t(t){if(t)try{e(t+"}")}catch(e){}}return function(r,n,i,a,o,s,c,l,u,f){switch(r){case 1:if(0===u&&64===n.charCodeAt(0))return e(n+";"),"";break;case 2:if(0===l)return n+"/*|*/";break;case 3:switch(l){case 102:case 112:return e(i[0]+n),"";default:return n+(0===f?"/*|*/":"")}case-2:n.split("/*|*/}").forEach(t)}}}((function(e){d.push(e)})),p=function(e,n,i){return n>0&&-1!==i.slice(0,n).indexOf(r)&&i.slice(n-r.length,n)!==r?"."+t:e};function g(e,i,a,o){void 0===o&&(o="&");var s=e.replace(L,""),c=i&&a?a+" "+i+" { "+s+" }":s;return t=o,r=i,n=new RegExp("\\"+r+"\\b","g"),f(a||!i?"":i,c)}return f.use([].concat(u,[function(e,t,i){2===e&&i.length&&i[0].lastIndexOf(r)>0&&(i[0]=i[0].replace(n,p))},h,function(e){if(-2===e){var t=d;return d=[],t}}])),g.hash=u.length?u.reduce((function(e,t){return t.name||m(15),$(e,t.name)}),5381).toString():"",g}var F=n.createContext(),H=F.Consumer,B=n.createContext(),W=(B.Consumer,new z),q=G();function U(){return t.useContext(F)||W}function V(){return t.useContext(B)||q}function Y(e){var r=t.useState(e.stylisPlugins),i=r[0],a=r[1],o=U(),s=t.useMemo((function(){var t=o;return e.sheet?t=e.sheet:e.target&&(t=t.reconstructWithOptions({target:e.target})),e.disableCSSOMInjection&&(t=t.reconstructWithOptions({useCSSOMInjection:!1})),t}),[e.disableCSSOMInjection,e.sheet,e.target]),c=t.useMemo((function(){return G({options:{prefix:!e.disableVendorPrefixes},plugins:i})}),[e.disableVendorPrefixes,i]);return t.useEffect((function(){(function(e,t,r,n){var i=r?r.call(n,e,t):void 0;if(void 0!==i)return!!i;if(e===t)return!0;if("object"!=typeof e||!e||"object"!=typeof t||!t)return!1;var a=Object.keys(e),o=Object.keys(t);if(a.length!==o.length)return!1;for(var s=Object.prototype.hasOwnProperty.bind(t),c=0;c<a.length;c++){var l=a[c];if(!s(l))return!1;var u=e[l],f=t[l];if(!1===(i=r?r.call(n,u,f,l):void 0)||void 0===i&&u!==f)return!1}return!0})(i,e.stylisPlugins)||a(e.stylisPlugins)}),[e.stylisPlugins]),n.createElement(F.Provider,{value:s},n.createElement(B.Provider,{value:c},e.children))}var X=function(){function e(e,t){var r=this;this.inject=function(e){e.hasNameForId(r.id,r.name)||e.insertRules(r.id,r.name,q.apply(void 0,r.stringifyArgs))},this.toString=function(){return m(12,String(r.name))},this.name=e,this.id="sc-keyframes-"+e,this.stringifyArgs=t}return e.prototype.getName=function(){return this.name},e}(),Z=/([A-Z])/g,J=/^ms-/;function K(e){return e.replace(Z,"-$1").toLowerCase().replace(J,"-ms-")}var Q={animationIterationCount:1,borderImageOutset:1,borderImageSlice:1,borderImageWidth:1,boxFlex:1,boxFlexGroup:1,boxOrdinalGroup:1,columnCount:1,columns:1,flex:1,flexGrow:1,flexPositive:1,flexShrink:1,flexNegative:1,flexOrder:1,gridRow:1,gridRowEnd:1,gridRowSpan:1,gridRowStart:1,gridColumn:1,gridColumnEnd:1,gridColumnSpan:1,gridColumnStart:1,msGridRow:1,msGridRowSpan:1,msGridColumn:1,msGridColumnSpan:1,fontWeight:1,lineHeight:1,opacity:1,order:1,orphans:1,tabSize:1,widows:1,zIndex:1,zoom:1,WebkitLineClamp:1,fillOpacity:1,floodOpacity:1,stopOpacity:1,strokeDasharray:1,strokeDashoffset:1,strokeMiterlimit:1,strokeOpacity:1,strokeWidth:1};var ee=function(e){return null==e||!1===e||""===e},te=function e(t,r){var n=[];return Object.keys(t).forEach((function(r){if(!ee(t[r])){if(o(t[r]))return n.push.apply(n,e(t[r],r)),n;if(l(t[r]))return n.push(K(r)+":",t[r],";"),n;n.push(K(r)+": "+(i=r,null==(a=t[r])||"boolean"==typeof a||""===a?"":"number"!=typeof a||0===a||i in Q?String(a).trim():a+"px")+";")}var i,a;return n})),r?[r+" {"].concat(n,["}"]):n};function re(e,t,r){if(Array.isArray(e)){for(var n,a=[],s=0,c=e.length;s<c;s+=1)""!==(n=re(e[s],t,r))&&(Array.isArray(n)?a.push.apply(a,n):a.push(n));return a}return ee(e)?"":i(e)?"."+e.styledComponentId:l(e)?"function"!=typeof(u=e)||u.prototype&&u.prototype.isReactComponent||!t?e:re(e(t),t,r):e instanceof X?r?(e.inject(r),e.getName()):e:o(e)?te(e):e.toString();var u}function ne(e){for(var t=arguments.length,r=new Array(t>1?t-1:0),n=1;n<t;n++)r[n-1]=arguments[n];return l(e)||o(e)?re(a(s,[e].concat(r))):0===r.length&&1===e.length&&"string"==typeof e[0]?e:re(a(e,r))}function ie(e){for(var t=0;t<e.length;t+=1){var r=e[t];if(l(r)&&!i(r))return!1}return!0}var ae=function(){function e(e,t){this.rules=e,this.componentId=t,this.isStatic=ie(e)}var t=e.prototype;return t.createStyles=function(e,t,r,n){var i=n(re(this.rules,t,r).join(""),""),a=this.componentId+e;r.insertRules(a,a,i)},t.removeStyles=function(e,t){t.clearRules(this.componentId+e)},t.renderStyles=function(e,t,r,n){z.registerId(this.componentId+e),this.removeStyles(e,r),this.createStyles(e,t,r,n)},e}(),oe=function(e,t,r){return void 0===r&&(r=c),e.theme!==r.theme&&e.theme||t||r.theme},se=n.createContext(),ce=se.Consumer;var le=/(a)(d)/gi,ue=function(e){return String.fromCharCode(e+(e>25?39:97))};function fe(e){var t,r="";for(t=Math.abs(e);t>52;t=t/52|0)r=ue(t%52)+r;return(ue(t%52)+r).replace(le,"$1-$2")}var de=function(e){return fe(D(e)>>>0)};var he=function(){function e(){var e=this;this._emitSheetCSS=function(){var t=e.instance.toString(),r=g();return"<style "+[r&&'nonce="'+r+'"',f+'="true"','data-styled-version="5.0.1"'].filter(Boolean).join(" ")+">"+t+"</style>"},this.getStyleTags=function(){return e.sealed?m(2):e._emitSheetCSS()},this.getStyleElement=function(){var t;if(e.sealed)return m(2);var r=((t={})[f]="",t["data-styled-version"]="5.0.1",t.dangerouslySetInnerHTML={__html:e.instance.toString()},t),i=g();return i&&(r.nonce=i),[n.createElement("style",u({},r,{key:"sc-0-0"}))]},this.seal=function(){e.sealed=!0},this.instance=new z({isServer:!0}),this.sealed=!1}var t=e.prototype;return t.collectStyles=function(e){return this.sealed?m(2):n.createElement(Y,{sheet:this.instance},e)},t.interleaveWithNodeStream=function(e){return m(3)},e}(),pe={childContextTypes:!0,contextType:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},ge={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},me={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},ve={};function ye(e){return r.isMemo(e)?me:ve[e.$$typeof]||pe}ve[r.ForwardRef]={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},ve[r.Memo]=me;var be=Object.defineProperty,ke=Object.getOwnPropertyNames,we=Object.getOwnPropertySymbols,Se=Object.getOwnPropertyDescriptor,Ce=Object.getPrototypeOf,Ae=Object.prototype;var xe=function e(t,r,n){if("string"!=typeof r){if(Ae){var i=Ce(r);i&&i!==Ae&&e(t,i,n)}var a=ke(r);we&&(a=a.concat(we(r)));for(var o=ye(t),s=ye(r),c=0;c<a.length;++c){var l=a[c];if(!(ge[l]||n&&n[l]||s&&s[l]||o&&o[l])){var u=Se(r,l);try{be(t,l,u)}catch(e){}}}}return t},Oe={StyleSheet:z,masterSheet:W},Ie=Object.freeze({__proto__:null,createGlobalStyle:function(e){for(var r=arguments.length,i=new Array(r>1?r-1:0),a=1;a<r;a++)i[a-1]=arguments[a];var o=ne.apply(void 0,[e].concat(i)),c="sc-global-"+de(JSON.stringify(o)),l=new ae(o,c);function f(e){var r=U(),n=V(),i=t.useContext(se),a=t.useRef(null);null===a.current&&(a.current=r.allocateGSInstance(c));var o=a.current;if(l.isStatic)l.renderStyles(o,p,r,n);else{var d=u({},e,{theme:oe(e,i,f.defaultProps)});l.renderStyles(o,d,r,n)}return t.useEffect((function(){return function(){return l.removeStyles(o,r)}}),s),null}return n.memo(f)},css:ne,isStyledComponent:i,keyframes:function(e){for(var t=arguments.length,r=new Array(t>1?t-1:0),n=1;n<t;n++)r[n-1]=arguments[n];var i=ne.apply(void 0,[e].concat(r)).join(""),a=de(i);return new X(a,[i,a,"@keyframes"])},ServerStyleSheet:he,StyleSheetConsumer:H,StyleSheetContext:F,StyleSheetManager:Y,ThemeConsumer:ce,ThemeContext:se,ThemeProvider:function(e){var r=t.useContext(se),i=t.useMemo((function(){return function(e,t){return e?l(e)?e(t):Array.isArray(e)||"object"!=typeof e?m(8):t?u({},t,{},e):e:m(14)}(e.theme,r)}),[e.theme,r]);return e.children?n.createElement(se.Provider,{value:i},e.children):null},useTheme:function(){return t.useContext(se)},version:"5.0.1",withTheme:function(e){var r=n.forwardRef((function(r,i){var a=t.useContext(se),o=e.defaultProps,s=oe(r,a,o);return n.createElement(e,u({},r,{theme:s,ref:i}))}));return xe(r,e),r.displayName="WithTheme(undefined)",r},__PRIVATE__:Oe});var Re,Te,Pe=/^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|download|draggable|encType|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|itemProp|itemScope|itemType|itemID|itemRef|on|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/,je=(Re=function(e){return Pe.test(e)||111===e.charCodeAt(0)&&110===e.charCodeAt(1)&&e.charCodeAt(2)<91},Te={},function(e){return void 0===Te[e]&&(Te[e]=Re(e)),Te[e]}),Ee=function(e){return"function"==typeof e||"object"==typeof e&&null!==e&&!Array.isArray(e)},Ne=function(e){return"__proto__"!==e&&"constructor"!==e&&"prototype"!==e};function _e(e,t,r){var n=e[r];Ee(t)&&Ee(n)?ze(n,t):e[r]=t}function ze(e){for(var t=arguments.length,r=new Array(t>1?t-1:0),n=1;n<t;n++)r[n-1]=arguments[n];for(var i=0,a=r;i<a.length;i++){var o=a[i];if(Ee(o))for(var s in o)Ne(s)&&_e(e,o[s],s)}return e}var Me=function(){function e(e,t){this.rules=e,this.staticRulesId="",this.isStatic=ie(e),this.componentId=t,this.baseHash=D(t),z.registerId(t)}return e.prototype.generateAndInjectStyles=function(e,t,r){var n=this.componentId;if(this.isStatic&&!r.hash){if(this.staticRulesId&&t.hasNameForId(n,this.staticRulesId))return this.staticRulesId;var i=re(this.rules,e,t).join(""),a=fe($(this.baseHash,i.length)>>>0);if(!t.hasNameForId(n,a)){var o=r(i,"."+a,void 0,n);t.insertRules(n,a,o)}return this.staticRulesId=a,a}for(var s=this.rules.length,c=$(this.baseHash,r.hash),l="",u=0;u<s;u++){var f=this.rules[u];if("string"==typeof f)l+=f;else{var d=re(f,e,t),h=Array.isArray(d)?d.join(""):d;c=$(c,h+u),l+=h}}var p=fe(c>>>0);if(!t.hasNameForId(n,p)){var g=r(l,"."+p,void 0,n);t.insertRules(n,p,g)}return p},e}(),$e=/[[\].#*$><+~=|^:(),"'`-]+/g,De=/(^-|-$)/g;function Le(e){return e.replace($e,"-").replace(De,"")}function Ge(e){return"string"==typeof e&&!0}var Fe={};function He(e,r,n){var i=e.attrs,a=e.componentStyle,o=e.defaultProps,s=e.foldedComponentIds,f=e.styledComponentId,d=e.target;t.useDebugValue(f);var h=function(e,t,r){void 0===e&&(e=c);var n=u({},t,{theme:e}),i={};return r.forEach((function(e){var t,r,a,o=e;for(t in l(o)&&(o=o(n)),o)n[t]=i[t]="className"===t?(r=i[t],a=o[t],r&&a?r+" "+a:r||a):o[t]})),[n,i]}(oe(r,t.useContext(se),o)||c,r,i),p=h[0],g=h[1],m=function(e,r,n,i){var a=U(),o=V(),s=e.isStatic&&!r?e.generateAndInjectStyles(c,a,o):e.generateAndInjectStyles(n,a,o);return t.useDebugValue(s),s}(a,i.length>0,p),v=n,y=g.as||r.as||d,b=Ge(y),k=g!==r?u({},r,{},g):r,w=b||"as"in k||"forwardedAs"in k,S=w?{}:u({},k);if(w)for(var C in k)"forwardedAs"===C?S.as=k[C]:"as"===C||"forwardedAs"===C||b&&!je(C)||(S[C]=k[C]);return r.style&&g.style!==r.style&&(S.style=u({},r.style,{},g.style)),S.className=Array.prototype.concat(s,f,m!==f?m:null,r.className,g.className).filter(Boolean).join(" "),S.ref=v,t.createElement(y,S)}function Be(e,t,r){var a,o=i(e),c=!Ge(e),l=t.displayName,f=void 0===l?function(e){return Ge(e)?"styled."+e:"Styled(undefined)"}(e):l,d=t.componentId,h=void 0===d?function(e,t){var r="string"!=typeof e?"sc":Le(e);Fe[r]=(Fe[r]||0)+1;var n=r+"-"+de(r+Fe[r]);return t?t+"-"+n:n}(t.displayName,t.parentComponentId):d,p=t.attrs,g=void 0===p?s:p,m=t.displayName&&t.componentId?Le(t.displayName)+"-"+t.componentId:t.componentId||h,v=o&&e.attrs?Array.prototype.concat(e.attrs,g).filter(Boolean):g,y=new Me(o?e.componentStyle.rules.concat(r):r,m),b=function(e,t){return He(a,e,t)};return b.displayName=f,(a=n.forwardRef(b)).attrs=v,a.componentStyle=y,a.displayName=f,a.foldedComponentIds=o?Array.prototype.concat(e.foldedComponentIds,e.styledComponentId):s,a.styledComponentId=m,a.target=o?e.target:e,a.withComponent=function(e){var n=t.componentId,i=function(e,t){if(null==e)return{};var r,n,i={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(i[r]=e[r]);return i}(t,["componentId"]),a=n&&n+"-"+(Ge(e)?e:Le(void 0));return Be(e,u({},i,{attrs:v,componentId:a}),r)},Object.defineProperty(a,"defaultProps",{get:function(){return this._foldedDefaultProps},set:function(t){this._foldedDefaultProps=o?ze({},e.defaultProps,t):t}}),a.toString=function(){return"."+a.styledComponentId},c&&xe(a,e,{attrs:!0,componentStyle:!0,displayName:!0,foldedComponentIds:!0,self:!0,styledComponentId:!0,target:!0,withComponent:!0}),a}var We=function(t){return function t(r,n,i){if(void 0===i&&(i=c),!e.isValidElementType(n))return m(1,String(n));var a=function(){return r(n,i,ne.apply(void 0,arguments))};return a.withConfig=function(e){return t(r,n,u({},i,{},e))},a.attrs=function(e){return t(r,n,u({},i,{attrs:Array.prototype.concat(i.attrs,e).filter(Boolean)}))},a}(Be,t)};for(var qe in["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","big","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","marquee","menu","menuitem","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr","circle","clipPath","defs","ellipse","foreignObject","g","image","line","linearGradient","marker","mask","path","pattern","polygon","polyline","radialGradient","rect","stop","svg","text","tspan"].forEach((function(e){We[e]=We(e)})),Ie)We[qe]=Ie[qe];return We}));
//# sourceMappingURL=styled-components.min.js.map
//static-content-hash-trigger-GCC
/**
 * @popperjs/core v2.11.4 - MIT License
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).Popper={})}(this,(function(e){"use strict";function t(e){if(null==e)return window;if("[object Window]"!==e.toString()){var t=e.ownerDocument;return t&&t.defaultView||window}return e}function n(e){return e instanceof t(e).Element||e instanceof Element}function r(e){return e instanceof t(e).HTMLElement||e instanceof HTMLElement}function o(e){return"undefined"!=typeof ShadowRoot&&(e instanceof t(e).ShadowRoot||e instanceof ShadowRoot)}var i=Math.max,a=Math.min,s=Math.round;function f(e,t){void 0===t&&(t=!1);var n=e.getBoundingClientRect(),o=1,i=1;if(r(e)&&t){var a=e.offsetHeight,f=e.offsetWidth;f>0&&(o=s(n.width)/f||1),a>0&&(i=s(n.height)/a||1)}return{width:n.width/o,height:n.height/i,top:n.top/i,right:n.right/o,bottom:n.bottom/i,left:n.left/o,x:n.left/o,y:n.top/i}}function c(e){var n=t(e);return{scrollLeft:n.pageXOffset,scrollTop:n.pageYOffset}}function p(e){return e?(e.nodeName||"").toLowerCase():null}function u(e){return((n(e)?e.ownerDocument:e.document)||window.document).documentElement}function l(e){return f(u(e)).left+c(e).scrollLeft}function d(e){return t(e).getComputedStyle(e)}function h(e){var t=d(e),n=t.overflow,r=t.overflowX,o=t.overflowY;return/auto|scroll|overlay|hidden/.test(n+o+r)}function m(e,n,o){void 0===o&&(o=!1);var i,a,d=r(n),m=r(n)&&function(e){var t=e.getBoundingClientRect(),n=s(t.width)/e.offsetWidth||1,r=s(t.height)/e.offsetHeight||1;return 1!==n||1!==r}(n),v=u(n),g=f(e,m),y={scrollLeft:0,scrollTop:0},b={x:0,y:0};return(d||!d&&!o)&&(("body"!==p(n)||h(v))&&(y=(i=n)!==t(i)&&r(i)?{scrollLeft:(a=i).scrollLeft,scrollTop:a.scrollTop}:c(i)),r(n)?((b=f(n,!0)).x+=n.clientLeft,b.y+=n.clientTop):v&&(b.x=l(v))),{x:g.left+y.scrollLeft-b.x,y:g.top+y.scrollTop-b.y,width:g.width,height:g.height}}function v(e){var t=f(e),n=e.offsetWidth,r=e.offsetHeight;return Math.abs(t.width-n)<=1&&(n=t.width),Math.abs(t.height-r)<=1&&(r=t.height),{x:e.offsetLeft,y:e.offsetTop,width:n,height:r}}function g(e){return"html"===p(e)?e:e.assignedSlot||e.parentNode||(o(e)?e.host:null)||u(e)}function y(e){return["html","body","#document"].indexOf(p(e))>=0?e.ownerDocument.body:r(e)&&h(e)?e:y(g(e))}function b(e,n){var r;void 0===n&&(n=[]);var o=y(e),i=o===(null==(r=e.ownerDocument)?void 0:r.body),a=t(o),s=i?[a].concat(a.visualViewport||[],h(o)?o:[]):o,f=n.concat(s);return i?f:f.concat(b(g(s)))}function x(e){return["table","td","th"].indexOf(p(e))>=0}function w(e){return r(e)&&"fixed"!==d(e).position?e.offsetParent:null}function O(e){for(var n=t(e),i=w(e);i&&x(i)&&"static"===d(i).position;)i=w(i);return i&&("html"===p(i)||"body"===p(i)&&"static"===d(i).position)?n:i||function(e){var t=-1!==navigator.userAgent.toLowerCase().indexOf("firefox");if(-1!==navigator.userAgent.indexOf("Trident")&&r(e)&&"fixed"===d(e).position)return null;var n=g(e);for(o(n)&&(n=n.host);r(n)&&["html","body"].indexOf(p(n))<0;){var i=d(n);if("none"!==i.transform||"none"!==i.perspective||"paint"===i.contain||-1!==["transform","perspective"].indexOf(i.willChange)||t&&"filter"===i.willChange||t&&i.filter&&"none"!==i.filter)return n;n=n.parentNode}return null}(e)||n}var j="top",E="bottom",D="right",A="left",L="auto",P=[j,E,D,A],M="start",k="end",W="viewport",B="popper",H=P.reduce((function(e,t){return e.concat([t+"-"+M,t+"-"+k])}),[]),T=[].concat(P,[L]).reduce((function(e,t){return e.concat([t,t+"-"+M,t+"-"+k])}),[]),R=["beforeRead","read","afterRead","beforeMain","main","afterMain","beforeWrite","write","afterWrite"];function S(e){var t=new Map,n=new Set,r=[];function o(e){n.add(e.name),[].concat(e.requires||[],e.requiresIfExists||[]).forEach((function(e){if(!n.has(e)){var r=t.get(e);r&&o(r)}})),r.push(e)}return e.forEach((function(e){t.set(e.name,e)})),e.forEach((function(e){n.has(e.name)||o(e)})),r}function C(e){return e.split("-")[0]}function q(e,t){var n=t.getRootNode&&t.getRootNode();if(e.contains(t))return!0;if(n&&o(n)){var r=t;do{if(r&&e.isSameNode(r))return!0;r=r.parentNode||r.host}while(r)}return!1}function V(e){return Object.assign({},e,{left:e.x,top:e.y,right:e.x+e.width,bottom:e.y+e.height})}function N(e,r){return r===W?V(function(e){var n=t(e),r=u(e),o=n.visualViewport,i=r.clientWidth,a=r.clientHeight,s=0,f=0;return o&&(i=o.width,a=o.height,/^((?!chrome|android).)*safari/i.test(navigator.userAgent)||(s=o.offsetLeft,f=o.offsetTop)),{width:i,height:a,x:s+l(e),y:f}}(e)):n(r)?function(e){var t=f(e);return t.top=t.top+e.clientTop,t.left=t.left+e.clientLeft,t.bottom=t.top+e.clientHeight,t.right=t.left+e.clientWidth,t.width=e.clientWidth,t.height=e.clientHeight,t.x=t.left,t.y=t.top,t}(r):V(function(e){var t,n=u(e),r=c(e),o=null==(t=e.ownerDocument)?void 0:t.body,a=i(n.scrollWidth,n.clientWidth,o?o.scrollWidth:0,o?o.clientWidth:0),s=i(n.scrollHeight,n.clientHeight,o?o.scrollHeight:0,o?o.clientHeight:0),f=-r.scrollLeft+l(e),p=-r.scrollTop;return"rtl"===d(o||n).direction&&(f+=i(n.clientWidth,o?o.clientWidth:0)-a),{width:a,height:s,x:f,y:p}}(u(e)))}function I(e,t,o){var s="clippingParents"===t?function(e){var t=b(g(e)),o=["absolute","fixed"].indexOf(d(e).position)>=0&&r(e)?O(e):e;return n(o)?t.filter((function(e){return n(e)&&q(e,o)&&"body"!==p(e)})):[]}(e):[].concat(t),f=[].concat(s,[o]),c=f[0],u=f.reduce((function(t,n){var r=N(e,n);return t.top=i(r.top,t.top),t.right=a(r.right,t.right),t.bottom=a(r.bottom,t.bottom),t.left=i(r.left,t.left),t}),N(e,c));return u.width=u.right-u.left,u.height=u.bottom-u.top,u.x=u.left,u.y=u.top,u}function _(e){return e.split("-")[1]}function F(e){return["top","bottom"].indexOf(e)>=0?"x":"y"}function U(e){var t,n=e.reference,r=e.element,o=e.placement,i=o?C(o):null,a=o?_(o):null,s=n.x+n.width/2-r.width/2,f=n.y+n.height/2-r.height/2;switch(i){case j:t={x:s,y:n.y-r.height};break;case E:t={x:s,y:n.y+n.height};break;case D:t={x:n.x+n.width,y:f};break;case A:t={x:n.x-r.width,y:f};break;default:t={x:n.x,y:n.y}}var c=i?F(i):null;if(null!=c){var p="y"===c?"height":"width";switch(a){case M:t[c]=t[c]-(n[p]/2-r[p]/2);break;case k:t[c]=t[c]+(n[p]/2-r[p]/2)}}return t}function z(e){return Object.assign({},{top:0,right:0,bottom:0,left:0},e)}function X(e,t){return t.reduce((function(t,n){return t[n]=e,t}),{})}function Y(e,t){void 0===t&&(t={});var r=t,o=r.placement,i=void 0===o?e.placement:o,a=r.boundary,s=void 0===a?"clippingParents":a,c=r.rootBoundary,p=void 0===c?W:c,l=r.elementContext,d=void 0===l?B:l,h=r.altBoundary,m=void 0!==h&&h,v=r.padding,g=void 0===v?0:v,y=z("number"!=typeof g?g:X(g,P)),b=d===B?"reference":B,x=e.rects.popper,w=e.elements[m?b:d],O=I(n(w)?w:w.contextElement||u(e.elements.popper),s,p),A=f(e.elements.reference),L=U({reference:A,element:x,strategy:"absolute",placement:i}),M=V(Object.assign({},x,L)),k=d===B?M:A,H={top:O.top-k.top+y.top,bottom:k.bottom-O.bottom+y.bottom,left:O.left-k.left+y.left,right:k.right-O.right+y.right},T=e.modifiersData.offset;if(d===B&&T){var R=T[i];Object.keys(H).forEach((function(e){var t=[D,E].indexOf(e)>=0?1:-1,n=[j,E].indexOf(e)>=0?"y":"x";H[e]+=R[n]*t}))}return H}var G={placement:"bottom",modifiers:[],strategy:"absolute"};function J(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return!t.some((function(e){return!(e&&"function"==typeof e.getBoundingClientRect)}))}function K(e){void 0===e&&(e={});var t=e,r=t.defaultModifiers,o=void 0===r?[]:r,i=t.defaultOptions,a=void 0===i?G:i;return function(e,t,r){void 0===r&&(r=a);var i,s,f={placement:"bottom",orderedModifiers:[],options:Object.assign({},G,a),modifiersData:{},elements:{reference:e,popper:t},attributes:{},styles:{}},c=[],p=!1,u={state:f,setOptions:function(r){var i="function"==typeof r?r(f.options):r;l(),f.options=Object.assign({},a,f.options,i),f.scrollParents={reference:n(e)?b(e):e.contextElement?b(e.contextElement):[],popper:b(t)};var s,p,d=function(e){var t=S(e);return R.reduce((function(e,n){return e.concat(t.filter((function(e){return e.phase===n})))}),[])}((s=[].concat(o,f.options.modifiers),p=s.reduce((function(e,t){var n=e[t.name];return e[t.name]=n?Object.assign({},n,t,{options:Object.assign({},n.options,t.options),data:Object.assign({},n.data,t.data)}):t,e}),{}),Object.keys(p).map((function(e){return p[e]}))));return f.orderedModifiers=d.filter((function(e){return e.enabled})),f.orderedModifiers.forEach((function(e){var t=e.name,n=e.options,r=void 0===n?{}:n,o=e.effect;if("function"==typeof o){var i=o({state:f,name:t,instance:u,options:r}),a=function(){};c.push(i||a)}})),u.update()},forceUpdate:function(){if(!p){var e=f.elements,t=e.reference,n=e.popper;if(J(t,n)){f.rects={reference:m(t,O(n),"fixed"===f.options.strategy),popper:v(n)},f.reset=!1,f.placement=f.options.placement,f.orderedModifiers.forEach((function(e){return f.modifiersData[e.name]=Object.assign({},e.data)}));for(var r=0;r<f.orderedModifiers.length;r++)if(!0!==f.reset){var o=f.orderedModifiers[r],i=o.fn,a=o.options,s=void 0===a?{}:a,c=o.name;"function"==typeof i&&(f=i({state:f,options:s,name:c,instance:u})||f)}else f.reset=!1,r=-1}}},update:(i=function(){return new Promise((function(e){u.forceUpdate(),e(f)}))},function(){return s||(s=new Promise((function(e){Promise.resolve().then((function(){s=void 0,e(i())}))}))),s}),destroy:function(){l(),p=!0}};if(!J(e,t))return u;function l(){c.forEach((function(e){return e()})),c=[]}return u.setOptions(r).then((function(e){!p&&r.onFirstUpdate&&r.onFirstUpdate(e)})),u}}var Q={passive:!0};var Z={name:"eventListeners",enabled:!0,phase:"write",fn:function(){},effect:function(e){var n=e.state,r=e.instance,o=e.options,i=o.scroll,a=void 0===i||i,s=o.resize,f=void 0===s||s,c=t(n.elements.popper),p=[].concat(n.scrollParents.reference,n.scrollParents.popper);return a&&p.forEach((function(e){e.addEventListener("scroll",r.update,Q)})),f&&c.addEventListener("resize",r.update,Q),function(){a&&p.forEach((function(e){e.removeEventListener("scroll",r.update,Q)})),f&&c.removeEventListener("resize",r.update,Q)}},data:{}};var $={name:"popperOffsets",enabled:!0,phase:"read",fn:function(e){var t=e.state,n=e.name;t.modifiersData[n]=U({reference:t.rects.reference,element:t.rects.popper,strategy:"absolute",placement:t.placement})},data:{}},ee={top:"auto",right:"auto",bottom:"auto",left:"auto"};function te(e){var n,r=e.popper,o=e.popperRect,i=e.placement,a=e.variation,f=e.offsets,c=e.position,p=e.gpuAcceleration,l=e.adaptive,h=e.roundOffsets,m=e.isFixed,v=f.x,g=void 0===v?0:v,y=f.y,b=void 0===y?0:y,x="function"==typeof h?h({x:g,y:b}):{x:g,y:b};g=x.x,b=x.y;var w=f.hasOwnProperty("x"),L=f.hasOwnProperty("y"),P=A,M=j,W=window;if(l){var B=O(r),H="clientHeight",T="clientWidth";if(B===t(r)&&"static"!==d(B=u(r)).position&&"absolute"===c&&(H="scrollHeight",T="scrollWidth"),B=B,i===j||(i===A||i===D)&&a===k)M=E,b-=(m&&B===W&&W.visualViewport?W.visualViewport.height:B[H])-o.height,b*=p?1:-1;if(i===A||(i===j||i===E)&&a===k)P=D,g-=(m&&B===W&&W.visualViewport?W.visualViewport.width:B[T])-o.width,g*=p?1:-1}var R,S=Object.assign({position:c},l&&ee),C=!0===h?function(e){var t=e.x,n=e.y,r=window.devicePixelRatio||1;return{x:s(t*r)/r||0,y:s(n*r)/r||0}}({x:g,y:b}):{x:g,y:b};return g=C.x,b=C.y,p?Object.assign({},S,((R={})[M]=L?"0":"",R[P]=w?"0":"",R.transform=(W.devicePixelRatio||1)<=1?"translate("+g+"px, "+b+"px)":"translate3d("+g+"px, "+b+"px, 0)",R)):Object.assign({},S,((n={})[M]=L?b+"px":"",n[P]=w?g+"px":"",n.transform="",n))}var ne={name:"computeStyles",enabled:!0,phase:"beforeWrite",fn:function(e){var t=e.state,n=e.options,r=n.gpuAcceleration,o=void 0===r||r,i=n.adaptive,a=void 0===i||i,s=n.roundOffsets,f=void 0===s||s,c={placement:C(t.placement),variation:_(t.placement),popper:t.elements.popper,popperRect:t.rects.popper,gpuAcceleration:o,isFixed:"fixed"===t.options.strategy};null!=t.modifiersData.popperOffsets&&(t.styles.popper=Object.assign({},t.styles.popper,te(Object.assign({},c,{offsets:t.modifiersData.popperOffsets,position:t.options.strategy,adaptive:a,roundOffsets:f})))),null!=t.modifiersData.arrow&&(t.styles.arrow=Object.assign({},t.styles.arrow,te(Object.assign({},c,{offsets:t.modifiersData.arrow,position:"absolute",adaptive:!1,roundOffsets:f})))),t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-placement":t.placement})},data:{}};var re={name:"applyStyles",enabled:!0,phase:"write",fn:function(e){var t=e.state;Object.keys(t.elements).forEach((function(e){var n=t.styles[e]||{},o=t.attributes[e]||{},i=t.elements[e];r(i)&&p(i)&&(Object.assign(i.style,n),Object.keys(o).forEach((function(e){var t=o[e];!1===t?i.removeAttribute(e):i.setAttribute(e,!0===t?"":t)})))}))},effect:function(e){var t=e.state,n={popper:{position:t.options.strategy,left:"0",top:"0",margin:"0"},arrow:{position:"absolute"},reference:{}};return Object.assign(t.elements.popper.style,n.popper),t.styles=n,t.elements.arrow&&Object.assign(t.elements.arrow.style,n.arrow),function(){Object.keys(t.elements).forEach((function(e){var o=t.elements[e],i=t.attributes[e]||{},a=Object.keys(t.styles.hasOwnProperty(e)?t.styles[e]:n[e]).reduce((function(e,t){return e[t]="",e}),{});r(o)&&p(o)&&(Object.assign(o.style,a),Object.keys(i).forEach((function(e){o.removeAttribute(e)})))}))}},requires:["computeStyles"]};var oe={name:"offset",enabled:!0,phase:"main",requires:["popperOffsets"],fn:function(e){var t=e.state,n=e.options,r=e.name,o=n.offset,i=void 0===o?[0,0]:o,a=T.reduce((function(e,n){return e[n]=function(e,t,n){var r=C(e),o=[A,j].indexOf(r)>=0?-1:1,i="function"==typeof n?n(Object.assign({},t,{placement:e})):n,a=i[0],s=i[1];return a=a||0,s=(s||0)*o,[A,D].indexOf(r)>=0?{x:s,y:a}:{x:a,y:s}}(n,t.rects,i),e}),{}),s=a[t.placement],f=s.x,c=s.y;null!=t.modifiersData.popperOffsets&&(t.modifiersData.popperOffsets.x+=f,t.modifiersData.popperOffsets.y+=c),t.modifiersData[r]=a}},ie={left:"right",right:"left",bottom:"top",top:"bottom"};function ae(e){return e.replace(/left|right|bottom|top/g,(function(e){return ie[e]}))}var se={start:"end",end:"start"};function fe(e){return e.replace(/start|end/g,(function(e){return se[e]}))}function ce(e,t){void 0===t&&(t={});var n=t,r=n.placement,o=n.boundary,i=n.rootBoundary,a=n.padding,s=n.flipVariations,f=n.allowedAutoPlacements,c=void 0===f?T:f,p=_(r),u=p?s?H:H.filter((function(e){return _(e)===p})):P,l=u.filter((function(e){return c.indexOf(e)>=0}));0===l.length&&(l=u);var d=l.reduce((function(t,n){return t[n]=Y(e,{placement:n,boundary:o,rootBoundary:i,padding:a})[C(n)],t}),{});return Object.keys(d).sort((function(e,t){return d[e]-d[t]}))}var pe={name:"flip",enabled:!0,phase:"main",fn:function(e){var t=e.state,n=e.options,r=e.name;if(!t.modifiersData[r]._skip){for(var o=n.mainAxis,i=void 0===o||o,a=n.altAxis,s=void 0===a||a,f=n.fallbackPlacements,c=n.padding,p=n.boundary,u=n.rootBoundary,l=n.altBoundary,d=n.flipVariations,h=void 0===d||d,m=n.allowedAutoPlacements,v=t.options.placement,g=C(v),y=f||(g===v||!h?[ae(v)]:function(e){if(C(e)===L)return[];var t=ae(e);return[fe(e),t,fe(t)]}(v)),b=[v].concat(y).reduce((function(e,n){return e.concat(C(n)===L?ce(t,{placement:n,boundary:p,rootBoundary:u,padding:c,flipVariations:h,allowedAutoPlacements:m}):n)}),[]),x=t.rects.reference,w=t.rects.popper,O=new Map,P=!0,k=b[0],W=0;W<b.length;W++){var B=b[W],H=C(B),T=_(B)===M,R=[j,E].indexOf(H)>=0,S=R?"width":"height",q=Y(t,{placement:B,boundary:p,rootBoundary:u,altBoundary:l,padding:c}),V=R?T?D:A:T?E:j;x[S]>w[S]&&(V=ae(V));var N=ae(V),I=[];if(i&&I.push(q[H]<=0),s&&I.push(q[V]<=0,q[N]<=0),I.every((function(e){return e}))){k=B,P=!1;break}O.set(B,I)}if(P)for(var F=function(e){var t=b.find((function(t){var n=O.get(t);if(n)return n.slice(0,e).every((function(e){return e}))}));if(t)return k=t,"break"},U=h?3:1;U>0;U--){if("break"===F(U))break}t.placement!==k&&(t.modifiersData[r]._skip=!0,t.placement=k,t.reset=!0)}},requiresIfExists:["offset"],data:{_skip:!1}};function ue(e,t,n){return i(e,a(t,n))}var le={name:"preventOverflow",enabled:!0,phase:"main",fn:function(e){var t=e.state,n=e.options,r=e.name,o=n.mainAxis,s=void 0===o||o,f=n.altAxis,c=void 0!==f&&f,p=n.boundary,u=n.rootBoundary,l=n.altBoundary,d=n.padding,h=n.tether,m=void 0===h||h,g=n.tetherOffset,y=void 0===g?0:g,b=Y(t,{boundary:p,rootBoundary:u,padding:d,altBoundary:l}),x=C(t.placement),w=_(t.placement),L=!w,P=F(x),k="x"===P?"y":"x",W=t.modifiersData.popperOffsets,B=t.rects.reference,H=t.rects.popper,T="function"==typeof y?y(Object.assign({},t.rects,{placement:t.placement})):y,R="number"==typeof T?{mainAxis:T,altAxis:T}:Object.assign({mainAxis:0,altAxis:0},T),S=t.modifiersData.offset?t.modifiersData.offset[t.placement]:null,q={x:0,y:0};if(W){if(s){var V,N="y"===P?j:A,I="y"===P?E:D,U="y"===P?"height":"width",z=W[P],X=z+b[N],G=z-b[I],J=m?-H[U]/2:0,K=w===M?B[U]:H[U],Q=w===M?-H[U]:-B[U],Z=t.elements.arrow,$=m&&Z?v(Z):{width:0,height:0},ee=t.modifiersData["arrow#persistent"]?t.modifiersData["arrow#persistent"].padding:{top:0,right:0,bottom:0,left:0},te=ee[N],ne=ee[I],re=ue(0,B[U],$[U]),oe=L?B[U]/2-J-re-te-R.mainAxis:K-re-te-R.mainAxis,ie=L?-B[U]/2+J+re+ne+R.mainAxis:Q+re+ne+R.mainAxis,ae=t.elements.arrow&&O(t.elements.arrow),se=ae?"y"===P?ae.clientTop||0:ae.clientLeft||0:0,fe=null!=(V=null==S?void 0:S[P])?V:0,ce=z+ie-fe,pe=ue(m?a(X,z+oe-fe-se):X,z,m?i(G,ce):G);W[P]=pe,q[P]=pe-z}if(c){var le,de="x"===P?j:A,he="x"===P?E:D,me=W[k],ve="y"===k?"height":"width",ge=me+b[de],ye=me-b[he],be=-1!==[j,A].indexOf(x),xe=null!=(le=null==S?void 0:S[k])?le:0,we=be?ge:me-B[ve]-H[ve]-xe+R.altAxis,Oe=be?me+B[ve]+H[ve]-xe-R.altAxis:ye,je=m&&be?function(e,t,n){var r=ue(e,t,n);return r>n?n:r}(we,me,Oe):ue(m?we:ge,me,m?Oe:ye);W[k]=je,q[k]=je-me}t.modifiersData[r]=q}},requiresIfExists:["offset"]};var de={name:"arrow",enabled:!0,phase:"main",fn:function(e){var t,n=e.state,r=e.name,o=e.options,i=n.elements.arrow,a=n.modifiersData.popperOffsets,s=C(n.placement),f=F(s),c=[A,D].indexOf(s)>=0?"height":"width";if(i&&a){var p=function(e,t){return z("number"!=typeof(e="function"==typeof e?e(Object.assign({},t.rects,{placement:t.placement})):e)?e:X(e,P))}(o.padding,n),u=v(i),l="y"===f?j:A,d="y"===f?E:D,h=n.rects.reference[c]+n.rects.reference[f]-a[f]-n.rects.popper[c],m=a[f]-n.rects.reference[f],g=O(i),y=g?"y"===f?g.clientHeight||0:g.clientWidth||0:0,b=h/2-m/2,x=p[l],w=y-u[c]-p[d],L=y/2-u[c]/2+b,M=ue(x,L,w),k=f;n.modifiersData[r]=((t={})[k]=M,t.centerOffset=M-L,t)}},effect:function(e){var t=e.state,n=e.options.element,r=void 0===n?"[data-popper-arrow]":n;null!=r&&("string"!=typeof r||(r=t.elements.popper.querySelector(r)))&&q(t.elements.popper,r)&&(t.elements.arrow=r)},requires:["popperOffsets"],requiresIfExists:["preventOverflow"]};function he(e,t,n){return void 0===n&&(n={x:0,y:0}),{top:e.top-t.height-n.y,right:e.right-t.width+n.x,bottom:e.bottom-t.height+n.y,left:e.left-t.width-n.x}}function me(e){return[j,D,E,A].some((function(t){return e[t]>=0}))}var ve={name:"hide",enabled:!0,phase:"main",requiresIfExists:["preventOverflow"],fn:function(e){var t=e.state,n=e.name,r=t.rects.reference,o=t.rects.popper,i=t.modifiersData.preventOverflow,a=Y(t,{elementContext:"reference"}),s=Y(t,{altBoundary:!0}),f=he(a,r),c=he(s,o,i),p=me(f),u=me(c);t.modifiersData[n]={referenceClippingOffsets:f,popperEscapeOffsets:c,isReferenceHidden:p,hasPopperEscaped:u},t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-reference-hidden":p,"data-popper-escaped":u})}},ge=K({defaultModifiers:[Z,$,ne,re]}),ye=[Z,$,ne,re,oe,pe,le,de,ve],be=K({defaultModifiers:ye});e.applyStyles=re,e.arrow=de,e.computeStyles=ne,e.createPopper=be,e.createPopperLite=ge,e.defaultModifiers=ye,e.detectOverflow=Y,e.eventListeners=Z,e.flip=pe,e.hide=ve,e.offset=oe,e.popperGenerator=K,e.popperOffsets=$,e.preventOverflow=le,Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=popper.min.js.map
//static-content-hash-trigger-GCC
/*https://openbase.io/js/react-popper*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('@popperjs/core')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', '@popperjs/core'], factory) :
  (global = global || self, factory(global.ReactPopper = {}, global.React, global.Popper));
}(this, (function (exports, React, core) { 'use strict';

  var ManagerReferenceNodeContext = React.createContext();
  var ManagerReferenceNodeSetterContext = React.createContext();
  function Manager(_ref) {
    var children = _ref.children;

    var _React$useState = React.useState(null),
        referenceNode = _React$useState[0],
        setReferenceNode = _React$useState[1];

    React.useEffect(function () {
      return function () {
        setReferenceNode(null);
      };
    }, [setReferenceNode]);
    return /*#__PURE__*/React.createElement(ManagerReferenceNodeContext.Provider, {
      value: referenceNode
    }, /*#__PURE__*/React.createElement(ManagerReferenceNodeSetterContext.Provider, {
      value: setReferenceNode
    }, children));
  }

  /**
   * Takes an argument and if it's an array, returns the first item in the array,
   * otherwise returns the argument. Used for Preact compatibility.
   */
  var unwrapArray = function unwrapArray(arg) {
    return Array.isArray(arg) ? arg[0] : arg;
  };
  /**
   * Takes a maybe-undefined function and arbitrary args and invokes the function
   * only if it is defined.
   */

  var safeInvoke = function safeInvoke(fn) {
    if (typeof fn === 'function') {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return fn.apply(void 0, args);
    }
  };
  /**
   * Sets a ref using either a ref callback or a ref object
   */

  var setRef = function setRef(ref, node) {
    // if its a function call it
    if (typeof ref === 'function') {
      return safeInvoke(ref, node);
    } // otherwise we should treat it as a ref object
    else if (ref != null) {
        ref.current = node;
      }
  };
  /**
   * Simple ponyfill for Object.fromEntries
   */

  var fromEntries = function fromEntries(entries) {
    return entries.reduce(function (acc, _ref) {
      var key = _ref[0],
          value = _ref[1];
      acc[key] = value;
      return acc;
    }, {});
  };
  /**
   * Small wrapper around `useLayoutEffect` to get rid of the warning on SSR envs
   */

  var useIsomorphicLayoutEffect = typeof window !== 'undefined' && window.document && window.document.createElement ? React.useLayoutEffect : React.useEffect;

  /* global Map:readonly, Set:readonly, ArrayBuffer:readonly */

  var hasElementType = typeof Element !== 'undefined';
  var hasMap = typeof Map === 'function';
  var hasSet = typeof Set === 'function';
  var hasArrayBuffer = typeof ArrayBuffer === 'function';

  // Note: We **don't** need `envHasBigInt64Array` in fde es6/index.js

  function equal(a, b) {
    // START: fast-deep-equal es6/index.js 3.1.1
    if (a === b) return true;

    if (a && b && typeof a == 'object' && typeof b == 'object') {
      if (a.constructor !== b.constructor) return false;

      var length, i, keys;
      if (Array.isArray(a)) {
        length = a.length;
        if (length != b.length) return false;
        for (i = length; i-- !== 0;)
          if (!equal(a[i], b[i])) return false;
        return true;
      }

      // START: Modifications:
      // 1. Extra `has<Type> &&` helpers in initial condition allow es6 code
      //    to co-exist with es5.
      // 2. Replace `for of` with es5 compliant iteration using `for`.
      //    Basically, take:
      //
      //    ```js
      //    for (i of a.entries())
      //      if (!b.has(i[0])) return false;
      //    ```
      //
      //    ... and convert to:
      //
      //    ```js
      //    it = a.entries();
      //    while (!(i = it.next()).done)
      //      if (!b.has(i.value[0])) return false;
      //    ```
      //
      //    **Note**: `i` access switches to `i.value`.
      var it;
      if (hasMap && (a instanceof Map) && (b instanceof Map)) {
        if (a.size !== b.size) return false;
        it = a.entries();
        while (!(i = it.next()).done)
          if (!b.has(i.value[0])) return false;
        it = a.entries();
        while (!(i = it.next()).done)
          if (!equal(i.value[1], b.get(i.value[0]))) return false;
        return true;
      }

      if (hasSet && (a instanceof Set) && (b instanceof Set)) {
        if (a.size !== b.size) return false;
        it = a.entries();
        while (!(i = it.next()).done)
          if (!b.has(i.value[0])) return false;
        return true;
      }
      // END: Modifications

      if (hasArrayBuffer && ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
        length = a.length;
        if (length != b.length) return false;
        for (i = length; i-- !== 0;)
          if (a[i] !== b[i]) return false;
        return true;
      }

      if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
      if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
      if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

      keys = Object.keys(a);
      length = keys.length;
      if (length !== Object.keys(b).length) return false;

      for (i = length; i-- !== 0;)
        if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
      // END: fast-deep-equal

      // START: react-fast-compare
      // custom handling for DOM elements
      if (hasElementType && a instanceof Element) return false;

      // custom handling for React
      for (i = length; i-- !== 0;) {
        if (keys[i] === '_owner' && a.$$typeof) {
          // React-specific: avoid traversing React elements' _owner.
          //  _owner contains circular references
          // and is not needed when comparing the actual elements (and not their owners)
          // .$$typeof and ._store on just reasonable markers of a react element
          continue;
        }

        // all other properties should be traversed as usual
        if (!equal(a[keys[i]], b[keys[i]])) return false;
      }
      // END: react-fast-compare

      // START: fast-deep-equal
      return true;
    }

    return a !== a && b !== b;
  }
  // end fast-deep-equal

  var reactFastCompare = function isEqual(a, b) {
    try {
      return equal(a, b);
    } catch (error) {
      if (((error.message || '').match(/stack|recursion/i))) {
        // warn on circular references, don't crash
        // browsers give this different errors name and messages:
        // chrome/safari: "RangeError", "Maximum call stack size exceeded"
        // firefox: "InternalError", too much recursion"
        // edge: "Error", "Out of stack space"
        console.warn('react-fast-compare cannot handle circular refs');
        return false;
      }
      // some other error. we should definitely know about these
      throw error;
    }
  };

  var EMPTY_MODIFIERS = [];
  var usePopper = function usePopper(referenceElement, popperElement, options) {
    if (options === void 0) {
      options = {};
    }

    var prevOptions = React.useRef(null);
    var optionsWithDefaults = {
      onFirstUpdate: options.onFirstUpdate,
      placement: options.placement || 'bottom',
      strategy: options.strategy || 'absolute',
      modifiers: options.modifiers || EMPTY_MODIFIERS
    };

    var _React$useState = React.useState({
      styles: {
        popper: {
          position: optionsWithDefaults.strategy || 'absolute',
          left: '0',
          top: '0'
        }
      },
      attributes: {}
    }),
        state = _React$useState[0],
        setState = _React$useState[1];

    var updateStateModifier = React.useMemo(function () {
      return {
        name: 'updateState',
        enabled: true,
        phase: 'write',
        fn: function fn(_ref) {
          var state = _ref.state;
          var elements = Object.keys(state.elements);
          setState({
            styles: fromEntries(elements.map(function (element) {
              return [element, state.styles[element] || {}];
            })),
            attributes: fromEntries(elements.map(function (element) {
              return [element, state.attributes[element]];
            }))
          });
        },
        requires: ['computeStyles']
      };
    }, [setState]);
    var popperOptions = React.useMemo(function () {
      var newOptions = {
        onFirstUpdate: optionsWithDefaults.onFirstUpdate,
        placement: optionsWithDefaults.placement || 'bottom',
        strategy: optionsWithDefaults.strategy || 'absolute',
        modifiers: [].concat(optionsWithDefaults.modifiers, [updateStateModifier, {
          name: 'applyStyles',
          enabled: false
        }])
      };

      if (reactFastCompare(prevOptions.current, newOptions)) {
        return prevOptions.current || newOptions;
      } else {
        prevOptions.current = newOptions;
        return newOptions;
      }
    }, [optionsWithDefaults.onFirstUpdate, optionsWithDefaults.placement, optionsWithDefaults.strategy, optionsWithDefaults.modifiers, updateStateModifier]);
    var popperInstanceRef = React.useRef();
    var createPopper = React.useMemo(function () {
      return options.createPopper || core.createPopper;
    }, [options.createPopper]);
    useIsomorphicLayoutEffect(function () {
      var popperInstance = null;

      if (referenceElement != null && popperElement != null) {
        popperInstance = createPopper(referenceElement, popperElement, popperOptions);
        popperInstanceRef.current = popperInstance;
      }

      return function () {
        popperInstance != null && popperInstance.destroy();
        popperInstanceRef.current = null;
      }; // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [referenceElement, popperElement, createPopper]);
    useIsomorphicLayoutEffect(function () {
      if (popperInstanceRef.current) {
        popperInstanceRef.current.setOptions(popperOptions);
      }
    }, [popperOptions]);
    return {
      state: popperInstanceRef.current ? popperInstanceRef.current.state : null,
      styles: state.styles,
      attributes: state.attributes,
      update: popperInstanceRef.current ? popperInstanceRef.current.update : null,
      forceUpdate: popperInstanceRef.current ? popperInstanceRef.current.forceUpdate : null
    };
  };

  var NOOP = function NOOP() {
    return void 0;
  };

  var NOOP_PROMISE = function NOOP_PROMISE() {
    return Promise.resolve(null);
  };

  var EMPTY_MODIFIERS$1 = [];
  function Popper(_ref) {
    var _ref$placement = _ref.placement,
        placement = _ref$placement === void 0 ? 'bottom' : _ref$placement,
        _ref$strategy = _ref.strategy,
        strategy = _ref$strategy === void 0 ? 'absolute' : _ref$strategy,
        _ref$modifiers = _ref.modifiers,
        modifiers = _ref$modifiers === void 0 ? EMPTY_MODIFIERS$1 : _ref$modifiers,
        referenceElement = _ref.referenceElement,
        onFirstUpdate = _ref.onFirstUpdate,
        innerRef = _ref.innerRef,
        children = _ref.children;
    var referenceNode = React.useContext(ManagerReferenceNodeContext);

    var _React$useState = React.useState(null),
        popperElement = _React$useState[0],
        setPopperElement = _React$useState[1];

    var _React$useState2 = React.useState(null),
        arrowElement = _React$useState2[0],
        setArrowElement = _React$useState2[1];

    React.useEffect(function () {
      return setRef(innerRef, popperElement);
    }, [innerRef, popperElement]);
    var options = React.useMemo(function () {
      return {
        placement: placement,
        strategy: strategy,
        onFirstUpdate: onFirstUpdate,
        modifiers: [].concat(modifiers, [{
          name: 'arrow',
          enabled: arrowElement != null,
          options: {
            element: arrowElement
          }
        }])
      };
    }, [placement, strategy, onFirstUpdate, modifiers, arrowElement]);

    var _usePopper = usePopper(referenceElement || referenceNode, popperElement, options),
        state = _usePopper.state,
        styles = _usePopper.styles,
        forceUpdate = _usePopper.forceUpdate,
        update = _usePopper.update;

    var childrenProps = React.useMemo(function () {
      return {
        ref: setPopperElement,
        style: styles.popper,
        placement: state ? state.placement : placement,
        hasPopperEscaped: state && state.modifiersData.hide ? state.modifiersData.hide.hasPopperEscaped : null,
        isReferenceHidden: state && state.modifiersData.hide ? state.modifiersData.hide.isReferenceHidden : null,
        arrowProps: {
          style: styles.arrow,
          ref: setArrowElement
        },
        forceUpdate: forceUpdate || NOOP,
        update: update || NOOP_PROMISE
      };
    }, [setPopperElement, setArrowElement, placement, state, styles, update, forceUpdate]);
    return unwrapArray(children)(childrenProps);
  }

  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var warning = function() {};

  {
    var printWarning = function printWarning(format, args) {
      var len = arguments.length;
      args = new Array(len > 1 ? len - 1 : 0);
      for (var key = 1; key < len; key++) {
        args[key - 1] = arguments[key];
      }
      var argIndex = 0;
      var message = 'Warning: ' +
        format.replace(/%s/g, function() {
          return args[argIndex++];
        });
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };

    warning = function(condition, format, args) {
      var len = arguments.length;
      args = new Array(len > 2 ? len - 2 : 0);
      for (var key = 2; key < len; key++) {
        args[key - 2] = arguments[key];
      }
      if (format === undefined) {
        throw new Error(
            '`warning(condition, format, ...args)` requires a warning ' +
            'message argument'
        );
      }
      if (!condition) {
        printWarning.apply(null, [format].concat(args));
      }
    };
  }

  var warning_1 = warning;

  function Reference(_ref) {
    var children = _ref.children,
        innerRef = _ref.innerRef;
    var setReferenceNode = React.useContext(ManagerReferenceNodeSetterContext);
    var refHandler = React.useCallback(function (node) {
      setRef(innerRef, node);
      safeInvoke(setReferenceNode, node);
    }, [innerRef, setReferenceNode]); // ran on unmount

    React.useEffect(function () {
      return function () {
        return setRef(innerRef, null);
      };
    });
    React.useEffect(function () {
      warning_1(Boolean(setReferenceNode), '`Reference` should not be used outside of a `Manager` component.');
    }, [setReferenceNode]);
    return unwrapArray(children)({
      ref: refHandler
    });
  }

  exports.Manager = Manager;
  exports.Popper = Popper;
  exports.Reference = Reference;
  exports.usePopper = usePopper;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//static-content-hash-trigger-NON
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('styled-components'), require('react-dom'), require('react-popper')) :
  typeof define === 'function' && define.amd ? define(['react', 'styled-components', 'react-dom', 'react-popper'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Knowledge = factory(global.React, global.styled, global.ReactDOM, global.ReactPopper));
})(this, (function (React, styled, reactDom, reactPopper) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
  var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

  function _iterableToArrayLimit(arr, i) {
    var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
    if (null != _i) {
      var _s,
        _e,
        _x,
        _r,
        _arr = [],
        _n = !0,
        _d = !1;
      try {
        if (_x = (_i = _i.call(arr)).next, 0 === i) {
          if (Object(_i) !== _i) return;
          _n = !1;
        } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
      } catch (err) {
        _d = !0, _e = err;
      } finally {
        try {
          if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
  }
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
    return target;
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _taggedTemplateLiteral(strings, raw) {
    if (!raw) {
      raw = strings.slice(0);
    }
    return Object.freeze(Object.defineProperties(strings, {
      raw: {
        value: Object.freeze(raw)
      }
    }));
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  function createCommonjsModule(fn, basedir, module) {
  	return module = {
  	  path: basedir,
  	  exports: {},
  	  require: function (path, base) {
        return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
      }
  	}, fn(module, module.exports), module.exports;
  }

  function commonjsRequire () {
  	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
  }

  /*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  */
  /* eslint-disable no-unused-vars */
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;

  function toObject(val) {
  	if (val === null || val === undefined) {
  		throw new TypeError('Object.assign cannot be called with null or undefined');
  	}

  	return Object(val);
  }

  function shouldUseNative() {
  	try {
  		if (!Object.assign) {
  			return false;
  		}

  		// Detect buggy property enumeration order in older V8 versions.

  		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
  		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
  		test1[5] = 'de';
  		if (Object.getOwnPropertyNames(test1)[0] === '5') {
  			return false;
  		}

  		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
  		var test2 = {};
  		for (var i = 0; i < 10; i++) {
  			test2['_' + String.fromCharCode(i)] = i;
  		}
  		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
  			return test2[n];
  		});
  		if (order2.join('') !== '0123456789') {
  			return false;
  		}

  		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
  		var test3 = {};
  		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
  			test3[letter] = letter;
  		});
  		if (Object.keys(Object.assign({}, test3)).join('') !==
  				'abcdefghijklmnopqrst') {
  			return false;
  		}

  		return true;
  	} catch (err) {
  		// We don't expect any of the above to throw, but better to be safe.
  		return false;
  	}
  }

  shouldUseNative() ? Object.assign : function (target, source) {
  	var from;
  	var to = toObject(target);
  	var symbols;

  	for (var s = 1; s < arguments.length; s++) {
  		from = Object(arguments[s]);

  		for (var key in from) {
  			if (hasOwnProperty.call(from, key)) {
  				to[key] = from[key];
  			}
  		}

  		if (getOwnPropertySymbols) {
  			symbols = getOwnPropertySymbols(from);
  			for (var i = 0; i < symbols.length; i++) {
  				if (propIsEnumerable.call(from, symbols[i])) {
  					to[symbols[i]] = from[symbols[i]];
  				}
  			}
  		}
  	}

  	return to;
  };

  var reactJsxRuntime_production_min = createCommonjsModule(function (module, exports) {
  var g=60103;exports.Fragment=60107;if("function"===typeof Symbol&&Symbol.for){var h=Symbol.for;g=h("react.element");exports.Fragment=h("react.fragment");}var m=React__default["default"].__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,n=Object.prototype.hasOwnProperty,p={key:!0,ref:!0,__self:!0,__source:!0};
  function q(c,a,k){var b,d={},e=null,l=null;void 0!==k&&(e=""+k);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(l=a.ref);for(b in a)n.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a)void 0===d[b]&&(d[b]=a[b]);return {$$typeof:g,type:c,key:e,ref:l,props:d,_owner:m.current}}exports.jsx=q;exports.jsxs=q;
  });

  createCommonjsModule(function (module, exports) {
  });

  var jsxRuntime = createCommonjsModule(function (module) {

  {
    module.exports = reactJsxRuntime_production_min;
  }
  });

  const windowIsAvailable = typeof window !== 'undefined';
  const navigatorIsAvailable = typeof navigator !== 'undefined';
  const documentIsAvailable = typeof document !== 'undefined';
  /** @returns Debounced function that can be called only once in given timeout */
  function debounce(func, waitTime) {
      let timeout;
      return (...args) => {
          const waitFunc = () => {
              timeout = null;
              func.apply(this, args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(waitFunc, waitTime);
      };
  }
  /** Check for an existence of prop */
  function hasProp(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
  }
  // Capitalize
  function cap(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
  }
  /** Generate unique id for elements */
  function createUID() {
      return `_${Math.random().toString(36).substr(2, 9)}`;
  }
  /** Return an array of strings and regex replaced components */
  function replaceMatchWithElement(str, re, render) {
      const arr = [];
      // Only loop for stateful regexes.
      if (re.global || re.sticky) {
          let currIdx = 0;
          let match;
          // eslint-disable-next-line no-cond-assign
          while ((match = re.exec(str))) {
              arr.push(str.slice(currIdx, match.index), render(match[0]));
              currIdx = match.index + match[0].length;
          }
          arr.push(str.slice(currIdx));
      }
      else {
          const match = re.exec(str);
          if (!match)
              arr.push(str);
          else {
              arr.push(str.slice(0, match.index), render(match[0]), str.slice(match.index + match[0].length));
          }
      }
      return arr.flatMap((item, idx) => {
          if (!item)
              return [];
          return jsxRuntime.jsx(React.Fragment, { children: item }, idx);
      });
  }
  /** Used mostly to trigger css transition after DOM append */
  function reflow(node) {
      node = node ?? document.body;
      return node.offsetWidth;
  }
  function deepGet(obj, keys) {
      let rtn = obj;
      const found = keys.every(key => {
          if (typeof rtn === 'object' && rtn) {
              rtn = rtn[key];
              return true;
          }
          return false;
      });
      if (found)
          return rtn;
      return undefined;
  }
  function defineSmartGetter(obj, key, valueFn) {
      Object.defineProperty(obj, key, {
          get: () => {
              delete obj[key];
              obj[key] = valueFn();
              return obj[key];
          },
          enumerable: true,
          configurable: true
      });
      return obj;
  }
  function tryCatch(tryFn, catchFn, finallyFn) {
      try {
          return tryFn();
      }
      catch (err) {
          if (catchFn)
              return catchFn(err);
      }
      finally {
          // eslint-disable-next-line no-unsafe-finally
          if (finallyFn)
              return finallyFn();
      }
  }
  /**
   * Returns normalized list of elements, ie. it de-reference the element from the Ref if needed.
   * @param els a list of elements or refs to normalize.
   * @returns a new list of the same length with the de-referenced elements.
   */
  const normalizeElements = (els) => {
      return els.map((el) => {
          if (!el)
              return null;
          return el instanceof Element ? el : el.current;
      });
  };

  const useActiveDescendant = ({ focusEl, scope, scopeSelector, selector, focusDescendantEl, clearFocusDescendant, focusReturnEl, clearFocusReturn, currentDescendantId, onClick, preventInitialScroll, pauseDescendantEvaluation = false, clearPreventScroll }, dependencyArray = []) => {
      const [resetId, setResetId] = React.useState(0);
      const previousActiveId = React.useRef('');
      const [focusDescendantElIndex, setFocusDescendantElIndex] = React.useState(null);
      const [currentIndex, setCurrentIndex] = React.useState(null);
      const [descendants, setDescendants] = React.useState();
      const clearThenSetDescendants = React.useCallback((setVal) => {
          descendants?.forEach(node => {
              node.setAttribute('data-current', 'false');
          });
          setDescendants(setVal
              ? Array.from(setVal).filter((item) => item instanceof HTMLElement)
              : null);
      }, [descendants]);
      // ## Toggle active scope data attr.
      React.useEffect(() => {
          if (!scope || !focusEl)
              return;
          scope.setAttribute('data-active-scope', document.activeElement === focusEl ? 'true' : 'false');
          const onFocus = () => {
              scope.setAttribute('data-active-scope', 'true');
          };
          const onBlur = () => {
              scope.setAttribute('data-active-scope', 'false');
          };
          focusEl.addEventListener('focus', onFocus);
          focusEl.addEventListener('blur', onBlur);
          return () => {
              focusEl.removeEventListener('focus', onFocus);
              focusEl.removeEventListener('blur', onBlur);
          };
      }, [scope, focusEl]);
      // ## Update descendants
      React.useEffect(() => {
          if (!pauseDescendantEvaluation) {
              // 0 second timeout added because descendantScope needs to be up to date before running query after dependencyArray change
              setTimeout(() => {
                  let hasScope = scope;
                  if (hasScope && hasScope instanceof HTMLElement) {
                      if (scopeSelector) {
                          hasScope = hasScope.querySelector(scopeSelector);
                      }
                      if (!hasScope) {
                          clearThenSetDescendants(null);
                          return;
                      }
                      if (selector) {
                          clearThenSetDescendants(hasScope.querySelectorAll(selector));
                      }
                      else {
                          clearThenSetDescendants(hasScope.querySelectorAll('a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'));
                      }
                  }
                  else {
                      clearThenSetDescendants(null);
                  }
              }, 0);
          }
      }, [pauseDescendantEvaluation, scope, scopeSelector, selector, focusEl, ...dependencyArray]);
      // ## Set IDs and aria-owns
      React.useEffect(() => {
          const ownedIds = [];
          setCurrentIndex(0);
          if (descendants && descendants.length) {
              descendants.forEach(node => {
                  node.id = node.id || createUID();
                  ownedIds.push(node.id);
              });
          }
          focusEl?.setAttribute('aria-owns', ownedIds.join(' '));
          return () => {
              focusEl?.removeAttribute('aria-owns');
          };
      }, [focusEl, descendants]);
      // ## Bind focus el keyDown
      React.useEffect(() => {
          const onKeyDown = (e) => {
              if (descendants && descendants.length) {
                  switch (e.key) {
                      case 'ArrowDown':
                          e.preventDefault();
                          // Focus next or first
                          clearFocusReturn?.();
                          clearPreventScroll?.();
                          if (currentIndex !== null && currentIndex + 1 < descendants.length) {
                              setCurrentIndex(currentIndex + 1);
                          }
                          else {
                              setCurrentIndex(0);
                          }
                          break;
                      case 'ArrowUp':
                          e.preventDefault();
                          // Focus previous or last
                          clearFocusReturn?.();
                          clearPreventScroll?.();
                          if (currentIndex !== null && currentIndex - 1 > -1) {
                              setCurrentIndex(currentIndex - 1);
                          }
                          else {
                              setCurrentIndex(descendants.length - 1);
                          }
                          break;
                      case 'Enter':
                          e.preventDefault();
                          // Click focused item
                          if (descendants && descendants.length && currentIndex !== null) {
                              if (onClick) {
                                  onClick(descendants[currentIndex]);
                                  break;
                              }
                              const nodeName = descendants[currentIndex].nodeName.toLowerCase();
                              if (nodeName === 'input' || nodeName === 'button' || nodeName === 'a') {
                                  descendants[currentIndex].click();
                              }
                              else {
                                  descendants[currentIndex].querySelector('button, a, input')?.click();
                              }
                          }
                          break;
                  }
              }
          };
          // Do not rebind once / if `currentDescendantId` control is defined
          if (focusEl && descendants?.length && !currentDescendantId) {
              focusEl.addEventListener('keydown', onKeyDown);
          }
          return () => {
              focusEl?.removeEventListener('keydown', onKeyDown);
          };
      }, [focusEl, currentIndex, descendants]);
      // ## Handle independent control update
      React.useEffect(() => {
          if (descendants && currentDescendantId) {
              descendants.forEach((node, index) => {
                  if (node.id === currentDescendantId) {
                      setCurrentIndex(index);
                  }
              });
          }
      }, [currentDescendantId, descendants]);
      // ## Set and scroll to current descendant
      React.useEffect(() => {
          const nextIndex = focusDescendantElIndex || currentIndex;
          const focusReturnId = focusReturnEl?.id;
          let focusReturnIndex;
          const focusDescendantElId = focusDescendantEl?.id;
          let focusDescendantIndex;
          let foundFocusDescendantEl = false;
          if (descendants && descendants.length) {
              // clear previous & catch focusReturn / focusDescendantEl index
              descendants.forEach((node, index) => {
                  if (focusDescendantElIndex === null && node.id === focusDescendantElId) {
                      focusDescendantIndex = index;
                      foundFocusDescendantEl = true;
                      setFocusDescendantElIndex(index);
                  }
                  if (node.id === focusReturnId) {
                      focusReturnIndex = index;
                  }
                  node.setAttribute('data-current', 'false');
              });
              // early return for focusReturn / focusDescendantEl
              if (focusReturnIndex && focusReturnIndex !== currentIndex) {
                  setCurrentIndex(focusReturnIndex);
                  clearFocusReturn?.();
                  return;
              }
              if (foundFocusDescendantEl && focusDescendantIndex !== undefined) {
                  // hard reset to continue focusDescendantEl process even if it is the active descendant
                  setResetId(Math.random());
                  setCurrentIndex(focusDescendantIndex);
                  return;
              }
              // set new
              if (nextIndex !== null && descendants[nextIndex]) {
                  const itemEl = descendants[nextIndex];
                  itemEl.setAttribute('data-current', 'true');
                  focusEl?.setAttribute('aria-activedescendant', itemEl.id);
                  // scroll to element
                  if (itemEl.id !== previousActiveId.current && !preventInitialScroll) {
                      const scrollTo = Element.prototype.scrollIntoViewIfNeeded ?? Element.prototype.scrollIntoView;
                      scrollTo?.call(itemEl, false);
                  }
                  // focusDescendantEl cleanup
                  if (focusDescendantElIndex !== null) {
                      setFocusDescendantElIndex(null);
                      clearFocusDescendant?.();
                  }
                  previousActiveId.current = itemEl.id;
              }
          }
          return () => {
              focusEl?.removeAttribute('aria-activedescendant');
          };
      }, [descendants, currentIndex, focusDescendantEl, focusEl, resetId]);
      return {
          activeDescendant: currentIndex !== null && descendants ? descendants[currentIndex] : undefined,
          descendants: descendants || null
      };
  };
  var useActiveDescendant$1 = useActiveDescendant;

  /**
   * @example useAfterInitialEffect(cb, dependencies);
   * @param cb The function that should be executed whenever this hook is called. [React EffectCallback](https://reactjs.org/docs/hooks-reference.html#useeffect)
   * @param dependencies A list of variables or functions that will initiate this hook when they are updated.
   */
  const useAfterInitialEffect = (cb, dependencies) => {
      const ref = React.useRef(false);
      React.useEffect(() => {
          if (ref.current)
              return cb();
          ref.current = true;
      }, dependencies);
  };
  var useAfterInitialEffect$1 = useAfterInitialEffect;

  const focusable = `
  a[href],
  button:enabled,
  input[type='checkbox']:enabled,
  input[type='radio']:enabled
`;
  /**
   * @example useArrows(ref, { cycle, selector });
   * @param ref - A reference to the element that will be navigated through. [React RefObject](https://reactjs.org/docs/refs-and-the-dom.html)
   */
  const useArrows = (ref, { 
  /** If true, the down or up arrow key will navigate to the first or last element if the element currently focused is the last or first index of the selected elements. */
  cycle = true, 
  /** A query selector that will determine which elements to cycle through with the arrow keys. The selector will be used in conjunction with [querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll#selectors). */
  selector = focusable, 
  /** Which keys are used to navigate through the list */
  dir = 'up-down' } = {}) => {
      const [NextKey, PrevKey] = dir === 'up-down' ? ['ArrowDown', 'ArrowUp'] : ['ArrowRight', 'ArrowLeft'];
      const setTabIndexes = React.useCallback((el) => {
          // don't set tabindex -1 for first element, or an element with a checked input inside of it to be able to focus it
          Array.from(el.querySelectorAll(selector))
              .slice(1)
              .forEach(item => {
              if (item instanceof HTMLElement) {
                  const checked = item.checked;
                  if (!checked)
                      item.tabIndex = -1;
              }
          });
      }, [selector]);
      const listener = React.useCallback((e) => {
          if (['Home', 'End', NextKey, PrevKey].includes(e.key))
              e.preventDefault();
          if (!documentIsAvailable)
              return;
          const el = ref.current;
          if (!el)
              return;
          const items = Array.from(el.querySelectorAll(selector)).filter((item) => item instanceof HTMLElement);
          if (!items.length)
              return;
          const rootNode = el.getRootNode();
          if (!(rootNode instanceof Document) && !(rootNode instanceof ShadowRoot))
              return;
          const focusIdx = items.indexOf(rootNode.activeElement);
          const lastIdx = items.length - 1;
          let newFocusIdx;
          if (e.key === 'Home' || (e.key === NextKey && focusIdx === -1)) {
              newFocusIdx = 0;
          }
          else if (e.key === 'End' || (e.key === PrevKey && focusIdx === -1)) {
              newFocusIdx = lastIdx;
          }
          else if (e.key === 'Enter') {
              setTabIndexes(el);
              return;
          }
          else if (e.key === NextKey) {
              if (focusIdx === lastIdx) {
                  if (!cycle)
                      return;
                  newFocusIdx = 0;
              }
              else {
                  newFocusIdx = focusIdx + 1;
              }
          }
          else if (e.key === PrevKey) {
              if (focusIdx === 0) {
                  if (!cycle)
                      return;
                  newFocusIdx = lastIdx;
              }
              else {
                  newFocusIdx = focusIdx - 1;
              }
          }
          else {
              return;
          }
          items[newFocusIdx].focus();
      }, [ref.current, cycle, selector]);
      React.useEffect(() => {
          const el = ref.current;
          if (!el)
              return;
          setTabIndexes(el);
          el.addEventListener('keydown', listener);
          return () => {
              el.removeEventListener('keydown', listener);
          };
      }, [ref.current, selector, listener]);
  };
  var useArrows$1 = useArrows;

  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
    return _setPrototypeOf(o, p);
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct.bind();
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }
    return _construct.apply(null, arguments);
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;
    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;
      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }
      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);
        _cache.set(Class, Wrapper);
      }
      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }
      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };
    return _wrapNativeSuper(Class);
  }

  /**
   * Create an error file out of errors.md for development and a simple web link to the full errors
   * in production mode.
   * @private
   */


  var PolishedError = /*#__PURE__*/function (_Error) {
    _inheritsLoose(PolishedError, _Error);

    function PolishedError(code) {
      var _this;

      {
        _this = _Error.call(this, "An error occurred. See https://github.com/styled-components/polished/blob/main/src/internalHelpers/errors.md#" + code + " for more information.") || this;
      }

      return _assertThisInitialized(_this);
    }

    return PolishedError;
  }( /*#__PURE__*/_wrapNativeSuper(Error));

  var cssRegex = /^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/;
  /**
   * Returns a given CSS value and its unit as elements of an array.
   *
   * @example
   * // Styles as object usage
   * const styles = {
   *   '--dimension': getValueAndUnit('100px')[0],
   *   '--unit': getValueAndUnit('100px')[1],
   * }
   *
   * // styled-components usage
   * const div = styled.div`
   *   --dimension: ${getValueAndUnit('100px')[0]};
   *   --unit: ${getValueAndUnit('100px')[1]};
   * `
   *
   * // CSS in JS Output
   *
   * element {
   *   '--dimension': 100,
   *   '--unit': 'px',
   * }
   */

  function getValueAndUnit(value) {
    if (typeof value !== 'string') return [value, ''];
    var matchedValue = value.match(cssRegex);
    if (matchedValue) return [parseFloat(value), matchedValue[2]];
    return [value, undefined];
  }

  var ratioNames = {
    minorSecond: 1.067,
    majorSecond: 1.125,
    minorThird: 1.2,
    majorThird: 1.25,
    perfectFourth: 1.333,
    augFourth: 1.414,
    perfectFifth: 1.5,
    minorSixth: 1.6,
    goldenSection: 1.618,
    majorSixth: 1.667,
    minorSeventh: 1.778,
    majorSeventh: 1.875,
    octave: 2,
    majorTenth: 2.5,
    majorEleventh: 2.667,
    majorTwelfth: 3,
    doubleOctave: 4
  };

  function getRatio(ratioName) {
    return ratioNames[ratioName];
  }
  /**
   * Establish consistent measurements and spacial relationships throughout your projects by incrementing an em or rem value up or down a defined scale. We provide a list of commonly used scales as pre-defined variables.
   * @example
   * // Styles as object usage
   * const styles = {
   *    // Increment two steps up the default scale
   *   'fontSize': modularScale(2)
   * }
   *
   * // styled-components usage
   * const div = styled.div`
   *    // Increment two steps up the default scale
   *   fontSize: ${modularScale(2)}
   * `
   *
   * // CSS in JS Output
   *
   * element {
   *   'fontSize': '1.77689em'
   * }
   */


  function modularScale(steps, base, ratio) {
    if (base === void 0) {
      base = '1em';
    }

    if (ratio === void 0) {
      ratio = 1.333;
    }

    if (typeof steps !== 'number') {
      throw new PolishedError(42);
    }

    if (typeof ratio === 'string' && !ratioNames[ratio]) {
      throw new PolishedError(43);
    }

    var _ref = typeof base === 'string' ? getValueAndUnit(base) : [base, ''],
        realBase = _ref[0],
        unit = _ref[1];

    var realRatio = typeof ratio === 'string' ? getRatio(ratio) : ratio;

    if (typeof realBase === 'string') {
      throw new PolishedError(44, base);
    }

    return "" + realBase * Math.pow(realRatio, steps) + (unit || '');
  }

  /**
   * CSS to hide content visually but remain accessible to screen readers.
   * from [HTML5 Boilerplate](https://github.com/h5bp/html5-boilerplate/blob/9a176f57af1cfe8ec70300da4621fb9b07e5fa31/src/css/main.css#L121)
   *
   * @example
   * // Styles as object usage
   * const styles = {
   *   ...hideVisually(),
   * }
   *
   * // styled-components usage
   * const div = styled.div`
   *   ${hideVisually()};
   * `
   *
   * // CSS as JS Output
   *
   * 'div': {
   *   'border': '0',
   *   'clip': 'rect(0 0 0 0)',
   *   'height': '1px',
   *   'margin': '-1px',
   *   'overflow': 'hidden',
   *   'padding': '0',
   *   'position': 'absolute',
   *   'whiteSpace': 'nowrap',
   *   'width': '1px',
   * }
   */
  function hideVisually() {
    return {
      border: '0',
      clip: 'rect(0 0 0 0)',
      height: '1px',
      margin: '-1px',
      overflow: 'hidden',
      padding: '0',
      position: 'absolute',
      whiteSpace: 'nowrap',
      width: '1px'
    };
  }

  function colorToInt(color) {
    return Math.round(color * 255);
  }

  function convertToInt(red, green, blue) {
    return colorToInt(red) + "," + colorToInt(green) + "," + colorToInt(blue);
  }

  function hslToRgb(hue, saturation, lightness, convert) {
    if (convert === void 0) {
      convert = convertToInt;
    }

    if (saturation === 0) {
      // achromatic
      return convert(lightness, lightness, lightness);
    } // formulae from https://en.wikipedia.org/wiki/HSL_and_HSV


    var huePrime = (hue % 360 + 360) % 360 / 60;
    var chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
    var secondComponent = chroma * (1 - Math.abs(huePrime % 2 - 1));
    var red = 0;
    var green = 0;
    var blue = 0;

    if (huePrime >= 0 && huePrime < 1) {
      red = chroma;
      green = secondComponent;
    } else if (huePrime >= 1 && huePrime < 2) {
      red = secondComponent;
      green = chroma;
    } else if (huePrime >= 2 && huePrime < 3) {
      green = chroma;
      blue = secondComponent;
    } else if (huePrime >= 3 && huePrime < 4) {
      green = secondComponent;
      blue = chroma;
    } else if (huePrime >= 4 && huePrime < 5) {
      red = secondComponent;
      blue = chroma;
    } else if (huePrime >= 5 && huePrime < 6) {
      red = chroma;
      blue = secondComponent;
    }

    var lightnessModification = lightness - chroma / 2;
    var finalRed = red + lightnessModification;
    var finalGreen = green + lightnessModification;
    var finalBlue = blue + lightnessModification;
    return convert(finalRed, finalGreen, finalBlue);
  }

  var namedColorMap = {
    aliceblue: 'f0f8ff',
    antiquewhite: 'faebd7',
    aqua: '00ffff',
    aquamarine: '7fffd4',
    azure: 'f0ffff',
    beige: 'f5f5dc',
    bisque: 'ffe4c4',
    black: '000',
    blanchedalmond: 'ffebcd',
    blue: '0000ff',
    blueviolet: '8a2be2',
    brown: 'a52a2a',
    burlywood: 'deb887',
    cadetblue: '5f9ea0',
    chartreuse: '7fff00',
    chocolate: 'd2691e',
    coral: 'ff7f50',
    cornflowerblue: '6495ed',
    cornsilk: 'fff8dc',
    crimson: 'dc143c',
    cyan: '00ffff',
    darkblue: '00008b',
    darkcyan: '008b8b',
    darkgoldenrod: 'b8860b',
    darkgray: 'a9a9a9',
    darkgreen: '006400',
    darkgrey: 'a9a9a9',
    darkkhaki: 'bdb76b',
    darkmagenta: '8b008b',
    darkolivegreen: '556b2f',
    darkorange: 'ff8c00',
    darkorchid: '9932cc',
    darkred: '8b0000',
    darksalmon: 'e9967a',
    darkseagreen: '8fbc8f',
    darkslateblue: '483d8b',
    darkslategray: '2f4f4f',
    darkslategrey: '2f4f4f',
    darkturquoise: '00ced1',
    darkviolet: '9400d3',
    deeppink: 'ff1493',
    deepskyblue: '00bfff',
    dimgray: '696969',
    dimgrey: '696969',
    dodgerblue: '1e90ff',
    firebrick: 'b22222',
    floralwhite: 'fffaf0',
    forestgreen: '228b22',
    fuchsia: 'ff00ff',
    gainsboro: 'dcdcdc',
    ghostwhite: 'f8f8ff',
    gold: 'ffd700',
    goldenrod: 'daa520',
    gray: '808080',
    green: '008000',
    greenyellow: 'adff2f',
    grey: '808080',
    honeydew: 'f0fff0',
    hotpink: 'ff69b4',
    indianred: 'cd5c5c',
    indigo: '4b0082',
    ivory: 'fffff0',
    khaki: 'f0e68c',
    lavender: 'e6e6fa',
    lavenderblush: 'fff0f5',
    lawngreen: '7cfc00',
    lemonchiffon: 'fffacd',
    lightblue: 'add8e6',
    lightcoral: 'f08080',
    lightcyan: 'e0ffff',
    lightgoldenrodyellow: 'fafad2',
    lightgray: 'd3d3d3',
    lightgreen: '90ee90',
    lightgrey: 'd3d3d3',
    lightpink: 'ffb6c1',
    lightsalmon: 'ffa07a',
    lightseagreen: '20b2aa',
    lightskyblue: '87cefa',
    lightslategray: '789',
    lightslategrey: '789',
    lightsteelblue: 'b0c4de',
    lightyellow: 'ffffe0',
    lime: '0f0',
    limegreen: '32cd32',
    linen: 'faf0e6',
    magenta: 'f0f',
    maroon: '800000',
    mediumaquamarine: '66cdaa',
    mediumblue: '0000cd',
    mediumorchid: 'ba55d3',
    mediumpurple: '9370db',
    mediumseagreen: '3cb371',
    mediumslateblue: '7b68ee',
    mediumspringgreen: '00fa9a',
    mediumturquoise: '48d1cc',
    mediumvioletred: 'c71585',
    midnightblue: '191970',
    mintcream: 'f5fffa',
    mistyrose: 'ffe4e1',
    moccasin: 'ffe4b5',
    navajowhite: 'ffdead',
    navy: '000080',
    oldlace: 'fdf5e6',
    olive: '808000',
    olivedrab: '6b8e23',
    orange: 'ffa500',
    orangered: 'ff4500',
    orchid: 'da70d6',
    palegoldenrod: 'eee8aa',
    palegreen: '98fb98',
    paleturquoise: 'afeeee',
    palevioletred: 'db7093',
    papayawhip: 'ffefd5',
    peachpuff: 'ffdab9',
    peru: 'cd853f',
    pink: 'ffc0cb',
    plum: 'dda0dd',
    powderblue: 'b0e0e6',
    purple: '800080',
    rebeccapurple: '639',
    red: 'f00',
    rosybrown: 'bc8f8f',
    royalblue: '4169e1',
    saddlebrown: '8b4513',
    salmon: 'fa8072',
    sandybrown: 'f4a460',
    seagreen: '2e8b57',
    seashell: 'fff5ee',
    sienna: 'a0522d',
    silver: 'c0c0c0',
    skyblue: '87ceeb',
    slateblue: '6a5acd',
    slategray: '708090',
    slategrey: '708090',
    snow: 'fffafa',
    springgreen: '00ff7f',
    steelblue: '4682b4',
    tan: 'd2b48c',
    teal: '008080',
    thistle: 'd8bfd8',
    tomato: 'ff6347',
    turquoise: '40e0d0',
    violet: 'ee82ee',
    wheat: 'f5deb3',
    white: 'fff',
    whitesmoke: 'f5f5f5',
    yellow: 'ff0',
    yellowgreen: '9acd32'
  };
  /**
   * Checks if a string is a CSS named color and returns its equivalent hex value, otherwise returns the original color.
   * @private
   */

  function nameToHex(color) {
    if (typeof color !== 'string') return color;
    var normalizedColorName = color.toLowerCase();
    return namedColorMap[normalizedColorName] ? "#" + namedColorMap[normalizedColorName] : color;
  }

  var hexRegex = /^#[a-fA-F0-9]{6}$/;
  var hexRgbaRegex = /^#[a-fA-F0-9]{8}$/;
  var reducedHexRegex = /^#[a-fA-F0-9]{3}$/;
  var reducedRgbaHexRegex = /^#[a-fA-F0-9]{4}$/;
  var rgbRegex = /^rgb\(\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*\)$/i;
  var rgbaRegex = /^rgb(?:a)?\(\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,|\/)\s*([-+]?\d*[.]?\d+[%]?)\s*\)$/i;
  var hslRegex = /^hsl\(\s*(\d{0,3}[.]?[0-9]+(?:deg)?)\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*\)$/i;
  var hslaRegex = /^hsl(?:a)?\(\s*(\d{0,3}[.]?[0-9]+(?:deg)?)\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,|\/)\s*([-+]?\d*[.]?\d+[%]?)\s*\)$/i;
  /**
   * Returns an RgbColor or RgbaColor object. This utility function is only useful
   * if want to extract a color component. With the color util `toColorString` you
   * can convert a RgbColor or RgbaColor object back to a string.
   *
   * @example
   * // Assigns `{ red: 255, green: 0, blue: 0 }` to color1
   * const color1 = parseToRgb('rgb(255, 0, 0)');
   * // Assigns `{ red: 92, green: 102, blue: 112, alpha: 0.75 }` to color2
   * const color2 = parseToRgb('hsla(210, 10%, 40%, 0.75)');
   */

  function parseToRgb(color) {
    if (typeof color !== 'string') {
      throw new PolishedError(3);
    }

    var normalizedColor = nameToHex(color);

    if (normalizedColor.match(hexRegex)) {
      return {
        red: parseInt("" + normalizedColor[1] + normalizedColor[2], 16),
        green: parseInt("" + normalizedColor[3] + normalizedColor[4], 16),
        blue: parseInt("" + normalizedColor[5] + normalizedColor[6], 16)
      };
    }

    if (normalizedColor.match(hexRgbaRegex)) {
      var alpha = parseFloat((parseInt("" + normalizedColor[7] + normalizedColor[8], 16) / 255).toFixed(2));
      return {
        red: parseInt("" + normalizedColor[1] + normalizedColor[2], 16),
        green: parseInt("" + normalizedColor[3] + normalizedColor[4], 16),
        blue: parseInt("" + normalizedColor[5] + normalizedColor[6], 16),
        alpha: alpha
      };
    }

    if (normalizedColor.match(reducedHexRegex)) {
      return {
        red: parseInt("" + normalizedColor[1] + normalizedColor[1], 16),
        green: parseInt("" + normalizedColor[2] + normalizedColor[2], 16),
        blue: parseInt("" + normalizedColor[3] + normalizedColor[3], 16)
      };
    }

    if (normalizedColor.match(reducedRgbaHexRegex)) {
      var _alpha = parseFloat((parseInt("" + normalizedColor[4] + normalizedColor[4], 16) / 255).toFixed(2));

      return {
        red: parseInt("" + normalizedColor[1] + normalizedColor[1], 16),
        green: parseInt("" + normalizedColor[2] + normalizedColor[2], 16),
        blue: parseInt("" + normalizedColor[3] + normalizedColor[3], 16),
        alpha: _alpha
      };
    }

    var rgbMatched = rgbRegex.exec(normalizedColor);

    if (rgbMatched) {
      return {
        red: parseInt("" + rgbMatched[1], 10),
        green: parseInt("" + rgbMatched[2], 10),
        blue: parseInt("" + rgbMatched[3], 10)
      };
    }

    var rgbaMatched = rgbaRegex.exec(normalizedColor.substring(0, 50));

    if (rgbaMatched) {
      return {
        red: parseInt("" + rgbaMatched[1], 10),
        green: parseInt("" + rgbaMatched[2], 10),
        blue: parseInt("" + rgbaMatched[3], 10),
        alpha: parseFloat("" + rgbaMatched[4]) > 1 ? parseFloat("" + rgbaMatched[4]) / 100 : parseFloat("" + rgbaMatched[4])
      };
    }

    var hslMatched = hslRegex.exec(normalizedColor);

    if (hslMatched) {
      var hue = parseInt("" + hslMatched[1], 10);
      var saturation = parseInt("" + hslMatched[2], 10) / 100;
      var lightness = parseInt("" + hslMatched[3], 10) / 100;
      var rgbColorString = "rgb(" + hslToRgb(hue, saturation, lightness) + ")";
      var hslRgbMatched = rgbRegex.exec(rgbColorString);

      if (!hslRgbMatched) {
        throw new PolishedError(4, normalizedColor, rgbColorString);
      }

      return {
        red: parseInt("" + hslRgbMatched[1], 10),
        green: parseInt("" + hslRgbMatched[2], 10),
        blue: parseInt("" + hslRgbMatched[3], 10)
      };
    }

    var hslaMatched = hslaRegex.exec(normalizedColor.substring(0, 50));

    if (hslaMatched) {
      var _hue = parseInt("" + hslaMatched[1], 10);

      var _saturation = parseInt("" + hslaMatched[2], 10) / 100;

      var _lightness = parseInt("" + hslaMatched[3], 10) / 100;

      var _rgbColorString = "rgb(" + hslToRgb(_hue, _saturation, _lightness) + ")";

      var _hslRgbMatched = rgbRegex.exec(_rgbColorString);

      if (!_hslRgbMatched) {
        throw new PolishedError(4, normalizedColor, _rgbColorString);
      }

      return {
        red: parseInt("" + _hslRgbMatched[1], 10),
        green: parseInt("" + _hslRgbMatched[2], 10),
        blue: parseInt("" + _hslRgbMatched[3], 10),
        alpha: parseFloat("" + hslaMatched[4]) > 1 ? parseFloat("" + hslaMatched[4]) / 100 : parseFloat("" + hslaMatched[4])
      };
    }

    throw new PolishedError(5);
  }

  function rgbToHsl(color) {
    // make sure rgb are contained in a set of [0, 255]
    var red = color.red / 255;
    var green = color.green / 255;
    var blue = color.blue / 255;
    var max = Math.max(red, green, blue);
    var min = Math.min(red, green, blue);
    var lightness = (max + min) / 2;

    if (max === min) {
      // achromatic
      if (color.alpha !== undefined) {
        return {
          hue: 0,
          saturation: 0,
          lightness: lightness,
          alpha: color.alpha
        };
      } else {
        return {
          hue: 0,
          saturation: 0,
          lightness: lightness
        };
      }
    }

    var hue;
    var delta = max - min;
    var saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case red:
        hue = (green - blue) / delta + (green < blue ? 6 : 0);
        break;

      case green:
        hue = (blue - red) / delta + 2;
        break;

      default:
        // blue case
        hue = (red - green) / delta + 4;
        break;
    }

    hue *= 60;

    if (color.alpha !== undefined) {
      return {
        hue: hue,
        saturation: saturation,
        lightness: lightness,
        alpha: color.alpha
      };
    }

    return {
      hue: hue,
      saturation: saturation,
      lightness: lightness
    };
  }

  /**
   * Returns an HslColor or HslaColor object. This utility function is only useful
   * if want to extract a color component. With the color util `toColorString` you
   * can convert a HslColor or HslaColor object back to a string.
   *
   * @example
   * // Assigns `{ hue: 0, saturation: 1, lightness: 0.5 }` to color1
   * const color1 = parseToHsl('rgb(255, 0, 0)');
   * // Assigns `{ hue: 128, saturation: 1, lightness: 0.5, alpha: 0.75 }` to color2
   * const color2 = parseToHsl('hsla(128, 100%, 50%, 0.75)');
   */
  function parseToHsl(color) {
    // Note: At a later stage we can optimize this function as right now a hsl
    // color would be parsed converted to rgb values and converted back to hsl.
    return rgbToHsl(parseToRgb(color));
  }

  /**
   * Reduces hex values if possible e.g. #ff8866 to #f86
   * @private
   */
  var reduceHexValue = function reduceHexValue(value) {
    if (value.length === 7 && value[1] === value[2] && value[3] === value[4] && value[5] === value[6]) {
      return "#" + value[1] + value[3] + value[5];
    }

    return value;
  };

  var reduceHexValue$1 = reduceHexValue;

  function numberToHex(value) {
    var hex = value.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }

  function colorToHex(color) {
    return numberToHex(Math.round(color * 255));
  }

  function convertToHex(red, green, blue) {
    return reduceHexValue$1("#" + colorToHex(red) + colorToHex(green) + colorToHex(blue));
  }

  function hslToHex(hue, saturation, lightness) {
    return hslToRgb(hue, saturation, lightness, convertToHex);
  }

  /**
   * Returns a string value for the color. The returned result is the smallest possible hex notation.
   *
   * @example
   * // Styles as object usage
   * const styles = {
   *   background: hsl(359, 0.75, 0.4),
   *   background: hsl({ hue: 360, saturation: 0.75, lightness: 0.4 }),
   * }
   *
   * // styled-components usage
   * const div = styled.div`
   *   background: ${hsl(359, 0.75, 0.4)};
   *   background: ${hsl({ hue: 360, saturation: 0.75, lightness: 0.4 })};
   * `
   *
   * // CSS in JS Output
   *
   * element {
   *   background: "#b3191c";
   *   background: "#b3191c";
   * }
   */
  function hsl(value, saturation, lightness) {
    if (typeof value === 'number' && typeof saturation === 'number' && typeof lightness === 'number') {
      return hslToHex(value, saturation, lightness);
    } else if (typeof value === 'object' && saturation === undefined && lightness === undefined) {
      return hslToHex(value.hue, value.saturation, value.lightness);
    }

    throw new PolishedError(1);
  }

  /**
   * Returns a string value for the color. The returned result is the smallest possible rgba or hex notation.
   *
   * @example
   * // Styles as object usage
   * const styles = {
   *   background: hsla(359, 0.75, 0.4, 0.7),
   *   background: hsla({ hue: 360, saturation: 0.75, lightness: 0.4, alpha: 0,7 }),
   *   background: hsla(359, 0.75, 0.4, 1),
   * }
   *
   * // styled-components usage
   * const div = styled.div`
   *   background: ${hsla(359, 0.75, 0.4, 0.7)};
   *   background: ${hsla({ hue: 360, saturation: 0.75, lightness: 0.4, alpha: 0,7 })};
   *   background: ${hsla(359, 0.75, 0.4, 1)};
   * `
   *
   * // CSS in JS Output
   *
   * element {
   *   background: "rgba(179,25,28,0.7)";
   *   background: "rgba(179,25,28,0.7)";
   *   background: "#b3191c";
   * }
   */
  function hsla(value, saturation, lightness, alpha) {
    if (typeof value === 'number' && typeof saturation === 'number' && typeof lightness === 'number' && typeof alpha === 'number') {
      return alpha >= 1 ? hslToHex(value, saturation, lightness) : "rgba(" + hslToRgb(value, saturation, lightness) + "," + alpha + ")";
    } else if (typeof value === 'object' && saturation === undefined && lightness === undefined && alpha === undefined) {
      return value.alpha >= 1 ? hslToHex(value.hue, value.saturation, value.lightness) : "rgba(" + hslToRgb(value.hue, value.saturation, value.lightness) + "," + value.alpha + ")";
    }

    throw new PolishedError(2);
  }

  /**
   * Returns a string value for the color. The returned result is the smallest possible hex notation.
   *
   * @example
   * // Styles as object usage
   * const styles = {
   *   background: rgb(255, 205, 100),
   *   background: rgb({ red: 255, green: 205, blue: 100 }),
   * }
   *
   * // styled-components usage
   * const div = styled.div`
   *   background: ${rgb(255, 205, 100)};
   *   background: ${rgb({ red: 255, green: 205, blue: 100 })};
   * `
   *
   * // CSS in JS Output
   *
   * element {
   *   background: "#ffcd64";
   *   background: "#ffcd64";
   * }
   */
  function rgb(value, green, blue) {
    if (typeof value === 'number' && typeof green === 'number' && typeof blue === 'number') {
      return reduceHexValue$1("#" + numberToHex(value) + numberToHex(green) + numberToHex(blue));
    } else if (typeof value === 'object' && green === undefined && blue === undefined) {
      return reduceHexValue$1("#" + numberToHex(value.red) + numberToHex(value.green) + numberToHex(value.blue));
    }

    throw new PolishedError(6);
  }

  /**
   * Returns a string value for the color. The returned result is the smallest possible rgba or hex notation.
   *
   * Can also be used to fade a color by passing a hex value or named CSS color along with an alpha value.
   *
   * @example
   * // Styles as object usage
   * const styles = {
   *   background: rgba(255, 205, 100, 0.7),
   *   background: rgba({ red: 255, green: 205, blue: 100, alpha: 0.7 }),
   *   background: rgba(255, 205, 100, 1),
   *   background: rgba('#ffffff', 0.4),
   *   background: rgba('black', 0.7),
   * }
   *
   * // styled-components usage
   * const div = styled.div`
   *   background: ${rgba(255, 205, 100, 0.7)};
   *   background: ${rgba({ red: 255, green: 205, blue: 100, alpha: 0.7 })};
   *   background: ${rgba(255, 205, 100, 1)};
   *   background: ${rgba('#ffffff', 0.4)};
   *   background: ${rgba('black', 0.7)};
   * `
   *
   * // CSS in JS Output
   *
   * element {
   *   background: "rgba(255,205,100,0.7)";
   *   background: "rgba(255,205,100,0.7)";
   *   background: "#ffcd64";
   *   background: "rgba(255,255,255,0.4)";
   *   background: "rgba(0,0,0,0.7)";
   * }
   */
  function rgba(firstValue, secondValue, thirdValue, fourthValue) {
    if (typeof firstValue === 'string' && typeof secondValue === 'number') {
      var rgbValue = parseToRgb(firstValue);
      return "rgba(" + rgbValue.red + "," + rgbValue.green + "," + rgbValue.blue + "," + secondValue + ")";
    } else if (typeof firstValue === 'number' && typeof secondValue === 'number' && typeof thirdValue === 'number' && typeof fourthValue === 'number') {
      return fourthValue >= 1 ? rgb(firstValue, secondValue, thirdValue) : "rgba(" + firstValue + "," + secondValue + "," + thirdValue + "," + fourthValue + ")";
    } else if (typeof firstValue === 'object' && secondValue === undefined && thirdValue === undefined && fourthValue === undefined) {
      return firstValue.alpha >= 1 ? rgb(firstValue.red, firstValue.green, firstValue.blue) : "rgba(" + firstValue.red + "," + firstValue.green + "," + firstValue.blue + "," + firstValue.alpha + ")";
    }

    throw new PolishedError(7);
  }

  var isRgb = function isRgb(color) {
    return typeof color.red === 'number' && typeof color.green === 'number' && typeof color.blue === 'number' && (typeof color.alpha !== 'number' || typeof color.alpha === 'undefined');
  };

  var isRgba = function isRgba(color) {
    return typeof color.red === 'number' && typeof color.green === 'number' && typeof color.blue === 'number' && typeof color.alpha === 'number';
  };

  var isHsl = function isHsl(color) {
    return typeof color.hue === 'number' && typeof color.saturation === 'number' && typeof color.lightness === 'number' && (typeof color.alpha !== 'number' || typeof color.alpha === 'undefined');
  };

  var isHsla = function isHsla(color) {
    return typeof color.hue === 'number' && typeof color.saturation === 'number' && typeof color.lightness === 'number' && typeof color.alpha === 'number';
  };
  /**
   * Converts a RgbColor, RgbaColor, HslColor or HslaColor object to a color string.
   * This util is useful in case you only know on runtime which color object is
   * used. Otherwise we recommend to rely on `rgb`, `rgba`, `hsl` or `hsla`.
   *
   * @example
   * // Styles as object usage
   * const styles = {
   *   background: toColorString({ red: 255, green: 205, blue: 100 }),
   *   background: toColorString({ red: 255, green: 205, blue: 100, alpha: 0.72 }),
   *   background: toColorString({ hue: 240, saturation: 1, lightness: 0.5 }),
   *   background: toColorString({ hue: 360, saturation: 0.75, lightness: 0.4, alpha: 0.72 }),
   * }
   *
   * // styled-components usage
   * const div = styled.div`
   *   background: ${toColorString({ red: 255, green: 205, blue: 100 })};
   *   background: ${toColorString({ red: 255, green: 205, blue: 100, alpha: 0.72 })};
   *   background: ${toColorString({ hue: 240, saturation: 1, lightness: 0.5 })};
   *   background: ${toColorString({ hue: 360, saturation: 0.75, lightness: 0.4, alpha: 0.72 })};
   * `
   *
   * // CSS in JS Output
   * element {
   *   background: "#ffcd64";
   *   background: "rgba(255,205,100,0.72)";
   *   background: "#00f";
   *   background: "rgba(179,25,25,0.72)";
   * }
   */


  function toColorString(color) {
    if (typeof color !== 'object') throw new PolishedError(8);
    if (isRgba(color)) return rgba(color);
    if (isRgb(color)) return rgb(color);
    if (isHsla(color)) return hsla(color);
    if (isHsl(color)) return hsl(color);
    throw new PolishedError(8);
  }

  // Type definitions taken from https://github.com/gcanti/flow-static-land/blob/master/src/Fun.js
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-redeclare
  function curried(f, length, acc) {
    return function fn() {
      // eslint-disable-next-line prefer-rest-params
      var combined = acc.concat(Array.prototype.slice.call(arguments));
      return combined.length >= length ? f.apply(this, combined) : curried(f, length, combined);
    };
  } // eslint-disable-next-line no-redeclare


  function curry(f) {
    // eslint-disable-line no-redeclare
    return curried(f, f.length, []);
  }

  function guard(lowerBoundary, upperBoundary, value) {
    return Math.max(lowerBoundary, Math.min(upperBoundary, value));
  }

  /**
   * Returns a string value for the darkened color.
   *
   * @example
   * // Styles as object usage
   * const styles = {
   *   background: darken(0.2, '#FFCD64'),
   *   background: darken('0.2', 'rgba(255,205,100,0.7)'),
   * }
   *
   * // styled-components usage
   * const div = styled.div`
   *   background: ${darken(0.2, '#FFCD64')};
   *   background: ${darken('0.2', 'rgba(255,205,100,0.7)')};
   * `
   *
   * // CSS in JS Output
   *
   * element {
   *   background: "#ffbd31";
   *   background: "rgba(255,189,49,0.7)";
   * }
   */

  function darken(amount, color) {
    if (color === 'transparent') return color;
    var hslColor = parseToHsl(color);
    return toColorString(_extends({}, hslColor, {
      lightness: guard(0, 1, hslColor.lightness - parseFloat(amount))
    }));
  } // prettier-ignore


  var curriedDarken = /*#__PURE__*/curry
  /* ::<number | string, string, string> */
  (darken);
  var curriedDarken$1 = curriedDarken;

  /**
   * Returns a number (float) representing the luminance of a color.
   *
   * @example
   * // Styles as object usage
   * const styles = {
   *   background: getLuminance('#CCCD64') >= getLuminance('#0000ff') ? '#CCCD64' : '#0000ff',
   *   background: getLuminance('rgba(58, 133, 255, 1)') >= getLuminance('rgba(255, 57, 149, 1)') ?
   *                             'rgba(58, 133, 255, 1)' :
   *                             'rgba(255, 57, 149, 1)',
   * }
   *
   * // styled-components usage
   * const div = styled.div`
   *   background: ${getLuminance('#CCCD64') >= getLuminance('#0000ff') ? '#CCCD64' : '#0000ff'};
   *   background: ${getLuminance('rgba(58, 133, 255, 1)') >= getLuminance('rgba(255, 57, 149, 1)') ?
   *                             'rgba(58, 133, 255, 1)' :
   *                             'rgba(255, 57, 149, 1)'};
   *
   * // CSS in JS Output
   *
   * div {
   *   background: "#CCCD64";
   *   background: "rgba(58, 133, 255, 1)";
   * }
   */

  function getLuminance(color) {
    if (color === 'transparent') return 0;
    var rgbColor = parseToRgb(color);

    var _Object$keys$map = Object.keys(rgbColor).map(function (key) {
      var channel = rgbColor[key] / 255;
      return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
    }),
        r = _Object$keys$map[0],
        g = _Object$keys$map[1],
        b = _Object$keys$map[2];

    return parseFloat((0.2126 * r + 0.7152 * g + 0.0722 * b).toFixed(3));
  }

  /**
   * Returns the contrast ratio between two colors based on
   * [W3's recommended equation for calculating contrast](http://www.w3.org/TR/WCAG20/#contrast-ratiodef).
   *
   * @example
   * const contrastRatio = getContrast('#444', '#fff');
   */

  function getContrast(color1, color2) {
    var luminance1 = getLuminance(color1);
    var luminance2 = getLuminance(color2);
    return parseFloat((luminance1 > luminance2 ? (luminance1 + 0.05) / (luminance2 + 0.05) : (luminance2 + 0.05) / (luminance1 + 0.05)).toFixed(2));
  }

  /**
   * Returns a string value for the lightened color.
   *
   * @example
   * // Styles as object usage
   * const styles = {
   *   background: lighten(0.2, '#CCCD64'),
   *   background: lighten('0.2', 'rgba(204,205,100,0.7)'),
   * }
   *
   * // styled-components usage
   * const div = styled.div`
   *   background: ${lighten(0.2, '#FFCD64')};
   *   background: ${lighten('0.2', 'rgba(204,205,100,0.7)')};
   * `
   *
   * // CSS in JS Output
   *
   * element {
   *   background: "#e5e6b1";
   *   background: "rgba(229,230,177,0.7)";
   * }
   */

  function lighten(amount, color) {
    if (color === 'transparent') return color;
    var hslColor = parseToHsl(color);
    return toColorString(_extends({}, hslColor, {
      lightness: guard(0, 1, hslColor.lightness + parseFloat(amount))
    }));
  } // prettier-ignore


  var curriedLighten = /*#__PURE__*/curry
  /* ::<number | string, string, string> */
  (lighten);
  var curriedLighten$1 = curriedLighten;

  /**
   * Mixes the two provided colors together by calculating the average of each of the RGB components weighted to the first color by the provided weight.
   *
   * @example
   * // Styles as object usage
   * const styles = {
   *   background: mix(0.5, '#f00', '#00f')
   *   background: mix(0.25, '#f00', '#00f')
   *   background: mix('0.5', 'rgba(255, 0, 0, 0.5)', '#00f')
   * }
   *
   * // styled-components usage
   * const div = styled.div`
   *   background: ${mix(0.5, '#f00', '#00f')};
   *   background: ${mix(0.25, '#f00', '#00f')};
   *   background: ${mix('0.5', 'rgba(255, 0, 0, 0.5)', '#00f')};
   * `
   *
   * // CSS in JS Output
   *
   * element {
   *   background: "#7f007f";
   *   background: "#3f00bf";
   *   background: "rgba(63, 0, 191, 0.75)";
   * }
   */

  function mix(weight, color, otherColor) {
    if (color === 'transparent') return otherColor;
    if (otherColor === 'transparent') return color;
    if (weight === 0) return otherColor;
    var parsedColor1 = parseToRgb(color);

    var color1 = _extends({}, parsedColor1, {
      alpha: typeof parsedColor1.alpha === 'number' ? parsedColor1.alpha : 1
    });

    var parsedColor2 = parseToRgb(otherColor);

    var color2 = _extends({}, parsedColor2, {
      alpha: typeof parsedColor2.alpha === 'number' ? parsedColor2.alpha : 1
    }); // The formula is copied from the original Sass implementation:
    // http://sass-lang.com/documentation/Sass/Script/Functions.html#mix-instance_method


    var alphaDelta = color1.alpha - color2.alpha;
    var x = parseFloat(weight) * 2 - 1;
    var y = x * alphaDelta === -1 ? x : x + alphaDelta;
    var z = 1 + x * alphaDelta;
    var weight1 = (y / z + 1) / 2.0;
    var weight2 = 1 - weight1;
    var mixedColor = {
      red: Math.floor(color1.red * weight1 + color2.red * weight2),
      green: Math.floor(color1.green * weight1 + color2.green * weight2),
      blue: Math.floor(color1.blue * weight1 + color2.blue * weight2),
      alpha: color1.alpha * parseFloat(weight) + color2.alpha * (1 - parseFloat(weight))
    };
    return rgba(mixedColor);
  } // prettier-ignore


  var curriedMix = /*#__PURE__*/curry
  /* ::<number | string, string, string, string> */
  (mix);
  var mix$1 = curriedMix;

  var defaultReturnIfLightColor = '#000';
  var defaultReturnIfDarkColor = '#fff';
  /**
   * Returns black or white (or optional passed colors) for best
   * contrast depending on the luminosity of the given color.
   * When passing custom return colors, strict mode ensures that the
   * return color always meets or exceeds WCAG level AA or greater. If this test
   * fails, the default return color (black or white) is returned in place of the
   * custom return color. You can optionally turn off strict mode.
   *
   * Follows [W3C specs for readability](https://www.w3.org/TR/WCAG20-TECHS/G18.html).
   *
   * @example
   * // Styles as object usage
   * const styles = {
   *   color: readableColor('#000'),
   *   color: readableColor('black', '#001', '#ff8'),
   *   color: readableColor('white', '#001', '#ff8'),
   *   color: readableColor('red', '#333', '#ddd', true)
   * }
   *
   * // styled-components usage
   * const div = styled.div`
   *   color: ${readableColor('#000')};
   *   color: ${readableColor('black', '#001', '#ff8')};
   *   color: ${readableColor('white', '#001', '#ff8')};
   *   color: ${readableColor('red', '#333', '#ddd', true)};
   * `
   *
   * // CSS in JS Output
   * element {
   *   color: "#fff";
   *   color: "#ff8";
   *   color: "#001";
   *   color: "#000";
   * }
   */

  function readableColor(color, returnIfLightColor, returnIfDarkColor, strict) {
    if (returnIfLightColor === void 0) {
      returnIfLightColor = defaultReturnIfLightColor;
    }

    if (returnIfDarkColor === void 0) {
      returnIfDarkColor = defaultReturnIfDarkColor;
    }

    if (strict === void 0) {
      strict = true;
    }

    var isColorLight = getLuminance(color) > 0.179;
    var preferredReturnColor = isColorLight ? returnIfLightColor : returnIfDarkColor;

    if (!strict || getContrast(color, preferredReturnColor) >= 4.5) {
      return preferredReturnColor;
    }

    return isColorLight ? defaultReturnIfLightColor : defaultReturnIfDarkColor;
  }

  /**
   * Decreases the opacity of a color. Its range for the amount is between 0 to 1.
   *
   *
   * @example
   * // Styles as object usage
   * const styles = {
   *   background: transparentize(0.1, '#fff'),
   *   background: transparentize(0.2, 'hsl(0, 0%, 100%)'),
   *   background: transparentize('0.5', 'rgba(255, 0, 0, 0.8)'),
   * }
   *
   * // styled-components usage
   * const div = styled.div`
   *   background: ${transparentize(0.1, '#fff')};
   *   background: ${transparentize(0.2, 'hsl(0, 0%, 100%)')};
   *   background: ${transparentize('0.5', 'rgba(255, 0, 0, 0.8)')};
   * `
   *
   * // CSS in JS Output
   *
   * element {
   *   background: "rgba(255,255,255,0.9)";
   *   background: "rgba(255,255,255,0.8)";
   *   background: "rgba(255,0,0,0.3)";
   * }
   */

  function transparentize(amount, color) {
    if (color === 'transparent') return color;
    var parsedColor = parseToRgb(color);
    var alpha = typeof parsedColor.alpha === 'number' ? parsedColor.alpha : 1;

    var colorWithAlpha = _extends({}, parsedColor, {
      alpha: guard(0, 1, +(alpha * 100 - parseFloat(amount) * 100).toFixed(2) / 100)
    });

    return rgba(colorWithAlpha);
  } // prettier-ignore


  var curriedTransparentize = /*#__PURE__*/curry
  /* ::<number | string, string, string> */
  (transparentize);
  var curriedTransparentize$1 = curriedTransparentize;

  const getHoverColors = (color) => {
      const backgroundLightness = tryCatch(() => parseToHsl(color).lightness, () => 1);
      let hoverColor = tryCatch(() => curriedLighten$1(0.1, color));
      let hoverContrastColor = tryCatch(() => readableColor(curriedLighten$1(0.1, color)));
      if (backgroundLightness > 0.35) {
          hoverColor = tryCatch(() => curriedDarken$1(0.1, color));
          hoverContrastColor = tryCatch(() => readableColor(curriedDarken$1(0.1, color)));
      }
      return { background: hoverColor, foreground: hoverContrastColor };
  };
  const omitProps = (...props) => ({
      shouldForwardProp: (prop, defaultValidatorFn) => !props.includes(prop) && defaultValidatorFn(prop)
  });
  const stepsMap = {
      xxs: -2,
      xs: -1,
      s: 0,
      m: 1,
      l: 2,
      xl: 3,
      xxl: 4
  };
  const calculateFontSize = (baseFontSize, baseFontScale) => {
      if (baseFontScale === 'linear')
          return Object.fromEntries(Object.entries(stepsMap).map(([size, steps]) => [
              size,
              `calc(${baseFontSize} + (${steps} * 0.0625rem))`
          ]));
      return Object.fromEntries(Object.entries(stepsMap).map(([size, steps]) => [
          size,
          tryCatch(() => modularScale(steps, baseFontSize, baseFontScale), () => baseFontSize)
      ]));
  };

  const globalSpacingStyles = `
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`;
  const createGlobalRootStyles = ({ base: { scale } }) => {
      return `
    :root,
    :host {
      height: 100%;
      -webkit-text-size-adjust: 100%;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      font-size: calc(${scale} * 1rem);
    }
  `;
  };
  const createGlobalBodyStyles = ({ base: { 'font-size': baseFontSize, 'font-scale': baseFontScale, 'font-family': fontFamily, palette: { 'foreground-color': foregroundColor }, 'line-height': lineHeight }, components: { text } }) => {
      // Can't call a hook here
      const fontSize = calculateFontSize(baseFontSize, baseFontScale);
      return `
    body,
    :host {
      min-height: 100%;
      margin: 0;
      padding: 0;
      font-size: ${fontSize[text.primary['font-size']]};
      font-family: ${fontFamily};
      color: ${foregroundColor};
      line-height: ${lineHeight};
    }
  `;
  };
  var GlobalStyle = styled.createGlobalStyle(({ theme }) => {
      const { base: { 'custom-scrollbar': customScrollbar, 'border-radius': borderRadius, palette: { 'scrollbar-track': scrollbarTrack, 'scrollbar-thumb': scrollbarThumb, 'scrollbar-thumb-hover': scrollbarThumbHover } } } = theme;
      return styled.css `
    ${globalSpacingStyles}

    ${customScrollbar &&
        styled.css `
      * {
        scrollbar-color: ${scrollbarThumb} ${scrollbarTrack};
        scrollbar-width: thin;
      }

      @supports not ((scrollbar-width: thin) or (scrollbar-color: black white)) {
        /* stylelint-disable unit-allowed-list */

        *::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }

        *::-webkit-scrollbar-track {
          background-color: ${scrollbarTrack};
        }

        *::-webkit-scrollbar-corner {
          background-color: ${scrollbarTrack};
          border-bottom-right-radius: inherit;
        }

        *::-webkit-scrollbar-thumb {
          background-color: transparent;
          border: 3px solid transparent;
          border-radius: calc(1.125 * ${borderRadius});
          box-shadow: inset 0 0 2px 4px ${scrollbarThumb};
        }

        *::-webkit-scrollbar-thumb:hover {
          box-shadow: inset 0 0 2px 4px ${scrollbarThumbHover};
        }

        *::-webkit-scrollbar-track:horizontal {
          border-bottom-left-radius: inherit;
        }

        *::-webkit-scrollbar-track:vertical {
          border-top-right-radius: inherit;
        }

        /* stylelint-disable-next-line selector-pseudo-class-no-unknown */
        *::-webkit-scrollbar-track:not(:corner-present) {
          border-bottom-right-radius: inherit;
        }

        /* stylelint-enable unit-allowed-list */
      }
    `}

      ${createGlobalRootStyles(theme)}

      ${createGlobalBodyStyles(theme)}

      input,
      button,
      select,
      optgroup,
      textarea {
      margin: 0;
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
    }
  `;
  });

  var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
      if (kind === "m") throw new TypeError("Private method is not writable");
      if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
  };
  var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
      if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var _ThemeMachine_parent, _ThemeMachine_definition, _ThemeMachine_overrides;
  const resetToInitial = Symbol.for('@pega/cosmos-react-core.theme.resetToInitial');
  class ThemeMachine {
      constructor({ theme = {}, parent, definition }) {
          _ThemeMachine_parent.set(this, void 0);
          _ThemeMachine_definition.set(this, void 0);
          _ThemeMachine_overrides.set(this, void 0);
          Object.defineProperty(this, "theme", {
              enumerable: true,
              configurable: true,
              writable: true,
              value: void 0
          });
          __classPrivateFieldSet(this, _ThemeMachine_parent, parent ?? null, "f");
          __classPrivateFieldSet(this, _ThemeMachine_definition, parent ? __classPrivateFieldGet(parent, _ThemeMachine_definition, "f") : definition, "f");
          __classPrivateFieldSet(this, _ThemeMachine_overrides, new Map(), "f");
          this.theme = this.constructTheme(theme);
      }
      overrideInTree(keys) {
          let ancestor = this;
          const fullProp = keys.join('.');
          while (ancestor) {
              // Trigger getters in the ancestor themes.
              deepGet(ancestor.theme, keys);
              if (__classPrivateFieldGet(ancestor, _ThemeMachine_overrides, "f").has(fullProp))
                  return !!__classPrivateFieldGet(ancestor, _ThemeMachine_overrides, "f").get(fullProp);
              ancestor = __classPrivateFieldGet(ancestor, _ThemeMachine_parent, "f");
          }
          return false;
      }
      constructTheme(theme) {
          const constructForNode = (keys = []) => {
              const themeNode = {};
              Object.keys(deepGet(__classPrivateFieldGet(this, _ThemeMachine_definition, "f"), keys)).forEach(key => {
                  // Ignore comment nodes.
                  if (key === '$comment')
                      return;
                  const propKeys = [...keys, key];
                  const defNode = deepGet(__classPrivateFieldGet(this, _ThemeMachine_definition, "f"), propKeys);
                  // If it is not a leaf node of the theme definition...
                  if (defNode.$type === undefined) {
                      // recursively run for child nodes.
                      defineSmartGetter(themeNode, key, () => constructForNode(propKeys));
                      return;
                  }
                  const themeValue = deepGet(theme, propKeys);
                  // If a theme value was set for this ThemeMachine...
                  if (themeValue !== undefined) {
                      // set overrides to true, unless it is being reset.
                      __classPrivateFieldGet(this, _ThemeMachine_overrides, "f").set(propKeys.join('.'), themeValue !== resetToInitial);
                  }
                  // If a theme value was set for this ThemeMachine, is not being reset, and is for a non-constant property...
                  if (themeValue !== undefined && themeValue !== resetToInitial && !defNode.$constant) {
                      // set to the provided value.
                      themeNode[key] = themeValue;
                  }
                  // If the property has been overridden in the tree (and not reset)...
                  else if (this.overrideInTree(propKeys)) {
                      // set to the value in the parent theme.
                      defineSmartGetter(themeNode, key, () => deepGet(__classPrivateFieldGet(this, _ThemeMachine_parent, "f").theme, propKeys));
                  }
                  // If the property type is inherited...
                  else if (defNode.$type === 'inherited') {
                      // set to the value of the inherited property in this theme.
                      defineSmartGetter(themeNode, key, () => deepGet(this.theme, defNode.$value.split('.')));
                  }
                  // If the property type is literal...
                  else if (defNode.$type === 'literal') {
                      // set to the value listed in the definition.
                      themeNode[key] = defNode.$value;
                  }
              });
              return themeNode;
          };
          return constructForNode();
      }
  }
  _ThemeMachine_parent = new WeakMap(), _ThemeMachine_definition = new WeakMap(), _ThemeMachine_overrides = new WeakMap();
  var ThemeMachine$1 = ThemeMachine;

  var base = {
  	colors: {
  		white: {
  			$type: "literal",
  			$value: "#ffffff"
  		},
  		black: {
  			$type: "literal",
  			$value: "#000000"
  		},
  		gray: {
  			"extra-light": {
  				$type: "literal",
  				$value: "#f5f5f5"
  			},
  			light: {
  				$type: "literal",
  				$value: "#cfcfcf"
  			},
  			medium: {
  				$type: "literal",
  				$value: "#939393"
  			},
  			dark: {
  				$type: "literal",
  				$value: "#676767"
  			},
  			"extra-dark": {
  				$type: "literal",
  				$value: "#3f3f3f"
  			}
  		},
  		slate: {
  			"extra-light": {
  				$type: "literal",
  				$value: "#e9eef3"
  			},
  			light: {
  				$type: "literal",
  				$value: "#cbd4dc"
  			},
  			medium: {
  				$type: "literal",
  				$value: "#8397ab"
  			},
  			dark: {
  				$type: "literal",
  				$value: "#4c5a67"
  			},
  			"extra-dark": {
  				$type: "literal",
  				$value: "#252c32"
  			}
  		},
  		red: {
  			"extra-light": {
  				$type: "literal",
  				$value: "#ffdbde"
  			},
  			light: {
  				$type: "literal",
  				$value: "#f66f78"
  			},
  			medium: {
  				$type: "literal",
  				$value: "#d91c29"
  			},
  			dark: {
  				$type: "literal",
  				$value: "#a6020d"
  			},
  			"extra-dark": {
  				$type: "literal",
  				$value: "#570006"
  			}
  		},
  		orange: {
  			"extra-light": {
  				$type: "literal",
  				$value: "#feede2"
  			},
  			light: {
  				$type: "literal",
  				$value: "#ffaa75"
  			},
  			medium: {
  				$type: "literal",
  				$value: "#fd6000"
  			},
  			dark: {
  				$type: "literal",
  				$value: "#b54703"
  			},
  			"extra-dark": {
  				$type: "literal",
  				$value: "#5a2401"
  			}
  		},
  		green: {
  			"extra-light": {
  				$type: "literal",
  				$value: "#d4f7d5"
  			},
  			light: {
  				$type: "literal",
  				$value: "#7ee791"
  			},
  			medium: {
  				$type: "literal",
  				$value: "#20aa50"
  			},
  			dark: {
  				$type: "literal",
  				$value: "#156f35"
  			},
  			"extra-dark": {
  				$type: "literal",
  				$value: "#0b381a"
  			}
  		},
  		blue: {
  			"extra-light": {
  				$type: "literal",
  				$value: "#e2f1ff"
  			},
  			light: {
  				$type: "literal",
  				$value: "#71baff"
  			},
  			medium: {
  				$type: "literal",
  				$value: "#076bc9"
  			},
  			dark: {
  				$type: "literal",
  				$value: "#054a8a"
  			},
  			"extra-dark": {
  				$type: "literal",
  				$value: "#00284c"
  			}
  		},
  		purple: {
  			"extra-light": {
  				$type: "literal",
  				$value: "#f1e9fb"
  			},
  			light: {
  				$type: "literal",
  				$value: "#d6bcf5"
  			},
  			medium: {
  				$type: "literal",
  				$value: "#ac75f0"
  			},
  			dark: {
  				$type: "literal",
  				$value: "#681fc3"
  			},
  			"extra-dark": {
  				$type: "literal",
  				$value: "#341061"
  			}
  		}
  	},
  	palette: {
  		"app-background": {
  			$type: "inherited",
  			$value: "base.colors.slate.extra-light"
  		},
  		"primary-background": {
  			$type: "inherited",
  			$value: "base.colors.white"
  		},
  		"secondary-background": {
  			$type: "inherited",
  			$value: "base.colors.gray.extra-light"
  		},
  		"foreground-color": {
  			$type: "inherited",
  			$value: "base.palette.dark"
  		},
  		"brand-primary": {
  			$type: "inherited",
  			$value: "base.colors.blue.medium"
  		},
  		"brand-secondary": {
  			$type: "inherited",
  			$value: "base.palette.primary-background"
  		},
  		urgent: {
  			$type: "inherited",
  			$value: "base.colors.red.medium"
  		},
  		warn: {
  			$type: "inherited",
  			$value: "base.colors.orange.medium"
  		},
  		success: {
  			$type: "inherited",
  			$value: "base.colors.green.medium"
  		},
  		pending: {
  			$type: "inherited",
  			$value: "base.colors.purple.medium"
  		},
  		info: {
  			$type: "inherited",
  			$value: "base.colors.slate.medium"
  		},
  		interactive: {
  			$type: "inherited",
  			$value: "base.palette.brand-primary"
  		},
  		"border-line": {
  			$type: "inherited",
  			$value: "base.colors.gray.light"
  		},
  		skeleton: {
  			$type: "inherited",
  			$value: "base.colors.gray.extra-light"
  		},
  		light: {
  			$type: "inherited",
  			$value: "base.colors.white"
  		},
  		dark: {
  			$type: "inherited",
  			$value: "base.colors.black"
  		},
  		"background-color": {
  			$type: "inherited",
  			$value: "base.palette.light"
  		},
  		"scrollbar-track": {
  			$type: "literal",
  			$value: "rgba(0, 0, 0, 0.1)"
  		},
  		"scrollbar-thumb": {
  			$type: "literal",
  			$value: "rgba(0, 0, 0, 0.6)"
  		},
  		"scrollbar-thumb-hover": {
  			$type: "literal",
  			$value: "rgba(0, 0, 0, 0.7)"
  		}
  	},
  	"font-family": {
  		$type: "literal",
  		$value: "'Open Sans', sans-serif"
  	},
  	"font-size": {
  		$type: "literal",
  		$value: "0.875rem"
  	},
  	"font-scale": {
  		$type: "literal",
  		$value: "linear"
  	},
  	"font-weight": {
  		bold: {
  			$type: "literal",
  			$value: 700
  		},
  		"semi-bold": {
  			$type: "literal",
  			$value: 600
  		},
  		normal: {
  			$type: "literal",
  			$value: 400
  		}
  	},
  	"line-height": {
  		$type: "literal",
  		$value: "normal"
  	},
  	scale: {
  		$type: "literal",
  		$value: 1
  	},
  	"border-radius": {
  		$type: "literal",
  		$value: "0.5rem"
  	},
  	spacing: {
  		$type: "literal",
  		$value: "0.5rem"
  	},
  	"hit-area": {
  		compact: {
  			$type: "literal",
  			$value: "1.5rem"
  		},
  		"compact-min": {
  			$type: "literal",
  			$value: "24px"
  		},
  		mouse: {
  			$type: "literal",
  			$value: "2rem"
  		},
  		"mouse-min": {
  			$type: "literal",
  			$value: "32px"
  		},
  		finger: {
  			$type: "literal",
  			$value: "2.75rem"
  		},
  		"finger-min": {
  			$type: "literal",
  			$value: "44px"
  		}
  	},
  	"custom-scrollbar": {
  		$type: "literal",
  		$value: true
  	},
  	animation: {
  		speed: {
  			$type: "literal",
  			$value: "0.25s"
  		},
  		timing: {
  			ease: {
  				$type: "literal",
  				$value: "cubic-bezier(0.4, 0.6, 0.1,1)"
  			},
  			"ease-out": {
  				$type: "literal",
  				$value: "ease-out"
  			},
  			"ease-in": {
  				$type: "literal",
  				$value: "ease-in"
  			}
  		}
  	},
  	transparency: {
  		"transparent-1": {
  			$type: "literal",
  			$value: 0.8
  		},
  		"transparent-2": {
  			$type: "literal",
  			$value: 0.7
  		},
  		"transparent-3": {
  			$type: "literal",
  			$value: 0.6
  		},
  		"transparent-4": {
  			$type: "literal",
  			$value: 0.4
  		},
  		"transparent-5": {
  			$type: "literal",
  			$value: 0.3
  		}
  	},
  	"disabled-opacity": {
  		$type: "inherited",
  		$value: "base.transparency.transparent-4"
  	},
  	shadow: {
  		high: {
  			$type: "literal",
  			$value: "0 0.125rem 1.5rem rgba(0,0,0,.3)"
  		},
  		low: {
  			$type: "literal",
  			$value: "0 0.125rem 0.5rem rgba(0,0,0,.2)"
  		},
  		"high-filter": {
  			$type: "literal",
  			$value: "drop-shadow(0 0.125rem 0.75rem rgba(0,0,0,.3))"
  		},
  		"low-filter": {
  			$type: "literal",
  			$value: "drop-shadow(0 0.125rem 0.25rem rgba(0,0,0,.2))"
  		},
  		focus: {
  			$type: "literal",
  			$value: "0 0 0 0.125rem rgba(0, 118, 209, 0.30)"
  		},
  		"focus-inverted": {
  			$type: "literal",
  			$value: "0 0 0 0.125rem rgba(255, 255, 255, 0.30)"
  		},
  		"focus-filter": {
  			$type: "literal",
  			$value: "drop-shadow(0 0 0.125rem rgba(0, 118, 209, 0.30))"
  		},
  		"focus-inverted-filter": {
  			$type: "literal",
  			$value: "drop-shadow(0 0 0.125rem rgba(255, 255, 255, 0.30))"
  		}
  	},
  	"z-index": {
  		popover: {
  			$type: "literal",
  			$value: 1000
  		},
  		drawer: {
  			$type: "literal",
  			$value: 2000
  		},
  		modal: {
  			$type: "literal",
  			$value: 3000
  		},
  		alert: {
  			$type: "literal",
  			$value: 4000
  		},
  		toast: {
  			$type: "literal",
  			$value: 5000
  		},
  		tooltip: {
  			$type: "literal",
  			$value: 6000
  		},
  		backdrop: {
  			$type: "literal",
  			$value: 7000
  		}
  	},
  	breakpoints: {
  		xs: {
  			$type: "literal",
  			$value: "0em"
  		},
  		sm: {
  			$type: "literal",
  			$value: "31.25em"
  		},
  		md: {
  			$type: "literal",
  			$value: "62.5em"
  		},
  		lg: {
  			$type: "literal",
  			$value: "93.75em"
  		},
  		xl: {
  			$type: "literal",
  			$value: "125em"
  		}
  	}
  };
  var components = {
  	"app-shell": {
  		nav: {
  			"background-color": {
  				$type: "inherited",
  				$value: "base.colors.slate.extra-dark"
  			}
  		},
  		header: {
  			"background-color": {
  				$type: "inherited",
  				$value: "base.palette.brand-secondary"
  			}
  		}
  	},
  	avatar: {
  		"background-color": {
  			$type: "inherited",
  			$value: "base.colors.slate.dark"
  		},
  		"border-radius": {
  			$type: "inherited",
  			$value: "base.border-radius"
  		}
  	},
  	tabs: {
  		base: {
  			foreground: {
  				$type: "inherited",
  				$value: "base.palette.interactive"
  			}
  		},
  		inverted: {
  			foreground: {
  				$type: "inherited",
  				$value: "base.palette.primary-background"
  			}
  		}
  	},
  	badges: {
  		status: {
  			success: {
  				foreground: {
  					$type: "inherited",
  					$value: "base.colors.green.dark"
  				},
  				background: {
  					$type: "inherited",
  					$value: "base.colors.green.extra-light"
  				}
  			},
  			urgent: {
  				foreground: {
  					$type: "inherited",
  					$value: "base.colors.red.dark"
  				},
  				background: {
  					$type: "inherited",
  					$value: "base.colors.red.extra-light"
  				}
  			},
  			warn: {
  				foreground: {
  					$type: "inherited",
  					$value: "base.colors.orange.dark"
  				},
  				background: {
  					$type: "inherited",
  					$value: "base.colors.orange.extra-light"
  				}
  			},
  			pending: {
  				foreground: {
  					$type: "inherited",
  					$value: "base.colors.purple.dark"
  				},
  				background: {
  					$type: "inherited",
  					$value: "base.colors.purple.extra-light"
  				}
  			},
  			info: {
  				foreground: {
  					$type: "inherited",
  					$value: "base.colors.slate.dark"
  				},
  				background: {
  					$type: "inherited",
  					$value: "base.colors.slate.extra-light"
  				}
  			}
  		},
  		tag: {
  			foreground: {
  				$type: "inherited",
  				$value: "base.palette.interactive"
  			},
  			background: {
  				$type: "inherited",
  				$value: "base.palette.interactive"
  			}
  		},
  		count: {
  			base: {
  				foreground: {
  					$type: "inherited",
  					$value: "base.colors.slate.extra-dark"
  				},
  				background: {
  					$type: "inherited",
  					$value: "base.colors.slate.light"
  				}
  			},
  			interactive: {
  				foreground: {
  					$type: "inherited",
  					$value: "base.palette.light"
  				},
  				background: {
  					$type: "inherited",
  					$value: "base.palette.interactive"
  				}
  			},
  			inverted: {
  				foreground: {
  					$type: "inherited",
  					$value: "base.palette.light"
  				},
  				background: {
  					$type: "inherited",
  					$value: "base.palette.interactive"
  				}
  			},
  			urgent: {
  				foreground: {
  					$type: "inherited",
  					$value: "base.palette.light"
  				},
  				background: {
  					$type: "inherited",
  					$value: "base.palette.urgent"
  				}
  			}
  		},
  		selectable: {
  			base: {
  				foreground: {
  					$type: "inherited",
  					$value: "base.palette.dark"
  				},
  				background: {
  					$type: "inherited",
  					$value: "base.palette.interactive"
  				}
  			}
  		},
  		alert: {
  			urgent: {
  				background: {
  					$type: "inherited",
  					$value: "base.palette.urgent"
  				}
  			},
  			success: {
  				background: {
  					$type: "inherited",
  					$value: "base.palette.success"
  				}
  			},
  			base: {
  				"border-color": {
  					$type: "inherited",
  					$value: "base.palette.light"
  				}
  			}
  		}
  	},
  	banner: {
  		"icon-color": {
  			$type: "inherited",
  			$value: "base.palette.light"
  		},
  		urgent: {
  			background: {
  				$type: "inherited",
  				$value: "base.palette.urgent"
  			}
  		},
  		warning: {
  			background: {
  				$type: "inherited",
  				$value: "base.palette.warn"
  			}
  		},
  		success: {
  			background: {
  				$type: "inherited",
  				$value: "base.palette.success"
  			}
  		},
  		info: {
  			background: {
  				$type: "inherited",
  				$value: "base.palette.info"
  			}
  		}
  	},
  	button: {
  		height: {
  			$type: "inherited",
  			$value: "base.hit-area.mouse-min"
  		},
  		"border-width": {
  			$type: "literal",
  			$value: "0.0625rem"
  		},
  		"border-radius": {
  			$type: "literal",
  			$value: 9999
  		},
  		color: {
  			$type: "inherited",
  			$value: "base.palette.interactive"
  		},
  		"secondary-color": {
  			$type: "inherited",
  			$value: "base.palette.primary-background"
  		},
  		"focus-shadow": {
  			$type: "inherited",
  			$value: "base.shadow.focus"
  		},
  		padding: {
  			$type: "literal",
  			$value: "0 1rem"
  		},
  		touch: {
  			height: {
  				$type: "inherited",
  				$value: "base.hit-area.finger-min"
  			},
  			padding: {
  				$type: "literal",
  				$value: "0 1.5rem"
  			}
  		}
  	},
  	card: {
  		"border-radius": {
  			$type: "inherited",
  			$value: "base.border-radius"
  		},
  		background: {
  			$type: "inherited",
  			$value: "base.palette.primary-background"
  		},
  		padding: {
  			$type: "inherited",
  			$value: "base.spacing"
  		},
  		"border-color": {
  			$type: "inherited",
  			$value: "base.palette.interactive"
  		}
  	},
  	"form-control": {
  		"foreground-color": {
  			$type: "inherited",
  			$value: "base.palette.foreground-color"
  		},
  		"background-color": {
  			$type: "inherited",
  			$value: "base.palette.primary-background"
  		},
  		"border-color": {
  			$type: "inherited",
  			$value: "base.colors.gray.medium"
  		},
  		"border-width": {
  			$type: "literal",
  			$value: "0.0625rem"
  		},
  		"border-radius": {
  			$type: "literal",
  			$value: 0.5
  		},
  		padding: {
  			$type: "inherited",
  			$value: "base.spacing"
  		},
  		":hover": {
  			"border-color": {
  				$type: "inherited",
  				$value: "base.colors.gray.extra-dark"
  			}
  		},
  		":active": {
  			"border-color": {
  				$type: "literal",
  				$value: "transparent"
  			}
  		},
  		":focus": {
  			"border-color": {
  				$type: "literal",
  				$value: "transparent"
  			},
  			"box-shadow": {
  				$type: "inherited",
  				$value: "base.shadow.focus"
  			}
  		},
  		":disabled": {
  			"background-color": {
  				$type: "inherited",
  				$value: "base.colors.gray.extra-light"
  			},
  			"border-color": {
  				$type: "inherited",
  				$value: "base.colors.gray.light"
  			}
  		},
  		":read-only": {
  			"background-color": {
  				$type: "inherited",
  				$value: "base.colors.gray.extra-light"
  			},
  			"border-color": {
  				$type: "literal",
  				$value: "transparent"
  			}
  		}
  	},
  	"form-field": {
  		error: {
  			"status-color": {
  				$type: "inherited",
  				$value: "base.palette.urgent"
  			}
  		},
  		success: {
  			"status-color": {
  				$type: "inherited",
  				$value: "base.palette.success"
  			}
  		},
  		warning: {
  			"status-color": {
  				$type: "inherited",
  				$value: "base.palette.warn"
  			}
  		}
  	},
  	input: {
  		height: {
  			$type: "literal",
  			$value: "2rem"
  		},
  		padding: {
  			$type: "inherited",
  			$value: "components.form-control.padding"
  		},
  		"background-color": {
  			$type: "inherited",
  			$value: "components.form-control.background-color"
  		},
  		"border-color": {
  			$type: "inherited",
  			$value: "components.form-control.border-color"
  		},
  		"border-width": {
  			$type: "inherited",
  			$value: "components.form-control.border-width"
  		},
  		"border-radius": {
  			$type: "inherited",
  			$value: "components.form-control.border-radius"
  		}
  	},
  	label: {
  		color: {
  			$type: "inherited",
  			$value: "base.palette.foreground-color"
  		},
  		"font-size": {
  			$type: "literal",
  			$value: "xs"
  		},
  		"font-weight": {
  			$type: "inherited",
  			$value: "base.font-weight.semi-bold"
  		}
  	},
  	progress: {
  		"progress-color": {
  			$type: "inherited",
  			$value: "base.palette.brand-primary"
  		}
  	},
  	select: {
  		height: {
  			$type: "literal",
  			$value: "2rem"
  		},
  		padding: {
  			$type: "inherited",
  			$value: "components.form-control.padding"
  		},
  		"border-color": {
  			$type: "inherited",
  			$value: "components.form-control.border-color"
  		},
  		"border-width": {
  			$type: "inherited",
  			$value: "components.form-control.border-width"
  		},
  		"border-radius": {
  			$type: "inherited",
  			$value: "components.form-control.border-radius"
  		}
  	},
  	"radio-check": {
  		"border-color": {
  			$type: "inherited",
  			$value: "components.form-control.border-color"
  		},
  		"border-width": {
  			$type: "inherited",
  			$value: "components.form-control.border-width"
  		},
  		"background-color": {
  			$type: "inherited",
  			$value: "components.form-control.background-color"
  		},
  		"foreground-color": {
  			$type: "inherited",
  			$value: "base.palette.interactive"
  		},
  		label: {
  			color: {
  				$type: "inherited",
  				$value: "base.palette.foreground-color"
  			},
  			"font-weight": {
  				$type: "inherited",
  				$value: "base.font-weight.normal"
  			}
  		},
  		size: {
  			$type: "literal",
  			$value: "1.25rem"
  		},
  		"touch-size": {
  			$type: "literal",
  			$value: "1.75rem"
  		},
  		":checked": {
  			"background-color": {
  				$type: "inherited",
  				$value: "base.palette.interactive"
  			},
  			"border-color": {
  				$type: "inherited",
  				$value: "base.palette.interactive"
  			}
  		}
  	},
  	checkbox: {
  		"border-radius": {
  			$type: "inherited",
  			$value: "components.form-control.border-radius"
  		}
  	},
  	"radio-button": {
  		"border-radius": {
  			$type: "literal",
  			$value: "50%"
  		}
  	},
  	rating: {
  		color: {
  			$type: "inherited",
  			$value: "base.palette.foreground-color"
  		}
  	},
  	"search-input": {
  		"border-radius": {
  			$type: "literal",
  			$value: 9999
  		}
  	},
  	sentiment: {
  		positive: {
  			color: {
  				$type: "inherited",
  				$value: "base.palette.success"
  			}
  		},
  		negative: {
  			color: {
  				$type: "inherited",
  				$value: "base.palette.urgent"
  			}
  		},
  		neutral: {
  			color: {
  				$type: "inherited",
  				$value: "base.palette.foreground-color"
  			}
  		}
  	},
  	table: {
  		header: {
  			"font-size": {
  				$type: "literal",
  				$value: "s"
  			},
  			"font-weight": {
  				$type: "inherited",
  				$value: "base.font-weight.semi-bold"
  			},
  			"foreground-color": {
  				$type: "inherited",
  				$value: "base.palette.foreground-color"
  			},
  			"background-color": {
  				$type: "inherited",
  				$value: "base.palette.secondary-background"
  			},
  			"vertical-spacing": {
  				$type: "literal",
  				$value: 1
  			},
  			"horizontal-spacing": {
  				$type: "literal",
  				$value: 2
  			},
  			"border-width": {
  				$type: "literal",
  				$value: "0.0625rem"
  			},
  			"border-color": {
  				$type: "inherited",
  				$value: "base.palette.border-line"
  			}
  		},
  		body: {
  			"foreground-color": {
  				$type: "inherited",
  				$value: "base.palette.foreground-color"
  			},
  			"background-color": {
  				$type: "inherited",
  				$value: "base.palette.primary-background"
  			},
  			"vertical-spacing": {
  				$type: "literal",
  				$value: 1
  			},
  			"horizontal-spacing": {
  				$type: "literal",
  				$value: 1
  			},
  			"border-width": {
  				$type: "literal",
  				$value: "0.0625rem"
  			},
  			"border-color": {
  				$type: "inherited",
  				$value: "base.palette.border-line"
  			}
  		},
  		border: {
  			"horizontal-inner": {
  				$type: "literal",
  				$value: true
  			},
  			"horizontal-outer": {
  				$type: "literal",
  				$value: true
  			},
  			"vertical-inner": {
  				$type: "literal",
  				$value: true
  			},
  			"vertical-outer": {
  				$type: "literal",
  				$value: true
  			}
  		},
  		spacing: {
  			"horizontal-inner": {
  				$type: "literal",
  				$value: true
  			},
  			"horizontal-outer": {
  				$type: "literal",
  				$value: true
  			},
  			"vertical-inner": {
  				$type: "literal",
  				$value: true
  			},
  			"vertical-outer": {
  				$type: "literal",
  				$value: true
  			}
  		}
  	},
  	text: {
  		primary: {
  			"font-size": {
  				$type: "literal",
  				$value: "s"
  			},
  			"font-weight": {
  				$type: "inherited",
  				$value: "base.font-weight.normal"
  			}
  		},
  		secondary: {
  			"font-size": {
  				$type: "literal",
  				$value: "xs"
  			},
  			"font-weight": {
  				$type: "inherited",
  				$value: "base.font-weight.normal"
  			}
  		},
  		h1: {
  			"font-size": {
  				$type: "literal",
  				$value: "xl"
  			},
  			"font-weight": {
  				$type: "inherited",
  				$value: "base.font-weight.semi-bold"
  			}
  		},
  		h2: {
  			"font-size": {
  				$type: "literal",
  				$value: "l"
  			},
  			"font-weight": {
  				$type: "inherited",
  				$value: "base.font-weight.semi-bold"
  			}
  		},
  		h3: {
  			"font-size": {
  				$type: "literal",
  				$value: "m"
  			},
  			"font-weight": {
  				$type: "inherited",
  				$value: "base.font-weight.semi-bold"
  			}
  		},
  		h4: {
  			"font-size": {
  				$type: "literal",
  				$value: "s"
  			},
  			"font-weight": {
  				$type: "inherited",
  				$value: "base.font-weight.semi-bold"
  			}
  		},
  		h5: {
  			"font-size": {
  				$type: "literal",
  				$value: "xs"
  			},
  			"font-weight": {
  				$type: "inherited",
  				$value: "base.font-weight.semi-bold"
  			}
  		},
  		h6: {
  			"font-size": {
  				$type: "literal",
  				$value: "xxs"
  			},
  			"font-weight": {
  				$type: "inherited",
  				$value: "base.font-weight.semi-bold"
  			}
  		}
  	},
  	"text-area": {
  		"min-height": {
  			$type: "literal",
  			$value: "3.75rem"
  		},
  		padding: {
  			$type: "inherited",
  			$value: "components.form-control.padding"
  		}
  	},
  	link: {
  		color: {
  			$type: "inherited",
  			$value: "base.palette.interactive"
  		}
  	},
  	chat: {
  		messageBubble: {
  			sender: {
  				header: {
  					"background-color": {
  						$type: "inherited",
  						$value: "base.colors.black"
  					},
  					"foreground-color": {
  						$type: "inherited",
  						$value: "base.colors.white"
  					}
  				},
  				content: {
  					"background-color": {
  						$type: "inherited",
  						$value: "base.colors.blue.medium"
  					},
  					"foreground-color": {
  						$type: "inherited",
  						$value: "base.colors.white"
  					}
  				}
  			},
  			receiver: {
  				header: {
  					"background-color": {
  						$type: "inherited",
  						$value: "base.colors.orange.medium"
  					},
  					"foreground-color": {
  						$type: "inherited",
  						$value: "base.colors.white"
  					}
  				},
  				content: {
  					"background-color": {
  						$type: "inherited",
  						$value: "base.colors.slate.extra-light"
  					},
  					"foreground-color": {
  						$type: "inherited",
  						$value: "base.colors.black"
  					}
  				}
  			},
  			other: {
  				header: {
  					"background-color": {
  						$type: "inherited",
  						$value: "base.colors.orange.medium"
  					},
  					"foreground-color": {
  						$type: "inherited",
  						$value: "base.colors.white"
  					}
  				},
  				content: {
  					"background-color": {
  						$type: "inherited",
  						$value: "base.colors.slate.dark"
  					},
  					"foreground-color": {
  						$type: "inherited",
  						$value: "base.colors.white"
  					}
  				}
  			}
  		},
  		transcript: {
  			message: {
  				"icon-foreground-color": {
  					$type: "inherited",
  					$value: "base.colors.blue.extra-dark"
  				}
  			}
  		}
  	},
  	"switch": {
  		height: {
  			$type: "literal",
  			$value: "1.5rem"
  		},
  		width: {
  			$type: "literal",
  			$value: "3rem"
  		},
  		"touch-height": {
  			$type: "literal",
  			$value: "2rem"
  		},
  		"touch-width": {
  			$type: "literal",
  			$value: "4rem"
  		},
  		off: {
  			color: {
  				$type: "inherited",
  				$value: "base.colors.gray.medium"
  			}
  		},
  		on: {
  			color: {
  				$type: "inherited",
  				$value: "base.palette.interactive"
  			}
  		}
  	},
  	tooltip: {
  		"foreground-color": {
  			$type: "inherited",
  			$value: "base.colors.gray.extra-light"
  		},
  		"background-color": {
  			$type: "inherited",
  			$value: "base.colors.gray.extra-dark"
  		}
  	},
  	"task-manager": {
  		"task-icon": {
  			banner: {
  				background: {
  					$type: "inherited",
  					$value: "base.colors.orange.medium"
  				},
  				foreground: {
  					$type: "inherited",
  					$value: "base.colors.white"
  				}
  			},
  			action: {
  				background: {
  					$type: "inherited",
  					$value: "base.palette.interactive"
  				},
  				foreground: {
  					$type: "inherited",
  					$value: "base.colors.white"
  				}
  			},
  			"task-drawer": {
  				background: {
  					$type: "inherited",
  					$value: "base.colors.gray.extra-light"
  				},
  				foreground: {
  					$type: "inherited",
  					$value: "base.colors.gray.extra-dark"
  				}
  			},
  			"wrap-up": {
  				background: {
  					$type: "inherited",
  					$value: "base.palette.dark"
  				},
  				foreground: {
  					$type: "inherited",
  					$value: "base.colors.white"
  				}
  			},
  			suggested: {
  				background: {
  					$type: "inherited",
  					$value: "base.colors.slate.light"
  				},
  				foreground: {
  					$type: "inherited",
  					$value: "base.colors.gray.extra-dark"
  				}
  			},
  			queued: {
  				background: {
  					$type: "inherited",
  					$value: "base.colors.slate.light"
  				},
  				foreground: {
  					$type: "inherited",
  					$value: "base.colors.gray.extra-dark"
  				}
  			},
  			"in-progress": {
  				background: {
  					$type: "inherited",
  					$value: "base.colors.slate.light"
  				},
  				foreground: {
  					$type: "inherited",
  					$value: "base.colors.gray.extra-dark"
  				}
  			},
  			resolved: {
  				background: {
  					$type: "inherited",
  					$value: "base.colors.slate.light"
  				},
  				foreground: {
  					$type: "inherited",
  					$value: "base.colors.gray.extra-dark"
  				}
  			}
  		}
  	},
  	"interaction-timer": {
  		"notification-indicator": {
  			$type: "inherited",
  			$value: "base.colors.red.light"
  		},
  		sla: {
  			goal: {
  				progress: {
  					"primary-color": {
  						$type: "inherited",
  						$value: "base.colors.green.medium"
  					},
  					"secondary-color": {
  						$type: "inherited",
  						$value: "base.colors.green.extra-dark"
  					}
  				}
  			},
  			deadline: {
  				progress: {
  					"primary-color": {
  						$type: "inherited",
  						$value: "base.colors.orange.medium"
  					},
  					"secondary-color": {
  						$type: "inherited",
  						$value: "base.colors.orange.extra-dark"
  					}
  				}
  			},
  			"past-deadline": {
  				progress: {
  					"primary-color": {
  						$type: "inherited",
  						$value: "base.colors.red.medium"
  					},
  					"secondary-color": {
  						$type: "inherited",
  						$value: "base.colors.red.extra-dark"
  					}
  				}
  			}
  		}
  	}
  };
  var defaultThemeDefinition = {
  	base: base,
  	components: components
  };

  const BaseThemeMachine = new ThemeMachine$1({ definition: defaultThemeDefinition });
  const WorkTheme = BaseThemeMachine.theme;
  const makeResetTheme = (obj) => {
      return Object.fromEntries(Object.entries(obj).map(([key, val]) => {
          if (val && typeof val === 'object')
              return [key, makeResetTheme(val)];
          return [key, resetToInitial];
      }));
  };
  makeResetTheme(WorkTheme);
  const defaultThemeProp = Object.freeze({ theme: WorkTheme });

  var defaultTranslation = {
      // -----------------------------------------------------------------------------
      // Common translation entries
      // -----------------------------------------------------------------------------
      /* Nouns, Types, Terms, Phrases, etc... */
      filters: 'Filters',
      actions: 'Actions',
      status: 'Status',
      additional_info: 'Additional info',
      search_placeholder_default: 'Search…',
      /* Verbs */
      remove: 'Remove',
      follow: 'Follow',
      unfollow: 'Unfollow',
      add: 'Add',
      cancel: 'Cancel',
      try_again: 'Try again',
      update: 'Update',
      submit: 'Submit',
      edit: 'Edit',
      preview: 'Preview',
      delete: 'Delete',
      close: 'Close',
      activate: 'Activate',
      expand: 'Expand',
      collapse: 'Collapse',
      accept: 'Accept',
      clear: 'Clear',
      use: 'Use',
      undo: 'Undo',
      redo: 'Redo',
      /* Static verb noun */
      view_all: 'View all',
      view_less: 'View less',
      show_more: 'Show more',
      show_less: 'Show less',
      clear_all: 'Clear all',
      link_open_in_tab_text: 'Open in tab',
      edit_details: 'Edit details',
      add_emoji: 'Add emoji',
      /* Dynamic verb {noun} */
      close_noun: 'Close: {0}',
      view_all_noun: 'View all: {0}',
      view_less_noun: 'View less: {0}',
      expand_noun: 'Expand: {0}',
      add_noun: 'Add: {0}',
      collapse_noun: 'Collapse: {0}',
      checked_noun: '{0}: checked',
      selected_noun: '{0}: selected',
      deselected_noun: '{0}: unselected',
      use_input_value: 'Use {0}',
      preview_of_noun: 'Preview of: {0}',
      /* States */
      edited: 'Edited',
      done: 'Done',
      uploading: 'Uploading',
      loading: 'Loading…',
      submitting: 'Submitting…',
      no_items: 'No items',
      unknown_error: 'Unknown error',
      image_load_error: 'Error loading image',
      selected: 'Selected',
      /* Date and time */
      day_label_a11y: 'Day',
      day_placeholder: 'DD',
      quarter_label_a11y: 'Quarter',
      month_label_a11y: 'Month',
      month_placeholder: 'MM',
      year_label_a11y: 'Year',
      year_placeholder: 'YYYY',
      hour_label_a11y: 'Hour',
      hour_placeholder: 'hh',
      minute_label_a11y: 'Minute',
      minute_placeholder: 'mm',
      second_label_a11y: 'Second',
      second_placeholder: 'ss',
      meridiem_label_a11y: 'Meridiem',
      meridiem_value_am: 'AM',
      meridiem_value_pm: 'PM',
      week_label_a11y: 'Week',
      week_placeholder: 'ww',
      week_text: 'Week',
      seconds_text: 'Seconds',
      minutes_text: 'Minutes',
      hours_text: 'Hours',
      days_text: 'Days',
      time_text: 'Time',
      time_format_info: 'hh:mm:ss',
      week_text_short: 'Wk',
      day_text_short: 'd',
      hour_text_short: 'h',
      minute_text_short: 'm',
      second_text_short: 's',
      date_quarter_q1: 'Q1 {0}',
      date_quarter_q2: 'Q2 {0}',
      date_quarter_q3: 'Q3 {0}',
      date_quarter_q4: 'Q4 {0}',
      /* Count based types */
      attachments_count: {
          zero: 'No attachments',
          one: '{0} attachment',
          two: '{0} attachments',
          few: '{0} attachments',
          many: '{0} attachments',
          other: '{0} attachments'
      },
      results_count: {
          zero: 'No results',
          one: '{0} result',
          two: '{0} results',
          few: '{0} results',
          many: '{0} results',
          other: '{0} results'
      },
      new_emails_count: {
          zero: 'No new emails',
          one: '{0} new email',
          two: '{0} new emails',
          few: '{0} new emails',
          many: '{0} new emails',
          other: '{0} new emails'
      },
      /* Pagination */
      pagination_page_of: 'Page {0} of {1}',
      pagination_next: 'Next',
      pagination_prev: 'Previous',
      /* Miscellaneous */
      x_of_y: '{0} of {1}',
      // -----------------------------------------------------------------------------
      // {pkg}:{ComponentDir} entries
      // -----------------------------------------------------------------------------
      /* core:Link */
      preview_link_arrow_navigation: 'Arrow left or right for link options',
      /* core:SkipLinks */
      go_to_main_content: 'Go to main content',
      /* core:AppShell */
      app_shell_create: 'Create',
      app_shell_open_nav: 'Open navigation menu',
      /* core:ComboBox */
      combobox_open_close: 'Arrow down to open, press escape to close.',
      combobox_search_instructions: 'Start typing to search',
      combobox_open_list_button_a11y: 'Open combobox list',
      combobox_close_list_button_a11y: 'Close combobox list',
      /* core:Menu */
      menu_selection_instructions: 'Press enter to select items.',
      menu_item_expand_arrow: 'Arrow right to expand.',
      menu_item_collapse_arrow: 'Arrow left to collapse.',
      menu_item_collapse_shift_space: 'Press shift space to collapse.',
      menu_item_shift_space_expand_collapse: 'Press shift space to expand and collapse.',
      /* core:Modal */
      modal_minimize: 'Minimize modal',
      modal_maximize: 'Maximize modal',
      modal_dock: 'Dock Modal',
      modal_close: 'Close modal',
      /* core:Datetime */
      selected_date_a11y: 'Selected date:',
      open_calendar_button_a11y: 'Open calendar',
      close_calendar_button_a11y: 'Close calendar',
      open_time_button_a11y: 'Open time picker',
      close_time_button_a11y: 'Close time picker',
      picker_next_month: 'Next month',
      picker_prev_month: 'Previous month',
      picker_jump_to_month: 'Jump to month',
      calendar_assist: 'Use cursor keys to navigate dates',
      /* core:Boolean */
      boolean_display_true_label: 'Yes',
      boolean_display_false_label: 'No',
      /* core:Number */
      measured_in: 'measured in {0}',
      number_increment_value_by: 'Increment value by {0}',
      number_decrement_value_by: 'Decrement value by {0}',
      /* core:Banner */
      banner_dismiss_button_label_a11y: 'Dismiss banner',
      /* core:File */
      file_upload_text_main: 'Drag and drop or {0}',
      file_upload_text_one: 'choose file',
      file_upload_text_multiple: 'choose files',
      /* core:Location */
      my_current_location_button_a11y: 'Use my current location',
      location_input_placeholder: 'Enter a location',
      location_not_found_text: 'Location not found',
      allow_location_permissions_text: 'To get current location, allow location permissions for this app',
      /* work:CaseView */
      utilities_summary: 'Utilities summary',
      expand_summary_panel: 'Expand summary panel',
      collapse_summary_panel: 'Collapse summary panel',
      expand_utilities_panel: 'Expand utilities panel',
      collapse_utilities_panel: 'Collapse utilities panel',
      /* work:CasePreview */
      close_preview: 'Close preview',
      /* work:Confirmation */
      confirmation_details: 'Details',
      confirmation_whats_next: "What's next",
      confirmation_open_tasks: 'Open tasks',
      /* work:Stakeholders */
      add_stakeholders: 'Add stakeholder',
      edit_stakeholder: 'Edit stakeholder',
      view_stakeholders: 'Stakeholders',
      stakeholders_role: 'Role',
      stakeholders: {
          zero: '{0} stakeholders',
          one: '{0} stakeholder',
          two: '{0} stakeholders',
          few: '{0} stakeholders',
          many: '{0} stakeholders',
          other: '{0} stakeholders'
      },
      /* work:Tags */
      edit_tags: 'Edit tags',
      tags: 'Tags',
      /* work:AppAnnouncement */
      app_announcement_dismiss_button_label_a11y: 'Hide until next update',
      app_announcement_details_list_header: 'Announcements',
      app_announcement_whats_new_button_label: "See what's new",
      /* rte:RichTextEditor */
      rte_heading_style: 'Heading style',
      rte_bold: 'Bold',
      rte_italic: 'Italic',
      rte_strike_through: 'Strike-through',
      rte_cut: 'Cut',
      rte_copy: 'Copy',
      rte_paste: 'Paste',
      rte_bulleted_list: 'Bulleted list',
      rte_numbered_list: 'Numbered list',
      rte_indent: 'Indent',
      rte_unindent: 'Unindent',
      rte_table: 'Table',
      rte_anchor: 'Anchor',
      rte_image: 'Image',
      rte_invalid_html: 'Invalid HTML',
      rte_invalid_url: 'Invalid URL',
      rte_change_text_format: 'Change text format to',
      rte_toggle_unordered_list: 'Toggle unordered list',
      rte_indent_selection: 'Indent selection',
      rte_unindent_selection: 'Unindent selection',
      rte_toolbar_instructions: 'Hit tab to enter the editor toolbar',
      rte_text_formatting_toolbar: 'Text formatting toolbar',
      rte_link: 'Link',
      /* social:Feed */
      feed_new_post: 'New post',
      feed_cancel_conversation: 'Cancel conversation',
      feed_context: 'in {0}',
      feed_liked_by: 'Liked by {0}',
      feed_likes: 'Likes',
      feed_private_post: 'Private post',
      feed_public_post: 'Public post',
      feed_recipients: 'Recipients',
      feed_edit_post: 'Edit post',
      feed_post_likes: {
          zero: 'No likes',
          one: '{0} like',
          two: '{0} likes',
          few: '{0} likes',
          many: '{0} likes',
          other: '{0} likes'
      },
      feed_attachments_added: {
          zero: 'No attachments added',
          one: '{0} attachment added',
          two: '{0} attachments added',
          few: '{0} attachments added',
          many: '{0} attachments added',
          other: '{0} attachments added'
      },
      feed_attachments_removed: {
          zero: 'No attachments removed',
          one: '{0} attachment removed',
          two: '{0} attachments removed',
          few: '{0} attachments removed',
          many: '{0} attachments removed',
          other: '{0} attachments removed'
      },
      feed_post_liked: 'Post has been liked',
      feed_post_deliked: 'Post has been deliked',
      feed_post_removed: 'Post has been removed',
      feed_reply_removed: 'Reply has been removed',
      showing_num_of_num: 'Showing {0} of {1}',
      /* cs:Chat */
      scroll_to_latest_message: 'Scroll to latest message',
      scroll_to_unread_messages: 'Scroll to unread messages',
      suggested_replies_current_of_total: 'Suggested replies {0} of {1}',
      confidence_percentage: '{0}% confidence',
      next_suggested_reply: 'Next suggested reply',
      prev_suggested_reply: 'Previous suggested reply',
      dismiss_suggested_replies: 'Dismiss suggested replies',
      /* cs:Email */
      more_count: '{0} more…',
      empty_search: 'Enter a search term',
      new_messages: 'New messages',
      earlier_transcripts: 'Earlier transcripts',
      send_label: 'Send',
      enter_message: 'Enter message',
      download: 'Download',
      close_chat_utility: 'Close chat utility',
      subject: 'Subject',
      to: 'To',
      from: 'From',
      cc: 'Cc',
      bcc: 'Bcc',
      date: 'Date',
      reply: 'Reply',
      reply_all: 'Reply all',
      auto_reply: 'Auto-Reply',
      forward: 'Forward',
      email: 'Email',
      email_message: 'Email message',
      email_filters: 'Email filters',
      unread_email_count: 'unread email count is {0}',
      priority: 'Priority',
      inbox: 'Inbox',
      insert: 'Insert',
      email_add_attachment: 'Add attachment, the maximum number of attachments allowed is {0}.',
      email_disable_attachment: 'Adding attachments are disabled, the maximum number of attachments allowed is {0}.',
      email_remove_attachment: 'Remove attachment',
      /* cs:ArticleList */
      article_list_label_a11y: 'Article list',
      article_list_filter_label_a11y: 'Article lists filter',
      article_list_header_submit_label: 'Submit',
      /* cs:CallControlPanel */
      call_panel_heading: 'Pega call',
      call_panel_make_new_call: 'Make new call',
      call_panel_agent_status: 'Status',
      call_panel_pause_call_menu_item: 'Pause call',
      call_panel_resume_call_menu_item: 'Resume call',
      call_panel_mute_mic_menu_item: 'Mute microphone',
      call_panel_unmute_mic_menu_item: 'Unmute microphone',
      call_panel_call_on_hold: 'On hold {0}',
      call_panel_consult_call_menu_item: 'Consult',
      call_panel_transfer_call_menu_item: 'Transfer',
      call_panel_send_dtmf_menu_item: 'Send DTMF',
      call_panel_conference_call_menu_item: 'Conference',
      call_panel_hangup_call_menu_item: 'Hang up',
      call_panel_contacts_add_to_favorites: 'Add to favorites',
      call_panel_contacts_remove_from_favorites: 'Remove from favorites',
      call_panel_contacts_call_button_label: 'Call',
      call_panel_contacts_list_heading: 'Contacts',
      call_panel_contacts_favorites_heading: 'Favorites',
      call_panel_contacts_dial_pad_heading: 'Dial pad',
      call_panel_new_call_heading: 'New call',
      call_panel_consult_with_heading: 'Consult with',
      call_panel_conference_heading: 'Conference',
      call_panel_transfer_button_label: 'Transfer',
      call_panel_transfer_call_heading: 'Transfer call',
      call_panel_transfer_reason_label: 'Reason',
      call_panel_transfer_to_label: 'Transfer to',
      call_panel_transfer_comments_label: 'Comments',
      call_panel_transfer_call_option_label: 'Call option',
      call_panel_transfer_call_only_option: 'Call only',
      call_panel_transfer_call_and_interaction_option: 'Call and interaction',
      call_panel_merge_call_menu_item: 'Merge',
      call_panel_send_dtmf_heading: 'Send DTMF',
      call_panel_expand: 'Expand call control panel',
      call_panel_collapse: 'Collapse call control panel',
      /* cs:DialPad */
      dial_pad_keyboard: 'Dial pad keyboard',
      dial_pad_phone_number_input_label: 'Phone number input',
      dial_pad_call_button_label: 'Call {0}',
      /* cs:TaskManager */
      dismiss_case: 'Dismiss case',
      task_manager_add_task: 'Add task',
      task_manager_wrap_up: 'Wrap up',
      task_manager_tasks: 'Tasks',
      add_tasks: 'Add tasks',
      selected_tasks: 'Selected tasks',
      no_selected_tasks: 'No selected tasks',
      task_picker_close: 'Close task picker',
      task_manager_overflow_menu: 'Menu for added tasks',
      go_label: 'Go',
      go_label_a11y: 'Go to {0}',
      continue_label: 'Continue',
      continue_label_a11y: 'Continue with {0}',
      review_label: 'Review',
      review_label_a11y: 'Review {0}',
      dismiss_label: 'Dismiss',
      dismiss_label_a11y: 'Dismiss {0}',
      task_manager_search_results_empty_text: 'No tasks',
      task_manager_delete_task: 'Delete {0}',
      search_tasks: 'Search tasks…',
      task_manager_picker_add_label: {
          zero: 'No items to add',
          one: 'Add {0} new item',
          two: 'Add {0} new item',
          few: 'Add {0} new item',
          many: 'Add {0} new item',
          other: 'Add {0} new item'
      },
      /* cs:Sentiment */
      sentiment_positive: 'Positive',
      sentiment_negative: 'Negative',
      sentiment_neutral: 'Neutral',
      /* cs:IntelligentGuidance */
      expand_intelligent_guidance_button_a11y: 'Expand intelligent guidance',
      collapse_intelligent_guidance_button_a11y: 'Collapse intelligent guidance',
      no_recommendations: 'No recommendations',
      /* condition-builder:ConditionBuilder */
      condition_builder_advanced_condition_label: 'Advanced condition',
      condition_builder_advanced_condition_placeholder: 'Advanced condition',
      condition_builder_advanced_mode_button_label: 'Advanced mode',
      condition_builder_basic_mode_button_label: 'Basic mode',
      condition_builder_condition_select_info_default: 'No selection',
      condition_builder_possible_values_label: 'Values',
      condition_builder_selection_text_default: 'Select values',
      condition_builder_submit_button_label: 'Submit',
      condition_builder_add_button_label: 'Add new condition',
      condition_builder_remove_button_label: 'Remove condition',
      condition_builder_switch_banner_text: 'Switching from Advanced mode can reset all AND/OR/NOT operators. Do you want to continue?',
      condition_builder_confirm_button_label: 'OK',
      condition_builder_empty_selection_error_text: 'No selection',
      condition_builder_compare_with: 'Compare with',
      condition_builder_compare_with_another_field: 'Another field',
      condition_builder_compare_with_relative_date: 'Relative date',
      condition_builder_compare_with_text_value: 'Text value',
      condition_builder_compare_with_numeric_value: 'Numeric value',
      condition_builder_compare_with_date_value: 'Date value',
      condition_builder_compare_with_time_value: 'Time value',
      condition_builder_invalid_time_period: 'Invalid time period',
      condition_builder_invalid_relative_date: 'Invalid relative date',
      condition_builder_invalid_value: 'Invalid value',
      condition_builder_invalid_number: 'Invalid number',
      condition_builder_date_function_year: 'Year',
      condition_builder_date_function_quarter: 'Quarter',
      condition_builder_select_placeholder: 'Select…',
      condition_builder_day_number_of_month: {
          zero: '{0}th day of the month',
          one: '{0}st day of the month',
          two: '{0}nd day of the month',
          few: '{0}rd day of the month',
          many: '{0}th day of the month',
          other: '{0}th day of the month'
      },
      condition_builder_date_function_month: 'Month',
      condition_builder_date_function_week: 'Week',
      condition_builder_date_function_day: 'Day',
      condition_builder_date_function_hour: 'Hour',
      condition_builder_date_function_month_of_year: 'Month of year',
      condition_builder_date_function_day_of_month: 'Day of month',
      condition_builder_date_function_day_of_week: 'Day of week',
      condition_builder_date_part: 'Date part',
      condition_builder_relative_dates_minute: 'Minute(s)',
      condition_builder_relative_dates_hour: 'Hour(s)',
      condition_builder_relative_dates_day: 'Day(s)',
      condition_builder_relative_dates_week: 'Week(s)',
      condition_builder_relative_dates_month: 'Month(s)',
      condition_builder_relative_dates_quarter: 'Quarter(s)',
      condition_builder_relative_dates_year: 'Year(s)',
      condition_builder_current_minute: 'Current minute',
      condition_builder_current_hour: 'Current hour',
      condition_builder_current_day: 'Current day',
      condition_builder_current_week: 'Current week',
      condition_builder_current_month: 'Current month',
      condition_builder_current_quarter: 'Current quarter',
      condition_builder_current_year: 'Current year',
      condition_builder_last_X_minutes: {
          zero: 'Current minute',
          one: 'Last minute',
          two: 'Last {0} minutes',
          few: 'Last {0} minutes',
          many: 'Last {0} minutes',
          other: 'Last {0} minutes'
      },
      condition_builder_last_X_hours: {
          zero: 'Current hour',
          one: 'Last hour',
          two: 'Last {0} hours',
          few: 'Last {0} hours',
          many: 'Last {0} hours',
          other: 'Last {0} hours'
      },
      condition_builder_last_X_days: {
          zero: 'Current day',
          one: 'Last day',
          two: 'Last {0} days',
          few: 'Last {0} days',
          many: 'Last {0} days',
          other: 'Last {0} days'
      },
      condition_builder_last_X_weeks: {
          zero: 'Current week',
          one: 'Last week',
          two: 'Last {0} weeks',
          few: 'Last {0} weeks',
          many: 'Last {0} weeks',
          other: 'Last {0} weeks'
      },
      condition_builder_last_X_months: {
          zero: 'Current month',
          one: 'Last month',
          two: 'Last {0} months',
          few: 'Last {0} months',
          many: 'Last {0} months',
          other: 'Last {0} months'
      },
      condition_builder_last_X_quarters: {
          zero: 'Current quarter',
          one: 'Last quarter',
          two: 'Last {0} quarters',
          few: 'Last {0} quarters',
          many: 'Last {0} quarters',
          other: 'Last {0} quarters'
      },
      condition_builder_last_X_years: {
          zero: 'Current year',
          one: 'Last year',
          two: 'Last {0} years',
          few: 'Last {0} years',
          many: 'Last {0} years',
          other: 'Last {0} years'
      },
      condition_builder_next_X_minutes: {
          zero: 'Current minute',
          one: 'Next minute',
          two: 'Next {0} minutes',
          few: 'Next {0} minutes',
          many: 'Next {0} minutes',
          other: 'Next {0} minutes'
      },
      condition_builder_next_X_hours: {
          zero: 'Current hour',
          one: 'Next hour',
          two: 'Next {0} hours',
          few: 'Next {0} hours',
          many: 'Next {0} hours',
          other: 'Next {0} hours'
      },
      condition_builder_next_X_days: {
          zero: 'Current day',
          one: 'Next day',
          two: 'Next {0} days',
          few: 'Next {0} days',
          many: 'Next {0} days',
          other: 'Next {0} days'
      },
      condition_builder_next_X_weeks: {
          zero: 'Current week',
          one: 'Next week',
          two: 'Next {0} weeks',
          few: 'Next {0} weeks',
          many: 'Next {0} weeks',
          other: 'Next {0} weeks'
      },
      condition_builder_next_X_months: {
          zero: 'Current month',
          one: 'Next month',
          two: 'Next {0} months',
          few: 'Next {0} months',
          many: 'Next {0} months',
          other: 'Next {0} months'
      },
      condition_builder_next_X_quarters: {
          zero: 'Current quarter',
          one: 'Next quarter',
          two: 'Next {0} quarters',
          few: 'Next {0} quarters',
          many: 'Next {0} quarters',
          other: 'Next {0} quarters'
      },
      condition_builder_next_X_years: {
          zero: 'Current year',
          one: 'Next year',
          two: 'Next {0} years',
          few: 'Next {0} years',
          many: 'Next {0} years',
          other: 'Next {0} years'
      },
      condition_builder_previous_X_minutes: {
          zero: 'Current minute',
          one: 'Previous minute',
          two: 'Previous {0} minutes',
          few: 'Previous {0} minutes',
          many: 'Previous {0} minutes',
          other: 'Previous {0} minutes'
      },
      condition_builder_previous_X_hours: {
          zero: 'Current hour',
          one: 'Previous hour',
          two: 'Previous {0} hours',
          few: 'Previous {0} hours',
          many: 'Previous {0} hours',
          other: 'Previous {0} hours'
      },
      condition_builder_previous_X_days: {
          zero: 'Current day',
          one: 'Previous day',
          two: 'Previous {0} days',
          few: 'Previous {0} days',
          many: 'Previous {0} days',
          other: 'Previous {0} days'
      },
      condition_builder_previous_X_weeks: {
          zero: 'Current week',
          one: 'Previous week',
          two: 'Previous {0} weeks',
          few: 'Previous {0} weeks',
          many: 'Previous {0} weeks',
          other: 'Previous {0} weeks'
      },
      condition_builder_previous_X_months: {
          zero: 'Current month',
          one: 'Previous month',
          two: 'Previous {0} months',
          few: 'Previous {0} months',
          many: 'Previous {0} months',
          other: 'Previous {0} months'
      },
      condition_builder_previous_X_quarters: {
          zero: 'Current quarter',
          one: 'Previous quarter',
          two: 'Previous {0} quarters',
          few: 'Previous {0} quarters',
          many: 'Previous {0} quarters',
          other: 'Previous {0} quarters'
      },
      condition_builder_previous_X_years: {
          zero: 'Current year',
          one: 'Previous year',
          two: 'Previous {0} years',
          few: 'Previous {0} years',
          many: 'Previous {0} years',
          other: 'Previous {0} years'
      },
      condition_builder_time_period_label: 'Time period',
      condition_builder_time_period_last: 'Last',
      condition_builder_time_period_current: 'Current',
      condition_builder_time_period_previous: 'Previous',
      condition_builder_time_period_next: 'Next',
      condition_builder_value_label: 'Value',
      /* build:AppShell */
      dev_mode: 'Dev mode',
      expand_navigation: 'Expand navigation',
      collapse_navigation: 'Collapse navigation',
      /* build:Lifecycle */
      parallel: 'Parallel',
      stage: 'Stage',
      alternate_stage: 'Alternate stage',
      stage_see_full_lifecycle: 'See full lifecycle',
      lifecycle: '{0} lifecycle',
      add_stage: 'Add stage',
      add_alternate_stage: 'Add alternate stage',
      /* build:FlowModeller */
      add_node: 'Add node',
      search_nodes: 'Search nodes',
      /* build:Workbench */
      zoom_level: 'Zoom level'
  };

  const create = (translations) => {
      return Object.freeze({ ...defaultTranslation, ...translations });
  };
  var createTranslationPack = create;
  const DefaultTranslation = create();
  const rightToLeftLangs = [
      'ar',
      'arc',
      'ckb',
      'dv',
      'fa',
      'ha',
      'he',
      'khw',
      'ks',
      'ps',
      'ur',
      'yi'
  ];
  const direction = (localeTag) => {
      return rightToLeftLangs.includes(localeTag.split('-')[0]) ? 'rtl' : 'ltr';
  };

  const initializedKey = Symbol.for('@pega/cosmos-react-core.configuration.initialized');
  const defaultProps$5 = {};
  const defaultLocale = navigatorIsAvailable ? navigator.language : 'en';
  const ConfigurationContext = React.createContext({
      [initializedKey]: false,
      locale: defaultLocale,
      direction: direction(defaultLocale),
      translations: DefaultTranslation,
      themeMachine: BaseThemeMachine,
      styleSheetTarget: documentIsAvailable ? document.head : undefined,
      portalTarget: documentIsAvailable ? document.body : undefined,
      overrideMap: {},
      renderNativeControls: false
  });
  const metaKey = Symbol.for('@pega/cosmos-react-core.metadata');
  if (windowIsAvailable) {
      if (!window[metaKey]) {
          window[metaKey] = [];
      }
      window[metaKey].push({ version: '2.2.6' });
  }
  const Configuration = ({ context = ConfigurationContext, children, locale, direction: direction$1, translations: customTranslations, theme, disableDefaultFontLoading, styleSheetTarget, portalTarget, overrideMap, renderNativeControls }) => {
      const ctx = React.useContext(context);
      const themeMachine = theme
          ? new ThemeMachine$1({ theme, parent: ctx.themeMachine })
          : ctx.themeMachine;
      const translations = React.useMemo(() => createTranslationPack({ ...ctx.translations, ...customTranslations }), [ctx.translations, customTranslations]);
      const [mounted, setMounted] = React.useState(false);
      React.useEffect(() => {
          setMounted(true);
      }, []);
      const wrappedChildren = ctx[initializedKey] ? (children) : (jsxRuntime.jsx(styled.StyleSheetManager, { disableVendorPrefixes: true, target: styleSheetTarget ?? ctx.styleSheetTarget, children: jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [!disableDefaultFontLoading &&
                      mounted &&
                      documentIsAvailable &&
                      reactDom.createPortal(jsxRuntime.jsx("link", { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap', "data-cosmos-global-style": true }, void 0), styleSheetTarget ?? ctx.styleSheetTarget ?? document.head), jsxRuntime.jsx(GlobalStyle, {}, void 0), children] }, void 0) }, void 0));
      return (jsxRuntime.jsx(ConfigurationContext.Provider, { value: {
              locale: locale ?? ctx.locale,
              direction: direction$1 ?? (locale !== undefined ? direction(locale) : ctx.direction),
              translations,
              themeMachine,
              [initializedKey]: true,
              styleSheetTarget: styleSheetTarget ?? ctx.styleSheetTarget,
              portalTarget: portalTarget ?? ctx.portalTarget,
              overrideMap: overrideMap ? { ...ctx.overrideMap, ...overrideMap } : ctx.overrideMap,
              renderNativeControls: renderNativeControls ?? ctx.renderNativeControls
          }, children: jsxRuntime.jsx(styled.ThemeProvider, { theme: themeMachine.theme, children: wrappedChildren }, void 0) }, void 0));
  };
  Configuration.defaultProps = defaultProps$5;
  var Configuration$1 = Configuration;

  /**
   * @example const configuration = useConfiguration();
   * @returns configuration:: The configuration context object including all of the properties that can be set on the Configuration component.
   */
  const useConfiguration = () => React.useContext(ConfigurationContext);
  var useConfiguration$1 = useConfiguration;

  /**
   * @example const theme = useTheme();
   * @returns theme:: The complete theme object as provided to the Configuration component.
   */
  const useTheme = () => useConfiguration$1().themeMachine.theme;
  var useTheme$1 = useTheme;

  /**
   * @example const breakpointActive = useBreakpoint(breakpoint);
   * @param breakpoint The string indicator for the breakpoint that should be checked for validity.
   * @param options
   * @returns breakpointActive:: A boolean indicating if the given breakpoint is active or not. If false, the breakpoint is too big for the screen size.
   */
  const useBreakpoint = (breakpoint, options = {
      defaultValue: false
  }) => {
      const { base: { breakpoints } } = useTheme$1();
      const breakpointVal = breakpoints[breakpoint];
      const [matches, setMatches] = React.useState(windowIsAvailable
          ? window.matchMedia(`(min-width: ${breakpointVal})`).matches
          : !!options.defaultValue);
      const onResize = React.useCallback((e) => {
          setMatches(e.matches);
      }, []);
      React.useLayoutEffect(() => {
          // Breakpoint handling for contained elements
          if (options.breakpointRef && options.breakpointRef.current) {
              const observer = new ResizeObserver(entries => {
                  const matchesBreakpoint = entries.some(({ target, contentRect }) => {
                      if (target !== options.breakpointRef?.current)
                          return;
                      return contentRect.width >= parseFloat(breakpointVal) * 16;
                  });
                  setMatches(matchesBreakpoint);
              });
              observer.observe(options.breakpointRef.current);
              return () => {
                  observer.disconnect();
              };
          }
          // Breakpoint handling for viewport
          if (windowIsAvailable) {
              const mediaMatch = window.matchMedia(`(min-width: ${breakpointVal})`);
              const mediaMatchAvailable = 'addEventListener' in mediaMatch;
              const resizeHandler = debounce(() => {
                  setMatches(window.innerWidth >= parseInt(breakpointVal, 10));
              }, 100);
              // Need to check useMatchMedia in order to support Enzyme testing
              if (mediaMatchAvailable) {
                  mediaMatch.addEventListener('change', onResize);
                  setMatches(mediaMatch.matches);
              }
              else {
                  window.addEventListener('resize', resizeHandler);
                  setMatches(window.innerWidth >= parseInt(breakpointVal, 10));
              }
              return () => {
                  // Need to check useMatchMedia in order to support Enzyme testing
                  if (mediaMatchAvailable)
                      mediaMatch.removeEventListener('change', onResize);
                  else {
                      window.removeEventListener('resize', resizeHandler);
                  }
              };
          }
      }, [options.breakpointRef?.current]);
      return matches;
  };
  var useBreakpoint$1 = useBreakpoint;

  /**
   * @example const ref = useConsolidatedRefs(refs);
   * @param refs The ref or refs to consolidate.
   * @returns ref:: The consolidated ref.
   */
  const useConsolidatedRef = (...refs) => {
      const targetRef = React.useRef(null);
      const refProxy = React.useMemo(() => ({ current: null }), []);
      Object.defineProperty(refProxy, 'current', {
          configurable: true,
          enumerable: true,
          get: () => targetRef.current,
          set: value => {
              targetRef.current = value;
              refs.forEach(ref => {
                  if (!ref)
                      return;
                  if (typeof ref === 'function') {
                      ref(targetRef.current);
                  }
                  else {
                      ref.current = targetRef.current;
                  }
              });
          }
      });
      return refProxy;
  };
  var useConsolidatedRef$1 = useConsolidatedRef;

  const useDirection = () => {
      const { direction } = useConfiguration$1();
      return React.useMemo(() => {
          return direction === 'ltr'
              ? {
                  start: 'left',
                  end: 'right',
                  ltr: true,
                  rtl: false
              }
              : {
                  start: 'right',
                  end: 'left',
                  ltr: false,
                  rtl: true
              };
      }, [direction]);
  };
  var useDirection$1 = useDirection;

  /**
   * @example const [element, setElementFunction] = useElement(initial);
   * @param initial The initial value to set to element.
   * @returns * element:: A DOM Element.
   *          * setElementFunction:: The function responsible for setting and resetting the element variable. This function is typically passed to the ref attribute of the element you wish to reference.
   */
  const useElement = (initial = null) => React.useState(initial);
  var useElement$1 = useElement;

  /**
   * @example useOuterEvent(eventName, [nodes], handler = () => { doSomething; });
   * @param eventName The type of event to trigger the handler function on. Reference [DocumentEventMap](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.documenteventmap.html) for a list of valid events.
   * @param nodes An array of Nodes or Refs to Nodes to attach the eventName to.
   * @param handler The function that is called when the given event occurs.
   */
  const useOuterEvent = (eventName, nodes, handler) => {
      const onEvent = React.useCallback(event => {
          const path = event.composedPath();
          const target = path[0];
          if (!(target instanceof Node))
              return;
          let childIdx = 0;
          let parentIdx = 1;
          while (path[childIdx] !== document) {
              const child = path[childIdx];
              const parent = path[parentIdx];
              if (!child || !parent)
                  return;
              if (parent instanceof DocumentFragment || parent instanceof Document) {
                  if (!(child instanceof Node) || !parent.contains(child))
                      return;
                  childIdx = parentIdx;
              }
              else if (child instanceof DocumentFragment) {
                  if (!(parent instanceof Element) || parent.shadowRoot !== child)
                      return;
                  childIdx = parentIdx;
              }
              parentIdx += 1;
          }
          if (nodes.every(n => {
              const node = n instanceof Node ? n : n?.current;
              if (!node)
                  return true;
              return node !== target && !node.contains(target);
          })) {
              handler(event);
          }
      }, [...nodes, handler]);
      React.useEffect(() => {
          const eventNames = Array.isArray(eventName) ? eventName : [eventName];
          eventNames.forEach(event => document.addEventListener(event, onEvent));
          return () => eventNames.forEach(event => document.removeEventListener(event, onEvent));
      }, [eventName, onEvent]);
  };
  var useOuterEvent$1 = useOuterEvent;

  /** Hook for properly handling focus state of children components.
   * @example const hasFocus = useFocusWithin([containerRef, ...], (isFocused, element) => { doSomething; });
   * @param onFocusChange Callback function that is invoked with the current focus state and the current element when any child elements takes focus or all of them lose focus.
   * @returns * hasFocus:: A boolean indicating if the ref element has focus or not.
   */
  const useFocusWithin = (els, onFocusChange) => {
      const [hasFocus, setFocus] = React.useState(false);
      const focusedElRef = React.useRef(null);
      const blurTimerRef = React.useRef();
      const elsRef = React.useRef(els);
      elsRef.current = els;
      const onBlur = React.useCallback(({ relatedTarget }) => {
          if (!hasFocus)
              return;
          const elements = normalizeElements(elsRef.current);
          if (relatedTarget instanceof Node) {
              // changing focus to another relevant child doesn't count
              const focusedEl = elements.find(el => el?.contains(relatedTarget));
              if (focusedEl) {
                  // ... just update the currently focused item
                  focusedElRef.current = focusedEl;
                  return;
              }
          }
          clearTimeout(blurTimerRef.current);
          blurTimerRef.current = setTimeout(() => {
              if (!elements.some(el => {
                  return el?.contains(document.activeElement);
              })) {
                  setFocus(false);
                  onFocusChange?.(false, focusedElRef.current);
                  focusedElRef.current = null;
              }
          });
      }, [hasFocus, onFocusChange]);
      const onFocus = React.useCallback(({ currentTarget }) => {
          clearTimeout(blurTimerRef.current);
          if (!hasFocus) {
              setFocus(true);
              const targetEl = currentTarget;
              onFocusChange?.(true, targetEl);
              focusedElRef.current = targetEl;
          }
      }, [hasFocus, onFocusChange]);
      useOuterEvent$1('mouseup', els, React.useCallback(() => {
          if (hasFocus) {
              setFocus(false);
              onFocusChange?.(false, focusedElRef.current);
              focusedElRef.current = null;
          }
      }, [onFocusChange, hasFocus]));
      React.useEffect(() => {
          const elements = normalizeElements(els);
          elements.forEach(el => {
              el?.addEventListener('focusin', onFocus);
              el?.addEventListener('focusout', onBlur);
          });
          return () => {
              elements.forEach(el => {
                  el?.removeEventListener('focusin', onFocus);
                  el?.removeEventListener('focusout', onBlur);
              });
          };
      }, [els, onFocus, onBlur]);
      // Clear timeout when component un-mounts.
      React.useEffect(() => () => {
          clearTimeout(blurTimerRef.current);
      }, []);
      return hasFocus;
  };
  var useFocusWithin$1 = useFocusWithin;

  /**
   * Function returns a function capable to translate tokens based on given translation pack and given locale.
   * The passed translation object should be correlated to given locale.
   * @param translation a translation pack (might be default or completely/partially overridden).
   * @param locale locale as BCP 47 language tag. Used for pluralization rules.
   * @returns
   */
  const translatorFor = (translation, locale) => {
      const cardinalRules = new Intl.PluralRules(locale);
      const ordinalRules = new Intl.PluralRules(locale, { type: 'ordinal' });
      return ((literal, tokens = [], options) => {
          let template = translation[literal];
          if (!template)
              return `!unknown key: ${literal}`;
          const result = [];
          if (typeof template === 'object') {
              const type = (options?.pluralType === 'ordinal' ? ordinalRules : cardinalRules).select(options?.count || 0);
              template = template[type];
          }
          template.split(/\{(\d+)\}/g).forEach((chunk, index) => {
              const part = index % 2 ? tokens[Number(chunk)] : chunk;
              if (part !== undefined && part !== '')
                  result.push(part);
          });
          if (result.every(part => typeof part === 'string' || typeof part === 'number'))
              return result.join('').trim();
          // eslint-disable-next-line react/no-array-index-key
          return result.map((part, i) => jsxRuntime.jsx(React.Fragment, { children: part }, i));
      });
  };
  var translatorFor$1 = translatorFor;

  /**
   * @example const translator = useI18n();
   * @returns translator:: The translator function that provides translations for a given key  in the translation JSON provided to the Configuration component.
   */
  const useI18n = () => {
      const { translations, locale } = useConfiguration$1();
      return translatorFor$1(translations, locale);
  };
  var useI18n$1 = useI18n;

  /**
   * @example useItemIntersection(listRef,offset,() => { do_some_thing; });
   * @param containerRef The ref of the List.
   * @param offset  Index of the list item which needs to be observed.
   * @param cb Callback that needs to be fired on intersect
   * @param itemSelector Selector used to get the node list of items
   * @returns void.
   */
  const useItemIntersection = (containerRef, offset, cb, itemSelector) => {
      React.useEffect(() => {
          if (containerRef.current) {
              let item = null;
              if (offset > 0) {
                  const items = containerRef.current.querySelectorAll(itemSelector);
                  if (items.length > offset) {
                      item = items[offset];
                  }
              }
              if (item) {
                  const intersectionObserver = new IntersectionObserver((entries) => {
                      if (entries[0].isIntersecting) {
                          cb();
                      }
                  }, {
                      root: containerRef.current
                  });
                  intersectionObserver.observe(item);
                  return () => {
                      intersectionObserver.disconnect();
                  };
              }
          }
      }, [cb, containerRef.current, offset]);
  };
  var useItemIntersection$1 = useItemIntersection;

  /**
   * @example const previousValue = usePrevious(value);
   * @param value The value to store before a re-render.
   * @returns previousValue:: The value that was stored prior to a re-render.
   */
  const usePrevious = (value) => {
      const ref = React.useRef();
      React.useLayoutEffect(() => {
          ref.current = value;
      }, [value]);
      return ref.current;
  };
  var usePrevious$1 = usePrevious;

  /**
   * Generate unique identifier that is stable across renders.
   * @example const stableUID = useUID();
   * @returns uid:: The same autogenerated UID between renders.
   */
  const useUID = () => {
      return React.useRef(createUID()).current;
  };
  var useUID$1 = useUID;

  const PopoverManagerContext = React.createContext({
      checkActive: () => true,
      setActive: () => { }
  });

  const StyledPopoverArrow = styled__default["default"].div(({ theme: { base: { shadow: { 'low-filter': low } } } }) => styled.css `
    background-color: inherit;
    height: 0;
    width: 0;
    filter: ${low};
    z-index: -1; /* Make sure it's under the Popover. */

    ::after {
      content: '';
      display: block;
      background-color: inherit;
      height: 0.5rem;
      width: 0.5rem;
      transform: rotate(45deg);
    }
  `);
  StyledPopoverArrow.defaultProps = defaultThemeProp;
  const StyledPopover = styled__default["default"].div(({ theme: { base: { 'border-radius': borderRadius, 'z-index': { popover: zIndex }, shadow: { 'low-filter': low } }, components: { card: { background, 'border-radius': cardBorderRadius } } }, offset }) => {
      return styled.css `
      /*
        Margin should never be used with Popper.
        https://popper.js.org/docs/v2/migration-guide/#4-remove-all-css-margins
      */
      margin: 0 !important;
      z-index: ${zIndex};
      background-color: ${background};
      border-radius: calc(${cardBorderRadius} / 2);

      ::after {
        content: '';
        background-color: inherit;
        border-radius: inherit;
        z-index: -2; /* Make sure it's under the arrow. */
        filter: ${low};
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }

      &[data-popper-reference-hidden='true'] {
        visibility: hidden;
        pointer-events: none;
      }

      &[data-popper-placement^='top'] {
        > ${StyledPopoverArrow} {
          top: calc(100% - 0.25rem);
          margin-inline-start: -0.25rem;

          ::after {
            border-bottom-right-radius: calc(${borderRadius} / 4);
          }
        }

        ::before {
          content: '';
          position: absolute;
          height: ${offset}px;
          bottom: -${offset}px;
          left: 0;
          right: 0;
        }
      }

      &[data-popper-placement^='bottom'] {
        > ${StyledPopoverArrow} {
          bottom: calc(100% + 0.25rem);
          margin-inline-start: -0.25rem;

          ::after {
            border-top-left-radius: calc(${borderRadius} / 4);
          }
        }

        ::before {
          content: '';
          position: absolute;
          height: ${offset}px;
          top: -${offset}px;
          left: 0;
          right: 0;
        }
      }

      &[data-popper-placement^='right'] {
        > ${StyledPopoverArrow} {
          inset-inline-end: calc(100% + 0.25rem);
          margin-block-start: -0.25rem;

          ::after {
            border-bottom-left-radius: calc(${borderRadius} / 4);
          }
        }

        ::before {
          content: '';
          position: absolute;
          width: ${offset}px;
          left: -${offset}px;
          top: 0;
          bottom: 0;
        }
      }

      &[data-popper-placement^='left'] {
        > ${StyledPopoverArrow} {
          left: calc(100% - 0.25rem);
          margin-block-start: -0.25rem;

          ::after {
            border-top-right-radius: calc(${borderRadius} / 4);
          }
        }

        ::before {
          content: '';
          position: absolute;
          width: ${offset}px;
          right: -${offset}px;
          top: 0;
          bottom: 0;
        }
      }
    `;
  });
  StyledPopover.defaultProps = defaultThemeProp;

  const delays = {
      none: 0,
      short: 500,
      long: 1000
  };
  const Popover = React.forwardRef(({ show = true, portal = false, target, placement, strategy = 'fixed', style, modifiers = [], arrow = false, groupId, showDelay = 'none', hideDelay = 'none', hideOnTargetHidden = false, children, ...restProps }, ref) => {
      const { portalTarget } = useConfiguration$1();
      const { checkActive, setActive } = React.useContext(PopoverManagerContext);
      const [, setPopperEl] = useElement$1();
      const popperRef = useConsolidatedRef$1(ref, setPopperEl);
      const arrowRef = React.useRef(null);
      const forceUpdateRef = React.useRef();
      const [showPopover, setShowPopover] = React.useState(show);
      const timeout = React.useRef();
      const uid = useUID$1();
      const memoedModifiers = React.useMemo(() => [
          {
              name: 'offset',
              options: {
                  offset: [0, arrow ? 5.5 : 2]
              }
          },
          { name: 'hide', enabled: hideOnTargetHidden },
          { name: 'arrow', enabled: arrow, options: { element: arrowRef.current } },
          {
              name: 'preventOverflow',
              options: {
                  tether: !modifiers.find(m => m.name === 'sameWidth')
              }
          },
          {
              name: 'computeStyles',
              options: {
                  gpuAcceleration: false
              }
          },
          ...modifiers
      ], [modifiers, arrow, hideOnTargetHidden]);
      const offset = React.useMemo(() => {
          const offsetModifier = [...memoedModifiers]
              .reverse()
              .find(m => m.name === 'offset' && m.enabled !== false);
          return Array.isArray(offsetModifier?.options?.offset)
              ? offsetModifier?.options?.offset[1] ?? 0
              : 0;
      }, [memoedModifiers]);
      const { styles, attributes, forceUpdate } = reactPopper.usePopper(target, popperRef.current, {
          placement,
          strategy,
          modifiers: memoedModifiers
      });
      if (forceUpdate)
          forceUpdateRef.current = forceUpdate;
      React.useEffect(() => {
          const observer = new ResizeObserver(() => {
              forceUpdateRef.current?.();
          });
          if (popperRef.current)
              observer.observe(popperRef.current);
          if (target instanceof Element)
              observer.observe(target);
          return () => {
              observer.disconnect();
          };
      }, [forceUpdate, popperRef.current, target]);
      React.useEffect(() => {
          if (groupId && show)
              setActive(uid, groupId);
          if (windowIsAvailable) {
              if (timeout.current)
                  clearTimeout(timeout.current);
              timeout.current = window.setTimeout(() => {
                  setShowPopover(show);
              }, delays[show ? showDelay : hideDelay]);
          }
          else {
              setShowPopover(show);
          }
      }, [show]);
      React.useEffect(() => {
          return () => clearTimeout(timeout.current);
      }, []);
      const content = (jsxRuntime.jsxs(StyledPopover, { ...restProps, offset: offset, ref: popperRef, style: { ...style, ...styles.popper }, ...attributes.popper, children: [arrow && jsxRuntime.jsx(StyledPopoverArrow, { ref: arrowRef, style: { ...styles.arrow } }, void 0), children] }, void 0));
      if (!target || !showPopover || (groupId && !checkActive(uid, groupId)))
          return null;
      return portal && portalTarget ? reactDom.createPortal(content, portalTarget) : content;
  });
  var Popover$1 = Popover;

  const StyledTooltip = styled__default["default"].div(({ theme }) => {
      const fontSize = calculateFontSize(theme.base['font-size'], theme.base['font-scale']);
      return styled.css `
    background-color: ${theme.components.tooltip['background-color']};
    color: ${theme.components.tooltip['foreground-color']};
    font-size: ${fontSize.xxs};
    max-width: 40ch;
    padding: ${theme.base.spacing};
    white-space: pre-line;
    word-break: break-word;
  `;
  });
  StyledTooltip.defaultProps = defaultThemeProp;
  const Tooltip = React.forwardRef(({ children, target, showDelay = 'short', hideDelay = 'long', portal = false, describeTarget = true, ...restProps }, ref) => {
      const id = useUID$1();
      const [show, setShow] = React.useState(false);
      const tooltipRef = useConsolidatedRef$1(ref);
      const lastClickedRef = React.useRef(null);
      const showTooltip = React.useCallback(() => {
          setShow(true);
      }, []);
      const onMouseDown = React.useCallback(({ target: eTarget }) => {
          lastClickedRef.current = eTarget;
          if (eTarget === tooltipRef.current || eTarget === target)
              return;
          setShow(false);
      }, [target]);
      const onFocusOut = React.useCallback(() => {
          if (lastClickedRef.current !== tooltipRef.current) {
              setShow(false);
          }
          lastClickedRef.current = null;
      }, []);
      const onMouseEnter = React.useCallback(() => {
          setShow(true);
      }, [target]);
      const onMouseLeave = React.useCallback(() => {
          if (document.activeElement !== target) {
              setShow(false);
          }
      }, [target]);
      const onKeyDown = React.useCallback(({ key }) => {
          if (key === 'Escape' && document.activeElement === target) {
              setShow(false);
          }
      }, [target]);
      React.useEffect(() => {
          if (!target)
              return;
          document.addEventListener('keydown', onKeyDown);
          document.addEventListener('mousedown', onMouseDown);
          target.addEventListener('focusin', showTooltip);
          target.addEventListener('focusout', onFocusOut);
          target.addEventListener('mouseenter', onMouseEnter);
          target.addEventListener('mouseleave', onMouseLeave);
          return () => {
              document.removeEventListener('keydown', onKeyDown);
              document.removeEventListener('mousedown', onMouseDown);
              target.removeEventListener('focusin', showTooltip);
              target.removeEventListener('focusout', onFocusOut);
              target.removeEventListener('mouseenter', onMouseEnter);
              target.removeEventListener('mouseleave', onMouseLeave);
          };
      }, [target, showTooltip, onMouseDown, onFocusOut, onMouseLeave, onKeyDown]);
      React.useEffect(() => {
          if (target && !target.getAttribute('aria-describedby') && describeTarget) {
              target.setAttribute('aria-describedby', id);
          }
      }, [describeTarget, target]);
      return (jsxRuntime.jsx(Popover$1, { id: id, ...restProps, show: show, showDelay: showDelay, hideDelay: hideDelay, groupId: 'tooltip', strategy: 'fixed', portal: portal, as: StyledTooltip, role: 'tooltip', target: target, arrow: true, placement: 'bottom', onMouseDown: onMouseDown, hideOnTargetHidden: true, ref: tooltipRef, children: children }, void 0));
  });
  var Tooltip$1 = Tooltip;

  const prefix$1 = (value) => {
      if (['between', 'around', 'evenly'].includes(value))
          return `space-${value}`;
      if (['start', 'end'].includes(value))
          return `flex-${value}`;
      return value;
  };
  const getContainerStyles$1 = (container) => {
      if (!container)
          return '';
      if (container === true) {
          return styled.css `
      display: flex;
    `;
      }
      if (container && typeof container === 'object') {
          const isRow = !container.direction || container.direction.includes('row');
          const isReverse = container.direction && container.direction.includes('reverse');
          return styled.css `
      display: ${container.inline ? 'inline-flex' : 'flex'};

      ${container.pad !== undefined &&
            styled.css `
        /* stylelint-disable function-name-case, function-whitespace-after */
        padding: ${({ theme: { base: { spacing } } }) => (Array.isArray(container.pad) ? container.pad : [container.pad])
                .map(p => `calc(${p} * ${spacing})`)
                .join(' ')};

        /* stylelint-enable function-name-case, function-whitespace-after */
      `}

      ${container.direction &&
            styled.css `
        flex-direction: ${container.direction};
      `}

      ${container.justify &&
            styled.css `
        justify-content: ${prefix$1(container.justify)};
      `}

      ${container.wrap &&
            styled.css `
        flex-wrap: ${container.wrap};
      `}

      ${container.alignItems &&
            styled.css `
        align-items: ${prefix$1(container.alignItems)};
      `}

      ${container.alignContent &&
            styled.css `
        align-content: ${prefix$1(container.alignContent)};
      `}

      ${container.itemGap &&
            styled.css `
          > * {
            margin-${isRow ? 'inline-start' : 'block-start'}: calc(${container.itemGap} * ${props => props.theme.base.spacing});
            ${isReverse ? ':last-child' : ':first-child'} {
              margin-${isRow ? 'inline-start' : 'block-start'}: 0;
            }
          }
        `}

      ${container.gap !== undefined &&
            styled.css `
        gap: calc(${container.gap} * ${props => props.theme.base.spacing});
      `}

      ${container.colGap !== undefined &&
            styled.css `
        column-gap: calc(${container.colGap} * ${props => props.theme.base.spacing});
      `}

      ${container.rowGap !== undefined &&
            styled.css `
        row-gap: calc(${container.rowGap} * ${props => props.theme.base.spacing});
      `}
    `;
      }
  };
  const getItemStyles$1 = (item) => {
      return styled.css `
    ${item &&
        styled.css `
      max-width: 100%;
      min-width: 0;

      ${item.grow !== undefined &&
            styled.css `
        flex-grow: ${item.grow};
      `}

      ${item.shrink !== undefined &&
            styled.css `
        flex-shrink: ${item.shrink};
      `}

      ${item.alignSelf &&
            styled.css `
        align-self: ${prefix$1(item.alignSelf)};
      `}

      ${item.basis &&
            styled.css `
        flex-basis: ${item.basis};
      `}
    `}
  `;
  };
  const breakpointOrder$1 = ['xs', 'sm', 'md', 'lg', 'xl'];
  const StyledFlex = styled__default["default"].div(({ container, item, theme: { base: { breakpoints: themeBreakpoints } }, xs, sm, md, lg, xl }) => {
      const breakpoints = {
          xs,
          sm,
          md,
          lg,
          xl
      };
      return styled.css `
      ${getContainerStyles$1(container)}
      ${getItemStyles$1(item)}

    ${breakpointOrder$1.map(breakpoint => breakpoints[breakpoint] &&
        styled.css `
            @media screen and (min-width: ${themeBreakpoints[breakpoint]}) {
              ${getContainerStyles$1(breakpoints[breakpoint]?.container)}
              ${getItemStyles$1(breakpoints[breakpoint]?.item)}
            }
          `)}
    `;
  });
  StyledFlex.defaultProps = defaultThemeProp;
  const Flex = React.forwardRef((props, ref) => {
      return jsxRuntime.jsx(StyledFlex, { ...props, ref: ref }, void 0);
  });
  var Flex$1 = Flex;

  const transitionSpeedToTheme = {
      slow: 2,
      medium: 1,
      fast: 0.5,
      none: 0
  };
  const StyledBackdrop = styled__default["default"].div(props => {
      const { theme: { base } } = props;
      const { opacity, alpha, variant, position } = props;
      const transitionDuration = `max(calc(${transitionSpeedToTheme[props.transitionSpeed]} * ${base.animation.speed}), 1ms)`;
      return styled.css `
    position: ${position};
    z-index: ${position === 'fixed' ? base['z-index'].backdrop : base['z-index'].popover + 1};
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border-radius: inherit;
    opacity: ${opacity};
    transition-property: opacity;
    transition-timing-function: ${props.theme.base.animation.timing.ease};

    /* stylelint-disable declaration-block-no-duplicate-properties */
    transition-duration: 1ms;
    transition-duration: ${transitionDuration};

    /* stylelint-enable declaration-block-no-duplicate-properties */

    ${variant === 'dark' &&
        styled.css `
      background: rgba(0, 0, 0, ${alpha});
    `}

    ${variant === 'light' &&
        styled.css `
      background: rgba(255, 255, 255, ${alpha});
    `}
  `;
  });
  StyledBackdrop.defaultProps = defaultThemeProp;
  const Backdrop = React.forwardRef((props, ref) => {
      const { children, container, open = false, variant = 'dark', transitionSpeed = 'medium', alpha = 0.6, position = 'fixed', onBeforeTransitionIn, onAfterTransitionIn, onBeforeTransitionOut, onAfterTransitionOut, ...restProps } = props;
      const [state, setState] = React.useState('closed');
      const onTransitionEnd = React.useCallback((e) => {
          if (e.propertyName !== 'opacity' || e.target !== e.currentTarget)
              return;
          let nextState;
          if (state === 'closing') {
              nextState = 'closed';
              onAfterTransitionOut?.();
          }
          else {
              nextState = 'open';
              onAfterTransitionIn?.();
          }
          setState(nextState);
      }, [state, onAfterTransitionOut, onAfterTransitionIn]);
      React.useEffect(() => {
          if (open) {
              if (state === 'closed' || state === 'closing') {
                  onBeforeTransitionIn?.();
                  reflow();
                  setState('opening');
              }
          }
          else if (state === 'open' || state === 'opening') {
              onBeforeTransitionOut?.();
              setState('closing');
          }
      }, [open, onBeforeTransitionIn, onBeforeTransitionOut]);
      return !open && state === 'closed' ? null : (jsxRuntime.jsx(Flex$1, { container: { justify: 'center', alignItems: 'center', ...container }, as: StyledBackdrop, transitionSpeed: transitionSpeed, opacity: state === 'opening' || state === 'open' ? 1 : 0, alpha: alpha, variant: variant, position: position, onTransitionEnd: onTransitionEnd, ref: ref, ...restProps, children: children }, void 0));
  });

  const StyledText = styled__default["default"].span(props => {
      const { variant, status, theme: { base: { 'font-size': fontSize, 'font-scale': fontScale, palette: { 'foreground-color': foregroundColor, urgent: error, warn: warning, success }, transparency: { 'transparent-2': secondaryAlpha } }, components: { text } } } = props;
      let color;
      if (status) {
          color = {
              error,
              warning,
              success
          }[status];
      }
      if (variant === 'secondary') {
          color = tryCatch(() => rgba(color ?? foregroundColor, secondaryAlpha));
      }
      const fontSizes = calculateFontSize(fontSize, fontScale);
      return styled.css `
    font-size: ${fontSizes[text[variant]['font-size']]};
    font-weight: ${text[variant]['font-weight']};
    color: ${color};
  `;
  });
  StyledText.defaultProps = defaultThemeProp;
  const Text = React.forwardRef(({ variant = 'primary', as, ...restProps }, ref) => {
      // If variant is for a heading, and no as is passed, set as to heading tag.
      if (!as && /h\d/i.test(variant))
          as = variant;
      return jsxRuntime.jsx(StyledText, { ref: ref, variant: variant, as: as, ...restProps }, void 0);
  });
  var Text$1 = Text;

  const StyledProgressBar = styled__default["default"].div(({ theme, placement, determinate }) => {
      return styled.css `
      height: 0.375rem;
      background-color: ${theme.base.colors.gray['extra-light']};
      border-radius: ${theme.base['border-radius']};
      min-width: 2rem;
      overflow: hidden;

      @keyframes LoadingBar {
        0% {
          transform: translateX(-100%);
        }

        100% {
          transform: translateX(200%);
        }
      }

      ::before {
        content: '';
        display: block;
        height: 100%;
        width: 100%;
        left: 0;
        border-radius: ${theme.base['border-radius']};
        background-color: ${theme.components.progress['progress-color']};
        ${determinate &&
        styled.css `
          transform: translateX(var(--progress, 0));
          transform-origin: 0 50%;
          transition: transform calc(0.5 * ${theme.base.animation.speed})
            ${theme.base.animation.timing.ease};
        `}

        ${!determinate &&
        styled.css `
          animation: LoadingBar calc(8 * ${theme.base.animation.speed}) linear infinite;
          width: 50%;
        `}
      }

      ${placement === 'inline'
        ? styled.css `
            display: inline-block;
            position: relative;
          `
        : styled.css `
            width: 50%;
          `}
    `;
  });
  StyledProgressBar.defaultProps = defaultThemeProp;
  const Bar = React.forwardRef(({ value, minValue = 0, maxValue = 100, message, placement, style, ...restProps }, ref) => {
      let percentage = value;
      if (typeof value === 'number') {
          if (value > maxValue || minValue > maxValue)
              percentage = 0;
          else if (value < minValue)
              percentage = 100;
          else
              percentage = (1 - (value - minValue) / (maxValue - minValue)) * -100;
      }
      return (jsxRuntime.jsx(StyledProgressBar, { ref: ref, role: 'progressbar', "aria-valuemin": minValue, "aria-valuemax": maxValue, "aria-valuenow": value, placement: placement, determinate: typeof value === 'number', style: { ...style, '--progress': percentage ? `${percentage}%` : '' }, ...restProps }, void 0));
  });
  var Bar$1 = Bar;

  const StyledProgressEllipsis = styled__default["default"].div(({ theme, placement }) => {
      return styled.css `
      line-height: 1;
      display: ${placement === 'inline' ? 'inline-flex' : 'block'};

      @keyframes LoadingEllipsis {
        0% {
          transform: scale(0);
          opacity: 0;
        }

        50% {
          transform: scale(1);
          opacity: 1;
        }

        100% {
          transform: scale(0);
          opacity: 0;
        }
      }

      > span {
        display: flex;
        mix-blend-mode: multiply;

        ${placement === 'inline' &&
        styled.css `
          display: inline-flex;
          margin-left: 0.1875rem;
        `}
      }

      > span span {
        margin: 0 0.3125rem;
        background: ${theme.components.progress['progress-color']};
        border-radius: 50%;
        animation: LoadingEllipsis calc(4 * ${theme.base.animation.speed}) infinite;

        ${placement === 'global' &&
        styled.css `
          width: 1.25rem;
          height: 1.25rem;
        `}

        ${placement === 'local' &&
        styled.css `
          width: 0.625rem;
          height: 0.625rem;
        `}

      ${placement === 'inline' &&
        styled.css `
          width: 0.1875rem;
          height: 0.1875rem;
          margin: 0 0.1875rem;
          animation-duration: calc(4 * ${theme.base.animation.speed});
        `}

      &:nth-child(2) {
          animation-delay: 0.1667s;
        }

        &:nth-child(3) {
          animation-delay: ${0.1667 * 2}s;
        }
      }
    `;
  });
  StyledProgressEllipsis.defaultProps = defaultThemeProp;
  const Ellipsis = React.forwardRef(({ message, placement, ...restProps }, ref) => {
      return (jsxRuntime.jsx(StyledProgressEllipsis, { ref: ref, role: 'progressbar', placement: placement, ...restProps, children: jsxRuntime.jsxs("span", { children: [jsxRuntime.jsx("span", {}, void 0), jsxRuntime.jsx("span", {}, void 0), jsxRuntime.jsx("span", {}, void 0)] }, void 0) }, void 0));
  });
  var Ellipsis$1 = Ellipsis;

  const StyledProgressRing = styled__default["default"].div(({ theme, placement, determinate }) => {
      return styled.css `
    position: relative;
    min-width: 1em;
    min-height: 1em;

    @keyframes LoadingRing {
      0% {
        transform: rotate(0deg);
      }

      100% {
        transform: rotate(360deg);
      }
    }

    svg {
      display: block;
      position: absolute;
      height: 100%;

      circle {
        fill: transparent;
        stroke: ${theme.base.colors.gray['extra-light']};
        stroke-width: 2;
        r: 45%;
        cx: 50%;
        cy: 50%;
        transform: rotate(-90deg);
        transform-origin: 50% 50%;

        &:nth-child(2) {
          stroke: ${theme.components.progress['progress-color']};
          transition: stroke-dashoffset calc(0.5 * ${theme.base.animation.speed})
            ${theme.base.animation.timing.ease};

          ${!determinate &&
        styled.css `
            animation: LoadingRing calc(4 * ${theme.base.animation.speed}) linear infinite;
          `}
        }
      }
    }

    ${placement === 'inline'
        ? styled.css `
          display: inline-flex;
          vertical-align: top;
        `
        : styled.css `
          width: ${placement === 'global' ? '4' : '2'}rem;
          height: ${placement === 'global' ? '4' : '2'}rem;
        `}
  `;
  });
  StyledProgressRing.defaultProps = defaultThemeProp;
  const Ring = React.forwardRef(({ value, minValue = 0, maxValue = 100, placement, ...restProps }, ref) => {
      let strokeDashoffset;
      const circumference = 18 * Math.PI;
      if (typeof value !== 'number')
          strokeDashoffset = (1 - 33 / 100) * circumference;
      else if (value > maxValue || minValue > maxValue)
          strokeDashoffset = 0;
      else if (value < minValue)
          strokeDashoffset = circumference;
      else
          strokeDashoffset = (1 - (value - minValue) / (maxValue - minValue)) * circumference;
      return (jsxRuntime.jsx(StyledProgressRing, { ref: ref, role: 'progressbar', "aria-valuemin": minValue, "aria-valuemax": maxValue, "aria-valuenow": value, placement: placement, determinate: typeof value === 'number', ...restProps, children: jsxRuntime.jsxs("svg", { viewBox: '0 0 20 20', children: [jsxRuntime.jsx("circle", {}, void 0), jsxRuntime.jsx("circle", { strokeDasharray: circumference, style: { strokeDashoffset } }, void 0)] }, void 0) }, void 0));
  });

  const StyledMessage = styled__default["default"].span(({ theme }) => {
      const color = tryCatch(() => {
          return rgba(readableColor(theme.base.palette['primary-background']), theme.base.transparency['transparent-3']);
      });
      const fontSize = calculateFontSize(theme.base['font-size'], theme.base['font-scale']);
      return styled.css `
    margin-top: 0.5rem;
    font-size: ${fontSize[theme.components.label['font-size']]};
    font-weight: ${theme.base['font-weight']['semi-bold']};
    color: ${color};
  `;
  });
  const Progress = React.forwardRef(({ variant = 'ring', placement = 'global', visible = true, onTransitionEndIn, onTransitionEndOut, value, message, ...restProps }, ref) => {
      const [isVisible, setIsVisible] = React.useState(visible);
      const [isNull, setIsNull] = React.useState(!visible);
      const { portalTarget } = useConfiguration$1();
      const showTime = React.useRef();
      const showTimeout = React.useRef();
      const hideTimeout = React.useRef();
      let Comp = Ring;
      if (variant === 'bar')
          Comp = Bar$1;
      else if (variant === 'ellipsis')
          Comp = Ellipsis$1;
      const onBackdropTransitionEnd = () => {
          setIsNull(true);
          onTransitionEndOut?.();
      };
      React.useEffect(() => {
          if (visible) {
              clearTimeout(hideTimeout.current);
              showTime.current = Date.now();
              showTimeout.current = window.setTimeout(() => {
                  setIsVisible(true);
                  setIsNull(false);
              }, 100);
          }
          else {
              clearTimeout(showTimeout.current);
              if (typeof showTime.current === 'number') {
                  const minimumDuration = 1000;
                  const timeElapsed = Date.now() - showTime.current;
                  if (timeElapsed > minimumDuration)
                      setIsVisible(false);
                  else {
                      hideTimeout.current = window.setTimeout(() => {
                          setIsVisible(false);
                      }, minimumDuration - timeElapsed);
                  }
              }
              else
                  setIsVisible(false);
          }
      }, [visible]);
      React.useEffect(() => {
          return () => {
              clearTimeout(showTimeout.current);
              clearTimeout(hideTimeout.current);
          };
      }, []);
      if (isNull)
          return null;
      const comp = (jsxRuntime.jsx(Comp, { ...restProps, placement: placement, value: value, "aria-valuetext": message && typeof value === 'number' ? `${message} - ${value}` : message, ref: ref }, void 0));
      const content = placement === 'inline' ? (comp) : (jsxRuntime.jsxs(Backdrop, { open: isVisible, container: { direction: 'column' }, position: placement === 'global' ? 'fixed' : 'absolute', variant: 'light', alpha: 0.5, onAfterTransitionIn: onTransitionEndIn, onAfterTransitionOut: onBackdropTransitionEnd, children: [comp, !!message && (jsxRuntime.jsx(Text$1, { as: StyledMessage, variant: 'secondary', "aria-hidden": 'true', children: message }, void 0))] }, void 0));
      return placement === 'global' && portalTarget ? reactDom.createPortal(content, portalTarget) : content;
  });
  var Progress$1 = Progress;

  const iconRegistry = new Map();
  const registerIcon = (...icons) => {
      icons.forEach(({ name, ...iconDef }) => {
          if (!iconRegistry.has(name))
              iconRegistry.set(name, iconDef);
      });
  };
  const StyledIcon = styled__default["default"].svg `
  display: inline-block;
  fill: currentColor;
  height: 1.125rem;
  width: 1.125rem;
  vertical-align: middle;
`;
  const emptyIconDefinition = Object.freeze({ Component: () => null });
  const Icon = React.forwardRef(({ name, ...restProps }, ref) => {
      const [iconDef, setIconDef] = React.useState(iconRegistry.get(name) ?? emptyIconDefinition);
      React.useEffect(() => {
          if (iconRegistry.has(name)) {
              setIconDef(iconRegistry.get(name));
              return;
          }
          const controller = new AbortController();
          import(`./icons/${encodeURIComponent(name)}.icon`)
              .then((module) => {
              if (!module.name || !module.Component)
                  throw new Error('Malformed icon definition');
              registerIcon(module);
              if (!controller.signal.aborted)
                  setIconDef(iconRegistry.get(module.name) ?? emptyIconDefinition);
          })
              .catch(() => {
              if (!controller.signal.aborted)
                  setIconDef(emptyIconDefinition);
          });
          return () => {
              controller.abort();
          };
      }, [name]);
      return (jsxRuntime.jsx(StyledIcon, { ...restProps, role: 'img', ref: ref, xmlns: 'http://www.w3.org/2000/svg', viewBox: iconDef.viewBox, children: jsxRuntime.jsx(iconDef.Component, {}, void 0) }, void 0));
  });
  var Icon$1 = Icon;

  const StyledButton = styled__default["default"].button.withConfig(omitProps('loading'))(({ variant, icon, loading, compact, theme: { base: { spacing, 'border-radius': baseBorderRadius, palette: { 'primary-background': backgroundColor, 'foreground-color': textColor }, 'hit-area': { 'mouse-min': hitAreaMouse, 'finger-min': hitAreaFinger, 'compact-min': hitAreaCompact }, animation: { speed, timing: { ease } }, 'disabled-opacity': disabledOpacity }, components: { button: { color, 'secondary-color': secondaryColor, padding, 'border-radius': borderRadius, 'border-width': borderWidth, 'focus-shadow': focusShadow, touch: { padding: touchPadding } }, link: { color: linkColor } } } }) => {
      const borderColor = variant === 'secondary' ? color : 'transparent';
      const contrastColor = tryCatch(() => readableColor(color));
      const hoverColors = getHoverColors(color);
      const hoverPrimaryColor = hoverColors.background;
      const hoverContrastColor = hoverColors.foreground;
      const secondaryHoverColor = tryCatch(() => mix$1(0.85, secondaryColor, color));
      let buttonColor = contrastColor;
      let buttonBackgroundColor = color;
      if (variant === 'secondary') {
          buttonColor = color;
          buttonBackgroundColor = secondaryColor;
      }
      else if (variant === 'simple') {
          if (icon) {
              buttonColor = 'currentColor';
              buttonBackgroundColor = 'transparent';
          }
          else {
              buttonColor = color;
              buttonBackgroundColor = backgroundColor;
          }
      }
      else if (variant === 'link') {
          buttonColor = linkColor;
          buttonBackgroundColor = 'transparent';
      }
      else if (variant === 'text') {
          buttonColor = textColor;
          buttonBackgroundColor = 'transparent';
      }
      return styled.css `
      color: ${buttonColor};
      background-color: ${buttonBackgroundColor};
      display: ${variant === 'link' || variant === 'text' ? 'inline' : 'inline-flex'};
      align-items: center;
      outline: none;
      text-decoration: none;
      transition: all calc(0.5 * ${speed}) ${ease};
      cursor: pointer;

      ${variant !== 'link' && variant !== 'text'
        ? styled.css `
            justify-content: center;
            line-height: 1;
            border: ${borderWidth} solid ${borderColor};
            position: relative;
          `
        : styled.css `
            text-align: start;
            border: none;

            > ${StyledIcon} {
              vertical-align: bottom;
            }
          `}

      & + & {
        margin-inline-start: ${spacing};
      }

      /* Not able to combine with selector above. Stylis bug? */
      & + ${StyledPopover} + & {
        margin-inline-start: ${spacing};
      }

      @media (hover: hover) {
        &:hover {
          ${variant === 'primary' &&
        styled.css `
            background-color: ${hoverPrimaryColor};
            color: ${hoverContrastColor};
            text-decoration: none;
          `}

          ${(variant === 'secondary' || (variant === 'simple' && !icon)) &&
        styled.css `
            background-color: ${secondaryHoverColor};
            text-decoration: none;
          `}

          ${variant === 'simple' &&
        icon &&
        styled.css `
            ::before {
              content: '';
              position: absolute;
              top: calc(${borderWidth} * -1);
              bottom: calc(${borderWidth} * -1);
              left: calc(${borderWidth} * -1);
              right: calc(${borderWidth} * -1);
              border-radius: inherit;
              background-color: currentColor;
              opacity: 0.15;
            }
          `}

          ${(variant === 'link' || variant === 'text') &&
        styled.css `
            text-decoration: underline;
          `}
        }
      }

      ${variant !== 'link' &&
        variant !== 'text' &&
        styled.css `
        min-height: ${hitAreaMouse};
        min-width: ${hitAreaMouse};
        border-radius: calc(${baseBorderRadius} * ${borderRadius});
        -webkit-user-select: none;
        user-select: none;
      `}

      ${compact &&
        styled.css `
        min-height: ${hitAreaCompact};
        min-width: ${hitAreaCompact};
      `}

      ${!icon &&
        variant !== 'link' &&
        variant !== 'text' &&
        styled.css `
        padding: ${padding};
      `}

      ${variant !== 'link' &&
        variant !== 'text' &&
        styled.css `
        @media (pointer: coarse) {
          ${!compact &&
            styled.css `
            min-height: ${hitAreaFinger};
            min-width: ${hitAreaFinger};
          `}
          border-radius: calc(${baseBorderRadius} * ${borderRadius});
          ${!icon &&
            styled.css `
            padding: ${touchPadding};
          `}
        }
      `}

      &:disabled,
      &[disabled] {
        opacity: ${disabledOpacity};
        cursor: not-allowed;
        pointer-events: none;
      }

      &:enabled:focus,
      &:not([disabled]):focus {
        box-shadow: ${focusShadow};
      }

      ${icon &&
        variant !== 'link' &&
        variant !== 'text' &&
        styled.css `
        border-radius: calc(${baseBorderRadius} * ${borderRadius});
        > svg {
          display: block;
        }
      `}

      ${loading &&
        styled.css `
        ${StyledBackdrop} {
          background-color: ${buttonBackgroundColor};
          border-radius: inherit;
        }
        ${StyledProgressRing} {
          width: 1em;
          height: 1em;
          circle:nth-child(2) {
            animation-duration: calc(${speed} * 2);
          }
        }
      `}
    `;
  });
  StyledButton.defaultProps = defaultThemeProp;
  const Button = React.forwardRef(({ variant = 'secondary', type = 'button', disabled = false, icon = false, compact = false, href, as, forwardedAs, label, 'aria-label': ariaLabel, loading = false, children, ...restProps }, ref) => {
      const [buttonEl, setButtonEl] = useElement$1();
      const mouseDownEvent = React.useRef();
      const buttonRef = useConsolidatedRef$1(ref, setButtonEl);
      const showProgress = loading && variant !== 'link' && variant !== 'text';
      React.useEffect(() => {
          return () => {
              mouseDownEvent.current = undefined;
          };
      }, []);
      return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsxs(StyledButton, { ...restProps, ref: buttonRef, as: as || (href ? 'a' : 'button'), forwardedAs: forwardedAs || (href ? 'a' : 'button'), variant: variant, icon: icon, compact: compact, type: href ? undefined : type, href: href, disabled: disabled && !href, loading: showProgress, "aria-label": ariaLabel || label, onMouseDown: (e) => {
                      restProps.onMouseDown?.(e);
                      e.persist();
                      mouseDownEvent.current = e;
                  }, onMouseUp: (e) => {
                      const shouldFocus = mouseDownEvent.current && !mouseDownEvent.current.defaultPrevented;
                      mouseDownEvent.current = undefined;
                      if (shouldFocus && buttonRef.current !== document.activeElement) {
                          buttonRef.current?.focus();
                      }
                      return restProps.onMouseUp?.(e);
                  }, children: [showProgress && jsxRuntime.jsx(Progress$1, { variant: 'ring', placement: 'local' }, void 0), children] }, void 0), buttonEl && label && (jsxRuntime.jsx(Tooltip$1, { target: buttonEl, showDelay: 'none', hideDelay: 'none', describeTarget: false, children: label }, void 0))] }, void 0));
  });
  var Button$1 = Button;

  const StyledVisuallyHiddenText = styled__default["default"].span `
  ${hideVisually}
`;
  const VisuallyHiddenText = React.forwardRef((props, ref) => (jsxRuntime.jsx(StyledVisuallyHiddenText, { ...props, ref: ref }, void 0)));
  var VisuallyHiddenText$1 = VisuallyHiddenText;

  // This file is autogenerated. Any changes will be overwritten.
  const name$F = 'galaxy';
  const Component$F = () => (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx("path", { d: 'm4.80000105 11.8c.6627417 0 1.2.5372583 1.2 1.2s-.5372583 1.2-1.2 1.2-1.2-.5372583-1.2-1.2c.04774248-.6419276.55807244-1.1522575 1.2-1.2m0-1.6c-1.5463973 0-2.80000053 1.2536027-2.80000053 2.8-.00092921 1.5633724 1.2375576 2.8460909 2.80000053 2.9.76912782 0 1.50675416-.3055348 2.05060966-.8493903s.84939091-1.2814819.84939091-2.0506097c.00048445-.7602615-.30820203-1.4880368-.85513537-2.0161104-.54693333-.5280736-1.28508859-.811042-2.0448652-.7838896z' }, void 0), jsxRuntime.jsx("path", { d: 'm17.66 3.3-1.16 3.2-3.3 1.16c-.2204773.08758911-.2640869.56244263 0 .67l3.300001 1.17 1.159999 3.3c.1.3.5430182.3.67 0l1.17-3.3c1.9814718-.70080811 3.0814718-1.09080811 3.3-1.17.3277924-.11878784.2046539-.59780701 0-.67-.136436-.04812866-1.236436-.43479533-3.3-1.16l-1.17-3.2c-.1871928-.41454773-.5224791-.37723999-.67 0z' }, void 0), jsxRuntime.jsx("circle", { cx: '15.5', cy: '20.5', r: '1.5' }, void 0)] }, void 0));
  const viewBox$F = '0 0 25 25';

  var galaxyIcon = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$F,
    Component: Component$F,
    viewBox: viewBox$F
  });

  registerIcon(galaxyIcon);
  const StyledEmptyState = styled__default["default"].div(({ theme }) => {
      const color = tryCatch(() => rgba(theme.base.palette['foreground-color'], theme.base.transparency['transparent-2']));
      return styled.css `
    height: 100%;

    ${StyledIcon} {
      font-size: 1.5rem;
      height: 1.5rem;
      width: 1.5rem;
      color: ${color};
    }
  `;
  });
  StyledEmptyState.defaultProps = defaultThemeProp;
  const EmptyState = React.forwardRef((props, ref) => {
      const t = useI18n$1();
      const { message = t('no_items'), ...restProps } = props;
      return (jsxRuntime.jsxs(Flex$1, { ...restProps, as: StyledEmptyState, ref: ref, container: { direction: 'column', alignItems: 'center', justify: 'center', gap: 1 }, children: [jsxRuntime.jsx(Icon$1, { name: 'galaxy' }, void 0), jsxRuntime.jsx(Text$1, { variant: 'secondary', children: message }, void 0)] }, void 0));
  });
  var EmptyState$1 = EmptyState;

  var MenuContext = React.createContext({
      mode: 'action',
      variant: 'drill-down',
      scrollAt: 7,
      loading: false,
      componentId: createUID(),
      pushFlyoutId: () => null,
      flyOutActiveIdStack: [],
      focusControl: null,
      updateActiveDescendants: () => null,
      setFocusDescendant: () => null,
      setFocusReturnEl: () => null,
      getScopedItemId: () => ''
  });

  const StyledMetaList = styled__default["default"].ul(({ wrapItems }) => {
      return styled.css `
    list-style: none;
    overflow: hidden;

    ${!wrapItems &&
        styled.css `
      white-space: nowrap;
    `}
  `;
  });
  const StyledMetaListItem = styled__default["default"].li(({ wrapItems }) => {
      return styled.css `
    min-width: 0;
    display: inline-block;

    ${wrapItems &&
        styled.css `
      overflow-wrap: break-word;
    `}

    ${!wrapItems &&
        styled.css `
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    `}
  `;
  });
  const MetaList = React.forwardRef((props, ref) => {
      const { items, wrapItems = true, ...restProps } = props;
      return (jsxRuntime.jsx(Flex$1, { as: StyledMetaList, container: { colGap: 0.5, alignItems: 'center', wrap: wrapItems ? 'wrap' : 'nowrap' }, wrapItems: wrapItems, ref: ref, ...restProps, children: items.flatMap((item, i, arr) => item
              ? [
                  jsxRuntime.jsx(Text$1, { as: StyledMetaListItem, variant: 'secondary', wrapItems: wrapItems, children: item }, `${i + 0}`)
              ].concat(i !== arr.length - 1
                  ? [
                      jsxRuntime.jsx(Text$1, { as: StyledMetaListItem, role: 'separator', variant: 'secondary', children: "\u2022" }, `${i + 0}-sep`)
                  ]
                  : [])
              : []) }, void 0));
  });
  var MetaList$1 = MetaList;

  const prefix = (value) => {
      if (['between', 'around', 'evenly'].includes(value))
          return `space-${value}`;
      return value;
  };
  const getContainerStyles = (gridProps) => {
      if (!gridProps)
          return;
      if (gridProps === true) {
          return styled.css `
      display: grid;
    `;
      }
      const { inline, pad, cols, autoCols, rows, autoRows, autoFlow, areas, template, colGap, rowGap, gap, justifyItems, justifyContent, alignItems, alignContent } = gridProps;
      return styled.css `
    display: ${inline ? 'inline-grid' : 'grid'};

    ${pad !== undefined &&
        styled.css `
      /* stylelint-disable function-name-case, function-whitespace-after */
      padding: ${({ theme: { base: { spacing } } }) => (Array.isArray(pad) ? pad : [pad]).map(p => `calc(${p} * ${spacing})`).join(' ')};

      /* stylelint-enable function-name-case, function-whitespace-after */
    `}

    ${cols &&
        styled.css `
      grid-template-columns: ${cols};
    `}

    ${autoCols &&
        styled.css `
      grid-auto-columns: ${autoCols};
    `}

    ${rows &&
        styled.css `
      grid-template-rows: ${rows};
    `}

    ${autoRows &&
        styled.css `
      grid-auto-rows: ${autoRows};
    `}

    ${autoFlow &&
        styled.css `
      grid-auto-flow: ${autoFlow};
    `}

    ${areas &&
        styled.css `
      grid-template-areas: ${areas};
    `}

    ${template &&
        styled.css `
      grid-template: ${template};
    `}

    ${gap !== undefined &&
        styled.css `
      gap: calc(${gap} * ${props => props.theme.base.spacing});
    `}

    ${colGap !== undefined &&
        styled.css `
      column-gap: calc(${colGap} * ${props => props.theme.base.spacing});
    `}

    ${rowGap !== undefined &&
        styled.css `
      row-gap: calc(${rowGap} * ${props => props.theme.base.spacing});
    `}

    ${justifyItems &&
        styled.css `
      justify-items: ${justifyItems};
    `}

    ${justifyContent &&
        styled.css `
      justify-content: ${prefix(justifyContent)};
    `}

    ${alignItems &&
        styled.css `
      align-items: ${alignItems};
    `}

    ${alignContent &&
        styled.css `
      align-content: ${prefix(alignContent)};
    `}
  `;
  };
  const getItemStyles = (props) => {
      if (!props)
          return;
      const { colStart, colEnd, colStartEnd, rowStart, rowEnd, rowStartEnd, area, justifySelf, alignSelf } = props;
      return styled.css `
    ${colStart &&
        styled.css `
      grid-column-start: ${colStart};
    `}

    ${colEnd &&
        styled.css `
      grid-column-end: ${colEnd};
    `}

    ${colStartEnd &&
        styled.css `
      grid-column: ${colStartEnd};
    `}

    ${rowStart &&
        styled.css `
      grid-row-start: ${rowStart};
    `}

    ${rowEnd &&
        styled.css `
      grid-row-end: ${rowEnd};
    `}

    ${rowStartEnd &&
        styled.css `
      grid-row: ${rowStartEnd};
    `}

    ${area &&
        styled.css `
      grid-area: ${area};
    `}

    ${justifySelf &&
        styled.css `
      justify-self: ${justifySelf};
    `}

    ${alignSelf &&
        styled.css `
      align-self: ${alignSelf};
    `}
  `;
  };
  const breakpointOrder = ['xs', 'sm', 'md', 'lg', 'xl'];
  const StyledGrid = styled__default["default"].div(({ container, item, theme: { base: { breakpoints: themeBreakpoints } }, xs, sm, md, lg, xl }) => {
      const breakpoints = {
          xs,
          sm,
          md,
          lg,
          xl
      };
      return styled.css `
      ${getContainerStyles(container)}
      ${getItemStyles(item)}

    ${breakpointOrder.map(breakpoint => breakpoints[breakpoint] &&
        styled.css `
            @media screen and (min-width: ${themeBreakpoints[breakpoint]}) {
              ${getContainerStyles(breakpoints[breakpoint]?.container)}
              ${getItemStyles(breakpoints[breakpoint]?.item)}
            }
          `)}
    `;
  });
  StyledGrid.defaultProps = defaultThemeProp;
  const Grid = React.forwardRef((props, ref) => {
      return jsxRuntime.jsx(StyledGrid, { ...props, ref: ref }, void 0);
  });

  const StyledVisual = styled__default["default"].div `
  > ${StyledProgressRing}, img {
    display: block;
    object-fit: cover;
    width: 2rem;
    height: 2rem;
  }
`;
  StyledVisual.defaultProps = defaultThemeProp;
  const StyledPrimary = styled__default["default"](Grid)(({ theme, isString, overflowStrategy }) => {
      return styled.css `
    ${overflowStrategy === 'ellipsis'
        ? styled.css `
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        `
        : styled.css `
          word-break: break-word;
        `}

    ${isString &&
        styled.css `
      font-weight: ${theme.base['font-weight']['semi-bold']};
    `}
  `;
  });
  StyledPrimary.defaultProps = defaultThemeProp;
  const StyledSecondary = styled__default["default"](Grid)(({ overflowStrategy }) => {
      return styled.css `
    ${overflowStrategy === 'ellipsis'
        ? styled.css `
          overflow: hidden;
          text-overflow: ellipsis;
        `
        : styled.css `
          word-break: break-word;
        `}
  `;
  });
  const StyledSummaryItemActions = styled__default["default"].div `
  white-space: nowrap;
`;
  const StyledSummaryItem = styled__default["default"].div ``;
  const getColumns = ({ visual, actions }) => {
      return `${visual ? 'auto ' : ''}minmax(0, 1fr)${actions ? ' auto' : ''}`;
  };
  const getAreas = ({ secondary, visual, actions }) => {
      return `"${visual ? 'visual ' : ''}primary${actions ? ' actions' : ''}"${secondary ? `\n"${visual ? 'visual ' : ''}secondary${actions ? ' actions' : ''}"` : ''}`;
  };
  const SummaryItem = React.forwardRef(({ visual, primary, secondary, actions, container, overflowStrategy = 'wrap', as, ...restProps }, ref) => {
      return (jsxRuntime.jsxs(Grid, { ...restProps, ref: ref, container: {
              cols: getColumns({ visual, actions }),
              colGap: 2,
              areas: getAreas({ secondary, visual, actions }),
              ...container
          }, as: StyledSummaryItem, forwardedAs: as, children: [visual && (jsxRuntime.jsx(Grid, { as: StyledVisual, item: { area: 'visual', alignSelf: 'center' }, children: visual }, void 0)), jsxRuntime.jsx(StyledPrimary, { item: { area: 'primary', alignSelf: secondary ? 'end' : 'center' }, isString: typeof primary === 'string', overflowStrategy: overflowStrategy, children: primary }, void 0), secondary && (jsxRuntime.jsx(StyledSecondary, { item: { area: 'secondary', alignSelf: 'start' }, overflowStrategy: overflowStrategy, children: secondary }, void 0)), actions && (jsxRuntime.jsx(Grid, { as: StyledSummaryItemActions, item: { area: 'actions', alignSelf: 'center' }, children: actions }, void 0))] }, void 0));
  });
  var SummaryItem$1 = SummaryItem;

  // This file is autogenerated. Any changes will be overwritten.
  const name$E = 'caret-left';
  const Component$E = () => (jsxRuntime.jsx("path", { d: 'M8.23984375,11.1476563 C8.23984375,11.1476563 15.0882812,2.2875 15.0882812,2.2875 C15.0882812,2.2875 15.2320312,2.14375 15.2320312,2.14375 C15.4234375,2.04765625 15.6148437,2 15.8070312,2 C15.8070312,2 15.8070312,2 15.8070312,2 C16.4773437,2 16.8125,2.33515625 16.8125,2.9578125 C16.8125,2.9578125 16.8125,2.9578125 16.8125,2.9578125 C16.8125,3.1015625 16.7164062,3.29296875 16.5734375,3.628125 C16.5734375,3.628125 16.5734375,3.628125 16.5734375,3.628125 C16.5734375,3.628125 10.5867187,11.8179688 10.5867187,11.8179688 C10.5867187,11.8179688 16.6210937,20.103125 16.6210937,20.103125 C16.7648437,20.3421875 16.8125,20.534375 16.8125,20.678125 C16.8125,20.678125 16.8125,20.678125 16.8125,20.678125 C16.8125,21.3007812 16.4773437,21.6359375 15.8070312,21.6359375 C15.8070312,21.6359375 15.8070312,21.6359375 15.8070312,21.6359375 C15.615625,21.6359375 15.4242188,21.5882813 15.2320312,21.4921875 C15.2320312,21.4921875 15.2320312,21.4921875 15.2320312,21.4921875 C15.2320312,21.4921875 15.0882812,21.3484375 15.0882812,21.3484375 C15.0882812,21.3484375 8.2875,12.4882812 8.2875,12.4882812 C8.09609375,12.296875 8,12.0570312 8,11.8179687 C8,11.8179687 8,11.8179687 8,11.8179687 C8,11.5789062 8.09609375,11.3867187 8.2390625,11.1476562 C8.2390625,11.1476562 8.2390625,11.1476562 8.2390625,11.1476562 L8.23984375,11.1476563 Z' }, void 0));
  const viewBox$E = '0 0 25 25';

  var caretLeft = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$E,
    Component: Component$E,
    viewBox: viewBox$E
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$D = 'caret-right';
  const Component$D = () => (jsxRuntime.jsx("path", { d: 'M16.5726562,12.4882812 C16.5726562,12.4882812 9.72421875,21.3484375 9.72421875,21.3484375 C9.72421875,21.3484375 9.58046875,21.4921875 9.58046875,21.4921875 C9.3890625,21.5882813 9.19765625,21.6359375 9.00546875,21.6359375 C9.00546875,21.6359375 9.00546875,21.6359375 9.00546875,21.6359375 C8.33515625,21.6359375 8,21.3007813 8,20.678125 C8,20.678125 8,20.678125 8,20.678125 C8,20.534375 8.09609375,20.3429688 8.2390625,20.0078125 C8.2390625,20.0078125 8.2390625,20.0078125 8.2390625,20.0078125 C8.2390625,20.0078125 14.2257813,11.8179688 14.2257813,11.8179688 C14.2257813,11.8179688 8.19140625,3.5328125 8.19140625,3.5328125 C8.04765625,3.29375 8,3.1015625 8,2.9578125 C8,2.9578125 8,2.9578125 8,2.9578125 C8,2.33515625 8.33515625,2 9.00546875,2 C9.00546875,2 9.00546875,2 9.00546875,2 C9.196875,2 9.38828125,2.04765625 9.58046875,2.14375 C9.58046875,2.14375 9.58046875,2.14375 9.58046875,2.14375 C9.58046875,2.14375 9.72421875,2.2875 9.72421875,2.2875 C9.72421875,2.2875 16.525,11.1476563 16.525,11.1476563 C16.7164063,11.3390625 16.8125,11.5789062 16.8125,11.8179688 C16.8125,11.8179688 16.8125,11.8179688 16.8125,11.8179688 C16.8125,12.0578125 16.7164062,12.2492188 16.5734375,12.4882812 C16.5734375,12.4882812 16.5734375,12.4882812 16.5734375,12.4882812 L16.5726562,12.4882812 Z' }, void 0));
  const viewBox$D = '0 0 25 25';

  var caretRight = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$D,
    Component: Component$D,
    viewBox: viewBox$D
  });

  const StyledBareButton = styled__default["default"].button `
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  user-select: none;

  & + & {
    margin-inline-start: ${props => props.theme.base.spacing};
  }
`;
  StyledBareButton.defaultProps = defaultThemeProp;
  const BareButton = React.forwardRef(({ type = 'button', disabled = false, href, ...restProps }, ref) => {
      const mouseDownEvent = React.useRef();
      const buttonRef = useConsolidatedRef$1(ref);
      React.useEffect(() => {
          return () => {
              mouseDownEvent.current = undefined;
          };
      }, []);
      return (jsxRuntime.jsx(StyledBareButton, { ref: buttonRef, as: href ? 'a' : undefined, type: href ? undefined : type, disabled: disabled, ...restProps, href: href, onMouseDown: (e) => {
              restProps.onMouseDown?.(e);
              e.persist();
              mouseDownEvent.current = e;
          }, onMouseUp: (e) => {
              const shouldFocus = mouseDownEvent.current && !mouseDownEvent.current.defaultPrevented;
              mouseDownEvent.current = undefined;
              if (shouldFocus && buttonRef.current !== document.activeElement) {
                  buttonRef.current?.focus();
              }
              return restProps.onMouseUp?.(e);
          } }, void 0));
  });
  var BareButton$1 = BareButton;

  // This file is autogenerated. Any changes will be overwritten.
  const name$C = 'times';
  const Component$C = () => (jsxRuntime.jsx("path", { d: 'M20.3375,3 C20.3375,3 21.7742187,4.43671875 21.7742187,4.43671875 C21.7742187,4.43671875 4.43671875,21.4867188 4.43671875,21.4867188 C4.43671875,21.4867188 3,20.19375 3,20.19375 C3,20.19375 20.3375,3 20.3375,3 Z M21.7265625,20.0976563 C21.7265625,20.0976563 20.3859375,21.534375 20.3859375,21.534375 C20.3859375,21.534375 3.00078125,4.3890625 3.00078125,4.3890625 C3.00078125,4.3890625 4.38984375,3 4.38984375,3 C4.38984375,3 21.7273438,20.0976563 21.7273438,20.0976563 L21.7265625,20.0976563 Z' }, void 0));
  const viewBox$C = '0 0 25 25';

  var times = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$C,
    Component: Component$C,
    viewBox: viewBox$C
  });

  registerIcon(times);
  const StyledSelectable = styled__default["default"].div(props => {
      const { foreground, background } = props.theme.components.badges.selectable.base;
      const { dark } = props.theme.base.palette;
      const borderRadius = props.theme.base['border-radius'];
      const { spacing } = props.theme.base;
      const displayBackground = tryCatch(() => mix$1(0.15, background, '#ffffff'));
      const hoverBorder = tryCatch(() => mix$1(0.3, background, '#ffffff'));
      const boxShadowColor = tryCatch(() => curriedTransparentize$1(0.45, dark));
      const height = 1.125;
      return styled.css `
    background: ${displayBackground};
    border: 0 solid transparent;
    border-radius: calc(${height} * ${borderRadius});
    color: ${foreground};
    cursor: default;
    display: inline-flex;
    align-items: center;
    font-size: 0.75rem;
    height: ${height}rem;
    padding: 0 ${spacing};
    min-width: max-content;
    line-height: 1;

    &:hover {
      color: ${props.theme.base.palette.interactive};
      box-shadow: inset 0 0 0 0.0625rem ${hoverBorder};

      ${StyledBareButton} {
        color: ${props.theme.base.palette.interactive};
      }
    }

    &:active {
      box-shadow: inset 0 0 0 0.0625rem ${background};
    }

    &:focus {
      color: ${props.theme.base.palette.interactive};
      box-shadow: 0 0 0.5rem -0.125rem ${boxShadowColor}, inset 0 0 0 0.125rem ${background};
      outline: none;

      ${StyledBareButton} {
        color: ${props.theme.base.palette.interactive};
      }
    }

    ${StyledIcon} {
      margin-inline-start: ${spacing};
      height: 1em;
      width: 1em;
    }
  `;
  });
  const Selectable = React.forwardRef((props, ref) => {
      const consolidatedRef = useConsolidatedRef$1(ref);
      const { id, onSelect, onRemove, children, onClick, onKeyUp, ...restProps } = props;
      const handleClick = (e) => {
          onClick?.(e);
          onSelect?.(id);
      };
      const handleCloseClick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove?.(id);
      };
      const handleKeyUp = (e) => {
          onKeyUp?.(e);
          if (e.key === 'Enter') {
              onSelect?.(id);
          }
          if (e.key === 'Backspace' || e.key === 'Delete') {
              onRemove?.(id);
          }
      };
      return (jsxRuntime.jsxs(BareButton$1, { role: 'button', tabIndex: '0', as: StyledSelectable, ref: consolidatedRef, onClick: handleClick, onKeyUp: handleKeyUp, ...restProps, children: [children, jsxRuntime.jsx(BareButton$1, { tabIndex: '-1', onClick: handleCloseClick, children: jsxRuntime.jsx(Icon$1, { name: 'times' }, void 0) }, void 0)] }, void 0));
  });
  var Selectable$1 = Selectable;

  const StyledCount = styled__default["default"].span(props => {
      const { foreground, background } = props.variant === 'default'
          ? props.theme.components.badges.count.base
          : props.theme.components.badges.count[props.variant];
      const invertedBackground = tryCatch(() => curriedTransparentize$1(0.5, mix$1(0.2, background, '#ffffff')));
      const displayBackground = props.variant === 'inverted' ? invertedBackground : background;
      const borderRadius = props.theme.base['border-radius'];
      const { spacing } = props.theme.base;
      const fontSize = calculateFontSize(props.theme.base['font-size'], props.theme.base['font-scale']);
      return styled.css `
    background: ${displayBackground};
    border-radius: calc(1.125 * ${borderRadius});
    color: ${foreground};
    display: inline-block;
    font-size: ${fontSize.xxs};
    font-weight: bold;
    line-height: normal;
    text-align: center;
    ${props.children.length > 1 &&
        styled.css `
      padding: 0 ${spacing};
    `}
    ${props.children.length === 1 &&
        styled.css `
      width: 1.125rem;
    `}
  `;
  });
  StyledCount.defaultProps = defaultThemeProp;
  const Count = React.forwardRef((props, ref) => {
      const { variant = 'default', children, ...restProps } = props;
      return Number.isInteger(children) ? (jsxRuntime.jsx(StyledCount, { variant: variant, ...restProps, ref: ref, children: children > 99 ? '99+' : `${children}` }, void 0)) : null;
  });
  var Count$1 = Count;

  const StyledTag = styled__default["default"].span(props => {
      const borderRadius = props.theme.base['border-radius'];
      const { spacing } = props.theme.base;
      const { foreground, background } = props.theme.components.badges.tag;
      const borderColor = tryCatch(() => mix$1(0.85, props.theme.base.palette['primary-background'], background));
      const boxShadow = props.theme.base.shadow.focus;
      return styled.css `
    border: 0.0625rem solid ${borderColor};
    border-radius: calc(0.25 * ${borderRadius});
    color: ${foreground};
    display: inline-block;
    font-size: 0.75rem;
    padding: 0 ${spacing};

    &:hover {
      border-color: ${background};
    }

    &:focus {
      border-color: ${background};
      box-shadow: ${boxShadow};
      outline: none;
    }

    &:active {
      border: 0.0625rem solid ${borderColor};
      box-shadow: none;
    }
  `;
  });
  StyledTag.defaultProps = defaultThemeProp;
  const Tag = React.forwardRef(({ children, ...restProps }, ref) => {
      return (jsxRuntime.jsx(StyledTag, { ...restProps, tabIndex: 0, ref: ref, children: children }, void 0));
  });
  var Tag$1 = Tag;

  const helpers = {
      isItem(item) {
          return hasProp(item, 'primary');
      },
      getItem(items, id) {
          let found;
          items.some(item => {
              if (this.isItem(item) && item.id === id) {
                  found = item;
                  return true;
              }
              if (item.items) {
                  found = this.getItem(item.items, id);
                  return !!found;
              }
              return false;
          });
          return found;
      },
      getPath(items, id) {
          let path = [];
          items.some(item => {
              if (item.id === id) {
                  path = [item];
                  return true;
              }
              if (item.items) {
                  const innerPath = this.getPath(item.items, id);
                  if (innerPath.length)
                      path = innerPath.concat(item);
                  return !!path.length;
              }
              return false;
          });
          return path;
      },
      setItem(items, id, newItem) {
          return items.map((item) => {
              if (item.id === id)
                  return { ...newItem };
              if (item.items) {
                  return {
                      ...item,
                      items: this.setItem(item.items, id, newItem)
                  };
              }
              return item;
          });
      },
      mapItem(items, id, fn) {
          return items.map((item, index, array) => {
              let newItem = item;
              if (item.items) {
                  newItem = {
                      ...newItem,
                      items: this.mapItem(item.items, id, fn)
                  };
              }
              if (this.isItem(newItem) && item.id === id) {
                  newItem = fn(newItem, index, array);
              }
              return newItem;
          });
      },
      mapTree(items, fn) {
          return items.map((item, index, array) => {
              let newItem = item;
              if (item.items) {
                  newItem = {
                      ...newItem,
                      items: this.mapTree(item.items, fn)
                  };
              }
              return this.isItem(newItem) ? fn(newItem, index, array) : newItem;
          });
      },
      flatten(items, ancestors) {
          return items.reduce((flatItems, item) => {
              if (item.items) {
                  return this.isItem(item)
                      ? [
                          ...flatItems,
                          item,
                          ...this.flatten(item.items, ancestors ? [...ancestors, item] : [item])
                      ]
                      : [...flatItems, ...this.flatten(item.items, ancestors ? [...ancestors, item] : [item])];
              }
              return this.isItem(item)
                  ? [...flatItems, ancestors ? { ...item, ancestors } : item]
                  : flatItems;
          }, []);
      },
      toggleSelected(items, id, mode, bool) {
          return this.mapTree(items, item => {
              if (this.isItem(item)) {
                  if (item.id === id) {
                      return {
                          ...item,
                          selected: bool !== undefined ? bool : !item.selected
                      };
                  }
                  if (mode === 'single-select') {
                      return {
                          ...item,
                          selected: false
                      };
                  }
              }
              return item;
          });
      },
      selectItem(items, id, mode) {
          return this.toggleSelected(items, id, mode, true);
      },
      deselectItem(items, id, mode) {
          return this.toggleSelected(items, id, mode, false);
      },
      getSelected(items) {
          return items.reduce((selections, item) => {
              if (this.isItem(item) && item.selected) {
                  selections = [...selections, item];
              }
              if (item.items) {
                  selections = [...selections, ...this.getSelected(item.items)];
              }
              return selections;
          }, []);
      },
      prependTo(items, newItems, id) {
          if (id) {
              return this.mapItem(items, id, item => ({
                  ...item,
                  items: [...newItems, ...(item.items ?? [])]
              }));
          }
          return [...newItems, ...items];
      },
      appendTo(items, newItems, id) {
          if (id) {
              return this.mapItem(items, id, item => ({
                  ...item,
                  items: [...(item.items ?? []), ...newItems]
              }));
          }
          return [...items, ...newItems];
      },
      getNextItem(items, itemId) {
          if (!itemId)
              return items[0];
          let nextItem;
          this.mapItem(items, itemId, (item, index, list) => {
              nextItem = list[index + 1];
              return item;
          });
          return nextItem;
      },
      getPrevItem(items, itemId) {
          if (!itemId)
              return items[0];
          let prevItem;
          this.mapItem(items, itemId, (item, index, list) => {
              prevItem = list[index - 1];
              return item;
          });
          return prevItem;
      },
      getParentItem(items, itemId) {
          if (!itemId)
              return undefined;
          const [, parentItem] = this.getPath(items, itemId);
          return parentItem;
      }
  };
  var menuHelpers = helpers;

  const StyledExpandButton = styled__default["default"](Button$1) `
  align-self: center;
`;
  const StyledItemLabel = styled__default["default"].label(({ theme }) => {
      const hoverCheckColor = tryCatch(() => rgba(theme.components['radio-check'][':checked']['background-color'], theme.base.transparency['transparent-5']));
      const checkedBackground = theme.components['radio-check'][':checked']['background-color'];
      const checkedForeground = tryCatch(() => readableColor(checkedBackground));
      return styled.css `
    padding: calc(0.5 * ${theme.base.spacing}) ${theme.base.spacing};
    cursor: pointer;

    &:hover {
      & > input[type='radio']:not(:checked) + ${StyledIcon} {
        color: ${hoverCheckColor};
      }

      & > input[type='checkbox'] + ${StyledIcon} {
        border-color: ${theme.components['form-control'][':hover']['border-color']};
      }
    }

    > ${StyledGrid} {
      flex-grow: 1;
    }

    > input {
      ${hideVisually}

      & + ${StyledIcon} {
        margin-inline-start: 0;
        flex-shrink: 0;
      }

      &[type='radio'] + ${StyledIcon} {
        color: transparent;
      }

      &[type='radio']:checked + ${StyledIcon} {
        color: ${checkedBackground};
      }

      &[type='checkbox'] + ${StyledIcon} {
        border: 0.0625rem solid ${theme.components['radio-check']['border-color']};
        border-radius: min(
          calc(${theme.base['border-radius']} * ${theme.components.checkbox['border-radius']}),
          0.25rem
        );
        color: transparent;
        background-color: ${theme.components['radio-check']['background-color']};
      }

      &[type='checkbox']:checked + ${StyledIcon} {
        background-color: ${checkedBackground};
        border-color: ${theme.components['radio-check'][':checked']['border-color']};
        color: ${checkedForeground};
      }
    }
  `;
  });
  StyledItemLabel.defaultProps = defaultThemeProp;
  const StyledMenuItem = styled__default["default"].li(({ theme: { base, components }, isParentItem }) => {
      const activeColor = tryCatch(() => mix$1(0.85, base.palette['primary-background'], base.palette.interactive));
      const hoverColor = tryCatch(() => mix$1(0.95, base.palette['primary-background'], base.palette.interactive));
      return styled.css `
      min-height: ${base['hit-area']['mouse-min']};

      @media (pointer: coarse) {
        min-height: ${base['hit-area']['finger-min']};
      }

      &:focus-within {
        background-color: ${activeColor};
      }

      &:hover:not([aria-disabled='true']):not([data-current='true']) {
        background-color: ${hoverColor};
      }

      > button:first-child,
      > a:first-child {
        display: block;
        width: 100%;
        padding: calc(0.5 * ${base.spacing}) ${base.spacing};
        text-align: start;
        text-decoration: none;
        color: inherit;
        ${isParentItem &&
        styled.css `
          padding-inline-start: calc(1.125rem + 2 * ${base.spacing});
        `}
      }

      &[aria-disabled='true'] {
        label,
        ${StyledBareButton} {
          background-color: ${components['form-control'][':disabled']['background-color']};
          opacity: ${base['disabled-opacity']};
        }
      }
    `;
  });
  StyledMenuItem.defaultProps = defaultThemeProp;
  const StyledAncestors = styled__default["default"].div `
  ${StyledIcon} {
    width: 1em;
    height: 1em;
  }

  & > ${StyledText} {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
  const StyledVisibilityHidden = styled__default["default"].p `
  ${hideVisually}
`;
  const StyledSeparator = styled__default["default"].li(({ theme }) => {
      return styled.css `
    height: 0.0625rem;
    background-color: ${theme.base.palette['border-line']};
    margin: ${theme.base.spacing} 0;
  `;
  });
  StyledSeparator.defaultProps = defaultThemeProp;
  const StyledMenuGroupList = styled__default["default"].ul(({ theme }) => {
      return styled.css `
    ${StyledMenuItem} button {
      padding-inline-start: calc(1.5 * ${theme.base.spacing});
    }
  `;
  });
  StyledMenuGroupList.defaultProps = defaultThemeProp;
  const StyledMenuGroupHeader = styled__default["default"].div(({ theme }) => {
      return styled.css `
    min-height: ${theme.base['hit-area']['mouse-min']};
    font-weight: ${theme.base['font-weight']['semi-bold']};
    background-color: ${theme.base.palette['secondary-background']};

    @media (pointer: coarse) {
      min-height: ${theme.base['hit-area']['finger-min']};
    }
  `;
  });
  StyledMenuGroupHeader.defaultProps = defaultThemeProp;
  const StyledMenuListHeader = styled__default["default"].legend(({ theme: { base } }) => {
      const hoverColor = tryCatch(() => mix$1(0.95, base.palette['primary-background'], base.palette.interactive));
      const activeColor = tryCatch(() => mix$1(0.85, base.palette['primary-background'], base.palette.interactive));
      return styled.css `
    width: 100%;
    background-color: ${base.palette['primary-background']};

    &:first-child {
      border-top-left-radius: inherit;
      border-top-right-radius: inherit;
    }

    &:last-child {
      border-bottom-left-radius: inherit;
      border-bottom-right-radius: inherit;
    }

    &:focus-within {
      box-shadow: inset ${base.shadow.focus};
      background-color: ${activeColor};
    }

    &:hover:not([aria-disabled='true']):not([data-current='true']) {
      background-color: ${hoverColor};
    }

    & > ${StyledBareButton}, & > button {
      color: ${base.palette['foreground-color']};
      width: 100%;
      padding: calc(0.5 * ${base.spacing}) ${base.spacing};
      text-align: start;
      border-radius: inherit;

      > ${StyledGrid} {
        grid-column-gap: ${base.spacing};
      }

      ${StyledIcon} {
        /* Fixes vertical align issue increasing box size beyond square */
        display: block;
      }
    }
  `;
  });
  StyledMenuListHeader.defaultProps = defaultThemeProp;
  const StyledMenuList = styled__default["default"].ul(({ theme }) => styled.css `
    overflow-x: hidden;
    overflow-y: auto;
    list-style: none;
    height: 100%;
    border-radius: inherit;

    ${StyledEmptyState} {
      padding: ${theme.base.spacing};
      height: auto;
    }

    li:not(:first-child) > ${StyledMenuGroupHeader} {
      margin-block-start: ${theme.base.spacing};
    }
  `);
  StyledMenuList.defaultProps = defaultThemeProp;
  const StyledMenuListContainer = styled__default["default"].fieldset(({ theme }) => {
      return styled.css `
    background-color: ${theme.base.palette['primary-background']};
    border: 0;
    border-radius: inherit;
  `;
  });
  StyledMenuListContainer.defaultProps = defaultThemeProp;
  const StyledFlyoutMenuListContainer = styled__default["default"](StyledMenuListContainer) `
  min-width: 10rem;
`;
  const StyledLoadingItem = styled__default["default"].li `
  display: block;
  position: relative;
  height: 2.8rem;
`;
  const StyledMenuListWrapper = styled__default["default"].div(({ theme }) => styled.css `
    position: relative;
    overflow: hidden;
    transition: height ${theme.base.animation.speed} ${theme.base.animation.timing.ease};
    max-height: 50vh;

    & > fieldset:first-child {
      position: relative;
    }

    &:first-child {
      border-top-left-radius: inherit;
      border-top-right-radius: inherit;
    }

    &:last-child {
      border-bottom-left-radius: inherit;
      border-bottom-right-radius: inherit;
    }
  `);
  StyledMenuListWrapper.defaultProps = defaultThemeProp;
  const StyledMenu = styled__default["default"].div(({ theme }) => {
      const borderStyle = `0.0625rem solid ${theme.base.palette['border-line']}`;
      const activeColor = tryCatch(() => mix$1(0.85, theme.base.palette['primary-background'], theme.base.palette.interactive));
      return styled.css `
    &:first-child {
      border-top-left-radius: inherit;
      border-top-right-radius: inherit;
    }

    &:last-child {
      border-bottom-left-radius: inherit;
      border-bottom-right-radius: inherit;
    }

    &[data-active-scope='true'] [data-current='true'] {
      background-color: ${activeColor};
    }

    ${StyledVisuallyHiddenText}:first-child {
      + ${StyledMenuListWrapper}, + header {
        border-top-left-radius: inherit;
        border-top-right-radius: inherit;
      }
    }

    > header,
    > footer {
      padding: ${theme.base.spacing};
    }

    > header {
      border-bottom: ${borderStyle};
    }

    > footer {
      border-top: ${borderStyle};
    }
  `;
  });
  StyledMenu.defaultProps = defaultThemeProp;

  registerIcon(caretLeft, caretRight);
  const AncestorPath = ({ ancestors = [] }) => {
      const truncatedPath = ancestors.length > 2;
      const pathParts = truncatedPath ? [ancestors[0], ancestors[ancestors.length - 1]] : ancestors;
      const { end } = useDirection$1();
      return (jsxRuntime.jsx(Flex$1, { container: { gap: 0.5, alignItems: 'center' }, as: StyledAncestors, title: ancestors.map(a => (menuHelpers.isItem(a) ? a.primary : a.label)).join(' > '), children: pathParts.map((ancestor, i, arr) => {
              const label = menuHelpers.isItem(ancestor) ? ancestor.primary : ancestor.label;
              return (jsxRuntime.jsxs(React.Fragment, { children: [jsxRuntime.jsx(Text$1, { variant: 'secondary', children: label }, void 0), i < arr.length - 1 && (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(Text$1, { variant: 'secondary', children: jsxRuntime.jsx(Icon$1, { name: `caret-${end}` }, void 0) }, void 0), truncatedPath && (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(Text$1, { variant: 'secondary', children: "\u2026" }, void 0), jsxRuntime.jsx(Text$1, { variant: 'secondary', children: jsxRuntime.jsx(Icon$1, { name: `caret-${end}` }, void 0) }, void 0)] }, void 0))] }, void 0))] }, label));
          }) }, void 0));
  };
  const MenuItem = ({ id, primary, secondary, ancestors, visual, count, items, selected, partial, href, tooltip, onClick, onExpand, disabled, ...restProps }) => {
      const t = useI18n$1();
      const { mode, onItemClick, accent, radioName, variant: menuVariant, setFocusDescendant, getScopedItemId, arrowNavigationUnsupported } = React.useContext(MenuContext);
      const previouslySelected = usePrevious$1(selected);
      const selectionMode = mode === 'single-select' || mode === 'multi-select';
      const isParentItem = React.useMemo(() => selectionMode && items, [selectionMode, items]);
      const selectableParent = isParentItem && typeof selected === 'boolean';
      const inputRef = React.useRef(null);
      const itemId = React.useMemo(() => getScopedItemId(id), [id, getScopedItemId]);
      const { end } = useDirection$1();
      const clickHandler = React.useCallback((e) => {
          const mouseClick = e.detail !== 0;
          if (mouseClick) {
              const target = e.target;
              const focusAtEl = target.getAttribute('role') === 'menuitem'
                  ? target
                  : target.closest('li[role="menuitem"]');
              if (focusAtEl)
                  setFocusDescendant(focusAtEl);
          }
          onClick?.(id, e);
          onItemClick?.(id, e);
      }, [onClick, onItemClick, id]);
      const expandHandler = React.useCallback((e) => {
          onExpand?.(id, e);
      }, [onExpand, id]);
      const navigationInteractionId = `${id}-description`;
      const secondaryId = `${id}-secondary`;
      let accentedPrimary;
      if (accent && !items) {
          const accentRegex = typeof accent === 'function' ? accent(primary) : accent;
          const accentedArr = replaceMatchWithElement(primary, accentRegex, str => (jsxRuntime.jsx(StyledPrimary, { as: 'span', isString: true, children: str }, void 0)));
          if (accentedArr.length > 1)
              accentedPrimary = accentedArr;
      }
      const secondaryContent = ancestors ? (jsxRuntime.jsx(AncestorPath, { ancestors: ancestors }, void 0)) : (secondary && jsxRuntime.jsx(MetaList$1, { items: secondary, id: secondaryId, wrapItems: false }, void 0));
      const [summaryItemRef, setSummaryItemRef] = useElement$1();
      const summaryItem = (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(SummaryItem$1, { ref: setSummaryItemRef, primary: accentedPrimary || (!items ? jsxRuntime.jsx(Text$1, { children: primary }, void 0) : primary), secondary: secondaryContent, visual: visual, actions: (items && !selectableParent) || count ? (jsxRuntime.jsxs(Flex$1, { container: { gap: 1 }, children: [jsxRuntime.jsx(Count$1, { children: count ?? null }, void 0), items && !selectableParent && jsxRuntime.jsx(Icon$1, { name: `caret-${end}` }, void 0)] }, void 0)) : undefined, container: {
                      colGap: 1
                  } }, void 0), tooltip && (jsxRuntime.jsx(Tooltip$1, { target: summaryItemRef, hideDelay: 'none', showDelay: 'none', portal: true, children: tooltip }, void 0))] }, void 0));
      let InteractiveWrap;
      if (href) {
          InteractiveWrap = href ? 'a' : BareButton$1;
      }
      else if (mode === 'action' || items) {
          InteractiveWrap = BareButton$1;
      }
      const itemChild = InteractiveWrap ? (jsxRuntime.jsx(InteractiveWrap, { onMouseDown: (e) => {
              e.preventDefault();
          }, onClick: items ? expandHandler : clickHandler, onMouseEnter: menuVariant === 'flyout' ? expandHandler : undefined, href: href, tabIndex: '-1', disabled: disabled, children: summaryItem }, void 0)) : (summaryItem);
      React.useEffect(() => {
          if (inputRef.current) {
              inputRef.current.indeterminate = !!partial;
          }
      }, [partial]);
      const labelRef = React.useRef(null);
      const itemLabel = React.useMemo(() => {
          const label = selected ? t('checked_noun', [primary]) : primary;
          return isParentItem ? t('expand_noun', [label]) : label;
      }, [selected, primary, isParentItem]);
      const describedBy = React.useMemo(() => {
          const hasItems = !!items;
          const hasSecondary = !!secondary;
          let idString = hasSecondary ? secondaryId : undefined;
          if (hasItems) {
              if (hasSecondary)
                  idString = idString.concat(`, ${navigationInteractionId}`);
              else
                  idString = navigationInteractionId;
          }
          return idString;
      }, [items, secondary, navigationInteractionId, secondaryId]);
      const navigationInstructions = React.useMemo(() => {
          if (arrowNavigationUnsupported) {
              return t('menu_item_shift_space_expand_collapse');
          }
          return t('menu_item_expand_arrow');
      }, []);
      const interactionNotification = React.useMemo(() => {
          if (previouslySelected === undefined)
              return '';
          return `${selected ? t('selected_noun', [primary]) : t('deselected_noun', [primary])}`;
      }, [selected]);
      return (jsxRuntime.jsxs(Flex$1, { ...restProps, container: { alignItems: 'stretch', justify: 'between' }, id: itemId, as: StyledMenuItem, "aria-label": itemLabel, "aria-describedby": describedBy, isParentItem: isParentItem, role: 'menuitem', "aria-disabled": disabled, "data-expand": !!items, tabIndex: '-1', children: [selectionMode && typeof selected === 'boolean' ? (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsxs(Flex$1, { ref: labelRef, as: StyledItemLabel, container: { alignItems: 'center', gap: 1 }, item: { grow: 1 }, onMouseDown: (e) => {
                              e.preventDefault();
                          }, 
                          // https://stackoverflow.com/questions/32958091/how-to-prevent-clicking-on-a-checkboxs-label-from-stealing-focus
                          onClick: (e) => {
                              if (labelRef.current?.control !== e.target) {
                                  e.preventDefault();
                                  // Preserve detail property (lost with .click()).
                                  const event = new window.MouseEvent(e.nativeEvent.type, e.nativeEvent);
                                  labelRef.current?.control?.dispatchEvent(event);
                              }
                          }, children: [jsxRuntime.jsx("input", { ref: inputRef, type: mode === 'single-select' ? 'radio' : 'checkbox', name: mode === 'single-select' ? radioName : undefined, "aria-label": primary, checked: !!selected, disabled: disabled, onClick: clickHandler, onKeyDown: (e) => {
                                      if (mode === 'single-select' && e.key === 'Enter') {
                                          e.currentTarget.click();
                                      }
                                  }, 
                                  // no-op since React will complain about a controlled input without an onChange
                                  onChange: () => { }, onMouseDown: e => {
                                      e.preventDefault();
                                  }, tabIndex: -1 }, void 0), (mode === 'single-select' || mode === 'multi-select') && jsxRuntime.jsx(Icon$1, { name: 'check' }, void 0), summaryItem] }, void 0), isParentItem && (jsxRuntime.jsx(StyledExpandButton, { icon: true, variant: 'simple', onClick: expandHandler, tabIndex: '-1', children: jsxRuntime.jsx(Icon$1, { name: `caret-${end}` }, void 0) }, void 0))] }, void 0)) : (itemChild), !!items && (jsxRuntime.jsx(StyledVisibilityHidden, { id: navigationInteractionId, children: navigationInstructions }, void 0)), jsxRuntime.jsx(StyledVisibilityHidden, { role: 'alert', children: interactionNotification }, void 0)] }, void 0));
  };
  var MenuItem$1 = MenuItem;

  const resizeRootEl = (ele, rootEle, itemCount, scrollAt) => {
      const hasLegend = !!ele.firstElementChild?.matches('legend');
      const lastVisibleLI = ele.querySelectorAll(':scope > ul > li')[Math.max(Math.min(scrollAt - (hasLegend ? 2 : 1), itemCount - 1), 0)];
      let menuRootElHeight;
      if (lastVisibleLI) {
          const containerTop = ele.getBoundingClientRect().top;
          const lastVisibleLIRect = lastVisibleLI.getBoundingClientRect();
          const ulScrollTop = ele.querySelector(':scope > ul')?.scrollTop ?? 0;
          let btm = lastVisibleLIRect.bottom;
          if (itemCount >= scrollAt) {
              btm = (lastVisibleLIRect.top + lastVisibleLIRect.bottom) / 2;
          }
          menuRootElHeight = btm - containerTop + ulScrollTop;
      }
      requestAnimationFrame(() => {
          rootEle.style.height = menuRootElHeight ? `${menuRootElHeight}px` : '';
      });
  };

  const MenuGroup = ({ id, label, items }) => {
      const { componentId } = React.useContext(MenuContext);
      const groupId = `${componentId}-${id}`;
      return (jsxRuntime.jsxs("li", { children: [jsxRuntime.jsx(Flex$1, { container: { alignItems: 'center', pad: [0.5, 1] }, as: StyledMenuGroupHeader, id: groupId, children: label }, void 0), jsxRuntime.jsx(StyledMenuGroupList, { role: 'group', "aria-labelledby": `#${groupId}`, children: items.length > 0 &&
                      items.map(item => {
                          return React.createElement(MenuItem$1, { ...item, key: item.id });
                      }) }, void 0)] }, void 0));
  };
  var MenuGroup$1 = MenuGroup;

  const FlyoutMenuList = React.forwardRef(({ items, parent }, ref) => {
      const selfRef = useConsolidatedRef$1(ref);
      const ulRef = React.useRef(null);
      const menuListWrapperRef = React.useRef(null);
      const returnFocusRef = React.useRef(null);
      const [expandedItem, setExpandedItem] = React.useState();
      const { componentId, loadMore, loading, scrollAt, emptyText, onItemExpand, pushFlyoutId, flyOutActiveIdStack } = React.useContext(MenuContext);
      useItemIntersection$1(ulRef, items.length - 1, () => {
          loadMore?.(parent?.item?.id);
      }, ':scope > li');
      useAfterInitialEffect$1(() => {
          if (expandedItem) {
              setExpandedItem(items.find(item => item.id === expandedItem.id)); // FIXME
          }
      }, [expandedItem, items]);
      React.useEffect(() => {
          const hasExpanded = items.some(item => {
              return flyOutActiveIdStack.includes(item.id);
          });
          if (!hasExpanded) {
              returnFocusRef.current = null;
              setExpandedItem(undefined);
          }
      }, [flyOutActiveIdStack]);
      const listContent = React.useMemo(() => {
          if (items.length) {
              return items.map(item => {
                  return menuHelpers.isItem(item) ? (React.createElement(MenuItem$1, { ...item, key: item.id, "aria-haspopup": !!item.items, "aria-expanded": item.id === expandedItem?.id, onExpand: (id, e) => {
                          if (item.items) {
                              returnFocusRef.current = e.currentTarget;
                              setExpandedItem(item); // FIXME
                              item?.onExpand?.(id, e);
                              onItemExpand?.(id, e);
                              pushFlyoutId(item.id || componentId);
                          }
                          else {
                              returnFocusRef.current = null;
                              setExpandedItem(undefined);
                          }
                      } })) : (React.createElement(MenuGroup$1, { ...item, key: item.id }));
              });
          }
          if (!loading) {
              return jsxRuntime.jsx(EmptyState$1, { message: emptyText, forwardedAs: 'li' }, void 0);
          }
          return null;
      }, [items, loading, emptyText, expandedItem]);
      const list = (jsxRuntime.jsxs(StyledMenuList, { ref: ulRef, children: [listContent, loading && !expandedItem && (jsxRuntime.jsx(StyledLoadingItem, { children: jsxRuntime.jsx(Progress$1, { placement: 'local' }, void 0) }, void 0))] }, void 0));
      React.useLayoutEffect(() => {
          setExpandedItem(undefined);
          if (selfRef.current) {
              menuListWrapperRef.current = selfRef.current.parentElement;
              resizeRootEl(selfRef.current, selfRef.current, items.length, scrollAt);
          }
      }, [items]);
      const handleMenuListScroll = React.useCallback(() => {
          if (expandedItem) {
              setExpandedItem(undefined);
          }
      }, [expandedItem]);
      return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(StyledFlyoutMenuListContainer, { ref: selfRef, onScroll: handleMenuListScroll, "data-flyout-menu-parent-id": componentId, "data-flyout-menu-id": parent?.item.id || componentId, children: list }, void 0), expandedItem && selfRef.current && (jsxRuntime.jsx(Popover$1, { target: returnFocusRef.current, show: true, strategy: 'fixed', placement: 'right-start', children: jsxRuntime.jsx(FlyoutMenuList, { items: expandedItem.items, parent: {
                          el: selfRef.current,
                          item: expandedItem,
                          siblingItems: items,
                          setExpandedItem,
                          returnFocusRef
                      } }, void 0) }, void 0))] }, void 0));
  });
  var FlyoutMenuList$1 = FlyoutMenuList;

  const StyledDrawer = styled__default["default"].div(props => {
      const { state, shadow, position, placement, transitionSpeed, size, theme } = props;
      let dimension = 'horizontal';
      let axis = 'X';
      let anchor = 'top';
      if (placement === 'top' || placement === 'bottom') {
          dimension = 'vertical';
          axis = 'Y';
          anchor = 'left';
      }
      const translate = state === 'open' || state === 'opening' ? 0 : '100%';
      const speed = transitionSpeed || theme.base.animation.speed;
      return styled.css `
    z-index: ${theme.base['z-index'].drawer};
    position: ${position};
    ${placement}: 0;
    ${anchor}: 0;
    height: ${dimension === 'vertical' ? size : '100%'};
    width: ${dimension === 'horizontal' ? size : '100%'};
    transition-property: transform, box-shadow, opacity;
    transition-duration: max(${speed}, 0.0001s);
    transition-timing-function: ${theme.base.animation.timing.ease};
    transform: ${state === 'open'
        ? 'none'
        : `translate${axis}(${placement === 'top' || placement === 'left' ? '-' : ''}${translate})`};

    ${shadow &&
        styled.css `
      box-shadow: ${theme.base.shadow.high};
    `}
  `;
  });
  StyledDrawer.defaultProps = defaultThemeProp;
  const Drawer = React.forwardRef((props, ref) => {
      const { open = false, shadow = false, position = 'absolute', children, placement = 'right', transitionSpeed, size = '100%', onAfterOpen, onAfterClose, onBeforeOpen, onBeforeClose, onOuterClick, nullWhenClosed = false, ...restProps } = props;
      const drawerRef = useConsolidatedRef$1(ref);
      const [state, setState] = React.useState(open ? 'open' : 'closed');
      let prevState = usePrevious$1(state);
      if (!prevState)
          prevState = state;
      useOuterEvent$1('mousedown', [drawerRef.current], React.useCallback(() => {
          if (open)
              onOuterClick?.();
      }, [open, onOuterClick]));
      React.useEffect(() => {
          if (open && (state === 'closed' || state === 'closing')) {
              onBeforeOpen?.();
              reflow(drawerRef.current);
              setState('opening');
          }
          else if (!open && (state === 'open' || state === 'opening')) {
              onBeforeClose?.();
              setState('closing');
          }
          else if (open && state === 'open' && prevState !== 'open') {
              onAfterOpen?.();
          }
          else if (!open && state === 'closed' && prevState !== 'closed') {
              onAfterClose?.();
          }
      }, [open, state, prevState, onBeforeOpen, onBeforeClose, onAfterOpen, onAfterClose]);
      const onTransitionEnd = React.useCallback((e) => {
          if (e.target !== drawerRef.current || e.propertyName !== 'transform')
              return;
          setState(open ? 'open' : 'closed');
      }, [open]);
      return state === 'closed' && !open && nullWhenClosed ? null : (jsxRuntime.jsx(StyledDrawer, { ref: drawerRef, position: position, shadow: shadow && open, transitionSpeed: transitionSpeed, placement: placement, size: size, open: open, state: state, onTransitionEnd: onTransitionEnd, ...restProps, children: children }, void 0));
  });
  var Drawer$1 = Drawer;

  const MenuListHeader = ({ text, onClick }) => {
      const t = useI18n$1();
      const { arrowNavigationUnsupported } = React.useContext(MenuContext);
      const { start } = useDirection$1();
      const onKeyDown = React.useCallback((ev) => {
          if (ev.key === 'Enter' || ev.key === `Arrow${cap(start)}`) {
              onClick();
          }
      }, [onClick, start]);
      return (jsxRuntime.jsx(Flex$1, { container: { alignItems: 'center' }, as: StyledMenuListHeader, children: jsxRuntime.jsx(BareButton$1, { onClick: onClick, onKeyDown: onKeyDown, "data-collapse": 'true', "aria-expanded": 'true', "aria-label": `${t('collapse_noun', [text || ''])} ${arrowNavigationUnsupported
                ? t('menu_item_collapse_shift_space')
                : t('menu_item_collapse_arrow')}`, tabIndex: -1, children: jsxRuntime.jsx(SummaryItem$1, { visual: jsxRuntime.jsx(Icon$1, { name: `caret-${start}` }, void 0), primary: text }, void 0) }, void 0) }, void 0));
  };
  var MenuListHeader$1 = MenuListHeader;

  const setParentDisabled = (fieldset, bool) => {
      fieldset.disabled = bool;
      const legendButton = fieldset.querySelector('legend button');
      if (legendButton) {
          legendButton.disabled = bool;
      }
  };
  const MenuList = React.forwardRef(({ items, parent }, ref) => {
      const menuListWrapperRef = React.useRef(null);
      const selfRef = useConsolidatedRef$1(ref);
      const ulRef = React.useRef(null);
      const returnFocusRef = React.useRef(null);
      const [open, setOpen] = React.useState(!parent);
      const [expandedItem, setExpandedItem] = React.useState();
      const { scrollAt, loadMore, loading, emptyText, currentItemId, onItemExpand, focusControl, updateActiveDescendants, setFocusReturnEl, onItemCollapse } = React.useContext(MenuContext);
      const { end } = useDirection$1();
      useItemIntersection$1(ulRef, items.length - 1, () => {
          if (!loading)
              loadMore?.(parent?.item?.id);
      }, ':scope > li');
      React.useLayoutEffect(() => {
          if (!selfRef.current || expandedItem)
              return;
          menuListWrapperRef.current = selfRef.current.parentElement;
          resizeRootEl(selfRef.current, menuListWrapperRef.current, items.length, scrollAt);
      });
      React.useEffect(() => {
          if (parent)
              setOpen(true);
      }, []);
      useAfterInitialEffect$1(() => {
          if (expandedItem) {
              setExpandedItem(items.find(item => item.id === expandedItem.id)); // FIXME
          }
      }, [expandedItem, items]);
      useAfterInitialEffect$1(() => {
          if (currentItemId) {
              // if there is ancestor item of the controlled item, set it to expanded.
              const ancestor = items.find(item => item.items?.length && menuHelpers.getItem(item.items, currentItemId) !== undefined);
              if (ancestor) {
                  setExpandedItem(ancestor);
                  updateActiveDescendants({ preventScroll: true });
              }
          }
      }, [currentItemId, items, parent]);
      const onExpandCallback = React.useCallback((id, e) => {
          const item = menuHelpers.getItem(items, id);
          returnFocusRef.current = e.currentTarget;
          setExpandedItem(item); // FIXME
          item?.onExpand?.(id, e);
          onItemExpand?.(id, e);
          updateActiveDescendants({ preventScroll: true });
      }, [items]);
      const listContent = React.useMemo(() => {
          if (items.length) {
              return items.map((item, index) => {
                  return menuHelpers.isItem(item) ? (React.createElement(MenuItem$1, { ...item, key: item.id, onExpand: item.items ? onExpandCallback : undefined })) : (jsxRuntime.jsxs(React.Fragment, { children: [jsxRuntime.jsx(MenuGroup$1, { ...item }, void 0), items[index + 1] && menuHelpers.isItem(items[index + 1]) && (jsxRuntime.jsx(StyledSeparator, { role: 'separator' }, void 0))] }, item.id));
              });
          }
          if (!loading) {
              return jsxRuntime.jsx(EmptyState$1, { message: emptyText, forwardedAs: 'li' }, void 0);
          }
          return null;
      }, [items, loading, emptyText]);
      const list = (jsxRuntime.jsxs(StyledMenuList, { ref: ulRef, role: 'menu', children: [listContent, loading && !expandedItem && (jsxRuntime.jsx(StyledLoadingItem, { children: jsxRuntime.jsx(Progress$1, { placement: 'local' }, void 0) }, void 0))] }, void 0));
      return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsxs(Drawer$1, { "aria-hidden": !!expandedItem, as: StyledMenuListContainer, ref: selfRef, open: open, style: { opacity: expandedItem ? 0 : 1 }, disabled: !!expandedItem, placement: end, onBeforeOpen: () => {
                      if (parent) {
                          parent.el.style.opacity = '0';
                      }
                      if (selfRef.current) {
                          selfRef.current.style.opacity = '1';
                      }
                  }, onAfterOpen: () => {
                      if (parent) {
                          setParentDisabled(parent.el, true);
                      }
                  }, onBeforeClose: () => {
                      if (parent && menuListWrapperRef.current) {
                          setParentDisabled(parent.el, false);
                          parent.el.style.opacity = '1';
                          resizeRootEl(parent.el, menuListWrapperRef.current, parent.siblingItems.length, scrollAt);
                      }
                      if (selfRef.current) {
                          selfRef.current.style.opacity = '0';
                      }
                  }, onAfterClose: () => {
                      if (parent) {
                          focusControl?.focus();
                          const expandBtn = parent.returnFocusRef.current;
                          parent.setExpandedItem(undefined);
                          if (expandBtn) {
                              setFocusReturnEl(expandBtn?.closest('li'));
                          }
                          onItemCollapse?.(parent.item.id);
                          updateActiveDescendants();
                      }
                  }, children: [parent && (jsxRuntime.jsx(MenuListHeader$1, { text: parent.item.primary, onClick: () => {
                              setOpen(false);
                          } }, void 0)), list] }, void 0), expandedItem && selfRef.current && (jsxRuntime.jsx(MenuList, { items: expandedItem.items, parent: {
                      el: selfRef.current,
                      item: expandedItem,
                      siblingItems: items,
                      setExpandedItem,
                      returnFocusRef
                  } }, void 0))] }, void 0));
  });
  var MenuList$1 = MenuList;

  const Menu = React.forwardRef((props, ref) => {
      const uid = useUID$1();
      const { id = uid, items = [], mode = 'action', accent, scrollAt = 7, emptyText, onItemClick, onItemActive, onItemExpand, loadMore, onItemCollapse, loading = false, currentItemId, header, footer, variant = 'drill-down', focusControlEl, focusElOnClose = true, arrowNavigationUnsupported, 'aria-describedby': ariaDescribedBy, ...restProps } = props;
      const t = useI18n$1();
      const { end: endDirection, start: startDirection } = useDirection$1();
      const radioName = useUID$1();
      const menuRef = useConsolidatedRef$1(ref);
      const previousItemCount = React.useRef(0);
      const [activeDescendantUpdateId, setActiveDescendantUpdateId] = React.useState(0);
      const [focusDescendant, setFocusDescendant] = React.useState(null);
      const [flyOutActiveIdStack, setFlyoutActiveIdStack] = React.useState([id]);
      const [focusReturnEl, setFocusReturnEl] = React.useState();
      const [preventInitialScroll, setPreventInitialScroll] = React.useState(false);
      const activeFlyoutSelector = React.useMemo(() => `fieldset[data-flyout-menu-id="${flyOutActiveIdStack[flyOutActiveIdStack.length - 1]}"]`, [flyOutActiveIdStack]);
      const focusControl = React.useMemo(() => {
          return focusControlEl || menuRef.current;
      }, [focusControlEl, menuRef.current]);
      const pushFlyoutId = React.useCallback((flyoutId) => {
          setFlyoutActiveIdStack([...flyOutActiveIdStack, flyoutId]);
      }, [flyOutActiveIdStack]);
      const getScopedItemId = React.useCallback((itemId) => {
          return `${id}-item-${itemId}`;
      }, [id]);
      const getUnscopedItemId = React.useCallback((itemId) => {
          return itemId.split(`${id}-item-`)[1];
      }, [id]);
      const updateActiveDescendants = React.useCallback(({ preventScroll = false } = {}) => {
          setPreventInitialScroll(preventScroll);
          setActiveDescendantUpdateId(Math.random());
      }, []);
      const uadConfig = React.useMemo(() => ({
          focusEl: focusControl,
          scope: menuRef.current,
          scopeSelector: variant === 'drill-down'
              ? 'fieldset[aria-hidden="false"]'
              : activeFlyoutSelector,
          selector: '[role="menuitem"], legend button',
          focusDescendantEl: focusDescendant,
          clearFocusDescendant: () => {
              setFocusDescendant(null);
              if (focusElOnClose)
                  focusControl?.focus();
          },
          focusReturnEl,
          clearFocusReturn: () => {
              setFocusReturnEl(null);
          },
          currentDescendantId: currentItemId ? getScopedItemId(currentItemId) : undefined,
          preventInitialScroll,
          clearPreventScroll: () => {
              setPreventInitialScroll(false);
          }
      }), [
          focusControl,
          menuRef.current,
          activeFlyoutSelector,
          focusReturnEl,
          focusDescendant,
          currentItemId,
          preventInitialScroll
      ]);
      const { activeDescendant, descendants } = useActiveDescendant$1(uadConfig, [
          activeDescendantUpdateId
      ]);
      const previousActiveDescendant = usePrevious$1(activeDescendant);
      // ## Bind Menu-specific navigation keyDown.
      React.useEffect(() => {
          const expandOrCollapse = (action = null) => {
              if (activeDescendant) {
                  // expand
                  if (activeDescendant.dataset.expand === 'true' && action !== 'collapse') {
                      activeDescendant.querySelector('button')?.click();
                      return;
                  }
                  // collapse
                  if (activeDescendant.dataset.collapse === 'true' && action !== 'expand') {
                      activeDescendant.click();
                  }
              }
          };
          const additionalKeydown = (e) => {
              switch (e.key) {
                  case `Arrow${cap(endDirection)}`: {
                      if (arrowNavigationUnsupported)
                          break;
                      expandOrCollapse('expand');
                      break;
                  }
                  case `Arrow${cap(startDirection)}`: {
                      if (arrowNavigationUnsupported)
                          break;
                      expandOrCollapse('collapse');
                      break;
                  }
                  case 'Escape': {
                      if (variant === 'flyout' && flyOutActiveIdStack.length > 1) {
                          e.preventDefault();
                          e.stopPropagation();
                          const newStack = [...flyOutActiveIdStack];
                          newStack.pop();
                          setFlyoutActiveIdStack(newStack);
                      }
                      break;
                  }
              }
              if (arrowNavigationUnsupported && (e.key === ' ' || e.key === 'Spacebar') && e.shiftKey) {
                  e.preventDefault();
                  expandOrCollapse();
              }
          };
          if (activeDescendant)
              onItemActive?.(getUnscopedItemId(activeDescendant.id));
          focusControl?.addEventListener('keydown', additionalKeydown);
          return () => focusControl?.removeEventListener('keydown', additionalKeydown);
      }, [focusControl, activeDescendant]);
      // ## Update useActiveDescendant on change of items, not selection of items.
      React.useEffect(() => {
          // Next tick for DOM updates.
          setTimeout(() => {
              if (items.length === previousItemCount.current) {
                  const previousDescendantIds = descendants?.map(node => node.id);
                  const newDescendants = uadConfig.scope
                      ?.querySelector(uadConfig.scopeSelector)
                      ?.querySelectorAll(uadConfig.selector);
                  if (!newDescendants) {
                      updateActiveDescendants();
                      return;
                  }
                  const scopedDescendants = Array.from(newDescendants);
                  if (scopedDescendants?.length !== previousDescendantIds?.length) {
                      updateActiveDescendants();
                      return;
                  }
                  const itemsUnchanged = scopedDescendants.every((node, index) => node.id === previousDescendantIds[index]);
                  if (!itemsUnchanged) {
                      updateActiveDescendants();
                  }
                  return;
              }
              previousItemCount.current = items.length;
              updateActiveDescendants();
          }, 0);
      }, [items]);
      // ## Bump scroll & set return element when descendant focused in loading state.
      React.useEffect(() => {
          const activeDescendantChanged = previousActiveDescendant?.id !== activeDescendant?.id;
          if (!activeDescendantChanged)
              return;
          if (loading && descendants && descendants.length && activeDescendant) {
              const descendantList = [...descendants];
              const lastItem = descendantList.pop();
              const lastId = lastItem?.id || undefined;
              if (lastId === activeDescendant.id) {
                  const scrollRegion = uadConfig.scope
                      ?.querySelector(uadConfig.scopeSelector)
                      ?.querySelector('ul');
                  if (scrollRegion) {
                      scrollRegion.scrollTop = scrollRegion.scrollHeight - scrollRegion.offsetHeight;
                  }
                  if (focusReturnEl?.id !== activeDescendant.id) {
                      // Set focus return on 'nextTick' and avoid looping calls with immediate siblings.
                      setTimeout(() => {
                          setFocusReturnEl(lastItem);
                      }, 0);
                  }
              }
              else if (focusReturnEl?.id !== activeDescendant.id) {
                  // Set focus return on 'nextTick' and avoid looping calls with immediate siblings.
                  setTimeout(() => {
                      setFocusReturnEl(activeDescendant);
                  }, 0);
              }
          }
      }, [
          loading,
          descendants,
          previousActiveDescendant,
          activeDescendant,
          uadConfig,
          focusReturnEl
      ]);
      const contextValue = React.useMemo(() => {
          return {
              componentId: id,
              mode,
              arrowNavigationUnsupported,
              onItemClick,
              onItemActive,
              onItemExpand,
              onItemCollapse,
              accent,
              scrollAt,
              emptyText,
              radioName,
              loadMore,
              loading,
              variant,
              focusControl,
              updateActiveDescendants,
              setFocusReturnEl,
              setFocusDescendant,
              getScopedItemId,
              pushFlyoutId,
              flyOutActiveIdStack
          };
      }, [
          id,
          mode,
          arrowNavigationUnsupported,
          onItemClick,
          onItemActive,
          onItemExpand,
          onItemCollapse,
          accent,
          scrollAt,
          emptyText,
          radioName,
          loadMore,
          loading,
          variant,
          focusControl,
          updateActiveDescendants,
          setFocusReturnEl,
          setFocusDescendant,
          getScopedItemId,
          pushFlyoutId,
          flyOutActiveIdStack
      ]);
      return (jsxRuntime.jsxs(StyledMenu, { id: id, role: 'menu', "aria-describedby": !focusControlEl ? `${id}-menuDescription` : undefined, ...restProps, ref: menuRef, children: [!focusControlEl && (jsxRuntime.jsx(VisuallyHiddenText$1, { id: `${id}-menuDescription`, children: (`${t('menu_selection_instructions')} ` && ariaDescribedBy) || '' }, void 0)), header && jsxRuntime.jsx("header", { children: header }, void 0), jsxRuntime.jsx(StyledMenuListWrapper, { children: jsxRuntime.jsx(MenuContext.Provider, { value: contextValue, children: variant === 'drill-down' ? (jsxRuntime.jsx(MenuList$1, { items: items }, void 0)) : (jsxRuntime.jsx(FlyoutMenuList$1, { items: items }, void 0)) }, void 0) }, void 0), footer && jsxRuntime.jsx("footer", { children: footer }, void 0)] }, void 0));
  });
  var Menu$1 = Menu;

  // This file is autogenerated. Any changes will be overwritten.
  const name$B = 'arrow-micro-down';
  const Component$B = () => (jsxRuntime.jsx("path", { d: 'M8,10 C8,10 16.8125,10 16.8125,10 C16.8125,10 12.5023437,14.8851562 12.5023437,14.8851562 C12.5023437,14.8851562 8.00078125,10 8.00078125,10 L8,10 Z' }, void 0));
  const viewBox$B = '0 0 25 25';

  var arrowMicroDown = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$B,
    Component: Component$B,
    viewBox: viewBox$B
  });

  registerIcon(arrowMicroDown);
  const StyledMenuButton = styled__default["default"].button `
  flex-shrink: 0;

  & + ${StyledPopover} + ${StyledButton} {
    margin-inline-start: ${props => props.theme.base.spacing};
  }
`;
  StyledMenuButton.defaultProps = defaultThemeProp;
  const StyledMenuButtonPopover = styled__default["default"](Popover$1) `
  min-width: 20ch;
`;
  const MenuButton = React.forwardRef((props, ref) => {
      const uid = useUID$1();
      const { id = uid, text, menu, popover, onClick, onKeyDown, icon, count, iconOnly = false, ...restProps } = props;
      const [isOpen, setIsOpen] = React.useState(false);
      const buttonRef = useConsolidatedRef$1(ref);
      const popoverRef = useConsolidatedRef$1(popover?.ref);
      const menuRef = useConsolidatedRef$1(menu?.ref);
      // FIXME: Type assertion required for issue in useFocusWithin generic
      useFocusWithin$1([popoverRef, buttonRef], React.useCallback(isFocused => {
          if (!isFocused)
              setIsOpen(false);
      }, []));
      const { rtl } = useDirection$1();
      return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(Button$1, { as: StyledMenuButton, ...restProps, id: id, ref: buttonRef, "aria-expanded": isOpen, "aria-haspopup": 'menu', "aria-controls": `${id}-popover`, "aria-label": text, label: iconOnly && !isOpen ? text : undefined, onClick: (e) => {
                      // clickCount is 0 when triggered by keyboard.
                      const clickCount = e.detail;
                      // Close the menu if it is open and either:
                      //   It is a *mouse* click on the button.
                      //   Or, the menu mode is not multiselect.
                      if (isOpen && (clickCount > 0 || menu?.mode !== 'multi-select')) {
                          setIsOpen(false);
                      }
                      else {
                          setIsOpen(true);
                      }
                      onClick?.(e);
                  }, onKeyDown: (e) => {
                      if (e.key === 'Escape')
                          setIsOpen(false);
                      onKeyDown?.(e);
                  }, icon: iconOnly, children: jsxRuntime.jsxs(Flex$1, { container: { alignItems: 'center', gap: 1 }, children: [icon && jsxRuntime.jsx(Icon$1, { name: icon }, void 0), !iconOnly && (jsxRuntime.jsxs(Text$1, { children: [text, " ", count !== undefined && jsxRuntime.jsx(Count$1, { children: count }, void 0), text && jsxRuntime.jsx(Icon$1, { name: 'arrow-micro-down' }, void 0)] }, void 0))] }, void 0) }, void 0), jsxRuntime.jsx(StyledMenuButtonPopover, { placement: rtl ? 'bottom-end' : 'bottom-start', id: `${id}-popover`, ...popover, hideOnTargetHidden: true, show: !!menu && isOpen, target: buttonRef.current, ref: popoverRef, children: menu && (jsxRuntime.jsx(Menu$1, { ...menu, ref: menuRef, items: menu.items, onItemClick: (itemId, e) => {
                          if (menu.mode !== 'multi-select' &&
                              e
                                  .detail > 0) {
                              setIsOpen(false);
                          }
                          menu.onItemClick?.(itemId, e);
                      }, focusControlEl: buttonRef.current || undefined }, void 0)) }, void 0)] }, void 0));
  });
  var MenuButton$1 = MenuButton;

  const Actions = React.forwardRef(({ items, menuAt = 2, iconOnly = true }, ref) => {
      const t = useI18n$1();
      if (!items || items.length === 0) {
          return null;
      }
      return items.length >= menuAt ? (jsxRuntime.jsx(MenuButton$1, { ref: ref, text: t('actions'), iconOnly: true, icon: 'more', variant: 'simple', menu: {
              items: items.map(({ text, ...restProps }) => ({
                  primary: text,
                  ...restProps
              }))
          } }, void 0)) : (jsxRuntime.jsx(jsxRuntime.Fragment, { children: items.map(({ id, icon, text, onClick, ...restProps }) => {
              return (jsxRuntime.jsx(Button$1, { ref: ref, variant: icon && iconOnly ? 'simple' : undefined, onClick: (event) => onClick?.(id, event), label: icon ? text : undefined, icon: !!icon && iconOnly, ...restProps, children: icon && iconOnly ? jsxRuntime.jsx(Icon$1, { name: icon }, void 0) : text }, id));
          }) }, void 0));
  });
  var Actions$1 = Actions;

  const managerInitializedKey = Symbol.for('@pega/cosmos-react-core.modal-manager.initialized');
  const modalInitializedKey = Symbol.for('@pega/cosmos-react-core.modal.initialized');

  const initialMethods = {
      update: () => { },
      dismiss: () => { },
      activate: () => { },
      minimize: () => { },
      maximize: () => { },
      dock: () => { },
      unmount: () => { }
  };
  const initialModalContext = {
      alert: false,
      dismissible: true,
      minimizable: false,
      maximizable: false,
      dockable: false,
      defaultMinimized: false,
      unmountWhenMinimized: true,
      state: 'open',
      top: false,
      [modalInitializedKey]: false,
      ...initialMethods
  };
  const ModalContext = React.createContext(initialModalContext);
  const ModalManagerContext = React.createContext({
      create: () => initialMethods,
      ModalContext,
      [managerInitializedKey]: false
  });

  const StyledCardMedia = styled__default["default"].div `
  img,
  video,
  audio {
    object-fit: cover;
    width: 100%;
  }
`;

  const defaultProps$4 = {
      interactive: false,
      role: 'region'
  };
  const StyledCard = styled__default["default"].article(props => {
      const { 'border-radius': borderRadius, 'border-color': borderColor, background } = props.theme.components.card;
      const interactive = props.interactive
          ? styled.css `
        &:hover {
          border: 0;
          box-shadow: 0 0 0 0.0625rem ${borderColor};
        }
        &:focus {
          border: 0;
          box-shadow: 0 0 0 0.125rem ${borderColor};
        }
      `
          : undefined;
      return styled.css `
    ${StyledPopover} &, &:not(& &) {
      background-color: ${background};
      border-radius: ${borderRadius};

      &:focus {
        outline: none;
      }

      ${interactive}

      ${StyledCardMedia} {
        &:first-child img {
          border-radius: ${borderRadius} ${borderRadius} 0 0;
        }
      }
    }
  `;
  });
  StyledCard.defaultProps = defaultThemeProp;
  const Card = React.forwardRef((props, ref) => {
      const { children, as, onClick, interactive, role, ...restProps } = props;
      const interactiveProps = {
          ...(onClick && {
              onClick,
              tabIndex: 0,
              role: 'button'
          }),
          ...(interactive && {
              tabIndex: 0
          }),
          ...(role && { role }),
          interactive
      };
      return (jsxRuntime.jsx(Flex$1, { container: { direction: 'column' }, as: StyledCard, forwardedAs: as, ref: ref, ...interactiveProps, ...restProps, children: children }, void 0));
  });
  Card.defaultProps = defaultProps$4;

  const StyledCardFooter = styled__default["default"].footer(({ theme }) => {
      return styled.css `
    ${StyledPopover} &, &:not(${StyledCard} ${StyledCard} > &) {
      padding: calc(1.5 * ${theme.base.spacing}) calc(${theme.components.card.padding} * 2);
    }
  `;
  });
  StyledCardFooter.defaultProps = defaultThemeProp;
  const CardFooter = (props) => {
      const { children, justify, ...restProps } = props;
      return (jsxRuntime.jsx(Flex$1, { as: StyledCardFooter, container: {
              wrap: 'wrap',
              alignItems: 'center',
              justify
          }, ...restProps, children: children }, void 0));
  };
  var CardFooter$1 = CardFooter;

  const StyledCardContent = styled__default["default"].div(({ theme }) => {
      return styled.css `
    ${StyledPopover} &, &:not(${StyledCard} ${StyledCard} > &) {
      position: relative;
      padding: calc(1.5 * ${theme.base.spacing}) calc(${theme.components.card.padding} * 2);

      & + &,
      & + ${StyledCardFooter} {
        padding-block-start: 0;
      }
    }
  `;
  });
  StyledCardContent.defaultProps = defaultThemeProp;
  const CardContent = ({ children, container, ...restProps }) => {
      return (jsxRuntime.jsx(Flex$1, { ...restProps, container: { direction: 'column', ...container }, as: StyledCardContent, children: children }, void 0));
  };
  var CardContent$1 = CardContent;

  const StyledCardHeader = styled__default["default"].header(({ theme, onClick }) => {
      return styled.css `
    ${StyledPopover} &, &:not(${StyledCard} ${StyledCard} > &) {
      padding: calc(1.5 * ${theme.base.spacing}) calc(${theme.components.card.padding} * 2);

      + ${StyledCardContent} {
        padding-block-start: 0;
      }

      &:hover {
        ${onClick ? 'cursor: pointer;' : undefined}
      }
    }
  `;
  });
  StyledCardHeader.defaultProps = defaultThemeProp;
  const CardHeader = React.forwardRef(({ children, actions, ...restProps }, ref) => {
      return (jsxRuntime.jsx(Flex$1, { container: { alignItems: 'center', justify: 'between' }, as: StyledCardHeader, ...restProps, ref: ref, children: actions ? (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(Flex$1, { container: { alignItems: 'center' }, item: { grow: 1 }, children: children }, void 0), jsxRuntime.jsx("div", { children: actions }, void 0)] }, void 0)) : (children) }, void 0));
  });
  CardHeader.displayName = 'CardHeader';
  var CardHeader$1 = CardHeader;

  // This file is autogenerated. Any changes will be overwritten.
  const name$A = 'caret-down';
  const Component$A = () => (jsxRuntime.jsx("path", { d: 'M12.1476563,16.5726562 C12.1476563,16.5726562 3.2875,9.72421875 3.2875,9.72421875 C3.2875,9.72421875 3.14375,9.58046875 3.14375,9.58046875 C3.04765625,9.3890625 3,9.19765625 3,9.00546875 C3,9.00546875 3,9.00546875 3,9.00546875 C3,8.33515625 3.33515625,8 3.9578125,8 C3.9578125,8 3.9578125,8 3.9578125,8 C4.1015625,8 4.29296875,8.09609375 4.628125,8.2390625 C4.628125,8.2390625 4.628125,8.2390625 4.628125,8.2390625 C4.628125,8.2390625 12.8179688,14.2257813 12.8179688,14.2257813 C12.8179688,14.2257813 21.103125,8.19140625 21.103125,8.19140625 C21.3421875,8.04765625 21.534375,8 21.678125,8 C21.678125,8 21.678125,8 21.678125,8 C22.3007813,8 22.6359375,8.33515625 22.6359375,9.00546875 C22.6359375,9.00546875 22.6359375,9.00546875 22.6359375,9.00546875 C22.6359375,9.196875 22.5882813,9.38828125 22.4921875,9.58046875 C22.4921875,9.58046875 22.4921875,9.58046875 22.4921875,9.58046875 C22.4921875,9.58046875 22.3484375,9.72421875 22.3484375,9.72421875 C22.3484375,9.72421875 13.4882812,16.525 13.4882812,16.525 C13.296875,16.7164063 13.0570312,16.8125 12.8179688,16.8125 C12.8179688,16.8125 12.8179688,16.8125 12.8179688,16.8125 C12.5789062,16.8125 12.3867188,16.7164062 12.1476563,16.5734375 C12.1476563,16.5734375 12.1476563,16.5734375 12.1476563,16.5734375 L12.1476563,16.5726562 Z' }, void 0));
  const viewBox$A = '0 0 25 25';

  var caretDown = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$A,
    Component: Component$A,
    viewBox: viewBox$A
  });

  const StyledLabel = styled__default["default"].label(({ theme, labelHidden }) => {
      const color = tryCatch(() => {
          return rgba(readableColor(theme.base.palette['primary-background']), theme.base.transparency['transparent-3']);
      });
      const fontSize = calculateFontSize(theme.base['font-size'], theme.base['font-scale']);
      return labelHidden
          ? hideVisually
          : styled.css `
          max-width: max-content;
          font-size: ${fontSize[theme.components.label['font-size']]};
          font-weight: ${theme.base['font-weight']['semi-bold']};
          color: ${color};
        `;
  });
  StyledLabel.defaultProps = defaultThemeProp;
  const Label = React.forwardRef(({ children, labelHidden = false, htmlFor, ...restProps }, ref) => {
      return (jsxRuntime.jsx(StyledLabel, { ref: ref, labelHidden: labelHidden, htmlFor: htmlFor === '' ? undefined : htmlFor, ...restProps, children: children }, void 0));
  });
  var Label$1 = Label;

  const StyledStatusIcon = styled__default["default"](Icon$1)(({ theme, status }) => {
      return styled.css `
      height: 1em;
      width: 1em;
      color: ${theme.components['form-field'][status]['status-color']};
      vertical-align: baseline;
      margin-inline-end: 0.5ch;
    `;
  });
  StyledStatusIcon.defaultProps = defaultThemeProp;
  const StyledFormFieldInfo = styled__default["default"].div(({ status, theme: { base: { 'font-size': fontSize, 'font-scale': fontScale, spacing }, components: { 'form-field': formField } } }) => {
      const { xxs: infoFontSize } = calculateFontSize(fontSize, fontScale);
      return styled.css `
      max-width: max-content;
      margin-top: calc(0.25 * ${spacing});
      font-size: ${infoFontSize};
      word-break: break-word;
      ${status &&
        formField[status] &&
        styled.css `
        color: ${formField[status]['status-color']};
      `}
    `;
  });
  StyledFormFieldInfo.defaultProps = defaultThemeProp;
  const StyledFormField = styled__default["default"].div(props => {
      const { disabled, required, theme: { base: { palette: { urgent }, 'disabled-opacity': disabledOpacity, spacing } } } = props;
      return styled.css `
    ${disabled &&
        styled.css `
      opacity: ${disabledOpacity};
      -webkit-user-select: none;
      user-select: none;
    `}
    position: relative;
    border: 0;

    > ${StyledLabel} {
      margin-bottom: calc(0.25 * ${spacing});
      ${disabled &&
        styled.css `
        cursor: not-allowed;
      `}

      &::after {
        display: ${required ? 'inline' : 'none'};
        content: '\\00a0*';
        vertical-align: top;
        color: ${urgent};
      }
    }
  `;
  });
  StyledFormField.defaultProps = defaultThemeProp;
  const statusIconMap = { error: 'warn-solid', warning: 'warn', success: 'check' };
  const FormField = React.forwardRef((props, ref) => {
      const uid = useUID$1();
      const { children: controlElement, id = uid, as = 'div', label, labelAs = 'label', labelFor = id, labelId, labelHidden = false, labelAfter = false, info, status, charLimitDisplay, required = false, disabled = false, readOnly = false, inline = false, actions, container, ...restProps } = props;
      const labelAsLegend = labelAs === 'legend';
      const styledLabel = (jsxRuntime.jsxs(Label$1, { id: labelId, as: labelAs, htmlFor: labelAs === 'label' ? labelFor : undefined, labelHidden: labelHidden, onClick: (e) => {
              if (readOnly)
                  e.preventDefault();
          }, inline: inline, children: [status && !labelHidden && (jsxRuntime.jsx(StyledStatusIcon, { status: status, name: statusIconMap[status] }, void 0)), label] }, void 0));
      /*
        We have to use an internal state and an effect to set the text value of info after the DOM element is rendered.
        This is to ensure screen readers will announce info on errors when role is set to alert.
        Needs testing to confirm. Currently the expected sequence would be:
        - FormField renders with no error and no info
        - user input triggers an error status
        - props passed set error status and provide info text
        - effect runs and sets live region state which renders and is announced
      */
      const [liveRegionInfo, setLiveRegionInfo] = React.useState(null);
      React.useEffect(() => {
          setLiveRegionInfo(info);
      }, [info]);
      // fieldset or single form control element
      let content = labelAsLegend
          ? controlElement
          : React.cloneElement(controlElement, {
              'aria-describedby': info && `${id}-info`
          });
      if (actions) {
          content = (jsxRuntime.jsxs(Flex$1, { container: { alignItems: 'center', gap: 0.5 }, children: [content, jsxRuntime.jsx(Actions$1, { items: actions, menuAt: 3 }, void 0)] }, void 0));
      }
      let infoContent = info ? (
      /*
        Region for additional info, help or error message.
        Withholding aria-live="assertive" to avoid iOS issue. See below.
        https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions#Preferring_specialized_live_region_roles
      */
      jsxRuntime.jsx(StyledFormFieldInfo, { status: status, role: status === 'error' || status === 'warning' ? 'alert' : undefined, id: `${id}-info`, children: liveRegionInfo }, void 0)) : undefined;
      if (charLimitDisplay) {
          infoContent = (jsxRuntime.jsxs(Flex$1, { container: { justify: infoContent ? 'between' : 'end', gap: 1 }, children: [infoContent, jsxRuntime.jsx(Flex$1, { item: { shrink: 0 }, children: charLimitDisplay }, void 0)] }, void 0));
      }
      return (jsxRuntime.jsxs(Flex$1, { ...restProps, container: {
              direction: inline ? 'row' : 'column',
              alignItems: inline ? 'center' : undefined,
              ...container
          }, as: StyledFormField, id: `${id}-field`, forwardedAs: as, required: required, disabled: disabled, readOnly: readOnly, "aria-describedby": labelAsLegend && info ? `${id}-info` : undefined, ref: ref, children: [(labelAsLegend || !labelAfter) && styledLabel, content, !labelAsLegend && labelAfter && styledLabel, infoContent] }, void 0));
  });
  var FormField$1 = FormField;

  const StyledFormControl = styled__default["default"].div(props => {
      const { theme: { base: { 'border-radius': baseRadius, 'font-size': baseFontSize, 'font-scale': baseFontScale }, components: { 'form-field': formField, 'form-control': { 'foreground-color': foreground, 'background-color': background, 'border-color': brd, 'border-radius': radius, 'border-width': borderWidth, ':hover': { 'border-color': hoverBorderColor }, ':focus': { 'border-color': focusBorderColor, 'box-shadow': shadow }, ':disabled': { 'border-color': disabledBorderColor, 'background-color': disabledBackgroundColor }, ':read-only': { 'border-color': readOnlyBorderColor, 'background-color': readOnlyBackgroundColor } } } }, status } = props;
      const fontSize = calculateFontSize(baseFontSize, baseFontScale);
      const borderColor = status && formField[status] ? formField[status]['status-color'] : brd;
      return styled.css `
    color: ${foreground};
    background-color: ${background};
    border-radius: calc(${baseRadius} * ${radius});
    border-color: ${borderColor};
    border-width: ${borderWidth};
    border-style: solid;
    &,
    & > select {
      outline: none;
    }

    &:disabled,
    &[disabled] {
      background-color: ${disabledBackgroundColor};
      border-color: ${disabledBorderColor};
      cursor: not-allowed;
    }

    &:focus:not([disabled]) {
      border-color: ${focusBorderColor};
      box-shadow: ${shadow};
    }

    ${!status &&
        styled.css `
      &:hover:not([readonly]):not([disabled]):not(:focus) {
        border-color: ${hoverBorderColor};
      }
    `}

    &[readonly] {
      background-color: ${readOnlyBackgroundColor};
      border-color: ${readOnlyBorderColor};
    }

    @media (pointer: coarse) {
      /* stylelint-disable-next-line unit-allowed-list */
      font-size: max(${fontSize.s}, 16px);
    }
  `;
  });
  StyledFormControl.defaultProps = defaultThemeProp;
  React.forwardRef((props, ref) => {
      return jsxRuntime.jsx(StyledFormControl, { ref: ref, ...props }, void 0);
  });

  const StyledPseudoRadioCheck = styled__default["default"].div(props => {
      const { theme: { base: { spacing, palette: { 'primary-background': primaryBackground } }, components: { 'form-field': formField, 'radio-check': { size, 'touch-size': touchSize, 'background-color': backgroundColor, 'border-color': borderColor, 'border-width': borderWidth } } }, status } = props;
      const useBorderColor = status === 'error' ? formField.error['status-color'] : borderColor;
      const useBackgroundColor = status && formField[status]
          ? tryCatch(() => mix$1(0.8, primaryBackground, formField[status]['status-color']))
          : backgroundColor;
      return styled.css `
      display: flex;
      flex-shrink: 0;
      position: relative;
      width: ${size};
      height: ${size};
      margin-inline-end: calc(${spacing} / 2);
      border: ${borderWidth} solid ${useBorderColor};
      background-color: ${useBackgroundColor};

      @media (pointer: coarse) {
        width: ${touchSize};
        height: ${touchSize};
      }

      &::after {
        content: '';
        display: none;
      }
    `;
  });
  StyledPseudoRadioCheck.defaultProps = defaultThemeProp;
  const StyledRadioCheckInput = styled__default["default"].input(props => {
      const { theme: { base: { 'border-radius': baseBorderRadius }, components: { 'form-control': { ':focus': { 'box-shadow': shadow, 'border-color': focusBorderColor }, ':read-only': { 'background-color': readOnlyBackgroundColor } }, 'radio-check': { ':checked': { 'background-color': checkedBackgroundColor, 'border-color': checkedBorderColor } }, checkbox: { 'border-radius': checkRadius }, 'radio-button': { 'border-radius': radioRadius } } } } = props;
      const backgroundColor = props.readOnly ? readOnlyBackgroundColor : checkedBackgroundColor;
      const foreground = tryCatch(() => readableColor(backgroundColor));
      const prcSelector = `+ ${StyledLabel} ${StyledPseudoRadioCheck}`;
      const { ltr } = useDirection$1();
      return styled.css `
    ${hideVisually}

    ${!(props.disabled || props.readOnly) &&
        styled.css `
      &:focus ${prcSelector} {
        box-shadow: ${shadow};
        border-color: ${focusBorderColor};
      }
    `}

    &:checked
      ${prcSelector},
      &:checked:disabled
      ${prcSelector},
      &[type='checkbox']:indeterminate
      ${prcSelector},
      &[type='checkbox']:indeterminate:disabled
      ${prcSelector} {
      border-color: ${props.readOnly ? 'inherit' : checkedBorderColor};
      background-color: ${backgroundColor};

      &::after {
        display: block;
      }
    }

    &[type='radio'] ${prcSelector}, &[type='radio'] ${prcSelector}::after {
      border-radius: ${radioRadius};
    }

    &[type='radio'] ${prcSelector}::after {
      margin: auto;
      width: 100%;
      height: 100%;
      background-color: ${foreground};
      transform: scale(0.4);
    }

    &[type='checkbox'] ${prcSelector} {
      border-radius: min(calc(${baseBorderRadius} * ${checkRadius}), 0.25rem);
    }

    &[type='checkbox']:not(:indeterminate) ${prcSelector} {
      &::after {
        width: 40%;
        height: 75%;
        ${ltr
        ? styled.css `
              transform: rotate(45deg) translate(50%, -30%);
            `
        : styled.css `
              transform: rotate(45deg) translate(-50%, 30%);
            `}
        border-right: 0.15em solid ${foreground};
        border-bottom: 0.15em solid ${foreground};
      }
    }

    &[type='checkbox']:indeterminate ${prcSelector} {
      display: flex;
      &::after {
        width: 90%;
        height: 0.15em;
        margin: auto;
        background-color: ${foreground};
      }
    }
  `;
  });
  StyledRadioCheckInput.defaultProps = defaultThemeProp;
  const StyledRadioCheck = styled__default["default"].div(props => {
      const { disabled, readOnly, theme: { base, components: { 'radio-check': { label: { color: labelColor, 'font-weight': labelFontWeight } }, 'form-control': { ':hover': { 'border-color': hoverBorderColor } } } } } = props;
      const fontSize = calculateFontSize(base['font-size'], base['font-scale']);
      return styled.css `
      > ${StyledLabel} {
        cursor: pointer;
        display: flex;
        align-items: center;
        font-weight: ${labelFontWeight};
        word-break: break-word;
        font-size: ${fontSize.s};
        color: ${labelColor};
        margin: 0;
        min-height: ${base['hit-area']['mouse-min']};

        @media (pointer: coarse) {
          min-height: ${base['hit-area']['finger-min']};
        }
      }

      ${!(disabled || readOnly) &&
        styled.css `
        &:not(:focus-within) > ${StyledLabel}:hover ${StyledPseudoRadioCheck} {
          border-color: ${hoverBorderColor};
        }
      `}
    `;
  });
  StyledRadioCheck.defaultProps = defaultThemeProp;
  const StyledRadioCheckCard = styled__default["default"].label(({ disabled, readOnly, status, theme: { base: { palette, shadow, spacing }, components: { card, 'form-field': formField, 'radio-check': { label }, 'form-control': { ':hover': { 'border-color': hoverBorderColor } } } } }) => {
      const useBorderColor = status === 'error' ? formField.error['status-color'] : palette['border-line'];
      return styled.css `
      min-width: min-content;
      align-items: start;
      cursor: pointer;
      background-color: ${card.background};
      border-radius: ${card['border-radius']};
      border: 0.0625rem solid ${useBorderColor};
      padding: ${spacing};

      ${disabled &&
        styled.css `
        cursor: not-allowed;
      `}

      ${!(disabled || readOnly) &&
        styled.css `
        :hover:not(:focus-within) {
          border-color: ${hoverBorderColor};
          ${StyledLabel} ${StyledPseudoRadioCheck} {
            border-color: ${hoverBorderColor};
          }
        }

        :focus-within {
          box-shadow: ${shadow.focus};
          border-color: transparent;
        }
      `}

    > ${StyledLabel} {
        display: grid;
        grid-template-columns: auto 1fr;
        color: ${label.color};
        font-weight: ${label['font-weight']};
      }
    `;
  });
  StyledRadioCheckCard.defaultProps = defaultThemeProp;
  const RadioCheck = React.forwardRef((props, ref) => {
      const uid = useUID$1();
      const { type, id = uid, label, required = false, disabled = false, indeterminate = false, readOnly = false, variant = 'simple', onClick, onKeyDown, status, ...restProps } = props;
      const isRadio = type === 'radio';
      const card = variant === 'card';
      const newRef = useConsolidatedRef$1(ref);
      React.useEffect(() => {
          if (!isRadio && newRef.current) {
              newRef.current.indeterminate = !!indeterminate;
          }
      }, [newRef, indeterminate, isRadio]);
      return (jsxRuntime.jsx(FormField$1, { as: card ? StyledRadioCheckCard : StyledRadioCheck, label: jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(StyledPseudoRadioCheck, { status: status, isRadio: isRadio, as: StyledFormControl, required: required, disabled: disabled, readOnly: readOnly }, void 0), label] }, void 0), labelAs: card ? 'div' : undefined, id: id, required: required, disabled: disabled, readOnly: readOnly, status: status, inline: true, labelAfter: true, children: jsxRuntime.jsx(StyledRadioCheckInput, { ...restProps, id: id, type: type, required: required, disabled: disabled, readOnly: readOnly, "aria-readonly": readOnly, onClick: (e) => {
                  if (readOnly)
                      e.preventDefault();
                  onClick?.(e);
              }, onKeyDown: (e) => {
                  if (type === 'checkbox' && readOnly && e.key === ' ') {
                      e.preventDefault();
                  }
                  if (type === 'radio' && readOnly && e.key.includes('Arrow')) {
                      e.preventDefault();
                  }
                  onKeyDown?.(e);
              }, ref: newRef }, void 0) }, void 0));
  });
  var RadioCheck$1 = RadioCheck;

  const AppShellContext = React.createContext({
      navOpen: false,
      navState: 'closed',
      drawerOpen: false,
      setDrawerOpen: () => { },
      refocusEl: null,
      setRefocusEl: () => { },
      focusedImperatively: {
          get current() {
              return false;
          }
      },
      headerEl: null,
      previewTriggerRef: {
          get current() {
              return null;
          },
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          set current(val) { }
      }
  });
  var AppShellContext$1 = AppShellContext;

  const StyledLinkPopover = styled__default["default"].div `
  background-color: ${props => props.theme.components.tooltip['background-color']};
`;
  StyledLinkPopover.defaultProps = defaultThemeProp;
  const StyledLinkPopoverBtn = styled__default["default"](BareButton$1)(({ theme }) => {
      const contrastColor = tryCatch(() => readableColor(theme.base.palette.interactive));
      const fontSize = calculateFontSize(theme.base['font-size'], theme.base['font-scale']);
      return styled.css `
    position: relative;
    display: inline-flex;
    align-items: center;
    z-index: 1;
    padding: 0 ${theme.base.spacing};
    min-height: 1.5rem;
    line-height: 1;
    color: ${contrastColor};
    font-size: ${fontSize.xs};
    text-decoration: none;

    /* FIXME: Button selector specificity... */
    & + & {
      margin: 0;
    }

    & + &::before {
      content: '';
      position: absolute;
      inset-inline-start: 0;
      inset-block: 0;
      width: 1px; /* stylelint-disable-line unit-allowed-list */
      background-color: ${contrastColor};
      opacity: ${theme.base.transparency['transparent-3']};
    }

    &:hover,
    &:active {
      text-decoration: underline;
    }

    &:focus {
      box-shadow: inset 0 0 0 0.0625rem ${theme.base.palette.light},
        0 0 0.125rem 0.0625rem ${theme.base.palette.interactive};
    }
  `;
  });
  StyledLinkPopoverBtn.defaultProps = defaultThemeProp;
  const StyledLink = styled__default["default"](Button$1) ``;
  StyledLink.defaultProps = defaultThemeProp;
  const Link = React.forwardRef(({ href, variant = 'link', previewable, onPreview, ...restProps }, ref) => {
      const { ModalContext } = React.useContext(ModalManagerContext);
      const { [modalInitializedKey]: inModal } = React.useContext(ModalContext);
      const { previewTriggerRef } = React.useContext(AppShellContext$1);
      const uid = useUID$1();
      const linkRef = useConsolidatedRef$1(ref);
      const [popover, setPopover] = React.useState(false);
      const previewBtnRef = React.useRef(null);
      const openInTabBtnRef = React.useRef(null);
      const isSmallOrAbove = useBreakpoint$1('sm');
      const t = useI18n$1();
      const openPopover = () => {
          if (isSmallOrAbove)
              setPopover(true);
      };
      const closePopover = () => {
          setPopover(false);
      };
      const onKeyUp = (event) => {
          if (event.keyCode === 27) {
              closePopover();
          }
          if (event.keyCode === 38 || event.keyCode === 40) {
              previewBtnRef?.current?.focus();
          }
          if (event.keyCode === 37 || event.keyCode === 39) {
              if (previewBtnRef.current === document.activeElement) {
                  openInTabBtnRef?.current?.focus();
              }
              else {
                  previewBtnRef?.current?.focus();
              }
          }
      };
      const onEnterLink = () => {
          if (previewable)
              openPopover();
      };
      const onPreviewClick = () => {
          previewTriggerRef.current = linkRef.current;
          onPreview?.({ href });
      };
      return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(StyledLink, { href: href, variant: variant, ref: linkRef, ...restProps, onMouseEnter: onEnterLink, onMouseLeave: closePopover, onFocus: onEnterLink, onKeyUp: onKeyUp, onBlur: closePopover, "aria-describedby": previewable ? `${uid}-preview-instructions` : undefined }, void 0), jsxRuntime.jsxs(Popover$1, { show: popover, groupId: 'link_preview', showDelay: 'short', hideDelay: 'short', placement: 'bottom', target: linkRef.current, onMouseEnter: openPopover, onMouseLeave: closePopover, as: StyledLinkPopover, arrow: true, children: [!inModal && (jsxRuntime.jsx(StyledLinkPopoverBtn, { preview: true, type: 'button', ref: previewBtnRef, onClick: onPreviewClick, tabIndex: '-1', onFocus: openPopover, onBlur: closePopover, onKeyUp: onKeyUp, children: t('preview') }, void 0)), jsxRuntime.jsx(StyledLinkPopoverBtn, { forwardedAs: 'a', href: href, ref: openInTabBtnRef, target: '_blank', rel: 'noreferrer', tabIndex: '-1', onFocus: openPopover, onBlur: closePopover, onKeyUp: onKeyUp, children: t('link_open_in_tab_text') }, void 0)] }, void 0), previewable && (jsxRuntime.jsx(VisuallyHiddenText$1, { id: `${uid}-preview-instructions`, children: t('preview_link_arrow_navigation') }, void 0))] }, void 0));
  });
  var Link$1 = Link;

  const StyledInput = styled__default["default"].input(({ theme: { base, components } }) => {
      return styled.css `
    width: 100%;
    height: ${components.input.height};
    min-height: ${base['hit-area']['mouse-min']};
    padding: 0 ${components.input.padding};
    appearance: none;
    -webkit-appearance: none;
    text-align: inherit;

    @media (pointer: coarse) {
      min-height: ${base['hit-area']['finger-min']};
    }
  `;
  });
  StyledInput.defaultProps = defaultThemeProp;
  var StyledInput$1 = StyledInput;

  const Input = React.forwardRef((props, ref) => {
      const uid = useUID$1();
      const { id = uid, value, defaultValue, required = false, disabled = false, label, labelHidden, info, status, actions, ...restProps } = props;
      const controlProp = {};
      // Conditionally render component as controlled/uncontrolled
      if (hasProp(props, 'value')) {
          controlProp.value = value ?? '';
      }
      else if (hasProp(props, 'defaultValue')) {
          controlProp.defaultValue = defaultValue ?? '';
      }
      const Comp = (jsxRuntime.jsx(StyledFormControl, { ...{
              ref,
              id,
              required,
              disabled,
              status,
              ...controlProp,
              ...restProps,
              as: StyledInput$1
          } }, void 0));
      return label ? (jsxRuntime.jsx(FormField$1, { ...{ label, labelHidden, id, info, status, required, disabled, actions }, children: Comp }, void 0)) : (Comp);
  });
  var Input$1 = Input;

  // This file is autogenerated. Any changes will be overwritten.
  const name$z = 'search';
  const Component$z = () => (jsxRuntime.jsx("path", { d: 'M18.4804688,17.0445312 C18.4804688,17.0445312 23.365625,21.9296875 23.365625,21.9296875 C23.365625,21.9296875 23.4132813,22.0734375 23.4132813,22.0734375 C23.5570313,22.3125 23.6046875,22.5046875 23.6046875,22.6 C23.6046875,22.6 23.6046875,22.6 23.6046875,22.6 C23.6046875,23.2703125 23.2695312,23.6054688 22.5992188,23.6054688 C22.5992188,23.6054688 22.5992188,23.6054688 22.5992188,23.6054688 C22.4078125,23.6054688 22.1679688,23.509375 21.9289063,23.3179687 C21.9289063,23.3179687 21.9289063,23.3179687 21.9289063,23.3179687 C21.9289063,23.3179687 17.0914063,18.4804688 17.0914063,18.4804688 C15.271875,19.9648438 13.2117188,20.6835938 10.865625,20.6835938 C10.865625,20.6835938 10.865625,20.6835938 10.865625,20.6835938 C8.1359375,20.6835938 5.83671875,19.7257813 3.92109375,17.8101562 C3.92109375,17.8101562 3.92109375,17.8101562 3.92109375,17.8101562 C1.9578125,15.846875 1,13.5476563 1,10.865625 C1,8.18359375 1.9578125,5.88515625 3.92109375,3.92109375 C5.884375,1.9578125 8.18359375,1 10.865625,1 C13.5476563,1 15.8460937,1.9578125 17.8101563,3.92109375 C17.8101563,3.92109375 17.8101563,3.92109375 17.8101563,3.92109375 C19.7257812,5.83671875 20.6835938,8.1359375 20.6835938,10.865625 C20.6835938,10.865625 20.6835938,10.865625 20.6835938,10.865625 C20.6835938,13.1648438 19.9648438,15.2242188 18.4804688,17.04375 C18.4804688,17.04375 18.4804688,17.04375 18.4804688,17.04375 L18.4804688,17.0445312 Z M10.9132812,18.7203125 C13.06875,18.7203125 14.8882812,17.9539062 16.4210937,16.4210937 C17.9539062,14.8882812 18.7203125,13.06875 18.7203125,10.9132812 C18.7203125,10.9132812 18.7203125,10.9132812 18.7203125,10.9132812 C18.7203125,8.7578125 17.9539062,6.890625 16.4210937,5.3578125 C14.8882812,3.825 13.06875,3.05859375 10.9132812,3.05859375 C10.9132812,3.05859375 10.9132812,3.05859375 10.9132812,3.05859375 C8.7578125,3.05859375 6.890625,3.825 5.3578125,5.3578125 C3.825,6.890625 3.05859375,8.75859375 3.05859375,10.9132812 C3.05859375,10.9132812 3.05859375,10.9132812 3.05859375,10.9132812 C3.05859375,13.06875 3.825,14.8882812 5.3578125,16.4210937 C6.890625,17.9539062 8.7578125,18.7203125 10.9132812,18.7203125 C10.9132812,18.7203125 10.9132812,18.7203125 10.9132812,18.7203125 Z' }, void 0));
  const viewBox$z = '0 0 25 25';

  var search = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$z,
    Component: Component$z,
    viewBox: viewBox$z
  });

  registerIcon(search);
  const StyledSearchIcon = styled__default["default"].div(props => {
      const { theme: { base, components: { 'search-input': searchInput, 'form-control': formControl } } } = props;
      const iconColor = tryCatch(() => curriedTransparentize$1(0.75, base.palette['foreground-color']));
      return styled.css `
    position: absolute;
    z-index: 1;
    inset-inline-start: 0.0625rem;
    top: 0.0625rem;
    width: calc(${base['hit-area']['mouse-min']} - 0.125rem);
    height: calc(${base['hit-area']['mouse-min']} - 0.125rem);
    border-radius: calc(${base['border-radius']} * ${searchInput['border-radius']});
    padding: 0;
    background: ${formControl['background-color']};
    color: ${iconColor};
    cursor: text;
    line-height: 1;
  `;
  });
  StyledSearchIcon.defaultProps = defaultThemeProp;
  const StyledSearchTextInput = styled__default["default"](Input$1)(props => {
      const { theme } = props;
      const comp = theme.components['search-input'];
      return styled.css `
    position: relative;
    width: 100%;
    height: ${theme.base['hit-area']['mouse-min']};
    min-height: ${theme.base['hit-area']['mouse-min']};
    padding-inline-start: 0;
    padding-inline-end: calc(${theme.base['hit-area']['mouse-min']} - 0.125rem);
    text-indent: calc(${theme.base['hit-area']['mouse-min']} - 0.125rem);
    border-radius: calc(${comp['border-radius']} * ${theme.base['border-radius']});
    &::-ms-clear {
      display: none;
    }
    &::-webkit-search-cancel-button {
      display: none;
    }
    ::-webkit-search-decoration {
      -webkit-appearance: none;
    }

    &:focus:not([disabled]) {
      box-shadow: none;
    }
  `;
  });
  StyledSearchTextInput.defaultProps = defaultThemeProp;
  const StyledSearchInput = styled__default["default"].div(({ theme: { base, components } }) => {
      const iconColor = tryCatch(() => curriedTransparentize$1(0.3, base.palette['foreground-color']));
      return styled.css `
    position: relative;
    height: ${base['hit-area']['mouse-min']};
    border-radius: calc(${components['search-input']['border-radius']} * ${base['border-radius']});

    &:focus-within {
      box-shadow: ${base.shadow.focus};

      ${StyledSearchIcon} {
        color: ${iconColor};
      }
    }
  `;
  });
  StyledSearchInput.defaultProps = defaultThemeProp;
  const SearchInput = React.forwardRef((props, ref) => {
      const t = useI18n$1();
      const { defaultValue, value, placeholder = t('search_placeholder_default'), onSearchChange, onSearchSubmit, searchInputAriaLabel, ...restProps } = props;
      const [searchInputValue, setValue] = React.useState(value || defaultValue || '');
      const innerRef = useConsolidatedRef$1(ref);
      React.useEffect(() => {
          if (typeof value === 'string' && value !== searchInputValue) {
              setValue(value);
          }
      }, [value]);
      const onChange = React.useCallback((e) => {
          setValue(e.target.value);
      }, [searchInputValue]);
      const onSubmit = React.useCallback(() => {
          onSearchSubmit?.(searchInputValue);
      }, [searchInputValue]);
      const onKeyDown = React.useCallback((e) => {
          if (e.key === 'Enter') {
              onSubmit();
          }
      }, [searchInputValue]);
      useAfterInitialEffect$1(() => {
          if (onSearchChange)
              onSearchChange(searchInputValue);
      }, [searchInputValue]);
      return (jsxRuntime.jsxs(Flex$1, { container: true, as: StyledSearchInput, children: [jsxRuntime.jsx(StyledSearchTextInput, { ref: innerRef, type: 'search', "aria-label": searchInputAriaLabel, placeholder: placeholder, ...restProps, value: searchInputValue, onChange: onChange, onKeyDown: onKeyDown }, void 0), jsxRuntime.jsx(Flex$1, { as: StyledSearchIcon, container: { justify: 'center', alignItems: 'center' }, onClick: () => {
                      innerRef.current?.focus();
                  }, children: jsxRuntime.jsx(Icon$1, { name: 'search' }, void 0) }, void 0)] }, void 0));
  });
  var SearchInput$1 = SearchInput;

  // Odd issue with SB doc prop table not being generated when called Checkbox...so using CB
  const CB = React.forwardRef((props, ref) => (jsxRuntime.jsx(RadioCheck$1, { ...props, type: 'checkbox', ref: ref }, void 0)));
  // Adding here for doc purposes only
  CB.defaultProps = RadioCheck$1.defaultProps;
  var Checkbox = CB;

  // This file is autogenerated. Any changes will be overwritten.
  const name$y = 'caret-up';
  const Component$y = () => (jsxRuntime.jsx("path", { d: 'M13.4882812,8.23984375 C13.4882812,8.23984375 22.3484375,15.0882812 22.3484375,15.0882812 C22.3484375,15.0882812 22.4921875,15.2320313 22.4921875,15.2320313 C22.5882813,15.4234375 22.6359375,15.6148437 22.6359375,15.8070313 C22.6359375,15.8070313 22.6359375,15.8070313 22.6359375,15.8070313 C22.6359375,16.4773438 22.3007813,16.8125 21.678125,16.8125 C21.678125,16.8125 21.678125,16.8125 21.678125,16.8125 C21.534375,16.8125 21.3429688,16.7164062 21.0078125,16.5734375 C21.0078125,16.5734375 21.0078125,16.5734375 21.0078125,16.5734375 C21.0078125,16.5734375 12.8179688,10.5867187 12.8179688,10.5867187 C12.8179688,10.5867187 4.5328125,16.6210938 4.5328125,16.6210938 C4.29375,16.7648438 4.1015625,16.8125 3.9578125,16.8125 C3.9578125,16.8125 3.9578125,16.8125 3.9578125,16.8125 C3.33515625,16.8125 3,16.4773438 3,15.8070313 C3,15.8070313 3,15.8070313 3,15.8070313 C3,15.615625 3.04765625,15.4242188 3.14375,15.2320313 C3.14375,15.2320313 3.14375,15.2320313 3.14375,15.2320313 C3.14375,15.2320313 3.2875,15.0882812 3.2875,15.0882812 C3.2875,15.0882812 12.1476563,8.2875 12.1476563,8.2875 C12.3390625,8.09609375 12.5789062,8 12.8179688,8 C12.8179688,8 12.8179688,8 12.8179688,8 C13.0570312,8 13.2492188,8.09609375 13.4882812,8.2390625 C13.4882812,8.2390625 13.4882812,8.2390625 13.4882812,8.2390625 L13.4882812,8.23984375 Z' }, void 0));
  const viewBox$y = '0 0 25 25';

  var caretUp = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$y,
    Component: Component$y,
    viewBox: viewBox$y
  });

  // eslint-disable-next-line import/prefer-default-export
  const sameWidth = Object.freeze({
      name: 'sameWidth',
      enabled: true,
      phase: 'beforeWrite',
      fn({ state }) {
          state.styles.popper.width = `${state.rects.reference.width}px`;
      },
      requires: ['computeStyles']
  });

  const StyledSelectInput = styled__default["default"].div(({ theme: { base, components } }) => {
      return styled.css `
    @media (pointer: coarse) {
      min-height: ${base['hit-area']['finger-min']};
    }

    &:focus-within {
      border-color: ${components['form-control'][':focus']['border-color']};
      box-shadow: ${components['form-control'][':focus']['box-shadow']};
    }

    &:hover:not([readonly]):not([disabled]):focus-within {
      border-color: transparent;
    }

    input {
      min-width: 0;
      width: 100%;
      height: calc(${components.input.height} - 2 * ${components['form-control']['border-width']});
      color: ${components['form-control']['foreground-color']};
      text-overflow: ellipsis;
      margin-inline-start: ${base.spacing};
    }

    input,
    input:focus {
      border: none;
      outline: none;
      flex-grow: 1;
      background-color: transparent;

      &:read-only {
        cursor: default;
      }
    }

    & > ${StyledButton} {
      align-self: stretch;
      height: auto;
      margin-block: -0.0625rem;
      margin-inline-end: -0.0625rem;
      border-start-start-radius: 0;
      border-start-end-radius: calc(
        ${base['border-radius']} * ${components['form-control']['border-radius']}
      );
      border-end-start-radius: 0;
      border-end-end-radius: calc(
        ${base['border-radius']} * ${components['form-control']['border-radius']}
      );
    }
  `;
  });
  StyledSelectInput.defaultProps = defaultThemeProp;
  const StyledComboBox = styled__default["default"](StyledFormControl)(() => {
      return styled.css `
    border: 0;

    ${StyledPopover} {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  `;
  });
  StyledComboBox.defaultProps = defaultThemeProp;

  const StyledSingleSelectInput = styled__default["default"](StyledSelectInput) ``;
  const StyledVisualContainer = styled__default["default"].span(props => {
      const { theme: { base, components: { 'form-control': formControl, input: { height } } } } = props;
      return styled.css `
    border-inline-end: ${formControl['border-width']} solid ${formControl['border-color']};
    min-width: calc(${height} - ${formControl['border-width']});
    padding: 0 calc(0.5 * ${base.spacing});
    height: calc(${height} - 2 * ${formControl['border-width']});
  `;
  });
  StyledVisualContainer.defaultProps = defaultThemeProp;
  const SingleSelectInput = React.forwardRef((props, ref) => {
      const { value, readOnly, disabled, status, actions, onChange, selected, visual, ...restProps } = props;
      return (jsxRuntime.jsxs(Flex$1, { as: StyledSingleSelectInput, forwardedAs: StyledFormControl, container: { alignItems: 'center', wrap: 'nowrap' }, ...{
              disabled,
              status,
              readOnly
          }, children: [visual && (jsxRuntime.jsx(Flex$1, { container: { justify: 'center', alignItems: 'center' }, as: StyledVisualContainer, children: visual }, void 0)), jsxRuntime.jsx("input", { ...{
                      ref,
                      disabled,
                      status,
                      readOnly
                  }, value: value || selected?.text || '', 
                  // no-op avoids react uncontrolled warning
                  onChange: onChange || (() => { }), readOnly: readOnly || !onChange, autoComplete: 'off', ...restProps }, void 0), actions] }, void 0));
  });
  var SingleSelectInput$1 = SingleSelectInput;

  const StyledMultiSelectInput = styled__default["default"](StyledSelectInput)(({ theme }) => {
      return styled.css `
    ul {
      list-style: none;
    }

    ${StyledSelectable} {
      margin: calc(0.25 * ${theme.base.spacing});
    }
  `;
  });
  StyledMultiSelectInput.defaultProps = defaultThemeProp;
  const MultiSelectInput = React.forwardRef((props, ref) => {
      const { selected = [], value, onRemove, onChange, onKeyDown, actions, readOnly, disabled, status, placeholder, autoFocus, ...restProps } = props;
      const inputRef = useConsolidatedRef$1(ref);
      const listRef = React.useRef(null);
      useArrows$1(listRef, { selector: 'div[role="button"], input', cycle: false, dir: 'left-right' });
      const onInputKeyDown = React.useCallback((e) => {
          const lastIndex = selected.length - 1;
          if (e.key === 'Backspace' && !value && selected.length > 0) {
              onRemove?.(selected[lastIndex].id, lastIndex);
          }
          onKeyDown?.(e);
      }, [onKeyDown, value, selected]);
      const { end } = useDirection$1();
      return (jsxRuntime.jsxs(Flex$1, { as: StyledMultiSelectInput, forwardedAs: StyledFormControl, container: { alignItems: 'center' }, ...{
              readOnly,
              disabled,
              status
          }, children: [jsxRuntime.jsxs(Flex$1, { ref: listRef, as: 'ul', item: { grow: 1 }, container: { alignItems: 'center', wrap: 'wrap' }, onBlur: () => {
                      listRef.current?.querySelectorAll('div[role="button"]').forEach(el => {
                          el.tabIndex = -1;
                      });
                      if (inputRef.current)
                          inputRef.current.tabIndex = 0;
                  }, children: [selected.map((element, idx) => {
                          return (jsxRuntime.jsx("li", { children: jsxRuntime.jsx(Selectable$1, { id: element.id.toString(), disabled: readOnly || disabled, status: status, onRemove: id => {
                                      onRemove?.(id, idx);
                                      inputRef.current?.focus();
                                  }, onKeyDown: (e) => {
                                      // prevent browser's Back on FF
                                      if (e.key === 'Backspace')
                                          e.preventDefault();
                                      if (idx === selected.length - 1 && e.key === `Arrow${cap(end)}`)
                                          inputRef.current?.focus();
                                  }, children: element.text }, void 0) }, element.id));
                      }), jsxRuntime.jsx(Flex$1, { as: 'li', item: { grow: 1 }, container: true, children: jsxRuntime.jsx("input", { size: 5, ref: inputRef, value: value, 
                              // no-op avoids react uncontrolled warning
                              onChange: onChange || (() => { }), onKeyDown: onInputKeyDown, readOnly: readOnly || !onChange, placeholder: selected?.length ? undefined : placeholder, autoComplete: 'off', 
                              // eslint-disable-next-line jsx-a11y/no-autofocus
                              autoFocus: autoFocus, ...restProps }, void 0) }, void 0)] }, void 0), actions] }, void 0));
  });
  var MultiSelectInput$1 = MultiSelectInput;

  const ComboBoxInput = React.forwardRef((props, ref) => {
      const { value, mode, selected, visual, onRemove, ...restProps } = props;
      return mode === 'multi-select' ? (jsxRuntime.jsx(MultiSelectInput$1, { selected: selected, value: value, ...{
              ref,
              onRemove
          }, ...restProps }, void 0)) : (jsxRuntime.jsx(SingleSelectInput$1, { ref: ref, selected: selected, value: value, visual: visual, ...restProps }, void 0));
  });
  var ComboBoxInput$1 = ComboBoxInput;

  registerIcon(caretDown, caretUp);
  const isMobile = navigatorIsAvailable && navigator.userAgent.includes('Mobile');
  const ComboBox = React.forwardRef((props, ref) => {
      const uid = useUID$1();
      const { value, required, id = uid, label, labelHidden, info, status, readOnly, disabled, mode = 'single-select', selected, onChange, actions, onFocus, onBlur, onDropdownButtonClick: onDropdownButtonClickProp, onClick, menu, ...restProps } = props;
      const t = useI18n$1();
      const inputRef = React.useRef(null);
      const [open, setOpen] = React.useState(false);
      const menuRef = React.useRef(null);
      const menuComponentId = `${id}-listbox`;
      // Force a re-render to make sure useFocusWithin has valid elements to set listeners on.
      const [, setContainerEl] = useElement$1();
      const containerRef = useConsolidatedRef$1(ref, setContainerEl);
      const focus = useFocusWithin$1([containerRef], focused => {
          if (!focused) {
              setOpen(false);
              onBlur?.(selected?.items);
          }
          else {
              onFocus?.(selected?.items);
              if (isMobile) {
                  setTimeout(() => {
                      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 150); // delay it to let keyboard expand first
              }
          }
      });
      const onInputKeyDown = React.useCallback((e) => {
          if (!menu || readOnly)
              return;
          switch (e.key) {
              case 'ArrowDown':
                  e.preventDefault();
                  if (!open)
                      setOpen(true);
                  break;
              case 'Escape':
                  e.preventDefault();
                  if (open)
                      e.stopPropagation();
                  setOpen(false);
                  break;
          }
      }, [open, readOnly, menu, value]);
      const onDropdownButtonClick = React.useCallback(() => {
          onDropdownButtonClickProp?.(!open);
          setOpen(!open);
      }, [open, onDropdownButtonClickProp]);
      const dropdownButton = React.useMemo(() => {
          return (menu?.items?.length || onDropdownButtonClickProp || !onChange) && !readOnly ? (jsxRuntime.jsx(Button$1, { "aria-hidden": 'true', "aria-label": t(open ? 'combobox_close_list_button_a11y' : 'combobox_open_list_button_a11y'), icon: true, variant: 'simple', onClick: onDropdownButtonClick, onMouseDown: (e) => {
                  e.preventDefault();
                  inputRef.current?.focus();
              }, disabled: disabled, tabIndex: '-1', children: jsxRuntime.jsx(Icon$1, { name: open ? 'caret-up' : 'caret-down' }, void 0) }, void 0)) : null;
      }, [onDropdownButtonClick, onChange, readOnly, open, disabled]);
      const onInputClick = React.useCallback((e) => {
          if (readOnly)
              return;
          setOpen(true);
          onClick?.(e);
      }, [readOnly, onClick]);
      React.useEffect(() => {
          if (focus && menu && value && value.length > 0) {
              setOpen(true);
          }
      }, [menu, value, focus]);
      // Workaround for the following error from jsx-ast-utils, fixed in version 3.5.0.
      // The prop value with an expression type of JSXFragment could not be resolved. Please file issue to get this fixed immediately.
      const inputActions = (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [dropdownButton, actions] }, void 0));
      const Comp = (jsxRuntime.jsxs(StyledComboBox, { ref: containerRef, as: StyledFormControl, id: `${id}-combobox`, children: [jsxRuntime.jsx(ComboBoxInput$1, { ref: inputRef, role: 'combobox', "aria-haspopup": 'listbox', "aria-expanded": !readOnly && !disabled && open, "aria-autocomplete": 'list', "aria-describedby": `${id}-inputDescription`, selected: selected?.items, spellCheck: false, ...{
                      id,
                      readOnly,
                      disabled,
                      onChange,
                      value,
                      mode,
                      status
                  }, actions: inputActions, onRemove: selected?.onRemove, onClick: onInputClick, onKeyDown: onInputKeyDown, ...restProps }, void 0), jsxRuntime.jsx(VisuallyHiddenText$1, { id: `${id}-inputDescription`, children: `${t('combobox_open_close')} ` && onChange ? t('combobox_search_instructions') : '' }, void 0), jsxRuntime.jsx(Popover$1, { show: open && menu !== undefined, target: containerRef.current, placement: 'bottom-start', modifiers: [
                      {
                          name: 'flip',
                          options: {
                              fallbackPlacements: ['top-start']
                          }
                      },
                      sameWidth
                  ], strategy: isMobile ? 'absolute' : 'fixed', onMouseDown: (e) => e.preventDefault(), children: menu && (jsxRuntime.jsx(Menu$1, { ref: menuRef, id: menuComponentId, role: 'listbox', mode: mode, ...menu, items: menu.items, focusControlEl: inputRef.current || undefined, onItemClick: (itemId, e) => {
                          if (mode === 'single-select') {
                              setOpen(false);
                          }
                          menu.onItemClick?.(itemId, e);
                          const clickedItem = menuHelpers.getItem(menu.items, itemId);
                          if (clickedItem?.primary && !clickedItem?.selected) {
                              selected?.onNew?.(clickedItem?.primary);
                          }
                      }, arrowNavigationUnsupported: true }, void 0)) }, void 0)] }, void 0));
      return label ? (jsxRuntime.jsx(FormField$1, { ...{ label, labelHidden, id, info, status, required, disabled }, children: Comp }, void 0)) : (Comp);
  });
  var ComboBox$1 = ComboBox;

  // This file is autogenerated. Any changes will be overwritten.
  const name$x = 'paper-clip';
  const Component$x = () => (jsxRuntime.jsx("path", { d: 'M20.5226562,11.6265625 C20.6664062,11.6265625 20.7617188,11.6742188 20.8578125,11.7703125 C20.9539062,11.8664063 21.0015625,11.9617188 21.0015625,12.1054688 C21.0015625,12.2492188 20.9539062,12.3445313 20.8578125,12.440625 C20.8578125,12.440625 20.8578125,12.440625 20.8578125,12.440625 C20.8578125,12.440625 13.2429687,20.0554687 13.2429687,20.0554687 C12.1414062,21.109375 10.8484375,21.6359375 9.41171875,21.6359375 C7.975,21.6359375 6.68203125,21.109375 5.58046875,20.0554687 C5.58046875,20.0554687 5.58046875,20.0554687 5.58046875,20.0554687 C4.5265625,19.0015625 4,17.75625 4,16.271875 C4,16.271875 4,16.271875 4,16.271875 C4,14.8351563 4.5265625,13.5421875 5.58046875,12.440625 C5.58046875,12.440625 5.58046875,12.440625 5.58046875,12.440625 C5.58046875,12.440625 14.9671875,3.14921875 14.9671875,3.14921875 C15.7335937,2.3828125 16.64375,2 17.7453125,2 C18.846875,2 19.7570312,2.3828125 20.5234375,3.14921875 C20.5234375,3.14921875 20.5234375,3.14921875 20.5234375,3.14921875 C21.2898437,3.86796875 21.6726562,4.77734375 21.6726562,5.87890625 C21.6726562,5.87890625 21.6726562,5.87890625 21.6726562,5.87890625 C21.6726562,6.98046875 21.2898437,7.890625 20.5234375,8.65703125 C20.5234375,8.65703125 20.5234375,8.65703125 20.5234375,8.65703125 C20.5234375,8.65703125 11.8546875,17.2773438 11.8546875,17.2773438 C11.3757813,17.75625 10.8007812,17.9960938 10.1304687,17.9960938 C10.1304687,17.9960938 10.1304687,17.9960938 10.1304687,17.9960938 C9.5078125,17.9960938 8.88515625,17.7570313 8.35859375,17.2773438 C8.35859375,17.2773438 8.35859375,17.2773438 8.35859375,17.2773438 C7.8796875,16.7984375 7.63984375,16.2234375 7.63984375,15.553125 C7.63984375,14.8828125 7.87890625,14.3078125 8.35859375,13.8289062 C8.35859375,13.8289062 8.35859375,13.8289062 8.35859375,13.8289062 C8.35859375,13.8289062 16.6921875,5.54375 16.6921875,5.54375 C16.7882812,5.44765625 16.93125,5.4 17.075,5.4 C17.075,5.4 17.075,5.4 17.075,5.4 C17.21875,5.4 17.3140625,5.44765625 17.4101562,5.54375 C17.50625,5.63984375 17.5539062,5.73515625 17.5539062,5.87890625 C17.5539062,5.87890625 17.5539062,5.87890625 17.5539062,5.87890625 C17.5539062,6.02265625 17.50625,6.16640625 17.4101562,6.26171875 C17.4101562,6.26171875 17.4101562,6.26171875 17.4101562,6.26171875 C17.4101562,6.26171875 9.0765625,14.4992187 9.0765625,14.4992187 C8.7890625,14.7867187 8.6453125,15.121875 8.6453125,15.553125 C8.6453125,15.984375 8.7890625,16.3195313 9.0765625,16.6070312 C9.3640625,16.8945312 9.69921875,17.0382813 10.1304687,17.0382813 C10.1304687,17.0382813 10.1304687,17.0382813 10.1304687,17.0382813 C10.5132812,17.0382813 10.8492187,16.8945312 11.1359375,16.6070312 C11.1359375,16.6070312 11.1359375,16.6070312 11.1359375,16.6070312 C11.1359375,16.6070312 19.8523437,7.98671875 19.8523437,7.98671875 C20.4273437,7.41171875 20.7140625,6.69375 20.7140625,5.8796875 C20.7140625,5.8796875 20.7140625,5.8796875 20.7140625,5.8796875 C20.7140625,5.065625 20.4265625,4.3953125 19.8523437,3.8203125 C19.8523437,3.8203125 19.8523437,3.8203125 19.8523437,3.8203125 C19.2296875,3.2453125 18.5117187,2.95859375 17.7453125,2.95859375 C17.7453125,2.95859375 17.7453125,2.95859375 17.7453125,2.95859375 C16.93125,2.95859375 16.2609375,3.24609375 15.6859375,3.8203125 C15.6859375,3.8203125 15.6859375,3.8203125 15.6859375,3.8203125 C15.6859375,3.8203125 6.29921875,13.159375 6.29921875,13.159375 C5.4375,13.9734375 5.00625,14.9789062 5.00625,16.2726562 C5.00625,16.2726562 5.00625,16.2726562 5.00625,16.2726562 C5.00625,17.5179688 5.4375,18.5234375 6.29921875,19.3375 C6.29921875,19.3375 6.29921875,19.3375 6.29921875,19.3375 C7.1609375,20.1992188 8.21484375,20.6304688 9.4125,20.6304688 C9.4125,20.6304688 9.4125,20.6304688 9.4125,20.6304688 C10.7054687,20.6304688 11.7117187,20.1992188 12.5257812,19.3375 C12.5257812,19.3375 12.5257812,19.3375 12.5257812,19.3375 C12.5257812,19.3375 20.1882812,11.7703125 20.1882812,11.7703125 C20.284375,11.6742188 20.3796875,11.6265625 20.5234375,11.6265625 L20.5226562,11.6265625 Z' }, void 0));
  const viewBox$x = '0 0 25 25';

  var paperClip = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$x,
    Component: Component$x,
    viewBox: viewBox$x
  });

  const StyledForm = styled__default["default"].form ``;
  const StyledFormContent = styled__default["default"].div ``;
  const Form = React.forwardRef((props, ref) => {
      const { children, actions, heading, description, banners, ...restProps } = props;
      const uid = useUID$1();
      return (jsxRuntime.jsxs(Flex$1, { container: { direction: 'column', gap: 3 }, as: StyledForm, ref: ref, ...restProps, "aria-labelledby": heading ? `${uid}-heading` : undefined, "aria-describedby": description ? `${uid}-description` : undefined, children: [banners, (heading || description) && (jsxRuntime.jsxs(Flex$1, { container: { direction: 'column', gap: 1 }, children: [heading && (jsxRuntime.jsx(Text$1, { id: `${uid}-heading`, variant: 'h3', children: heading }, void 0)), description && (jsxRuntime.jsx(Text$1, { id: `${uid}-description`, as: 'p', children: description }, void 0))] }, void 0)), jsxRuntime.jsx(Flex$1, { as: StyledFormContent, container: { direction: 'column', gap: 3 }, children: children }, void 0), actions && jsxRuntime.jsx(Flex$1, { container: { justify: 'between', alignItems: 'center' }, children: actions }, void 0)] }, void 0));
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$w = 'star';
  const Component$w = () => (jsxRuntime.jsx("path", { d: 'M24.1328125,9.09453125 C24.1328125,9.09453125 24.1328125,9.09453125 24.1328125,9.09453125 C24.1328125,9.09453125 16.6132812,7.896875 16.6132812,7.896875 C16.6132812,7.896875 13.2132812,1.2875 13.2132812,1.2875 C13.1171875,1.09609375 12.9742187,1 12.7820312,1 C12.7820312,1 12.7820312,1 12.7820312,1 C12.5429687,1 12.3992187,1.09609375 12.3507813,1.2390625 C12.3507813,1.2390625 12.3507813,1.2390625 12.3507813,1.2390625 C12.3507813,1.2390625 8.95078125,7.89609375 8.95078125,7.89609375 C8.95078125,7.89609375 1.43125,9.09375 1.43125,9.09375 C1.14375,9.14140625 1,9.3328125 1,9.57265625 C1,9.57265625 1,9.57265625 1,9.57265625 C1,9.71640625 1.04765625,9.86015625 1.14375,9.95546875 C1.14375,9.95546875 1.14375,9.95546875 1.14375,9.95546875 C1.14375,9.95546875 6.890625,15.0320312 6.890625,15.0320312 C6.890625,15.0320312 5.31015625,22.9820312 5.31015625,22.9820312 C5.31015625,22.9820312 5.31015625,23.078125 5.31015625,23.078125 C5.31015625,23.4132812 5.45390625,23.5570313 5.7890625,23.5570313 C5.7890625,23.5570313 5.7890625,23.5570313 5.7890625,23.5570313 C5.88515625,23.5570313 5.98046875,23.5570313 6.028125,23.509375 C6.028125,23.509375 6.028125,23.509375 6.028125,23.509375 C6.028125,23.509375 12.7328125,20.0132812 12.7328125,20.0132812 C12.7328125,20.0132812 19.4859375,23.509375 19.4859375,23.509375 C19.5335937,23.5570313 19.5820312,23.5570313 19.725,23.5570313 C19.725,23.5570313 19.725,23.5570313 19.725,23.5570313 C20.0601562,23.5570313 20.2039062,23.4132813 20.2039062,23.078125 C20.2039062,23.078125 20.2039062,23.078125 20.2039062,23.078125 C20.2039062,23.078125 20.2039062,22.9820312 20.2039062,22.9820312 C20.2039062,22.9820312 18.6710938,15.0320313 18.6710938,15.0320313 C18.6710938,15.0320313 24.3703125,9.95546875 24.3703125,9.95546875 C24.5140625,9.81171875 24.5617188,9.71640625 24.5617188,9.57265625 C24.5617188,9.57265625 24.5617188,9.57265625 24.5617188,9.57265625 C24.5617188,9.33359375 24.4179688,9.14140625 24.1304688,9.09375 L24.1328125,9.09453125 Z M22.9359375,9.90859375 C22.9359375,9.90859375 18.003125,14.3148437 18.003125,14.3148437 C18.003125,14.3148437 17.571875,14.6976562 17.571875,14.6976562 C17.571875,14.6976562 19.0085937,22.16875 19.0085937,22.16875 C19.0085937,22.16875 12.734375,18.9117187 12.734375,18.9117187 C12.734375,18.9117187 6.46015625,22.16875 6.46015625,22.16875 C6.46015625,22.16875 7.94453125,14.6976562 7.94453125,14.6976562 C7.94453125,14.6976562 2.58046875,9.90859375 2.58046875,9.90859375 C2.58046875,9.90859375 9.57265625,8.759375 9.57265625,8.759375 C9.57265625,8.759375 9.81171875,8.328125 9.81171875,8.328125 C9.81171875,8.328125 12.78125,2.58125 12.78125,2.58125 C12.78125,2.58125 15.9421875,8.759375 15.9421875,8.759375 C15.9421875,8.759375 22.934375,9.90859375 22.934375,9.90859375 L22.9359375,9.90859375 Z' }, void 0));
  const viewBox$w = '0 0 25 25';

  var star = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$w,
    Component: Component$w,
    viewBox: viewBox$w
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$v = 'star-solid';
  const Component$v = () => (jsxRuntime.jsx("path", { d: 'M24.3710937,9.95625 C24.3710937,9.95625 24.3710937,9.95625 24.3710937,9.95625 C24.3710937,9.95625 18.671875,15.0328125 18.671875,15.0328125 C18.671875,15.0328125 20.2046875,22.9828125 20.2046875,22.9828125 C20.2046875,22.9828125 20.2046875,23.0789062 20.2046875,23.0789062 C20.2046875,23.4140625 20.0132812,23.5578125 19.678125,23.5578125 C19.678125,23.5578125 19.678125,23.5578125 19.678125,23.5578125 C19.5820312,23.5578125 19.534375,23.5578125 19.4867187,23.5101562 C19.4867187,23.5101562 19.4867187,23.5101562 19.4867187,23.5101562 C19.4867187,23.5101562 12.7335937,20.0140625 12.7335937,20.0140625 C12.7335937,20.0140625 6.02890625,23.5101563 6.02890625,23.5101563 C5.98125,23.5101563 5.98125,23.5101563 5.9328125,23.5101563 C5.88515625,23.5578125 5.83671875,23.5578125 5.7890625,23.5578125 C5.7890625,23.5578125 5.7890625,23.5578125 5.7890625,23.5578125 C5.45390625,23.5578125 5.31015625,23.4140625 5.31015625,23.0789062 C5.31015625,23.0789062 5.31015625,23.0789062 5.31015625,23.0789062 C5.31015625,23.0789062 5.31015625,22.9828125 5.31015625,22.9828125 C5.31015625,22.9828125 6.890625,15.0328125 6.890625,15.0328125 C6.890625,15.0328125 1.14375,9.95625 1.14375,9.95625 C1.04765625,9.86015625 1,9.7171875 1,9.5734375 C1,9.5734375 1,9.5734375 1,9.5734375 C1,9.334375 1.14375,9.1421875 1.43125,9.09453125 C1.43125,9.09453125 1.43125,9.09453125 1.43125,9.09453125 C1.43125,9.09453125 8.95078125,7.896875 8.95078125,7.896875 C8.95078125,7.896875 12.3507812,1.2875 12.3507812,1.2875 C12.3984375,1.09609375 12.5421875,1 12.7820312,1 C12.7820312,1 12.7820312,1 12.7820312,1 C12.9734375,1 13.1171875,1.09609375 13.2132812,1.2390625 C13.2132812,1.2390625 13.2132812,1.2390625 13.2132812,1.2390625 C13.2132812,1.2390625 16.6132812,7.89609375 16.6132812,7.89609375 C16.6132812,7.89609375 24.1328125,9.09375 24.1328125,9.09375 C24.4203125,9.14140625 24.5640625,9.3328125 24.5640625,9.57265625 C24.5640625,9.57265625 24.5640625,9.57265625 24.5640625,9.57265625 C24.5640625,9.71640625 24.5164062,9.81171875 24.3726562,9.95546875 L24.3710937,9.95625 Z' }, void 0));
  const viewBox$v = '0 0 25 25';

  var starsolid = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$v,
    Component: Component$v,
    viewBox: viewBox$v
  });

  const defaultProps$3 = {
      width: 'default',
      variant: 'default'
  };
  const lengthToPercent = {
      default: 'auto',
      l: '80%',
      m: '50%',
      s: '30%'
  };
  const StyledLineSkeleton = styled__default["default"].div(props => {
      const { width, variant } = props;
      const { skeleton: skeletonBackground } = props.theme.base.palette;
      const lengthPercent = lengthToPercent[width || 'default'];
      const LinkHeaderColor = 'rgb(135,206,235,0.5)';
      return styled.css `
    flex-grow: 1;
    margin: 0.25rem;
    height: 0.875rem;
    width: ${lengthPercent};
    ${variant === 'default'
        ? `background-color: ${skeletonBackground}`
        : `background-color: ${LinkHeaderColor}`}
  `;
  });
  StyledLineSkeleton.defaultProps = defaultThemeProp;
  const LineSkeleton = (props) => {
      return jsxRuntime.jsx(StyledLineSkeleton, { ...props, "aria-disabled": 'true' }, void 0);
  };
  LineSkeleton.defaultProps = defaultProps$3;
  var LineSkeleton$1 = LineSkeleton;

  const defaultProps$2 = {};
  const StyledParagraphSkeleton = styled__default["default"].div `
  margin: 0.25rem 0;
`;
  StyledParagraphSkeleton.defaultProps = defaultThemeProp;
  const ParagraphSkeleton = (props) => {
      return (jsxRuntime.jsx(StyledParagraphSkeleton, { ...props, "aria-disabled": 'true', children: props.children }, void 0));
  };
  ParagraphSkeleton.defaultProps = defaultProps$2;
  var ParagraphSkeleton$1 = ParagraphSkeleton;

  // This file is autogenerated. Any changes will be overwritten.
  const name$u = 'check';
  const Component$u = () => (jsxRuntime.jsx("path", { d: 'M3.5328125,10.8960938 C3.5328125,10.8960938 10.0460938,17.3617188 10.0460938,17.3617188 C10.0460938,17.3617188 22.4984375,4 22.4984375,4 C22.4984375,4 23.9828125,5.484375 23.9828125,5.484375 C23.9828125,5.484375 10.09375,20.2351562 10.09375,20.2351562 C10.09375,20.2351562 2,12.3804687 2,12.3804687 C2,12.3804687 3.5328125,10.8960937 3.5328125,10.8960937 L3.5328125,10.8960938 Z' }, void 0));
  const viewBox$u = '0 0 25 25';

  var check = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$u,
    Component: Component$u,
    viewBox: viewBox$u
  });

  const StyledArticleSkeleton = styled__default["default"].div ``;
  const ArticleSkeleton = (props) => {
      const numberOfLines = 18;
      return (jsxRuntime.jsx(StyledArticleSkeleton, { ...props, "aria-disabled": 'true', children: jsxRuntime.jsx(ParagraphSkeleton$1, { children: Array.from({ length: numberOfLines }, (_, i) => {
                  const lines = i % 3 === 0 ? ['s', 'm'] : ['s', 's', 's'];
                  return (jsxRuntime.jsx(Flex$1, { container: { alignItems: 'center' }, children: lines.map((size, j) => (
                      // eslint-disable-next-line react/no-array-index-key
                      jsxRuntime.jsx(LineSkeleton$1, { width: size }, j))) }, i));
              }) }, void 0) }, void 0));
  };
  var ArticleSkeleton$1 = ArticleSkeleton;

  const StyledArticleWrapper = styled__default["default"].div(props => {
      const { theme } = props;
      return styled.css `
    background: ${theme.base.palette['primary-background']};
    padding: calc(1.5 * ${theme.base.spacing});
    border-radius: calc(0.5 * ${theme.base['border-radius']});
    max-height: inherit;
  `;
  });
  const StyledArticleHeader$1 = styled__default["default"].header `
  flex-shrink: 0;
`;
  const StyledArticleContent = styled__default["default"].div(props => {
      const { theme, theme: { base: { spacing } } } = props;
      return styled.css `
    flex-grow: 1;
    overflow-y: auto;
    padding: 0 calc(1.5 * ${spacing});
    margin: 0 calc(-1.5 * ${spacing});

    /* TODO -  We need to think of handling this such way RTE content is not impacted with the styles inside styles/GlobalStyle.tsx */
    ul,
    ol {
      padding-left: calc(3 * ${spacing});
    }
    a {
      color: ${theme.components.link.color};
    }
  `;
  });
  StyledArticleContent.defaultProps = defaultThemeProp;
  StyledArticleWrapper.defaultProps = defaultThemeProp;
  const Locale$1 = {
      // FIXME: TR
      moreActions: 'More actions'
  };
  const Article = (props) => {
      const { meta, title, navigation, content, primaryActions, secondaryActions, footer, skeletonize, ...restProps } = props;
      return (jsxRuntime.jsxs(Flex$1, { container: { direction: 'column', gap: 1 }, as: StyledArticleWrapper, ...restProps, children: [(navigation || primaryActions || secondaryActions) && (jsxRuntime.jsxs(Flex$1, { container: { gap: 1, alignItems: 'center' }, children: [jsxRuntime.jsx(Flex$1, { container: true, item: { grow: 1 }, children: navigation }, void 0), jsxRuntime.jsxs(Flex$1, { container: { alignItems: 'center' }, children: [primaryActions, secondaryActions && (jsxRuntime.jsx(MenuButton$1, { variant: 'simple', text: Locale$1.moreActions, icon: 'more', iconOnly: true, menu: {
                                      items: secondaryActions.map(({ text, ...rest }) => ({ ...rest, primary: text }))
                                  } }, void 0))] }, void 0)] }, void 0)), title ? (jsxRuntime.jsx(Flex$1, { container: true, as: StyledArticleHeader$1, children: jsxRuntime.jsx(Text$1, { variant: 'h3', children: title }, void 0) }, void 0)) : (skeletonize && jsxRuntime.jsx(LineSkeleton$1, { width: 'l' }, void 0)), meta && meta.length > 0 ? (jsxRuntime.jsx(Flex$1, { container: true, item: { shrink: 0 }, children: jsxRuntime.jsx(MetaList$1, { items: meta }, void 0) }, void 0)) : (skeletonize && (jsxRuntime.jsxs(Flex$1, { container: true, children: [jsxRuntime.jsx(LineSkeleton$1, { width: 's' }, void 0), jsxRuntime.jsx(LineSkeleton$1, { width: 's' }, void 0), jsxRuntime.jsx(LineSkeleton$1, { width: 's' }, void 0)] }, void 0))), skeletonize ? (jsxRuntime.jsx(StyledArticleContent, { children: jsxRuntime.jsx(ArticleSkeleton$1, {}, void 0) }, void 0)) : (jsxRuntime.jsx(StyledArticleContent, { children: content }, void 0)), footer] }, void 0));
  };
  Article.defaultProps = {
      skeletonize: false
  };
  var Article$1 = Article;

  const StyledArticleFooter = styled__default["default"].div(({ theme }) => {
      return styled.css `
    flex-shrink: 0;
    &::before {
      content: '';
      display: block;
      background: ${theme.base.palette['border-line']};
      height: 0.0625rem;
      margin-bottom: calc(2 * ${theme.base.spacing});
    }
  `;
  });
  StyledArticleFooter.defaultProps = defaultThemeProp;
  const StyledTags = styled__default["default"].div(({ theme }) => {
      return styled.css `
    padding: calc(0.25 * ${theme.base.spacing});
    margin: 0 calc(-0.5 * ${theme.base.spacing});
    & > ${StyledTag} {
      margin: calc(0.25 * ${theme.base.spacing});
    }
  `;
  });
  StyledTags.defaultProps = defaultThemeProp;
  const ArticleFooter = (props) => {
      const { content, tags, onTagClick, ...restProps } = props;
      const onTagClickHandler = React.useCallback((event) => {
          onTagClick?.(event.currentTarget.dataset.tagId);
      }, [onTagClick]);
      return (jsxRuntime.jsxs(Flex$1, { as: StyledArticleFooter, container: {
              direction: 'column',
              gap: 2
          }, ...restProps, children: [content, tags && (jsxRuntime.jsx(Flex$1, { container: { wrap: 'wrap' }, as: StyledTags, children: tags.map(tag => (jsxRuntime.jsx(Tag$1, { tabIndex: 0, type: 'pill', variant: 'light', "data-tag-id": tag.id, onClick: onTagClickHandler, rel: 'tag', children: tag.tagName }, tag.id))) }, void 0))] }, void 0));
  };
  var ArticleFooter$1 = ArticleFooter;

  const SummarySkeleton = (props) => {
      return (jsxRuntime.jsxs(Flex$1, { as: 'li', container: {
              direction: 'column'
          }, ...props, "aria-disabled": 'true', children: [jsxRuntime.jsx(LineSkeleton$1, { variant: 'link', width: 'l' }, void 0), jsxRuntime.jsxs(ParagraphSkeleton$1, { children: [jsxRuntime.jsx(LineSkeleton$1, {}, void 0), jsxRuntime.jsx(LineSkeleton$1, { width: 's' }, void 0)] }, void 0), jsxRuntime.jsxs(Flex$1, { container: { alignItems: 'center' }, children: [jsxRuntime.jsx(LineSkeleton$1, { width: 's' }, void 0), jsxRuntime.jsx(LineSkeleton$1, { width: 's' }, void 0), jsxRuntime.jsx(LineSkeleton$1, { width: 's' }, void 0)] }, void 0)] }, void 0));
  };
  var SummarySkeleton$1 = SummarySkeleton;

  const defaultProps$1 = {};
  const StyledSummaryList = styled__default["default"].ul ``;
  const StyledArticleList = styled__default["default"].div(props => {
      const { theme } = props;
      return styled.css `
    max-height: inherit;
    overflow: auto;
    padding: 0 calc(2 * ${theme.base.spacing});
    background: ${theme.base.palette['primary-background']};
    border-radius: ${theme.components.card['border-radius']};
    ${StyledCard} {
      margin-bottom: calc(2 * ${theme.base.spacing});
    }
    ${StyledSummaryList} {
      flex-grow: 1;
      margin: 0 0 ${theme.base.spacing} 0;
      list-style-type: none;
      > li:not(:last-child) {
        border-bottom: 0.0625rem solid ${theme.base.palette['border-line']};
        border-radius: 0;
        padding-bottom: ${theme.base.spacing};
        margin-bottom: ${theme.base.spacing};
      }
    }
  `;
  });
  StyledArticleList.defaultProps = defaultThemeProp;
  const StyledArticleListHeader = styled__default["default"].div(props => {
      const { theme } = props;
      return styled.css `
    flex-shrink: 0;
    position: sticky;
    top: 0;
    background: ${theme.base.palette['primary-background']};
    padding: calc(2 * ${theme.base.spacing}) 0 0 0;
    z-index: 2;
  `;
  });
  StyledArticleListHeader.defaultProps = defaultThemeProp;
  const StyledArticleListFooter = styled__default["default"].div(props => {
      const { theme } = props;
      return styled.css `
    flex-shrink: 0;
    position: sticky;
    bottom: 0;
    background: ${theme.base.palette['primary-background']};
    padding: ${theme.base.spacing} 0;
    z-index: 2;
  `;
  });
  StyledArticleListFooter.defaultProps = defaultThemeProp;
  const ArticleList = React.forwardRef((props, ref) => {
      const { header, children, skeletonize, footer, ...restProps } = props;
      const t = useI18n$1();
      return (jsxRuntime.jsxs(Flex$1, { container: { direction: 'column' }, as: StyledArticleList, "aria-label": t('article_list_label_a11y'), ref: ref, ...restProps, children: [header && (jsxRuntime.jsx(Flex$1, { container: true, as: StyledArticleListHeader, "aria-label": t('article_list_filter_label_a11y'), children: header }, void 0)), jsxRuntime.jsx(Flex$1, { container: { direction: 'column' }, as: StyledSummaryList, role: 'feed', children: skeletonize ? (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(SummarySkeleton$1, {}, void 0), jsxRuntime.jsx(SummarySkeleton$1, {}, void 0), jsxRuntime.jsx(SummarySkeleton$1, {}, void 0)] }, void 0)) : (children) }, void 0), footer && (jsxRuntime.jsx(Flex$1, { container: true, as: StyledArticleListFooter, children: footer }, void 0))] }, void 0));
  });
  ArticleList.defaultProps = defaultProps$1;
  var ArticleList$1 = ArticleList;

  const defaultProps = {};
  const ArticleCard = styled__default["default"](StyledCard) `
  &&& {
    > ${StyledCardHeader}, > ${StyledCardContent}, > ${StyledCardFooter} {
      padding-left: 0;
      padding-right: 0;
    }

    > ${StyledCardContent} > ${StyledText} {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
`;
  const ArticleSummary = (props) => {
      const { header, content, meta, articleID, ...restProps } = props;
      return (jsxRuntime.jsxs(ArticleCard, { as: 'li', role: 'article', ...restProps, children: [header ? jsxRuntime.jsx(CardHeader$1, { children: header }, void 0) : null, jsxRuntime.jsx(CardContent$1, { children: content }, void 0), meta && (jsxRuntime.jsx(CardFooter$1, { children: jsxRuntime.jsx(MetaList$1, { items: meta }, void 0) }, void 0))] }, articleID));
  };
  ArticleSummary.defaultProps = defaultProps;
  var ArticleSummary$1 = ArticleSummary;

  const StyledArticleHeader = styled__default["default"].div(({ theme }) => {
      return styled.css `
    width: 100%;
    gap: 0;

    button[type='submit'] {
      height: 0;
      min-height: 0;
      width: 0.0625rem;
      clip-path: inset(50%);
      clip: rect(0, 0, 0, 0);
      margin: 0;
      overflow: hidden;
      padding: 0;
      border: 0;
    }
    > div:last-child {
      margin: 0;
    }

    ${StyledFormContent} {
      gap: ${theme.base.spacing};
    }
  `;
  });
  StyledArticleHeader.defaultProps = defaultThemeProp;
  const StyledSecondaryContainer = styled__default["default"](Flex$1) `
  margin: 0.5rem 0;
  & > * {
    flex-grow: 1;
  }
`;
  /* This below style will be removed once we have margin auto support from Flex
  component */
  const StyledHeaderActions = styled__default["default"].div `
  margin-left: auto;

  .radio-check {
    margin: 0;
  }
`;
  const StyledArticleListHeaderText = styled__default["default"](Text$1) `
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  flex: 1;
`;
  const Locale = {
      // FIXME: TR
      moreActions: 'More actions'
  };
  const ArticleListHeader = (props) => {
      const { as = Form, primary, secondary, onSubmit, icon, headerText, ...restProps } = props;
      const t = useI18n$1();
      return (jsxRuntime.jsxs(StyledArticleHeader, { as: as, actions: jsxRuntime.jsx(Button$1, { type: 'submit', "aria-hidden": 'true', tabIndex: '-1', children: t('article_list_header_submit_label') }, void 0), role: 'search', onSubmit: (ev) => {
              ev.preventDefault();
              if (onSubmit)
                  onSubmit(ev);
          }, ...restProps, children: [jsxRuntime.jsxs(Flex$1, { container: { alignItems: 'center', gap: 1 }, children: [icon, jsxRuntime.jsx(StyledArticleListHeaderText, { variant: 'h2', children: headerText }, void 0), primary.actions && (jsxRuntime.jsx(MenuButton$1, { variant: 'simple', text: Locale.moreActions, icon: 'more', iconOnly: true, menu: {
                              items: primary.actions.map(({ text, ...rest }) => ({ ...rest, primary: text }))
                          } }, void 0))] }, void 0), jsxRuntime.jsxs(Flex$1, { container: { alignItems: 'center', gap: 1 }, children: [jsxRuntime.jsx(Flex$1, { item: { grow: 1 }, children: primary.search }, void 0), jsxRuntime.jsx(Flex$1, { container: true, as: StyledHeaderActions, children: primary.followedFilter }, void 0)] }, void 0), secondary && (jsxRuntime.jsx(StyledSecondaryContainer, { container: { gap: 1 }, children: secondary }, void 0))] }, void 0));
  };
  var ArticleListHeader$1 = ArticleListHeader;

  // This file is autogenerated. Any changes will be overwritten.
  const name$t = 'more';
  const Component$t = () => (jsxRuntime.jsx("path", { d: 'M14.353125,6.353125 C13.9703125,6.7359375 13.4914062,6.928125 12.9640625,6.928125 C12.4367188,6.928125 11.9585938,6.73671875 11.575,6.353125 C11.1921875,5.9703125 11,5.49140625 11,4.9640625 C11,4.43671875 11.1914062,3.95859375 11.575,3.575 C11.9578125,3.1921875 12.4367188,3 12.9640625,3 C13.4914063,3 13.9695312,3.19140625 14.353125,3.575 C14.7359375,3.9578125 14.928125,4.43671875 14.928125,4.9640625 C14.928125,5.49140625 14.7367187,5.96953125 14.353125,6.353125 Z M14.353125,13.7289063 C13.9703125,14.1117188 13.4914062,14.3039063 12.9640625,14.3039063 C12.4367188,14.3039063 11.9585938,14.1125 11.575,13.7289063 C11.1921875,13.3460938 11,12.8671875 11,12.3398438 C11,11.8125 11.1914062,11.334375 11.575,10.9507813 C11.9578125,10.5679688 12.4367188,10.3757813 12.9640625,10.3757813 C13.4914063,10.3757813 13.9695312,10.5671875 14.353125,10.9507813 C14.7359375,11.3335938 14.928125,11.8125 14.928125,12.3398438 C14.928125,12.8671875 14.7367187,13.3453125 14.353125,13.7289063 Z M14.353125,21.1039062 C13.9703125,21.4867187 13.4914062,21.6789062 12.9640625,21.6789062 C12.4367188,21.6789062 11.9585938,21.4875 11.575,21.1039062 C11.1921875,20.7210938 11,20.2421875 11,19.7148438 C11,19.1875 11.1914062,18.709375 11.575,18.3257813 C11.9578125,17.9429688 12.4367188,17.7507813 12.9640625,17.7507813 C13.4914063,17.7507813 13.9695312,17.9421875 14.353125,18.3257813 C14.7359375,18.7085937 14.928125,19.1875 14.928125,19.7148438 C14.928125,20.2421875 14.7367187,20.7203125 14.353125,21.1039062 Z' }, void 0));
  const viewBox$t = '0 0 25 25';

  var more = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$t,
    Component: Component$t,
    viewBox: viewBox$t
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$s = 'filter';
  const Component$s = () => (jsxRuntime.jsx("path", { d: 'M11.859375,18.703125 C11.859375,18.703125 13.775,18.703125 13.775,18.703125 C14.4453125,18.703125 14.7804688,19.0382812 14.7804688,19.6609375 C14.7804688,19.6609375 14.7804688,19.6609375 14.7804688,19.6609375 C14.7804688,20.33125 14.4453125,20.6664062 13.775,20.6664062 C13.775,20.6664062 13.775,20.6664062 13.775,20.6664062 C13.775,20.6664062 11.859375,20.6664062 11.859375,20.6664062 C11.1890625,20.6664062 10.8539063,20.33125 10.8539063,19.6609375 C10.8539063,19.6609375 10.8539063,19.6609375 10.8539063,19.6609375 C10.8539063,19.0382812 11.1890625,18.703125 11.859375,18.703125 C11.859375,18.703125 11.859375,18.703125 11.859375,18.703125 L11.859375,18.703125 Z M7.93203125,13.8179688 C7.93203125,13.8179688 17.7023438,13.8179688 17.7023438,13.8179688 C18.3726563,13.8179688 18.7078125,14.153125 18.7078125,14.7757812 C18.7078125,14.7757812 18.7078125,14.7757812 18.7078125,14.7757812 C18.7078125,15.4460937 18.3726563,15.78125 17.7023438,15.78125 C17.7023438,15.78125 17.7023438,15.78125 17.7023438,15.78125 C17.7023438,15.78125 7.93203125,15.78125 7.93203125,15.78125 C7.26171875,15.78125 6.9265625,15.4460937 6.9265625,14.7757812 C6.9265625,14.7757812 6.9265625,14.7757812 6.9265625,14.7757812 C6.9265625,14.153125 7.26171875,13.8179688 7.93203125,13.8179688 C7.93203125,13.8179688 7.93203125,13.8179688 7.93203125,13.8179688 Z M5.96796875,8.88515625 C5.96796875,8.88515625 19.665625,8.88515625 19.665625,8.88515625 C20.3359375,8.88515625 20.6710938,9.2203125 20.6710938,9.890625 C20.6710938,9.890625 20.6710938,9.890625 20.6710938,9.890625 C20.6710938,10.5132812 20.3359375,10.8484375 19.665625,10.8484375 C19.665625,10.8484375 19.665625,10.8484375 19.665625,10.8484375 C19.665625,10.8484375 5.96796875,10.8484375 5.96796875,10.8484375 C5.29765625,10.8484375 4.9625,10.5132812 4.9625,9.890625 C4.9625,9.890625 4.9625,9.890625 4.9625,9.890625 C4.9625,9.2203125 5.29765625,8.88515625 5.96796875,8.88515625 C5.96796875,8.88515625 5.96796875,8.88515625 5.96796875,8.88515625 L5.96796875,8.88515625 Z M22.6351563,5.00546875 C22.6351563,5.00546875 22.6351563,5.00546875 22.6351563,5.00546875 C22.6351563,5.628125 22.3,5.96328125 21.6296875,5.96328125 C21.6296875,5.96328125 21.6296875,5.96328125 21.6296875,5.96328125 C21.6296875,5.96328125 4.00546875,5.96328125 4.00546875,5.96328125 C3.33515625,5.96328125 3,5.628125 3,5.00546875 C3,5.00546875 3,5.00546875 3,5.00546875 C3,4.33515625 3.33515625,4 4.00546875,4 C4.00546875,4 4.00546875,4 4.00546875,4 C4.00546875,4 21.6296875,4 21.6296875,4 C22.3,4 22.6351563,4.33515625 22.6351563,5.00546875 Z' }, void 0));
  const viewBox$s = '0 0 25 25';

  var filter = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$s,
    Component: Component$s,
    viewBox: viewBox$s
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$r = 'chat-solid';
  const Component$r = () => (jsxRuntime.jsx("path", { d: 'M24.521875,2.48515625 C24.521875,2.48515625 24.521875,2.48515625 24.521875,2.48515625 C24.521875,2.48515625 24.521875,18.19375 24.521875,18.19375 C24.521875,18.625 24.378125,18.9601563 24.090625,19.1992188 C23.803125,19.4867188 23.4679688,19.6304687 23.0367188,19.6304687 C23.0367188,19.6304687 23.0367188,19.6304687 23.0367188,19.6304687 C23.0367188,19.6304687 20.5945313,19.6304687 20.5945313,19.6304687 C20.5945313,19.6304687 20.5945313,22.6 20.5945313,22.6 C20.5945313,22.8390625 20.4984375,23.0789062 20.3070313,23.2703125 C20.115625,23.4617188 19.8757813,23.5578125 19.6367188,23.5578125 C19.3976563,23.5578125 19.1578125,23.5101563 19.0140625,23.3664063 C19.0140625,23.3664063 19.0140625,23.3664063 19.0140625,23.3664063 C19.0140625,23.3664063 14.1765625,19.7265625 14.1765625,19.7265625 C14.1289063,19.6789063 14.0328125,19.6304687 13.8890625,19.6304687 C13.8890625,19.6304687 13.8890625,19.6304687 13.8890625,19.6304687 C13.8890625,19.6304687 1.48515625,19.6304687 1.48515625,19.6304687 C1.05390625,19.6304687 0.71875,19.4867188 0.43125,19.1992188 C0.14375,18.9601562 0,18.6242188 0,18.19375 C0,18.19375 0,18.19375 0,18.19375 C0,18.19375 0,2.48515625 0,2.48515625 C0,2.05390625 0.14375,1.71875 0.43125,1.43125 C0.71875,1.14375 1.05390625,1 1.48515625,1 C1.48515625,1 1.48515625,1 1.48515625,1 C1.48515625,1 23.0367187,1 23.0367187,1 C23.4679687,1 23.803125,1.14375 24.090625,1.43125 C24.378125,1.71875 24.521875,2.05390625 24.521875,2.48515625 L24.521875,2.48515625 Z' }, void 0));
  const viewBox$r = '0 0 25 25';

  var chatSolid = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$r,
    Component: Component$r,
    viewBox: viewBox$r
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$q = 'user-solid';
  const Component$q = () => (jsxRuntime.jsx("path", { d: 'M8.4484375,6.88515625 C8.4484375,6.88515625 8.4484375,6.88515625 8.4484375,6.88515625 C8.4484375,5.54453125 8.92734375,4.39453125 9.88515625,3.43671875 C10.8429688,2.47890625 11.9921875,2 13.3335938,2 C13.3335938,2 13.3335938,2 13.3335938,2 C14.7226562,2 15.871875,2.47890625 16.8296875,3.43671875 C17.7875,4.39453125 18.2664063,5.54375 18.2664063,6.88515625 C18.2664063,6.88515625 18.2664063,6.88515625 18.2664063,6.88515625 C18.2664063,8.27421875 17.7875,9.4234375 16.8296875,10.38125 C15.871875,11.3390625 14.7226563,11.8179688 13.3335938,11.8179688 C13.3335938,11.8179688 13.3335938,11.8179688 13.3335938,11.8179688 C11.9929688,11.8179688 10.8429688,11.3390625 9.88515625,10.38125 C8.92734375,9.4234375 8.4484375,8.27421875 8.4484375,6.88515625 Z M12.8539062,12.7757812 C15.009375,12.7757812 16.8765625,13.5421875 18.409375,15.075 C19.9421875,16.6078125 20.7085937,18.475 20.7085937,20.6304687 C20.7085937,20.6304687 20.7085937,20.6304687 20.7085937,20.6304687 C20.7085937,20.6304687 20.7085937,21.109375 20.7085937,21.109375 C20.7085937,21.4445312 20.5648438,21.6359375 20.2296875,21.6359375 C20.2296875,21.6359375 20.2296875,21.6359375 20.2296875,21.6359375 C20.2296875,21.6359375 5.5265625,21.6359375 5.5265625,21.6359375 C5.19140625,21.6359375 5,21.4445312 5,21.109375 C5,21.109375 5,21.109375 5,21.109375 C5,21.109375 5,20.6304687 5,20.6304687 C5,18.475 5.76640625,16.6554687 7.29921875,15.1226562 C7.29921875,15.1226562 7.29921875,15.1226562 7.29921875,15.1226562 C8.8796875,13.5421875 10.6992188,12.7757812 12.8546875,12.7757812 C12.8546875,12.7757812 12.8546875,12.7757812 12.8546875,12.7757812 L12.8539062,12.7757812 Z' }, void 0));
  const viewBox$q = '0 0 25 25';

  var userSolid = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$q,
    Component: Component$q,
    viewBox: viewBox$q
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$p = 'chats';
  const Component$p = () => (jsxRuntime.jsx("path", { d: 'M23.0367187,0 C23.0367187,0 23.0367187,0 23.0367187,0 C23.0367187,0 5.4125,0 5.4125,0 C4.98125,0 4.64609375,0.14375 4.35859375,0.43125 C4.07109375,0.71875 3.92734375,1.05390625 3.92734375,1.48515625 C3.92734375,1.48515625 3.92734375,1.48515625 3.92734375,1.48515625 C3.92734375,1.48515625 3.92734375,3.92734375 3.92734375,3.92734375 C3.92734375,3.92734375 1.48515625,3.92734375 1.48515625,3.92734375 C1.05390625,3.92734375 0.71875,4.07109375 0.43125,4.35859375 C0.14375,4.64609375 0,4.98125 0,5.4125 C0,5.4125 0,5.4125 0,5.4125 C0,5.4125 0,19.1101562 0,19.1101562 C0,19.5414063 0.14375,19.8765625 0.43125,20.1640625 C0.71875,20.4515625 1.05390625,20.5953125 1.48515625,20.5953125 C1.48515625,20.5953125 1.48515625,20.5953125 1.48515625,20.5953125 C1.48515625,20.5953125 3.92734375,20.5953125 3.92734375,20.5953125 C3.92734375,20.5953125 3.92734375,23.5164062 3.92734375,23.5164062 C3.92734375,23.5164062 3.92734375,23.5640625 3.92734375,23.5640625 C3.92734375,23.803125 4.0234375,24.0429688 4.21484375,24.234375 C4.40625,24.4257812 4.64609375,24.521875 4.88515625,24.521875 C4.88515625,24.521875 4.88515625,24.521875 4.88515625,24.521875 C5.02890625,24.521875 5.26796875,24.4742188 5.5078125,24.3304688 C5.5078125,24.3304688 5.5078125,24.3304688 5.5078125,24.3304688 C5.5078125,24.3304688 10.440625,20.5945313 10.440625,20.5945313 C10.440625,20.5945313 19.6359375,20.5945313 19.6359375,20.5945313 C19.7796875,20.5945313 19.9234375,20.5945313 19.9710937,20.546875 C19.9710937,20.546875 19.9710937,20.546875 19.9710937,20.546875 C19.9710937,20.546875 20.01875,20.4992188 20.01875,20.4992188 C20.4015625,20.3554688 20.59375,20.0679688 20.59375,19.6375 C20.59375,19.6375 20.59375,19.6375 20.59375,19.6375 C20.59375,19.6375 20.59375,16.6679688 20.59375,16.6679688 C20.59375,16.6679688 23.0359375,16.6679688 23.0359375,16.6679688 C23.4671875,16.6679688 23.8023438,16.5242187 24.0898438,16.2367187 C24.3773438,15.9492188 24.5210937,15.6140625 24.5210937,15.1828125 C24.5210937,15.1828125 24.5210937,15.1828125 24.5210937,15.1828125 C24.5210937,15.1828125 24.5210937,1.48515625 24.5210937,1.48515625 C24.5210937,1.05390625 24.3773438,0.71875 24.0898438,0.43125 C23.8023437,0.14375 23.4671875,0 23.0359375,0 L23.0367187,0 Z M17.9601563,19.6359375 C17.9601563,19.6359375 10.1539062,19.6359375 10.1539062,19.6359375 C10.1539062,19.6359375 4.8859375,23.515625 4.8859375,23.515625 C4.8859375,23.515625 4.8859375,19.6359375 4.8859375,19.6359375 C4.8859375,19.6359375 1.48515625,19.6359375 1.48515625,19.6359375 C1.15,19.6359375 0.95859375,19.4445312 0.95859375,19.109375 C0.95859375,19.109375 0.95859375,19.109375 0.95859375,19.109375 C0.95859375,19.109375 0.95859375,5.41171875 0.95859375,5.41171875 C0.95859375,5.0765625 1.15,4.88515625 1.48515625,4.88515625 C1.48515625,4.88515625 1.48515625,4.88515625 1.48515625,4.88515625 C1.48515625,4.88515625 3.92734375,4.88515625 3.92734375,4.88515625 C3.92734375,4.88515625 3.92734375,15.1820312 3.92734375,15.1820312 C3.92734375,15.6132812 4.07109375,15.9484375 4.35859375,16.2359375 C4.64609375,16.5234375 4.98125,16.6671875 5.4125,16.6671875 C5.4125,16.6671875 5.4125,16.6671875 5.4125,16.6671875 C5.4125,16.6671875 14.08125,16.6671875 14.08125,16.6671875 C14.08125,16.6671875 17.9609375,19.6367187 17.9609375,19.6367187 L17.9601563,19.6359375 Z M23.5632812,1.484375 C23.5632812,1.484375 23.5632812,15.1820313 23.5632812,15.1820313 C23.5632812,15.5171875 23.371875,15.7085937 23.0367187,15.7085937 C23.0367187,15.7085937 23.0367187,15.7085937 23.0367187,15.7085937 C23.0367187,15.7085937 19.6367188,15.7085937 19.6367188,15.7085937 C19.6367188,15.7085937 19.6367188,19.6359375 19.6367188,19.6359375 C19.6367188,19.6359375 14.36875,15.7085937 14.36875,15.7085937 C14.36875,15.7085937 5.4125,15.7085937 5.4125,15.7085937 C5.07734375,15.7085937 4.8859375,15.5171875 4.8859375,15.1820313 C4.8859375,15.1820313 4.8859375,15.1820313 4.8859375,15.1820313 C4.8859375,15.1820313 4.8859375,1.484375 4.8859375,1.484375 C4.8859375,1.14921875 5.07734375,0.9578125 5.4125,0.9578125 C5.4125,0.9578125 5.4125,0.9578125 5.4125,0.9578125 C5.4125,0.9578125 23.0367187,0.9578125 23.0367187,0.9578125 C23.371875,0.9578125 23.5632812,1.14921875 23.5632812,1.484375 C23.5632812,1.484375 23.5632812,1.484375 23.5632812,1.484375 Z' }, void 0));
  const viewBox$p = '0 0 25 25';

  var chats = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$p,
    Component: Component$p,
    viewBox: viewBox$p
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$o = 'document-doc';
  const Component$o = () => (jsxRuntime.jsx("path", { d: 'M22.1632813,6.753125 C22.1632813,6.753125 22.1632813,6.753125 22.1632813,6.753125 C22.1632813,6.753125 15.8414062,0.43125 15.8414062,0.43125 C15.6023437,0.14375 15.21875,0 14.7875,0 C14.7875,0 14.7875,0 14.7875,0 C14.7875,0 3.48515625,0 3.48515625,0 C3.05390625,0 2.71875,0.14375 2.43125,0.43125 C2.14375,0.71875 2,1.05390625 2,1.48515625 C2,1.48515625 2,1.48515625 2,1.48515625 C2,1.48515625 2,23.0367188 2,23.0367188 C2,23.4679688 2.14375,23.803125 2.43125,24.090625 C2.71875,24.378125 3.05390625,24.521875 3.48515625,24.521875 C3.48515625,24.521875 3.48515625,24.521875 3.48515625,24.521875 C3.48515625,24.521875 21.109375,24.521875 21.109375,24.521875 C21.540625,24.521875 21.8757812,24.378125 22.1632813,24.090625 C22.4507812,23.803125 22.5945312,23.4679688 22.5945312,23.0367188 C22.5945312,23.0367188 22.5945312,23.0367188 22.5945312,23.0367188 C22.5945312,23.0367188 22.5945312,7.80703125 22.5945312,7.80703125 C22.5945312,7.37578125 22.4507812,7.040625 22.1632813,6.753125 Z M15.6976563,1.6765625 C15.6976563,1.6765625 20.8703125,6.84921875 20.8703125,6.84921875 C20.8703125,6.84921875 16.225,6.84921875 16.225,6.84921875 C15.8898438,6.84921875 15.7460938,6.70546875 15.7460938,6.3703125 C15.7460938,6.3703125 15.7460938,6.3703125 15.7460938,6.3703125 C15.7460938,6.3703125 15.6984375,1.6765625 15.6984375,1.6765625 L15.6976563,1.6765625 Z M21.6367188,7.8546875 C21.6367188,7.8546875 21.6367188,23.0367188 21.6367188,23.0367188 C21.6367188,23.371875 21.4453125,23.515625 21.1101563,23.515625 C21.1101563,23.515625 21.1101563,23.515625 21.1101563,23.515625 C21.1101563,23.515625 3.4859375,23.515625 3.4859375,23.515625 C3.15078125,23.515625 2.959375,23.371875 2.959375,23.0367188 C2.959375,23.0367188 2.959375,23.0367188 2.959375,23.0367188 C2.959375,23.0367188 2.959375,1.48515625 2.959375,1.48515625 C2.959375,1.15 3.15078125,0.95859375 3.4859375,0.95859375 C3.4859375,0.95859375 3.4859375,0.95859375 3.4859375,0.95859375 C3.4859375,0.95859375 14.740625,0.95859375 14.740625,0.95859375 C14.740625,0.95859375 14.740625,6.3703125 14.740625,6.3703125 C14.740625,6.8015625 14.884375,7.13671875 15.171875,7.42421875 C15.459375,7.71171875 15.7945313,7.85546875 16.2257813,7.85546875 C16.2257813,7.85546875 16.2257813,7.85546875 16.2257813,7.85546875 C16.2257813,7.85546875 21.6375,7.85546875 21.6375,7.85546875 L21.6367188,7.8546875 Z M7.4125,14.703125 C7.4125,14.703125 7.4125,14.703125 7.4125,14.703125 C7.4125,14.703125 17.1828125,14.703125 17.1828125,14.703125 C17.5179688,14.703125 17.709375,14.846875 17.709375,15.1820312 C17.709375,15.1820312 17.709375,15.1820312 17.709375,15.1820312 C17.709375,15.5171875 17.5179688,15.7085937 17.1828125,15.7085937 C17.1828125,15.7085937 17.1828125,15.7085937 17.1828125,15.7085937 C17.1828125,15.7085937 7.4125,15.7085937 7.4125,15.7085937 C7.07734375,15.7085937 6.8859375,15.5171875 6.8859375,15.1820312 C6.8859375,15.1820312 6.8859375,15.1820312 6.8859375,15.1820312 C6.8859375,14.846875 7.07734375,14.703125 7.4125,14.703125 Z M6.88515625,11.2546875 C6.88515625,11.2546875 6.88515625,11.2546875 6.88515625,11.2546875 C6.88515625,10.9195312 7.0765625,10.7757812 7.41171875,10.7757812 C7.41171875,10.7757812 7.41171875,10.7757812 7.41171875,10.7757812 C7.41171875,10.7757812 13.2546875,10.7757812 13.2546875,10.7757812 C13.5898438,10.7757812 13.78125,10.9195312 13.78125,11.2546875 C13.78125,11.2546875 13.78125,11.2546875 13.78125,11.2546875 C13.78125,11.5898438 13.5898438,11.78125 13.2546875,11.78125 C13.2546875,11.78125 13.2546875,11.78125 13.2546875,11.78125 C13.2546875,11.78125 7.41171875,11.78125 7.41171875,11.78125 C7.0765625,11.78125 6.88515625,11.5898438 6.88515625,11.2546875 Z M17.709375,19.109375 C17.709375,19.109375 17.709375,19.109375 17.709375,19.109375 C17.709375,19.4445312 17.5179688,19.6359375 17.1828125,19.6359375 C17.1828125,19.6359375 17.1828125,19.6359375 17.1828125,19.6359375 C17.1828125,19.6359375 7.4125,19.6359375 7.4125,19.6359375 C7.07734375,19.6359375 6.8859375,19.4445312 6.8859375,19.109375 C6.8859375,19.109375 6.8859375,19.109375 6.8859375,19.109375 C6.8859375,18.7742187 7.07734375,18.6304687 7.4125,18.6304687 C7.4125,18.6304687 7.4125,18.6304687 7.4125,18.6304687 C7.4125,18.6304687 17.1828125,18.6304687 17.1828125,18.6304687 C17.5179688,18.6304687 17.709375,18.7742187 17.709375,19.109375 Z' }, void 0));
  const viewBox$o = '0 0 25 25';

  var documentDoc = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$o,
    Component: Component$o,
    viewBox: viewBox$o
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$n = 'download';
  const Component$n = () => (jsxRuntime.jsx("path", { d: 'M2.04765625,20.8617188 C2.04765625,20.8617188 22.5460938,20.8617188 22.5460938,20.8617188 C22.5726562,20.8617188 22.59375,20.8828125 22.59375,20.909375 C22.59375,20.909375 22.59375,22.7289063 22.59375,22.7289063 C22.59375,22.7554687 22.5726562,22.7765625 22.5460938,22.7765625 C22.5460938,22.7765625 2.04765625,22.7765625 2.04765625,22.7765625 C2.02109375,22.7765625 2,22.7554687 2,22.7289063 C2,22.7289063 2,20.909375 2,20.909375 C2,20.8828125 2.02109375,20.8617188 2.04765625,20.8617188 Z M16.4625,12.16875 C16.628125,11.921875 16.8960937,11.8070312 17.2070312,11.8070312 C17.7984375,11.8070312 18.178125,12.1851562 18.178125,12.7742188 C18.178125,13.0335938 18.0765625,13.26875 17.8914062,13.4539063 C17.8914062,13.4539063 12.9953125,18.3789062 12.9953125,18.3789062 C12.9953125,18.3789062 12.8664062,18.471875 12.8664062,18.471875 C12.5585937,18.625 12.4609375,18.6671875 12.3109375,18.6671875 C12.1414062,18.6671875 11.9710937,18.603125 11.7078125,18.471875 C11.7078125,18.471875 11.5789062,18.3789062 11.5789062,18.3789062 C11.5789062,18.3789062 6.684375,13.4554688 6.684375,13.4554688 C6.49765625,13.2695312 6.396875,13.034375 6.396875,12.775 C6.396875,12.1859375 6.7765625,11.8070313 7.36796875,11.8070313 C7.6953125,11.8070313 7.96796875,11.9039063 8.1109375,12.1539063 C8.1109375,12.1539063 11.2921875,15.3226563 11.2921875,15.3226563 C11.2921875,15.3226563 11.2921875,2.96796875 11.2921875,2.96796875 C11.2921875,2.36796875 11.6976562,2 12.3109375,2 C12.9023438,2 13.2820312,2.37890625 13.2820312,2.96796875 C13.2820312,2.96796875 13.2820312,15.3242188 13.2820312,15.3242188 C13.2820312,15.3242188 16.4625,12.16875 16.4625,12.16875 L16.4625,12.16875 Z' }, void 0));
  const viewBox$n = '0 0 25 25';

  var download = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$n,
    Component: Component$n,
    viewBox: viewBox$n
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$m = 'facebook';
  const Component$m = () => (jsxRuntime.jsx("path", { d: 'M20.4398437,2.0015625 C20.4398437,2.0015625 20.4398437,2.0015625 20.4398437,2.0015625 C21.1585938,2.0015625 21.7804688,2.24140625 22.3078125,2.76796875 C22.3078125,2.76796875 22.3078125,2.76796875 22.3078125,2.76796875 C22.834375,3.246875 23.0742188,3.86953125 23.0742188,4.5875 C23.0742188,4.5875 23.0742188,4.5875 23.0742188,4.5875 C23.0742188,4.5875 23.0742188,20.4398437 23.0742188,20.4398437 C23.0742188,21.1585938 22.8351563,21.7804688 22.3078125,22.3078125 C21.7804687,22.8351562 21.1585937,23.0742188 20.4398437,23.0742188 C20.4398437,23.0742188 20.4398437,23.0742188 20.4398437,23.0742188 C20.4398437,23.0742188 16.4648438,23.0742188 16.4648438,23.0742188 C16.4648438,23.0742188 16.4648438,15.5070313 16.4648438,15.5070313 C16.4648438,15.5070313 19.2429687,15.5070313 19.2429687,15.5070313 C19.2429687,15.5070313 19.2429687,12.2023438 19.2429687,12.2023438 C19.2429687,12.2023438 16.4648438,12.2023438 16.4648438,12.2023438 C16.4648438,12.2023438 16.4648438,10.478125 16.4648438,10.478125 C16.4648438,9.99921875 16.7039063,9.759375 17.1351563,9.759375 C17.1351563,9.759375 17.1351563,9.759375 17.1351563,9.759375 C17.1351563,9.759375 19.2421875,9.759375 19.2421875,9.759375 C19.2421875,9.759375 19.2421875,6.0234375 19.2421875,6.0234375 C19.2421875,6.0234375 16.8953125,6.0234375 16.8953125,6.0234375 C15.6976562,6.0234375 14.6921875,6.4546875 13.878125,7.3640625 C13.878125,7.3640625 13.878125,7.3640625 13.878125,7.3640625 C13.0640625,8.27421875 12.6328125,9.32734375 12.6328125,10.5726563 C12.6328125,10.5726563 12.6328125,10.5726563 12.6328125,10.5726563 C12.6328125,10.5726563 12.6328125,12.2007813 12.6328125,12.2007813 C12.6328125,12.2007813 10.0945312,12.2007813 10.0945312,12.2007813 C10.0945312,12.2007813 10.0945312,15.5054687 10.0945312,15.5054687 C10.0945312,15.5054687 12.6328125,15.5054687 12.6328125,15.5054687 C12.6328125,15.5054687 12.6328125,23.0726562 12.6328125,23.0726562 C12.6328125,23.0726562 4.634375,23.0726562 4.634375,23.0726562 C3.915625,23.0726562 3.29375,22.8335937 2.76640625,22.30625 C2.2390625,21.7789062 2,21.1570312 2,20.4382812 C2,20.4382812 2,20.4382812 2,20.4382812 C2,20.4382812 2,4.5859375 2,4.5859375 C2,3.8671875 2.2390625,3.2453125 2.76640625,2.76640625 C2.76640625,2.76640625 2.76640625,2.76640625 2.76640625,2.76640625 C3.29296875,2.23984375 3.915625,2 4.634375,2 C4.634375,2 4.634375,2 4.634375,2 C4.634375,2 20.4390625,2 20.4390625,2 L20.4398437,2.0015625 Z' }, void 0));
  const viewBox$m = '0 0 25 25';

  var facebook = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$m,
    Component: Component$m,
    viewBox: viewBox$m
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$l = 'help';
  const Component$l = () => (jsxRuntime.jsx("path", { d: 'M6.2140625,19.3367188 C8.03359375,21.2046875 10.2367188,22.1148437 12.775,22.1148437 C15.3132812,22.1148437 17.5164062,21.2046875 19.384375,19.3367188 C21.2039063,17.5171875 22.1140625,15.3140625 22.1140625,12.7757812 C22.1140625,10.2375 21.2039063,8.034375 19.384375,6.16640625 C17.5164062,4.346875 15.3132812,3.43671875 12.775,3.43671875 C10.2367188,3.43671875 8.03359375,4.346875 6.2140625,6.16640625 C4.34609375,8.034375 3.4359375,10.2375 3.4359375,12.7757812 C3.4359375,15.3140625 4.34609375,17.5171875 6.2140625,19.3367188 Z M20.390625,20.390625 C18.2835938,22.4976562 15.7453125,23.5515625 12.7757812,23.5515625 C9.80625,23.5515625 7.26796875,22.4976562 5.1609375,20.390625 C3.05390625,18.2835938 2,15.7453125 2,12.7757812 C2,9.80625 3.05390625,7.26796875 5.1609375,5.1609375 C7.26796875,3.05390625 9.80625,2 12.7757812,2 C15.7453125,2 18.2835938,3.05390625 20.390625,5.1609375 C22.4976562,7.26796875 23.5515625,9.80625 23.5515625,12.7757812 C23.5515625,15.7453125 22.4976562,18.2835938 20.390625,20.390625 Z M13.7335937,14.6914062 C13.7335937,14.6914062 11.578125,14.6914062 11.578125,14.6914062 C11.578125,14.6914062 11.578125,14.1164062 11.578125,14.1164062 C11.578125,13.6851562 11.6742187,13.2546875 11.9132813,12.7273437 C11.9132813,12.7273437 11.9132813,12.7273437 11.9132813,12.7273437 C12.1523437,12.3445312 12.5835937,11.9609375 13.1585937,11.5296875 C13.1585937,11.5296875 13.1585937,11.5296875 13.1585937,11.5296875 C13.6851562,11.146875 14.0203125,10.8109375 14.2601562,10.5242188 C14.2601562,10.5242188 14.2601562,10.5242188 14.2601562,10.5242188 C14.4515625,10.2851563 14.5476562,9.99765625 14.5476562,9.6625 C14.5476562,9.6625 14.5476562,9.6625 14.5476562,9.6625 C14.5476562,9.32734375 14.4039062,9.03984375 14.1648437,8.8484375 C14.1648437,8.8484375 14.1648437,8.8484375 14.1648437,8.8484375 C13.8296875,8.7046875 13.4945312,8.609375 13.0632812,8.609375 C13.0632812,8.609375 13.0632812,8.609375 13.0632812,8.609375 C12.2492187,8.609375 11.2914062,8.8484375 10.2851562,9.37578125 C10.2851562,9.37578125 10.2851562,9.37578125 10.2851562,9.37578125 C10.2851562,9.37578125 9.375,7.60390625 9.375,7.60390625 C10.6203125,6.93359375 11.9132813,6.5984375 13.2546875,6.5984375 C13.2546875,6.5984375 13.2546875,6.5984375 13.2546875,6.5984375 C14.4523438,6.5984375 15.3140625,6.8859375 15.8890625,7.4125 C15.8890625,7.4125 15.8890625,7.4125 15.8890625,7.4125 C16.559375,7.9390625 16.8945312,8.61015625 16.8945312,9.51953125 C16.8945312,9.51953125 16.8945312,9.51953125 16.8945312,9.51953125 C16.8945312,10.1421875 16.7507812,10.66875 16.5117188,11.1 C16.5117188,11.1 16.5117188,11.1 16.5117188,11.1 C16.2242187,11.53125 15.6976562,12.0101563 14.93125,12.5367188 C14.93125,12.5367188 14.93125,12.5367188 14.93125,12.5367188 C14.5,12.8242188 14.2125,13.1117188 13.9734375,13.446875 C13.9734375,13.446875 13.9734375,13.446875 13.9734375,13.446875 C13.8296875,13.6859375 13.734375,13.9257813 13.734375,14.2132813 C13.734375,14.2132813 13.734375,14.2132813 13.734375,14.2132813 C13.734375,14.2132813 13.734375,14.6921875 13.734375,14.6921875 L13.7335937,14.6914062 Z M11.3382812,17.5171875 C11.3382812,17.5171875 11.3382812,17.5171875 11.3382812,17.5171875 C11.3382812,17.0382813 11.434375,16.703125 11.6734375,16.4632813 C11.6734375,16.4632813 11.6734375,16.4632813 11.6734375,16.4632813 C11.9125,16.2242187 12.2960937,16.128125 12.775,16.128125 C12.775,16.128125 12.775,16.128125 12.775,16.128125 C13.20625,16.128125 13.5890625,16.2242188 13.8289062,16.4632813 C13.8289062,16.4632813 13.8289062,16.4632813 13.8289062,16.4632813 C14.0679688,16.7023438 14.1640625,17.0382813 14.1640625,17.5171875 C14.1640625,17.5171875 14.1640625,17.5171875 14.1640625,17.5171875 C14.1640625,17.9484375 14.0203125,18.2835938 13.78125,18.5226563 C13.78125,18.5226563 13.78125,18.5226563 13.78125,18.5226563 C13.5421875,18.7617188 13.20625,18.8578125 12.7757812,18.8578125 C12.7757812,18.8578125 12.7757812,18.8578125 12.7757812,18.8578125 C12.296875,18.8578125 11.9617188,18.7617188 11.721875,18.5226563 C11.721875,18.5226563 11.721875,18.5226563 11.721875,18.5226563 C11.4828125,18.2835938 11.3390625,17.9476563 11.3390625,17.5171875 L11.3382812,17.5171875 Z' }, void 0));
  const viewBox$l = '0 0 25 25';

  var help = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$l,
    Component: Component$l,
    viewBox: viewBox$l
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$k = 'robot-solid';
  const Component$k = () => (jsxRuntime.jsx("path", { d: 'M5.890625,4.92734375 C5.890625,4.92734375 5.890625,4.92734375 5.890625,4.92734375 C5.890625,4.92734375 18.6296875,4.92734375 18.6296875,4.92734375 C19.73125,4.92734375 20.6414062,5.31015625 21.4078125,6.0765625 C22.1742188,6.84296875 22.5570313,7.753125 22.5570313,8.8546875 C22.5570313,8.8546875 22.5570313,8.8546875 22.5570313,8.8546875 C22.5570313,8.8546875 22.5570313,16.709375 22.5570313,16.709375 C22.5570313,17.8109375 22.1742188,18.7210938 21.4078125,19.4875 C20.6414062,20.2539063 19.73125,20.6367188 18.6296875,20.6367188 C18.6296875,20.6367188 18.6296875,20.6367188 18.6296875,20.6367188 C18.6296875,20.6367188 5.890625,20.6367188 5.890625,20.6367188 C4.7890625,20.6367188 3.87890625,20.2539063 3.1125,19.4875 C2.34609375,18.7210938 1.96328125,17.8109375 1.96328125,16.709375 C1.96328125,16.709375 1.96328125,16.709375 1.96328125,16.709375 C1.96328125,16.709375 1.96328125,8.8546875 1.96328125,8.8546875 C1.96328125,7.753125 2.34609375,6.84296875 3.1125,6.0765625 C3.87890625,5.31015625 4.7890625,4.92734375 5.890625,4.92734375 Z M15.7085938,9.38125 C15.7085938,9.38125 15.7085938,9.38125 15.7085938,9.38125 C15.4210938,9.38125 15.1820313,9.47734375 14.9898438,9.66875 C14.7976562,9.86015625 14.7023438,10.1 14.7023438,10.3390625 C14.7023438,10.3390625 14.7023438,10.3390625 14.7023438,10.3390625 C14.7023438,10.3390625 14.7023438,11.3445312 14.7023438,11.3445312 C14.7023438,11.5835937 14.7984375,11.8234375 14.9898438,12.0148438 C15.18125,12.20625 15.4210938,12.3023438 15.7085938,12.3023438 C15.7085938,12.3023438 15.7085938,12.3023438 15.7085938,12.3023438 C15.9476563,12.3023438 16.1875,12.20625 16.3789063,12.0148438 C16.5703125,11.8234375 16.6664063,11.5835938 16.6664063,11.3445312 C16.6664063,11.3445312 16.6664063,11.3445312 16.6664063,11.3445312 C16.6664063,11.3445312 16.6664063,10.3390625 16.6664063,10.3390625 C16.6664063,10.1 16.5703125,9.86015625 16.3789063,9.66875 C16.1875,9.47734375 15.9476563,9.38125 15.7085938,9.38125 L15.7085938,9.38125 Z M8.8125,9.38125 C8.8125,9.38125 8.8125,9.38125 8.8125,9.38125 C8.5734375,9.38125 8.33359375,9.47734375 8.1421875,9.66875 C7.95078125,9.86015625 7.8546875,10.1 7.8546875,10.3390625 C7.8546875,10.3390625 7.8546875,10.3390625 7.8546875,10.3390625 C7.8546875,10.3390625 7.8546875,11.3445312 7.8546875,11.3445312 C7.8546875,11.5835937 7.95078125,11.8234375 8.1421875,12.0148438 C8.33359375,12.20625 8.5734375,12.3023438 8.8125,12.3023438 C8.8125,12.3023438 8.8125,12.3023438 8.8125,12.3023438 C9.1,12.3023438 9.3390625,12.20625 9.53125,12.0148438 C9.7234375,11.8234375 9.81875,11.5835938 9.81875,11.3445312 C9.81875,11.3445312 9.81875,11.3445312 9.81875,11.3445312 C9.81875,11.3445312 9.81875,10.3390625 9.81875,10.3390625 C9.81875,10.1 9.72265625,9.86015625 9.53125,9.66875 C9.33984375,9.47734375 9.1,9.38125 8.8125,9.38125 L8.8125,9.38125 Z M10.296875,15.7515625 C10.296875,15.7515625 14.2242188,15.7515625 14.2242188,15.7515625 C14.559375,15.7515625 14.703125,15.5601562 14.703125,15.225 C14.703125,15.225 14.703125,15.225 14.703125,15.225 C14.703125,14.8898438 14.559375,14.7460938 14.2242188,14.7460938 C14.2242188,14.7460938 14.2242188,14.7460938 14.2242188,14.7460938 C14.2242188,14.7460938 10.296875,14.7460938 10.296875,14.7460938 C9.96171875,14.7460938 9.81796875,14.8898438 9.81796875,15.225 C9.81796875,15.225 9.81796875,15.225 9.81796875,15.225 C9.81796875,15.5601562 9.96171875,15.7515625 10.296875,15.7515625 C10.296875,15.7515625 10.296875,15.7515625 10.296875,15.7515625 Z M0.9578125,13.7875 C0.9578125,13.7875 0.9578125,12.7820312 0.9578125,12.7820312 C0.9578125,12.7820312 1.96328125,12.7820312 1.96328125,12.7820312 C1.96328125,12.7820312 1.96328125,13.7875 1.96328125,13.7875 C1.96328125,13.7875 0.9578125,13.7875 0.9578125,13.7875 Z M22.5578125,13.7875 C22.5578125,13.7875 22.5578125,12.7820312 22.5578125,12.7820312 C22.5578125,12.7820312 23.5632813,12.7820312 23.5632813,12.7820312 C23.5632813,12.7820312 23.5632813,13.7875 23.5632813,13.7875 C23.5632813,13.7875 22.5578125,13.7875 22.5578125,13.7875 Z M0,11.3453125 C0,11.0101562 0.14375,10.81875 0.47890625,10.81875 C0.8140625,10.81875 0.9578125,11.0101562 0.9578125,11.3453125 C0.9578125,11.3453125 0.9578125,11.3453125 0.9578125,11.3453125 C0.9578125,11.3453125 0.9578125,15.225 0.9578125,15.225 C0.9578125,15.5601562 0.8140625,15.7515625 0.47890625,15.7515625 C0.14375,15.7515625 0,15.5601562 0,15.225 C0,15.225 0,15.225 0,15.225 C0,15.225 0,11.3453125 0,11.3453125 Z M23.5632812,11.3453125 C23.5632812,11.0101562 23.7070312,10.81875 24.0421875,10.81875 C24.3773437,10.81875 24.5210937,11.0101562 24.5210937,11.3453125 C24.5210937,11.3453125 24.5210937,11.3453125 24.5210937,11.3453125 C24.5210937,11.3453125 24.5210937,15.225 24.5210937,15.225 C24.5210937,15.5601562 24.3773437,15.7515625 24.0421875,15.7515625 C23.7070312,15.7515625 23.5632812,15.5601562 23.5632812,15.225 C23.5632812,15.225 23.5632812,15.225 23.5632812,15.225 C23.5632812,15.225 23.5632812,11.3453125 23.5632812,11.3453125 Z M6.36953125,22.6 C6.36953125,22.6 6.36953125,22.6 6.36953125,22.6 C6.36953125,22.6 18.1507812,22.6 18.1507812,22.6 C18.4859375,22.6 18.6296875,22.74375 18.6296875,23.0789062 C18.6296875,23.0789062 18.6296875,23.0789062 18.6296875,23.0789062 C18.6296875,23.0789062 18.6296875,23.6054688 18.6296875,23.6054688 C18.6296875,23.6054688 5.890625,23.6054688 5.890625,23.6054688 C5.890625,23.6054688 5.890625,23.0789062 5.890625,23.0789062 C5.890625,22.74375 6.034375,22.6 6.36953125,22.6 Z M10.7757812,23.6054688 C10.7757812,23.6054688 10.7757812,20.6359375 10.7757812,20.6359375 C10.7757812,20.6359375 13.7453125,20.6359375 13.7453125,20.6359375 C13.7453125,20.6359375 13.7453125,23.6054688 13.7453125,23.6054688 C13.7453125,23.6054688 10.7757812,23.6054688 10.7757812,23.6054688 Z M13.3140625,1.43125 C13.6015625,1.71875 13.7453125,2.05390625 13.7453125,2.48515625 C13.7453125,2.91640625 13.6015625,3.2515625 13.3140625,3.5390625 C13.0265625,3.8265625 12.6914062,3.9703125 12.2601562,3.9703125 C11.8289063,3.9703125 11.49375,3.8265625 11.20625,3.5390625 C10.91875,3.2515625 10.775,2.91640625 10.775,2.48515625 C10.775,2.05390625 10.91875,1.71875 11.20625,1.43125 C11.49375,1.14375 11.8289063,1 12.2601562,1 C12.6914062,1 13.0265625,1.14375 13.3140625,1.43125 Z M11.78125,4.92734375 C11.78125,4.92734375 11.78125,2.9640625 11.78125,2.9640625 C11.78125,2.9640625 12.7390625,2.9640625 12.7390625,2.9640625 C12.7390625,2.9640625 12.7390625,4.92734375 12.7390625,4.92734375 C12.7390625,4.92734375 11.78125,4.92734375 11.78125,4.92734375 Z' }, void 0));
  const viewBox$k = '0 0 25 25';

  var botSolid = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$k,
    Component: Component$k,
    viewBox: viewBox$k
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$j = 'twitter';
  const Component$j = () => (jsxRuntime.jsx("path", { d: 'M23.6054688,5.1546875 C23.6054688,5.1546875 23.6054688,5.1546875 23.6054688,5.1546875 C22.9351562,6.06484375 22.16875,6.87890625 21.2585937,7.54921875 C21.2585937,7.54921875 21.2585937,7.54921875 21.2585937,7.54921875 C21.2585937,7.54921875 21.2585937,8.12421875 21.2585937,8.12421875 C21.2585937,10.23125 20.7796875,12.290625 19.821875,14.2546875 C19.821875,14.2546875 19.821875,14.2546875 19.821875,14.2546875 C18.8164062,16.2179688 17.2835938,17.8945312 15.2242187,19.2351562 C15.2242187,19.2351562 15.2242187,19.2351562 15.2242187,19.2351562 C13.1648437,20.5757812 10.7703125,21.246875 8.1359375,21.246875 C8.1359375,21.246875 8.1359375,21.246875 8.1359375,21.246875 C5.5015625,21.246875 3.15546875,20.5765625 1,19.1875 C1,19.1875 1,19.1875 1,19.1875 C1.14375,19.2351562 1.5265625,19.2351562 2.14921875,19.2351562 C2.14921875,19.2351562 2.14921875,19.2351562 2.14921875,19.2351562 C4.3046875,19.2351562 6.2203125,18.6125 7.89609375,17.3195312 C7.89609375,17.3195312 7.89609375,17.3195312 7.89609375,17.3195312 C6.890625,17.271875 6.028125,16.984375 5.2140625,16.3617188 C5.2140625,16.3617188 5.2140625,16.3617188 5.2140625,16.3617188 C4.4,15.7867187 3.8734375,15.0210937 3.5859375,14.0625 C3.5859375,14.0625 3.5859375,14.0625 3.5859375,14.0625 C3.77734375,14.1101562 4.06484375,14.1585937 4.4,14.1585937 C4.4,14.1585937 4.4,14.1585937 4.4,14.1585937 C4.83125,14.1585937 5.26171875,14.1109375 5.6453125,14.0148437 C5.6453125,14.0148437 5.6453125,14.0148437 5.6453125,14.0148437 C4.54375,13.7757812 3.68203125,13.2484375 2.96328125,12.3867187 C2.96328125,12.3867187 2.96328125,12.3867187 2.96328125,12.3867187 C2.29296875,11.525 1.9578125,10.5671875 1.9578125,9.465625 C1.9578125,9.465625 1.9578125,9.465625 1.9578125,9.465625 C1.9578125,9.465625 1.9578125,9.41796875 1.9578125,9.41796875 C2.628125,9.753125 3.2984375,9.94453125 4.0171875,9.99296875 C4.0171875,9.99296875 4.0171875,9.99296875 4.0171875,9.99296875 C2.628125,9.03515625 1.9578125,7.7421875 1.9578125,6.11328125 C1.9578125,6.11328125 1.9578125,6.11328125 1.9578125,6.11328125 C1.9578125,5.29921875 2.14921875,4.5328125 2.58046875,3.8140625 C2.58046875,3.8140625 2.58046875,3.8140625 2.58046875,3.8140625 C5.11875,6.92734375 8.32734375,8.5078125 12.159375,8.603125 C12.159375,8.603125 12.159375,8.603125 12.159375,8.603125 C12.0632812,8.315625 12.015625,7.98046875 12.015625,7.59765625 C12.015625,7.59765625 12.015625,7.59765625 12.015625,7.59765625 C12.015625,6.3046875 12.446875,5.203125 13.35625,4.340625 C13.35625,4.340625 13.35625,4.340625 13.35625,4.340625 C14.2664062,3.43046875 15.3679687,3 16.6609375,3 C16.6609375,3 16.6609375,3 16.6609375,3 C18.0015625,3 19.103125,3.47890625 20.0132812,4.3890625 C20.0132812,4.3890625 20.0132812,4.3890625 20.0132812,4.3890625 C21.0671875,4.15 22.025,3.8140625 22.934375,3.33515625 C22.934375,3.33515625 22.934375,3.33515625 22.934375,3.33515625 C22.5992188,4.43671875 21.9289063,5.25078125 20.9226562,5.8734375 C20.9226562,5.8734375 20.9226562,5.8734375 20.9226562,5.8734375 C21.8328125,5.7296875 22.7421875,5.490625 23.6046875,5.1546875 C23.6046875,5.1546875 23.6046875,5.1546875 23.6046875,5.1546875 L23.6054688,5.1546875 Z' }, void 0));
  const viewBox$j = '0 0 25 25';

  var twitter = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$j,
    Component: Component$j,
    viewBox: viewBox$j
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$i = 'bulb-solid';
  const Component$i = () => (jsxRuntime.jsx("path", { d: 'M15.775,20.109375 C15.775,20.109375 15.775,20.109375 15.775,20.109375 C15.775,20.4445313 15.63125,20.6359375 15.2960938,20.6359375 C15.2960938,20.6359375 15.2960938,20.6359375 15.2960938,20.6359375 C15.2960938,20.6359375 9.40546875,20.6359375 9.40546875,20.6359375 C9.0703125,20.6359375 8.9265625,20.4445313 8.9265625,20.109375 C8.9265625,20.109375 8.9265625,20.109375 8.9265625,20.109375 C8.9265625,19.7742187 9.0703125,19.6304687 9.40546875,19.6304687 C9.40546875,19.6304687 9.40546875,19.6304687 9.40546875,19.6304687 C9.40546875,19.6304687 15.2960938,19.6304687 15.2960938,19.6304687 C15.63125,19.6304687 15.775,19.7742187 15.775,20.109375 Z M15.2960937,21.59375 C15.2960937,21.59375 15.2960937,21.59375 15.2960937,21.59375 C15.2960937,21.59375 9.40546875,21.59375 9.40546875,21.59375 C9.0703125,21.59375 8.9265625,21.7375 8.9265625,22.0726563 C8.9265625,22.0726563 8.9265625,22.0726563 8.9265625,22.0726563 C8.9265625,22.4078125 9.0703125,22.5992187 9.40546875,22.5992187 C9.40546875,22.5992187 9.40546875,22.5992187 9.40546875,22.5992187 C9.40546875,22.5992187 9.93203125,22.5992187 9.93203125,22.5992187 C10.0757812,23.1257812 10.3632812,23.6046875 10.79375,23.9882812 C11.2242188,24.371875 11.7515625,24.5632812 12.3742188,24.5632812 C12.3742188,24.5632812 12.3742188,24.5632812 12.3742188,24.5632812 C12.9492187,24.5632812 13.4757812,24.371875 13.9070312,23.9882812 C14.3382813,23.6046875 14.6257813,23.1265625 14.76875,22.5992187 C14.76875,22.5992187 14.76875,22.5992187 14.76875,22.5992187 C14.76875,22.5992187 15.2953125,22.5992187 15.2953125,22.5992187 C15.6304688,22.5992187 15.7742188,22.4078125 15.7742188,22.0726563 C15.7742188,22.0726563 15.7742188,22.0726563 15.7742188,22.0726563 C15.7742188,21.7375 15.6304688,21.59375 15.2953125,21.59375 L15.2960937,21.59375 Z M12.3273438,1 C12.3273438,1 12.375,1 12.375,1 C12.375,1 12.1835938,1 12.1835938,1 C10.2203125,1 8.49609375,1.71875 7.10703125,3.10703125 C5.71796875,4.4953125 5,6.2203125 5,8.18359375 C5,8.18359375 5,8.18359375 5,8.18359375 C5,8.18359375 5,8.375 5,8.375 C5,9.7640625 5.71875,11.6796875 7.203125,14.121875 C7.203125,14.121875 7.203125,14.121875 7.203125,14.121875 C8.35234375,15.9414063 8.92734375,17.2828125 8.92734375,18.1445313 C8.92734375,18.1445313 8.92734375,18.1445313 8.92734375,18.1445313 C8.92734375,18.4796875 9.07109375,18.6710938 9.40625,18.6710938 C9.40625,18.6710938 9.40625,18.6710938 9.40625,18.6710938 C9.40625,18.6710938 15.296875,18.6710938 15.296875,18.6710938 C15.6320312,18.6710938 15.7757812,18.4796875 15.7757812,18.1445313 C15.7757812,18.1445313 15.7757812,18.1445313 15.7757812,18.1445313 C15.7757812,17.378125 16.3507812,16.0375 17.5,14.121875 C17.5,14.121875 17.5,14.121875 17.5,14.121875 C18.984375,11.775 19.703125,9.859375 19.703125,8.375 C19.703125,8.375 19.703125,8.375 19.703125,8.375 C19.703125,8.375 19.703125,8.18359375 19.703125,8.18359375 C19.703125,6.2203125 18.984375,4.49609375 17.5960938,3.10703125 C16.2078125,1.71796875 14.4828125,1 12.5195312,1 C12.5195312,1 12.5195312,1 12.5195312,1 C12.5195312,1 12.328125,1 12.328125,1 L12.3273438,1 Z' }, void 0));
  const viewBox$i = '0 0 25 25';

  var bulbSolid = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$i,
    Component: Component$i,
    viewBox: viewBox$i
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$h = 'bulb';
  const Component$h = () => (jsxRuntime.jsx("path", { d: 'M15.8234375,20.109375 C15.8234375,20.109375 15.8234375,20.109375 15.8234375,20.109375 C15.8234375,20.4445313 15.6320312,20.6359375 15.296875,20.6359375 C15.296875,20.6359375 15.296875,20.6359375 15.296875,20.6359375 C15.296875,20.6359375 9.45390625,20.6359375 9.45390625,20.6359375 C9.11875,20.6359375 8.92734375,20.4445313 8.92734375,20.109375 C8.92734375,20.109375 8.92734375,20.109375 8.92734375,20.109375 C8.92734375,19.7742187 9.11875,19.6304687 9.45390625,19.6304687 C9.45390625,19.6304687 9.45390625,19.6304687 9.45390625,19.6304687 C9.45390625,19.6304687 15.296875,19.6304687 15.296875,19.6304687 C15.6320312,19.6304687 15.8234375,19.7742187 15.8234375,20.109375 Z M15.296875,21.59375 C15.296875,21.59375 15.296875,21.59375 15.296875,21.59375 C15.296875,21.59375 9.45390625,21.59375 9.45390625,21.59375 C9.11875,21.59375 8.92734375,21.7375 8.92734375,22.0726563 C8.92734375,22.0726563 8.92734375,22.0726563 8.92734375,22.0726563 C8.92734375,22.4078125 9.11875,22.5992187 9.45390625,22.5992187 C9.45390625,22.5992187 9.45390625,22.5992187 9.45390625,22.5992187 C9.45390625,22.5992187 9.98046875,22.5992187 9.98046875,22.5992187 C10.1242188,23.1742188 10.4117188,23.653125 10.8421875,23.9882812 C11.2734375,24.3710937 11.8,24.5632812 12.375,24.5632812 C12.95,24.5632812 13.4765625,24.371875 13.9078125,23.9882812 C14.3390625,23.653125 14.6265625,23.1742187 14.7695313,22.5992187 C14.7695313,22.5992187 14.7695313,22.5992187 14.7695313,22.5992187 C14.7695313,22.5992187 15.2960938,22.5992187 15.2960938,22.5992187 C15.63125,22.5992187 15.8226563,22.4078125 15.8226563,22.0726563 C15.8226563,22.0726563 15.8226563,22.0726563 15.8226563,22.0726563 C15.8226563,21.7375 15.63125,21.59375 15.2960938,21.59375 L15.296875,21.59375 Z M19.7507812,8.18359375 C19.7507812,8.18359375 19.7507812,8.375 19.7507812,8.375 C19.7507812,9.81171875 18.984375,11.7273438 17.5,14.121875 C17.5,14.121875 17.5,14.121875 17.5,14.121875 C16.3984375,15.9898437 15.8234375,17.3304687 15.8234375,18.1445313 C15.8234375,18.1445313 15.8234375,18.1445313 15.8234375,18.1445313 C15.8234375,18.4796875 15.6320312,18.6710938 15.296875,18.6710938 C15.296875,18.6710938 15.296875,18.6710938 15.296875,18.6710938 C15.296875,18.6710938 9.45390625,18.6710938 9.45390625,18.6710938 C9.11875,18.6710938 8.92734375,18.4796875 8.92734375,18.1445313 C8.92734375,18.1445313 8.92734375,18.1445313 8.92734375,18.1445313 C8.92734375,17.3304687 8.35234375,15.9890625 7.25078125,14.121875 C7.25078125,14.121875 7.25078125,14.121875 7.25078125,14.121875 C5.76640625,11.7273438 5,9.81171875 5,8.375 C5,8.375 5,8.375 5,8.375 C5,8.375 5,8.18359375 5,8.18359375 C5,6.2203125 5.71875,4.49609375 7.15546875,3.10703125 C8.54453125,1.71796875 10.26875,1 12.2320312,1 C12.2320312,1 12.2320312,1 12.2320312,1 C12.2320312,1 12.3757812,1 12.3757812,1 C12.3757812,1 12.5195313,1 12.5195313,1 C14.4828125,1 16.2070312,1.71875 17.64375,3.10703125 C19.0328125,4.49609375 19.7507812,6.2203125 19.7507812,8.18359375 C19.7507812,8.18359375 19.7507812,8.18359375 19.7507812,8.18359375 L19.7507812,8.18359375 Z M18.7453125,8.37578125 C18.7453125,8.37578125 18.7453125,8.37578125 18.7453125,8.37578125 C18.7453125,8.37578125 18.7453125,8.13671875 18.7453125,8.13671875 C18.7453125,6.46015625 18.1703125,4.97578125 16.9734375,3.778125 C15.7765625,2.58046875 14.2914062,1.95859375 12.5671875,1.95859375 C12.5671875,1.95859375 12.5671875,1.95859375 12.5671875,1.95859375 C12.5671875,1.95859375 12.3757812,1.95859375 12.3757812,1.95859375 C12.3757812,1.95859375 12.184375,1.95859375 12.184375,1.95859375 C10.4601562,1.95859375 9.0234375,2.58125 7.82578125,3.778125 C6.628125,4.975 6.00625,6.46015625 6.00625,8.13671875 C6.00625,8.13671875 6.00625,8.13671875 6.00625,8.13671875 C6.00625,8.13671875 6.00625,8.37578125 6.00625,8.37578125 C6.00625,9.62109375 6.6765625,11.3453125 8.065625,13.5960937 C8.065625,13.5960937 8.065625,13.5960937 8.065625,13.5960937 C8.92734375,14.7453125 9.55,16.0867187 9.88515625,17.61875 C9.88515625,17.61875 9.88515625,17.61875 9.88515625,17.61875 C9.88515625,17.61875 14.865625,17.6664063 14.865625,17.6664063 C15.2007812,16.1335938 15.8234375,14.7929688 16.6851562,13.5953125 C16.6851562,13.5953125 16.6851562,13.5953125 16.6851562,13.5953125 C18.0742187,11.3445312 18.7445312,9.6203125 18.7445312,8.375 L18.7453125,8.37578125 Z' }, void 0));
  const viewBox$h = '0 0 25 25';

  var bulb = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$h,
    Component: Component$h,
    viewBox: viewBox$h
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$g = 'chain-up';
  const Component$g = () => (jsxRuntime.jsx("path", { d: 'M9.81875,20.6296875 C9.81875,20.6296875 9.81875,22.1140625 9.81875,22.1140625 C9.81875,22.4492188 9.675,22.5929688 9.33984375,22.5929688 C9.33984375,22.5929688 9.33984375,22.5929688 9.33984375,22.5929688 C9.33984375,22.5929688 1.48515625,22.5929688 1.48515625,22.5929688 C1.15,22.5929688 0.95859375,22.4492188 0.95859375,22.1140625 C0.95859375,22.1140625 0.95859375,22.1140625 0.95859375,22.1140625 C0.95859375,22.1140625 0.95859375,16.2234375 0.95859375,16.2234375 C0.95859375,15.8882813 1.15,15.696875 1.48515625,15.696875 C1.48515625,15.696875 1.48515625,15.696875 1.48515625,15.696875 C1.48515625,15.696875 9.33984375,15.696875 9.33984375,15.696875 C9.675,15.696875 9.81875,15.8882813 9.81875,16.2234375 C9.81875,16.2234375 9.81875,16.2234375 9.81875,16.2234375 C9.81875,16.2234375 9.81875,17.6601562 9.81875,17.6601562 C9.81875,17.6601562 10.7765625,17.6601562 10.7765625,17.6601562 C10.7765625,17.6601562 10.7765625,16.2234375 10.7765625,16.2234375 C10.7765625,15.7921875 10.6328125,15.4570312 10.39375,15.1695313 C10.10625,14.8820313 9.77109375,14.7382812 9.33984375,14.7382812 C9.33984375,14.7382812 9.33984375,14.7382812 9.33984375,14.7382812 C9.33984375,14.7382812 1.48515625,14.7382812 1.48515625,14.7382812 C1.05390625,14.7382812 0.71875,14.8820313 0.43125,15.1695313 C0.14375,15.4570312 0,15.7921875 0,16.2234375 C0,16.2234375 0,16.2234375 0,16.2234375 C0,16.2234375 0,22.1140625 0,22.1140625 C0,22.5453125 0.14375,22.8804688 0.43125,23.1195313 C0.71875,23.4070313 1.05390625,23.5507812 1.48515625,23.5507812 C1.48515625,23.5507812 1.48515625,23.5507812 1.48515625,23.5507812 C1.48515625,23.5507812 9.33984375,23.5507812 9.33984375,23.5507812 C9.77109375,23.5507812 10.10625,23.4070313 10.39375,23.1195313 C10.6328125,22.8804687 10.7765625,22.5445313 10.7765625,22.1140625 C10.7765625,22.1140625 10.7765625,22.1140625 10.7765625,22.1140625 C10.7765625,22.1140625 10.7765625,20.6296875 10.7765625,20.6296875 C10.7765625,20.6296875 9.81875,20.6296875 9.81875,20.6296875 Z M23.0375,14.7390625 C23.0375,14.7390625 23.0375,14.7390625 23.0375,14.7390625 C23.0375,14.7390625 15.1828125,14.7390625 15.1828125,14.7390625 C14.7515625,14.7390625 14.4164062,14.8828125 14.1773437,15.1703125 C13.8898437,15.4578125 13.7460937,15.7929688 13.7460937,16.2242187 C13.7460937,16.2242187 13.7460937,16.2242187 13.7460937,16.2242187 C13.7460937,16.2242187 13.7460937,17.6609375 13.7460937,17.6609375 C13.7460937,17.6609375 14.7039062,17.6609375 14.7039062,17.6609375 C14.7039062,17.6609375 14.7039062,16.2242187 14.7039062,16.2242187 C14.7039062,15.8890625 14.8476562,15.6976562 15.1828125,15.6976562 C15.1828125,15.6976562 15.1828125,15.6976562 15.1828125,15.6976562 C15.1828125,15.6976562 23.0375,15.6976562 23.0375,15.6976562 C23.3726562,15.6976562 23.5640625,15.8890625 23.5640625,16.2242187 C23.5640625,16.2242187 23.5640625,16.2242187 23.5640625,16.2242187 C23.5640625,16.2242187 23.5640625,22.1148437 23.5640625,22.1148437 C23.5640625,22.45 23.3726562,22.59375 23.0375,22.59375 C23.0375,22.59375 23.0375,22.59375 23.0375,22.59375 C23.0375,22.59375 15.1828125,22.59375 15.1828125,22.59375 C14.8476562,22.59375 14.7039062,22.45 14.7039062,22.1148437 C14.7039062,22.1148437 14.7039062,22.1148437 14.7039062,22.1148437 C14.7039062,22.1148437 14.7039062,20.6304688 14.7039062,20.6304688 C14.7039062,20.6304688 13.7460937,20.6304688 13.7460937,20.6304688 C13.7460937,20.6304688 13.7460937,22.1148437 13.7460937,22.1148437 C13.7460937,22.5460938 13.8898437,22.88125 14.1773437,23.1203125 C14.4164062,23.4078125 14.7523437,23.5515625 15.1828125,23.5515625 C15.1828125,23.5515625 15.1828125,23.5515625 15.1828125,23.5515625 C15.1828125,23.5515625 23.0375,23.5515625 23.0375,23.5515625 C23.46875,23.5515625 23.8039063,23.4078125 24.0914062,23.1203125 C24.3789062,22.88125 24.5226562,22.5453125 24.5226562,22.1148437 C24.5226562,22.1148437 24.5226562,22.1148437 24.5226562,22.1148437 C24.5226562,22.1148437 24.5226562,16.2242187 24.5226562,16.2242187 C24.5226562,15.7929688 24.3789062,15.4578125 24.0914062,15.1703125 C23.8039062,14.8828125 23.46875,14.7390625 23.0375,14.7390625 L23.0375,14.7390625 Z M6.3703125,18.6664063 C6.3703125,18.6664063 6.3703125,18.6664063 6.3703125,18.6664063 C6.3703125,18.6664063 18.1515625,18.6664063 18.1515625,18.6664063 C18.4867188,18.6664063 18.6304687,18.8101563 18.6304687,19.1453125 C18.6304687,19.4804688 18.4867188,19.6242188 18.1515625,19.6242188 C18.1515625,19.6242188 18.1515625,19.6242188 18.1515625,19.6242188 C18.1515625,19.6242188 6.3703125,19.6242188 6.3703125,19.6242188 C6.03515625,19.6242188 5.89140625,19.4804688 5.89140625,19.1453125 C5.89140625,18.8101563 6.03515625,18.6664063 6.3703125,18.6664063 Z M15.565625,5.06484375 C15.565625,5.06484375 12.5960937,2.14375 12.5960937,2.14375 C12.5,2.04765625 12.4046875,2 12.2609375,2 C12.1171875,2 12.021875,2.04765625 11.9257812,2.14375 C11.9257812,2.14375 11.9257812,2.14375 11.9257812,2.14375 C11.9257812,2.14375 8.95625,5.06484375 8.95625,5.06484375 C8.7171875,5.30390625 8.7171875,5.54375 8.95625,5.78359375 C9.1953125,6.0234375 9.43515625,6.02265625 9.675,5.78359375 C9.675,5.78359375 9.675,5.78359375 9.675,5.78359375 C9.675,5.78359375 11.7820312,3.6765625 11.7820312,3.6765625 C11.7820312,3.6765625 11.7820312,11.2914063 11.7820312,11.2914063 C11.7820312,11.6265625 11.9257812,11.8179688 12.2609375,11.8179688 C12.5960937,11.8179688 12.7398437,11.6265625 12.7398437,11.2914063 C12.7398437,11.2914063 12.7398437,11.2914063 12.7398437,11.2914063 C12.7398437,11.2914063 12.7398437,3.6765625 12.7398437,3.6765625 C12.7398437,3.6765625 14.846875,5.78359375 14.846875,5.78359375 C15.0859375,6.02265625 15.3257812,6.02265625 15.565625,5.78359375 C15.8054688,5.54453125 15.8046875,5.3046875 15.565625,5.06484375 C15.565625,5.06484375 15.565625,5.06484375 15.565625,5.06484375 Z' }, void 0));
  const viewBox$g = '0 0 25 25';

  var chainUp = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$g,
    Component: Component$g,
    viewBox: viewBox$g
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$f = 'user-check';
  const Component$f = () => (jsxRuntime.jsx("path", { d: 'M4.928125,6.88515625 C4.928125,6.88515625 4.928125,6.88515625 4.928125,6.88515625 C4.928125,7.98671875 5.3109375,8.896875 6.07734375,9.66328125 C6.07734375,9.66328125 6.07734375,9.66328125 6.07734375,9.66328125 C6.89140625,10.4296875 7.8015625,10.8125 8.85546875,10.8125 C8.85546875,10.8125 8.85546875,10.8125 8.85546875,10.8125 C9.95703125,10.8125 10.8671875,10.4296875 11.6335937,9.66328125 C12.4,8.896875 12.7828125,7.98671875 12.7828125,6.88515625 C12.7828125,6.88515625 12.7828125,6.88515625 12.7828125,6.88515625 C12.7828125,5.83125 12.4,4.921875 11.6335937,4.10703125 C11.6335937,4.10703125 11.6335937,4.10703125 11.6335937,4.10703125 C10.8671875,3.340625 9.95703125,2.9578125 8.85546875,2.9578125 C8.85546875,2.9578125 8.85546875,2.9578125 8.85546875,2.9578125 C7.8015625,2.9578125 6.8921875,3.340625 6.07734375,4.10703125 C6.07734375,4.10703125 6.07734375,4.10703125 6.07734375,4.10703125 C5.3109375,4.92109375 4.928125,5.83125 4.928125,6.88515625 Z M3.9703125,6.88515625 C3.9703125,6.88515625 3.9703125,6.88515625 3.9703125,6.88515625 C3.9703125,5.54453125 4.44921875,4.39453125 5.40703125,3.43671875 C6.36484375,2.47890625 7.5140625,2 8.85546875,2 C8.85546875,2 8.85546875,2 8.85546875,2 C10.2445312,2 11.39375,2.47890625 12.3515625,3.43671875 C13.309375,4.39453125 13.7882812,5.54375 13.7882812,6.88515625 C13.7882812,6.88515625 13.7882812,6.88515625 13.7882812,6.88515625 C13.7882812,8.27421875 13.309375,9.4234375 12.3515625,10.38125 C11.39375,11.3390625 10.2445312,11.8179688 8.85546875,11.8179688 C8.85546875,11.8179688 8.85546875,11.8179688 8.85546875,11.8179688 C7.51484375,11.8179688 6.36484375,11.3390625 5.40703125,10.38125 C4.44921875,9.4234375 3.9703125,8.27421875 3.9703125,6.88515625 Z M16.709375,21.6359375 C16.709375,21.6359375 15.7515625,21.6359375 15.7515625,21.6359375 C15.7515625,21.6359375 15.7515625,20.6304688 15.7515625,20.6304688 C15.7515625,18.7625 15.08125,17.134375 13.7398437,15.7453125 C13.7398437,15.7453125 13.7398437,15.7453125 13.7398437,15.7453125 C12.446875,14.4523438 10.81875,13.7820313 8.8546875,13.7820313 C8.8546875,13.7820313 8.8546875,13.7820313 8.8546875,13.7820313 C6.98671875,13.7820313 5.35859375,14.4523438 4.0171875,15.79375 C2.67578125,17.1351563 2.00546875,18.7632812 2.00546875,20.63125 C2.00546875,20.63125 2.00546875,20.63125 2.00546875,20.63125 C2.00546875,20.63125 2.00546875,21.6367188 2.00546875,21.6367188 C2.00546875,21.6367188 1,21.6367188 1,21.6367188 C1,21.6367188 1,20.63125 1,20.63125 C1,18.4757813 1.76640625,16.65625 3.29921875,15.1234375 C3.29921875,15.1234375 3.29921875,15.1234375 3.29921875,15.1234375 C4.83203125,13.5429688 6.7,12.7765625 8.8546875,12.7765625 C11.009375,12.7765625 12.8773437,13.5429688 14.4101562,15.0757813 C15.9429687,16.6085938 16.709375,18.4757813 16.709375,20.63125 C16.709375,20.63125 16.709375,20.63125 16.709375,20.63125 C16.709375,20.63125 16.709375,21.1101563 16.709375,21.1101563 C16.709375,21.1101563 16.709375,21.6367188 16.709375,21.6367188 L16.709375,21.6359375 Z M23.4625,4.10703125 C23.5585938,4.203125 23.60625,4.2984375 23.60625,4.4421875 C23.60625,4.5859375 23.5585938,4.68125 23.4625,4.77734375 C23.4625,4.77734375 23.4625,4.77734375 23.4625,4.77734375 C23.4625,4.77734375 18.5296875,9.71015625 18.5296875,9.71015625 C18.4335938,9.80625 18.290625,9.85390625 18.146875,9.85390625 C18.146875,9.85390625 18.146875,9.85390625 18.146875,9.85390625 C18.0507812,9.85390625 17.9554687,9.80625 17.859375,9.71015625 C17.859375,9.71015625 17.859375,9.71015625 17.859375,9.71015625 C17.859375,9.71015625 14.8898438,7.26796875 14.8898438,7.26796875 C14.79375,7.171875 14.7460938,7.02890625 14.7460938,6.88515625 C14.7460938,6.88515625 14.7460938,6.88515625 14.7460938,6.88515625 C14.7460938,6.55 14.8898438,6.40625 15.225,6.40625 C15.225,6.40625 15.225,6.40625 15.225,6.40625 C15.36875,6.40625 15.4640625,6.45390625 15.5125,6.50234375 C15.5125,6.50234375 15.5125,6.50234375 15.5125,6.50234375 C15.5125,6.50234375 18.146875,8.70546875 18.146875,8.70546875 C18.146875,8.70546875 22.7445313,4.1078125 22.7445313,4.1078125 C22.7921875,4.01171875 22.9359375,3.9640625 23.1273437,3.9640625 C23.1273437,3.9640625 23.1273437,3.9640625 23.1273437,3.9640625 C23.2710937,3.9640625 23.3664062,4.01171875 23.4625,4.1078125 L23.4625,4.10703125 Z' }, void 0));
  const viewBox$f = '0 0 25 25';

  var userCheck = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$f,
    Component: Component$f,
    viewBox: viewBox$f
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$e = 'face-happy';
  const Component$e = () => (jsxRuntime.jsx("path", { d: 'M20.9296875,3.5921875 C23.3242188,5.98671875 24.521875,8.86015625 24.521875,12.2609375 C24.521875,15.6617188 23.3242188,18.5351563 20.9296875,20.9296875 C18.5351562,23.3242188 15.6617188,24.521875 12.2609375,24.521875 C8.86015625,24.521875 5.98671875,23.3242188 3.5921875,20.9296875 C1.19765625,18.5351562 0,15.6617188 0,12.2609375 C0,8.86015625 1.19765625,5.98671875 3.5921875,3.5921875 C5.98671875,1.19765625 8.86015625,0 12.2609375,0 C15.6617188,0 18.5351563,1.19765625 20.9296875,3.5921875 Z M23.5640625,12.2609375 C23.5640625,12.2609375 23.5640625,12.2609375 23.5640625,12.2609375 C23.5640625,9.96171875 22.9414062,7.8546875 21.6960938,5.9390625 C20.403125,4.07109375 18.7265625,2.68203125 16.6195313,1.77265625 C14.5125,0.86328125 12.3570313,0.67109375 10.10625,1.10234375 C7.85546875,1.53359375 5.89140625,2.58671875 4.26328125,4.215625 C4.26328125,4.215625 4.26328125,4.215625 4.26328125,4.215625 C2.6828125,5.79609375 1.62890625,7.71171875 1.1984375,9.9625 C0.71953125,12.2132812 0.9109375,14.4164062 1.82109375,16.5234375 C1.82109375,16.5234375 1.82109375,16.5234375 1.82109375,16.5234375 C2.6828125,18.6304687 4.071875,20.3070312 5.9875,21.6 C7.85546875,22.8929687 9.9625,23.515625 12.2617188,23.515625 C12.2617188,23.515625 12.2617188,23.515625 12.2617188,23.515625 C15.375,23.515625 18.0085938,22.4140625 20.2117188,20.2109375 C22.4148438,18.0554687 23.5164063,15.3734375 23.5640625,12.2609375 Z M8.81328125,11.7820313 C8.81328125,11.7820313 8.81328125,7.8546875 8.81328125,7.8546875 C8.81328125,7.8546875 9.81875,7.8546875 9.81875,7.8546875 C9.81875,7.8546875 9.81875,11.7820313 9.81875,11.7820313 C9.81875,11.7820313 8.81328125,11.7820313 8.81328125,11.7820313 Z M14.7039062,11.7820313 C14.7039062,11.7820313 14.7039062,7.8546875 14.7039062,7.8546875 C14.7039062,7.8546875 15.709375,7.8546875 15.709375,7.8546875 C15.709375,7.8546875 15.709375,11.7820313 15.709375,11.7820313 C15.709375,11.7820313 14.7039062,11.7820313 14.7039062,11.7820313 Z M5.0296875,15.3734375 C5.0296875,15.3734375 5.0296875,15.3734375 5.0296875,15.3734375 C9.8671875,15.8046875 14.65625,15.8046875 19.4929688,15.3734375 C19.4929688,15.3734375 19.4929688,15.3734375 19.4929688,15.3734375 C18.63125,17.3367187 17.19375,18.7257812 15.2304688,19.4921875 C13.2671875,20.2585938 11.2554688,20.2585938 9.29140625,19.4921875 C7.328125,18.7734375 5.89140625,17.3851563 5.02890625,15.3734375 L5.0296875,15.3734375 Z M20.8820313,14.2242188 C20.8820313,14.2242188 20.8820313,14.2242188 20.8820313,14.2242188 C15.1351562,14.8945312 9.3875,14.8945312 3.640625,14.2242188 C3.640625,14.2242188 3.640625,14.2242188 3.640625,14.2242188 C4.11953125,16.2359375 5.1734375,17.8640625 6.8015625,19.1570312 C8.38203125,20.45 10.2015625,21.0726562 12.2609375,21.0726562 C14.3203125,21.0726562 16.140625,20.45 17.76875,19.1570312 C19.3492188,17.8640625 20.403125,16.2359375 20.8820313,14.2242188 Z' }, void 0));
  const viewBox$e = '0 0 25 25';

  var faceHappy = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$e,
    Component: Component$e,
    viewBox: viewBox$e
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$d = 'face-blank';
  const Component$d = () => (jsxRuntime.jsx("path", { d: 'M20.9296875,3.5921875 C23.3242188,5.98671875 24.521875,8.86015625 24.521875,12.2609375 C24.521875,15.6617188 23.3242188,18.5351563 20.9296875,20.9296875 C18.5351562,23.3242188 15.6617188,24.521875 12.2609375,24.521875 C8.86015625,24.521875 5.98671875,23.3242188 3.5921875,20.9296875 C1.19765625,18.5351562 0,15.6617188 0,12.2609375 C0,8.86015625 1.19765625,5.98671875 3.5921875,3.5921875 C5.98671875,1.19765625 8.86015625,0 12.2609375,0 C15.6617188,0 18.5351563,1.19765625 20.9296875,3.5921875 Z M23.5640625,12.2609375 C23.5640625,12.2609375 23.5640625,12.2609375 23.5640625,12.2609375 C23.5640625,9.96171875 22.9414062,7.8546875 21.6960938,5.9390625 C20.403125,4.07109375 18.7265625,2.68203125 16.6195313,1.77265625 C14.5125,0.86328125 12.3570313,0.67109375 10.10625,1.10234375 C7.85546875,1.53359375 5.89140625,2.58671875 4.26328125,4.215625 C4.26328125,4.215625 4.26328125,4.215625 4.26328125,4.215625 C2.6828125,5.79609375 1.62890625,7.71171875 1.1984375,9.9625 C0.71953125,12.2132812 0.9109375,14.4164062 1.82109375,16.5234375 C1.82109375,16.5234375 1.82109375,16.5234375 1.82109375,16.5234375 C2.6828125,18.6304687 4.071875,20.3070312 5.9875,21.6 C7.85546875,22.8929687 9.9625,23.515625 12.2617188,23.515625 C12.2617188,23.515625 12.2617188,23.515625 12.2617188,23.515625 C15.375,23.515625 18.0085938,22.4140625 20.2117188,20.2109375 C22.4148438,18.0554687 23.5164063,15.3734375 23.5640625,12.2609375 Z M8.81328125,11.7820312 C8.81328125,11.7820312 8.81328125,8.8125 8.81328125,8.8125 C8.81328125,8.8125 9.81875,8.8125 9.81875,8.8125 C9.81875,8.8125 9.81875,11.7820312 9.81875,11.7820312 C9.81875,11.7820312 8.81328125,11.7820312 8.81328125,11.7820312 Z M14.7039062,11.7820312 C14.7039062,11.7820312 14.7039062,8.8125 14.7039062,8.8125 C14.7039062,8.8125 15.709375,8.8125 15.709375,8.8125 C15.709375,8.8125 15.709375,11.7820312 15.709375,11.7820312 C15.709375,11.7820312 14.7039062,11.7820312 14.7039062,11.7820312 Z M6.9453125,17.6726562 C6.9453125,17.6726562 6.8015625,16.6671875 6.8015625,16.6671875 C6.8015625,16.6671875 18.5351562,14.7039062 18.5351562,14.7039062 C18.5351562,14.7039062 18.7265625,15.709375 18.7265625,15.709375 C18.7265625,15.709375 6.9453125,17.6726562 6.9453125,17.6726562 L6.9453125,17.6726562 Z' }, void 0));
  const viewBox$d = '0 0 25 25';

  var faceBlank = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$d,
    Component: Component$d,
    viewBox: viewBox$d
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$c = 'face-sad';
  const Component$c = () => (jsxRuntime.jsx("path", { d: 'M20.9296875,3.5921875 C23.3242188,5.98671875 24.521875,8.86015625 24.521875,12.2609375 C24.521875,15.6617188 23.3242188,18.5351563 20.9296875,20.9296875 C18.5351562,23.3242188 15.6617188,24.521875 12.2609375,24.521875 C8.86015625,24.521875 5.98671875,23.3242188 3.5921875,20.9296875 C1.19765625,18.5351562 0,15.6617188 0,12.2609375 C0,8.86015625 1.19765625,5.98671875 3.5921875,3.5921875 C5.98671875,1.19765625 8.86015625,0 12.2609375,0 C15.6617188,0 18.5351563,1.19765625 20.9296875,3.5921875 Z M23.5640625,12.2609375 C23.5640625,12.2609375 23.5640625,12.2609375 23.5640625,12.2609375 C23.5640625,9.96171875 22.9414062,7.8546875 21.6960938,5.9390625 C20.403125,4.07109375 18.7265625,2.68203125 16.6195313,1.77265625 C14.5125,0.86328125 12.3570313,0.67109375 10.10625,1.10234375 C7.85546875,1.53359375 5.89140625,2.58671875 4.26328125,4.215625 C4.26328125,4.215625 4.26328125,4.215625 4.26328125,4.215625 C2.6828125,5.79609375 1.62890625,7.71171875 1.1984375,9.9625 C0.71953125,12.2132812 0.9109375,14.4164062 1.82109375,16.5234375 C1.82109375,16.5234375 1.82109375,16.5234375 1.82109375,16.5234375 C2.6828125,18.6304687 4.071875,20.3070312 5.9875,21.6 C7.85546875,22.8929687 9.9625,23.515625 12.2617188,23.515625 C12.2617188,23.515625 12.2617188,23.515625 12.2617188,23.515625 C15.375,23.515625 18.0085938,22.4140625 20.2117188,20.2109375 C22.4148438,18.0554687 23.5164063,15.3734375 23.5640625,12.2609375 Z M8.81328125,12.7398437 C8.81328125,12.7398437 8.81328125,10.7765625 8.81328125,10.7765625 C8.81328125,10.7765625 9.81875,10.7765625 9.81875,10.7765625 C9.81875,10.7765625 9.81875,12.7398437 9.81875,12.7398437 C9.81875,12.7398437 8.81328125,12.7398437 8.81328125,12.7398437 Z M14.7039062,12.7398437 C14.7039062,12.7398437 14.7039062,10.7765625 14.7039062,10.7765625 C14.7039062,10.7765625 15.709375,10.7765625 15.709375,10.7765625 C15.709375,10.7765625 15.709375,12.7398437 15.709375,12.7398437 C15.709375,12.7398437 14.7039062,12.7398437 14.7039062,12.7398437 Z M17.8171875,17.6726562 C17.8171875,17.6726562 17.4820312,18.6304687 17.4820312,18.6304687 C15.4226562,17.9601562 13.6984375,17.625 12.309375,17.625 C10.8726563,17.625 9.10078125,17.9601562 7.04140625,18.6304687 C7.04140625,18.6304687 7.04140625,18.6304687 7.04140625,18.6304687 C7.04140625,18.6304687 6.70625,17.6726562 6.70625,17.6726562 C8.86171875,16.9539062 10.7289062,16.61875 12.2617188,16.61875 C13.7945313,16.61875 15.6617187,16.9539062 17.8171875,17.6726562 C17.8171875,17.6726562 17.8171875,17.6726562 17.8171875,17.6726562 L17.8171875,17.6726562 Z' }, void 0));
  const viewBox$c = '0 0 25 25';

  var faceSad = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$c,
    Component: Component$c,
    viewBox: viewBox$c
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$b = 'document';
  const Component$b = () => (jsxRuntime.jsx("path", { d: 'M22.1632813,6.753125 C22.1632813,6.753125 22.1632813,6.753125 22.1632813,6.753125 C22.1632813,6.753125 15.8414062,0.43125 15.8414062,0.43125 C15.6023437,0.14375 15.21875,0 14.7875,0 C14.7875,0 14.7875,0 14.7875,0 C14.7875,0 3.48515625,0 3.48515625,0 C3.05390625,0 2.71875,0.14375 2.43125,0.43125 C2.14375,0.71875 2,1.05390625 2,1.48515625 C2,1.48515625 2,1.48515625 2,1.48515625 C2,1.48515625 2,23.0367188 2,23.0367188 C2,23.4679688 2.14375,23.803125 2.43125,24.090625 C2.71875,24.378125 3.05390625,24.521875 3.48515625,24.521875 C3.48515625,24.521875 3.48515625,24.521875 3.48515625,24.521875 C3.48515625,24.521875 21.109375,24.521875 21.109375,24.521875 C21.540625,24.521875 21.8757812,24.378125 22.1632813,24.090625 C22.4507812,23.803125 22.5945312,23.4679688 22.5945312,23.0367188 C22.5945312,23.0367188 22.5945312,23.0367188 22.5945312,23.0367188 C22.5945312,23.0367188 22.5945312,7.80703125 22.5945312,7.80703125 C22.5945312,7.37578125 22.4507812,7.040625 22.1632813,6.753125 Z M15.6976563,1.6765625 C15.6976563,1.6765625 20.8703125,6.84921875 20.8703125,6.84921875 C20.8703125,6.84921875 16.225,6.84921875 16.225,6.84921875 C15.8898438,6.84921875 15.7460938,6.70546875 15.7460938,6.3703125 C15.7460938,6.3703125 15.7460938,6.3703125 15.7460938,6.3703125 C15.7460938,6.3703125 15.6984375,1.6765625 15.6984375,1.6765625 L15.6976563,1.6765625 Z M21.6367188,7.8546875 C21.6367188,7.8546875 21.6367188,23.0367188 21.6367188,23.0367188 C21.6367188,23.371875 21.4453125,23.515625 21.1101563,23.515625 C21.1101563,23.515625 21.1101563,23.515625 21.1101563,23.515625 C21.1101563,23.515625 3.4859375,23.515625 3.4859375,23.515625 C3.15078125,23.515625 2.959375,23.371875 2.959375,23.0367188 C2.959375,23.0367188 2.959375,23.0367188 2.959375,23.0367188 C2.959375,23.0367188 2.959375,1.48515625 2.959375,1.48515625 C2.959375,1.15 3.15078125,0.95859375 3.4859375,0.95859375 C3.4859375,0.95859375 3.4859375,0.95859375 3.4859375,0.95859375 C3.4859375,0.95859375 14.740625,0.95859375 14.740625,0.95859375 C14.740625,0.95859375 14.740625,6.3703125 14.740625,6.3703125 C14.740625,6.8015625 14.884375,7.13671875 15.171875,7.42421875 C15.459375,7.71171875 15.7945313,7.85546875 16.2257813,7.85546875 C16.2257813,7.85546875 16.2257813,7.85546875 16.2257813,7.85546875 C16.2257813,7.85546875 21.6375,7.85546875 21.6375,7.85546875 L21.6367188,7.8546875 Z' }, void 0));
  const viewBox$b = '0 0 25 25';

  var document$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$b,
    Component: Component$b,
    viewBox: viewBox$b
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$a = 'document-xls';
  const Component$a = () => (jsxRuntime.jsx("path", { d: 'M22.1632813,6.753125 C22.1632813,6.753125 22.5945312,7.39140625 22.5945312,7.80703125 C22.5945312,7.80703125 22.5945312,23.0367188 22.5945312,23.0367188 C22.5945312,23.4515625 22.4507812,23.803125 22.1632813,24.090625 C21.8757812,24.378125 21.525,24.521875 21.109375,24.521875 C21.109375,24.521875 3.48515625,24.521875 3.48515625,24.521875 C3.0703125,24.521875 2.71875,24.378125 2.43125,24.090625 C2.14375,23.803125 2,23.4523438 2,23.0367188 C2,23.0367188 2,1.48515625 2,1.48515625 C2,1.0703125 2.14375,0.71875 2.43125,0.43125 C2.71875,0.14375 3.06953125,0 3.48515625,0 C3.48515625,0 14.7875,0 14.7875,0 C15.234375,0 15.5859375,0.14375 15.8414063,0.43125 C15.8414063,0.43125 22.1632813,6.753125 22.1632813,6.753125 Z M20.8703125,6.84921875 C20.8703125,6.84921875 15.6976562,1.6765625 15.6976562,1.6765625 C15.6976562,1.6765625 15.7453125,6.3703125 15.7453125,6.3703125 C15.7453125,6.68984375 15.9046875,6.84921875 16.2242187,6.84921875 C16.2242187,6.84921875 20.8695312,6.84921875 20.8695312,6.84921875 L20.8703125,6.84921875 Z M21.6367188,23.0367187 C21.6367188,23.0367187 21.6367188,7.8546875 21.6367188,7.8546875 C21.6367188,7.8546875 16.225,7.8546875 16.225,7.8546875 C15.8101563,7.8546875 15.4585938,7.7109375 15.1710938,7.4234375 C14.8835938,7.1359375 14.7398438,6.78515625 14.7398438,6.36953125 C14.7398438,6.36953125 14.7398438,0.9578125 14.7398438,0.9578125 C14.7398438,0.9578125 3.48515625,0.9578125 3.48515625,0.9578125 C3.13359375,0.9578125 2.95859375,1.13359375 2.95859375,1.484375 C2.95859375,1.484375 2.95859375,23.0359375 2.95859375,23.0359375 C2.95859375,23.3554688 3.134375,23.5148437 3.48515625,23.5148437 C3.48515625,23.5148437 21.109375,23.5148437 21.109375,23.5148437 C21.4609375,23.5148437 21.6359375,23.3554688 21.6359375,23.0359375 L21.6367188,23.0367187 Z M6.9046875,13.7320312 C6.9046875,13.7320312 9.846875,13.7320312 9.846875,13.7320312 C9.846875,13.7320312 9.846875,11.7703125 9.846875,11.7703125 C9.846875,11.7703125 6.9046875,11.7703125 6.9046875,11.7703125 C6.9046875,11.7703125 6.9046875,13.7320312 6.9046875,13.7320312 Z M6.9046875,17.6554688 C6.9046875,17.6554688 6.9046875,19.6171875 6.9046875,19.6171875 C6.9046875,19.6171875 9.846875,19.6171875 9.846875,19.6171875 C9.846875,19.6171875 9.846875,17.6554688 9.846875,17.6554688 C9.846875,17.6554688 6.9046875,17.6554688 6.9046875,17.6554688 Z M9.846875,16.6742188 C9.846875,16.6742188 9.846875,14.7125 9.846875,14.7125 C9.846875,14.7125 6.9046875,14.7125 6.9046875,14.7125 C6.9046875,14.7125 6.9046875,16.6742188 6.9046875,16.6742188 C6.9046875,16.6742188 9.846875,16.6742188 9.846875,16.6742188 Z M17.69375,13.7320312 C17.69375,13.7320312 17.69375,11.7703125 17.69375,11.7703125 C17.69375,11.7703125 14.7515625,11.7703125 14.7515625,11.7703125 C14.7515625,11.7703125 14.7515625,13.7320312 14.7515625,13.7320312 C14.7515625,13.7320312 17.69375,13.7320312 17.69375,13.7320312 L17.69375,13.7320312 Z M17.69375,17.6554688 C17.69375,17.6554688 14.7515625,17.6554688 14.7515625,17.6554688 C14.7515625,17.6554688 14.7515625,19.6171875 14.7515625,19.6171875 C14.7515625,19.6171875 17.69375,19.6171875 17.69375,19.6171875 C17.69375,19.6171875 17.69375,17.6554688 17.69375,17.6554688 L17.69375,17.6554688 Z M14.7515625,16.6742188 C14.7515625,16.6742188 17.69375,16.6742188 17.69375,16.6742188 C17.69375,16.6742188 17.69375,14.7125 17.69375,14.7125 C17.69375,14.7125 14.7515625,14.7125 14.7515625,14.7125 C14.7515625,14.7125 14.7515625,16.6742188 14.7515625,16.6742188 Z M13.7703125,13.7320312 C13.7703125,13.7320312 13.7703125,11.7703125 13.7703125,11.7703125 C13.7703125,11.7703125 10.828125,11.7703125 10.828125,11.7703125 C10.828125,11.7703125 10.828125,13.7320312 10.828125,13.7320312 C10.828125,13.7320312 13.7703125,13.7320312 13.7703125,13.7320312 Z M13.7703125,14.7125 C13.7703125,14.7125 10.828125,14.7125 10.828125,14.7125 C10.828125,14.7125 10.828125,16.6742188 10.828125,16.6742188 C10.828125,16.6742188 13.7703125,16.6742188 13.7703125,16.6742188 C13.7703125,16.6742188 13.7703125,14.7125 13.7703125,14.7125 Z M13.7703125,17.6554688 C13.7703125,17.6554688 10.828125,17.6554688 10.828125,17.6554688 C10.828125,17.6554688 10.828125,19.6171875 10.828125,19.6171875 C10.828125,19.6171875 13.7703125,19.6171875 13.7703125,19.6171875 C13.7703125,19.6171875 13.7703125,17.6554688 13.7703125,17.6554688 Z M5.9234375,10.7898437 C5.9234375,10.7898437 18.6742188,10.7898437 18.6742188,10.7898437 C18.6742188,10.7898437 18.6742188,20.5984375 18.6742188,20.5984375 C18.6742188,20.5984375 5.9234375,20.5984375 5.9234375,20.5984375 C5.9234375,20.5984375 5.9234375,10.7898437 5.9234375,10.7898437 Z' }, void 0));
  const viewBox$a = '0 0 25 25';

  var documentXls = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$a,
    Component: Component$a,
    viewBox: viewBox$a
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$9 = 'document-pdf';
  const Component$9 = () => (jsxRuntime.jsx("path", { d: 'M22.59375,24.5210937 C22.59375,24.5210937 22.59375,6.8484375 22.59375,6.8484375 C22.59375,6.8484375 15.7453125,0 15.7453125,0 C15.7453125,0 2,0 2,0 C2,0 2,24.5210937 2,24.5210937 C2,24.5210937 22.59375,24.5210937 22.59375,24.5210937 Z M15.7445312,1.48515625 C15.7445312,1.48515625 21.1085937,6.84921875 21.1085937,6.84921875 C21.1085937,6.84921875 15.7445312,6.84921875 15.7445312,6.84921875 C15.7445312,6.84921875 15.7445312,1.48515625 15.7445312,1.48515625 Z M21.6359375,7.8546875 C21.6359375,7.8546875 21.5882813,23.5632813 21.5882813,23.5632813 C21.5882813,23.5632813 2.9578125,23.5632813 2.9578125,23.5632813 C2.9578125,23.5632813 2.9578125,0.9578125 2.9578125,0.9578125 C2.9578125,0.9578125 14.7390625,0.9578125 14.7390625,0.9578125 C14.7390625,0.9578125 14.7390625,7.8546875 14.7390625,7.8546875 C14.7390625,7.8546875 21.6359375,7.8546875 21.6359375,7.8546875 Z M9.85390625,12.7398438 C9.85390625,12.7398438 9.85390625,12.7398438 9.85390625,12.7398438 C9.85390625,13.3625 9.6625,13.79375 9.27890625,14.1289062 C9.27890625,14.1289062 9.27890625,14.1289062 9.27890625,14.1289062 C8.89609375,14.5117188 8.4171875,14.7039063 7.88984375,14.7039063 C7.88984375,14.7039063 7.88984375,14.7039063 7.88984375,14.7039063 C7.88984375,14.7039063 6.884375,14.7039063 6.884375,14.7039063 C6.884375,14.7039063 6.884375,16.6671875 6.884375,16.6671875 C6.884375,16.6671875 5.9265625,16.6671875 5.9265625,16.6671875 C5.9265625,16.6671875 5.9265625,10.7765625 5.9265625,10.7765625 C5.9265625,10.7765625 7.88984375,10.7765625 7.88984375,10.7765625 C8.41640625,10.7765625 8.8953125,10.9679688 9.27890625,11.3515625 C9.6625,11.7351563 9.85390625,12.2132813 9.85390625,12.740625 L9.85390625,12.7398438 Z M6.884375,11.7820312 C6.884375,11.7820312 6.884375,13.7453125 6.884375,13.7453125 C6.884375,13.7453125 7.88984375,13.7453125 7.88984375,13.7453125 C8.12890625,13.7453125 8.36875,13.6492187 8.56015625,13.4578125 C8.7515625,13.2664063 8.84765625,13.0265625 8.84765625,12.7390625 C8.84765625,12.7390625 8.84765625,12.7390625 8.84765625,12.7390625 C8.84765625,12.5 8.7515625,12.2601563 8.56015625,12.06875 C8.36875,11.8773437 8.12890625,11.78125 7.88984375,11.78125 C7.88984375,11.78125 7.88984375,11.78125 7.88984375,11.78125 C7.88984375,11.78125 6.884375,11.78125 6.884375,11.78125 L6.884375,11.7820312 Z M16.7023437,13.7453125 C16.7023437,13.7453125 16.7023437,16.6664063 16.7023437,16.6664063 C16.7023437,16.6664063 15.7445312,16.6664063 15.7445312,16.6664063 C15.7445312,16.6664063 15.7445312,10.7757812 15.7445312,10.7757812 C15.7445312,10.7757812 19.1445312,10.7757812 19.1445312,10.7757812 C19.1445312,10.7757812 19.1445312,11.78125 19.1445312,11.78125 C19.1445312,11.78125 16.7023437,11.78125 16.7023437,11.78125 C16.7023437,11.78125 16.7023437,12.7390625 16.7023437,12.7390625 C16.7023437,12.7390625 18.665625,12.7390625 18.665625,12.7390625 C18.665625,12.7390625 18.665625,13.7445312 18.665625,13.7445312 C18.665625,13.7445312 16.7023438,13.7445312 16.7023438,13.7445312 L16.7023437,13.7453125 Z M14.7390625,12.7398437 C14.7390625,12.7398437 14.7390625,14.703125 14.7390625,14.703125 C14.7390625,15.3257812 14.5476562,15.7570312 14.1640625,16.0921875 C14.1640625,16.0921875 14.1640625,16.0921875 14.1640625,16.0921875 C13.8289062,16.475 13.35,16.6671875 12.775,16.6671875 C12.775,16.6671875 12.775,16.6671875 12.775,16.6671875 C12.775,16.6671875 10.8117188,16.6671875 10.8117188,16.6671875 C10.8117188,16.6671875 10.8117188,10.7765625 10.8117188,10.7765625 C10.8117188,10.7765625 12.775,10.7765625 12.775,10.7765625 C13.35,10.7765625 13.8289062,10.9679688 14.1640625,11.3515625 C14.1640625,11.3515625 14.1640625,11.3515625 14.1640625,11.3515625 C14.546875,11.734375 14.7390625,12.2132812 14.7390625,12.740625 C14.7390625,12.740625 14.7390625,12.740625 14.7390625,12.740625 L14.7390625,12.7398437 Z M11.8171875,11.7820312 C11.8171875,11.7820312 11.8171875,15.709375 11.8171875,15.709375 C11.8648438,15.709375 11.9132813,15.709375 12.0085938,15.709375 C12.0085938,15.709375 12.0085938,15.709375 12.0085938,15.709375 C12.4398438,15.709375 12.7273438,15.709375 12.91875,15.6617187 C13.1101563,15.6617187 13.3015625,15.565625 13.49375,15.4226563 C13.6859375,15.2796875 13.78125,15.0398437 13.78125,14.7039062 C13.78125,14.7039062 13.78125,14.7039062 13.78125,14.7039062 C13.78125,14.7039062 13.78125,12.740625 13.78125,12.740625 C13.78125,12.309375 13.6851563,12.021875 13.4460938,11.9265625 C13.2070313,11.83125 12.6320313,11.7828125 11.8179688,11.7828125 C11.8179688,11.7828125 11.8179688,11.7828125 11.8179688,11.7828125 L11.8171875,11.7820312 Z' }, void 0));
  const viewBox$9 = '0 0 25 25';

  var documentPdf = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$9,
    Component: Component$9,
    viewBox: viewBox$9
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$8 = 'document-compress';
  const Component$8 = () => (jsxRuntime.jsx("path", { d: 'M22.2054688,6.753125 C22.2054688,6.753125 22.2054688,6.753125 22.2054688,6.753125 C22.2054688,6.753125 15.4523438,0 15.4523438,0 C15.4523438,0 4.48515625,0 4.48515625,0 C4.05390625,0 3.71875,0.14375 3.43125,0.43125 C3.14375,0.71875 3,1.05390625 3,1.48515625 C3,1.48515625 3,1.48515625 3,1.48515625 C3,1.48515625 3,23.0367188 3,23.0367188 C3,23.4679688 3.14375,23.803125 3.43125,24.090625 C3.71875,24.378125 4.05390625,24.521875 4.48515625,24.521875 C4.48515625,24.521875 4.48515625,24.521875 4.48515625,24.521875 C4.48515625,24.521875 21.1515625,24.521875 21.1515625,24.521875 C21.5828125,24.521875 21.9179688,24.378125 22.2054688,24.090625 C22.4929687,23.803125 22.6367188,23.4679688 22.6367188,23.0367188 C22.6367188,23.0367188 22.6367188,23.0367188 22.6367188,23.0367188 C22.6367188,23.0367188 22.6367188,7.80703125 22.6367188,7.80703125 C22.6367188,7.37578125 22.4929687,6.99296875 22.2054688,6.753125 Z M15.7398437,1.6765625 C15.7398437,1.6765625 20.9125,6.84921875 20.9125,6.84921875 C20.9125,6.84921875 16.2671875,6.84921875 16.2671875,6.84921875 C15.9320313,6.84921875 15.7882813,6.70546875 15.7882813,6.3703125 C15.7882813,6.3703125 15.7882813,6.3703125 15.7882813,6.3703125 C15.7882813,6.3703125 15.740625,1.6765625 15.740625,1.6765625 L15.7398437,1.6765625 Z M21.6789063,7.8546875 C21.6789063,7.8546875 21.6789063,23.0367188 21.6789063,23.0367188 C21.6789063,23.371875 21.4875,23.515625 21.1523438,23.515625 C21.1523438,23.515625 21.1523438,23.515625 21.1523438,23.515625 C21.1523438,23.515625 12.81875,23.515625 12.81875,23.515625 C12.81875,23.515625 12.81875,21.6 12.81875,21.6 C12.81875,21.6 10.8554688,21.6 10.8554688,21.6 C10.8554688,21.6 10.8554688,23.515625 10.8554688,23.515625 C10.8554688,23.515625 4.4859375,23.515625 4.4859375,23.515625 C4.15078125,23.515625 4.00703125,23.371875 4.00703125,23.0367188 C4.00703125,23.0367188 4.00703125,23.0367188 4.00703125,23.0367188 C4.00703125,23.0367188 4.00703125,1.48515625 4.00703125,1.48515625 C4.00703125,1.15 4.15078125,0.95859375 4.4859375,0.95859375 C4.4859375,0.95859375 4.4859375,0.95859375 4.4859375,0.95859375 C4.4859375,0.95859375 14.7828125,0.95859375 14.7828125,0.95859375 C14.7828125,0.95859375 14.7828125,6.3703125 14.7828125,6.3703125 C14.7828125,6.8015625 14.9265625,7.13671875 15.2140625,7.42421875 C15.5015625,7.71171875 15.8367188,7.85546875 16.2679688,7.85546875 C16.2679688,7.85546875 16.2679688,7.85546875 16.2679688,7.85546875 C16.2679688,7.85546875 21.6796875,7.85546875 21.6796875,7.85546875 L21.6789063,7.8546875 Z M10.8546875,17.6726562 C10.8546875,17.6726562 12.8179688,17.6726562 12.8179688,17.6726562 C12.8179688,17.6726562 12.8179688,19.6359375 12.8179688,19.6359375 C12.8179688,19.6359375 10.8546875,19.6359375 10.8546875,19.6359375 C10.8546875,19.6359375 10.8546875,17.6726562 10.8546875,17.6726562 Z M14.7820312,19.6359375 C14.7820312,19.6359375 14.7820312,21.5992187 14.7820312,21.5992187 C14.7820312,21.5992187 12.81875,21.5992187 12.81875,21.5992187 C12.81875,21.5992187 12.81875,19.6359375 12.81875,19.6359375 C12.81875,19.6359375 14.7820312,19.6359375 14.7820312,19.6359375 Z M10.8546875,13.7453125 C10.8546875,13.7453125 12.8179688,13.7453125 12.8179688,13.7453125 C12.8179688,13.7453125 12.8179688,15.7085937 12.8179688,15.7085937 C12.8179688,15.7085937 10.8546875,15.7085937 10.8546875,15.7085937 C10.8546875,15.7085937 10.8546875,13.7453125 10.8546875,13.7453125 Z M14.7820312,15.7085938 C14.7820312,15.7085938 14.7820312,17.671875 14.7820312,17.671875 C14.7820312,17.671875 12.81875,17.671875 12.81875,17.671875 C12.81875,17.671875 12.81875,15.7085938 12.81875,15.7085938 C12.81875,15.7085938 14.7820312,15.7085938 14.7820312,15.7085938 Z' }, void 0));
  const viewBox$8 = '0 0 25 25';

  var documentCompress = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$8,
    Component: Component$8,
    viewBox: viewBox$8
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$7 = 'hand-solid';
  const Component$7 = () => (jsxRuntime.jsx("path", { d: 'M15.2552017,13.2601563 C15.2552017,13.2601563 15.2552017,1.33515625 15.2552017,1.33515625 C14.8239517,1.09609375 14.3934829,1 13.9622329,1 C13.9622329,1 13.9622329,1 13.9622329,1 C13.5794204,1 13.1958267,1.09609375 12.8130142,1.33515625 C12.8130142,1.33515625 12.8130142,1.33515625 12.8130142,1.33515625 C12.8130142,1.33515625 12.8130142,13.2601563 12.8130142,13.2601563 C12.8130142,13.5953125 12.6692642,13.7867187 12.3341079,13.7867187 C12.3341079,13.7867187 12.3341079,13.7867187 12.3341079,13.7867187 C11.9989517,13.7867187 11.8075454,13.5953125 11.8075454,13.2601563 C11.8075454,13.2601563 11.8075454,13.2601563 11.8075454,13.2601563 C11.8075454,13.2601563 11.8075454,3.059375 11.8075454,3.059375 C11.8075454,3.059375 11.7598892,3.059375 11.7598892,3.059375 C11.2333267,3.01171875 10.8981704,2.96328125 10.6583267,2.96328125 C10.6583267,2.96328125 10.6583267,2.96328125 10.6583267,2.96328125 C10.0356704,2.96328125 9.5091079,3.25078125 9.0778579,3.77734375 C9.0778579,3.77734375 9.0778579,3.77734375 9.0778579,3.77734375 C8.6466079,4.30390625 8.45520165,5.02265625 8.45520165,5.884375 C8.45520165,5.884375 8.45520165,5.884375 8.45520165,5.884375 C8.45520165,5.884375 8.45520165,13.7867187 8.45520165,13.7867187 C8.45520165,13.7867187 5.7731704,12.3023438 5.7731704,12.3023438 C5.7731704,12.3023438 5.58176415,12.2546875 5.58176415,12.2546875 C5.58176415,12.2070313 5.5341079,12.2070313 5.3903579,12.2070313 C5.3903579,12.2070313 5.3903579,12.2070313 5.3903579,12.2070313 C4.9591079,12.1109375 4.62395165,12.1109375 4.38488915,12.2546875 C4.38488915,12.2546875 4.38488915,12.2546875 4.38488915,12.2546875 C3.28332665,12.5421875 2.85207665,13.4523438 3.04426415,14.9367188 C3.04426415,14.9367188 3.04426415,14.9367188 3.04426415,14.9367188 C3.04426415,14.9367188 3.18801415,15.1757813 3.18801415,15.1757813 C3.18801415,15.1757813 3.5231704,15.5585938 3.5231704,15.5585938 C3.5231704,15.5585938 3.9059829,15.9414062 3.9059829,15.9414062 C3.9059829,15.9414062 4.38488915,16.4203125 4.38488915,16.4203125 C4.62395165,16.659375 5.10363915,17.1867188 5.91770165,18.0007812 C5.91770165,18.0007812 5.91770165,18.0007812 5.91770165,18.0007812 C6.63645165,18.7195312 6.9716079,19.1023437 7.01926415,19.15 C7.01926415,19.15 7.01926415,19.15 7.01926415,19.15 C7.0669204,19.1976562 7.1153579,19.1976562 7.16301415,19.2460938 C7.2106704,19.2945313 7.2591079,19.3421875 7.30676415,19.3898438 C7.30676415,19.3898438 7.30676415,19.3898438 7.30676415,19.3898438 C9.79738915,21.784375 11.1864517,23.0296875 11.4255142,23.1734375 C11.4255142,23.1734375 11.4255142,23.1734375 11.4255142,23.1734375 C12.0005142,23.4125 12.7661392,23.5085938 13.7723892,23.55625 C13.7723892,23.55625 13.7723892,23.55625 13.7723892,23.55625 C13.9161392,23.55625 14.2512954,23.55625 14.7778579,23.55625 C15.3044204,23.6039063 15.7356704,23.6039063 16.1184829,23.6039063 C16.1184829,23.6039063 16.1184829,23.6039063 16.1184829,23.6039063 C16.1184829,23.6039063 16.3098892,23.6039063 16.3098892,23.6039063 C17.2200454,23.6039063 18.2731704,23.4125 19.3747329,23.0773438 C19.3747329,23.0773438 19.3747329,23.0773438 19.3747329,23.0773438 C21.5302017,22.3109375 22.6317642,20.921875 22.6317642,18.8625 C22.6317642,18.8625 22.6317642,18.8625 22.6317642,18.8625 C22.6317642,18.8625 22.6317642,6.98515625 22.6317642,6.98515625 C22.6317642,6.74609375 22.5356704,6.41015625 22.3442642,5.9796875 C22.3442642,5.9796875 22.3442642,5.9796875 22.3442642,5.9796875 C22.0091079,5.309375 21.3864517,4.97421875 20.5247329,4.97421875 C20.5247329,4.97421875 20.5247329,4.97421875 20.5247329,4.97421875 C20.1895767,4.97421875 19.9020767,4.97421875 19.6630142,5.021875 C19.6630142,5.021875 19.6630142,5.021875 19.6630142,5.021875 C19.6630142,5.021875 19.6630142,13.259375 19.6630142,13.259375 C19.6630142,13.5945313 19.5192642,13.7859375 19.1841079,13.7859375 C18.8489517,13.7859375 18.7052017,13.5945313 18.7052017,13.259375 C18.7052017,13.259375 18.7052017,13.259375 18.7052017,13.259375 C18.7052017,13.259375 18.7052017,3.10625 18.7052017,3.10625 C18.2739517,2.77109375 17.8434829,2.5796875 17.4122329,2.5796875 C17.4122329,2.5796875 17.4122329,2.5796875 17.4122329,2.5796875 C17.4122329,2.5796875 17.0770767,2.5796875 17.0770767,2.5796875 C16.8380142,2.62734375 16.5505142,2.7234375 16.2153579,2.77109375 C16.2153579,2.77109375 16.2153579,2.77109375 16.2153579,2.77109375 C16.2153579,2.77109375 16.2153579,13.259375 16.2153579,13.259375 C16.2153579,13.5945313 16.0716079,13.7859375 15.7364517,13.7859375 C15.4012954,13.7859375 15.2575454,13.5945313 15.2575454,13.259375 C15.2575454,13.259375 15.2575454,13.259375 15.2575454,13.259375 L15.2552017,13.2601563 Z' }, void 0));
  const viewBox$7 = '0 0 25 25';

  var handSolid = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$7,
    Component: Component$7,
    viewBox: viewBox$7
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$6 = 'user';
  const Component$6 = () => (jsxRuntime.jsx("path", { d: 'M8.928125,6.88515625 C8.928125,6.88515625 8.928125,6.88515625 8.928125,6.88515625 C8.928125,7.98671875 9.3109375,8.896875 10.0773437,9.66328125 C10.84375,10.4296875 11.7539062,10.8125 12.8554688,10.8125 C13.9570312,10.8125 14.8671875,10.4296875 15.6335937,9.66328125 C16.4,8.896875 16.7828125,7.98671875 16.7828125,6.88515625 C16.7828125,6.88515625 16.7828125,6.88515625 16.7828125,6.88515625 C16.7828125,5.83125 16.4,4.921875 15.6335937,4.10703125 C15.6335937,4.10703125 15.6335937,4.10703125 15.6335937,4.10703125 C14.8671875,3.340625 13.9570312,2.9578125 12.8554688,2.9578125 C11.7539062,2.9578125 10.84375,3.340625 10.0773437,4.10703125 C10.0773437,4.10703125 10.0773437,4.10703125 10.0773437,4.10703125 C9.3109375,4.92109375 8.928125,5.83125 8.928125,6.88515625 Z M7.9703125,6.88515625 C7.9703125,6.88515625 7.9703125,6.88515625 7.9703125,6.88515625 C7.9703125,5.54453125 8.44921875,4.39453125 9.40703125,3.43671875 C10.3648437,2.47890625 11.5140625,2 12.8554688,2 C14.1960937,2 15.3460937,2.47890625 16.3039062,3.43671875 C17.2617188,4.39453125 17.740625,5.54375 17.740625,6.88515625 C17.740625,6.88515625 17.740625,6.88515625 17.740625,6.88515625 C17.740625,8.27421875 17.2617188,9.4234375 16.3039062,10.38125 C15.3460938,11.3390625 14.196875,11.8179688 12.8554688,11.8179688 C11.5148438,11.8179688 10.3648437,11.3390625 9.40703125,10.38125 C8.44921875,9.4234375 7.9703125,8.27421875 7.9703125,6.88515625 Z M20.709375,21.6359375 C20.709375,21.6359375 19.7039062,21.6359375 19.7039062,21.6359375 C19.7039062,21.6359375 19.7039062,20.6304688 19.7039062,20.6304688 C19.7039062,18.7148438 19.0335937,17.0867188 17.6921875,15.7453125 C17.6921875,15.7453125 17.6921875,15.7453125 17.6921875,15.7453125 C16.3992187,14.4523438 14.7710937,13.7820313 12.8546875,13.7820313 C12.8546875,13.7820313 12.8546875,13.7820313 12.8546875,13.7820313 C10.9867187,13.7820313 9.35859375,14.4523438 8.0171875,15.79375 C8.0171875,15.79375 8.0171875,15.79375 8.0171875,15.79375 C6.6765625,17.0867188 6.00546875,18.7148438 6.00546875,20.63125 C6.00546875,20.63125 6.00546875,20.63125 6.00546875,20.63125 C6.00546875,20.63125 6.00546875,21.6367188 6.00546875,21.6367188 C6.00546875,21.6367188 5,21.6367188 5,21.6367188 C5,21.6367188 5,20.63125 5,20.63125 C5,18.4757813 5.76640625,16.65625 7.29921875,15.1234375 C7.29921875,15.1234375 7.29921875,15.1234375 7.29921875,15.1234375 C8.83203125,13.5429688 10.7,12.7765625 12.8546875,12.7765625 C15.009375,12.7765625 16.8773438,13.5429688 18.4101562,15.0757813 C19.9429687,16.6085938 20.709375,18.4757813 20.709375,20.63125 C20.709375,20.63125 20.709375,20.63125 20.709375,20.63125 C20.709375,20.63125 20.709375,21.1101563 20.709375,21.1101563 C20.709375,21.1101563 20.709375,21.6367188 20.709375,21.6367188 L20.709375,21.6359375 Z' }, void 0));
  const viewBox$6 = '0 0 25 25';

  var user = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$6,
    Component: Component$6,
    viewBox: viewBox$6
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$5 = 'whatsapp';
  const Component$5 = () => (jsxRuntime.jsx("path", { d: 'm12.5 24.0234375c15.1367187-.2441406 15.1367187-22.80273438 0-23.046875h-.4882812c-.2441407 0-.4394532 0-.6835938.04882812-.2441406 0-.4882812.04882813-.7324219.04882813-.1464843.04882813-.2929687.04882813-.4394531.09765625-.24414062.04882812-.43945312.09765625-.68359375.14648438-.1953125.04882812-.43945313.14648437-.63476563.1953125-.24414062.09765624-.43945312.1953125-.68359374.24414062-.19531251.09765625-.43945313.1953125-.63476563.34179688-1.90429687.92773437-3.46679687 2.39257812-4.58984375 4.15039062-2.29492187 3.46679688-2.78320312 8.1542969-.390625 12.0117188 0 0-1.5625 5.7617187-1.5625 5.7617187s.12671659-.0316791.34288018-.08572l.29994561-.0749864c.16905484-.0422638.36494378-.091236.57961658-.1449042l.6923198-.1730799c.56977741-.1424444 1.19799353-.2994984 1.78238061-.4455952l.48778433-.1219461c.94456035-.2361401 1.67444789-.4186119 1.67444789-.4186119.14648438.0488281.29296875.1464843.390625.1953124.14648438.0976563.29296875.1464844.43945312.1953126.07324219.0732421.1739502.1190185.28152466.1579284l.10910034.037384c.14648438.0488282.29296876.0976563.390625.1464844.1953125.0488282.34179688.1464844.53710938.1953125l.43945312.1464844c.1953125.0488281.43945313.0976563.63476568.1464844l.8789062.1464843c.2441406.0488282.4882812.0488282.7324219.0488282.2929687.0488281.5371093.0488281.8300781.0488281zm0-2.0019531c-1.9042969 0-3.75976562-.6347656-5.37109375-1.6113282-.53710937.0976563-2.734375.6835938-3.3203125.8300782.14648437-.6347656.73242187-2.734375.87890625-3.2714844-4.34570312-6.2011719.14648438-15.0390625 7.8125-14.99023438 12.5.24414063 12.5 18.79882818 0 19.04296878zm3.7109375-4.1992188c1.5136719-.0488281 2.2460937-2.0507812 2.2460937-2.0507812 0-.3417969-.0488281-.5859375-.1953124-.7324219-.0976563-.0976563-2.2949219-1.3183594-2.2949219-1.3671875-.633909-.2227248-.8650498.143674-1.0773126.565547l-.0955396.1917863c-.3659025.7250639-.8436637 1.3791113-3.3193353-.6596771-3.71093752-3.6621093.0976562-3.0273437-.5859375-4.5898437-.0976563-.14648438-1.5136719-2.1484375-1.61132815-2.24609375-.14648437-.04882813-.34179687-.09765625-.48828125-.14648437-3.56445312.78125-1.46484375 5.46875002.43945312 7.66601562 1.95312498 2.2460938 4.63867188 3.515625 6.98242188 3.3691406z' }, void 0));
  const viewBox$5 = '0 0 25 25';

  var whatsapp = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$5,
    Component: Component$5,
    viewBox: viewBox$5
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$4 = 'os-apple';
  const Component$4 = () => (jsxRuntime.jsx("path", { d: 'M22.0609375,17.61875 C22.0609375,17.61875 22.0609375,17.61875 22.0609375,17.61875 C21.6296875,18.8640625 21.103125,20.0132812 20.384375,21.0671875 C20.384375,21.0671875 20.384375,21.0671875 20.384375,21.0671875 C19.1867188,22.8390625 17.9898437,23.7492188 16.840625,23.7492188 C16.840625,23.7492188 16.840625,23.7492188 16.840625,23.7492188 C16.409375,23.7492188 15.7390625,23.6054688 14.925,23.2703125 C14.925,23.2703125 14.925,23.2703125 14.925,23.2703125 C14.1585938,22.9828125 13.4882813,22.8390625 12.865625,22.8390625 C12.2429688,22.8390625 11.6203125,22.9828125 10.95,23.3179688 C10.95,23.3179688 10.95,23.3179688 10.95,23.3179688 C10.1835938,23.6054688 9.5609375,23.7492188 9.13046875,23.7492188 C9.13046875,23.7492188 9.13046875,23.7492188 9.13046875,23.7492188 C7.69375,23.7492188 6.3046875,22.5515625 5.01171875,20.2054688 C5.01171875,20.2054688 5.01171875,20.2054688 5.01171875,20.2054688 C3.67109375,17.8585937 3,15.6078125 3,13.3570312 C3,13.3570312 3,13.3570312 3,13.3570312 C3,11.2976562 3.5265625,9.62109375 4.5328125,8.2328125 C4.5328125,8.2328125 4.5328125,8.2328125 4.5328125,8.2328125 C5.53828125,6.93984375 6.83203125,6.26953125 8.4125,6.26953125 C8.4125,6.26953125 8.4125,6.26953125 8.4125,6.26953125 C9.03515625,6.26953125 9.84921875,6.41328125 10.8546875,6.65234375 C10.8546875,6.65234375 10.8546875,6.65234375 10.8546875,6.65234375 C11.8125,6.93984375 12.4351563,7.08359375 12.7226562,7.08359375 C12.7226562,7.08359375 12.7226562,7.08359375 12.7226562,7.08359375 C13.1539062,7.08359375 13.8242188,6.93984375 14.6859375,6.6046875 C14.6859375,6.6046875 14.6859375,6.6046875 14.6859375,6.6046875 C15.7398437,6.26953125 16.5539062,6.12578125 17.0804688,6.12578125 C17.0804688,6.12578125 17.0804688,6.12578125 17.0804688,6.12578125 C18.134375,6.12578125 19.0921875,6.41328125 19.9539063,7.0359375 C19.9539063,7.0359375 19.9539063,7.0359375 19.9539063,7.0359375 C20.4804688,7.41875 20.959375,7.89765625 21.390625,8.425 C21.390625,8.425 21.390625,8.425 21.390625,8.425 C20.7203125,8.9515625 20.1929688,9.47890625 19.8578125,10.0054687 C19.8578125,10.0054687 19.8578125,10.0054687 19.8578125,10.0054687 C19.2351562,10.8195312 18.9476563,11.7773438 18.9476563,12.83125 C18.9476563,12.83125 18.9476563,12.83125 18.9476563,12.83125 C18.9476563,13.9328125 19.2828125,14.9867187 19.9054688,15.8960938 C19.9054688,15.8960938 19.9054688,15.8960938 19.9054688,15.8960938 C20.528125,16.80625 21.2460938,17.3804687 22.0609375,17.6203125 L22.0609375,17.61875 Z M16.8882812,1.43125 C16.8882812,1.43125 16.8882812,1.575 16.8882812,1.575 C16.8882812,2.19765625 16.7445312,2.8203125 16.5054687,3.44296875 C16.5054687,3.44296875 16.5054687,3.44296875 16.5054687,3.44296875 C16.1703125,4.16171875 15.7867187,4.78359375 15.2601562,5.3109375 C15.2601562,5.3109375 15.2601562,5.3109375 15.2601562,5.3109375 C14.8289062,5.7421875 14.3023438,6.07734375 13.7757813,6.31640625 C13.7757813,6.31640625 13.7757813,6.31640625 13.7757813,6.31640625 C13.3445313,6.46015625 12.865625,6.5078125 12.3390625,6.55546875 C12.3390625,6.55546875 12.3390625,6.55546875 12.3390625,6.55546875 C12.3867188,5.16640625 12.721875,4.0171875 13.3929688,3.01171875 C13.3929688,3.01171875 13.3929688,3.01171875 13.3929688,3.01171875 C14.0632813,2.05390625 15.2125,1.38359375 16.8414063,1 C16.8414063,1 16.8414063,1 16.8414063,1 C16.8414063,1 16.8414063,1.14375 16.8414063,1.14375 C16.8414063,1.14375 16.8890625,1.2875 16.8890625,1.2875 C16.8890625,1.2875 16.8890625,1.43125 16.8890625,1.43125 L16.8882812,1.43125 Z' }, void 0));
  const viewBox$4 = '0 0 25 25';

  var business = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$4,
    Component: Component$4,
    viewBox: viewBox$4
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$3 = 'chats-solid';
  const Component$3 = () => (jsxRuntime.jsx("path", { d: 'M6.36953125,17.6726563 C6.36953125,17.6726563 13.7453125,17.6726563 13.7453125,17.6726563 C13.7453125,17.6726563 17.6726562,20.59375 17.6726562,20.59375 C17.6726562,20.59375 10.440625,20.59375 10.440625,20.59375 C10.440625,20.59375 5.5078125,24.3296875 5.5078125,24.3296875 C5.26875,24.4734375 5.02890625,24.5210937 4.88515625,24.5210937 C4.88515625,24.5210937 4.88515625,24.5210937 4.88515625,24.5210937 C4.64609375,24.5210937 4.40625,24.425 4.21484375,24.2335938 C4.0234375,24.0421875 3.92734375,23.8023437 3.92734375,23.5148438 C3.92734375,23.5148438 3.92734375,23.5148438 3.92734375,23.5148438 C3.92734375,23.5148438 3.92734375,20.59375 3.92734375,20.59375 C3.92734375,20.59375 1.48515625,20.59375 1.48515625,20.59375 C1.05390625,20.59375 0.71875,20.45 0.43125,20.1625 C0.14375,19.875 0,19.5398437 0,19.1085937 C0,19.1085937 0,19.1085937 0,19.1085937 C0,19.1085937 0,5.4109375 0,5.4109375 C0,4.9796875 0.14375,4.64453125 0.43125,4.35703125 C0.71875,4.06953125 1.05390625,3.92578125 1.48515625,3.92578125 C1.48515625,3.92578125 1.48515625,3.92578125 1.48515625,3.92578125 C1.48515625,3.92578125 3.92734375,3.92578125 3.92734375,3.92578125 C3.92734375,3.92578125 3.92734375,15.1804687 3.92734375,15.1804687 C3.92734375,15.8992187 4.16640625,16.4734375 4.64609375,16.9523437 C5.12578125,17.43125 5.7,17.6710937 6.3703125,17.6710937 C6.3703125,17.6710937 6.3703125,17.6710937 6.3703125,17.6710937 L6.36953125,17.6726563 Z M23.0367187,0 C23.0367187,0 23.0367187,0 23.0367187,0 C23.0367187,0 6.3703125,0 6.3703125,0 C5.9390625,0 5.60390625,0.14375 5.31640625,0.43125 C5.02890625,0.71875 4.88515625,1.05390625 4.88515625,1.48515625 C4.88515625,1.48515625 4.88515625,1.48515625 4.88515625,1.48515625 C4.88515625,1.48515625 4.88515625,15.1828125 4.88515625,15.1828125 C4.88515625,15.6140625 5.02890625,15.9492187 5.31640625,16.2367187 C5.60390625,16.5242187 5.9390625,16.6679687 6.3703125,16.6679687 C6.3703125,16.6679687 6.3703125,16.6679687 6.3703125,16.6679687 C6.3703125,16.6679687 14.08125,16.6679687 14.08125,16.6679687 C14.08125,16.6679687 19.0140625,20.4039062 19.0140625,20.4039062 C19.253125,20.5476562 19.4929687,20.5953125 19.6367187,20.5953125 C19.6367187,20.5953125 19.6367187,20.5953125 19.6367187,20.5953125 C19.8757812,20.5953125 20.115625,20.4992187 20.3070312,20.3078125 C20.4984375,20.1164063 20.5945312,19.8765625 20.5945312,19.6375 C20.5945312,19.6375 20.5945312,19.6375 20.5945312,19.6375 C20.5945312,19.6375 20.5945312,16.6679687 20.5945312,16.6679687 C20.5945312,16.6679687 23.0367187,16.6679687 23.0367187,16.6679687 C23.4679687,16.6679687 23.803125,16.5242187 24.090625,16.2367187 C24.378125,15.9492187 24.521875,15.6140625 24.521875,15.1828125 C24.521875,15.1828125 24.521875,15.1828125 24.521875,15.1828125 C24.521875,15.1828125 24.521875,1.48515625 24.521875,1.48515625 C24.521875,1.05390625 24.378125,0.71875 24.090625,0.43125 C23.803125,0.14375 23.4679687,0 23.0367187,0 Z' }, void 0));
  const viewBox$3 = '0 0 25 25';

  var chatsSolid = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$3,
    Component: Component$3,
    viewBox: viewBox$3
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$2 = 'thumbs-up-solid';
  const Component$2 = () => (jsxRuntime.jsx("path", { d: 'M21.59375,8.5671875 C21.59375,8.5671875 21.59375,8.5671875 21.59375,8.5671875 C21.5460937,8.5671875 21.45,8.5671875 21.3546875,8.5671875 C21.2109375,8.61484375 21.1632812,8.61484375 21.115625,8.61484375 C21.115625,8.61484375 21.115625,8.61484375 21.115625,8.61484375 C20.3492187,8.80625 19.4390625,8.99765625 18.4335937,9.14140625 C17.3796875,9.28515625 16.5179687,9.42890625 15.8953125,9.4765625 C15.8953125,9.4765625 15.8953125,9.4765625 15.8953125,9.4765625 C15.8953125,9.4765625 14.9375,9.6203125 14.9375,9.6203125 C14.9375,9.6203125 14.7460937,9.6203125 14.7460937,9.6203125 C14.4585938,9.6203125 14.2195312,9.52421875 14.0273437,9.3328125 C13.8351562,9.14140625 13.7398437,8.9015625 13.7398437,8.6625 C13.7398437,8.6625 13.7398437,8.6625 13.7398437,8.6625 C13.7398437,8.6625 13.7398437,3.059375 13.7398437,3.059375 C13.7398437,2.5328125 13.5484375,2.05390625 13.1648437,1.62265625 C12.7335937,1.19140625 12.2546875,1 11.728125,1 C11.728125,1 11.728125,1 11.728125,1 C11.728125,1 11.6804687,1 11.6804687,1 C11.1539063,1 10.7226562,1.14375 10.3398438,1.47890625 C9.95703125,1.8140625 9.7171875,2.2453125 9.62109375,2.72421875 C9.62109375,2.72421875 9.62109375,2.72421875 9.62109375,2.72421875 C9.33359375,4.3046875 8.80703125,5.88515625 8.08828125,7.465625 C7.321875,9.09375 6.5078125,10.1476563 5.69375,10.6265625 C5.69375,10.6265625 5.69375,10.6265625 5.69375,10.6265625 C5.4546875,10.1 5.0234375,9.86015625 4.4484375,9.86015625 C4.4484375,9.86015625 4.4484375,9.86015625 4.4484375,9.86015625 C4.4484375,9.86015625 2.48515625,9.86015625 2.48515625,9.86015625 C2.05390625,9.86015625 1.71875,10.0039062 1.43125,10.2914062 C1.14375,10.5789062 1,10.9140625 1,11.296875 C1,11.296875 1,11.296875 1,11.296875 C1,11.296875 1,23.078125 1,23.078125 C1,23.509375 1.14375,23.8445313 1.43125,24.1320313 C1.71875,24.4195312 2.05390625,24.5632812 2.48515625,24.5632812 C2.48515625,24.5632812 2.48515625,24.5632812 2.48515625,24.5632812 C2.48515625,24.5632812 4.4484375,24.5632812 4.4484375,24.5632812 C4.8796875,24.5632812 5.21484375,24.4195312 5.50234375,24.1320313 C5.74140625,23.8445313 5.88515625,23.509375 5.88515625,23.078125 C5.88515625,23.078125 5.88515625,23.078125 5.88515625,23.078125 C5.88515625,23.078125 5.88515625,22.1203125 5.88515625,22.1203125 C5.88515625,22.1203125 8.8546875,23.5570312 8.8546875,23.5570312 C8.8546875,23.5570312 19.3914062,23.5570312 19.3914062,23.5570312 C20.0617188,23.5570312 20.684375,23.365625 21.2109375,22.934375 C21.7375,22.503125 22.1210938,21.9765625 22.2648438,21.30625 C22.2648438,21.30625 22.2648438,21.30625 22.2648438,21.30625 C23.0789062,17.8578125 23.4625,14.3140625 23.5101563,10.6742187 C23.5101563,10.6742187 23.5101563,10.6742187 23.5101563,10.6742187 C23.5101563,10.6742187 23.5578125,10.578125 23.5578125,10.578125 C23.5578125,10.0515625 23.3664063,9.57265625 22.9828125,9.14140625 C22.6,8.75859375 22.1210938,8.56640625 21.59375,8.56640625 L21.59375,8.5671875 Z M4.9265625,11.296875 C4.9265625,11.296875 4.9265625,16.2773438 4.9265625,16.2773438 C4.9265625,16.2773438 4.87890625,21.6414063 4.87890625,21.6414063 C4.87890625,21.6414063 4.9265625,21.6414063 4.9265625,21.6414063 C4.9265625,21.6414063 4.9265625,23.078125 4.9265625,23.078125 C4.9265625,23.4132813 4.7828125,23.5570313 4.44765625,23.5570313 C4.44765625,23.5570313 4.44765625,23.5570313 4.44765625,23.5570313 C4.44765625,23.5570313 2.484375,23.5570313 2.484375,23.5570313 C2.14921875,23.5570313 1.9578125,23.4132813 1.9578125,23.078125 C1.9578125,23.078125 1.9578125,23.078125 1.9578125,23.078125 C1.9578125,23.078125 1.9578125,11.296875 1.9578125,11.296875 C1.9578125,10.9617187 2.14921875,10.8179688 2.484375,10.8179688 C2.484375,10.8179688 2.484375,10.8179688 2.484375,10.8179688 C2.484375,10.8179688 4.44765625,10.8179688 4.44765625,10.8179688 C4.7828125,10.8179688 4.9265625,10.9617187 4.9265625,11.296875 C4.9265625,11.296875 4.9265625,11.296875 4.9265625,11.296875 Z' }, void 0));
  const viewBox$2 = '0 0 25 25';

  var thumpsupsolid = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$2,
    Component: Component$2,
    viewBox: viewBox$2
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name$1 = 'thumbs-down-solid';
  const Component$1 = () => (jsxRuntime.jsx("path", { d: 'M22.2171875,3.921875 C22.2171875,3.921875 22.2648438,4.25703125 22.2648438,4.25703125 C22.1210938,3.58671875 21.7382813,3.059375 21.2109375,2.62890625 C20.6835938,2.1984375 20.0617188,2.00625 19.3914063,2.00625 C19.3914063,2.00625 19.3914063,2.00625 19.3914063,2.00625 C19.3914063,2.00625 8.8546875,2.00625 8.8546875,2.00625 C8.8546875,2.00625 5.88515625,3.44296875 5.88515625,3.44296875 C5.88515625,3.44296875 5.88515625,2.48515625 5.88515625,2.48515625 C5.88515625,2.05390625 5.74140625,1.71875 5.50234375,1.43125 C5.21484375,1.14375 4.8796875,1 4.4484375,1 C4.4484375,1 4.4484375,1 4.4484375,1 C4.4484375,1 2.48515625,1 2.48515625,1 C2.05390625,1 1.71875,1.14375 1.43125,1.43125 C1.14375,1.71875 1,2.05390625 1,2.48515625 C1,2.48515625 1,2.48515625 1,2.48515625 C1,2.48515625 1,14.2664063 1,14.2664063 C1,14.6976563 1.14375,15.0328125 1.43125,15.3203125 C1.71875,15.6078125 2.05390625,15.7515625 2.48515625,15.7515625 C2.48515625,15.7515625 2.48515625,15.7515625 2.48515625,15.7515625 C2.48515625,15.7515625 4.4484375,15.7515625 4.4484375,15.7515625 C4.975,15.7515625 5.40625,15.5125 5.69375,14.9851562 C5.69375,14.9851562 5.69375,14.9851562 5.69375,14.9851562 C6.5078125,15.4164062 7.321875,16.4695313 8.08828125,18.05 C8.80703125,19.678125 9.33359375,21.2585937 9.62109375,22.8390625 C9.62109375,22.8390625 9.62109375,22.8390625 9.62109375,22.8390625 C9.7171875,23.365625 9.95625,23.7492187 10.3398438,24.084375 C10.7234375,24.4195313 11.1539062,24.5632812 11.6804688,24.5632812 C11.6804688,24.5632812 11.6804688,24.5632812 11.6804688,24.5632812 C11.6804688,24.5632812 11.728125,24.5632812 11.728125,24.5632812 C12.2546875,24.5632812 12.7335937,24.371875 13.1648437,23.940625 C13.5476562,23.5578125 13.7398438,23.0789062 13.7398438,22.5039062 C13.7398438,22.5039062 13.7398438,22.5039062 13.7398438,22.5039062 C13.7398438,22.5039062 13.7398438,16.9007813 13.7398438,16.9007813 C13.7398438,16.6617187 13.8359375,16.421875 14.0273438,16.2304688 C14.21875,16.0390625 14.4585938,15.9429687 14.7460938,15.9429687 C14.7460938,15.9429687 14.7460938,15.9429687 14.7460938,15.9429687 C14.7460938,15.9429687 14.9375,15.9429687 14.9375,15.9429687 C14.9375,15.9429687 15.8953125,16.0867188 15.8953125,16.0867188 C16.5179688,16.1828125 17.3796875,16.3257812 18.4335938,16.4695313 C19.4875,16.6132812 20.396875,16.8046875 21.1632813,16.9484375 C21.1632813,16.9484375 21.1632813,16.9484375 21.1632813,16.9484375 C21.2109375,16.9960938 21.3546875,16.9960938 21.5945312,16.9960938 C21.5945312,16.9960938 21.5945312,16.9960938 21.5945312,16.9960938 C22.1210938,16.9960938 22.6,16.8046875 22.9835937,16.4210937 C23.3671875,16.0375 23.5585938,15.559375 23.5585938,15.0320313 C23.5585938,15.0320313 23.5585938,15.0320313 23.5585938,15.0320313 C23.5585938,14.984375 23.5585938,14.984375 23.5109375,14.9359375 C23.5109375,14.9359375 23.5109375,14.9359375 23.5109375,14.9359375 C23.4632812,11.34375 23.0320312,7.70390625 22.2179687,3.9203125 C22.2179687,3.9203125 22.2179687,3.9203125 22.2179687,3.9203125 L22.2171875,3.921875 Z M4.92734375,2.484375 C4.92734375,2.484375 4.92734375,3.96875 4.92734375,3.96875 C4.92734375,3.96875 4.8796875,3.96875 4.8796875,3.96875 C4.8796875,3.96875 4.92734375,9.28515625 4.92734375,9.28515625 C4.92734375,9.28515625 4.92734375,14.265625 4.92734375,14.265625 C4.92734375,14.6007812 4.78359375,14.7445312 4.4484375,14.7445312 C4.4484375,14.7445312 4.4484375,14.7445312 4.4484375,14.7445312 C4.4484375,14.7445312 2.48515625,14.7445312 2.48515625,14.7445312 C2.15,14.7445312 1.95859375,14.6007812 1.95859375,14.265625 C1.95859375,14.265625 1.95859375,14.265625 1.95859375,14.265625 C1.95859375,14.265625 1.95859375,2.484375 1.95859375,2.484375 C1.95859375,2.14921875 2.15,2.00546875 2.48515625,2.00546875 C2.48515625,2.00546875 2.48515625,2.00546875 2.48515625,2.00546875 C2.48515625,2.00546875 4.4484375,2.00546875 4.4484375,2.00546875 C4.78359375,2.00546875 4.92734375,2.14921875 4.92734375,2.484375 C4.92734375,2.484375 4.92734375,2.484375 4.92734375,2.484375 L4.92734375,2.484375 Z' }, void 0));
  const viewBox$1 = '0 0 25 25';

  var thumpsdownsolid = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$1,
    Component: Component$1,
    viewBox: viewBox$1
  });

  // This file is autogenerated. Any changes will be overwritten.
  const name = 'open';
  const Component = () => (jsxRuntime.jsx("path", { d: 'M23.5578125,1.478125 C23.5578125,1.478125 23.5578125,1.478125 23.5578125,1.478125 C23.5578125,1.478125 23.5578125,9.3328125 23.5578125,9.3328125 C23.5578125,9.66796875 23.4140625,9.81171875 23.0789062,9.81171875 C22.74375,9.81171875 22.6,9.66796875 22.6,9.3328125 C22.6,9.3328125 22.6,9.3328125 22.6,9.3328125 C22.6,9.3328125 22.6,2.67578125 22.6,2.67578125 C22.6,2.67578125 10.675,14.6007812 10.675,14.6007812 C10.4835938,14.696875 10.3875,14.7445312 10.3398438,14.7445312 C10.3398438,14.7445312 10.3398438,14.7445312 10.3398438,14.7445312 C10.0046875,14.7445312 9.81328125,14.553125 9.81328125,14.2179687 C9.81328125,14.2179687 9.81328125,14.2179687 9.81328125,14.2179687 C9.81328125,14.0742187 9.8609375,13.9789062 9.95703125,13.8828125 C9.95703125,13.8828125 9.95703125,13.8828125 9.95703125,13.8828125 C9.95703125,13.8828125 21.8820312,1.9578125 21.8820312,1.9578125 C21.8820312,1.9578125 15.225,1.9578125 15.225,1.9578125 C14.8898437,1.9578125 14.7460937,1.8140625 14.7460937,1.47890625 C14.7460937,1.14375 14.8898437,1 15.225,1 C15.225,1 15.225,1 15.225,1 C15.225,1 23.0796875,1 23.0796875,1 C23.4148437,1 23.5585937,1.14375 23.5585937,1.47890625 L23.5578125,1.478125 Z M21.59375,13.2601562 C21.59375,12.925 21.45,12.78125 21.1148437,12.78125 C20.7796875,12.78125 20.6359375,12.925 20.6359375,13.2601562 C20.6359375,13.2601562 20.6359375,13.2601562 20.6359375,13.2601562 C20.6359375,13.2601562 20.6359375,22.0726562 20.6359375,22.0726562 C20.6359375,22.4078125 20.4445312,22.5515625 20.109375,22.5515625 C20.109375,22.5515625 20.109375,22.5515625 20.109375,22.5515625 C20.109375,22.5515625 2.48515625,22.5515625 2.48515625,22.5515625 C2.15,22.5515625 1.95859375,22.4078125 1.95859375,22.0726562 C1.95859375,22.0726562 1.95859375,22.0726562 1.95859375,22.0726562 C1.95859375,22.0726562 1.95859375,4.4484375 1.95859375,4.4484375 C1.95859375,4.11328125 2.15,3.921875 2.48515625,3.921875 C2.48515625,3.921875 2.48515625,3.921875 2.48515625,3.921875 C2.48515625,3.921875 11.2976562,3.921875 11.2976562,3.921875 C11.6328125,3.921875 11.7765625,3.778125 11.7765625,3.44296875 C11.7765625,3.1078125 11.6328125,2.9640625 11.2976562,2.9640625 C11.2976562,2.9640625 11.2976562,2.9640625 11.2976562,2.9640625 C11.2976562,2.9640625 2.48515625,2.9640625 2.48515625,2.9640625 C2.05390625,2.9640625 1.71875,3.1078125 1.43125,3.3953125 C1.14375,3.6828125 1,4.01796875 1,4.44921875 C1,4.44921875 1,4.44921875 1,4.44921875 C1,4.44921875 1,22.0734375 1,22.0734375 C1,22.5046875 1.14375,22.8398438 1.43125,23.1273437 C1.71875,23.4148437 2.05390625,23.5585938 2.48515625,23.5585938 C2.48515625,23.5585938 2.48515625,23.5585938 2.48515625,23.5585938 C2.48515625,23.5585938 20.109375,23.5585938 20.109375,23.5585938 C20.540625,23.5585938 20.8757812,23.4148437 21.1632813,23.1273438 C21.4507812,22.8398438 21.5945312,22.5046875 21.5945312,22.0734375 C21.5945312,22.0734375 21.5945312,22.0734375 21.5945312,22.0734375 C21.5945312,22.0734375 21.5945312,13.2609375 21.5945312,13.2609375 L21.59375,13.2601562 Z' }, void 0));
  const viewBox = '0 0 25 25';

  var open = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name,
    Component: Component,
    viewBox: viewBox
  });

  function useIconRegistration() {
    registerIcon(chatSolid);
    registerIcon(userSolid);
    registerIcon(user);
    registerIcon(userCheck);
    registerIcon(chats);
    registerIcon(documentDoc);
    registerIcon(download);
    registerIcon(facebook);
    registerIcon(help);
    registerIcon(paperClip);
    registerIcon(twitter);
    registerIcon(botSolid);
    registerIcon(caretDown);
    registerIcon(caretLeft);
    registerIcon(caretRight);
    registerIcon(bulbSolid);
    registerIcon(times);
    registerIcon(more);
    registerIcon(bulb);
    registerIcon(chainUp);
    registerIcon(faceHappy);
    registerIcon(faceBlank);
    registerIcon(faceSad);
    registerIcon(document$1);
    registerIcon(documentXls);
    registerIcon(documentPdf);
    registerIcon(documentCompress);
    registerIcon(botSolid);
    registerIcon(handSolid);
    registerIcon(arrowMicroDown);
    registerIcon(caretUp);
    registerIcon(whatsapp);
    registerIcon(business);
    registerIcon(chatsSolid);
    registerIcon(thumpsupsolid);
    registerIcon(thumpsdownsolid);
    registerIcon(starsolid);
    registerIcon(star);
    registerIcon(open);
    registerIcon(filter);
    registerIcon(search);
    registerIcon(check);
  }

  var ArticleViewHistory = /*#__PURE__*/_createClass(function ArticleViewHistory(title, id) {
    _classCallCheck(this, ArticleViewHistory);
    this.title = title;
    this.id = id;
  });

  var Parameter = /*#__PURE__*/_createClass(function Parameter(name, value) {
    _classCallCheck(this, Parameter);
    this.name = name;
    this.value = value;
  });

  var apiOptions = {
    dataPage: {
      name: '',
      parameters: [],
      callback: null,
      event: null
    },
    flowAction: {
      flowAction: '',
      displayMode: '',
      flowActionClass: '',
      contextPage: '',
      template: '',
      isMobileFullScreen: true,
      revealEffectName: '',
      closingEffectName: '',
      closeOnClickAway: true,
      centerOverlay: true,
      event: null
    },
    harness: {
      harness: '',
      "class": '',
      displayMode: '',
      activity: '',
      event: null
    }
  };
  var getDataPage = function getDataPage(datapage, callback, parameterArray) {
    apiOptions.dataPage.name = datapage;
    apiOptions.dataPage.callback = callback;
    apiOptions.dataPage.parameters = parameterArray;
    if (pega.api) {
      pega.api.ui.actions.getDataPage(apiOptions.dataPage);
    } else {
      var _apiOptions = {
        dataPage: {
          name: datapage,
          callback: callback,
          parameters: parameterArray,
          event: null
        }
      };
      var timer = setInterval(function () {
        if (pega.api) {
          pega.api.ui.actions.getDataPage(_apiOptions.dataPage);
          clearInterval(timer);
        }
      }, 1000);
    }
  };
  var launchLocalAction = function launchLocalAction(flowAction, flowActionClass, contextPage, template, event) {
    apiOptions.flowAction.flowAction = flowAction;
    apiOptions.flowAction.displayMode = pega.api.ui.constants.MODAL_DIALOG;
    apiOptions.flowAction.flowActionClass = flowActionClass;
    apiOptions.flowAction.contextPage = contextPage;
    apiOptions.flowAction.template = template;
    apiOptions.flowAction.isMobileFullScreen = true;
    apiOptions.flowAction.closeOnClickAway = true;
    apiOptions.flowAction.centerOverlay = true;
    apiOptions.flowAction.event = event;
    pega.api.ui.actions.launchLocalAction(apiOptions.flowAction);
  };
  var launchHarness = function launchHarness(harness, harnessClass, activity, event) {
    apiOptions.harness.harness = harness;
    apiOptions.harness.harnessClass = harnessClass;
    apiOptions.harness.activity = activity;
    apiOptions.harness.event = event;
    apiOptions.harness.displayMode = pega.api.ui.constants.POP_UP_WINDOW;
    pega.api.ui.actions.launchHarness(apiOptions.harness);
  };

  var _templateObject;
  var DL = styled__default["default"].div.withConfig({
    displayName: "Knowledge__DL",
    componentId: "sc-1aj26y1-0"
  })(_templateObject || (_templateObject = _taggedTemplateLiteral(["ul{padding-left:0px;}"])));

  /** Knowledge management container component */
  function KM(props) {
    useIconRegistration();
    var localizationObj = JSON.parse(unescape(props.LocalizationString.replace(/&quot;/g, '"')));

    /**State for transition state */
    var _useElement = useElement$1(),
      _useElement2 = _slicedToArray(_useElement, 2),
      popoverEl = _useElement2[0],
      setPopoverEl = _useElement2[1];
    var _useElement3 = useElement$1(),
      _useElement4 = _slicedToArray(_useElement3, 2),
      filterButtonEl = _useElement4[0],
      setFilterButtonEl = _useElement4[1];
    var _useState = React.useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      mountPopover = _useState2[0],
      setMountPopover = _useState2[1];
    var _useState3 = React.useState(true),
      _useState4 = _slicedToArray(_useState3, 2),
      isLoading = _useState4[0],
      setIsLoading = _useState4[1];
    var _useState5 = React.useState(true),
      _useState6 = _slicedToArray(_useState5, 2);
      _useState6[0];
      _useState6[1];
    var _useState7 = React.useState(true),
      _useState8 = _slicedToArray(_useState7, 2),
      isArticleDetailLoading = _useState8[0],
      setIsArticleDetailLoading = _useState8[1];

    /** State for articlesList */
    var _useState9 = React.useState([]),
      _useState10 = _slicedToArray(_useState9, 2),
      articlesList = _useState10[0],
      setArticles = _useState10[1];

    /** State for category list */
    var _useState11 = React.useState([]),
      _useState12 = _slicedToArray(_useState11, 2),
      categoryList = _useState12[0],
      setCategoryList = _useState12[1];
    var _useState13 = React.useState(0),
      _useState14 = _slicedToArray(_useState13, 2),
      searchResultCount = _useState14[0],
      setSearchResultCount = _useState14[1];
    var _useState15 = React.useState({}),
      _useState16 = _slicedToArray(_useState15, 2),
      applicationSettings = _useState16[0],
      setApplicationSettings = _useState16[1];
    var UpdateCategoryStructure = function UpdateCategoryStructure(items) {
      var iteml = items.length;
      for (var p = 0; p < iteml; p++) {
        items[p].primary = items[p].pyLabel;
        items[p].id = items[p].pyID;
        items[p].pzInsKey = items[p].pzInsKey;
        items[p].selected = false;
        if (items[p].items != null || items[p].items != undefined) {
          items[p].secondary = [];
          UpdateCategoryStructure(items.items);
        }
      }
    };
    var setArticleData = function setArticleData(response) {
      setArticles(response.pxResults);
      setIsLoading(false);
      setHasRoleSuggestedContent(response.HasRoleSuggestedContent);
      setSearchResultCount(response.pxResultCount);
      if (articleListParams.FilteredCategory.length != 0) response.CategoryList = categoryList;
      var newCategoryList = new Array();
      new Array();
      var clength = response.CategoryList != null ? response.CategoryList.length : 0;
      var i = 0;
      for (i = 0; i < clength; i++) {
        response.CategoryList[i].primary = response.CategoryList[i].pyLabel;
        response.CategoryList[i].id = response.CategoryList[i].pyID;
        response.CategoryList[i].pzInsKey = response.CategoryList[i].pzInsKey;
        if (response.CategoryList[i].items != null || response.CategoryList.items != undefined) {
          response.CategoryList[i].secondary = [];
          response.CategoryList[i].items;
          UpdateCategoryStructure(response.CategoryList[i].items);
        }
      }
      newCategoryList = response.CategoryList;
      if (null != response && null != response.CategoryList) {
        setCategoryList(_toConsumableArray(newCategoryList));
      }
    };
    var setArticleContentData = function setArticleContentData(response) {
      var tmpArticleParams = _objectSpread2({}, articleParams);
      tmpArticleParams.ContentSourceAuthored = response.ContentSourceAuthored;
      tmpArticleParams.ArticleTitle = response.ArticleTitle;
      tmpArticleParams.CoverId = response.pxCoverInsKey;
      tmpArticleParams.ArticleClass = response.pxObjClass;
      tmpArticleParams.IsArticleFollowed = response.IsArticleFollowed;
      tmpArticleParams.CurrentRating = response.CurrentRating;
      tmpArticleParams.KMAssociatedTags = response.KMAssociatedTags != undefined ? response.KMAssociatedTags.map(function (item) {
        return {
          tagName: item.pyLabel,
          id: item.pyLabel
        };
      }) : null;
      tmpArticleParams.KMContentAttachmentList = [];
      if (null != response.KMContentAttachmentList) {
        tmpArticleParams.KMContentAttachmentList = response.KMContentAttachmentList;
      }
      tmpArticleParams.KMReferencedArticleList = response.KMReferencedArticleList;
      tmpArticleParams.ArticleId = response.pyID;
      tmpArticleParams.LikeCount = response.LikeCount;
      tmpArticleParams.DisLikeCount = response.DislikeCount;
      tmpArticleParams.Category = response.Category;
      tmpArticleParams.PublishedDate = response.LastPublished;
      tmpArticleParams.ShowPushArticleLink = response.DisplayPushToLink;
      tmpArticleParams.ShowPushArticleText = response.DisplayPushToText;
      tmpArticleParams.ContentSourceURL = response.ContentSourceURL;
      tmpArticleParams.ContentType = response.ContentType;
      tmpArticleParams.ShareableURL = response.ShareableURL;
      tmpArticleParams.ArticleAbstract = response.ArticleAbstract;
      tmpArticleParams.IsInteractionSocial = response.IsInteractionSocial;
      if (tmpArticleParams.ArticleTitle != '') {
        setIsArticleDetailLoading(false);
      }
      setArticleParams(tmpArticleParams);
      setHasRoleSuggestedContent(response.HasRoleSuggestedContent);
    };
    var setFollowed = function setFollowed(response) {
      var tmpArticleParams = _objectSpread2({}, articleParams);
      tmpArticleParams.IsArticleFollowed = response.IsArticleFollowed;
      setArticleParams(tmpArticleParams);
    };
    var setLiked = function setLiked(response) {
      var tmpArticleParams = _objectSpread2({}, articleParams);
      tmpArticleParams.CurrentRating = response.CurrentRating;
      tmpArticleParams.LikeCount = response.LikeCount;
      tmpArticleParams.DisLikeCount = response.DislikeCount;
      setArticleParams(tmpArticleParams);
    };
    useOuterEvent$1('mousedown', [popoverEl, filterButtonEl], function () {
      setMountPopover(false);
    });
    /**State representing parameters passed to data page.*/
    var _useState17 = React.useState({
        Profile: props.Profile,
        FilteredCategory: '',
        ArticleTitle: false,
        InternalContent: false,
        ArticleBody: false,
        searchText: '',
        IsTagSearch: false,
        CaseID: props.CaseID,
        ActionName: props.ActionName,
        InteractionID: props.InteractionID,
        ResetCategory: true,
        DataPage: props.ArticleListDataPage,
        IsArticleViewed: false,
        ArticleId: props.ArticleId,
        Action: '',
        OperatorKey: props.OperatorKey,
        CallBackFunction: null,
        Rating: '',
        showFeedbackMessage: false
      }),
      _useState18 = _slicedToArray(_useState17, 2),
      articleListParams = _useState18[0],
      setArticleListParams = _useState18[1];
    var _useState19 = React.useState(''),
      _useState20 = _slicedToArray(_useState19, 2),
      selectedCategory = _useState20[0],
      setSelectedCategory = _useState20[1];
    var filterRegex = new RegExp("^".concat(selectedCategory.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&')), 'i');
    var _useState21 = React.useState({
        ContentSourceAuthored: '',
        ContentSourceURL: '',
        ArticleTitle: '',
        ArticleId: '',
        KMAssociatedTags: [],
        KMContentAttachmentList: [],
        KMReferencedArticleList: [],
        ArticleClass: '',
        IsArticleFollowed: '',
        CurrentRating: '',
        CoverId: '',
        LikeCount: '',
        DisLikeCount: '',
        Category: '',
        PublishedDate: '',
        ShowPushArticleLink: false,
        ShowPushArticleText: false,
        ShareableURL: '',
        ArticleAbstract: '',
        ChatID: props.ChatID,
        IsInteractionSocial: false
      }),
      _useState22 = _slicedToArray(_useState21, 2),
      articleParams = _useState22[0],
      setArticleParams = _useState22[1];
    var _useState23 = React.useState([{
        title: localizationObj.BackToArticlesLabel,
        id: ''
      }]),
      _useState24 = _slicedToArray(_useState23, 2),
      articleViewHistory = _useState24[0],
      setArticleViewHistory = _useState24[1];
    var _useState25 = React.useState(''),
      _useState26 = _slicedToArray(_useState25, 2),
      hasRoleSuggestedContent = _useState26[0],
      setHasRoleSuggestedContent = _useState26[1];

    /*To open article link */
    var openArticle = function openArticle(event) {
      var tmpArticleListParams = _objectSpread2({}, articleListParams);
      tmpArticleListParams.IsArticleViewed = true;
      tmpArticleListParams.CallBackFunction = setArticleContentData;
      tmpArticleListParams.DataPage = props.ArticleDetailDataPage;
      tmpArticleListParams.ArticleId = event.target.dataset.articleId;
      tmpArticleListParams.showFeedbackMessage = false;
      setArticleListParams(tmpArticleListParams);
      setIsArticleDetailLoading(true);
    };
    var openReferencedArticle = function openReferencedArticle(event, dataItem) {
      if (dataItem.pyCategory == 'URL') {
        window.open(dataItem.pyURLContent, '_blank');
      } else if (dataItem.pyCategory == 'File') {
        pega.ui.HarnessActions.doAttachmentSingleClick('', dataItem.pxObjClass, dataItem.pxInsName, dataItem.pzInsKey);
      } else {
        var tmpArticleViewHistory = _toConsumableArray(articleViewHistory);
        var tmpArticleParams = _objectSpread2({}, articleParams);
        var tmpArticleListParams = _objectSpread2({}, articleListParams);
        tmpArticleListParams.IsArticleViewed = true;
        tmpArticleListParams.CallBackFunction = setArticleContentData;
        tmpArticleListParams.DataPage = props.ArticleDetailDataPage;
        tmpArticleListParams.ArticleId = dataItem.pyID;
        tmpArticleListParams.showFeedbackMessage = false;
        tmpArticleViewHistory.push(new ArticleViewHistory(tmpArticleParams.ArticleTitle, tmpArticleParams.ArticleId));
        setArticleViewHistory(tmpArticleViewHistory);
        setArticleListParams(tmpArticleListParams);
      }
    };

    /** Sets state property searchText */
    var setSearchTextValue = function setSearchTextValue(value) {
      var tmpArticleListParams = _objectSpread2({}, articleListParams);
      tmpArticleListParams.searchText = value;
      tmpArticleListParams.Profile = 'Search';
      tmpArticleListParams.ResetCategory = true;
      setIsLoading(true);
      setArticleListParams(tmpArticleListParams);
    };
    var filterSearchByArticleTitle = function filterSearchByArticleTitle() {
      var tmpArticleListParams = _objectSpread2({}, articleListParams);
      tmpArticleListParams.Profile = 'Search';
      tmpArticleListParams.ResetCategory = true;
      tmpArticleListParams.ArticleTitle = !articleListParams.ArticleTitle;
      setArticleListParams(tmpArticleListParams);
    };
    var filterSearchByArticleBody = function filterSearchByArticleBody() {
      var tmpArticleListParams = _objectSpread2({}, articleListParams);
      tmpArticleListParams.Profile = 'Search';
      tmpArticleListParams.ResetCategory = true;
      tmpArticleListParams.ArticleBody = !articleListParams.ArticleBody;
      setArticleListParams(tmpArticleListParams);
    };
    var clearAllSearchFilters = function clearAllSearchFilters() {
      var tmpArticleListParams = _objectSpread2({}, articleListParams);
      tmpArticleListParams.Profile = 'Search';
      tmpArticleListParams.ArticleBody = false;
      tmpArticleListParams.ArticleTitle = false;
      tmpArticleListParams.FilteredCategory = '';
      tmpArticleListParams.ResetCategory = true;
      setArticleListParams(tmpArticleListParams);
      setMountPopover(false);
    };
    var filterResultsByCategory = function filterResultsByCategory(value) {
      var tmpArticleListParams = _objectSpread2({}, articleListParams);
      value.selected = true;
      if (value.pzInsKey == undefined || value.pzInsKey == '' || value.pzInsKey == null) {
        tmpArticleListParams.FilteredCategory = '';
        tmpArticleListParams.ResetCategory = true;
      } else {
        tmpArticleListParams.FilteredCategory = '"' + value.pzInsKey + '"';
        tmpArticleListParams.ResetCategory = false;
      }
      setSelectedCategory(value.pyLabel);
      setArticleListParams(tmpArticleListParams);
    };
    var changeSortBy = function changeSortBy(value) {
      var tmpArticleListParams = _objectSpread2({}, articleListParams);
      value.selected = true;
      tmpArticleListParams.Profile = value.id;
      tmpArticleListParams.searchText = '';
      tmpArticleListParams.ResetCategory = true;
      setArticleListParams(tmpArticleListParams);
    };
    var handleArticleFavToggle = function handleArticleFavToggle(action) {
      var tmpArticleListParams = _objectSpread2({}, articleListParams);
      tmpArticleListParams.DataPage = props.FollowDataPage;
      tmpArticleListParams.CallBackFunction = setFollowed;
      tmpArticleListParams.Action = action;
      setArticleListParams(tmpArticleListParams);
    };
    var handleArticleLikeToggle = function handleArticleLikeToggle(rating) {
      var tmpArticleListParams = _objectSpread2({}, articleListParams);
      tmpArticleListParams.showFeedbackMessage = true;
      tmpArticleListParams.DataPage = props.LikeDataPage;
      tmpArticleListParams.CallBackFunction = setLiked;
      tmpArticleListParams.Rating = rating;
      setArticleListParams(tmpArticleListParams);
    };
    var contentClickHandler = function contentClickHandler(event) {
      if (event.target.className == 'clickableKC') {
        var tmpArticleViewHistory = _toConsumableArray(articleViewHistory);
        var tmpArticleParams = _objectSpread2({}, articleParams);
        var tmpArticleListParams = _objectSpread2({}, articleListParams);
        tmpArticleListParams.IsArticleViewed = true;
        tmpArticleListParams.showFeedbackMessage = false;
        tmpArticleListParams.CallBackFunction = setArticleContentData;
        tmpArticleListParams.DataPage = props.ArticleDetailDataPage;
        tmpArticleListParams.ArticleId = event.target.id;
        tmpArticleViewHistory.push(new ArticleViewHistory(tmpArticleParams.ArticleTitle, tmpArticleParams.ArticleId));
        setArticleViewHistory(tmpArticleViewHistory);
        setArticleListParams(tmpArticleListParams);
      }
    };
    var onBackToArticlesClick = function onBackToArticlesClick() {
      var tmpArticleViewHistory = _toConsumableArray(articleViewHistory);
      var tmpArticleListParams = _objectSpread2({}, articleListParams);
      if (tmpArticleViewHistory.length > 1) {
        tmpArticleListParams.IsArticleViewed = true;
        tmpArticleListParams.DataPage = props.ArticleDetailDataPage;
        tmpArticleListParams.ArticleId = tmpArticleViewHistory[tmpArticleViewHistory.length - 1].id;
        tmpArticleListParams.CallBackFunction = setArticleContentData;
        articleViewHistory.pop();
      } else {
        tmpArticleListParams.IsArticleViewed = false;
        tmpArticleListParams.ArticleId = '';
        tmpArticleListParams.DataPage = props.ArticleListDataPage;
      }
      setArticleParams({
        ContentSourceAuthored: '',
        ArticleTitle: '',
        ArticleId: '',
        KMAssociatedTags: [],
        KMContentAttachmentList: [],
        KMReferencedArticleList: [],
        ArticleClass: '',
        IsArticleFollowed: '',
        CurrentRating: '',
        CoverId: '',
        LikeCount: '',
        DisLikeCount: ''
      });
      tmpArticleListParams.showFeedbackMessage = false;
      setIsArticleDetailLoading(true);
      setArticleListParams(tmpArticleListParams);
    };
    var onArticleTagClick = function onArticleTagClick(id) {
      var tmpArticleListParams = _objectSpread2({}, articleListParams);
      tmpArticleListParams.searchText = id;
      tmpArticleListParams.IsArticleViewed = false;
      tmpArticleListParams.Profile = 'Search';
      tmpArticleListParams.ResetCategory = true;
      tmpArticleListParams.DataPage = props.ArticleListDataPage;
      tmpArticleListParams.IsTagSearch = true;
      tmpArticleListParams.ArticleId = '';
      tmpArticleListParams.CallBackFunction = setArticleData;
      setArticleListParams(tmpArticleListParams);
    };
    var clearCategoryFilter = function clearCategoryFilter() {
      var tmpArticleListParams = _objectSpread2({}, articleListParams);
      tmpArticleListParams.FilteredCategory = '';
      tmpArticleListParams.ResetCategory = true;
      setArticleListParams(tmpArticleListParams);
    };
    var suggestArticle = function suggestArticle(id, event) {
      launchLocalAction(props.SuggestArticleFlowAction, props.SuggestArticleFlowActionClass, props.SuggestArticleContextPage, props.SuggestArticleModalTemplate, event);
    };
    var submitFeedback = function submitFeedback(id, event) {
      launchLocalAction(props.FeedbackFlowAction, props.FeedbackFlowActionClass, props.FeedbackContextPage, props.FeedbackModalTemplate, event);
    };
    var shareArticle = function shareArticle(id, event) {
      launchLocalAction(props.ShareArticleFlowAction, props.ShareArticleFlowActionClass, props.ShareArticleContextPage, props.ShareArticleModalTemplate, event);
    };
    var popOutArticle = function popOutArticle(event) {
      var harness = 'KnowledgeArticleDisplay';
      var harnessClass = 'PegaFW-KM-Work-Content-Published';
      var activity = {
        name: '',
        parameters: []
      };
      activity.name = 'PopOutKnowledgeArticle';
      activity.parameters.push(new Parameter('ContentId', articleParams.ArticleId));
      launchHarness(harness, harnessClass, activity, event);
    };
    var backtoHomeArticles = function backtoHomeArticles() {
      var tmpArticleListParams = _objectSpread2({}, articleListParams);
      tmpArticleListParams.Profile = props.CommaSeparatedProfiles.split(',')[0];
      tmpArticleListParams.ArticleBody = false;
      tmpArticleListParams.ArticleTitle = false;
      tmpArticleListParams.FilteredCategory = '';
      tmpArticleListParams.ResetCategory = true;
      tmpArticleListParams.searchText = '';
      setArticleListParams(tmpArticleListParams);
      setSelectedCategory('');
    };
    var getMetaData = function getMetaData(data) {
      var metaData = [];
      if (props.ShowCategory == 'true') {
        metaData.push( /*#__PURE__*/React__default["default"].createElement(Text$1, {
          className: "knowledge-component-category",
          title: data.Category
        }, data.Category));
      }
      if (props.ShowPublishedDate == 'true') {
        metaData.push( /*#__PURE__*/React__default["default"].createElement("span", {
          title: localizationObj.LastPublishedTooltip
        }, /*#__PURE__*/React__default["default"].createElement(Text$1, null, data.LastPublished)));
      }
      if (props.ShowRating == 'true') {
        metaData.push( /*#__PURE__*/React__default["default"].createElement(Flex$1, {
          itemGap: "14px",
          container: true,
          alignItems: "center"
        }, /*#__PURE__*/React__default["default"].createElement(Flex$1, {
          container: {
            itemGap: 0.5
          },
          alignItems: "center",
          title: localizationObj.LikeCountTooltip,
          className: "LikeDislike"
        }, /*#__PURE__*/React__default["default"].createElement(Icon$1, {
          name: "thumbs-up-solid",
          className: "thumbsupsolid"
        }), /*#__PURE__*/React__default["default"].createElement(Text$1, null, "(", data.LikeCount, ")")), /*#__PURE__*/React__default["default"].createElement(Flex$1, {
          container: {
            itemGap: 0.5
          },
          alignItems: "center",
          title: localizationObj.DislikeCountTooltip,
          className: "LikeDislike"
        }, /*#__PURE__*/React__default["default"].createElement(Icon$1, {
          name: "thumbs-down-solid"
        }), /*#__PURE__*/React__default["default"].createElement(Text$1, null, "(", data.DislikeCount, ")"))));
      }
      return metaData;
    };
    var getArticleAbstract = function getArticleAbstract(data) {
      if (props.ShowAbstract == 'true') {
        return /*#__PURE__*/React__default["default"].createElement(Text$1, null, data.ArticleAbstract);
      } else {
        return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null);
      }
    };
    var getArticleContent = function getArticleContent() {
      if (articleParams.ContentType == 'URL') {
        return /*#__PURE__*/React__default["default"].createElement(Link$1, {
          title: articleParams.ContentSourceURL,
          onClick: function onClick(event) {
            return openURLContent(event, articleParams.ContentSourceURL);
          }
        }, articleParams.ContentSourceURL);
      } else {
        return /*#__PURE__*/React__default["default"].createElement(Text$1, {
          className: "article-content-container",
          onClick: contentClickHandler,
          dangerouslySetInnerHTML: {
            __html: articleParams.ContentSourceAuthored
          }
        });
      }
    };
    var openURLContent = function openURLContent(event, url) {
      window.open(url, '_blank');
    };
    var getArticleDetailMetaData = function getArticleDetailMetaData() {
      if (articleParams.ArticleTitle == '') {
        return [/*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null)];
      } else {
        return [/*#__PURE__*/React__default["default"].createElement(Text$1, {
          variant: "secondary"
        }, articleParams.Category), /*#__PURE__*/React__default["default"].createElement(Text$1, {
          variant: "secondary"
        }, articleParams.PublishedDate), /*#__PURE__*/React__default["default"].createElement(Flex$1, {
          itemGap: "14px",
          container: {
            itemGap: 0.5
          },
          alignItems: "center"
        }, /*#__PURE__*/React__default["default"].createElement(Flex$1, {
          itemGap: "7px",
          container: {
            itemGap: 0.5
          },
          alignItems: "center"
        }, /*#__PURE__*/React__default["default"].createElement(Icon$1, {
          name: "thumbs-up-solid"
        }), /*#__PURE__*/React__default["default"].createElement(Text$1, null, "(", articleParams.LikeCount, ")")), /*#__PURE__*/React__default["default"].createElement(Flex$1, {
          itemGap: "7px",
          container: {
            itemGap: 0.5
          },
          alignItems: "center"
        }, /*#__PURE__*/React__default["default"].createElement(Icon$1, {
          name: "thumbs-down-solid"
        }), /*#__PURE__*/React__default["default"].createElement(Text$1, null, "(", articleParams.DisLikeCount, ")")))];
      }
    };
    var getArticleListHtml = function getArticleListHtml() {
      var articleListHtml = articleListParams.Profile == 'Search' ? /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(Flex$1, {
        className: "knowledge-navigation-container"
      }, /*#__PURE__*/React__default["default"].createElement("span", {
        "class": "knowledge-home-navigation"
      }, /*#__PURE__*/React__default["default"].createElement(Link$1, {
        onClick: backtoHomeArticles,
        title: localizationObj.BackToArticlesTooltip
      }, /*#__PURE__*/React__default["default"].createElement(Flex$1, {
        container: {
          itemGap: 0.5
        },
        alignItems: "center",
        itemGap: "7px"
      }, /*#__PURE__*/React__default["default"].createElement(Icon$1, {
        name: "caret-left"
      }), /*#__PURE__*/React__default["default"].createElement(Text$1, null, localizationObj.BackToArticlesLabel)))), /*#__PURE__*/React__default["default"].createElement("span", {
        "class": "knowledge-search-result-count"
      }, /*#__PURE__*/React__default["default"].createElement(Text$1, {
        title: localizationObj.SearchResultCountTooltip
      }, searchResultCount, " ", localizationObj.SearchResultCountLabel))), (null != articlesList || undefined != articlesList) && articlesList.length > 0 ? articlesList.map(function (dataItem) {
        if (dataItem.ContentType == 'URL') {
          return /*#__PURE__*/React__default["default"].createElement(ArticleSummary$1, {
            className: "articleCard",
            header: /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(Link$1, {
              title: dataItem.ArticleAbstract,
              href: dataItem.ContentSourceURL,
              target: "_blank"
            }, dataItem.ArticleTitle), /*#__PURE__*/React__default["default"].createElement(Icon$1, {
              name: "open"
            })),
            content: getArticleAbstract(dataItem),
            meta: getMetaData(dataItem)
          });
        } else {
          return /*#__PURE__*/React__default["default"].createElement(ArticleSummary$1, {
            className: "articleCard",
            header: /*#__PURE__*/React__default["default"].createElement(Link$1, {
              title: dataItem.ArticleAbstract,
              onClick: openArticle,
              "data-article-id": dataItem.pyID
            }, dataItem.ArticleTitle),
            content: getArticleAbstract(dataItem),
            meta: getMetaData(dataItem)
          });
        }
      }) : /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null)) : /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, (null != articlesList || undefined != articlesList) && articlesList.length > 0 ? articlesList.map(function (dataItem) {
        if (dataItem.ContentType == 'URL') {
          return /*#__PURE__*/React__default["default"].createElement(ArticleSummary$1, {
            className: "articleCard",
            header: /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(Link$1, {
              title: dataItem.ArticleAbstract,
              href: dataItem.ContentSourceURL,
              target: "_blank"
            }, dataItem.ArticleTitle), /*#__PURE__*/React__default["default"].createElement(Icon$1, {
              name: "open"
            })),
            content: getArticleAbstract(dataItem),
            meta: getMetaData(dataItem)
          });
        } else {
          return /*#__PURE__*/React__default["default"].createElement(ArticleSummary$1, {
            className: "articleCard",
            header: /*#__PURE__*/React__default["default"].createElement(Link$1, {
              title: dataItem.ArticleAbstract,
              onClick: openArticle,
              "data-article-id": dataItem.pyID
            }, dataItem.ArticleTitle),
            content: getArticleAbstract(dataItem),
            meta: getMetaData(dataItem)
          });
        }
      }) : /*#__PURE__*/React__default["default"].createElement(Flex$1, {
        className: "no-content-label"
      }, /*#__PURE__*/React__default["default"].createElement(Label$1, null, localizationObj.NoContentLabel)));
      return articleListHtml;
    };
    var getProfileArray = function getProfileArray(commaSeparatedProfiles) {
      var profileArray = [];
      commaSeparatedProfiles.split(',').forEach(function (profile) {
        profileArray.push({
          primary: profile,
          id: profile,
          selected: false,
          secondary: []
        });
      });
      return profileArray;
    };
    var getArticleListActions = function getArticleListActions() {
      var articleActions = [];
      if (hasRoleSuggestedContent == 'true') {
        articleActions.push({
          text: localizationObj.SuggestArticleLabel,
          id: 'knowledge-menu-item-suggest',
          onClick: suggestArticle
        });
      }
      return articleActions;
    };
    var pushArticleContent = function pushArticleContent(event) {
      //var KMArticleContent = sanitizeHtml(articleParams.ContentSourceAuthored);
      var contentData = {
        articleContent: articleParams.ContentSourceAuthored,
        interactionID: articleListParams.InteractionID
      };
      pega.desktop.support.getDesktopWindow().CSPubSub.publish(articleListParams.InteractionID, 'PUSH ARTICLE CONTENT', contentData);
    };
    var pushArticleLink = function pushArticleLink(event) {
      //let tmpParams = { ...articleListParams };
      var pushData = {
        shareableURL: articleParams.ShareableURL,
        articleTitle: articleParams.ArticleTitle,
        articleAbstract: articleParams.ArticleAbstract,
        leadInText: applicationSettings.KMLeadInText,
        setLeadInText: applicationSettings.SelectLeadinText,
        setShareAbstract: applicationSettings.KMShareAbstract,
        event: event,
        articleID: articleParams.ArticleId,
        interactionID: articleListParams.InteractionID,
        channelType: props.ChannelType
        //"chatID" : articleParams.ChatID
      };

      pega.desktop.support.getDesktopWindow().CSPubSub.publish(articleListParams.InteractionID, 'PUSH ARTICLE LINK', pushData);
    };
    var getArticleDetailActions = function getArticleDetailActions() {
      var articleActions = getArticleListActions();
      articleActions.push({
        text: localizationObj.SubmitFeedbackLabel,
        id: 'knowledge-menu-item-feedback',
        onClick: submitFeedback
      });
      articleActions.push({
        text: localizationObj.ShareArticleLabel,
        id: 'knowledge-menu-item-share',
        onClick: shareArticle
      });
      if (articleParams.ShowPushArticleLink == 'true') {
        articleActions.push({
          text: localizationObj.PushArticleLinkLabel,
          onClick: pushArticleLink
        });
      }
      if (articleParams.ShowPushArticleText == 'true') {
        articleActions.push({
          text: localizationObj.PushArticleContentLabel,
          onClick: pushArticleContent
        });
      }
      return articleActions;
    };
    var filterButton = /*#__PURE__*/React__default["default"].createElement(Button$1, {
      icon: true,
      title: localizationObj.FilterArticlesTooltip
    }, /*#__PURE__*/React__default["default"].createElement(Icon$1, {
      name: "filter",
      onClick: function onClick() {
        setMountPopover(true);
      }
    }));
    React.useEffect(function () {
      var parameterArray = [];
      if (!articleListParams.IsArticleViewed && articleListParams.ArticleId == '') {
        parameterArray.push(new Parameter('KnowledgeProfile', articleListParams.Profile));
        parameterArray.push(new Parameter('CaseID', articleListParams.CaseID));
        parameterArray.push(new Parameter('ActionName', articleListParams.ActionName));
        parameterArray.push(new Parameter('FilteredCategory', articleListParams.FilteredCategory));
        parameterArray.push(new Parameter('ArticleTitle', articleListParams.ArticleTitle));
        parameterArray.push(new Parameter('ArticleBody', articleListParams.ArticleBody));
        parameterArray.push(new Parameter('searchText', articleListParams.searchText));
        parameterArray.push(new Parameter('IsTagSearch', articleListParams.IsTagSearch));
        parameterArray.push(new Parameter('InternalContent', articleListParams.InternalContent));
        parameterArray.push(new Parameter('OperatorKey', articleListParams.OperatorKey));
        parameterArray.push(new Parameter('InteractionID', articleListParams.InteractionID));
        getDataPage(articleListParams.DataPage, setArticleData, parameterArray);
      } else if (articleListParams.IsArticleViewed || articleListParams.ArticleId != '') {
        if (articleListParams.DataPage == props.LikeDataPage) {
          parameterArray.push(new Parameter('ContentId', articleParams.ArticleId));
        } else {
          parameterArray.push(new Parameter('ContentId', articleListParams.ArticleId));
        }
        parameterArray.push(new Parameter('Action', articleListParams.Action));
        parameterArray.push(new Parameter('CoverId', articleParams.CoverId));
        parameterArray.push(new Parameter('ArticleClass', articleParams.ArticleClass));
        parameterArray.push(new Parameter('OperatorKey', articleListParams.OperatorKey));
        parameterArray.push(new Parameter('Rating', articleListParams.Rating));
        parameterArray.push(new Parameter('UserId', articleListParams.OperatorKey.split(' ')[1]));
        articleListParams.CallBackFunction != null ? getDataPage(articleListParams.DataPage, articleListParams.CallBackFunction, parameterArray) : getDataPage(props.ArticleDetailDataPage, setArticleContentData, parameterArray);
      }
    }, [articleListParams]);
    React.useEffect(function () {
      getDataPage('Declare_CAApplicationSettings', initializeApplicationSettings, []);
    }, []);
    React.useEffect(function () {
      pega.desktop.support.getDesktopWindow().CSPubSub.subscribe(props.ContextId, 'SHOW ARTICLE', showSelectedArticle);
      return function () {
        pega.desktop.support.getDesktopWindow().CSPubSub.unsubscribe(props.ContextId, null);
        unsubscribeCSPubSubEvents(props.InteractionID);
      };
    }, []);
    var showSelectedArticle = function showSelectedArticle(id) {
      if (id != null && id != '') {
        var tmpArticleListParams = _objectSpread2({}, articleListParams);
        tmpArticleListParams.IsArticleViewed = true;
        tmpArticleListParams.CallBackFunction = setArticleContentData;
        tmpArticleListParams.DataPage = props.ArticleDetailDataPage;
        tmpArticleListParams.ArticleId = id;
        tmpArticleListParams.showFeedbackMessage = false;
        setArticleListParams(tmpArticleListParams);
        setIsArticleDetailLoading(true);
      }
    };
    var initializeApplicationSettings = function initializeApplicationSettings(response) {
      setApplicationSettings(response);
    };

    /* Header configuration for ArticleList component */
    var ALHeader = {
      headerText: localizationObj.KnowledgeArticles,
      primary: {
        search: /*#__PURE__*/React__default["default"].createElement(SearchInput$1, {
          className: "knowledge-search",
          onSearchSubmit: function onSearchSubmit(value) {
            if (value != '') {
              setSearchTextValue(value);
            }
          },
          searchInputAriaLabel: "Enter a search",
          searchButtonAriaLabel: localizationObj.KnowledgeSearchArticlesLabel,
          clearButtonAriaLabel: "Clear search",
          value: articleListParams.searchText,
          title: localizationObj.ArticleSearchTooltip,
          placeholder: localizationObj.KnowledgeSearchArticlesLabel
        }),
        actions: getArticleListActions().length > 0 ? getArticleListActions() : ''
      },
      secondary: [/*#__PURE__*/React__default["default"].createElement(ComboBox$1, {
        className: "knowledge-combobox",
        title: localizationObj.KnowledgeCategoryTooltip,
        label: localizationObj.KnowledgeCategoryLabel,
        labelHidden: false,
        readonly: false,
        disabled: false,
        placeholder: localizationObj.KnowledgeFilterByCategoryLabel,
        mode: "single-select",
        selected: {
          items: articleListParams.FilteredCategory
        },
        value: selectedCategory,
        onChange: function onChange(ev) {
          setSelectedCategory(ev.target.value);
          var newItems = selectedCategory ? menuHelpers.flatten(categoryList).filter(function (_ref) {
            var primary = _ref.primary;
            return filterRegex.test(primary);
          }) : categoryList;
          if (ev.target.value.length < 1) {
            clearCategoryFilter();
          } else {
            newItems = _toConsumableArray(new Map(newItems.map(function (item) {
              return [item.id, item];
            })).values());
            setCategoryList(newItems);
          }
        },
        menu: {
          items: categoryList,
          onItemClick: function onItemClick(id) {
            var itemText = [];
            for (var i = 0; i < categoryList.length; i++) {
              if (categoryList[i].items == undefined || categoryList[i].items == null) {
                if (categoryList[i].id == id) itemText[0] = categoryList[i];
              } else {
                for (var j = 0; j < categoryList[i].items.length; j++) {
                  if (categoryList[i].items[j].id == id) itemText[0] = categoryList[i].items[j];
                }
              }
            }
            filterResultsByCategory(itemText[0]);
          },
          accent: filterRegex,
          emptyText: 'No Categories'
        }
      })]
    };

    /* Show only filters if search is performed else add sort by component*/
    if (articleListParams.Profile == 'Search') {
      ALHeader.primary.followedFilter = /*#__PURE__*/React__default["default"].createElement(Flex$1, {
        container: {
          itemGap: 0.5
        },
        className: "knowledge-filter-container"
      }, /*#__PURE__*/React__default["default"].createElement("icon", {
        name: "filter"
      }), /*#__PURE__*/React.cloneElement(filterButton, {
        ref: setFilterButtonEl
      }), mountPopover && /*#__PURE__*/React__default["default"].createElement(Popover$1, {
        ref: setPopoverEl,
        target: filterButtonEl,
        style: {
          padding: '1rem',
          maxWidth: '55ch'
        },
        className: "knowledge-filter-popover"
      }, /*#__PURE__*/React__default["default"].createElement(Checkbox, {
        checked: articleListParams.ArticleTitle,
        label: localizationObj.ArticleTitleFilterLabel,
        onClick: filterSearchByArticleTitle
      }), /*#__PURE__*/React__default["default"].createElement(Checkbox, {
        checked: articleListParams.ArticleBody,
        label: localizationObj.ArticleBodyFilterLabel,
        onClick: filterSearchByArticleBody
      }), /*#__PURE__*/React__default["default"].createElement(Label$1, {
        onClick: clearAllSearchFilters
      }, localizationObj.ClearAllSearchFilterLabel)));
    } else {
      ALHeader.secondary.push( /*#__PURE__*/React__default["default"].createElement(FormField$1, {
        label: localizationObj.KnowledgeSortByLabel,
        title: localizationObj.KnowledgeSortByTooltip
      }, /*#__PURE__*/React__default["default"].createElement(ComboBox$1, {
        className: "knowledge-sortby",
        mode: "single-select",
        selected: {
          items: articleListParams.Profile
        },
        value: articleListParams.Profile,
        menu: {
          items: getProfileArray(props.CommaSeparatedProfiles),
          onItemClick: function onItemClick(id) {
            var itemText = getProfileArray(props.CommaSeparatedProfiles).filter(function (item) {
              if (item.id == id) return item;
            });
            changeSortBy(itemText[0]);
          }
        }
      })));
    }
    if (articleListParams.IsArticleViewed != true && articleListParams.ArticleId == '') {
      return /*#__PURE__*/React__default["default"].createElement(DL, {
        id: "CosmosContainerComponent"
      }, /*#__PURE__*/React__default["default"].createElement("div", {
        "class": "ArticleListContainerComponent"
      }, /*#__PURE__*/React__default["default"].createElement(Configuration$1, null, /*#__PURE__*/React__default["default"].createElement(ArticleList$1, {
        skeletonize: isLoading,
        style: {
          minHeight: 'calc(30vh)',
          cursor: 'auto'
        },
        className: "knowledge-article-list",
        header: /*#__PURE__*/React__default["default"].createElement(ArticleListHeader$1, {
          icon: ALHeader.icon,
          headerText: ALHeader.headerText,
          primary: ALHeader.primary,
          secondary: ALHeader.secondary,
          as: Flex
        })
      }, getArticleListHtml()))));
    } else {
      return /*#__PURE__*/React__default["default"].createElement(DL, {
        id: "CosmosContainerComponent"
      }, /*#__PURE__*/React__default["default"].createElement("div", {
        "class": "ArticleListContainerComponent"
      }, /*#__PURE__*/React__default["default"].createElement(Configuration$1, null, /*#__PURE__*/React__default["default"].createElement(Flex$1, {
        style: {
          maxHeight: 'calc(100vh - 14px)',
          cursor: 'auto'
        }
      }, /*#__PURE__*/React__default["default"].createElement(Article$1, {
        className: "articleDetail",
        navigation: /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(Link$1, {
          title: articleViewHistory[articleViewHistory.length - 1].title,
          onClick: onBackToArticlesClick
        }, /*#__PURE__*/React__default["default"].createElement(Flex$1, {
          container: {
            itemGap: 0.5
          },
          alignItems: "center",
          itemGap: "7px"
        }, /*#__PURE__*/React__default["default"].createElement(Icon$1, {
          name: "caret-left"
        }), /*#__PURE__*/React__default["default"].createElement(Text$1, {
          className: "backtoarticles"
        }, articleViewHistory[articleViewHistory.length - 1].title)))),
        primaryActions: /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, articleParams.IsArticleFollowed == 'true' ? /*#__PURE__*/React__default["default"].createElement(Button$1, {
          variant: "simple",
          title: localizationObj.UnfollowTooltip,
          icon: true,
          onClick: function onClick() {
            return handleArticleFavToggle('unfollow');
          }
        }, /*#__PURE__*/React__default["default"].createElement(Icon$1, {
          name: "star-solid"
        })) : /*#__PURE__*/React__default["default"].createElement(Button$1, {
          variant: "simple",
          title: localizationObj.FollowTooltip,
          icon: true,
          onClick: function onClick() {
            return handleArticleFavToggle('follow');
          }
        }, /*#__PURE__*/React__default["default"].createElement(Icon$1, {
          name: "star"
        })), /*#__PURE__*/React__default["default"].createElement(Button$1, {
          variant: "simple",
          icon: true,
          onClick: function onClick(event) {
            return popOutArticle(event);
          },
          title: localizationObj.PopoutArticleTooltip
        }, /*#__PURE__*/React__default["default"].createElement(Icon$1, {
          name: "open"
        }))),
        secondaryActions: getArticleDetailActions(),
        content: getArticleContent(),
        skeletonize: isArticleDetailLoading,
        title: articleParams.ArticleTitle,
        meta: getArticleDetailMetaData(),
        footer: /*#__PURE__*/React__default["default"].createElement(ArticleFooter$1, {
          content: /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, !articleListParams.showFeedbackMessage ? /*#__PURE__*/React__default["default"].createElement(Flex$1, {
            container: {
              itemGap: 0.5
            },
            itemGap: "7px"
          }, /*#__PURE__*/React__default["default"].createElement(Text$1, {
            className: "knowledge-detail-footer-rating-message"
          }, localizationObj.KnowledgeRatingLabel, " ?"), articleParams.CurrentRating < '3' || articleParams.CurrentRating == undefined ? /*#__PURE__*/React__default["default"].createElement(Button$1, {
            onClick: function onClick() {
              return handleArticleLikeToggle('5');
            },
            title: localizationObj.ArticleHelpfulTooltip
          }, localizationObj.ArticleHelpfulLabel) : /*#__PURE__*/React__default["default"].createElement(Button$1, {
            onClick: function onClick() {
              return handleArticleLikeToggle('0');
            },
            variant: "primary",
            title: localizationObj.ArticleWasHelpfulTooltip
          }, ' ', localizationObj.ArticleHelpfulLabel), articleParams.CurrentRating >= '3' || articleParams.CurrentRating < '1' || articleParams.CurrentRating == undefined ? /*#__PURE__*/React__default["default"].createElement(Button$1, {
            onClick: function onClick() {
              return handleArticleLikeToggle('1');
            },
            title: localizationObj.ArticleNotHelpfulTooltip
          }, localizationObj.ArticleNotHelpfulLabel) : /*#__PURE__*/React__default["default"].createElement(Button$1, {
            onClick: function onClick() {
              return handleArticleLikeToggle('0');
            },
            variant: "primary",
            title: localizationObj.ArticleWasNotHelpfulTooltip
          }, localizationObj.ArticleNotHelpfulLabel)) : /*#__PURE__*/React__default["default"].createElement(Flex$1, {
            container: {
              itemGap: 0.5
            }
          }, /*#__PURE__*/React__default["default"].createElement(Text$1, {
            className: "knowledge-detail-footer-rating-message"
          }, localizationObj.RatingMessage)), /*#__PURE__*/React__default["default"].createElement(Flex$1, {
            container: {
              direction: 'column'
            },
            className: "knowledge-attachments"
          }, articleParams.KMContentAttachmentList.map(function (dataItem) {
            if (dataItem.pyCategory == 'URL') {
              return /*#__PURE__*/React__default["default"].createElement(Link$1, {
                title: dataItem.pyMemo,
                onClick: function onClick(event) {
                  return openReferencedArticle(event, dataItem);
                }
              }, /*#__PURE__*/React__default["default"].createElement(Icon$1, {
                name: "open"
              }), dataItem.pyMemo);
            } else {
              return /*#__PURE__*/React__default["default"].createElement(Link$1, {
                title: dataItem.pyMemo,
                onClick: function onClick(event) {
                  return openReferencedArticle(event, dataItem);
                }
              }, dataItem.pyMemo);
            }
          }), articleParams.KMReferencedArticleList != undefined ? articleParams.KMReferencedArticleList.map(function (dataItem) {
            return /*#__PURE__*/React__default["default"].createElement(Link$1, {
              title: dataItem.ArticleTitle,
              onClick: function onClick(event) {
                return openReferencedArticle(event, dataItem);
              }
            }, dataItem.ArticleTitle);
          }) : /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null))),
          tags: articleParams.KMAssociatedTags,
          onTagClick: function onTagClick(id) {
            onArticleTagClick(id);
          }
        })
      })))));
    }
  }

  return KM;

}));
//static-content-hash-trigger-GCC
