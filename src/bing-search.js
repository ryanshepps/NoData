const axios = require("axios");

const options = {
    method: 'GET',
    url: 'https://bing-web-search1.p.rapidapi.com/search',
    params: {
        q: '', // Updated depending on params.
        mkt: 'en-us',
        safeSearch: 'Off',
        textFormat: 'Raw',
        freshness: 'Day'
    },
    headers: {
        'X-BingApis-SDK': 'true',
        'X-RapidAPI-Host': 'bing-web-search1.p.rapidapi.com',
        'X-RapidAPI-Key': 'cfdf27182dmshbf97c52786708a7p1d6790jsn4b62b203b61a'
    }
};

exports.search = async (q) => {
    options.params.q = q;
    try {
        const response = await axios.request(options);
        const data = response.data.webPages;
        return data;
    } catch (error) {
        console.log(error);
    }
}