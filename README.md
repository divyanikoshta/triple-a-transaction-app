# Triple A Transaction App
A modern money transfer portal built with React, TypeScript, and Tailwind CSS. This application provides a clean interface for managing financial accounts and transferring funds between internal accounts.

## Tech Stack
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library

## Prerequisites
- Node.js (version 16 or higher)
- Docker (for running the API server)
- npm or yarn

## Getting Started

### 1. Start the API Server
First, run the backend API server using Docker:
```bash
docker run -p 8860:8860 tripleaio/transfer-api-server
```
This will start the API server on port 8860.

### 2. Clone the Repository
```bash
git clone https://github.com/divyanikoshta/triple-a-transaction-app.git
cd triple-a-transaction-app
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

## Available Scripts
- `npm run dev` - Start development server
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report

## Project Structure
```
src/
├── components/                    # Reusable UI components
│   ├── ui/                        # Basic UI components (Button, Input, etc.) with test cases
│   └── ...                        # Feature-specific components
├── pages/                         # Page components
│   ├── AddAccount.tsx             # Account creation page
│   ├── AddAccount.test.tsx        # Account creation tests
│   ├── AccountDetails.tsx         # Account search page
│   ├── AccountDetails.test.tsx    # Account search tests
│   ├── TransferFunds.tsx          # Fund transfer page
│   └── TransferFunds.test.tsx     # Fund transfer tests
├── redux-store/                   # Redux store and slices
├── services/                      # API service layer
└── ...
```

## API Endpoints
The application connects to the following API endpoints:
- `POST /accounts` - Create new account
- `GET /accounts/:id` - Get account details
- `POST /transactions` - Transfer funds between accounts

## Features Overview

### Add Account
- Create new financial accounts with unique IDs, with validation for entering numbers only in the account ID field
- Set initial account balance
- View recently added accounts, which should ideally come from the API, but since there is no API exposed from the backend, I am using Redux to store recently added accounts

### Account Details
- Search accounts by ID using dropdown or custom input
- View current account balance

### Transfer Funds
- Transfer money between internal accounts
- Form validation (required fields, positive amounts, different accounts)

## Testing
Run the test suite:
```bash
npm run test
```

## Troubleshooting

**API Connection Issues**
- Ensure Docker is running and the API server is started on port 8860
- Check that no other services are using port 8860

**Build Issues**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Ensure you're using Node.js version 16 or higher

**Test Issues**
- Make sure all dependencies are installed
- Check that the test environment is properly configured