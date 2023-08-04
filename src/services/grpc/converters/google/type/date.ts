import * as grpc from '@dsh/protocols/google/type/date';

export function dateToJs(date: grpc.Date): Date {
  const dateObj = new Date(0);

  dateObj.setFullYear(date.year);
  dateObj.setMonth(date.month);
  dateObj.setDate(date.day);

  return dateObj;
}

export function dateFromJs(date: Date | undefined): grpc.Date | undefined {
  if (date === undefined) {
    return undefined;
  }

  return new grpc.Date({
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  });
}
