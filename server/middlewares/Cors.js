const dotenv = require('dotenv').config();
const corsOptions = {
    origin: process.env.CLIENT_ROUTE,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
  }

module.exports = corsOptions;