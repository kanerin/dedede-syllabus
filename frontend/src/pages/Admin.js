import React, { useEffect, useState } from 'react';
import { Container, Table, Alert, Button } from 'react-bootstrap';

const Admin = () => {
  const [results, setResults] = useState([]);
  const [applications, setApplications] = useState([]); // 受験申請の状態
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      const userId = localStorage.getItem('user_id'); // ユーザーIDを取得
      try {
        const response = await fetch(`http://localhost:8080/api/admin/results/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }

        const data = await response.json();
        setResults(data.results);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchApplications = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/exam-applications', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }

        const data = await response.json();
        console.log("Fetched applications:", data.applications); // デバッグ用
        setApplications(data.applications.map(app => ({
          ...app,
          Approved: app.approved, // DBからの値を使用
        })));
      } catch (err) {
        setError(err.message);
      }
    };

    fetchResults();
    fetchApplications();
  }, []);

  const handleToggleApproval = async (applicationId, currentApproval) => {
    try {
      const response = await fetch(`http://localhost:8080/api/exam-applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved: !currentApproval }), // 現在の承認状況を反転
      });
  
      if (!response.ok) {
        throw new Error('Failed to update application');
      }
  
      // 更新後の状態を反映
      const updatedApplications = applications.map(app =>
        app.ID === applicationId ? { ...app, Approved: !currentApproval } : app
      );
      setApplications(updatedApplications); // 状態を更新
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container>
      <h2>管理者ページ</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ユーザーID</th>
            <th>ユーザー名</th>
            <th>テスト名</th>
            <th>スコア</th>
            <th>ユーザー回答</th>
            <th>結果</th>
          </tr>
        </thead>
        <tbody>
          {results.map(result => (
            <tr key={result.ID}>
              <td>{result.user_id}</td>
              <td>{result.username}</td>
              <td>{result.Test ? result.Test.name : "テスト情報がありません"}</td>
              <td>{result.score}</td>
              <td>{result.user_answer}</td>
              <td>{result.result}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h2>受験申請一覧</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ユーザーID</th>
            <th>テスト名</th>
            <th>受験開始日時</th>
            <th>承認状況</th>
            <th>アクション</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.ID}>
              <td>{app.user_id}</td>
              <td>{app.Test ? app.Test.name : "テスト情報がありません"}</td>
              <td>{new Date(app.StartTime).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}</td>
              <td>{app.Approved ? '承認済み' : '未承認'}</td>
              <td>
                <Button 
                  variant={app.Approved ? 'danger' : 'primary'} // 承認済みなら赤、未承認なら青
                  onClick={() => handleToggleApproval(app.ID, app.Approved)}
                  style={{ width: '140px' }}
                >
                  {app.Approved ? '承認キャンセル' : '承認'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Admin;