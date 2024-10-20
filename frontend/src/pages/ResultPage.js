import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, ListGroup, Alert, Button } from 'react-bootstrap'; // Bootstrapを利用

const ResultPage = () => {
  const location = useLocation();
  const { results, questions } = location.state || {}; // 結果データと質問を取得

  // 合計点数を計算する (OKの場合1点、NGの場合0点)
  const totalScore = Object.values(results).reduce((total, result) => {
    return total + (result.result === 'OK' ? 1 : 0);
  }, 0);

  return (
    <Container className="mt-5">
      <h1 className="text-center">テスト結果</h1>
      <Alert variant="info">合計点数: {totalScore}/10</Alert>

      {results && questions ? (
        <ListGroup>
          {questions.map((question) => (
            <ListGroup.Item key={question.id}>
              <h5>問題 {question.id}: {question.question}</h5>
              <p>
                <strong>回答内容:</strong> {results[question.id].userAnswer 
                  ? results[question.id].userAnswer 
                  : '回答なし'}
              </p>
              <p>
                <strong>結果:</strong> {results[question.id].userAnswer 
                  ? results[question.id].result 
                  : 'NG'} {/* 回答なしの場合は結果をNGにする */}
              </p>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <Alert variant="warning">結果データがありません。</Alert>
      )}

      <div className="text-center mt-4">
        <Button variant="primary" onClick={() => window.location.href = '/'}>再試行</Button>
      </div>
    </Container>
  );
};

export default ResultPage;