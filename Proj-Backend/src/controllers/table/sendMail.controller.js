const supabase = require("../../config/supabase");
const transporter = require("../../config/mailer");

module.exports = async (req, res) => {
  try {
    const data = req.body;
    const produto = data.produto || {};

    const marcaNomeEspessura = `${produto.marca ?? ""} - ${produto.nome ?? ""} ${produto.espessura ?? ""}`;

    // Verificar estado atual
    const { data: itemData, error: fetchError } = await supabase
      .from("items")
      .select("estado")
      .eq("id", produto.id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!itemData) {
      return res.status(404).json({ message: "Produto não encontrado!" });
    }

    if (itemData.estado !== "on") {
      return res.status(400).json({
        message: "Este produto já não está disponível!",
      });
    }

    // Email
    await transporter.sendMail({
      from: `"${data.nome} - ${data.empresa}" <${process.env.SMTP_USER}>`,
      replyTo: data.email,
      to: process.env.SMTP_USER,
      subject: `Reserva da Referência - ${produto.id} | ${marcaNomeEspessura}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 900px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #F0F0F0; padding: 10px; text-align: center;">
            <img src="https://jipdtttjsmyllnaqggwy.supabase.co/storage/v1/object/public/imagens/logo_dark.webp" alt="Logo da Empresa" style="max-height: 120px;">
          </div>
          <table role="presentation" style="width: 100%; border-collapse: collapse; padding: 20px;">
            <tr>
              <td style="width: 50%; padding: 10px; vertical-align: top;background-color: #F0F0F0; border-top: 1px solid #e0e0e0; border-bottom: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0;">
                <h3>📦 Novo Pedido de Reserva</h3>
                <p><strong>Nome:</strong> ${data.nome}</p>
                <p><strong>Empresa:</strong> ${data.empresa}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Telefone:</strong> ${data.telefone}</p>
                <p><strong>Observação:</strong>${data.observacoes}</p>
              </td>
              <td style="width: 50%; padding: 10px; vertical-align: top;background-color: #F0F0F0; border-top: 1px solid #e0e0e0; border-bottom: 1px solid #e0e0e0;">
                <h3>📑 Produto Reservado</h3>
                <p><strong>Referência:</strong> ${produto.id}</p>
                <p><strong>Nome/Marca:</strong> ${marcaNomeEspessura}</p>
                <p><strong>Comprimento:</strong> ${produto.comprimento}</p>
                <p><strong>Largura:</strong> ${produto.largura}</p>
                <p><strong>Lote:</strong> ${produto.lote}</p>
                <p><strong>Tipo:</strong> ${produto.tipo}</p>
                <p><strong>Observação do Produto:</strong> ${produto.observacoes}</p>
                ${produto.foto ? `<img src="${produto.foto}" style="max-width:100%; margin-top: 10px; border-radius: 5px;">` : ""}
              </td>
            </tr>
          </table>
          <div style="background-color: #F0F0F0; padding: 15px; text-align: center; font-size: 12px; color: #777;">
            &copy; ${new Date().getFullYear()} Chapas e Sobras | Marmore Real, Lda.
          </div>
        </div>
      `,
    });

    // Atualizar estado
    await supabase
      .from("items")
      .update({ estado: "off", data_off: new Date().toISOString() })
      .eq("id", produto.id);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
