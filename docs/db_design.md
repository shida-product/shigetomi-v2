# データ運用方針とDB設計（Supabase）

## データ運用方針

1. **既存データの移行**
   - v1のスプレッドシートデータは、v2システムの運用開始後に手作業で移行（または別管理）する。システム的な自動移行はスコープ外。
2. **同伴者の扱い**
   - **現状**: 宿泊者「全員」が個別にフォームを送信している。
   - **将来（要検討）**: 代表者が同行者全員分の情報を入力できる仕組みに変更する可能性がある。
   - **DB設計方針**: 現状の運用（1送信 = 1レコード）を基本としつつ、将来的に「予約ID」のような共通キーを持たせて同行者をグループ化できる拡張性を持たせる。
3. **予約情報との紐付け**
   - 1日1組限定の宿であるため、予約番号の入力はゲストの手間を省くため**不要**とする。
   - 管理者は提出された「氏名」と「到着日」でOTA（楽天/Booking.com等）の予約と目視で突合する運用を継続する。
4. **データの保持期限（自動削除）**
   - 旅館業法の規定に基づく「3年間」の保存を満たした後、**自動で削除**される仕組みを導入する（手動削除の手間を省く）。

---

## DB設計（Supabase PostgreSQL）

### 1. テーブル定義: `guests` (宿泊者情報を保存するメインテーブル)

| カラム名 | データ型 | NULL制約 | 備考 |
|---|---|---|---|
| `id` | uuid | NOT NULL | 主キー (PK), デフォルト: `uuid_generate_v4()` |
| `created_at` | timestamp with time zone | NOT NULL | 登録日時, デフォルト: `now()` |
| `language` | text | NOT NULL | 回答言語（例: 'ja', 'en', 'ko'） |
| `full_name` | text | NOT NULL | 宿泊者氏名 |
| `furigana` | text | NULL | ふりがな（日本語フォームのみ） |
| `birth_date` | date | NOT NULL | 生年月日 |
| `phone_number` | text | NOT NULL | 連絡先電話番号 |
| `has_domestic_address` | boolean | NOT NULL | 日本国内住所の有無 |
| `address` | text | NOT NULL | 住所 |
| `nationality` | text | NULL | 国籍（`has_domestic_address`が`false`の場合必須） |
| `passport_number` | text | NULL | パスポート番号（同上） |
| `passport_photo_url` | text | NULL | Storageに保存した画像への相対パス（同上） |
| `arrival_datetime` | timestamp with time zone | NOT NULL | 到着日時 |
| `departure_datetime` | timestamp with time zone | NOT NULL | 出発日時 |
| `agree_terms` | boolean | NOT NULL | 約款・利用規約への同意（`true`のみ登録可） |
| `visit_purposes` | text[] | NULL | 宿泊目的（アンケート、複数選択可の配列） |
| `group_id` | uuid | NULL | 将来拡張用: 同行者をグループ化するためのID |

※ セキュリティ: 行単位セキュリティ（Row Level Security: RLS）を有効化し、追加（INSERT）は匿名ユーザー（anon）に許可、閲覧（SELECT）・更新（UPDATE）・削除（DELETE）は認証済み管理者（authenticated）のみに制限する。

### 2. Storage バケット設計: `passport-photos`

- **公開設定**: プライベート（直接アクセス不可）
- **RLSポリシー**:
  - **INSERT**: 誰でもアップロード可能（ファイルサイズ・形式制限あり）
  - **SELECT**: 認証済み管理者のみ閲覧・ダウンロード可能
- **データの取り扱い**: ゲストへは「署名付きURL（有効期限つき）」を発行して一時的に閲覧させる。

### 3. 自動削除の仕組み (pg_cron)

Supabase拡張機能 `pg_cron` を利用し、データベース内で毎日特定の時間に以下の処理を自動実行する。

1. **ゲストデータの削除**:
   `guests`テーブルの`created_at`が現在から3年以上経過しているレコードを削除。
2. **パスポート写真の削除**:
   テーブルの削除に連動（または別途Edge Functionを通じた非同期削除）して、該当する`passport_photo_url`のファイルをStorageから削除する。

※ 実際のクエリ・設定手順は実装フェーズにて詳細化する。
