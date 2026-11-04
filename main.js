import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from "dotenv";

import router from './server/router/router.js'
import errorMiddleware from "./middlewares/error-middleware.js";

dotenv.config()

const port = process.env.port || 5000

const app = express()
app.use(express.json())

app.use(cookieParser())
app.use('/auth', router)
app.use(cors())
app.use(errorMiddleware)

app.listen(port, () => {
    console.log(`сервер работает на порту ${port}`)
})






