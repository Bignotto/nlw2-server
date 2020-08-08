import { Router } from "express";
import db from "../database/connection";
import convertHourToMinute from "../utils/convertHourToMinute";

const classRouter = Router();

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

classRouter.post("/", async (req, res) => {
  const { name, avatar, whatsapp, bio, subject, cost, schedule } = req.body;

  const createdUsers = await db("users").insert({
    name,
    avatar,
    whatsapp,
    bio,
  });
  const user_id = createdUsers[0];

  const createdClasses = await db("classes").insert({
    subject,
    cost,
    user_id,
  });

  const class_id = createdClasses[0];

  const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
    return {
      class_id,
      week_day: scheduleItem.week_day,
      from: convertHourToMinute(scheduleItem.from),
      to: convertHourToMinute(scheduleItem.to),
    };
  });

  const schedules = await db("class_schedule").insert(classSchedule);

  console.log("added ", user_id, class_id, schedules);
  return res.send();
});

export default classRouter;
