// Initialize database with collections and indexes
db = db.getSiblingDB('cyberedu');

// Create collections if they don't exist
const collections = ['users', 'labs', 'reports', 'notifications'];
collections.forEach(colName => {
  if (!db.getCollectionNames().includes(colName)) {
    db.createCollection(colName);
    print(`Created collection: ${colName}`);
  }
});

// Create indexes for users collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });

print('✅ MongoDB initialization complete');