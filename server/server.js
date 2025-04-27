const dotenv = require('dotenv').config();
const express = require('express')
const app = express();
const dbConnect = require('./config/db');
const userRouters = require('./routes/userRoutes');
const adminRoutes  = require('./routes/adminRoutes');
const fetchRouter = require('./routes/fetchRoutes');
const userDashboardRouters = require('./routes/userRoutes');
const adminDashboardRouters = require('./routes/adminRoutes');

// db connection
const myDb = dbConnect(); 

// middlewares
app.use(express.json())

// general routes
app.use(process.env.ADMIN_ROUTE, adminRoutes); // admin URL
app.use(process.env.USER_ROUTE, userRouters); //user URL

// protected routes
app.use(process.env.USER_ROUTE, userDashboardRouters) //user profile
app.use(process.env.ADMIN_ROUTE, adminDashboardRouters) // admin profile

// fetching route
app.use(process.env.ADMIN_ROUTE, fetchRouter); // admin can access user data

// start server
app.listen(process.env.PORT, () => {
    console.log(`This server is running on ${process.env.PORT}`)
});