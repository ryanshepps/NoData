const twilio = require('./twilio');

const defaultParams = {
    "result": 1,
    "name": false,
    "url": false,
    "search": ""
}

const defaultFlagsSms = ["result", "name", "url", "search"];

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


EXAMPLES:
nodata Will it rain tomorrow?

nodata Will it rain tomorrow? --name --url

nodata Will it rain tomorrow? --result 3 --name --url`

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
            newParams[keyPair[0]] = keyPair[0] === "result" || keyPair[0] === "search" ? keyPair[1] : true;
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
