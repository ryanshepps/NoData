const twilio = require('./twilio');

const defaultParams = {
    "result": 1,
    "name": false,
    "url": false
}

const defaultFlagsSms = ["result", "name", "url", "search"];

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

exports.getSingleResult = (rawResults, resultNum) => {
    return rawResults[resultNum - 1];
}

exports.filterResult = (result, params) => {
    let filteredResult = {};

    Object.keys(params).forEach((paramKey) => {
        if (params[paramKey] && paramKey !== "result") {
            filteredResult[paramKey] = result[paramKey];
        }
    });

    console.log('filteredResult', filteredResult);

    return filteredResult;
}

exports.formatSms = (result, numTotalResults, requestedResultNum) => {
    let sms = getRequestedResultInfo(result);

    sms += `RESULT ${requestedResultNum}/${numTotalResults} -->\n`

    return twilio.sendSms(sms);
}

// returns a string with info that the user requests about the results
const getRequestedResultInfo = (result, params) => {
    let sms = "";

    defaultFlagsSms.forEach((flag) => {
        if (flag !== "result") {
            sms += `${flag.toUpperCase()} -->\n${result[flag]}\n\n`
        }
    });

    return sms;
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
            newParams[keyPair[0]] = keyPair[0] === "result" ? keyPair[1] : true;
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
