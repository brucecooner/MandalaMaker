// TODO: better names, standardize object format, lowercase P1,P2
// AND NAMESPACE THIS

const TWO_PI = 3.14159 * 2.0

// -----------------------------------------------------------------------------
function Point( x, y )
{
   this.x = x
   this.y = y
}

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
// receives: line{ P1:{x,y}, P2:{x,y}}
// returns: number
function lineLength(line)
{
   return distanceBetweenPoints( line.P1, line.P2)
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

   denominator = Math.sqrt( square(line.P2.y - line.P1.y) + square(line.P2.x - line.P1.x) )

   return numerator / denominator
}

// -----------------------------------------------------------------------------
// technically the difference (p2 - p1), delta can be confused with distance
// receives : point1|point2:{x,y}
// returns : point:{x,y}
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
   // assuming line and point are in same coordinate space, of course, let's move
   // both to the origin so maths is easier
   lineLocal = line
   lineLocal.P2.x -= line.P1.x
   lineLocal.P2.y -= line.P1.y

   pointLocal = point
   pointLocal.x -= line.P1.x
   pointLocal.y -= line.P1.y

   lineLen = lineLength(lineLocal)

   lineStartToPoint = { P1:{x:0,y:0}, P2:pointLocal }
   lineStartToPointLen = lineLength(lineStartToPoint)

   oneOverLineLen = 1 / lineLen
   oneOverLineToPointLen = 1 / lineStartToPointLen

   unitLine = scaleLine(oneOverLineLen, lineLocal)
   unitLineToPoint = scaleLine(oneOverLineToPointLen, lineStartToPoint)

   dotP = dotProduct(unitLine, unitLineToPoint)

   projectedPoint = scaleLine(dotP * lineStartToPointLen, unitLine).P2

   // line from point to projectedPoint
   pointToProjectedPointDelta = delta( pointLocal, projectedPoint )
   pointToProjectedPointDelta.x *= 2
   pointToProjectedPointDelta.y *= 2

   // add original point to put projected point back into original space
   return { x:point.x + pointToProjectedPointDelta.x, y:point.y + pointToProjectedPointDelta.y}
}
