
import { CustomError } from "../utils/errorResponse.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { Company } from "../models/company.model.js";
import formatFile from "../utils/dataUri.js"
import cloudinary from "../utils/cloudinary.js"
//registering a comapnay
const registerCompany = async (req, res, next) => {
    try {


        const { name } = req.body;
        if (!name) {
            return res.status(400).json(new CustomError("compnay name is required"))
        }
        let foundCompany = await Company.findOne({ name: name.toLowerCase() });
        if (foundCompany) {
            return res.status(400).json(new CustomError("company already exist"));
        }
        const createdCompany = await Company.create({ name: name.toLowerCase(), userId: req.id })
        return res.status(201).json(new ApiResponse({ msg: "Company created successfully", createdCompany }))
    } catch (error) {
        next(error)
    }
}

//getting all the companies of a specific user
const getCompanies = async (req, res, next) => {
    try {

        const userId = req.id;
        // console.log(userId);

        const companies = await Company.find({ userId })
        // console.log(companies);

        if (!companies) {
            return res.status(404).json(new CustomError("No companies found"))
        }
        return res.status(200).json(new ApiResponse(companies))
    } catch (error) {
        next(error)
    }
}

// getting company by id
const getCompanyById = async (req, res, next) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId)
        if (!company) {
            return res.status(404).json(new CustomError("No company found"))
        }
        return res.status(200).json(new ApiResponse({ company }))
    } catch (error) {
        next(error)
    }
}
// updating the company
const updateCompany = async (req, res, next) => {
    try {
        const { name, description, website, location } = req.body
        const file = req.file;
        // console.log(req.params.id, file, req.body);

        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(400).json(new CustomError("company did not updated"))
        }

        company.name = name ? name : company.name;
        company.description = description ? description : company.description;
        company.website = website ? website : company.website;
        company.location = location ? location : company.location;
        if (file) {
            const formattedFile = formatFile(file);
            if (company.logo.secure_url) {
                cloudinary.uploader.destroy(company.logo.public_id);
            }
            const cloudinaryReponse = await cloudinary.uploader.upload(formattedFile.content, {
                folder: "jobportal"
            })
            company.logo.public_id = cloudinaryReponse.public_id;
            company.logo.secure_url = cloudinaryReponse.secure_url;
        }
        const updatedCompany = await company.save();
        

        return res.status(200).json(new ApiResponse({ msg: "Comapny data updated successfully.", updatedCompany }))
    } catch (error) {
        next(error)
    }
}
export { registerCompany, getCompanies, getCompanyById, updateCompany }