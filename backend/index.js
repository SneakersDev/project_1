import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


import loginRouter from "./routes/login.js";
import sneakersRouter from "./routes/sneakers.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api", loginRouter);
app.use("/api", sneakersRouter);

app.listen(port, () => {
    console.log(`Server running on route http://localhost:${port}`);
});
