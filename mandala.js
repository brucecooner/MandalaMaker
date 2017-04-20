;'use strict'
// Notes:
// -assumes points are always in 'mandala' space (already relative to center)
var Mandala =
{
   // --- consts ---
   minPetals:2,
   maxPetals:100,

   // --- constructor-ish ---
   Mandala:function()
   {
      this.numPetals = 10
      this.petalsOffset = 0.0
      // whether or not any guides are shown
      this.drawGuides = true
      // whether or not half guides are shown
      this.drawHalfGuides = false

      // whether or not to use mirror guides (not really used internally)
      this.mirrorGuides = false
      // if not null, use this line as mirror
      this.mirrorLine = null

      // cached stuff
      this.lastRenderedGuides = null

      // -----------------------------------------------------------------------
      // returns object that encapsulates current state
      this.getState = function()
      {
         return { numPetals:this.numPetals,
                  mirrorLine:this.mirrorLine }
      }

      // -----------------------------------------------------------------------
      this.setMirrorLine = function(line)
      {
         console.log(`setting mirror line`)
         this.mirrorLine = line
      }

      // -----------------------------------------------------------------------
      // renders a series of lines to represent the spokes that form the guide
      // returns : { guideLines:[{p1:{x,y}}, p2:{x,y}}],
      //             halfGuideLines:[ { p1:{x,y}, p2:{x,y} } ]}
      this.RenderGuides = function(guideLength)
      {
         const radiansPerSpoke = (Math.PI * 2) / this.numPetals
         let currentRotation = 0.0

         let guideLines = []
         let halfGuideLines = []

         let offsetRotation = radiansPerSpoke * this.petalsOffset
         currentRotation += offsetRotation

         for (var currentSpoke = 0; currentSpoke < this.numPetals; ++currentSpoke)
         {
            // rot_point = my2d.rotatePoint( 0.0, guideLength, currentRotation)
            let rot_point = new fnc2d.Point(0, guideLength).rotate(currentRotation)

            guideLines.push( new fnc2d.Line( [0,0], [Math.floor(rot_point.x),Math.floor(rot_point.y)]))

            currentRotation += radiansPerSpoke
         }

         if (this.drawHalfGuides)
         {
            currentRotation = offsetRotation + (radiansPerSpoke * 0.5)

            for (var currentSpoke = 0; currentSpoke < this.numPetals; ++currentSpoke)
            {
               // rot_point = my2d.rotatePoint( 0.0, guideLength, currentRotation)
               let rot_point = new fnc2d.Point(0, guideLength).rotate(currentRotation)

               halfGuideLines.push( new fnc2d.Line( [0,0], [Math.floor(rot_point.x),Math.floor(rot_point.y)]))

               currentRotation += radiansPerSpoke
            }
         }
         else if (this.numPetals == 2)
         {
            // in case where half guides are off but num petals is 2, render small half guides to mark center, since
            // guides for a straight line
            currentRotation = offsetRotation + (radiansPerSpoke * 0.5)

            // unrolled loop... (just rendering two)
            const guideScale = 0.05
            let rot_point = new fnc2d.Point(0, guideLength * guideScale).rotate(currentRotation)
            halfGuideLines.push( new fnc2d.Line( [0,0], [Math.floor(rot_point.x),Math.floor(rot_point.y)]))
            currentRotation += radiansPerSpoke
            rot_point = new fnc2d.Point(0, guideLength * guideScale).rotate(currentRotation)
            halfGuideLines.push( new fnc2d.Line( [0,0], [Math.floor(rot_point.x),Math.floor(rot_point.y)]))
         }

         this.lastRenderedGuides = { guideLines:guideLines, halfGuideLines:halfGuideLines }

         return this.lastRenderedGuides
      }  // end RenderGuides()

      // -----------------------------------------------------------------------
      // returns nearest guide line to specified point
      // point: {x, y}
      // TODO : I think this could be done more quickly by calculating the angle
      // to point and then math-ing the line (don't forget offsets though)
      this.NearestGuideLine = function(point)
      {
         let gLines = []
         let closestDistanceSoFar = Number.MAX_VALUE;
         let closestLine = null

         if ( null != this.lastRenderedGuides )
         {
            gLines = this.lastRenderedGuides.guideLines
         }
         else
         {
            let lines = this.RenderGuides(10)
            gLines = lines.guideLines
         }

         gLines.forEach( function(currentLine)
         {
            // currentDistance = my2d.distancePointToLine(point, currentLine)
            let currentDistance = currentLine.perpDistance(point)

            if (currentDistance < closestDistanceSoFar)
            {
               closestDistanceSoFar = currentDistance
               closestLine = currentLine
            }
         })

         return closestLine
      }

      // -----------------------------------------------------------------------
      // returns array of points reflected around, once for each petal
      // note: May add points for mirroring too
      // receives: point: {x,y}
      // returns: [ {x,y}, ... ]
      this.ReflectPoints = function(point)
      {
         const radiansPerSpoke = (Math.PI * 2) / this.numPetals
         let points = []
         let currentRotation = 0.0
         let reflectedPoint = null

         if ( this.mirrorLine )
         {
            // reflectedPoint = my2d.reflectPoint(point, this.mirrorLine)
            reflectedPoint = point.reflect(this.mirrorLine)
         }

         for (var currentSpoke = 0; currentSpoke < this.numPetals; ++currentSpoke)
         {
            // rot_point = my2d.rotatePoint( point.x, point.y, currentRotation)
            let rot_point = point.rotate(currentRotation)

            points.push(rot_point)

            if ( null != reflectedPoint )
            {
               // points.push(my2d.rotatePoint(reflectedPoint.x, reflectedPoint.y, currentRotation))
               points.push(reflectedPoint.rotate(currentRotation))
            }

            currentRotation += radiansPerSpoke
         }

         return points
      } // end ReflectPoints()

      // -----------------------------------------------------------------------
      // receives: line
      // notes: assumes line is in mandala space
      // reflects line around center of mandala, once for each petal
      // returns: [ fnc2d.Line ]
      this.RenderLine = function(line)
      {
         const radiansPerSpoke = (Math.PI * 2) / this.numPetals
         let currentRotation = 0.0
         let lines = []

         let startPoints = this.ReflectPoints(line.p1)
         let endPoints = this.ReflectPoints(line.p2)

         let currentPointIndex = 0
         for ( currentPointIndex = 0; currentPointIndex < startPoints.length; currentPointIndex++ )
         {
            lines.push( new fnc2d.Line( startPoints[currentPointIndex],
                                          endPoints[currentPointIndex]))
         }

         return lines
      }  // end RenderLine()

      // -----------------------------------------------------------------------
      this.dispatchDrawParameters = function(drawParameters, graphicsEngine)
      {
         if (null !== drawParameters)
         {
            let commands = []
            for (var param in drawParameters)
            {
               if (drawParameters.hasOwnProperty(param))
               {
                  commands = commands.concat(GraphicsCommands.setDrawParameter(param, drawParameters[param]))
               }
            }
            if (commands.length > 0)
            {
               graphicsEngine.execute(commands)
            }
         }
      }

      // -----------------------------------------------------------------------
      // receives:   origin:{x,y}
      //             graphicsEngine:GraphicsEngine
      this.setOrigin = function(origin, graphicsEngine)
      {
         let command = GraphicsCommands.setDrawParameter('translate', origin)
         graphicsEngine.execute(command)
      }

      // -----------------------------------------------------------------------
      this.mirrorLineCommand = function(command, mirrorLine)
      {
         let p1Mirrored = new fnc2d.Point(command.parameters.p1).reflect(mirrorLine).floorEq()
         let p2Mirrored = new fnc2d.Point(command.parameters.p2).reflect(mirrorLine).floorEq()

         return GraphicsCommands.line(p1Mirrored, p2Mirrored)
      }

      // -----------------------------------------------------------------------
      this.mirrorCircleCommand = function(command, mirrorLine)
      {
         let centerMirrored = new fnc2d.Point(command.parameters.x,command.parameters.y).reflect(mirrorLine).floorEq()

         return GraphicsCommands.circle(centerMirrored.x, centerMirrored.y, command.parameters.radius)
      }

      this.mirrorHandlers =
      {
         'line':this.mirrorLineCommand,
         'circle':this.mirrorCircleCommand,
      }

      // -----------------------------------------------------------------------
      this.mirrorCommands = function(commands, mirrorLine)
      {
         let newCommands = []

         if (Array.isArray(commands))
         {
            commands.forEach( function(command)
            {
               newCommands.push(command)
               if (this.mirrorHandlers.hasOwnProperty(command.command))
               {
                  newCommands.push(this.mirrorHandlers[command.command](command, mirrorLine))
               }
            }, this)
         }
         else
         {
            newCommands.push(command)
            if (this.mirrorHandlers.hasOwnProperty(commands.command))
            {
               newCommands.push(this.mirrorHandlers[commands.command](commands, mirrorLine))
            }
         }

         return newCommands
      }

      // -----------------------------------------------------------------------
      // receives: renderObject:{   commands:[],
      //                            mandalaState:{},
      //                            drawParameters:{},
      //                            origin:{x,y}}
      // graphicsEngine: GraphicsEngine
      this.render = function(renderObject, graphicsEngine)
      {
         let rotationPerPetal = Math.PI * 2 / renderObject.mandalaState.numPetals
         let rotCommand = GraphicsCommands.setDrawParameter('rotate', rotationPerPetal)

         // if (null !== renderObject.mirrorLine)
         // {
         //    let mirroredCommands = this.mirrorCommands(renderObject.commands, renderObject.mandalaState.mirrorLine)
         //    renderObject.commands = mirroredCommands
         // }

         graphicsEngine.saveState()

         this.dispatchDrawParameters(renderObject.drawParameters, graphicsEngine)

         if (renderObject.clear)
         {
            graphicsEngine.execute(GraphicsCommands.clear())
         }

         this.setOrigin(renderObject.origin, graphicsEngine)

         let i = 0
         for (i = 0; i < renderObject.mandalaState.numPetals; i += 1)
         {
            graphicsEngine.execute(renderObject.commands)
            graphicsEngine.execute(rotCommand)
         }

         graphicsEngine.restoreState()
      }

   },

}  // end Mandala
