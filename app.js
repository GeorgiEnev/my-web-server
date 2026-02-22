import Router from "./router.js";

const router = new Router();

function validateJson(req, res, next) {
  if (req.invalidJson) {
    return res.status(400, "Bad Request").json({
      error: "Invalid JSON body",
    });
  }

  next();
}

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

export default router;
