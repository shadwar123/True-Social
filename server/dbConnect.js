const mongoose = require("mongoose");
require('dotenv').config();

module.exports = async () => {
    const mongoUri =
        "mongodb+srv://shadwar123:TxiJTYE00WXysSZ9@cluster0.yz6yzdu.mongodb.net/";

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
