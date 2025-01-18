import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const linkSchema = new mongoose.Schema({
    originalUrl: String,
    shortUrl: String,
});

const Link = mongoose.model('Link', linkSchema);


export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { originalUrl } = req.body;

            if (!originalUrl) {
                return res.status(400).json({ error: 'URL original é obrigatória.' });
            }

            const shortUrl = Math.random().toString(36).substring(2, 8);
            const newLink = new Link({ originalUrl, shortUrl });
            await newLink.save();

            return res.status(200).json({ originalUrl, shortUrl });
        } catch (error) {
            console.error('Erro ao processar a requisição:', error);
            return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
