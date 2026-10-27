const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema(
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
    date: {
      type: String, // Stored as YYYY-MM-DD for indexing & timezone safety
      required: true,
      index: true,
    },
    checkInTime: {
      type: String, // HH:mm:ss
    },
    checkOutTime: {
      type: String, // HH:mm:ss
    },
    workHours: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'half-day'],
      default: 'present',
      index: true,
    },
    notes: {
      type: String,
      default: '',
    },
    correctedBy: {
      type: String,
      default: null,
    },
    correctedAt: {
      type: Date,
      default: null,
    },
    correctionReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to guarantee uniqueness of attendance per employee per date
AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
