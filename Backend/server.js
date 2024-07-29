const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const dbconnect = require('./dbconnect');
const cookie = require('cookie-parser');
const cors = require('cors');
const cloudinary = require("cloudinary").v2;

const app = express();

const authRoute = require('./routes/authRoutes');
const postRoute = require('./routes/postRoutes');
const userRoute = require('./routes/userRoutes');

dotenv.config("./.env");

// Configuration
cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define the allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://tokomoko.vercel.app',
  'https://tokomoko-git-main-krtksharmas-projects.vercel.app',
  'https://tokomoko-784o9khlr-krtksharmas-projects.vercel.app'
];

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true  // Allow credentials (cookies, etc.) to be sent
}));

app.use(express.json({limit:"10mb"}));
app.use(morgan("common"));
app.use(cookie());

app.use('/auth', authRoute);
app.use('/posts', postRoute);
app.use('/users', userRoute);

const PORT = process.env.PORT || 4000;

dbconnect();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
