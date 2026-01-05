const express = require('express');
const router = express.Router();
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middleware/auth.middleware');   


router.post('/create-rides', authMiddleware.userAuth, rideController.createRide);
router.put('/accept-ride',authMiddleware.captainAuth, rideController.acceptRide)
router.put('/complete-ride',authMiddleware.captainAuth,rideController.completeRide);

module.exports = router;