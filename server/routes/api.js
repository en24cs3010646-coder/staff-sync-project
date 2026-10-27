const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const authController = require('../controllers/authController');
const employeeController = require('../controllers/employeeController');
const attendanceController = require('../controllers/attendanceController');
const leaveController = require('../controllers/leaveController');

// 1. Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', protect, authController.getMe);
router.put('/auth/updatepassword', protect, authController.updatePassword);

// 2. Employee routes
router.route('/employees')
  .get(protect, employeeController.getEmployees)
  .post(protect, authorize('hr'), employeeController.createEmployee);

router.route('/employees/:id')
  .get(protect, employeeController.getEmployee)
  .put(protect, employeeController.updateEmployee);

router.put('/employees/:id/status', protect, authorize('hr'), employeeController.toggleEmployeeStatus);

// 3. Attendance routes
router.post('/attendance/check-in', protect, attendanceController.checkIn);
router.post('/attendance/check-out', protect, attendanceController.checkOut);
router.get('/attendance', protect, attendanceController.getAttendance);
router.put('/attendance/:id/correct', protect, authorize('hr'), attendanceController.correctAttendance);

// 4. Leave routes
router.post('/leaves', protect, leaveController.applyLeave);
router.put('/leaves/:id/decision', protect, authorize('hr', 'manager'), leaveController.decideLeave);
router.put('/leaves/:id/cancel', protect, leaveController.cancelLeave);
router.get('/leave-balances/:employeeId', protect, leaveController.getLeaveBalance);

module.exports = router;
