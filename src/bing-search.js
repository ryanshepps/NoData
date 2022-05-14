const axios = require("axios");
const secretsManagerClient = require('./secrets-manager').secretsManager();
const secretsManager = require('./secrets-manager');

const rapidApiKeyName = 'projects/7736567127/secrets/rapidapi-key/versions/latest';

const createOptions = (q, rapidApiKey) => ({
    method: 'GET',
    url: 'https://bing-web-search1.p.rapidapi.com/search',
    params: {
        q: q,
        mkt: 'en-us',
        safeSearch: 'Off',
        textFormat: 'Raw',
        freshness: 'Day'
    },
    headers: {
        'X-BingApis-SDK': 'true',
        'X-RapidAPI-Host': 'bing-web-search1.p.rapidapi.com',
        'X-RapidAPI-Key': rapidApiKey,
    }
});

exports.search = async (q) => {
    const rapidApiKey = await secretsManager.getSecret(secretsManagerClient, rapidApiKeyName);

    const options = createOptions(q, rapidApiKey);
    
    try {
        const response = await axios.request(options);
        return response.data.webPages;
    } catch (error) {
        console.log('this is the error I\'m getting from exports.searc', error);
    }
}
