const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/servicebooking');
const cors = require('cors')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://www.sporti.ksp.gov.in', 'https://sporti2.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow cookies to be sent with requests
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sporti/service', bookingRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
