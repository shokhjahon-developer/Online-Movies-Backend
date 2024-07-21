const errorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: "INTERNAL SERVER ERROR!" });
};

module.exports = errorHandler;
