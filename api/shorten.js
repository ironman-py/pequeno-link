import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const linkSchema = new mongoose.Schema({
    originalUrl: String,
    shortUrl: String,
});

const Link = mongoose.model('Link', linkSchema);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { originalUrl } = req.body;

        try {
            const shortUrl = Math.random().toString(36).substring(2, 8);
            const newLink = new Link({ originalUrl, shortUrl });
            await newLink.save();
            res.status(200).json({ originalUrl, shortUrl });
        } catch (error) {
            console.error('Erro ao salvar o link:', error);
            res.status(500).json({ error: 'Erro ao encurtar o link' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
