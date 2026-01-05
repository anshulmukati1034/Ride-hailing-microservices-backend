const rideModel = require("../models/ride.model");
const { subscribeToQueue, publishToQueue } = require("../service/rabbit");
const calculateFare = require("../utils/calculateFare");

// module.exports.createRide = async (req, res, next) => {

//     const { pickup, destination } = req.body;

//     const newRide = new rideModel({
//         user: req.user._id,
//         pickup,
//         destination
//     })

//     await newRide.save();
//     publishToQueue("new-ride", JSON.stringify(newRide))
//     res.send(newRide);
// }

module.exports.createRide = async (req, res) => {
  const { pickup, destination } = req.body;

  const fare = calculateFare(pickup, destination); // 🔥 NO HARDCODE

  const newRide = await rideModel.create({
    user: req.user._id,
    pickup,
    destination,
    fare,
  });

  await publishToQueue(
    "ride_events",
    JSON.stringify({
      rideId: newRide._id,
      userId: newRide.user,
      event: "requested",
      retryCount: 0,
    })
  );

  res.send(newRide);
};

// module.exports.acceptRide = async (req, res, next) => {
//     const { rideId } = req.query;
//     const ride = await rideModel.findById(rideId);
//     if (!ride) {
//         return res.status(404).json({ message: 'Ride not found' });
//     }

//     ride.status = 'accepted';
//     await ride.save();
//     publishToQueue("ride-accepted", JSON.stringify(ride))
//     res.send(ride);
// }

module.exports.acceptRide = async (req, res) => {
  const { rideId } = req.query;

  const ride = await rideModel.findById(rideId);
  if (!ride) {
    return res.status(404).json({ message: "Ride not found" });
  }

  ride.status = "accepted";
  await ride.save();

  await publishToQueue(
    "ride_events",
    JSON.stringify({
      rideId: ride._id,
      userId: ride.user,
      captainId: ride.captain,
      event: "accepted",
      retryCount: 0,
    })
  );

  res.send(ride);
};


module.exports.completeRide = async (req, res) => {
  const { rideId } = req.query;

  const ride = await rideModel.findById(rideId);
  if (!ride) {
    return res.status(404).json({ message: "Ride not found" });
  }

  ride.status = "completed";
  await ride.save();


  await publishToQueue(
    "ride_events",
    JSON.stringify({
      rideId: ride._id,
      userId: ride.user,
      amount: ride.fare, 
      event: "completed",
      retryCount: 0,
    })
  );

  res.send(ride);
};
