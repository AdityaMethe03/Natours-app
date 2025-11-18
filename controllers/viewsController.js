const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
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

exports.getMyTours = catchAsync(async (req, res, next) => {
    // 1) Find all bookings
    const bookings = await Booking.find({ user: req.user.id })

    // 2)Find tours with the returned IDs
    const tourIDs = bookings.map(el => el.tour.id);
    const tours = await Tour.find({ _id: { $in: tourIDs } });

    res.status(200).render('overview', {
        title: 'My Tours',
        tours
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
    // 1) Filtering Logic
    const filterObj = {};

    // If a role is selected and it's not "all", add it to the query
    if (req.query.role && req.query.role !== 'all') {
        filterObj.role = req.query.role;
    }

    // 2) Sorting Logic
    let sortStr = 'name'; // Default sort (A-Z)

    if (req.query.sort) {
        const sortMap = {
            'name-asc': 'name',
            'name-desc': '-name',
            'newest': '-_id', // _id naturally sorts by creation time
            'oldest': '_id'
        };
        // Use the map or fallback to default
        sortStr = sortMap[req.query.sort] || 'name';
    }

    // 3) Pagination Setup
    const page = req.query.page * 1 || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // 4) Execute Query
    // IMPORTANT: Count *filtered* documents for correct pagination numbers
    const numUsers = await User.countDocuments(filterObj);
    const totalPages = Math.ceil(numUsers / limit);

    const users = await User.find(filterObj)
        .select('+active')
        .sort(sortStr)
        .skip(skip)
        .limit(limit);

    // 5) Render Template
    res.status(200).render('manageUsers', {
        title: 'Manage Users',
        users,
        currentPage: page,
        totalPages,
        results: numUsers,
        // Pass current filters back to view so we can keep dropdowns selected
        currentRole: req.query.role || 'all',
        currentSort: req.query.sort || 'name-asc'
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
