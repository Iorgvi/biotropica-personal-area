import React, { RefObject } from 'react';

import classNames from 'classnames';
import closeIcon from './../../../assets/icons/close_white.svg';
import editIcon from './../../../assets/icons/edit_note.svg';
import { MoreOptionsButton } from './MoreOptionsButton';

import s from './Header.module.scss';

interface Props {
  mode: 'edit' | 'view' | 'create';
  isCurrentUser: boolean;
  title?: string;
  icon?: string;
  category?: string;
  type?: string;
  taskId: string;
  isSpecialist: boolean;
  onClose(): void;
  onEditBtnClick(): void;
  onCreateTemplate(): void;
  onDeleteTask(): void;
}

export const Header = ({
  mode,
  title,
  icon,
  type,
  category,
  taskId,
  isSpecialist,
  onDeleteTask,
  onClose,
  onCreateTemplate,
  onEditBtnClick,
  isCurrentUser,
}: Props) => {
  let taskType = '';
  let headerColor = '';
  let headerTitle = '';

  switch (type) {
    case 'training':
      taskType = 'Тренировка';
      headerColor = '#3B82F6';
      break;
    case 'competition':
      taskType = 'Соревнование';
      headerColor = '#F6963B';
      break;
    case 'event':
      taskType = 'Событие';
      headerColor = '#00CCB3';
      break;

    default:
      break;
  }

  switch (mode) {
    case 'edit':
      headerTitle = 'Редактирование задачи';
      break;
    case 'view':
      headerTitle = title || '';
      break;

    case 'create':
      headerTitle = 'Создание задачи';
      break;
    default:
      break;
  }

  return (
    <div className={s.header} style={{ backgroundColor: headerColor }}>
      <div className={classNames(s.title, mode === 'view' ? s.underline : '')}>
        <div className={s.taskTitle}>
          {icon && mode === 'view' && (
            <div className={s.icon}>
              <div
                className={s.iconMask}
                style={{
                  backgroundColor: headerColor,
                  WebkitMaskImage: `url(${icon})`,
                  maskImage: `url(${icon})`,
                }}
              ></div>
            </div>
          )}
          {headerTitle}
        </div>

        <div className={s.rightContent}>
          {mode === 'edit' && (
            <MoreOptionsButton
              isSpecialist={isSpecialist}
              onCreateTemplate={onCreateTemplate}
              onDelete={onDeleteTask}
              taskId={taskId}
            />
          )}
          <img
            className={s.closeIcon}
            src={closeIcon}
            alt=""
            onClick={onClose}
          />
        </div>
      </div>

      {mode === 'view' ? (
        <div className={s.taskInfo}>
          <div className={s.row}>
            <p className={s.rowTitle}>тип задачи</p>
            <p className={s.rowText}>{taskType}</p>
          </div>
          {category && (
            <div className={s.row}>
              <p className={s.rowTitle}>категория</p>
              <p className={s.rowText}>{category}</p>
            </div>
          )}
          {isCurrentUser && (
            <img
              className={s.editIcon}
              src={editIcon}
              alt=""
              onClick={onEditBtnClick}
            />
          )}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};
