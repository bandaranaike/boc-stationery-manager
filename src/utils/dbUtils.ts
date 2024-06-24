import openDb from './openDb';

export async function updateItemTotals(itemId: number): Promise<{ totalValue: number; totalStock: number; }> {
    try {
        if (!itemId) {
            throw new Error('Item ID is required');
        }

        const db = await openDb();

        // Calculate total value and total stock in a single query using aggregation
        const result = await db.get(`
            SELECT COALESCE(SUM(stocks.unit_price * stocks.stock), 0) AS totalValue,
                   COALESCE(SUM(stocks.stock), 0)                     AS totalStock
            FROM stocks
            WHERE stocks.item_id = ?
        `, [itemId]);

        // Update the items table with the new totals
        await db.run(
            `UPDATE items
             SET total_value = ?,
                 total_stock = ?
             WHERE id = ?`,
            [result.totalValue, result.totalStock, itemId]
        );

        // Update the items table with the new totals
        await db.run(
            `UPDATE items
             SET status = CASE
                              WHEN total_stock > reorder_level THEN 'active'
                              ELSE 'order'
                 END
             WHERE id = ?`,
            [itemId]
        );

        return {totalValue: result.totalValue, totalStock: result.totalStock};
    } catch (error) {
        console.error(error);
        throw new Error('Internal Server Error');
    }
}

export async function removeEmptyStocks(itemId: number): Promise<void> {
    try {
        if (!itemId) {
            throw new Error('Item ID is required');
        }

        const db = await openDb();

        // Delete stocks with zero quantity for the given itemId
        await db.run('DELETE FROM stocks WHERE item_id = ? AND stock = 0', [itemId]);

        console.log(`Empty stocks removed for item ID: ${itemId}`);
    } catch (error) {
        console.error(error);
        throw new Error('Internal Server Error');
    }
}
