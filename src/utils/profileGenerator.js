/**
 * Threads プロフィール生成ロジック
 * 5つの回答から3パターンのプロフィール文（150文字以内）を生成
 */

const MAX_CHARS = 150;

/**
 * テキストを短く切り詰めるユーティリティ
 */
function truncate(text, maxLen) {
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen - 1) + '…';
}

/**
 * 入力テキストから短い肩書き風フレーズを抽出
 */
function extractTitle(passion) {
  // 最初の句読点・改行までを取得し、短い肩書きにする
  const firstSentence = passion.split(/[。、！\n]/)[0].trim();
  return truncate(firstSentence, 30);
}

/**
 * CTAを「フォロワーのベネフィット」形式に変換
 */
function formatCTA(cta) {
  const cleaned = cta.trim();
  // 既にベネフィット形式なら維持
  if (cleaned.includes('届く') || cleaned.includes('わかる') || cleaned.includes('学べる') || cleaned.includes('できる') || cleaned.includes('もらえる')) {
    return cleaned;
  }
  // 変換: フォローすると得られるメリットとして書き換え
  return `フォローすると→${cleaned}`;
}

/**
 * 発信内容からキーワードを短く抽出
 */
function extractKeywords(message) {
  // 読点・スラッシュ・空白区切りの最初の2-3キーワードを取得
  const keywords = message.split(/[、,\/\s]+/).filter(k => k.length > 0).slice(0, 3);
  return keywords.join('｜');
}

/**
 * パターンA: 実績重視型
 * 構成: 肩書き + 実績 + CTA
 */
function generatePatternA(answers) {
  const title = extractTitle(answers.passion);
  const achievement = truncate(answers.achievement.trim(), 50);
  const cta = formatCTA(answers.cta);

  const parts = [
    title,
    `📊 ${achievement}`,
    `✨ ${cta}`,
  ];

  const profile = parts.join('\n');
  return truncate(profile, MAX_CHARS);
}

/**
 * パターンB: 共感型
 * 構成: 思い + 発信内容 + CTA
 */
function generatePatternB(answers) {
  const passion = truncate(answers.passion.trim(), 50);
  const keywords = extractKeywords(answers.message);
  const cta = formatCTA(answers.cta);

  const parts = [
    `💭 ${passion}`,
    `📝 発信テーマ：${keywords}`,
    `🎁 ${cta}`,
  ];

  const profile = parts.join('\n');
  return truncate(profile, MAX_CHARS);
}

/**
 * パターンC: バランス型
 * 構成: 肩書き + 発信内容 + クライアント実績 + CTA
 */
function generatePatternC(answers) {
  const title = extractTitle(answers.passion);
  const keywords = extractKeywords(answers.message);
  const clientResult = truncate(answers.clientResult.trim(), 35);
  const cta = formatCTA(answers.cta);

  const parts = [
    title,
    `📝 ${keywords}を発信中`,
    `🏆 ${clientResult}`,
    `👇 ${cta}`,
  ];

  const profile = parts.join('\n');
  return truncate(profile, MAX_CHARS);
}

/**
 * メインの生成関数
 * @param {Object} answers - { passion, message, achievement, clientResult, cta }
 * @returns {Array<{label: string, profile: string}>}
 */
export function generateProfiles(answers) {
  return [
    {
      label: '実績アピール型',
      emoji: '📊',
      description: '実績を前面に出し、信頼感を強調したプロフィール',
      profile: generatePatternA(answers),
    },
    {
      label: '共感・ストーリー型',
      emoji: '💭',
      description: 'あなたの想いや発信テーマで共感を呼ぶプロフィール',
      profile: generatePatternB(answers),
    },
    {
      label: 'バランス型',
      emoji: '⚖️',
      description: '実績・発信・CTAをバランスよくまとめたプロフィール',
      profile: generatePatternC(answers),
    },
  ];
}
