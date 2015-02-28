Logoish = (function() {
  "use strict";

  var self = {};

  var defaults = {
    lineWidth: 3,
    lineColor: "black"
  };

  var state = {
    lineWidth: defaults.lineWidth,
    lineColor: defaults.lineColor,
    x: 0,
    y: 0,
    angle: 0,
    speed: 5 
  }

  var queue = [];

  var context = null;

  var animate = {};

  self.init = function() {
    createCanvas();
    setToplevel();
    _setState();
    _positionTurtle();
    _stepTurtle();
  }

  self.clear = function() {
    queue.push( ["clear"]);
  }

  animate.clear = function() {
    context.clearRect(0,0,state.width,state.height);
  }

  self.reset = function() {
    queue.push( ["reset"]);
  }

  animate.reset = function() {
    animate.clear();
    state.lineWidth = defaults.lineWidth;
    state.lineColor = defaults.lineColor;
    state.x = Math.floor(state.width / 2);
    state.y = Math.floor(state.height / 2);
    animate.show();
    _positionTurtle();
  }

  self.lineWidth = function(width) {
    queue.push( ["lineWidth", width ]);
  }

  animate.lineWidth = function(entry) {
    state.lineWidth = entry[1];
    _setState();
  }

  self.lineColor = function(color) {
    queue.push( ["lineColor", color]);
  }

  animate.lineColor = function(entry) {
    state.lineColor = entry[1];
    _setState();
  };

  self.forward = function(distance) {
    queue.push([ "forward", distance ]);
  }

  animate.forward = function(entry) {
    if(!entry[2]) {
      entry[2] = state.x;
      entry[3] = state.y;
    }
    var distance = entry[1];
    if(state.speed && distance > state.speed) {
      distance = state.speed;
      entry[1] -= state.speed;
      queue.unshift(entry);
    }
    var dx = Math.sin(Math.PI / 180 * state.angle) * distance;
    var dy = -Math.cos(Math.PI / 180 * state.angle) * distance;

    context.beginPath();
    context.moveTo(entry[2],entry[3]);
    state.x += dx;
    state.y += dy;
    context.lineTo(state.x,state.y);
    context.stroke();
    _positionTurtle();
  }


  self.skip = function(distance) {
    queue.push([ "skip", distance ]);
  }

  animate.skip = function(entry) {
    var distance = entry[1];
    
    var dx = Math.sin(Math.PI / 180 * state.angle) * distance;
    var dy = -Math.cos(Math.PI / 180 * state.angle) * distance;

    state.x += dx;
    state.y += dy;
    _positionTurtle();
  }

  self.rotate = function(angle) {
    queue.push([ "rotate", angle ]);
  }

  animate.rotate = function(entry) {
    var angle = entry[1];
    if(state.speed && Math.abs(angle) > state.speed) {
      angle = angle > 0 ? state.speed : -state.speed;
      entry[1] -= angle;
      queue.unshift(entry);
    }

    state.angle += angle;
    _positionTurtle();
  };

  self.moveTo = function(x,y) {
    queue.push(["moveTo", x, y ]);
  };


  animate.moveTo = function(entry) {
    state.x = entry[1];
    state.y = entry[2];
    _positionTurtle();
  }

  self.move = function(x,y) {
    queue.push(["move", x, y ]);
  };


  animate.move = function(entry) {
    state.x += entry[1];
    state.y += entry[2];
    _positionTurtle();
  }


  self.hide = function() {
    queue.push(["hide"]);
  };

  animate.hide = function() {
    turtle.style.display = "none";
  };


  self.show = function() {
    queue.push(["show"]);
  };

  animate.show = function() {
    turtle.style.display = "block";
  };

  self.angle = function(angle) {
    queue.push(["angle", angle]);
  };

  animate.angle = function(entry) {
    state.angle = entry[1];
  };


  self.speed = function(speed) {
    queue.push(["speed", speed]);
  };

  animate.speed = function(entry) {
    state.speed = entry[1];
  };


  function _setState() {
    context.strokeStyle =  state.lineColor;
    context.lineWidth = state.lineWidth;
  }


  function _positionTurtle() {
    self.turtle.style.left = (state.x-5) + "px";
    self.turtle.style.top = (state.y-10)  + "px";

    self.turtle.style.transform = "rotate(" + state.angle + "deg)";
  }


  function _stepTurtle() {
    if(queue.length > 0) {
      var current = queue.shift();
      animate[current[0]](current);
    }
    if(state.speed == 0 && queue.length > 0) {
      _stepTurtle();
    }
    requestAnimationFrame(_stepTurtle);
  }

  function createCanvas() {
    var body = document.getElementsByTagName("body")[0];
    var div = document.createElement("div")
    div.style.position = "absolute";
    div.style.width = "100%";
    div.style.height = "100%";

    body.appendChild(div);

    self.canvas = document.createElement("canvas");
    state.width = self.canvas.width = div.offsetWidth;
    state.height = self.canvas.height = div.offsetHeight;

    div.appendChild(self.canvas);
    context = self.canvas.getContext("2d");


    var turtle = self.turtle = document.createElement("div");
    turtle.style.position = "absolute";
    turtle.style.width = 0;
    turtle.style.height= 0;
    turtle.style.borderLeft = "5px solid transparent";
    turtle.style.borderRight= "5px solid transparent";
    turtle.style.borderBottom = "20px solid black";
    div.appendChild(turtle);

    self.reset();
  }

  function setToplevel() {
    for(var name in self) {
      if(name[0] != "_" && name != "init") {
        window[name] = self[name];
      }
    }
  }

  return self;
})();
