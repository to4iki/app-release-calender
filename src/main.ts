import { Calendar } from "./components/calendar";
import { calculateReleaseSchedules, formatReleaseInfo } from "./lib/release";
import type { CalendarOptions, ReleaseSchedule } from "./lib/types";

class App {
  private calendar: Calendar | null = null;
  private form: HTMLFormElement | null = null;
  private headerElement: HTMLElement | null = null;
  private infoElement: HTMLParagraphElement | null = null;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    // DOM要素の取得
    const calendarElement = document.getElementById("calendar");
    this.form = document.getElementById("release-form") as HTMLFormElement;
    this.headerElement = document.querySelector("header");

    if (!calendarElement || !this.form || !this.headerElement) {
      console.error("Required elements not found");
      return;
    }

    // フォームの初期値を設定
    this.setDefaultFormValues();

    // カレンダーを初期化
    const initialOptions: CalendarOptions = {
      startDate: new Date(),
      endDate: new Date(),
      schedules: [],
    };
    this.calendar = new Calendar(calendarElement, initialOptions);

    // イベントリスナーを設定
    this.form.addEventListener("submit", this.handleFormSubmit.bind(this));

    // URLパラメータがある場合は自動的にフォームを送信
    const urlParams = new URLSearchParams(window.location.search);
    const version = urlParams.get("version");
    if (version) {
      const versionInput = this.form.querySelector(
        "#version"
      ) as HTMLInputElement;
      versionInput.value = version;
      this.handleFormSubmit(new Event("submit"));
    }
  }

  private setDefaultFormValues(): void {
    if (!this.form) return;

    // バージョン入力の初期値
    const versionInput = this.form.querySelector(
      "#version"
    ) as HTMLInputElement;
    const urlVersion = new URLSearchParams(window.location.search).get(
      "version"
    );
    if (urlVersion) {
      versionInput.value = urlVersion;
    } else {
      versionInput.value = "1.0.0"; // デフォルトバージョン
    }
  }

  private updateUI(schedules: ReleaseSchedule[]): void {
    if (!schedules.length) return;

    // カレンダーオプションを生成
    const firstSchedule = schedules[0];
    const options = {
      startDate: new Date(
        firstSchedule.developmentPeriod.start.getFullYear(),
        firstSchedule.developmentPeriod.start.getMonth(),
        1
      ),
      endDate: new Date(
        firstSchedule.developmentPeriod.start.getFullYear(),
        firstSchedule.developmentPeriod.start.getMonth() + 2,
        0
      ),
      schedules,
    };

    // カレンダーを更新
    this.calendar?.update(options);

    // ヘッダーのリリース情報を更新
    if (!this.infoElement) {
      this.infoElement = document.createElement("p");
      this.infoElement.style.color = "white";
      this.infoElement.style.margin = "0.5rem 0";
      this.headerElement?.appendChild(this.infoElement);
    }
    if (schedules[0]) {
      this.infoElement.textContent = formatReleaseInfo(schedules[0]);
    }

    // URLを更新
    const form = this.form as HTMLFormElement;
    const versionInput = form.querySelector("#version") as HTMLInputElement;
    const params = new URLSearchParams();
    params.set("version", versionInput.value);
    window.history.pushState({}, "", `?${params.toString()}`);
  }

  private handleFormSubmit(event: Event): void {
    event.preventDefault();

    if (!this.form) return;

    const versionInput = this.form.querySelector(
      "#version"
    ) as HTMLInputElement;
    const version = versionInput.value;

    const schedules = calculateReleaseSchedules(version);
    this.updateUI(schedules);
  }
}

// DOMの読み込み完了後にアプリケーションを初期化
document.addEventListener("DOMContentLoaded", () => new App());
