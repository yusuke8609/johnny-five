// Derived and adapted from
// https://github.com/rwldrn/duino/blob/development/lib/ping.js
var Board = require("../lib/board.js"),
    events = require("events"),
    util = require("util");

function Sonar( opts ) {

  opts = Board.options( opts );

  // Hardware instance properties
  this.firmata = Board.mount( opts ).firmata;
  this.mode = this.firmata.MODES.ANALOG;
  this.pin = opts.pin || 0;

  // Sonar instance properties
  this.freq = opts.freq || 500;
  this.inches = null;
  this.voltage = null;

  // Set the pin to ANALOG mode
  this.firmata.pinMode( this.pin, this.mode );

  this.firmata.analogRead( this.pin, function( data ) {
    this.voltage = data;
  }.bind(this));

  // Throttle
  setInterval(function() {
    var err = null;

    // Calculate the distance in inches based on
    // the current voltage reading
    this.inches = ( 254 / 1024 ) * 2 * this.voltage;

    // Emit throttled event
    this.emit( "read", err, new Date() );
  }.bind(this), this.freq );
}

util.inherits( Sonar, events.EventEmitter );


module.exports = Sonar;


// Reference
//
// http://www.maxbotix.com/tutorials.htm#Code_example_for_the_BasicX_BX24p
// http://www.electrojoystick.com/tutorial/?page_id=285

// Tutorials
//
// http://www.sensorpedia.com/blog/how-to-interface-an-ultrasonic-rangefinder-with-sensorpedia-via-twitter-guide-2/
