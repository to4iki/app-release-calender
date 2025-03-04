import {
  generateCalendarDays,
  isBusinessDay,
  isSameDay,
  isWeekend,
} from "../lib/date";
import { isDevelopmentDate, isQADate } from "../lib/release";
import type {
  CalendarCell,
  CalendarEvent,
  CalendarOptions,
} from "../lib/types";

export class Calendar {
  private element: HTMLElement;
  private options: CalendarOptions | null = null;

  constructor(element: HTMLElement, options: CalendarOptions | null = null) {
    this.element = element;
    this.options = options;
    this.render();
  }

  private generateCalendarCell(date: Date): CalendarCell {
    const today = new Date();
    const events: CalendarEvent[] = [];

    // リリーススケジュールからイベントを生成
    if (this.options?.schedules) {
      this.options.schedules.forEach((schedule) => {
        // 開発期間のイベント
        if (isDevelopmentDate(date, schedule.developmentPeriod)) {
          events.push({
            type: "development",
            version: schedule.version,
            label: `開発: ${schedule.version}`,
          });
        }

        // QA期間のイベント
        if (isQADate(date, schedule.qaPeriod)) {
          events.push({
            type: "qa",
            version: schedule.version,
            label: `QA: ${schedule.version}`,
          });
        }

        // リリース日のイベント
        if (schedule.releaseDate && isSameDay(date, schedule.releaseDate)) {
          events.push({
            type: "release",
            version: schedule.version,
            label: `リリース: ${schedule.version}`,
          });
        }
      });
    }

    return {
      date,
      isToday: isSameDay(date, today),
      isWeekend: isWeekend(date),
      isHoliday: !isBusinessDay(date),
      events,
      isOtherMonth: this.options
        ? date.getMonth() !== this.options.startDate.getMonth()
        : false,
    };
  }

  private createCalendarHeader(): HTMLElement {
    const header = document.createElement("div");
    header.className = "calendar-header";

    const weekDays = ["日", "月", "火", "水", "木", "金", "土"];
    weekDays.forEach((day, index) => {
      const cell = document.createElement("div");
      cell.className = "calendar-header-cell";
      if (index === 0) cell.classList.add("sunday");
      if (index === 6) cell.classList.add("saturday");
      cell.textContent = day;
      header.appendChild(cell);
    });

    return header;
  }

  private formatDate(date: Date): string {
    return `${date.getDate()}`;
  }

  private formatMonthHeader(date: Date): string {
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  }

  private createEventElement(event: CalendarEvent): HTMLElement {
    const element = document.createElement("div");
    element.className = `event ${event.type}`;
    element.setAttribute("data-version", event.version);
    element.textContent = event.label;
    return element;
  }

  private renderMonth(monthContainer: HTMLElement, startDate: Date): void {
    // 月のヘッダーを追加
    const monthHeader = document.createElement("div");
    monthHeader.className = "calendar-month-header";
    monthHeader.textContent = this.formatMonthHeader(startDate);
    monthContainer.appendChild(monthHeader);

    // カレンダーヘッダーを追加
    monthContainer.appendChild(this.createCalendarHeader());

    const calendarBody = document.createElement("div");
    calendarBody.className = "calendar-body";

    // 月初から月末までの日付を生成
    const days = generateCalendarDays(
      startDate.getFullYear(),
      startDate.getMonth()
    );

    // 曜日に合わせてグリッドを調整
    const firstDayOfWeek = days[0].getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.className = "calendar-cell empty";
      calendarBody.appendChild(emptyCell);
    }

    days.forEach((date) => {
      const cell = this.generateCalendarCell(date);
      const element = document.createElement("div");
      const classes = ["calendar-cell"];

      // 基本クラスの追加
      if (cell.isToday) classes.push("today");
      if (cell.isWeekend) classes.push("weekend");
      if (cell.isHoliday) classes.push("holiday");
      if (cell.isOtherMonth) classes.push("other-month");

      // 日曜日と土曜日のクラスを追加
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0) classes.push("sunday");
      if (dayOfWeek === 6) classes.push("saturday");

      element.className = classes.join(" ");

      // 日付要素の追加
      const dateElement = document.createElement("div");
      dateElement.className = "date";
      dateElement.textContent = this.formatDate(date);
      element.appendChild(dateElement);

      // イベントの追加
      if (cell.events.length > 0) {
        const eventsContainer = document.createElement("div");
        eventsContainer.className = "events";
        cell.events.forEach((event) => {
          eventsContainer.appendChild(this.createEventElement(event));
        });
        element.appendChild(eventsContainer);
      }

      calendarBody.appendChild(element);
    });

    monthContainer.appendChild(calendarBody);
  }

  private render(): void {
    this.element.innerHTML = ""; // Clear existing content

    if (this.options) {
      // 2ヶ月分のカレンダーを表示
      const months = [
        this.options.startDate,
        new Date(
          this.options.startDate.getFullYear(),
          this.options.startDate.getMonth() + 1,
          1
        ),
      ];

      months.forEach((date) => {
        const monthContainer = document.createElement("div");
        monthContainer.className = "calendar-month";
        this.renderMonth(monthContainer, date);
        this.element.appendChild(monthContainer);
      });
    }
  }

  public update(options: CalendarOptions): void {
    this.options = options;
    this.render();
  }
}
