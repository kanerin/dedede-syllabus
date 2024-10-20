import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SQLTest = () => {
  const [questions, setQuestions] = useState([]);  // 初期値を空配列に変更
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // SQLの問題をバックエンドから取得
    fetch('http://localhost:8080/api/sql-tests')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        // selected_categories内のNameとQuestionsのキー名を小文字に変換
        const formattedData = data.selected_categories.map(category => ({
          name: category.Name,
          questions: category.Questions,
        }));
        setQuestions(formattedData);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError(err.message);
      });
  }, []);

  const handleChange = (id, value) => {
    setAnswers({ ...answers, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // SQLクエリをバックエンドに送信
      const response = await fetch('http://localhost:8080/api/submit-sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.results);

      // 結果ページに遷移（または現在のページで結果を表示）
      navigate('/results', { state: { results: data.results } });
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>SQL Test</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <form onSubmit={handleSubmit}>
        {questions.length > 0 ? (
          questions.map((category) => (
            category && category.questions ? (  // category と category.questions が存在するかをチェック
              <div key={category.name}>
                <h2>{category.name}</h2>
                {category.questions.map((question) => (
                  <div key={question.id}>
                    <h3>{question.question}</h3>
                    <input
                      type="text"
                      placeholder="SQLクエリを入力してください"
                      value={answers[question.id] || ''}
                      onChange={(e) => handleChange(question.id, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            ) : null  // category または questions が存在しない場合は何も表示しない
          ))
        ) : (
          <p>Loading questions...</p>
        )}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SQLTest;
