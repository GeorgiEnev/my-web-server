export default class Router {
  constructor() {
    this.routes = new Map();
    this.middlewares = [];
  }

  get(path, handler) {
    this.#addRoute("GET", path, handler);
  }

  post(path, handler) {
    this.#addRoute("POST", path, handler);
  }

  use(middlewares) {
    this.middlewares.push(middlewares);
  }

  handle(req, res) {
    let index = 0;

    const next = () => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index++];
        return middleware(req, res, next);
      }

      const methodRoutes = this.routes.get(req.method);
      const handler = methodRoutes?.get(req.path);

      if (!handler) {
        return res.status(404, "Not Found").send("404 Not Found");
      }

      handler(req, res);
    };

    next();
  }

  #addRoute(method, path, handler) {
    if (!this.routes.has(method)) {
      this.routes.set(method, new Map());
    }

    this.routes.get(method).set(path, handler);
  }
}
