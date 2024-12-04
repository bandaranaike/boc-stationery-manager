import {NextApiRequest, NextApiResponse} from 'next';
import {jsPDF} from 'jspdf';
import 'jspdf-autotable';
import fs from 'fs';
import path from 'path';
import formatDate from "@/utils/dateUtils";
import {updateItemsStockDetails} from "@/pages/api/updateItemsStockDetails";
import {format} from "@/utils/utills";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const {items, branchName, branchCode} = req.body;

        if (!items || !Array.isArray(items) || !branchCode || !branchName) {
            return res.status(400).json({error: 'Invalid request data'});
        }

        const date = formatDate();

        const doc = new jsPDF();
        doc.setFontSize(11)
        doc.text('Central Province Office, Kandy', 10, 10);
        doc.text('ADVICE OF DEBIT', 90, 20);
        doc.text(`Branch Code: ${branchCode}`, 10, 30);
        doc.text(`Branch Name: ${branchName}`, 10, 37);
        doc.text(`Stationery Charges for : ${date}`, 10, 44);

        const itemRows = items.map((item: any) => [
            item.code,
            item.name,
            format(item.quantity, 0),
            item.stocks.map((stock: any) => format(stock.unit_price)).join(', '),
            format(item.total_value),
        ]);

        // @ts-ignore
        doc.autoTable({
            head: [['Code', 'Stationery', 'Qty', 'Unit Prices', 'Cost']],
            body: itemRows,
            startY: 54,
            margin: {left: 10, right: 10, top: 0, bottom: 0},
            columnStyles: {
                2: {halign: 'right'},
                3: {halign: 'right'},
                4: {halign: 'right'},
            },
        });

        const grandTotal = items.reduce((sum: number, item: any) => sum + item.total_value, 0);

        const pageWidth = doc.internal.pageSize.getWidth();
        const text = `Grand Total: ${format(grandTotal)}`;
        const textWidth = doc.getTextWidth(text);
        const xPosition = pageWidth - textWidth - 11; // Adjust position based on page width and margin
        // @ts-ignore
        doc.text(text, xPosition, doc.autoTable.previous.finalY + 10);

        // @ts-ignore
        doc.text('..............................', 10, doc.autoTable.previous.finalY + 40);
        // @ts-ignore
        doc.text('Authorized Officer', 10, doc.autoTable.previous.finalY + 46);

        const dateTime = Date.now();
        const directoryPath = path.join(process.cwd(), 'invoices', branchCode);

        // Ensure the directory exists
        fs.mkdirSync(directoryPath, {recursive: true});

        const filePath = path.join(directoryPath, `${date}-${dateTime}.pdf`);
        const pdfBuffer = doc.output('arraybuffer');

        fs.writeFileSync(filePath, Buffer.from(pdfBuffer));

        await updateItemsStockDetails();

        res.status(200).json({message: 'PDF generated successfully', filePath});
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}
