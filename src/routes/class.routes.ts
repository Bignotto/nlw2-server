import { Router } from "express";
import db from "../database/connection";
import convertHourToMinute from "../utils/convertHourToMinute";

const classRouter = Router();

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

interface Filters {
  week_day: string;
  subject: string;
  time: string;
}

classRouter.get("/", async (req, res) => {
  const filters = req.query;

  if (!filters.week_day || !filters.subject || !filters.time) {
    return res.status(400).json({
      error: "missing filters to search classes",
    });
  }

  const week_day = filters.week_day as string;
  const subject = filters.subject as string;
  const time = filters.time as string;

  const timeInMinutes = convertHourToMinute(time);

  const classes = await db("classes")
    .whereExists(function () {
      this.select("class_schedule.*")
        .from("class_schedule")
        .whereRaw("`class_schedule`.`class_id` = `classes`.`id`")
        .whereRaw("`class_schedule`.`week_day` = ??", [Number(week_day)])
        .whereRaw("`class_schedule`.`from` <= ??", [timeInMinutes])
        .whereRaw("`class_schedule`.`to` > ??", [timeInMinutes]);
    })
    .where("classes.subject", "=", subject)
    .join("users", "classes.user_id", "=", "users.id")
    .select(["classes.*", "users.*"]);

  return res.status(200).json(classes);
});

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
