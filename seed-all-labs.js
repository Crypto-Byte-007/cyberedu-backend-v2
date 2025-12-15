const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const labSchema = new mongoose.Schema({}, { strict: false });
const Lab = mongoose.model('Lab', labSchema);

async function seedLabs() {
  try {
    await mongoose.connect('mongodb://localhost:27017/cyberedu');
    console.log('Connected to MongoDB');

    const schoolLabs = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/labs/data/school-labs.json'), 'utf8'));
    const institutionLabs = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/labs/data/institution-labs.json'), 'utf8'));
    
    const allLabs = [...schoolLabs, ...institutionLabs];
    
    for (const lab of allLabs) {
      await Lab.updateOne(
        { labId: lab.labId },
        { $set: lab },
        { upsert: true }
      );
      console.log(`✅ Loaded: ${lab.labId} - ${lab.title}`);
    }

    console.log(`\n🎉 Total labs loaded: ${allLabs.length}`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

seedLabs();
