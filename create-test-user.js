const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

async function createTestUser() {
  try {
    await mongoose.connect('mongodb://localhost:27017/cyberedu');

    const hashedPassword = await bcrypt.hash('Test1234', 10);

    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      password: String,
      firstName: String,
      lastName: String,
      role: String,
      status: String,
      isActive: Boolean,
      isVerified: Boolean,
      createdAt: Date,
      updatedAt: Date,
    }));

    const testUser = new User({
      email: 'test@example.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      role: 'student',
      status: 'active',
      isActive: true,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await testUser.save();
    console.log('✅ Test user created!');
    console.log('Email: test@example.com');
    console.log('Password: Test1234');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createTestUser();
