const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {

    // 1) Get tour data from collection
    const tours = await Tour.find();

    // 2) Build template
    // 3) Render that template using tour data from 1)
    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    });
});

exports.getTour = catchAsync(async (req, res, next) => {

    // 1) Get the data, for the requested tour (including reviews and guides)
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    })

    if (!tour) {
        return next(new AppError('There is no tour with that name', 404));
    }

    // 2) Build template
    // 3) Render template using data from 1)
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour
    });
})

exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: 'Log into your account'
    });
}

exports.getSignupForm = (req, res) => {
    res.status(200).render('signup', {
        title: 'Sign in to your account'
    });
}

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your account'
    });
}

exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    },
        {
            new: true,
            runValidators: true
        });

    res.status(200).render('account', {
        title: 'Your account',
        user: updatedUser
    });
});

exports.getManageTours = catchAsync(async (req, res, next) => {
    // 1) Get all tours
    const tours = await Tour.find();

    // 2) Render template
    res.status(200).render('manageTours', {
        title: 'Manage Tours',
        tours
    });
});

exports.getManageUsers = catchAsync(async (req, res, next) => {
    // 1) Get all users
    const users = await User.find();

    // 2) Render template
    res.status(200).render('manageUsers', {
        title: 'Manage Users',
        users
    });
});

exports.getManageReviews = catchAsync(async (req, res, next) => {
    // 1) Get all reviews
    const reviews = await Review.find();

    // 2) Render template
    res.status(200).render('manageReviews', {
        title: 'Manage Reviews',
        reviews
    });
});