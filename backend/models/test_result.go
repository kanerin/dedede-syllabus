package models

import (
    "gorm.io/gorm"
)

// テスト結果モデル
type TestResult struct {
    gorm.Model
    UserID     uint   `json:"user_id"`
    TestID     uint   `json:"test_id"`             // 外部キー参照
    Test       Test   `gorm:"foreignKey:TestID"`   // Test とのリレーションを定義
    Score      int    `json:"score"`
    UserAnswer string `json:"user_answer"`
    Result     string `json:"result"`              // OK or NG
}