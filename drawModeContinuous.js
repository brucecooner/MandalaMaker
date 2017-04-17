;'use strict;'

var DrawModeContinuous =
{
   DrawModeContinuous:function(drawEngine)
   {
      this.name = 'freeform'
      this.drawEngine = drawEngine

      this.lastLineStart = null

      this.currentStrokeLines = null

      this.strokeLineCounter = 0

      // -----------------------------------------------------------------------
      this.onCursorMove = function()
      {
         if (this.drawEngine.mouseButtonDown)
         {
            const minDelta = 2
            // has mouse gone far enough to generate another line?
            // console.log(`dmc onCursorMove currentPoint:${currentPoint.x},${currentPoint.y}`)

            cursorCoords = this.drawEngine.getCursorCoords()

            var delta = cursorCoords.delta(this.lastLineStart).length();

            if (delta >= minDelta)
            {
               this.currentStrokeLines.push( GraphicsCommands.line(new fnc2d.Point(this.lastLineStart), new fnc2d.Point(this.drawEngine.cursorCoords)))

               this.lastLineStart.set(this.drawEngine.cursorCoords)
            }
         }
      }

      this.aveSpeedIntervalId = 0

      // -----------------------------------------------------------------------
      this.onMouseUp = function(event)
      {
         this.drawEngine.drawOutputGraphics(this.currentStrokeLines)

         this.currentStrokeLines = null
      }

      // -----------------------------------------------------------------------
      this.onMouseDown = function(event)
      {
         // begin new stroke
         this.lastLineStart = new fnc2d.Point(this.drawEngine.cursorCoords)

         // start new stroke
         this.currentStrokeLines = []
      }


      // -------------------------------------------------
      this.Start = function()
      {
      }
      this.End = function()
      {
      }

      // -----------------------------------------------------------------------
      this.getCursorGraphics = function()
      {
         let commands = []
         if (null !== this.currentStrokeLines)
         {
            // TODO : cursor color controlled by draw mode? Hmmm... maybe
            commands = this.currentStrokeLines
         }
         return commands
       }

       this.smoothCursor = true
   }
}
