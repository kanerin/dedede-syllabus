package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
    "dedede-syllabus/models"
)

// GetAllTests - 全てのテストを取得する
func GetAllTests(c *gin.Context, db *gorm.DB) {
    var tests []models.Test
    if err := db.Find(&tests).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve tests"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"tests": tests})
}

// GetTestByID - 指定されたIDのテストを取得する
func GetTestByID(c *gin.Context, db *gorm.DB) {
    testID := c.Param("id") // URLパラメータからテストIDを取得

    var test models.Test
    if err := db.First(&test, testID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Test not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"test": test}) // テスト情報を返す
}