const net = require("net");

net.createServer((socket) => {
  console.log("✅ Proxy connected to fake server");

  socket.on("data", (data) => {
    socket.write(data); // echo
  });

}).listen(1600, () => {
  console.log("🚀 Fake server running on 1600");
});