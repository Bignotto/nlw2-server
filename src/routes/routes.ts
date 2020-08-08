import { Router } from "express";
import teacherRouter from "./teacher.routes";
import classRouter from "./class.routes";
const router = Router();

router.use("/teachers", teacherRouter);
router.use("/classes", classRouter);

export default router;
