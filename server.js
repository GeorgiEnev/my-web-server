const net = require("net");
const port = 6969;

const server = net.createServer((socket) => {
    console.log("Client connected");   
}
);

server.listen(port);