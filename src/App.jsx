import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import QuestionScreen from './components/QuestionScreen';
import ResultScreen from './components/ResultScreen';
import { questions } from './data/questions';

function App() {
  const [currentScreen, setCurrentScreen] = useState('start');
  const [answers, setAnswers] = useState({});
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const startGenerator = () => {
    setAnswers({});
    setProfiles([]);
    setError(null);
    setCurrentScreen('question');
  };

  const finishQuestions = async (collectedAnswers) => {
    setAnswers(collectedAnswers);
    setIsLoading(true);
    setError(null);
    setCurrentScreen('result');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: collectedAnswers }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'サーバーエラーが発生しました');
      }

      const data = await response.json();
      setProfiles(data.profiles);
    } catch (err) {
      console.error('Generation failed:', err);
      setError(err.message || 'プロフィールの生成に失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  const restart = () => {
    setAnswers({});
    setProfiles([]);
    setError(null);
    setCurrentScreen('start');
  };

  const retry = () => {
    if (Object.keys(answers).length > 0) {
      finishQuestions(answers);
    }
  };

  return (
    <div className="app-container">
      {currentScreen === 'start' && <StartScreen onStart={startGenerator} />}
      {currentScreen === 'question' && (
        <QuestionScreen questions={questions} onFinish={finishQuestions} />
      )}
      {currentScreen === 'result' && (
        <ResultScreen
          profiles={profiles}
          isLoading={isLoading}
          error={error}
          onRestart={restart}
          onRetry={retry}
        />
      )}
    </div>
  );
}

export default App;
