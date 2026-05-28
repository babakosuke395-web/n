/*
  ===================================
  script.js の役割
  ===================================
  このファイルが担うこと：
    1. 質問データと結果データを保持する
    2. 画面を切り替える（スタート → 質問 → 結果）
    3. 回答ボタンを生成する
    4. 回答に応じてスコアを計算する
    5. 最終的なタイプを判定して結果を表示する

  === 初心者向け補足 ===
  JavaScriptは「動き」を担当するファイル。
  HTML は「構造」、CSS は「見た目」、JS は「動作」を担う。
*/


/* ===================================
   1. 質問データ
   ===================================
   質問を追加・編集したいときは、このオブジェクトを変更してください。

   構造：
     questions = [
       {
         text: "質問文",
         options: [
           { text: "選択肢テキスト", scores: { タイプ名: 点数, ... } },
           ...
         ]
       },
       ...
     ]

   タイプ名は「月猫」「白狼」「雨狐」「深海犬」「朝鹿」の5種類。
*/
const questions = [
  {
    text: "急に距離を縮められると、少し疲れることがある。",
    options: [
      { text: "とてもある",  scores: { 月猫: 2, 白狼: 1 } },
      { text: "少しある",   scores: { 月猫: 1, 雨狐: 1 } },
      { text: "あまりない", scores: { 深海犬: 1 } },
      { text: "全くない",   scores: { 深海犬: 2 } }
    ]
  },
  {
    text: "仲良くなるほど、一人の時間が必要になる。",
    options: [
      { text: "とてもある",  scores: { 月猫: 2, 白狼: 2 } },
      { text: "少しある",   scores: { 月猫: 1 } },
      { text: "あまりない", scores: { 深海犬: 1 } },
      { text: "全くない",   scores: { 深海犬: 2 } }
    ]
  },
  {
    text: "嬉しいことがあると、誰かに共有したくなる。",
    options: [
      { text: "すぐ共有したくなる", scores: { 深海犬: 2 } },
      { text: "相手による",        scores: { 雨狐: 1 } },
      { text: "あまり共有しない",  scores: { 月猫: 1, 白狼: 1 } },
      { text: "一人で完結する",    scores: { 白狼: 2 } }
    ]
  },
  {
    text: "感情を言葉にする前に、飲み込むことが多い。",
    options: [
      { text: "とても多い",   scores: { 月猫: 2, 白狼: 1 } },
      { text: "少し多い",    scores: { 月猫: 1 } },
      { text: "あまりない",  scores: { 深海犬: 1 } },
      { text: "ほとんどない", scores: { 深海犬: 2 } }
    ]
  },
  {
    text: "予定がなくなった日に、少し安心することがある。",
    options: [
      { text: "とてもある",  scores: { 白狼: 2, 月猫: 1 } },
      { text: "少しある",   scores: { 月猫: 1 } },
      { text: "あまりない", scores: { 深海犬: 1 } },
      { text: "全くない",   scores: { 深海犬: 2 } }
    ]
  },
  {
    text: "一人でいる時間が長く続いても、そこまで苦じゃない。",
    options: [
      { text: "全く苦じゃない",  scores: { 白狼: 2 } },
      { text: "少し平気",       scores: { 月猫: 1 } },
      { text: "少し不安になる", scores: { 朝鹿: 1 } },
      { text: "かなり不安になる", scores: { 深海犬: 2 } }
    ]
  },
  {
    text: "空気が悪い場所にいると、必要以上に疲れる。",
    options: [
      { text: "とても疲れる",        scores: { 朝鹿: 2, 雨狐: 1 } },
      { text: "少し疲れる",         scores: { 雨狐: 1 } },
      { text: "あまり影響されない",  scores: { 白狼: 1 } },
      { text: "ほとんど影響されない", scores: { 白狼: 2 } }
    ]
  },
  {
    text: "相手の機嫌を、無意識に読んでしまう。",
    options: [
      { text: "常に読む",      scores: { 雨狐: 2, 朝鹿: 1 } },
      { text: "よく読む",     scores: { 雨狐: 1 } },
      { text: "あまり読まない", scores: { 白狼: 1 } },
      { text: "ほとんど気にしない", scores: { 白狼: 2 } }
    ]
  },
  {
    text: "広く付き合うより、少人数と深く関わる方が落ち着く。",
    options: [
      { text: "とてもそう",      scores: { 白狼: 2, 月猫: 1 } },
      { text: "少しそう",       scores: { 朝鹿: 1 } },
      { text: "どちらとも言えない", scores: { 雨狐: 1 } },
      { text: "広い関係の方が好き", scores: { 深海犬: 2 } }
    ]
  },
  {
    text: "「ちゃんと理解されたい」という気持ちが強い。",
    options: [
      { text: "とても強い",    scores: { 月猫: 2, 朝鹿: 1 } },
      { text: "少しある",     scores: { 雨狐: 1 } },
      { text: "あまりない",   scores: { 白狼: 1 } },
      { text: "ほとんどない", scores: { 白狼: 2 } }
    ]
  },
  {
    text: "自分では「近づきにくい人間」だと思う。",
    options: [
      { text: "とても思う",   scores: { 白狼: 2 } },
      { text: "少し思う",    scores: { 月猫: 1 } },
      { text: "あまり思わない", scores: { 深海犬: 1 } },
      { text: "全く思わない", scores: { 深海犬: 2 } }
    ]
  },
  {
    text: "周囲から、思ったより話しかけやすいと言われる。",
    options: [
      { text: "よく言われる",   scores: { 深海犬: 2 } },
      { text: "時々言われる",  scores: { 雨狐: 1 } },
      { text: "あまり言われない", scores: { 月猫: 1 } },
      { text: "全く言われない", scores: { 白狼: 2 } }
    ]
  }
];


