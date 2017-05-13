'use strict;';

// =============================================================================
// basic snap point
var SnapPoint =
{
   SnapPoint:function(center, radius, name)
   {
      this.center = center;
      this.radius = radius;
      this.name = name;
   }
}

// =============================================================================
// for tracking and finding snap points, works by bucketing the points into
// vertical 'stripes' based on their x coordinate
// TODO :
// -remove point
// -report
// -retire points ?
var SnapPointManager =
{
   SnapPointManager:function(stripeWidth)
   {
      this.stripeWidth = stripeWidth;

      // main list, when you gotta get 'em all
      this.snapPoints = []
      // buckets
      this.stripes = {};

      this.currentPointNumber = 0;

      // when you want metrics
      this.profiling = true;
      this.totalSearches = 0;
      this.totalPointComparisons = 0;
      this.lastSearchPointComparisons = 0;

      // -----------------------------------------------------------------------
      this.getStripeIndex = function(x)
      {
         let index = Math.floor(x / this.stripeWidth);

         return index;
      }

      // -----------------------------------------------------------------------
      // calculates stripe indices overlapped by circle
      // receives: fnc2d.Circle
      // returns : [ lowIndex, highIndex ]
      this.getStripeRange = function(center, radius)
      {
         let lowIndex = this.getStripeIndex(center.x - radius);
         let highIndex = this.getStripeIndex(center.x + radius);

         return [ lowIndex, highIndex ];
      }

      // -----------------------------------------------------------------------
      // returns first snap point found that point is <radius from
      // receives: point:{x,y}
      // returns snapPoint, or null
      this.getSnapPoint = function(point)
      {
         let pointComparisons = 0;
         this.lastSearchPointComparisons = 0;

         let foundPoint = null;

         let stripeIndexStr = `${this.getStripeIndex(point.x)}`;

         if (this.stripes.hasOwnProperty(stripeIndexStr))
         {
            this.stripes[stripeIndexStr].forEach( function(currentSnapPoint)
            {
               let currentDistanceSquared = new fnc2d.Line(point, currentSnapPoint.center).lengthSquared();

               this.lastSearchPointComparisons += 1

               if (currentDistanceSquared <= currentSnapPoint.radius * currentSnapPoint.radius)
               {
                  foundPoint = currentSnapPoint;
                  return false;
               }
            }, this)
         }

         if (this.profiling)
         {
            this.totalPointComparisons += this.lastSearchPointComparisons;
         }

         return foundPoint;
      }

      // -----------------------------------------------------------------------
      this.addSnapPoint = function(center, radius)
      {
         let foundPoint = this.getSnapPoint(center);

         if (null === foundPoint)
         {
            let name = `pt_${this.currentPointNumber}`
            this.currentPointNumber += 1;

            let newPoint = new SnapPoint.SnapPoint(center, radius, name)

            let indices = this.getStripeRange(center, radius);

            let that = this;

            var i;
            for (i = indices[0]; i <= indices[1]; i += 1)
            {
               let stripeIndexStr = `${i}`;
               if (false === that.stripes.hasOwnProperty(stripeIndexStr))
               {
                  that.stripes[stripeIndexStr] = [];
               }

               that.stripes[stripeIndexStr].push(newPoint);
            }

            this.snapPoints.push(newPoint)
         }
      }

      // -----------------------------------------------------------------------
      this.report = function()
      {
         console.log(`snapPointManager report:`);
         console.log(`total distinct points:${this.snapPoints.length}`);

         let stripeKeys = Object.keys(this.stripes);
         console.log(`num stripes: ${stripeKeys.length}`)

         for (var currentKey of stripeKeys)
         {
            console.log(`${currentKey} : ${this.stripes[currentKey].length} points`)
         }(this);

         if (this.profiling)
         {
            console.log(`total searches: ${this.totalSearches}`);
            console.log(`ave comparisons per search : ${this.averagePointComparisonsPerSearch}`);
         }

      }

   } // end SnapPointManager()
}
