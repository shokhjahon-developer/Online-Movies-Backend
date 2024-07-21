const { checkToken } = require("../utils/jwt");

const isAdmin = async (req, res, next) => {
  if (!req.headers.token)
    return res.status(401).json({ message: "Permission denied!" });

  await checkToken(req.headers.token, (err, data) => {
    if (err) return res.status(401).json({ message: "Permission denied!" });

    if (!data.isAdmin) {
      return res.status(401).json({ message: "Permission denied!" });
    }

    res.admin = data;
    next();
  });
};

module.exports = isAdmin;
