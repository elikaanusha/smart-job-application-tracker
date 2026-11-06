const router = require("express").Router();
const Job = require("../models/Job");

router.get("/", async (_req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch applications" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { company, role, location, jobType, appliedDate, status, notes } = req.body;
    if (!company?.trim() || !role?.trim()) {
      return res.status(400).json({ message: "Company and role are required" });
    }
    const job = await Job.create({ company, role, location, jobType, appliedDate, status, notes });
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: "Invalid application data" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const allowed = ["company", "role", "location", "jobType", "appliedDate", "status", "notes"];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    const job = await Job.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ message: "Application not found" });
    res.json(job);
  } catch (error) {
    res.status(400).json({ message: "Could not update application" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Application not found" });
    res.json({ message: "Application deleted" });
  } catch (error) {
    res.status(400).json({ message: "Invalid application ID" });
  }
});

module.exports = router;