import {open} from "sqlite";
import sqlite3 from "sqlite3";

const openDb = async () => {
    return open({
        filename: 'database/stationery_stock.db',
        driver: sqlite3.Database
    });
};

export default openDb;