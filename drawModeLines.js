var DrawModeLines =
{
   DrawModeLines:function(drawEngine)
   {
      this.name = 'lines'
      this.drawEngine = drawEngine

      this.lineStart = null

      this.onCursorMove = function(event)
      {
         if (null != this.lineStart)
         {
            var xDiff = this.drawEngine.cursorCoords.x - this.lineStart.x
            var yDiff = this.drawEngine.cursorCoords.y - this.lineStart.y
            var delta = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff))

            if (delta > 3)
            {
               graphicsComms = []
               graphicsComms.push( GraphicsCommands.line(this.lineStart, this.drawEngine.cursorCoords))
               this.drawEngine.drawCursorGraphics(graphicsComms)
            }
         }
      }.bind(this)

      this.onMouseUp = function(event)
      {
         if (null == this.lineStart)
         {
            this.lineStart = Object.assign({}, drawEngine.cursorCoords)
         }
         else
         {
            if (this.drawEngine.isRightMouseButton)   // cancel current line
            {
               this.drawEngine.drawCursorGraphics([GraphicsCommands.clear()])
               this.lineStart = null
            }
            else
            {
               gCommands = []
               gCommands.push( GraphicsCommands.setDrawParameter('strokeStyle', '#000000'))
               gCommands.push( GraphicsCommands.line(this.lineStart, this.drawEngine.cursorCoords))
               this.drawEngine.drawOutputGraphics(gCommands)
               Object.assign(this.lineStart, drawEngine.cursorCoords)
            }
         }
      }.bind(this)

      this.onMouseDown = function(event)
      {
      }.bind(this)

      this.onMouseOut = function()
      {
         // this.lineStart = null
      }

      // -------------------------------------------------
      this.Start = function()
      {
         this.lineStart = null
      }
      this.End = function()
      {
         // this.lineStart = null
         // this.drawEngine.drawCursorGraphics([GraphicsCommands.clear()])
      }

   }
}
