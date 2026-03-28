import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import QuestionScreen from './components/QuestionScreen';
import ResultScreen from './components/ResultScreen';
import { questions } from './data/questions';
import { generateProfiles } from './utils/profileGenerator';

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

  const finishQuestions = (collectedAnswers) => {
    setAnswers(collectedAnswers);
    setIsLoading(true);
    setError(null);
    setCurrentScreen('result');

    // AIが考えている風の演出（1.5秒〜2.5秒のランダムディレイ）
    const delay = Math.floor(Math.random() * 1000) + 1500;

    setTimeout(() => {
      try {
        const generatedProfiles = generateProfiles(collectedAnswers);
        setProfiles(generatedProfiles);
      } catch (err) {
        console.error('Generation failed:', err);
        setError('プロフィールの生成に失敗しました。もう一度お試しください。');
      } finally {
        setIsLoading(false);
      }
    }, delay);
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
