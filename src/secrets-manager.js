const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');

exports.secretsManager = () => {
    return new SecretManagerServiceClient();
};

exports.getSecret = async (client, name) => {
    const secret = await client.getSecret({
        name: name,
    });

    return secret;
};

