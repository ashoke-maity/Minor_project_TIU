const dotenv = require('dotenv').config();
const express = require('express')
const app = express();
const dbConnect = require('./config/db');
const userRouters = require('./routes/userRoutes');
const adminRoutes  = require('./routes/adminRoutes');
const fetchRouter = require('./routes/fetchRoutes');
const userDashboardRouters = require('./routes/userRoutes');
const adminDashboardRouters = require('./routes/adminRoutes');
const cors = require('cors');
const corsOptions = require('./middlewares/Cors');

// db connection
const myDb = dbConnect(); 

// middlewares
app.use(express.json())
app.use(cors(corsOptions));

// routes
app.use(process.env.ADMIN_ROUTE, adminRoutes); // admin URL
app.use(process.env.USER_ROUTE, userRouters); //user URL

// fetching route
app.use(process.env.ADMIN_ROUTE, fetchRouter); // admin can access user data

// start server
app.listen(process.env.PORT, () => {
    console.log(`This server is running on ${process.env.PORT}`)
});