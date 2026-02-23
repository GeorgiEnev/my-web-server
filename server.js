import net from "net";
import parseRequest from "./core/httpParser.js";
import Request from "./core/request.js";
import Response from "./core/response.js";
import router from "./app/app.js";

const port = 6969;

const server = net.createServer((socket) => {
  console.log("Client connected");

  let buffer = "";

  socket.on("data", (chunk) => {
    buffer += chunk.toString();

    while (true) {
      const parsed = parseRequest(buffer);

      if (!parsed) break;

      const { request, totalLength } = parsed;

      const req = new Request(
        request.method,
        request.path,
        request.headers,
        request.body,
      );

      const res = new Response(socket);

      router.handle(req, res);

      buffer = buffer.slice(totalLength);

      if (request.headers["connection"] === "close") {
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
