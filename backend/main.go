package main

import (
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
    "gorm.io/gorm"
    "gorm.io/driver/mysql"  // MySQLドライバをインポート
    "dedede-syllabus/controllers"  // controllers のパッケージをインポート
    "dedede-syllabus/models"
    "log"
    "time"
)

// GORMのDB接続インスタンス
var db *gorm.DB

func main() {
    // MySQL接続設定
    dsn := "user:password@tcp(db:3306)/dedede_db?charset=utf8&parseTime=True&loc=Local"
    var err error

    // リトライ処理の設定
    maxRetries := 6        // 最大リトライ回数
    waitTimes := []int{1, 2, 4, 8, 16, 32} // 待機時間（秒）

    for i := 0; i < maxRetries; i++ {
        db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})  // MySQLに接続
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
    db.AutoMigrate(&models.User{}, &models.TestResult{}, &models.Test{})

    Seed(db)

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

    // 管理者エンドポイント
    r.GET("/api/admin/results/:user_id", func(c *gin.Context) {
        controllers.GetAllUserResults(c, db) // DBを引数に渡す
    })
    
    // サーバー起動
    r.Run(":8080")
}