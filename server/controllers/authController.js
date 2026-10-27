const User = require('../models/User');
const Employee = require('../models/Employee');
const AuditLog = require('../models/AuditLog');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public / HR only
exports.register = async (req, res) => {
  try {
    const { email, password, role, employeeId, fullName, departmentId, designation } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' });
    }

    const user = await User.create({
      email,
      password,
      role: role || 'employee',
      employeeId,
    });

    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Login user & return JWT token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, error: 'Your account has been deactivated by HR.' });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = user.getSignedJwtToken();

    // Get employee details
    const employee = await Employee.findOne({ employeeId: user.employeeId });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        fullName: employee?.fullName || 'User',
        designation: employee?.designation || '',
        departmentId: employee?.department || '',
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const employee = await Employee.findOne({ employeeId: user.employeeId });

    res.status(200).json({
      success: true,
      data: {
        user,
        employee,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' });
    }

    user.password = req.body.newPassword;
    await user.save();

    const token = user.getSignedJwtToken();
    res.status(200).json({ success: true, token, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
