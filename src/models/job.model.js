import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }
    ,
    description: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        requried: true
    }
    ,
    requirements: {
        type: [{ type: String }]
    },
    salary: { type: String, required: true },
    location: { type: String, required: true },
    jobType: { type: String, required: true },
    position: { type: Number, required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    applications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application", }]
}, { timestamps: true })

export const Job = mongoose.model("Job", jobSchema)