
var CursorEngine =
{
   // config : {cursorMoveCallback:func(point)}
   CursorEngine:function(config)
   {
      // -----------------------------------------------------------------------
      this.advanceNoSmooth = function()
      {
         Object.assign(this.currentPoint, this.targetPoint)

         clearInterval(this.tickIntervalFunc)
         this.tickIntervalFunc = null
      }
      // -----------------------------------------------------------------------
      this.advanceByScale = function()
      {
         factor = 0.15
         currentDelta = distanceBetweenPoints(this.currentPoint, this.targetPoint)

         if (currentDelta < 1)
         {
            Object.assign(this.currentPoint, this.targetPoint)
            clearInterval(this.tickIntervalFunc)
            this.tickIntervalFunc = null
         }
         else
         {
            lineDelta = delta(this.currentPoint, this.targetPoint)

            this.currentPoint.x += lineDelta.x * factor
            this.currentPoint.y += lineDelta.y * factor
         }
      }
      // -----------------------------------------------------------------------
      this.numMovesToTrack = 5
      this.lastNMovements = []
      this.lastTarget = null
      for (i = 0; i < this.numMovesToTrack; ++i)
      {
         this.lastNMovements[i] = Point(0,0)
      }

      this.advanceByDirSmooth = function()
      {
         // add this movement
         if (null == this.lastTarget)
         {
            this.lastTarget = Object.assign({}, this.targetPoint)
         }
      }

      this.cursorMoveCallback = config.cursorMoveCallback

      this.currentPoint = null
      this.targetPoint = null

      this.tickIntervalFunc = null
      this.advanceFunc = this.advanceNoSmooth
      // this.advanceFunc = this.advanceByScale

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
            this.targetPoint = Object.assign({}, point)
            this.currentPoint = Object.assign({}, point)
         }
         else
         {
            Object.assign(this.targetPoint, point)

            if (null == this.tickIntervalFunc)
            {
               this.tickIntervalFunc = setInterval(this.tick.bind(this), 1000 / 60)
            }
         }
      }
   }
}
