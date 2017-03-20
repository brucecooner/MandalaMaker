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
            commands = []
            commands.push(GraphicsCommands.setDrawParameter('fillStyle', '#FFFFFF' )) //'white'))
            commands.push(GraphicsCommands.setDrawParameter('strokeStyle', '#FFFFFF'))
            commands.push(GraphicsCommands.circle(this.drawEngine.mouseCoords.x, this.drawEngine.mouseCoords.y, 5))
            this.drawEngine.drawOutputGraphics(commands)
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
