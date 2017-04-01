var DrawModeCircles =
{
   // TODO:
   // -cancel/restart
   DrawModeCircles:function(drawEngine)
   {
      this.name = 'circles'
      this.drawEngine = drawEngine

      this.circleCenter = null

      this.onCursorMove = function(event)
      {
         if (null != this.circleCenter)
         {
            var delta = distanceBetweenPoints(this.circleCenter, this.drawEngine.cursorCoords)

            if (delta > 2)
            {
               gComms = []
               gComms.push( GraphicsCommands.setDrawParameter('strokeStyle', '#000000'))
               gComms.push( GraphicsCommands.circle(this.circleCenter.x, this.circleCenter.y, delta))
               this.drawEngine.drawCursorGraphics(gComms)
            }
         }
      }.bind(this)

      this.onMouseUp = function(event)
      {
         if (null == this.circleCenter)
         {
            this.circleCenter = Object.assign({}, drawEngine.cursorCoords)
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
               radius = distanceBetweenPoints(this.drawEngine.cursorCoords, this.circleCenter)
               gComms = []
               gComms.push( GraphicsCommands.setDrawParameter('strokeStyle', '#000000'))
               gComms.push( GraphicsCommands.setDrawParameter('fillStyle', null ))
               gComms.push( GraphicsCommands.circle(this.circleCenter.x, this.circleCenter.y, radius ) )
               this.drawEngine.drawOutputGraphics(gComms)
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
