import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import createError from "http-errors"
import userRoutes from "./routes/userRoutes";
import path from 'path';
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())



// TODO: Routing aplikasi akan kita tulis di sini
//BUAT daftarin rute ROUTING  
app.use("/users", userRoutes)
app.use("/userPhoto", express.static(path.join(__dirname, "../userPhoto")));

// handle 404 error
app.use((req: Request, res: Response, next: Function) => {
  next(createError(404))
})

app.listen(3000, () =>
  console.log(`⚡️[server]: Server is running at http://localhost:3000`)
)