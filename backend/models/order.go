package models

import (
    "gorm.io/gorm"
)

type Order struct {
    gorm.Model
    ItemID int `json:"item_id"`
    Amount int `json:"amount"`
}
