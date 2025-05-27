# BOOTCAMP Backend API Development

This project is part of the **BOOTCAMP Backend API Development: Node.js Ecosystem** by [M-Knows Consulting](https://www.m-knowsconsulting.com/bootcamp-program/back-end-development-advance).

## Overview
This is a backend API server built using modern Node.js technologies and best practices. The project follows the MVC (Model-View-Controller) architecture and is designed for scalability, maintainability, and ease of development.

## Tech Stack
- **Node.js**: JavaScript runtime for building scalable server-side applications
- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js
- **TypeScript**: Strongly typed programming language that builds on JavaScript
- **Sequelize**: Promise-based ORM for Node.js supporting SQL databases
- **PostgreSQL**: Relational database for structured data
- **MongoDB**: NoSQL database for unstructured data

## Features
- Modular MVC architecture
- RESTful API endpoints for authentication, user management, accounts, files, categories, and articles
- Environment variable validation
- Middleware for authentication, error handling, file uploads, rate limiting, and validation
- Database integration with Sequelize (PostgreSQL) and MongoDB
- Docker support for development and production
- Unit and integration testing with Jest

## Project Structure
```
├── src/
│   ├── app.ts                # Express app configuration
│   ├── server.ts             # Main entry point
│   ├── config/               # Configuration files
│   ├── controllers/          # Route controllers
│   ├── database/             # Database setup and migrations
│   ├── dtos/                 # Data Transfer Objects
│   ├── exceptions/           # Custom error classes
│   ├── interfaces/           # TypeScript interfaces
│   ├── middlewares/          # Express middlewares
│   ├── models/               # Sequelize models
│   ├── routes/               # API route definitions
│   ├── services/             # Business logic
│   ├── utils/                # Utility functions
│   └── test/                 # Test files
├── public/                   # Static files and templates
├── docker-compose.yml        # Docker orchestration
├── Dockerfile.dev            # Dockerfile for development
├── Dockerfile.prod           # Dockerfile for production
├── package.json              # Project metadata and scripts
├── tsconfig.json             # TypeScript configuration
└── swagger.yaml              # API documentation (OpenAPI)
```

## Getting Started
1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure environment variables**
   - Copy `.env.example` to `.env` and update values as needed
4. **Run database migrations and seeders**
   ```bash
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```
5. **Start the development server**
   ```bash
   npm run dev
   ```
6. **Access API documentation**
   - Open `swagger.yaml` with Swagger UI or compatible tool

## Scripts
- `npm run dev` — Start server in development mode with hot reload
- `npm run build` — Compile TypeScript to JavaScript
- `npm start` — Start server in production mode
- `npm test` — Run tests

## License
This project is for educational purposes as part of the M-Knows Consulting Bootcamp.
