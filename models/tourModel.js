const mongoose = require('mongoose');
const slugify = require("slugify");
const validator = require('validator');
// npm i validator
const User = require('./userModel');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name"],
        unique: true,
        trim: true,
        maxLength: [40, "A tour must have less or equal then 40 characters"],
        minLength: [10, "A tour must have more or equal then 10 characters"]
        // validate: [validator.isAlpha, "Tour name must only contain characters"]
        //is validating spaces also which is not helpful
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, "A tour must have a duration"]
    },
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have a group size"]
    },
    difficulty: {
        type: String,
        required: [true, "A tour must have a difficulty"],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either easy, medium or hard'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must be equal to or above 1.0"],
        max: [5, "Rating must be equal to or below 5.0"],
        set: val => Math.round(val * 10) / 10 //4.666666 - 4.7 //Only Math.round(val) will give 4.66666 - 5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price"]
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                //this only points to CURRENT doc on NEW document creation
                return val < this.price;
            },
            message: "Discount price ({VALUE}) should be below regular price"
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, "A tour must have a description"]
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, "A tour must have a cover image"]
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean
    },
    startLocation: {
        //GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

//this property is not actually a part of database so we cannot send query as e.g. Tour.find(durationweeks = 1)
tourSchema.virtual("durationWeeks").get(function () {
    return this.duration / 7; //here this will be pointing to current document
})

//Virtual populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
});

//DOCUMENT MIDDLEWARE: runs before .save() and .create() and NOT .update()
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
})

// tourSchema.pre('save', async function (next) {
//     const guidesPromises = this.guides.map(async id => await User.findById(id))
//     this.guides = await Promise.all(guidesPromises);
//     next();
// })

// tourSchema.pre('save', function (next) {
//     console.log("Will save document");
//     next();
// })

// tourSchema.post('save', function (doc, next) {
//     console.log(doc);
//     next();
// })

// tourSchema.pre('find', function (next) {
//because if we execute this on 'find' query only then it will not be executed on findOne which will still give secretTour 
tourSchema.pre(/^find/, function (next) { //used regex, will execute on every query which starts with 'find'
    this.find({ secretTour: { $ne: true } })

    this.start = Date.now();
    next();
});

tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt' //to not show these feilds 
    });
    next();
})

tourSchema.post(/^find/, function (docs, next) {
    // console.log(docs)
    console.log(`Query took ${Date.now() - this.start} milliseconds`);
    next();
});


// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function (next) {
//     this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); //unshift add at the beginning of the array
//     console.log(this.pipeline());
//     next();
// })

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;