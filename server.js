var http = require("http");
const fetch = require('node-fetch');
require('dotenv').config()

//Fetch ENV variables
const twitchAuth = process.env.TWITCHAUTH;
const channel = process.env.CHANNEL;
const clientId = process.env.CLIENTID;
const auth_token = process.env.AUTH_TOKEN;
const hostname = process.env.HOSTNAME;
const port = 16021;

//Initializes server that handles client requests
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


    // Different client requests being handled
    if (requested_data[0] != "") {

        //Gets the env variables and returns them to the index.html page for ComfyJS
        if (requested_data[0] == "getTokens") {
            var searchResults = [twitchAuth, channel, clientId];
            turnOnLights();
            res.end(JSON.stringify({ 'results': searchResults }));
            console.log('Retrieved and sent');
        }

        //Handles custom channel point redemption requests 
        else if (requested_data[0] == "blue") {
            var searchResults = "Color blue set";
            displayCustomColor("blue");
            res.end(JSON.stringify({ 'results': searchResults }));
            console.log('Retrieved and sent');
        }
        else if (requested_data[0] == "red") {
            var searchResults = "Color red set";
            displayCustomColor("red");
            res.end(JSON.stringify({ 'results': searchResults }));
            console.log('Retrieved and sent');
        }
        else if (requested_data[0] == "green") {
            var searchResults = "Color green set";
            displayCustomColor("green");
            res.end(JSON.stringify({ 'results': searchResults }));
            console.log('Retrieved and sent');
        }
        else if (requested_data[0] == "custom") {
            var searchResults = "Custom color set";
            console.log("Attempting to send " + requested_data[1] + " to lights")
            displayCustomColor(requested_data[1]);
            res.end(JSON.stringify({ 'results': searchResults }));
            console.log('Retrieved and sent');
        }
        //Send back error string
        else {
            var searchResults = "Input not recognized";
            res.end(JSON.stringify({ 'results': searchResults }));
            console.log("Input not recognized");
        }
    }
})


function colorNameToHex(color) {
    var colors = {
        "aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4", "azure": "#f0ffff",
        "beige": "#f5f5dc", "bisque": "#ffe4c4", "black": "#000000", "blanchedalmond": "#ffebcd", "blue": "#0000ff", "blueviolet": "#8a2be2", "brown": "#a52a2a", "burlywood": "#deb887",
        "cadetblue": "#5f9ea0", "chartreuse": "#7fff00", "chocolate": "#d2691e", "coral": "#ff7f50", "cornflowerblue": "#6495ed", "cornsilk": "#fff8dc", "crimson": "#dc143c", "cyan": "#00ffff",
        "darkblue": "#00008b", "darkcyan": "#008b8b", "darkgoldenrod": "#b8860b", "darkgray": "#a9a9a9", "darkgreen": "#006400", "darkkhaki": "#bdb76b", "darkmagenta": "#8b008b", "darkolivegreen": "#556b2f",
        "darkorange": "#ff8c00", "darkorchid": "#9932cc", "darkred": "#8b0000", "darksalmon": "#e9967a", "darkseagreen": "#8fbc8f", "darkslateblue": "#483d8b", "darkslategray": "#2f4f4f", "darkturquoise": "#00ced1",
        "darkviolet": "#9400d3", "deeppink": "#ff1493", "deepskyblue": "#00bfff", "dimgray": "#696969", "dodgerblue": "#1e90ff",
        "firebrick": "#b22222", "floralwhite": "#fffaf0", "forestgreen": "#228b22", "fuchsia": "#ff00ff",
        "gainsboro": "#dcdcdc", "ghostwhite": "#f8f8ff", "gold": "#ffd700", "goldenrod": "#daa520", "gray": "#808080", "green": "#008000", "greenyellow": "#adff2f",
        "honeydew": "#f0fff0", "hotpink": "#ff69b4",
        "indianred ": "#cd5c5c", "indigo": "#4b0082", "ivory": "#fffff0", "khaki": "#f0e68c",
        "lavender": "#e6e6fa", "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00", "lemonchiffon": "#fffacd", "lightblue": "#add8e6", "lightcoral": "#f08080", "lightcyan": "#e0ffff", "lightgoldenrodyellow": "#fafad2",
        "lightgrey": "#d3d3d3", "lightgreen": "#90ee90", "lightpink": "#ffb6c1", "lightsalmon": "#ffa07a", "lightseagreen": "#20b2aa", "lightskyblue": "#87cefa", "lightslategray": "#778899", "lightsteelblue": "#b0c4de",
        "lightyellow": "#ffffe0", "lime": "#00ff00", "limegreen": "#32cd32", "linen": "#faf0e6",
        "magenta": "#ff00ff", "maroon": "#800000", "mediumaquamarine": "#66cdaa", "mediumblue": "#0000cd", "mediumorchid": "#ba55d3", "mediumpurple": "#9370d8", "mediumseagreen": "#3cb371", "mediumslateblue": "#7b68ee",
        "mediumspringgreen": "#00fa9a", "mediumturquoise": "#48d1cc", "mediumvioletred": "#c71585", "midnightblue": "#191970", "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5",
        "navajowhite": "#ffdead", "navy": "#000080",
        "oldlace": "#fdf5e6", "olive": "#808000", "olivedrab": "#6b8e23", "orange": "#ffa500", "orangered": "#ff4500", "orchid": "#da70d6",
        "palegoldenrod": "#eee8aa", "palegreen": "#98fb98", "paleturquoise": "#afeeee", "palevioletred": "#d87093", "papayawhip": "#ffefd5", "peachpuff": "#ffdab9", "peru": "#cd853f", "pink": "#ffc0cb", "plum": "#dda0dd", "powderblue": "#b0e0e6", "purple": "#800080",
        "rebeccapurple": "#663399", "red": "#ff0000", "rosybrown": "#bc8f8f", "royalblue": "#4169e1",
        "saddlebrown": "#8b4513", "salmon": "#fa8072", "sandybrown": "#f4a460", "seagreen": "#2e8b57", "seashell": "#fff5ee", "sienna": "#a0522d", "silver": "#c0c0c0", "skyblue": "#87ceeb", "slateblue": "#6a5acd", "slategray": "#708090", "snow": "#fffafa", "springgreen": "#00ff7f", "steelblue": "#4682b4",
        "tan": "#d2b48c", "teal": "#008080", "thistle": "#d8bfd8", "tomato": "#ff6347", "turquoise": "#40e0d0",
        "violet": "#ee82ee",
        "wheat": "#f5deb3", "white": "#ffffff", "whitesmoke": "#f5f5f5",
        "yellow": "#ffff00", "yellowgreen": "#9acd32", "orengeguy": "#ff6600", "drshadow": "#9a0000",
    };

    if (color.toLowerCase() == "black") {
        return colors[Object.Keys(colors)[Math.floor(Math.random() * 141)]]
    } else if (typeof colors[color.toLowerCase()] != 'undefined') {
        return colors[color.toLowerCase()];
    } else {
        return colors["blue"];
    }
}


