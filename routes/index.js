const router = require("express").Router();
const userRouter = require("./users");
const signUpRouter = require("./signup");
const signinRouter = require("./signin");
const gamesRouter = require("./games");
const routeNotFound = require("./routeNotFound");
const { auth } = require("../middlewares/auth");

router.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

router.use("/users", auth, userRouter);
router.use("/games", gamesRouter);
router.use("/signin", signinRouter);
router.use("/signup", signUpRouter);
router.use("/", routeNotFound);

module.exports = router;
