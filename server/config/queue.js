const Queue = require("bull");

const jobQueue = new Queue("jobQueue", {
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000
    }
  }
});

module.exports = { jobQueue };
