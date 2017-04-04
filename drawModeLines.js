var DrawModeLines =
{
   DrawModeLines:function(drawEngine)
   {
      this.name = 'lines'
      this.drawEngine = drawEngine

      this.lineStart = null

      this.onCursorMove = function(event)
      {
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
               this.lineStart = null
            }
            else
            {
               // commit line
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
      }

      // -----------------------------------------------------------------------
      // returns : [ [graphicsCommand [, graphicsCommand]]]
      this.render = function()
      {
         graphicsComms = []
         if (null != this.lineStart)
         {
            // TODO:use math library!
            var xDiff = this.drawEngine.cursorCoords.x - this.lineStart.x
            var yDiff = this.drawEngine.cursorCoords.y - this.lineStart.y
            var delta = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff))

            if (delta > 3)
            {
               graphicsComms.push( GraphicsCommands.line(this.lineStart, this.drawEngine.cursorCoords))
            }
         }

         return graphicsComms
      }.bind(this)

   }
}
