# kagurig-lp

[Kagu Rig](https://github.com/kyogokk/Kagu-Rig)（部屋コーディネートの3Dシミュレーション・購買アプリ）の公式LP。
ブランド紹介・サービス概要・創業ストーリー・ヒアリング募集を1ページに載せる静的サイト。

**公開URL**: https://kyogokk.github.io/kagurig-lp/ （GitHub Pages / main ブランチ直配信）

フレームワーク・ビルドなしの素のHTML/CSS/JS。`main` に push すると数分で本番に反映される。

## 構成

| パス | 役割 |
|---|---|
| [index.html](./index.html) | トップページ（イントロ → ヒーロー → Philosophy → Service → Feature → For You → Story導線 → FAQ → News → Contact → About） |
| [story.html](./story.html) | 創業ストーリー |
| [news/](./news/) | お知らせの詳細記事（1記事=1HTML） |
| [css/style.css](./css/style.css) | 全スタイル。セクション単位のコメント見出しで区切り |
| [js/main.js](./js/main.js) | イントロ演出・ヒーロースライドショー・スクロール出現・News描画 |
| [js/news-data.js](./js/news-data.js) | お知らせデータ（配列）。**ニュース追加はここだけ編集** |
| [assets/img/](./assets/img/) | 画像。`hero-*`=スライドショー / `service-*`=Serviceの3ステップ / `feature-1`=小物モデル化 / `logo` |
| [scripts/form-setup.gs](./scripts/form-setup.gs) | 登録フォーム（Googleフォーム）を再生成するGoogle Apps Script |

## ローカル確認

```bash
python3 -m http.server 8000   # → http://localhost:8000/
```

`index.html` をダブルクリックでも動く（外部依存はGoogle Fontsのみ）。

## 運用

### お知らせを追加する

1. `js/news-data.js` の配列の**先頭**に1件追記（新しい順に並べる）
2. 詳細ページは既存記事（`news/*.html`）をコピーして本文を書き換える
3. push

日時表示は自動（24時間以内=N時間前 / 1週間以内=N日前 / それ以降=yyyy/mm/dd）。
外部メディア掲載は `url` に外部URL + `external: true` で別タブ表示。
カード見出しは2行以内（30字前後）に収める（日付の縦位置を揃えるため）。

### 画像を追加する

16:9推奨・最大1920px幅・JPEG品質80前後に圧縮してから `assets/img/` へ。macOSなら:

```bash
sips -Z 1920 -s format jpeg -s formatOptions 82 元画像 --out assets/img/xxx.jpg
```

ヒーロー写真の権利: Unsplash/Pexels素材と自社撮影のみ使用。SNS等から保存した第三者の写真は使わない。

### 登録フォーム

Contactセクションのボタンは Googleフォーム（kagurig.info@gmail.com のアカウントで管理）に接続。
質問構成を作り直す場合は [scripts/form-setup.gs](./scripts/form-setup.gs) を
[Google Apps Script](https://script.google.com/) に貼って実行し、出力された公開URLを
`index.html` の `contact__btn` に差し替える。編集URL・回答スプレッドシートは非公開管理。

## デザインの約束事

- 配色: モノトーン＋淡いセージグリーン（CSS冒頭の `:root` 変数のみ使用）
- 書体: 見出し=Noto Serif JP / 本文=Noto Sans JP / 英字=Cormorant Garamond
- ページ構造: ヒーローは `position: fixed`、後続セクションが上に被さって隠す設計
- 新セクションは既存の `.label` + `.section-title` + `.reveal`（スクロール出現）の型に合わせる
