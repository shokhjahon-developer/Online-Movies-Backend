const { Router } = require("express");
const {
  get,
  post,
  put,
  remove,
  getByGenre,
  getAll,
  getByCountry,
  getByRating,
  getByCompany,
  getByViews,
  getByLanguage,
} = require("../controllers/movies.controller");
const isAuthed = require("../middlewares/is-auth");
const isAdmin = require("../middlewares/is-admin");

const router = Router();

router.get("/:id", isAuthed, get);
router.get("/genre/:genre", isAuthed, getByGenre);
router.get("/", isAuthed, getAll);
router.get("/country/:country", isAuthed, getByCountry);
router.get("/ratings", isAuthed, getByRating);
router.get("/company/:company", isAuthed, getByCompany);
router.get("/views", isAuthed, getByViews);
router.get("/language/:language", isAuthed, getByLanguage);

router.post("/", isAdmin, post);
router.put("/:id", isAdmin, put);
router.delete("/:id", isAdmin, remove);

module.exports = router;
