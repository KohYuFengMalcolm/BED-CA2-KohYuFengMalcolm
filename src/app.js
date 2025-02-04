const express = require("express");
const path = require("path");

const mainRoutes = require("./routes/mainRoutes");
const collectionRoutes = require("./routes/collectionRoutes"); // Import your collection routes
const app = express();

// Middleware to parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.resolve("public")));

// Routes
app.use("/", mainRoutes); // Main routes
app.use("/api/cards", collectionRoutes); // Mount collection routes under /api/cards

// Serve the index.html file for the root route
app.get("/", (req, res) => {
  res.sendFile(path.resolve("public", "index.html"));
});

// Fallback route for undefined paths
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

module.exports = app;