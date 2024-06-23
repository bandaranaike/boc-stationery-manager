import { NextApiRequest, NextApiResponse } from 'next';
import openDb from '../../utils/openDb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const db = await openDb();
        const { text = '', availability = 0 } = req.query;

        // Ensure availability is treated as a number
        const availabilityNumber = parseInt(availability as string, 10);

        // Query the database for items matching the search text and with total_stock greater than the availability threshold
        const items = await db.all(
            'SELECT id, code, name FROM items WHERE (code LIKE ? OR name LIKE ?) AND (total_stock >= ?) LIMIT 20',
            [`%${text}%`, `%${text}%`, availabilityNumber]
        );

        await db.close();

        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
