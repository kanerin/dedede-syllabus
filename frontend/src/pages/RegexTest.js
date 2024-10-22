import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';

const RegexTest = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newResults = {};
    let score = 0;
  
    // 採点処理
    questions.forEach((question) => {
      try {
        if (!answers[question.id]) {
          newResults[question.id] = { result: 'No input', userAnswer: '' }; // 回答がない場合
          return;
        }
  
        const re = new RegExp(answers[question.id]);
        const matches = question.string
          .split(' ')
          .filter(word => re.test(word));
  
        const isCorrect = JSON.stringify(matches) === JSON.stringify(question.expectedMatches);
        newResults[question.id] = {
          result: isCorrect ? 'OK' : 'NG',
          userAnswer: answers[question.id], // 回答内容を保存
        };
  
        if (isCorrect) score += 1; // 正解の場合スコアを加算
      } catch (error) {
        newResults[question.id] = { result: 'Invalid regex', userAnswer: answers[question.id] };
      }
    });
  
    // テスト結果をサーバーに送信
    try {
      const response = await fetch('http://localhost:8080/save-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: parseInt(localStorage.getItem('user_id')), // 数値に変換
          test_type: 'regex', // テスト種別
          score: score, // 計算されたスコア
          results: newResults, // 各問題の結果も送信
        }),
      });
  
      const result = await response.json();
      console.log(result.message); // 保存成功メッセージを表示
    } catch (error) {
      console.error('Failed to save test result:', error);
    }
  
    // 結果ページに遷移
    navigate('/results', { state: { results: newResults, questions } });
  };

  // ハイライトされた単語を表示する関数
  const highlightMatches = (text, regexString) => {
    let regex;
    try {
      if (!regexString) {
        return text.split(' ').map((word, index) => <span key={index}>{word} </span>);
      }
      regex = new RegExp(regexString);
    } catch (error) {
      return text.split(' ').map((word, index) => <span key={index}>{word} </span>);
    }

    const words = text.split(' ');
    return words.map((word, index) => {
      if (regex.test(word)) {
        return <span key={index} style={{ backgroundColor: 'yellow' }}>{word}</span>;
      }
      return <span key={index}>{word}</span>;
    }).reduce((prev, curr) => [prev, ' ', curr]);
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center">正規表現テスト</h1>
      {error && <Alert variant="danger">エラー: {error}</Alert>}
      <Form onSubmit={handleSubmit}>
        {questions.length > 0 ? (
          questions.map((question, index) => (
            <Card key={question.id} className="mb-4">
              <Card.Body>
                <Card.Title>問題 {index + 1}</Card.Title>
                <Card.Text>{question.question}</Card.Text>
                <p>{highlightMatches(question.string, answers[question.id] || '')}</p>
                <Form.Group controlId={`formRegex${question.id}`}>
                  <Form.Control
                    type="text"
                    placeholder="正規表現を入力してください"
                    value={answers[question.id] || ''}
                    onChange={(e) => handleChange(question.id, e.target.value)}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>Loading questions...</p>
        )}
        <Row className="mt-4">
          <Col className="text-center">
            <Button variant="primary" type="submit">結果を提出</Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default RegexTest;