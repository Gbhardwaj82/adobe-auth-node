const adobeApiKey = "YOUR_API_KEY";
const adobeApiSecret = "YOUR_API_SECRET";
const webhookUrl = "YOUR WEBHOOK URL";
try {
  if (module) {
    module.exports = {
      adobeApiKey: adobeApiKey,
      adobeApiSecret: adobeApiSecret,
      webhookUrl: webhookUrl,
    }
  }
}
catch (err) {}