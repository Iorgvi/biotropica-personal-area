import React, { useEffect, useState } from 'react';
import { CalendarDay, CalendarDayType } from './Day/Day';
import { formatISO } from 'date-fns';

import s from './TaskCalendar.module.scss';
import { getCalendarPageDays } from './TaskCalendarHelper';
import { SomeTask } from '../../@types/entities/Task';

interface Props {
  tasks: SomeTask[];
  currentMonth: string;
  onClickTask(taskId: string): void;
}

export const Calendar = ({ tasks, currentMonth, onClickTask }: Props) => {
  const [daysWithTasks, setDaysWithTasks] = useState<CalendarDayType[]>([]);

  useEffect(() => {
    let isPast = true;
    const period = getCalendarPageDays(currentMonth);
    const currentDate = formatISO(new Date()).slice(0, 10);

    setDaysWithTasks(
      period.map(date => {
        const month = date.slice(0, 7);
        const day = date.slice(8, 10);
        if (currentDate === date) {
          isPast = false;
        }
        return {
          isPast,
          isGrey: month !== currentMonth,
          isCurrentDay: currentDate === date,
          day: +day,
          tasks: tasks.filter(task => task.date === date),
        };
      }),
    );
  }, [tasks, currentMonth]);

  return (
    <div className={s.calendarBody}>
      {daysWithTasks.map((date: CalendarDayType, i: number) => (
        <div key={`${date.day}_${i}`} className={s.cell}>
          <CalendarDay calendarDay={date} onClickTask={onClickTask} />
        </div>
      ))}
    </div>
  );
};
