import React, { useEffect, useState } from 'react';
import { ListGroup, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const TestList = () => {
  const [tests, setTests] = useState([]); // テスト一覧の状態
  const [error, setError] = useState(null); // エラー状態
  const navigate = useNavigate(); // useNavigateを使用してページ遷移を管理

  useEffect(() => {
    // テストのAPIを呼び出す
    fetch(`http://localhost:8080/api/tests`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch tests');
        }
        return response.json();
      })
      .then(data => {
        setTests(data.tests); // テストデータを状態に保存
      })
      .catch(err => {
        setError(err.message); // エラーメッセージを保存
      });
  }, []);

  // 受験申請ボタンがクリックされたときの処理
  const handleApply = (testId) => {
    console.log("Test ID:", testId); // testIdを確認
    navigate(`/apply/${testId}`); // 受験申請ページへ遷移
  };

  return (
    <>
      <h5>利用可能なテスト</h5>
      {error && <Alert variant="danger">{error}</Alert>}
      <ListGroup>
        {tests.length > 0 ? (
          tests.map(test => (
            <ListGroup.Item key={test.ID}> {/* 修正: test.IDを使用 */}
              テスト名: {test.name} | 所要時間: {test.duration} 秒
              <Button variant="primary" className="float-end" onClick={() => handleApply(test.ID)}> {/* 修正: test.IDを使用 */}
                受験申請
              </Button>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>利用可能なテストがありません。</ListGroup.Item>
        )}
      </ListGroup>
    </>
  );
};

export default TestList;