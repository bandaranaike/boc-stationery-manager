import TableComponent from '../components/TableComponent';
import AddItemModal from "@/components/AddItemModal";
import AddStockModal from "@/components/AddStockModal";
import {useState} from "react";

export default function StockManagement() {
    const [reload, setReload] = useState(false);

    const handleItemAdd = () => {
        setReload(!reload);
    }

    return (
        <div>
            <div className="flex justify-between items-center">
                <h2 className="text-3xl mb-6">Stock management</h2>
                <div className="flex">
                    <AddItemModal onItemAdded={handleItemAdd}/>
                    <AddStockModal/>
                </div>

            </div>

            <TableComponent reload={reload}/>
        </div>
    );
}