import { User } from "../models/user.model.js";
import { CustomError } from "../utils/errorResponse.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import formatFile from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

// register logic
const register = async (req, res, next) => {
    try {

        const file = req.file;
        const { fullName, email, phoneNumber, role, password } = req.body;
        if (!fullName || !email || !phoneNumber || !role || !password) {
            return res.status(400).send(new CustomError("Something is missing", false));
        }

        const foundUser = await User.findOne({ email });
        if (foundUser) {
            return res.status(400).json(new CustomError("User already exists", false));
        }
        if (file) {
            // console.log(file);

            const formattedFile = formatFile(file);
            const cloudinaryResponse = await cloudinary.uploader.upload(formattedFile.content, {
                folder: "jobportal"
            });
            // console.log(cloudinaryResponse);

            const createdUser = await User.create({
                fullName, email, phoneNumber, role, password, profile: {
                    profilePicture: {
                        public_id: cloudinaryResponse.public_id,
                        secure_url: cloudinaryResponse.secure_url
                    }
                }
            });
            res.status(201).send(new ApiResponse(createdUser));
        }
        else {
            const createdUser = await User.create({ fullName, email, phoneNumber, role, password });
            res.status(201).send(new ApiResponse(createdUser));
        }

    } catch (error) {
        next(error);
    }
};

//login logic
const login = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json(new CustomError("Something is missing", false));
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json(new CustomError("Invalid credentials", false));
        }

        const isPasswordMatched = await bcryptjs.compare(password, user.password);


        if (!isPasswordMatched) {
            return res.status(400).json(new CustomError("Invalid credentials", false));
        }

        if (role !== user.role) {
            return res.status(400).json(new CustomError("Account doesn't exist with the current role", false));
        }

        const tokenData = {
            userId: user._id,
        };
        const token = jsonwebtoken.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

        const derivedUser = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',  // Adjust according to your environment
            secure: process.env.NODE_ENV === 'production'  // Secure cookie in production
        }).send(new ApiResponse({ message: `Welcome back ${user.fullName}`, user: derivedUser }, true));
    } catch (error) {
        next(error);
    }
};


//logout logic
const logout = async (req, res, next) => {
    try {
        console.log(req.id);

        return res.clearCookie("token", { httpOnly: true, sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict", secure: process.env.NODE_ENV === 'production' }).status(200).json(new ApiResponse("logout successfully"))
    } catch (error) {
        next(error)
    }
}

const updateProfile = async (req, res, next) => {
    try {
        // console.log(req.body);

        const { fullName, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;
        // console.log(file);

        const userId = req.id;//will use it from middleware
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json(new CustomError("User not found"))
        }
        // formatting the file
        if (file) {
            cloudinary.uploader.destroy(user.profile.resume.public_id, (err, result) => {
                if (err) {
                    console.log(err);

                }
                else {
                    console.log("File deleted successfully", result);

                }
            })
            const formattedFile = formatFile(file)
            const cloudinaryResponse = await cloudinary.uploader.upload(formattedFile.content, { folder: "jobportal" });

            if (cloudinaryResponse) {
                user.profile.resume = {
                    public_id: cloudinaryResponse.public_id,
                    secure_url: cloudinaryResponse.secure_url
                }
                user.profile.resumeOringinalName = file.originalname
            }
        }



        user.fullName = fullName ? fullName : user.fullName;
        user.email = email ? email : user.email;
        user.phoneNumber = phoneNumber ? phoneNumber : user.phoneNumber;
        user.profile.bio = bio ? bio : user.profile.bio;
        user.profile.skills = skills ? skills.split(",") : user.profile.skills


        // saving the user
        await user.save()
        const derivedUser = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };
        return res.status(200).json(new ApiResponse({ message: "Profile updated successfully", derivedUser }))
    } catch (error) {
        next(error)
    }
}
export { register, login, logout, updateProfile }