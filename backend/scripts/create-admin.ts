import { MongoClient } from 'mongodb';
import * as bcrypt from 'bcrypt';

async function createAdminUser() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/fashion-api';
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const usersCollection = db.collection('users');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@trendyshop.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Admin';

    const existingAdmin = await usersCollection.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists with email:', adminEmail);

      const updateResult = await usersCollection.updateOne(
        { email: adminEmail },
        { $set: { isAdmin: true } }
      );

      console.log('Updated existing user to admin status');
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(adminUser);
    console.log('Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('ID:', result.insertedId);

  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

createAdminUser();
