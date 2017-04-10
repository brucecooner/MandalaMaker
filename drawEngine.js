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
   //    commitDrawStroke: callable for when a draw stroke is complete
   DrawEngine:function(config)
   {
      // consts
      // TODO:it's overkill to recreate these, create once and reuse
      this.drawModesFactory =
      {
         freeform:function(drawEngine)  { return new DrawModeContinuous.DrawModeContinuous(drawEngine) },
         lines:function(drawEngine)     { return new DrawModeLines.DrawModeLines(drawEngine) },
         circles:function(drawEngine)   { return new DrawModeCircles.DrawModeCircles(drawEngine) },
         erase:function(drawEngine)     { return new DrawModeErase.DrawModeErase(drawEngine) },
      }

      // --- properties ---
      this.mouseCoords = new fnc2d.Point(0, 0)
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
      this.commitDrawStroke = config.commitDrawStroke

      // -----------------------------------------------------------------------
      this.getCursorGraphics = function()
      {
         cursorCommands = [GraphicsCommands.clear()]

         if (this.isMouseOver)
         {
            // draw circle at current cursor coordinates
            cursorCommands.push(GraphicsCommands.circle(this.cursorCoords.x, this.cursorCoords.y, 3))

            // add current draw mode output
            drawModeCursorCommands = this.currentDrawMode.getCursorGraphics()
            cursorCommands = cursorCommands.concat(drawModeCursorCommands)
         }

         return cursorCommands
      }

      // -----------------------------------------------------------------------
      // called when cursor engine moves the cursor
      this.onCursorMove = function(cursorCoords)
      {
         Object.assign(this.cursorCoords, cursorCoords)
         // console.log(`de cur move to ${this.cursorCoords.x},${this.cursorCoords.y}`)

         this.currentDrawMode.onCursorMove()

         this.cursorMoveCallback(this.cursorCoords)
      }

      ceConfig = { cursorMoveCallback:this.onCursorMove.bind(this) }
      this.cursorEngine = new CursorEngine.CursorEngine(ceConfig)

      // -----------------------------------------------------------------------
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

         this.renderCursorGraphics()
      }
      onMouseMove = function(event)
      {
         this.mouseCoords = new fnc2d.Point(getRelativeCoordinates(event, this.inputCanvas))

         this.cursorEngine.setTargetPoint(this.mouseCoords)
      }

      // -----------------------------------------------------------------------
      onMouseEnter = function()
      {
         this.isMouseOver = true
      }

      // -----------------------------------------------------------------------
      onMouseOut = function()
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
      this.inputCanvas.addEventListener("mouseenter", onMouseEnter.bind(this))
      this.inputCanvas.addEventListener("mouseout", onMouseOut.bind(this))
      this.setDrawMode('freeform')
   }

}
