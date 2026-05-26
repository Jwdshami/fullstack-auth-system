import mongoose from "mongoose";

export const connectToDB = async () => {
    try {
        // Check existing connection
        if (mongoose.connections[0].readyState) {
            console.log("Already connected to MongoDB");
            return;
        }

        // Connect only once
        await mongoose.connect(process.env.MONGO_URL!);

        const db = mongoose.connection;

        db.on(
            "error",
            console.error.bind(console, "MongoDB connection error:")
        );

        db.once("open", () => {
            console.log("Connected to MongoDB");
        });

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};