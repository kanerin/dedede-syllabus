package models

import (
    "gorm.io/gorm"
)

// Testモデルを追加
type Test struct {
    gorm.Model
    Name       string `json:"name"`       // テスト名
    Duration   int    `json:"duration"`   // 所要時間（秒）
}