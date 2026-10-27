const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['Attendance', 'Employee', 'Leave', 'Security', 'Department'],
      required: true,
      index: true,
    },
    details: {
      type: String,
      required: true,
    },
    performedBy: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AuditLog', AuditLogSchema);
