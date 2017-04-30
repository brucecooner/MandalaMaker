var GraphicsEngine =
{
   // config: {canvas:<canvas>}
   GraphicsEngine:function( config )
   {
      this.initContext = function()
      {
         this.context = this.canvas.getContext('2d')
         // you get weird disconnected lines if you don't initialize the dash
         this.context.setLineDash([0,0])
      }

      this.canvas = config.canvas

      this.initContext()
      // this.context = this.canvas.getContext('2d');
      // this.context.setLineDash([0,0])

      this.drawParameters = {}
      // -----------------------------------------------------------------------
      this.drawParameterHandlers =
      {
         'fillStyle':function(ctx, value){ctx.fillStyle = value },
         'strokeStyle':function(ctx, value){ctx.strokeStyle = value },
         'lineDash':function(ctx, value){ctx.setLineDash(value)},
         'translate':function(ctx, value){ctx.translate(value.x,value.y)},
         'rotate':function(ctx, value){ctx.rotate(value)}
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
      clearCanvasTransform = function( parameters )
      {
         this.context.setTransform(1,0,0,1,0,0)
      }

      // -----------------------------------------------------------------------
      drawLine = function( parameters )
      {
         this.context.beginPath()
         this.context.moveTo( parameters.p1.x, parameters.p1.y )
         this.context.lineTo( parameters.p2.x, parameters.p2.y )
         this.context.stroke()
      }

      // -----------------------------------------------------------------------
      drawCircle = function( parameters )
      {
         // console.log(`ge:circle ${parameters.x},${parameters.y} r:${parameters.radius}`)
         this.context.beginPath();
         this.context.arc(parameters.x, parameters.y, parameters.radius, 0, Math.PI * 2 );

         // at a later time, figure out how to handle filled circles
         // this.context.fill();

         this.context.lineWidth = 1;

         this.context.stroke();
      }

      // -----------------------------------------------------------------------
      drawQuadraticCurve = function( parameters )
      {
         this.context.beginPath();
         this.context.moveTo( parameters.p1.x, parameters.p1.y);
         this.context.quadraticCurveTo(parameters.p2.x, parameters.p2.y,
                                       parameters.p3.x, parameters.p3.y);
         this.context.stroke();
      }

      this.commandHandlers = {
         [GraphicsCommands.cmd_clear]:clearCanvas.bind(this),
         [GraphicsCommands.cmd_setDrawParameter]:setDrawParameter.bind(this),
         [GraphicsCommands.cmd_line]:drawLine.bind(this),
         [GraphicsCommands.cmd_circle]:drawCircle.bind(this),
         [GraphicsCommands.cmd_quadraticCurve]:drawQuadraticCurve.bind(this),
      }

      // -----------------------------------------------------------------------
      this.execute = function( commands )
      {
         if (Array.isArray(commands))
         {
            commands.forEach( function(currentCommand)
            {
               this.commandHandlers[currentCommand.command](currentCommand.parameters)
            }, this)
         }
         else
         {
            this.commandHandlers[commands.command](commands.parameters)
         }
      }

      // -----------------------------------------------------------------------
      this.saveState = function()
      {
         this.context.save()
      }

      // -----------------------------------------------------------------------
      this.restoreState = function()
      {
         this.context.restore()
      }

      // stuff this graphics engine will use when rendering, can be:
      // -a function, will call and render results
      // -an array, will render contents
      // Note : objects are always rendered in order they were added
      // GraphicsEngine not responsible if you delete something it was using.
      this.renderObjects = []

      // -----------------------------------------------------------------------
      this.addRenderObject = function(newObject)
      {
         this.renderObjects.push( newObject )
      }

      // -----------------------------------------------------------------------
      this.removeRenderObject = function(removeObject)
      {
         this.renderObjects.forEach( function(currentObject, index)
         {
            if (currentObject === removeObject)
            {
               this.renderObjects.splice(index,1)
               return false
            }
         }, this)
      }

      // -----------------------------------------------------------------------
      // renders all of the stuff in this.renderObjects
      // Note:
      // -saves/restores state around render
      this.render = function()
      {
         this.saveState()

         this.renderObjects.forEach( function(currentObject)
         {
            if (Array.isArray(currentObject))
            {
               this.execute(currentObject)
            }
            else if (typeof currentObject === 'function')
            {
               this.execute( currentObject() )
            }
         }, this)

         this.restoreState()
      }

      // -----------------------------------------------------------------------
      // utility to get current center of canvas
      // returns { x:number, y:number }
      this.getCenter = function()
      {
         return { x:this.canvas.width / 2, y:this.canvas.height / 2}
      }
   }
}
