import {connectToDB} from "@/src/dbConfig/dbConfig";
import { sendEmail } from "@/src/helpers/mailer";
import User from "@/src/models/userModel.js";
import bcrypt from "bcryptjs";
import {NextResponse} from "next/server";
 
export const POST = async (request: Request) => {
    try {
        await connectToDB();

        const {username, email, password} = await request.json();

        // Check if the user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return NextResponse.json({message: "User already exists"}, {status: 400});
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        // Send verification email (you can implement this function in a separate file)
        await sendEmail({ email, userId: newUser._id, emailType: "VERIFY" });

        return NextResponse.json({message: "User registered successfully"}, {status: 201});
    } catch (error) {
        console.error("Error during user registration:", error);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
};  

