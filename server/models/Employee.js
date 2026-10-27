const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fullName: {
      type: String,
      required: [true, 'Please add employee full name'],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
      index: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
      index: true,
    },
    dateOfJoining: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['active', 'probation', 'inactive', 'on-leave'],
      default: 'active',
      index: true,
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    location: {
      type: String,
      default: 'Headquarters',
    },
    salary: {
      type: Number,
      select: false, // Protected field
    },
    emergencyContact: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for employee's attendance
EmployeeSchema.virtual('attendance', {
  ref: 'Attendance',
  localField: 'employeeId',
  foreignField: 'employeeId',
  justOne: false,
});

// Virtual for employee's leave requests
EmployeeSchema.virtual('leaves', {
  ref: 'LeaveRequest',
  localField: 'employeeId',
  foreignField: 'employeeId',
  justOne: false,
});

module.exports = mongoose.model('Employee', EmployeeSchema);
