const express = require("express");
require("dotenv").config();
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRouter = require("./route/authRouter");

const frontend =
  process.env.NODE_ENV === "production"
    ? process.env.FRONT_END_HOSTED
    : process.env.FRONT_END_LOCAL;

const mongoUri =
  process.env.NODE_ENV === "production"
    ? process.env.MONGODB_URI_HOSTED
    : process.env.MONGODB_URI_LOCAL;

const app = express();
app.use(
  cors({
    origin: frontend,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hiee ;)" });
});

app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRouter);

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Datebase connected.");

    app.listen(PORT, () => {
      console.log(
        `Server running on  http://localhost:${PORT} and serving to ${frontend}`
      );
    });
  })
  .catch((err) => {
    console.error("Database connection error: ", err);
  });