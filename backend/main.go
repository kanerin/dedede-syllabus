// main.go
package main

import (
    "github.com/gin-gonic/gin"
    "dedede-syllabus/routes"
)

func main() {
    router := gin.Default()

    // 各テスト用ルート
    router.GET("/regex-test", routes.RegexTest)
    router.GET("/sql-test", routes.SqlTest)
    router.GET("/ajax-test", routes.AjaxTest)

    router.Run(":8080")
}
