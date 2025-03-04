import { isHoliday as isJpHoliday } from "@holiday-jp/holiday_jp";

/** 日付が週末かどうかを判定 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0: 日曜日, 6: 土曜日
}

/** 日付が同じかどうかを判定 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/** 日付が範囲内かどうかを判定 */
export function isWithinRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

/** 日付に指定した日数を加算 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/** 日付が祝日かどうかを判定 */
export function isHoliday(date: Date): boolean {
  return isJpHoliday(date);
}

/** 営業日かどうかを判定 */
export function isBusinessDay(date: Date): boolean {
  return !isWeekend(date) && !isHoliday(date);
}

/** 指定した日数分の営業日を加算 */
export function addBusinessDays(date: Date, days: number): Date {
  let result = new Date(date);
  let remainingDays = days;

  while (remainingDays > 0) {
    result = addDays(result, 1);
    if (isBusinessDay(result)) {
      remainingDays--;
    }
  }

  return result;
}

/** 月初の日付を取得 */
export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/** 月末の日付を取得 */
export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/** 次の月の日付を取得 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/** カレンダーに表示する日付の配列を生成（月初から月末まで） */
export function generateCalendarDays(year: number, month: number): Date[] {
  const lastDay = new Date(year, month + 1, 0);
  const result: Date[] = [];

  for (let i = 1; i <= lastDay.getDate(); i++) {
    result.push(new Date(year, month, i));
  }

  return result;
}
