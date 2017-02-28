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
      this.drawHalfGuides = true

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

         var offsetRotation = radiansPerSpoke * 0.5 * this.petalsOffset
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

   },

   // --------------------------------------------------------------------------
   // canvasElement: an html canvas element
   // config : mandala config (see above)
   // parameters : { lineStart, lineEnd }
   // canvasOrigin : { x,y }
   // Notes: automatically repeats line for each petal
   // TODO: cleaner way to represent canvas/origin
   Draw_Line:function(canvasElement, canvasOrigin, config, parameters)
   {
      console.log(`Mandala.DrawLine()`)

      lineStart = parameters.lineStart
      lineEnd = parameters.lineEnd

      // translate from canvas space into 'mandala' space
      // lineStart.x -= canvasOrigin.x
      // lineStart.y -= canvasOrigin.y
      //
      // lineEnd.x -= canvasOrigin.x
      // lineEnd.y -= canvasOrigin.y

      Render_Lines( [{lineStart:lineStart, lineEnd:lineEnd}])

      // TODO: repeat around mandala
   },

}  // end Mandala
