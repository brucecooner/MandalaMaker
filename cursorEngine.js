'use strict';

var CursorEngine = {
   // config : {  cursorMoveCallback:func(point),
   //             getMouseSpeedFunc:func():number},
   CursorEngine:function(config) {
      // set from outisde, expected in pixels/second
      this.getMouseSpeed = config.getMouseSpeedFunc;

      // -----------------------------------------------------------------------
      this.advanceNoSmooth = function() {
         this.currentPoint.set(this.targetPoint);

         clearInterval(this.tickIntervalFunc);
         this.tickIntervalFunc = null;
      }
      // -----------------------------------------------------------------------
      this.advanceByScale = function() {
         let mouseSpeed = this.getMouseSpeed();
         // three speed seems to work pretty well
         let factor = 1.0
         if (mouseSpeed <= 50) {
            factor = 0.25;
         }
         else if (mouseSpeed <=100) {
            factor = 0.45;
         }

         debugDiv.add('cursorBlend', `blend:${factor}`);

         let currentDelta = this.currentPoint.delta(this.targetPoint);

         if (currentDelta.length() < 1) {
            this.currentPoint.set(this.targetPoint);
            clearInterval(this.tickIntervalFunc);
            this.tickIntervalFunc = null;
         }
         else {
            this.currentPoint.translateEq(currentDelta.scale(factor).p2);
         }
      }

      this.cursorMoveCallback = config.cursorMoveCallback;

      this.currentPoint = null;
      this.targetPoint = null;

      this.tickIntervalFunc = null;

      // -----------------------------------------------------------------------
      this.enableSmoothing = function(enabled) {
         if (enabled) {
            this.advanceFunc = this.advanceByScale;
         }
         else {
            this.advanceFunc = this.advanceNoSmooth;
         }
      }

      // -----------------------------------------------------------------------
      this.tick = function() {
         this.advanceFunc();

         if ( this.cursorMoveCallback ) {
            this.cursorMoveCallback(this.currentPoint);
         }
      }

      // -----------------------------------------------------------------------
      this.setTargetPoint = function(point) {
         // just starting? move directly to point
         if (null == this.targetPoint) {
            this.targetPoint = new fnc2d.Point(point);
            this.currentPoint = new fnc2d.Point(point);
         }
         else {
            this.targetPoint.set(point);

            if (null == this.tickIntervalFunc) {
               this.tickIntervalFunc = setInterval(this.tick.bind(this), 1000 / 60);
            }
         }
      }

      this.enableSmoothing(false);
   }
}
