const { fetchJobs } = require("./fetchJobs");
const { jobQueue } = require("../config/queue");
const { ImportLog } = require("../models/importLogModal");

const feedUrls = [
  "https://jobicy.com/?feed=job_feed",
  "https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time"
];

const runImportJob = async () => {
  let allJobs = [];

  for (const url of feedUrls) {
    const jobs = await fetchJobs(url);
    if (Array.isArray(jobs)) {
      allJobs?.push(...jobs);
    } else if (jobs) {
      allJobs?.push(jobs);
    }
  }

  const importLog = await ImportLog.create({
    totalFetched: allJobs?.length
  });

  for (const job of allJobs) {
    const jobData = {
      jobId: job?.guid || job?.link,
      title: job?.title,
      description: job?.description,
      company: job["job:company"] || "Unknown",
      url: job?.link,
      createdAt: new Date(job?.pubDate)
    };

    jobQueue.add({ jobData, importLogId: importLog?._id });
  }

  console.log(`Queued ${allJobs?.length} jobs for import.`);
};

module.exports = { runImportJob };
