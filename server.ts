import express from "express";

const app = express();

app.get("/hello", (_, res: express.Response) => {
  res.send("Salam");
});

app.get("/users");

app.listen(8888, () => {
  console.log("SERVER RUNNING!");
});
