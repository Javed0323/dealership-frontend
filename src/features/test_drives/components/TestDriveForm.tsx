import React, { useEffect } from "react";
import EntityForm, { type FormField } from "@/shared/components/DynamicForm";
import type { TestDrive } from "../types";
import { CreateTestDrive, GetInventories, GetTestDrive } from "../api";
import { useParams } from "react-router-dom";
import type { Inventory } from "@/features/inventory/types";

export default function TestDriveCreate() {
  const [initialValues, setInitialValues] = React.useState<TestDrive | null>(
    null,
  );
  const { id } = useParams();

  const handleSave = async (testDrive: TestDrive) => {
    await CreateTestDrive(testDrive);
    // redirect back to TestDrive list
  };
  const fields: FormField<TestDrive>[] = [
    {
      name: "inventory_id",
      label: "Car",
      type: "select",
      required: true,
      options: [],
    }, // we'll fetch car units
    {
      name: "full_name",
      label: "Full Name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
    },
    {
      name: "phone",
      label: "Phone number",
      type: "text",
      required: true,
    },
    { name: "scheduled_at", label: "scheduled_at", type: "date" },
    {
      name: "status",
      label: "status",
      type: "select",
      options: [
        { label: "pending", value: "pending" },
        { label: "completed", value: "completed" },
        { label: "canceled", value: "canceled" },
      ],
    },
    {
      name: "notes",
      label: "notes",
      type: "text",
    },
  ];

  // Fetch Inventories for the dropdown
  const [inventoryOptions, setInventoryOptions] = React.useState<
    { label: string; value: number }[]
  >([]);

  // fetch inventories for dropdown
  const loadData = async () => {
    const inventories = await GetInventories();

    setInventoryOptions(
      inventories.map((i: Inventory) => ({
        label: `${i.car?.make} ${i.car?.model} (${i.stock_number})`,
        value: i.id,
      })),
    );
  };

  const loadTestDrive = async () => {
    if (!id) return;
    const data = await GetTestDrive(Number(id));
    setInitialValues(data);
  };
  useEffect(() => {
    loadTestDrive();
    loadData();
  }, [id]);

  // Inject options dynamically
  fields.find((f) => f.name === "inventory_id")!.options = inventoryOptions;

  const defaultValues: TestDrive = {
    inventory_id: 0,
    full_name: "",
    email: "",
    phone: "",
    scheduled_at: new Date().toISOString().slice(0, 16), // default to now
    status: "pending",
    notes: "notes",
  };

  return (
    <div className="min-h-screen bg-[#0a0c12] py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-['Syne',sans-serif] text-[32px] font-extrabold text-surface tracking-[-0.02em] leading-[1.1] mb-6 m-0">
          {id ? "Edit TestDrive" : "Create New TestDrive"}
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
