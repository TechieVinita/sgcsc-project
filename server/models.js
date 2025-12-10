
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// --- USER MODEL (For Auth) ---
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['ADMIN', 'FRANCHISE', 'STUDENT'], required: true },
    franchiseId: { type: String }, // Links to Franchise
    studentId: { type: String }    // Links to Student
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// --- FRANCHISE MODEL ---
const franchiseSchema = new mongoose.Schema({
    instituteId: { type: String, required: true, unique: true },
    instituteName: { type: String, required: true },
    instituteOwnerName: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    address: { type: String },
    state: { type: String },
    district: { type: String },
    city: { type: String },
    
    // Infrastructure & Details
    totalComputers: { type: Number, default: 0 },
    numClassRooms: { type: Number, default: 0 },
    centerSpace: { type: String },
    
    // Files (stored as paths)
    institutePhoto: { type: String },
    ownerPhoto: { type: String },
    
    status: { type: String, enum: ['active', 'pending', 'suspended'], default: 'pending' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Link to login user
}, { timestamps: true });

// --- STUDENT MODEL ---
const studentSchema = new mongoose.Schema({
    enrollmentNo: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    fatherName: { type: String },
    motherName: { type: String },
    dob: { type: String },
    gender: { type: String },
    email: { type: String },
    mobile: { type: String },
    address: { type: String },
    state: { type: String },
    district: { type: String },
    
    // Academic
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    franchiseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Franchise' }, // The center they study at
    sessionStart: { type: String },
    sessionEnd: { type: String },
    
    photo: { type: String },
    status: { type: String, default: 'active' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Link to login user
}, { timestamps: true });

// --- COURSE MODEL ---
const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    duration: { type: String },
    type: { type: String },
    fees: { type: Number },
    description: { type: String }
});

const User = mongoose.model('User', userSchema);
const Franchise = mongoose.model('Franchise', franchiseSchema);
const Student = mongoose.model('Student', studentSchema);
const Course = mongoose.model('Course', courseSchema);

module.exports = { User, Franchise, Student, Course };
