package models

import (
    "gorm.io/gorm"
)

type TestOrder struct {
    gorm.Model
    ItemID int `json:"item_id"`
    Amount int `json:"amount"`
}
