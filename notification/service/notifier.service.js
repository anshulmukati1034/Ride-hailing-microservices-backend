module.exports = async ({ event, userId, captainId }) => {
  console.log(
    `🔔 Notification | Event: ${event} | User: ${userId} | Captain: ${captainId}`
  );

  // simulate random failure
  if (Math.random() < 0.3) {
    throw new Error("Notification delivery failed");
  }
};
