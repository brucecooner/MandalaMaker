var DrawModeCurves =
{
   DrawModeCurves:function(drawEngine)
   {
      this.name = 'curves'
      this.drawEngine = drawEngine

      this.point1 = null
      this.point2 = null

      this.onCursorMove = function(event)
      {
      }

      this.onMouseUp = function(event)
      {
         if (this.drawEngine.isRightMouseButton)   // cancel current line
         {
            this.point1 = null
            this.point2 = null
         }
         else
         {
            // which step on?
            if (null == this.point1)
            {
               this.point1 = this.drawEngine.getCursorCoords()
            }
            else if (null == this.point2)
            {
               this.point2 = this.drawEngine.getCursorCoords()
            }
            else if (null == this.point3)
            {
               // commit with current coords as control point
               this.drawEngine.drawOutputGraphics(GraphicsCommands.quadraticCurve(  this.point1,
                                                                                    this.drawEngine.getCursorCoords(),
                                                                                    this.point2 ))
               this.point1 = this.point2
               this.point2 = null
            }
         }  // end else LMB
      }

      this.onMouseDown = function(event)
      {
      }

      this.onMouseOut = function()
      {
         // this.lineStart = null
      }

      // -------------------------------------------------
      this.Start = function()
      {
         this.point1 = null
         this.point2 = null
      }
      this.End = function()
      {
      }

      // -----------------------------------------------------------------------
      // returns : [ [graphicsCommand [, graphicsCommand]]]
      this.getCursorGraphics = function()
      {
         graphics = []

         if (this.point2 !== null && this.point1 !== null)
         {
            // line endpoints defined, draw curve
            graphics.push( GraphicsCommands.quadraticCurve(this.point1, this.drawEngine.getCursorCoords(), this.point2))
         }
         else if (this.point1 !== null & this.point2 === null)
         {
            // first point defined, but not second
            graphics.push( GraphicsCommands.line(this.point1, this.drawEngine.getCursorCoords()))
         }

         return graphics
      }

   }
}
