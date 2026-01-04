const { subscribeToQueue, publishToQueue } = require("./service/rabbit");
const Notification = require("./models/notification.model");
const sendNotification = require("./service/notifier.service");

async function startConsumer() {
  await subscribeToQueue("ride_events", async (data) => {
    const payload = JSON.parse(data);

    try {
      const notification = await Notification.create({
        ride: payload.rideId,
        user: payload.userId,
        captain: payload.captainId,
        event: payload.event,
        status: "pending"
      });

      await sendNotification(payload);

      notification.status = "sent";
      await notification.save();

      console.log("✅ Notification sent successfully");
    } catch (err) {
      console.error("❌ Notification failed");

      if (payload.retryCount < 3) {
        payload.retryCount += 1;

        await publishToQueue(
          "ride_events",
          JSON.stringify(payload)
        );
      } else {
        await Notification.create({
          ride: payload.rideId,
          user: payload.userId,
          captain: payload.captainId,
          event: payload.event,
          status: "failed",
          retryCount: payload.retryCount,
          errorMessage: err.message
        });
      }
    }
  });
}

module.exports = startConsumer;
