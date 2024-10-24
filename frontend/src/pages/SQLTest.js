import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';

const SQLTest = () => {
  const [questions, setQuestions] = useState([]);
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
    <Container className="mt-5">
      <h1 className="text-center">SQL Test</h1>
      {error && <Alert variant="danger">エラー: {error}</Alert>}
      <Form onSubmit={handleSubmit}>
        {questions.length > 0 ? (
          questions.map((category, index) => (
            category && category.questions ? (
              <Card key={category.name} className="mb-4">
                <Card.Body>
                  <Card.Title>{category.name}</Card.Title>
                  {category.questions.map((question) => (
                    <div key={question.id}>
                      <Card.Text>{question.question}</Card.Text>
                      <Form.Group controlId={`formSQL${question.id}`}>
                        <Form.Control
                          type="text"
                          placeholder="SQLクエリを入力してください"
                          value={answers[question.id] || ''}
                          onChange={(e) => handleChange(question.id, e.target.value)}
                        />
                      </Form.Group>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            ) : null
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

export default SQLTest;
