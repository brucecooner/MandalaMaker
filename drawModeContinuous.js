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
               // console.log(`line to ${currentPoint.x},${currentPoint.y}`)
               this.drawEngine.drawOutputGraphics( [ GraphicsCommands.line(this.lastLineStart, currentPoint) ])
               this.lastLineStart = currentPoint
            }
         }
      }.bind(this)

      this.onMouseUp = function(event)
      {
         console.log(`${this.name} - onMouseUp()`)
      }.bind(this)

      this.onMouseDown = function(event)
      {
         console.log(`${this.name} - onMouseDown()`)

         // begin new stroke
         this.lastLineStart = this.drawEngine.mouseCoords   // this betta be write only
         console.log(`start point: ${this.lastLineStart.x},${this.lastLineStart.y}`)

      }.bind(this)

      // -------------------------------------------------
      this.Start = function()
      {}
      this.End = function()
      {}
   }
}
