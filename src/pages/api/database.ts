import openDB from '../../utils/openDb';
import {updateItemTotals} from "@/utils/dbUtils";

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

    await updateItemTotals(item);

    await db.close();
    return result;
}

export async function addItemToDatabase(name: string, code: string, reorder_level: number) {
    const db = await openDB();

    const result = await db.run(
        'INSERT INTO items (name, code, reorder_level) VALUES (?, ?, ?)',
        [name, code, reorder_level]
    );

    await db.close();
    return result;
}
