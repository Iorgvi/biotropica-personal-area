import React from 'react';
import { QuestionnaireSvgSelector } from '../../../../assets/icons/questionnaire/QuestionnaireSvgSelector';
import s from './Question.module.scss';

type Props = {
  progress: {
    currentIndex: number;
    total: number;
  };
  onNext(): void;
  onPrev(): void;
};

export const QuestionNav = ({ onNext, onPrev, progress }: Props) => {
  return (
    <div className={s.nav}>
      {/*{progress.currentIndex !== 1 ? (*/}
      {/*  <button className={s.btn__prev} onClick={onPrev}>*/}
      {/*    <div className={s.btn__prev__icon}>*/}
      {/*      <QuestionnaireSvgSelector id='arrow' />*/}
      {/*    </div>*/}
      {/*    <div className={s.btn__prev__text}>назад</div>*/}
      {/*  </button>*/}
      {/*) : (*/}
      {/*  <div></div>*/}
      {/*)}*/}

      <button className={s.nextBtn} onClick={onNext}>
        <div className={s.text}>
          <p>
            {progress.currentIndex !== progress.total ? 'далее' : 'завершить'}
          </p>
        </div>
        <div className={s.icon}>
          <QuestionnaireSvgSelector id="arrow" />
        </div>
      </button>
    </div>
  );
};