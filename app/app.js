import Router from "../routing/router.js";
import validateJson from "../middleware/validateJson.js";
import staticFiles from "../middleware/staticFiles.js";

const router = new Router();

router.use(staticFiles("public"));
router.use(validateJson);

router.get("/about", (req, res) => {
  res.send("I Am Batman");
});

router.post("/api/echo", (req, res) => {
  res.json({ received: req.json });
});

router.get("/users/:id", (req, res) => {
  res.json({ userId: req.params.id });
});

export default router;
