const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({
  jobId: { type: String, unique: true },
  title: { type: String },
  company: { type: String },
  description: { type: String },
  createdAt: { type: Date }
});

const Job = mongoose.model("job", jobSchema);

module.exports = { Job };
