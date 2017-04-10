;'use strict;'

var DrawModeContinuous =
{
   DrawModeContinuous:function(drawEngine)
   {
      this.name = 'freeform'
      this.drawEngine = drawEngine

      this.lastLineStart = null

      this.currentStrokeLines = null

      // -----------------------------------------------------------------------
      this.onCursorMove = function()
      {
         if (this.drawEngine.mouseButtonDown)
         {
            const minDelta = 3
            // has mouse gone far enough to generate another line?
            // console.log(`dmc onCursorMove currentPoint:${currentPoint.x},${currentPoint.y}`)

            var delta = this.drawEngine.cursorCoords.delta(this.lastLineStart).length();

            if (delta >= minDelta)
            {
               this.currentStrokeLines.push( GraphicsCommands.line(new fnc2d.Point(this.lastLineStart), new fnc2d.Point(this.drawEngine.cursorCoords)))

               this.lastLineStart.set(this.drawEngine.cursorCoords)
            }
         }
      }.bind(this)

      // -----------------------------------------------------------------------
      this.onMouseUp = function(event)
      {
         // TODO : output color should not really be the concern of the draw mode
         let drawCommands = [ GraphicsCommands.setDrawParameter('strokeStyle', '#000000')].concat(this.currentStrokeLines)

         this.drawEngine.drawOutputGraphics(drawCommands)

         this.currentStrokeLines = null
      }.bind(this)

      // -----------------------------------------------------------------------
      this.onMouseDown = function(event)
      {
         // begin new stroke
         this.lastLineStart = new fnc2d.Point(this.drawEngine.cursorCoords)

         // start new stroke
         this.currentStrokeLines = []

      }.bind(this)

      // -------------------------------------------------
      this.Start = function()
      {}
      this.End = function()
      {}

      // -----------------------------------------------------------------------
      this.getCursorGraphics = function()
      {
         let commands = []
         if (null !== this.currentStrokeLines)
         {
            // TODO : cursor color controlled by draw mode? Hmmm... maybe
            commands = [ GraphicsCommands.setDrawParameter('strokeStyle', '#555555')].concat(this.currentStrokeLines)
         }
         return commands
       }
   }
}
