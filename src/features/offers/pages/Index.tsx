// pages/OfferIndexPage.tsx
import { useEffect, useState } from "react";
import DataTable, { type Column } from "@/shared/components/DataTable";
import type { Offer } from "../types";
import { useNavigate } from "react-router-dom";
import { DeleteOffer, GetOffers } from "../api";
import { GetInventories } from "@/features/inventory/api";
import type { Inventory } from "@/features/inventory/types";

export default function OfferIndexPage() {
  const [offerList, setOfferList] = useState<Offer[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch Offer and inventories
  const loadData = async () => {
    try {
      setLoading(true);
      const [offers, inventories] = await Promise.all([
        GetOffers(),
        GetInventories(),
      ]);
      setOfferList(offers);
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

  const handleDelete = async (row: Offer) => {
    if (!confirm("Are you sure you want to delete this Offer?")) return;
    await DeleteOffer(row.id);
    const updatedOffers = offerList.filter((Offer) => Offer.id !== row.id);
    setOfferList(updatedOffers);
  };

  const handleEdit = (row: Offer) => {
    navigate(`/admin/inventory/${row.id}/edit`);
  };

  // Table columns
  const columns: Column<Offer>[] = [
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
    { header: "title", accessor: "title" },
    { header: "description", accessor: "description" },
    { header: "start_date", accessor: "start_date" },
    { header: "end_date", accessor: "end_date" },
    { header: "is active", accessor: "is_active" },
  ];

  return (
    <div className="py-2">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl ml-2 font-bold">All Offers</h1>
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-black/80 cursor-pointer"
          onClick={() => navigate("/admin/offer/create")}
        >
          Add Offer
        </button>
      </div>

      <DataTable
        data={offerList}
        columns={columns}
        keyField="id"
        onEdit={handleEdit}
        onDelete={handleDelete}
        canEdit={(row) => row.is_active !== true}
        canDelete={(row) => row.is_active !== true}
      />

      {loading && <div className="mt-2 text-gray-500 text-sm">Loading...</div>}
    </div>
  );
}
