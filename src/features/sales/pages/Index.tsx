// pages/SaleIndexPage.tsx
import { useEffect, useState } from "react";
import DataTable, { type Column } from "@/shared/components/DataTable";
import type { Sale } from "../types";
import { useNavigate } from "react-router-dom";
import { DeleteSale, GetSales } from "../api";
import { GetInventoriesAdmin } from "@/features/inventory/api";
import type { Inventory } from "@/features/inventory/types";

export default function SaleIndexPage() {
  const [SaleList, setSaleList] = useState<Sale[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch Sale and inventories, customers
  const loadData = async () => {
    try {
      setLoading(true);
      const [Sales, inventories] = await Promise.all([
        GetSales(),
        GetInventoriesAdmin(),
      ]);
      setSaleList(Sales);
      setInventories(inventories);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (row: Sale) => {
    if (!confirm("Are you sure you want to delete this Sale?")) return;
    await DeleteSale(Number(row.id));
    const updatedSales = SaleList.filter((Sale) => Sale.id !== row.id);
    setSaleList(updatedSales);
  };

  const handleEdit = async (row: Sale) => {
    navigate(`/admin/sale/${row.id}/edit`);
  };

  // Table columns
  const columns: Column<Sale>[] = [
    {
      header: "Car",
      accessor: (row) => {
        const inventory = inventories.find(
          (i: Inventory) => i.id === row.inventory_id,
        );
        return inventory
          ? `${inventory.car.make} ${inventory.car.model}`
          : "N/A";
      },
    },
    { header: "Customer", accessor: "customer_name" },
    { header: "sale_date", accessor: "sale_date" },
    { header: "sale_price", accessor: "sale_price" },
    { header: "sale_status", accessor: "sale_status" },
    { header: "payment_status", accessor: "payment_status" },
  ];

  return (
    <div className="py-2">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl ml-2 font-bold">All Sales</h1>
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-black/80 cursor-pointer"
          onClick={() => navigate("/admin/sale/create")}
        >
          Add Sale
        </button>
      </div>

      <DataTable
        data={SaleList}
        columns={columns}
        keyField="id"
        onEdit={handleEdit}
        onDelete={handleDelete}
        canEdit={(row) => row.sale_status !== "completed"}
        canDelete={(row) => row.sale_status !== "completed"}
      />

      {loading && <div className="mt-2 text-gray-500 text-sm">Loading...</div>}
    </div>
  );
}
