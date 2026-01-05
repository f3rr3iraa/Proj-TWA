const supabase = require("../../config/supabase");

module.exports = async (req, res) => {
  try {
    const lastCheck = parseInt(req.query.lastCheck) || 0;
    const lastDate = new Date(lastCheck);

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
};
