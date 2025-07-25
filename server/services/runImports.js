const { fetchJobs } = require("./fetchJobs");
const { jobQueue } = require("../config/queue");
const { ImportLog } = require("../models/importLogModal");

const feedUrls = [
  "https://jobicy.com/?feed=job_feed",
  "https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time",
  "https://jobicy.com/?feed=job_feed&job_categories=data-science",
  "https://jobicy.com/?feed=job_feed&job_categories=copywriting",
  "https://jobicy.com/?feed=job_feed&job_categories=business",
  "https://jobicy.com/?feed=job_feed&job_categories=management",
  "https://www.higheredjobs.com/rss/articleFeed.cfm"
];

const runImportJob = async () => {
  let allJobs = [];

  for (const url of feedUrls) {
    const jobs = await fetchJobs(url);
    if (Array.isArray(jobs)) {
      allJobs.push(...jobs);
    } else if (jobs) {
      allJobs.push(jobs);
    }
  }

  const importLog = await ImportLog.create({
    totalFetched: allJobs.length
  });

  console.log("allJobs", allJobs);

  for (const job of allJobs) {
    // console.log(
    //   "from runImportJob------------------------------------ single job",
    //   job
    // );
    const jobId = job?.id && job?.id[0] ? job?.id[0] : `unknown-${Date.now()}`;

    console.log("current job*****", job);

    const jobData = {
      jobId,
      title: job?.title[0],
      description: job?.description[0],
      company: job["job:company"] || "Unknown",
      createdAt: new Date(job?.pubDate)
    };

    jobQueue.add({ jobData, importLogId: importLog._id });
  }

  console.log(`Queued ${allJobs.length} jobs for import.`);
};

module.exports = { runImportJob };
