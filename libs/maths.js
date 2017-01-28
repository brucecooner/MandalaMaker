const TWO_PI = 3.14159 * 2.0

function rotatePoint(x, y, radians)
{
   var cos = Math.cos(radians),
     sin = Math.sin(radians),
   //   x = this.x,
   //   y = this.y;

   rot_x = x * cos - y * sin
   rot_y = x * sin + y * cos
   return {x:rot_x, y:rot_y}
};
