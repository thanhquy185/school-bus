import jsonwebtoken from "jsonwebtoken";
import { number } from "zod";

const SECRET = process.env.SECRET || "SECRET_KEY";
const JWT_EXPIRE_IN = process.env.JWT_EXPIRE_IN || "86400";

/**
 * Create a JWT token
 * @param payload - Payload to be signed in the token
 * @returns 
 */
export const generateToken = (payload: any): { accessToken: string, issuedAt: number, expiresAt: number } => {
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt = issuedAt + parseInt(JWT_EXPIRE_IN);
    return {
        accessToken: jsonwebtoken.sign(payload, SECRET, { expiresIn: parseInt(JWT_EXPIRE_IN) }),
        issuedAt: issuedAt,
        expiresAt: expiresAt
    };
}

/**
 * Verify a JWT token
 * @param token - JWT token to be verified
 * @returns Decoded payload if token is valid, otherwise throws an error
 */
export const verifyToken = (token: string): any => {
    try {
        token = token.replace("Bearer ", "").trim();
        console.log("Verifying token:", token);
        return jsonwebtoken.verify(token, SECRET);
    } catch (error) {
        throw new Error("Invalid token");
    }
}

/**
 * Decode a JWT token without verifying
 * @param token - JWT token to be decoded
 * @returns Decoded payload
 */
export const decodeToken = (token: string): any => {
    return jsonwebtoken.decode(token);
}

