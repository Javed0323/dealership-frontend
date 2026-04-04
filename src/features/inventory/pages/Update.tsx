import { useNavigate, useParams } from "react-router-dom";
import { UpdateInventory } from "../api";
import InventoryCreate from "../components/InventoryForm";
import type { Inventory } from "../types";

export default function InventoryUpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const handleSave = async (inventory: Inventory) => {
    if (!id) return;
    await UpdateInventory(Number(id), inventory);
    alert("Inventory updated!");
    navigate("/admin/inventory");
    // redirect back to inventory list
  };

  return <InventoryCreate onSave={handleSave} title="Update Inventory" />;
}
