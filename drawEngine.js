'use strict';
// handles processing input and events and informing current draw mode
// and some drawing, I guess?
// TODO:
//    -mode notification of change!

var DrawEngine =
{
   // --------------------------------------------------------------------------
   // config:
   //    inputCanvas : a canvas element to watch for input events
   //    drawLineFunction : callable for when a line is to be drawn
   //    renderCursorGraphics : callable to render cursor related graphics
   //    drawOutputGraphics: callable for outputting final graphics
   //    cursorMoveCallback: callable for when cursor (mouse) is moved
   //    coordsTranslation: translation applied to all coordinates from cursor engine
   DrawEngine:function(config)
   {
      this.drawModesFactory =
      {
         freeform:function(drawEngine)  { return new DrawModeContinuous.DrawModeContinuous(drawEngine) },
         lines:function(drawEngine)     { return new DrawModeLines.DrawModeLines(drawEngine) },
         circles:function(drawEngine)   { return new DrawModeCircles.DrawModeCircles(drawEngine) },
         erase:function(drawEngine)     { return new DrawModeErase.DrawModeErase(drawEngine) },
      }

      // --- properties ---
      // note that mouse coordinates are kept in element space
      this.mouseCoords = new fnc2d.Point(0, 0)
      // but cursorCoords are kept with translation (see config) applied
      this.cursorCoords = new fnc2d.Point(0, 0)
      this.mouseButtonDown = false
      this.isRightMB = false;  // TODO:  better name
      this.isMouseOver = false

      this.currentDrawMode = null

      this.inputCanvas = config.inputCanvas
      this.draw_Line = config.drawLineFunction
      this.drawOutputGraphics = config.drawOutputGraphics
      this.cursorMoveCallback = config.cursorMoveCallback
      this.renderCursorGraphics = config.renderCursorGraphics
      this.translation = config.coordsTranslation

      // -----------------------------------------------------------------------
      this.getCursorCoords = function()
      {
         return new fnc2d.Point(this.cursorCoords)
      }
      // -----------------------------------------------------------------------
      this.getMouseCoords = function()
      {
         return new fnc2d.Point(this.mouseCoords)
      }

      // -----------------------------------------------------------------------
      // speed tracking
      this.currentSpeed = 0  // pixels/second
      this.speedTrackRate = 15 // updates per second
      this.lastMouseCoords = new fnc2d.Point(0,0)
      this.lastTime = new Date().getTime()
      this.lastSpeed = 0
      this.currentSpeed = 0

      this.speeds = []
      this.numSpeeds = 15
      let i = 0
      for (i = 0; i < this.numSpeeds; i += 1)
      {
         this.speeds.push(0)
      }

      // -----------------------------------------------------------------------
      this.calcSpeed = function()
      {
         let currentPoint = this.getMouseCoords()
         let currentTime = new Date().getTime()

         let delta = this.lastMouseCoords.delta(currentPoint)

         let distance = delta.length()
         let elapsedSec = (currentTime - this.lastTime) / 1000

         let speed = (distance / elapsedSec)

         this.currentSpeed = (speed + this.lastSpeed) / 2
         this.lastSpeed = speed

         this.lastTime = currentTime
         this.lastMouseCoords = currentPoint

         this.speeds.splice(0,1)
         this.speeds.push(speed / this.numSpeeds)
         let average = 0
         this.speeds.forEach( function(currentSpeed) {
            average += currentSpeed
         })
         this.currentSpeed = average

         debugDiv.add('speed', `cur spd:${this.currentSpeed}`)

         setTimeout(this.calcSpeed.bind(this), 1000 / this.speedTrackRate)
      }

      // -----------------------------------------------------------------------
      this.getCursorGraphics = function()
      {
         let cursorCommands = [] //[GraphicsCommands.clear()]

         if (this.isMouseOver)
         {
            // draw circle at current cursor coordinates
            cursorCommands.push(GraphicsCommands.circle(this.cursorCoords.x, this.cursorCoords.y, 3))

            // add current draw mode output
            let drawModeCursorCommands = this.currentDrawMode.getCursorGraphics()
            cursorCommands = cursorCommands.concat(drawModeCursorCommands)
         }

         return cursorCommands
      }

      // -----------------------------------------------------------------------
      // called when cursor engine moves the cursor
      this.onCursorMove = function(cursorCoords)
      {
         this.cursorCoords = new fnc2d.Point(cursorCoords).translateEq(this.translation)

         this.currentDrawMode.onCursorMove()

         this.cursorMoveCallback(this.cursorCoords)
      }

      let ceConfig = { cursorMoveCallback:this.onCursorMove.bind(this),
                        getMouseSpeedFunc:function(){ return this.currentSpeed}.bind(this), }
      this.cursorEngine = new CursorEngine.CursorEngine(ceConfig)

      // -----------------------------------------------------------------------
      // --- handlers ---
      this.onMouseDown = function(event)
      {
         // console.log(`drawEngine.onMouseDown() mode:${this.currentDrawMode.name}`)
         this.mouseButtonDown = true

         if ("which" in event)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
            this.isRightMouseButton = event.which == 3;
         else if ("button" in event)  // IE, Opera
            this.isRightMouseButton = event.button == 2;

         this.currentDrawMode.onMouseDown(event)
      }
      this.onMouseUp = function(event)
      {
         // console.log(`drawEngine.onMouseUp() mode:${this.currentDrawMode.name}`)
         this.mouseButtonDown = false

         this.currentDrawMode.onMouseUp(event)

         this.renderCursorGraphics()
      }
      this.onMouseMove = function(event)
      {
         this.mouseCoords = new fnc2d.Point(getRelativeCoordinates(event, this.inputCanvas)).floorEq()

         this.cursorEngine.setTargetPoint(this.mouseCoords)
      }

      // -----------------------------------------------------------------------
      this.onMouseEnter = function()
      {
         this.isMouseOver = true
      }

      // -----------------------------------------------------------------------
      this.onMouseOut = function()
      {
         this.mouseButtonDown = false

         if (this.currentDrawMode.hasOwnProperty('onMouseOut'))
         {
            this.currentDrawMode.onMouseOut()
         }

         this.isMouseOver = false
         this.renderCursorGraphics()
      }

      // -----------------------------------------------------------------------
      this.setDrawMode = function(modeName)
      {
         if (this.drawModesFactory.hasOwnProperty(modeName))
         {
            if (null != this.currentDrawMode)
            {
               this.currentDrawMode.End()
            }
            this.currentDrawMode = this.drawModesFactory[modeName](this)

            this.cursorEngine.enableSmoothing(this.currentDrawMode.hasOwnProperty('smoothCursor'))

            this.currentDrawMode.Start()
         }
         else
         {
            console.log(`invalid draw mode name: ${modeName}`)
         }
      }

      this.inputCanvas.addEventListener("mousedown", this.onMouseDown.bind(this))
      this.inputCanvas.addEventListener("mouseup", this.onMouseUp.bind(this))
      this.inputCanvas.addEventListener("mousemove", this.onMouseMove.bind(this))
      this.inputCanvas.addEventListener("mouseenter", this.onMouseEnter.bind(this))
      this.inputCanvas.addEventListener("mouseout", this.onMouseOut.bind(this))
      this.setDrawMode('freeform')

      setTimeout(this.calcSpeed.bind(this), 1000 / this.speedTrackRate)
   }

}
