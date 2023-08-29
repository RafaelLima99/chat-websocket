function formatarDataHora(data) {
    const dia     = data.getDate().toString().padStart(2, '0');
    const mes     = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano     = data.getFullYear();
    const horas   = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');

    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}


async function chatMensagens(chatId) {

    const data = {chatId: chatId}

    try {
        const response = await fetch('/api/mensagens-chat.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        });

        if (!response.ok) {
        throw new Error('Erro na requisição')
        }

        const responseData = await response.json()
        return responseData;

    } catch (error) {
        console.error('Erro:', error)
        throw error;
    }
}





