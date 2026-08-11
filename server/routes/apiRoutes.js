const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const auth = require('../middleware/auth');
router.post('/register', apiController.userRegister);
router.post('/login', apiController.userLogin);
router.post('/contact', apiController.submitContact);
router.post('/bookings', apiController.submitBooking);
router.get('/testimonials', apiController.getTestimonials);

router.post('/admin/login', apiController.adminLogin);
router.get('/admin/leads', auth, apiController.getLeads);
router.delete('/admin/leads/:id', auth, apiController.deleteLead);
router.post('/admin/reply', auth, apiController.replyLead);

router.get('/notifications', auth, apiController.getNotifications);

router.post('/forgot-password/send-otp', apiController.sendOtp);
router.post('/forgot-password/verify-otp', apiController.verifyOtp);
router.post('/forgot-password/reset', apiController.resetPassword);
router.post('/seed', apiController.seedDatabase);

module.exports = router;
