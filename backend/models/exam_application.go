package models

import (
	"time"

	"gorm.io/gorm"
)

// ExamApplication モデル
type ExamApplication struct {
    gorm.Model
    UserID    string    `json:"userId"`
    TestID    string    `json:"testId"` // 外部キー
    Test      Test      `gorm:"foreignKey:TestID" json:"test"` // リレーションを定義
    StartTime time.Time `json:"startTime"`
    Approved  bool      `json:"approved"`
}
