package controllers

import (
    "github.com/gin-gonic/gin"
    "net/http"
    "log"
    "dedede-syllabus/services"
    "gorm.io/gorm"
)

func GetSQLQuestions(c *gin.Context, db *gorm.DB) {
    selectedCategories, err := services.GetRandomCategories()
    if err != nil {
        log.Println("Error loading questions:", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{
        "selected_categories": selectedCategories,
    })
}

// JSONリクエストのラップ用構造体を定義
type SubmitSQLPayload struct {
    Answers map[string]string `json:"answers"`
}

func SubmitSQLTest(c *gin.Context, db *gorm.DB) {
    var payload SubmitSQLPayload

    // JSONリクエストのパースを試みる
    if err := c.ShouldBindJSON(&payload); err != nil {
        log.Printf("JSON Parsing Error: %v", err)  // JSON解析エラーログ
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
        return
    }

    // パース結果の内容をログ出力（デバッグ用）
    log.Printf("Received Answers Payload: %+v", payload.Answers)

    joinOrder := "ordersFirst" // または "itemsFirst" のように、結合順序を指定
    // SQLクエリ実行サービスを呼び出し
    results, err := services.ExecuteSQLQueries(payload.Answers, db, joinOrder) // 修正箇所
    if err != nil {
        log.Printf("Error executing queries: %v", err)  // クエリ実行エラーログ
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to execute SQL queries"})
        return
    }

    // 実行結果をログ出力（デバッグ用）
    log.Printf("Execution Results: %+v", results)

    // クライアントへ成功結果を返却
    c.JSON(http.StatusOK, gin.H{
        "results": results,
    })
}
