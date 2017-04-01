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
   //    cursorMoveCallback: callable for when cursor (mouse) is moved
   DrawEngine:function(config)
   {
      // consts
      this.drawModesFactory =
      {
         freeform:function(drawEngine)  { return new DrawModeContinuous.DrawModeContinuous(drawEngine) },
         lines:function(drawEngine)     { return new DrawModeLines.DrawModeLines(drawEngine) },
         circles:function(drawEngine)   { return new DrawModeCircles.DrawModeCircles(drawEngine) },
         erase:function(drawEngine)     { return new DrawModeErase.DrawModeErase(drawEngine) },
      }

      // --- properties ---
      this.mouseCoords = { x:0, y:0 }
      this.cursorCoords = {x:0, y:0 }
      this.mouseButtonDown = false
      this.isRightMB = false  // TODO:  better name

      this.currentDrawMode = null

      this.inputCanvas = config.inputCanvas
      this.draw_Line = config.drawLineFunction
      this.drawCursorGraphics = config.drawCursorGraphics
      this.drawOutputGraphics = config.drawOutputGraphics
      this.cursorMoveCallback = config.cursorMoveCallback

      // -----------------------------------------------------------------------
      this.onCursorMove = function(cursorCoords)
      {
         Object.assign(this.cursorCoords, cursorCoords)

         cursorCommands = [GraphicsCommands.clear()]
         circleCommand = GraphicsCommands.circle(this.cursorCoords.x, this.cursorCoords.y, 3)
         cursorCommands.push(circleCommand)

         this.drawCursorGraphics(cursorCommands)

         // TODO : change to more general tick
         this.currentDrawMode.onMouseMove()

         this.cursorMoveCallback()
      }

      ceConfig = { cursorMoveCallback:this.onCursorMove.bind(this) }
      this.cursorEngine = new CursorEngine.CursorEngine(ceConfig)

      // -----------------------------------------------------------------------
      /*
      this.cursorInterval = 0
      this.advanceCursor = function()
      {
         //console.log(`adv. cursor`)
         // cursor is always playing catch up to mouse coords
         currentDeltaDistance = distanceBetweenPoints( this.mouseCoords, this.cursorCoords )
         if (currentDeltaDistance < 1)
         {
            //this.cursorCoords = this.mouseCoords
            Object.assign(this.cursorCoords, this.mouseCoords)
            clearInterval(this.cursorInterval)
            this.cursorInterval = 0
            // console.log(`adv. cursor DONE`)
         }
         else
         {
            currentDelta = delta( this.cursorCoords, this.mouseCoords )
            factor = 0.75

            this.cursorCoords.x += currentDelta.x * factor
            this.cursorCoords.y += currentDelta.y * factor
         }

         // TODO: fix magic number
         cursorCommands = [GraphicsCommands.clear()]
         circleCommand = GraphicsCommands.circle(this.cursorCoords.x, this.cursorCoords.y, 3)

         cursorCommands.push(circleCommand)

         this.drawCursorGraphics(cursorCommands)

         // handle draw mode
         this.currentDrawMode.onMouseMove()

         this.cursorMoveCallback()

      }.bind(this)
      */

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

         this.cursorEngine.setTargetPoint(this.mouseCoords)
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

      // -----------------------------------------------------------------------
      this.onCursorMove = function()
      {

      }

      // -----------------------------------------------------------------------
      // convenience func, builds commands to draw pointer at specified point
      // receives: point:{x,y}, width:number
      //  returns: [ GraphicsCommand, ...]
      this.crossAt = function(point, halfWidth)
      {
         commands = []

         commands.push( GraphicsCommands.line( {x:point.x, y:point.y - halfWidth},
                                                {x:point.x, y:point.y + halfWidth}))
         commands.push( GraphicsCommands.line( {x:point.x - halfWidth, y:point.y},
                                                {x:point.x + halfWidth, y:point.y}))
         return commands
      }

      this.inputCanvas.addEventListener("mousedown", onMouseDown.bind(this))
      this.inputCanvas.addEventListener("mouseup", onMouseUp.bind(this))
      this.inputCanvas.addEventListener("mousemove", onMouseMove.bind(this))
      this.setDrawMode('freeform')
   }

}
