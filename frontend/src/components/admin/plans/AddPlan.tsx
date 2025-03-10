import React, { useState } from "react";
import "./addPlan.css"; // Import the custom CSS

interface PlanFormData {
  planName: string;
  planId: string;
  amount: string;
  benefits: string;
  status: string;
}
interface AddPlanFormProps {
  closeModal: () => void;
 // Adjust type based on actual refetch function type
}
const AddPlanForm: React.FC<AddPlanFormProps> = ({ closeModal}) => {
  const [formData, setFormData] = useState<PlanFormData>({
    planName: "PREMIUM",
    planId: "123456",
    amount: "10$",
    benefits: "",
    status: "Active",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
     // Re-fetch data after submission
    closeModal();
    // Add your submission logic here (e.g., API call)
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="form-heading">Add New Plan</h2>

        <form onSubmit={handleSubmit}>
          {/* Plan Name */}
          <div className="form-group">
            <label htmlFor="planName" className="form-label">
              Plan Name
            </label>
            <input
              type="text"
              id="planName"
              name="planName"
              value={formData.planName}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter plan name"
            />
          </div>

          {/* Plan ID */}
          <div className="form-group">
            <label htmlFor="planId" className="form-label">
              Plan ID
            </label>
            <input
              type="text"
              id="planId"
              name="planId"
              value={formData.planId}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter plan ID"
            />
          </div>

          {/* Amount */}
          <div className="form-group">
            <label htmlFor="amount" className="form-label">
              Amount
            </label>
            <input
              type="text"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter amount"
            />
          </div>

          {/* Benefits (Textarea) */}
          <div className="form-group">
            <label htmlFor="benefits" className="form-label">
              Benefits
            </label>
            <textarea
              id="benefits"
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Enter benefits (one per line)"
            />
          </div>

          {/* Status */}
          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Submit Button */}
          <button type="submit" className="form-button">
            Add Plan
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPlanForm;