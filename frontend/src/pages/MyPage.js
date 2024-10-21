import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

const MyPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ログインしたユーザーの情報を取得する
    const username = localStorage.getItem('username'); // ローカルストレージからユーザー名を取得
    if (username) {
      setUser({ username });  // 仮でユーザー名のみ設定
      // 必要に応じてサーバーから詳細情報を取得できるようにする
      // fetch('/api/user-info', { headers: { Authorization: `Bearer ${token}` } })
      //   .then(response => response.json())
      //   .then(data => setUser(data));
    }
  }, []);

  if (!user) {
    return <p>Loading...</p>; // ロード中の表示
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Card>
            <Card.Body>
              <Card.Title>マイページ</Card.Title>
              <Card.Text>ユーザー名: {user.username}</Card.Text>
              {/* 他のユーザー情報を表示する */}
              <Button variant="primary" onClick={() => alert('プロフィールを編集')}>プロフィール編集</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MyPage;