// app/api/users/resetpassword/route.ts
import { connectToDB } from "@/src/dbConfig/dbConfig";
import User from "@/src/models/userModel";
import bcrypt from "bcryptjs";

export const POST = async (request: Request) => {
    try {
        await connectToDB();
        const { token, password } = await request.json();

        const user = await User.findOne({
            forgotPasswordToken: token,
            forgotPasswordTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return new Response(
                JSON.stringify({ message: "Invalid or expired token" }),
                { status: 400 }
            );
        }

        user.password = await bcrypt.hash(password, 10);
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        await user.save();

        return new Response(
            JSON.stringify({ message: "Password reset successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error resetting password:", error);
        return new Response(
            JSON.stringify({ message: "Internal Server Error" }),
            { status: 500 }
        );
    }
};