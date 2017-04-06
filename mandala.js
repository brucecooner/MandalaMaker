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
      this.setMirrorLine = function(line)
      { this.mirrorLine = line }

      // -----------------------------------------------------------------------
      // renders a series of lines to represent the spokes that form the guide
      // returns : { guideLines:[{p1:{x,y}}, p2:{x,y}}],
      //             halfGuideLines:[ { p1:{x,y}, p2:{x,y} } ]}
      this.RenderGuides = function(guideLength)
      {
         const radiansPerSpoke = my2d.TWO_PI / this.numPetals
         let currentRotation = 0.0

         guideLines = []
         halfGuideLines = []

         var offsetRotation = radiansPerSpoke * this.petalsOffset
         currentRotation += offsetRotation

         for (var currentSpoke = 0; currentSpoke < this.numPetals; ++currentSpoke)
         {
            rot_point = my2d.rotatePoint( 0.0, guideLength, currentRotation)

            guideLines.push( new my2d.Line( {x:0, y:0}, {x:rot_point.x, y:rot_point.y} ))

            currentRotation += radiansPerSpoke
         }

         if (this.drawHalfGuides)
         {
            currentRotation = offsetRotation + (radiansPerSpoke * 0.5)

            for (var currentSpoke = 0; currentSpoke < this.numPetals; ++currentSpoke)
            {
               rot_point = my2d.rotatePoint( 0.0, guideLength, currentRotation)

               halfGuideLines.push( new my2d.Line({x:0, y:0}, {x:rot_point.x, y:rot_point.y}))

               currentRotation += radiansPerSpoke
            }
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
         gLines = []
         if ( null != this.lastRenderedGuides )
         {
            gLines = this.lastRenderedGuides.guideLines
         }
         else
         {
            lines = this.RenderGuides(10)
            gLines = lines.guideLines
         }

         closestDistanceSoFar = Number.MAX_VALUE;
         closestLine = null

         gLines.forEach( function(currentLine)
         {
            currentDistance = my2d.distancePointToLine(point, currentLine)

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
         points = []

         const radiansPerSpoke = my2d.TWO_PI / this.numPetals
         let currentRotation = 0.0

         reflectedPoint = null
         if ( this.mirrorLine )
         {
            reflectedPoint = my2d.reflectPoint(point, this.mirrorLine)
         }

         for (var currentSpoke = 0; currentSpoke < this.numPetals; ++currentSpoke)
         {
            rot_point = my2d.rotatePoint( point.x, point.y, currentRotation)

            points.push(rot_point)

            if ( null != reflectedPoint )
            {
               points.push(my2d.rotatePoint(reflectedPoint.x, reflectedPoint.y, currentRotation))
            }

            currentRotation += radiansPerSpoke
         }

         return points
      }.bind(this)  // end ReflectPoints()

      // -----------------------------------------------------------------------
      // receives: parameters:{p1:{x,y}, p2:{x,y} }
      // notes: assumes line is in mandala space
      // reflects line around center of mandala, once for each petal
      // returns: [ { p1:{x,y}, p2:{x,y} } ]
      this.RenderLine = function(parameters)
      {
         const radiansPerSpoke = my2d.TWO_PI / this.numPetals
         let currentRotation = 0.0

         lines = []

         startPoints = this.ReflectPoints(parameters.p1)
         endPoints = this.ReflectPoints(parameters.p2)

         var currentPointIndex = 0
         for ( currentPointIndex = 0; currentPointIndex < startPoints.length; currentPointIndex++ )
         {
            lines.push( { p1:startPoints[currentPointIndex],
                           p2:endPoints[currentPointIndex]})
         }

         return lines
      }  // end RenderLine()

   },

}  // end Mandala
