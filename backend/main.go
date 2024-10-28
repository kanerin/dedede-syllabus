package main

import (
    "github.com/joho/godotenv"
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
    "gorm.io/gorm"
    "gorm.io/driver/postgres"  // MySQLドライバをインポート
    "dedede-syllabus/controllers"  // controllers のパッケージをインポート
    "dedede-syllabus/models"
    "log"
    "os"
    "time"
)

// GORMのDB接続インスタンス
var db *gorm.DB

func main() {
    err := godotenv.Load()
    // PostgreSQL接続設定
    dsn := "user=" + os.Getenv("USERNAME") + 
            " password=" + os.Getenv("PASSWORD") + 
            " dbname=" + os.Getenv("DATABASE") + 
            " host=" + os.Getenv("DB_HOST") + 
            " port=" + os.Getenv("PORT") + 
            " sslmode=require"

    // リトライ処理の設定
    maxRetries := 6        // 最大リトライ回数
    waitTimes := []int{1, 2, 4, 8, 16, 32} // 待機時間（秒）

    for i := 0; i < maxRetries; i++ {
        db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
        if err == nil {
            break // 成功した場合、ループを抜ける
        }

        if i < maxRetries-1 {
            log.Printf("Failed to connect to database. Retrying in %d seconds...\n", waitTimes[i])
            time.Sleep(time.Duration(waitTimes[i]) * time.Second) // 指定された時間待機
        }
    }

    if err != nil {
        log.Fatal("Failed to connect to database after multiple attempts:", err)
    }

    // データベースのマイグレーション
    db.AutoMigrate(&models.ExamApplication{}, &models.User{}, &models.TestResult{}, &models.Test{})

    Seed(db)

    // Ginのルーター設定
    r := gin.Default()
    // CORSミドルウェアの設定
    var allowedOrigins []string
    if os.Getenv("ENV") == "production" {
        allowedOrigins = []string{"https://dedede-syllabus.onrender.com"} // 本番用のドメインを指定
    } else {
        allowedOrigins = []string{"http://localhost:3000"} // 開発環境用
    }

    r.Use(cors.New(cors.Config{
        AllowOrigins:     allowedOrigins,
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

    // 管理者エンドポイント
    r.GET("/api/admin/results/:user_id", func(c *gin.Context) {
        controllers.GetAllUserResults(c, db) // DBを引数に渡す
    })

    r.GET("/api/tests", func(c *gin.Context) {
        controllers.GetAllTests(c, db) // テスト一覧を取得
    })

    r.GET("/api/tests/:id", func(c *gin.Context) {
        controllers.GetTestByID(c, db)
    })

    r.POST("/api/apply-test", func(c *gin.Context) {
        controllers.ApplyTest(c, db) // 受験申請を処理
    })

    // 受験申請を取得するエンドポイント
    r.GET("/mypage/:user_id/applications", func(c *gin.Context) {
        controllers.GetExamApplications(c, db) // DBを引数に渡す
    })

    // 受験申請の一覧を取得するエンドポイント
    r.GET("/api/exam-applications", func(c *gin.Context) {
        controllers.GetAllExamApplications(c, db) // 全ての受験申請を取得
    })

    // 受験申請の承認状況を更新するエンドポイント
    r.PUT("/api/exam-applications/:id", func(c *gin.Context) {
        controllers.UpdateExamApplication(c, db) // 受験申請の承認状況を更新
    })

    
    // サーバー起動
    r.Run(":8080")
}