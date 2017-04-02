var ColorJourney =
{
   // --------------------------------------------------------------------------
   // receives : config =
   // { node:element to change color on,
   //    departureTime:ms before color journey begins
   //    changePeriod:ms between new colors}
   ColorJourney:function(config)
   {
      this.journeyNode = config.node
      this.changePeriod = config.changePeriod

      // --------------------------------------------------------------------------
      randomValue = function(floor, ceiling)
      {
         return Math.floor(Math.random() * (ceiling-floor)) + floor
      }

      // --------------------------------------------------------------------------
      dropTwoComponents = function(rgb)
      {
         choose  = Math.floor(Math.random() * 3)
         switch (choose)
         {
            case 0 :
               dropped1 = 0
               dropped2 = 1
               kept = 2
               break
            case 1 :
               kept = 0
               dropped1 = 1
               dropped2 = 2
               break
            default:
            case 2 :
               dropped1 = 0
               kept = 1
               dropped2 = 2
         }

         rgb[dropped1] = '00'
         rgb[dropped2] = '00'

         // avoid full bright pure colors
         rgb[kept] = randomValue(185, 225).toString(16)
      }

      // --------------------------------------------------------------------------
      generateRandomColor = function()
      {
         const min = 170
         const max = 255

         var rgb = [
            randomValue(min, max).toString(16),
            randomValue(min, max).toString(16),
            randomValue(min, max).toString(16)]

         // drop a component...or two
         if (Math.random() < 0.5)
         {
            if (Math.random() < 0.25)
            {
               // console.log(`colorjourney:dropping two components`)

               dropTwoComponents(rgb)
            }
            else
            {
               // console.log(`colorjourney:dropping one component`)
               rgb[Math.floor(Math.random() * 3)] = '00'
            }
         }

         return `#${rgb[0]}${rgb[1]}${rgb[2]}`
      }

      // --------------------------------------------------------------------------
      this.getNextColor = function()
      {
         nextColor = generateRandomColor()
         console.log(`next destination:${nextColor}`)

         this.journeyNode.style['background-color'] = nextColor
         this.journeyNode.style.transition = `all ${this.changePeriod}s`

         setTimeout(this.getNextColor.bind(this), this.changePeriod * 1000)
      }

      console.log(`color journey leaves in ${config.departureTime} seconds`)
      setTimeout( this.getNextColor.bind(this), config.departureTime * 1000 )
   }  // end constructor
}
