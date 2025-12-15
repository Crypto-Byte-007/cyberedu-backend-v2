const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const run = async () => {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cyberedu';
    
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const school = JSON.parse(fs.readFileSync(path.join(__dirname, 'school-labs.json')));
        const institutional = JSON.parse(fs.readFileSync(path.join(__dirname, 'institutional-labs.json')));

        const labs = [...school, ...institutional];

        // Define Lab schema inline for seeding
        const labSchema = new mongoose.Schema({
            title: String,
            description: String,
            difficulty: String,
            category: String,
            estimatedTime: Number,
            theory: String,
            steps: [{
                task: String,
                simulationText: String,
                tutor: String
            }],
            questions: [{
                question: String,
                options: [String],
                correctAnswer: Number,
                explanation: String
            }],
            isActive: { type: Boolean, default: true },
            createdAt: { type: Date, default: Date.now }
        });

        const Lab = mongoose.model('Lab', labSchema);

        // Clear existing labs and insert new ones
        await Lab.deleteMany({});
        await Lab.insertMany(labs);

        console.log(`✅ Successfully inserted ${labs.length} labs`);
        console.log('Labs seeded successfully!');
        
    } catch (error) {
        console.error('Error seeding labs:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

run();