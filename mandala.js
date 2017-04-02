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
      // returns : { guideLines:[{P1:{x,y}}, P2:{x,y}}],
      //             halfGuideLines:[ { P1:{x,y}, P2:{x,y} } ]}
      this.RenderGuides = function(guideLength)
      {
         const radiansPerSpoke = TWO_PI / this.numPetals
         let currentRotation = 0.0

         guideLines = []
         halfGuideLines = []

         var offsetRotation = radiansPerSpoke * this.petalsOffset
         currentRotation += offsetRotation

         for (var currentSpoke = 0; currentSpoke < this.numPetals; ++currentSpoke)
         {
            rot_point = rotatePoint( 0.0, guideLength, currentRotation)

            guideLines.push( {P1:{x:0, y:0}, P2:{x:rot_point.x, y:rot_point.y}})

            currentRotation += radiansPerSpoke
         }

         if (this.drawHalfGuides)
         {
            currentRotation = offsetRotation + (radiansPerSpoke * 0.5)

            for (var currentSpoke = 0; currentSpoke < this.numPetals; ++currentSpoke)
            {
               rot_point = rotatePoint( 0.0, guideLength, currentRotation)

               halfGuideLines.push( {P1:{x:0, y:0}, P2:{x:rot_point.x, y:rot_point.y}})

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
            currentDistance = distancePointToLine(point, currentLine)

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

         const radiansPerSpoke = TWO_PI / this.numPetals
         let currentRotation = 0.0

         reflectedPoint = null
         if ( this.mirrorLine )
         {
            reflectedPoint = reflectPoint(point, this.mirrorLine)
         }

         for (var currentSpoke = 0; currentSpoke < this.numPetals; ++currentSpoke)
         {
            rot_point = rotatePoint( point.x, point.y, currentRotation)

            points.push(rot_point)

            if ( null != reflectedPoint )
            {
               points.push(rotatePoint(reflectedPoint.x, reflectedPoint.y, currentRotation))
            }

            currentRotation += radiansPerSpoke
         }

         return points
      }  // end ReflectPoints()

      // -----------------------------------------------------------------------
      // receives: parameters:{P1:{x,y}, P2:{x,y} }
      // notes: assumes line is in mandala space
      // reflects line around center of mandala, once for each petal
      // returns: [ { P1:{x,y}, P2:{x,y} } ]
      this.RenderLine = function(parameters)
      {
         const radiansPerSpoke = TWO_PI / this.numPetals
         let currentRotation = 0.0

         lines = []

         startPoints = this.ReflectPoints(parameters.P1)
         endPoints = this.ReflectPoints(parameters.P2)

         var currentPointIndex = 0
         for ( currentPointIndex = 0; currentPointIndex < startPoints.length; currentPointIndex++ )
         {
            lines.push( { P1:startPoints[currentPointIndex],
                           P2:endPoints[currentPointIndex]})
         }

         return lines
      }  // end RenderLine()

   },

}  // end Mandala
