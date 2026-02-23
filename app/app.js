import Router from "../routing/router.js";
import validateJson from "../middleware/validateJson.js";

const router = new Router();

router.use(validateJson);

router.get("/", (req, res) => {
  res.send("Welcome to the Home Page");
});

router.get("/about", (req, res) => {
  res.send("I Am Batman");
});

router.post("/api/echo", (req, res) => {
  res.json({ received: req.json });
});

router.get("/crash", () => {
  throw new Error("Test crash");
});

function earlyResponse(req, res, next) {
  if (req.path === "/early") {
    return res.send("Early response");
  }
  next();
}

router.use(earlyResponse);

router.get("/early", (req, res) => {
  res.send("This should not appear");
});

router.get("/users/:id", (req, res) => {
  res.json({ userId: req.params.id });
});

export default router;
