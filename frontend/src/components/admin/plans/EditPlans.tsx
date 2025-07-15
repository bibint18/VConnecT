
import React, { useEffect, useState } from "react";
import { validatePlanForm } from "../../../utils/validations/PlanValidation";
import "./addPlan.css";
import { useGetPlanById } from "../../../hooks/useGetPlanByid";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdatePlan } from "../../../hooks/useUpdatePlan";
interface PlanFormData {
  name: string;
  type: "paid" | "free";
  description: string;
  regularAmount: number;
  discountAmount: number;
  benefits: string[];
  isListed: boolean;
  duration: "1 month" | "3 months" | "6 months" | "9 months" | "12 months";
  roomBenefit: number;
}

const EditPlan: React.FC = () => {
  const navigate = useNavigate()
  const {id} = useParams<{id:string}>()
  const {data:user} = useGetPlanById(id || '')
  const {mutate,isLoading} = useUpdatePlan()
  const [formData, setFormData] = useState<PlanFormData>({
    name: "",
    type: "paid",
    description: "",
    regularAmount: 0,
    discountAmount: 0,
    benefits: [],
    isListed: true,
    duration: "1 month",
    roomBenefit:0,
  });

 useEffect(() => {
  if(user){
    setFormData({
      name: user.name || '',
      type: user.type || 'paid',
      description: user.description || '',
      regularAmount: user.regularAmount || 0,
      discountAmount: user.discountAmount || 0,
      benefits: user.benefits || '',
      isListed: Boolean(user.isListed),
      duration: user.duration || '1 month',
      roomBenefit:user.roomBenefit || 0,
    })
  }
 },[user])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === "isListed" ? value === "true" : name === "roomBenefit" ? Number(value) : value
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
    if(id){
      mutate({id,planData:formData},{
        onSuccess: () => {
          navigate('/plans')
        }
      })
    }
  };
  if (isLoading) return <p>Loading...</p>;
  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="form-heading">Edit Plan</h2>
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
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-select"
            >
              <option value="paid">Paid</option>
              <option value="free">Free</option>
            </select>
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

          <div className="form-group">
            <label htmlFor="roomBenefit" className="form-label">Room Benefit</label>
            <input
              type="number"
              id="roomBenefit"
              name="roomBenefit"
              value={formData.roomBenefit}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter number of extra rooms (0-20)"
              min="0"
              max="20"
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
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="form-select"
              >
                <option value="1 month">1 Month</option>
                <option value="3 months">3 Months</option>
                <option value="6 months">6 Months</option>
                <option value="9 months">9 Months</option>
                <option value="12 months">12 Months</option>
              </select>
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
            disabled={isLoading}
          >
            {isLoading ? "Editing..." : "Edit Plan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPlan;