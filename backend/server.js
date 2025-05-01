import app, { initializeDatabaseTables } from "./index.js";
import dotenv from "dotenv";
import { testConnection } from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

// First test the database connection
testConnection()
  .then(connected => {
    if (!connected) {
      console.error("Database connection failed, but continuing startup...");
    }
    
    // Initialize database tables
    return initializeDatabaseTables();
  })
  .then(() => {
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database tables:", error);
    // Don't exit in production
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  });

