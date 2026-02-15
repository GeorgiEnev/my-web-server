const net = require("net");
const port = 6969;

function sendResponse(socket, statusCode, statusMessage, body) {
  const statusLine = `HTTP/1.1 ${statusCode} ${statusMessage}\r\n`;

  const headers =
    "Content-Type: text/plain\r\n" +
    `Content-Length: ${Buffer.byteLength(body)}\r\n`;

  const response = statusLine + headers + "\r\n" + body;

  socket.write(response);
}

function handleRequest(method, path, headers, body, socket) {
  if (method === "GET" && path === "/") {
    return sendResponse(socket, 200, "OK", "Welcome to the Home Page");
  }

  if (method === "GET" && path === "/about") {
    return sendResponse(socket, 200, "OK", "I Am Batman");
  }

  return sendResponse(socket, 404, "Not Found", "404 Not Found");
}

const server = net.createServer((socket) => {
  console.log("Client connected");

  let buffer = "";

  socket.on("data", (chunk) => {
    buffer += chunk.toString();

    while (true) {
      const headerEndIndex = buffer.indexOf("\r\n\r\n");

      if (headerEndIndex === -1) {
        break;
      }

      const headersPart = buffer.slice(0, headerEndIndex);
      const bodyStartIndex = headerEndIndex + 4;

      const lines = headersPart.split("\r\n");
      const requestLine = lines[0];
      const parts = requestLine.split(" ");

      if (parts.length !== 3) {
        console.log("Malformed request line");
        socket.end();
        return;
      }

      const [method, path, version] = parts;

      const headers = {};

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const separatorIndex = line.indexOf(":");
        if (separatorIndex === -1) continue;

        const key = line.slice(0, separatorIndex).trim().toLowerCase();
        const value = line.slice(separatorIndex + 1).trim();

        headers[key] = value;
      }

      let contentLength = 0;

      if (headers["content-length"]) {
        contentLength = parseInt(headers["content-length"], 10);
      }

      const totalRequestLength = bodyStartIndex + contentLength;

      if (buffer.length < totalRequestLength) {
        break; 
      }

      const body = buffer.slice(bodyStartIndex, totalRequestLength);

      console.log("Method:", method);
      console.log("Path:", path);
      console.log("Headers:", headers);

      handleRequest(method, path, headers, body, socket);

      buffer = buffer.slice(totalRequestLength);

      if (headers["connection"] === "close") {
        socket.end();
        return;
      }
    }
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err.message);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
