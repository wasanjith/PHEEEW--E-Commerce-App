import User from "../models/userModel.js";

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

        res.status(201).json({
            success: true,
            user,
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