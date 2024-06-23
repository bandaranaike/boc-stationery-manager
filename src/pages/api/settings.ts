import { NextApiRequest, NextApiResponse } from 'next';
import openDb from '../../utils/openDb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const db = await openDb();
            const settings = await db.all('SELECT id, name, value FROM settings');
            res.status(200).json(settings);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch settings' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
