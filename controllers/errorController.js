const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {
    const value = Object.values(err.keyValue)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`
    return new AppError(message, 400);
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const handleJWTError = () => new AppError('Invalid token. Please log in again', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, req, res) => {
    // A) API
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }
    // B) RENDERED WEBSITE
    console.log('ERROR❌', err);

    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
    })

}

const sendErrorProd = (err, req, res) => {
    // console.log("err.isOperational: ", err.isOperational);
    // A) API
    if (req.originalUrl.startsWith('/api')) {
        // a) Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            })
        }
        // b) Programming or other unknown error: don't leak error details
        //1) Log error
        console.log('ERROR❌', err);
        //2) Send generic message
        return res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        })

    }
    // B) RENDERED WEBSITE
    if (err.isOperational) {
        // a) Operational, trusted error: send message to client
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message
        })
    }
    // b) Programming or other unknown error: don't leak error details
    //1) Log error
    console.log('ERROR❌', err);
    //2) Send generic message
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: "Please try again later."
    })
}

module.exports = (err, req, res, next) => {
    // console.log(err.stack);
    // console.log(process.env.NODE_ENV);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production ') {
        let error = { ...err, name: err.name };
        error.message = err.message;
        if (error.name === "CastError") {
            error = handleCastErrorDB(error);
        }
        if (error.code === 11000) {
            error = handleDuplicateFieldsDB(error);
        }
        if (error.name === "ValidationError") {
            error = handleValidationErrorDB(error);
        }
        if (error.name === 'JsonWebTokenError') {
            error = handleJWTError();
        }
        if (error.name === 'TokenExpiredError') {
            error = handleJWTExpiredError();
        }
        // console.log(err.message);
        // console.log(error.message);
        sendErrorProd(error, req, res);
    }
}


//ERROR:
// {
//     "status": "error",
//     "error": {
//         "stringValue": "\"wwwwwwwwwwwwww\"",
//         "valueType": "string",
//         "kind": "ObjectId",
//         "value": "wwwwwwwwwwwwww",
//         "path": "_id",
//         "reason": {},
//         "name": "CastError",
//         "message": "Cast to ObjectId failed for value \"wwwwwwwwwwwwww\" (type string) at path \"_id\" for model \"Tour\""
//     },
//     "message": "Cast to ObjectId failed for value \"wwwwwwwwwwwwww\" (type string) at path \"_id\" for model \"Tour\"",
//     "stack": "CastError: Cast to ObjectId failed for value \"wwwwwwwwwwwwww\" (type string) at path \"_id\" for model \"Tour\"\n    at model.Query.exec (C:\\Users\\Aditya\\OneDrive - vitbhopal.ac.in\\Desktop\\aditya\\NodeJs\\4-natours-after-sec9\\node_modules\\mongoose\\lib\\query.js:4498:21)\n    at Query.then (C:\\Users\\Aditya\\OneDrive - vitbhopal.ac.in\\Desktop\\aditya\\NodeJs\\4-natours-after-sec9\\node_modules\\mongoose\\lib\\query.js:4592:15)"
// }
//PROBLEM OCCURRED:
// The reason you explicitly assign the name property when making a shallow copy of the err object is to ensure that the name property, which is crucial for identifying the type of error, is retained in the copied object. When you perform a shallow copy using the spread operator ({ ...err }), only the own enumerable properties of the object are copied, but some important properties of error objects, like name, might not be copied because they are part of the prototype chain or non-enumerable.
//solution:
//let error = { ...err, name: err.name };