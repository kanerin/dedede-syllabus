package controllers

import (
	"dedede-syllabus/models"
	"fmt"
	"net/http"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
    "time"
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
    
    // 日本時間をUTCに変換
	japanTime := application.StartTime.In(time.FixedZone("Asia/Tokyo", 9*60*60))
	application.StartTime = japanTime.UTC() // UTCに変換

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
	currentTime := time.Now() // 現在の日時を取得

	// 現在より後の開始日時を持つ申請のみを取得
	if err := db.Preload("Test").Where("user_id = ? AND start_time > ?", userID, currentTime).Find(&applications).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve applications"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"applications": applications})
}

// GetAllExamApplications - すべての受験申請を取得する
func GetAllExamApplications(c *gin.Context, db *gorm.DB) {
    var applications []models.ExamApplication
    if err := db.Preload("Test").Find(&applications).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve applications"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"applications": applications})
}

// UpdateExamApplication - 受験申請の承認状況を更新する
func UpdateExamApplication(c *gin.Context, db *gorm.DB) {
    var application models.ExamApplication
    id := c.Param("id")

    // 受信したデータをバインド
    if err := c.ShouldBindJSON(&application); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // 承認状況を更新
    if err := db.Model(&application).Where("id = ?", id).Update("approved", application.Approved).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update application"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "受験申請の承認状況が更新されました"})
}