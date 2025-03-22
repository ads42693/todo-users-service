const { validationResult } = require('express-validator');
const User = require('../models/user');
const logger = require('../utils/logger');

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }

    const users = await User.find().select('-password');
    res.json(users);
    
    logger.info('Retrieved all users');
  } catch (err) {
    logger.error(`Get all users error: ${err.message}`);
    next(err);
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private
 */
exports.getUserById = async (req, res, next) => {
  try {
    // Check if requested user is the same as authenticated user or if user is admin
    const authUser = await User.findById(req.user.id);
    if (req.params.id !== req.user.id && authUser.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }

    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
    logger.info(`Retrieved user: ${req.params.id}`);
  } catch (err) {
    logger.error(`Get user error: ${err.message}`);
    next(err);
  }
};

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private
 */
exports.updateUser = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if requested user is the same as authenticated user or if user is admin
    const authUser = await User.findById(req.user.id);
    if (req.params.id !== req.user.id && authUser.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this resource' });
    }

    const { name, email } = req.body;
    
    // Build update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    
    // If email is being updated, check if it already exists
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser.id !== req.params.id) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
    logger.info(`Updated user: ${req.params.id}`);
  } catch (err) {
    logger.error(`Update user error: ${err.message}`);
    next(err);
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private
 */
exports.deleteUser = async (req, res, next) => {
  try {
    // Check if requested user is the same as authenticated user or if user is admin
    const authUser = await User.findById(req.user.id);
    if (req.params.id !== req.user.id && authUser.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this resource' });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'User deleted successfully' });
    logger.info(`Deleted user: ${req.params.id}`);
  } catch (err) {
    logger.error(`Delete user error: ${err.message}`);
    next(err);
  }
};