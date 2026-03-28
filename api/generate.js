import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
  }

  try {
    const { answers } = req.body;

    if (!answers || !answers.passion || !answers.message || !answers.achievement || !answers.clientResult || !answers.cta) {
      return res.status(400).json({ error: 'All 5 answers are required' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `あなたはSNSプロフィール作成の専門家です。以下のユーザー情報をもとに、Threadsのプロフィール文を3パターン作成してください。

## ユーザー情報
- 活動への思い: ${answers.passion}
- 発信で伝えたいこと: ${answers.message}
- 実績: ${answers.achievement}
- クライアント実績: ${answers.clientResult}
- CTA（届けたい価値）: ${answers.cta}

## 作成ルール（必ず守ること）
1. **肩書きはキャッチーで伝わりやすく**: 初見で「何をしている人か」がわかる短い肩書きを冒頭に置く
2. **150文字以内**: 各プロフィールは必ず150文字以内に収める（改行含む）
3. **初心者向けのキーワード**: 専門用語を避け、誰でもわかる言葉を使う
4. **無駄な情報は一切入れない**: コンパクトに要点だけ伝える
5. **CTAは「フォロワーのベネフィット」として書く**: 「フォローすると○○が得られる」という形にする
6. **絵文字を効果的に使う**: 各行の先頭に適切な絵文字を1つ付ける
7. **改行で見やすく区切る**: 1行が長くなりすぎないようにする

## 3パターンの方向性
- パターン1「実績アピール型」: 数字や実績を前面に出し、信頼感を重視
- パターン2「共感・ストーリー型」: 想いやストーリーで共感を呼ぶ
- パターン3「バランス型」: 実績・発信・CTAをバランスよくまとめる

## 出力形式（必ずこのJSON形式で出力）
\`\`\`json
[
  {
    "label": "実績アピール型",
    "emoji": "📊",
    "description": "このパターンの特徴を1行で説明",
    "profile": "実際のプロフィール文（改行は\\nで表現）"
  },
  {
    "label": "共感・ストーリー型",
    "emoji": "💭",
    "description": "このパターンの特徴を1行で説明",
    "profile": "実際のプロフィール文（改行は\\nで表現）"
  },
  {
    "label": "バランス型",
    "emoji": "⚖️",
    "description": "このパターンの特徴を1行で説明",
    "profile": "実際のプロフィール文（改行は\\nで表現）"
  }
]
\`\`\`

JSON配列のみを出力してください。マークダウンのコードブロック記法（\`\`\`json）は使わず、JSONそのものだけを返してください。`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    // Clean up response - remove markdown code blocks if present
    let cleanJson = responseText;
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
    }

    const profiles = JSON.parse(cleanJson);

    // Validate structure
    if (!Array.isArray(profiles) || profiles.length !== 3) {
      throw new Error('Invalid response structure');
    }

    // Ensure all profiles have required fields
    const validatedProfiles = profiles.map((p, i) => ({
      label: p.label || `パターン${i + 1}`,
      emoji: p.emoji || '✨',
      description: p.description || '',
      profile: (p.profile || '').replace(/\\n/g, '\n'),
    }));

    return res.status(200).json({ profiles: validatedProfiles });

  } catch (error) {
    console.error('Generation error:', error);
    return res.status(500).json({
      error: 'プロフィールの生成に失敗しました。もう一度お試しください。',
      details: error.message,
    });
  }
}
