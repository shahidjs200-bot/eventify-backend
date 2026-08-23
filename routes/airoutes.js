import express from "express";
import {protect} from "../middleware/authmiddleware.js";
import { genrateDescription } from './../controller/aicontroller.js';

const router = express.Router();

router.post("/genrate-description",protect,genrateDescription);
export default router;