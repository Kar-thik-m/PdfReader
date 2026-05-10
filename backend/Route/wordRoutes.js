import { Router } from "express";
import { getMeaning, saveWord, getWords } from "../controllers/wordController.js";

const WordRouter = Router();

WordRouter.get("/meaning/:word", getMeaning);
WordRouter.post("/save", saveWord);
WordRouter.get("/all", getWords);

export default WordRouter;