package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
    "dedede-syllabus/models"
    "log"
)

// GetAllUserResults 関数を更新
func GetAllUserResults(c *gin.Context, db *gorm.DB) {
    userID := c.Param("user_id")
    log.Printf("Received request for user_id: %s", userID)

    // user_idからユーザー情報を取得
    var user models.User
    if err := db.First(&user, userID).Error; err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found or unauthorized"})
        return
    }

    // ユーザーがadminかどうかを確認
    if !user.Admin {
        c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
        return
    }

    // 管理者の全ユーザー結果を取得（ユーザー名とテスト名も取得する）
    var results []struct {
        models.TestResult
        Username  string `json:"username"`
        TestName  string `json:"test_name"`
    }

    if err := db.Table("test_results").
        Select("test_results.*, users.username, tests.name AS test_name").
        Joins("JOIN users ON test_results.user_id = users.id").
        Joins("JOIN tests ON test_results.test_id = tests.id"). // testsテーブルとJOIN
        Scan(&results).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve results"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"results": results})
}