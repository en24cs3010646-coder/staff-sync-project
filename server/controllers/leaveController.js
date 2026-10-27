const LeaveRequest = require('../models/LeaveRequest');
const LeaveBalance = require('../models/LeaveBalance');
const Employee = require('../models/Employee');
const AuditLog = require('../models/AuditLog');

// @desc    Apply for leave
// @route   POST /api/leaves
// @access  Private
exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, days, reason } = req.body;
    const employeeId = req.user.employeeId;

    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    // 1. Check for overlapping leave requests
    const overlap = await LeaveRequest.findOne({
      employeeId,
      status: { $in: ['pending', 'approved'] },
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
      ],
    });

    if (overlap) {
      return res.status(400).json({
        success: false,
        error: `You already have an existing ${overlap.status} leave overlapping with these dates (${overlap.startDate} to ${overlap.endDate}).`,
      });
    }

    // 2. Validate leave balance
    let balance = await LeaveBalance.findOne({ employeeId });
    if (!balance) {
      balance = await LeaveBalance.create({ employeeId });
    }

    if (leaveType !== 'unpaid') {
      const available = balance[leaveType].total - balance[leaveType].used;
      if (days > available) {
        return res.status(400).json({
          success: false,
          error: `Insufficient ${leaveType} leave balance. Available: ${available} days, Requested: ${days} days.`,
        });
      }
    }

    // 3. Create request
    const leave = await LeaveRequest.create({
      employeeId,
      employee: employee._id,
      leaveType,
      startDate,
      endDate,
      days,
      reason,
      status: 'pending',
    });

    // 4. Log audit
    await AuditLog.create({
      action: 'Leave Applied',
      category: 'Leave',
      details: `${employee.fullName} applied for ${days} days of ${leaveType} leave (${startDate} to ${endDate})`,
      performedBy: req.user.email,
    });

    res.status(201).json({ success: true, data: leave });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Review & decide on leave request (Approve / Reject)
// @route   PUT /api/leaves/:id/decision
// @access  Private (Manager & HR)
exports.decideLeave = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: "Status must be 'approved' or 'rejected'." });
    }

    const leave = await LeaveRequest.findById(req.params.id).populate('employee', 'fullName');
    if (!leave) {
      return res.status(404).json({ success: false, error: 'Leave request not found.' });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ success: false, error: `Leave request has already been ${leave.status}.` });
    }

    leave.status = status;
    leave.actionBy = req.user._id;
    leave.actionByName = req.user.email;
    leave.actionAt = Date.now();
    if (status === 'rejected') {
      leave.rejectionReason = rejectionReason || 'Operational constraints';
    }
    await leave.save();

    // If approved, deduct leave balance
    if (status === 'approved' && leave.leaveType !== 'unpaid') {
      await LeaveBalance.findOneAndUpdate(
        { employeeId: leave.employeeId },
        { $inc: { [`${leave.leaveType}.used`]: leave.days } }
      );
    }

    // Log audit trail
    await AuditLog.create({
      action: `Leave ${status.toUpperCase()}`,
      category: 'Leave',
      details: `${req.user.email} (${req.user.role}) ${status} ${leave.days} days of ${leave.leaveType} leave for ${leave.employeeId}`,
      performedBy: req.user.email,
    });

    res.status(200).json({ success: true, data: leave });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Cancel pending leave
// @route   PUT /api/leaves/:id/cancel
// @access  Private (Employee owner)
exports.cancelLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ success: false, error: 'Leave request not found' });
    }

    if (leave.employeeId !== req.user.employeeId && req.user.role !== 'hr') {
      return res.status(403).json({ success: false, error: 'Not authorized to cancel this request' });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ success: false, error: 'Only pending requests can be cancelled.' });
    }

    leave.status = 'cancelled';
    await leave.save();

    res.status(200).json({ success: true, message: 'Leave request cancelled successfully', data: leave });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get leave balances
// @route   GET /api/leave-balances/:employeeId
// @access  Private
exports.getLeaveBalance = async (req, res) => {
  try {
    const employeeId = req.params.employeeId || req.user.employeeId;
    let balance = await LeaveBalance.findOne({ employeeId });
    if (!balance) {
      balance = await LeaveBalance.create({ employeeId });
    }
    res.status(200).json({ success: true, data: balance });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
