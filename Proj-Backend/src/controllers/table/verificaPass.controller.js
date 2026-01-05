const crypto = require("crypto");

module.exports = async (req, res) => {
  const { pass } = req.query;

  if (!pass || pass !== process.env.SITE_PASSWORD) {
    return res.json({ autorizado: false });
  }

  const token = crypto
    .createHmac("sha256", process.env.TOKEN_SECRET)
    .update("auth")
    .digest("hex");

  res.json({ autorizado: true, token });
};
