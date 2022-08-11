import React, { ReactNode, useEffect } from 'react';
import {
  CreateCompetitionTask,
  CreateEventTask,
  CreateTrainingTask,
} from '../../../@types/entities/Task';
import classNames from 'classnames';
import { Header } from './Header';

import s from './BaseEditor.module.scss';

export type TaskBaseEditorProps = {
  task: CreateTrainingTask | CreateEventTask | CreateCompetitionTask | null;
  title?: string;
  icon?: string;
  isCurrentUser: boolean;
  isSpecialist: boolean;
  mode: 'edit' | 'view' | 'create';
  category?: string;
  children: ReactNode;
  isOpened: boolean;
  taskId: string;
  authorSpecialistId?: number;
  authorName: string;
  onCreateTemplate: () => void;
  onDeleteTask(): void;
  onClose(): void;
  onEditBtnClick(): void;
};

export function TaskBaseEditor({
  task,
  mode,
  icon,
  title,
  isSpecialist,
  isCurrentUser,
  children,
  category,
  isOpened,
  taskId,
  authorName,
  authorSpecialistId,
  onClose,
  onCreateTemplate,
  onDeleteTask,
  onEditBtnClick,
}: TaskBaseEditorProps) {
  useEffect(() => {
    if (isOpened) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [isOpened]);

  return (
    <>
      <div
        className={classNames(s.background, !isOpened ? s.hidden : '')}
        onClick={onClose}
      ></div>
      <div className={classNames(s.editorWrapper, !isOpened ? s.hidden : '')}>
        <Header
          isSpecialist={isSpecialist}
          isCurrentUser={isCurrentUser}
          taskId={taskId}
          mode={mode}
          title={title}
          icon={icon}
          category={category}
          type={task?.type}
          authorSpecialistId={authorSpecialistId}
          authorName={authorName}
          onDeleteTask={onDeleteTask}
          onClose={onClose}
          onCreateTemplate={onCreateTemplate}
          onEditBtnClick={onEditBtnClick}
        />
        <div className={s.body}>{children}</div>
      </div>
    </>
  );
}
