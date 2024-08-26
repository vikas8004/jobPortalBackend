import { CustomError } from "../utils/errorResponse.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { Job } from "../models/job.model.js";

// postings the jobs
const postJob = async (req, res, next) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;


        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(new CustomError("something is missing"))
        }
        const createdJob = await Job.create({
            title, description, requirements: requirements.split(","), salary, location, jobType, experience, position: Number(position), companyId, created_by: userId
        });
        return res.status(201).json(new ApiResponse({ msg: "job created successfulluy", createdJob }))
    } catch (error) {
        next(error)
    }
}

// getting the jobs
const getAllJobs = async (req, res, next) => {
    try {
        const keyword = req.query.keyword || ""
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }
        const jobs = await Job.find(query).populate("companyId").populate("created_by");
        if (!jobs) {
            res.status(404).json(new CustomError("no jobs found"))
        }
        return res.status(200).json(new ApiResponse({ msg: "job fetched successfully", jobs }))
    } catch (error) {
        next(error)

    }
}

// getting job by id
const getJobById = async (req, res, next) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: "applications"
        })
        if (!job) {
            return res.status(404).json(CustomError("no job found"))
        }
        return res.status(200).json(new ApiResponse({ msg: "job found ", job }))
    } catch (error) {
        next(error)

    }
}

// getting particular job created by a user
const getCreatedJobByUser = async (req, res, next) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path: "companyId",
        })
        if (!jobs) {
            return res.status(404).json(new CustomError("no job found for this user"))
        }
        return res.status(200).json(new ApiResponse({ msg: "jobs found for this user", jobs }))
    } catch (error) {
        next(error)
    }
}
export { postJob, getAllJobs, getJobById, getCreatedJobByUser }