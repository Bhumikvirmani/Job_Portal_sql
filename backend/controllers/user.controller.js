// import { User } from "../models/user.model.js";
import express from 'express';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, deleteUserById, getUserByEmail, getUserById,  initializeProfileTable,  initializeUserTable,  updateUserProfile} from "../models/user_model_sql.js";


export const registerSql = async (req, res) => {
    try {
        console.log("Received request body:", JSON.stringify(req.body, null, 2));
        initializeUserTable(); 
        initializeProfileTable();// Log the received request body in JSON format
        console.log("Initializing tables complete.");

        const { fullname, email, phoneNumber, password, role, profile } = req.body;

        console.log("Parsed values:", { fullname, email, phoneNumber, password, role, profile });  // Log the parsed values

        if (!fullname) {
            return res.status(400).json({
                message: "Fullname is required",
                success: false
            });
        }
        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                success: false
            });
        }
        if (!phoneNumber) {
            return res.status(400).json({
                message: "Phone number is required",
                success: false
            });
        }
        if (!password) {
            return res.status(400).json({
                message: "Password is required",
                success: false
            });
        }
        if (!role) {
            return res.status(400).json({
                message: "Role is required",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await createUser({ fullname, email, phoneNumber, password: hashedPassword, role, profile });

        const tokenData = {
            userId: userId
        };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        return res.status(201).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome ${fullname}`,
            user: { id: userId, fullname, email, phoneNumber, role },
            success: true
        });
    } catch (error) {
        console.error('Error registering user:', error.stack);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const loginUsersql = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false
            });
        }

        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            });
        }

        const tokenData = {
            userId: user.id
        };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        const userInfo = {
            id: user.id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role
        };

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user: userInfo,
            success: true
        });
    } catch (error) {
        console.error('Error logging in user:', error.stack);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const logoutUsersql = (req, res) => {
    return res.status(200).cookie("token", "", { maxAge: 1, httpOnly: true, sameSite: 'strict' }).json({
        message: "Logged out successfully",
        success: true
    });
};

export const getUserSqlById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await getUserById(userId);
        
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }
            return res.status(200).json({
            message: "User fetched successfully",
            user,
            success: true
        });
    } catch (error) {
        console.error('Error fetching user:', error.stack);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const updateUserProfileSql = async (req, res) => {
    try {
        const userId = req.id;  // Use the authenticated user ID
        const { fullname, email, phoneNumber, bio, skills } = req.body;

        // Fetch current user data
        const currentUser = await getUserById(userId);

        if (!currentUser) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Ensure currentUser.profile is properly initialized
        currentUser.profile = currentUser.profile || {};

        const updatedUserData = {
            fullname: fullname !== undefined ? fullname : currentUser.fullname,
            email: email !== undefined ? email : currentUser.email,
            phoneNumber: phoneNumber !== undefined ? phoneNumber : currentUser.phoneNumber,
            profile: {
                bio: bio !== undefined ? bio : currentUser.profile.bio,
                skills: skills !== undefined ? skills.split(",") : JSON.parse(currentUser.profile.skills || "[]"),
                profilePhoto: req.file ? req.file.path : currentUser.profile.profilePhoto
            }
        };

        await updateUserProfile(userId, updatedUserData);

        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user: {
                fullname: updatedUserData.fullname,
                email: updatedUserData.email,
                phoneNumber: updatedUserData.phoneNumber,
                bio: updatedUserData.profile.bio,
                skills: updatedUserData.profile.skills,
                profilePhoto: updatedUserData.profile.profilePhoto
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error.stack);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

//  export const updateUserProfileSql = async (req, res) => {
//     try {
//         const userId = req.params.id;
//         const profile = req.body;

//         await updateUserProfile(userId, profile);

//         return res.status(200).json({
//             message: "Profile updated successfully",
//             success: true
//         });
//     } catch (error) {
//         console.error('Error updating profile:', error.stack);
//         return res.status(500).json({
//             message: "Internal server error",
//             success: false
//         });
//     }
// };
export const deleteUserSql = async (req, res) => {
    try {
        const userId = req.params.id;
        
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        await deleteUserById(userId);

        return res.status(200).json({
            message: "User deleted successfully",
            success: true
        });
    } catch (error) {
        console.error('Error deleting user:', error.stack);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile:{
                profilePhoto:cloudResponse.secure_url,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

