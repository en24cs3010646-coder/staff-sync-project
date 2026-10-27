const mongoose = require('mongoose');

const LeaveBalanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    casual: {
      total: { type: Number, default: 12 },
      used: { type: Number, default: 0 },
    },
    sick: {
      total: { type: Number, default: 10 },
      used: { type: Number, default: 0 },
    },
    earned: {
      total: { type: Number, default: 15 },
      used: { type: Number, default: 0 },
    },
    unpaid: {
      total: { type: Number, default: 10 },
      used: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('LeaveBalance', LeaveBalanceSchema);
