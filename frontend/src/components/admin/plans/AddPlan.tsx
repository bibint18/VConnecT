// import React, { useState } from "react";
// import "./addPlan.css"; // Import the custom CSS

// interface PlanFormData {
//   planName: string;
//   planId: string;
//   amount: string;
//   benefits: string;
//   status: string;
// }

// const AddPlan: React.FC = () => {
//   const [formData, setFormData] = useState<PlanFormData>({
//     planName: "PREMIUM",
//     planId: "123456",
//     amount: "10$",
//     benefits: "",
//     status: "Active",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Form Submitted:", formData);
//      // Re-fetch data after submission

//     // Add your submission logic here (e.g., API call)
//   };

//   return (
//     <div className="form-container">
//       <div className="form-card">
//         <h2 className="form-heading">Add New Plan</h2>

//         <form onSubmit={handleSubmit}>
//           {/* Plan Name */}
//           <div className="form-group">
//             <label htmlFor="planName" className="form-label">
//               Plan Name
//             </label>
//             <input
//               type="text"
//               id="planName"
//               name="planName"
//               value={formData.planName}
//               onChange={handleChange}
//               className="form-input"
//               placeholder="Enter plan name"
//             />
//           </div>

//           {/* Plan ID */}
//           <div className="form-group">
//             <label htmlFor="planId" className="form-label">
//               Plan ID
//             </label>
//             <input
//               type="text"
//               id="planId"
//               name="planId"
//               value={formData.planId}
//               onChange={handleChange}
//               className="form-input"
//               placeholder="Enter plan ID"
//             />
//           </div>

//           {/* Amount */}
//           <div className="form-group">
//             <label htmlFor="amount" className="form-label">
//               Amount
//             </label>
//             <input
//               type="text"
//               id="amount"
//               name="amount"
//               value={formData.amount}
//               onChange={handleChange}
//               className="form-input"
//               placeholder="Enter amount"
//             />
//           </div>

//           {/* Benefits (Textarea) */}
//           <div className="form-group">
//             <label htmlFor="benefits" className="form-label">
//               Benefits
//             </label>
//             <textarea
//               id="benefits"
//               name="benefits"
//               value={formData.benefits}
//               onChange={handleChange}
//               className="form-textarea"
//               placeholder="Enter benefits (one per line)"
//             />
//           </div>

//           {/* Status */}
//           <div className="form-group">
//             <label htmlFor="status" className="form-label">
//               Status
//             </label>
//             <select
//               id="status"
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//               className="form-select"
//             >
//               <option value="Active">Active</option>
//               <option value="Inactive">Inactive</option>
//             </select>
//           </div>

//           {/* Submit Button */}
//           <button type="submit" className="form-button">
//             Add Plan
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddPlan;





// src/components/AddPlan.tsx
// import React, { useState } from "react";
// import { useAddPlan } from "../../../hooks/useAddPlans";
// import "./addPlan.css"; // Import styles

// interface PlanFormData {
//   name: string;
//   type: string;
//   description: string;
//   regularAmount: number;
//   discountAmount: number;
//   benefits: string[];
//   isListed: boolean;
//   duration: string;
// }

// const AddPlan: React.FC = () => {
//   const [formData, setFormData] = useState<PlanFormData>({
//     name: "",
//     type: "",
//     description: "",
//     regularAmount: 0,
//     discountAmount: 0,
//     benefits: [],
//     isListed: true,
//     duration: "",
//   });

//   const { mutate, isPending} = useAddPlan();

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleBenefitsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setFormData((prev) => ({
//       ...prev,
//       benefits: e.target.value.split("\n"), // Convert textarea to an array
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     mutate(formData);
//   };

//   return (
//     <div className="form-container">
//       <div className="form-card">
//         <h2 className="form-heading">Add New Plan</h2>
//         <form onSubmit={handleSubmit}>
//           {/* Name & Type */}
//           <div className="form-row">
//             <div className="form-group">
//               <label>Name</label>
//               <input type="text" name="name" value={formData.name} onChange={handleChange} required />
//             </div>
//             <div className="form-group">
//               <label>Type</label>
//               <input type="text" name="type" value={formData.type} onChange={handleChange} required />
//             </div>
//           </div>

//           {/* Description */}
//           <div className="form-group">
//             <label>Description</label>
//             <textarea name="description" value={formData.description} onChange={handleChange} required />
//           </div>

//           {/* Regular Amount & Discount Amount */}
//           <div className="form-row">
//             <div className="form-group">
//               <label>Regular Amount</label>
//               <input type="number" name="regularAmount" value={formData.regularAmount} onChange={handleChange} required />
//             </div>
//             <div className="form-group">
//               <label>Discount Amount</label>
//               <input type="number" name="discountAmount" value={formData.discountAmount} onChange={handleChange} required />
//             </div>
//           </div>

//           {/* Benefits */}
//           <div className="form-group">
//             <label>Benefits</label>
//             <textarea name="benefits" value={formData.benefits.join("\n")} onChange={handleBenefitsChange} />
//           </div>

//           {/* Duration & Listing */}
//           <div className="form-row">
//             <div className="form-group">
//               <label>Duration</label>
//               <input type="text" name="duration" value={formData.duration} onChange={handleChange} required />
//             </div>
//             <div className="form-group">
//               <label>Status</label>
//               <select name="isListed" value={String(formData.isListed)} onChange={handleChange}>
//                 <option value="true">Active</option>
//                 <option value="false">Inactive</option>
//               </select>
//             </div>
//           </div>

//           <button type="submit" disabled={isPending}>Add Plan</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddPlan;









// src/components/AddPlan.tsx
import React, { useState } from "react";
import { useAddPlan } from "../../../hooks/useAddPlans";
import "./addPlan.css";
import { validatePlanForm } from "../../../utils/validations/PlanValidation";

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