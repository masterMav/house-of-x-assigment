import express, { Express, Request, Response } from "express";
import { ServiceController } from "../controllers/controller";

const router = express.Router();

router.get("/view/:hashVal", ServiceController.viewUrl);
router.get("/all", ServiceController.viewAll);
router.post("/create", ServiceController.createUrl);
router.patch("/edit", ServiceController.editUrl);

export default router;
