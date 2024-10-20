package controllers

import (
    "github.com/gin-gonic/gin"
    "net/http"
    "log"
    "dedede-syllabus/services"
    "gorm.io/gorm"
)

func GetSQLQuestions(c *gin.Context, db *gorm.DB) {
    selectedCategories, err := services.GetRandomCategories()
    if err != nil {
        log.Println("Error loading questions:", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{
        "selected_categories": selectedCategories,
    })
}

func SubmitSQLTest(c *gin.Context, db *gorm.DB) {
    var answers map[string]string

    if err := c.ShouldBindJSON(&answers); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
        return
    }

    results, err := services.ExecuteSQLQueries(answers, db)
    if err != nil {
        log.Println("Error executing queries:", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to execute SQL queries"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "results": results,
    })
}
