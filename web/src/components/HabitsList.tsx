import * as Checkbox from "@radix-ui/react-checkbox";
import dayjs from "dayjs";
import { Check } from "phosphor-react";
import { useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { UserContext } from "../contexts/UserContext";
import { api } from "../lib/axios";

interface HabitsListProps {
  date: Date;
  onCompletedChanged: (completed: number) => void;
}

interface HabitsInfo {
  possibleHabits: {
    id: string;
    title: string;
    created_at: string;
  }[];
  completedHabits: string[];
}

export function HabitsList({ date, onCompletedChanged }: HabitsListProps) {
  const { userInfo } = useContext(UserContext);

  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>();

  const isDateInPast = dayjs(date).endOf("day").isBefore(new Date());

  async function handleToggleHabit(habitId: string) {
    await api.patch(`/habits/${habitId}/toggle`);

    const isHabitAlreadyCompleted =
      habitsInfo!.completedHabits.includes(habitId);
    let completedHabits: string[] = [];

    if (isHabitAlreadyCompleted) {
      completedHabits = habitsInfo!.completedHabits.filter(
        (id) => id !== habitId
      );
    } else {
      completedHabits = [...habitsInfo!.completedHabits, habitId];
    }

    setHabitsInfo({
      possibleHabits: habitsInfo!.possibleHabits,
      completedHabits,
    });

    onCompletedChanged(completedHabits.length);
  }

  useEffect(() => {
    api
      .get("day", {
        params: {
          date: date.toISOString(),
          userId: userInfo.id,
        },
      })
      .then((response) => {
        setHabitsInfo(response.data);
      });
  }, []);

  return (
    <div className="mt-6 flex flex-col gap-3">
      {habitsInfo?.possibleHabits.map((habit) => {
        return (
          <Checkbox.Root
            key={habit.id}
            defaultChecked={habitsInfo.completedHabits.includes(habit.id)}
            onCheckedChange={() => handleToggleHabit(habit.id)}
            className="flex items-center gap-3 group disabled:cursor-not-allowed focus:outline-none"
            disabled={isDateInPast}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-600 transition-colors group-focus:outline-none group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-background">
              <Checkbox.Indicator>
                <Check size={20} className="text-white" />
              </Checkbox.Indicator>
            </div>
            <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
              {habit.title}
            </span>
          </Checkbox.Root>
        );
      })}
    </div>
  );
}
