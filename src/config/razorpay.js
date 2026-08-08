import dotenv from "dotenv";
import Razorpay from "razorpay";

dotenv.config({ path: "./.env" });

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
  console.error(
    "[razorpay] RAZORPAY_KEY_ID and/or RAZORPAY_KEY_SECRET are not set. " +
    "Payment endpoints will not work until they are provided in the .env file."
  );
}

// Lazy-initialise the Razorpay instance so that the server can still start
// even when credentials are missing (other routes remain functional).
let _instance = null;

function getRazorpayInstance() {
  if (!keyId || !keySecret) {
    throw Object.assign(
      new Error("Razorpay credentials are not configured on the server."),
      { statusCode: 500 }
    );
  }
  if (!_instance) {
    _instance = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return _instance;
}

export { keyId, keySecret, getRazorpayInstance };
