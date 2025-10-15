// routes/resultRoutes.js
import express from "express";
import { createResult, listResults } from "../controllers.js/resultController.js";
import authMiddleware from "../middlewares/auth.js";


const resultRouter = express.Router();

resultRouter.post("/",authMiddleware, createResult);
resultRouter.get("/", authMiddleware,listResults);


export default resultRouter;
