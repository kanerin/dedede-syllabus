package models

type Question struct {
    ID                int      `json:"id"`
    Difficulty        string   `json:"difficulty"`
    QuestionText      string   `json:"question"`
    String            string   `json:"string"`
    ExpectedMatches   []string `json:"expectedMatches"`
    NonMatchingStrings []string `json:"nonMatchingStrings"`
}