glob.math = {};

glob.math.EPSILON = 0.001;
glob.math.EPSILON_ANGLE = 0.0001;
glob.math.resultRect = {x:0, y:0, w:0, h:0};
glob.math.COS_TABLE = [];
glob.math.SIN_TABLE = [];
glob.math.TABLE_SIZE = 2048;
glob.math.TWO_PI = 2 * Math.PI;

// Lookups --------------------------------------------------------------------
glob.math.buildTables = function() {
  var i = 0;

  for (i=0; i<glob.math.TABLE_SIZE; ++i) {
    glob.math.COS_TABLE.push(Math.cos(2 * Math.PI * i / glob.math.TABLE_SIZE));
    glob.math.SIN_TABLE.push(Math.sin(2 * Math.PI * i / glob.math.TABLE_SIZE));
  }
};

glob.math.trigTransition = function(param) {
  param = Math.min(param, 1);
  param = Math.max(0, param);

  return (1 - glob.math.cos(Math.PI * param)) * 0.5;
};

glob.math.cos = function(angle) {
  var branchCut = Math.floor(angle / glob.math.TWO_PI),
      lowIndex = 0,
      highIndex = 0,
      result = 0;

  angle = angle - branchCut * glob.math.TWO_PI;

  // Angle is now in the range [0, 2PI).
  
  lowIndex = glob.math.TABLE_SIZE * angle / glob.math.TWO_PI;
  highIndex = Math.floor(lowIndex);

  if (Math.abs(lowIndex - highIndex) > glob.math.EPSILON ) {
    // LERP to final result.
    result = glob.math.COS_TABLE[highIndex] * (1 - (lowIndex - highIndex));
    highIndex += 1;
    result += glob.math.COS_TABLE[highIndex] * (1 - (highIndex - lowIndex));
  }
  else {
    result = glob.math.COS_TABLE[highIndex];
  }

  return result;
};

glob.math.sin = function(angle) {
  var branchCut = Math.floor(angle / glob.math.TWO_PI),
      lowIndex = 0,
      highIndex = 0,
      result = 0;

  angle = angle - branchCut * glob.math.TWO_PI;

  // Angle is now in the range [0, 2PI).
  
  lowIndex = glob.math.TABLE_SIZE * angle / glob.math.TWO_PI;
  highIndex = Math.floor(lowIndex);

  if (Math.abs(lowIndex - highIndex) > glob.math.EPSILON ) {
    // LERP to final result.
    result = glob.math.SIN_TABLE[highIndex] * (1 - (lowIndex - highIndex));
    highIndex += 1;
    result += glob.math.SIN_TABLE[highIndex] * (1 - (highIndex - lowIndex));
  }
  else {
    result = glob.math.SIN_TABLE[highIndex];
  }

  return result;
};

glob.math.tan = function(angle) {
  var sin = glob.math.sin(angle),
      cos = glob.math.cos(angle),
      result = cos ? sin / cos : undefined;

  return result;
};

// Rectangles ----------------------------------------------------------------
glob.math.rect2 = function(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
};

glob.math.rectContainsPoint = function(r, x, y) {
  return (x >= r.x &&
          x <= r.x + r.w &&
          y >= r.y &&
          y <= r.y + r.h);
},

glob.math.clip = function(r1, r2) {
  var rt = null,
      result = glob.math.resultRect;

  // Ensure that r1.w < r2.w.
  if (r2.w < r1.w) {
    rt = r1;
    r1 = r2;
    r2 = rt;
  }

  if (r1.x + r1.w < r2.x ||
      r1.x > r2.x + r2.w) {
    // No overlap.
    result = null;
  }
  else {
    result.x = Math.max(r1.x, r2.x);
    result.w = Math.min(r1.x + r1.w, r2.x + r2.w) - result.x;
  }

  if (result) {
    if (r2.h < r1.h) {
      rt = r1;
      r1 = r2;
      r2 = rt;
    }

    if (r1.y + r1.h < r2.y ||
        r1.y > r2.y + r2.h) {
      // No overlap.
      result = null;
    }
    else {
      result.y = Math.max(r1.y, r2.y);
      result.h = Math.min(r1.y + r1.h, r2.y + r2.h) - result.y;
    }
  }

  return result;
};

// 2D Vectors ----------------------------------------------------------------
glob.math.vec2 = function(x, y) {
  this.x = x;
  this.y = y;
};

glob.math.vec2.prototype.distSqFrom = function(vOther) {
  var dx = this.x - vOther.x;
  var dy = this.y - vOther.y;

  return dx * dx + dy * dy;
};

glob.math.vec2.prototype.dotWith = function(vOther) {
  return this.x * vOther.x + this.y * vOther.y;
};

glob.math.vec2.prototype.crossWith = function(vOther) {
  return new glob.math.vec2(this.x * vOther.y - vOther.x * this.y);
};

glob.math.vec2.prototype.distSq = function() {
  return this.x * this.x + this.y * this.y;
};

