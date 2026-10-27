const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const AuditLog = require('../models/AuditLog');

// @desc    Record daily check-in
// @route   POST /api/attendance/check-in
// @access  Private (Employee)
exports.checkIn = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const timeStr = new Date().toTimeString().slice(0, 8);
    const hours = new Date().getHours();
    const minutes = new Date().getMinutes();

    const employee = await Employee.findOne({ employeeId: req.user.employeeId });
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee profile not found' });
    }

    // Check if duplicate check-in
    const existing = await Attendance.findOne({ employeeId: req.user.employeeId, date: today });
    if (existing) {
      return res.status(400).json({ success: false, error: 'You have already checked in for today.' });
    }

    // Status: Late if after 09:30 AM
    let status = 'present';
    if (hours > 9 || (hours === 9 && minutes > 30)) {
      status = 'late';
    }

    const attendance = await Attendance.create({
      employeeId: req.user.employeeId,
      employee: employee._id,
      date: today,
      checkInTime: timeStr,
      status,
      notes: req.body.notes || 'Portal punch',
    });

    res.status(201).json({ success: true, data: attendance });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Record daily check-out
// @route   POST /api/attendance/check-out
// @access  Private (Employee)
exports.checkOut = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const timeStr = new Date().toTimeString().slice(0, 8);

    const record = await Attendance.findOne({ employeeId: req.user.employeeId, date: today });
    if (!record) {
      return res.status(400).json({ success: false, error: 'No check-in record found for today.' });
    }

    if (record.checkOutTime) {
      return res.status(400).json({ success: false, error: 'You have already checked out for today.' });
    }

    // Calculate work hours
    let workHours = 8.0;
    if (record.checkInTime) {
      const [inH, inM] = record.checkInTime.split(':').map(Number);
      const [outH, outM] = timeStr.split(':').map(Number);
      const diffMins = (outH * 60 + outM) - (inH * 60 + inM);
      workHours = Number((Math.max(0, diffMins) / 60).toFixed(2));
    }

    record.checkOutTime = timeStr;
    record.workHours = workHours;
    await record.save();

    res.status(200).json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get attendance records with filters
// @route   GET /api/attendance
// @access  Private
exports.getAttendance = async (req, res) => {
  try {
    const { date, department, status, employeeId } = req.query;
    let query = {};

    if (req.user.role === 'employee') {
      query.employeeId = req.user.employeeId;
    } else if (employeeId) {
      query.employeeId = employeeId;
    }

    if (date) query.date = date;
    if (status) query.status = status;

    const records = await Attendance.find(query)
      .populate('employee', 'fullName department designation')
      .sort({ date: -1, checkInTime: -1 });

    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    HR attendance record correction with audit trail
// @route   PUT /api/attendance/:id/correct
// @access  Private (HR only)
exports.correctAttendance = async (req, res) => {
  try {
    const { status, reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ success: false, error: 'A valid audit reason is required for attendance correction.' });
    }

    const record = await Attendance.findById(req.params.id).populate('employee', 'fullName');
    if (!record) {
      return res.status(404).json({ success: false, error: 'Attendance record not found.' });
    }

    const oldStatus = record.status;
    record.status = status;
    record.correctedBy = req.user.email;
    record.correctedAt = Date.now();
    record.correctionReason = reason;
    await record.save();

    // Create audit log
    await AuditLog.create({
      action: 'Attendance Corrected',
      category: 'Attendance',
      details: `Corrected ${record.employeeId} on ${record.date} from ${oldStatus.toUpperCase()} to ${status.toUpperCase()}. Reason: ${reason}`,
      performedBy: req.user.email,
    });

    res.status(200).json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
