document.getElementById('shortenBtn').addEventListener('click', async () => {
    const urlInput = document.getElementById('urlInput').value;
    const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl: urlInput }),
    });

    if (!response.ok) {
        const errorText = await response.text(); // Obtenha a resposta como texto
        console.error('Erro na API:', errorText); // Log do erro
        alert('Erro ao encurtar o link: ' + errorText); // Exibe um alerta com o erro
        return; // Interrompe a execução se houver erro
    }

    const data = await response.json(); // Converta a resposta em JSON
    window.location.href = `/redirect.html?url=${encodeURIComponent(data.originalUrl)}`;
});
