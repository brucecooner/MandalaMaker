var DrawModeLines =
{
   // TODO:
   // -cancel/restart
   DrawModeLines:function(drawEngine)
   {
      this.name = 'lines'
      this.drawEngine = drawEngine

      this.lineStart = null

      this.onMouseMove = function(event)
      {
         // console.log(`${this.name} - onMouseMove()`)
         if (null != this.lineStart)
         {
            var xDiff = this.drawEngine.mouseCoords.x - this.lineStart.x
            var yDiff = this.drawEngine.mouseCoords.y - this.lineStart.y
            var delta = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff))

            if (delta > 3)
            {
               this.drawEngine.draw_Cursor_Line( {lineStart:this.lineStart, lineEnd:this.drawEngine.mouseCoords} )
            }
         }
      }.bind(this)

      this.onMouseUp = function(event)
      {
         // console.log(`${this.name} - onMouseUp()`)

         if (null == this.lineStart)
         {
            this.lineStart = drawEngine.mouseCoords
         }
         else
         {
            this.drawEngine.draw_Line({lineStart:this.lineStart, lineEnd:drawEngine.mouseCoords})
            this.lineStart = drawEngine.mouseCoords
         }
      }.bind(this)

      this.onMouseDown = function(event)
      {
         console.log(`${this.name} - onMouseDown()`)
      }.bind(this)

      // -------------------------------------------------
      this.Start = function()
      {
         this.lineStart = null
      }
      this.End = function()
      {
         this.lineStart = null
         // TODO: clear cursor canvas
      }

   }
}
