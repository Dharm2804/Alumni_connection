const express = require('express');
const User = require('../models/User');
const Alumni = require('../models/Alumni');
const Job = require('../models/Job');
const bcrypt = require('bcryptjs');
const Event = require('../models/eventModel');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { 
    name, 
    email, 
    password, 
    role, 
    engineeringType, 
    passoutYear, 
    companyName, 
    companyLocation, 
    linkedin,
    profileImage
  } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save to User collection (for all roles)
    user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    // If role is alumni, save additional data to Alumni collection
    if (role === 'alumni') {
      const alumni = new Alumni({
        name,
        profileImage,
        email,
        engineeringType,
        passoutYear,
        companyName,
        role, // This is the role in the company (from signup form)
        companyLocation,
        linkedin,
      });
      await alumni.save();
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.role !== role) {
      return res.status(400).json({ message: 'Invalid role selected' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', user: { email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

router.get('/get_events', async (req, res) => {
    try {
      const events = await Event.find();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch events', error });
    }
  });
  
  // Add a new event
  router.post('/post_events', async (req, res) => {
    try {
      const { title, date, location, description, type, image, createdBy='faculty' } = req.body;
      console.log(req.body);
      
      const newEvent = new Event({ title, date, location, description, type, image, createdBy });
      await newEvent.save();
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(500).json({ message: 'Failed to add event', error });
    }
  });

  router.put('/edit_event/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { title, date, location, description, type, image, createdBy } = req.body;
  
      const updatedEvent = await Event.findByIdAndUpdate(
        id,
        { title, date, location, description, type, image, createdBy },
        { new: true, runValidators: true }
      );
  
      if (!updatedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      res.status(200).json(updatedEvent);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update event', error });
    }
  });

  // Delete an event
router.delete('/delete_event/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedEvent = await Event.findByIdAndDelete(id);
    
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete event', error });
  }
});

// Get all jobs
router.get('/get_jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch jobs', error });
  }
});

// Add a new job
router.post('/add_jobs', async (req, res) => {
  try {
    const { title, company, location, description, requirements, type, postedBy, postedByRole, postedDate } = req.body;
    const newJob = new Job({
      title,
      company,
      location,
      description,
      requirements,
      type,
      postedBy,
      postedByRole,
      postedDate,
    });
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add job', error });
  }
});

// Update a job
router.put('/update_jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(updatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update job', error });
  }
});

// Delete a job
router.delete('/delete_jobs/:id',  async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJob = await Job.findByIdAndDelete(id);
    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete job', error });
  }
});

router.get('/get_alumni', async (req, res) => {
  try {
    const alumni = await Alumni.find().select('-__v'); // Exclude version key
    res.status(200).json(alumni);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch alumni', error: error.message });
  }
});

// Add this new route for better pagination support
router.get('/get_alumni_paginated', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const search = req.query.search || '';
    const year = req.query.year || 'all';

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { engineeringType: { $regex: search, $options: 'i' } }
      ];
    }
    if (year !== 'all') {
      query.passoutYear = parseInt(year);
    }

    const total = await Alumni.countDocuments(query);
    const alumni = await Alumni.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-__v');

    res.status(200).json({
      alumni,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch alumni', error: error.message });
  }
});

// Get alumni profile based on logged-in user (using email from request)
router.get('/profile', async (req, res) => {
  try {
    const { email } = req.headers; // Expect email to be sent in headers
    if (!email) {
      return res.status(401).json({ message: 'Email not provided' });
    }

    const user = await User.findOne({ email });
    if (!user || user.role !== 'alumni') {
      return res.status(403).json({ message: 'Unauthorized or not an alumni' });
    }

    const alumniProfile = await Alumni.findOne({ email });
    if (!alumniProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(alumniProfile);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update alumni profile
router.put('/update_profile', async (req, res) => {
  try {
    const { email } = req.headers; // Expect email to be sent in headers
    if (!email) {
      return res.status(401).json({ message: 'Email not provided' });
    }

    const user = await User.findOne({ email });
    if (!user || user.role !== 'alumni') {
      return res.status(403).json({ message: 'Unauthorized or not an alumni' });
    }

    const {
      name,
      profileImage,
      engineeringType,
      passoutYear,
      companyName,
      role,
      companyLocation,
      linkedin,
    } = req.body;

    const updatedProfile = await Alumni.findOneAndUpdate(
      { email },
      {
        name,
        profileImage,
        engineeringType,
        passoutYear,
        companyName,
        role,
        companyLocation,
        linkedin,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Update User collection too (if needed)
    await User.findOneAndUpdate({ email }, { name });

    res.status(200).json({ message: 'Profile updated successfully', profile: updatedProfile });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;