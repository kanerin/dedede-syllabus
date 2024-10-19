import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ページ遷移用

const RegexTest = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // ページ遷移用のフック

  useEffect(() => {
    fetch('http://localhost:8080/api/regex-tests')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setQuestions(data.questions))
      .catch(err => {
        console.error('Fetch error:', err);
        setError(err.message);
      });
  }, []);

  const handleChange = (id, value) => {
    setAnswers({ ...answers, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newResults = {};

    questions.forEach((question) => {
      try {
        if (!answers[question.id]) {
          newResults[question.id] = 'No input'; // 正規表現が空の場合の処理
          return;
        }

        const re = new RegExp(answers[question.id]);
        const matches = question.string
          .split(' ')
          .filter(word => re.test(word));  // 各単語に正規表現を適用してマッチした単語を取得

        const isCorrect = JSON.stringify(matches) === JSON.stringify(question.expectedMatches);
        newResults[question.id] = isCorrect ? 'OK' : 'NG';
      } catch (error) {
        newResults[question.id] = 'Invalid regex'; // 正規表現エラーを捕捉
      }
    });

    navigate('/results', { state: { results: newResults } }); // 結果ページに遷移し、結果を渡す
  };

  // ハイライトされた単語を表示
  const highlightMatches = (text, regexString) => {
    let regex;
    try {
      if (!regexString) {
        return text.split(' ').map((word, index) => <span key={index}>{word} </span>); // 入力がない場合はハイライトしない
      }

      regex = new RegExp(regexString);
    } catch (error) {
      return text.split(' ').map((word, index) => <span key={index}>{word} </span>); // 無効な正規表現の場合はハイライトしない
    }

    const words = text.split(' ');
    return words.map((word, index) => {
      if (regex.test(word)) {
        return <span key={index} style={{ backgroundColor: 'yellow' }}>{word}</span>; // マッチした単語をハイライト
      }
      return <span key={index}>{word}</span>;
    }).reduce((prev, curr) => [prev, ' ', curr]); // 単語間のスペースを再追加
  };

  return (
    <div>
      <h1>Regex Test</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <form onSubmit={handleSubmit}>
        {questions.length > 0 ? (
          questions.map((question) => (
            <div key={question.id}>
              <h3>{question.question}</h3>
              <p>
                {/* 正規表現に基づいてマッチした部分をハイライト */}
                {highlightMatches(question.string, answers[question.id] || '')}
              </p>
              <input
                type="text"
                placeholder="正規表現を入力してください"
                value={answers[question.id] || ''}
                onChange={(e) => handleChange(question.id, e.target.value)}
              />
            </div>
          ))
        ) : (
          <p>Loading questions...</p>
        )}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default RegexTest;