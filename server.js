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


    const respBody = "I Am Batman";

    const resp =
      "HTTP/1.1 200 OK\r\n" +
      "Content-Type = text/plain\r\n" +
      `Content-Length ${Buffer.byteLength(respBody)}\r\n` +
      "\r\n" +
      respBody;
    
    socket.write(resp);
    socket.end();
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err.message);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
