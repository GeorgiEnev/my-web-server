export default class Router {
  constructor() {
    this.routes = new Map();
  }

  get(path, handler) {
    this.#addRoute("GET", path, handler);
  }

  post(path, handler) {
    this.#addRoute("POST", path, handler);
  }

  handle(req, res) {
    const methodRoutes = this.routes.get(req.method);
    const handler = methodRoutes?.get(req.path);

    if (!handler) {
      res.status(404, "Not Found").send("404 Not Found");
      return;
    }

    handler(req, res);
  }

  #addRoute(method, path, handler) {
    if (!this.routes.has(method)) {
      this.routes.set(method, new Map());
    }

    this.routes.get(method).set(path, handler);
  }
}
