import requests

# URL do webhook do Discord (substitua pela sua)
webhook_url = "https://discord.com/api/webhooks/1344344187876806656/w42XEPq_cfVjNcLjsqXo7l_j3VPdAU3sm1IlvBe6X0tRq3HtzVgfB_MBJPRntcS9uqdG"

# Mensagem formatada para o Discord
mensagem = {
    "content": "**\U0001F4CA Relatório Financeiro**\n"
               "💰 **Venda de Minérios:** R$ 12.535,00\n"
               "🏡 **Aluguel da Casa:** -R$ 35.000,00\n"
               "💸 **Gastos Diversos:** -R$ 17.688,00\n"
               "🔹 **Gasto com Radiador Novo:** -R$ 2.000,00\n"
               "\n"
               "📌 **Saldo Atual:**\n"
               "💵 **Dinheiro:** R$ 664\n"
               "🏦 **Banco:** R$ 30.799\n"
}

# Enviar mensagem para o webhook do Discord
response = requests.post(webhook_url, json=mensagem)

# Verificar se o envio foi bem-sucedido
if response.status_code == 204:
    print("✅ Relatório enviado com sucesso para o Discord!")
else:
    print(f"❌ Erro ao enviar: {response.status_code} - {response.text}")
