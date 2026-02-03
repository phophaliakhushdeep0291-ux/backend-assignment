import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan" 
import fs from "fs"         
import path from "path"

const app = express()

const accessLogStream = fs.createWriteStream(
    path.join(process.cwd(), 'access.log'), 
    { flags: 'a' }
)
app.use(morgan('dev'));
app.use(morgan('combined', { stream: accessLogStream }))

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "20kb" }))
app.use(express.urlencoded({ extended: true, limit: "20kb" }))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from './routes/user.routes.js'
import taskRouter from './routes/task.routes.js' 

app.use("/api/v1/users", userRouter)
app.use("/api/v1/tasks", taskRouter) 

export { app }