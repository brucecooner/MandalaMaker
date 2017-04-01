var GraphicsEngine =
{
   // config: {canvas:<canvas>}
   GraphicsEngine:function( config )
   {
      this.canvas = config.canvas

      this.context = this.canvas.getContext("2d");
      // you get weird disconnected lines if you don't initialize the dash
      this.context.setLineDash([0,0])

      this.drawParameters = {}
      // -----------------------------------------------------------------------
      this.drawParameterHandlers =
      {
         'fillStyle':function(ctx, value){ctx.fillStyle = value },
         'strokeStyle':function(ctx, value){ctx.strokeStyle = value },
         'lineDash':function(ctx, value){ctx.setLineDash(value)},
      }

      // -----------------------------------------------------------------------
      setDrawParameter = function( parameters )
      {
         this.drawParameters[parameters.parameterName] = parameters.value

         if ( this.drawParameterHandlers.hasOwnProperty(parameters.parameterName) )
         {
            this.drawParameterHandlers[parameters.parameterName](this.context, parameters.value)
         }
         else
         {
            console.log(`unknown draw parameter '${parameters.parameterName}'`)
         }
      }

      // -----------------------------------------------------------------------
      clearCanvas = function( parameters )
      {
         this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }

      // -----------------------------------------------------------------------
      drawLine = function( parameters )
      {
         this.context.beginPath()
         this.context.moveTo( parameters.P1.x, parameters.P1.y )
         this.context.lineTo( parameters.P2.x, parameters.P2.y )
         this.context.stroke()
      }

      // -----------------------------------------------------------------------
      drawCircle = function( parameters )
      {
         // TODO : colors and stuff like that
         this.context.beginPath();
         this.context.arc(parameters.x, parameters.y, parameters.radius, 0, TWO_PI );

         this.context.lineWidth = 1;

         this.context.stroke();
      }

      this.commandHandlers = {
         [GraphicsCommands.cmd_clear]:clearCanvas.bind(this),
         [GraphicsCommands.cmd_setDrawParameter]:setDrawParameter.bind(this),
         [GraphicsCommands.cmd_circle]:null,
         [GraphicsCommands.cmd_line]:drawLine.bind(this),
         [GraphicsCommands.cmd_circle]:drawCircle.bind(this),
      }

      // -----------------------------------------------------------------------
      this.execute = function( commandsList )
      {
         var test = this.context

         // man, this bind seems out of place...
         commandsList.forEach( function(currentCommand)
         {
            this.commandHandlers[currentCommand.command](currentCommand.parameters)
         }, this)
      }
   }
}
