import {NextApiRequest, NextApiResponse} from 'next';
import {addStockToDatabase} from './database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const {item, unit_price, quantity} = req.body;
            const result = await addStockToDatabase({item, unit_price, quantity});
            res.status(200).json({success: true, data: result});
        } catch (error) {
            res.status(500).json({success: false, error: error.message});
        }
    } else {
        res.status(405).json({success: false, message: 'Method Not Allowed'});
    }
}
