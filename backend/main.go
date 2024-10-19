package main

import (
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
    "gorm.io/gorm"
    "gorm.io/driver/postgres"
    "dedede-syllabus/controllers"  // controllers のパッケージをインポート
    "dedede-syllabus/models"
    "log"
    "time"
)

func main() {
    // データベース接続設定
    dsn := "host=db user=user password=password dbname=dedede_db port=5432 sslmode=disable"
    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }

    // データベースのマイグレーション
    db.AutoMigrate(&models.User{})

    controllers.DB = db

    // Ginのルーター設定
    r := gin.Default()

    // CORSミドルウェアの設定
    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000"},
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge: 12 * time.Hour,
    }))

    // テスト用エンドポイント
    r.GET("/api/tests", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "tests": []string{"Regex Test", "SQL Test", "AJAX Test"},
        })
    })

    // 正規表現の問題エンドポイントを追加
    r.GET("/api/regex-tests", controllers.GetRegexQuestions)  // 追加

    // 認証エンドポイント
    r.POST("/register", controllers.Register)
    r.POST("/login", controllers.Login)

    // サーバー起動
    r.Run(":8080") // デフォルトでポート8080で起動
}