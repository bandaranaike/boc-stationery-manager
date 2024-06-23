import openDb from '../../utils/openDb';

export async function updateItemsStockDetails() {
    const db = await openDb();

    const query = `
        WITH stock_summary AS (
            SELECT
                items.id AS item_id,
                COALESCE(SUM(stocks.stock * stocks.unit_price), 0) AS total_value,
                COALESCE(SUM(stocks.stock), 0) AS total_stock
            FROM items
                     LEFT JOIN stocks ON items.id = stocks.item_id
            GROUP BY items.id
        )
        UPDATE items
        SET
            total_value = stock_summary.total_value,
            total_stock = stock_summary.total_stock,
            status = CASE
                         WHEN stock_summary.total_stock > items.reorder_level THEN 'active'
                         ELSE 'order'
                END
        FROM stock_summary
        WHERE items.id = stock_summary.item_id;
    `;

    try {
        await db.exec(query);
        console.log('Items table updated successfully.');
    } catch (error) {
        console.error('Failed to update items table:', error);
    }
}
