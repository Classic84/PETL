require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const seedAdmin = async () => {
    try {
        const dbUri = process.env.MONGO_URI || process.env.MONGODB_URI;
        await mongoose.connect(dbUri);

        // Clear any existing admins to prevent duplicates
        await Admin.deleteMany({});

        // Create your new admin account
        const admin = await Admin.create({
            email: 'destisibor@gmail.com', // Change this to your preferred admin email
            password: '@#123Freedom4'       // Change this to your preferred password
        });

        console.log('Admin user created successfully!');
        console.log(`Email: ${admin.email}`);
        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

seedAdmin();