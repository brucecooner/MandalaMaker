// handles processing input and events and informing current draw mode
// and some drawing, I guess?
// TODO: add like, color and shit?
var DrawEngine =
{
   // --------------------------------------------------------------------------
   // config:
   //    inputCanvas : a canvas element to watch for input events
   //    drawLineFunction : callable for when a line is to be drawn
   //    drawCursorLineFunction:callable for drawing a 'cursor' line helper
   DrawEngine:function(config)
   {
      // consts
      this.drawModes =
      {
         continuous:new DrawModeContinuous.DrawModeContinuous(this),
         lines:new DrawModeLines.DrawModeLines(this),
      }

      // --- properties ---
      this.mouseCoords = { x:0, y:0 }
      this.mouseButtonDown = false
      this.inputCanvas = config.inputCanvas,
      // this.currentDrawMode = this.drawModes['continuous'],
      this.currentDrawMode = this.drawModes['lines']
      this.draw_Line = config.drawLineFunction

      this.draw_Cursor_Line = config.drawCursorLineFunction

      // --- handlers ---
      onMouseDown = function(event)
      {
         // console.log(`drawEngine.onMouseDown() mode:${this.currentDrawMode.name}`)
         this.mouseButtonDown = true

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

      this.inputCanvas.addEventListener("mousedown", onMouseDown.bind(this))
      this.inputCanvas.addEventListener("mouseup", onMouseUp.bind(this))
      this.inputCanvas.addEventListener("mousemove", onMouseMove.bind(this))
   }

}
