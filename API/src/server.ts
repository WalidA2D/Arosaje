import express from "express";

import db from "./config/database.config";
import dotenv from 'dotenv'

import userRouter from "./routes/userRoutes";
import postRouter from "./routes/postRoutes";
import commentRouter from "./routes/commentRoutes";
import imageRouter from "./routes/imageRoutes";

dotenv.config()

const app = express();

app.use(express.json());
// app.use(express.urlencoded({extended:true}))

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/comment" , commentRouter);
app.use("/img", imageRouter)

const port = process.env.PORT || 5070;

db.sync().then(() => {
    console.log("Connecté à la database");
    app.listen(port, () => {
        console.log("Server PORT : ", port);
    });
});