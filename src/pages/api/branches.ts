import { NextApiRequest, NextApiResponse } from 'next';
import  openDb  from './openDb';

const getBranches = async (req: NextApiRequest, res: NextApiResponse) => {
    const db = await openDb();
    const branches = await db.all('SELECT code, name FROM branches');
    res.json(branches);
};

export default getBranches;
