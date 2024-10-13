package main

import (
    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()
    r.GET("/api/tests", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "tests": []string{"Regex Test", "SQL Test", "AJAX Test"},
        })
    })
    r.Run() // デフォルトで :8080 ポート
}
