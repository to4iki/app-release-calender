/** 期間を表す型 */
export interface Period {
  start: Date;
  end: Date;
}

/** リリース情報を表す型 */
export interface ReleaseSchedule {
  version: string;
  developmentPeriod: Period;
  qaPeriod: Period;
  releaseDate: Date | null;
}

/** カレンダーイベントの種類 */
export type EventType = "development" | "qa" | "release";

/** カレンダーイベントを表す型 */
export interface CalendarEvent {
  type: EventType;
  version: string;
  label: string;
}

/** カレンダーのセル情報を表す型 */
export interface CalendarCell {
  date: Date;
  isToday: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
  events: CalendarEvent[];
  isOtherMonth: boolean;
}

/** カレンダーのオプションを表す型 */
export interface CalendarOptions {
  startDate: Date;
  endDate: Date;
  schedules: ReleaseSchedule[];
}
