var Mandala =
{
   minPetals:2,
   maxPetals:20,

   // --------------------------------------------------------------------------
   NewConfig:function()
   {
      // defaults go here
      templateConfig =
      {
         numPetals:6,         // number of radial symmetry guides
         petalsOffset:0.0,     // how far from zero to half, to rotate the guides
         drawHalfGuides:false,
         // TODO:
         guideOpacity:0.5,    // TODO: opacity of symmetry guides
         // numPartialGuides:0, // how many sub-guides to draw between main spokes
      }

      return Object.create(templateConfig)
   },

   // --------------------------------------------------------------------------
   RenderGuides:function(canvasElement, config)
   {
      const radiansPerSpoke = TWO_PI / config.numPetals
      let currentRotation = 0.0

      boundRect = canvasElement.getBoundingClientRect();

      const centerX = boundRect.width / 2.0
      const centerY = boundRect.height / 2.0

      const lineLength = boundRect.height / 2.0

      var ctx = canvasElement.getContext("2d");
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctx.setLineDash([0,0]);

      canvasElement.style.opacity = config.guideOpacity

      var offsetRotation = radiansPerSpoke * 0.5 * config.petalsOffset
      currentRotation += offsetRotation

      for (var currentSpoke = 0; currentSpoke < config.numPetals; ++currentSpoke)
      {
         rot_point = rotatePoint( 0.0, lineLength, currentRotation)

         ctx.beginPath()
         ctx.moveTo( centerX, centerY )
         ctx.lineTo( centerX + rot_point.x,centerY + rot_point.y)
         ctx.stroke()

         currentRotation += radiansPerSpoke
      }

      if (config.drawHalfGuides)
      {
         ctx.setLineDash([5,3])
         currentRotation = offsetRotation + (radiansPerSpoke * 0.5)

         for (var currentSpoke = 0; currentSpoke < config.numPetals; ++currentSpoke)
         {
            rot_point = rotatePoint( 0.0, lineLength, currentRotation)

            ctx.beginPath()
            ctx.moveTo( centerX, centerY )
            ctx.lineTo( centerX + rot_point.x, centerY + rot_point.y)
            ctx.stroke()

            currentRotation += radiansPerSpoke
         }
      }

   },
}  // end Mandala

// -----------------------------------------------------------------------------
// function mandala_renderGuides(canvasElement, config)
// {
//    const radiansPerSpoke = TWO_PI / config.numPetals
//    let currentRotation = 0.0
//
//    boundRect = canvasElement.getBoundingClientRect();
//
//    const centerX = boundRect.width / 2.0
//    const centerY = boundRect.height / 2.0
//
//    const lineLength = boundRect.height / 2.0
//
//    var ctx = canvasElement.getContext("2d")
//    ctx.clearRect(0, 0, cvs.width, cvs.height)
//    ctx.setLineDash([0,0])
//
//    canvasElement.style.opacity = config.guideOpacity
//
//    if (config.guideOpacity <= 0)
//    {
//       return
//    }
//
//    for (var currentSpoke = 0; currentSpoke < config.numPetals; ++currentSpoke)
//    {
//       rot_point = rotatePoint( 0.0, lineLength, currentRotation)
//       // rot_point.x *= centerX
//       // rot_point.y *= centerY
//
//       ctx.beginPath();
//       ctx.moveTo( centerX, centerY )
//       ctx.lineTo( centerX + rot_point.x,centerY + rot_point.y);
//       ctx.stroke();
//
//       currentRotation += radiansPerSpoke
//    }
//
//    let currentHalf = 0  // debug
//
//    if (config.numPartialGuides > 0)
//    {
//       let currentHalfRotation = radiansPerSpoke / (config.numPartialGuides + 1)
//
//       ctx.setLineDash([5, 3]);
//
//       for (var currentSpoke = 0; currentSpoke < config.numPetals; ++currentSpoke)
//       {
//          halfrot_point = rotatePoint( 0.0, lineLength, currentHalfRotation)
//          // halfrot_point.x *= centerX
//          // halfrot_point.y *= centerY
//          ctx.beginPath();
//          ctx.moveTo( centerX, centerY )
//          ctx.lineTo( centerX + halfrot_point.x,centerY + halfrot_point.y);
//          ctx.stroke();
//
//          currentHalfRotation += radiansPerSpoke
//
//          currentHalf += 1
//          console.log(`render half : ${currentHalf}`)
//       }
//    }

}
