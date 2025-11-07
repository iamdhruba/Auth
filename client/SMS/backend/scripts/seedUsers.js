const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    await User.deleteMany({});
    
    const users = [
      {
        name: 'Admin User',
        email: 'admin@school.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        name: 'John Accountant',
        email: 'accountant@school.com',
        password: 'accountant123',
        role: 'accountant'
      },
      {
        name: 'Jane Teacher',
        email: 'teacher@school.com',
        password: 'teacher123',
        role: 'teacher'
      },
      {
        name: 'Student User',
        email: 'student@school.com',
        password: 'student123',
        role: 'student'
      },
      {
        name: 'Parent User',
        email: 'parent@school.com',
        password: 'parent123',
        role: 'parent'
      }
    ];
    
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${user.email} (${user.role})`);
    }
    
    console.log('Demo users created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();