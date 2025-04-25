const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const dbConnect = require('./config/mongoDB');
const userRouter = require('./routes/userRoutes');
const myDb = dbConnect();


app.use(express.json()) // default middleware

// api link
app.use("/api/alumniConnect", userRouter)

app.listen(process.env.PORT, 
    console.log(`This server is running on ${process.env.PORT}`)
);