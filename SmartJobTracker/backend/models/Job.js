const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  company: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  location: { type: String, default: "", trim: true },
  jobType: { type: String, default: "Full-time" },
  appliedDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Applied", "Interview", "Selected", "Rejected"],
    default: "Applied"
  },
  notes: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);