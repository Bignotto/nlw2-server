import { Router } from "express";
import teacherRouter from "./teacher.routes";
import classRouter from "./class.routes";
import connectionRouter from "./connection.routes";
const router = Router();

router.use("/teachers", teacherRouter);
router.use("/classes", classRouter);
router.use("/connections", connectionRouter);

export default router;
