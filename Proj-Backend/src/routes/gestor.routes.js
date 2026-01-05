const express = require("express");
const router = express.Router();

const getSupabase = require("../controllers/gestor/getSupabase.controller");
const login = require("../controllers/gestor/login.controller");

// Rotas
router.get("/get-supabase", getSupabase);
router.post("/login", login);

module.exports = router;
