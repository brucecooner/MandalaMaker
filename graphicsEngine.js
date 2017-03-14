var GraphicsEngine =
{
   // config: {canvas:<canvas>}
   GraphicsEngine:function(config)
   {
      this.canvas = config.canvas

      // -----------------------------------------------------------------------
      clearCanvas = function(ctx, parameters)
      {
         ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }

      // -----------------------------------------------------------------------
      drawLine = function(ctx, parameters)
      {
         ctx.setLineDash([0,0]); // TODO: parameterize
         ctx.beginPath()
         ctx.moveTo( parameters.lineStart.x, parameters.lineStart.y )
         ctx.lineTo( parameters.lineEnd.x, parameters.lineEnd.y )
         ctx.stroke()
      }

      this.commandHandlers = {
         'clear':clearCanvas.bind(this),
         'circle':null,
         'line':drawLine.bind(this),
      }

      this.execute = function(commandsList)
      {
         var ctx = this.canvas.getContext("2d");

         commandsList.forEach( function(currentCommand)
         {
            this.commandHandlers[currentCommand.command](ctx, currentCommand.parameters)
         }.bind(this))
      }
   }
}
