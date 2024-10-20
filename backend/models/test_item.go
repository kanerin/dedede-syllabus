package models

import (
    "gorm.io/gorm"
)

type TestItem struct {
    gorm.Model
    Name  string `json:"name"`
    Price int    `json:"price"`
}
