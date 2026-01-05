// Retorna URL e chave anon do Supabase (somente leitura)
module.exports = async (req, res) => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    res.json({ supabaseUrl, supabaseKey });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
