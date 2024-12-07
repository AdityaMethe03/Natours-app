const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
const Review = require('./../../models/reviewModel');
const User = require('./../../models/userModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 50000,
}).then(() => {
    console.log("DB connection successfull!")
})

//READ JSON FILE
const tours = JSON.parse(fs.readFileSync('dev-data/data/tours.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync('dev-data/data/users.json', 'utf-8'));
const reviews = JSON.parse(fs.readFileSync('dev-data/data/reviews.json', 'utf-8'));


//IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews);
        console.log("Data successfully loaded");
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

//DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log("Data successfully deleted");
        process.exit();
    } catch (error) {
        console.log(error)
    }
}

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
} 
