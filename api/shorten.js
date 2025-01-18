const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const linkSchema = new mongoose.Schema({
    originalUrl: String,
    shortUrl: String,
});

const Link = mongoose.model('Link', linkSchema);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { originalUrl } = req.body;
        const shortUrl = Math.random().toString(36).substring(2, 8); // Gera um código curto
        const newLink = new Link({ originalUrl, shortUrl });
        await newLink.save();
        console.log(`Link encurtado: ${shortUrl} para ${originalUrl}`); // Log para depuração
        res.json({ originalUrl, shortUrl });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
