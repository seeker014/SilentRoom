import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 

// Utility function to generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { _id: user._id, nickname: user.nickname },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

export const registerUser = async (req, res) => {
    try {
        const { nickname, password } = req.body;

        if (!nickname || !password) {
            return res.status(400).json({ message: 'Nickname and password are required' });
        }

        const existingUser = await User.findOne({ nickname });
        if (existingUser) {
            return res.status(400).json({ message: 'Nickname already taken' });
        }

        //const hashedPassword = await bcrypt.hash(password, 10);

        // console.log("Plain password:", password);
        // console.log("Hashed password:", hashedPassword);

        const user = await User.create({
            nickname,
            password,
        });

        const token = generateToken(user);

        res.status(201).json({
            _id: user._id,
            nickname: user.nickname,
            token,
        });
    } catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { nickname, password } = req.body;

        if (!nickname || !password) {
            return res.status(400).json({ message: 'Nickname and password are required' });
        }

        const user = await User.findOne({ nickname });
        if (!user) {
            return res.status(400).json({ message: 'Invalid nickname or password' });
        }

        // console.log("Password received:", password);
        // console.log("Hashed password from DB:", user.password);

        const isMatch = await user.matchPassword(password);
        // console.log("isMatch result:", isMatch);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid nickname or password' });
        }

        const token = generateToken(user);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                nickname: user.nickname,
                role: user.role, 
            },
            token,
        });
    } catch (error) {
        console.error('Error in loginUser:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('nickname');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
