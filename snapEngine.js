'use strict';

var SnapEngine =
{
   // --------------------------------------------------------------------------
   SnapEngine:function(config)
   {
      // main list
      this.snapPoints = [];
      // currently bucketed by x,y Positive, Negative
      // may need finer hash eventually
      this.pointBuckets = { xp_yp:[], xp_yn:[], xn_yp:[], xn_yn:[] };

      // creation order
      this.currentOrder = 0;

      // -----------------------------------------------------------------------
      // gets list key in pointBuckets for given point
      this.getPointBucketKey = function(point)
      {
         let xkey = point.x >= 0 ? 'xp' : 'xn';
         let ykey = point.y >= 0 ? 'yp' : 'yn';

         return `${xkey}_${ykey}`
      }

      // -----------------------------------------------------------------------
      this.addSnapPoint = function(point, permanent = false)
      {
         let newPoint = {point:point, order:this.currentOrder, permanent:permanent};
         this.curentOrder += 1;

         this.snapPoints.push(newPoint)

         let bucketKey = this.getPointBucketKey(point)
         this.pointBuckets[bucketKey].push(newPoint)

         return newPoint;
      }

      // -----------------------------------------------------------------------
      
   }
}
