const net = require("net");
const port = 6969;

const server = net.createServer((socket) => {
  console.log("Client connected");

  let buffer = "";

  socket.on("data", (chunk) => {
    buffer += chunk.toString();

    const headerEndIndex = buffer.indexOf("\r\n\r\n");

    if (headerEndIndex === -1) {
      return;
    }

    const headersPart = buffer.slice(0, headerEndIndex);
    const bodyPart = buffer.slice(headerEndIndex + 4);

    const lines = headersPart.split("\r\n");
    const requestLine = lines[0];

    const parts = requestLine.split(" ");
    if (parts.length !== 3) {
      console.log("Malformed request line");
      socket.end();
      return;
    }

    const [method, path, version] = parts;

    const headers = [];

    for (let i = 1; i < lines.length; i++){
      const line = lines[i];

      const separatorIndex = line.indexOf(":");

      if (separatorIndex === -1) continue;

      const key = line.slice(0, separatorIndex).trim().toLowerCase();
      const value = line.slice(separatorIndex + 1).trim();

      headers[key] = value;
    }
    console.log("Headers:", headers);

    const contentLengthMatch = headersPart.match(/Content-Length: (\d+)/i);

    if (contentLengthMatch) {
      const contentLength = parseInt(contentLengthMatch[1], 10);

      if (bodyPart.length < contentLength) {
        return; 
      }
    }

    console.log("Method:", method);
    console.log("Path:", path);
    console.log("Version:", version);


    let responseBody;
    let statusLine;

    if (method === "GET" && path === "/") {
      responseBody = "Welcom to the Home Page";
      statusLine = "HTTP/1.1/ 200 OK\r\n";
    }
    else if (method === "GET" && path === "/about") {
      responseBody = "I Am Batman";
      statusLine = "HTTP/1.1/ 200 OK\r\n";
    }
    else {
      responseBody = "404 Not Found";
      statusLine = "HTTP/1.1 404 Not Found\r\n";
    }

    const response =
      statusLine +
      "Content-Type: text/plain\r\n" +
      `Content-Length: ${Buffer.byteLength(responseBody)}\r\n` +
      "\r\n" +
      responseBody;

    socket.write(response);
    socket.end();
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err.message);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
