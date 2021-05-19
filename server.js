var http = require("http");
require('dotenv').config()
const twitchAuth = process.env.TWITCHAUTH;
const channel = process.env.CHANNEL;
const clientId = process.env.CLIENTID;

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
    }
})


const hostname = '127.0.0.1';
const port = 3000;
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});