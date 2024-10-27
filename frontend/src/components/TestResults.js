import React, { useEffect, useState } from 'react';
import { ListGroup, Alert } from 'react-bootstrap';

const TestResults = ({ userId }) => {
  const [testResults, setTestResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError('ユーザーIDが無効です。');
      return;
    }

    fetch(`http://localhost:8080/mypage/${userId}/results`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('テスト結果の取得に失敗しました');
        }
        return response.json();
      })
      .then((data) => {
        if (data.test_results) {
          setTestResults(data.test_results);
        } else {
          setTestResults([]);
        }
      })
      .catch((err) => setError(err.message));
  }, [userId]);

  return (
    <>
      <h5 style={{ marginTop: '20px' }}>テスト結果</h5>
      {error && <Alert variant="danger">{error}</Alert>}
      {testResults.length > 0 ? (
        <ListGroup>
          {testResults.map((result) => (
            <ListGroup.Item key={result.ID}>
              テスト名: {result.Test.name} | スコア: {result.score}/10 | 受験日時: {isNaN(Date.parse(result.CreatedAt)) ? "無効な日付" : new Date(result.CreatedAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>テスト結果がありません。</p>
      )}
    </>
  );
};

export default TestResults;