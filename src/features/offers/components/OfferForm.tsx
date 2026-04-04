import React, { useEffect } from "react";
import EntityForm, { type FormField } from "@/shared/components/DynamicForm";
import type { Offer } from "../types";
import { CreateOffer, GetOffer } from "../api";
import { useParams } from "react-router-dom";
import { GetInventories } from "@/features/inventory/api";
import type { Inventory } from "@/features/inventory/types";

export default function OfferCreate() {
  const [initialValues, setInitialValues] = React.useState<Offer | null>(null);
  const { id } = useParams();

  const handleSave = async (offer: Offer) => {
    await CreateOffer(offer);
    // redirect back to Offer list
  };
  const fields: FormField<Offer>[] = [
    {
      name: "inventory_id",
      label: "Car",
      type: "select",
      required: true,
      options: [],
    }, // we'll fetch cars
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "description", type: "text" },
    {
      name: "discount_percentage",
      label: "discount_percentage",
      type: "number",
      required: true,
    },
    {
      name: "start_date",
      label: "start_date",
      type: "date",
      required: true,
    },
    {
      name: "end_date",
      label: "end_date",
      type: "date",
      required: true,
    },
    {
      name: "is_active",
      label: "is active",
      type: "checkbox",
    },
  ];

  // Fetch cars for the dropdown
  const [carOptions, setCarOptions] = React.useState<
    { label: string; value: number }[]
  >([]);
  const loadInventories = async () => {
    const data = await GetInventories();
    setCarOptions(
      data.map((inventory: Inventory) => ({
        label:
          inventory.car.make +
          " " +
          inventory.car.model +
          " (" +
          inventory.stock_number +
          ")",
        value: inventory.id,
      })),
    );
  };

  const loadOffer = async () => {
    if (!id) return;
    const data = await GetOffer(Number(id));
    setInitialValues(data);
  };
  useEffect(() => {
    loadOffer();
    loadInventories();
  }, [id]);

  // Inject options dynamically
  fields.find((f) => f.name === "inventory_id")!.options = carOptions;

  const defaultValues: Offer = {
    id: 0,
    inventory_id: 0,
    title: "title",
    description: "description",
    discount_percentage: 0,
    start_date: "",
    end_date: "",
    is_active: false,
  };

  return (
    <div className="min-h-screen bg-[#0a0c12] py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-['Syne',sans-serif] text-[32px] font-extrabold text-surface tracking-[-0.02em] leading-[1.1] mb-6 m-0">
          {id ? "Edit Offer" : "Create New Offer"}
        </h1>
        <EntityForm
          fields={fields}
          initialValues={initialValues ?? defaultValues}
          mode={id ? "edit" : "create"}
          onSubmit={handleSave}
        />
      </div>
    </div>
  );
}
