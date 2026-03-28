/**
 * Threads プロフィール生成ロジック (V3: Client-side AI Simulation)
 * 外部APIを使用せず、入力テキストを解析して高度なテンプレートと乱数で自然なプロフィールを生成する
 */

const MAX_CHARS = 150;

/**
 * ユーティリティ: 配列からランダムに1つ選ぶ
 */
function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * ユーティリティ: テキストを指定文字数で丸める
 */
function truncate(text, maxLen) {
  if (!text || text.length <= maxLen) return text;
  return text.substring(0, maxLen - 1) + '…';
}

/**
 * テキスト解析: 文末の調整や不要な改行の削除
 */
function cleanText(text) {
  if (!text) return '';
  // 連続する改行を1つにし、先頭・末尾の空白を削除
  return text.replace(/\n+/g, ' ').trim();
}

/**
 * 解析: 「思い」「活動」からキャッチーな肩書きを抽出
 * 長い文章が来ても冒頭だけ切り取るか、名詞っぽく終わらせる
 */
function extractTitle(passion) {
  const cleaned = cleanText(passion);
  // 最初の句読点までを取得
  let firstSentence = cleaned.split(/[。、！\n！?？]/)[0].trim();
  
  // 長すぎる場合は強制カット
  firstSentence = truncate(firstSentence, 25);
  
  // 表現の揺らぎ（ランダムな装飾）
  const prefixes = ['', '✨', '🔥', '🚀', '🌱'];
  const suffixes = ['の専門家', 'を発信', 'をサポート', 'のプロ', ''];
  
  return `${sample(prefixes)} ${firstSentence}${sample(suffixes)}`.trim();
}

/**
 * 解析: 発信内容から短いキーワードを複数抽出
 */
function extractKeywords(message) {
  const cleaned = cleanText(message);
  // 読点や空白で分割し、意味ありげな2〜3の単語に絞る
  const tokens = cleaned.split(/[、,\/\s。]+/).filter(k => k.length > 1 && k.length < 15);
  
  if (tokens.length === 0) return truncate(cleaned, 20);
  
  // 最大3つまで取得して「×」や「｜」で繋ぐ
  const selected = tokens.slice(0, Math.min(3, tokens.length));
  const separator = sample([' × ', ' ｜ ', '・']);
  return selected.join(separator);
}

/**
 * 解析: CTAをベネフィットに変換（ランダムな訴求を追加）
 */
function formatCTA(cta) {
  const cleaned = cleanText(cta);
  if (cleaned.includes('届く') || cleaned.includes('わかる') || cleaned.includes('学べる') || cleaned.includes('できる')) {
    return cleaned;
  }
  
  const formats = [
    `フォローで【${truncate(cleaned, 20)}】がわかる`,
    `👇 ${truncate(cleaned, 25)}`,
    `🉐 フォローして${truncate(cleaned, 15)}を手に入れる`,
    `💡 ${truncate(cleaned, 20)}を発信中！フォローしてね`
  ];
  return sample(formats);
}

/**
 * 解析: 実績のフォーマット（数字を際立たせるなど）
 */
function formatAchievement(achievement) {
  const cleaned = cleanText(achievement);
  const isNumberRich = /\d/.test(cleaned);
  
  if (isNumberRich) {
    const formats = [
      `📈 実績：${truncate(cleaned, 30)}`,
      `🏆 ${truncate(cleaned, 35)}`,
      `実績👉 ${truncate(cleaned, 30)}`
    ];
    return sample(formats);
  } else {
    return `✨ ${truncate(cleaned, 35)}`;
  }
}

/**
 * 解析: クライアント実績のフォーマット
 */
function formatClientResult(clientResult) {
  const cleaned = cleanText(clientResult);
  const formats = [
    `👥 クライアント：${truncate(cleaned, 30)}`,
    `🤝 サポート実績：${truncate(cleaned, 30)}`,
    `🌟 ${truncate(cleaned, 35)}`
  ];
  return sample(formats);
}

/**
 * 最終組み立てと文字数調整（150文字厳守）
 */
