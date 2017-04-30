'use strict;'

var docVisible = {

   isHidden:false,

   visChangeCallback:null,

   // --------------------------------------------------------------------------
   // init, can optionally receive a callback called when vis. changes, should
   // receive isVisible flag
   initVisibilityHandling:function() {
      var hidden, visibilityState, visibilityChange;

      if (arguments.length)
      {
         // TODO : type check wouldn't hurt here
         docVisible.visChangeCallback = arguments[0];
      }

      if (typeof document.hidden !== "undefined") {
         hidden = "hidden", visibilityChange = "visibilitychange", visibilityState = "visibilityState";
      }
      else if (typeof document.msHidden !== "undefined") {
         hidden = "msHidden", visibilityChange = "msvisibilitychange", visibilityState = "msVisibilityState";
      }

      document.addEventListener(visibilityChange, function()
      {
         if (docVisible.isHidden != document[hidden]) {
            if (document[hidden]) {
               // Document hidden
               // console.log('docVisible.hidden')
            }
            else {
               // Document shown
               // console.log('docVisible.shown')
            }

            docVisible.isHidden = document[hidden];

            if (null!== docVisible.visChangeCallback) {
               // note that callback expects VISIBLE, so negate
               docVisible.visChangeCallback(!document[hidden])
            }
         }
      });
   },
}
