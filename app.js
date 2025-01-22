const express = require('express');

// Routes
const mainRoutes = require("./routes/mainRoutes")

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", mainRoutes);

app.get('/', (req, res) => {
    res.json({
        message: "I'm alive!"
    });
});

module.exports = app;