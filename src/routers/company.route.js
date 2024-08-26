import express from "express";
import { getCompanies, getCompanyById, registerCompany, updateCompany } from "../controller/company.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticates.js"
const companyRouter = express.Router();
import { upload } from "../middlewares/multer.middleware.js";

companyRouter.route("/register").post(isAuthenticated, registerCompany)
companyRouter.route("/companies").get(isAuthenticated, getCompanies);
companyRouter.route("/single-company/:id").get(isAuthenticated, getCompanyById);
companyRouter.route("/update/:id").patch(isAuthenticated, upload.single("logo"), updateCompany)
export default companyRouter;