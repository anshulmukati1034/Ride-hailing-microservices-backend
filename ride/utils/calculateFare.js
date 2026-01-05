module.exports = function calculateFare(pickup, destination) {
  const BASE_FARE = 50;
  const PER_KM_RATE = 12;

  // dummy distance logic (replace later)
  const distanceKm = Math.floor(Math.random() * 10) + 1;

  return BASE_FARE + distanceKm * PER_KM_RATE;
};
