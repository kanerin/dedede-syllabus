import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Row, Col, ListGroup, Alert } from 'react-bootstrap';

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('user_id');
    console.log("User ID:", userId);

    if (username && userId) {
      setUser({ username });

      // Fetch test results
      fetch(`http://localhost:8080/mypage/${userId}/results`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch test results');
          }
          return response.json();
        })
        .then((data) => {
          console.log(data.test_results); // ここでテスト結果を確認
          setTestResults(data.test_results);
        })
        .catch((err) => setError(err.message));
    }
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Card>
            <Card.Body>
              <Card.Title>マイページ</Card.Title>
              <Card.Text>ユーザー名: {user.username}</Card.Text>
              {error && <Alert variant="danger">{error}</Alert>}

              <h5>テスト結果</h5>
              {testResults.length > 0 ? (
                <ListGroup>
                  {testResults.map((result) => (
                    <ListGroup.Item key={result.ID}>
                      テスト名: {result.test_name} | スコア: {result.score}/10
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p>テスト結果がありません。</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-3"> {/* ここでマージンを追加 */}
        <Col className="text-center"> {/* 中央揃え */}
          <Button variant="primary" onClick={() => alert('プロフィールを編集')}>
            プロフィール編集
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default MyPage;