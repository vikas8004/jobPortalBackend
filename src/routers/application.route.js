import express from "express"
import { isAuthenticated } from "../middlewares/isAuthenticates.js";
import { applyJob, getApplicants, getAppliedJob, updateStatus } from "../controller/application.controller.js";

const applicationRouter = express.Router()
applicationRouter.route("/applyjob/:id").get(isAuthenticated, applyJob)
applicationRouter.route("/appliedjob").get(isAuthenticated, getAppliedJob);
applicationRouter.route("/getapplicants/:id").get(isAuthenticated, getApplicants);
applicationRouter.route("/status/update/:id").patch(isAuthenticated, updateStatus)

export default applicationRouter;