const dotenv = require('dotenv').config();
const express = require('express');
const http = require('http'); // new
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
const fetchAdminEventRouter = require('./routes/AdminEventRoutes');
const fetchAdminStoryRouter = require('./routes/AdminStoryRoutes');
const UserPostRouter = require('./routes/UserPostRoutes');
const NotificationRouter = require('./routes/notificationRoutes');
const UserSearchRouter = require('./routes/UserSearchRoutes');
const AnnouncementRouter = require('./routes/AdminAnnouncementRoutes');
const StatRouter = require('./routes/AdminStatRoutes');
const { initializeSocket } = require('./middlewares/Socket');
const server = http.createServer(app);

// cors
const cors = require('cors');
const corsOptions = require('./middlewares/Cors');

// db connection
const myDb = dbConnect(); 

// default middlewares
app.use(express.json({ limit: '10mb' }));
app.use(cors(corsOptions));

// routes
app.use(process.env.ADMIN_ROUTE, adminRoutes); // admin URL
app.use(process.env.USER_ROUTE, userRouters); //user URL
app.use(process.env.ADMIN_ROUTE, adminjobRouter); // admin job URL
app.use(process.env.ADMIN_ROUTE, AdminEventRouter); // admin event route
app.use(process.env.ADMIN_ROUTE, AdminStoryRouter) // admin success story post
app.use(process.env.USER_ROUTE, UserPostRouter) // user can post anything
app.use(process.env.USER_ROUTE, AnnouncementRouter); // user can see announcements
app.use(process.env.ADMIN_ROUTE, AnnouncementRouter); // admin can see announcements
app.use(process.env.ADMIN_ROUTE, StatRouter); // admin can see stats

// fetching route
app.use(process.env.ADMIN_ROUTE, fetchRouter); // admin can access user data
app.use(process.env.USER_ROUTE, fetchAdminJobsRouter); // user can fetch jobs posted by admin
app.use(process.env.USER_ROUTE, fetchAdminEventRouter); // user can fetch events posted by admin
app.use(process.env.USER_ROUTE, fetchAdminStoryRouter); // user can fetch success stories posted by admin
app.use(process.env.USER_ROUTE, NotificationRouter); // user can get the notification
app.use(process.env.USER_ROUTE, UserSearchRouter); // user search route

// image upload route
app.use(process.env.ADMIN_ROUTE, AdminImageUploadRouter); // admin image upload
app.use(process.env.USER_ROUTE, UserImageUploadRouter); // user image upload

// web socket
const io = initializeSocket(server);
app.set("io", io);

// start server
server.listen(process.env.PORT, () => {
    console.log(`This server is running on ${process.env.PORT}`)
});