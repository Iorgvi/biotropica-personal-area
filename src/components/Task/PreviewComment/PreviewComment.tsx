import React from 'react';
import { formatDate } from './PreviewCommentHelper';

import s from './PreviewComment.module.scss';
import { Comment } from '../../../@types/entities/Comment';
import { getMediaLink } from '../../../utils/mediaHelper';
import defaultAvatar from '../../../assets/images/profile/default_avatar.png';

export type TaskPreviewCommentProps = {
  comment: Comment;
  onDeleteComment(commentId: string): void;
};

export function TaskPreviewComment({ comment, onDeleteComment }: TaskPreviewCommentProps) {
  const { datetime, text, author } = comment;
  const { lastname, name, profilePhoto } = author;

  return (
    <div className={s.comment}>
      <div className={s.photo}>
        <img
          src={profilePhoto ? getMediaLink(profilePhoto) : defaultAvatar}
          alt=""
        />
      </div>
      <div className={s.body}>
        <div className={s.header}>
          <div className={s.name}>
            {name} {lastname}
          </div>
          <div className={s.date}>{formatDate(datetime)}</div>
        </div>
        <p className={s.text}>{text}</p>
        {/* handle Click */}
        <button onClick={() => onDeleteComment(comment.uuid)}>Click here to delete comment</button>
      </div>
    </div>
  );
}
