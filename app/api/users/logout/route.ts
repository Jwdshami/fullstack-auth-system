import {NextResponse} from "next/server";

export async function GET() {   

try {
    // Clear the authentication cookie by setting it to an empty value and an expired date
     const response = NextResponse.json({message: "Logged out successfully", status: "success"});
    response.cookies.set("token", "", {httpOnly: true,expires: new Date(0)});
    return response;   
} catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json({message: "Logout failed", status: "error"}, {status: 500});  

}
}
