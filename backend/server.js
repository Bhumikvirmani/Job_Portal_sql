import app, { initializeDatabaseTables } from "./index.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8000;

// Initialize database tables
initializeDatabaseTables()
  .then(() => {
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database tables:", error);
    process.exit(1);
  });
