#Natours Application🌍🏕️

A feature-rich tour booking API built using Node.js, Express, MongoDB, and Mongoose, implementing authentication, authorization, geospatial queries, and advanced error handling.

🚀 Features

1.User authentication & authorization (JWT-based).
2.Role-based access control (Admin, Users, etc.).
3.Geospatial queries ($geoNear) for nearby tour searches.
4.API rate limiting, data sanitization, and security enhancements.
5.CRUD operations for tours, users, and bookings.
6.Stripe payment integration (if added).
7.Query filtering, sorting, pagination, and field selection.
8.Advanced error handling using global error middleware.
9.MongoDB Aggregation Pipeline for analytics.

🛠️ Tech Stack

Backend: Node.js, Express.js
Database: MongoDB, Mongoose
Authentication: JWT (JSON Web Token), bcrypt
Security: Helmet, rate limiting, CORS, xss-clean, Express-mongo-sanitize
Testing: Postman

📂 Project Structure

  📦 natours-api
  ├── 📁 controllers     # Business logic for tours, users, etc.
  ├── 📁 models          # Mongoose schemas & models
  ├── 📁 routes          # API route handlers
  ├── 📁 utils           # Utility functions (error handling, etc.)
  ├── 📁 middleware      # Custom middleware (authentication, error handling, etc.)
  ├── server.js         # Entry point of the application
  ├── config.env        # Environment variables (ignored in .gitignore)
  └── README.md         # Documentation

