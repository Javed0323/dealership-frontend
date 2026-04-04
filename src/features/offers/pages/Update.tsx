import { useNavigate, useParams } from "react-router-dom";
import { UpdateOffer } from "../api";
import OfferCreate from "../components/OfferForm";
import type { Offer } from "../types";

export default function OfferUpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const handleSave = async (offer: Offer) => {
    if (!id) return;
    await UpdateOffer(Number(id), offer);
    alert("Offer updated!");
    navigate("/admin/offer");
    // redirect back to Offer list
  };

  return <OfferCreate onSave={handleSave} title="Update Offer" />;
}
