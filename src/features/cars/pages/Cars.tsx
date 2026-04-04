// pages/CarIndexPage.tsx
import { useEffect, useState } from "react";
import DataTable, { type Column } from "@/shared/components/DataTable";
import type { CarRead } from "../types";
import { useNavigate } from "react-router-dom";
import { DeleteCar, GetCars } from "../api";

export default function CarIndexPage() {
  const [CarList, setCarList] = useState<CarRead[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch Car and cars
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await GetCars();
      setCarList(res);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (row: CarRead) => {
    if (!confirm("Are you sure you want to delete this Car?")) return;
    await DeleteCar(row.id);
    const updatedInventories = CarList.filter((Car) => Car.id !== row.id);
    setCarList(updatedInventories);
  };

  const handleEdit = (row: CarRead) => {
    navigate(`/admin/car/${row.id}/edit`);
  };

  const handleView = (row: CarRead) => {
    navigate(`/admin/car/${row.id}`);
  };

  // Table columns
  const columns: Column<CarRead>[] = [
    { header: "make", accessor: "make" },
    { header: "model", accessor: "model" },
    { header: "year", accessor: "year" },
    { header: "Category", accessor: "category" },
    { header: "Segment", accessor: "segment" },
    {
      header: "Transmission",
      accessor: (row) => row.engine?.transmission ?? "-",
    },
    {
      header: "Displacement",
      accessor: (row) =>
        row.engine?.displacement_cc ? `${row.engine.displacement_cc} cc` : "-",
    },
  ];

  return (
    <div className="mt-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl ml-4 font-bold">All listings</h1>
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-blend-darken cursor-pointer"
          onClick={() => navigate("/admin/car/create")}
        >
          Add Listing
        </button>
      </div>

      <DataTable
        data={CarList}
        columns={columns}
        keyField="id"
        onEdit={handleEdit}
        onDelete={handleDelete}
        canEdit={(row) => row.make !== "sold"}
        canDelete={(row) => row.make !== "sold"}
        onView={handleView}
        canView={(row) => row.make !== "locked"}
      />

      {loading && <div className="mt-2 text-gray-500 text-sm">Loading...</div>}
    </div>
  );
}
