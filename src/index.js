// librar imports
const express = require("express");
const morgan = require("morgan")
const path = require('path')
// require("dotenv").config({ path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`) })
require("dotenv").config();
// custom imports 
const { mainRouter } = require("./routes");
const { logger } = require("./utils/logger");

// Initiate App
const app = express();

const port = process.env.PORT;

// middleware
app.use(express.json());


if (process.env.NODE_ENV === "development") {
  app.use(morgan('common'));
}


// API
app.use("/api/v1", mainRouter)

app.listen(port, () => {
  logger.info(`${process.env.NODE_ENV} server listening on PORT : ${port}`)
});

module.exports = app;