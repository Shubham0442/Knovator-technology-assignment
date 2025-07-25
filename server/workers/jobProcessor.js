const { jobQueue } = require("../config/queue");
const { Job } = require("../models/jobModel");
const { ImportLog } = require("../models/importLogModal");

console.log("job processor.js running --------------------------");
jobQueue.process(async (job, done) => {
  const { jobData, importLogId } = job.data;

  console.log("currentJob", jobData, importLogId);

  try {
    const existing = await Job.findOne({ jobId: jobData.jobId });

    if (existing) {
      await Job.updateOne({ jobId: jobData.jobId }, jobData);
      await ImportLog.findByIdAndUpdate(importLogId, {
        $inc: { updatedJobs: 1 }
      });
      global.io?.emit("job-updated", { jobId: jobData.jobId });
      return done(null, "updated");
    } else {
      await Job.create(jobData);
      await ImportLog.findByIdAndUpdate(importLogId, {
        $inc: { newJobs: 1 }
      });
      global.io?.emit("job-new", { jobId: jobData.jobId });
      return done(null, "new");
    }
  } catch (err) {
    console.log("error from the jobProcessor", err)
    await ImportLog.findByIdAndUpdate(importLogId, {
      $push: {
        failedJobs: {
          jobId:
            typeof jobData.jobId === "object" ? jobData.jobId._ : jobData.jobId,
          error: err.message
        }
      }
    });
    global.io?.emit("job-failed", {
      jobId:
        typeof jobData.jobId === "object" ? jobData.jobId._ : jobData.jobId,
      error: err.message
    });
    return done(new Error(err.message));
  }
});
