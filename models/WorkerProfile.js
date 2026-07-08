const mongoose = require("mongoose");

const workerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    services: {
      type: [String],
      enum: [
        "Plumber",
        "Electrician",
        "Carpenter",
        "Painter",
        "AC Repair",
        "RO Repair",
        "Refrigerator Repair",
        "Washing Machine Repair",
      ],
      required: true,
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    availability: {
      type: String,
      enum: ["available", "busy", "offline"],
      default: "offline",
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    completedJobs: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const WorkerProfile = mongoose.model("WorkerProfile", workerProfileSchema);

module.exports = WorkerProfile;
