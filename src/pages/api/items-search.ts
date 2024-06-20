import { NextApiRequest, NextApiResponse } from 'next';
import openDB from './openDb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await openDB();
    const { text = '' } = req.query;
    const items = await db.all(
        'SELECT id, code, name FROM items WHERE code LIKE ? OR name LIKE ? LIMIT 20',
        [`%${text}%`, `%${text}%`]
    );
    await db.close();
    res.status(200).json(items);
}
