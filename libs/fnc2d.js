;'use strict';

var fnc2d = {

   PI:3.14159,
   HALF_PI:3.14159 * 0.5,
   TWO_PI:3.14159 * 2.0,

   // --------------------------------------------------------------------------
   square:function(val) {
      return val * val;
   },

   // --------------------------------------------------------------------------
   Point:function() {
      this.set(...arguments)
   },

   // --------------------------------------------------------------------------
   Line:function( point1, point2 ) {
      this.p1 = new fnc2d.Point(point1);
      this.p2 = new fnc2d.Point(point2);
   }
}

// -----------------------------------------------------------------------------
// receives:
// no args -> {x:0, y:0}
// number -> {x:number, y:number}
// Object -> {x:Object.x || 0, y:Object.y || 0}
// >2 args -> msg, {x:0, y:0}
fnc2d.Point.prototype.set = function()
{
   if (1 === arguments.length) {
      if (typeof arguments[0] === 'number') {
         this.x = arguments[0];
         this.y = arguments[0];
      }
      else {
         this.x = arguments[0].hasOwnProperty('x') ? arguments[0]['x'] : 0;
         this.y = arguments[0].hasOwnProperty('y') ? arguments[0]['y'] : 0;
      }
   }
   else if (2 === arguments.length) {
      this.x = arguments[0];
      this.y = arguments[1];
   }
   else if (0 === arguments.length) {
      this.x = 0;
      this.y = 0;
   }
   else {
      console.log(`ERROR Point() : unable to construct with ${arguments.length} parameters`)
      this.x = 0;
      this.y = 0;
   }

   return this;
}

// -----------------------------------------------------------------------
// receives : {<x>,<y>}
fnc2d.Point.prototype.translate = function() {
   let translation = new fnc2d.Point(...arguments);

   this.x += translation.x;
   this.y += translation.y;

   return this;
}

// -----------------------------------------------------------------------
fnc2d.Point.prototype.rotate = function(radians) {
   let cos = Math.cos(radians);
   let sin = Math.sin(radians);

   this.x = this.x * cos - this.y * sin;
   this.y = this.x * sin + this.y * cos;

   return this;
}

// -----------------------------------------------------------------------
fnc2d.Point.prototype.str = function() {
   return `(${this.x},${this.y})`;
}

fnc2d.Line.prototype.str = function() {
   return `p1:${this.p1.str()} p2:${this.p2.str()}`;
}



// test it
console.log('<<<<< fnc2d >>>>>>')

// point creation
console.log(`point construction...`);
let point1 = new fnc2d.Point();
console.log(`no params: ${point1.str()}`);
point1 = new fnc2d.Point(11);
console.log(`1 number: ${point1.str()}`);
point1 = new fnc2d.Point(19,73);
console.log(`2 numbers: ${point1.str()}`);
point1 = new fnc2d.Point({x:1});
console.log(`obj (x only): ${point1.str()}`);
point1 = new fnc2d.Point({y:1});
console.log(`obj (y only): ${point1.str()}`);
point1 = new fnc2d.Point({foo:0, bar:11});
console.log(`obj (no x, no y):${point1.str()}`)
point1 = new fnc2d.Point(1,2,3);
console.log(`3 args:${point1.str()}`)

// point translation
point1.set(0).translate({x:10});
console.log(`trans(obj, x:10):${point1.str()}`);
point1.set(0).translate({y:10});
console.log(`trans(obj, y:10):${point1.str()}`);
point1.set(0).translate({x:10,y:10});
console.log(`trans(obj, x:10,y:10):${point1.str()}`);
point1.set(0).translate( new fnc2d.Point(12,12));
console.log(`trans(Point(12,12)):${point1.str()}`);

// rotation?
point1.set(0,1).rotate(fnc2d.HALF_PI);
console.log(`rotate(HALF_PI)):${point1.str()}`);

console.log('<<<<< fnc2d >>>>>>')
