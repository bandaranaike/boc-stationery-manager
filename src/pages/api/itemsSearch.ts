import { NextApiRequest, NextApiResponse } from 'next';
import openDb from '../../utils/openDb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const db = await openDb();
        const { text = '', onlyAvailable = 'false' } = req.query;

        // Build the query based on the onlyAvailable flag
        const query = `
            SELECT id, code, name 
            FROM items 
            WHERE (code LIKE ? OR name LIKE ?)
            ${onlyAvailable === 'true' ? 'AND (total_stock > 0)' : ''}
            ORDER BY code
            LIMIT 20
        `;

        const items = await db.all(query, [`%${text}%`, `%${text}%`]);

        await db.close();

        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
