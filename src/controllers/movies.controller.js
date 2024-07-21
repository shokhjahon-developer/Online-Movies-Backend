const Joi = require("joi");
const prisma = require("../utils/connection");

const getByViews = async (req, res, next) => {
  try {
    const movies = await prisma.movies.findMany({
      orderBy: {
        views: "desc",
      },
    });

    res.json({ message: "Success", data: movies });
  } catch (error) {
    next(error);
  }
};

const getByRating = async (req, res, next) => {
  try {
    const movies = await prisma.movies.findMany();

    res.json({ message: "Success", data: movies });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const movies = await prisma.movies.findMany();
    const watchedMovies = await prisma.watchHistory.findMany({
      where: { userId },
    });

    const watchedMovieIds = watchedMovies.map((history) => history.moviesId);

    for (const movie of movies) {
      if (!watchedMovieIds.includes(movie.id)) {
        await prisma.movies.update({
          where: { id: movie.id },
          data: {
            views: {
              increment: 1,
            },
          },
        });

        await prisma.watchHistory.create({
          data: {
            userId,
            movieId: movie.id,
          },
        });
      }
    }

    const updatedMovies = await prisma.movies.findMany();

    res.json({ message: "Success", data: updatedMovies });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { id: movieId } = req.params;

    const findMovie = await prisma.movies.findFirst({
      where: { id: movieId },
    });

    if (!findMovie) {
      return res
        .status(404)
        .json({ message: "This kind of movie has not been found!" });
    }

    const watchHistory = await prisma.watchHistory.findFirst({
      where: {
        userId: id,
        moviesId: movieId,
      },
    });

    if (!watchHistory) {
      await prisma.movies.update({
        where: { id: movieId },
        data: {
          views: {
            increment: 1,
          },
        },
      });

      await prisma.watchHistory.create({
        data: {
          userId: id,
          moviesId: movieId,
        },
      });
    }

    const movie = await prisma.movies.findUnique({ where: { id: movieId } });

    res.json({ message: "Success", data: movie });
  } catch (error) {
    next(error);
  }
};

const getByGenre = async (req, res, next) => {
  try {
    const { genre } = req.params;
    const movies = await prisma.movies.findMany({ where: { genre: genre } });

    if (!movies) {
      return res
        .status(404)
        .json({ message: "This kind of genre has not been found!" });
    }

    res.json({ message: "Success", data: movies });
  } catch (error) {
    next(error);
  }
};

const getByLanguage = async (req, res, next) => {
  try {
    const { language } = req.params;
    const movies = await prisma.movies.findMany({
      where: { language: language },
    });

    if (!movies) {
      return res
        .status(404)
        .json({ message: "This kind of language has not been found!" });
    }

    res.json({ message: "Success", data: movies });
  } catch (error) {
    next(error);
  }
};

const getByCountry = async (req, res, next) => {
  try {
    const { country } = req.params;
    const movies = await prisma.movies.findMany({
      where: { country: country },
    });

    if (!movies) {
      return res
        .status(404)
        .json({ message: "This kind of country has not been found!" });
    }

    res.json({ message: "Success", data: movies });
  } catch (error) {
    next(error);
  }
};

const getByCompany = async (req, res, next) => {
  try {
    const { company } = req.params;
    const movies = await prisma.movies.findMany({
      where: { company: company },
    });

    if (!movies) {
      return res.status(404).json({
        message: "This kind of production Company has not been found!",
      });
    }

    res.json({ message: "Success", data: movies });
  } catch (error) {
    next(error);
  }
};

const post = async (req, res, next) => {
  try {
    const {
      title,
      description,
      genre,
      year,
      duration,
      link,
      company,
      popularity,
      ratings,
      country,
      language,
    } = req.body;

    const check = Joi.object({
      title: Joi.string().min(6).required(),
      description: Joi.string().min(6).required(),
      genre: Joi.string().min(5).required(),
      year: Joi.string().min(6).required(),
      duration: Joi.string().min(6).required(),
      link: Joi.string().min(6).required(),
      company: Joi.string().min(6).required(),
      popularity: Joi.string().min(3).required(),
      country: Joi.string().min(2).required(),
      language: Joi.string().min(2).required(),
      ratings: Joi.number().min(0).max(10).required(),
    });

    const { error } = check.validate({
      title,
      description,
      genre,
      year,
      duration,
      link,
      company,
      language,
      country,
      ratings,
      popularity,
    });
    if (error) return res.status(400).json({ message: error.message });

    const newMovie = await prisma.movies.create({
      data: {
        title,
        description,
        genre,
        year,
        duration,
        link,
        company,
        language,
        country,
        ratings,
        popularity,
      },
    });

    res.json({ message: "Success", data: newMovie });
  } catch (error) {
    next(error);
  }
};

const put = async (req, res, next) => {
  try {
    const { id } = req.params;

    const findMovie = await prisma.movies.findUnique({
      where: { id: id },
    });

    if (!findMovie) {
      return res
        .status(404)
        .json({ message: "This kind of movie has not been found!" });
    }
    const {
      title,
      description,
      genre,
      year,
      duration,
      link,
      company,
      language,
      country,
      ratings,
      popularity,
    } = req.body;

    const check = Joi.object({
      title: Joi.string().min(6),
      description: Joi.string().min(6),
      genre: Joi.string().min(5),
      year: Joi.string().min(6),
      duration: Joi.string().min(6),
      link: Joi.string().min(6),
      company: Joi.string().min(6),
      popularity: Joi.string().min(3),
      country: Joi.string().min(2),
      language: Joi.string().min(2),
      ratings: Joi.number().min(6),
    });

    const { error } = check.validate({
      title,
      description,
      genre,
      year,
      duration,
      link,
      company,
      language,
      country,
      ratings,
      popularity,
    });
    if (error) return res.status(400).json({ message: error.message });

    const updatedMovie = await prisma.movies.update({
      where: { id: id },
      data: {
        title,
        description,
        genre,
        year,
        duration,
        link,
        company,
        language,
        country,
        ratings,
        popularity,
      },
    });

    res.json({ message: "Success", data: updatedMovie });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const findMovie = await prisma.movies.findUnique({
      where: { id: id },
    });

    if (!findMovie) {
      return res
        .status(404)
        .json({ message: "This kind of movie has not been found!" });
    }

    const deleteMovie = await prisma.movies.delete({
      where: { id: id },
    });

    res.json({ message: "The deleted movie: ", data: deleteMovie });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  post,
  get,
  put,
  remove,
  getByGenre,
  getAll,
  getByCompany,
  getByCountry,
  getByLanguage,
  getByRating,
  getByViews,
};
