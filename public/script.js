document.getElementById('shortenBtn').addEventListener('click', async () => {
    const urlInput = document.getElementById('urlInput').value;
    const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl: urlInput }),
    });
    const data = await response.json();
    
    // Redireciona para a página redirect.html com o URL original
    window.location.href = `/redirect.html?url=${encodeURIComponent(data.originalUrl)}`;
});
