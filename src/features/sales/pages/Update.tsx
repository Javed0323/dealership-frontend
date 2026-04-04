import { useNavigate, useParams } from "react-router-dom";
import { UpdateSale } from "../api";
import SaleCreate from "../components/SaleForm";
import type { Sale } from "../types";

export default function SaleUpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const handleSave = async (sale: Sale) => {
    if (!id) return;
    await UpdateSale(Number(id), sale);
    alert("Sale updated!");
    navigate("/admin/sale");
    // redirect back to Sale list
  };

  return <SaleCreate onSave={handleSave} title="Update Sale" />;
}
