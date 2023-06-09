import dayjs from "dayjs";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function habitsRoutes(app: FastifyInstance) {
  app.post("/habits", async (request, response) => {
    const createHabitBody = z.object({
      userId: z.string(),
      title: z.string(),
      weekDays: z.array(z.number().min(0).max(6)),
    });

    const { title, weekDays, userId } = createHabitBody.parse(request.body);

    const today = dayjs().startOf("day").toDate();

    await prisma.habit.create({
      data: {
        userId,
        title,
        created_at: today,
        weekDays: {
          create: weekDays.map((weekDay) => {
            return {
              week_day: weekDay,
            };
          }),
        },
      },
    });
  });

  app.get("/day", async (request, response) => {
    const getDayParams = z.object({
      userId: z.string(),
      date: z.coerce.date(),
    });

    const { date, userId } = getDayParams.parse(request.query);

    const parsedDate = dayjs(date).startOf("day");

    const weekDay = parsedDate.get("day");

    // todos hábitos possiveis
    // habitos que ja foram completados

    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date,
        },
        userId: userId,
        weekDays: {
          some: {
            week_day: weekDay,
          },
        },
      },
    });

    const day = await prisma.day.findUnique({
      where: {
        date: parsedDate.toDate(),
      },
      include: {
        dayHabits: true,
      },
    });

    const completedHabits =
      day?.dayHabits.map((dayHabit) => {
        return dayHabit.habit_id;
      }) ?? [];

    return {
      possibleHabits,
      completedHabits,
    };
  });

  // completar / não-completar um hábito

  app.patch("/habits/:id/toggle", async (request, response) => {
    const toggleHabitParams = z.object({
      id: z.string().uuid(),
    });

    const { id } = toggleHabitParams.parse(request.params);

    const today = dayjs().startOf("day").toDate();

    let day = await prisma.day.findUnique({
      where: {
        date: today,
      },
    });

    if (!day) {
      day = await prisma.day.create({
        data: {
          date: today,
        },
      });
    }

    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: day.id,
          habit_id: id,
        },
      },
    });

    if (dayHabit) {
      // Remover a marcação de completo
      await prisma.dayHabit.delete({
        where: {
          id: dayHabit.id,
        },
      });
    } else {
      //Completar o Habito
      await prisma.dayHabit.create({
        data: {
          day_id: day.id,
          habit_id: id,
        },
      });
    }
  });

  app.get("/summary/:userId", async (request) => {
    // [ { date: 17/01, amount: 5, completed: 1 }, { date: 18/01, amount: 2, completed: 2 }, { ... }, ... ]

    // Query mais complexa, mais condições, relacionamentos => SQL na mão (RAW)
    // Prisma ORM: RAW SQL => SQLite

    const toggleHabitParams = z.object({
      userId: z.string(),
    });

    const { userId } = toggleHabitParams.parse(request.params);

    console.log("IDDDDDDDDDD", userId);

    const summary = await prisma.$queryRaw`
      SELECT 
        D.id,
        D.date,
        (
          SELECT 
            cast(count(*) as float)
          FROM day_habits DH
          WHERE DH.day_id = D.id
        ) as completed,
        (
          SELECT
            cast(count(*) as float)
          FROM habit_week_days HWD
          JOIN habits H
            ON H.id = HWD.habit_id
          WHERE
            HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
            AND H.created_at <= D.date
            AND H.userId=${userId}
        ) as amount
      FROM days D
    `;

    return {
      summary,
    };
  });
}
