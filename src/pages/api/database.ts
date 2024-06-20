import openDB from './openDb';

export async function addStockToDatabase({item, unit_price, quantity}: {
    item: number,
    unit_price: number,
    quantity: number
}) {
    const db = await openDB();

    const result = await db.run(
        'INSERT INTO stocks (item_id, date, unit_price, stock, initial_stock) VALUES (?, ?, ?, ?, ?)',
        [item, new Date().toISOString().split('T')[0], unit_price, quantity, quantity]
    );

    await db.close();
    return result;
}

export async function addItemToDatabase(name: string, code: string) {
    const db = await openDB();

    const result = await db.run(
        'INSERT INTO items (name, code) VALUES (?, ?)',
        [name, code]
    );

    await db.close();
    return result;
}
