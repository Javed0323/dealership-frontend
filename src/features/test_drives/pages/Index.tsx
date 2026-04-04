// pages/TestDriveIndexPage.tsx
import { useEffect, useState } from "react";
import DataTable, { type Column } from "@/shared/components/DataTable";
import type { TestDrive } from "../types";
import { useNavigate } from "react-router-dom";
import { DeleteTestDrive, GetTestDrives } from "../api";
import type { Inventory } from "@/features/inventory/types";
import { GetInventoriesAdmin } from "@/features/inventory/api";

export default function TestDriveIndexPage() {
  const [TestDriveList, setTestDriveList] = useState<TestDrive[]>([]);
  const [Inventories, setInventories] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch TestDrive and Inventories
  const loadData = async () => {
    try {
      setLoading(true);
      const [TestDrives, Inventories] = await Promise.all([
        GetTestDrives(),
        GetInventoriesAdmin(),
      ]);
      setTestDriveList(TestDrives);
      setInventories(Inventories);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (row: TestDrive) => {
    if (!confirm("Are you sure you want to delete this TestDrive?")) return;
    await DeleteTestDrive(row.id!);
    const updatedTestDrives = TestDriveList.filter(
      (TestDrive) => TestDrive.id !== row.id,
    );
    setTestDriveList(updatedTestDrives);
  };

  const handleEdit = (row: TestDrive) => {
    navigate(`/admin/test_drive/${row.id}/edit`);
  };

  // Table columns
  const columns: Column<TestDrive>[] = [
    {
      header: "Inventory",
      accessor: (row) => {
        const inventory = Inventories.find((c) => c.id === row.inventory_id);
        return inventory
          ? `${inventory.car.make} ${inventory.car.model}`
          : "N/A";
      },
    },
    { header: "Customer", accessor: "full_name" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "status", accessor: "status" },
    { header: "notes", accessor: "notes" },
  ];

  return (
    <div className="py-2">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl ml-2 font-bold">TestDrive</h1>
        <button
          className="bg-black cursor-pointer hover:bg-black/80 text-white px-4 py-2 rounded"
          onClick={() => navigate("/admin/test_drive/create")}
        >
          Add TestDrive
        </button>
      </div>

      <DataTable
        data={TestDriveList}
        columns={columns}
        keyField="id"
        onEdit={handleEdit}
        onDelete={handleDelete}
        canEdit={(row) => row.status !== "completed"}
        canDelete={(row) => row.status !== "completed"}
      />

      {loading && <div className="mt-2 text-gray-500 text-sm">Loading...</div>}
    </div>
  );
}
