var isIE = /*@cc_on!@*/false || !!document.documentMode;
if (isIE){
  console.log('Hello IE :(');
  //add custom event for IE
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
  }
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
}

function bindEvent(element, eventName, eventHandler) {
  if (element.addEventListener){
    element.addEventListener(eventName, eventHandler, false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + eventName, eventHandler);
  }
}

//Listen to message from child window
bindEvent(window, 'message', function (e) {
  console.log(e);
  if (!e.data){
    return;
  }

  console.log('Event received');
  window.dispatchEvent(new window.CustomEvent('updateFilter-event', {detail: e.data}));
});