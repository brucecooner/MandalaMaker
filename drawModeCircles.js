var DrawModeCircles =
{
   // TODO:
   // -cancel/restart
   DrawModeCircles:function(drawEngine)
   {
      this.name = 'circles'
      this.drawEngine = drawEngine

      this.circleCenter = null

      this.onMouseMove = function(event)
      {
         if (null != this.circleCenter)
         {
            var delta = distanceBetweenPoints(this.circleCenter, this.drawEngine.mouseCoords)

            if (delta > 2)
            {
               graphicsComms = []
               graphicsComms.push( GraphicsCommands.circle(this.circleCenter.x, this.circleCenter.y, delta))
               this.drawEngine.drawCursorGraphics(graphicsComms)
            }
         }
      }.bind(this)

      this.onMouseUp = function(event)
      {
         if (null == this.circleCenter)
         {
            this.circleCenter = drawEngine.mouseCoords
         }
         else
         {
            if (this.drawEngine.isRightMouseButton)   // cancel current circle
            {
               this.drawEngine.drawCursorGraphics([GraphicsCommands.clear()])
               this.circleCenter = null
            }
            else
            {
               radius = distanceBetweenPoints(this.drawEngine.mouseCoords, this.circleCenter)
               this.drawEngine.drawOutputGraphics( [GraphicsCommands.circle(this.circleCenter.x, this.circleCenter.y, radius ) ])
               this.circleCenter = null
            }
         }
      }.bind(this)

      this.onMouseDown = function(event)
      {
      }.bind(this)

      // -------------------------------------------------
      this.Start = function()
      {
         this.circleCenter = null
      }
      this.End = function()
      {
         // this.lineStart = null
         // this.drawEngine.drawCursorGraphics([GraphicsCommands.clear()])
      }

   }
}
