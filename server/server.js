const dotenv = require('dotenv').config();
const express = require('express')
const app = express();
const dbConnect = require('./config/db');
const userRouters = require('./routes/userRoutes');
const adminRoutes  = require('./routes/adminRoutes');
const fetchRouter = require('./routes/fetchRoutes');
const adminjobRouter = require('./routes/AdminJobRoutes');
const AdminEventRouter = require('./routes/AdminEventRoutes');
const AdminStoryRouter = require('./routes/AdminStoryRoutes');
const AdminImageUploadRouter = require('./routes/cloudinaryRoutes');
const UserImageUploadRouter = require('./routes/cloudinaryRoutes');
const fetchAdminJobsRouter = require('./routes/FetchAdminJobRoutes');
const UserPostRouter = require('./routes/UserPostRoutes');

// cors
const cors = require('cors');
const corsOptions = require('./middlewares/Cors');

// db connection
const myDb = dbConnect(); 

// default middlewares
app.use(express.json());
app.use(cors(corsOptions));

// routes
app.use(process.env.ADMIN_ROUTE, adminRoutes); // admin URL
app.use(process.env.USER_ROUTE, userRouters); //user URL
app.use(process.env.ADMIN_ROUTE, adminjobRouter); // admin job URL
app.use(process.env.ADMIN_ROUTE, AdminEventRouter); // admin event route
app.use(process.env.ADMIN_ROUTE, AdminStoryRouter) // admin success story post
app.use(process.env.USER_ROUTE, UserPostRouter) // user can post anything

// fetching route
app.use(process.env.ADMIN_ROUTE, fetchRouter); // admin can access user data
app.use(process.env.USER_ROUTE, fetchAdminJobsRouter); // user can fetch jobs posted by admin

// image upload route
app.use(process.env.ADMIN_ROUTE, AdminImageUploadRouter); // admin image upload
app.use(process.env.USER_ROUTE, UserImageUploadRouter); // user image upload

// start server
app.listen(process.env.PORT, () => {
    console.log(`This server is running on ${process.env.PORT}`)
});