import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { CustomError } from "../utils/errorResponse.js";
const verifyAutoLogin = async (req, res, next) => {
    try {
        const id = req.id;
        const foundUser = await User.findById(id);
        if (!foundUser) {
            return res.status(400).json(new CustomError("invalid token"))
        }
        return res.status(200).json(new ApiResponse({ msg: "user found", foundUser }))
    } catch (error) {
        next(error)
    }
}
export default verifyAutoLogin;