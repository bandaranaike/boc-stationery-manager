import { NextApiRequest, NextApiResponse } from 'next';
import openDb from '../../utils/openDb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await openDb();

    switch (req.method) {
        case 'GET':
            const branches = await db.all('SELECT id, name, code FROM branches');
            res.status(200).json(branches);
            break;

        case 'POST':
            const { name, code } = req.body;
            if (!name || !code) {
                return res.status(400).json({ message: 'Name and code are required' });
            }
            await db.run('INSERT INTO branches (name, code) VALUES (?, ?)', [name, code]);
            res.status(201).json({ message: 'Branch created successfully' });
            break;

        case 'PUT':
            const { id, newName, newCode } = req.body;
            if (!id || !newName || !newCode) {
                return res.status(400).json({ message: 'ID, name, and code are required' });
            }
            await db.run('UPDATE branches SET name = ?, code = ? WHERE id = ?', [newName, newCode, id]);
            res.status(200).json({ message: 'Branch updated successfully' });
            break;

        case 'DELETE':
            const { deleteId } = req.body;
            if (!deleteId) {
                return res.status(400).json({ message: 'ID is required' });
            }
            await db.run('DELETE FROM branches WHERE id = ?', [deleteId]);
            res.status(200).json({ message: 'Branch deleted successfully' });
            break;

        default:
            res.status(405).end(); // Method Not Allowed
            break;
    }
}
