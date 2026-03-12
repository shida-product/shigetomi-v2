# v1 現状分析

> v2計画の土台として、現行システムの構成・各ファイルの役割・課題を整理。

## 全体アーキテクチャ（v1）

```
ゲスト → QRコード → GitHub Pages (index.html) → Google Forms × 6言語
                                                      ↓ onFormSubmit
                                                   GAS (20260312.js)
                                                      ↓
                                              Google Sheets（統合シート）+ Slack通知
```

## ファイル構成

```
Shigetomi/（v1）
├── .git/
├── index.html    ← 言語選択ページ（GitHub Pages公開、TailwindCSS CDN）
└── 20260312.js   ← GASスクリプト（549行）
```

## GASスクリプト構成（20260312.js）

| ブロック | 内容 |
|---|---|
| ① `MASTER_SETTINGS` | 統合シート定義（17列ヘッダー） |
| ② `FORM_MAPPERS` | 6言語マッピング関数（列構造の差分吸収） |
| ③ `setupMasterSheet()` | 統合シート初期セットアップ |
| ④ Slack通知 | `SLACK_CONFIG` + `postCheckinToSlack()`（Block Kit形式） |
| ⑤ `onFormSubmit()` | メイン: マッピング → 書込み → 通知 |
| 補助 `formatDateTimeJa()` | 日付フォーマット |

## 統合シート（17列）

タイムスタンプ / 言語 / 氏名 / ふりがな / 生年月日(年・月・日) / 電話番号 / 住所有無 / 住所 / 国籍 / 旅券番号 / 旅券写しURL / 到着日時 / 出発日時 / 約款同意 / 元シート名

## v1 の課題

- 🔴 パスポート写真アップロードにGoogleログイン必須
- 🔴 Googleフォームの多言語UIが不完全
- 🔴 言語選択ページとフォームのデザイン不統一
- 🟡 GASスクリプト名が日付（20260312.js）でわかりにくい
- 🟡 5言語のマッパーが同一構造で冗長
- 🟡 バリデーション・エラーハンドリング不足
