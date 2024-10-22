package models

import (
    "gorm.io/gorm"
)

// テスト結果モデル
type TestResult struct {
    gorm.Model
    UserID     uint   `json:"user_id"`
    TestType   string `json:"test_type"`   // 'regex', 'sql' などのテストタイプ
    Score      int    `json:"score"`
    UserAnswer string `json:"user_answer"`
    Result     string `json:"result"`      // OK or NG
}