
# Dedede Syllabus Project

This project is a study test website built with Gin (Go) and React, and it uses Docker for containerization.

## Table of Contents

- [Requirements](#requirements)
- [Project Setup](#project-setup)
- [Running the Project](#running-the-project)
- [Directory Structure](#directory-structure)
- [Troubleshooting](#troubleshooting)

## Requirements

Before running this project, make sure you have the following installed:

- Docker: [https://www.docker.com/get-started](https://www.docker.com/get-started)
- Docker Compose: [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)

## Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/kanerin/dedede-syllabus.git
cd dedede-syllabus
```

### 2. Install dependencies

For the frontend, dependencies are installed automatically when building the Docker container.

### 3. Check configuration (optional)

Before running the project, you can check the Docker configuration in `docker-compose.yml` and make adjustments if necessary.

## Running the Project

### 1. Build and run the project with Docker Compose

Run the following command to build and start the backend and frontend containers:

```bash
docker-compose up --build
```

- The backend will be available at `http://localhost:8080`.
- The frontend React application will be available at `http://localhost:3000`.

### 2. Stop the project

To stop the containers, run:

```bash
docker-compose down
```

## Directory Structure

```bash
dedede-syllabus/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── main.go
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   └── components/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Troubleshooting

### Common Issues

1. **Error: `react-router-dom` not found**

   If you encounter an error related to `react-router-dom` when running the frontend, ensure that the package is installed by running:

   ```bash
   npm install react-router-dom
   ```

2. **Dependency issues**

   If you receive warnings or errors related to missing dependencies like `@babel/plugin-proposal-private-property-in-object`, run:

   ```bash
   npm install --save-dev @babel/plugin-proposal-private-property-in-object
   ```

3. **Port conflicts**

   If ports `8080` or `3000` are in use, either stop the conflicting processes or update the port mappings in `docker-compose.yml`.

---

Feel free to contribute to this project by submitting pull requests or opening issues.