glob.math.vec2.prototype.normalize = function() {
  var dist = Math.sqrt(this.distSq());

  if (dist) {
    this.x = this.x / dist;
    this.y = this.y / dist;
  }
};

glob.math.vec2.prototype.add = function(vOther) {
  this.x += vOther.x;
  this.y += vOther.y;

  return this;
};

glob.math.vec2.prototype.multiply = function(scale) {
  this.x *= scale;
  this.y *= scale;

  return this;
};

glob.math.vec2.prototype.subtract = function(vOther) {
  this.x -= vOther.x;
  this.y -= vOther.y;

  return this;
};

glob.math.vec2.prototype.copy = function(vOther) {
  this.x = vOther.x;
  this.y = vOther.y;
};

glob.math.vec2FromPoints = function(x0, y0, xf, yf) {
  return new glob.math.vec2(xf - x0, yf - y0);
};

glob.math.vec2Copy = function(vOther) {
  return new glob.math.vec2(vOther.x, vOther.y);
};

// Bezier Helpers -------------------------------------------------------------
glob.math.bezierComputePoint = function(t, p0, p1, p2, p3) {
  var u = 1 - t;
  var tt = t * t;
  var uu = u * u;
  var uuu = uu * u;
  var ttt = tt * t;

  p = new glob.math.vec2(p0.x * uuu, p0.y * uuu);

  p.x += p1.x * (3 * uu * t);
  p.y += p1.y * (3 * uu * t);
 
  p.x += p2.x * (3 * u * tt);
  p.y += p2.y * (3 * u * tt);

  p.x += p3.x * ttt;
  p.y += p3.y * ttt;
   
  return p;
};

glob.math.bezierGetPointFromCurve = function(controlPoints, segmentIndex, segmentParam) {
  var p0 = controlPoints[segmentIndex];
  var p1 = controlPoints[segmentIndex + 1];
  var p2 = controlPoints[segmentIndex + 2];
  var p3 = controlPoints[segmentIndex + 3];

  return glob.math.bezierComputePoint(segmentParam, p0, p1, p2, p3);
};

glob.math.bezierGeneratePixels = function(controlPoints, pointsPerSegment) {
  var drawingPoints = [];
  var i = 0;
  var j = 0;
  var p0 = null;
  var p1 = null;
  var p2 = null;
  var p3 = null;
  var t = 0;

  for (i=0; i<controlPoints.length - 3; i+=3)
  {
    p0 = controlPoints[i];
    p1 = controlPoints[i + 1];
    p2 = controlPoints[i + 2];
    p3 = controlPoints[i + 3];    

    if (i == 0) //Only do this for the first endpoint.
                //When i != 0, this coincides with the end
                //point of the previous segment
    {
      drawingPoints.push(glob.math.bezierComputePoint(0, p0, p1, p2, p3));
    }    

    for(j=1; j<=pointsPerSegment; j++)
    {
      t = j / pointsPerSegment;
      drawingPoints.push(glob.math.bezierComputePoint(t, p0, p1, p2, p3));
    }
  }

  return drawingPoints;
};

glob.math.bezierInterpolate = function(pointList, scale)
{
    var i = 0;
    var controlPoints = null;
    var p1 = null;
    var p2 = null;
    var tangent = null;
    var q0 = null;
    var q1 = null;
    var dp = null;
    var mag = 0;
 
    if (pointList.length >= 2)
    {
      controlPoints = [];

      for (i=0; i<pointList.length; i++)
      {
          if (i === 0) // is first
          {
              p1 = pointList[i];
              p2 = pointList[i + 1];                
   
              tangent = new glob.math.vec2(p2.x - p1.x, p2.y - p1.y);
              q1 = glob.math.vec2Copy(p1);
              q1.add(tangent.multiply(scale));

              controlPoints.push(p1);
              controlPoints.push(q1);
          }
          else if (i === pointList.length - 1) //last
          {
              p0 = pointList[i - 1];
              p1 = pointList[i];

              tangent = new glob.math.vec2(p1.x - p0.x, p1.y - p0.y);
              q0 = glob.math.vec2Copy(p1);
              q0.subtract(tangent.multiply(scale));
   
              controlPoints.push(q0);
              controlPoints.push(p1);
          }
          else
          {
              p0 = pointList[i - 1];
              p1 = pointList[i];
              p2 = pointList[i + 1];

              tangent = new glob.math.vec2(p2.x - p0.x, p2.y - p0.y);
              tangent.normalize();
              tangent.multiply(scale);

              dp = new glob.math.vec2(p1.x - p0.x, p1.y - p0.y);
              mag = Math.sqrt(dp.distSq());

              q0 = new glob.math.vec2(p1.x - tangent.x * mag, p1.y - tangent.y * mag);

              dp = new glob.math.vec2(p2.x - p1.x, p2.y - p1.y);
              mag = Math.sqrt(dp.distSq());

              q1 = new glob.math.vec2(p1.x + tangent.x * mag, p1.y + tangent.y * mag);
   
              controlPoints.push(q0);
              controlPoints.push(p1);
              controlPoints.push(q1);
          }
      }
    }
 
    return controlPoints;
}

