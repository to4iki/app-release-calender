# アプリリリースカレンダー

アプリのリリースサイクルを可視化するためのWebアプリケーション

https://app-release-calender.pages.dev/

## 概要

1週間間隔でのネイティブアプリのリリースサイクルを可視化します。
現在月と翌月の2ヶ月分のリリース予定を表示します。

### リリースサイクルのルール

1. **開発期間**: リリース週の前週の営業日
   - 土日および祝日を除く前週の全営業日
   - 例：リリース週が3/11-3/15の場合、開発期間は3/4-3/8

2. **QA期間**: リリース週の第一、第二営業日
   - 土日および祝日を除く最初の2営業日
   - 祝日がある場合はスキップして次の営業日を使用

3. **リリース日**: リリース週の第三営業日
   - 土日および祝日を除く3番目の営業日
   - 月を跨ぐ場合は表示しない

### リリースサイクル例（v1.0.0から開始の場合）

- v1.0.0: 開発期間 3/3-3/7, QA期間 3/10-3/11, リリース 3/12
- v1.1.0: 開発期間 3/10-3/14, QA期間 3/17-3/18, リリース 3/19
- v1.2.0: 開発期間 3/17-3/21, QA期間 3/24-3/25, リリース 3/26
- v1.3.0: 開発期間 3/24-3/28, QA期間 3/31-4/1, リリース 4/3
- v1.4.0: 開発期間 3/31-4/4, QA期間 4/7-4/8, リリース 4/9
- v1.5.0: 開発期間 4/7-4/11, QA期間 4/14-4/15, リリース 4/16
- v1.6.0: 開発期間 4/14-4/18, QA期間 4/21-4/22, リリース 4/23
- v1.7.0: 開発期間 4/21-4/25, QA期間 4/28,4/30, リリース 5/1（非表示）

※ 4/29は祝日のため、QA2日目は4/30となります

## 課題

- 現在のリリースサイクルの各フェーズ（開発/QA/リリース）の把握が困難
- 特定バージョンのリリース日程の把握が困難

## 機能要件

### 必須機能

1. カレンダー表示
   - 開発期間、QA期間、リリース日を異なる色でハイライト
   - 今日の日付を特別な色でハイライト
   - 土日祝日を考慮した営業日表示

2. パラメータ対応
   - クエリパラメータでアプリバージョンを指定可能
   - 指定バージョンのリリースサイクルを表示

3. レスポンシブデザイン
   - スマートフォンでの閲覧に対応

### 非機能要件

1. パフォーマンス
   - 素早いレンダリング
   - スムーズなカレンダー操作

2. UX
   - 直感的な操作性
   - 視認性の高い配色

## 技術スタック

- 言語: TypeScript
- ビルドツール: Vite
- フロントエンド: HTML, CSS, TypeScript (フレームワークなし)
- デプロイ先: Cloudflare Pages

## 機能詳細

### カレンダー表示
- 月単位でのカレンダー表示
- 土日祝日の色分け表示（土日: 青, 祝日: 赤）
- 今日の日付を紫色の枠線でハイライト

### リリース情報の表示
- 開発期間を緑色でハイライト（リリース週の前週の営業日）
- QA期間をオレンジ色でハイライト（リリース週の最初の2営業日）
- リリース日を赤色でハイライト
- リリース情報をヘッダーに表示

### URL指定
- バージョン指定のみ必要（例：v1.0.0）
- 現在月と翌月の2ヶ月分を自動表示
- 例: `http://localhost:3000/?version=1.0.0`

### 祝日対応
- [@holiday-jp/holiday_jp](https://github.com/holiday-jp/holiday_jp-js)を使用
- 日本の祝日を考慮した営業日の計算
- 祝日は赤字で表示

### レスポンシブデザイン
- デスクトップ、タブレット、スマートフォンに対応
- 画面サイズに応じて最適なレイアウトに調整

## セットアップ

### 必要要件
- Node.js 18.0.0以上
- npm 9.0.0以上

### インストール
```bash
# リポジトリのクローン
git clone https://github.com/your-username/app-release-calendar.git
cd app-release-calendar

# 依存パッケージのインストール
npm install
```

### 開発
```bash
# 開発サーバーの起動
npm run dev

# TypeScriptの型チェック
npm run tsc

# コードのフォーマットとリント
npm run format
npm run lint
```

### ビルド
```bash
# プロダクションビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

## アプリケーション設計

### ディレクトリ構造

```
app-release-calendar/
├── README.md              # プロジェクト説明
├── index.html             # エントリーポイントHTML
├── package.json           # npm設定
├── vite.config.ts         # Vite設定
├── tsconfig.json          # TypeScript設定
├── src/
│   ├── lib/               # 共通ライブラリ群
│   │   ├── date.ts        # 日付操作ユーティリティ
│   │   ├── release.ts     # リリース情報計算
│   │   └── types.ts       # 共通型定義
│   ├── components/        # UIコンポーネント群
│   │   ├── calendar.ts    # カレンダー表示
│   │   └── version.ts     # バージョン表示
│   ├── styles/            # スタイルシート
│   │   └── main.css       # メインスタイル
│   └── main.ts            # アプリケーションエントリーポイント
└── public/                # 静的アセット
    └── favicon.ico        # ファビコン
```

### データ構造

#### types.ts
```typescript
/** 期間を表す型 */
interface Period {
  start: Date;
  end: Date;
}

/** リリース情報を表す型 */
interface ReleaseInfo {
  version: string;
  developmentPeriod: Period;
  qaPeriod: Period;
  releaseDate: Date;
}
```

#### lib/release.ts
```typescript
import { Period, ReleaseInfo } from "./types";

/** リリース情報を計算する */
export function calculateReleaseInfo(version: string, releaseDate: Date): ReleaseInfo {
  // ...
}
```

#### lib/date.ts
```typescript
/** 営業日を計算する */
export function isBusinessDay(date: Date): boolean {
  // ...
}

/** 指定された日数分の営業日を加算する */
export function addBusinessDays(date: Date, days: number): Date {
  // ...
}
```

## 開発フロー

1. 環境構築
   ```bash
   # 依存関係のインストール
   npm install

   # 開発サーバーの起動
   npm run dev
   ```


3. ビルド
   ```bash
   # プロダクションビルド
   npm run build
   ```

4. デプロイ
   - Cloudflare Pages にビルド成果物をデプロイ

## SeeAlso
- https://github.com/YuheiNakasaka/sprint-calendar
