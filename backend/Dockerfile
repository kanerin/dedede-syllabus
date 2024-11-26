FROM golang:1.20-alpine

# アプリケーションの作業ディレクトリ
WORKDIR /app

# go.mod と go.sum をコピー
COPY ./go.mod ./
COPY ./go.sum ./
RUN go mod download

# ソースコード全体をコピー
COPY . .

# アプリケーションをビルド
RUN go build -o /dedede-syllabus

# ポートを開放
EXPOSE 8080

# アプリケーションを実行
CMD ["/dedede-syllabus"]
