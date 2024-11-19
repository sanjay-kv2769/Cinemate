const mongoose = require('mongoose');
const fs = require('fs');

const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required failed!'],
      unique: true,
      trim: true,
      MaxLength: [100, 'Movie name must not have more than 100 characters'],
      MinLength: [4, 'Movie name must have at least 4 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required failed!'],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required failed!'],
    },
    ratings: {
      type: Number,
      // min: [1, 'Ratings must b 1.0 or above'],
      // max: [10, 'Ratings must b 10.0 or below'],
      validate: {
        validator: function (value) {
          return value >= 1 && value <= 10;
        },
        message: 'Ratings {{VALUE}} should be above 1 and below 10',
      },
    },
    totalRating: {
      type: Number,
    },
    releaseYear: {
      type: Number,
      required: [true, 'Release Year is required failed!'],
    },
    releaseDate: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    genres: {
      type: [String],
      required: [true, 'Genres is required failed!'],
      // enum: {
      //   values: [
      //     'Action',
      //     'Drama',
      //     'Fantasy',
      //     'Crime',
      //     'Adventure',
      //     'Sci-Fi',
      //     'Thriller',
      //     'Romance',
      //   ],
      //   message: 'This genre does not exist',
      // },
    },
    directors: {
      type: [String],
      required: [true, 'Directors is required failed!'],
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image is required failed!'],
    },
    actors: {
      type: [String],
      required: [true, 'Actors is required failed!'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required failed!'],
    },
    createdBy: { type: String },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtual property
movieSchema.virtual('durationInHours').get(function () {
  return this.duration / 60;
});

// Mongoose Middleware
// Document middleware
// Executed before the document is saved in db
// .save() or .create()
// insertMany(), findByIdAndUpdate will not work
movieSchema.pre('save', function (next) {
  this.createdBy = 'Sanjay';
  // console.log(this.createdBy);

  next();
});

movieSchema.post('save', function (doc, next) {
  const content = `A new movie document with name ${doc.name} has been created by ${doc.createdBy}\n`;
  fs.writeFileSync('./Log/log.txt', content, { flag: 'a' }, (err) => {
    console.log(err.message);
  });
  next();
});

// Query middleware
movieSchema.pre(/^find/, function (next) {
  this.find({ releaseDate: { $lte: Date.now() } });
  this.startTime = Date.now();
  next();
});

movieSchema.post(/^find/, function (doc, next) {
  this.find({ releaseDate: { $lte: Date.now() } });
  this.endTime = Date.now();
  const content = `Query took ${this.endTime - this.startTime} milliseconds \n`;
  fs.writeFileSync('./Log/log.txt', content, { flag: 'a' }, (err) => {
    console.log(err.message);
  });
  next();
});

// Aggregation middleware
movieSchema.pre('aggregate', function (next) {
  console.log(
    this.pipeline().unshift({ $match: { releaseDate: { $lte: new Date() } } })
  );

  next();
});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
