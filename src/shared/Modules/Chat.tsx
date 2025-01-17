import React, { Suspense } from 'react';
import { BaseUser } from '../../@types/entities/BaseUser';

const ChatApp: React.FC<{
  isOpened: boolean;
  isAuth: boolean;
  token: string;
  currentUser: BaseUser;
  isUnread: boolean;
  activeDialogId?: number;
  accesses: string[];

  onClose(): void;
  onChangeReading(isUnread: boolean): void;
  // eslint-disable-next-line
  // @ts-ignore
}> = React.lazy(() => import('biotropika-chat/Chat'));

export type ChatProps = {
  token: string;
  currentUser: BaseUser;
  accesses: string[];
  activeDialogId?: number;
  onClose(): void;
  onChangeReading(usUnread: boolean) : void;
};

export function Chat(props: ChatProps) {
  if (!process.env.REACT_APP_CHAT_FRONT_URL) {
    throw new Error('Добавьте REACT_APP_CHAT_FRONT_URL в .env');
  }
  return (
    <Suspense fallback={'loading...'}>
      <ChatApp
        isOpened={true}
        accesses={props.accesses}
        isAuth={true}
        isUnread={false}
        token={props.token}
        activeDialogId={props.activeDialogId}
        currentUser={props.currentUser}
        onClose={props.onClose}
        onChangeReading={props.onChangeReading}
      />
    </Suspense>
  );
}
