import { Router } from "express";
import db from "../database/connection";
import convertHourToMinute from "../utils/convertHourToMinute";

const connectionRouter = Router();

connectionRouter.get("/", async (req, res) => {
  const totalConnections = await db("connections").count("* as total");
  const { total } = totalConnections[0];

  return res.json({ total });
});

connectionRouter.post("/", async (req, res) => {
  const { user_id } = req.body;

  const connection = await db("connections").insert({ user_id });
  return res.json({ message: "connection route post" });
});

export default connectionRouter;
