const dotenv = require('dotenv');
dotenv.config();
const express = require('express'); 
const app = express();
const captainRoutes = require('./routes/captain.routes'); 
const cookieParser = require('cookie-parser'); 
const connectDB = require('./db/db.js'); 
const RabbitMq = require('./service/rabbit');
RabbitMq.connect();

app.use(express.json());
app.use(express.urlencoded({extended: true}));  
app.use(cookieParser());

connectDB();
app.use('/', captainRoutes);



module.exports = app;