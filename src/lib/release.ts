import {
  addDays,
  addMonths,
  endOfMonth,
  isBusinessDay,
  startOfMonth,
} from "./date";
import type { Period, ReleaseSchedule } from "./types";

/**
 * バージョンの次のパッチバージョンを計算
 */
function incrementVersion(version: string): string {
  const [major, minor] = version.split(".").map(Number);
  return `${major}.${minor + 1}.0`;
}

/**
 * 指定された週の第N営業日を計算
 */
function findNthBusinessDay(weekStart: Date, n: number): Date {
  let date = new Date(weekStart);
  let count = 0;

  while (count < n) {
    if (isBusinessDay(date)) {
      count++;
      if (count === n) break;
    }
    date = addDays(date, 1);
  }

  return date;
}

/**
 * 指定された月のリリース情報を計算
 */
function calculateMonthReleases(
  baseVersion: string,
  month: Date
): ReleaseSchedule[] {
  const schedules: ReleaseSchedule[] = [];
  let currentWeek = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  let version = baseVersion;

  while (currentWeek <= monthEnd) {
    // リリース日を計算（週の第3営業日）
    const releaseDate = findNthBusinessDay(currentWeek, 3);

    // QA期間を計算（週の第1、第2営業日）
    const qaStartDate = findNthBusinessDay(currentWeek, 1);
    const qaEndDate = findNthBusinessDay(currentWeek, 2);

    // 開発期間を計算（前週の営業日）
    const devWeekStart = addDays(currentWeek, -7); // 前週の月曜日
    const devWeekEnd = addDays(currentWeek, -1); // 前週の日曜日

    // 開発期間の開始日と終了日を調整
    let devStartDate = devWeekStart;
    let devEndDate = devWeekEnd;

    while (!isBusinessDay(devStartDate)) {
      devStartDate = addDays(devStartDate, 1);
    }
    while (!isBusinessDay(devEndDate)) {
      devEndDate = addDays(devEndDate, -1);
    }

    // リリース日が月を超える場合はnullに
    const effectiveReleaseDate = releaseDate > monthEnd ? null : releaseDate;

    schedules.push({
      version,
      developmentPeriod: {
        start: devStartDate,
        end: devEndDate,
      },
      qaPeriod: {
        start: qaStartDate,
        end: qaEndDate,
      },
      releaseDate: effectiveReleaseDate,
    });

    // 次のサイクルの準備
    currentWeek = addDays(currentWeek, 7);
    version = incrementVersion(version);
  }

  return schedules;
}

/**
 * 指定されたバージョンから始まる2ヶ月分のリリース情報を計算
 */
export function calculateReleaseSchedules(
  baseVersion: string
): ReleaseSchedule[] {
  const today = new Date();
  const thisMonth = startOfMonth(today);
  const nextMonth = addMonths(thisMonth, 1);

  return [
    ...calculateMonthReleases(baseVersion, thisMonth),
    ...calculateMonthReleases(incrementVersion(baseVersion), nextMonth),
  ];
}

/**
 * 日付が開発期間中かどうかを判定
 */
export function isDevelopmentDate(date: Date, period: Period): boolean {
  return date >= period.start && date <= period.end && isBusinessDay(date);
}

/**
 * 日付がQA期間中かどうかを判定
 */
export function isQADate(date: Date, period: Period): boolean {
  return date >= period.start && date <= period.end && isBusinessDay(date);
}

/**
 * 指定された日付のリリース情報文字列を生成
 */
export function formatReleaseInfo(info: ReleaseSchedule): string {
  const formatDate = (date: Date | null): string => {
    if (!date) return "N/A";
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return `v${info.version}: 開発期間 ${formatDate(
    info.developmentPeriod.start
  )}-${formatDate(info.developmentPeriod.end)}, QA期間 ${formatDate(
    info.qaPeriod.start
  )}-${formatDate(info.qaPeriod.end)}, リリース ${formatDate(
    info.releaseDate
  )}`;
}
