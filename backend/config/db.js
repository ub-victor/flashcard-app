const mongoose = require ('mongoose');

const connectDB = async () => {
    try {
        /*The result of connection contains info like:host, port,database name */
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connect: :${conn.connection.host}`);

    } catch(error){
        console.error(`Error: ${error.message}`)
        process.exit(1);
    }
}

module.exports = connectDB;