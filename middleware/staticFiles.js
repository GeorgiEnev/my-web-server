import fs from "fs";
import path from "path";

export default function staticFiles(rootDir) {
  const absoluteRoot = path.resolve(rootDir);

  return function staticMiddleware(req, res, next) {
    if (req.method !== "GET") {
      return next();
    }

    let requestPath = req.path;

    if (requestPath === "/") {
      requestPath = "/index.html";
    }

    const safePath = path.normalize(requestPath);
    const filePath = path.join(absoluteRoot, safePath);

    if (!filePath.startsWith(absoluteRoot)) {
      return res.status(403, "Forbidden").send("Forbidden");
    }

    if (!fs.existsSync(filePath)) {
      return next();
    }

    const fileContent = fs.readFileSync(filePath);
    const contentType = getContentType(filePath);

    res.setHeader("Content-Type", contentType);
    res.send(fileContent);
  };
}

function getContentType(filePath) {
  const ext = path.extname(filePath);

  switch (ext) {
    case ".html":
      return "text/html";
    case ".css":
      return "text/css";
    case ".js":
      return "application/javascript";
    case ".json":
      return "application/json";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    default:
      return "application/octet-stream";
  }
}