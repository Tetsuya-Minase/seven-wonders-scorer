# Seven Wonders Scorer - Project Overview

## Purpose
Seven Wonders Scorer is a real-time score tracking application for the board game "7 Wonders". It allows multiple users to join rooms and collaboratively track scores across different scoring categories in real-time using WebSocket communication.

## Tech Stack

### Frontend
- **Framework**: Angular 19.2.8 (standalone components)
- **Styling**: TailwindCSS 4.1.4
- **State Management**: Signal-based state management
- **Real-time Communication**: Socket.io-client 4.8.1
- **Reactive Programming**: RxJS 7.8.0

### Backend
- **Framework**: NestJS 10.x
- **Real-time Communication**: Socket.io 4.8.1, @nestjs/websockets
- **Runtime**: Node.js

### Build & Development Tools
- **Monorepo Tool**: Nx 20.8.0
- **Language**: TypeScript 5.5.4
- **Testing**: Jest 29.7.0 (unit), Cypress 14.3.0 (E2E)
- **Linting**: ESLint 9.24.0
- **Formatting**: Prettier 3.5.3
- **Package Manager**: npm

## Project Type
- Nx monorepo with multiple applications
- Frontend and Backend as separate applications with E2E test suites

## Main Features
- Multi-user support with WebSocket real-time updates
- Room-based score management (multiple rooms supported)
- User authentication and session management
- Score tracking by category (military, science, treasury, commerce, guild, wonder, city, leaders, debt)
- Real-time score updates across all connected clients in a room