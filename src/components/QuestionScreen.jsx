import React, { useState } from 'react';
import ProgressBar from './ProgressBar';

function QuestionScreen({ questions, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const question = questions[currentIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const canProceed = currentAnswer.trim().length > 0;

  const handleNext = () => {
    if (!canProceed) return;

    const updatedAnswers = { ...answers, [question.id]: currentAnswer.trim() };
    setAnswers(updatedAnswers);

    if (isLastQuestion) {
      onFinish(updatedAnswers);
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setCurrentAnswer('');
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        const prevQuestion = questions[currentIndex - 1];
        setCurrentIndex(currentIndex - 1);
        setCurrentAnswer(answers[prevQuestion.id] || '');
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey && canProceed) {
      handleNext();
    }
  };

  return (
    <div className="screen question-screen">
      <div className={`card ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
        <ProgressBar current={currentIndex + 1} total={totalQuestions} />

        <div className="question-label">
          <span className="question-label-badge">Q{currentIndex + 1}</span>
          <span className="question-label-text">{question.label}</span>
        </div>

        <h2 className="question-text">{question.question}</h2>

        <div className="input-area">
          <textarea
            className="text-input"
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={question.placeholder}
            rows={4}
            autoFocus
            id={`question-input-${question.id}`}
          />
          <p className="help-text">💡 {question.helpText}</p>
        </div>

        <div className="button-group">
          {currentIndex > 0 && (
            <button
              className="btn btn-outline btn-back"
              onClick={handleBack}
              id="back-button"
            >
              ← 前へ
            </button>
          )}
          <button
            className={`btn btn-primary ${canProceed ? 'glow-effect' : ''}`}
            onClick={handleNext}
            disabled={!canProceed}
            id="next-button"
          >
            {isLastQuestion ? 'プロフィールを生成する 🚀' : '次の質問へ →'}
          </button>
        </div>

        <p className="input-hint">Ctrl + Enter でも進めます</p>
      </div>
    </div>
  );
}

export default QuestionScreen;
