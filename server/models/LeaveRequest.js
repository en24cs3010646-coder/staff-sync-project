const mongoose = require('mongoose');

const LeaveRequestSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      index: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    leaveType: {
      type: String,
      enum: ['casual', 'sick', 'earned', 'unpaid'],
      required: true,
      index: true,
    },
    startDate: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    endDate: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    days: {
      type: Number,
      required: true,
      min: [0.5, 'Minimum leave duration is half a day'],
    },
    reason: {
      type: String,
      required: [true, 'Please provide reason for leave'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'pending',
      index: true,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    actionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    actionByName: {
      type: String,
      default: null,
    },
    actionAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index to query pending leaves quickly
LeaveRequestSchema.index({ status: 1, appliedAt: -1 });

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);
