package router

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ルーティング設定
func SetupRouter(db *gorm.DB) *gin.Engine {
	r := gin.Default()
	return r
}
