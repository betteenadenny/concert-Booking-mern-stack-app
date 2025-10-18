const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/userModels');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Admin inserted successfully:', adminUser);
  } catch (err) {
    console.error('Error inserting admin:', err.message);
  } finally {
    mongoose.connection.close();
  }
})();
