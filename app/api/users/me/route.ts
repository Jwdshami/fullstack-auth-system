import {getDataFromToken} from "@/src/helpers/getDataFromToken"; // Adjust the path as necessary
import {NextRequest, NextResponse} from "next/server";
import userModel from "@/src/models/userModel"; // Adjust the path as necessary

import {connectToDB} from "@/src/dbConfig/dbConfig"; // Adjust the path as necessary




export async function GET(request: NextRequest) {
    try {
           await connectToDB(); 
        const userData = getDataFromToken(request);
        if (!userData || typeof userData === "string") {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

   const user = await userModel.findById(userData.id).select("-password");
        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        return NextResponse.json({user}, {status: 200});
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}           



