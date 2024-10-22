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

// GORMのDB接続インスタンス
var db *gorm.DB

func main() {
    // データベース接続設定
    dsn := "host=db user=user password=password dbname=dedede_db port=5432 sslmode=disable"
    var err error
    db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }

    // データベースのマイグレーション
    db.AutoMigrate(&models.User{}, &models.TestResult{})

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

    // 認証エンドポイント
    r.POST("/register", func(c *gin.Context) {
        controllers.Register(c, db)
    })
    r.POST("/login", func(c *gin.Context) {
        controllers.Login(c, db)
    })

    // 正規表現の問題エンドポイント
    r.GET("/api/regex-tests", controllers.GetRegexQuestions)

    // SQLテスト用エンドポイント
    r.GET("/api/sql-tests", func(c *gin.Context) {
        controllers.GetSQLQuestions(c, db)
    })
    r.POST("/api/submit-sql", func(c *gin.Context) {
        controllers.SubmitSQLTest(c, db)
    })

    // 結果を保存するエンドポイント
    r.POST("/save-result", func(c *gin.Context) {
        controllers.SaveTestResult(c, db)
    })

    // マイページ用の結果取得エンドポイント
    r.GET("/mypage/:user_id/results", func(c *gin.Context) {
        controllers.GetTestResults(c, db)
    })
    
    // サーバー起動
    r.Run(":8080")
}