# Balance Buddy

Balance Buddy is a comprehensive financial management application that helps users track their expenses, manage budgets, and achieve their financial goals.

## Features

- Expense tracking and categorization
- Budget management
- Financial goal setting and tracking
- Interactive dashboards and reports
- User authentication and profile management

## Project Structure

The project is divided into two main components:

- `Frontend/`: Contains the React-based user interface
- `Backend/`: Contains the Node.js/Express server and API endpoints

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Git

## Getting Started

### Frontend Setup

1. Navigate to the Frontend directory:

   ```bash
   cd Frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the Backend directory:

   ```bash
   cd Backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in both Frontend and Backend directories with the following variables:

### Frontend

```
REACT_APP_API_URL=http://localhost:5000
```

### Backend

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any queries or support, please reach out to [your-email@example.com]