/* ===================================
   2. 結果データ
   ===================================
   各タイプの説明テキストはここに書く。
   新しいタイプを追加したいときは、同じ形式でオブジェクトを追加する。
*/
const results = {
  月猫: {
    copy: "理解されたい。でも、簡単には近づけない。",
    description:
      "深く考え、深く感じる。内側に豊かな世界を持っているが、" +
      "それをそのまま言葉にすることが難しい。距離をとるのは、" +
      "怖いからではない。簡単に壊れてしまうものを、" +
      "慎重に守りたいだけだ。",
    others:
      "ミステリアスで、少しとっつきにくい印象を与える。" +
      "しかし一度打ち解けると、深い信頼を持てる人物として" +
      "記憶される。",
    gap:
      "自分では「普通に接している」つもりでも、" +
      "周囲には「どこか遠い人」と感じられていることが多い。" +
      "そのズレに本人は気づきにくい。"
  },

  白狼: {
    copy: "一人で立てる。でも、本当は深い繋がりを探している。",
    description:
      "一人の時間を好み、自分の足で立てる。孤独を恐れないが、" +
      "心の奥深くでは、誰かに「本当にわかってほしい」という" +
      "静かな渇望を抱えている。",
    others:
      "強く、自立した印象。頼りがいがあるが、" +
      "感情が表に出にくいため、少し冷たく映ることもある。",
    gap:
      "「一人が好き」と言い続けながら、本当は深い繋がりを" +
      "望んでいる。その矛盾に、本人が最後まで気づかないことがある。"
  },

  雨狐: {
    copy: "空気を読みすぎて、自分の感情が遅れてやってくる。",
    description:
      "周囲の感情や空気に敏感で、場を絶えず読みながら動く。" +
      "その繊細さは長所であると同時に、自分の本音に" +
      "気づくのを遅らせる原因にもなっている。",
    others:
      "気が利く、場の空気を読める人。" +
      "調整役として頼られやすく、いてくれると安心される存在。",
    gap:
      "外からは「いつも落ち着いている」と見られるが、" +
      "内側では処理しきれない感情が静かに積み重なっていることがある。"
  },

  深海犬: {
    copy: "人が好き。でも、傷つくこともちゃんと怖い。",
    description:
      "人と関わることに喜びを感じ、感情を素直に表せる。" +
      "しかし傷つくことへの恐れも確かに持っており、" +
      "その二つの間で揺れることがある。",
    others:
      "明るく親しみやすく、話しかけやすい雰囲気がある。" +
      "一緒にいると場が和む存在として見られやすい。",
    gap:
      "外からは「強い人」「大丈夫な人」に映ることがあるが、" +
      "内側では繊細な部分を隠しながら接していることが多い。"
  },

  朝鹿: {
    copy: "優しさで出来ている。でも、その優しさは簡単に削れる。",
    description:
      "他者への配慮が自然と体に染みついている。場を壊したくない、" +
      "誰かを傷つけたくない——そういう気持ちが先に動く。" +
      "自分より相手を優先することが多い。",
    others:
      "穏やかで、いつも気にかけてくれる存在。" +
      "頼みやすく、一緒にいると安心できると思われやすい。",
    gap:
      "「大丈夫」と言い続けているうちに、" +
      "本当に大丈夫ではない自分に気づかないことがある。" +
      "疲弊が表に出るのは、いつも少し遅い。"
  }
};


/* ===================================
   3. 状態管理（アプリの「今の状態」を保持する変数）
   ===================================
   この3つの変数で「今どこにいるか」「何点か」を管理する。
*/

// 今何問目か（0から始まる）
let currentIndex = 0;

// 各タイプのスコアを記録するオブジェクト
// 例： scores = { 月猫: 3, 白狼: 5, 雨狐: 2, 深海犬: 0, 朝鹿: 1 }
let scores = {
  月猫:  0,
  白狼:  0,
  雨狐:  0,
  深海犬: 0,
  朝鹿:  0
};


