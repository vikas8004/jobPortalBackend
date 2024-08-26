import express from "express"
import { isAuthenticated } from "../middlewares/isAuthenticates.js"
import { getAllJobs, getCreatedJobByUser, getJobById, postJob } from "../controller/job.controller.js";
const jobRouter = express.Router()

jobRouter.route("/post").post(isAuthenticated, postJob)
jobRouter.route("/alljobs").get(isAuthenticated,getAllJobs)
jobRouter.route("/jobbyid/:id").get(isAuthenticated,getJobById)
jobRouter.route("/adminjob").get(isAuthenticated,getCreatedJobByUser)

export default jobRouter;