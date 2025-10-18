const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection error');
    }
};

connectDB();

const db = mongoose.connection;

module.exports = db;