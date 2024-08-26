import express from "express"
import { login, logout, register, updateProfile } from "../controller/user.controller.js"
import { isAuthenticated } from "../middlewares/isAuthenticates.js"
import { upload } from "../middlewares/multer.middleware.js"
import verifyAutoLogin from "../middlewares/verifyAutoLogin.js"
const userRouter = express.Router()

userRouter.route("/register").post(upload.single("profilePicture"), register)
userRouter.route("/login").post(login);
userRouter.route("/login/verifylogin").get(isAuthenticated,verifyAutoLogin);
userRouter.route("/logout").post(isAuthenticated, logout)
userRouter.route("/profile/update").post(isAuthenticated, upload.single("resume"), updateProfile)

export default userRouter