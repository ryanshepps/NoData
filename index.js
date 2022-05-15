const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const bingSearch = require("./src/bing-search");
const jsonEngine = require("./src/json-parse-engine");
const constants = require('./src/constants');
const twilio = require('./src/twilio');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    res.end('Yup! The server is up and running :)');
});

app.post('/sms', async (req, response) => {
    try {
        const requestBody = req.body.Body.trim();
        let message;

        if (requestBody.includes("--help")) {
            message = constants.helpInstructions;
        } else {
            const requestBodyObj = jsonEngine.requestBodyToObj(requestBody);
            const rawSearchResult = await bingSearch.search(requestBodyObj.snippet);
            const searchResults = rawSearchResult.value; 

            const result = jsonEngine.getSingleResult(searchResults, parseInt(requestBodyObj.result));

            const filteredResult = jsonEngine.filterResult(result, requestBodyObj);
            message = jsonEngine.convertResultToMessage(filteredResult, requestBodyObj.result, searchResults.length);
        }

        twilio.sendMessage(response, message);
    } catch (error) {
        twilio.sendMessage(response, error);
    }
});

http.createServer(app).listen(3000, () => {
    console.log('Express server listening on port 3000');
});
