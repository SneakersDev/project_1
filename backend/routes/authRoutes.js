import { Router } from "express";
import authController  from "../controllers/authController.js";

const loginRouter = Router();

loginRouter.post("/login", authController.login);

export default loginRouter;
