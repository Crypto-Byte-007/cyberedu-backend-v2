const mongoose = require('mongoose');

async function createTestLab() {
  await mongoose.connect('mongodb://localhost:27017/cyberedu');
  
  const labSchema = new mongoose.Schema({
    labId: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'], default: 'beginner' },
    category: { type: String, enum: ['incident_response', 'network_security', 'web_security'], required: true },
    estimatedTime: { type: Number, default: 60 },
    points: { type: Number, default: 100 },
    prerequisites: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    theoryContent: { type: String, default: '<h1>Test Lab Theory</h1><p>This is a test lab.</p>' },
    steps: [{
      stepNumber: Number,
      title: String,
      content: String,
      instructions: String,
      hints: [String],
      validationCriteria: [{
        type: String,
        value: String,
        expectedResult: String
      }],
      estimatedTime: Number,
      successMessage: String
    }],
    isActive: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: true }
  });

  const Lab = mongoose.model('Lab', labSchema);

  const testLab = new Lab({
    labId: 'IR-101',
    title: 'Incident Response: Log Analysis Fundamentals',
    description: 'Learn to analyze system logs for security incidents',
    difficulty: 'beginner',
    category: 'incident_response',
    estimatedTime: 90,
    points: 100,
    skills: ['Log Analysis', 'SIEM', 'Threat Detection'],
    theoryContent: '<h1>Introduction to Log Analysis</h1><p>Logs are records of events...</p>',
    steps: [
      {
        stepNumber: 1,
        title: 'Access the Virtual Machine',
        content: 'Connect to the provided Ubuntu VM',
        instructions: 'Use SSH to connect to the VM at 192.168.1.100 with username: student, password: cyberedu2024',
        hints: ['The password is "cyberedu2024"', 'Use: ssh student@192.168.1.100'],
        validationCriteria: [
          {
            type: 'command',
            value: 'whoami',
            expectedResult: 'student'
          }
        ],
        estimatedTime: 5,
        successMessage: 'Great! You have successfully accessed the VM.'
      },
      {
        stepNumber: 2,
        title: 'Analyze System Logs',
        content: 'Examine the /var/log/auth.log file',
        instructions: 'Use cat or tail commands to view the auth.log file and look for failed login attempts',
        hints: ['Command: cat /var/log/auth.log', 'Look for "Failed password" entries'],
        validationCriteria: [
          {
            type: 'command',
            value: 'grep -c "Failed password" /var/log/auth.log',
            expectedResult: '3'
          }
        ],
        estimatedTime: 15,
        successMessage: 'Excellent! You found the failed login attempts.'
      }
    ]
  });

  try {
    await testLab.save();
    console.log('Test lab created successfully!');
    console.log('Lab ID:', testLab._id);
  } catch (error) {
    console.log('Lab already exists or error:', error.message);
  }

  mongoose.disconnect();
}

createTestLab();
