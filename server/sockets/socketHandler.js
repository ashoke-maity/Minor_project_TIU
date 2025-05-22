function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("message", (data) => {
      console.log("Received:", data);
      io.emit("message", data); // Broadcast to all clients
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

module.exports = socketHandler