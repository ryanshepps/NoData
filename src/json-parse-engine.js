const e = require("express");
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const defaultParams = {
    "list": 1,
    "name": false,
    "url": false,
    "isff": false,
    "search": ""
}

const defaultFlagsSms = ["list", "name", "url", "isff", "search"];

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

exports.formatSms = (results, numResults) => {
    const twiml = new MessagingResponse();
    let resultCount = 1;
    results.map((result) => {
        let sms = "-\n";
        if (numResults >= 2) result["list"] = numResults;
        defaultFlagsSms.map((flag) => {
            if (result[flag] && flag === "list") sms += "@@\n" + flag + " -->\nShowing " + resultCount + " of " + result[flag] + "\n";
            else if (result[flag]) sms += "@@\n" + flag + " -->\n" + result[flag] + "\n";
        });
        resultCount++;
        twiml.message(sms);
    });
    return twiml;
}

exports.params = (params) => {
    if (params.substring(0, 6) === "nodata") {
        let newParams = defaultParams;
        if (params.length <= 7) throw 'A "--search" flag must be provided';

        let res = params.substring(6, params.length).split(" --");
        res.shift();

        res.map((param) => {
            if (param.substring(0, 6) === "search") {
                keyPair = [param.substring(0, 6), param.substring(7, param.length)];
                if (keyPair[1] === "") throw 'A query for "--search" must be provided';
            } else {
                keyPair = param.split(" ");
            }
            if (keyPair[0] in defaultParams) {
                newParams[keyPair[0]] = keyPair[0] === "list" || keyPair[0] === "search" ? keyPair[1] : true;
            } else {
                throw "Invalid flag provided";
            }
        });

        return newParams;
    }
    throw 'The text message must start with "nodata"';
}