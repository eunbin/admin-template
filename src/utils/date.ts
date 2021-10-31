import dayjs from 'dayjs';

export enum DateFormat {
  date = 'YYYY.MM.DD',
  dateDay = 'YYYY.MM.DD (ddd)',
  dateTime = 'YYYY.MM.DD (ddd) HH:mm',
  timestamp = 'YYYY.MM.DD HH:mm:ss',
}

export const getDiffDay = (date: string | Date) => {
  return dayjs(new Date().setHours(0, 0, 0, 0)).diff(
    dayjs(date)
      .set('hour', 0)
      .set('minute', 0)
      .set('second', 0)
      .set('millisecond', 0),
    'day'
  );
};

export const getDDayString = (date: string | Date) => {
  const diff = getDiffDay(date);

  return diff < 0
    ? `(D-${Math.abs(diff)})`
    : diff === 0
    ? '(D-Day)'
    : `(D+${diff})`;
};

export const getLocaleDDayString = (date: string | Date) => {
  const diff = getDiffDay(date);

  return diff < 0
    ? `${Math.abs(diff)} 일 전`
    : diff === 0
    ? '마감일'
    : `${diff} 일 경과`;
};
