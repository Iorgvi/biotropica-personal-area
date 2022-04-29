import React from 'react';

import { intlFormat } from 'date-fns';
import { EventTask } from '../../store/@types/Task';
import { TaskPreviewComments } from '../TaskPreviewComments/TaskPreviewComments';
import { TaskValuePreview } from '../TaskValuePreview/TaskValuePreview';

import s from './EventTaskPreview.module.scss';

export interface EventTaskPreviewProps {
  task: EventTask;
  onSendComment(ewCommentText: string): void;
}

export const EventTaskPreview = ({
  task,
  onSendComment,
}: EventTaskPreviewProps) => {
  const formatDate = intlFormat(new Date(task.date), {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  return (
    <div className={s.eventTaskView}>
      <div className={s.line}>
        <TaskValuePreview title={'Название'} value={task.title} />
      </div>
      <div className={s.line}>
        <TaskValuePreview title={'Дата'} value={formatDate} />
      </div>
      {task.description && (
        <div className={s.line}>
          <div className={s.title}>Установка тренера</div>
          <div
            className={s.text}
            dangerouslySetInnerHTML={{ __html: task.description }}
          ></div>
        </div>
      )}
      <div className={s.line}>
        <TaskPreviewComments comments={task.comments} onSend={onSendComment} />
      </div>
    </div>
  );
};