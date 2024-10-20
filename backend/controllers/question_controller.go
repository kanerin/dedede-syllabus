package controllers

import (
    "encoding/json"
    "net/http"
    "math/rand"
    "time"
    "github.com/gin-gonic/gin"
    "dedede-syllabus/models"
    "io/ioutil"
)

// 問題データをJSONから読み込む
func LoadQuestions() []models.Question {
    var questions []models.Question
    data, err := ioutil.ReadFile("data/questions.json")
    if err != nil {
        panic(err)
    }

    err = json.Unmarshal(data, &questions)
    if err != nil {
        panic(err)
    }

    return questions
}

// ランダムに問題を選択する関数
func SelectRandomQuestions(questions []models.Question, high, medium, low int) []models.Question {
    rand.Seed(time.Now().UnixNano())
    selected := make([]models.Question, 0)

    // 高2、中3、低5を選択
    selected = append(selected, questions[:high]...)
    selected = append(selected, questions[high:high+medium]...)
    selected = append(selected, questions[high+medium:high+medium+low]...)

    return selected
}

// APIのエンドポイント
func GetRegexQuestions(c *gin.Context) {
    questions := LoadQuestions()
    selectedQuestions := SelectRandomQuestions(questions, 2, 3, 5) // 高2、中3、低5の問題を選択
    c.JSON(http.StatusOK, gin.H{"questions": selectedQuestions})
}
