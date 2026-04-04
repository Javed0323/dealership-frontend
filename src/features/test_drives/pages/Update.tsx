import { useNavigate, useParams } from "react-router-dom";
import { UpdateTestDrive } from "../api";
import TestDriveCreate from "../components/TestDriveForm";
import type { TestDrive } from "../types";

export default function TestDriveUpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const handleSave = async (testDrive: TestDrive) => {
    if (!id) return;
    await UpdateTestDrive(Number(id), testDrive);
    alert("TestDrive updated!");
    navigate("/admin/test_drive");
    // redirect back to TestDrive list
  };

  return <TestDriveCreate onSave={handleSave} title="Update TestDrive" />;
}
