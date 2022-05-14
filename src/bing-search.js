const axios = require("axios");
const secretsManagerClient = require('./secrets-manager').secretsManager();
const secretsManager = require('./secrets-manager');

const rapidApiKeyName = 'projects/7736567127/secrets/rapidapi-key';

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
        'X-RapidAPI-Key': secretsManager.getSecret(secretsManagerClient, rapidApiKeyName),
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
