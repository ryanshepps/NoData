const MessagingResponse = new require('twilio').twiml.MessagingResponse;
const twiml = new MessagingResponse();

exports.sendSms = (sms) => {
    return twiml.message(sms);
}
