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

  const startGenerator = () => {
    setAnswers({});
    setProfiles([]);
    setCurrentScreen('question');
  };

  const finishQuestions = (collectedAnswers) => {
    setAnswers(collectedAnswers);
    const generated = generateProfiles(collectedAnswers);
    setProfiles(generated);
    setCurrentScreen('result');
  };

  const restart = () => {
    setAnswers({});
    setProfiles([]);
    setCurrentScreen('start');
  };

  return (
    <div className="app-container">
      {currentScreen === 'start' && <StartScreen onStart={startGenerator} />}
      {currentScreen === 'question' && (
        <QuestionScreen questions={questions} onFinish={finishQuestions} />
      )}
      {currentScreen === 'result' && (
        <ResultScreen profiles={profiles} onRestart={restart} />
      )}
    </div>
  );
}

export default App;
