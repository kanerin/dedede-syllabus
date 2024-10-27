import React, { useEffect, useState } from 'react';
import { ListGroup, Alert, Spinner } from 'react-bootstrap';

const ExamApplications = ({ userId }) => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // ローディング状態を追加

  useEffect(() => {
    if (!userId) {
      setError('ユーザーIDが無効です。');
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/mypage/${userId}/applications`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('受験申請の取得に失敗しました');
        }
        return response.json();
      })
      .then((data) => {
        setApplications(data.applications);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching applications:", err); // コンソールエラーログを追加
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  return (
    <>
      <h5 style={{ marginTop: '20px' }}>受験申請一覧</h5>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <Spinner animation="border" role="status" className="mt-3">
          <span className="visually-hidden">読み込み中...</span>
        </Spinner>
      ) : applications.length > 0 ? (
        <ListGroup>
          {applications.map((app) => (
            <ListGroup.Item key={app.ID}>
              テスト名: {app.test.name} | 受験開始日時: {isNaN(Date.parse(app.startTime)) ? "無効な日付" : new Date(app.startTime).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })} | 承認状況: {app.approved ? "承認済み" : "未承認"}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>受験申請がありません。</p>
      )}
    </>
  );
};

export default ExamApplications;