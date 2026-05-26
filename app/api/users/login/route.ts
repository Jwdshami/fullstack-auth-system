import {connectToDB} from "@/src/dbConfig/dbConfig";
import User from "@/src/models/userModel.js";
import bcrypt from "bcryptjs";
import {NextResponse} from "next/server";
import jwt from "jsonwebtoken";

export const POST = async (request: Request) => {
    try {
        await connectToDB();

        const {email, password} = await request.json();

        // Check if the user exists
        const user = await User.findOne({email});
        if (!user) {
            return NextResponse.json({message: "Invalid email or password"}, {status: 400});
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({message: "Invalid email or password"}, {status: 400});
        }

        // If authentication is successful, you can generate a token here (e.g., JWT) and return it to the client
        const token =  jwt.sign({id: user._id, username: user.username, email: user.email}, 
            process.env.JWT_SECRET!, {expiresIn: "1h"});

        const response = NextResponse.json({message: "Login successful", token}, {status: 200});    

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600, // 1 hour
        });
        return response;
    } catch (error) {
        console.error("Error during user login:", error);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
};  