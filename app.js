const path = require('path');
const express = require("express");
const morgan = require("morgan");
const rateLimit = require('express-rate-limit');
//npm i express-rate-limit
const helmet = require('helmet');
//npm i helmet
const mongoSanitize = require('express-mongo-sanitize');
// npm i express-mongo-sanitize
const xss = require('xss-clean');
// npm i xss-clean
const hpp = require('hpp');
//npm i hpp
const cookieParser = require('cookie-parser');
//npm i cookie-parser

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRoutes");

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) Global MIDDLEWARES

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

//Set Security HTTP headers
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// Morgan is a middleware for logging HTTP requests in Express.js applications. It helps track incoming requests, their status codes, response times, and other information, which can be very useful for debugging and monitoring.

//Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(hpp({
    whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
}));

//Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.cookies);
    next();
})

//axios Security
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "script-src 'self' https://cdnjs.cloudflare.com");
    next();
});


// 3) ROUTES

app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.all("*", (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on this server`
    // })

    // const err = new Error(`Can't find ${req.originalUrl} on this server`);
    // err.status = 'fail';
    // err.statusCode = 404;

    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
})
//app.all works for all HTTP requests (GET, POST, PATCH, DELETE)

// app.use((err, req, res, next) => {
//     console.log(err.stack);

//     err.statusCode = err.statusCode || 500;
//     err.status = err.status || 'error';

//     res.status(err.statusCode).json({
//         status: err.status,
//         message: err.message
//     })
// })
//OR
app.use(globalErrorHandler);


// 4) START SERVER
module.exports = app;


