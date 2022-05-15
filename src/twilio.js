const MessagingResponse = require('twilio').twiml.MessagingResponse;

convertToTwilioMessage = (message) => {
    const twiml = new MessagingResponse();

    return twiml.message(message);
}

exports.sendMessage = (res, message) => {
    const twilioFormattedMessage = convertToTwilioMessage(message);                        

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    console.log(twilioFormattedMessage.toString());
    res.end(twilioFormattedMessage.toString());
};
