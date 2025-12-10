
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User, Franchise, Student, Course } = require('./models');
const multer = require('multer');
const path = require('path');

// JWT Secret (Put in .env in production)
const JWT_SECRET = process.env.JWT_SECRET || 'sgcsc_secret_key_123';

// --- CONFIG: FILE UPLOAD ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'server/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// --- MIDDLEWARE: PROTECT ROUTES ---
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// --- AUTH ROUTES ---

// Login
router.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && (await user.matchPassword(password))) {
            const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
            
            // Enrich response based on role
            let extraData = {};
            if (user.role === 'FRANCHISE') {
                const franchise = await Franchise.findOne({ userId: user._id });
                if (franchise) extraData.franchiseId = franchise._id;
            } else if (user.role === 'STUDENT') {
                const student = await Student.findOne({ userId: user._id });
                if (student) extraData.studentId = student._id;
            }

            res.json({
                id: user._id,
                username: user.username,
                name: user.name,
                role: user.role,
                token,
                ...extraData
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Seed Admin (Run this once via Postman/Curl if DB is empty)
router.post('/auth/seed-admin', async (req, res) => {
    try {
        const exists = await User.findOne({ username: 'admin' });
        if (exists) return res.status(400).json({ message: 'Admin already exists' });

        const admin = await User.create({
            username: 'admin',
            password: 'admin123', // Will be hashed by model
            name: 'Super Admin',
            role: 'ADMIN'
        });
        res.status(201).json(admin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- DATA ROUTES ---

// Get All Franchises
router.get('/franchises', protect, async (req, res) => {
    try {
        const franchises = await Franchise.find();
        res.json(franchises);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create Franchise (Admin Only simplified)
router.post('/franchises', protect, async (req, res) => {
    try {
        // 1. Create User Login
        const { username, password, ...franchiseData } = req.body;
        
        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: 'Username already exists' });

        const newUser = await User.create({
            username,
            password,
            name: franchiseData.instituteOwnerName,
            role: 'FRANCHISE'
        });

        // 2. Create Franchise Profile
        const newFranchise = await Franchise.create({
            ...franchiseData,
            userId: newUser._id
        });

        res.status(201).json(newFranchise);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Students (Admin sees all, Franchise sees theirs)
router.get('/students', protect, async (req, res) => {
    try {
        let query = {};
        // If franchise user, filter by their franchise ID
        if (req.user.role === 'FRANCHISE') {
            const franchise = await Franchise.findOne({ userId: req.user._id });
            if (franchise) query.franchiseId = franchise._id;
        }
        const students = await Student.find(query).populate('courseId').populate('franchiseId', 'instituteName');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create Student
router.post('/students', protect, async (req, res) => {
    try {
        const { username, password, ...studentData } = req.body;
        
        // 1. Create Login
        // Note: For students, we might auto-generate password or skip login creation until later
        // simplified here:
        let userId = null;
        if (username && password) {
             const newUser = await User.create({
                username,
                password,
                name: studentData.name,
                role: 'STUDENT'
            });
            userId = newUser._id;
        }

        const newStudent = await Student.create({
            ...studentData,
            userId
        });
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Courses (Public)
router.get('/courses', async (req, res) => {
    const courses = await Course.find();
    res.json(courses);
});

// Upload Helper Route
router.post('/upload', upload.single('file'), (req, res) => {
    if(!req.file) return res.status(400).send('No file uploaded');
    res.json({ filePath: `/uploads/${req.file.filename}` });
});

module.exports = router;
