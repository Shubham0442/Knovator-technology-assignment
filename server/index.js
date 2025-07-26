const express = require("express");
const cors = require("cors");
const { connection } = require("./config/db");
require("dotenv").config();
const http = require("http");
const socketIO = require("socket.io");
const cron = require("node-cron");
const { runImportJob } = require("./services/runImports");
const { jobsController } = require("./controllers/jobsController");
const { ImportLog } = require("./models/importLogModal");
require("./workers/jobProcessor");

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

cron.schedule("0 * * * *", async () => {
  console.log("Running job import cron...");
  io.emit("import-started", { message: "Import started!" });
  await runImportJob();
});

global.io = io;

io.on("connection", (socket) => {
  console.log(`client connected: ${socket.id}`);

  socket.on("get_import_logs", async () => {
    const allImportLogs = await ImportLog.find({}).sort({ importDateTime: -1 });
    console.log("allImportLogs", allImportLogs);
    socket.emit("import_logs_response", allImportLogs);
  });

  socket.on("disconnect", () => {
    console.log("client disconnected", socket.id);
  });
});

app.get("/", (req, res) => res.send("Job Importer API is running"));
app.use("/", jobsController);

const PORT = process.env.PORT || 5050;

server.listen(PORT, async () => {
  try {
    await connection;
    console.log("server is running on the http://localhost:" + PORT);
  } catch (error) {
    console.log("error", error);
  }
});
