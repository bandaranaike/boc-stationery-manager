import {NextApiRequest, NextApiResponse} from 'next';
import openDb from '../../utils/openDb'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const db = await openDb();
        const items = await db.all('SELECT id, code, name, total_value, total_stock, status FROM items');
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};
