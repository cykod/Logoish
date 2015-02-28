# Logoish

A simplified logo-like functionality for teaching JavaScript without the fuss. Provides `window` level functions for moving the turtle around the screen.


## Using

Logoish has no dependencies and probably only works in Chrome as that's what I'm teaching in (pull requests welcome!) 

It expects to take over the entire page. Include it in an empty page like so:

    <!DOCTYPE HTML>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Logoish Playground</title>
      <script src='logoish.js'></script>
    </head>
    <body>
      <script>
        Logoish.init();
      </script>
    </body>
    </html>

Now open up the JavaScript console and start running commands:

    forward(60); // move forward 60 pixels
    rotate(120); // rotate 120 degrees to the right
    forward(60); // move forward another 60 pixels


## API

All commands are added to the top level `window` object after calling `Logoish.init()`


| Method            |   Description     |
| ------------------| ----------------- |
| `Logoish.init()`  | Setup Logoish, create the canvas and add functions onto `window` |
| `clear()`         | Clear the canvas  |
| `reset()`         | Clear the canvas and reset the turtle  |
| `hide()`          | Hide the turtle |
| `show()`          | Show the turtle |
| `lineWidth(width)`| Set the width of the line in pixels |
| `linColor(color)` | Set the color of the line |
| `forward(pixels)` | Draw a line `pixels` straight forward |
| `skip(pxiels)`    | Skip forward `pixels` straight forward |
| `rotate(degrees)` | Rotate `degrees` to the right |
| `angle(degrees)`  | Set the current angle to `degrees` |
| `moveTo(x,y)`     | Move the turtle TO `x` and `y` on the canvas |
| `move(x,y)`       | Move the turtle BY `x` and `y` on the canvas |
| `speed(spd)`      | Set the drawing speed. Set to 0 for instant |
| `stop()`          | Stop the current drawing animation and clear the queue |

