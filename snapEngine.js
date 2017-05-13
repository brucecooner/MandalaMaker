'use strict';

var PointBucket =
{
   PointBucket:function(lowerBound, upperBound)
   {
      this.points = []; // { coords:fnc2d.Point, radius:number }

      this.boundingBox = new fnc2d.Line( lowerBound, upperBound );
   }
}

// --------------------------------------------------------------------------
PointBucket.PointBucket.prototype.pointInside = function(point)
{
   let inside = false;
   if (     (point.x >= this.boundingBox.p1.x)
         && (point.x <= this.boundingBox.p2.x)
         && (point.y >= this.boundingBox.p1.y)
         && (point.y <= this.boundingBox.p2.y))
   {
      inside = true;
   }
   return inside;
}

// --------------------------------------------------------------------------
// gets snap point within radius distance of parameter point
// notes:
//    - WILL EARLY OUT ON FIRST POINT THAT MEETS CRITERIA!
//    - can return null
// receives : fnc2d.Point
// returns : {coords, radius, name}
PointBucket.PointBucket.prototype.getSnapPoint = function(point)
{
   let foundPoint = null;

   this.points.forEach( function(currentPoint)
   {
      let curDistance = new fnc2d.Line(point, currentPoint.coords).length();

      if (curDistance < currentPoint.radius)
      {
         foundPoint = currentPoint;
         return false;
      }
   });

   return foundPoint ? foundPoint : null;
}

// --------------------------------------------------------------------------
PointBucket.PointBucket.prototype.updateBoundingBox = function(point)
{
   this.boundingBox.p1.x = Math.min(this.boundingBox.p1.x, point.coords.x - point.radius);
   this.boundingBox.p2.x = Math.max(this.boundingBox.p2.x, point.coords.x + point.radius);

   this.boundingBox.p1.y = Math.min(this.boundingBox.p1.y, point.coords.y - point.radius);
   this.boundingBox.p2.y = Math.max(this.boundingBox.p2.y, point.coords.y + point.radius);
}

// --------------------------------------------------------------------------
PointBucket.PointBucket.prototype.addPoint = function(point)
{
   let added = false;
   let foundPoint = this.getSnapPoint(point);

   if (null === foundPoint)
   {
      this.points.push(point);

      this.updateBoundingBox(point);

      added = true;
   }
   else
   {
      console.log(`snap point not added`)
   }

   return added;
}

// =============================================================================
var SnapEngine =
{
   // --------------------------------------------------------------------------
   SnapEngine:function(config)
   {
      // main list
      this.snapPoints = [];
      // currently bucketed by quadrant (technically a depth-1 quad-tree I think)
      // HOWEVER! We will let the bounding boxes 'bleed' into other quadrants, as
      // these points have a distance associated with them. Yeah there are probably better
      // ways to store/hash geometric entities. I should look some up.
      // may need finer hash eventually?
      // note : currently trying to follow convention of keeping line.p1 closer to origin
      this.pointBucketsObj = {   xp_yp:new PointBucket.PointBucket( [0,0], [1, 1]),
                                 xp_yn:new PointBucket.PointBucket( [0,0], [1,-1]),
                                 xn_yp:new PointBucket.PointBucket( [0,0], [-1,1]),
                                 xn_yn:new PointBucket.PointBucket( [0,0], [-1,-1]) };

      this.pointBucketsList = [ this.pointBucketsObj['xp_yp'],
                                 this.pointBucketsObj['xp_yn'],
                                 this.pointBucketsObj['xn_yp'],
                                 this.pointBucketsObj['xn_yn']];

      // creation order
      this.currentOrder = 0;

      // -----------------------------------------------------------------------
      // generate list key for given point
      this.getPointBucketKey = function(point)
      {
         let xkey = point.x >= 0 ? 'xp' : 'xn';
         let ykey = point.y >= 0 ? 'yp' : 'yn';

         return `${xkey}_${ykey}`
      }

      // -----------------------------------------------------------------------
      // finds all point buckets that specified point may overlap
      // receives : fnc2d.Point()
      // returns : [PointBucket]
      this.getOverlappingPointBuckets = function(point)
      {
         let buckets = [];

         this.pointBucketsList.forEach( function(currentBucket)
         {
            if (currentBucket.pointInside(point))
            {
               buckets.push(currentBucket);
            }
         })

         return buckets;
      }

      // -----------------------------------------------------------------------
      // note : can return null
      this.getSnapPoint = function(point)
      {
         let buckets = this.getOverlappingPointBuckets(point);

         let foundPoint = null;

         buckets.forEach( function(currentBucket)
         {
            foundPoint = currentBucket.getSnapPoint(point)
            return false;
         })

         return foundPoint ? foundPoint : null;
      }

      // -----------------------------------------------------------------------
      // note : will not create point that overlaps existing point
      // todo : use worker ?
      // returns : name of new point, null if not added
      this.addSnapPoint = function(point, radius)
      {
         let name = `pt_${this.currentOrder}`
         this.currentOrder += 1;

         let newPoint = { coords:point, radius:radius, name:name };

         let bucketKey = this.getPointBucketKey(point);
         let added = this.pointBucketsObj[bucketKey].addPoint(newPoint);

         if (added)
         {
            this.snapPoints.push(newPoint);
         }

         return added ? newPoint : null;
      }

   }  // end SnapEngine constructor
}
