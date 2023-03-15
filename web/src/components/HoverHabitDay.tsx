interface HabitDayProps {
  date: Date;
  defaultCompleted?: number;
  amount?: number;
}

import * as HoverCard from "@radix-ui/react-hover-card";
import clsx from "clsx";
import dayjs from "dayjs";
import { useState } from "react";

export function HoverHabitDay({
  defaultCompleted = 0,
  amount = 0,
  date,
}: HabitDayProps) {
  const [completed, setCompleted] = useState(defaultCompleted);

  const completedPercentage =
    amount > 0 ? Math.round((completed / amount) * 100) : 0;

  const dayAndMonth = dayjs(date).format("DD/MM");
  const dayOfWeek = dayjs(date).format("dddd");

  function handleCompletedChanged(completed: number) {
    setCompleted(completed);
  }
  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <div
          className={clsx(
            "w-10 h-10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-background",
            {
              "bg-violet-500 border-violet-400": completedPercentage >= 80,
              "bg-violet-600 border-violet-500":
                completedPercentage >= 60 && completedPercentage < 80,
              "bg-violet-700 border-violet-500":
                completedPercentage >= 40 && completedPercentage < 60,
              "bg-violet-800 border-violet-600":
                completedPercentage >= 20 && completedPercentage < 40,
              "bg-violet-900 border-violet-700":
                completedPercentage > 0 && completedPercentage < 20,
              "bg-zinc-900 border-2 border-zinc-800": completedPercentage === 0,
            }
          )}
        />
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className="min-w-[180px] p-6 rounded-2xl bg-zinc-900 flex flex-col justify-center items-center border-2 border-zinc-800">
          <span className="font-semibold text-zinc-400">{dayOfWeek}</span>
          <span className="mt-1 font-extrabold leading-tight text-3xl">
            {dayAndMonth}
          </span>

          <HoverCard.Arrow className="fill-zinc-800" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
