import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap'; // Bootstrapを利用

const ResultPage = () => {
  return (
    <Container className="mt-5">
      <h1 className="text-center">テスト完了</h1>
      <Alert variant="success">回答が完了しました！</Alert>

      <div className="text-center mt-4">
        <Button variant="primary" onClick={() => window.location.href = '/'}>ホームに戻る</Button>
      </div>
    </Container>
  );
};

export default ResultPage;