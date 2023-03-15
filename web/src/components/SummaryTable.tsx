import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { api } from "../lib/axios";
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";
import { HabitDay } from "./HabitDay";
import { HoverHabitDay } from "./HoverHabitDay";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const summaryDates = generateDatesFromYearBeginning();

const minimumSummaryDatesSize = 52 * 7; // 18 Weeks
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length;

interface SummaryTableProps {
  userPage: "summary" | "searchUser";
  searchUserId?: string;
}

type Summary = {
  id: string;
  date: string;
  amount: number;
  completed: number;
}[];

export function SummaryTable({ userPage, searchUserId }: SummaryTableProps) {
  const { userInfo } = useContext(UserContext);
  const [summary, setSummary] = useState<Summary>([]);

  useEffect(() => {
    if (userPage === "summary") {
      api.get(`/summary/${userInfo.id}`).then((response) => {
        setSummary(response.data.summary);
      });
      return;
    }
    if (userPage === "searchUser") {
      api.get(`/summary/${searchUserId}`).then((response) => {
        setSummary(response.data.summary);
      });
      return;
    }
  }, [userInfo]);

  return (
    <div className="w-full max-w-5xl pb-5 flex overflow-x-scroll scrollbar-thin scrollbar-thumb-violet-500 scrollbar-track-zinc-900 overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((weekDay, index) => {
          return (
            <div
              key={`${weekDay}-${index}`}
              className="text-zinc-400 text-xl font-bold h-10 w-10 flex items-center justify-center"
            >
              {weekDay}
            </div>
          );
        })}
      </div>

      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summary.length > 0 &&
          summaryDates.map((date) => {
            const dayInSummary = summary.find((day) => {
              return dayjs(date).isSame(day.date, "day");
            });

            if (userPage === "summary") {
              return (
                <HabitDay
                  key={date.toString()}
                  date={date}
                  amount={dayInSummary?.amount}
                  defaultCompleted={dayInSummary?.completed}
                />
              );
            } else if (userPage === "searchUser") {
              return (
                <HoverHabitDay
                  key={date.toString()}
                  date={date}
                  amount={dayInSummary?.amount}
                  defaultCompleted={dayInSummary?.completed}
                />
              );
            }
          })}

        {amountOfDaysToFill > 0 &&
          Array.from({ length: amountOfDaysToFill }).map((_, index) => {
            return (
              <div
                key={index}
                className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
              />
            );
          })}
      </div>
    </div>
  );
}
