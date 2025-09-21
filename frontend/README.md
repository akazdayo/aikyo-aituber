# AIVTuber Frontend

aikyo をバックエンドにした AIVTuber 配信画面のフロントエンドです。複数の VRM キャラクターを同時に表示し、Firehose (WebSocket) から流れてくる会話ログをライブチャット形式で描画します。

## セットアップ

```bash
# ルートで依存関係をインストール (workspace 経由で frontend も同時に解決されます)
pnpm install

# または frontend ディレクトリで個別にインストール
pnpm install --filter aituber-frontend
```

必要な VRM ファイルを `frontend/public/avatars/` に配置してください。

- `companion_kyoko` 用: `frontend/public/avatars/kyoko.vrm`
- `companion_aya` 用: `frontend/public/avatars/aya.vrm`

ファイル名やキャラクター設定は `frontend/src/config/characters.ts` で調整できます。

## Tailwind CSS v4 / shadcn UI

- Tailwind CSS v4 (CLI-less) を Vite に統合しています。`src/styles/global.css` の先頭で `@import "tailwindcss";` を行い、PostCSS は `@tailwindcss/postcss` プラグインを利用します。
- `components.json` に設定されたエイリアス (`@/components/ui` など) を用いて shadcn/ui コンポーネントを管理します。
- 追加コンポーネントは次のコマンドで取得できます。

```bash
npx shadcn@latest add <component>
```

- 例: `npx shadcn@latest add dialog input select`。
- コントロールパネル UI では `Card`/`Button`/`Switch` などを利用しており、Tailwind ユーティリティと shadcn の組み合わせ例になっています。

## 主要 UI の構成

- `src/components/Stage.tsx`: VRM ステージ本体。`controlPanel` プロップに渡した shadcn UI カードをステージ右上へフロート表示します。
- `src/components/ControlPanel.tsx`: Tailwind + shadcn で構築したコントロールパネル。キャラクターの表示切り替えや接続状態インジケータを提供します。
- `src/hooks/useFirehose.ts`: Firehose からのストリーム購読とキャラクター状態管理。可視キャラクター切り替えに対応。

## 開発サーバー

```bash
# Firehose (ws://localhost:8080) を起動した状態で
pnpm --filter aituber-frontend dev
```

環境変数で Firehose のエンドポイントを変更したい場合は、`.env` もしくは `.env.local` に以下を設定してください。

```
VITE_FIREHOSE_URL=ws://localhost:8080
```

## ビルド

```bash
pnpm --filter aituber-frontend build
pnpm --filter aituber-frontend preview
```

## 主なファイル

- `src/hooks/useFirehose.ts`: Firehose からのメッセージ購読とキャラクター状態管理
- `src/components/Stage.tsx`: VRM 表示とステージ演出
- `src/components/ChatOverlay.tsx`: 会話ログの描画 (Tailwind フィルタリング対応)
- `src/config/characters.ts`: 表示するキャラクターの設定
