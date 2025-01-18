const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB', err));

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Modelo de Link
const linkSchema = new mongoose.Schema({
    originalUrl: String,
    shortUrl: String,
});

const Link = mongoose.model('Link', linkSchema);

// Rota para encurtar link
app.post('/shorten', async (req, res) => {
    const { originalUrl } = req.body;
    const shortUrl = Math.random().toString(36).substring(2, 8); // Gera um código curto
    const newLink = new Link({ originalUrl, shortUrl });
    await newLink.save();
    console.log(`Link encurtado: ${shortUrl} para ${originalUrl}`); // Log para depuração
    res.json({ originalUrl, shortUrl });
});

// Rota para redirecionar o link encurtado
app.get('/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params;
    console.log(`Buscando link para o shortUrl: ${shortUrl}`); // Log para depuração
    const link = await Link.findOne({ shortUrl });

    if (link) {
        const redirectUrl = `/redirect.html?url=${encodeURIComponent(link.originalUrl)}`;
        console.log(`Redirecionando para: ${redirectUrl}`); // Log para depuração
        return res.redirect(redirectUrl);
    } else {
        console.log('Link não encontrado'); // Log para depuração
        return res.status(404).send('Link não encontrado');
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
