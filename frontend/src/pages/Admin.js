import React, { useEffect, useState } from 'react';
import { Container, Table, Alert } from 'react-bootstrap';

const Admin = () => {
  const [results, setResults] = useState([]);
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

    fetchResults();
  }, []);

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
            <th>テスト種別</th>
            <th>スコア</th>
            <th>ユーザー回答</th>
            <th>結果</th>
          </tr>
        </thead>
        <tbody>
          {results.map(result => (
            <tr key={result.ID}>
              <td>{result.user_id}</td>
              <td>{result.test_type}</td>
              <td>{result.score}</td>
              <td>{result.user_answer}</td>
              <td>{result.result}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Admin;