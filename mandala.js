// Notes:
// -assumes points are always in 'mandala' space (already relative to center)
var Mandala =
{
   // --- consts ---
   minPetals:2,
   maxPetals:20,

   // --- constructor-ish ---
   Mandala:function()
   {
      this.numPetals = 6
      this.petalsOffset = 0.0
      this.drawHalfGuides = false

      // --------------------------------------------------------------------------
      // renders a series of lines to represent the spokes that form the guide
      // returns : { guideLines:[{lineStart:{x,y}}, lineEnd:{x,y}}],
      //             halfGuideLines:[ { lineStart:{x,y}, lineEnd:{x,y} } ]}
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

            guideLines.push( {lineStart:{x:0, y:0}, lineEnd:{x:rot_point.x, y:rot_point.y}})

            currentRotation += radiansPerSpoke
         }

         if (this.drawHalfGuides)
         {
            currentRotation = offsetRotation + (radiansPerSpoke * 0.5)

            for (var currentSpoke = 0; currentSpoke < this.numPetals; ++currentSpoke)
            {
               rot_point = rotatePoint( 0.0, guideLength, currentRotation)

               halfGuideLines.push( {lineStart:{x:0, y:0}, lineEnd:{x:rot_point.x, y:rot_point.y}})

               currentRotation += radiansPerSpoke
            }
         }

         return { guideLines:guideLines, halfGuideLines:halfGuideLines }
      }  // end RenderGuides()

      // -----------------------------------------------------------------------
      // returns array of points reflected around, once for each petal
      // receives: point: {x,y}
      // returns: [ {x,y}, ... ]
      this.ReflectPoints = function(point)
      {
         points = []

         const radiansPerSpoke = TWO_PI / this.numPetals
         let currentRotation = 0.0

         for (var currentSpoke = 0; currentSpoke < this.numPetals; ++currentSpoke)
         {
            rot_point = rotatePoint( point.x, point.y, currentRotation)

            points.push(rot_point)

            currentRotation += radiansPerSpoke
         }

         return points
      }  // end ReflectPoints()

      // -----------------------------------------------------------------------
      // receives: parameters:{lineStart:{x,y}, lineEnd:{x,y} }
      // notes: assumes line is in mandala space
      // reflects line around center of mandala, once for each petal
      // returns: [ { lineStart:{x,y}, lineEnd:{x,y} } ]
      this.RenderLine = function(parameters)
      {
         const radiansPerSpoke = TWO_PI / this.numPetals
         let currentRotation = 0.0

         lines = []

         startPoints = this.ReflectPoints(parameters.lineStart)
         endPoints = this.ReflectPoints(parameters.lineEnd)

         var currentPointIndex = 0
         for ( currentPointIndex = 0; currentPointIndex < startPoints.length; currentPointIndex++ )
         {
            lines.push( { lineStart:startPoints[currentPointIndex],
                           lineEnd:endPoints[currentPointIndex]})
         }

         return lines
      }  // end RenderLine()

   },

}  // end Mandala
