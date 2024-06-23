import { NextApiRequest, NextApiResponse } from 'next';
import openDb from '../../utils/openDb';
import { updateItemTotals, removeEmptyStocks } from '@/utils/dbUtils';

const MAX_RETRIES = 5;

async function executeWithRetry<T>(fn: () => Promise<T>, retries: number = MAX_RETRIES): Promise<T> {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message === 'SQLITE_BUSY' && i < retries - 1) {
                    await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms before retrying
                } else {
                    throw { success: false, error: error.message };
                }
            } else {
                throw new Error('An unknown error occurred');
            }
        }
    }
    throw new Error('Max retries reached');
}

const updateStocksAndItemTotals = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ error: 'Invalid items data' });
        }

        const db = await openDb();
        await db.run('PRAGMA journal_mode = WAL'); // Enable WAL mode

        // Update stocks
        await executeWithRetry(async () => {
            await db.run('BEGIN TRANSACTION');

            try {
                for (const item of items) {
                    for (const stock of item.stocks) {
                        await db.run('UPDATE stocks SET stock = stock - ? WHERE id = ?', [stock.stock, stock.id]);
                    }
                }

                await db.run('COMMIT');
            } catch (error) {
                await db.run('ROLLBACK');
                throw error;
            }
        });

        // Remove empty stocks and update item totals
        await executeWithRetry(async () => {
            await db.run('BEGIN TRANSACTION');

            try {
                for (const item of items) {
                    await removeEmptyStocks(item.id);
                    await updateItemTotals(item.id);
                }

                await db.run('COMMIT');
            } catch (error) {
                await db.run('ROLLBACK');
                throw error;
            }
        });

        res.status(200).json({ message: 'Stocks and item totals updated successfully' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("There was an error while updating stocks and item totals", error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.error("An unknown error occurred while updating stocks and item totals");
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

export default updateStocksAndItemTotals;
