export default class Router {
  constructor() {
    this.routes = new Map(); 
    this.paramRoutes = new Map(); 
    this.middlewares = [];
  }

  get(path, handler) {
    this.#addRoute("GET", path, handler);
  }

  post(path, handler) {
    this.#addRoute("POST", path, handler);
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  handle(req, res) {
    let index = 0;

    const next = () => {
      try {
        if (index < this.middlewares.length) {
          const middleware = this.middlewares[index++];
          return middleware(req, res, next);
        }

        const methodRoutes = this.routes.get(req.method);
        const exactHandler = methodRoutes?.get(req.path);

        if (exactHandler) {
          if (!res.finished) {
            return exactHandler(req, res);
          }
          return;
        }

        const candidates = this.paramRoutes.get(req.method) || [];

        for (const route of candidates) {
          const match = this.#matchParamRoute(route.path, req.path);

          if (match) {
            req.params = match;

            if (!res.finished) {
              return route.handler(req, res);
            }
            return;
          }
        }

        return res.status(404, "Not Found").send("404 Not Found");
      } catch (err) {
        console.error("Unhandled error:", err);
        res.status(500, "Internal Server Error").json({
          error: "Internal Server Error",
        });
      }
    };

    next();
  }

  #addRoute(method, path, handler) {
    if (!this.routes.has(method)) {
      this.routes.set(method, new Map());
    }

    if (this.#isParamRoute(path)) {
      if (!this.paramRoutes.has(method)) {
        this.paramRoutes.set(method, []);
      }

      this.paramRoutes.get(method).push({ path, handler });
      return;
    }

    this.routes.get(method).set(path, handler);
  }

  #isParamRoute(path) {
    return path.includes(":");
  }

  #matchParamRoute(routePath, actualPath) {
    const routeParts = routePath.split("/").filter(Boolean);
    const pathParts = actualPath.split("/").filter(Boolean);

    if (routeParts.length !== pathParts.length) {
      return null;
    }

    const params = {};

    for (let i = 0; i < routeParts.length; i++) {
      const routeSegment = routeParts[i];
      const actualSegment = pathParts[i];

      if (routeSegment.startsWith(":")) {
        const key = routeSegment.slice(1);
        params[key] = actualSegment;
        continue;
      }

      if (routeSegment !== actualSegment) {
        return null;
      }
    }

    return params;
  }
}
