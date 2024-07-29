const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Middleware for HTTPS redirection
// app.use((req, res, next) => {
//   if (req.secure) {
//     return next();
//   }
//   res.redirect('https://' + req.headers.host + req.url);
// });

// Security headers
app.use(helmet());
app.use(cookieParser());

// Security headers
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data:; font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; connect-src 'self' http://localhost:3001 https://www.sporti.ksp.gov.in https://sporti-admin.vercel.app http://localhost:5000 https://sporti-services-backend.onrender.com https://sporti2.vercel.app; frame-ancestors 'none';");
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Helmet configuration to add HSTS header
app.use(helmet.hsts({
  maxAge: 31536000,  // 1 year
  includeSubDomains: true,
  preload: true
}));

app.use(express.json());
app.use(mongoSanitize());
app.use(xss());

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3003', 'https://sporti-admin.vercel.app', 'https://sporti-admin.vercel.app/bookings', 'http://localhost:3001', 'https://www.sporti.ksp.gov.in', 'https://sporti2.vercel.app', 'https://www.sporti.ksp.gov.in/login', 'https://sporti-admin.vercel.app/login', 'https://sporti-admin.vercel.app/dashboard', 'https://sporti-admin.vercel.app/bookings'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true, // Allow cookies to be sent with requests
}));

// Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const adminBookings = require('./routes/adminBooking');
const bookingRoutes = require('./routes/servicebooking');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminBookings);
app.use('/api/sporti/service', bookingRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
