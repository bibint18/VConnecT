
import React, { useState } from "react";
import { useAddPlan } from "../../../hooks/useAddPlans";
import "./addPlan.css";
import { validatePlanForm } from "../../../utils/validations/PlanValidation";
import { useNavigate } from "react-router-dom";

interface PlanFormData {
  name: string;
  type: string;
  description: string;
  regularAmount: number;
  discountAmount: number;
  benefits: string[];
  isListed: boolean;
  duration: string;
}

const AddPlan: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<PlanFormData>({
    name: "",
    type: "",
    description: "",
    regularAmount: 0,
    discountAmount: 0,
    benefits: [],
    isListed: true,
    duration: "",
  });

  const { mutate, isPending } = useAddPlan();

  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === "isListed" ? value === "true" : value 
    }));
  };

  const handleBenefitsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      benefits: e.target.value.split("\n"),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePlanForm(formData)) return;
    mutate(formData);
    navigate('/plans')
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="form-heading">Add New Plan</h2>
        <form onSubmit={handleSubmit}>
          {/* Name & Type */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter plan name"
              
            />
          </div>

          <div className="form-group">
            <label htmlFor="type" className="form-label">Type</label>
            <input
              type="text"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter plan type"
              
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Enter plan description"
              
            />
          </div>

          {/* Regular Amount & Discount Amount */}
          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="regularAmount" className="form-label">Regular Amount</label>
              <input
                type="number"
                id="regularAmount"
                name="regularAmount"
                value={formData.regularAmount}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter regular amount"
                
              />
            </div>
            <div className="form-group half-width">
              <label htmlFor="discountAmount" className="form-label">Discount Amount</label>
              <input
                type="number"
                id="discountAmount"
                name="discountAmount"
                value={formData.discountAmount}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter discount amount"
                
              />
            </div>
          </div>

          {/* Benefits */}
          <div className="form-group">
            <label htmlFor="benefits" className="form-label">Benefits</label>
            <textarea
              id="benefits"
              name="benefits"
              value={formData.benefits.join("\n")}
              onChange={handleBenefitsChange}
              className="form-textarea"
              placeholder="Enter benefits (one per line)"
            />
          </div>

          {/* Duration & Status */}
          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="duration" className="form-label">Duration</label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter duration"
                
              />
            </div>
            <div className="form-group half-width">
              <label htmlFor="isListed" className="form-label">Status</label>
              <select
                id="isListed"
                name="isListed"
                value={String(formData.isListed)}
                onChange={handleChange}
                className="form-select"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="form-button" 
            disabled={isPending}
          >
            {isPending ? "Adding..." : "Add Plan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPlan;