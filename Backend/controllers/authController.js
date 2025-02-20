// Update user password
exports.updatePassword = async (req, res, next) => {
  const { userId } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404, ErrorCodes.NOT_FOUND));
    }

    // Verify user owns this account
    if (user._id.toString() !== req.user.userId) {
      return next(new AppError('Unauthorized', 401, ErrorCodes.UNAUTHORIZED));
    }

    // Verify old password
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return next(new AppError('Current password is incorrect', 401, ErrorCodes.INVALID_INPUT));
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password update error:', err);
    next(new AppError('Failed to update password', 500, ErrorCodes.DATABASE_ERROR));
  }
};