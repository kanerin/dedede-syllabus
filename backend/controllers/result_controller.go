package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "dedede-syllabus/models"
    "gorm.io/gorm"  // GORMをインポート
)

// テスト結果を保存するエンドポイント
func SaveTestResult(c *gin.Context, db *gorm.DB) {
    var testResult models.TestResult

    if err := c.ShouldBindJSON(&testResult); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // テスト結果をデータベースに保存
    if err := db.Create(&testResult).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save test result"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Test result saved successfully"})
}
