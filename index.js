const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const bingSearch = require("./src/bing-search");
const jsonEngine = require("./src/json-parse-engine");

const app = express();
// const search = bingSearch.search(q);

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/sms', async (req, res) => {
        const twiml = new MessagingResponse();
        try {
                let params = jsonEngine.params(req.body.Body);
                if (!params) throw "error";
                let raw_search = await bingSearch.search(params.search);
                let results = jsonEngine.results(raw_search.value, params);
                twiml.message("JSON.stringify(results)\nhello\nworrd\n");
                res.writeHead(200, { 'Content-Type': 'text/xml' });
                res.end(twiml.toString());
        } catch (e) {
                console.log("error: ", e);
                twiml.message("yo fam check the syntax");
                res.writeHead(200, { 'Content-Type': 'text/xml' });
                res.end(twiml.toString());
        }
});

http.createServer(app).listen(1337, () => {
        console.log('Express server listening on port 1337');
});