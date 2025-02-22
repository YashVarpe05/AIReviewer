const express = require("express");
const aiRoutes = require("./routes/ai.routes"); // Import directly
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.use("/ai", aiRoutes); // Use the router directly, not aiRoutes.router

module.exports = app;
