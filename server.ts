import dotenv from "dotenv";
dotenv.config();

import express from "express";
import multer from "multer";
import { passport } from "./core/passport";
import "./core/db";

import { UserCtrl } from "./controllers/UserController";
import { TweetsCtrl } from "./controllers/TweetsController";
import { registerValidations } from "./validations/register";
import { createTweetValidations } from "./validations/createTweet";
import { UploadFileCtrl } from "./controllers/UploadFileController";

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.json());
app.use(passport.initialize());

//TODO:
// 1) Сделать кастомный мидлваре, который проверяет авторизацию пользователя и валидность id твита - DRY в TweetController

app.get("/users", UserCtrl.index);
app.get(
  "/users/me",
  passport.authenticate("jwt", { session: false }),
  UserCtrl.getUserInfo
);
app.get("/users/:id", UserCtrl.show);

app.get("/tweets", TweetsCtrl.index);
app.get("/tweets/:id", TweetsCtrl.show);
app.post(
  "/tweets",
  passport.authenticate("jwt"),
  createTweetValidations,
  TweetsCtrl.create
);
app.delete("/tweets/:id", passport.authenticate("jwt"), TweetsCtrl.delete);
app.patch(
  "/tweets/:id",
  passport.authenticate("jwt"),
  createTweetValidations,
  TweetsCtrl.update
);

app.get("/auth/verify", registerValidations, UserCtrl.verify);
app.post("/auth/signup", registerValidations, UserCtrl.create);
app.post("/auth/signin", passport.authenticate("local"), UserCtrl.afterLogin);
// app.patch("/users", UserCtrl.update);
// app.delete('/users', UserCtrl.delete);

app.post("/upload", upload.single("avatar"), UploadFileCtrl.upload);

app.listen(process.env.PORT, () => {
  console.log("SERVER RUNNING!");
});
