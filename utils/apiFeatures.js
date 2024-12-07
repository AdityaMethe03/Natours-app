class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el])

        //1B) Advanced Filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr))
        // let query = Tour.find(JSON.parse(queryStr));

        return this; //this return entire object
    }

    sort() {
        if (this.queryString.sort) {
            // console.log(this.queryString.sort);
            const sortBy = this.queryString.sort.split(",").join(" ");
            // console.log(sortBy);
            this.query = this.query.sort(sortBy);
            // sort => 'price ratingsAverage'
        } else {
            this.query = this.query.sort("-createdAt");
        }

        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select("-__v")
        }

        return this;
    }

    paginate() {
        //will multiply by 1 to convert string to number
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        //EXAMPLE - page=2&limit=10  1-10=>page1, 11-20=>page2, 21-30=>page3
        this.query = this.query.skip(skip).limit(limit);

        //we do not need to send error when limit exids
        //users will be able understand it when there will be no tours

        return this;
    }

}

module.exports = APIFeatures;