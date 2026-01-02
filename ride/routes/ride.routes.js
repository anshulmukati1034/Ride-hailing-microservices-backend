const express = require('express');
const router = express.Router();
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middleware/auth.middleware');   


router.post('/create-rides', authMiddleware.userAuth, rideController.createRide);





module.exports = router;