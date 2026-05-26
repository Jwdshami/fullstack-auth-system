import {connectToDB} from "@/src/dbConfig/dbConfig";
import User from "@/src/models/userModel";
import {sendEmail} from "@/src/helpers/mailer";
import crypto from "crypto";

// forgotpassword/route.ts
export const POST = async (request: Request) => {
    try {
        await connectToDB();
        const { email } = await request.json();
        const user = await User.findOne({ email });
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        // sendEmail already saves forgotPasswordToken to DB — don't create a separate token
        await sendEmail({ email, userId: user._id, emailType: "RESET" });

        return new Response(JSON.stringify({ message: "Password reset link sent!" }), { status: 200 });
    } catch (error) {
        console.error("Error in forgot password:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}; 
