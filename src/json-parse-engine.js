const constants = require('./constants');

const defaultParams = {
    "result": 1,
    "name": false,
    "url": false
}

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

    return filteredResult;
}

exports.convertResultToMessage = (filteredResult, resultNum, numTotalResults) => {
    let message = "";

    // RESULT
    message += `RESULT ${resultNum}/${numTotalResults}\n\n`;
    message += `${filteredResult.snippet}\n\n`;

    // NAME
    if (filteredResult.name) {
        message += `NAME: ${filteredResult.name}\n\n`;
    }
    
    // URL
    if (filteredResult.url) {
        message += `URL: ${filteredResult.url}`;
    }

    return message;
}

exports.requestBodyToObj = (requestBodyStr) => {
    if (requestBodyStr.startsWith("--")) throw 'A query must be provided before the optional flags. ' + constants.helpMessage;

    let requestBodyObj = defaultParams;

    let splitRequestBodyStr = requestBodyStr.split(" --");
    const searchQuery = splitRequestBodyStr.shift();

    // Optional flags provided in any order.
    splitRequestBodyStr.map((param) => {
        const keyPair = param.split(" ");
        if (keyPair[0] in defaultParams) {
            requestBodyObj[keyPair[0]] = keyPair[0] === "result" ? keyPair[1] : true;
        } else {
            throw 'Invalid flag provided. ' + constants.helpMessage;
        }
    });

    // Query search requestBody always first thing provided.
    requestBodyObj["snippet"] = searchQuery;
    return requestBodyObj;
}

