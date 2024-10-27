import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert, Card, Table } from 'react-bootstrap';

const SQLTest = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Itemsテーブルのデータ
  const itemsData = [
    { id: 1, name: 'Apple', price: 150 },
    { id: 2, name: 'Orange', price: 100 },
    { id: 3, name: 'Water_Melon', price: 300 },
    { id: 4, name: 'Lemon', price: 100 },
    { id: 5, name: 'Grape', price: 250 },
  ];

  // Ordersテーブルのデータ
  const ordersData = [
    { id: 1, item_id: 2, amount: 10 },
    { id: 2, item_id: 1, amount: 5 },
    { id: 3, item_id: 5, amount: 40 },
    { id: 4, item_id: 3, amount: 20 },
    { id: 5, item_id: 3, amount: 10 },
    { id: 6, item_id: 2, amount: 2 },
    { id: 7, item_id: 5, amount: 4 },
    { id: 8, item_id: 2, amount: 8 },
  ];

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

  // クエリ入力値の変更を更新する関数
  const handleChange = (id, value) => {
    setAnswers({ ...answers, [id]: value });
  };

  // クエリ送信時の処理
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedPayload = { answers };
    console.log("Submitting Payload:", JSON.stringify(formattedPayload));

    try {
      const response = await fetch('http://localhost:8080/api/submit-sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
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

      {/* items テーブルの表示 */}
      <h3>items Table</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {itemsData.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.price}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* orders テーブルの表示 */}
      <h3>orders Table</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Item ID</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {ordersData.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.item_id}</td>
              <td>{order.amount}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* SQLテストの問題入力 */}
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