function turnOnLights() {
    fetch("http://" + hostname + ":" + port + "/api/v1/" + auth_token + "/state", {
        headers: { 'Content-Type': 'application/json' },
        method: "PUT",
        body: JSON.stringify({
            "on": {
                "value": true
            }
        })
    }).catch(err => console.log(err));
}

function rgbToHsv(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
}

function hexToRgb(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return [r, g, b];
}

function rgbToHSL(rgb) {
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const delta = max - min;
    let h;
    let s;

    if (max === min) {
        h = 0;
    } else if (r === max) {
        h = (g - b) / delta;
    } else if (g === max) {
        h = 2 + (b - r) / delta;
    } else if (b === max) {
        h = 4 + (r - g) / delta;
    }

    h = Math.min(h * 60, 360);

    if (h < 0) {
        h += 360;
    }

    const l = (min + max) / 2;

    if (max === min) {
        s = 0;
    } else if (l <= 0.5) {
        s = delta / (max + min);
    } else {
        s = delta / (2 - max - min);
    }

    return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
};



function displayCustomColor(colorName) {

    //First color name to hex
    var hex = colorNameToHex(colorName).slice(1);

    //Then hex to [r, g, b] where 0 <= r,g,b <= 255 
    var rgbArr = hexToRgb(hex);


    //Then [r, g, b] to [h, s, b]
    var hsv = rgbToHsv(rgbArr[0], rgbArr[1], rgbArr[2]);
    console.log(hsv);
    //Then send [h, s, b] put request to lights
    // var options = {
    //     write: {
    //         "command": "display",
    //         "version": "2.0",
    //         "animType": "static",
    //         "colorType": "HSB",
    //         "Palette": [
    //             {
    //                 "hue": hsl[0],
    //                 "saturation": hsl[1],
    //                 "brightness": hsl[2]
    //             }
    //         ],
    //         "loop": false
    //     }
    // };
    //curl --location --request PUT 'http://192.168.1.22:16021/api/v1/UZkR09wEOQoqwxVHgNwcQGmnswMUJh05/state' \ --data-raw '{"hue" : {"value":120}}'
    console.log("Sending HSV: " + hsv)
    console.log("Sending effect request to Nanoleaf Lights");

    fetch("http://" + hostname + ":" + port + "/api/v1/" + auth_token + "/state", {
        method: "PUT",
        body: JSON.stringify({
            "hue": {
                "value": hsv[0]
            }
        })
    }).catch(err => console.log(err));

    fetch("http://" + hostname + ":" + port + "/api/v1/" + auth_token + "/state", {
        method: "PUT",
        body: JSON.stringify({
            "sat": {
                "value": hsv[1]
            }
        })
    }).catch(err => console.log(err));

    fetch("http://" + hostname + ":" + port + "/api/v1/" + auth_token + "/state", {
        method: "PUT",
        body: JSON.stringify({
            "brightness": {
                "value": hsv[2]
            }
        })
    }).catch(err => console.log(err));




    // fetch("http://" + hostname + ":" + port + "/api/v1/" + auth_token + "/state", {
    //     method: "PUT",
    //     body: JSON.stringify({
    //         "brightness": {
    //             "value": hsl[2]
    //         },
    //         "sat": {
    //             "value": hsl[1]
    //         },
    //         "hue": {
    //             "value": hsl[0]
    //         }
    //     })
    // }).catch(err => console.log(err));



    // fetch("http://" + hostname + ":" + port + "/api/v1/" + auth_token + "/effects", {
    //     method: "PUT",
    //     body: { "brightness": { "value": hsl[2] } }
    // }).catch(err => console.log(err));

}



//Starts server to handle client requests
server.listen(3000, '127.0.0.1', () => {
    console.log(`Server running at http://127.0.0.1:3000/`);
});