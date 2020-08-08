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

  const trx = await db.transaction();

  try {
    const createdUsers = await trx("users").insert({
      name,
      avatar,
      whatsapp,
      bio,
    });
    const user_id = createdUsers[0];

    const createdClasses = await trx("classes").insert({
      subject,
      cost,
      user_id,
    });

    console.log(schedule);
    const class_id = createdClasses[0];
    const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
      return {
        class_id,
        week_day: scheduleItem.week_day,
        from: convertHourToMinute(scheduleItem.from),
        to: convertHourToMinute(scheduleItem.to),
      };
    });
    console.log(classSchedule);

    const schedules = await trx("class_schedule").insert(classSchedule);

    await trx.commit();

    console.log("added ", user_id, class_id, schedules);
    return res.status(201).send();
  } catch (error) {
    await trx.rollback();
    console.log(error);

    return res.status(400).json({
      error: "unexpected error while creating new class",
    });
  }
});

export default classRouter;
