import TableComponent from '../components/TableComponent';
import AddItemModal from "@/components/AddItemModal";
import AddStockModal from "@/components/AddStockModal";
export default function StockManagement() {
    return (
        <div>
            <div className="flex">
                <h2 className="text-3xl mb-6">Stock management</h2>
                <div className=""></div>
                <AddItemModal />
                <AddStockModal />
            </div>

            <TableComponent/>
        </div>
    );
}