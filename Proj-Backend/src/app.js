const express = require("express");
const cors = require("cors");

// Rotas Table
const tableRoutes = require("./routes/table.routes");

// Rotas Gestor
const gestorRoutes = require("./routes/gestor.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Prefixo de API
app.use("/api/table", tableRoutes);
app.use("/api/gestor", gestorRoutes);

module.exports = app;
