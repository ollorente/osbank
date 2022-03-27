// @ts-check
const router = require("express").Router();

const verify = require("../../../utils/verifyToken");
const { Auth, Create, Get, List, Remove, Update } = require("../controllers");

router
  .route("/")
  .post(Create)
  .get(verify, Get)
  .put(verify, Update)
  .delete(verify, Remove);

router
  .route("/auth")
  .post(Auth);

router
  .route("/all")
  .get(verify, List);

router
  .route("/entries")
  .get(verify, List);

router
  .route("/estimates")
  .get(verify, List);

router
  .route("/expenses")
  .get(verify, List);

router
  .route("/items")
  .get(verify, List);

module.exports = router;
