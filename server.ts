import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { passport } from "./core/passport";
import "./core/db";

import { UserCtrl } from "./controllers/UserController";
import { registerValidations } from "./validations/register";

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
app.get("/auth/verify", UserCtrl.verify);
app.post("/auth/signup", registerValidations, UserCtrl.create);
app.post("/auth/signin", passport.authenticate("local"), UserCtrl.afterLogin);
// app.patch("/users", UserCtrl.update);
// app.delete('/users', UserCtrl.delete);

app.listen(process.env.PORT, () => {
  console.log("SERVER RUNNING!");
});
