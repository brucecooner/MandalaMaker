
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

      this.cursorMoveCallback = config.cursorMoveCallback

      this.currentPoint = new Point( 0, 0 )
      this.targetPoint = new Point( 0, 0 )

      this.tickIntervalFunc = null
      this.advanceFunc = this.advanceNoSmooth

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
         Object.assign(this.targetPoint, point)

         if (null == this.tickIntervalFunc)
         {
            this.tickIntervalFunc = setInterval(this.tick.bind(this), 1000 / 30)
         }
      }
   }
}
