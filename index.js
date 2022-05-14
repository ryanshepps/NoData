const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const bingSearch = require("./src/bing-search");
const jsonEngine = require("./src/json-parse-engine");

const app = express();
// const search = bingSearch.search(q);

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    res.end('Yup! The server is up and running :)');
});

app.post('/sms', async (req, res) => {
        const twiml = new MessagingResponse();
        try {
                const params = jsonEngine.params(req.body.Body);
                const raw_search = await bingSearch.search(params.search);
                const results = jsonEngine.results(raw_search.value, params);
                const sms = jsonEngine.formatSms(results);
                res.writeHead(200, { 'Content-Type': 'text/xml' });
                console.log(sms.toString());
                res.end(sms.toString());
        } catch (e) {
                console.log("error: ", e);
                twiml.message(e);
                res.writeHead(200, { 'Content-Type': 'text/xml' });
                res.end(twiml.toString());
        }
});

http.createServer(app).listen(3000, () => {
        console.log('Express server listening on port 3000');
});
