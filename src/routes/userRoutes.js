const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all users - Admin only
router.get('/', auth, userController.getAllUsers);

// Get user by ID
router.get('/:id', auth, userController.getUserById);

// Update user
router.put(
  '/:id',
  [
    auth,
    check('name', 'Name is required').optional(),
    check('email', 'Please include a valid email').optional().isEmail()
  ],
  userController.updateUser
);

// Delete user
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;