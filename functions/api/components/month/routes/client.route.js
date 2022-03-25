// @ts-check
const router = require("express").Router();

const verify = require("../../../utils/verifyToken");
const { Create, Get, List, Remove, Update } = require("../controllers");

router
  .route("/")
  .post(verify, Create)
  .get(verify, List);
  
  router
  .route("/:id")
  .get(verify, Get)
  .put(verify, Update)
  .delete(verify, Remove);

module.exports = router;
