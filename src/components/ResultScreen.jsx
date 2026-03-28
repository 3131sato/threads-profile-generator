import React, { useState } from 'react';

function ResultScreen({ profiles, isLoading, error, onRestart, onRetry }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const openThreads = () => {
    window.open('https://www.threads.net', '_blank');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="screen result-screen">
        <div className="card result-card">
          <div className="loading-area">
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
            <h2 className="loading-title">AIがプロフィールを作成中…</h2>
            <p className="loading-subtitle">あなたの回答を分析して、<br/>最適なプロフィールを3案生成しています</p>
            <div className="loading-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="screen result-screen">
        <div className="card result-card">
          <div className="error-area">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">生成に失敗しました</h2>
            <p className="error-message">{error}</p>
            <div className="error-actions">
              <button className="btn btn-primary" onClick={onRetry} id="retry-button">
                🔄 もう一度生成する
              </button>
              <button className="btn btn-outline" onClick={onRestart} id="restart-on-error-button">
                最初からやり直す
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No profiles yet
  if (!profiles || profiles.length === 0) {
    return null;
  }

  return (
    <div className="screen result-screen">
      <div className="card result-card">
        <div className="result-header-area">
          <div className="ai-badge">✨ AI Generated</div>
          <h2 className="title">プロフィール完成 🎉</h2>
          <p className="subtitle">あなた専用のプロフィール3案ができました！<br/>お気に入りをコピーしてThreadsに設定しましょう。</p>
        </div>

        <div className="profile-cards">
          {profiles.map((item, index) => (
            <div
              key={index}
              className={`profile-card slide-up`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="profile-card-header">
                <span className="profile-card-emoji">{item.emoji}</span>
                <div>
                  <h3 className="profile-card-title">案{index + 1}：{item.label}</h3>
                  <p className="profile-card-desc">{item.description}</p>
                </div>
              </div>

              <div className="profile-text-area">
                <pre className="profile-text">{item.profile}</pre>
                <div className="profile-meta">
                  <span className={`char-count ${item.profile.length > 150 ? 'over' : ''}`}>
                    {item.profile.length} / 150文字
                  </span>
                </div>
              </div>

              <button
                className={`btn btn-copy ${copiedIndex === index ? 'copied' : ''}`}
                onClick={() => handleCopy(item.profile, index)}
                id={`copy-button-${index}`}
              >
                {copiedIndex === index ? '✅ コピーしました！' : '📋 この案をコピー'}
              </button>
            </div>
          ))}
        </div>

        <div className="threads-cta">
          <button
            className="btn btn-threads btn-large glow-effect"
            onClick={openThreads}
            id="open-threads-button"
          >
            <svg className="threads-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.476C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.711-.159 1.1-.538 2.04-1.128 2.795-.843 1.08-2.058 1.757-3.611 2.012-1.197.196-2.344.058-3.319-.399-1.063-.499-1.761-1.319-2.02-2.374-.497-2.037.806-4.058 3.088-4.791.934-.3 1.98-.406 3.11-.317.577.046 1.14.13 1.685.249-.117-.693-.376-1.243-.79-1.641-.577-.554-1.453-.839-2.601-.847l-.042-.001c-.89 0-1.885.267-2.37.694l-1.378-1.525c.897-.81 2.282-1.288 3.748-1.288l.058.001c1.65.012 2.97.458 3.924 1.326.864.784 1.396 1.856 1.588 3.188.435.201.846.435 1.227.697 1.11.764 1.94 1.815 2.4 3.04.812 2.163.727 5.062-1.512 7.256-1.907 1.868-4.177 2.662-7.346 2.686zM7.87 14.065c.147.604.572 1.078 1.228 1.386.698.327 1.551.424 2.468.278 1.12-.184 2.002-.66 2.621-1.413.491-.597.82-1.378.95-2.327-.792-.228-1.637-.36-2.452-.413-.834-.044-1.603.018-2.289.186-1.541.474-2.688 1.367-2.526 2.303z"/>
            </svg>
            Threads を開いてプロフィールを設定
          </button>
        </div>

        <button className="btn btn-outline" onClick={onRestart} id="restart-button">
          🔄 もう一度作成する
        </button>
      </div>
    </div>
  );
}

export default ResultScreen;
