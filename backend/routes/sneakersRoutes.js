import express from "express";
import sneakersController from "../controllers/sneakersController.js";

const sneakersRouter = express.Router();

sneakersRouter.get("/sneakers", sneakersController.allSneakers);
sneakersRouter.get("/sneakers/ByCategory", sneakersController.sneakersByCategory);
sneakersRouter.get("/sneakers/ByMarca", sneakersController.sneakersByMarca);
sneakersRouter.get("/sneakers/ByCategoryAndMarca", sneakersController.sneakersByCategoryAndMarca);

export default sneakersRouter;
