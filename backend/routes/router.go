package router

import (
    "github.com/gin-gonic/gin"
    "dedede-syllabus/controllers"
    "gorm.io/gorm"
)

// ルーティング設定
func SetupRouter(db *gorm.DB) *gin.Engine {
    r := gin.Default()

    r.POST("/register", controllers.Register)
    r.POST("/login", controllers.Login)

    // 管理者エンドポイント
    r.GET("/api/admin/results/:user_id", func(c *gin.Context) {
        controllers.GetAllUserResults(c, db) // DBを引数に渡す
    })

    return r
}