package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "dedede-syllabus/models"
    "gorm.io/gorm"  // GORMをインポート
)

// マイページ用のテスト結果を取得する
func GetTestResults(c *gin.Context, db *gorm.DB) {
    userID := c.Param("user_id")

    var results []models.TestResult
    if err := db.Preload("Test").Where("user_id = ?", userID).Find(&results).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve test results"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"test_results": results})
}