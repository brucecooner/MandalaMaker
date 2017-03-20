var DrawModeErase =
{
   DrawModeErase:function(drawEngine)
   {
      this.name = 'erase'
      this.drawEngine = drawEngine

      this.onMouseMove = function(event)
      {
         if (this.drawEngine.mouseButtonDown)
         {
            this.drawEngine.drawOutputGraphics([GraphicsCommands.circle(this.drawEngine.mouseCoords.x, this.drawEngine.mouseCoords.y, 5)])
         }
      }.bind(this)

      this.onMouseUp = function(event)
      {
      }.bind(this)

      this.onMouseDown = function(event)
      {
      }.bind(this)

      // -------------------------------------------------
      this.Start = function()
      {}
      this.End = function()
      {}
   }
}