function buildAndTrimProfile(parts) {
  // 空の行を除外
  let validParts = parts.filter(p => p && p.trim().length > 0);
  let profile = validParts.join('\n');
  
  // 150文字を超えた場合の切り詰めロジック
  // 下から順（CTA直前の要素）を削って調整する
  while (profile.length > MAX_CHARS && validParts.length > 2) {
    // 最後から2番目の要素（通常は実績関係）を削除・または短縮
    const targetIndex = validParts.length - 2;
    validParts[targetIndex] = truncate(validParts[targetIndex], validParts[targetIndex].length - 10);
    
    // 短くなりすぎたら要素ごと消す
    if (validParts[targetIndex].length < 10) {
      validParts.splice(targetIndex, 1);
    }
    profile = validParts.join('\n');
  }
  
  // それでも超える場合は強制カット
  return truncate(profile, MAX_CHARS);
}


/* ==========================================
   パターン生成関数
   ========================================== */

/**
 * パターン1: 実績アピール型
 */
function generatePattern1(answers) {
  const title = extractTitle(answers.passion);
  const achievement = formatAchievement(answers.achievement);
  const clientResult = formatClientResult(answers.clientResult);
  const cta = formatCTA(answers.cta);
  
  const templates = [
    [title, achievement, clientResult, cta],
    [title, `【実績】\n${achievement}\n${clientResult}`, cta],
    [`🔥 ${title} 🔥`, achievement, clientResult, `\n👇 ${cta}`]
  ];
  
  return buildAndTrimProfile(sample(templates));
}

/**
 * パターン2: 共感・ストーリー型
 */
function generatePattern2(answers) {
  const passionShort = truncate(cleanText(answers.passion), 40);
  const messageKeywords = extractKeywords(answers.message);
  const cta = formatCTA(answers.cta);
  
  const formats = [
    "「", "『", "【"
  ];
  const qStarts = sample(formats);
  const qEnds = qStarts === "「" ? "」" : qStarts === "『" ? "』" : "】";
  
  const templates = [
    [`💭 ${passionShort}`, `📝 発信テーマ：\n${messageKeywords}`, cta],
    [`${qStarts}${passionShort}${qEnds}がモットーです🌱`, `日々の気づきや ${messageKeywords} について発信中。`, `\n🎁 ${cta}`],
    [`こんにちは！\n${passionShort}を目指して活動中✨`, `主に ${messageKeywords} をお届けします。`, cta]
  ];
  
  return buildAndTrimProfile(sample(templates));
}

/**
 * パターン3: バランス型
 */
function generatePattern3(answers) {
  const title = extractTitle(answers.passion);
  const keywords = extractKeywords(answers.message);
  const achievementOrClient = sample([
    formatAchievement(answers.achievement), 
    formatClientResult(answers.clientResult)
  ]);
  const cta = formatCTA(answers.cta);
  
  const templates = [
    [`${title}｜${keywords}`, achievementOrClient, `\n${cta}`],
    [`👤 ${title}`, `📌 発信：${keywords}`, achievementOrClient, cta],
    [`\n${title}\n`, achievementOrClient, `📚 ${keywords}のヒント`, `👇${cta}`]
  ];
  
  return buildAndTrimProfile(sample(templates));
}

/**
 * エントリーポイント
 */
export function generateProfiles(answers) {
  return [
    {
      label: '実績アピール型',
      emoji: '📊',
      description: '数字や実績を前面に出し、プロフィールを見た瞬間に信頼感を与える王道スタイル',
      profile: generatePattern1(answers),
    },
    {
      label: '共感・ストーリー型',
      emoji: '💭',
      description: 'あなたの想いや価値観を伝え、フォロワーとの距離を縮める親しみやすいスタイル',
      profile: generatePattern2(answers),
    },
    {
      label: 'バランス型',
      emoji: '⚖️',
      description: '誰に何を届けるか（発信軸）と実績を端的にまとめた、一番使いやすいスタイル',
      profile: generatePattern3(answers),
    },
  ];
}
