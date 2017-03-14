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
   //    drawCursorGraphics: callable for outputting cursor related graphics
   //    drawOutputGraphics: callable for outputting final graphics
   DrawEngine:function(config)
   {
      // consts
      this.drawModesFactory =
      {
         freeform:function(drawEngine)  { return new DrawModeContinuous.DrawModeContinuous(drawEngine) },
         lines:function(drawEngine)     { return new DrawModeLines.DrawModeLines(drawEngine) },
      }

      // --- properties ---
      this.mouseCoords = { x:0, y:0 }
      this.mouseButtonDown = false
      this.isRightMB = false  // TODO:  better name

      this.currentDrawMode = null

      this.inputCanvas = config.inputCanvas
      this.draw_Line = config.drawLineFunction
      this.drawCursorGraphics = config.drawCursorGraphics
      this.drawOutputGraphics = config.drawOutputGraphics

      // --- handlers ---
      onMouseDown = function(event)
      {
         // console.log(`drawEngine.onMouseDown() mode:${this.currentDrawMode.name}`)
         this.mouseButtonDown = true

         if ("which" in event)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
            this.isRightMouseButton = event.which == 3;
         else if ("button" in event)  // IE, Opera
            this.isRightMouseButton = event.button == 2;

         this.currentDrawMode.onMouseDown(event)
      }
      onMouseUp = function(event)
      {
         // console.log(`drawEngine.onMouseUp() mode:${this.currentDrawMode.name}`)
         this.mouseButtonDown = false

         this.currentDrawMode.onMouseUp(event)
      }
      onMouseMove = function(event)
      {
         this.mouseCoords = getRelativeCoordinates(event, this.inputCanvas)
         // console.log(`drawEngine.onMouseMove() mode:${this.currentDrawMode.name}`)
         // console.log(`(${this.mouseCoords.x},${this.mouseCoords.y})`)

         this.currentDrawMode.onMouseMove(event)
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
            this.currentDrawMode.Start()
         }
         else
         {
            console.log(`invalid draw mode name: ${modeName}`)
         }
      }

      this.inputCanvas.addEventListener("mousedown", onMouseDown.bind(this))
      this.inputCanvas.addEventListener("mouseup", onMouseUp.bind(this))
      this.inputCanvas.addEventListener("mousemove", onMouseMove.bind(this))
      this.setDrawMode('freeform')
   }

}
