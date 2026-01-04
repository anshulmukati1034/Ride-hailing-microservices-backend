require("dotenv").config();
const connectDB = require("./db/db");
const startConsumer = require("./consumer");

(async () => {
  await connectDB();
  await startConsumer();
})();
