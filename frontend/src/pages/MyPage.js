// MyPage.js
import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Row, Col, Alert } from 'react-bootstrap';
import TestResults from '../components/TestResults'; // テスト結果表示コンポーネントをインポート
import TestList from '../components/TestList'; // テスト一覧表示コンポーネントをインポート
import ExamApplications from '../components/ExamApplications'; // 受験申請表示コンポーネントをインポート

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('user_id');

    if (username && userId) {
      setUser({ username });
    } else {
      setError('ユーザー情報が見つかりません。');
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

              <TestList /> {/* テスト一覧を表示 */}
              <ExamApplications userId={localStorage.getItem('user_id')} /> {/* 受験申請を表示 */}
              <TestResults userId={localStorage.getItem('user_id')} /> {/* ユーザーIDを渡す */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="text-center">
          <Button variant="primary" onClick={() => alert('プロフィールを編集')}>
            プロフィール編集
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default MyPage;