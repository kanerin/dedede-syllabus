package main

import (
    "gorm.io/gorm"
    "dedede-syllabus/models"
)

func Seed(db *gorm.DB) {
    tests := []models.Test{
        {Name: "Regex Test", Duration: 60},
        {Name: "SQL Test", Duration: 120},
        {Name: "AJAX Test", Duration: 90},
    }

    // すでにデータが存在する場合は追加しない
    for _, test := range tests {
        if err := db.FirstOrCreate(&test, models.Test{Name: test.Name}).Error; err != nil {
            panic(err)
        }
    }
}