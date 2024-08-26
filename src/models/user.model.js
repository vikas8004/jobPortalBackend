import mongoose from "mongoose";
import bcryptjs from "bcryptjs"
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["student", 'recruiter'],
        required: true
    },
    profile: {
        bio: { type: String },
        skills: [{ type: String }],
        resume: {
            secure_url: {
                type: String
            },
            public_id: {
                type: String
            }
        },
        resumeOringinalName: { type: String },
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        profilePicture: {
            secure_url: {
                type: String
            },
            public_id: {
                type: String
            }
        }
    }
}, { timestamps: true })
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        const salt = await bcryptjs.genSalt(10); // You can specify the salt rounds
        this.password = await bcryptjs.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});
export const User = mongoose.model("User", userSchema);