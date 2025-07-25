const mongoose = require("mongoose");

const importLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  totalFetched: Number,
  newJobs: { type: Number, default: 0 },
  updatedJobs: { type: Number, default: 0 },
  failedJobs: [
    {
      jobId: String,
      error: String
    }
  ]
});

const ImportLog = mongoose.model("import_log", importLogSchema);

module.exports = { ImportLog };
