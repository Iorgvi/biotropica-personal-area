import React, { Dispatch, SetStateAction } from 'react';
import classNames from 'classnames';
import s from './SidebarNotifications.module.scss';
import { BtnClose } from '../../buttons/BtnClose/BtnClose';
import { Notification } from './Notification/Notification';
import { Notification as INotification } from '../../../store/ducks/notification/contracts/state';

import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const SidebarNotifications = ({ open, setOpen }: Props) => {
  const notifications: INotification[] = [
    {
      text: 'О нет! Вы забыли про задание',
      taskLink: 'task32784712387123',
      date: '2001-08-01',
      createdAt: '2001-04-07',
    },
    {
      text: 'О нет! Вы забыли про задание',
      taskLink: 'task3223871223',
      date: '2001-04-07',
      createdAt: '2001-04-07',
    },
    {
      text: 'О нет! Вы забыли про задание',
      taskLink: 'task32784712387123',
      date: '2001-04-07',
      createdAt: '2001-04-07',
    },
    {
      text: 'О нет! Вы забыли про задание',
      taskLink: 'task384712387123',
      date: '2001-04-07',
      createdAt: '2001-04-07',
    },
    {
      text: 'О нет! Вы забыли про задание',
      taskLink: 'task384712387123',
      date: '2001-04-07',
      createdAt: '2001-04-07',
    },
    {
      text: 'О нет! Вы забыли про задание',
      taskLink: 'task384712387123',
      date: '2001-04-07',
      createdAt: '2001-04-07',
    },
    {
      text: 'О нет! Вы забыли про задание',
      taskLink: 'task384712387123',
      date: '2001-04-07',
      createdAt: '2001-04-07',
    },
    {
      text: 'О нет! Вы забыли про задание',
      taskLink: 'task384712387123',
      date: '2001-04-07',
      createdAt: '2001-04-07',
    },
    {
      text: 'О нет! Вы забыли про задание',
      taskLink: 'task384712387123',
      date: '2001-04-07',
      createdAt: '2001-04-07',
    },
    {
      text: 'О нет! Вы забыли про задание',
      taskLink: 'task384712387123',
      date: '2001-04-07',
      createdAt: '2001-04-07',
    },
    {
      text: 'О нет! Вы забыли про задание',
      taskLink: 'task384712387123',
      date: '2001-04-07',
      createdAt: '2001-04-07',
    },
    {
      text: 'О нет! Вы забыли про задание',
      taskLink: 'task384712387123',
      date: '2001-04-07',
      createdAt: '2001-04-07',
    },
    {
      text: 'О нет! Вы забыли про задание',
      taskLink: 'task384712387123',
      date: '2001-04-07',
      createdAt: '2001-04-07',
    },
    {
      text: 'О нет! Вы забыли про задание',
      taskLink: 'task384712387123',
      date: '2001-04-07',
      createdAt: '2001-04-07',
    },
  ];
  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={(open && s.sidebar__background) || ''}
      ></div>
      <div
        className={classNames({
          [s.sidebar__notifications__wrapper]: true,
          [s.open]: open,
        })}
      >
        <div className={s.sidebar__notifications}>
          <div className={s.sidebar__header}>
            <div className={s.sidebar__header__title}>Уведомления</div>
            <BtnClose setOpen={setOpen} />
          </div>
          <PerfectScrollbar>
            <div className={s.notifications}>
              {notifications.map((notification: INotification, i: number) => {
                return (
                  <Notification
                    key={i + notification.taskLink}
                    notification={notification}
                  />
                );
              })}
            </div>
          </PerfectScrollbar>
        </div>
      </div>
    </>
  );
};