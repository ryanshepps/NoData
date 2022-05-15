const MessagingResponse = require('twilio').twiml.MessagingResponse;

const defaultParams = {
    "list": 1,
    "name": false,
    "url": false
}

const defaultFlagsSms = ["list", "name", "url", "search"];

const helpMessage = 'Text "--help" for further details.'
const helpSms = `USAGE:
[search text] [options]


OPTIONS:
--result [number] -->
Displays the number-th result.

--name -->
Provides the name of the result.

--url -->
Provides the address of the result.


EXAMPLES:
Will it rain tomorrow?

Will it rain tomorrow? --name --url

Will it rain tomorrow? --result 3 --name --url`

exports.results = (raw_search, params) => {
    search = raw_search.slice(0, parseInt(params["list"]));
    result = search.map((value) => {
        filteredValue = { "search": value["snippet"] };
        if (params["name"]) filteredValue["name"] = value["name"];
        if (params["url"]) filteredValue["url"] = value["url"];
        return filteredValue;
    });
    return result;
}

exports.formatSms = (results) => {
    const twiml = new MessagingResponse();
    const numResults = results.length;
    let resultCount = 1;
    results.map((result) => {
        let sms = "";
        defaultFlagsSms.map((flag) => {
            upperFlag = flag.toUpperCase();
            if (numResults > 1 && flag === "list") sms += `${upperFlag} -->\nShowing ${resultCount} of ${numResults}\n\n`;
            else if (result[flag]) sms += `${upperFlag} -->\n${result[flag]}\n\n`;
        });
        resultCount++;
        twiml.message(sms);
    });
    return twiml;
}

exports.params = (params) => {
    if (params.startsWith("--")) throw 'A query must be provided before the optional flags. ' + helpMessage;

    let newParams = defaultParams;
    let res = params.split(" --");
    const searchQuery = res.shift();

    // Optional flags provided in any order.
    res.map((param) => {
        const keyPair = param.split(" ");
        if (keyPair[0] in defaultParams) {
            newParams[keyPair[0]] = keyPair[0] === "list" ? keyPair[1] : true;
        } else {
            throw 'Invalid flag provided. ' + helpMessage;
        }
    });

    // Query search params always first thing provided.
    newParams["search"] = searchQuery;
    return newParams;
}

exports.helpMenu = () => {
    const twiml = new MessagingResponse();
    twiml.message(helpSms);
    return twiml;
}
