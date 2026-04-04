// pages/InventoryIndexPage.tsx
import { useEffect, useState } from "react";
import DataTable, { type Column } from "@/shared/components/DataTable";
import type { Inventory } from "../types";
import { useNavigate } from "react-router-dom";
import { DeleteInventory, GetCars, GetInventories } from "../api";
import type { CarBase } from "@/features/cars/types";

export default function InventoryIndexPage() {
  const [inventoryList, setInventoryList] = useState<Inventory[]>([]);
  const [cars, setCars] = useState<CarBase[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch inventory and cars
  const loadData = async () => {
    try {
      setLoading(true);
      const [inventories, cars] = await Promise.all([
        GetInventories(),
        GetCars(),
      ]);
      setInventoryList(inventories);
      setCars(cars);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (row: Inventory) => {
    if (!confirm("Are you sure you want to delete this inventory?")) return;
    await DeleteInventory(row.id);
    const updatedInventories = inventoryList.filter(
      (inventory) => inventory.id !== row.id,
    );
    setInventoryList(updatedInventories);
  };

  const handleEdit = (row: Inventory) => {
    navigate(`/admin/inventory/${row.id}/edit`);
  };

  const handleImage = (row: Inventory) => {
    navigate(`/admin/inventory/${row.id}/media`);
  };

  // Table columns
  const columns: Column<Inventory>[] = [
    {
      header: "Car",
      accessor: (row) => {
        const car = cars.find((c) => c.id === row.car_id);
        return car ? `${car.make} ${car.model}` : "N/A";
      },
    },
    { header: "Selling Price", accessor: "selling_price" },
    { header: "Purchase Price", accessor: "purchase_price" },
    { header: "Exterior Color", accessor: "exterior_color" },
    { header: "Interior Color", accessor: "interior_color" },
    { header: "Status", accessor: "status" },
  ];

  return (
    <div className="py-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl ml-2 font-bold">Inventory</h1>
        <button
          className="bg-black text-white px-4 py-2 rounded cursor-pointer hover:bg-black/80"
          onClick={() => navigate("/admin/inventory/create")}
        >
          Add Inventory
        </button>
      </div>

      <DataTable
        data={inventoryList}
        columns={columns}
        keyField="id"
        onEdit={handleEdit}
        onDelete={handleDelete}
        canEdit={(row) => row.status !== "sold"}
        canDelete={(row) => row.status !== "sold"}
        hasImage={(row) => row.media !== null}
        onImage={handleImage}
      />

      {loading && <div className="mt-2 text-gray-500 text-sm">Loading...</div>}
    </div>
  );
}
