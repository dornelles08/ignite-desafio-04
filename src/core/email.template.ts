export function emailTemplate(clientName: string, orderNumber: string, newStatus: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Atualização de Pedido</title>
      </head>
      <body
        style="
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        "
      >
        <p>Prezado(a) ${clientName},</p>

        <p>Seu pedido teve uma atualização de status: <strong>${newStatus}</strong>.</p>

        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0">
          <h3 style="margin-top: 0">Detalhes do pedido:</h3>
          <p style="margin: 5px 0">Número do pedido: ${orderNumber}</p>
        </div>

        <p style="margin-top: 30px">
          Atenciosamente,<br />
          Felipe Dornelles<br />
          FastFeet
        </p>
      </body>
    </html>
  `;
}
