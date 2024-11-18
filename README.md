# Secret files API

This is a simple Express application scaffolded with ESLint and Prettier for code quality and formatting.

## Project Structure

```
my-express-app
├── src
│   ├── app.js            # Entry point of the application
│   ├── controllers       # Contains controllers for handling requests
│   │   └── index.js      # Index controller
│   ├── routes            # Contains route definitions
│   │   └── index.js      # Route setup
│   └── types             # Custom types or interfaces (if needed)
├── .eslintrc.json        # ESLint configuration
├── .prettierrc           # Prettier configuration
├── package.json          # NPM configuration
└── README.md             # Project documentation
```

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/erickpac/secret-files-api
   ```

2. Navigate to the project directory:

   ```
   cd secret-files-api
   ```

3. Install the dependencies:

   ```
   yarn install
   ```

4. Run the application in development mode:

   ```
   yarn dev
   ```

   This will start the server with nodemon, which automatically restarts the server when file changes are detected.

## Scripts

- `yarn dev`: Starts the application in development mode with nodemon.
- `yarn start`: Starts the Express server.
- `yarn lint`: Runs ESLint to check for code quality issues.
- `yarn format`: Formats the code using Prettier.
- `yarn test`: Runs the test suite.

## License

This project is licensed under the MIT License.
