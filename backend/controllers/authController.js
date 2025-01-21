import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";

const generateToken = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    })

    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    })

    return { accessToken, refreshToken }
}

const storeRefreshToken = async(userId, refreshToken) => {
    await redis.set(`refresh_token: ${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); //7 days
}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true, // prevent xss attacks, cross site scripting attack
        secure:process.env.NODE_ENV === "production",
        sameSite: "strict", // prevent CSRF attack, cross-site request frogery attack
        maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // prevent xss attacks, cross site scripting attack
        secure:process.env.NODE_ENV === "production",
        sameSite: "strict", // prevent CSRF attack, cross-site request frogery attack
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

export const signup = async(req, res) => {
    const { email, password, name } = req.body;

    // Log the request body to check if the fields are correctly passed
    console.log("Request Body:", req.body);

    // Input validation
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields (name, email, password) are required",
        });
    }

    try {
        // Check if the user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // Create a new user
        const user = await User.create({ name, email, password });
        //  Authenticate the user 

        const { accessToken, refreshToken } = generateToken(user._id);
        await storeRefreshToken(user._id, refreshToken);

        setCookies(res, accessToken, refreshToken);

        res.status(201).json({  
            user:{
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,

            }, 
            message: "User created successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
// Login controller (placeholder)
export const login = async(req, res) => {
    res.status(200).json({
        success: true,
        message: "Login route called",
    });
};

// Logout controller (placeholder)
export const logout = async(req, res) => {
    res.status(200).json({
        success: true,
        message: "Logout route called",
    });
};