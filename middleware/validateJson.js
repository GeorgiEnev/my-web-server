export default function validateJson(req, res, next) {
  if (req.invalidJson) {
    return res.status(400, "Bad Request").json({
      error: "Invalid JSON body",
    });
  }

  next();
}