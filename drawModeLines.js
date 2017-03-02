var DrawModeLines =
{
   DrawModeLines:function(drawEngine)
   {
      this.name = 'lines'
      this.drawEngine = drawEngine

      this.lineStart = null

      this.onMouseMove = function(event)
      {
         // console.log(`${this.name} - onMouseMove()`)
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
         // console.log(`${this.name} - onMouseDown()`)
      }.bind(this)

   }
}
