export function browser() {

  const browserNameWrapper = {};

  // Opera 8.0+
  browserNameWrapper.isOpera = (!!window.opr && !!browserNameWrapper.opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

  // Firefox 1.0+
  browserNameWrapper.isFirefox = typeof InstallTrigger !== 'undefined';

  // Safari 3.0+ "[object HTMLElementConstructor]" 
  browserNameWrapper.isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && browserNameWrapper.safari.pushNotification));

  // Internet Explorer 6-11
  browserNameWrapper.isIE = /*@cc_on!@*/false || !!document.documentMode;

  // Edge 20+
  browserNameWrapper.isEdge = !browserNameWrapper.isIE && !!window.StyleMedia;

  // Chrome 1+
  browserNameWrapper.isChrome = !!window.chrome && !!window.chrome.webstore;

  // Blink engine detection
  browserNameWrapper.isBlink = (browserNameWrapper.isChrome || browserNameWrapper.isOpera) && !!window.CSS;

  return browserNameWrapper;
}