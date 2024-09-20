import mongoose from "mongoose";


export const connectDB = async () => {
    try {
        const connexion = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected : ${connexion.connection._connectionString}`.blue.underline);
    } catch (error) {
        console.error(`Error : ${error.message}`.red.underline)
        process.exit(1)
    }
}

