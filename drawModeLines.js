var DrawModeLines =
{
   DrawModeLines:function(drawEngine)
   {
      this.name = 'lines'
      this.drawEngine = drawEngine

      this.onMouseMove = function(event)
      {
         console.log(`${this.name} - onMouseMove()`)
      }.bind(this)
      this.onMouseUp = function(event)
      {
         console.log(`${this.name} - onMouseUp()`)
      }.bind(this)
      this.onMouseDown = function(event)
      {
         console.log(`${this.name} - onMouseDown()`)
      }.bind(this)

   }
}
