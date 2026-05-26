import { connectToDB } from "@/src/dbConfig/dbConfig";
import User from "@/src/models/userModel";
import { sendEmail } from "@/src/helpers/mailer";

export const POST = async (request: Request) => {
  try {
    await connectToDB();
    const { token } = await request.json();
    const user = await User.findOne({ verifyToken: token });
    if (!user || user.verifyTokenExpiry < Date.now()) {
      return new Response(
        JSON.stringify({ message: "Invalid or expired token" }),
        { status: 400 },
      );
    }

    if (!user) {
      return new Response(
        JSON.stringify({ message: "Invalid or expired token" }),
        { status: 400 },
      );
    }
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    return new Response(
      JSON.stringify({ message: "Email verified successfully" }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error verifying email:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
