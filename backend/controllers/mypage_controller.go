package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "dedede-syllabus/models"
    "gorm.io/gorm"  // GORMをインポート
	"fmt"
)

// マイページ用のテスト結果を取得する
func GetTestResults(c *gin.Context, db *gorm.DB) {
    var testResults []models.TestResult
    userID := c.Param("user_id")

    // テスト結果をデータベースから取得
    if err := db.Where("user_id = ?", userID).Find(&testResults).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve test results"})
        return
    }

	// デバッグ用: 取得した結果を表示
    fmt.Printf("Fetched test results: %+v\n", testResults)

    c.JSON(http.StatusOK, gin.H{"test_results": testResults})
}