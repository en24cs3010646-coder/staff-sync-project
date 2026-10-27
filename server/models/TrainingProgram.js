const mongoose = require('mongoose');

const TrainingProgramSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide training program title'],
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    trainer: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Technical', 'Leadership', 'Compliance', 'Design', 'Productivity'],
      default: 'Technical',
      index: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    duration: {
      type: String,
      default: '2 Hours',
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, 'Capacity must be at least 1 seat'],
    },
    registeredEmployeeIds: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed'],
      default: 'upcoming',
      index: true,
    },
    createdBy: {
      type: String,
      default: 'HR Administration',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TrainingProgram', TrainingProgramSchema);
