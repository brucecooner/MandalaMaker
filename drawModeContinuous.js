var DrawModeContinuous =
{
   DrawModeContinuous:function(drawEngine)
   {
      this.name = 'freeform'
      this.drawEngine = drawEngine

      this.lastLineStart = null

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
               gCommands = []
               gCommands.push( GraphicsCommands.setDrawParameter('strokeStyle', '#000000'))
               gCommands.push( GraphicsCommands.line(this.lastLineStart, this.drawEngine.cursorCoords) )
               this.drawEngine.drawOutputGraphics(gCommands)

               this.lastLineStart.set(this.drawEngine.cursorCoords)
            }
         }
      }.bind(this)

      // -----------------------------------------------------------------------
      this.onMouseUp = function(event)
      {
      }.bind(this)

      // -----------------------------------------------------------------------
      this.onMouseDown = function(event)
      {
         // begin new stroke
         this.lastLineStart = new fnc2d.Point(this.drawEngine.cursorCoords)

      }.bind(this)

      // -------------------------------------------------
      this.Start = function()
      {}
      this.End = function()
      {}

      // -----------------------------------------------------------------------
      this.getCursorGraphics = function()
      { return [] }
   }
}
