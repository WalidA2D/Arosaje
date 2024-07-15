import express from "express";
import userRouter from "./routes/userRoutes";
import db from "./config/database.config";
import dotenv from 'dotenv'

dotenv.config()

const app = express();

app.use(express.json());
// app.use(express.urlencoded({extended:true}))

app.use("/user", userRouter);

const port = process.env.PORT || 5070;

db.sync().then(() => {
    console.log("Connecté à la database");
    app.listen(port, () => {
        console.log("Server PORT : ", port);
    });
});