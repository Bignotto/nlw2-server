import { Router } from "express";

const teacherRouter = Router();

teacherRouter.get("/", (req, res) => {
  res.send("Teachers get / route");
});

export default teacherRouter;
