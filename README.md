
# Natours Application🌍🏕️

A feature-rich tour booking API built using Node.js, Express, MongoDB, and Mongoose, implementing authentication, authorization, geospatial queries, and advanced error handling.


## 🚀 Features


- User authentication & authorization (JWT-based).
- Role-based access control (Admin, Users, etc.).
- Geospatial queries ($geoNear) for nearby tour searches.
- API rate limiting, data sanitization, and security enhancements.
- CRUD operations for tours, users, and bookings.
- Stripe payment integration (if added).
- Query filtering, sorting, pagination, and field selection.
- Advanced error handling using global error middleware.
- MongoDB Aggregation Pipeline for analytics.

## 🛠️ Tech Stack

**Backend:** Node.js, Express.js

**Database:** MongoDB, Mongoose

**Authentication:** JWT (JSON Web Token), bcrypt

**Security:** Helmet, rate limiting, CORS, xss-clean, Express-mongo-sanitize

**Testing:** Postman



## 📂 Project Structure
```
📦 natours-api
  ├── 📁 controllers     # Business logic for tours, users, and bookings
  ├── 📁 dev-data        # Sample data for database seeding
  ├── 📁 models          # Mongoose schemas & models
  ├── 📁 public          # Static files (CSS, JS, images)
  ├── 📁 routes          # API route handlers (tours, users, bookings)
  ├── 📁 utils           # Utility functions (error handling, etc.)
  ├── 📁 views           # Template views (if using templating engine like Pug)
  ├── .eslintrc.json     # ESLint configuration
  ├── .gitignore         # Files and directories to ignore in version control
  ├── .prettierrc        # Prettier configuration for code formatting
  ├── README.md          # Project documentation
  ├── app.js             # Express app initialization
  ├── package.json       # Project dependencies and scripts
  ├── package-lock.json  # Dependency lock file
  └── server.js          # Main server file
```
## ⚙️ Installation & Setup

1️⃣ Clone the Repository

```bash
  git clone https://github.com/your-username/natours-api.git
  cd natours-api
```
2️⃣ Install Dependencies
```bash
npm install
```

3️⃣ Configure Environment Variables
- Create a .env file in the root directory and set up the required variables:
```bash
PORT=3000
DATABASE=mongodb+srv://your-db-url
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=90d
EMAIL_USERNAME=your_email
EMAIL_PASSWORD=your_email_password
```

4️⃣ Run the Server
- For development:

```bash
npm run dev
```

- For production:

```bash
npm start
```


    
## API Endpoints

| Method | Endpoint | Description     | Access |
|:------ |:-------- | :------- | :------------------------- |
| GET | /api/v1/tours | Get all tours | Public |
| GET | /api/v1/tours/:id | Get a single tour | Public |
| POST | /api/v1/tours | Create a new tour | Admin |
| PATCH | /api/v1/tours/:id | Update tour details | Admin |
| DELETE | /api/v1/tours/:id | Delete a tour | Admin |
| POST | /api/v1/users/signup | User Signup | Public |
| POST | /api/v1/users/login | User Login | Public |
| GET | /api/v1/users/me | Get logged-in user details | Private |
| POST | /api/v1/bookings/checkout | Create Booking | Private |


(More endpoints available in API documentation.)


## Deployment

You can deploy this API using Render, Vercel, AWS, or DigitalOcean. Ensure to configure your environment variables properly.

- For example, deploying on Render:
    1. Push code to GitHub 
    2. Connect repository to Render
    3. Set up environment variables
    4. Deploy the application


## Feedback

If you have any feedback, please reach out to me at metheaditya5@gmail.com 

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/aditya-methe-238930242/)

