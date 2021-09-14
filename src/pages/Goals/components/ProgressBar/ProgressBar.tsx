import React, { useEffect, useState } from 'react';

import s from './ProgressBar.module.scss';
interface ProgressBar {
  options: any;
}

export const ProgressBar = ({ options }: ProgressBar) => {
  const {
    width,
    height,
    circleWidth,
    gradientStartColor,
    gradientStopColor,
    bgColor,
    progressValue,
  } = options;
  const radius = width / 2 - circleWidth / 2;

  const circumference = 2 * Math.PI * radius;
  function calcOffset(percent: number) {
    return circumference - (percent / 100) * circumference;
  }

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress > progressValue) {
      setProgress(0);
      return;
    }

    let timeout: number = -1;
    if (progress !== progressValue) {
      timeout = setTimeout(setProgress, 10, progress + 1);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [progress, progressValue]);

  return (
    <div className={s.progress__bar__wrapper}>
      <div className={s.progress__bar__number}>{progress}%</div>
      <div className={s.progress__bar__svg__wrapper}>
        <svg
          viewBox={`${width} ${height}`}
          height={height}
          width={width}
          className={s.progress__bar}
        >
          <circle
            fill="none"
            strokeWidth={circleWidth}
            cx={width / 2}
            cy={height / 2}
            r={radius}
            stroke={bgColor}
            className={s.progress__bar__circle__bg}
          />
          <circle
            style={{
              strokeDashoffset: calcOffset(progressValue),
              strokeDasharray: `${circumference} ${circumference}`,
            }}
            height={height}
            width={width}
            fill="none"
            strokeWidth={circleWidth}
            cx={width / 2}
            cy={height / 2}
            r={radius}
            className={s.progress__bar__circle}
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          height={0}
          width={0}
        >
          <defs>
            <linearGradient id="GradientColor">
              <stop offset="0%" stopColor={gradientStartColor} />
              <stop offset="100%" stopColor={gradientStopColor} />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
