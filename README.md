# <span style="color: #4CAF50;">Patriot System Backend</span>

This repository contains the backend services for the Patriot System, a comprehensive platform for managing orders, materials, users, and an innovative glass-cutting optimization feature.

## <span style="color: #2196F3;">Table of Contents</span>

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Glass Cutting Optimization](#glass-cutting-optimization)
- [Database Models](#database-models)
- [Contributing](#contributing)
- [License](#license)

---

## <span style="color: #2196F3;">Features</span>

The Patriot System backend provides a robust set of functionalities, including:

-   **<span style="color: #FF9800;">Order Management:</span>** Create, read, update, and delete orders, manage order items, and track order stages.
-   **<span style="color: #FF9800;">User Management:</span>** Secure user authentication, roles, and profile management.
-   **<span style="color: #FF9800;">Material Management:</span>** Keep track of various materials used in production.
-   **<span style="color: #FF9800;">Product and Category Management:</span>** Organize products into categories for efficient browsing.
-   **<span style="color: #FF9800;">Location Management:</span>** Manage cities and states relevant to your operations.
-   **<span style="color: #FF9800;">Review System:</span>** Allow users to leave product reviews.
-   **<span style="color: #FF9800;">Notifications:</span>** Real-time notification system for users.
-   **<span style="color: #FF9800;">Permissions:</span>** Granular control over user permissions within the system.
-   **<span style="color: #FF9800;">Glass Cutting Optimization:</span>** An advanced module that uses genetic algorithms and maximal rectangles algorithms to optimize glass cutting patterns, minimizing waste and maximizing efficiency.
-   **<span style="color: #FF9800;">Order Code Verification:</span>** Secure verification of order codes.
-   **<span style="color: #FF9800;">Driver Management:</span>** Specific endpoints for managing drivers.

---

## <span style="color: #2196F3;">Technologies</span>

The backend is built with the following technologies:

-   **<span style="color: #8BC34A;">NestJS:</span>** A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
-   **<span style="color: #8BC34A;">TypeScript:</span>** A typed superset of JavaScript that compiles to plain JavaScript.
-   **<span style="color: #8BC34A;">TypeORM:</span>** An ORM (Object Relational Mapper) that runs on various platforms and supports multiple databases.
-   **<span style="color: #8BC34A;">PostgreSQL (or other relational database):</span>** The primary data store.
-   **<span style="color: #8BC34A;">Genetic Algorithm:</span>** Used for optimizing glass cutting patterns.
-   **<span style="color: #8BC34A;">Maximal Rectangles Algorithm:</span>** Part of the glass cutting optimization logic.

---

## <span style="color: #2196F3;">Installation</span>

To get the Patriot System backend up and running on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [your-repository-url]
    cd patriot-system-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up your environment variables:**
    Create a `.env` file in the root directory and populate it with the necessary environment variables (e.g., database connection details, JWT secrets). A `.env.example` file should be provided as a guide.

    ```dotenv
    # Example .env content
    PORT=3000
    DATABASE_TYPE=postgres
    DATABASE_HOST=localhost
    DATABASE_PORT=5432
    DATABASE_USERNAME=your_username
    DATABASE_PASSWORD=your_password
    DATABASE_NAME=patriot_system_db
    JWT_SECRET=your_jwt_secret
    ```

4.  **Run database migrations:**
    Ensure your database is set up and then run the migrations to create the necessary tables.
    ```bash
    npm run typeorm migration:run
    # or
    yarn typeorm migration:run
    ```

---

## <span style="color: #2196F3;">Configuration</span>

All configuration is primarily managed through environment variables (`.env` file). Refer to the `.env.example` for a comprehensive list of configurable options.

---

## <span style="color: #2196F3;">Running the Application</span>

To run the application in development mode:

```bash
npm run start:dev
# or
yarn start:dev

To build and run the application in production mode:

npm run build
npm run start:prod
# or
yarn build
yarn start:prod

The application will typically be available at http://localhost:3000 (or the port specified in your .env file)
