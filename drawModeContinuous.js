var DrawModeContinuous =
{
   DrawModeContinuous:function(drawEngine)
   {
      this.name = 'freeform'
      this.drawEngine = drawEngine

      this.lastLineStart = {}

      this.onMouseMove = function()
      {
         if (this.drawEngine.mouseButtonDown)
         {
            const minDelta = 3
            // has mouse gone far enough to generate another line?
            currentPoint = this.drawEngine.cursorCoords // this.drawEngine.mouseCoords

            var xDiff = currentPoint.x - this.lastLineStart.x
            var yDiff = currentPoint.y - this.lastLineStart.y
            var delta = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff))

            if (delta >= minDelta)
            {
               gCommands = []
               //console.log(`draw ${this.lastLineStart.x},${this.lastLineStart.y} to ${currentPoint.x},${currentPoint.y}`)
               gCommands.push( GraphicsCommands.setDrawParameter('strokeStyle', '#000000'))
               gCommands.push( GraphicsCommands.line(this.lastLineStart, currentPoint) )
               this.drawEngine.drawOutputGraphics(gCommands)

               Object.assign(this.lastLineStart, currentPoint)
            }
         }
      }.bind(this)

      this.onMouseUp = function(event)
      {
      }.bind(this)

      this.onMouseDown = function(event)
      {
         // begin new stroke
         //this.lastLineStart = this.drawEngine.mouseCoords   // this betta be write only
         Object.assign(this.lastLineStart, this.drawEngine.cursorCoords)
         console.log('start draw')

      }.bind(this)

      // -------------------------------------------------
      this.Start = function()
      {}
      this.End = function()
      {}
   }
}
