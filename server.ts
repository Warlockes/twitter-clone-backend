import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { passport } from "./core/passport";
import "./core/db";

import { UserCtrl } from "./controllers/UserController";
import { TweetsCtrl } from "./controllers/TweetsController";
import { registerValidations } from "./validations/register";
import { createTweetValidations } from "./validations/createTweet";

const app = express();

app.use(express.json());
app.use(passport.initialize());

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
// app.patch("/tweets/:id", TweetsCtrl.update);

app.get("/auth/verify", registerValidations, UserCtrl.verify);
app.post("/auth/signup", registerValidations, UserCtrl.create);
app.post("/auth/signin", passport.authenticate("local"), UserCtrl.afterLogin);
// app.patch("/users", UserCtrl.update);
// app.delete('/users', UserCtrl.delete);

app.listen(process.env.PORT, () => {
  console.log("SERVER RUNNING!");
});
