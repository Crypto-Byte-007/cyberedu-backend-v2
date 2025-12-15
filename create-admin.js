const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/cyberedu', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Hash password
    const hashedPassword = await bcrypt.hash('AdminPass123!', 10);

    // Create admin user
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

    const adminUser = new User({
      email: 'admin@cyberedu.com',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Admin',
      role: 'admin',
      status: 'active',
      isActive: true,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@cyberedu.com');
    console.log('Password: AdminPass123!');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdmin();