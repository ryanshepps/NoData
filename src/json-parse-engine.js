const e = require("express");

var defaultParams = {
    "list": 1,
    "name": false,
    "url": false,
    "isff": false,
    "durl": false,
    "dlc": false,
    "search": ""
}

exports.results = (raw_search, params) => {
    search = raw_search.slice(0, parseInt(params["list"]));
    result = [];
    result = search.map((value) => {
        filteredValue = { "data": value["snippet"] };
        if (params["name"]) filteredValue["name"] = value["name"];
        if (params["url"]) filteredValue["url"] = value["url"];
        if (params["isFamilyFriendly"]) filteredValue["isFamilyFriendly"] = value["isff"];
        if (params["durl"]) filteredValue["durl"] = value["displayUrl"];
        if (params["dlc"]) filteredValue["dlc"] = value["dateLastCrawled"];
        return filteredValue;
    })
    return result;
}

exports.params = (params) => {
    if (params.substring(0, 7) === "nodata ") {
        let newParams = defaultParams;
        if (params.length <= 7) return false;

        let res = params.substring(6, params.length).split(" --");
        res.shift();

        res.map((param) => {
            if (param.substring(0, 7) === "search ") {
                keyPair = [param.substring(0, 6), param.substring(7, param.length)];
            } else {
                keyPair = param.split(" ");
            }
            if (keyPair[0] in defaultParams) {
                newParams[keyPair[0]] = keyPair[0] === "list" || keyPair[0] === "search" ? keyPair[1] : true;
            } else {
                console.log("error");
                throw "error";
            }
        });

        return newParams;
    }
    return false;
}