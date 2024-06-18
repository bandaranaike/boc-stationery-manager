import openDB from './openDb';

export async function addStockToDatabase({item, unit_price, quantity}) {
    const db = await openDB();

    const result = await db.run(
        'INSERT INTO stocks (item_id, date, unit_price, stock, initial_stock) VALUES (?, ?, ?, ?, ?)',
        [item, new Date().toISOString(), unit_price, quantity, quantity]
    );

    await db.close();
    return result;
}
