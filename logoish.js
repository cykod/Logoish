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

  var recorded = [];

  var queue = [];

  var context = null;

  var animate = {};

  self.add = function(step) {
    if(self.recording) {
      recorded.push(step.slice());
    }
    queue.push(step);
  }

  self.init = function() {
    createCanvas();
    setToplevel();
    _setState();
    _positionTurtle();
    _stepTurtle();
  }

  self.record = function() {
    self.recording = true;
    recorded = [];
  };

  self.loadRecording = function(json) {
    recorded = json;
  }

  self.stopRecording = function() {
    self.recording = false;
  };

  self.replay = function() {
    for(var i=0;i < recorded.length;i++) {
      queue.push(recorded[i].slice());
    }
  };

  self.downloadRecording = function() {
    var link = document.createElement("a")
    link.addEventListener("click",function() {
      var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(recorded));
      link.href = 'data:' + data;
      link.download = "recording.json"
    });
    link.style.display = "none";
    link.click();
  };

  self.clear = function() {
    self.add( ["clear"]);
  }

  animate.clear = function() {
    context.clearRect(0,0,state.width,state.height);
  }

  self.reset = function() {
    self.add( ["reset"]);
  }

  animate.reset = function() {
    animate.clear();
    state.lineWidth = defaults.lineWidth;
    state.lineColor = defaults.lineColor;
    state.x = Math.floor(state.width / 2);
    state.y = Math.floor(state.height / 2);
    state.angle = 0;
    animate.show();
    _positionTurtle();
  }

  self.lineWidth = function(width) {
    self.add( ["lineWidth", width ]);
  }

  animate.lineWidth = function(entry) {
    state.lineWidth = entry[1];
    _setState();
  }

  self.lineColor = function(color) {
    self.add( ["lineColor", color]);
  }

  animate.lineColor = function(entry) {
    state.lineColor = entry[1];
    _setState();
  };

  self.forward = function(distance) {
    self.add([ "f", distance ]);
  }

  animate.f = function(entry) {
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

  self.arcRight = function(radius, angle) {
    self.add([ "arc", radius, angle, false ]);
  }

  self.arcLeft = function(radius, angle) {
    self.add([ "arc", radius, angle, true]);
  }

  animate.arc = function(entry) {
    var radius = entry[0];
    var angle = entry[1];

    var calc = entry[4];

    if(!entry[4]) {
      calc = entry[4] = {};

      calc.x = state.x + -radius * Math.sin(Math.PI / 180 * state.angle);
      calc.y = state.y + r-adius * Math.cos(Math.PI / 180 * state.angle);

      calc.start = state.angle;
      calc.end = calc.start + entry[4];
    }

    // get the starting angle from our angle


    // find the center 


    // calc the start and end angle once


    // draw as much of the arc as we like
  }

  self.skip = function(distance) {
    self.add([ "skip", distance ]);
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
    self.add([ "r", angle ]);
  }

  animate.r = function(entry) {
    var angle = entry[1];
    if(state.speed && Math.abs(angle) > state.speed) {
      angle = angle > 0 ? state.speed : -state.speed;
      entry[1] -= angle;
      queue.unshift(entry);
    } else {
      state.angle = state.angle % 360;

    }

    state.angle += angle;
    _positionTurtle();
  };

  self.moveTo = function(x,y) {
    self.add(["moveTo", x, y ]);
  };


  animate.moveTo = function(entry) {
    state.x = entry[1];
    state.y = entry[2];
    _positionTurtle();
  }

  self.move = function(x,y) {
    self.add(["move", x, y ]);
  };


  animate.move = function(entry) {
    state.x += entry[1];
    state.y += entry[2];
    _positionTurtle();
  };

  self.lineTo = function(x,y) {
    self.add(["l", x, y ]);
  };

  animate.l = function(entry) {
    var diffX = (entry[1] - state.x);
    var diffY = (entry[2] - state.y);

    var dist = Math.sqrt(diffX * diffX + diffY * diffY);
    if(dist > 0) {
      diffX /= dist;
      diffY /= dist;
    }

    context.beginPath();
    context.moveTo(state.x - diffX*2,state.y - diffY*2);
    state.x = entry[1];
    state.y = entry[2];
    context.lineTo(state.x + diffX*2,state.y + diffY*2);
    context.stroke();
    _positionTurtle();
  };

  self.hide = function() {
    self.add(["hide"]);
  };

  animate.hide = function() {
    turtle.style.display = "none";
  };


  self.show = function() {
    self.add(["show"]);
  };

  animate.show = function() {
    turtle.style.display = "block";
  };

  self.angle = function(angle) {
    self.add(["angle", angle]);
  };

  animate.angle = function(entry) {
    state.angle = entry[1];
  };


  self.speed = function(speed) {
    self.add(["speed", speed]);
  };

  animate.speed = function(entry) {
    state.speed = entry[1];
  };

  self.stop = function() {
    queue = [];
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

  function _animateTurtle() {
    _stepTurtle();
  }


  function _stepTurtle(n) {
    if(queue.length > 0) {
      var current = queue.shift();
      animate[current[0]](current);
    }
    if(state.speed == 0 && queue.length > 0) {
      if(!n || n < 300) {
        _stepTurtle(n ? (n+1) : 1);
      }
    }
    if(!n) { 
      requestAnimationFrame(_animateTurtle);
    }
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
