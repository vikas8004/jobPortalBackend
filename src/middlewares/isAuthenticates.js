import jwt from "jsonwebtoken"
import { CustomError } from "../utils/errorResponse.js";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json(new CustomError("Unauthorized user"))
        }
        const decodedUser = jwt.verify(token, process.env.SECRET_KEY);
        if (!decodedUser) {
            return res.status(401).json(new CustomError("invalid token"))
        }
        req.id = decodedUser.userId
        next()
    } catch (error) {
        next(error)

    }
}

export { isAuthenticated }