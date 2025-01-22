import express from "express";
import loginRouter from "./routes/login.js";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api", loginRouter);

app.listen(port, () => {
    console.log(`Server running on route http://localhost:${port}`);
});
