import React from 'react';
import moment from 'moment';
import { AnalyzeAnswer } from '../../../../../store/ducks/analyze/contracts/state';
import { getMediaLink } from '../../../../../utils/mediaHelper';
import documentSvg from '../../../../../assets/icons/profile/document.svg';

import s from './AnalyzesCard.module.scss';

interface Props {
  analyzes: AnalyzeAnswer[];
}

export const Analyzes = ({ analyzes }: Props) => {
  return (
    <div className={s.documentsList}>
      {analyzes.map((analyze: AnalyzeAnswer) => (
        <div key={analyze.id} className={s.document}>
          <div className={s.content}>
            <div className={s.icon}>
              <img src={documentSvg} />
            </div>
            <div className={s.name}>
              <a target="_blank" href={getMediaLink(analyze.filePath)}>
                {analyze.text}
              </a>
            </div>
          </div>
          <div className={s.createdAt}>
            {moment(analyze.createdAt).format('LL')}
          </div>
        </div>
      ))}
    </div>
  );
};