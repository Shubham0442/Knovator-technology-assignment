const { Router } = require("express");
const { Job } = require("../models/jobModel");

const jobsController = Router();

jobsController.delete("/delete-all", async (req, res) => {
  try {
    await Job.deleteMany({});
    res.status(201).send({ msg: "deleated all jobs" });
  } catch (error) {
    res.status(500).send({ msg: "Something went wrong, please try again!" });
  }
});

module.exports = { jobsController };
