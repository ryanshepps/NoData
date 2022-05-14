const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');

exports.secretsManager = () => {
    return new SecretManagerServiceClient();
};

exports.getSecret = async (client, name) => {
    const [accessResponse] = await client.accessSecretVersion({
        name: name,
    });
    
    return accessResponse.payload.data.toString();
};

