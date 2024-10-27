package controllers

import (
	"dedede-syllabus/models"
	"fmt"
	"net/http"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ApplyTest - 受験申請を処理する
func ApplyTest(c *gin.Context, db *gorm.DB) {
	var application models.ExamApplication
	if err := c.ShouldBindJSON(&application); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// デバッグ用: 受信したデータをログに出力
	fmt.Printf("Received application: %+v\n", application)
	fmt.Printf("Application data after binding: UserID=%d, TestID=%d, StartTime=%v\n", application.UserID, application.TestID, application.StartTime)

	// StartTimeをログに出力して確認
	fmt.Printf("Parsed start time: %v\n", application.StartTime)

    // バリデーション
    if application.StartTime.IsZero() || application.UserID == "" || application.TestID == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "受験申請に必要な情報が不足しています。"})
        return
    }

	// データベースに保存
	if err := db.Create(&application).Error; err != nil {
		fmt.Printf("Database error: %v\n", err) // エラーログを出力
		c.JSON(http.StatusInternalServerError, gin.H{"error": "受験申請の保存に失敗しました"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "受験申請が成功しました"})
}

// GetExamApplications - ユーザーの受験申請を取得する
func GetExamApplications(c *gin.Context, db *gorm.DB) {
	userID := c.Param("user_id")

	var applications []models.ExamApplication
	if err := db.Preload("Test").Where("user_id = ?", userID).Find(&applications).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve applications"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"applications": applications})
}
