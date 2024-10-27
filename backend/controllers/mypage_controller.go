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

    // TestResultとTestをJOINしてデータを取得
    var results []struct {
        models.TestResult
        TestName string `json:"test_name"`
    }

    if err := db.Table("test_results").
        Select("test_results.*, tests.name AS test_name").
        Joins("JOIN tests ON test_results.test_id = tests.id").
        Where("test_results.user_id = ?", userID).
        Scan(&results).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve test results"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"test_results": results})
}