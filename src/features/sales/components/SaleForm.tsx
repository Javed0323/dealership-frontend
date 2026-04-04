import React, { useEffect } from "react";
import EntityForm, { type FormField } from "@/shared/components/DynamicForm";
import type { Sale } from "../types";
import { CreateSale, GetSale } from "../api";
import { useParams } from "react-router-dom";
import { GetInventories } from "@/features/inventory/api";
import type { Inventory } from "@/features/inventory/types";

export default function SaleCreate() {
  const { id } = useParams();

  const [inventories, setInventories] = React.useState<Inventory[]>([]);
  const [formValues, setFormValues] = React.useState<Sale | null>(null);

  const handleSave = async (sale: Sale) => {
    await CreateSale(sale);
    // redirect back to Sale list
  };

  const defaultValues: Sale = {
    id: 0,
    inventory_id: 0,
    customer_name: "",
    sale_date: 0,
    sale_price: 0,
    sale_status: "draft",
    payment_status: "pending",
  };

  useEffect(() => {
    const loadData = async () => {
      const data = await GetInventories();
      setInventories(data);
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadSale = async () => {
      if (!id) return;
      const data = await GetSale(Number(id));
      setFormValues(data);
    };
    loadSale();
  }, [id]);

  // When inventory_id changes in the form, auto-fill sale_price
  const handleFieldChange = (name: keyof Sale, value: unknown) => {
    if (name !== "inventory_id") return;

    const matched = inventories.find((i) => i.id === Number(value));
    if (!matched) return;

    setFormValues((prev) => ({
      ...(prev ?? defaultValues),
      inventory_id: matched.id,
      sale_price: matched.selling_price, // <-- auto-fill
    }));
  };

  const fields: FormField<Sale>[] = [
    {
      name: "inventory_id",
      label: "Car",
      type: "select",
      required: true,
      options: inventories.map((i) => ({
        label: `${i.car.make} ${i.car.model} (${i.stock_number})`,
        value: i.id,
      })),
    },
    {
      name: "customer_name",
      label: "Customer",
      type: "text",
      required: true,
    },
    { name: "sale_date", label: "Sale Date", type: "date" },
    {
      name: "sale_price",
      label: "Sale Price",
      type: "number",
    },
    {
      name: "sale_status",
      label: "Sale Status",
      type: "select",
      required: true,
      options: [
        { label: "Draft", value: "draft" },
        { label: "Completed", value: "completed" },
        { label: "Canceled", value: "canceled" },
      ],
    },
    {
      name: "payment_status",
      label: "Payment Status",
      type: "select",
      required: true,
      options: [
        { label: "Pending", value: "pending" },
        { label: "Overdue", value: "overdue" },
        { label: "Paid", value: "paid" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0c12] py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-['Syne',sans-serif] text-[32px] font-extrabold text-surface tracking-[-0.02em] leading-[1.1] mb-6 m-0">
          {id ? "Edit Sale" : "Create New Sale"}
        </h1>
        <EntityForm
          fields={fields}
          initialValues={formValues ?? defaultValues}
          mode={id ? "edit" : "create"}
          onSubmit={handleSave}
          onFieldChange={handleFieldChange}
        />
      </div>
    </div>
  );
}
