import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';


// Register
export const register = async (req, res) => {
    const { name, email, password } =req.body;
    try {

        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ status: 400, message: "Email already exists." });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create new user
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            },
        });

        const { password: userPassword, ...userInfo } = newUser;
        return res.status(201).json({ status: 201, message: "User created successfully.", data: userInfo});
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Error creating user!", error});
    }
}

// Login
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
         // Check if user exists
         const user = await prisma.user.findUnique({
            where: { email }
        });

        // if no user
        if (!user) {
            return res.status(401).json({ status: 401, message: 'Invalid Credentials!' });
        }
        // check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        // password doesn't match
        if (!isPasswordValid) {
            return res.status(401).json({ status: 401, message: 'Invalid Credentials!' });
        }

        // set cookie age
        const cookieAge = 1000 * 60 * 60 * 24 * 1 // 1 day

        // jwt token
        const token = jwt.sign({
            id: user.id,
            isAdmin: false
        },
            process.env.JWt_SECRET_KEY,
            { expiresIn: cookieAge }
        );

        const {password: userPassword, ...userInfo} = user

        // Generate cookie and send to user
        res.cookie("authtoken", token, {
            httpOnly: true,
            // secure: true,
            maxAge: cookieAge
        }).status(200).json({ status: 200, message: "Login Successful.", data: userInfo })

    } catch (error) {
        return res.status(500).json({ status: 500, message: "Error logging in!", error});
    }
}

// Logout
export const logout = async (req, res) => {
    try {
        return res.clearCookie("authtoken").status(200).json({ status: 200, message: "Logout Successful.", data: null })
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Error logging out!", error});
    }
}