const mongoose = require("mongoose");
require('dotenv').config();

module.exports = async () => {
    const mongoUri =
        process.env.MONGODB_URL;

    try {
        mongoose.set('strictQuery', false);
        const connect = await mongoose.connect(mongoUri, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });

        console.log(`MongoDB connected: ${connect.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
