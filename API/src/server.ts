import express from "express";
import cors from "cors";
import db from "./config/database.config";
import dotenv from "dotenv";

import userRouter from "./routes/userRoutes";
import postRouter from "./routes/postRoutes";
import commentRouter from "./routes/commentRoutes";
import imageRouter from "./routes/imageRoutes";
import favRouter from "./routes/favRoutes"
import msgRouteur from "./routes/messageRoutes"
import convRouteur from "./routes/conversationRoutes"

import './models/User';
import './models/Post';
import './models/Comment';
import './models/Message';
import './models/Conversation';
import './models/UserFavorites';
import './models/UserConversations';
import './models/associations';

dotenv.config();

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true
}));

app.use(express.json());
// app.use(express.urlencoded({extended:true}))

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);
app.use("/img", imageRouter);
app.use("/fav", favRouter);
app.use("/msg", msgRouteur)
app.use("/conv", convRouteur)

const port = process.env.PORT || 5070;

db.sync().then(() => {
  console.log("Connecté à : ", db.config.host, " => ", db.config.database);
  app.listen(port, () => {
    console.log("Server PORT : ", port);
  });
});