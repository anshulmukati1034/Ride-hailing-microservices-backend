module.exports = async ({ amount }) => {
  console.log(`💳 Processing payment of ₹${amount}`);

  // simulate delay
  await new Promise((res) => setTimeout(res, 1000));

  // simulate random failure
  if (Math.random() < 0.2) {
    throw new Error("Payment failed at gateway");
  }

  return true;
};
