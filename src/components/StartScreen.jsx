import React from 'react';

function StartScreen({ onStart }) {
  return (
    <div className="screen start-screen">
      <div className="card">
        <div className="logo-area">
          <div className="logo-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-6h-2v6zm0-8h2V7h-2v2z" fill="currentColor" opacity="0.2"/>
              <path d="M7.5 4.5C9 3.5 10.5 3 12 3c4.97 0 9 4.03 9 9 0 1.5-.5 3-1.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16.5 19.5C15 20.5 13.5 21 12 21c-4.97 0-9-4.03-9-9 0-1.5.5-3 1.5-4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
            </svg>
          </div>
          <h1 className="title">Threads プロフィール<br/>ジェネレーター</h1>
        </div>

        <p className="subtitle">5つの質問に答えるだけで<br/>魅力的なプロフィールを3案作成</p>

        <div className="description">
          <p className="description-lead">こんなお悩みありませんか？</p>
          <ul className="feature-list">
            <li>🤔 プロフィールの書き方がわからない</li>
            <li>📝 何を書けばいいか迷っている</li>
            <li>⏰ プロフィール作成に時間がかかる</li>
          </ul>
        </div>

        <div className="how-it-works">
          <p className="how-it-works-title">使い方はカンタン3ステップ</p>
          <div className="steps">
            <div className="step">
              <span className="step-number">1</span>
              <span className="step-text">5つの質問に回答</span>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <span className="step-number">2</span>
              <span className="step-text">プロフィール3案を生成</span>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <span className="step-number">3</span>
              <span className="step-text">Threadsに設定</span>
            </div>
          </div>
        </div>

        <button className="btn btn-primary btn-large glow-effect" onClick={onStart} id="start-button">
          プロフィールを作成する ✨
        </button>

        <p className="note">※ 入力内容は外部送信されません。ブラウザ内で完結します。</p>
      </div>
    </div>
  );
}

export default StartScreen;
