import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const ApplyTest = () => {
  const { testId } = useParams(); // URLパラメータからテストIDを取得
  const [test, setTest] = useState(null); // テスト情報の状態
  const [startDateTime, setStartDateTime] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // テスト情報を取得
    fetch(`http://localhost:8080/api/tests/${testId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('テスト情報の取得に失敗しました');
        }
        return response.json();
      })
      .then(data => {
        setTest(data.test); // テスト情報を状態に保存
      })
      .catch(err => {
        setError(err.message);
      });
  }, [testId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 受験日時が入力されているかチェック
    if (!startDateTime) {
        setError('受験日時を入力してください。');
        return;
    }

    // 受験日時が現在より前かどうかをチェック
    const selectedDate = new Date(startDateTime);
    const currentDate = new Date();
    if (selectedDate < currentDate) {
        setError('受験開始日時は現在より後の日時を選択してください。');
        return;
    }

    const userId = localStorage.getItem('user_id'); // ユーザーIDをローカルストレージから取得
    if (!userId) {
        setError('ユーザーIDが見つかりません。');
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/apply-test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                testId,
                startTime: selectedDate.toISOString(), // 修正: keyをstartTimeに変更
                userId,
            }),
        });

        if (!response.ok) {
            throw new Error('受験申請に失敗しました。');
        }

        // 申請成功後にマイページに遷移
        navigate('/mypage');
    } catch (err) {
        setError(err.message);
    }
};

  return (
    <Container className="mt-5">
      <h1 className="text-center">受験申請</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {test && (
        <Alert variant="info" className="mb-3">
          テスト名: {test.name} | 所要時間: {test.duration} 秒
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3"> {/* 行を作成 */}
          <Col xs={12} md={4}> {/* 左側にラベルを配置 */}
            <Form.Label>受験開始日時</Form.Label>
          </Col>
          <Col xs={12} md={8}> {/* 右側に入力フィールドを配置 */}
            <Form.Control
              type="datetime-local"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
              required
            />
          </Col>
        </Row>
        <Button variant="primary" type="submit" className="mt-3"> {/* マージンを追加 */}
          申請
        </Button>
      </Form>
    </Container>
  );
};

export default ApplyTest;