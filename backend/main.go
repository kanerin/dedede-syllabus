package main

import (
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
    "gorm.io/gorm"
    "gorm.io/driver/postgres"
    "dedede-syllabus/controllers"  // controllers のパッケージをインポート
    // "dedede-syllabus/models"
    "log"
    "time"
)

// GORMのDB接続インスタンス（全体で利用するために定義）
var db *gorm.DB

func main() {
    // データベース接続設定
    dsn := "host=db user=user password=password dbname=dedede_db port=5432 sslmode=disable"
    var err error
    db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})  // dbを初期化
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }

    // データベースのマイグレーション
    db.AutoMigrate(&models.User{})

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
    // SQLテスト用エンドポイントを追加
    r.GET("/api/sql-tests", func(c *gin.Context) {
        controllers.GetSQLQuestions(c, db)
    })
    r.POST("/api/submit-sql", func(c *gin.Context) {
        controllers.SubmitSQLTest(c, db)
    })

    // 認証エンドポイント
    r.POST("/register", func(c *gin.Context) {
        controllers.Register(c, db)
    })
    r.POST("/login", func(c *gin.Context) {
        controllers.Login(c, db)
    })

    // サーバー起動
    r.Run(":8080") // デフォルトでポート8080で起動
}
