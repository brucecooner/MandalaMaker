;'use strict;'
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

      // whether or not to render all petals or just singular objects
      this.renderPetals = true

      // cached stuff
      this.lastRenderedGuides = null

      // -----------------------------------------------------------------------
      this.radiansPerPetal = function()
      {
         return Math.PI * 2 / this.numPetals
      }
      // -----------------------------------------------------------------------
      this.offsetRadians = function()
      {
         return (Math.PI * 2 / this.numPetals) * this.petalsOffset
      }

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
         this.mirrorLine = new fnc2d.Line(line)
      }

      // -----------------------------------------------------------------------
      // renders a series of lines to represent the spokes that form the guide
      // returns : { guideLines:[{p1:{x,y}}, p2:{x,y}}],
      //             halfGuideLines:[ { p1:{x,y}, p2:{x,y} } ]}
      this.renderGuides = function(guideLength)
      {
         const radiansPerSpoke = (Math.PI * 2) / this.numPetals
         let currentRotation = 0.0

         let guideLines = []
         let halfGuideLines = []

         let offsetRotation = radiansPerSpoke * this.petalsOffset
         currentRotation += offsetRotation

         for (var currentSpoke = 0; currentSpoke < this.numPetals; ++currentSpoke)
         {
            // note that we use 0,-guideLength as the 'base' guide line. This makes
            // for the most aesthetically pleasing arrangement, but unfortunately
            // the canvases use +x as the rotation = 0 axis. To be honest I'm not
            // entirely sure my 2d rotate turns the same direction as the canvas rotate,
            // but it hasn't led to any bugs yet, so...  Anyway, if you start expected to draw
            // arcs on a canvas, you will want to be aware of this quirk
            let rot_point = new fnc2d.Point(0, -guideLength).rotate(currentRotation)

            guideLines.push( new fnc2d.Line( [0,0], [Math.floor(rot_point.x),Math.floor(rot_point.y)]))

            currentRotation += radiansPerSpoke
         }

         if (this.drawHalfGuides)
         {
            currentRotation = offsetRotation + (radiansPerSpoke * 0.5)

            for (var currentSpoke = 0; currentSpoke < this.numPetals; ++currentSpoke)
            {
               // rot_point = my2d.rotatePoint( 0.0, guideLength, currentRotation)
               let rot_point = new fnc2d.Point(0, -guideLength).rotate(currentRotation)

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
      this.reflectPoints = function(point)
      {
         const radiansPerSpoke = this.radiansPerPetal()
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
      } // end reflectPoints()

      // -----------------------------------------------------------------------
      // appears to be deferred
      // receives: line
      // notes: assumes line is in mandala space
      // reflects line around center of mandala, once for each petal
      // returns: [ fnc2d.Line ]
      // this.RenderLine = function(line)
      // {
      //    const radiansPerSpoke = (Math.PI * 2) / this.numPetals
      //    let currentRotation = 0.0
      //    let lines = []
      //
      //    let startPoints = this.ReflectPoints(line.p1)
      //    let endPoints = this.ReflectPoints(line.p2)
      //
      //    let currentPointIndex = 0
      //    for ( currentPointIndex = 0; currentPointIndex < startPoints.length; currentPointIndex++ )
      //    {
      //       lines.push( new fnc2d.Line( startPoints[currentPointIndex],
      //                                     endPoints[currentPointIndex]))
      //    }
      //
      //    return lines
      // }  // end RenderLine()

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

      // -----------------------------------------------------------------------
      this.mirrorQuadraticCurveCommand = function(command, mirrorLine)
      {
         let p1Mirrored = new fnc2d.Point(command.parameters.p1).reflect(mirrorLine).floorEq()
         let p2Mirrored = new fnc2d.Point(command.parameters.p2).reflect(mirrorLine).floorEq()
         let p3Mirrored = new fnc2d.Point(command.parameters.p3).reflect(mirrorLine).floorEq()

         return GraphicsCommands.quadraticCurve(p1Mirrored, p2Mirrored, p3Mirrored)
      }

      this.mirrorHandlers =
      {
         'line':this.mirrorLineCommand,
         'circle':this.mirrorCircleCommand,
         'quadraticCurve':this.mirrorQuadraticCurveCommand,
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
            newCommands.push(commands)
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

         graphicsEngine.saveState()

         this.dispatchDrawParameters(renderObject.drawParameters, graphicsEngine)

         if (renderObject.clear)
         {
            graphicsEngine.execute(GraphicsCommands.clear())
         }

         // note : ignoring stored origin in favor of calculated, for now
         // this.setOrigin(renderObject.origin, graphicsEngine)
         this.setOrigin(graphicsEngine.getCenter(), graphicsEngine)

         // TODO : debug way to turn off other petals
         let i = 0
         let maxIndex = (this.renderPetals) ? renderObject.mandalaState.numPetals : 1
         for (i = 0; i < maxIndex; i += 1)
         {
            graphicsEngine.execute(renderObject.commands)
            graphicsEngine.execute(rotCommand)
         }

         graphicsEngine.restoreState()
      }

   },

}  // end Mandala
