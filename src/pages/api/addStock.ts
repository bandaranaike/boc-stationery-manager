import {NextApiRequest, NextApiResponse} from 'next';
import {addStockToDatabase} from './database';
import {updateItemTotals} from "@/utils/dbUtils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const {item, unit_price, quantity} = req.body;
            const result = await addStockToDatabase({item, unit_price, quantity});

            // When stock updated, items table should be updated
            await updateItemTotals(item);

            res.status(200).json({success: true, data: result});
        } catch (error: unknown) {
            // Use a type guard to check if the error is an instance of Error
            if (error instanceof Error) {
                res.status(500).json({success: false, error: error.message});
            } else {
                // Handle other types of errors (e.g., strings, objects)
                res.status(500).json({success: false, error: 'An unknown error occurred'});
            }
        }
    } else {
        res.status(405).json({success: false, message: 'Method Not Allowed'});
    }
}
