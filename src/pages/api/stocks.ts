import {NextApiRequest, NextApiResponse} from 'next';
import openDb from './openDb'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const {itemId} = req.query;
        if (!itemId) {
            return res.status(400).json({error: 'Item ID is required'});
        }

        const db = await openDb();
        const stocks = await db.all('SELECT id, item_id, date, unit_price, stock, initial_stock FROM stocks WHERE item_id = ?', [itemId]);
        res.status(200).json(stocks);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};
