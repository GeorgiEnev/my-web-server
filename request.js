export default class Request {
  constructor(method, rawPath, headers, body) {
    this.method = method;
    this.rawPath = rawPath;
    this.headers = headers;
    this.contentType = headers["content-type"] || "";
    this.body = body;
    this.json = null;

    const { path, query } = this.#parseUrl(rawPath);

    this.path = path;
    this.query = query;

    if (this.body && this.contentType.includes("application/json")) {
      try {
        this.json = JSON.parse(this.body);
      } catch {
        this.json = null;
      }
    }
  }

  #parseUrl(rawPath) {
    const [pathPart, queryString] = rawPath.split("?");

    const query = {};

    if (queryString) {
      const pairs = queryString.split("&");

      for (const pair of pairs) {
        const [key, value] = pair.split("=");

        if (!key) continue;

        query[decodeURIComponent(key)] = decodeURIComponent(value || "");
      }
    }

    return {
      path: pathPart,
      query,
    };
  }
}
