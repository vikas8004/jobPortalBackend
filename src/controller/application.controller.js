import { Application } from "../models/applicaition.model.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { CustomError } from "../utils/errorResponse.js"
import { Job } from "../models/job.model.js"
const applyJob = async (req, res, next) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json(new CustomError("job id is required"))
        }
        // checking if the user has already applied for this job or not
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId })
        if (existingApplication) {
            return res.status(400).json(new CustomError("you have already applied for this job"));
        }
        // checking the job if exist
        const job = await Job.findById(jobId)
        if (!job) {
            return res.status(404).json(new CustomError("job not found"))
        }
        // creating new application
        const newApplication = await Application.create({ job: jobId, applicant: userId });
        job.applications.push(newApplication._id)
        await job.save();
        return res.status(200).json(new ApiResponse({ msg: "applied for job successfully" }))
    } catch (error) {
        next(error)
    }
}

// getting applied job by a user
const getAppliedJob = async (req, res, next) => {
    try {
        const userId = req.id;
        const applications = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: "job",
            options: {
                sort: { createdAt: -1 }
            },
            populate: {//this is known as nested population
                path: "companyId",
                options: {
                    sort: { createdAt: -1 }
                }
            }
        })
        if (!applications) {
            return res.status(404).json(new CustomError("No applications"))
        }
        return res.status(200).json(new ApiResponse({ msg: "applications  found", applications }))
    } catch (error) {
        next(error)
    }
}

// getting applied job by applicants for admin only
const getApplicants = async (req, res, next) => {
    try {
        const jobId = req.params.id
        const job = await Job.findById(jobId).populate({
            path: "applications",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "applicant",
                options: { sort: { createdAt: -1 } }
            }
        })
        if (!job) {
            return res.status(404).json(new CustomError("Job not found"))
        }
        return res.status(200).json(new ApiResponse({ msg: "Job found", job }))
    } catch (error) {
        next(error)
    }
}

// updating job status
const updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        if (!status) {
            return res.status(400).josn(new CustomError("status is required"))
        }
        const applicationStatusToBeUpdate = await Application.findOne({ _id: applicationId });
        if (!applicationStatusToBeUpdate) {
            return res.status(404).json(new CustomError("application not found"))
        }
        applicationStatusToBeUpdate.status = status.toLowerCase();
        await applicationStatusToBeUpdate.save();
        return res.status(200).json(new ApiResponse({ msg: "status updated successfully" }))
    } catch (error) {
        next(error)
    }
}
export { applyJob, getAppliedJob, getApplicants, updateStatus  }