const net = require("net");
const { buffer } = require("stream/consumers");
const port = 6969;

const server = net.createServer((socket) => {
    console.log("Client connected");   

    let buffer = "";

    socket.on("data", (chunk) => {
        buffer += chunk.toString();

        if (buffer.includes("\r\n\r\n")) {
            console.log("Full request received");
            console.log(buffer);

            socket.end();
        }
    });
});

server.listen(port);