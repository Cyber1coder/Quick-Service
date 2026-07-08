const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    service: {
      type: String,
      required: true,
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
    },

    problemDescription: {
      type: String,
      required: true,
      trim: true,
    },

    problemImages: {
      type: [String],
      default: [],
    },

    serviceLocation: {
      address: {
        type: String,
        required: true,
      },

      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },
    },

    visitFee: {
      type: Number,
      default: 99,
    },

    finalAmount: {
      type: Number,
      default: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["visit_pending", "visit_paid", "final_pending", "completed"],
      default: "visit_pending",
    },

    bookingStatus: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "inspection",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    razorpayOrderId: {
      type: String,
      default: "",
    },

    razorpayPaymentId: {
      type: String,
      default: "",
    },

    razorpaySignature: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
