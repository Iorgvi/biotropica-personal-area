import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { CalendarTask } from './Task';
import { SomeTask } from '../../../@types/entities/Task';

import s from './Day.module.scss';

export type CalendarDayType = {
  isGrey: boolean;
  isPast: boolean;
  isCurrentDay: boolean;
  day: number; // Число месяца
  tasks: SomeTask[]; // Задачи отображаемого дня
};

export type CalendarDayProps = {
  calendarDay: CalendarDayType;
  onClickTask(taskId: string): void;
};

export function CalendarDay({ calendarDay, onClickTask }: CalendarDayProps) {
  const { isCurrentDay, day, tasks, isPast } = calendarDay;

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ref?.current?.scrollIntoView({ block: 'center' });
  }, [ref.current]);

  const sortedTasks = tasks.slice().sort((a: SomeTask, b: SomeTask) => {
    if ((a.startTime ?? '') > (b.startTime ?? '')) return 1;
    return -1;
  });

  return (
    <div
      ref={isCurrentDay ? ref : null}
      className={classNames(s.calendarDay, calendarDay.isGrey ? s.grey : '')}
    >
      <div className={classNames(s.date, isCurrentDay ? s.currentDate : '')}>
        {day}
      </div>
      <div className={s.tasksList}>
        {sortedTasks.map(task => (
          <CalendarTask
            key={task.id}
            isPast={isPast}
            task={task}
            onClickTask={onClickTask}
          />
        ))}
      </div>
    </div>
  );
}
