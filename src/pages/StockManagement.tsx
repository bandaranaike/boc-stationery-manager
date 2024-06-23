import TableComponent from '../components/TableComponent';
import AddItemModal from "@/components/AddItemModal";
import AddStockModal from "@/components/AddStockModal";
import {useState} from "react";

export default function StockManagement() {
    const [reload, setReload] = useState(false);

    const handleItemAdd = () => {
        setReload(!reload);
    }

    const exportToPdf = async () => {
        const response = await fetch('/api/generateReport', {
            method: 'POST',
        });

        if (response.ok) {
            alert('PDF generated successfully.');
        } else {
            alert('Failed to generate PDF.');
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center">
                <h2 className="text-3xl mb-6">Stock management</h2>
                <div className="flex">
                    <AddItemModal onItemAdded={handleItemAdd}/>
                    <AddStockModal/>
                    <button
                        className="block ml-2 py-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={exportToPdf}
                    >
                        Generate report
                    </button>
                </div>
            </div>
            <TableComponent reload={reload}/>
        </div>
    );
}
