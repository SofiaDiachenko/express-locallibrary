const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://sofiadiach:TdiocmKqnjYZKw9v@cluster0.x2g1x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // 🔹 Замініть <db_password> на свій пароль

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ MongoDB connected successfully');
    } catch (err) {
        console.error('❌ Database connection failed:', err);
        process.exit(1); // Завершити процес, якщо не вдалося підключитися
    }
};

module.exports = connectDB;

