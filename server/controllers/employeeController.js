const Employee = require('../models/Employee');
const Department = require('../models/Department');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

// @desc    Get all employees with pagination & search
// @route   GET /api/employees
// @access  Private (Role based filtering)
exports.getEmployees = async (req, res) => {
  try {
    const { department, status, search, page = 1, limit = 50 } = req.query;
    let query = {};

    // If Manager, restrict to their department or team members
    if (req.user.role === 'manager') {
      const mgrEmp = await Employee.findOne({ employeeId: req.user.employeeId });
      if (mgrEmp) {
        query.$or = [{ manager: mgrEmp._id }, { department: mgrEmp.department }];
      }
    }

    if (department) query.department = department;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Employee.countDocuments(query);
    const employees = await Employee.find(query)
      .populate('department', 'name code')
      .populate('manager', 'fullName employeeId')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: employees.length,
      total,
      data: employees,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('department', 'name code description')
      .populate('manager', 'fullName designation email');

    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    res.status(200).json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create new employee record
// @route   POST /api/employees
// @access  Private (HR only)
exports.createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);

    // Update department count
    await Department.findByIdAndUpdate(req.body.department, {
      $inc: { employeeCount: 1 },
    });

    // Log audit trail
    await AuditLog.create({
      action: 'Employee Created',
      category: 'Employee',
      details: `Created new employee ${employee.employeeId} (${employee.fullName})`,
      performedBy: req.user.email,
    });

    res.status(201).json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update employee record
// @route   PUT /api/employees/:id
// @access  Private (HR only / self for allowed contact info)
exports.updateEmployee = async (req, res) => {
  try {
    let employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    // Role check: employees can only update phone, location, emergencyContact
    if (req.user.role === 'employee' && employee.employeeId !== req.user.employeeId) {
      return res.status(403).json({ success: false, error: 'Not authorized to modify this profile' });
    }

    employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Toggle employee active status
// @route   PUT /api/employees/:id/status
// @access  Private (HR only)
exports.toggleEmployeeStatus = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    const newStatus = employee.status === 'inactive' ? 'active' : 'inactive';
    employee.status = newStatus;
    await employee.save();

    // Sync User record
    await User.findOneAndUpdate({ employeeId: employee.employeeId }, { isActive: newStatus === 'active' });

    // Log audit trail
    await AuditLog.create({
      action: 'Employee Status Change',
      category: 'Employee',
      details: `Changed ${employee.employeeId} (${employee.fullName}) status to ${newStatus.toUpperCase()}`,
      performedBy: req.user.email,
    });

    res.status(200).json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
