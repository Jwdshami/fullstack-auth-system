import {NextRequest} from "next/server";
import jwt from "jsonwebtoken";

export function getDataFromToken(request: NextRequest) {
    const token = request.cookies.get("token")?.value || '';
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!); // ✅ matches .env // ✅ fixed secret name
        return decoded;
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
}