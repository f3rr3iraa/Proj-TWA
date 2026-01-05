// Login simples para o gestor
module.exports = async (req, res) => {
  try {
    const LOGIN_WEB_USER = process.env.LOGIN_WEB_USER;
    const LOGIN_WEB_PASS = process.env.LOGIN_WEB_PASS;

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username e password obrigatórios!" });
    }

    if (username === LOGIN_WEB_USER && password === LOGIN_WEB_PASS) {
      const token = Buffer.from(`${username}:no-exp`).toString("base64");
      return res.json({ message: "Login bem-sucedido", token });
    } else {
      return res.status(401).json({ message: "❌ Utilizador ou senha inválidos!" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
