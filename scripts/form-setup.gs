/**
 * Kagu Rig — 登録フォーム（Googleフォーム）を自動生成するスクリプト
 *
 * 使い方:
 *   1. https://script.google.com/ で新しいプロジェクトを作成
 *   2. エディタの中身を全選択・削除してからこのファイルを貼り付けて保存
 *   3. 実行ボタン横のドロップダウンが createKaguRigForm になっているか確認して実行
 *      （初回はGoogleの承認画面が出るので許可）
 *   4. 実行ログに出る公開URLを index.html の contact__btn に差し替える
 *
 * 構成: Q1で4分岐
 *   ① 情報だけ知りたい   … メールのみ
 *   ② 企業として協力     … 会社情報（謝礼なし・調査結果の共有でお返し）
 *   ③ 2〜3分のアンケート … 匿名・自由記述なし。学生版/社会人版に再分岐
 *   ④ 実際に使って感想を … 記名・スクリーニングあり。謝礼はサービスで返す
 *
 * 設問を変更するときの注意:
 *   - ③は匿名を保つ（氏名・メールを必須にしない）。自由記述は置かない（離脱要因）
 *   - ③学生版は過去アンケートと選択肢を揃えてある（比較可能性を壊さない）
 */

function createKaguRigForm() {
  const form = FormApp.create('Kagu Rig｜ご登録・ご協力のお願い');

  form.setDescription(
    'Kagu Rig（カグリグ）は、SNSで見つけた「憧れの部屋」を、\n' +
    'あなたの部屋で・予算内で再現するためのサービスです。現在開発中です。\n\n' +
    'ご協力いただける内容を選んでいただくと、必要な質問だけが表示されます。\n' +
    'いただいた情報は、Kagu Rigに関するご連絡とサービス改善のためだけに使用し、\n' +
    '第三者には提供しません。'
  );
  // 分岐フォームでは進捗バーが逆効果になる。
  // ①を選ぶと実質2ページで終わるのに「1/7ページ」と出て、
  // 7ページ分の質問が待っているように見え、冒頭で離脱する原因になる。
  form.setProgressBar(false);

  // ===== Q1（1ページ目・全員） =====
  // ※ 分岐の起点。選択肢は各セクションを作った後に設定する
  const gate = form.addMultipleChoiceItem();

  // ===== ① 情報だけ知りたい =====
  const secInfo = form.addPageBreakItem()
    .setTitle('リリース情報の受け取り')
    .setHelpText('サービスの準備が整いましたらご連絡します。');

  form.addTextItem()
    .setTitle('メールアドレス')
    .setRequired(true)
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().build());

  form.addTextItem()
    .setTitle('お名前（ニックネーム可）')
    .setHelpText('任意です。');

  // ===== ② 企業として協力 =====
  const secBiz = form.addPageBreakItem()
    .setTitle('企業のご担当者さまへ')
    .setHelpText(
      '30分ほど、お話を聞かせていただけませんか。\n\n' +
      '売り込みではありません。商品を若い世代にどう届けておられるか、\n' +
      'そこで何にお困りなのか——実際のところを教えていただきたいと\n' +
      '考えています。\n\n' +
      'こちらからは、学生100人に行った「理想の部屋」の意識調査や、\n' +
      '同世代がSNSをきっかけに部屋づくりを始める実態など、\n' +
      '私たちが見ているものをお話しします。\n\n' +
      '名古屋工業大学の学生3名で開発しています。\n' +
      '一度きりのお願いで終わらせず、長くご一緒できる関係を\n' +
      '築けたら嬉しく思います。'
    );

  form.addTextItem().setTitle('会社名・団体名').setRequired(true);
  form.addTextItem().setTitle('ご担当者さまのお名前').setRequired(true);
  form.addTextItem()
    .setTitle('メールアドレス')
    .setRequired(true)
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().build());

  form.addCheckboxItem()
    .setTitle('主に扱われている商材')
    .setChoiceValues([
      '家具（デスク・チェア・棚など）',
      'インテリア雑貨',
      '照明',
      '観葉植物・グリーン',
      'PC・周辺機器',
      'ガジェット'
    ])
    .showOtherOption(true);

  form.addMultipleChoiceItem()
    .setTitle('ご希望の形式')
    .setChoiceValues(['オンライン', '対面', 'まずはメールでのやりとり', '未定・相談したい']);

  form.addParagraphTextItem()
    .setTitle('ご質問・ご要望があればお書きください')
    .setHelpText('任意です。');

  // ===== ③ アンケート（属性で再分岐） =====
  const secSurvey = form.addPageBreakItem()
    .setTitle('アンケート')
    .setHelpText('2〜3分で終わります。お名前やメールアドレスは伺いません。');

  // このセクションの唯一の設問。選択に応じて学生版／社会人版へ飛ばす
  const attr = form.addMultipleChoiceItem();

  // --- ③-A 学生版（S1と比較可能な設問） ---
  const secStudent = form.addPageBreakItem()
    .setTitle('アンケート（学生の方）')
    .setHelpText('全8問です。');

  form.addMultipleChoiceItem()
    .setTitle('SNSなどで「こんな部屋・デスクにしたい」と憧れることがある')
    .setChoiceValues(['はい', '少しはい', '少しいいえ', 'いいえ'])
    .setRequired(true);

  // 「憧れる」は意向、「保存した」は過去の行動。後者の方が需要の裏取りとして強い
  form.addMultipleChoiceItem()
    .setTitle('SNSで「こんな部屋にしたい、憧れる」と思って、写真や動画を保存したことはありますか')
    .setChoiceValues(['よくある', 'たまにある', 'ほとんどない'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('自分の部屋やデスク環境をもっと良くしたいと思う')
    .setChoiceValues(['思う', 'まあまあ思う', '少し思う', '思わない'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('直近1年で、家具・インテリア・デスク周りに使った金額')
    .setChoiceValues(['0円', '〜1万円', '1〜5万円', '5〜15万円', '15万円〜'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('気に入ったデスク周り・インテリアの「単品」になら、いくらまで出せますか')
    .setChoiceValues(['〜3千円', '〜1万円', '1〜3万円', '3万円〜'])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('部屋を良くしたいのに、できていない理由（あてはまるものすべて）')
    .setChoiceValues([
      'お金がない',
      '時間がない',
      'どう変えればいいか思いつかない',
      '考えるのが面倒',
      '自分の部屋や好みに合うか分からない'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('どんな空間にしたいですか（あてはまるものすべて）')
    .setChoiceValues([
      'ナチュラル系',
      '高級感のある部屋',
      '（ダーク）ウッドの書斎',
      'デスクトップ環境重視',
      '白で統一',
      'ロック・インダストリアル',
      'クリエイター向け',
      'ゲーミング',
      '推し・オタク部屋'
    ])
    .showOtherOption(true);

  form.addMultipleChoiceItem()
    .setTitle('現在の住まい')
    .setChoiceValues(['一人暮らし', '実家', '寮・シェアハウス'])
    .showOtherOption(true)
    .setRequired(true);

  // --- ③-B 社会人版（既存ドラフト準拠） ---
  const secWorker = form.addPageBreakItem()
    .setTitle('アンケート（社会人の方）')
    .setHelpText('全9問です。');

  form.addMultipleChoiceItem()
    .setTitle('年代')
    .setChoiceValues(['20代前半', '20代後半', '30代', '40代以上'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('働き方')
    .setChoiceValues(['ほぼ在宅', 'ハイブリッド', 'ほぼ出社'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('SNSなどで「こんな部屋・デスクにしたい」と憧れることがある')
    .setChoiceValues(['はい', '少しはい', '少しいいえ', 'いいえ'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('SNSで「こんな部屋にしたい、憧れる」と思って、写真や動画を保存したことはありますか')
    .setChoiceValues(['よくある', 'たまにある', 'ほとんどない'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('自分の部屋やデスク環境をもっと良くしたいと思う')
    .setChoiceValues(['思う', 'まあまあ思う', '少し思う', '思わない'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('学生時代と比べて、部屋・デスク環境への関心は')
    .setChoiceValues(['増えた', '変わらない', '減った'])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('（「増えた」と答えた方へ）そのきっかけは')
    .setHelpText('あてはまるものすべて。それ以外の方は空欄で構いません。')
    .setChoiceValues([
      '在宅勤務・PC作業が増えた',
      '収入が増えた',
      '引っ越し・独立した',
      'SNSで見て'
    ])
    .showOtherOption(true);

  form.addMultipleChoiceItem()
    .setTitle('直近1年で、家具・インテリア・デスク周りに使った金額')
    .setChoiceValues(['0円', '〜1万円', '1〜5万円', '5〜15万円', '15万円〜'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('気に入ったデスク周り・インテリアの「単品」になら、いくらまで出せますか')
    .setChoiceValues(['〜3千円', '〜1万円', '1〜3万円', '3万円〜'])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('部屋を良くしたいのに、できていない理由（あてはまるものすべて）')
    .setChoiceValues([
      'お金がない',
      '時間がない',
      'どう変えればいいか思いつかない',
      '考えるのが面倒',
      '自分の部屋や好みに合うか分からない'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // ===== ④ 実際に使ってフィードバック =====
  const secTester = form.addPageBreakItem()
    .setTitle('サービスを試していただける方へ')
    .setHelpText(
      '開発中のものを数日お使いいただき、使ってみた感想や、\n' +
      '実際にどう行動したかを聞かせていただきます。\n\n' +
      'ご協力いただいた方には、リリース後の優先利用や特典など、\n' +
      'サービスの形でお返しさせてください。'
    );

  form.addTextItem()
    .setTitle('お名前（ニックネーム可）')
    .setRequired(true);

  form.addTextItem()
    .setTitle('メールアドレス')
    .setRequired(true)
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().build());

  form.addMultipleChoiceItem()
    .setTitle('現在の状況にいちばん近いもの')
    .setChoiceValues([
      '学生（一人暮らし）',
      '学生（実家）',
      '社会人（在宅ワークが多い）',
      '社会人（出社が多い）'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('直近1年で、部屋やデスク環境のために買ったもののうち、いちばん高かったものを教えてください')
    .setHelpText('金額もわかれば添えてください。例：ゲーミングチェア 3万円 ／ 特になし');

  form.addMultipleChoiceItem()
    .setTitle('SNSで「こんな部屋にしたい」と思って、写真や動画を保存したことはありますか')
    .setChoiceValues(['よくある', 'たまにある', 'ほとんどない'])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('ご協力いただけそうな時期')
    .setChoiceValues(['8月', '9月', '10月以降', 'いつでも'])
    .setRequired(true);

  form.addTextItem()
    .setTitle('連絡の取りやすい方法・時間帯があれば')
    .setHelpText('任意です。例：平日夜ならいつでも ／ XのDMが早いです');

  // ===== 分岐の設定 =====

  gate.setTitle('Kagu Rig とどのように関わっていただけますか？')
    .setHelpText('選んだ内容に応じた質問だけが表示されます。')
    .setChoices([
      gate.createChoice('リリース情報だけ受け取りたい', secInfo),
      gate.createChoice('企業として、ヒアリングに協力できる', secBiz),
      gate.createChoice('2〜3分のアンケートに答える（匿名）', secSurvey),
      gate.createChoice('開発中のサービスを実際に試して、感想を聞かせる', secTester)
    ])
    .setRequired(true);

  attr.setTitle('あなたの現在の状況を教えてください')
    .setChoices([
      attr.createChoice('学生', secStudent),
      attr.createChoice('社会人', secWorker)
    ])
    .setRequired(true);

  // 各セクションの終わりで送信（次のセクションに流れ込ませない）
  secInfo.setGoToPage(FormApp.PageNavigationType.SUBMIT);
  secBiz.setGoToPage(FormApp.PageNavigationType.SUBMIT);
  secStudent.setGoToPage(FormApp.PageNavigationType.SUBMIT);
  secWorker.setGoToPage(FormApp.PageNavigationType.SUBMIT);
  secTester.setGoToPage(FormApp.PageNavigationType.SUBMIT);

  form.setConfirmationMessage(
    'ご協力ありがとうございました。\n' +
    'ご連絡先をいただいた方には、追ってご連絡いたします。'
  );

  // 回答をスプレッドシートに自動連携
  const ss = SpreadsheetApp.create('Kagu Rig｜フォーム回答');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  Logger.log('■ 公開URL（LPに貼るのはこれ）:\n' + form.getPublishedUrl());
  Logger.log('■ 編集URL:\n' + form.getEditUrl());
  Logger.log('■ 回答スプレッドシート:\n' + ss.getUrl());
}

/**
 * 新規プロジェクトの初期状態では、実行対象が myFunction のまま残りやすい。
 * どちらが選ばれていても同じ結果になるよう、別名を用意しておく。
 * （※このファイルを貼り足した場合、後に書かれたこちらの定義が有効になる）
 */
function myFunction() {
  createKaguRigForm();
}
