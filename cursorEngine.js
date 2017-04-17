
var CursorEngine =
{
   // config : {cursorMoveCallback:func(point)}
   CursorEngine:function(config)
   {
      // expected in pixels/second
      this.mouseSpeed = 0

      // -----------------------------------------------------------------------
      this.advanceNoSmooth = function()
      {
         //Object.assign(this.currentPoint, this.targetPoint)
         this.currentPoint.set(this.targetPoint)

         clearInterval(this.tickIntervalFunc)
         this.tickIntervalFunc = null
      }
      // -----------------------------------------------------------------------
      this.advanceByScale = function()
      {
         // three speed seems to work pretty well
         if (this.mouseSpeed <= 50)
         {
            factor = 0.25
         }
         else if (this.mouseSpeed <=100)
         {
            factor = 0.45
         }
         else
         {
            factor = 1.0
         }

         debugDiv.add('cursorBlend', `blend:${factor}`)

         currentDelta = this.currentPoint.delta(this.targetPoint)

         if (currentDelta.length() < 1)
         {
            this.currentPoint.set(this.targetPoint)
            clearInterval(this.tickIntervalFunc)
            this.tickIntervalFunc = null
         }
         else
         {
            this.currentPoint.translateEq(currentDelta.scale(factor).p2)
         }
      }
      // -----------------------------------------------------------------------
      // this.numMovesToTrack = 5
      // this.lastNMovements = []
      // this.lastTarget = null
      // for (i = 0; i < this.numMovesToTrack; ++i)
      // {
      //    this.lastNMovements[i] = my2d.Point(0,0)
      // }

      this.advanceByDirSmooth = function()
      {
         // add this movement
         if (null == this.lastTarget)
         {
            // this.lastTarget = Object.assign({}, this.targetPoint)
            this.lastTarget = new fnc2d.Point(this.targetPoint)
         }
      }

      this.cursorMoveCallback = config.cursorMoveCallback

      this.currentPoint = null
      this.targetPoint = null

      this.tickIntervalFunc = null
      // this.advanceFunc = this.advanceNoSmooth
      this.advanceFunc = this.advanceByScale

      // -----------------------------------------------------------------------
      this.tick = function()
      {
         this.advanceFunc()

         if ( this.cursorMoveCallback )
         {
            this.cursorMoveCallback(this.currentPoint)
         }
      }

      // -----------------------------------------------------------------------
      this.setTargetPoint = function(point)
      {
         // just starting? move directly to point
         if (null == this.targetPoint)
         {
            this.targetPoint = new fnc2d.Point(point)
            this.currentPoint = new fnc2d.Point(point)
         }
         else
         {
            this.targetPoint.set(point)

            if (null == this.tickIntervalFunc)
            {
               this.tickIntervalFunc = setInterval(this.tick.bind(this), 1000 / 60)
            }
         }
      }
   }
}
