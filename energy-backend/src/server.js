const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const env = require("./config/env");

const { initSocket } = require("./socket");

async function start() {
  try {
    await connectDB(env.mongoUri);

    const server = http.createServer(app);

    initSocket(server);

    server.listen(env.port, () => {
      console.log(`[Server] Running on port ${env.port}`);
    });
  } catch (err) {
    console.error("[Server] Failed to start:", err);
    process.exit(1);
  }
}

start();