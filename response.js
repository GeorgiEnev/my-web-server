export default class Response {
  constructor(socket) {
    this.socket = socket;
    this.statusCode = 200;
    this.statusMessage = "OK";
    this.headers = {
      "Content-Type": "text/plain",
    };
  }

  status(code, message = "OK") {
    this.statusCode = code;
    this.statusMessage = message;
    return this;
  }

  setHeader(key, value) {
    this.headers[key] = value;
  }

  json(data) {
    const jsonString = JSON.stringify(data);

    this.setHeader("Content-Type", "application/json");

    this.send(jsonString);
  }

  send(body) {
    const statusLine = `HTTP/1.1 ${this.statusCode} ${this.statusMessage}\r\n`;

    const headersString = Object.entries(this.headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\r\n");

    const response =
      statusLine +
      headersString +
      "\r\n" +
      `Content-Length: ${Buffer.byteLength(body)}\r\n` +
      "\r\n" +
      body;

    this.socket.write(response);
  }
}
