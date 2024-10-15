package routes

import (
    "dedede-syllabus/controllers"
    "github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
    r := gin.Default()

    // エンドポイントを設定
    r.POST("/register", controllers.Register)
    r.POST("/login", controllers.Login)

    return r
}