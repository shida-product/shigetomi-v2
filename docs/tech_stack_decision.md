# 技術スタック決定記録

## 決定事項（2026-03-12）

**GitHub Pages + Supabase を採用**

| レイヤー | 技術 |
|---|---|
| フロントエンド | GitHub Pages（静的 HTML / JS / CSS） |
| バックエンド / DB | Supabase（PostgreSQL） |
| ファイルストレージ | Supabase Storage（Private Bucket） |
| サーバー処理 | Supabase Edge Functions |
| 通知 | Slack Webhook |

## 選定理由

- Supabaseは他プロジェクトで使用経験あり
- フロントエンドはv1と同じ静的配信 → 移行スムーズ
- 無料枠で完全に収まる（1日1組のトラフィック）
- 将来の管理画面追加にも対応しやすい（PostgreSQL）
- Google Sheetsへの依存は解消

## セキュリティ方針（パスポート写真）

| 対策 | 内容 |
|---|---|
| アップロード | Edge Function経由（バリデーション + レート制限） |
| 保存先 | Private Bucket（URL直接アクセス不可） |
| 閲覧 | 署名付きURL（有効期限付き、例: 1時間） |
| ファイル名 | UUID化（推測不可） |
| 検証 | Content-Type + マジックバイト + サイズ制限（5MB以下） |
| 画像リサイズ | フロント側で500KB以下に自動圧縮 |

管理者の確認方法: Slack通知に署名付きURLを含める（v1と同じ運用感）

## コスト

すべて無料枠内で運用可能。Storage容量（1GB）はリサイズ対応で3年保存も収まる。

## 比較検討した他の案

| 案 | 構成 | 不採用理由 |
|---|---|---|
| A | GitHub Pages + GAS | GASの制約（デバッグ困難、ファイルアップロード遅い） |
| C | Cloudflare Pages + Workers | 学習コストが案Bより大きい |
| D | Vercel + Next.js | オーバーエンジニアリング |
