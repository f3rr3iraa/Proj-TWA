require("dotenv").config();
const app = require("./app");

app.get("/api/table/itemsUpdates", async (req, res) => {
  // código adaptado do getItemsUpdates.js
  try {
    const lastCheck = parseInt(req.query.lastCheck) || 0;
    const lastDate = new Date(lastCheck);

    const { createClient } = require("@supabase/supabase-js");
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    const { data, error } = await supabase
      .from("items")
      .select("*")
      .or("estado.eq.off,estado.eq.nosso")
      .gt("data_off", lastDate.toISOString());

    if (error) throw error;

    res.json({ items: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 API a correr em http://localhost:${PORT}`)
);
