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

      this.playing = true
      this.timeoutCallbackId = null

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

      // -----------------------------------------------------------------------
      this.clearCurrentTimeout = function()
      {
         if (null != this.timeoutCallbackId)
         {
            clearTimeout(this.timeoutCallbackId)
         }
      }

      // -----------------------------------------------------------------------
      this.setNextTimeout = function()
      {
         this.clearCurrentTimeout()
         this.timeoutCallbackId = setTimeout(this.setupNextDestination.bind(this), this.changePeriod * 1000)
      }

      // -----------------------------------------------------------------------
      this.setupNextDestination = function()
      {
         nextColor = generateRandomColor()
         console.log(`next destination:${nextColor}`)

         this.journeyNode.style.transition = `background-color ${this.changePeriod}s`
         this.journeyNode.style['transition-timing-function'] = 'linear'
         this.journeyNode.style['background-color'] = nextColor

         this.setNextTimeout()
      }

      // -----------------------------------------------------------------------
      // returns new play status
      this.togglePlaying = function()
      {
         this.playing = !this.playing

         if (false == this.playing)
         {
            console.log('journey paused')
            if (null != this.timeoutCallbackId)
            {
               this.clearCurrentTimeout()
               currentColor = this.journeyNode.style['background-color']
               this.journeyNode.style['background-color'] = currentColor
               this.journeyNode.style.transition = ''
            }
         }
         else
         {
            console.log(`color journey resuming`)
            this.setupNextDestination()
         }

         return this.playing
      }

      // -----------------------------------------------------------------------
      this.nextColor = function()
      {
         nextColor = generateRandomColor()
         console.log(`force change:${nextColor}`)
         this.journeyNode.style.transition = `background-color 0s`
         this.journeyNode.style['background-color'] = nextColor

         // this.setupNextDestination() weird that it works w/o this
      }

      // -----------------------------------------------------------------------
      this.setSpeed = function(newTime)
      {
         console.log(`color journey speed set:${newTime}`)
         this.changePeriod = newTime

         if (this.playing)
         {
            this.setupNextDestination()
         }
      }

      console.log(`color journey leaves in ${config.departureTime} seconds`)
      this.timeoutCallbackId = setTimeout( this.setupNextDestination.bind(this), config.departureTime * 1000 )
   }  // end constructor
}
