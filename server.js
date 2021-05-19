var http = require("http");
require('dotenv').config()
const twitchAuth = process.env.TWITCHAUTH;
const channel = process.env.CHANNEL;
const clientId = process.env.CLIENTID;
const auth_token = process.env.AUTHTOKEN;
const hostname = process.env.HOSTNAME;
const port = 16021;


const server = http.createServer((req, res) => {
    if (req.method == 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'DELETE, PUT, GET');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
        res.statusCode = 200;
        res.end();
        return;
    }
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    //Parses the HTTP request from the client
    // console.log(req.url);
    let requested_data =
        (req.url)
            .split('/')
            .filter(x => x != '')
            .map(x => x
                .replace(/%[0-9]+/g, match => String.fromCharCode(parseInt(match.slice(1), 16))));



    if (requested_data[0] != "") {
        if (requested_data[0] == "getTokens") {
            var searchResults = [twitchAuth, channel, clientId];
            res.end(JSON.stringify({ 'results': searchResults }));
            console.log('Retrieved and sent');
        }
        else if (requested_data[0] == "blue") {
            var searchResults = "Color blue set";
            displayColor(requested_data[0]);
            res.end(JSON.stringify({ 'results': searchResults }));
            console.log('Retrieved and sent');
        }
        else if (requested_data[0] == "red") {
            var searchResults = "Color red set";
            displayColor(requested_data[0]);
            res.end(JSON.stringify({ 'results': searchResults }));
            console.log('Retrieved and sent');
        }
        else if (requested_data[0] == "green") {
            var searchResults = "Color green set";
            displayColor(requested_data[0]);
            res.end(JSON.stringify({ 'results': searchResults }));
            console.log('Retrieved and sent');
        }
        else {
            var searchResults = "Input not recognized";
            res.end(JSON.stringify({ 'results': searchResults }));
            console.log("Input not recognized");
        }
    }
})

function displayColor(color) {
    var hue;
    if (color == "blue") {
        hue = 210;
    } else if (color == "red") {
        hue = 0;
    } else if (color == "green") {
        hue = 150;
    } else {
        hue = 330;
    }
    var options = {
        write: {
            "command": "display",
            "version": "2.0",
            "animType": "static",
            "colorType": "HSB",
            "Palette": [
                {
                    "hue": hue,
                    "saturation": 100,
                    "brightness": 50
                }
            ],
            "loop": false
        }
    };
    fetch("http://" + hostname + ":" + port + "/api/v1/" + auth_token + "/effects", {
        method: "PUT",
        body: JSON.stringify(options)
    }).catch(err => console.log(err));
}

server.listen(3000, '127.0.0.1', () => {
    console.log(`Server running at http://127.0.0.1:3000/`);
});