const TWO_PI = 3.14159 * 2.0

// -----------------------------------------------------------------------------
function rotatePoint(x, y, radians)
{
   var cos = Math.cos(radians),
     sin = Math.sin(radians)
   //   x = this.x,
   //   y = this.y;

   var rot_x = x * cos - y * sin
   var rot_y = x * sin + y * cos
   return {x:rot_x, y:rot_y}
};

// -----------------------------------------------------------------------------
function square(val)
{ return val * val }

// -----------------------------------------------------------------------------
// receives : point1|point2:{x,y}
function distanceBetweenPoints(point1, point2)
{
   let xDiff = point2.x - point1.x
   let yDiff = point2.y - point1.y
   return Math.sqrt((xDiff * xDiff) + (yDiff * yDiff))
}

// -----------------------------------------------------------------------------
// receives: line1|line2:{P1:{x,y}, P2:{x,y}}
function dotProduct(line1, line2)
{
   return ((line1.P2.x - line1.P1.x) * (line2.P2.x - line2.P1.x))
            + ((line1.P2.y - line1.P1.y) * (line2.P2.y - line2.P1.y))
}

// -----------------------------------------------------------------------------
// receives : point: {x,y}, line:{P1:{x,y}, P2:{x,y}}
function distancePointToLine( point, line)
{
   numerator = Math.abs((line.P2.y - line.P1.y) * point.x - (line.P2.x - line.P1.x) * point.y + line.P2.x*line.P1.y - line.P2.y*line.P1.x)

   denominator = Math.sqrt( square(line.P2.y - line.P1.y) + square(line.P1.x - line.P1.x) )

   return numerator / denominator
}

// -----------------------------------------------------------------------------
// receives : point1|point2:{x,y}
function delta( point1, point2 )
{
   return { x:point2.x - point1.x, y:point2.y - point1.y}
}

// -----------------------------------------------------------------------------
// receives: scale:number, line:{P1:{x,y}, P2:{x,y}}
function scaleLine(scale, line)
{
   return { P1:{x:line.P1.x * scale, y:line.P1.y * scale},
            P2:{x:line.P2.x * scale, y:line.P2.y * scale}}
}

// -----------------------------------------------------------------------------
// receives: point:{x,y}, line:{P1|p2:{x,y}}
function reflectPoint( point, line )
{
   lineLength = distanceBetweenPoints( line.P1, line.P2 )
   lineStartToPoint = { P1:{x:0,y:0}, P2:{ x:point.x - line.P1.x, y:point.y - line.P1.y}}
   lineDelta = { P1:{x:0, y:0}, P2:delta(point, line.P1)}

   oneOverLength = 1 / lineLength

   unitLine = scaleLine(oneOverLength, lineDelta)

   dotP = dotProduct(unitLine, lineStartToPoint)

   projectedPoint = scaleLine(dotP, unitLine)

   // TODO: finish
   return projectedPoint

}
