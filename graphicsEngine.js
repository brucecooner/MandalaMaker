var GraphicsEngine =
{
   // config: {canvas:<canvas>}
   GraphicsEngine:function(config)
   {
      this.canvas = config.canvas

      // currently supported generic parameters:
      // fillStyle
      // stroke
      this.drawParameters = {}

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
      setDrawParameter = function(ctx, parameters )
      {
         this.drawParameters[parameters.parameterName] = parameters.value
      }

      // -----------------------------------------------------------------------
      // checks to see if a stroke style has been set on drawParameters and if so
      // applies it to context
      this.setStrokeStyle = function(context)
      {
         if ( this.drawParameters.hasOwnProperty('strokeStyle'))
         {
            context.strokeStyle = this.drawParameters.strokeStyle
         }
      }

      // -----------------------------------------------------------------------
      drawLine = function(ctx, parameters)
      {
         ctx.beginPath()
         ctx.moveTo( parameters.P1.x, parameters.P1.y )
         ctx.lineTo( parameters.P2.x, parameters.P2.y )
         this.setStrokeStyle(ctx)
         ctx.stroke()
      }

      // -----------------------------------------------------------------------
      drawCircle = function(ctx, parameters)
      {
         // TODO : colors and stuff like that
         ctx.beginPath();
         ctx.arc(parameters.x, parameters.y, parameters.radius, 0, TWO_PI );

         if ( this.drawParameters.hasOwnProperty('fillStyle') && this.drawParameters['fillStyle'])
         {
            ctx.fillStyle = this.drawParameters.fillStyle
            ctx.fill()
         }
         ctx.lineWidth = 1;

         this.setStrokeStyle(ctx)
         // ctx.strokeStyle = '#000000' // TODO: parameterize

         ctx.stroke();
      }

      this.commandHandlers = {
         [GraphicsCommands.cmd_clear]:clearCanvas.bind(this),
         [GraphicsCommands.cmd_setDrawParameter]:setDrawParameter.bind(this),
         [GraphicsCommands.cmd_setLineDash]:setLineDash.bind(this),
         [GraphicsCommands.cmd_circle]:null,
         [GraphicsCommands.cmd_line]:drawLine.bind(this),
         [GraphicsCommands.cmd_circle]:drawCircle.bind(this),
      }

      // -----------------------------------------------------------------------
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
