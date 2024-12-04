import { NextApiRequest, NextApiResponse } from 'next';
import { updateItemsStockDetails } from './updateItemsStockDetails';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            await updateItemsStockDetails();
            res.status(200).json({ message: 'Items table updated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update items table' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