// Cubic Splines --------------------------------------------------------------
glob.math.cubic = function(a, b, c, d, u) {
   this.a = a;
   this.b = b;
   this.c = c;
   this.d = d;
};

glob.math.cubic.prototype.getValueAt = function(u){
  return (((this.d * u) + this.c) * u + this.b) * u + this.a;
};

glob.math.calcNaturalCubic = function(values, component, cubics) {
   var num = values.length - 1;
   var gamma = []; // new float[num+1];
   var delta = []; // new float[num+1];
   var D = []; // new float[num+1];
   var i = 0;

   /*
        We solve the equation
       [2 1       ] [D[0]]   [3(x[1] - x[0])  ]
       |1 4 1     | |D[1]|   |3(x[2] - x[0])  |
       |  1 4 1   | | .  | = |      .         |
       |    ..... | | .  |   |      .         |
       |     1 4 1| | .  |   |3(x[n] - x[n-2])|
       [       1 2] [D[n]]   [3(x[n] - x[n-1])]
       
       by using row operations to convert the matrix to upper triangular
       and then back sustitution.  The D[i] are the derivatives at the knots.
   */
   gamma.push(1.0 / 2.0);
   for(i=1; i< num; i++) {
      gamma.push(1.0/(4.0 - gamma[i-1]));
   }
   gamma.push(1.0/(2.0 - gamma[num-1]));

   p0 = values[0][component];
   p1 = values[1][component];
         
   delta.push(3.0 * (p1 - p0) * gamma[0]);
   for(i=1; i< num; i++) {
      p0 = values[i-1][component];
      p1 = values[i+1][component];
      delta.push((3.0 * (p1 - p0) - delta[i - 1]) * gamma[i]);
   }
   p0 = values[num-1][component];
   p1 = values[num][component];

   delta.push((3.0 * (p1 - p0) - delta[num - 1]) * gamma[num]);

   D.unshift(delta[num]);
   for(i=num-1; i >= 0; i--) {
      D.unshift(delta[i] - gamma[i] * D[0]);
   }

   /*
        now compute the coefficients of the cubics 
   */
   cubics.length = 0;

   for(i=0; i<num; i++) {
      p0 = values[i][component];
      p1 = values[i+1][component];

      cubics.push(new glob.math.cubic(
                     p0, 
                     D[i], 
                     3*(p1 - p0) - 2*D[i] - D[i+1],
                     2*(p0 - p1) +   D[i] + D[i+1]
                   )
               );
   }
};

glob.math.Spline2D = function() {
   this.points = [];
   this.xCubics = [];
   this.yCubics = [];

   this.reset = function() {
     this.points.length = 0;
     this.xCubics.length = 0;
     this.yCubics.length = 0;
   };
   
   this.addPoint = function(point) {
      this.points.push(point);
   };
   
   this.getPoints = function() {
      return this.points;
   };
   
   this.calcSpline = function() {
      glob.math.calcNaturalCubic(this.points, "x", this.xCubics);
      glob.math.calcNaturalCubic(this.points, "y", this.yCubics);
   };
   
   this.getPoint = function(position) {
      position = position * this.xCubics.length; // extrapolate to the arraysize
      
      var cubicNum = Math.floor(position);
      var cubicPos = (position - cubicNum);
      
      return {x: this.xCubics[cubicNum].getValueAt(cubicPos),
              y: this.yCubics[cubicNum].getValueAt(cubicPos)};
   };
};

glob.math.Spline3D = function() {
   this.points = [];
   this.xCubics = [];
   this.yCubics = [];
   this.zCubics = [];

   this.reset = function() {
     this.points.length = 0;
     this.xCubics.length = 0;
     this.yCubics.length = 0;
     this.zCubics.length = 0;
   };
   
   this.addPoint = function() {
      this.points.push(point);
   };
   
   this.getPoints = function() {
      return this.points;
   };
   
   this.calcSpline = function() {
      glob.math.calcNaturalCubic(this.points, "x", this.xCubics);
      glob.math.calcNaturalCubic(this.points, "y", this.yCubics);
      glob.math.calcNaturalCubic(this.points, "z", this.zCubics);
   };
   
   this.getPoint = function(position) {
      position = position * this.xCubics.length; // extrapolate to the arraysize
      
      var cubicNum = Math.floor(position);
      var cubicPos = (position - cubicNum);
      
      return {x: this.xCubics[cubicNum].getValueAt(cubicPos),
              y: this.yCubics[cubicNum].getValueAt(cubicPos),
              z: this.zCubics[cubicNum].getValueAt(cubicPos)};
   };
};

glob.math.buildTables();
