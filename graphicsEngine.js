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
      setLineDash = function( ctx, parameters )
      {
         ctx.setLineDash( parameters.dashSequence )
      }

      // -----------------------------------------------------------------------
      drawLine = function(ctx, parameters)
      {
         ctx.beginPath()
         ctx.moveTo( parameters.lineStart.x, parameters.lineStart.y )
         ctx.lineTo( parameters.lineEnd.x, parameters.lineEnd.y )
         ctx.stroke()
      }

      this.commandHandlers = {
         [GraphicsCommands.cmd_clear]:clearCanvas.bind(this),
         [GraphicsCommands.cmd_setLineDash]:setLineDash.bind(this),
         [GraphicsCommands.cmd_circle]:null,
         [GraphicsCommands.cmd_line]:drawLine.bind(this),
      }

      this.execute = function(commandsList)
      {
         var ctx = this.canvas.getContext("2d");
         // always start with line dash zero
         ctx.setLineDash([0,0])

         commandsList.forEach( function(currentCommand)
         {
            this.commandHandlers[currentCommand.command](ctx, currentCommand.parameters)
         }.bind(this))
      }
   }
}
