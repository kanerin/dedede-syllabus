package services

import (
    "encoding/json"
    "errors"
    "io/ioutil"
    "log"
    "gorm.io/gorm"
    "sort"
    "math/rand"
    "time"
)

// Questionは各SQL問題を表す構造体
type Question struct {
    ID       int    `json:"id"`
    Question string `json:"question"`
}

// Categoryは1つの大項目と、それに属する複数の問題を表す構造体
type Category struct {
    Name      string
    Questions []Question
}

// QuestionListは全てのカテゴリ（大項目）を保持する構造体
type QuestionList struct {
    Categories []Category
}

// GetRandomCategoriesはランダムに3つの大項目を選択して返す
func GetRandomCategories() ([]Category, error) {
    var questionList QuestionList

    data, err := ioutil.ReadFile("data/sql_test_questions.json")
    if err != nil {
        return nil, errors.New("Failed to load questions")
    }

    err = json.Unmarshal(data, &questionList)
    if err != nil {
        return nil, errors.New("Failed to parse questions")
    }

    if len(questionList.Categories) >= 3 {
        rand.Seed(time.Now().UnixNano())
        randomIndexes := rand.Perm(len(questionList.Categories))[:3]
        selectedCategories := make([]Category, 0)
        for _, idx := range randomIndexes {
            selectedCategories = append(selectedCategories, questionList.Categories[idx])
        }
        return selectedCategories, nil
    } else {
        return nil, errors.New("Not enough categories with questions")
    }
}

// 期待結果を取得し、結合順序に応じて調整
func loadExpectedResults(testID string, joinOrder string) ([]map[string]interface{}, error) {
    data, err := ioutil.ReadFile("data/expected_results.json")
    if err != nil {
        return nil, errors.New("Failed to load expected results")
    }

    var expectedResultsMap map[string]string
    err = json.Unmarshal(data, &expectedResultsMap)
    if err != nil {
        return nil, errors.New("Failed to parse expected results")
    }

    expected, exists := expectedResultsMap[testID]
    if !exists {
        return nil, errors.New("No expected result for given test ID")
    }

    var expectedResults []map[string]interface{}
    if err := json.Unmarshal([]byte(expected), &expectedResults); err != nil {
        return nil, errors.New("Failed to parse expected result JSON")
    }

    // 結合順序に応じて id フィールドをクリアし、比較対象フィールドのみ残す
    for _, row := range expectedResults {
        delete(row, "id") // id フィールドを削除
    }

    return expectedResults, nil
}

// ソート関数
// ソート関数
func sortResults(results []map[string]interface{}) {
    sort.Slice(results, func(i, j int) bool {
        // item_idで比較
        itemID1, _ := results[i]["item_id"].(float64)
        itemID2, _ := results[j]["item_id"].(float64)
        if itemID1 != itemID2 {
            return itemID1 < itemID2
        }

        // amountで比較
        amount1, _ := results[i]["amount"].(float64)
        amount2, _ := results[j]["amount"].(float64)
        if amount1 != amount2 {
            return amount1 < amount2
        }

        // nameで比較（文字列順）
        name1, _ := results[i]["name"].(string)
        name2, _ := results[j]["name"].(string)
        return name1 < name2
    })
}


// ExecuteSQLQueriesは提出されたSQLクエリを実行し、その結果を返す
func ExecuteSQLQueries(answers map[string]string, db *gorm.DB, joinOrder string) (map[string]string, error) {
    results := make(map[string]string)

    for id, query := range answers {
        log.Printf("Executing query for ID %s: %s", id, query)

        err := db.Transaction(func(tx *gorm.DB) error {
            var queryResults []map[string]interface{}

            rows, err := tx.Raw(query).Rows()
            if err != nil {
                results[id] = "Query failed"
                log.Printf("Query failed for ID %s: %v", id, err)
                return err
            }
            defer rows.Close()

            for rows.Next() {
                var row map[string]interface{}
                if err := tx.ScanRows(rows, &row); err != nil {
                    results[id] = "Error retrieving results"
                    log.Printf("Error retrieving results for ID %s: %v", id, err)
                    return err
                }
                delete(row, "created_at")
                delete(row, "deleted_at")
                delete(row, "updated_at")
                delete(row, "id") // `id` を削除して順序非依存の比較にする
                queryResults = append(queryResults, row)
            }

            log.Printf("Query result before sorting for ID %s: %v", id, queryResults)
            sortResults(queryResults)
            log.Printf("Query result after sorting for ID %s: %v", id, queryResults)

            // 期待結果のロードとデコード
            expectedResults, err := loadExpectedResults(id, joinOrder)
            if err != nil {
                results[id] = "Error loading expected result"
                log.Printf("Error loading expected result for ID %s: %v", id, err)
                return err
            }

            log.Printf("Expected result before sorting for ID %s: %v", id, expectedResults)

            queryResultJSON, _ := json.Marshal(queryResults)
            expectedJSON, _ := json.Marshal(expectedResults)

            // 比較のためのログ出力
            log.Printf("Query result JSON for ID %s: %s", id, queryResultJSON)
            log.Printf("Expected result JSON for ID %s: %s", id, expectedJSON)

            if string(queryResultJSON) == string(expectedJSON) {
                results[id] = "Correct"
            } else {
                results[id] = "Incorrect"
            }

            return nil
        })

        if err != nil {
            return results, err
        }
    }

    return results, nil
}
