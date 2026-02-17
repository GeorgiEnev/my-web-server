export default function handleRequest(req, res) {
  if (req.method === "GET" && req.path === "/") {
    return res.send("Welcome to the Home Page");
  }

  if (req.method === "GET" && req.path === "/about") {
    return res.send("I Am Batman");
  }

  return res.status(404, "Not Found").send("404 Not Found");
}
