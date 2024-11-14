const Movie = require('../model/movieModel');
const ApiFeatures = require('../utils/ApiFeature');

// exports.checkId = (req, res, next, value) => {
//   let id = value * 1;
//   console.log('User ID is ' + id);

//   const singleUser = userData.find((element) => element.id === id);

//   if (!singleUser) {
//     return res.status(404).json({
//       message: `the data with ${id} is not found`,
//     });
//   }
//   next();
// };

exports.getHighestRated = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratings';
  next();
};

exports.GetAllMovies = async (req, res) => {
  try {
    // =================Reusable Class=================
    const features = new ApiFeatures(Movie.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    let movie = await features.query;
    // =================Reusable Class End=================

    // const movie = await Movie.find(req.query);

    // =================== Filtering =======================
    // ------Excluding query object properties-----------------------------------------
    // url: localhost:8080/api/movie?duration=150&ratings=5&price=100&sort=1&page=12 --xxx
    // const excludeFields = ['sort', 'page', 'limit', 'fields'];
    // const queryObj = { ...req.query };
    // excludeFields.forEach((ele) => {
    //   delete queryObj[ele];
    // });
    // let query =  Movie.find(queryObj);

    // ------filtering example---------------------------------------------------------
    // url: localhost:8080/api/movie?duration=150&ratings=5&price=100 --xxx
    // const movie = await Movie.find()
    // .where('duration')
    // .equals(req.query.duration)
    // .where('releaseYear')
    // .equals(req.query.releaseYear);

    // ------Advance filtering example-------------------------------------------------
    // url: localhost:8080/api/movie?duration[gte]=150&ratings[gte]=5&price[lte]=100 --xxx
    // ----------on code----------------------------
    // const movie = await Movie.find({
    //   duration: { $gte: 150 },
    //   ratings: { $gte: 5 },
    //   price: { $lte: 100 },
    // });
    // ----------on code----------------------------
    // const movie = await Movie.find()
    //   .where('duration')
    //   .gte(req.query.duration)
    //   .where('ratings')
    //   .gte(req.query.ratings)
    //   .where('price')
    //   .lte(req.query.price);
    // ---------on api query to work----------------
    // console.log(req.query);
    // let queryStr = JSON.stringify(req.query);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // const queryObj = JSON.parse(queryStr);
    // console.log(queryObj);
    // const movie = await Movie.find(queryObj);

    // =================== SORTING =======================
    // url: http://localhost:8080/api/movie/?sort=price
    // let query = Movie.find();

    // ------sorting by price only-----
    //url: localhost:8080/api/movie/?sort=price --xxx
    // if (req.query.sort) {
    //   query = query.sort(req.query.sort);
    // }
    //------sorting by releaseYear and ratings------
    //url: localhost:8080/api/movie/?sort=releaseYear,-ratings --xxx
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    //   // query.sort('releaseYear ratings');
    // } else {
    //   query = query.sort('-createdAt');
    // }

    // const movie = await query;

    // =================== Limiting fields (in data) =======================
    //url: http://localhost:8080/api/movie/?fields=name,releaseYear,price,ratings--xxxxxx
    // if (req.query.fields) {
    //   // query.select('name duration price ratings')
    //   const fields = req.query.fields.split(',').join(' ');
    //   console.log(fields);

    //   query = query.select(fields);
    // }
    // else{
    //   query = query.select('-__v');

    // }
    // const movie = await query;

    // =================== Pagination =======================
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 10;
    // // Page 1: 1 - 10; Page 2: 11-20; Page 3: 21 - 30;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const moviesCount = await Movie.countDocuments();
    //   if (skip >= moviesCount) {
    //     throw new Error('This page is not found!');
    //   }
    // }
    // const movie = await query;

    res.status(200).json({
      status: 'success',
      length: movie.length,
      data: {
        movie,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.GetSingleMovies = async (req, res) => {
  try {
    const movie = await Movie.find({ _id: req.params.id });
    res.status(200).json({
      status: 'success',
      data: {
        movie,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.AddNewMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        movie,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.UpdateMovie = async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json({
      status: 'success',
      data: {
        movie: updatedMovie,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.DeleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.MovieStats = async (req, res) => {
  try {
    const stats = await Movie.aggregate([
      // { $match: { releaseDate: { $lte: new Date() } } },
      { $match: { ratings: { $gte: 4.0 } } },
      {
        $group: {
          // _id: null,
          _id: '$releaseYear',
          avgRating: { $avg: '$ratings' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          priceTotal: { $sum: '$price' },
          movieCount: { $sum: 1 },
        },
      },
      { $sort: { minPrice: -1 } },
      // { $match: { maxPrice: { $gte: 10 } } },
    ]);

    res.status(200).json({
      status: 'success',
      length: stats.length,
      data: {
        stats,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.getMovieByGenre = async (req, res) => {
  try {
    const genre = req.params.genre;
    const movies = await Movie.aggregate([
      { $unwind: '$genres' },
      {
        $group: {
          _id: '$genres',
          movieCount: { $sum: 1 },
          movies: { $push: '$name' },
        },
      },
      { $addFields: { genre: '$_id' } },
      { $project: { _id: 0 } },
      { $sort: { movieCount: -1 } },
      // {$limit:6},
      { $match: { genre: genre } },
    ]);

    res.status(200).json({
      status: 'success',
      length: movies.length,
      data: {
        movies,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};
