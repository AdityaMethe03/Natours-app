const express = require('express');
const tourControllers = require('../controllers/tourControllers');
const authController = require('../controllers/authController');
// const reviewController = require('../controllers/reviewController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// router.param('id', tourControllers.checkID);

//NESTED ROUTES
// POST /tour/356sdf56/reviews
// GET /tour/356sdf56/reviews
// GET /tour/356sdf56/reviews/654sdf55

// router.route("/:tourId/reviews")
//     .post(
//         authController.protect,
//         authController.restrictTo('user'),
//         reviewController.createReview
//     )

router.use('/:tourId/reviews', reviewRouter); //IMPORTANT

router.route("/top-5-cheap")
    .get(tourControllers.aliasTopTours, tourControllers.getAllTours);

router.route("/tour-stats")
    .get(tourControllers.getTourStats);

router.route("/monthly-plan/:year")
    .get(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide', 'guide'),
        tourControllers.getMonthlyPlans
    );

router.route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(tourControllers.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit')
    .get(tourControllers.getDistances);

router.route("/")
    .get(tourControllers.getAllTours)
    .post(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourControllers.createTour);

router.route("/:id")
    .get(tourControllers.getTour)
    .patch(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourControllers.uploadTourImages,
        tourControllers.resizeTourImages,
        tourControllers.updateTour
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourControllers.deleteTour
    );

module.exports = router;