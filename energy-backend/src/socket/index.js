let ioInstance = null;

function initSocket(server) {
      const { Server } = require("socket.io");

      const io = new Server(server, {
            cors: { origin: true, credentials: true }
      });

      ioInstance = io;

      io.on("connection", (socket) => {
            socket.on("admin:join", () => {
                  console.log("[SOCKET] Admin joined room admins:", socket.id);
                  socket.join("admins");
            });
      });

      return io;
}

function getIO() {
      if (!ioInstance) throw new Error("Socket.io chưa được khởi tạo");
      return ioInstance;
}

module.exports = { initSocket, getIO };
