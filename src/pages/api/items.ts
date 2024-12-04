import {NextApiRequest, NextApiResponse} from 'next';
import openDb from '../../utils/openDb'
import {updateItemTotals} from "@/utils/dbUtils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await openDb();

    try {
        switch (req.method) {
            case 'GET':
                const items = await db.all('SELECT id, code, name, total_value, total_stock, reorder_level, status FROM items ORDER BY code');
                res.status(200).json(items);
                break;

            case 'POST':
                const {name, code, reorder_level} = req.body;
                if (!name || !code || reorder_level === undefined) {
                    return res.status(400).json({message: 'Name, code, and reorder level are required'});
                }

                const status = reorder_level > 0 ? 'order' : 'active';

                await db.run('INSERT INTO items (name, code, reorder_level,status) VALUES (?, ?, ?, ?)', [name, code, reorder_level, status]);
                res.status(201).json({message: 'Item created successfully'});
                break;

            case 'PUT':
                const {id, newName, newCode, newReorderLevel} = req.body;
                if (!id || !newName || !newCode || newReorderLevel === undefined) {
                    return res.status(400).json({message: 'ID, name, code, and reorder level are required'});
                }
                await db.run('UPDATE items SET name = ?, code = ?, reorder_level = ? WHERE id = ?', [newName, newCode, newReorderLevel, id]);

                // If the reorder_level got changed, the status may be differed
                await updateItemTotals(id);

                res.status(200).json({message: 'Item updated successfully'});
                break;

            case 'DELETE':
                const {deleteId} = req.body;
                if (!deleteId) {
                    return res.status(400).json({message: 'ID is required'});
                }
                await db.run('DELETE FROM items WHERE id = ?', [deleteId]);
                await db.run('DELETE FROM stocks WHERE item_id = ?', [deleteId]);
                res.status(200).json({message: 'Item deleted successfully'});
                break;

            default:
                res.status(405).end(); // Method Not Allowed
                break;
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    } finally {
        await db.close();
    }
}
