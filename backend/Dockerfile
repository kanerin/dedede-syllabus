FROM golang:1.23-alpine

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . .

RUN go build -o /dedede-syllabus

EXPOSE 8080

CMD ["/dedede-syllabus"]
