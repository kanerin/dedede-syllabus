package models

import (
    "gorm.io/gorm"
)

type User struct {
    gorm.Model
    Username string `gorm:"unique" json:"username"`
    Password string `json:"password"`
    Admin    bool   `json:"admin"`  // 管理者フラグを追加
}