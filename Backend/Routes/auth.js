import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../Models/user.js';


const router = express.Router();

const verifyToken = (req, res, next) => {
const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token found — block the request immediately.
    return res.status(401).json({ message: 'No token provided' });
    // 401 = Unauthorized
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;

    next();
    // Token is valid! Pass control to the actual route handler. Like we did in class

  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
    // Token was tampered with, expired, or destroyed = block the request.
  }
};



const signToken = (userId, email) => {
  return jwt.sign(
    { userId, email },



    process.env.JWT_SECRET,


    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    // Token expires after 7 days.
  );
};


router.post('/register', async (req, res) => {
  try {
    const { username, email, glyphSequence, glyphStarIds } = req.body;
    // Pull data out of the request body React sent.
    // glyphSequence = "3-7-1-11-5" (star IDs in draw order)
    // glyphStarIds  = [1,3,5,7,11] (same IDs sorted, no order)




    //Validate inputs
    if (!username || !email || !glyphSequence || !glyphStarIds) {
      return res.status(400).json({ message: 'All fields are required' });
      // 400 = Bad Request — stop here if anything is missing.
    }

    if (glyphStarIds.length < 4) {
      return res.status(400).json({ message: 'Glyph must connect at least 4 stars' });
    }

    //Check for duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    // Search MongoDB for a user with this email.
   

    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists' });
      // 409 = Conflict
    }

    //Create the user
    const newUser = await User.create({
      username,
      email,
      glyphHash: glyphSequence,
      glyphStarIds,
    });

    //Issue JWT
    const token = signToken(newUser._id, newUser.email);
    // User is automatically logged in after registering.


    res.status(201).json({
      // 201 = Created
      message: 'Account created successfully! ✦',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        glyphStarIds: newUser.glyphStarIds,
        loginCount: newUser.loginCount,
        createdAt: newUser.createdAt,
        // NEVER send glyphHash back — never expose the hash!
      },
    });

  } catch (err) {
    console.error('Register error:', err);
    if (err.code === 11000) {
      // MongoDB duplicate key error code.
      return res.status(409).json({ message: 'Email already in use' });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, glyphSequence } = req.body;

    if (!email || !glyphSequence) {
      return res.status(400).json({ message: 'Email and glyph are required' });
    }

    //Find the user
    const user = await User.findOne({ email: email.toLowerCase() });
    // Look up user by email in MongoDB.

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });

    }

    //  Verify the glyph 
    const isMatch = await user.compareGlyph(glyphSequence);
    // bcrypt.compare() checks if the sequence matches the stored hash. Returns true or false.

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    //Update login stats
    user.loginCount += 1;
    user.lastLogin = new Date();
    await user.save();


    // Issue JWT 
    const token = signToken(user._id, user.email);

    //Send response 
    res.status(200).json({
      message: 'Login successful! ✦',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        glyphStarIds: user.glyphStarIds,
        loginCount: user.loginCount,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});


// Returns the currently logged in user's data.
// verifyToken runs first and JWT required to access this! Again like in class

router.get('/me', verifyToken, async (req, res) => {
  // verifyToken checked the JWT already. If we're here, the token was valid and req.userId is set.
  try {
    const user = await User.findById(req.userId).select('-glyphHash');
    // Find user by the ID we got from the JWT. .select('-glyphHash') = return everything EXCEPT the hash. The minus sign means "exclude this field".

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        glyphStarIds: user.glyphStarIds,
        loginCount: user.loginCount,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    });

  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

