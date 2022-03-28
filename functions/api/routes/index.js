// @ts-check
const router = require("express").Router();
const pkg = require("../../../package.json");

const { EntryClientRoute } = require("../components/entry");
const { EstimateClientRoute } = require("../components/estimate");
const { ExpenseClientRoute } = require("../components/expense");
const { ItemClientRoute } = require("../components/item");
const { MonthClientRoute } = require("../components/month");
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

router.use("/entries", EntryClientRoute);
router.use("/estimates", EstimateClientRoute);
router.use("/expenses", ExpenseClientRoute);
router.use("/items", ItemClientRoute);
router.use("/months", MonthClientRoute);
router.use("/users", UserClientRoute);

router.get("*", async (req, res) => {
  res.status(404).json({
    error: true,
    message: "Page not found!.",
  });
});

module.exports = router;
