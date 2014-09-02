var five = require("johnny-five"),
        board = new five.Board();

board.on("ready", function() {

    var ping = new five.Ping(7);

    ping.on("change", function( err, value ) {
        if (this.cm < 5) {
            console.log("STOP!!!!");
        } else {
            console.log(".");
        }
    });
});  
