var DrawModeContinuous =
{
   DrawModeContinuous:function(drawEngine)
   {
      this.name = 'freeform'
      this.drawEngine = drawEngine

      this.lastLineStart = null

      this.onMouseMove = function(event)
      {
         if (this.drawEngine.mouseButtonDown)
         {
            const minDelta = 3
            // has mouse gone far enough to generate another line?
            currentPoint = this.drawEngine.mouseCoords

            var xDiff = currentPoint.x - this.lastLineStart.x
            var yDiff = currentPoint.y - this.lastLineStart.y
            var delta = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff))

            if (delta >= minDelta)
            {
               gCommands = []
               gCommands.push( GraphicsCommands.setDrawParameter('strokeStyle', '#000000'))
               gCommands.push( GraphicsCommands.line(this.lastLineStart, currentPoint) )
               this.drawEngine.drawOutputGraphics(gCommands)
               this.lastLineStart = currentPoint
            }
         }
      }.bind(this)

      this.onMouseUp = function(event)
      {
      }.bind(this)

      this.onMouseDown = function(event)
      {
         // begin new stroke
         this.lastLineStart = this.drawEngine.mouseCoords   // this betta be write only

      }.bind(this)

      // -------------------------------------------------
      this.Start = function()
      {}
      this.End = function()
      {}
   }
}
