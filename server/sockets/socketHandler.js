function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    
    // Handle save/unsave events
    socket.on('postSaved', (postId) => {
      io.emit('postSaved', postId);
    });
    
    socket.on('postUnsaved', (postId) => {
      io.emit('postUnsaved', postId);
    });
    
    socket.on("message", (data) => {
      io.emit("message", data); // Broadcast to all clients
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = socketHandler;