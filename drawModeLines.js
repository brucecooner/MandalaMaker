var DrawModeLines =
{
   DrawModeLines:function(drawEngine)
   {
      this.name = 'lines'
      this.drawEngine = drawEngine

      this.lineStart = null

      this.strokeSnapPoints = null

      this.onCursorMove = function(event)
      {
      }.bind(this)

      this.onMouseUp = function(event)
      {
         if (null == this.lineStart)
         {
            this.lineStart = drawEngine.getCursorCoords()

            this.strokeSnapPoints = [ drawEngine.getCursorCoords() ]

            this.drawEngine.manageTempSnapPoints(this.drawEngine.cursorCoords)
         }
         else
         {
            if (this.drawEngine.isRightMouseButton)   // cancel current line
            {
               this.lineStart = null
               this.drawEngine.manageTempSnapPoints(null)
            }
            else
            {
               // got some snap points?
               this.strokeSnapPoints.push(this.drawEngine.getCursorCoords())

               this.drawEngine.drawOutputGraphics([GraphicsCommands.line(new fnc2d.Point(this.lineStart), this.drawEngine.getCursorCoords())],
                                                   this.strokeSnapPoints)
               this.lineStart.set(drawEngine.getCursorCoords())

               this.strokeSnapPoints = []
               this.drawEngine.manageTempSnapPoints(null)
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
      this.getCursorGraphics = function()
      {
         graphicsComms = []
         if (null != this.lineStart)
         {
            // TODO:use math library!
            var xDiff = this.drawEngine.getCursorCoords().x - this.lineStart.x
            var yDiff = this.drawEngine.getCursorCoords().y - this.lineStart.y
            var delta = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff))

            if (this.lineStart.delta(this.drawEngine.getCursorCoords()).length() > 3)
            {
               graphicsComms.push( GraphicsCommands.line(this.lineStart, this.drawEngine.getCursorCoords()))
            }
         }

         return graphicsComms
      }.bind(this)

   }
}
