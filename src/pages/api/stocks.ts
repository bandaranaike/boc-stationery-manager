import {NextApiRequest, NextApiResponse} from 'next';
import openDb from '../../utils/openDb';
import {updateItemTotals} from "@/utils/dbUtils";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const db = await openDb();

    if (req.method === 'GET') {
        const {itemId} = req.query;

        if (!itemId) {
            return res.status(400).json({error: 'Item ID is required'});
        }

        try {
            const stocks = await db.all(
                'SELECT id, item_id, date, unit_price, stock, initial_stock FROM stocks WHERE item_id = ?',
                [itemId]
            );
            res.status(200).json(stocks);
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    } else if (req.method === 'POST') {
        const {item_id, date, unit_price, stock, initial_stock} = req.body;

        if (!item_id || !date || !unit_price || !stock || !initial_stock) {
            return res.status(400).json({error: 'All stock fields are required'});
        }

        try {
            const result = await db.run(
                'INSERT INTO stocks (item_id, date, unit_price, stock, initial_stock) VALUES (?, ?, ?, ?, ?)',
                [item_id, date, unit_price, stock, initial_stock]
            );
            res.status(201).json({message: 'Stock added successfully', id: result.lastID});
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Failed to add stock'});
        }
    } else if (req.method === 'DELETE') {
        const {id, itemId} = req.body;

        if (!id) {
            return res.status(400).json({error: 'Stock ID is required'});
        }
        if (!itemId) {
            return res.status(400).json({error: 'Item ID is required'});
        }

        try {
            await db.run('DELETE FROM stocks WHERE id = ?', [id]);
            console.log("itemId", itemId)
            await updateItemTotals(itemId);
            res.status(200).json({message: 'Stock deleted successfully' + itemId});
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Failed to delete stock'});
        }
    } else {
        res.status(405).json({error: 'Method not allowed'});
    }
}
