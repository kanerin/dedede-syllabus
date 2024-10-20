package services

import (
    "encoding/json"                      // JSONをエンコードおよびデコードするための標準ライブラリ
    "errors"                             // エラーハンドリング用の標準ライブラリ
    "io/ioutil"                          // ファイル読み書き用ライブラリ
    "math/rand"                          // ランダム生成用ライブラリ
    "time"                               // 時刻の処理用ライブラリ
    "gorm.io/gorm"                       // GORMのパッケージ
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

    // SQL問題を格納しているJSONファイルを読み込み
    data, err := ioutil.ReadFile("data/sql_test_questions.json")
    if err != nil {
        return nil, errors.New("Failed to load questions")  // エラーをそのまま返す
    }

    // JSONデータをQuestionList構造体にパース
    err = json.Unmarshal(data, &questionList)
    if err != nil {
        return nil, errors.New("Failed to parse questions")  // エラーをそのまま返す
    }

    // カテゴリが3つ以上存在する場合のみランダムに3つ選択
    if len(questionList.Categories) >= 3 {
        rand.Seed(time.Now().UnixNano())  // 現在時刻を使ってランダムなシードを生成
        randomIndexes := rand.Perm(len(questionList.Categories))[:3]  // ランダムに3つのインデックスを選択
        selectedCategories := make([]Category, 0)  // 選択されたカテゴリを格納するためのスライス
        for _, idx := range randomIndexes {
            selectedCategories = append(selectedCategories, questionList.Categories[idx])  // 選択されたインデックスに対応するカテゴリを追加
        }
        return selectedCategories, nil
    } else {
        return nil, errors.New("Not enough categories with questions")  // カテゴリが3つ未満の場合
    }
}

// ExecuteSQLQueriesは提出されたSQLクエリを実行し、その結果を返す
func ExecuteSQLQueries(answers map[string]string, db *gorm.DB) (map[string]string, error) {
    results := make(map[string]string)

    // 提出された全てのSQLクエリに対してループ
    for id, query := range answers {
        // クエリを実行し、結果の行を取得
        rows, err := db.Raw(query).Rows()  // GORMのRawクエリメソッドを使用して生SQLを実行
        if err != nil {
            results[id] = "Query failed"
            continue
        }
        defer rows.Close()  // 行の処理が終わったら閉じる

        var result string
        // 取得した行の結果をスキャン
        for rows.Next() {
            err = rows.Scan(&result)
            if err != nil {
                results[id] = "Error retrieving results"
                continue
            }
        }

        // 仮の期待値チェック（ここでは簡単に"expected result"と比較）
        expected := "expected result"  // 仮の期待値
        if result == expected {
            results[id] = "Correct"  // 期待値と一致した場合
        } else {
            results[id] = "Incorrect"  // 期待値と一致しなかった場合
        }
    }

    return results, nil
}
