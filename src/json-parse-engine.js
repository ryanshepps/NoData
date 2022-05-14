const MessagingResponse = require('twilio').twiml.MessagingResponse;

const defaultParams = {
    "list": 1,
    "name": false,
    "url": false,
    "ff": false,
    "search": ""
}

const defaultFlagsSms = ["list", "name", "url", "ff", "search"];

const helpMessage = 'See "nodata --help" for further details.'
const helpSms = `USAGE:
nodata [search text] [options]


OPTIONS:
--result [number] -->
Displays the number-th result.

--name -->
Provides the name of the result.

--url -->
Provides the address of the result.

--ff -->
Provides family-friendly results.


EXAMPLES:
nodata Will it rain tomorrow?

nodata Will it rain tomorrow? --name --url --ff

nodata Will it rain tomorrow? --result 3 --name --url --ff`

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
    if (params.substring(0, 15) !== "nodata --search") throw 'A "--search" flag must be provided before other flags. ' + helpMessage;

    let newParams = defaultParams;
    let res = params.substring(6, params.length).split(" --");
    res.shift();

    res.map((param) => {
        if (param.substring(0, 6) === "search") {
            keyPair = [param.substring(0, 6), param.substring(7, param.length)];
            if (keyPair[1] === "") throw 'Search terms must be provided after "--search". ' + helpMessage;
        } else {
            keyPair = param.split(" ");
        }
        if (keyPair[0] in defaultParams) {
            newParams[keyPair[0]] = keyPair[0] === "list" || keyPair[0] === "search" ? keyPair[1] : true;
        } else {
            throw 'Invalid flag provided. ' + helpMessage;
        }
    });

    return newParams;
}

exports.helpMenu = () => {
    const twiml = new MessagingResponse();
    twiml.message(helpSms);
    return twiml;
}
