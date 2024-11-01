const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { neon } = require('@neondatabase/serverless');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const sql = neon(process.env.DATABASE_URL);

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if username or email already exists
    const userExists = await sql`
      SELECT username, email FROM users 
      WHERE username = ${username} OR email = ${email}
    `;

    if (userExists.length > 0) {
      if (userExists[0].username === username) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
      if (userExists[0].email === email) {
        return res.status(400).json({ message: 'Email is already registered' });
      }
    }

    // Hash password and create user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await sql`
      INSERT INTO users (username, email, password_hash)
      VALUES (${username}, ${email}, ${hashedPassword})
      RETURNING id, username, email
    `;

    const token = jwt.sign(
      { id: newUser[0].id, username: newUser[0].username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser[0].id,
        username: newUser[0].username,
        email: newUser[0].email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email); // Debug log

    // Check if user exists
    const users = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (users.length === 0) {
      console.log('User not found:', email); // Debug log
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = users[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      console.log('Invalid password for:', email); // Debug log
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for:', email); // Debug log

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error); // Debug log
    res.status(500).json({ message: 'Server error' });
  }
};

// Request password reset
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const users = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    try {
      // Save OTP in database
      await sql`
        UPDATE users 
        SET reset_otp = ${otp}, reset_otp_expires = ${otpExpiry}
        WHERE email = ${email}
      `;

      // Configure email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Link Sea - Password Reset OTP',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #3b82f6; text-align: center;">Password Reset Request</h1>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
              <p style="font-size: 16px;">Your OTP for password reset is:</p>
              <h2 style="color: #1d4ed8; text-align: center; font-size: 32px; letter-spacing: 4px;">${otp}</h2>
              <p style="color: #4b5563; font-size: 14px;">This OTP will expire in 10 minutes.</p>
              <p style="color: #4b5563; font-size: 14px;">If you didn't request this password reset, please ignore this email.</p>
            </div>
          </div>
        `
      };

      // Send email
      await transporter.sendMail(mailOptions);

      res.json({ message: 'OTP sent to email' });
    } catch (error) {
      console.error('Email sending error:', error);
      // Revert OTP save if email fails
      await sql`
        UPDATE users 
        SET reset_otp = NULL, reset_otp_expires = NULL
        WHERE email = ${email}
      `;
      throw new Error('Failed to send OTP email');
    }
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Verify OTP and reset password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Check user and OTP
    const users = await sql`
      SELECT * FROM users 
      WHERE email = ${email} 
      AND reset_otp = ${otp}
      AND reset_otp_expires > NOW()
    `;

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear OTP
    await sql`
      UPDATE users 
      SET password_hash = ${hashedPassword}, 
          reset_otp = NULL, 
          reset_otp_expires = NULL
      WHERE email = ${email}
    `;

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add these new functions
const updateProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;
    console.log('Updating profile with bio:', bio); // Debug log
    
    // Update user profile
    const updatedUser = await sql`
      UPDATE users 
      SET 
        username = COALESCE(${username}, username),
        bio = COALESCE(${bio}, bio)
      WHERE id = ${req.user.id}
      RETURNING id, username, email, bio
    `;

    console.log('Updated user:', updatedUser[0]); // Debug log

    res.json({ 
      message: 'Profile updated successfully',
      user: updatedUser[0]
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Get user's current password hash
    const user = await sql`
      SELECT password_hash FROM users WHERE id = ${userId}
    `;

    if (!user.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user[0].password_hash);
    if (!isValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await sql`
      UPDATE users 
      SET password_hash = ${hashedPassword}
      WHERE id = ${userId}
    `;

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ message: 'Failed to update password' });
  }
};

// Export the new functions
module.exports = {
  register,
  login,
  requestPasswordReset,
  resetPassword,
  updateProfile,
  updatePassword
}; 