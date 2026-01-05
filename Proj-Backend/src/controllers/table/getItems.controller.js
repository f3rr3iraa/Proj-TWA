const supabase = require("../../config/supabase");

module.exports = async (req, res) => {
  try {
    const { marca, nome, tipo, from = 0, to = 9 } = req.query;

    let query = supabase
      .from("items_view")
      .select("*", { count: "exact" })
      .eq("estado", "on")
      .order("id", { ascending: false })
      .range(Number(from), Number(to));

    if (marca) {
      query = query.ilike("marca", `${marca.trim()}%`);
    }

    if (nome) {
      const nomeClean = nome.toLowerCase().replace(/[-\s]/g, "");
      query = query.ilike(
        "marca_nome_espessura_clean",
        `%${nomeClean}%`
      );
    }

    if (tipo && tipo !== "Todos") {
      query = query.eq("tipo", tipo);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({
      items: data,
      totalItems: count || data.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
