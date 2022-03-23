// @ts-check
const router = require("express").Router();
const pkg = require("../../../package.json");

const { UserClientRoute } = require("../components/user");

router.get("/", async (req, res) => {
  res.status(200).json({
    message: "Welcome to OsBank APIRestful!.",
    name: pkg.name,
    desciption: pkg.description,
    author: pkg.author,
    version: pkg.version,
  });
});

router.use("/users", UserClientRoute);

router.get("*", async (req, res) => {
  res.status(404).json({
    error: true,
    message: "Page not found!.",
  });
});

module.exports = router;
