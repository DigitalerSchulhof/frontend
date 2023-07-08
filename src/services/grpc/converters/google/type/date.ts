import * as grpc from '@dsh/protocols/google/type/date';

export function dateToJs(date: grpc.Date): number {
  const dateObj = new Date(0);

  dateObj.setFullYear(date.year);
  dateObj.setMonth(date.month);
  dateObj.setDate(date.day);

  return dateObj.getTime();
}

export function dateFromJs(date: number | undefined): grpc.Date | undefined {
  if (date === undefined) {
    return undefined;
  }

  const dateObj = new Date(date);

  return new grpc.Date({
    day: dateObj.getDate(),
    month: dateObj.getMonth() + 1,
    year: dateObj.getFullYear(),
  });
}
