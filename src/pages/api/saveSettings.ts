import { NextApiRequest, NextApiResponse } from 'next';
import  openDb  from '../../utils/openDb';

export default async function saveSettings(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const db = await openDb();
            const { id, value } = req.body;

            await db.run(
                `UPDATE settings SET value = ? WHERE id = ?`,
                value, id
            );

            res.status(200).json({ message: 'Setting saved successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to save setting' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
