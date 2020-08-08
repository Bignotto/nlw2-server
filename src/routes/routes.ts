import { Router } from "express";
import teacherRouter from "./teacher.routes";
const router = Router();

router.use("/teachers", teacherRouter);

export default router;
