var DrawModeCircles =
{
   DrawModeCircles:function(drawEngine)
   {
      this.name = 'circles'
      this.drawEngine = drawEngine

      this.circleCenter = null

      this.onCursorMove = function(event)
      {
      }.bind(this)

      this.onMouseUp = function(event)
      {
         if (null == this.circleCenter)
         {
            this.circleCenter = new fnc2d.Point(this.drawEngine.getCursorCoords())
         }
         else
         {
            if (this.drawEngine.isRightMouseButton)   // cancel current circle
            {
               this.circleCenter = null
            }
            else
            {
               radius = this.drawEngine.getCursorCoords().delta(this.circleCenter).length()
               gComms = []
               // gComms.push( GraphicsCommands.setDrawParameter('fillStyle', null ))
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
      }

      // -----------------------------------------------------------------------
      this.getCursorGraphics = function()
      {
         gComms = []
         if (null != this.circleCenter)
         {
            var delta = this.circleCenter.delta(this.drawEngine.getCursorCoords()).length()

            if (delta > 2)
            {
               gComms = []
               gComms.push( GraphicsCommands.setDrawParameter('strokeStyle', '#000000'))
               gComms.push( GraphicsCommands.circle(this.circleCenter.x, this.circleCenter.y, delta))
            }
         }

         return gComms
      }

   }
}
