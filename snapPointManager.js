'use strict;';

// =============================================================================
var SnapPoint =
{
   SnapPoint:function(center, radius, name)
   {
      this.center = center;
      this.radius = radius;
      this.radiusSquared = radius * radius;
      this.name = name;
   }
}

// =============================================================================
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
         let foundPoint = null;

         let stripeIndexStr = `${this.getStripeIndex(point.x)}`;

         if (this.stripes.hasOwnProperty(stripeIndexStr))
         {
            this.stripes[stripeIndexStr].forEach( function(currentSnapPoint)
            {
               let currentDistanceSquared = new fnc2d.Line(point, currentSnapPoint.center).lengthSquared();

               if (currentDistanceSquared <= currentSnapPoint.radiusSquared)
               {
                  foundPoint = currentSnapPoint;
                  return false;
               }
            })
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
   } // end SnapPointManager()
}
