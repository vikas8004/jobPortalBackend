import cookieParser from "cookie-parser";
import express from "express"
import cors from "cors"
import userRouter from "./routers/user.router.js";
import companyRouter from "./routers/company.route.js";
import jobRouter from "./routers/job.route.js";
import applicationRouter from "./routers/application.route.js";
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:5173", "https://jobhunt123.netlify.app"],
    credentials: true
}))
app.use("/api/v1/user", userRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
    });
})//this kind of middleware is specially desingned for handling the error.

export default app;