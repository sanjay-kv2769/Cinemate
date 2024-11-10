const Movie = require('../model/movieModel');

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

exports.GetAllMovies = async (req, res) => {
  try {
    // const movie = await Movie.find(req.query);

    // =================== Filtering =======================
    // ------Excluding query object properties------
    // url: localhost:8080/api/movie?duration=150&ratings=5&price=100&sort=1&page=12
    // const excludeFields = ['sort', 'page', 'limit', 'fields'];
    // const queryObj = { ...req.query };
    // excludeFields.forEach((ele) => {
    //   delete queryObj[ele];
    // });
    // const movie = await Movie.find(queryObj);

    // ------filtering example------
    // url: localhost:8080/api/movie?duration=150&ratings=5&price=100
    // const movie = await Movie.find()
    // .where('duration')
    // .equals(req.query.duration)
    // .where('releaseYear')
    // .equals(req.query.releaseYear);

    // ------Advance filtering example------
    // url: localhost:8080/api/movie?duration[gte]=150&ratings[gte]=5&price[lte]=100
    // ----------on code-----------
    // const movie = await Movie.find({
    //   duration: { $gte: 150 },
    //   ratings: { $gte: 5 },
    //   price: { $lte: 100 },
    // });
    // ----------on code-----------
    // const movie = await Movie.find()
    //   .where('duration')
    //   .gte(req.query.duration)
    //   .where('ratings')
    //   .gte(req.query.ratings)
    //   .where('price')
    //   .lte(req.query.price);
    // ---------on api query to work------------
    // console.log(req.query);
    // let queryStr = JSON.stringify(req.query);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // const queryObj = JSON.parse(queryStr);
    // console.log(queryObj);
    // const movie = await Movie.find(queryObj);

    // =================== SORTING =======================
    // url: http://localhost:8080/api/movie/?sort=price
    let query = Movie.find();

    // ------sorting by price only-----
    //url: localhost:8080/api/movie/?sort=price
    // if (req.query.sort) {
    //   query = query.sort(req.query.sort);
    // }
    //------sorting by releaseYear and ratings------
    //url: localhost:8080/api/movie/?sort=releaseYear,-ratings
    http: if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
      // query.sort('releaseYear ratings');
    } else {
      query = query.sort('-createdAt');
    }

    const movie = await query;

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
