import express from "express";
import stripe from "../config/stripe.js";

const router = express.Router();

// NOTE: this route must receive the RAW body (see server.js), not JSON-parsed,
// for Stripe's signature verification to succeed.
router.post("/stripe", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("⚠️ Stripe webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      console.log("✅ Payment succeeded:", event.data.object.id);
      break;
    case "payment_intent.payment_failed":
      console.log("❌ Payment failed:", event.data.object.id);
      break;
    default:
      break;
  }

  res.status(200).json({ received: true });
});

export default router;
