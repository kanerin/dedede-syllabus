import React from 'react';
import { useLocation } from 'react-router-dom';

const ResultPage = () => {
  const location = useLocation();
  const { results } = location.state || {}; // 結果データを取得

  // 合計点数を計算する (OKの場合1点、NGの場合0点)
  const totalScore = Object.values(results).reduce((total, result) => {
    return total + (result === 'OK' ? 1 : 0);
  }, 0);

  return (
    <div>
      <h1>Test Results</h1>
      <p>合計点数: {totalScore}/10</p>

      {results ? (
        <ul>
          {Object.keys(results).map((key) => (
            <li key={key}>
              問題 {key}: {results[key]} {/* 各問題の結果 */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No results available.</p>
      )}
    </div>
  );
};

export default ResultPage;