import {NextApiRequest, NextApiResponse} from 'next';
import {jsPDF} from 'jspdf';
import 'jspdf-autotable';
import fs from 'fs';
import path from 'path';
import openDb from '../../utils/openDb';
import {updateItemsStockDetails} from "@/pages/api/updateItemsStockDetails";
import {format} from "@/utils/utills";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end(); // Method Not Allowed
    }

    try {
        await updateItemsStockDetails();

        const db = await openDb();
        const items = await db.all('SELECT code, name, total_stock, total_value FROM items WHERE total_stock > 0');

        if (items.length === 0) {
            return res.status(404).json({message: 'No items found'});
        }

        // Calculate the total value of all items
        const totalValue = items.reduce((sum, item) => sum + item.total_value, 0);

        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0];
        const formattedTime = date.toTimeString().split(' ')[0].replace(/:/g, '-');

        const doc = new jsPDF();
        doc.setFontSize(11);
        doc.text('Central Province Office, Kandy', 10, 10);
        doc.text('STOCK REPORT', 90, 20);
        doc.text(`Date: ${formattedDate}`, 10, 30);

        const itemRows = items.map(item => [
            item.code,
            item.name,
            format(item.total_stock, 0),
            format(item.total_value),
        ]);

        // @ts-ignore
        doc.autoTable({
            head: [['Code', 'Name', 'Total Stock', 'Total Value']],
            body: itemRows,
            startY: 40,
            margin: {left: 10, right: 10, top: 0, bottom: 0},
            columnStyles: {
                2: {halign: 'right'},
                3: {halign: 'right'},
            },
        });

        // Add total value text
        const pageWidth = doc.internal.pageSize.getWidth();
        const text = `Stock total value: ${format(totalValue)}`;
        const textWidth = doc.getTextWidth(text);
        const xPosition = pageWidth - textWidth - 11; // Adjust position based on page width and margin
        // @ts-ignore
        doc.text(text, xPosition, doc.autoTable.previous.finalY + 10);

        const directoryPath = path.join(process.cwd(), 'invoices', 'reports');

        // Ensure the directory exists
        fs.mkdirSync(directoryPath, {recursive: true});

        const filePath = path.join(directoryPath, `${formattedDate}-${formattedTime}.pdf`);
        const pdfBuffer = doc.output('arraybuffer');

        fs.writeFileSync(filePath, Buffer.from(pdfBuffer));

        res.status(200).json({message: 'PDF generated successfully', filePath});
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}
