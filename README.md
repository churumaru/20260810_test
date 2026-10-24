# Courtly（仮）UIプロトタイプ

ウィンブルドンの品格 × 東京の社会人ライフスタイルのテニスコミュニティアプリ。モックデータで動作するUIのみ（認証・DB・決済なし）。

- `/` ホーム：プレー意欲登録ボタン、横スクロール日付カレンダー、選択日のプレー希望者、開催予定イベント、下部ナビ
- `/register` プレー希望登録：意欲（2択）、希望日・時間帯・地域（複数選択）、保存

登録内容はブラウザの localStorage に保存され、ホーム画面に反映されます。

## 起動

```bash
npm install
npm run dev          # http://localhost:3000
npm run dev:lan      # 同一Wi-Fiのスマホから http://<PCのIP>:3000 でアクセス
```

技術：Next.js 15 (App Router) / TypeScript / Tailwind CSS / Lucide Icons
