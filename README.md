# NoData

## Development

### Simulating Production Build

```
Docker build -t . nodata
Docker run -p 3000:3000 nodata
```

Send your requests to localhost:3000.

### Local Development

You probably won't need anything here. But we've left it so that you can see our local development process.

#### Setting up dependencies

```
npm ci
```

#### Running

```
npx nodemon index.js
```

#### Serving local app to the internet

Install [ngrok](https://ngrok.com/), and follow their instructions for serving your local app to the internet. Keep in mind that the app is running on port 3000.

#### Sending Twilio requests to your server

You're going to need a Twilio account to set this up, then follow the steps below.

1. Add a phone number for your acount.
   - Make sure to get a phone number that you can actually text. Our friend [Geordy](https://github.com/Geordy-Decena) originally set us up with a U.S. phone number. We will not be participating in another hackathon with him.
2. Configure the phone number to send a Webhook to `https://your-ngrok-url/sms`. Make sure it's a POST request.

#### RapidAPI Key

Unless you're set up to use our Google Cloud Secrets Manager, you'll need to create your own RapidAPI key to be able to search the web.

Enter this api key in the `options` object in `src/bing-search.js`.

#### Finished!

And that's it! You're done setting up for local development.

