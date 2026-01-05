const { subscribeToQueue, publishToQueue } = require("./service/rabbit");
const Payment = require("./models/payment.model");
const processPayment = require("./service/payment.processor");

async function startConsumer() {
  await subscribeToQueue("ride_events", async (data) => {
    const payload = JSON.parse(data);

    // only process completed rides
    if (payload.event !== "completed") return;

    try {
      const payment = await Payment.create({
        rideId: payload.rideId,
        userId: payload.userId,
        amount: payload.amount,
        status: "pending"
      });

      await processPayment(payload);

      payment.status = "success";
      await payment.save();

      await publishToQueue(
        "payment_events",
        JSON.stringify({
          paymentId: payment._id,
          rideId: payment.rideId,
          userId: payment.userId,
          status: "success"
        })
      );

      console.log("✅ Payment success");
    } catch (err) {
      console.error("❌ Payment failed");

      await publishToQueue(
        "payment_events",
        JSON.stringify({
          rideId: payload.rideId,
          userId: payload.userId,
          status: "failed"
        })
      );
    }
  });
}

module.exports = startConsumer;