/* ===================================
   4. 画面切り替え関数
   ===================================
   引数に指定した id の画面を表示し、他を非表示にする。
   フェードインアニメーション付き。
*/
function showScreen(screenId) {
  // すべての .screen 要素から .active と .fade-in を外す
  document.querySelectorAll('.screen').forEach(function(screen) {
    screen.classList.remove('active', 'fade-in');
  });

  // 指定した画面に .active を付けて表示
  const targetScreen = document.getElementById(screenId);
  targetScreen.classList.add('active');

  // 少し遅らせて .fade-in を付けることで、フェードインが発動する
  // （同時に付けると CSS トランジションが効かないため）
  setTimeout(function() {
    targetScreen.classList.add('fade-in');
  }, 20);
}


/* ===================================
   5. 質問を表示する関数
   ===================================
   currentIndex 番目の質問を画面に描画する。
*/
function showQuestion() {
  const question = questions[currentIndex];

  // 進捗テキストを更新（例：「Q3 / 12」）
  document.getElementById('questionNumber').textContent =
    'Q' + (currentIndex + 1) + ' / ' + questions.length;

  // 質問文を更新
  document.getElementById('questionText').textContent = question.text;

  // 回答ボタンを生成する
  const optionsContainer = document.getElementById('answerOptions');
  optionsContainer.innerHTML = ''; // 前の質問のボタンを消す

  question.options.forEach(function(option, i) {
    // ボタン要素を作成
    const button = document.createElement('button');
    button.classList.add('answer-btn');
    button.textContent = option.text;

    // このボタンが押されたときの処理を設定
    button.addEventListener('click', function() {
      handleAnswer(option.scores);
    });

    // コンテナに追加
    optionsContainer.appendChild(button);

    // 少しずつ間隔をあけてボタンを表示（下から滑り込む演出）
    setTimeout(function() {
      button.classList.add('visible');
    }, 80 * i);
  });
}


/* ===================================
   6. 回答処理関数
   ===================================
   選ばれた選択肢のスコアを加算し、次の質問へ進む。

   引数 selectedScores は選ばれた選択肢の scores オブジェクト。
   例： { 月猫: 2, 白狼: 1 }
*/
function handleAnswer(selectedScores) {
  // スコアを加算する
  // Object.keys() でオブジェクトのキー（タイプ名）の配列を取得し、
  // forEach でそれぞれのタイプにスコアを加算する
  Object.keys(selectedScores).forEach(function(type) {
    scores[type] += selectedScores[type];
  });

  // 次の質問へ
  currentIndex++;

  if (currentIndex < questions.length) {
    // まだ質問が残っている → 次の質問を表示
    showQuestion();
  } else {
    // すべての質問が終わった → 結果を表示
    showResult();
  }
}


/* ===================================
   7. 結果を計算する関数
   ===================================
   スコアが最も高いタイプを返す。

   ロジック：
     scores オブジェクトを全部チェックして、
     最大値のタイプ名を見つける。
*/
function calculateWinner() {
  let maxScore = -1;
  let winner = null;

  Object.keys(scores).forEach(function(type) {
    if (scores[type] > maxScore) {
      maxScore = scores[type];
      winner = type;
    }
  });

  return winner;
}


/* ===================================
   8. 結果を表示する関数
   ===================================
   計算したタイプ名を使って、results オブジェクトから説明文を取得し、
   HTML に書き込む。
*/
function showResult() {
  const winnerType = calculateWinner();
  const resultData = results[winnerType];

  // 各要素に内容を書き込む
  document.getElementById('resultType').textContent        = winnerType;
  document.getElementById('resultCopy').textContent        = resultData.copy;
  document.getElementById('resultDescription').textContent = resultData.description;
  document.getElementById('resultOthers').textContent      = resultData.others;
  document.getElementById('resultGap').textContent         = resultData.gap;

  // 結果画面に切り替え
  showScreen('result');
}


/* ===================================
   9. リセット関数
   ===================================
   「もう一度やる」ボタンが押されたときに呼ばれる。
   状態をリセットしてスタート画面に戻る。
*/
function resetQuiz() {
  // インデックスとスコアを初期値に戻す
  currentIndex = 0;
  scores = {
    月猫:  0,
    白狼:  0,
    雨狐:  0,
    深海犬: 0,
    朝鹿:  0
  };

  // スタート画面に戻る
  showScreen('start');
}


/* ===================================
   10. イベントリスナーの設定
   ===================================
   ページが読み込まれた後に、ボタンのクリックを監視する。
   addEventListener('click', 関数) で「クリックされたら〇〇する」を設定できる。
*/

// 「はじめる」ボタン
document.getElementById('startBtn').addEventListener('click', function() {
  showScreen('quiz');  // 質問画面に切り替え
  showQuestion();      // 最初の質問を表示
});

// 「もう一度やる」ボタン
document.getElementById('retryBtn').addEventListener('click', function() {
  resetQuiz();
});


/* ===================================
   11. 初期表示
   ===================================
   ページを開いたとき、スタート画面をフェードインで表示する。
*/
showScreen('start');
