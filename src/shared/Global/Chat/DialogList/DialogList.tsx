import s from '../Chat.module.scss';
import { BtnClose } from '../../../buttons/BtnClose/BtnClose';
import { DialogItem } from './DialogItem';
import { getOpponent } from '../../../../utils/dialogHelper';
import React from 'react';

type Props = {
  dialogs: Dialog[];
  currentUser: ChatUser;
  onClose: () => void;
  onOpenDialog: (dialog: Dialog) => void;
};

enum MessageType {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    DOCUMENT = 'DOCUMENT',
}


export function DialogList({
  dialogs,
  currentUser,
  onClose,
  onOpenDialog,
}: Props) {
  return (
    <div>
      <div className={s.sidebar__header}>
        <div className={s.sidebar__header__title}>Сообщения</div>
        <BtnClose setOpen={onClose} />
      </div>
      <div className={s.sidebar__messages}>
        {(dialogs || []).map((dialog, index) => {
          const opponent = getOpponent(dialog, currentUser);
          const textMessages = dialog.messages
            ? dialog.messages.filter(it => it.type === MessageType.TEXT)
            : [];
          const lastMessage = textMessages[textMessages.length - 1];
          const content = lastMessage ? lastMessage.text : '';

          return (
            <DialogItem
              key={index}
              options={{
                image: opponent?.profile_photo,
                name: currentUser ? opponent?.email : '',
                content,
                status: opponent?.isOnline,
              }}
              onClick={() => onOpenDialog(dialog)}
            />
          );
        })}
      </div>
    </div>
  );
}