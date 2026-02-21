import Router from "./router.js";

const router = new Router();

router.get("/", (req, res) => {
  res.send("Welcome to the Home Page");
});

router.get("/about", (req, res) => {
  res.send("I Am Batman");
});

router.get("/search", (req, res) => {
  res.send(JSON.stringify(req.query));
});

router.post("/api/echo", (req, res) => {
  res.json({ received: req.json });
});

export default router;
