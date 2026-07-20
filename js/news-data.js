// Kagu Rig — お知らせデータ
//
// ニュースを追加するときは、この配列の【先頭】に1件足して git push するだけ。
// （表示順はこの配列の順のまま。新しいものを先頭に置く）
//
//   date  : 公開日時。 'YYYY-MM-DDTHH:MM' 形式（時刻は「N時間前」表示の基準になる）
//   title : 見出し
//   image : サムネイル画像のパス（assets/img/ に置く。16:9推奨）
//   url   : クリックで開く詳細ページ。外部リンク（メディア掲載など）でもOK。
//           外部リンクの場合は external: true を付けると別タブで開く
//
window.NEWS_ITEMS = [
  {
    date: '2026-07-19T22:00',
    title: '公式サイトを公開しました',
    image: 'assets/img/hero-2.jpg',
    url: 'news/2026-07-19-site-launch.html'
  },
  {
    date: '2026-05-30T17:00',
    title: 'Tongariビジネスプランコンテスト 準決勝に登壇しました',
    image: 'assets/img/logo.png',
    url: 'news/2026-05-30-tongari-semifinal.html'
  }
];
