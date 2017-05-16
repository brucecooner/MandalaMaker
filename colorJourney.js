var ColorJourney =
{
   // TODO : better logic and stuff around 'active' and 'playing', they mean subtly different things
   // TODO : CSS is supposed to give you computed values when in transition, but
   // in my experience it's NOT doing that, meaning that if I pause the journey, it
   // will report the current color is the destination color, and even though I clear
   // the transition it will happily continue to transition to that destination color.
   // Yet another reason CSS is so frustrating (like it needed more)
   // Anyway, I'll have to manually roll the transition code myself. Oy.
   // TODO : Since I'm writing my own transition code, change this to use HSL, will
   // make for easier user configurability
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

      this.active = true

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

         if (false === this.playing)
         {
            console.log('journey paused')
            this.clearCurrentTimeout()
            currentColor = this.journeyNode.style['background-color']
            this.journeyNode.style['background-color'] = currentColor
            this.journeyNode.style.transition = 'background-color 0s'
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

      // -----------------------------------------------------------------------
      this.setActive = function(active)
      {
         this.active = active

         if (this.active)
         {
            if (true === this.playing)
            {
               this.setupNextDestination()
            }
         }
         else
         {
            // TODO : magic color, maybe have a default or something?
            this.journeyNode.style.transition = `background-color 0s`
            this.journeyNode.style['background-color'] = '#FFFFFF'
            this.clearCurrentTimeout()
         }
      }

      // -----------------------------------------------------------------------
      this.getStatusText = function()
      {
         let statusText = 'on'

         if (false === this.active)
         {
            statusText = 'off'
         }
         else
         {
            if (false === this.playing)
            {
               statusText = 'paused'
            }
         }

         return statusText
      }

      console.log(`color journey leaves in ${config.departureTime} seconds`)
      this.timeoutCallbackId = setTimeout( this.setupNextDestination.bind(this), config.departureTime * 1000 )
   }  // end constructor
}
