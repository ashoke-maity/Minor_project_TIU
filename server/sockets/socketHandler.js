function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    socket.on("message", (data) => {
      io.emit("message", data); // Broadcast to all clients
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = socketHandler;